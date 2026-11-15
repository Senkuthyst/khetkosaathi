// NASA Harmonized Landsat Sentinel-2 (HLS) Vegetation & NDVI Types and Pure Helpers
// Spatial resolution: 30 meters
// Collections:
//   HLSS30.v2.0 (Sentinel-2 MSI): NIR = B08, Red = B04
//   HLSL30.v2.0 (Landsat-8/9 OLI): NIR = B05, Red = B04
// Fmask Quality layer filtering: Cloud (bit 1), Shadow (bit 2), Snow (bit 4), Water (bit 5)

import type { EarthProvenance, EarthQualityStatus } from "./earth-observation-contract";

export const HLS_SCALE_FACTOR = 0.0001;

export interface HlsSceneRecord {
  sceneId: string;
  collection: "HLSS30_2.0" | "HLSL30_2.0" | string;
  sensor: "Sentinel-2" | "Landsat-8/9";
  date: string; // YYYY-MM-DD
  cloudCoverPct: number;
  ndvi: number | null;
  fmaskValid: boolean;
  fmaskDescription: string;
}

export interface HlsVegetationSummary {
  fieldId: string;
  latitude: number;
  longitude: number;
  spatialResolution: "30 m";
  dataSource: "NASA HLS (HLSS30/HLSL30)" | "NASA MODIS MOD13Q1 (HLS Fallback)";
  isFallback: boolean;
  fallbackReason?: string;
  currentYearObservation: HlsSceneRecord | null;
  lastYearObservation: HlsSceneRecord | null;
  ndviDelta: number | null;
  ndviDeltaPct: number | null;
  latestNdvi: number | null;
  provenance: EarthProvenance;
}

/**
 * Decode 8-bit HLS Fmask QA bitmask
 * Returns: { isValidLand: boolean, description: string }
 */
export function decodeHlsFmask(fmask: number): { isValidLand: boolean; description: string } {
  if (!Number.isFinite(fmask) || fmask < 0 || fmask === 255) {
    return { isValidLand: false, description: "Fill / Invalid" };
  }

  const isCloud = Boolean(fmask & 0b00000010);
  const isShadow = Boolean(fmask & 0b00000100);
  const isSnow = Boolean(fmask & 0b00010000);
  const isWater = Boolean(fmask & 0b00100000);

  if (isCloud) return { isValidLand: false, description: "Cloud Masked" };
  if (isShadow) return { isValidLand: false, description: "Cloud Shadow Masked" };
  if (isSnow) return { isValidLand: false, description: "Snow / Ice Masked" };
  if (isWater) return { isValidLand: false, description: "Water Body" };

  return { isValidLand: true, description: "Clear Land" };
}

/**
 * Pure calculation of NDVI from reflectance with Fmask quality gate
 */
export function calculateHlsNdvi(
  nirReflectance: number,
  redReflectance: number,
  fmask = 0,
): { ndvi: number | null; isValid: boolean; description: string } {
  const fmaskResult = decodeHlsFmask(fmask);
  if (!fmaskResult.isValidLand) {
    return { ndvi: null, isValid: false, description: fmaskResult.description };
  }

  const denom = nirReflectance + redReflectance;
  if (denom <= 0) {
    return { ndvi: null, isValid: false, description: "Zero or Negative Reflectance" };
  }

  const val = (nirReflectance - redReflectance) / denom;
  if (!Number.isFinite(val) || val < -1.0 || val > 1.0) {
    return { ndvi: null, isValid: false, description: "Out of Range NDVI" };
  }

  return {
    ndvi: Math.round(val * 10000) / 10000,
    isValid: true,
    description: "Clear Land",
  };
}
