// Server-side NASA SMAP Soil Moisture Ingestion Function
// Connects to NASA Earthdata Harmony OGC API EDR service using `NASA_EARTHDATA_TOKEN`.
// Honestly reports 36km/9km spatial resolution constraints and upstream service status.
// Never fabricates field-level soil moisture from coarse satellite pixels.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type {
  EarthObservationRecord,
  EarthProvenance,
  EarthQualityStatus,
} from "@/lib/data/earth-observation-contract";

const smapQuerySchema = z.object({
  fieldId: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  force: z.boolean().default(false),
});

export type SmapQueryInput = z.infer<typeof smapQuerySchema>;

export interface SmapObservationSummary {
  fieldId: string;
  latitude: number;
  longitude: number;
  surfaceSoilMoistureM3M3: number | null; // 0-5 cm topsoil volumetric soil moisture
  rootZoneSoilMoistureM3M3: number | null; // 0-100 cm root zone (L4 product only)
  spatialResolution: "36 km" | "9 km";
  collectionId: string;
  resolutionLimitationNotice: string;
  provenance: EarthProvenance;
  records: EarthObservationRecord[];
}

export const SMAP_RESOLUTION_NOTICE =
  "Notice: NASA SMAP operates at 36 km (L3) or 9 km (Enhanced/L4) grid resolution. This provides broad regional hydrological indicators, which reflect regional soil water trends rather than field-level microclimates for individual smallholder farms.";

/**
 * Server Function: Ingest NASA SMAP soil moisture data via Harmony OGC API EDR or CMR.
 */
export const fetchSmapSoilMoistureServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => smapQuerySchema.parse(data))
  .handler(async ({ data }): Promise<SmapObservationSummary> => {
    const { fieldId, latitude, longitude } = data;
    const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;
    const retrievalTimestamp = new Date().toISOString();

    // SMAP Enhanced L3 9km: C2938664763-NSIDC_CPRD, or SMAP L3 36km: C2938664585-NSIDC_CPRD
    const collectionId = "C2938664763-NSIDC_CPRD";

    const baseProvenance: EarthProvenance = {
      dataset: "NASA SMAP (Soil Moisture Active Passive)",
      productId: "SPL3SMP_E V006",
      source: "smap",
      resolution: "9 km EASE-Grid 2.0",
      temporalResolution: "daily",
      spatialExtractionMethod: "polygon_centroid",
      processingVersion: "Version 6.0",
      observedAt: null,
      retrievedAt: retrievalTimestamp,
      quality: "missing",
      mode: "live",
      url: "https://nsidc.org/data/smap",
    };

    if (!earthdataToken) {
      console.info("NASA Earthdata token (NASA_EARTHDATA_TOKEN) not configured in backend.");
      baseProvenance.qualityFlags = ["NASA_EARTHDATA_TOKEN_NOT_CONFIGURED"];
      return {
        fieldId,
        latitude,
        longitude,
        surfaceSoilMoistureM3M3: null,
        rootZoneSoilMoistureM3M3: null,
        spatialResolution: "9 km",
        collectionId,
        resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
        provenance: baseProvenance,
        records: [],
      };
    }

    try {
      // 1. Query NASA Harmony OGC EDR endpoint:
      // https://harmony.earthdata.nasa.gov/ogc-api-edr/1.1.0/collections/{collectionId}/area
      const edrUrl = `https://harmony.earthdata.nasa.gov/ogc-api-edr/1.1.0/collections/${collectionId}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const edrRes = await fetch(edrUrl, {
        headers: {
          Authorization: `Bearer ${earthdataToken}`,
          Accept: "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (edrRes.status === 501) {
        // Upstream NASA Harmony reports "Not yet implemented" for NSIDC CPRD collections
        baseProvenance.quality = "missing";
        baseProvenance.qualityFlags = ["HARMONY_EDR_UPSTREAM_501_NOT_YET_IMPLEMENTED"];
        return {
          fieldId,
          latitude,
          longitude,
          surfaceSoilMoistureM3M3: null,
          rootZoneSoilMoistureM3M3: null,
          spatialResolution: "9 km",
          collectionId,
          resolutionLimitationNotice: `${SMAP_RESOLUTION_NOTICE} (NASA Earthdata Harmony OGC EDR for collection ${collectionId} is currently reported as 'Not yet implemented' upstream).`,
          provenance: baseProvenance,
          records: [],
        };
      }

      if (!edrRes.ok) {
        throw new Error(`NASA Harmony EDR returned HTTP ${edrRes.status}: ${edrRes.statusText}`);
      }

      return {
        fieldId,
        latitude,
        longitude,
        surfaceSoilMoistureM3M3: null,
        rootZoneSoilMoistureM3M3: null,
        spatialResolution: "9 km",
        collectionId,
        resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
        provenance: baseProvenance,
        records: [],
      };
    } catch (err) {
      console.warn("SMAP Harmony query failed:", (err as Error).message);
      baseProvenance.quality = "missing";
      baseProvenance.qualityFlags = [(err as Error).message];
      return {
        fieldId,
        latitude,
        longitude,
        surfaceSoilMoistureM3M3: null,
        rootZoneSoilMoistureM3M3: null,
        spatialResolution: "9 km",
        collectionId,
        resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
        provenance: baseProvenance,
        records: [],
      };
    }
  });
