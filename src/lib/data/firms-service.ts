// NASA FIRMS (Fire Information for Resource Management System) Integration
// Official API: https://firms.modaps.eosdis.nasa.gov/api/
// Data Sources: VIIRS (S-NPP, NOAA-20, NOAA-21 - 375m) & MODIS (Aqua/Terra - 1km)
// Note: Displays thermal anomalies and active fire alerts. Clearly communicates that a
// thermal anomaly is not definitive proof of agricultural fire or crop destruction.

import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type { EarthProvenance } from "./earth-observation-contract";

export interface FirmsFireDetection {
  latitude: number;
  longitude: number;
  brightness: number; // Brightness temperature (Kelvin)
  scan: number;
  track: number;
  acqDate: string; // YYYY-MM-DD
  acqTime: string; // HHMM in UTC
  satellite: "Terra" | "Aqua" | "Suomi-NPP" | "NOAA-20" | "NOAA-21";
  instrument: "MODIS" | "VIIRS";
  confidence: "low" | "nominal" | "high" | string;
  version: string;
  brightT31?: number; // Channel 31 brightness temp
  frp?: number; // Fire Radiative Power (MW)
  daynight: "D" | "N";
}

export interface FirmsSummary {
  region: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  detections: FirmsFireDetection[];
  totalDetections: number;
  highConfidenceCount: number;
  provenance: EarthProvenance;
  disclaimer: string;
}

export const FIRMS_DISCLAIMER =
  "Notice: Satellite thermal anomalies represent high-temperature surface hotspots detected by MODIS or VIIRS sensors. They do not constitute verified wildfire or agricultural burn damage without field inspection.";

/**
 * Parses raw CSV output from NASA FIRMS Area API
 */
export function parseFirmsCsv(csvText: string): FirmsFireDetection[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const detections: FirmsFireDetection[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.trim());
    if (row.length < headers.length) continue;

    const getCol = (name: string) => {
      const idx = headers.indexOf(name);
      return idx >= 0 ? row[idx] : undefined;
    };

    const lat = parseFloat(getCol("latitude") || "0");
    const lon = parseFloat(getCol("longitude") || "0");
    const brightness = parseFloat(getCol("bright_ti4") || getCol("brightness") || "0");
    const frp = parseFloat(getCol("frp") || "0");

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    detections.push({
      latitude: Math.round(lat * 10000) / 10000,
      longitude: Math.round(lon * 10000) / 10000,
      brightness,
      scan: parseFloat(getCol("scan") || "1"),
      track: parseFloat(getCol("track") || "1"),
      acqDate: getCol("acq_date") || new Date().toISOString().slice(0, 10),
      acqTime: getCol("acq_time") || "0000",
      satellite: (getCol("satellite") as any) || "Suomi-NPP",
      instrument: (getCol("instrument") as any) || "VIIRS",
      confidence: getCol("confidence") || "nominal",
      version: getCol("version") || "2.0NRT",
      frp,
      daynight: (getCol("daynight") as any) || "D",
    });
  }

  return detections;
}
