import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type { PowerData, PowerDay } from "./earth-types";
import { powerPilot } from "./earth-pilot";
import {
  NASA_POWER_PARAMETERS,
  buildNasaPowerUrl,
  normalizeNasaPowerResponse,
} from "./nasa-power-service";
import type { NasaPowerObservationResult, NasaPowerDailySet } from "./earth-observation-contract";

const CACHE_KEY = "khetkosaathi-power-chitwan-v2";
const TTL = 6 * 60 * 60 * 1000; // 6 hours

const daySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tMax: z.number().nullable(),
  tMin: z.number().nullable(),
  rain: z.number().nullable(),
  humidity: z.number().nullable(),
  solar: z.number().nullable(),
  wind: z.number().nullable().optional(),
  t2m: z.number().nullable().optional(),
});

const cacheSchema = z.object({
  savedAt: z.number(),
  days: z.array(daySchema).min(1),
  productId: z.string(),
  fieldId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

let memory: z.infer<typeof cacheSchema> | undefined;
let pending: Promise<PowerData> | undefined;

function readCache(): z.infer<typeof cacheSchema> | undefined {
  if (memory) return memory;
  try {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = cacheSchema.safeParse(JSON.parse(stored));
        if (parsed.success && parsed.data.savedAt <= Date.now()) {
          memory = parsed.data;
        }
      }
    }
  } catch {
    /* Storage can be disabled; in-memory cache still functions */
  }
  return memory;
}

function cachedData(cache: z.infer<typeof cacheSchema>, mode: "live" | "cached"): PowerData {
  const usable = cache.days.filter((d) =>
    [d.tMax, d.tMin, d.rain, d.humidity, d.solar].some((v) => v !== null),
  );

  return {
    days: cache.days.map((d) => ({
      date: d.date,
      tMax: d.tMax,
      tMin: d.tMin,
      rain: d.rain,
      humidity: d.humidity,
      solar: d.solar,
      wind: d.wind ?? null,
      t2m: d.t2m ?? null,
    })),
    provenance: {
      dataset: "NASA POWER Daily (AG Community)",
      productId: cache.productId,
      source: "nasa_power",
      resolution: "0.5° × 0.625° / 1° solar",
      periodStart: cache.days[0]?.date ?? "",
      observedAt: usable.at(-1)?.date ?? null,
      retrievedAt: new Date(cache.savedAt).toISOString(),
      mode,
      quality: cache.days.some((d) =>
        [d.tMax, d.tMin, d.rain, d.humidity, d.solar].some((v) => v === null),
      )
        ? "marginal"
        : "good",
      url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
    },
  };
}

export { buildNasaPowerUrl, normalizeNasaPowerResponse };

/**
 * Fetch NASA POWER Daily data for a target field coordinate.
 * Defaults to the Chitwan pilot farm [27.6775, 84.4333].
 * Requests agricultural variables: T2M, T2M_MAX, T2M_MIN, RH2M, PRECTOTCORR, ALLSKY_SFC_SW_DWN
 * Validates responses and implements caching and deterministic fallback.
 */
export async function fetchNasaPowerDaily(
  force = false,
  coords: { latitude: number; longitude: number; fieldId?: string } = {
    latitude: 27.6775,
    longitude: 84.4333,
    fieldId: "pilot-1",
  },
): Promise<PowerData> {
  const cache = readCache();
  if (!force && cache && Date.now() - cache.savedAt < TTL) {
    return cachedData(cache, "cached");
  }

  if (pending) return pending;

  pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);

    try {
      const end = new Date();
      end.setUTCDate(end.getUTCDate() - 5);
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 6);

      const toCompact = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
      const url = buildNasaPowerUrl({
        latitude: coords.latitude,
        longitude: coords.longitude,
        startDate: toCompact(start),
        endDate: toCompact(end),
        parameters: NASA_POWER_PARAMETERS,
        community: "AG",
      });

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`POWER API returned status ${response.status}`);
      }

      const rawJson = await response.json();
      const normalized: NasaPowerObservationResult = normalizeNasaPowerResponse(rawJson, {
        fieldId: coords.fieldId ?? "pilot-1",
        latitude: coords.latitude,
        longitude: coords.longitude,
        retrievalTimestamp: new Date().toISOString(),
      });

      const days: PowerDay[] = normalized.observations.map((o) => ({
        date: o.date,
        tMax: o.t2mMax,
        tMin: o.t2mMin,
        rain: o.prectotcorr,
        humidity: o.rh2m,
        solar: o.allskySfcSwDwn,
        wind: o.ws2m ?? null,
        t2m: o.t2m ?? null,
      }));

      memory = {
        days,
        savedAt: Date.now(),
        productId: normalized.provenance.productId,
        fieldId: coords.fieldId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(CACHE_KEY, JSON.stringify(memory));
        }
      } catch {
        /* non-critical storage */
      }

      return cachedData(memory, "live");
    } catch (err) {
      if (cache) {
        return cachedData(cache, "cached");
      }
      return {
        days: [],
        provenance: {
          dataset: "NASA POWER Daily (AG Community)",
          productId: "POWER_DAILY_AG",
          source: "nasa_power",
          resolution: "0.5° × 0.625° / 1° solar",
          periodStart: "",
          observedAt: null,
          retrievedAt: new Date().toISOString(),
          mode: "live",
          quality: "missing",
          url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
        },
      };
    } finally {
      clearTimeout(timer);
      pending = undefined;
    }
  })();

  return pending;
}
