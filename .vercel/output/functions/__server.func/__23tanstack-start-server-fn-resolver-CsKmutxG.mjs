//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CsKmutxG.js
var manifest = {
	"4574d0f7431e1b75969b69e255875f64a14a6d55d868906541b7edb5db31020c": {
		functionName: "fetchFirmsHotspotsServerFn_createServerFn_handler",
		importer: () => import("./_ssr/firms.server-CBVQ_fAU.mjs")
	},
	"716f270954f25fbe485acc483c8b1119bf2f320556def46803b47602ec90951a": {
		functionName: "fetchGpmPrecipitationServerFn_createServerFn_handler",
		importer: () => import("./_ssr/gpm.server-Dm0iQYtQ.mjs")
	},
	"78c810dbd74390035267de1ce98a3885048a12f38d3b1602cccd0042a4de84ac": {
		functionName: "fetchSmapSoilMoistureServerFn_createServerFn_handler",
		importer: () => import("./_ssr/smap.server-DQpFlP_S.mjs")
	},
	"eb9a484897e396418d5c9cc74027e350212bef2286d02d466b0a779184f0b15c": {
		functionName: "fetchModisVegetationServerFn_createServerFn_handler",
		importer: () => import("./_ssr/modis.server-7fWNx0nl.mjs")
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
