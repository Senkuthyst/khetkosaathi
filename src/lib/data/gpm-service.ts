// NASA Global Precipitation Measurement (GPM) IMERG V07B Integration
// Product details:
// - Product: GPM IMERG Daily Final (GPM_3IMERGDF V07B) & Early/Late runs (Near-Real-Time)
// - Spatial Resolution: 0.1° × 0.1° (~10 km)
// - Temporal Resolution: Daily accumulation (mm/day) or half-hourly precipitation rate (mm/hr)
// - Standard Units:
//   precipitationCal: mm/hr (calibrated rate) or mm/day (daily accumulation)
//   randomError: mm/hr

import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type {
  EarthObservationRecord,
  EarthProvenance,
  EarthQualityStatus,
} from "./earth-observation-contract";

export interface GpmDailyPoint {
  date: string; // YYYY-MM-DD
  precipitationMm: number | null; // Daily accumulation in mm
  randomErrorMm: number | null;
  productType: "Final" | "Late" | "Early";
  qualityStatus: EarthQualityStatus;
}

export interface GpmPrecipitationSummary {
  fieldId: string;
  latitude: number;
  longitude: number;
  productVersion: "V07B";
  productType: "Final" | "Late" | "Early";
  spatialResolution: "0.1° (~10 km)";
  dailyPoints: GpmDailyPoint[];
  totalAccumulation7DayMm: number | null;
  totalAccumulation30DayMm: number | null;
  seasonalBaselineMm: number;
  rainfallAnomalyPct: number | null;
  provenance: EarthProvenance;
  records: EarthObservationRecord[];
}

export function calculateRainfallAnomaly(
  accumulatedMm: number | null,
  baselineMm: number,
): number | null {
  if (accumulatedMm == null || baselineMm <= 0) return null;
  return Math.round(((accumulatedMm - baselineMm) / baselineMm) * 1000) / 10;
}

/**
 * Normalizes GPM IMERG V07B daily observations into standardized Earth Observation records.
 */
export function normalizeGpmImergObservations(options: {
  fieldId: string;
  latitude: number;
  longitude: number;
  productType?: "Final" | "Late" | "Early";
  seasonalBaselineMm?: number;
  samples: Array<{
    date: string; // YYYY-MM-DD
    precipitationMm: number | null;
    randomErrorMm?: number | null;
  }>;
  retrievalTimestamp?: string;
}): GpmPrecipitationSummary {
  const {
    fieldId,
    latitude,
    longitude,
    productType = "Final",
    seasonalBaselineMm = 12.0,
    samples,
    retrievalTimestamp = new Date().toISOString(),
  } = options;

  const dailyPoints: GpmDailyPoint[] = [];
  const records: EarthObservationRecord[] = [];

  for (const s of samples) {
    let qualityStatus: EarthQualityStatus = "good";
    if (s.precipitationMm === null || s.precipitationMm < 0 || s.precipitationMm > 1500) {
      qualityStatus = "missing";
    }

    dailyPoints.push({
      date: s.date,
      precipitationMm:
        qualityStatus === "missing" ? null : Math.round(s.precipitationMm! * 10) / 10,
      randomErrorMm: s.randomErrorMm != null ? Math.round(s.randomErrorMm * 10) / 10 : null,
      productType,
      qualityStatus,
    });

    records.push({
      fieldId,
      sourceName: "nasa_gpm",
      productId: `GPM_3IMERGDF_${productType.toUpperCase()}`,
      productVersion: "V07B",
      variableName: "PRECTOT_GPM",
      value: qualityStatus === "missing" ? null : s.precipitationMm,
      unit: "mm/day",
      observationStart: `${s.date}T00:00:00Z`,
      observationEnd: `${s.date}T23:59:59Z`,
      retrievalTimestamp,
      spatialResolution: "0.1° (~10 km)",
      temporalResolution: "daily",
      spatialExtractionMethod: "point_nearest_grid",
      qualityStatus,
      qualityFlags: [productType, `Error: ${s.randomErrorMm ?? "N/A"}`],
      validSpatialCoverage: "Global (-60° to 60° Latitude)",
      processingVersion: "IMERG V07B Final Run",
      provenanceMetadata: {
        productType,
        latitude,
        longitude,
      },
    });
  }

  const validPoints = dailyPoints.filter((p) => p.precipitationMm !== null);
  const total7Day =
    validPoints.length >= 7
      ? validPoints.slice(-7).reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0)
      : null;
  const total30Day =
    validPoints.length >= 30
      ? validPoints.slice(-30).reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0)
      : validPoints.length > 0
        ? validPoints.reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0)
        : null;

  const rainfallAnomalyPct = calculateRainfallAnomaly(total7Day, seasonalBaselineMm);

  const provenance: EarthProvenance = {
    dataset: `NASA GPM IMERG Daily Precipitation (${productType} Run V07B)`,
    productId: `GPM_3IMERGDF_${productType.toUpperCase()}`,
    source: "nasa_gpm",
    resolution: "0.1° (~10 km)",
    temporalResolution: "daily",
    spatialExtractionMethod: "point_nearest_grid",
    processingVersion: "GPM IMERG V07B",
    observedAt: dailyPoints.at(-1)?.date ?? null,
    periodStart: dailyPoints[0]?.date,
    retrievedAt: retrievalTimestamp,
    quality: validPoints.length === dailyPoints.length ? "good" : "marginal",
    mode: "live",
    url: "https://gpm.nasa.gov/data/imerg",
  };

  return {
    fieldId,
    latitude,
    longitude,
    productVersion: "V07B",
    productType,
    spatialResolution: "0.1° (~10 km)",
    dailyPoints,
    totalAccumulation7DayMm: total7Day !== null ? Math.round(total7Day * 10) / 10 : null,
    totalAccumulation30DayMm: total30Day !== null ? Math.round(total30Day * 10) / 10 : null,
    seasonalBaselineMm,
    rainfallAnomalyPct,
    provenance,
    records,
  };
}
