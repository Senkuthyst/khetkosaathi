import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smap.server-CuTuse4J.js
var z$1 = external_exports ?? zod_exports;
var smapQuerySchema = z$1.object({
	fieldId: z$1.string().min(1).max(100),
	latitude: z$1.number().min(-90).max(90),
	longitude: z$1.number().min(-180).max(180),
	force: z$1.boolean().default(false)
});
var SMAP_RESOLUTION_NOTICE = "Notice: NASA SMAP operates at 36 km (L3) or 9 km (Enhanced/L4) grid resolution. This provides broad regional hydrological indicators, which reflect regional soil water trends rather than field-level microclimates for individual smallholder farms.";
var fetchSmapSoilMoistureServerFn_createServerFn_handler = createServerRpc({
	id: "78c810dbd74390035267de1ce98a3885048a12f38d3b1602cccd0042a4de84ac",
	name: "fetchSmapSoilMoistureServerFn",
	filename: "src/lib/server-functions/smap.server.ts"
}, (opts) => fetchSmapSoilMoistureServerFn.__executeServer(opts));
var fetchSmapSoilMoistureServerFn = createServerFn({ method: "POST" }).validator((data) => smapQuerySchema.parse(data)).handler(fetchSmapSoilMoistureServerFn_createServerFn_handler, async ({ data }) => {
	const { fieldId, latitude, longitude } = data;
	const earthdataToken = process.env.NASA_EARTHDATA_TOKEN;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const collectionId = "C2938664763-NSIDC_CPRD";
	const baseProvenance = {
		dataset: "NASA SMAP (Soil Moisture Active Passive)",
		productId: "SPL3SMP_E V006",
		source: "smap",
		resolution: "9 km EASE-Grid 2.0",
		temporalResolution: "daily",
		spatialExtractionMethod: "polygon_centroid",
		processingVersion: "Version 6.0",
		observedAt: null,
		retrievedAt: retrievalTimestamp,
		quality: "missing",
		mode: "live",
		url: "https://nsidc.org/data/smap"
	};
	if (!earthdataToken) {
		console.info("NASA Earthdata token (NASA_EARTHDATA_TOKEN) not configured in backend.");
		baseProvenance.qualityFlags = ["NASA_EARTHDATA_TOKEN_NOT_CONFIGURED"];
		return {
			fieldId,
			latitude,
			longitude,
			surfaceSoilMoistureM3M3: null,
			rootZoneSoilMoistureM3M3: null,
			spatialResolution: "9 km",
			collectionId,
			resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
			provenance: baseProvenance,
			records: []
		};
	}
	try {
		const edrUrl = `https://harmony.earthdata.nasa.gov/ogc-api-edr/1.1.0/collections/${collectionId}`;
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 1e4);
		const edrRes = await fetch(edrUrl, {
			headers: {
				Authorization: `Bearer ${earthdataToken}`,
				Accept: "application/json"
			},
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (edrRes.status === 501) {
			baseProvenance.quality = "missing";
			baseProvenance.qualityFlags = ["HARMONY_EDR_UPSTREAM_501_NOT_YET_IMPLEMENTED"];
			return {
				fieldId,
				latitude,
				longitude,
				surfaceSoilMoistureM3M3: null,
				rootZoneSoilMoistureM3M3: null,
				spatialResolution: "9 km",
				collectionId,
				resolutionLimitationNotice: `${SMAP_RESOLUTION_NOTICE} (NASA Earthdata Harmony OGC EDR for collection ${collectionId} is currently reported as 'Not yet implemented' upstream).`,
				provenance: baseProvenance,
				records: []
			};
		}
		if (!edrRes.ok) throw new Error(`NASA Harmony EDR returned HTTP ${edrRes.status}: ${edrRes.statusText}`);
		return {
			fieldId,
			latitude,
			longitude,
			surfaceSoilMoistureM3M3: null,
			rootZoneSoilMoistureM3M3: null,
			spatialResolution: "9 km",
			collectionId,
			resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
			provenance: baseProvenance,
			records: []
		};
	} catch (err) {
		console.warn("SMAP Harmony query failed:", err.message);
		baseProvenance.quality = "missing";
		baseProvenance.qualityFlags = [err.message];
		return {
			fieldId,
			latitude,
			longitude,
			surfaceSoilMoistureM3M3: null,
			rootZoneSoilMoistureM3M3: null,
			spatialResolution: "9 km",
			collectionId,
			resolutionLimitationNotice: SMAP_RESOLUTION_NOTICE,
			provenance: baseProvenance,
			records: []
		};
	}
});
//#endregion
export { fetchSmapSoilMoistureServerFn_createServerFn_handler };
