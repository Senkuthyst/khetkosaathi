import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-power-DwTbVNd2.js
var z$1 = external_exports ?? zod_exports;
var NASA_POWER_PARAMETERS = [
	"T2M",
	"T2M_MAX",
	"T2M_MIN",
	"RH2M",
	"PRECTOTCORR",
	"ALLSKY_SFC_SW_DWN",
	"WS2M"
];
var NASA_POWER_VARIABLE_METADATA = {
	T2M: {
		label: "Temperature at 2 Meters",
		unit: "°C",
		min: -90,
		max: 65
	},
	T2M_MAX: {
		label: "Maximum Temperature at 2 Meters",
		unit: "°C",
		min: -90,
		max: 65
	},
	T2M_MIN: {
		label: "Minimum Temperature at 2 Meters",
		unit: "°C",
		min: -90,
		max: 65
	},
	RH2M: {
		label: "Relative Humidity at 2 Meters",
		unit: "%",
		min: 0,
		max: 100
	},
	PRECTOTCORR: {
		label: "Corrected Precipitation",
		unit: "mm/day",
		min: 0,
		max: 2e3
	},
	ALLSKY_SFC_SW_DWN: {
		label: "All Sky Insolation Incident on a Horizontal Surface",
		unit: "MJ/m²/day",
		min: 0,
		max: 100
	},
	WS2M: {
		label: "Wind Speed at 2 Meters",
		unit: "m/s",
		min: 0,
		max: 150
	}
};
var rawResponseSchema = z$1.object({
	header: z$1.object({
		fill_value: z$1.number().optional(),
		api: z$1.object({ version: z$1.string().optional() }).optional()
	}).optional(),
	geometry: z$1.object({ coordinates: z$1.array(z$1.number()).optional() }).optional(),
	properties: z$1.object({ parameter: z$1.record(z$1.string(), z$1.record(z$1.string(), z$1.number().nullable())) })
});
/**
* Validate and build URL for NASA POWER Daily Point API
*/
function buildNasaPowerUrl(options) {
	const { latitude, longitude, startDate, endDate, parameters = NASA_POWER_PARAMETERS, community = "AG" } = options;
	if (latitude < -90 || latitude > 90) throw new Error(`Invalid latitude: ${latitude}. Must be between -90 and 90.`);
	if (longitude < -180 || longitude > 180) throw new Error(`Invalid longitude: ${longitude}. Must be between -180 and 180.`);
	if (!/^\d{8}$/.test(startDate) || !/^\d{8}$/.test(endDate)) throw new Error(`Invalid date format. Expected YYYYMMDD, got start=${startDate}, end=${endDate}`);
	if (startDate > endDate) throw new Error(`startDate (${startDate}) cannot be after endDate (${endDate})`);
	const searchParams = new URLSearchParams({
		parameters: parameters.join(","),
		community,
		longitude: longitude.toFixed(4),
		latitude: latitude.toFixed(4),
		start: startDate,
		end: endDate,
		format: "JSON",
		"time-standard": "UTC"
	});
	return `${typeof process !== "undefined" && process.env?.NASA_POWER_BASE_URL || "https://power.larc.nasa.gov/api/temporal/daily/point"}?${searchParams.toString()}`;
}
/**
* Parse and normalize NASA POWER API JSON response into standardized observation records
*/
function normalizeNasaPowerResponse(rawJson, meta) {
	const parsed = rawResponseSchema.parse(rawJson);
	const p = parsed.properties.parameter;
	const fillValue = parsed.header?.fill_value ?? -999;
	const apiVersion = parsed.header?.api?.version ?? "v2.0";
	const retrievalTimestamp = meta.retrievalTimestamp ?? (/* @__PURE__ */ new Date()).toISOString();
	const dates = [...new Set(NASA_POWER_PARAMETERS.flatMap((k) => Object.keys(p[k] ?? {})))].filter((d) => /^\d{8}$/.test(d)).sort();
	if (dates.length === 0) throw new Error("NASA POWER API returned 0 observation dates.");
	const cleanVal = (key, dateStr) => {
		const v = p[key]?.[dateStr];
		if (v == null || !Number.isFinite(v) || v === fillValue || v <= -900) return null;
		const rules = NASA_POWER_VARIABLE_METADATA[key];
		if (rules && (v < rules.min || v > rules.max)) return null;
		return Math.round(v * 100) / 100;
	};
	const dailySets = [];
	const records = [];
	for (const d of dates) {
		const formattedDate = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
		const t2m = cleanVal("T2M", d);
		const t2mMax = cleanVal("T2M_MAX", d);
		const t2mMin = cleanVal("T2M_MIN", d);
		const rh2m = cleanVal("RH2M", d);
		const prectotcorr = cleanVal("PRECTOTCORR", d);
		const allskySfcSwDwn = cleanVal("ALLSKY_SFC_SW_DWN", d);
		const ws2m = cleanVal("WS2M", d);
		const values = [
			t2m,
			t2mMax,
			t2mMin,
			rh2m,
			prectotcorr,
			allskySfcSwDwn,
			ws2m
		];
		const nonNullCount = values.filter((v) => v !== null).length;
		let qualityStatus = "good";
		if (nonNullCount === 0) qualityStatus = "missing";
		else if (nonNullCount < values.length) qualityStatus = "marginal";
		dailySets.push({
			date: formattedDate,
			t2m,
			t2mMax,
			t2mMin,
			rh2m,
			prectotcorr,
			allskySfcSwDwn,
			ws2m,
			qualityStatus
		});
		for (const param of NASA_POWER_PARAMETERS) {
			const val = cleanVal(param, d);
			const paramMeta = NASA_POWER_VARIABLE_METADATA[param];
			records.push({
				fieldId: meta.fieldId,
				sourceName: "nasa_power",
				productId: "POWER_DAILY_AG",
				productVersion: apiVersion,
				variableName: param,
				value: val,
				unit: paramMeta.unit,
				observationStart: `${formattedDate}T00:00:00Z`,
				observationEnd: `${formattedDate}T23:59:59Z`,
				retrievalTimestamp,
				spatialResolution: "0.5° × 0.625°",
				temporalResolution: "daily",
				spatialExtractionMethod: "point_nearest_grid",
				qualityStatus: val === null ? "missing" : "good",
				qualityFlags: val === null ? ["FILL_VALUE_OR_OUT_OF_RANGE"] : ["VALID"],
				validSpatialCoverage: "Global (-90 to 90 Lat, -180 to 180 Lon)",
				processingVersion: "NASA POWER Release 8 / MERRA-2",
				provenanceMetadata: {
					latitude: meta.latitude,
					longitude: meta.longitude,
					community: "AG",
					apiVersion
				}
			});
		}
	}
	const overallQuality = !dailySets.some((s) => s.qualityStatus !== "missing") ? "missing" : dailySets.some((s) => s.qualityStatus === "marginal") ? "marginal" : "good";
	const provenance = {
		dataset: "NASA POWER Daily (Solar & Meteorological)",
		productId: "POWER_DAILY_AG",
		source: "nasa_power",
		resolution: "0.5° × 0.625° / 1° solar",
		temporalResolution: "daily",
		spatialExtractionMethod: "point_nearest_grid",
		processingVersion: `API ${apiVersion} (MERRA-2 assimilation)`,
		observedAt: dailySets.at(-1)?.date ?? null,
		periodStart: dailySets[0]?.date ?? void 0,
		retrievedAt: retrievalTimestamp,
		quality: overallQuality,
		mode: "live",
		url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/"
	};
	return {
		fieldId: meta.fieldId,
		coordinates: {
			latitude: meta.latitude,
			longitude: meta.longitude
		},
		observations: dailySets,
		provenance,
		records
	};
}
var z = external_exports ?? zod_exports;
var CACHE_KEY = "khetkosaathi-power-chitwan-v2";
var TTL = 216e5;
var daySchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	tMax: z.number().nullable(),
	tMin: z.number().nullable(),
	rain: z.number().nullable(),
	humidity: z.number().nullable(),
	solar: z.number().nullable(),
	t2m: z.number().nullable().optional()
});
var cacheSchema = z.object({
	savedAt: z.number(),
	days: z.array(daySchema).min(1),
	productId: z.string(),
	fieldId: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional()
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
			solar: d.solar
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
			const normalized = normalizeNasaPowerResponse(await response.json(), {
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
					solar: o.allskySfcSwDwn
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
