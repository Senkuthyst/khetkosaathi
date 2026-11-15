import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
import { r as fetchPowerRainfallYearOverYear } from "./nasa-power-yoy-C-aNbDCV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/power-yoy.server-DzwJjIRV.js
var z$1 = external_exports ?? zod_exports;
var powerYoYSchema = z$1.object({
	latitude: z$1.number().min(-90).max(90),
	longitude: z$1.number().min(-180).max(180),
	fieldId: z$1.string().optional().default("farm-check"),
	windowDays: z$1.number().int().min(1).max(60).optional().default(14)
});
var fetchPowerRainfallYoYServerFn_createServerFn_handler = createServerRpc({
	id: "445ba14bd20c81a8d59a0f8b4efb63fd451dfce690b7c9b52f479a8682f6017f",
	name: "fetchPowerRainfallYoYServerFn",
	filename: "src/lib/server-functions/power-yoy.server.ts"
}, (opts) => fetchPowerRainfallYoYServerFn.__executeServer(opts));
var fetchPowerRainfallYoYServerFn = createServerFn({ method: "POST" }).validator((data) => powerYoYSchema.parse(data)).handler(fetchPowerRainfallYoYServerFn_createServerFn_handler, async ({ data }) => {
	try {
		return await fetchPowerRainfallYearOverYear({
			latitude: data.latitude,
			longitude: data.longitude,
			fieldId: data.fieldId,
			windowDays: data.windowDays
		});
	} catch (err) {
		console.error("[power-yoy.server] NASA POWER YoY fetch failed:", err);
		return null;
	}
});
//#endregion
export { fetchPowerRainfallYoYServerFn_createServerFn_handler };
