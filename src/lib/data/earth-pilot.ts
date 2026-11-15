import type { PowerData, Provenance } from "./earth-types";

// Illustrative Chitwan records, NOT satellite downloads or validated climatology.
const pilot = { retrievedAt: null, mode: "pilot", quality: "pilotQuality" } as const;
export const modisPilot = {
  provenance: {
    ...pilot,
    dataset: "NASA MODIS",
    productId: "MOD13Q1 V061",
    source: "modis",
    resolution: "250 m",
    periodStart: "2026-10-16",
    observedAt: "2026-10-31",
    url: "https://lpdaac.usgs.gov/products/mod13q1v061/",
  } satisfies Provenance,
  composites: [
    {
      start: "2026-09-14",
      end: "2026-09-29",
      ndvi: 0.68,
      evi: 0.45,
      baselineLow: 0.6,
      baselineHigh: 0.75,
    },
    {
      start: "2026-09-30",
      end: "2026-10-15",
      ndvi: 0.59,
      evi: 0.39,
      baselineLow: 0.55,
      baselineHigh: 0.7,
    },
    {
      start: "2026-10-16",
      end: "2026-10-31",
      ndvi: 0.43,
      evi: 0.28,
      baselineLow: 0.5,
      baselineHigh: 0.65,
    },
  ],
};

export const imergPilot = {
  provenance: {
    ...pilot,
    dataset: "NASA GPM IMERG",
    productId: "GPM_3IMERGDF V07",
    source: "gpm",
    resolution: "0.1° (~10 km)",
    periodStart: "2026-10-30",
    observedAt: "2026-11-05",
    url: "https://gpm.nasa.gov/data/imerg",
  } satisfies Provenance,
  daily: [2.1, 0.4, 0, 0, 1.2, 0, 0.6],
  seasonalBaselineMm: 12,
};

export const smapPilot = {
  provenance: {
    ...pilot,
    dataset: "NASA SMAP",
    productId: "SPL3SMP V009",
    source: "smap",
    resolution: "36 km",
    observedAt: "2026-11-03",
    url: "https://nsidc.org/data/spl3smp/versions/9",
  } satisfies Provenance,
  surfaceVolumetric: 0.21,
  depthCm: 5,
  farmVolumetric: 0.248,
  farmDepthCm: 15,
  farmDate: "2026-11-05T00:03:00Z",
};

export const powerPilot: PowerData = {
  provenance: {
    ...pilot,
    dataset: "NASA POWER",
    productId: "POWER daily / AG",
    source: "nasa_power",
    resolution: "0.5° × 0.625° / 1° solar",
    periodStart: "2026-10-30",
    observedAt: "2026-11-05",
    url: "https://power.larc.nasa.gov/",
  },
  days: [
    { date: "2026-10-30", tMax: 29.1, tMin: 18.1, rain: 2.1, humidity: 75, solar: 16.3 },
    { date: "2026-10-31", tMax: 29.3, tMin: 18.2, rain: 0.4, humidity: 72, solar: 17.1 },
    { date: "2026-11-01", tMax: 30.0, tMin: 18.0, rain: 0, humidity: 70, solar: 18.2 },
    { date: "2026-11-02", tMax: 29.7, tMin: 17.8, rain: 0, humidity: 69, solar: 18.4 },
    { date: "2026-11-03", tMax: 29.6, tMin: 17.7, rain: 1.2, humidity: 73, solar: 16.9 },
    { date: "2026-11-04", tMax: 29.5, tMin: 17.6, rain: 0, humidity: 71, solar: 17.8 },
    { date: "2026-11-05", tMax: 29.3, tMin: 17.5, rain: 0.6, humidity: 74, solar: 17.2 },
  ],
};
export const pilotSeasonalMaxTemp = 28;

export function rainfallAnomaly(total: number | null, baseline: number): number | null {
  return total === null || baseline <= 0 ? null : ((total - baseline) / baseline) * 100;
}

export type RiskLevel = "low" | "moderate" | "high" | "critical" | "missing";
// Demonstration rule: count three pilot signals. No calibrated agricultural risk model.
export function pilotRisk(
  ndviBelow: boolean | null,
  rainAnomaly: number | null,
  tempAnomaly: number | null,
): RiskLevel {
  if (ndviBelow === null || rainAnomaly === null || tempAnomaly === null) return "missing";
  const count = Number(ndviBelow) + Number(rainAnomaly <= -30) + Number(tempAnomaly >= 2);
  return (["low", "moderate", "high", "critical"] as const)[count] ?? "missing";
}
