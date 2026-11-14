import * as zod from "zod";
const z = (zod as any).z ?? zod;
import type { PowerData, PowerDay } from "./earth-types";
import { powerPilot } from "./earth-pilot";

const CACHE_KEY = "khetkosaathi-power-chitwan-v1";
const TTL = 6 * 60 * 60 * 1000;
const parameters = ["T2M_MAX", "T2M_MIN", "PRECTOTCORR", "RH2M", "ALLSKY_SFC_SW_DWN"] as const;
const responseSchema = z.object({
  header: z.object({ fill_value: z.number().optional(), api: z.object({ version: z.string().optional() }).optional() }).optional(),
  properties: z.object({ parameter: z.record(z.record(z.number().nullable())) }),
});
const daySchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), tMax: z.number().nullable(), tMin: z.number().nullable(), rain: z.number().nullable(), humidity: z.number().nullable(), solar: z.number().nullable() });
const cacheSchema = z.object({ savedAt: z.number(), days: z.array(daySchema).min(1), productId: z.string() });
let memory: z.infer<typeof cacheSchema> | undefined;
let pending: Promise<PowerData> | undefined;

export function parsePowerResponse(raw: unknown): { days: PowerDay[]; productId: string } {
  const data = responseSchema.parse(raw);
  const p = data.properties.parameter;
  const dates = [...new Set(parameters.flatMap(key => Object.keys(p[key] ?? {})))].filter(d => /^\d{8}$/.test(d)).sort();
  const value = (key: typeof parameters[number], date: string): number | null => {
    const v = p[key]?.[date];
    if (v == null || !Number.isFinite(v) || v === (data.header?.fill_value ?? -999) || v <= -900) return null;
    if (key === "RH2M" && (v < 0 || v > 100)) return null;
    if ((key === "PRECTOTCORR" || key === "ALLSKY_SFC_SW_DWN") && v < 0) return null;
    if ((key === "T2M_MAX" || key === "T2M_MIN") && (v < -90 || v > 65)) return null;
    return v;
  };
  const days = dates.map(d => ({ date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`, tMax: value("T2M_MAX", d), tMin: value("T2M_MIN", d), rain: value("PRECTOTCORR", d), humidity: value("RH2M", d), solar: value("ALLSKY_SFC_SW_DWN", d) }));
  if (!days.some(d => [d.tMax, d.tMin, d.rain, d.humidity, d.solar].some(v => v !== null))) throw new Error("No valid POWER observations");
  return { days, productId: `POWER daily / AG${data.header?.api?.version ? ` API ${data.header.api.version}` : ""}` };
}

function readCache() {
  if (memory) return memory;
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = cacheSchema.safeParse(JSON.parse(stored));
      if (parsed.success && parsed.data.savedAt <= Date.now()) memory = parsed.data;
    }
  } catch { /* Storage can be disabled; the in-memory cache still works. */ }
  return memory;
}

function cachedData(cache: z.infer<typeof cacheSchema>, mode: "live" | "cached"): PowerData {
  const usable = cache.days.filter(d => [d.tMax, d.tMin, d.rain, d.humidity, d.solar].some(v => v !== null));
  return { days: cache.days, provenance: {
    dataset: "NASA POWER", productId: cache.productId, source: "nasa_power", resolution: "0.5° × 0.625° / 1° solar",
    periodStart: cache.days[0]?.date ?? "", observedAt: usable.at(-1)?.date ?? null,
    retrievedAt: new Date(cache.savedAt).toISOString(), mode,
    quality: cache.days.some(d => [d.tMax, d.tMin, d.rain, d.humidity, d.solar].some(v => v === null)) ? "marginal" : "good",
    url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
  } };
}

/** Browser-only, no key required. Fetch a seven-day UTC window ending five days ago. */
export function fetchNasaPowerDaily(force = false): Promise<PowerData> {
  const cache = readCache();
  if (!force && cache && Date.now() - cache.savedAt < TTL) return Promise.resolve(cachedData(cache, "cached"));
  if (pending) return pending;
  pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const end = new Date();
      end.setUTCDate(end.getUTCDate() - 5);
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 6);
      const compact = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
      const query = new URLSearchParams({ parameters: parameters.join(","), community: "AG", longitude: "84.4333", latitude: "27.6775", start: compact(start), end: compact(end), format: "JSON", "time-standard": "UTC" });
      const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?${query}`, { signal: controller.signal });
      if (!response.ok) throw new Error("POWER unavailable");
      const parsed = parsePowerResponse(await response.json());
      memory = { ...parsed, savedAt: Date.now() };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(memory)); } catch { /* Nonessential persistence. */ }
      return cachedData(memory, "live");
    } catch {
      return cache ? cachedData(cache, "cached") : powerPilot;
    } finally { clearTimeout(timer); pending = undefined; }
  })();
  return pending;
}