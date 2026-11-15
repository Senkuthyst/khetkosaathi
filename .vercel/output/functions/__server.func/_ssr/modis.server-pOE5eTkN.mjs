import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { n as normalizeModisObservations, t as decodeModisVIQuality } from "./modis-service-CxFMJJcE.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modis.server-pOE5eTkN.js
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
/**
* Core query function for NASA MODIS MOD13Q1 250m 16-day composites.
* Can be called directly by internal server services (e.g. HLS fallback) or test runners.
*/
async function queryModisVegetation(data) {
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
}
var fetchModisVegetationServerFn_createServerFn_handler = createServerRpc({
	id: "eb9a484897e396418d5c9cc74027e350212bef2286d02d466b0a779184f0b15c",
	name: "fetchModisVegetationServerFn",
	filename: "src/lib/server-functions/modis.server.ts"
}, (opts) => fetchModisVegetationServerFn.__executeServer(opts));
var fetchModisVegetationServerFn = createServerFn({ method: "POST" }).validator((data) => modisQuerySchema.parse(data)).handler(fetchModisVegetationServerFn_createServerFn_handler, async ({ data }) => {
	return queryModisVegetation(data);
});
//#endregion
export { fetchModisVegetationServerFn_createServerFn_handler };
