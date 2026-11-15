// Server-side NASA MODIS MOD13Q1 Vegetation Ingestion Module
// Primary: ORNL DAAC MODIS Web Service (public, no auth required for point queries)
//   https://modis.ornl.gov/rst/api/v1/{product}/subset
// Fallback: NASA CMR granule discovery with provenance-only mode
// Never silently substitutes Chitwan pilot values.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import {
  normalizeModisObservations,
  MODIS_SCALE_FACTOR,
  MODIS_FILL_VALUE,
  decodeModisVIQuality,
  type ModisFieldSummary,
} from "@/lib/data/modis-service";

const modisQuerySchema = z.object({
  fieldId: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fieldAreaM2: z.number().positive().optional().default(4046),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  force: z.boolean().default(false),
});

export type ModisQueryInput = z.infer<typeof modisQuerySchema>;

/** Convert a YYYY-MM-DD date to MODIS Julian format AYYYYDDD */
function toModisDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const year = d.getUTCFullYear();
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const doy = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
  return `A${year}${String(doy).padStart(3, "0")}`;
}

/** Clamp to the nearest prior 16-day MODIS composite period start */
function nearestModisPeriodStart(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const year = d.getUTCFullYear();
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const doy = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
  const period = Math.floor((doy - 1) / 16) * 16 + 1;
  const clamped = new Date(start.getTime() + (period - 1) * 86400000);
  const mm = String(clamped.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(clamped.getUTCDate()).padStart(2, "0");
  return `${clamped.getUTCFullYear()}-${mm}-${dd}`;
}

interface OrnlSubsetItem {
  band: string;
  tile: string;
  data: number[];
  calendar_date?: string;
  modis_date?: string;
  nrow?: number;
  ncol?: number;
}

interface OrnlResponse {
  subset?: OrnlSubsetItem[];
  header?: { nrows?: number; ncols?: number };
}

/**
 * Server Function: Ingest and process NASA MODIS MOD13Q1 250m 16-day composites.
 * Uses ORNL DAAC MODIS Web Service for real point extraction — no Earthdata auth required.
 */
export const fetchModisVegetationServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => modisQuerySchema.parse(data))
  .handler(async ({ data }): Promise<ModisFieldSummary> => {
    const { fieldId, latitude, longitude, fieldAreaM2 } = data;
    const retrievalTimestamp = new Date().toISOString();

    // --- Date window: past 48 days covers 3 MODIS 16-day composites ---
    const endDateStr = new Date().toISOString().slice(0, 10);
    const startDateObj = new Date();
    startDateObj.setUTCDate(startDateObj.getUTCDate() - 48);
    const startDateStr = nearestModisPeriodStart(startDateObj.toISOString().slice(0, 10));

    const startModis = toModisDate(startDateStr);
    const endModis = toModisDate(endDateStr);

    try {
      // 1. Query ORNL DAAC MODIS Web Service — public, no auth
      //    kmAboveBelow=0, kmLeftRight=0 -> single-pixel point query at given lat/lon
      const ornlUrl =
        `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&startDate=${startModis}&endDate=${endModis}` +
        `&kmAboveBelow=0&kmLeftRight=0`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const ornlRes = await fetch(ornlUrl, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!ornlRes.ok) {
        throw new Error(`ORNL DAAC MODIS Web Service HTTP ${ornlRes.status}: ${ornlRes.statusText}`);
      }

      const ornlData: OrnlResponse = await ornlRes.json();
      const subsetItems = ornlData.subset || [];

      if (subsetItems.length === 0) {
        throw new Error("ORNL DAAC returned empty subset — no MODIS data for this location/date range.");
      }

      // 2. Extract NDVI, EVI, and QA bands by calendar_date
      type DayMap = { ndviRaw?: number; eviRaw?: number; qaRaw?: number; date: string };
      const dateMap: Record<string, DayMap> = {};

      for (const item of subsetItems) {
        const calDate: string = item.calendar_date ?? item.modis_date ?? "unknown";
        if (!dateMap[calDate]) dateMap[calDate] = { date: calDate };

        // Single-pixel query -> data array has exactly 1 value
        const val = Array.isArray(item.data) && item.data.length > 0 ? item.data[0] : null;
        if (val == null) continue;

        const band = item.band ?? "";
        if (band.includes("NDVI")) dateMap[calDate].ndviRaw = val;
        else if (band.includes("EVI")) dateMap[calDate].eviRaw = val;
        else if (band.includes("VI_Quality") || band.includes("QA")) dateMap[calDate].qaRaw = val;
      }

      // 3. Convert to rawSamples for normalizeModisObservations
      const rawSamples: Array<{
        date: string;
        ndviRaw: number | null;
        eviRaw: number | null;
        qaRaw?: number | null;
        pixelCount?: number;
      }> = [];

      for (const entry of Object.values(dateMap)) {
        const ndviRaw = entry.ndviRaw ?? null;
        const eviRaw = entry.eviRaw ?? null;
        const qaRaw = entry.qaRaw ?? null;

        // Apply fill-value filter
        const ndviValid =
          ndviRaw !== null && ndviRaw !== MODIS_FILL_VALUE && ndviRaw >= -2000 && ndviRaw <= 10000
            ? ndviRaw
            : null;
        const eviValid =
          eviRaw !== null && eviRaw !== MODIS_FILL_VALUE && eviRaw >= -2000 && eviRaw <= 10000
            ? eviRaw
            : null;

        // Quality filter
        const qaDecoded = qaRaw !== null ? decodeModisVIQuality(qaRaw) : null;
        const qaOk =
          qaDecoded === null ||
          qaDecoded.qualityLevel === "good" ||
          qaDecoded.qualityLevel === "marginal";

        rawSamples.push({
          date: entry.date,
          ndviRaw: qaOk ? ndviValid : null,
          eviRaw: qaOk ? eviValid : null,
          qaRaw,
          pixelCount: 1,
        });
      }

      const summary = normalizeModisObservations({
        fieldId,
        fieldAreaM2,
        latitude,
        longitude,
        rawSamples,
        retrievalTimestamp,
      });

      // Mark provenance
      const hasData = rawSamples.some(s => s.ndviRaw !== null);
      summary.provenance.mode = "live";
      summary.provenance.quality = hasData ? "good" : "marginal";
      summary.provenance.qualityFlags = ["ORNL_DAAC_MODIS_WEB_SERVICE", "MOD13Q1_V061", "250m_16DAY"];
      summary.provenance.observedAt =
        rawSamples
          .filter(s => s.ndviRaw !== null)
          .sort((a, b) => b.date.localeCompare(a.date))[0]?.date ??
        retrievalTimestamp.slice(0, 10);

      return summary;
    } catch (err) {
      console.warn("NASA MODIS ORNL DAAC query error:", (err as Error).message);

      // --- Fallback: CMR granule discovery for provenance-only (no pixel data) ---
      const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;
      if (earthdataToken) {
        try {
          const cmrUrl =
            `https://cmr.earthdata.nasa.gov/search/granules.json` +
            `?short_name=MOD13Q1&version=061` +
            `&point=${longitude},${latitude}` +
            `&page_size=3&sort_key=-start_date`;

          const cmrRes = await fetch(cmrUrl, {
            headers: { Authorization: `Bearer ${earthdataToken}` },
          });

          if (cmrRes.ok) {
            const cmrData = await cmrRes.json();
            const entries = cmrData.feed?.entry || [];
            if (entries.length > 0) {
              const summary = normalizeModisObservations({
                fieldId,
                fieldAreaM2,
                latitude,
                longitude,
                rawSamples: [],
                retrievalTimestamp,
              });
              summary.provenance.mode = "live";
              summary.provenance.quality = "marginal";
              summary.provenance.qualityFlags = [
                "CMR_GRANULE_FOUND",
                "ORNL_DAAC_UNREACHABLE",
                (err as Error).message.slice(0, 120),
              ];
              summary.provenance.observedAt = entries[0]?.time_start?.slice(0, 10);
              return summary;
            }
          }
        } catch (_cmrErr) {
          // ignore CMR fallback error
        }
      }

      // Complete miss — return honest missing status
      const summary = normalizeModisObservations({
        fieldId,
        fieldAreaM2,
        latitude,
        longitude,
        rawSamples: [],
        retrievalTimestamp,
      });
      summary.provenance.quality = "missing";
      summary.provenance.qualityFlags = [(err as Error).message.slice(0, 200)];
      return summary;
    }
  });
