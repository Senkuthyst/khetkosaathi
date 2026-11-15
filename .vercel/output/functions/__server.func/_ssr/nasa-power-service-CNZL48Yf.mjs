import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-power-service-CNZL48Yf.js
var z = external_exports ?? zod_exports;
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
var rawResponseSchema = z.object({
	header: z.object({
		fill_value: z.number().optional(),
		api: z.object({ version: z.string().optional() }).optional()
	}).optional(),
	geometry: z.object({ coordinates: z.array(z.number()).optional() }).optional(),
	properties: z.object({ parameter: z.record(z.string(), z.record(z.string(), z.number().nullable())) })
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
//#endregion
export { buildNasaPowerUrl as n, normalizeNasaPowerResponse as r, NASA_POWER_PARAMETERS as t };
