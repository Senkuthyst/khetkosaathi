import { C as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as string, i as object, n as external_exports, r as number, t as zod_exports } from "../_libs/zod.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as Skeleton } from "./kit-B1K0EjSI.mjs";
import { n as fetchModisVegetationServerFn, t as createSsrRpc } from "./modis.server-BvZajOKd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-client-D4FuOaVZ.js
var import_jsx_runtime = require_jsx_runtime();
function LazyMap(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height: props.height ?? 280 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full" }) })
	});
}
var z$3 = external_exports ?? zod_exports;
var firmsQuerySchema = z$3.object({
	latitude: z$3.number().min(-90).max(90),
	longitude: z$3.number().min(-180).max(180),
	radiusKm: z$3.number().int().min(5).max(300).default(50),
	dayRange: z$3.number().int().min(1).max(10).default(3),
	source: z$3.enum([
		"VIIRS_SNPP_NRT",
		"VIIRS_NOAA20_NRT",
		"MODIS_NRT"
	]).default("VIIRS_SNPP_NRT")
});
/**
* Server Function: Query NASA FIRMS active fire hotspots around a coordinate.
*/
var fetchFirmsHotspotsServerFn = createServerFn({ method: "POST" }).validator((data) => firmsQuerySchema.parse(data)).handler(createSsrRpc("4574d0f7431e1b75969b69e255875f64a14a6d55d868906541b7edb5db31020c"));
var z$2 = external_exports ?? zod_exports;
var hlsQuerySchema = z$2.object({
	fieldId: z$2.string().min(1).max(100),
	latitude: z$2.number().min(-90).max(90),
	longitude: z$2.number().min(-180).max(180),
	windowDays: z$2.number().int().min(7).max(90).default(30),
	force: z$2.boolean().default(false)
});
/**
* Server Function: Ingest 30m HLS vegetation index with honest fallback.
*/
var fetchHlsVegetationServerFn = createServerFn({ method: "POST" }).validator((data) => hlsQuerySchema.parse(data)).handler(createSsrRpc("c760e7c22582520b88a18a17808a29b5753a66ceafb3549a57bb1d9a0bde0cf6"));
var z$1 = external_exports ?? zod_exports;
var powerYoYSchema = z$1.object({
	latitude: z$1.number().min(-90).max(90),
	longitude: z$1.number().min(-180).max(180),
	fieldId: z$1.string().optional().default("farm-check"),
	windowDays: z$1.number().int().min(1).max(60).optional().default(14)
});
var fetchPowerRainfallYoYServerFn = createServerFn({ method: "POST" }).validator((data) => powerYoYSchema.parse(data)).handler(createSsrRpc("445ba14bd20c81a8d59a0f8b4efb63fd451dfce690b7c9b52f479a8682f6017f"));
var agroClimateSchema = object({
	latitude: number().min(-90).max(90),
	longitude: number().min(-180).max(180),
	fieldId: string().optional().default("crop-health"),
	cropId: string().optional().default("rice"),
	plantingDate: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	elevationM: number().optional().default(100)
});
var fetchAgroClimateServerFn = createServerFn({ method: "POST" }).validator((data) => agroClimateSchema.parse(data)).handler(createSsrRpc("e1c7baa527369cb5d9e188dae6ae4f0a524d8547c05a7ecbc966f5b0fbdbeb44"));
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
async function fetchLivePowerRainfallYoY(options) {
	try {
		return await fetchPowerRainfallYoYServerFn({ data: {
			latitude: options.latitude,
			longitude: options.longitude,
			fieldId: options.fieldId ?? "farm-check",
			windowDays: options.windowDays ?? 14
		} });
	} catch (err) {
		console.error("[nasa-client] fetchLivePowerRainfallYoY failed:", err);
		return null;
	}
}
async function fetchLiveAgroClimate(options) {
	try {
		return await fetchAgroClimateServerFn({ data: {
			latitude: options.latitude,
			longitude: options.longitude,
			fieldId: options.fieldId ?? "crop-health",
			cropId: options.cropId ?? "rice",
			plantingDate: options.plantingDate,
			elevationM: options.elevationM ?? 100
		} });
	} catch (err) {
		console.error("[nasa-client] fetchLiveAgroClimate failed:", err);
		return null;
	}
}
//#endregion
export { fetchLiveModisVegetation as a, fetchLiveHlsVegetation as i, fetchLiveAgroClimate as n, fetchLivePowerRainfallYoY as o, fetchLiveFirmsHotspots as r, LazyMap as t };
