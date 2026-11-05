// Rules-based alert engine (pure, testable).
import type { Thresholds } from "./store";
import type { TKey } from "./i18n";
import type { Source } from "./data";

export interface Alert {
  id: string;
  key: TKey;
  severity: "high" | "medium" | "low";
  source: Source;
  time: string;
}

export interface AlertInputs {
  rain7: number;
  soilNow: number;
  tMaxRecent: number;
  battery: number;
  vegBelowBaseline: boolean;
  gapHours: number;
  now: string;
  satDate: string;
}

export function evaluateAlerts(i: AlertInputs, th: Thresholds): Alert[] {
  const out: Alert[] = [];
  if (i.soilNow < th.minSoil) out.push({ id: "soil", key: "a_soil", severity: i.soilNow < th.minSoil - 5 ? "high" : "medium", source: "station", time: i.now });
  if (i.rain7 < th.minRain7) out.push({ id: "rain", key: "a_rain", severity: "medium", source: "station", time: i.now });
  if (i.tMaxRecent > th.maxTemp) out.push({ id: "temp", key: "a_temp", severity: "medium", source: "station", time: i.now });
  if (i.vegBelowBaseline) out.push({ id: "veg", key: "a_veg", severity: "medium", source: "landsat", time: i.satDate });
  if (i.gapHours >= 6) out.push({ id: "gap", key: "a_gap", severity: "low", source: "station", time: i.now });
  if (i.battery < th.minBattery) out.push({ id: "batt", key: "a_batt", severity: "low", source: "station", time: i.now });
  const rank = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
