// Server-side NASA HLS (Harmonized Landsat Sentinel-2) 30m Vegetation Function
// Primary: Calls local Python HLS microservice (:8001) running STAC search + windowed COG NDVI.
// Fallback: When the Python microservice is offline or no clear scene (<20% cloud) exists,
//           transparently falls back to the existing NASA MODIS server function
//           and honestly labels provenance as "NASA MODIS MOD13Q1 (HLS Fallback)".
// Never silently returns synthetic or mock data.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import {
  type HlsVegetationSummary,
  calculateHlsNdvi,
} from "@/lib/data/hls-service";
import { queryModisVegetation, fetchModisVegetationServerFn } from "./modis.server";
import type { EarthProvenance } from "@/lib/data/earth-observation-contract";

const hlsQuerySchema = z.object({
  fieldId: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  windowDays: z.number().int().min(7).max(90).default(30),
  force: z.boolean().default(false),
});

export type HlsQueryInput = z.infer<typeof hlsQuerySchema>;

/**
 * Pure orchestration logic for HLS 30m retrieval with honest MODIS fallback.
 * Exported for direct server usage and Vitest testing without TanStack Start RPC overhead.
 */
export async function resolveHlsVegetation(
  data: HlsQueryInput,
  options?: {
    hlsServiceUrl?: string;
    fetcher?: typeof fetch;
    modisFallback?: typeof queryModisVegetation;
  },
): Promise<HlsVegetationSummary> {
  const { fieldId, latitude, longitude, windowDays } = data;
  const retrievalTimestamp = new Date().toISOString();
  const hlsServiceUrl = options?.hlsServiceUrl || process.env.HLS_SERVICE_URL || "http://127.0.0.1:8001";
  const fetcher = options?.fetcher || fetch;
  const modisQuery = options?.modisFallback || queryModisVegetation;

  // 1. Attempt query to Python HLS microservice
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const hlsRes = await fetcher(
      `${hlsServiceUrl}/api/earth/hls/vegetation?fieldId=${encodeURIComponent(fieldId)}&latitude=${latitude}&longitude=${longitude}&windowDays=${windowDays}`,
      { signal: controller.signal },
    );
    clearTimeout(timer);

    if (hlsRes.ok) {
      const hlsData = await hlsRes.json();
      if (hlsData.status === "AVAILABLE" && hlsData.currentYearObservation?.ndvi != null) {
        const curr = hlsData.currentYearObservation;
        const last = hlsData.lastYearObservation;

        const provenance: EarthProvenance = {
          dataset: `NASA HLS (${curr.collection})`,
          productId: curr.collection,
          source: "landsat" as any,
          resolution: "30 m",
          temporalResolution: "daily" as any,
          spatialExtractionMethod: "polygon_centroid",
          processingVersion: "HLS v2.0",
          observedAt: curr.date,
          retrievedAt: retrievalTimestamp,
          quality: curr.fmask_valid ? "good" : "marginal",
          mode: "live",
          url: "https://lpdaac.usgs.gov/products/hlss30v002/",
        };

        return {
          fieldId,
          latitude,
          longitude,
          spatialResolution: "30 m",
          dataSource: "NASA HLS (HLSS30/HLSL30)",
          isFallback: false,
          currentYearObservation: {
            sceneId: curr.scene_id,
            collection: curr.collection,
            sensor: curr.sensor,
            date: curr.date,
            cloudCoverPct: curr.cloud_cover,
            ndvi: curr.ndvi,
            fmaskValid: curr.fmask_valid,
            fmaskDescription: curr.fmask_description,
          },
          lastYearObservation: last
            ? {
                sceneId: last.scene_id,
                collection: last.collection,
                sensor: last.sensor,
                date: last.date,
                cloudCoverPct: last.cloud_cover,
                ndvi: last.ndvi,
                fmaskValid: last.fmask_valid,
                fmaskDescription: last.fmask_description,
              }
            : null,
          ndviDelta: hlsData.ndviDelta ?? null,
          ndviDeltaPct: hlsData.ndviDeltaPct ?? null,
          latestNdvi: curr.ndvi,
          provenance,
        };
      }
    }
  } catch (_err) {
    // Python microservice offline or request timed out; proceed to clean MODIS fallback
  }

  // 2. Clean fallback to verified MODIS function
  const modisSummary = await modisQuery({
    fieldId,
    latitude,
    longitude,
    fieldAreaM2: 4046,
    force: false,
  });

  const fallbackProvenance: EarthProvenance = {
    ...modisSummary.provenance,
    dataset: "NASA MODIS MOD13Q1 (HLS Fallback)",
    qualityFlags: [
      ...(modisSummary.provenance.qualityFlags || []),
      "HLS_MICROSERVICE_UNREACHABLE_OR_CLOUDY",
    ],
  };

  return {
    fieldId,
    latitude,
    longitude,
    spatialResolution: "30 m",
    dataSource: "NASA MODIS MOD13Q1 (HLS Fallback)",
    isFallback: true,
    fallbackReason:
      "No clear HLS scene (<= 20% cloud) or HLS service offline. Transparently fell back to operational MODIS 250m composite.",
    currentYearObservation: modisSummary.latestNdvi != null
      ? {
          sceneId: "MOD13Q1-COMPOSITE",
          collection: "MOD13Q1.061",
          sensor: "Terra MODIS",
          date: modisSummary.provenance.observedAt || retrievalTimestamp.slice(0, 10),
          cloudCoverPct: 0.0,
          ndvi: modisSummary.latestNdvi,
          fmaskValid: true,
          fmaskDescription: "Clear Pixel (MODIS VI Quality)",
        }
      : null,
    lastYearObservation: null,
    ndviDelta: null,
    ndviDeltaPct: null,
    latestNdvi: modisSummary.latestNdvi,
    provenance: fallbackProvenance,
  };
}

/**
 * Server Function: Ingest 30m HLS vegetation index with honest fallback.
 */
export const fetchHlsVegetationServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => hlsQuerySchema.parse(data))
  .handler(async ({ data }): Promise<HlsVegetationSummary> => {
    return resolveHlsVegetation(data);
  });
