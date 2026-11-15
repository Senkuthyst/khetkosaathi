import { n as buildNasaPowerUrl, r as normalizeNasaPowerResponse, t as NASA_POWER_PARAMETERS } from "./nasa-power-service-C1pF7C-A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nasa-power-yoy-C-aNbDCV.js
/**
* Compute FAO-56 Penman-Monteith reference evapotranspiration (ET0) for a single day.
*
* Steps and FAO-56 equations documented inline:
*   1. Mean Temperature: T = (Tmax + Tmin) / 2
*   2. Atmospheric Pressure: P = 101.3 * ((293 - 0.0065*z) / 293)^5.26 [Eq. 7]
*   3. Psychrometric Constant: gamma = 0.000665 * P [Eq. 8]
*   4. Saturation Vapour Pressure: es = (e°(Tmax) + e°(Tmin)) / 2 [Eq. 11, 12]
*   5. Actual Vapour Pressure: ea from RHmax/RHmin or RHmean [Eq. 17, 19]
*   6. Slope of Saturation Vapour Pressure Curve: delta [Eq. 13]
*   7. Extraterrestrial Radiation: Ra from solar geometry [Eq. 21-25]
*   8. Clear-Sky Radiation: Rso = (0.75 + 2e-5*z) * Ra [Eq. 37]
*   9. Net Shortwave Radiation: Rns = (1 - 0.23) * Rs [Eq. 38] (albedo alpha = 0.23)
*  10. Net Longwave Radiation: Rnl from Stefan-Boltzmann law and vapor/cloud factors [Eq. 39]
*  11. Net Radiation: Rn = Rns - Rnl [Eq. 40]
*  12. Soil Heat Flux: G = 0 for daily time steps [Eq. 42]
*  13. Wind Speed: u2 at 2 m height (POWER WS2M is already at 2 m; default 2.0 m/s if missing)
*  14. Penman-Monteith Equation: ET0 = (0.408*delta*(Rn - G) + gamma*(900/(T+273))*u2*(es - ea)) / (delta + gamma*(1 + 0.34*u2)) [Eq. 6]
*/
function calculateDailyETo(inputs) {
	const { latitude, date, tMax, tMin, rhMean = null, rhMax = null, rhMin = null, solarRadiationMj, windSpeed2mMps = null, elevationM = 100, dayOfYearOverride } = inputs;
	if (tMax === null || tMin === null || solarRadiationMj === null || !Number.isFinite(tMax) || !Number.isFinite(tMin) || !Number.isFinite(solarRadiationMj) || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null;
	const hasRhRange = rhMax !== null && rhMin !== null && Number.isFinite(rhMax) && Number.isFinite(rhMin);
	if (!hasRhRange && !(rhMean !== null && Number.isFinite(rhMean))) return null;
	const T = (tMax + tMin) / 2;
	const z = Math.max(0, elevationM);
	const gamma = 665e-6 * (101.3 * Math.pow((293 - .0065 * z) / 293, 5.26));
	const e0 = (t) => .6108 * Math.exp(17.27 * t / (t + 237.3));
	const e0Max = e0(tMax);
	const e0Min = e0(tMin);
	const es = (e0Max + e0Min) / 2;
	let ea;
	if (hasRhRange) ea = (e0Min * (rhMax / 100) + e0Max * (rhMin / 100)) / 2;
	else ea = rhMean / 100 * es;
	ea = Math.min(es, Math.max(.001, ea));
	const delta = 4098 * (.6108 * Math.exp(17.27 * T / (T + 237.3))) / Math.pow(T + 237.3, 2);
	let J = dayOfYearOverride;
	if (!J || J < 1 || J > 366) {
		const d = /* @__PURE__ */ new Date(date + "T00:00:00Z");
		const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		J = Math.floor((d.getTime() - startOfYear.getTime()) / 864e5) + 1;
	}
	const phi = latitude * Math.PI / 180;
	const dr = 1 + .033 * Math.cos(2 * Math.PI / 365 * J);
	const deltaSolar = .409 * Math.sin(2 * Math.PI / 365 * J - 1.39);
	const tanTerm = -Math.tan(phi) * Math.tan(deltaSolar);
	const ws = Math.acos(Math.max(-1, Math.min(1, tanTerm)));
	const Ra = 1440 / Math.PI * .082 * dr * (ws * Math.sin(phi) * Math.sin(deltaSolar) + Math.cos(phi) * Math.cos(deltaSolar) * Math.sin(ws));
	const Rso = (.75 + 2e-5 * z) * Ra;
	const Rs = Math.max(0, solarRadiationMj);
	const Rns = .77 * Rs;
	const sigma = 4.903e-9;
	const meanTK4 = (Math.pow(tMax + 273.16, 4) + Math.pow(tMin + 273.16, 4)) / 2;
	const relSolar = Rso > 0 ? Math.max(.3, Math.min(1, Rs / Rso)) : .5;
	const Rn = Rns - sigma * meanTK4 * (.34 - .14 * Math.sqrt(ea)) * (1.35 * relSolar - .35);
	const G = 0;
	const u2 = windSpeed2mMps !== null && Number.isFinite(windSpeed2mMps) ? Math.max(0, windSpeed2mMps) : 2;
	const denominator = delta + gamma * (1 + .34 * u2);
	const ETo = .408 * delta * (Rn - G) / denominator + gamma * (900 / (T + 273)) * u2 * (es - ea) / denominator;
	return Math.max(0, Math.round(ETo * 100) / 100);
}
/**
* Compute the 14-day rolling water balance (Rainfall minus ET0).
* Compares current 14-day balance against the same calendar window across
* historical years to evaluate atmospheric moisture supply vs evaporative demand.
*
* Safeguards: Pure observational context; never provides irrigation schedules or advice.
*/
function calculate14DayWaterBalance(options) {
	const { latitude, dailyRecords, elevationM, historicalWindowNetValues = [] } = options;
	const defaultNote = "Water balance context: Observational comparison of precipitation against atmospheric evaporative demand (ET₀). Not an irrigation schedule or recommendation.";
	if (!dailyRecords || dailyRecords.length === 0) return {
		status: "missing",
		contextNote: defaultNote,
		reason: "No meteorological observations provided for water balance calculation."
	};
	const windowDays = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
	if (windowDays.length < 5) return {
		status: "missing",
		contextNote: defaultNote,
		reason: `Insufficient observation days (${windowDays.length} days found, minimum 5 required for a meaningful 14-day rolling balance).`
	};
	let totalRain = 0;
	let totalET0 = 0;
	let validDaysCount = 0;
	const dailyBreakdown = [];
	for (const day of windowDays) {
		const et0 = calculateDailyETo({
			latitude,
			date: day.date,
			tMax: day.t2mMax,
			tMin: day.t2mMin,
			rhMean: day.rh2m,
			solarRadiationMj: day.allskySfcSwDwn,
			windSpeed2mMps: day.ws2m,
			elevationM
		});
		const rain = day.prectotcorr;
		const net = rain !== null && et0 !== null ? Math.round((rain - et0) * 100) / 100 : null;
		dailyBreakdown.push({
			date: day.date,
			rainMm: rain !== null ? Math.round(rain * 10) / 10 : null,
			et0Mm: et0,
			netMm: net
		});
		if (rain !== null && et0 !== null) {
			totalRain += rain;
			totalET0 += et0;
			validDaysCount++;
		}
	}
	if (validDaysCount === 0) return {
		status: "missing",
		contextNote: defaultNote,
		reason: "All days in the 14-day evaluation window were missing solar, temperature, or rainfall records."
	};
	const roundedRain = Math.round(totalRain * 10) / 10;
	const roundedET0 = Math.round(totalET0 * 10) / 10;
	const rollingNet = Math.round((roundedRain - roundedET0) * 10) / 10;
	let climatologicalPercentile = null;
	if (historicalWindowNetValues.length >= 3) {
		const strictlyLower = historicalWindowNetValues.filter((v) => v < rollingNet).length;
		climatologicalPercentile = Math.round(strictlyLower / historicalWindowNetValues.length * 100);
	}
	return {
		status: "success",
		windowStart: windowDays[0].date,
		windowEnd: windowDays[windowDays.length - 1].date,
		totalRainfallMm: roundedRain,
		totalEToMm: roundedET0,
		rollingNetMm: rollingNet,
		climatologicalPercentile,
		historicalYearsCount: historicalWindowNetValues.length,
		dailyBreakdown,
		contextNote: defaultNote
	};
}
/**
* Compare rainfall for a recent N-day window this year vs the same window last year
*/
async function fetchPowerRainfallYearOverYear(options) {
	const { latitude, longitude, fieldId = "plot-1", windowDays = 7 } = options;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const currentEnd = /* @__PURE__ */ new Date();
	currentEnd.setUTCDate(currentEnd.getUTCDate() - 5);
	const currentStart = new Date(currentEnd);
	currentStart.setUTCDate(currentStart.getUTCDate() - (windowDays - 1));
	const lastEnd = new Date(currentEnd);
	lastEnd.setUTCFullYear(lastEnd.getUTCFullYear() - 1);
	const lastStart = new Date(currentStart);
	lastStart.setUTCFullYear(lastStart.getUTCFullYear() - 1);
	const toCompact = (d) => d.toISOString().slice(0, 10).replaceAll("-", "");
	const toIso = (d) => d.toISOString().slice(0, 10);
	const [currUrl, lastUrl] = [buildNasaPowerUrl({
		latitude,
		longitude,
		startDate: toCompact(currentStart),
		endDate: toCompact(currentEnd),
		parameters: ["PRECTOTCORR"],
		community: "AG"
	}), buildNasaPowerUrl({
		latitude,
		longitude,
		startDate: toCompact(lastStart),
		endDate: toCompact(lastEnd),
		parameters: ["PRECTOTCORR"],
		community: "AG"
	})];
	const [currRes, lastRes] = await Promise.all([fetch(currUrl).then((r) => r.ok ? r.json() : null), fetch(lastUrl).then((r) => r.ok ? r.json() : null)]);
	const currNorm = currRes ? normalizeNasaPowerResponse(currRes, {
		fieldId,
		latitude,
		longitude,
		retrievalTimestamp
	}) : null;
	const lastNorm = lastRes ? normalizeNasaPowerResponse(lastRes, {
		fieldId,
		latitude,
		longitude,
		retrievalTimestamp
	}) : null;
	const currDays = currNorm?.observations || [];
	const lastDays = lastNorm?.observations || [];
	const currTotal = currDays.reduce((acc, d) => acc + (d.prectotcorr ?? 0), 0);
	const lastTotal = lastDays.reduce((acc, d) => acc + (d.prectotcorr ?? 0), 0);
	const deltaMm = Math.round((currTotal - lastTotal) * 100) / 100;
	const deltaPct = lastTotal > 0 ? Math.round((currTotal - lastTotal) / lastTotal * 1e3) / 10 : null;
	const dailyComparison = currDays.map((curr, idx) => ({
		dayIndex: idx + 1,
		currentDate: curr.date,
		currentRainMm: curr.prectotcorr,
		lastDate: lastDays[idx]?.date || "",
		lastRainMm: lastDays[idx]?.prectotcorr ?? null
	}));
	return {
		latitude,
		longitude,
		fieldId,
		currentYearStart: toIso(currentStart),
		currentYearEnd: toIso(currentEnd),
		lastYearStart: toIso(lastStart),
		lastYearEnd: toIso(lastEnd),
		currentYearTotalMm: Math.round(currTotal * 100) / 100,
		lastYearTotalMm: Math.round(lastTotal * 100) / 100,
		deltaMm,
		deltaPct,
		retrievalTimestamp,
		dailyComparison
	};
}
/**
* Fetch historical 14-day window water balance values (Rainfall minus ET0)
* across the past 15 years to construct empirical climatological distribution.
*/
async function fetchHistoricalWindowNetClimatology(options) {
	const { latitude, longitude, fieldId = "plot-1", currentStart, currentEnd, elevationM = 100, maxYears = 15 } = options;
	const toCompact = (d) => d.toISOString().slice(0, 10).replaceAll("-", "");
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const fetchYearNet = async (yearsAgo) => {
		try {
			const start = new Date(currentStart);
			start.setUTCFullYear(start.getUTCFullYear() - yearsAgo);
			const end = new Date(currentEnd);
			end.setUTCFullYear(end.getUTCFullYear() - yearsAgo);
			const url = buildNasaPowerUrl({
				latitude,
				longitude,
				startDate: toCompact(start),
				endDate: toCompact(end),
				parameters: NASA_POWER_PARAMETERS,
				community: "AG"
			});
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 8e3);
			const res = await fetch(url, { signal: controller.signal }).catch(() => null);
			clearTimeout(timeout);
			if (!res || !res.ok) return null;
			const json = await res.json().catch(() => null);
			if (!json) return null;
			const norm = normalizeNasaPowerResponse(json, {
				fieldId,
				latitude,
				longitude,
				retrievalTimestamp
			});
			if (!norm || norm.observations.length === 0) return null;
			let yearTotalRain = 0;
			let yearTotalET0 = 0;
			let validDays = 0;
			for (const obs of norm.observations) {
				const et0 = calculateDailyETo({
					latitude,
					date: obs.date,
					tMax: obs.t2mMax,
					tMin: obs.t2mMin,
					rhMean: obs.rh2m,
					solarRadiationMj: obs.allskySfcSwDwn,
					windSpeed2mMps: obs.ws2m,
					elevationM
				});
				if (obs.prectotcorr !== null && et0 !== null) {
					yearTotalRain += obs.prectotcorr;
					yearTotalET0 += et0;
					validDays++;
				}
			}
			if (validDays < 5) return null;
			return Math.round((yearTotalRain - yearTotalET0) * 10) / 10;
		} catch {
			return null;
		}
	};
	const tasks = [];
	for (let y = 1; y <= maxYears; y++) tasks.push(fetchYearNet(y));
	const results = await Promise.allSettled(tasks);
	const netValues = [];
	for (const r of results) if (r.status === "fulfilled" && r.value !== null) netValues.push(r.value);
	return netValues;
}
//#endregion
export { fetchHistoricalWindowNetClimatology as n, fetchPowerRainfallYearOverYear as r, calculate14DayWaterBalance as t };
