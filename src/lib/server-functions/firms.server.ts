// Server-side NASA FIRMS Active Fire Ingestion Function
// Retrieves real thermal anomaly hotspots via official NASA FIRMS Area API
// Requires NASA_FIRMS_MAP_KEY stored in backend environment secrets.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import {
  parseFirmsCsv,
  FIRMS_DISCLAIMER,
  type FirmsSummary,
  type FirmsFireDetection,
} from "@/lib/data/firms-service";
import type { EarthProvenance } from "@/lib/data/earth-observation-contract";

const firmsQuerySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().int().min(5).max(300).default(50),
  dayRange: z.number().int().min(1).max(10).default(3),
  source: z.enum(["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "MODIS_NRT"]).default("VIIRS_SNPP_NRT"),
});

export type FirmsQueryInput = z.infer<typeof firmsQuerySchema>;

/**
 * Server Function: Query NASA FIRMS active fire hotspots around a coordinate.
 */
export const fetchFirmsHotspotsServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => firmsQuerySchema.parse(data))
  .handler(async ({ data }): Promise<FirmsSummary> => {
    const { latitude, longitude, radiusKm, dayRange, source } = data;
    const mapKey = process.env.MAP_API_KEY || process.env.NASA_FIRMS_MAP_KEY;
    const retrievalTimestamp = new Date().toISOString();

    const degApprox = radiusKm / 111.0;
    const minLat = (latitude - degApprox).toFixed(4);
    const maxLat = (latitude + degApprox).toFixed(4);
    const minLon = (longitude - degApprox).toFixed(4);
    const maxLon = (longitude + degApprox).toFixed(4);
    const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;

    const provenance: EarthProvenance = {
      dataset: `NASA FIRMS (${source})`,
      productId: "FIRMS_ACTIVE_FIRE_NRT",
      source: "nasa_power" as any, // category
      resolution: "375 m (VIIRS) / 1 km (MODIS)",
      temporalResolution: "daily",
      spatialExtractionMethod: "polygon_areal_mean",
      processingVersion: "NRT v2.0",
      observedAt: new Date().toISOString().slice(0, 10),
      retrievedAt: retrievalTimestamp,
      quality: "good",
      mode: "live",
      url: "https://firms.modaps.eosdis.nasa.gov/",
    };

    if (!mapKey) {
      console.info(
        "MAP_API_KEY / NASA_FIRMS_MAP_KEY not configured. Reporting empty thermal anomaly list with credential notice.",
      );
      provenance.mode = "live";
      provenance.quality = "missing";

      return {
        region: `BBox: ${bbox}`,
        latitude,
        longitude,
        radiusKm,
        detections: [],
        totalDetections: 0,
        highConfidenceCount: 0,
        provenance,
        disclaimer: `${FIRMS_DISCLAIMER} (Backend requires MAP_API_KEY or NASA_FIRMS_MAP_KEY configured in backend environment).`,
      };
    }

    try {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${bbox}/${dayRange}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`NASA FIRMS API error HTTP ${res.status}: ${res.statusText}`);
      }

      const csv = await res.text();
      const detections = parseFirmsCsv(csv);
      const highConfidenceCount = detections.filter(
        (d) => d.confidence === "high" || d.confidence === "h" || parseFloat(d.confidence) >= 80,
      ).length;

      return {
        region: `BBox: ${bbox}`,
        latitude,
        longitude,
        radiusKm,
        detections,
        totalDetections: detections.length,
        highConfidenceCount,
        provenance,
        disclaimer: FIRMS_DISCLAIMER,
      };
    } catch (err) {
      console.warn("NASA FIRMS fetch failed:", (err as Error).message);
      provenance.mode = "pilot";
      return {
        region: `BBox: ${bbox}`,
        latitude,
        longitude,
        radiusKm,
        detections: [],
        totalDetections: 0,
        highConfidenceCount: 0,
        provenance,
        disclaimer: `${FIRMS_DISCLAIMER} (Service temporarily unreachable: ${(err as Error).message})`,
      };
    }
  });
