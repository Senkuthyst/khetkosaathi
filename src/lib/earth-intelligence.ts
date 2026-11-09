// Rules-based Earth Intelligence anomaly engine (pure, testable). Demonstration rules, not a calibrated model.
import { imergPilot, modisPilot, powerPilot, pilotSeasonalMaxTemp, type CropId, type PowerDay } from "./data";

export type EarthRisk = "low" | "moderate" | "high" | "critical" | "missing";

/** Typical season length (days from planting to harvest) for Chitwan pilot crops. */
export const seasonDays: Record<CropId, number> = { rice: 120, maize: 110, wheat: 130, potato: 100, tomato: 120 };
/** From this share of the season onward, NDVI decline is expected maturation/senescence. */
export const MATURITY_SHARE = 0.8;

export const rainfallAnomalyPct = (current: number, normal: number) => normal > 0 ? ((current - normal) / normal) * 100 : null;
export const vegetationAnomaly = (current: number, normal: number) => current - normal;
export const temperatureAnomaly = (current: number, normal: number) => current - normal;

export interface EarthInputs {
  rainCurrent: number | null; rainNormal: number;
  ndviCurrent: number | null; ndviNormal: number;
  tempCurrent: number | null; tempNormal: number;
  crop: CropId; cropAgeDays: number;
}
export interface EarthSignal { id: "rain" | "veg" | "temp"; value: number | null; active: boolean; suppressed?: boolean }
export interface EarthAssessment { risk: EarthRisk; signals: EarthSignal[]; maturing: boolean }

export const RAIN_DRY_PCT = -30;
export const VEG_DROP = -0.05;
export const TEMP_HOT = 2;

export function assessEarth(i: EarthInputs): EarthAssessment {
  const rain = i.rainCurrent === null ? null : rainfallAnomalyPct(i.rainCurrent, i.rainNormal);
  const veg = i.ndviCurrent === null ? null : vegetationAnomaly(i.ndviCurrent, i.ndviNormal);
  const temp = i.tempCurrent === null ? null : temperatureAnomaly(i.tempCurrent, i.tempNormal);
  const maturing = i.cropAgeDays >= seasonDays[i.crop] * MATURITY_SHARE;
  const signals: EarthSignal[] = [
    { id: "rain", value: rain, active: rain !== null && rain <= RAIN_DRY_PCT },
    { id: "veg", value: veg, active: !maturing && veg !== null && veg <= VEG_DROP, suppressed: maturing && veg !== null && veg <= VEG_DROP },
    { id: "temp", value: temp, active: temp !== null && temp >= TEMP_HOT },
  ];
  if (signals.some(s => s.value === null)) return { risk: "missing", signals, maturing };
  const n = signals.filter(s => s.active).length;
  return { risk: (["low", "moderate", "high", "critical"] as const)[n] ?? "critical", signals, maturing };
}

/** Assessment from the Chitwan pilot records; optional live POWER days replace pilot temperature. */
export function chitwanAssessment(crop: CropId, cropAgeDays: number, powerDays: PowerDay[] = powerPilot.days) {
  const latest = modisPilot.composites.at(-1)!;
  const maxes = powerDays.map(d => d.tMax).filter((v): v is number => v !== null);
  return {
    latest,
    rainTotal: imergPilot.daily.reduce((a, b) => a + b, 0),
    meanMax: maxes.length ? maxes.reduce((a, b) => a + b, 0) / maxes.length : null,
    ...assessEarth({
      rainCurrent: imergPilot.daily.reduce((a, b) => a + b, 0), rainNormal: imergPilot.seasonalBaselineMm,
      ndviCurrent: latest.ndvi, ndviNormal: (latest.baselineLow + latest.baselineHigh) / 2,
      tempCurrent: maxes.length ? maxes.reduce((a, b) => a + b, 0) / maxes.length : null, tempNormal: pilotSeasonalMaxTemp,
      crop, cropAgeDays,
    }),
  };
}
