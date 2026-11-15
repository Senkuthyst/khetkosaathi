import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { n as buildNasaPowerUrl, r as normalizeNasaPowerResponse, t as NASA_POWER_PARAMETERS } from "./nasa-power-service-C1pF7C-A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-power-Cqs2AoZI.js
var z$1 = external_exports ?? zod_exports;
var CACHE_KEY = "khetkosaathi-power-chitwan-v2";
var TTL = 216e5;
var daySchema = z$1.object({
	date: z$1.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	tMax: z$1.number().nullable(),
	tMin: z$1.number().nullable(),
	rain: z$1.number().nullable(),
	humidity: z$1.number().nullable(),
	solar: z$1.number().nullable(),
	wind: z$1.number().nullable().optional(),
	t2m: z$1.number().nullable().optional()
});
var cacheSchema = z$1.object({
	savedAt: z$1.number(),
	days: z$1.array(daySchema).min(1),
	productId: z$1.string(),
	fieldId: z$1.string().optional(),
	latitude: z$1.number().optional(),
	longitude: z$1.number().optional()
});
var memory;
var pending;
function readCache() {
	if (memory) return memory;
	try {
		if (typeof localStorage !== "undefined") {
			const stored = localStorage.getItem(CACHE_KEY);
			if (stored) {
				const parsed = cacheSchema.safeParse(JSON.parse(stored));
				if (parsed.success && parsed.data.savedAt <= Date.now()) memory = parsed.data;
			}
		}
	} catch {}
	return memory;
}
function cachedData(cache, mode) {
	const usable = cache.days.filter((d) => [
		d.tMax,
		d.tMin,
		d.rain,
		d.humidity,
		d.solar
	].some((v) => v !== null));
	return {
		days: cache.days.map((d) => ({
			date: d.date,
			tMax: d.tMax,
			tMin: d.tMin,
			rain: d.rain,
			humidity: d.humidity,
			solar: d.solar,
			wind: d.wind ?? null,
			t2m: d.t2m ?? null
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
			quality: cache.days.some((d) => [
				d.tMax,
				d.tMin,
				d.rain,
				d.humidity,
				d.solar
			].some((v) => v === null)) ? "marginal" : "good",
			url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/"
		}
	};
}
/**
* Fetch NASA POWER Daily data for a target field coordinate.
* Defaults to the Chitwan pilot farm [27.6775, 84.4333].
* Requests agricultural variables: T2M, T2M_MAX, T2M_MIN, RH2M, PRECTOTCORR, ALLSKY_SFC_SW_DWN
* Validates responses and implements caching and deterministic fallback.
*/
async function fetchNasaPowerDaily(force = false, coords = {
	latitude: 27.6775,
	longitude: 84.4333,
	fieldId: "pilot-1"
}) {
	const cache = readCache();
	if (!force && cache && Date.now() - cache.savedAt < TTL) return cachedData(cache, "cached");
	if (pending) return pending;
	pending = (async () => {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 9e3);
		try {
			const end = /* @__PURE__ */ new Date();
			end.setUTCDate(end.getUTCDate() - 5);
			const start = new Date(end);
			start.setUTCDate(start.getUTCDate() - 6);
			const toCompact = (d) => d.toISOString().slice(0, 10).replaceAll("-", "");
			const url = buildNasaPowerUrl({
				latitude: coords.latitude,
				longitude: coords.longitude,
				startDate: toCompact(start),
				endDate: toCompact(end),
				parameters: NASA_POWER_PARAMETERS,
				community: "AG"
			});
			const response = await fetch(url, { signal: controller.signal });
			if (!response.ok) throw new Error(`POWER API returned status ${response.status}`);
			const rawJson = await response.json();
			const normalized = normalizeNasaPowerResponse(rawJson, {
				fieldId: coords.fieldId ?? "pilot-1",
				latitude: coords.latitude,
				longitude: coords.longitude,
				retrievalTimestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
			memory = {
				days: normalized.observations.map((o) => ({
					date: o.date,
					tMax: o.t2mMax,
					tMin: o.t2mMin,
					rain: o.prectotcorr,
					humidity: o.rh2m,
					solar: o.allskySfcSwDwn,
					wind: o.ws2m ?? null,
					t2m: o.t2m ?? null
				})),
				savedAt: Date.now(),
				productId: normalized.provenance.productId,
				fieldId: coords.fieldId,
				latitude: coords.latitude,
				longitude: coords.longitude
			};
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(CACHE_KEY, JSON.stringify(memory));
			} catch {}
			return cachedData(memory, "live");
		} catch (err) {
			if (cache) return cachedData(cache, "cached");
			return {
				days: [],
				provenance: {
					dataset: "NASA POWER Daily (AG Community)",
					productId: "POWER_DAILY_AG",
					source: "nasa_power",
					resolution: "0.5° × 0.625° / 1° solar",
					periodStart: "",
					observedAt: null,
					retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
					mode: "live",
					quality: "missing",
					url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/"
				}
			};
		} finally {
			clearTimeout(timer);
			pending = void 0;
		}
	})();
	return pending;
}
//#endregion
export { fetchNasaPowerDaily as t };
