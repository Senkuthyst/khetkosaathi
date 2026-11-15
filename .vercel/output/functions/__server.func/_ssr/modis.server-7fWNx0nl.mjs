import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modis.server-7fWNx0nl.js
var MODIS_SCALE_FACTOR = 1e-4;
/**
* Decode 16-bit MOD13Q1 VI Quality flag
* Bits 0-1: MODLAND QA
* Bits 2-5: VI usefulness
* Bits 6-7: Aerosol quantity
* Bits 8: Adjacent cloud detected
* Bits 9: Atmosphere BRDF correction performed
* Bits 10: Mixed clouds
* Bits 11-13: Land/Water mask
* Bits 14: Possible snow/ice
* Bits 15: Possible shadow
*/
function decodeModisVIQuality(qa) {
	if (qa == null || !Number.isFinite(qa) || qa < 0) return {
		rawQA: -1,
		qualityLevel: "cloudy",
		modlandQA: "not_produced_cloud",
		viUsefulness: 15,
		cloudState: "significant_clouds"
	};
	const modlandBits = qa & 3;
	const usefulnessBits = qa >> 2 & 15;
	const mixedClouds = qa >> 10 & 1;
	const snowIce = qa >> 14 & 1;
	const shadow = qa >> 15 & 1;
	let modlandQA = "good_quality";
	if (modlandBits === 1) modlandQA = "check_other_qa";
	else if (modlandBits === 2) modlandQA = "not_produced_cloud";
	else if (modlandBits === 3) modlandQA = "not_produced_other";
	let cloudState = "clear";
	if (mixedClouds === 1) cloudState = "mixed";
	if (modlandBits === 2) cloudState = "significant_clouds";
	if (shadow === 1) cloudState = "shadow";
	let qualityLevel = "good";
	if (snowIce === 1) qualityLevel = "snow_ice";
	else if (modlandBits >= 2 || cloudState === "significant_clouds") qualityLevel = "cloudy";
	else if (modlandBits === 1 || usefulnessBits > 4) qualityLevel = "marginal";
	return {
		rawQA: qa,
		qualityLevel,
		modlandQA,
		viUsefulness: usefulnessBits,
		cloudState
	};
}
/**
* Normalizes raw MODIS MOD13Q1 observations, applying the official 0.0001 scale factor,
* rejecting fill values, evaluating pixel quality, and formatting standard observation records.
*/
function normalizeModisObservations(options) {
	const { fieldId, fieldAreaM2 = 4046, latitude, longitude, rawSamples, retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString() } = options;
	const isFieldTooSmallForModis = fieldAreaM2 < 62500;
	const composites = [];
	const records = [];
	for (const sample of rawSamples) {
		const qa = decodeModisVIQuality(sample.qaRaw);
		const parseIndex = (rawVal) => {
			if (rawVal === -3e3 || rawVal < -2e3 || rawVal > 1e4) return null;
			if (qa.qualityLevel === "cloudy" || qa.qualityLevel === "snow_ice") return null;
			return Math.round(rawVal * MODIS_SCALE_FACTOR * 1e4) / 1e4;
		};
		const ndvi = parseIndex(sample.ndviRaw);
		const evi = parseIndex(sample.eviRaw);
		const startDate = new Date(sample.date);
		const endDate = new Date(startDate);
		endDate.setUTCDate(endDate.getUTCDate() + 15);
		const endStr = endDate.toISOString().slice(0, 10);
		const totalPix = sample.totalPixels ?? 1;
		const validPix = sample.validPixels ?? (ndvi !== null ? 1 : 0);
		const validCoveragePct = totalPix > 0 ? Math.round(validPix / totalPix * 100) : 0;
		composites.push({
			compositeStart: sample.date,
			compositeEnd: endStr,
			ndvi,
			evi,
			quality: qa,
			rawNdvi: sample.ndviRaw,
			rawEvi: sample.eviRaw,
			validPixelCount: validPix,
			totalPixelCount: totalPix,
			validCoveragePct
		});
		const qualityStatus = ndvi === null ? "missing" : qa.qualityLevel === "good" ? "good" : "marginal";
		records.push({
			fieldId,
			sourceName: "nasa_modis",
			productId: "MOD13Q1",
			productVersion: "061",
			variableName: "NDVI",
			value: ndvi,
			unit: "unitless (-0.2 to 1.0)",
			observationStart: `${sample.date}T00:00:00Z`,
			observationEnd: `${endStr}T23:59:59Z`,
			retrievalTimestamp,
			spatialResolution: "250 m",
			temporalResolution: "16-day",
			spatialExtractionMethod: "polygon_centroid",
			qualityStatus,
			qualityFlags: [qa.qualityLevel, qa.cloudState],
			validSpatialCoverage: isFieldTooSmallForModis ? "Sub-pixel Field (Area < 250m Grid)" : "Adequate Grid Coverage",
			processingVersion: "MODIS Collection 6.1",
			provenanceMetadata: {
				rawQA: sample.qaRaw,
				viUsefulness: qa.viUsefulness,
				scaleFactor: MODIS_SCALE_FACTOR,
				latitude,
				longitude,
				fieldAreaM2,
				validCoveragePct
			}
		});
		records.push({
			fieldId,
			sourceName: "nasa_modis",
			productId: "MOD13Q1",
			productVersion: "061",
			variableName: "EVI",
			value: evi,
			unit: "unitless (-0.2 to 1.0)",
			observationStart: `${sample.date}T00:00:00Z`,
			observationEnd: `${endStr}T23:59:59Z`,
			retrievalTimestamp,
			spatialResolution: "250 m",
			temporalResolution: "16-day",
			spatialExtractionMethod: "polygon_centroid",
			qualityStatus,
			qualityFlags: [qa.qualityLevel, qa.cloudState],
			validSpatialCoverage: isFieldTooSmallForModis ? "Sub-pixel Field (Area < 250m Grid)" : "Adequate Grid Coverage",
			processingVersion: "MODIS Collection 6.1",
			provenanceMetadata: {
				rawQA: sample.qaRaw,
				viUsefulness: qa.viUsefulness,
				scaleFactor: MODIS_SCALE_FACTOR,
				latitude,
				longitude,
				fieldAreaM2,
				validCoveragePct
			}
		});
	}
	const latestValid = composites.filter((c) => c.ndvi !== null).at(-1);
	const provenance = {
		dataset: "NASA MODIS MOD13Q1 V061 (Vegetation Indices 16-Day L3 Global 250m)",
		productId: "MOD13Q1.061",
		source: "nasa_modis",
		resolution: "250 m",
		temporalResolution: "16-day",
		spatialExtractionMethod: "polygon_centroid",
		processingVersion: "Collection 6.1 Tier 1",
		observedAt: composites.at(-1)?.compositeEnd ?? null,
		periodStart: composites[0]?.compositeStart,
		retrievedAt: retrievalTimestamp,
		quality: latestValid?.quality.qualityLevel === "good" ? "good" : "marginal",
		mode: "live",
		url: "https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1"
	};
	return {
		fieldId,
		fieldAreaM2,
		compositeObservations: composites,
		latestNdvi: latestValid?.ndvi ?? null,
		latestEvi: latestValid?.evi ?? null,
		isFieldTooSmallForModis,
		spatialResolution: "250 m",
		provenance,
		records
	};
}
var z = external_exports ?? zod_exports;
var modisQuerySchema = z.object({
	fieldId: z.string().min(1).max(100),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	fieldAreaM2: z.number().positive().optional().default(4046),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	force: z.boolean().default(false)
});
/** Convert a YYYY-MM-DD date to MODIS Julian format AYYYYDDD */
function toModisDate(dateStr) {
	const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00Z");
	const year = d.getUTCFullYear();
	const start = /* @__PURE__ */ new Date(`${year}-01-01T00:00:00Z`);
	const doy = Math.floor((d.getTime() - start.getTime()) / 864e5) + 1;
	return `A${year}${String(doy).padStart(3, "0")}`;
}
/** Clamp to the nearest prior 16-day MODIS composite period start */
function nearestModisPeriodStart(dateStr) {
	const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00Z");
	const year = d.getUTCFullYear();
	const start = /* @__PURE__ */ new Date(`${year}-01-01T00:00:00Z`);
	const doy = Math.floor((d.getTime() - start.getTime()) / 864e5) + 1;
	const period = Math.floor((doy - 1) / 16) * 16 + 1;
	const clamped = new Date(start.getTime() + (period - 1) * 864e5);
	const mm = String(clamped.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(clamped.getUTCDate()).padStart(2, "0");
	return `${clamped.getUTCFullYear()}-${mm}-${dd}`;
}
/**
* Server Function: Ingest and process NASA MODIS MOD13Q1 250m 16-day composites.
* Uses ORNL DAAC MODIS Web Service for real point extraction — no Earthdata auth required.
*/
var fetchModisVegetationServerFn_createServerFn_handler = createServerRpc({
	id: "eb9a484897e396418d5c9cc74027e350212bef2286d02d466b0a779184f0b15c",
	name: "fetchModisVegetationServerFn",
	filename: "src/lib/server-functions/modis.server.ts"
}, (opts) => fetchModisVegetationServerFn.__executeServer(opts));
var fetchModisVegetationServerFn = createServerFn({ method: "POST" }).validator((data) => modisQuerySchema.parse(data)).handler(fetchModisVegetationServerFn_createServerFn_handler, async ({ data }) => {
	const { fieldId, latitude, longitude, fieldAreaM2 } = data;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const endDateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const startDateObj = /* @__PURE__ */ new Date();
	startDateObj.setUTCDate(startDateObj.getUTCDate() - 48);
	const startModis = toModisDate(nearestModisPeriodStart(startDateObj.toISOString().slice(0, 10)));
	const endModis = toModisDate(endDateStr);
	try {
		const ornlUrl = `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset?latitude=${latitude}&longitude=${longitude}&startDate=${startModis}&endDate=${endModis}&kmAboveBelow=0&kmLeftRight=0`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15e3);
		const ornlRes = await fetch(ornlUrl, {
			headers: { Accept: "application/json" },
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (!ornlRes.ok) throw new Error(`ORNL DAAC MODIS Web Service HTTP ${ornlRes.status}: ${ornlRes.statusText}`);
		const subsetItems = (await ornlRes.json()).subset || [];
		if (subsetItems.length === 0) throw new Error("ORNL DAAC returned empty subset — no MODIS data for this location/date range.");
		const dateMap = {};
		for (const item of subsetItems) {
			const calDate = item.calendar_date ?? item.modis_date ?? "unknown";
			if (!dateMap[calDate]) dateMap[calDate] = { date: calDate };
			const val = Array.isArray(item.data) && item.data.length > 0 ? item.data[0] : null;
			if (val == null) continue;
			const band = item.band ?? "";
			if (band.includes("NDVI")) dateMap[calDate].ndviRaw = val;
			else if (band.includes("EVI")) dateMap[calDate].eviRaw = val;
			else if (band.includes("VI_Quality") || band.includes("QA")) dateMap[calDate].qaRaw = val;
		}
		const rawSamples = [];
		for (const entry of Object.values(dateMap)) {
			const ndviRaw = entry.ndviRaw ?? null;
			const eviRaw = entry.eviRaw ?? null;
			const qaRaw = entry.qaRaw ?? null;
			const ndviValid = ndviRaw !== null && ndviRaw !== -3e3 && ndviRaw >= -2e3 && ndviRaw <= 1e4 ? ndviRaw : null;
			const eviValid = eviRaw !== null && eviRaw !== -3e3 && eviRaw >= -2e3 && eviRaw <= 1e4 ? eviRaw : null;
			const qaDecoded = qaRaw !== null ? decodeModisVIQuality(qaRaw) : null;
			const qaOk = qaDecoded === null || qaDecoded.qualityLevel === "good" || qaDecoded.qualityLevel === "marginal";
			rawSamples.push({
				date: entry.date,
				ndviRaw: qaOk ? ndviValid : null,
				eviRaw: qaOk ? eviValid : null,
				qaRaw,
				pixelCount: 1
			});
		}
		const summary = normalizeModisObservations({
			fieldId,
			fieldAreaM2,
			latitude,
			longitude,
			rawSamples,
			retrievalTimestamp
		});
		const hasData = rawSamples.some((s) => s.ndviRaw !== null);
		summary.provenance.mode = "live";
		summary.provenance.quality = hasData ? "good" : "marginal";
		summary.provenance.qualityFlags = [
			"ORNL_DAAC_MODIS_WEB_SERVICE",
			"MOD13Q1_V061",
			"250m_16DAY"
		];
		summary.provenance.observedAt = rawSamples.filter((s) => s.ndviRaw !== null).sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? retrievalTimestamp.slice(0, 10);
		return summary;
	} catch (err) {
		console.warn("NASA MODIS ORNL DAAC query error:", err.message);
		const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;
		if (earthdataToken) try {
			const cmrUrl = `https://cmr.earthdata.nasa.gov/search/granules.json?short_name=MOD13Q1&version=061&point=${longitude},${latitude}&page_size=3&sort_key=-start_date`;
			const cmrRes = await fetch(cmrUrl, { headers: { Authorization: `Bearer ${earthdataToken}` } });
			if (cmrRes.ok) {
				const entries = (await cmrRes.json()).feed?.entry || [];
				if (entries.length > 0) {
					const summary = normalizeModisObservations({
						fieldId,
						fieldAreaM2,
						latitude,
						longitude,
						rawSamples: [],
						retrievalTimestamp
					});
					summary.provenance.mode = "live";
					summary.provenance.quality = "marginal";
					summary.provenance.qualityFlags = [
						"CMR_GRANULE_FOUND",
						"ORNL_DAAC_UNREACHABLE",
						err.message.slice(0, 120)
					];
					summary.provenance.observedAt = entries[0]?.time_start?.slice(0, 10);
					return summary;
				}
			}
		} catch (_cmrErr) {}
		const summary = normalizeModisObservations({
			fieldId,
			fieldAreaM2,
			latitude,
			longitude,
			rawSamples: [],
			retrievalTimestamp
		});
		summary.provenance.quality = "missing";
		summary.provenance.qualityFlags = [err.message.slice(0, 200)];
		return summary;
	}
});
//#endregion
export { fetchModisVegetationServerFn_createServerFn_handler };
