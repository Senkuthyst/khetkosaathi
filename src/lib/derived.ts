import { DEMO_NOW, getStationDaily, getVegSeries, sensorHealth, stationCurrent } from "./data";
import { evaluateAlerts } from "./alerts";
import type { Thresholds } from "./store";

export function summary() {
  const daily = getStationDaily(14);
  const last7 = daily.slice(-7);
  const rain7 = last7.reduce((s, d) => s + (d.rain ?? 0), 0);
  const veg = getVegSeries();
  const lastVeg = [...veg].reverse().find((v) => v.ndvi !== null) ?? null;
  const vegBelow = lastVeg?.ndvi != null && lastVeg.ndvi < lastVeg.baseLow;
  const tMaxRecent = Math.max(...last7.map((d) => d.tMax ?? -99));
  return { daily, last7, rain7: Math.round(rain7 * 10) / 10, veg, lastVeg, vegBelow, tMaxRecent };
}

export function currentAlerts(th: Thresholds) {
  const s = summary();
  return evaluateAlerts(
    {
      rain7: s.rain7,
      soilNow: stationCurrent.soil,
      tMaxRecent: s.tMaxRecent,
      battery: sensorHealth.battery,
      vegBelowBaseline: s.vegBelow,
      gapHours: sensorHealth.gaps[0]?.hours ?? 0,
      now: stationCurrent.observedAt,
      satDate: s.lastVeg?.date ?? "",
    },
    th,
  );
}

export const cropAgeDays = (planting: string) =>
  Math.max(0, Math.round((DEMO_NOW.getTime() - new Date(planting).getTime()) / 86400000));
