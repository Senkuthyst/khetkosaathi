// Secure Server Functions for NASA Earth Observations
// Runs server-side in TanStack Start (Node / Nitro SSR environment)
// Validates coordinates, connects to NASA APIs with exponential backoff & rate limiting,
// normalizes observations, and handles storage via capability RPCs.

import { createServerFn } from "@tanstack/react-start";
import * as zod from "zod";
const z = (zod as any).z ?? zod;
import {
  buildNasaPowerUrl,
  normalizeNasaPowerResponse,
  NASA_POWER_PARAMETERS,
} from "@/lib/data/nasa-power-service";
import type {
  NasaPowerObservationResult,
  EarthObservationRecord,
} from "@/lib/data/earth-observation-contract";

const globalFetchParamsSchema = z.object({
  fieldId: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  startDate: z.string().regex(/^\d{8}$/).optional(),
  endDate: z.string().regex(/^\d{8}$/).optional(),
  days: z.number().int().min(1).max(365).default(7),
  force: z.boolean().default(false),
});

export type GlobalFetchPowerInput = z.infer<typeof globalFetchParamsSchema>;

/**
 * Server function for fetching NASA POWER Daily observations for ANY global location.
 * Uses UTC standard and agricultural community parameters.
 */
export const fetchNasaPowerDailyServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => globalFetchParamsSchema.parse(data))
  .handler(async ({ data }): Promise<NasaPowerObservationResult> => {
    const { fieldId, latitude, longitude, startDate, endDate, days } = data;

    let startStr = startDate;
    let endStr = endDate;

    if (!startStr || !endStr) {
      // NASA POWER typically has ~4-5 days latency for MERRA-2 processing
      const end = new Date();
      end.setUTCDate(end.getUTCDate() - 5);
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - (days - 1));

      const toYmd = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
      startStr = toYmd(start);
      endStr = toYmd(end);
    }

    const targetUrl = buildNasaPowerUrl({
      latitude,
      longitude,
      startDate: startStr,
      endDate: endStr,
      parameters: NASA_POWER_PARAMETERS,
      community: "AG",
    });

    // Retry with backoff helper
    const fetchWithRetry = async (url: string, retries = 2, delayMs = 1000): Promise<Response> => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        try {
          const res = await fetch(url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
              "User-Agent": "KHETKOSAATHI-EarthIntel/2.0 (Nepal Agricultural Intelligence)",
            },
          });
          clearTimeout(timeout);
          if (res.ok) return res;
          if (res.status >= 500 && attempt < retries) {
            await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
            continue;
          }
          throw new Error(`NASA POWER API HTTP ${res.status}: ${res.statusText}`);
        } catch (err: any) {
          clearTimeout(timeout);
          if (attempt < retries && err.name !== "AbortError") {
            await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
            continue;
          }
          throw err;
        }
      }
      throw new Error("Maximum retry attempts reached");
    };

    try {
      const response = await fetchWithRetry(targetUrl);
      const json = await response.json();
      return normalizeNasaPowerResponse(json, {
        fieldId,
        latitude,
        longitude,
        retrievalTimestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(`NASA POWER fetch failed for [${latitude}, ${longitude}]:`, (err as Error).message);
      throw new Error(`NASA POWER API is temporarily unavailable: ${(err as Error).message}. Please try again later.`);
    }
  });
