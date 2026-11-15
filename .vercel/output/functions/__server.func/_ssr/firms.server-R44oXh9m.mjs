import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firms.server-R44oXh9m.js
var FIRMS_DISCLAIMER = "Notice: Satellite thermal anomalies represent high-temperature surface hotspots detected by MODIS or VIIRS sensors. They do not constitute verified wildfire or agricultural burn damage without field inspection.";
/**
* Parses raw CSV output from NASA FIRMS Area API
*/
function parseFirmsCsv(csvText) {
	const lines = csvText.trim().split(/\r?\n/);
	if (lines.length <= 1) return [];
	const headers = lines[0].split(",").map((h) => h.trim());
	const detections = [];
	for (let i = 1; i < lines.length; i++) {
		const row = lines[i].split(",").map((c) => c.trim());
		if (row.length < headers.length) continue;
		const getCol = (name) => {
			const idx = headers.indexOf(name);
			return idx >= 0 ? row[idx] : void 0;
		};
		const lat = parseFloat(getCol("latitude") || "0");
		const lon = parseFloat(getCol("longitude") || "0");
		const brightness = parseFloat(getCol("bright_ti4") || getCol("brightness") || "0");
		const frp = parseFloat(getCol("frp") || "0");
		if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
		detections.push({
			latitude: Math.round(lat * 1e4) / 1e4,
			longitude: Math.round(lon * 1e4) / 1e4,
			brightness,
			scan: parseFloat(getCol("scan") || "1"),
			track: parseFloat(getCol("track") || "1"),
			acqDate: getCol("acq_date") || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			acqTime: getCol("acq_time") || "0000",
			satellite: getCol("satellite") || "Suomi-NPP",
			instrument: getCol("instrument") || "VIIRS",
			confidence: getCol("confidence") || "nominal",
			version: getCol("version") || "2.0NRT",
			frp,
			daynight: getCol("daynight") || "D"
		});
	}
	return detections;
}
var z$1 = external_exports ?? zod_exports;
var firmsQuerySchema = z$1.object({
	latitude: z$1.number().min(-90).max(90),
	longitude: z$1.number().min(-180).max(180),
	radiusKm: z$1.number().int().min(5).max(300).default(50),
	dayRange: z$1.number().int().min(1).max(10).default(3),
	source: z$1.enum([
		"VIIRS_SNPP_NRT",
		"VIIRS_NOAA20_NRT",
		"MODIS_NRT"
	]).default("VIIRS_SNPP_NRT")
});
var fetchFirmsHotspotsServerFn_createServerFn_handler = createServerRpc({
	id: "4574d0f7431e1b75969b69e255875f64a14a6d55d868906541b7edb5db31020c",
	name: "fetchFirmsHotspotsServerFn",
	filename: "src/lib/server-functions/firms.server.ts"
}, (opts) => fetchFirmsHotspotsServerFn.__executeServer(opts));
var fetchFirmsHotspotsServerFn = createServerFn({ method: "POST" }).validator((data) => firmsQuerySchema.parse(data)).handler(fetchFirmsHotspotsServerFn_createServerFn_handler, async ({ data }) => {
	const { latitude, longitude, radiusKm, dayRange, source } = data;
	const mapKey = process.env.MAP_API_KEY || process.env.NASA_FIRMS_MAP_KEY;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const degApprox = radiusKm / 111;
	const minLat = (latitude - degApprox).toFixed(4);
	const maxLat = (latitude + degApprox).toFixed(4);
	const bbox = `${(longitude - degApprox).toFixed(4)},${minLat},${(longitude + degApprox).toFixed(4)},${maxLat}`;
	const provenance = {
		dataset: `NASA FIRMS (${source})`,
		productId: "FIRMS_ACTIVE_FIRE_NRT",
		source: "nasa_power",
		resolution: "375 m (VIIRS) / 1 km (MODIS)",
		temporalResolution: "daily",
		spatialExtractionMethod: "polygon_areal_mean",
		processingVersion: "NRT v2.0",
		observedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		retrievedAt: retrievalTimestamp,
		quality: "good",
		mode: "live",
		url: "https://firms.modaps.eosdis.nasa.gov/"
	};
	if (!mapKey) {
		console.info("MAP_API_KEY / NASA_FIRMS_MAP_KEY not configured. Reporting empty thermal anomaly list with credential notice.");
		provenance.mode = "live";
		provenance.quality = "missing";
		return {
			region: `BBox: ${bbox}`,
			latitude,
			longitude,
			radiusKm,
			detections: [],
			totalDetections: 0,
			highConfidenceCount: 0,
			provenance,
			disclaimer: `${FIRMS_DISCLAIMER} (Backend requires MAP_API_KEY or NASA_FIRMS_MAP_KEY configured in backend environment).`
		};
	}
	try {
		const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${bbox}/${dayRange}`;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 1e4);
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(timer);
		if (!res.ok) throw new Error(`NASA FIRMS API error HTTP ${res.status}: ${res.statusText}`);
		const detections = parseFirmsCsv(await res.text());
		const highConfidenceCount = detections.filter((d) => d.confidence === "high" || d.confidence === "h" || parseFloat(d.confidence) >= 80).length;
		return {
			region: `BBox: ${bbox}`,
			latitude,
			longitude,
			radiusKm,
			detections,
			totalDetections: detections.length,
			highConfidenceCount,
			provenance,
			disclaimer: FIRMS_DISCLAIMER
		};
	} catch (err) {
		console.warn("NASA FIRMS fetch failed:", err.message);
		provenance.mode = "pilot";
		return {
			region: `BBox: ${bbox}`,
			latitude,
			longitude,
			radiusKm,
			detections: [],
			totalDetections: 0,
			highConfidenceCount: 0,
			provenance,
			disclaimer: `${FIRMS_DISCLAIMER} (Service temporarily unreachable: ${err.message})`
		};
	}
});
//#endregion
export { fetchFirmsHotspotsServerFn_createServerFn_handler };
