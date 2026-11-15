//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DI14t_TG.js
var manifest = {
	"445ba14bd20c81a8d59a0f8b4efb63fd451dfce690b7c9b52f479a8682f6017f": {
		functionName: "fetchPowerRainfallYoYServerFn_createServerFn_handler",
		importer: () => import("./_ssr/power-yoy.server-DzwJjIRV.mjs")
	},
	"4574d0f7431e1b75969b69e255875f64a14a6d55d868906541b7edb5db31020c": {
		functionName: "fetchFirmsHotspotsServerFn_createServerFn_handler",
		importer: () => import("./_ssr/firms.server-R44oXh9m.mjs")
	},
	"716f270954f25fbe485acc483c8b1119bf2f320556def46803b47602ec90951a": {
		functionName: "fetchGpmPrecipitationServerFn_createServerFn_handler",
		importer: () => import("./_ssr/gpm.server-BICC_c5Y.mjs")
	},
	"78c810dbd74390035267de1ce98a3885048a12f38d3b1602cccd0042a4de84ac": {
		functionName: "fetchSmapSoilMoistureServerFn_createServerFn_handler",
		importer: () => import("./_ssr/smap.server-CuTuse4J.mjs")
	},
	"c760e7c22582520b88a18a17808a29b5753a66ceafb3549a57bb1d9a0bde0cf6": {
		functionName: "fetchHlsVegetationServerFn_createServerFn_handler",
		importer: () => import("./_ssr/hls.server-BKVxWAIM.mjs")
	},
	"e1c7baa527369cb5d9e188dae6ae4f0a524d8547c05a7ecbc966f5b0fbdbeb44": {
		functionName: "fetchAgroClimateServerFn_createServerFn_handler",
		importer: () => import("./_ssr/agro-climate.server-NnpLgd4K.mjs")
	},
	"eb9a484897e396418d5c9cc74027e350212bef2286d02d466b0a779184f0b15c": {
		functionName: "fetchModisVegetationServerFn_createServerFn_handler",
		importer: () => import("./_ssr/modis.server-CdBgG9k3.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
