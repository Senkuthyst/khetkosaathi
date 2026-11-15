import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gpm.server-BICC_c5Y.js
function calculateRainfallAnomaly(accumulatedMm, baselineMm) {
	if (accumulatedMm == null || baselineMm <= 0) return null;
	return Math.round((accumulatedMm - baselineMm) / baselineMm * 1e3) / 10;
}
/**
* Normalizes GPM IMERG V07B daily observations into standardized Earth Observation records.
*/
function normalizeGpmImergObservations(options) {
	const { fieldId, latitude, longitude, productType = "Final", seasonalBaselineMm = 12, samples, retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString() } = options;
	const dailyPoints = [];
	const records = [];
	for (const s of samples) {
		let qualityStatus = "good";
		if (s.precipitationMm === null || s.precipitationMm < 0 || s.precipitationMm > 1500) qualityStatus = "missing";
		dailyPoints.push({
			date: s.date,
			precipitationMm: qualityStatus === "missing" ? null : Math.round(s.precipitationMm * 10) / 10,
			randomErrorMm: s.randomErrorMm != null ? Math.round(s.randomErrorMm * 10) / 10 : null,
			productType,
			qualityStatus
		});
		records.push({
			fieldId,
			sourceName: "nasa_gpm",
			productId: `GPM_3IMERGDF_${productType.toUpperCase()}`,
			productVersion: "V07B",
			variableName: "PRECTOT_GPM",
			value: qualityStatus === "missing" ? null : s.precipitationMm,
			unit: "mm/day",
			observationStart: `${s.date}T00:00:00Z`,
			observationEnd: `${s.date}T23:59:59Z`,
			retrievalTimestamp,
			spatialResolution: "0.1° (~10 km)",
			temporalResolution: "daily",
			spatialExtractionMethod: "point_nearest_grid",
			qualityStatus,
			qualityFlags: [productType, `Error: ${s.randomErrorMm ?? "N/A"}`],
			validSpatialCoverage: "Global (-60° to 60° Latitude)",
			processingVersion: "IMERG V07B Final Run",
			provenanceMetadata: {
				productType,
				latitude,
				longitude
			}
		});
	}
	const validPoints = dailyPoints.filter((p) => p.precipitationMm !== null);
	const total7Day = validPoints.length >= 7 ? validPoints.slice(-7).reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0) : null;
	const total30Day = validPoints.length >= 30 ? validPoints.slice(-30).reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0) : validPoints.length > 0 ? validPoints.reduce((acc, p) => acc + (p.precipitationMm ?? 0), 0) : null;
	const rainfallAnomalyPct = calculateRainfallAnomaly(total7Day, seasonalBaselineMm);
	const provenance = {
		dataset: `NASA GPM IMERG Daily Precipitation (${productType} Run V07B)`,
		productId: `GPM_3IMERGDF_${productType.toUpperCase()}`,
		source: "nasa_gpm",
		resolution: "0.1° (~10 km)",
		temporalResolution: "daily",
		spatialExtractionMethod: "point_nearest_grid",
		processingVersion: "GPM IMERG V07B",
		observedAt: dailyPoints.at(-1)?.date ?? null,
		periodStart: dailyPoints[0]?.date,
		retrievedAt: retrievalTimestamp,
		quality: validPoints.length === dailyPoints.length ? "good" : "marginal",
		mode: "live",
		url: "https://gpm.nasa.gov/data/imerg"
	};
	return {
		fieldId,
		latitude,
		longitude,
		productVersion: "V07B",
		productType,
		spatialResolution: "0.1° (~10 km)",
		dailyPoints,
		totalAccumulation7DayMm: total7Day !== null ? Math.round(total7Day * 10) / 10 : null,
		totalAccumulation30DayMm: total30Day !== null ? Math.round(total30Day * 10) / 10 : null,
		seasonalBaselineMm,
		rainfallAnomalyPct,
		provenance,
		records
	};
}
var z$1 = external_exports ?? zod_exports;
var gpmQuerySchema = z$1.object({
	fieldId: z$1.string().min(1).max(100),
	latitude: z$1.number().min(-90).max(90),
	longitude: z$1.number().min(-180).max(180),
	days: z$1.number().int().min(1).max(60).default(7),
	runType: z$1.enum([
		"Final",
		"Late",
		"Early"
	]).default("Late"),
	force: z$1.boolean().default(false)
});
var fetchGpmPrecipitationServerFn_createServerFn_handler = createServerRpc({
	id: "716f270954f25fbe485acc483c8b1119bf2f320556def46803b47602ec90951a",
	name: "fetchGpmPrecipitationServerFn",
	filename: "src/lib/server-functions/gpm.server.ts"
}, (opts) => fetchGpmPrecipitationServerFn.__executeServer(opts));
var fetchGpmPrecipitationServerFn = createServerFn({ method: "POST" }).validator((data) => gpmQuerySchema.parse(data)).handler(fetchGpmPrecipitationServerFn_createServerFn_handler, async ({ data }) => {
	const { fieldId, latitude, longitude, runType, days } = data;
	const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const shortName = runType === "Final" ? "GPM_3IMERGDF" : "GPM_3IMERGDL";
	const gpmServiceUrl = process.env.GPM_SERVICE_URL || "http://127.0.0.1:8000";
	try {
		const pyController = new AbortController();
		const pyTimeout = setTimeout(() => pyController.abort(), 2e3);
		const pyRes = await fetch(`${gpmServiceUrl}/api/earth/gpm/imerg?fieldId=${encodeURIComponent(fieldId)}&latitude=${latitude}&longitude=${longitude}&days=${days}`, { signal: pyController.signal });
		clearTimeout(pyTimeout);
		if (pyRes.ok) {
			const pyData = await pyRes.json();
			if (pyData.status === "AVAILABLE" && pyData.precipitation != null) {
				const summary = normalizeGpmImergObservations({
					fieldId,
					latitude,
					longitude,
					productType: runType,
					seasonalBaselineMm: 12,
					samples: [{
						date: pyData.observationEnd || retrievalTimestamp.slice(0, 10),
						precipitationMm: pyData.precipitation
					}],
					retrievalTimestamp
				});
				summary.totalAccumulation7DayMm = pyData.precipitation;
				summary.provenance.mode = "live";
				summary.provenance.quality = "good";
				summary.provenance.qualityFlags = ["GPM_API_PYTHON_SERVICE", "IMERG_LR_V07B"];
				summary.provenance.observedAt = pyData.observationEnd;
				return summary;
			}
		}
	} catch (_err) {}
	if (!earthdataToken) {
		console.info("NASA Earthdata token (NASA_EARTHDATA_TOKEN) not configured in backend.");
		const summary = normalizeGpmImergObservations({
			fieldId,
			latitude,
			longitude,
			productType: runType,
			seasonalBaselineMm: 12,
			samples: [],
			retrievalTimestamp
		});
		summary.provenance.quality = "missing";
		summary.provenance.qualityFlags = ["NASA_EARTHDATA_TOKEN_NOT_CONFIGURED"];
		return summary;
	}
	try {
		const cmrUrl = `https://cmr.earthdata.nasa.gov/search/granules.json?short_name=${shortName}&version=07&page_size=7&sort_key=-start_date`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 8e3);
		const cmrRes = await fetch(cmrUrl, {
			headers: { Authorization: `Bearer ${earthdataToken}` },
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (!cmrRes.ok) throw new Error(`NASA CMR Granule search HTTP ${cmrRes.status}: ${cmrRes.statusText}`);
		const entries = (await cmrRes.json()).feed?.entry || [];
		if (entries.length === 0) throw new Error(`No recent ${shortName} granules found in NASA CMR.`);
		const latestEntry = entries[0];
		const observedAt = latestEntry.time_start?.slice(0, 10) ?? retrievalTimestamp.slice(0, 10);
		const summary = normalizeGpmImergObservations({
			fieldId,
			latitude,
			longitude,
			productType: runType,
			seasonalBaselineMm: 12,
			samples: entries.map((e) => ({
				date: e.time_start?.slice(0, 10) ?? retrievalTimestamp.slice(0, 10),
				precipitationMm: null
			})),
			retrievalTimestamp
		});
		summary.provenance.observedAt = observedAt;
		summary.provenance.mode = "live";
		summary.provenance.quality = "missing";
		summary.provenance.qualityFlags = [
			"CMR_GRANULE_FOUND",
			"DIRECT_GES_DISC_OAUTH_REQUIRED",
			`LATEST_GRANULE_${latestEntry.title?.slice(0, 30) || "GPM_3IMERGDL"}`
		];
		return summary;
	} catch (err) {
		console.warn("GPM CMR query error:", err.message);
		const summary = normalizeGpmImergObservations({
			fieldId,
			latitude,
			longitude,
			productType: runType,
			seasonalBaselineMm: 12,
			samples: [],
			retrievalTimestamp
		});
		summary.provenance.quality = "missing";
		summary.provenance.qualityFlags = [err.message];
		return summary;
	}
});
//#endregion
export { fetchGpmPrecipitationServerFn_createServerFn_handler };
