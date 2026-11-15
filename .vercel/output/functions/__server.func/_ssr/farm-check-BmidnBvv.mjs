import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, u as cn } from "./kit-DW9Ou9p5.mjs";
import { t as LazyMap } from "./LazyMap-Di1JnT8X.mjs";
import { n as buildNasaPowerUrl, r as normalizeNasaPowerResponse } from "./nasa-power-service-CNZL48Yf.mjs";
import { n as fetchLiveHlsVegetation } from "./nasa-client-CLI3jpdr.mjs";
import { n as reverseGeocodeCoordinates, t as getCurrentBrowserCoordinates } from "./geolocation-service-jVN4pwtD.mjs";
import { r as evaluateNextCrops } from "./crop-advisory-engine-51jRVodT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/farm-check-BmidnBvv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
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
var PRECEDING_CROPS = [
	{
		id: "rice",
		nameEn: "Rice",
		nameNe: "धान",
		icon: "🌾",
		descEn: "Paddy crop",
		descNe: "धान बाली"
	},
	{
		id: "maize",
		nameEn: "Maize",
		nameNe: "मकै",
		icon: "🌽",
		descEn: "Corn crop",
		descNe: "मकै बाली"
	},
	{
		id: "wheat",
		nameEn: "Wheat",
		nameNe: "गहुँ",
		icon: "🌾",
		descEn: "Rabi cereal",
		descNe: "गहुँ बाली"
	},
	{
		id: "potato",
		nameEn: "Potato",
		nameNe: "आलु",
		icon: "🥔",
		descEn: "Tuber crop",
		descNe: "आलु बाली"
	},
	{
		id: "tomato",
		nameEn: "Tomato",
		nameNe: "गोलभेंडा",
		icon: "🍅",
		descEn: "Solanaceous fruit",
		descNe: "गोलभेंडा बाली"
	}
];
function FarmCheckPage() {
	const { lang, farmFields, selectedField } = useApp();
	const [coords, setCoords] = (0, import_react.useState)(selectedField ? [selectedField.latitude, selectedField.longitude] : [27.6775, 84.4333]);
	const [locationName, setLocationName] = (0, import_react.useState)(selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Chitwan"})` : "Chitwan Valley, Nepal");
	const [locatingGps, setLocatingGps] = (0, import_react.useState)(false);
	const [locationError, setLocationError] = (0, import_react.useState)(null);
	const [selectedCrop, setSelectedCrop] = (0, import_react.useState)("rice");
	const [isAnalyzing, setIsAnalyzing] = (0, import_react.useState)(false);
	const [hasAnalyzed, setHasAnalyzed] = (0, import_react.useState)(false);
	const [hlsSummary, setHlsSummary] = (0, import_react.useState)(null);
	const [rainfallYoY, setRainfallYoY] = (0, import_react.useState)(null);
	const [topCrops, setTopCrops] = (0, import_react.useState)([]);
	const [analysisError, setAnalysisError] = (0, import_react.useState)(null);
	const handleAcquireGps = async () => {
		setLocatingGps(true);
		setLocationError(null);
		try {
			const pos = await getCurrentBrowserCoordinates();
			const newCoords = [pos.latitude, pos.longitude];
			setCoords(newCoords);
			const geocoded = await reverseGeocodeCoordinates(pos.latitude, pos.longitude);
			setLocationName(geocoded.displayName || `${pos.latitude.toFixed(4)}° N, ${pos.longitude.toFixed(4)}° E`);
		} catch (err) {
			setLocationError(err.message || "Could not retrieve GPS coordinates.");
		} finally {
			setLocatingGps(false);
		}
	};
	const handleSelectSavedFarm = (fieldId) => {
		const f = farmFields.find((item) => item.id === fieldId);
		if (!f) return;
		setCoords([f.latitude, f.longitude]);
		setLocationName(`${f.fieldName}${f.municipality ? ` · ${f.municipality}` : ""}`);
		if (f.cropType && PRECEDING_CROPS.some((c) => c.id === f.cropType.toLowerCase())) setSelectedCrop(f.cropType.toLowerCase());
		setLocationError(null);
	};
	const handleRunFarmCheck = async () => {
		if (!coords) return;
		setIsAnalyzing(true);
		setAnalysisError(null);
		const [lat, lon] = coords;
		try {
			const hlsPromise = fetchLiveHlsVegetation({
				fieldId: "farm-check-plot",
				latitude: lat,
				longitude: lon,
				windowDays: 30
			});
			const rainPromise = fetchPowerRainfallYearOverYear({
				latitude: lat,
				longitude: lon,
				fieldId: "farm-check-plot",
				windowDays: 14
			});
			const [hlsRes, rainRes] = await Promise.allSettled([hlsPromise, rainPromise]);
			const hlsData = hlsRes.status === "fulfilled" ? hlsRes.value : null;
			const rainData = rainRes.status === "fulfilled" ? rainRes.value : null;
			setHlsSummary(hlsData);
			setRainfallYoY(rainData);
			const targetField = {
				id: "farm-check-temp",
				userId: "farmer-session",
				fieldName: locationName,
				latitude: lat,
				longitude: lon,
				boundary: [[lat, lon]],
				boundaryFeature: {
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [[
							[lon, lat],
							[lon + .001, lat],
							[lon + .001, lat + .001],
							[lon, lat + .001],
							[lon, lat]
						]]
					},
					properties: { name: locationName }
				},
				areaM2: 4046,
				areaUnit: "ropani",
				cropType: selectedCrop,
				plantingDate: (/* @__PURE__ */ new Date(Date.now() - 7776e6)).toISOString().slice(0, 10),
				irrigationType: "rainfed",
				isPrimary: true,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			const suitabilityResults = evaluateNextCrops(targetField, {
				recentAvgTempC: 22.5,
				recentMaxTempC: 28,
				recentMinTempC: 16,
				recentRainSumMm: rainData?.currentYearTotalMm ?? null,
				soilMoisturePct: null
			});
			const priorityOrder = {
				highly_suitable: 3,
				suitable: 2,
				caution: 1,
				unsuitable: 0
			};
			const sorted = [...suitabilityResults].sort((a, b) => (priorityOrder[b.suitabilityStatus] ?? 0) - (priorityOrder[a.suitabilityStatus] ?? 0));
			setTopCrops(sorted.slice(0, 3));
			setHasAnalyzed(true);
		} catch (err) {
			setAnalysisError(err.message || "Failed to complete farm telemetry analysis.");
		} finally {
			setIsAnalyzing(false);
		}
	};
	const latestNdvi = hlsSummary?.latestNdvi ?? null;
	let vegLight = "missing";
	let vegLabelEn = "No clear satellite image";
	let vegLabelNe = "कुनै सफा उपग्रह तस्विर छैन";
	if (latestNdvi !== null) if (latestNdvi >= .5) {
		vegLight = "green";
		vegLabelEn = "Good Vegetation Health";
		vegLabelNe = "हरियाली राम्रो छ";
	} else if (latestNdvi >= .25) {
		vegLight = "yellow";
		vegLabelEn = "Moderate Canopy Density";
		vegLabelNe = "मध्यम हरियाली";
	} else {
		vegLight = "red";
		vegLabelEn = "Low / Sparse Vegetation";
		vegLabelNe = "कम हरियाली वा खाली जग्गा";
	}
	const mapCenter = coords ?? [27.6775, 84.4333];
	const markers = [{
		position: mapCenter,
		color: "#16a34a",
		fillColor: "#22c55e",
		radius: 10,
		label: lang === "ne" ? "तपाईंको खेत" : "Your Farm",
		tooltipContent: `<b>${locationName}</b><br/>${mapCenter[0].toFixed(4)}° N, ${mapCenter[1].toFixed(4)}° E`
	}];
	const offsets = [
		[.0012, .0012],
		[-.0012, .0012],
		[.0012, -.0012]
	];
	topCrops.forEach((crop, idx) => {
		const off = offsets[idx] || [.001, .001];
		markers.push({
			position: [mapCenter[0] + off[0], mapCenter[1] + off[1]],
			color: "#2563eb",
			fillColor: "#3b82f6",
			radius: 8,
			label: lang === "ne" ? crop.nameNe : crop.nameEn,
			tooltipContent: `<b>${crop.nameNe} (${crop.nameEn})</b><br/>${crop.suitabilityStatus === "highly_suitable" ? lang === "ne" ? "उच्च उपयुक्त" : "Highly Suitable" : lang === "ne" ? "उपयुक्त" : "Suitable"}<br/>${lang === "ne" ? "रोप्ने समय" : "Planting"}: ${crop.recommendedPlantingWindow}`
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card via-card to-secondary/30 p-5 sm:p-7 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3.5 w-3.5" }), lang === "ne" ? "छिटो खेत जाँच" : "Quick Farm Check"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-satellite/10 px-2.5 py-1 text-xs font-bold text-satellite",
							children: "NASA 30m HLS Telemetry"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight",
						children: lang === "ne" ? "खेत जाँच तथा बाली उपयुक्तता" : "Farm Check & Land Suitability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed",
						children: lang === "ne" ? "आफ्नो खेतको स्थान पत्ता लगाई हालको ३० मिटर नासा उपग्रह हरियाली, गत वर्षको तुलना र जग्गा अनुसार उपयुक्त बालीहरू हेर्नुहोस्।" : "Check your land with 30m NASA satellite vegetation telemetry, year-over-year rainfall comparisons, and scientifically suitable crops."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black",
								children: "1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base sm:text-lg font-bold text-foreground",
								children: lang === "ne" ? "तपाईंको खेत कहाँ छ?" : "Where is your farm?"
							})]
						}), farmFields.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "वा बचत गरिएको खेत:" : "Or saved farm:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Select saved farm field",
								onChange: (e) => handleSelectSavedFarm(e.target.value),
								className: "rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
								defaultValue: "",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: lang === "ne" ? "खेत छान्नुहोस्..." : "Choose farm..."
								}), farmFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: f.id,
									children: [
										f.fieldName,
										" (",
										f.municipality || "Nepal",
										")"
									]
								}, f.id))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleAcquireGps,
						disabled: locatingGps,
						className: "w-full flex items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground p-4 sm:p-5 text-base sm:text-lg font-black shadow-md hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Navigation, { className: cn("h-5 w-5 sm:h-6 sm:w-6", locatingGps && "animate-spin") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: locatingGps ? lang === "ne" ? "स्थान पत्ता लगाउँदै..." : "Acquiring GPS location..." : lang === "ne" ? "मेरो खेत जाँच गर्नुहोस् (हालको स्थान)" : "Check my farm (Current Location)" })]
					}),
					coords && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs sm:text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground truncate",
								children: locationName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-muted-foreground font-mono text-xs",
							children: [
								coords[0].toFixed(4),
								"° N, ",
								coords[1].toFixed(4),
								"° E"
							]
						})]
					}),
					locationError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: locationError })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black",
							children: "2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-bold text-foreground",
							children: lang === "ne" ? "तपाईंले भर्खरै के लगाउनुभएको थियो?" : "What did you grow?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: lang === "ne" ? "उचित बाली चक्र पहिचान गर्न अघिल्लो बाली छान्नुहोस्" : "Select your previous crop to determine rotation compatibility"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3",
						children: PRECEDING_CROPS.map((crop) => {
							const isSelected = selectedCrop === crop.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedCrop(crop.id),
								className: cn("flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all relative border-2 min-h-[96px]", isSelected ? "border-primary bg-primary/10 shadow-sm text-foreground ring-2 ring-primary/20" : "border-border bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground"),
								children: [
									isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl mb-1",
										children: crop.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-extrabold text-sm sm:text-base text-foreground",
										children: lang === "ne" ? crop.nameNe : crop.nameEn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: lang === "ne" ? crop.nameEn : crop.nameNe
									})
								]
							}, crop.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleRunFarmCheck,
							disabled: isAnalyzing || !coords,
							className: "w-full flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground p-3.5 text-sm sm:text-base font-extrabold shadow-xs transition-all disabled:opacity-50",
							children: isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "नासा उपग्रह विश्लेषण हुँदैछ..." : "Analyzing NASA satellite telemetry..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "खेतको पूर्ण विश्लेषण गर्नुहोस्" : "Run Farm Check Analysis" })] })
						})
					})
				]
			}),
			analysisError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: analysisError })]
			}),
			hasAnalyzed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 animate-in fade-in duration-300",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Satellite, { className: "h-5 w-5 text-satellite" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-lg font-black text-foreground",
										children: lang === "ne" ? "वनस्पति हरियाली स्थिति (NDVI)" : "Vegetation Health Status (NDVI)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-muted px-2 py-0.5 font-semibold text-foreground",
										children: hlsSummary?.dataSource || "NASA HLS 30m"
									}), hlsSummary?.currentYearObservation?.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px]",
										children: hlsSummary.currentYearObservation.date
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-muted/30 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center justify-center shrink-0",
									children: [
										vegLight === "green" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-12 w-12 rounded-full bg-emerald-500/20 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-10 w-10 rounded-full bg-emerald-500 border-4 border-emerald-200 shadow-md flex items-center justify-center text-white font-bold text-lg",
											children: "✓"
										})] }),
										vegLight === "yellow" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-12 w-12 rounded-full bg-amber-500/20 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-10 w-10 rounded-full bg-amber-500 border-4 border-amber-200 shadow-md flex items-center justify-center text-white font-bold text-lg",
											children: "!"
										})] }),
										vegLight === "red" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-12 w-12 rounded-full bg-rose-500/20 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-10 w-10 rounded-full bg-rose-500 border-4 border-rose-200 shadow-md flex items-center justify-center text-white font-bold text-lg",
											children: "✕"
										})] }),
										vegLight === "missing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-10 w-10 rounded-full bg-gray-400 border-4 border-gray-200 shadow-sm flex items-center justify-center text-white font-bold text-sm",
											children: "?"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-base sm:text-lg font-black text-foreground",
												children: lang === "ne" ? vegLabelNe : vegLabelEn
											}), latestNdvi !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10",
												children: ["NDVI: ", latestNdvi.toFixed(2)]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-muted-foreground px-2 py-0.5 rounded-md bg-muted",
												children: lang === "ne" ? "बादलले ढाकिएको" : "Cloud Masked"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground leading-relaxed",
											children: latestNdvi !== null ? lang === "ne" ? `३० मिटर रिजोल्युसन भएको नासा उपग्रहले यो जग्गाको हरियाली इन्डेक्स ${latestNdvi.toFixed(2)} देखाएको छ।` : `NASA 30m surface reflectance indicates an active canopy greenness index of ${latestNdvi.toFixed(2)}.` : lang === "ne" ? "पछिल्लो ३० दिनमा यस स्थानमा २०% भन्दा बढी बादल भएकाले सफा तस्विर उपलब्ध भएन। कुनै नक्कली डाटा देखाइएको छैन।" : "Observation window exceeded 20% cloud cover. No synthetic or estimated values are displayed."
										}),
										hlsSummary?.isFallback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "विकल्प:" : "Fallback:" }),
												" ",
												hlsSummary.fallbackReason
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card p-4 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs font-extrabold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CloudRain, { className: "h-4 w-4 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "वर्षा तुलना (गत वर्षको तुलनामा)" : "Rainfall vs Last Year" })]
									}), rainfallYoY ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-foreground",
										children: rainfallYoY.deltaPct !== null && Math.abs(rainfallYoY.deltaPct) >= 5 ? rainfallYoY.deltaPct < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-600",
											children: lang === "ne" ? `गत वर्षको तुलनामा ${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% कम वर्षा` : `${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% less rain than last year at this time`
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-600",
											children: lang === "ne" ? `गत वर्षको तुलनामा ${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% बढी वर्षा` : `${Math.abs(rainfallYoY.deltaPct).toFixed(0)}% more rain than last year at this time`
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "गत वर्षको समान अवधिसँग वर्षा मिल्दोजुल्दो छ" : "Rainfall is comparable to the same window last year" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground font-mono",
										children: [
											rainfallYoY.currentYearTotalMm.toFixed(1),
											" mm vs ",
											rainfallYoY.lastYearTotalMm.toFixed(1),
											" mm (14-day window)"
										]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: lang === "ne" ? "नासा POWER वर्षा डाटा प्राप्त हुन सकेन।" : "NASA POWER precipitation telemetry unavailable."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card p-4 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs font-extrabold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "हरियाली तुलना (गत वर्षको तुलनामा)" : "Vegetation vs Last Year" })]
									}), hlsSummary?.lastYearObservation?.ndvi != null && latestNdvi != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-foreground",
										children: hlsSummary.ndviDelta != null && Math.abs(hlsSummary.ndviDelta) >= .05 ? hlsSummary.ndviDelta < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-600",
											children: lang === "ne" ? "गत वर्ष यस समयको तुलनामा हरियाली कम छ" : "Vegetation is lower than last year at this time"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-600",
											children: lang === "ne" ? "गत वर्ष यस समयको तुलनामा हरियाली बढी छ" : "Vegetation is higher than last year at this time"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "गत वर्ष यस समयको तुलनामा हरियाली स्थिर छ" : "Vegetation is stable compared to last year at this time" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground font-mono",
										children: [
											"NDVI ",
											latestNdvi.toFixed(2),
											" vs ",
											hlsSummary.lastYearObservation.ndvi.toFixed(2)
										]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: lang === "ne" ? "गत वर्षको समान अवधिको सफा उपग्रह तस्विर फेला परेन।" : "No clear satellite scene from the exact same calendar window last year."
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base sm:text-lg font-black text-foreground",
									children: lang === "ne" ? "यस जग्गाको लागि उपयुक्त बालीहरू" : "Suitable crops for this land"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: lang === "ne" ? "NARC बाली चक्र विज्ञान तथा स्थानीय सिजन अनुसार उपयुक्त शीर्ष ३ विकल्पहरू" : "Top 3 suitable rotation options grounded in NARC agronomy and current seasonal calendar"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
									children: lang === "ne" ? "बाली चक्र सिफारिस" : "Rotation Advisory"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-3",
								children: topCrops.map((crop, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-muted/20 p-4 space-y-2.5 hover:border-primary/40 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold",
												children: idx + 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", crop.suitabilityStatus === "highly_suitable" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-blue-100 text-blue-800 border border-blue-300"),
												children: crop.suitabilityStatus === "highly_suitable" ? lang === "ne" ? "उच्च उपयुक्त" : "Highly Suitable" : lang === "ne" ? "उपयुक्त" : "Suitable"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-base font-extrabold text-foreground",
											children: lang === "ne" ? crop.nameNe : crop.nameEn
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												lang === "ne" ? crop.nameEn : crop.nameNe,
												" · ",
												crop.family,
												" family"
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs space-y-1 border-t border-border/60 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: crop.recommendedPlantingWindow
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													lang === "ne" ? "पाक्ने समय:" : "Duration:",
													" ",
													crop.growthDurationDays[0],
													"–",
													crop.growthDurationDays[1],
													" ",
													lang === "ne" ? "दिन" : "days"
												]
											})]
										}),
										crop.rotationBenefits && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground line-clamp-2 leading-relaxed bg-background/50 p-2 rounded-lg border border-border/40",
											children: ["💡 ", crop.rotationBenefits]
										})
									]
								}, crop.cropId))
							}),
							topCrops.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground py-4 text-center",
								children: lang === "ne" ? "कुनै उपयुक्त बाली फेला परेन।" : "No suitable crops identified for current input parameters."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm sm:text-base font-bold text-foreground",
										children: lang === "ne" ? "खेत नक्सा र सिफारिस पिनहरू" : "Farm Location & Advisory Pins"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground font-mono",
									children: [
										mapCenter[0].toFixed(4),
										"° N, ",
										mapCenter[1].toFixed(4),
										"° E"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl overflow-hidden border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
									center: mapCenter,
									zoom: 15,
									markers,
									height: 320
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground text-center",
								children: lang === "ne" ? "हरियो पिनले तपाईंको खेत देखाउँछ; नीलो पिनहरूले यस जग्गाको लागि उपयुक्त बालीहरूको सिफारिस स्थान देखाउँछन्।" : "Green marker pinpoints your farm centroid; blue pins illustrate candidate suitable rotation zones."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-amber-300/80 bg-amber-50/70 p-5 text-xs text-amber-950 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-extrabold text-amber-900 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-4 w-4 shrink-0 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "कृषि सल्लाह सुरक्षा र नियमहरू (Safeguards)" : "Agricultural Advisory Safeguards & Disclaimers" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-amber-800",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "उपयुक्त बाली मात्र:" : "Suitable crops only:" }),
											" ",
											lang === "ne" ? "यो सिफारिस बाली चक्र र सिजनमा आधारित छ। यसले उत्पादनको ग्यारेन्टी गर्दैन।" : "Presents suitable rotation candidates only; never forecasts yield or revenue."
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-amber-800",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "कुनै रोग निदान होइन:" : "No disease diagnosis:" }),
											" ",
											lang === "ne" ? "उपग्रह हरियालीले बोटको सामान्य अवस्था देखाउँछ, कुनै रोग वा कीराको निदान गर्दैन।" : "Satellite vegetation reflectance measures canopy vigor, not specific plant diseases or pathogens."
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-amber-800",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "कुनै विषादी/मल सल्लाह छैन:" : "No pesticide/fertiliser advice:" }),
											" ",
											lang === "ne" ? "विषादी वा मल प्रयोग गर्दा स्थानीय कृषि प्राविधिक वा कृषि ज्ञान केन्द्रसँग सल्लाह लिनुहोस्।" : "Never use this tool for pesticide or chemical dosage decisions. Consult local agricultural extension."
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-amber-800",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "निदान होइन:" : "Not a diagnosis:" }),
											" ",
											lang === "ne" ? "उपग्रह अनुमानहरू केवल पूर्व-सूचना हुन्। रोप्नु अघि माटो र खेतको अवस्था आफैं जाँच्नुहोस्।" : "Satellite estimates are indicative indicators, not an in-field agronomic diagnosis."
										] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-amber-200/80 pt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-amber-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									lang === "ne" ? "डेटा स्रोत:" : "Data Provenance:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: hlsSummary?.dataSource || "NASA HLS 30m / MODIS" })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lang === "ne" ? "प्रशोधन:" : "Processing:", " LP DAAC CMR STAC + NASA POWER API"] })]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { FarmCheckPage as component };
