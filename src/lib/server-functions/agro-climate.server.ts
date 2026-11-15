// Server function for Agro-Climate Intelligence (GDD Phenology & 14-Day Water Balance).
// Runs server-side in TanStack Start (SSR / Node environment) to avoid CORS.
// Uses NASA POWER Daily Point API with exponential backoff and timeout safeguards.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildNasaPowerUrl,
  normalizeNasaPowerResponse,
  NASA_POWER_PARAMETERS,
} from "@/lib/data/nasa-power-service";
import { accumulateGdd, type GddAccumulationResult } from "@/lib/data/gdd";
import { calculate14DayWaterBalance, type WaterBalance14DayResult } from "@/lib/data/water-balance";
import { fetchHistoricalWindowNetClimatology } from "@/lib/data/nasa-power-yoy";
import type { EarthProvenance } from "@/lib/data/earth-observation-contract";

const agroClimateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fieldId: z.string().optional().default("crop-health"),
  cropId: z.string().optional().default("rice"),
  plantingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  elevationM: z.number().optional().default(100),
});

export type AgroClimateInput = z.infer<typeof agroClimateSchema>;

export interface AgroClimateResult {
  gdd: GddAccumulationResult;
  waterBalance: WaterBalance14DayResult;
  provenance: EarthProvenance;
}

export const fetchAgroClimateServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => agroClimateSchema.parse(data))
  .handler(async ({ data }): Promise<AgroClimateResult> => {
    const { latitude, longitude, fieldId, cropId, plantingDate, elevationM } = data;
    const retrievalTimestamp = new Date().toISOString();

    // Reference end date: 5 days ago to respect NASA POWER MERRA-2 processing latency
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - 5);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    const toCompact = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");

    const effectivePlantingDate =
      plantingDate ??
      (() => {
        const p = new Date(end);
        p.setUTCDate(p.getUTCDate() - 60);
        return toIso(p);
      })();

    // Start date for POWER request: from planting date (clamped to max 150 days ago)
    const plantObj = new Date(effectivePlantingDate + "T00:00:00Z");
    const minStart = new Date(end);
    minStart.setUTCDate(minStart.getUTCDate() - 150);
    const startObj = plantObj < minStart ? minStart : plantObj;

    const startCompact = toCompact(startObj);
    const endCompact = toCompact(end);

    const targetUrl = buildNasaPowerUrl({
      latitude,
      longitude,
      startDate: startCompact,
      endDate: endCompact,
      parameters: NASA_POWER_PARAMETERS,
      community: "AG",
    });

    const defaultProvenance: EarthProvenance = {
      dataset: "NASA POWER Daily (AG Community)",
      productId: "POWER_DAILY_AG",
      source: "nasa_power",
      resolution: "0.5° × 0.625° / 1° solar",
      temporalResolution: "daily",
      spatialExtractionMethod: "point_nearest_grid",
      processingVersion: "Release 8 / MERRA-2",
      observedAt: toIso(end),
      periodStart: toIso(startObj),
      retrievedAt: retrievalTimestamp,
      quality: "good",
      mode: "live",
      url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
    };

    try {
      // Fetch with retry & timeout like existing POWER service
      const fetchWithRetry = async (
        url: string,
        retries = 2,
        delayMs = 1000,
      ): Promise<Response> => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12000);
          try {
            const res = await fetch(url, {
              signal: controller.signal,
              headers: {
                Accept: "application/json",
                "User-Agent": "KHETKOSAATHI-AgroClimate/2.0 (Nepal Farmer Decision Support)",
              },
            });
            clearTimeout(timeout);
            if (res.ok) return res;
            if (res.status >= 500 && attempt < retries) {
              await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
              continue;
            }
            throw new Error(`NASA POWER API HTTP ${res.status}: ${res.statusText}`);
          } catch (err: unknown) {
            clearTimeout(timeout);
            const error = err as Error;
            if (attempt < retries && error.name !== "AbortError") {
              await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
              continue;
            }
            throw err;
          }
        }
        throw new Error("Maximum retry attempts reached");
      };

      const res = await fetchWithRetry(targetUrl);
      const json = await res.json();
      const norm = normalizeNasaPowerResponse(json, {
        fieldId,
        latitude,
        longitude,
        retrievalTimestamp,
      });

      // Daily observations formatted for pure functions
      const dailyRecords = norm.observations.map((o) => ({
        date: o.date,
        t2mMax: o.t2mMax,
        t2mMin: o.t2mMin,
        rh2m: o.rh2m,
        allskySfcSwDwn: o.allskySfcSwDwn,
        ws2m: o.ws2m ?? null,
        prectotcorr: o.prectotcorr,
      }));

      // 1. Calculate Growing Degree Days
      const gdd = accumulateGdd({
        cropId,
        plantingDate: effectivePlantingDate,
        dailyData: dailyRecords,
      });

      // 2. Calculate 14-Day Rolling Water Balance
      const currentEnd = new Date(end);
      const currentStart = new Date(currentEnd);
      currentStart.setUTCDate(currentStart.getUTCDate() - 13);

      // Fetch past historical distribution for the same calendar window
      const historicalNets = await fetchHistoricalWindowNetClimatology({
        latitude,
        longitude,
        fieldId,
        currentStart,
        currentEnd,
        elevationM,
        maxYears: 15,
      }).catch(() => []);

      const waterBalance = calculate14DayWaterBalance({
        latitude,
        dailyRecords,
        elevationM,
        historicalWindowNetValues: historicalNets,
      });

      const provenance: EarthProvenance = {
        ...defaultProvenance,
        observedAt: norm.provenance.observedAt ?? toIso(end),
        periodStart: norm.provenance.periodStart ?? toIso(startObj),
        quality: norm.provenance.quality,
      };

      return {
        gdd,
        waterBalance,
        provenance,
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(
        "[agro-climate.server] Failed to fetch NASA POWER agro-climate data:",
        error?.message || error,
      );
      return {
        gdd: {
          status: "missing",
          reason: `NASA POWER data temporarily unavailable: ${error?.message || "Connection timeout"}`,
        },
        waterBalance: {
          status: "missing",
          contextNote:
            "Water balance context: Observational comparison of precipitation against atmospheric evaporative demand (ET₀). Not an irrigation schedule or recommendation.",
          reason: `NASA POWER data temporarily unavailable: ${error?.message || "Connection timeout"}`,
        },
        provenance: {
          ...defaultProvenance,
          quality: "missing",
        },
      };
    }
  });
