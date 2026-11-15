import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { n as fetchModisVegetationServerFn, t as createSsrRpc } from "./modis.server-CbH_xBlu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-client-CLI3jpdr.js
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
/**
* Server Function: Query NASA FIRMS active fire hotspots around a coordinate.
*/
var fetchFirmsHotspotsServerFn = createServerFn({ method: "POST" }).validator((data) => firmsQuerySchema.parse(data)).handler(createSsrRpc("4574d0f7431e1b75969b69e255875f64a14a6d55d868906541b7edb5db31020c"));
var z = external_exports ?? zod_exports;
var hlsQuerySchema = z.object({
	fieldId: z.string().min(1).max(100),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	windowDays: z.number().int().min(7).max(90).default(30),
	force: z.boolean().default(false)
});
/**
* Server Function: Ingest 30m HLS vegetation index with honest fallback.
*/
var fetchHlsVegetationServerFn = createServerFn({ method: "POST" }).validator((data) => hlsQuerySchema.parse(data)).handler(createSsrRpc("c760e7c22582520b88a18a17808a29b5753a66ceafb3549a57bb1d9a0bde0cf6"));
async function fetchLiveFirmsHotspots(options) {
	try {
		return await fetchFirmsHotspotsServerFn({ data: {
			latitude: options.latitude,
			longitude: options.longitude,
			radiusKm: options.radiusKm ?? 50,
			dayRange: options.dayRange ?? 3,
			source: "VIIRS_SNPP_NRT"
		} });
	} catch (err) {
		console.warn("fetchLiveFirmsHotspots error:", err.message);
		return null;
	}
}
async function fetchLiveModisVegetation(options) {
	try {
		return await fetchModisVegetationServerFn({ data: {
			fieldId: options.fieldId,
			latitude: options.latitude,
			longitude: options.longitude,
			fieldAreaM2: options.fieldAreaM2 ?? 4046,
			force: false
		} });
	} catch (err) {
		console.warn("fetchLiveModisVegetation error:", err.message);
		return null;
	}
}
async function fetchLiveHlsVegetation(options) {
	try {
		return await fetchHlsVegetationServerFn({ data: {
			fieldId: options.fieldId,
			latitude: options.latitude,
			longitude: options.longitude,
			windowDays: options.windowDays ?? 30,
			force: false
		} });
	} catch (err) {
		console.warn("fetchLiveHlsVegetation error:", err.message);
		return null;
	}
}
//#endregion
export { fetchLiveHlsVegetation as n, fetchLiveModisVegetation as r, fetchLiveFirmsHotspots as t };
