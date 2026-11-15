import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { r as queryModisVegetation } from "./modis.server-CbH_xBlu.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hls.server-C129R7B_.js
var z = external_exports ?? zod_exports;
var hlsQuerySchema = z.object({
	fieldId: z.string().min(1).max(100),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	windowDays: z.number().int().min(7).max(90).default(30),
	force: z.boolean().default(false)
});
async function resolveHlsVegetation(data, options) {
	const { fieldId, latitude, longitude, windowDays } = data;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const hlsServiceUrl = options?.hlsServiceUrl || process.env.HLS_SERVICE_URL || "http://127.0.0.1:8001";
	const fetcher = options?.fetcher || fetch;
	const modisQuery = options?.modisFallback || queryModisVegetation;
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 2500);
		const hlsRes = await fetcher(`${hlsServiceUrl}/api/earth/hls/vegetation?fieldId=${encodeURIComponent(fieldId)}&latitude=${latitude}&longitude=${longitude}&windowDays=${windowDays}`, { signal: controller.signal });
		clearTimeout(timer);
		if (hlsRes.ok) {
			const hlsData = await hlsRes.json();
			if (hlsData.status === "AVAILABLE" && hlsData.currentYearObservation?.ndvi != null) {
				const curr = hlsData.currentYearObservation;
				const last = hlsData.lastYearObservation;
				const provenance = {
					dataset: `NASA HLS (${curr.collection})`,
					productId: curr.collection,
					source: "landsat",
					resolution: "30 m",
					temporalResolution: "daily",
					spatialExtractionMethod: "polygon_centroid",
					processingVersion: "HLS v2.0",
					observedAt: curr.date,
					retrievedAt: retrievalTimestamp,
					quality: curr.fmask_valid ? "good" : "marginal",
					mode: "live",
					url: "https://lpdaac.usgs.gov/products/hlss30v002/"
				};
				return {
					fieldId,
					latitude,
					longitude,
					spatialResolution: "30 m",
					dataSource: "NASA HLS (HLSS30/HLSL30)",
					isFallback: false,
					currentYearObservation: {
						sceneId: curr.scene_id,
						collection: curr.collection,
						sensor: curr.sensor,
						date: curr.date,
						cloudCoverPct: curr.cloud_cover,
						ndvi: curr.ndvi,
						fmaskValid: curr.fmask_valid,
						fmaskDescription: curr.fmask_description
					},
					lastYearObservation: last ? {
						sceneId: last.scene_id,
						collection: last.collection,
						sensor: last.sensor,
						date: last.date,
						cloudCoverPct: last.cloud_cover,
						ndvi: last.ndvi,
						fmaskValid: last.fmask_valid,
						fmaskDescription: last.fmask_description
					} : null,
					ndviDelta: hlsData.ndviDelta ?? null,
					ndviDeltaPct: hlsData.ndviDeltaPct ?? null,
					latestNdvi: curr.ndvi,
					provenance
				};
			}
		}
	} catch (_err) {}
	const modisSummary = await modisQuery({
		fieldId,
		latitude,
		longitude,
		fieldAreaM2: 4046,
		force: false
	});
	const fallbackProvenance = {
		...modisSummary.provenance,
		dataset: "NASA MODIS MOD13Q1 (HLS Fallback)",
		qualityFlags: [...modisSummary.provenance.qualityFlags || [], "HLS_MICROSERVICE_UNREACHABLE_OR_CLOUDY"]
	};
	return {
		fieldId,
		latitude,
		longitude,
		spatialResolution: "30 m",
		dataSource: "NASA MODIS MOD13Q1 (HLS Fallback)",
		isFallback: true,
		fallbackReason: "No clear HLS scene (<= 20% cloud) or HLS service offline. Transparently fell back to operational MODIS 250m composite.",
		currentYearObservation: modisSummary.latestNdvi != null ? {
			sceneId: "MOD13Q1-COMPOSITE",
			collection: "MOD13Q1.061",
			sensor: "Terra MODIS",
			date: modisSummary.provenance.observedAt || retrievalTimestamp.slice(0, 10),
			cloudCoverPct: 0,
			ndvi: modisSummary.latestNdvi,
			fmaskValid: true,
			fmaskDescription: "Clear Pixel (MODIS VI Quality)"
		} : null,
		lastYearObservation: null,
		ndviDelta: null,
		ndviDeltaPct: null,
		latestNdvi: modisSummary.latestNdvi,
		provenance: fallbackProvenance
	};
}
var fetchHlsVegetationServerFn_createServerFn_handler = createServerRpc({
	id: "c760e7c22582520b88a18a17808a29b5753a66ceafb3549a57bb1d9a0bde0cf6",
	name: "fetchHlsVegetationServerFn",
	filename: "src/lib/server-functions/hls.server.ts"
}, (opts) => fetchHlsVegetationServerFn.__executeServer(opts));
var fetchHlsVegetationServerFn = createServerFn({ method: "POST" }).validator((data) => hlsQuerySchema.parse(data)).handler(fetchHlsVegetationServerFn_createServerFn_handler, async ({ data }) => {
	return resolveHlsVegetation(data);
});
//#endregion
export { fetchHlsVegetationServerFn_createServerFn_handler };
