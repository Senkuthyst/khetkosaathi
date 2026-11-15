import { a as getStationDaily, d as sensorHealth, f as stationCurrent, o as getVegSeries, t as DEMO_NOW } from "./mock-CNUdIL6z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/derived-DND3DPU1.js
function evaluateAlerts(i, th) {
	const out = [];
	if (i.soilNow < th.minSoil) out.push({
		id: "soil",
		key: "a_soil",
		severity: i.soilNow < th.minSoil - 5 ? "high" : "medium",
		source: "station",
		time: i.now
	});
	if (i.rain7 < th.minRain7) out.push({
		id: "rain",
		key: "a_rain",
		severity: "medium",
		source: "station",
		time: i.now
	});
	if (i.tMaxRecent > th.maxTemp) out.push({
		id: "temp",
		key: "a_temp",
		severity: "medium",
		source: "station",
		time: i.now
	});
	if (i.vegBelowBaseline) out.push({
		id: "veg",
		key: "a_veg",
		severity: "medium",
		source: "landsat",
		time: i.satDate
	});
	if (i.gapHours >= 6) out.push({
		id: "gap",
		key: "a_gap",
		severity: "low",
		source: "station",
		time: i.now
	});
	if (i.battery < th.minBattery) out.push({
		id: "batt",
		key: "a_batt",
		severity: "low",
		source: "station",
		time: i.now
	});
	const rank = {
		high: 0,
		medium: 1,
		low: 2
	};
	return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
function summary() {
	const daily = getStationDaily(14);
	const last7 = daily.slice(-7);
	const rain7 = last7.reduce((s, d) => s + (d.rain ?? 0), 0);
	const veg = getVegSeries();
	const lastVeg = [...veg].reverse().find((v) => v.ndvi !== null) ?? null;
	const vegBelow = lastVeg?.ndvi != null && lastVeg.ndvi < lastVeg.baseLow;
	const tMaxRecent = Math.max(...last7.map((d) => d.tMax ?? -99));
	return {
		daily,
		last7,
		rain7: Math.round(rain7 * 10) / 10,
		veg,
		lastVeg,
		vegBelow,
		tMaxRecent
	};
}
function currentAlerts(th) {
	const s = summary();
	return evaluateAlerts({
		rain7: s.rain7,
		soilNow: stationCurrent.soil,
		tMaxRecent: s.tMaxRecent,
		battery: sensorHealth.battery,
		vegBelowBaseline: s.vegBelow,
		gapHours: sensorHealth.gaps[0]?.hours ?? 0,
		now: stationCurrent.observedAt,
		satDate: s.lastVeg?.date ?? ""
	}, th);
}
var cropAgeDays = (planting) => Math.max(0, Math.round((DEMO_NOW.getTime() - new Date(planting).getTime()) / 864e5));
//#endregion
export { currentAlerts as n, summary as r, cropAgeDays as t };
