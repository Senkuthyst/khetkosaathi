// Year-Over-Year Rainfall Comparison Helper using existing NASA POWER Service
// Compares this year's observation window against the exact same calendar window last year.

import {
  buildNasaPowerUrl,
  normalizeNasaPowerResponse,
  NASA_POWER_PARAMETERS,
} from "./nasa-power-service";
import { calculateDailyETo } from "./water-balance";

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

/**
 * Fetch historical 14-day window water balance values (Rainfall minus ET0)
 * across the past 15 years to construct empirical climatological distribution.
 */
export async function fetchHistoricalWindowNetClimatology(options: {
  latitude: number;
  longitude: number;
  fieldId?: string;
  currentStart: Date;
  currentEnd: Date;
  elevationM?: number;
  maxYears?: number; // default 15
}): Promise<number[]> {
  const {
    latitude,
    longitude,
    fieldId = "plot-1",
    currentStart,
    currentEnd,
    elevationM = 100,
    maxYears = 15,
  } = options;

  const toCompact = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  const retrievalTimestamp = new Date().toISOString();

  const fetchYearNet = async (yearsAgo: number): Promise<number | null> => {
    try {
      const start = new Date(currentStart);
      start.setUTCFullYear(start.getUTCFullYear() - yearsAgo);
      const end = new Date(currentEnd);
      end.setUTCFullYear(end.getUTCFullYear() - yearsAgo);

      const url = buildNasaPowerUrl({
        latitude,
        longitude,
        startDate: toCompact(start),
        endDate: toCompact(end),
        parameters: NASA_POWER_PARAMETERS,
        community: "AG",
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeout);

      if (!res || !res.ok) return null;
      const json = await res.json().catch(() => null);
      if (!json) return null;

      const norm = normalizeNasaPowerResponse(json, {
        fieldId,
        latitude,
        longitude,
        retrievalTimestamp,
      });
      if (!norm || norm.observations.length === 0) return null;

      let yearTotalRain = 0;
      let yearTotalET0 = 0;
      let validDays = 0;

      for (const obs of norm.observations) {
        const et0 = calculateDailyETo({
          latitude,
          date: obs.date,
          tMax: obs.t2mMax,
          tMin: obs.t2mMin,
          rhMean: obs.rh2m,
          solarRadiationMj: obs.allskySfcSwDwn,
          windSpeed2mMps: obs.ws2m,
          elevationM,
        });

        if (obs.prectotcorr !== null && et0 !== null) {
          yearTotalRain += obs.prectotcorr;
          yearTotalET0 += et0;
          validDays++;
        }
      }

      if (validDays < 5) return null;
      return Math.round((yearTotalRain - yearTotalET0) * 10) / 10;
    } catch {
      return null;
    }
  };

  const tasks: Promise<number | null>[] = [];
  for (let y = 1; y <= maxYears; y++) {
    tasks.push(fetchYearNet(y));
  }

  const results = await Promise.allSettled(tasks);
  const netValues: number[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value !== null) {
      netValues.push(r.value);
    }
  }

  return netValues;
}
