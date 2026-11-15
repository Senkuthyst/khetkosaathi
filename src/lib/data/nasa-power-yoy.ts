// Year-Over-Year Rainfall Comparison Helper using existing NASA POWER Service
// Compares this year's observation window against the exact same calendar window last year.

import { buildNasaPowerUrl, normalizeNasaPowerResponse, NASA_POWER_PARAMETERS } from "./nasa-power-service";

export interface YearOverYearRainfallResult {
  latitude: number;
  longitude: number;
  fieldId: string;
  currentYearStart: string; // YYYY-MM-DD
  currentYearEnd: string;
  lastYearStart: string;
  lastYearEnd: string;
  currentYearTotalMm: number;
  lastYearTotalMm: number;
  deltaMm: number;
  deltaPct: number | null; // % increase or decrease
  retrievalTimestamp: string;
  dailyComparison: Array<{
    dayIndex: number;
    currentDate: string;
    currentRainMm: number | null;
    lastDate: string;
    lastRainMm: number | null;
  }>;
}

/**
 * Compare rainfall for a recent N-day window this year vs the same window last year
 */
export async function fetchPowerRainfallYearOverYear(options: {
  latitude: number;
  longitude: number;
  fieldId?: string;
  windowDays?: number; // default 7 days
}): Promise<YearOverYearRainfallResult> {
  const { latitude, longitude, fieldId = "plot-1", windowDays = 7 } = options;
  const retrievalTimestamp = new Date().toISOString();

  // Reference date: 5 days ago to respect NASA POWER MERRA-2 processing latency
  const currentEnd = new Date();
  currentEnd.setUTCDate(currentEnd.getUTCDate() - 5);
  const currentStart = new Date(currentEnd);
  currentStart.setUTCDate(currentStart.getUTCDate() - (windowDays - 1));

  // Same calendar window last year
  const lastEnd = new Date(currentEnd);
  lastEnd.setUTCFullYear(lastEnd.getUTCFullYear() - 1);
  const lastStart = new Date(currentStart);
  lastStart.setUTCFullYear(lastStart.getUTCFullYear() - 1);

  const toCompact = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  const toIso = (d: Date) => d.toISOString().slice(0, 10);

  const [currUrl, lastUrl] = [
    buildNasaPowerUrl({
      latitude,
      longitude,
      startDate: toCompact(currentStart),
      endDate: toCompact(currentEnd),
      parameters: ["PRECTOTCORR"],
      community: "AG",
    }),
    buildNasaPowerUrl({
      latitude,
      longitude,
      startDate: toCompact(lastStart),
      endDate: toCompact(lastEnd),
      parameters: ["PRECTOTCORR"],
      community: "AG",
    }),
  ];

  const [currRes, lastRes] = await Promise.all([
    fetch(currUrl).then((r) => (r.ok ? r.json() : null)),
    fetch(lastUrl).then((r) => (r.ok ? r.json() : null)),
  ]);

  const currNorm = currRes
    ? normalizeNasaPowerResponse(currRes, { fieldId, latitude, longitude, retrievalTimestamp })
    : null;
  const lastNorm = lastRes
    ? normalizeNasaPowerResponse(lastRes, { fieldId, latitude, longitude, retrievalTimestamp })
    : null;

  const currDays = currNorm?.observations || [];
  const lastDays = lastNorm?.observations || [];

  const currTotal = currDays.reduce((acc, d) => acc + (d.prectotcorr ?? 0), 0);
  const lastTotal = lastDays.reduce((acc, d) => acc + (d.prectotcorr ?? 0), 0);

  const deltaMm = Math.round((currTotal - lastTotal) * 100) / 100;
  const deltaPct =
    lastTotal > 0 ? Math.round(((currTotal - lastTotal) / lastTotal) * 1000) / 10 : null;

  const dailyComparison = currDays.map((curr, idx) => ({
    dayIndex: idx + 1,
    currentDate: curr.date,
    currentRainMm: curr.prectotcorr,
    lastDate: lastDays[idx]?.date || "",
    lastRainMm: lastDays[idx]?.prectotcorr ?? null,
  }));

  return {
    latitude,
    longitude,
    fieldId,
    currentYearStart: toIso(currentStart),
    currentYearEnd: toIso(currentEnd),
    lastYearStart: toIso(lastStart),
    lastYearEnd: toIso(lastEnd),
    currentYearTotalMm: Math.round(currTotal * 100) / 100,
    lastYearTotalMm: Math.round(lastTotal * 100) / 100,
    deltaMm,
    deltaPct,
    retrievalTimestamp,
    dailyComparison,
  };
}
