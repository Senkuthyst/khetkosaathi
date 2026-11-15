import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, n as cn } from "./utils-DhMm3-3l.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { t as LazyMap } from "./LazyMap-D_z1skVW.mjs";
import { n as buildNasaPowerUrl, r as normalizeNasaPowerResponse } from "./nasa-power-service-CNZL48Yf.mjs";
import { n as fetchLiveHlsVegetation } from "./nasa-client-CLI3jpdr.mjs";
import { n as reverseGeocodeCoordinates, t as getCurrentBrowserCoordinates } from "./geolocation-service-jVN4pwtD.mjs";
import { r as evaluateNextCrops } from "./crop-advisory-engine-51jRVodT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FarmCheckFlow-CsCBRuJ1.js
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
		nameEn: "Rice (धान)",
		nameNe: "धान (Rice)",
		icon: "🌾",
		descEn: "Paddy crop",
		descNe: "मुख्य वर्षे बाली"
	},
	{
		id: "maize",
		nameEn: "Maize (मकै)",
		nameNe: "मकै (Maize)",
		icon: "🌽",
		descEn: "Corn crop",
		descNe: "पहाड र तराईको अन्न"
	},
	{
		id: "wheat",
		nameEn: "Wheat (गहुँ)",
		nameNe: "गहुँ (Wheat)",
		icon: "🌾",
		descEn: "Rabi cereal",
		descNe: "हिउँदे प्रमुख बाली"
	},
	{
		id: "potato",
		nameEn: "Potato (आलु)",
		nameNe: "आलु (Potato)",
		icon: "🥔",
		descEn: "Tuber crop",
		descNe: "तरकारी तथा नगदे"
	},
	{
		id: "tomato",
		nameEn: "Tomato (गोलभेंडा)",
		nameNe: "गोलभेंडा (Tomato)",
		icon: "🍅",
		descEn: "Solanaceous fruit",
		descNe: "नगदे तरकारी बाली"
	}
];
function FarmCheckFlow({ className, onViewDashboard }) {
	const { lang, farmFields, selectedField } = useApp();
	const [step, setStep] = (0, import_react.useState)(1);
	const [coords, setCoords] = (0, import_react.useState)(selectedField ? [selectedField.latitude, selectedField.longitude] : null);
	const [locationName, setLocationName] = (0, import_react.useState)(selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "");
	const [locatingGps, setLocatingGps] = (0, import_react.useState)(false);
	const [locationError, setLocationError] = (0, import_react.useState)(null);
	const [showManualPicker, setShowManualPicker] = (0, import_react.useState)(false);
	const [manualLat, setManualLat] = (0, import_react.useState)("27.6775");
	const [manualLon, setManualLon] = (0, import_react.useState)("84.4333");
	const [selectedCrop, setSelectedCrop] = (0, import_react.useState)("rice");
	const [isAnalyzing, setIsAnalyzing] = (0, import_react.useState)(false);
	const [hlsSummary, setHlsSummary] = (0, import_react.useState)(null);
	const [rainfallYoY, setRainfallYoY] = (0, import_react.useState)(null);
	const [topCrops, setTopCrops] = (0, import_react.useState)([]);
	const [analysisError, setAnalysisError] = (0, import_react.useState)(null);
	const [isSpeaking, setIsSpeaking] = (0, import_react.useState)(false);
	const [hasSpeechSupport, setHasSpeechSupport] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) setHasSpeechSupport(true);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
		};
	}, [step]);
	const handleAcquireGps = async () => {
		setLocatingGps(true);
		setLocationError(null);
		try {
			const pos = await getCurrentBrowserCoordinates();
			const newCoords = [pos.latitude, pos.longitude];
			setCoords(newCoords);
			const geocoded = await reverseGeocodeCoordinates(pos.latitude, pos.longitude);
			setLocationName(geocoded.displayName || `${pos.latitude.toFixed(4)}° N, ${pos.longitude.toFixed(4)}° E`);
			setStep(2);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setLocationError(lang === "ne" ? "तपाईंको फोनको जीपीएस स्थान पत्ता लागेन। कृपया फोनको 'Location' अन गर्नुहोस् वा तल 'नक्सामा छान्नुहोस्' रोज्नुहोस्।" : `${msg}. Please enable location permissions or choose 'Pick on map' below.`);
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
		setStep(2);
	};
	const handleApplyManualCoords = () => {
		const lat = parseFloat(manualLat);
		const lon = parseFloat(manualLon);
		if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
			alert(lang === "ne" ? "कृपया मान्य अक्षांश र देशान्तर राख्नुहोस्।" : "Please enter valid coordinates.");
			return;
		}
		setCoords([lat, lon]);
		setLocationName(`${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
		setLocationError(null);
		setStep(2);
	};
	const handleRunAnalysis = async (cropIdToUse = selectedCrop) => {
		if (!coords) return;
		setStep(3);
		setIsAnalyzing(true);
		setAnalysisError(null);
		const [lat, lon] = coords;
		try {
			const hlsPromise = fetchLiveHlsVegetation({
				fieldId: "farm-check-flow",
				latitude: lat,
				longitude: lon,
				windowDays: 30
			});
			const rainPromise = fetchPowerRainfallYearOverYear({
				latitude: lat,
				longitude: lon,
				fieldId: "farm-check-flow",
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
				fieldName: locationName || "My Farm",
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
				cropType: cropIdToUse,
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
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setAnalysisError(lang === "ne" ? "उपग्रह विवरण प्राप्त गर्न सकिएन। कृपया इन्टरनेट जाँच्नुहोस् र फेरि प्रयास गर्नुहोस्।" : `Could not retrieve satellite observations: ${msg}. Please check your connection and try again.`);
		} finally {
			setIsAnalyzing(false);
		}
	};
	const getHealthStatus = () => {
		const ndvi = hlsSummary?.currentNdvi;
		const yoy = hlsSummary?.ndviDifferenceFromLastYear;
		if (ndvi !== null && ndvi !== void 0 && yoy !== null && yoy !== void 0) {
			if (ndvi >= .45 && yoy >= -.05) return {
				level: "green",
				titleNe: "राम्रो अवस्था (Good)",
				titleEn: "Good Condition",
				meaningNe: "बिरुवाको हरियाली स्वस्थ र यस मौसमका लागि सामान्य छ।",
				meaningEn: "Plant greenness is healthy and normal for this time of year.",
				actionNe: "खेतको नियमित रेखदेख जारी राख्नुहोस् र नियमित सिँचाइ कायम राख्नुहोस्।",
				actionEn: "Continue regular field care and maintain scheduled irrigation."
			};
			if (ndvi >= .25 || yoy >= -.15) return {
				level: "yellow",
				titleNe: "मध्यम अवस्था (Moderate)",
				titleEn: "Moderate Condition",
				meaningNe: "बिरुवाको हरियाली केही कम छ वा गत वर्षभन्दा पानीको मात्रा फरक परेको छ।",
				meaningEn: "Plant greenness is slightly lower or rain has differed from last year.",
				actionNe: "खेतमा गएर माटोको चिस्यान जाँच्नुहोस् र कुलो वा सिँचाइको अवस्था निरीक्षण गर्नुहोस्।",
				actionEn: "Inspect soil moisture in low spots and verify irrigation canal flow."
			};
		}
		return {
			level: "red",
			titleNe: "ध्यान दिनुपर्ने (Needs Attention)",
			titleEn: "Needs Attention",
			meaningNe: "बिरुवाको हरियाली निकै कम देखिएको छ वा सुख्खा मौसमले बालीमा असर पुर्‍याएको हुन सक्छ।",
			meaningEn: "Plant greenness is noticeably low or dry weather may be stressing crops.",
			actionNe: "खेतमा प्रत्यक्ष निरीक्षण गर्नुहोस् र स्थानीय कृषि शाखाका प्राविधिकसँग परामर्श गर्नुहोस्।",
			actionEn: "Walk your field to check for dry soil, and consult your local agriculture officer."
		};
	};
	const health = getHealthStatus();
	const handleToggleSpeak = () => {
		if (!hasSpeechSupport || typeof window === "undefined") return;
		if (isSpeaking) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
			return;
		}
		const fullText = `${lang === "ne" ? health.titleNe : health.titleEn}. ${lang === "ne" ? health.meaningNe : health.meaningEn} ${lang === "ne" ? health.actionNe : health.actionEn}`;
		const utterance = new SpeechSynthesisUtterance(fullText);
		utterance.lang = lang === "ne" ? "ne-NP" : "en-US";
		utterance.rate = .95;
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);
		window.speechSynthesis.speak(utterance);
		setIsSpeaking(true);
	};
	const mapCenter = coords ?? [27.6775, 84.4333];
	const markers = [{
		id: "center-farm",
		lat: mapCenter[0],
		lon: mapCenter[1],
		label: locationName || (lang === "ne" ? "तपाईंको खेत" : "Your Farm"),
		color: health.level === "green" ? "#237A50" : health.level === "yellow" ? "#D97706" : "#DC2626"
	}, ...topCrops.map((c, i) => {
		const angle = i * 2 * Math.PI / 3;
		const offsetLat = Math.sin(angle) * .003;
		const offsetLon = Math.cos(angle) * .003;
		return {
			id: `crop-${c.cropId}`,
			lat: mapCenter[0] + offsetLat,
			lon: mapCenter[1] + offsetLon,
			label: `${c.cropNameNe} (${c.suitabilityStatus.replace("_", " ")})`,
			color: "#237A50"
		};
	})];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("w-full rounded-3xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-md text-card-foreground space-y-6", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs sm:text-sm font-extrabold text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						step === 1 && (lang === "ne" ? "चरण १ को ३: तपाईंको खेत कहाँ छ?" : "Step 1 of 3: Where is your farm?"),
						step === 2 && (lang === "ne" ? "चरण २ को ३: कुन बाली लगाउनुभयो?" : "Step 2 of 3: What did you grow?"),
						step === 3 && (lang === "ne" ? "चरण ३ को ३: तपाईंको नतिजा" : "Step 3 of 3: Your result")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground font-mono text-xs",
						children: [step, "/3"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 rounded-full transition-all duration-300", step >= 1 ? "bg-primary" : "bg-muted") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 rounded-full transition-all duration-300", step >= 2 ? "bg-primary" : "bg-muted") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 rounded-full transition-all duration-300", step >= 3 ? "bg-primary" : "bg-muted") })
					]
				})]
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center sm:text-left space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-extrabold text-foreground tracking-tight",
							children: lang === "ne" ? "तपाईंको खेत कहाँ छ?" : "Where is your farm?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: lang === "ne" ? "तपाईंको आफ्नै खेतको हरियाली र पानी जाँच्न तलको ठूलो हरियो बटन थिच्नुहोस्।" : "Tap the green button to automatically check satellite rain and greenness for your land."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleAcquireGps,
						disabled: locatingGps,
						className: "w-full min-h-[58px] py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all disabled:opacity-70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Navigation, { className: cn("h-6 w-6 text-primary-foreground", locatingGps && "animate-spin") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: locatingGps ? lang === "ne" ? "स्थान पत्ता लगाउँदै..." : "Finding your location..." : lang === "ne" ? "मेरो स्थान प्रयोग गर्नुहोस् (Use My Location)" : "Use My Current Location" })]
					}),
					locationError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-4 w-4 text-amber-700 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "स्थान पत्ता लागेन" : "Location Permission Needed" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "leading-relaxed text-amber-800",
							children: locationError
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-border space-y-3",
						children: [farmFields.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-muted-foreground block uppercase",
								children: lang === "ne" ? "वा सुरक्षित गरिएको खेत रोज्नुहोस्:" : "Or pick from your saved plots:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
								children: farmFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSelectSavedFarm(f.id),
									className: "p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted text-left flex items-center justify-between text-xs sm:text-sm font-semibold transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: f.fieldName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-primary font-bold",
										children: lang === "ne" ? "छान्नुहोस् →" : "Select →"
									})]
								}, f.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowManualPicker(!showManualPicker),
							className: "text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1.5 min-h-[44px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showManualPicker ? lang === "ne" ? "नक्सा विकल्प लुकाउनुहोस्" : "Hide coordinates input" : lang === "ne" ? "वा नक्सा / अक्षांश राख्नुहोस् (Pick on map)" : "Or enter coordinates manually (Pick on map)" })]
						}), showManualPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-4 rounded-2xl border border-border bg-secondary/30 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: lang === "ne" ? "अक्षांश (Latitude)" : "Latitude"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.0001",
									value: manualLat,
									onChange: (e) => setManualLat(e.target.value),
									className: "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono",
									placeholder: "27.6775"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: lang === "ne" ? "देशान्तर (Longitude)" : "Longitude"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.0001",
									value: manualLon,
									onChange: (e) => setManualLon(e.target.value),
									className: "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono",
									placeholder: "84.4333"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleApplyManualCoords,
								className: "w-full py-2.5 rounded-xl bg-secondary text-primary font-bold text-xs sm:text-sm border border-primary/20 hover:bg-secondary/80 transition-colors min-h-[44px]",
								children: lang === "ne" ? "यो स्थान प्रयोग गर्नुहोस् →" : "Use these coordinates →"
							})]
						})] })]
					})
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(1),
							className: "text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "स्थान बदल्नुहोस्" : "Change location" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-primary truncate max-w-[200px]",
							children: [
								"📍",
								" ",
								locationName || (coords ? `${coords[0].toFixed(2)}°, ${coords[1].toFixed(2)}°` : "Selected")
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center sm:text-left space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-extrabold text-foreground tracking-tight",
							children: lang === "ne" ? "तपाईंले भर्खर कुन बाली लगाउनुभयो?" : "What did you grow?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: lang === "ne" ? "पछिल्लो बाली छान्नुहोस् ताकि अर्को मौसमका लागि उत्तम बालीहरू सुझाव दिन सकियोस्।" : "Select the most recent crop so we can calculate rotation benefits for your next cycle."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
						children: PRECEDING_CROPS.map((crop) => {
							const isSelected = selectedCrop === crop.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setSelectedCrop(crop.id);
									handleRunAnalysis(crop.id);
								},
								className: cn("min-h-[64px] p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all shadow-xs", isSelected ? "border-primary bg-primary/10 ring-2 ring-primary" : "border-border bg-card hover:bg-muted/50"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl shrink-0",
									children: crop.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "block text-base font-extrabold text-foreground truncate",
										children: lang === "ne" ? crop.nameNe : crop.nameEn
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block truncate",
										children: lang === "ne" ? crop.descNe : crop.descEn
									})]
								})]
							}, crop.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground text-center sm:text-left",
						children: lang === "ne" ? "बाली छानेपछि स्वतः भू-उपग्रह जाँच सुरु हुनेछ।" : "Tapping a crop starts the satellite analysis automatically."
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStep(1),
						className: "text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "नयाँ खेत जाँच्नुहोस्" : "Check another plot" })]
					}), hasSpeechSupport && !isAnalyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleToggleSpeak,
						className: cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border", isSpeaking ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/60 text-primary border-primary/20 hover:bg-secondary"),
						title: lang === "ne" ? "नतिजा सुन्नुहोस्" : "Listen to result",
						children: isSpeaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.VolumeX, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "रोक्नुहोस्" : "Stop" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Volume2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "सुन्नुहोस् (Listen)" : "Listen" })] })
					})]
				}), isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center space-y-4 rounded-3xl bg-secondary/30 border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-extrabold text-foreground",
							children: lang === "ne" ? "तपाईंको खेतको भू-उपग्रह तस्बिर हेर्दै छौँ..." : "Looking at satellite pictures of your farm..."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-muted-foreground max-w-md mx-auto",
							children: lang === "ne" ? "नासा उपग्रहबाट वर्षा र बिरुवाको हरियाली नापिँदै छ। केही सेकेन्ड लाग्न सक्छ।" : "Reading 30m resolution reflectance and rain measurements. Just a few moments."
						})]
					})]
				}) : analysisError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-5 w-5 text-amber-700 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "डाटा प्राप्त गर्न सकिएन" : "Notice" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed",
							children: analysisError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleRunAnalysis(),
							className: "px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs",
							children: lang === "ne" ? "फेरि प्रयास गर्नुहोस्" : "Try Again"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("p-5 sm:p-6 rounded-3xl border shadow-xs space-y-3", health.level === "green" && "bg-emerald-50/70 border-emerald-300 text-emerald-950", health.level === "yellow" && "bg-amber-50/70 border-amber-300 text-amber-950", health.level === "red" && "bg-rose-50/70 border-rose-300 text-rose-950"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-4 w-4 rounded-full animate-pulse", health.level === "green" && "bg-emerald-600 shadow-[0_0_8px_#10B981]", health.level === "yellow" && "bg-amber-500 shadow-[0_0_8px_#F59E0B]", health.level === "red" && "bg-rose-600 shadow-[0_0_8px_#EF4444]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs sm:text-sm font-extrabold uppercase tracking-wide",
										children: lang === "ne" ? health.titleNe : health.titleEn
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base sm:text-lg font-bold leading-snug",
									children: lang === "ne" ? health.meaningNe : health.meaningEn
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm sm:text-base font-medium opacity-90 border-t border-black/10 pt-2",
									children: [
										"👉 ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lang === "ne" ? "अब के गर्ने: " : "What to do now: " }),
										lang === "ne" ? health.actionNe : health.actionEn
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CloudRain, { className: "h-4 w-4 text-primary" }), lang === "ne" ? "वर्षा तुलना (Rain Comparison)" : "Rain vs Last Year"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl sm:text-2xl font-extrabold text-foreground",
										children: rainfallYoY?.percentageChange !== null && rainfallYoY?.percentageChange !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											Math.abs(rainfallYoY.percentageChange),
											"%",
											" ",
											rainfallYoY.percentageChange >= 0 ? lang === "ne" ? "बढी पानी परेको" : "more rain" : lang === "ne" ? "कम पानी परेको" : "less rain"
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground font-normal",
											children: lang === "ne" ? "डाटा उपलब्ध छैन" : "No recent data"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: lang === "ne" ? "गत वर्षको यही अवधिको तुलनामा तपाईंको खेतको वर्षा।" : "Rainfall accumulation compared to the exact same calendar period last year."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Leaf, { className: "h-4 w-4 text-primary" }), lang === "ne" ? "बिरुवाको हरियाली (Plant Greenness)" : "Plant Greenness"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl sm:text-2xl font-extrabold text-foreground",
										children: hlsSummary?.ndviDifferenceFromLastYear !== null && hlsSummary?.ndviDifferenceFromLastYear !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hlsSummary.ndviDifferenceFromLastYear >= 0 ? lang === "ne" ? "गत वर्षभन्दा हरियाली बढी छ" : "Greener than last year" : lang === "ne" ? "गत वर्षभन्दा हरियाली केही कम छ" : "Lower greenness than last year" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground font-normal",
											children: lang === "ne" ? "उपग्रह तस्बिरमा बादल छ" : "No clear image (clouds)"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground leading-relaxed",
										children: lang === "ne" ? "नासा उपग्रहले देखेको पातहरूको हरियाली स्तर।" : "Reflectance density measured by Sentinel-2 / Landsat satellites."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "यस जग्गाका लागि उपयुक्त बालीहरू (Suitable crops for this land)" : "Suitable crops for this land" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-muted-foreground",
									children: lang === "ne" ? "माटोको चक्र र मौसम अनुसार अर्को सिजनका लागि राम्रो बालीहरू।" : "Crops recommended by rotation science for your next cycle."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: topCrops.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl border border-border bg-secondary/30 space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-bold text-primary",
													children: ["#", i + 1]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase",
													children: c.suitabilityStatus.replace("_", " ")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block text-base font-extrabold text-foreground",
												children: lang === "ne" ? c.cropNameNe : c.cropNameEn
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground leading-relaxed",
												children: lang === "ne" ? c.reasonNe : c.reasonEn
											})
										]
									}, c.cropId))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-64 sm:h-72 rounded-2xl overflow-hidden border border-border shadow-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
										center: mapCenter,
										zoom: 15,
										markers,
										height: 288
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "rounded-2xl border border-border bg-muted/20 p-4 text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "font-bold text-foreground cursor-pointer hover:text-primary flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "थप प्राविधिक विवरण हेर्नुहोस् (More details)" : "More technical details" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 space-y-2 text-muted-foreground border-t border-border mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Data Source:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: hlsSummary?.dataSource || "NASA HLS / MODIS"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Greenness Index (NDVI):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground font-mono",
											children: hlsSummary?.currentNdvi ?? "N/A"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scene Date:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: hlsSummary?.currentDate || "Recent"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cloud Cover:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: hlsSummary?.cloudPercentage !== void 0 ? `${hlsSummary.cloudPercentage}%` : "Clear"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-muted/40 border border-border text-[11px] sm:text-xs text-muted-foreground space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-foreground",
								children: [
									"⚠️",
									" ",
									lang === "ne" ? "सावधानी र जिम्मेवारी अस्वीकरण" : "Important Note & Safeguards"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: lang === "ne" ? "उपग्रह अनुमानहरू सामान्य जानकारीका लागि मात्र हुन्; यो प्रयोगशाला परीक्षण वा रोग निदान होइन। कुनै पनि विषादी, मल वा औषधि सिफारिस गरिएको छैन। निर्णय लिनुअघि आफ्नो स्थानीय कृषि ज्ञान केन्द्र वा शाखासँग सम्पर्क गर्नुहोस्।" : "Satellite observations provide spatial estimations, not on-site crop disease diagnosis or pesticide/fertilizer prescription. Always verify with your local agricultural extension service." })]
						}),
						onViewDashboard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onViewDashboard,
								className: "inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "विस्तृत कृषि ड्यासबोर्ड खोल्नुहोस् →" : "Explore full agricultural dashboard →" })
							})
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { FarmCheckFlow as t };
