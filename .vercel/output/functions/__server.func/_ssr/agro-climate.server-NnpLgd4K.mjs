import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as string, i as object, r as number } from "../_libs/zod.mjs";
import { n as buildNasaPowerUrl, r as normalizeNasaPowerResponse, t as NASA_POWER_PARAMETERS } from "./nasa-power-service-C1pF7C-A.mjs";
import { n as fetchHistoricalWindowNetClimatology, t as calculate14DayWaterBalance } from "./nasa-power-yoy-C-aNbDCV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agro-climate.server-NnpLgd4K.js
/**
* Agrometeorological thermal time parameters for key crops in Nepal.
* Aligned with NARC / FAO agronomic recommendations.
*/
var CROP_GDD_CATALOG = {
	rice: {
		cropId: "rice",
		nameEn: "Rice (Paddy)",
		nameNe: "धान",
		tBase: 10,
		tUpper: 35,
		stages: [
			{
				stageKey: "vegetative",
				nameEn: "Vegetative (Tillering & Stem Elongation)",
				nameNe: "वानस्पतिक अवस्था (पलाउने र डाँठ बढ्ने)",
				cumulativeGddThreshold: 800,
				isMaturing: false
			},
			{
				stageKey: "flowering",
				nameEn: "Reproductive (Panicle Initiation & Flowering)",
				nameNe: "प्रजनन तथा फूल फुल्ने अवस्था",
				cumulativeGddThreshold: 1150,
				isMaturing: false
			},
			{
				stageKey: "grain_fill",
				nameEn: "Grain Filling / Ripening",
				nameNe: "दाना भरिने तथा पाक्ने अवस्था",
				cumulativeGddThreshold: 1500,
				isMaturing: true
			},
			{
				stageKey: "mature",
				nameEn: "Harvest Maturity",
				nameNe: "बाली पाकेको / काट्न योग्य",
				cumulativeGddThreshold: Infinity,
				isMaturing: true
			}
		],
		citation: {
			sourceTitle: "Rice Knowledge Bank & Varietal Thermal Requirements",
			publishingInstitution: "International Rice Research Institute (IRRI) & NARC National Rice Research Program",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	maize: {
		cropId: "maize",
		nameEn: "Maize",
		nameNe: "मकै",
		tBase: 10,
		tUpper: 30,
		stages: [
			{
				stageKey: "vegetative",
				nameEn: "Vegetative (Emergence to Tasseling)",
				nameNe: "वानस्पतिक अवस्था (उम्रिनेदेखि चमर हाल्नेसम्म)",
				cumulativeGddThreshold: 750,
				isMaturing: false
			},
			{
				stageKey: "flowering",
				nameEn: "Silking & Tasseling",
				nameNe: "जुँगा तथा चमर हाल्ने अवस्था",
				cumulativeGddThreshold: 1050,
				isMaturing: false
			},
			{
				stageKey: "grain_fill",
				nameEn: "Grain Filling (Blister to Dent)",
				nameNe: "दाना भरिने अवस्था",
				cumulativeGddThreshold: 1400,
				isMaturing: true
			},
			{
				stageKey: "mature",
				nameEn: "Physiological Maturity (Black Layer)",
				nameNe: "पूर्ण परिपक्व अवस्था (कालो दाग बस्ने)",
				cumulativeGddThreshold: Infinity,
				isMaturing: true
			}
		],
		citation: {
			sourceTitle: "Maize Production Technologies in Nepal",
			publishingInstitution: "National Maize Research Program (NMRP), Rampur, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	wheat: {
		cropId: "wheat",
		nameEn: "Wheat",
		nameNe: "गहुँ",
		tBase: 4.5,
		tUpper: 30,
		stages: [
			{
				stageKey: "vegetative",
				nameEn: "Vegetative (Crown Root to Jointing)",
				nameNe: "वानस्पतिक अवस्था (जरा हाल्ने र गाँज आउने)",
				cumulativeGddThreshold: 700,
				isMaturing: false
			},
			{
				stageKey: "flowering",
				nameEn: "Heading & Anthesis (Flowering)",
				nameNe: "बाला निस्कने तथा फूल फुल्ने अवस्था",
				cumulativeGddThreshold: 1050,
				isMaturing: false
			},
			{
				stageKey: "grain_fill",
				nameEn: "Grain Filling (Milky / Dough)",
				nameNe: "दाना भरिने अवस्था (दूधिया र पीठो बन्ने)",
				cumulativeGddThreshold: 1450,
				isMaturing: true
			},
			{
				stageKey: "mature",
				nameEn: "Harvest Maturity (Hard Dough)",
				nameNe: "पूर्ण परिपक्व अवस्था (कटनी योग्य)",
				cumulativeGddThreshold: Infinity,
				isMaturing: true
			}
		],
		citation: {
			sourceTitle: "Wheat Production Guidelines for Nepal",
			publishingInstitution: "National Wheat Research Program (NWRP), Bhairahawa, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	potato: {
		cropId: "potato",
		nameEn: "Potato",
		nameNe: "आलु",
		tBase: 7,
		tUpper: 28,
		stages: [
			{
				stageKey: "vegetative",
				nameEn: "Sprouting & Canopy Emergence",
				nameNe: "मुन्टा पलाउने र पात बढ्ने अवस्था",
				cumulativeGddThreshold: 450,
				isMaturing: false
			},
			{
				stageKey: "tuber_initiation",
				nameEn: "Tuber Initiation & Flowering",
				nameNe: "आलुको दाना बन्ने सुरुवाती अवस्था",
				cumulativeGddThreshold: 800,
				isMaturing: false
			},
			{
				stageKey: "tuber_bulking",
				nameEn: "Tuber Bulking",
				nameNe: "आलुको दाना ठूलो हुने अवस्था",
				cumulativeGddThreshold: 1200,
				isMaturing: true
			},
			{
				stageKey: "mature",
				nameEn: "Skin Hardening & Senescence (Maturity)",
				nameNe: "परिपक्व तथा छाला कडा हुने अवस्था",
				cumulativeGddThreshold: Infinity,
				isMaturing: true
			}
		],
		citation: {
			sourceTitle: "Potato Production Technology in Nepal",
			publishingInstitution: "National Potato Research Program (NPRP), Khumaltar, NARC",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2021
		}
	},
	tomato: {
		cropId: "tomato",
		nameEn: "Tomato",
		nameNe: "गोलभेंडा",
		tBase: 10,
		tUpper: 32,
		isApproximate: true,
		stages: [
			{
				stageKey: "vegetative",
				nameEn: "Vegetative Growth",
				nameNe: "वानस्पतिक वृद्धि",
				cumulativeGddThreshold: 600,
				isMaturing: false,
				isApproximate: true
			},
			{
				stageKey: "flowering",
				nameEn: "Flowering & Fruit Set",
				nameNe: "फूल फुल्ने तथा फल लाग्ने",
				cumulativeGddThreshold: 1e3,
				isMaturing: false,
				isApproximate: true
			},
			{
				stageKey: "fruit_development",
				nameEn: "Fruit Development / Breaker Stage",
				nameNe: "फल बढ्ने तथा रङ परिवर्तन हुने अवस्था",
				cumulativeGddThreshold: 1350,
				isMaturing: true,
				isApproximate: true
			},
			{
				stageKey: "mature",
				nameEn: "Red Ripe Harvest Stage",
				nameNe: "रातो पाकेको फल / टिप्ने अवस्था",
				cumulativeGddThreshold: Infinity,
				isMaturing: true,
				isApproximate: true
			}
		],
		citation: {
			sourceTitle: "Commercial Tomato Production in Tunnel and Open Field",
			publishingInstitution: "Horticulture Research Division, NARC, Khumaltar",
			referenceUrl: "https://narc.gov.np/",
			publicationYear: 2020
		}
	}
};
/**
* Compute daily Growing Degree Days using the standard clamped method:
*   GDD = max(0, (min(Tmax, Tupper) + max(Tmin, Tbase)) / 2 - Tbase)
*
* If either temperature input is null or non-finite, returns null (honest missing state).
*/
function calculateDailyGdd(tMax, tMin, tBase, tUpper) {
	if (tMax === null || tMin === null || !Number.isFinite(tMax) || !Number.isFinite(tMin)) return null;
	const gdd = (Math.min(tMax, tUpper) + Math.max(tMin, tBase)) / 2 - tBase;
	return Math.max(0, Math.round(gdd * 100) / 100);
}
/**
* Accumulate GDD from planting date to the latest available observation date.
* Returns cumulative GDD, estimated phenological stage, % progress to next stage,
* and agrometeorological confidence metadata.
*/
function accumulateGdd(options) {
	const { cropId, plantingDate, dailyData } = options;
	const crop = CROP_GDD_CATALOG[cropId];
	if (!crop) return {
		status: "missing",
		reason: `Crop "${cropId}" is not in the GDD phenology catalog. Supported crops: ${Object.keys(CROP_GDD_CATALOG).join(", ")}.`
	};
	if (!/^\d{4}-\d{2}-\d{2}$/.test(plantingDate)) return {
		status: "missing",
		reason: `Invalid planting date format "${plantingDate}". Expected YYYY-MM-DD.`
	};
	if (!dailyData || dailyData.length === 0) return {
		status: "missing",
		reason: "No temperature observations provided."
	};
	const sorted = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));
	const latest = sorted[sorted.length - 1];
	if (!latest) return {
		status: "missing",
		reason: "No temperature observations provided."
	};
	const latestObsDate = latest.date;
	if (plantingDate > latestObsDate) return {
		status: "missing",
		plantingDate,
		latestObservationDate: latestObsDate,
		reason: `Planting date (${plantingDate}) is after the latest available NASA POWER observation date (${latestObsDate}).`
	};
	const windowDays = sorted.filter((d) => d.date >= plantingDate && d.date <= latestObsDate);
	if (windowDays.length === 0) return {
		status: "missing",
		plantingDate,
		latestObservationDate: latestObsDate,
		reason: "No observations found within the crop growth window."
	};
	let cumulativeGdd = 0;
	let daysCounted = 0;
	let missingDaysCount = 0;
	const dailyGddRecords = [];
	for (const day of windowDays) {
		const dailyGdd = calculateDailyGdd(day.t2mMax, day.t2mMin, crop.tBase, crop.tUpper);
		dailyGddRecords.push({
			date: day.date,
			gdd: dailyGdd
		});
		if (dailyGdd !== null) {
			cumulativeGdd += dailyGdd;
			daysCounted++;
		} else missingDaysCount++;
	}
	if (daysCounted === 0) return {
		status: "missing",
		plantingDate,
		latestObservationDate: latestObsDate,
		daysCounted: 0,
		missingDaysCount,
		reason: "All daily temperature records in the growth window were missing or invalid."
	};
	cumulativeGdd = Math.round(cumulativeGdd * 10) / 10;
	const lastStage = crop.stages[crop.stages.length - 1];
	if (!lastStage) return {
		status: "missing",
		reason: "No crop stages configured."
	};
	let previousThreshold = 0;
	let currentStage = lastStage;
	let currentStageIndex = crop.stages.length - 1;
	let nextStage = null;
	let progressPct = 100;
	for (let i = 0; i < crop.stages.length; i++) {
		const stage = crop.stages[i];
		if (!stage) continue;
		if (cumulativeGdd < stage.cumulativeGddThreshold) {
			currentStage = stage;
			currentStageIndex = i;
			nextStage = crop.stages[i + 1] ?? null;
			const stageSpan = stage.cumulativeGddThreshold - previousThreshold;
			const gddIntoStage = cumulativeGdd - previousThreshold;
			progressPct = stageSpan > 0 ? Math.min(100, Math.max(0, Math.round(gddIntoStage / stageSpan * 100))) : 100;
			break;
		}
		previousThreshold = stage.cumulativeGddThreshold;
	}
	const isApproximate = Boolean(crop.isApproximate || currentStage.isApproximate);
	const estimatedStage = {
		stageKey: currentStage.stageKey,
		nameEn: currentStage.nameEn,
		nameNe: currentStage.nameNe,
		stageIndex: currentStageIndex + 1,
		totalStages: crop.stages.length,
		cumulativeGddThreshold: currentStage.cumulativeGddThreshold,
		currentGdd: cumulativeGdd,
		progressPct,
		nextStageNameEn: nextStage?.nameEn ?? null,
		nextStageNameNe: nextStage?.nameNe ?? null,
		isMaturing: Boolean(currentStage.isMaturing),
		isApproximate
	};
	return {
		status: "success",
		cropId: crop.cropId,
		cropNameEn: crop.nameEn,
		cropNameNe: crop.nameNe,
		plantingDate,
		latestObservationDate: latestObsDate,
		cumulativeGdd,
		dailyGddRecords,
		estimatedStage,
		progressToNextStagePct: progressPct,
		confidenceNote: "POWER is a ~0.5° reanalysis grid, so stage is an estimate.",
		isApproximate,
		daysCounted,
		missingDaysCount
	};
}
var agroClimateSchema = object({
	latitude: number().min(-90).max(90),
	longitude: number().min(-180).max(180),
	fieldId: string().optional().default("crop-health"),
	cropId: string().optional().default("rice"),
	plantingDate: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	elevationM: number().optional().default(100)
});
var fetchAgroClimateServerFn_createServerFn_handler = createServerRpc({
	id: "e1c7baa527369cb5d9e188dae6ae4f0a524d8547c05a7ecbc966f5b0fbdbeb44",
	name: "fetchAgroClimateServerFn",
	filename: "src/lib/server-functions/agro-climate.server.ts"
}, (opts) => fetchAgroClimateServerFn.__executeServer(opts));
var fetchAgroClimateServerFn = createServerFn({ method: "POST" }).validator((data) => agroClimateSchema.parse(data)).handler(fetchAgroClimateServerFn_createServerFn_handler, async ({ data }) => {
	const { latitude, longitude, fieldId, cropId, plantingDate, elevationM } = data;
	const retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString();
	const end = /* @__PURE__ */ new Date();
	end.setUTCDate(end.getUTCDate() - 5);
	const toIso = (d) => d.toISOString().slice(0, 10);
	const toCompact = (d) => d.toISOString().slice(0, 10).replaceAll("-", "");
	const effectivePlantingDate = plantingDate ?? (() => {
		const p = new Date(end);
		p.setUTCDate(p.getUTCDate() - 60);
		return toIso(p);
	})();
	const plantObj = /* @__PURE__ */ new Date(effectivePlantingDate + "T00:00:00Z");
	const minStart = new Date(end);
	minStart.setUTCDate(minStart.getUTCDate() - 150);
	const startObj = plantObj < minStart ? minStart : plantObj;
	const startCompact = toCompact(startObj);
	const endCompact = toCompact(end);
	const targetUrl = buildNasaPowerUrl({
		latitude,
		longitude,
		startDate: startCompact,
		endDate: endCompact,
		parameters: NASA_POWER_PARAMETERS,
		community: "AG"
	});
	const defaultProvenance = {
		dataset: "NASA POWER Daily (AG Community)",
		productId: "POWER_DAILY_AG",
		source: "nasa_power",
		resolution: "0.5° × 0.625° / 1° solar",
		temporalResolution: "daily",
		spatialExtractionMethod: "point_nearest_grid",
		processingVersion: "Release 8 / MERRA-2",
		observedAt: toIso(end),
		periodStart: toIso(startObj),
		retrievedAt: retrievalTimestamp,
		quality: "good",
		mode: "live",
		url: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/"
	};
	try {
		const fetchWithRetry = async (url, retries = 2, delayMs = 1e3) => {
			for (let attempt = 0; attempt <= retries; attempt++) {
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 12e3);
				try {
					const res = await fetch(url, {
						signal: controller.signal,
						headers: {
							Accept: "application/json",
							"User-Agent": "KHETKOSAATHI-AgroClimate/2.0 (Nepal Farmer Decision Support)"
						}
					});
					clearTimeout(timeout);
					if (res.ok) return res;
					if (res.status >= 500 && attempt < retries) {
						await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
						continue;
					}
					throw new Error(`NASA POWER API HTTP ${res.status}: ${res.statusText}`);
				} catch (err) {
					clearTimeout(timeout);
					if (attempt < retries && err.name !== "AbortError") {
						await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
						continue;
					}
					throw err;
				}
			}
			throw new Error("Maximum retry attempts reached");
		};
		const json = await (await fetchWithRetry(targetUrl)).json();
		const norm = normalizeNasaPowerResponse(json, {
			fieldId,
			latitude,
			longitude,
			retrievalTimestamp
		});
		const dailyRecords = norm.observations.map((o) => ({
			date: o.date,
			t2mMax: o.t2mMax,
			t2mMin: o.t2mMin,
			rh2m: o.rh2m,
			allskySfcSwDwn: o.allskySfcSwDwn,
			ws2m: o.ws2m ?? null,
			prectotcorr: o.prectotcorr
		}));
		const gdd = accumulateGdd({
			cropId,
			plantingDate: effectivePlantingDate,
			dailyData: dailyRecords
		});
		const currentEnd = new Date(end);
		const currentStart = new Date(currentEnd);
		currentStart.setUTCDate(currentStart.getUTCDate() - 13);
		const historicalNets = await fetchHistoricalWindowNetClimatology({
			latitude,
			longitude,
			fieldId,
			currentStart,
			currentEnd,
			elevationM,
			maxYears: 15
		}).catch(() => []);
		return {
			gdd,
			waterBalance: calculate14DayWaterBalance({
				latitude,
				dailyRecords,
				elevationM,
				historicalWindowNetValues: historicalNets
			}),
			provenance: {
				...defaultProvenance,
				observedAt: norm.provenance.observedAt ?? toIso(end),
				periodStart: norm.provenance.periodStart ?? toIso(startObj),
				quality: norm.provenance.quality
			}
		};
	} catch (err) {
		const error = err;
		console.error("[agro-climate.server] Failed to fetch NASA POWER agro-climate data:", error?.message || error);
		return {
			gdd: {
				status: "missing",
				reason: `NASA POWER data temporarily unavailable: ${error?.message || "Connection timeout"}`
			},
			waterBalance: {
				status: "missing",
				contextNote: "Water balance context: Observational comparison of precipitation against atmospheric evaporative demand (ET₀). Not an irrigation schedule or recommendation.",
				reason: `NASA POWER data temporarily unavailable: ${error?.message || "Connection timeout"}`
			},
			provenance: {
				...defaultProvenance,
				quality: "missing"
			}
		};
	}
});
//#endregion
export { fetchAgroClimateServerFn_createServerFn_handler };
