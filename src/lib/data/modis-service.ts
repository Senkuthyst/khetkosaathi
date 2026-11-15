// NASA MODIS MOD13Q1 Version 061 (Terra MODIS 250m 16-day Composite)
// Product specification:
// - Spatial Resolution: 250 meters
// - Temporal Resolution: 16-day composite
// - Variables: 250m_16_days_NDVI, 250m_16_days_EVI, 250m_16_days_VI_Quality (SummaryQA & DetailedQA)
// - Scale Factor: 0.0001 (Valid Range: -2000 to 10000 -> -0.2 to 1.0)
// - Fill Value: -3000

import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type {
  EarthObservationRecord,
  EarthProvenance,
  EarthQualityStatus,
} from "./earth-observation-contract";

export const MODIS_SCALE_FACTOR = 0.0001;
export const MODIS_FILL_VALUE = -3000;

export interface ModisQualitySummary {
  rawQA: number;
  qualityLevel: "good" | "marginal" | "snow_ice" | "cloudy" | "estimated";
  modlandQA: "good_quality" | "check_other_qa" | "not_produced_cloud" | "not_produced_other";
  viUsefulness: number; // 0 (highest) to 15 (lowest)
  cloudState: "clear" | "significant_clouds" | "mixed" | "shadow";
}

/**
 * Decode 16-bit MOD13Q1 VI Quality flag
 * Bits 0-1: MODLAND QA
 * Bits 2-5: VI usefulness
 * Bits 6-7: Aerosol quantity
 * Bits 8: Adjacent cloud detected
 * Bits 9: Atmosphere BRDF correction performed
 * Bits 10: Mixed clouds
 * Bits 11-13: Land/Water mask
 * Bits 14: Possible snow/ice
 * Bits 15: Possible shadow
 */
export function decodeModisVIQuality(qa: number): ModisQualitySummary {
  if (qa == null || !Number.isFinite(qa) || qa < 0) {
    return {
      rawQA: -1,
      qualityLevel: "cloudy",
      modlandQA: "not_produced_cloud",
      viUsefulness: 15,
      cloudState: "significant_clouds",
    };
  }

  const modlandBits = qa & 0b11;
  const usefulnessBits = (qa >> 2) & 0b1111;
  const mixedClouds = (qa >> 10) & 0b1;
  const snowIce = (qa >> 14) & 0b1;
  const shadow = (qa >> 15) & 0b1;

  let modlandQA: ModisQualitySummary["modlandQA"] = "good_quality";
  if (modlandBits === 1) modlandQA = "check_other_qa";
  else if (modlandBits === 2) modlandQA = "not_produced_cloud";
  else if (modlandBits === 3) modlandQA = "not_produced_other";

  let cloudState: ModisQualitySummary["cloudState"] = "clear";
  if (mixedClouds === 1) cloudState = "mixed";
  if (modlandBits === 2) cloudState = "significant_clouds";
  if (shadow === 1) cloudState = "shadow";

  let qualityLevel: ModisQualitySummary["qualityLevel"] = "good";
  if (snowIce === 1) qualityLevel = "snow_ice";
  else if (modlandBits >= 2 || cloudState === "significant_clouds") qualityLevel = "cloudy";
  else if (modlandBits === 1 || usefulnessBits > 4) qualityLevel = "marginal";

  return {
    rawQA: qa,
    qualityLevel,
    modlandQA,
    viUsefulness: usefulnessBits,
    cloudState,
  };
}

export interface ModisCompositeObservation {
  compositeStart: string; // YYYY-MM-DD
  compositeEnd: string; // YYYY-MM-DD
  ndvi: number | null;
  evi: number | null;
  quality: ModisQualitySummary;
  rawNdvi: number;
  rawEvi: number;
  validPixelCount?: number;
  totalPixelCount?: number;
  validCoveragePct?: number; // % of field area covered by valid pixels
}

export interface ModisFieldSummary {
  fieldId: string;
  fieldAreaM2: number;
  compositeObservations: ModisCompositeObservation[];
  latestNdvi: number | null;
  latestEvi: number | null;
  isFieldTooSmallForModis: boolean; // Flagged if area < 62,500 m² (1 pixel)
  spatialResolution: "250 m";
  provenance: EarthProvenance;
  records: EarthObservationRecord[];
}

/**
 * Normalizes raw MODIS MOD13Q1 observations, applying the official 0.0001 scale factor,
 * rejecting fill values, evaluating pixel quality, and formatting standard observation records.
 */
export function normalizeModisObservations(options: {
  fieldId: string;
  fieldAreaM2?: number;
  latitude: number;
  longitude: number;
  rawSamples: Array<{
    date: string; // YYYY-MM-DD
    ndviRaw: number;
    eviRaw: number;
    qaRaw: number;
    validPixels?: number;
    totalPixels?: number;
  }>;
  retrievalTimestamp?: string;
}): ModisFieldSummary {
  const {
    fieldId,
    fieldAreaM2 = 4046, // default ~1 acre if unknown
    latitude,
    longitude,
    rawSamples,
    retrievalTimestamp = new Date().toISOString(),
  } = options;

  // 1 MODIS pixel = 250m x 250m = 62,500 m² (~6.25 hectares)
  const isFieldTooSmallForModis = fieldAreaM2 < 62500;

  const composites: ModisCompositeObservation[] = [];
  const records: EarthObservationRecord[] = [];

  for (const sample of rawSamples) {
    const qa = decodeModisVIQuality(sample.qaRaw);

    const parseIndex = (rawVal: number): number | null => {
      if (rawVal === MODIS_FILL_VALUE || rawVal < -2000 || rawVal > 10000) return null;
      if (qa.qualityLevel === "cloudy" || qa.qualityLevel === "snow_ice") return null;
      return Math.round(rawVal * MODIS_SCALE_FACTOR * 10000) / 10000;
    };

    const ndvi = parseIndex(sample.ndviRaw);
    const evi = parseIndex(sample.eviRaw);

    // Calculate composite end (16-day window)
    const startDate = new Date(sample.date);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 15);
    const endStr = endDate.toISOString().slice(0, 10);

    const totalPix = sample.totalPixels ?? 1;
    const validPix = sample.validPixels ?? (ndvi !== null ? 1 : 0);
    const validCoveragePct = totalPix > 0 ? Math.round((validPix / totalPix) * 100) : 0;

    composites.push({
      compositeStart: sample.date,
      compositeEnd: endStr,
      ndvi,
      evi,
      quality: qa,
      rawNdvi: sample.ndviRaw,
      rawEvi: sample.eviRaw,
      validPixelCount: validPix,
      totalPixelCount: totalPix,
      validCoveragePct,
    });

    const qualityStatus: EarthQualityStatus =
      ndvi === null ? "missing" : qa.qualityLevel === "good" ? "good" : "marginal";

    // Standard Observation Record for NDVI
    records.push({
      fieldId,
      sourceName: "nasa_modis",
      productId: "MOD13Q1",
      productVersion: "061",
      variableName: "NDVI",
      value: ndvi,
      unit: "unitless (-0.2 to 1.0)",
      observationStart: `${sample.date}T00:00:00Z`,
      observationEnd: `${endStr}T23:59:59Z`,
      retrievalTimestamp,
      spatialResolution: "250 m",
      temporalResolution: "16-day" as any,
      spatialExtractionMethod: "polygon_centroid",
      qualityStatus,
      qualityFlags: [qa.qualityLevel, qa.cloudState],
      validSpatialCoverage: isFieldTooSmallForModis
        ? "Sub-pixel Field (Area < 250m Grid)"
        : "Adequate Grid Coverage",
      processingVersion: "MODIS Collection 6.1",
      provenanceMetadata: {
        rawQA: sample.qaRaw,
        viUsefulness: qa.viUsefulness,
        scaleFactor: MODIS_SCALE_FACTOR,
        latitude,
        longitude,
        fieldAreaM2,
        validCoveragePct,
      },
    });

    // Standard Observation Record for EVI
    records.push({
      fieldId,
      sourceName: "nasa_modis",
      productId: "MOD13Q1",
      productVersion: "061",
      variableName: "EVI",
      value: evi,
      unit: "unitless (-0.2 to 1.0)",
      observationStart: `${sample.date}T00:00:00Z`,
      observationEnd: `${endStr}T23:59:59Z`,
      retrievalTimestamp,
      spatialResolution: "250 m",
      temporalResolution: "16-day" as any,
      spatialExtractionMethod: "polygon_centroid",
      qualityStatus,
      qualityFlags: [qa.qualityLevel, qa.cloudState],
      validSpatialCoverage: isFieldTooSmallForModis
        ? "Sub-pixel Field (Area < 250m Grid)"
        : "Adequate Grid Coverage",
      processingVersion: "MODIS Collection 6.1",
      provenanceMetadata: {
        rawQA: sample.qaRaw,
        viUsefulness: qa.viUsefulness,
        scaleFactor: MODIS_SCALE_FACTOR,
        latitude,
        longitude,
        fieldAreaM2,
        validCoveragePct,
      },
    });
  }

  const latestValid = composites.filter((c) => c.ndvi !== null).at(-1);

  const provenance: EarthProvenance = {
    dataset: "NASA MODIS MOD13Q1 V061 (Vegetation Indices 16-Day L3 Global 250m)",
    productId: "MOD13Q1.061",
    source: "nasa_modis",
    resolution: "250 m",
    temporalResolution: "16-day" as any,
    spatialExtractionMethod: "polygon_centroid",
    processingVersion: "Collection 6.1 Tier 1",
    observedAt: composites.at(-1)?.compositeEnd ?? null,
    periodStart: composites[0]?.compositeStart,
    retrievedAt: retrievalTimestamp,
    quality: latestValid?.quality.qualityLevel === "good" ? "good" : "marginal",
    mode: "live",
    url: "https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1",
  };

  return {
    fieldId,
    fieldAreaM2,
    compositeObservations: composites,
    latestNdvi: latestValid?.ndvi ?? null,
    latestEvi: latestValid?.evi ?? null,
    isFieldTooSmallForModis,
    spatialResolution: "250 m",
    provenance,
    records,
  };
}
