// Type definitions for Earth Observation data contracts in KHETKOSAATHI
// Compliant with NASA Earth Observation standards & Field Observation Schema

export type EarthObservationSource =
  | "nasa_power"
  | "nasa_smap"
  | "nasa_gpm"
  | "nasa_modis"
  | "station_in_situ";

export type EarthQualityStatus = "good" | "marginal" | "missing" | "pilotQuality";

export type SpatialExtractionMethod =
  | "point_nearest_grid"
  | "polygon_centroid"
  | "polygon_areal_mean"
  | "in_situ_station";

export interface EarthProvenance {
  dataset: string;
  productId: string;
  source: EarthObservationSource;
  resolution: string;
  temporalResolution: "hourly" | "daily" | "pentad" | "8-day" | "16-day" | "monthly";
  spatialExtractionMethod: SpatialExtractionMethod;
  processingVersion: string;
  observedAt: string | null; // ISO 8601 or YYYY-MM-DD
  periodStart?: string;
  retrievedAt: string | null;
  quality: EarthQualityStatus;
  qualityFlags?: string[];
  mode: "live" | "cached" | "pilot";
  url: string;
}

/**
 * Standardized Earth Observation record
 * Maps to the earth_observations database table or live typed payload.
 */
export interface EarthObservationRecord {
  id?: string;
  fieldId: string;
  sourceName: EarthObservationSource;
  productId: string;
  productVersion: string;
  variableName: string; // e.g. T2M, T2M_MAX, T2M_MIN, RH2M, PRECTOTCORR, ALLSKY_SFC_SW_DWN
  value: number | null;
  unit: string;
  observationStart: string; // ISO 8601 or YYYY-MM-DD
  observationEnd: string; // ISO 8601 or YYYY-MM-DD
  retrievalTimestamp: string; // ISO 8601
  spatialResolution: string;
  temporalResolution: "daily" | "hourly" | "16-day";
  spatialExtractionMethod: SpatialExtractionMethod;
  qualityStatus: EarthQualityStatus;
  qualityFlags: string[];
  validSpatialCoverage?: string;
  processingVersion: string;
  provenanceMetadata: Record<string, unknown>;
}

/**
 * Ingestion Run / Source Metadata
 */
export interface EarthIngestionRun {
  id: string;
  sourceName: EarthObservationSource;
  fieldId: string;
  status: "success" | "partial" | "failed";
  recordsIngested: number;
  retrievedAt: string;
  parameters: string[];
  dateRange: { start: string; end: string };
  errorMessage?: string;
}

/**
 * Daily agricultural parameter set for NASA POWER Daily Point API
 */
export interface NasaPowerDailySet {
  date: string; // YYYY-MM-DD
  t2m: number | null; // Temperature at 2 Meters (°C)
  t2mMax: number | null; // Maximum Temperature (°C)
  t2mMin: number | null; // Minimum Temperature (°C)
  rh2m: number | null; // Relative Humidity at 2 Meters (%)
  prectotcorr: number | null; // Corrected Total Precipitation (mm/day)
  allskySfcSwDwn: number | null; // All Sky Surface Shortwave Downward Irradiance (MJ/m²/day)
  qualityStatus: EarthQualityStatus;
}

export interface NasaPowerObservationResult {
  fieldId: string;
  coordinates: { latitude: number; longitude: number };
  observations: NasaPowerDailySet[];
  provenance: EarthProvenance;
  records: EarthObservationRecord[];
}
