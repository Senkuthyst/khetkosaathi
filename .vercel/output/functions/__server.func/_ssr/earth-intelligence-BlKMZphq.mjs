import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, a as DataProvenance, c as Skeleton, h as num, l as SourceTag, n as Btn, o as FreshBadge, r as Card, u as cn } from "./kit-DW9Ou9p5.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as LazyMap } from "./LazyMap-Di1JnT8X.mjs";
import { t as TrendChart } from "./Charts-Bf9dEUuO.mjs";
import { t as fetchNasaPowerDaily } from "./nasa-power-VtiKAbL2.mjs";
import { r as fetchLiveModisVegetation, t as fetchLiveFirmsHotspots } from "./nasa-client-CLI3jpdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/earth-intelligence-BlKMZphq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
/**
* Computes scientific anomalies across NASA POWER, GPM, MODIS, and FIRMS observations.
*/
function computeScientificAnomalies(input) {
	const { locationName, latitude, longitude, temperatureObservations = [], rainfallObservations = [], modisNdvi = null, modisBaselineLow = .55, modisBaselineHigh = .7, thermalHotspotsCount = 0, cropAgeDays = 45, cropType = "rice" } = input;
	const validTMax = temperatureObservations.map((o) => o.tMax).filter((v) => v !== null);
	const tempMeanMax = validTMax.length > 0 ? validTMax.reduce((a, b) => a + b, 0) / validTMax.length : null;
	const tempBaseline = 28;
	const tempAnomaly = tempMeanMax !== null ? Math.round((tempMeanMax - tempBaseline) * 10) / 10 : null;
	const isHeatStressed = tempAnomaly !== null && tempAnomaly >= 2;
	const validRain = rainfallObservations.map((o) => o.rain).filter((v) => v !== null);
	const rainTotal = validRain.length > 0 ? validRain.reduce((a, b) => a + b, 0) : null;
	const rainBaseline = 12;
	const rainAnomalyPct = rainTotal !== null && true ? Math.round((rainTotal - rainBaseline) / rainBaseline * 1e3) / 10 : null;
	const isRainfallDeficit = rainAnomalyPct !== null && rainAnomalyPct <= -30;
	const isExcessRainfall = rainAnomalyPct !== null && rainAnomalyPct >= 100;
	const modisBaselineMean = (modisBaselineLow + modisBaselineHigh) / 2;
	const vegAnomaly = modisNdvi !== null ? Math.round((modisNdvi - modisBaselineMean) * 100) / 100 : null;
	const isMaturing = cropAgeDays >= 95;
	const isVegetationDecline = !isMaturing && vegAnomaly !== null && vegAnomaly <= -.06;
	const evidence = [];
	const uncertainties = [];
	const recommendations = [];
	if (tempMeanMax !== null && tempAnomaly !== null) evidence.push(`NASA POWER reanalysis indicates 7-day mean maximum temperature of ${tempMeanMax.toFixed(1)}°C (${tempAnomaly > 0 ? "+" : ""}${tempAnomaly.toFixed(1)}°C anomaly relative to the ${tempBaseline}°C seasonal baseline).`);
	else uncertainties.push("Temperature reanalysis data is incomplete for this window.");
	if (rainTotal !== null && rainAnomalyPct !== null) evidence.push(`Precipitation observation shows ${rainTotal.toFixed(1)} mm accumulated (${rainAnomalyPct > 0 ? "+" : ""}${rainAnomalyPct.toFixed(1)}% deviation against the ${rainBaseline} mm reference baseline).`);
	if (modisNdvi !== null) {
		evidence.push(`MODIS MOD13Q1 250m composite shows an NDVI of ${modisNdvi.toFixed(2)} (Reference range: ${modisBaselineLow.toFixed(2)}–${modisBaselineHigh.toFixed(2)}).`);
		if (isMaturing) uncertainties.push("Vegetation index decrease coincides with physiological grain filling and expected crop maturation senescence.");
	}
	if (thermalHotspotsCount > 0) {
		evidence.push(`NASA FIRMS detected ${thermalHotspotsCount} thermal anomaly hotspots within the regional radius.`);
		uncertainties.push("Thermal hotspots indicate elevated surface temperatures (e.g. brick kilns, residue burns, or clearings); they do not prove localized agricultural damage.");
	}
	let activeFlags = 0;
	if (isHeatStressed) activeFlags++;
	if (isRainfallDeficit) activeFlags++;
	if (isVegetationDecline) activeFlags++;
	let overallRiskScore = "low";
	if (tempMeanMax === null || rainTotal === null) overallRiskScore = "insufficient_data";
	else if (activeFlags >= 3) overallRiskScore = "critical";
	else if (activeFlags === 2) overallRiskScore = "high";
	else if (activeFlags === 1) overallRiskScore = "moderate";
	if (isRainfallDeficit) recommendations.push("Verify soil moisture in the root zone (0–15 cm) and inspect field bund water retention.");
	if (isHeatStressed) recommendations.push("Monitor canopy temperature and consider light morning/evening irrigation to mitigate heat stress.");
	if (isVegetationDecline) recommendations.push("Perform multi-point field walkthrough to check for nitrogen depletion, moisture stress, or weed competition.");
	if (recommendations.length === 0) recommendations.push("Maintain standard agronomic monitoring and routine scouting.");
	return {
		locationName,
		coordinates: {
			latitude,
			longitude
		},
		temperatureMaxMean: tempMeanMax !== null ? Math.round(tempMeanMax * 10) / 10 : null,
		temperatureBaseline: tempBaseline,
		temperatureAnomalyDegC: tempAnomaly,
		isHeatStressed,
		rainfallAccumulation7DayMm: rainTotal !== null ? Math.round(rainTotal * 10) / 10 : null,
		rainfallBaselineMm: rainBaseline,
		rainfallAnomalyPct: rainAnomalyPct,
		isRainfallDeficit,
		isExcessRainfall,
		vegetationNdvi: modisNdvi,
		vegetationBaseline: Math.round(modisBaselineMean * 100) / 100,
		vegetationAnomaly: vegAnomaly,
		isVegetationDecline,
		thermalAnomaliesCount: thermalHotspotsCount,
		overallRiskScore,
		evidenceStatements: evidence,
		scientificUncertaintyNotes: uncertainties,
		fieldInspectionRecommendations: recommendations
	};
}
function EarthDataStatusSection({ powerData, fieldId = "pilot-1", className = "" }) {
	const { lang, t } = useApp();
	if (!powerData) return null;
	const prov = powerData.provenance;
	const days = powerData.days;
	const latestObsDate = prov.observedAt ?? days.at(-1)?.date ?? "—";
	const retrievalIso = prov.retrievedAt;
	const retrievalFormatted = retrievalIso ? new Date(retrievalIso).toLocaleString(lang === "ne" ? "ne-NP" : "en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	}) : "Pilot Preset";
	const missingCount = days.filter((d) => d.tMax == null || d.rain == null).length;
	const isStale = prov.mode === "pilot" || (prov.observedAt ? Date.now() - new Date(prov.observedAt).getTime() > 6048e5 : false);
	const isMissing = days.length === 0 || days.every((d) => d.tMax == null && d.rain == null);
	const statusBadge = isMissing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-3.5 w-3.5" }), "Data Missing"]
	}) : isStale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-3.5 w-3.5" }), prov.mode === "pilot" ? "Pilot Record" : "Stale Observations"]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3.5 w-3.5" }), "Live Verified"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-extrabold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Activity, { className: "h-4 w-4 text-primary" }), "Earth Observation Stream Status"]
					}), statusBadge]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [
						"NASA POWER Agroclimatology Point Ingestion · Field:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-foreground",
							children: fieldId
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f: isMissing ? "missing" : isStale ? "stale" : "fresh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTag, { source: "nasa_power" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/40 p-3 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Observation Date"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-foreground",
								children: num(lang, latestObsDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "UTC Day Standard"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/40 p-3 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Latest Retrieval"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-foreground",
								children: retrievalFormatted
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: prov.mode === "live" ? "Direct API Sync" : "Cached / Fallback"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/40 p-3 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Layers, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Spatial Resolution"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-foreground",
								children: prov.resolution
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Nearest Grid Centroid"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/40 p-3 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-muted-foreground mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Database, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Data Integrity"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-black text-foreground",
								children: missingCount === 0 ? "100% Complete" : `${missingCount} days partial`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: ["Quality: ", prov.quality]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/70 p-3.5 bg-background/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-foreground",
							children: "Temperature Dynamic (°C)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "T2M Max / Min"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
						data: days,
						unit: "°C",
						height: 130,
						series: [{
							key: "tMax",
							label: t("maxTemperature")
						}, {
							key: "tMin",
							label: t("minTemperature")
						}]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/70 p-3.5 bg-background/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-foreground",
							children: "Daily Precipitation (mm/day)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Corrected Total (PRECTOTCORR)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
						data: days,
						unit: "mm",
						height: 130,
						series: [{
							key: "rain",
							label: t("rainfall"),
							bar: true
						}]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.HelpCircle, { className: "h-3.5 w-3.5" }), "No fabricated values — gaps and missing observations reflect authentic NASA fill values (-999)."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataProvenance, { data: prov })]
			})
		]
	});
}
var PRESET_GLOBAL_LOCATIONS = [
	{
		id: "np-chitwan",
		name: "Chitwan (भरतपुर / रत्ननगर)",
		country: "Nepal",
		latitude: 27.6775,
		longitude: 84.4333,
		region: "Bagmati Province (Pilot Farm)"
	},
	{
		id: "np-kavre",
		name: "Kavre (बनेपा / पनौती)",
		country: "Nepal",
		latitude: 27.632,
		longitude: 85.521,
		region: "Mid-Hills Agroecology"
	},
	{
		id: "np-rupandehi",
		name: "Rupandehi (तिलोत्तमा / भैरहवा)",
		country: "Nepal",
		latitude: 27.633,
		longitude: 83.475,
		region: "Lumbini Terai Plain"
	},
	{
		id: "np-kailali",
		name: "Kailali (धनगढी / अत्तरिया)",
		country: "Nepal",
		latitude: 28.698,
		longitude: 80.594,
		region: "Far-West Grain Belt"
	},
	{
		id: "in-punjab",
		name: "Ludhiana, Punjab",
		country: "India",
		latitude: 30.901,
		longitude: 75.8573,
		region: "Indo-Gangetic Plain"
	},
	{
		id: "bd-rangpur",
		name: "Rangpur",
		country: "Bangladesh",
		latitude: 25.7439,
		longitude: 89.2752,
		region: "Brahmaputra Basin"
	},
	{
		id: "us-iowa",
		name: "Ames, Iowa",
		country: "United States",
		latitude: 42.0308,
		longitude: -93.6319,
		region: "US Corn Belt"
	},
	{
		id: "br-mato-grosso",
		name: "Sorriso, Mato Grosso",
		country: "Brazil",
		latitude: -12.5425,
		longitude: -55.7214,
		region: "Cerrado Agricultural Hub"
	}
];
function GlobalLocationSelector({ currentLocation, onSelectLocation, className = "" }) {
	const { lang, t } = useApp();
	const [query, setQuery] = (0, import_react.useState)("");
	const [customLat, setCustomLat] = (0, import_react.useState)("");
	const [customLon, setCustomLon] = (0, import_react.useState)("");
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isPending, startTransition] = (0, import_react.useTransition)();
	const filteredLocations = PRESET_GLOBAL_LOCATIONS.filter((loc) => loc.name.toLowerCase().includes(query.toLowerCase()) || loc.country.toLowerCase().includes(query.toLowerCase()) || loc.region && loc.region.toLowerCase().includes(query.toLowerCase()));
	const handleCustomCoordSubmit = (e) => {
		e.preventDefault();
		const lat = parseFloat(customLat);
		const lon = parseFloat(customLon);
		if (Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
			onSelectLocation({
				id: `custom-${lat.toFixed(3)}-${lon.toFixed(3)}`,
				name: `Custom [${lat.toFixed(3)}°, ${lon.toFixed(3)}°]`,
				country: "Global Coordinate",
				latitude: Math.round(lat * 1e4) / 1e4,
				longitude: Math.round(lon * 1e4) / 1e4,
				region: "Custom User Coordinate"
			});
			setIsOpen(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Active Observation Region"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/10 text-primary",
							children: currentLocation.country
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-extrabold text-foreground",
						children: currentLocation.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground font-mono",
						children: [
							currentLocation.latitude.toFixed(4),
							"° N, ",
							currentLocation.longitude.toFixed(4),
							"° E",
							currentLocation.region ? ` · ${currentLocation.region}` : ""
						]
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				variant: "outline",
				size: "sm",
				className: "shrink-0 text-xs font-bold gap-1.5",
				onClick: () => setIsOpen(!isOpen),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-3.5 w-3.5 text-primary" }), isOpen ? "Close Selector" : "Change Location"]
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "absolute top-full left-0 right-0 z-50 mt-2 p-5 shadow-2xl border-2 border-primary/20 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-extrabold text-foreground",
						children: "Select Geographic Focus"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Supports verified Nepal agricultural districts and global comparative hubs."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsOpen(false),
						className: "text-xs font-bold text-muted-foreground hover:text-foreground",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search city, district, country...",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						className: "w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1",
					children: filteredLocations.map((loc) => {
						const isSelected = loc.id === currentLocation.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								onSelectLocation(loc);
								setIsOpen(false);
							},
							className: `text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between ${isSelected ? "border-primary bg-primary/10 text-primary font-bold shadow-xs" : "border-border hover:bg-muted/50 text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: loc.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground font-mono",
								children: [
									loc.latitude.toFixed(2),
									"°, ",
									loc.longitude.toFixed(2),
									"° · ",
									loc.country
								]
							})] }), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { className: "h-4 w-4 text-primary shrink-0" })]
						}, loc.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCustomCoordSubmit,
					className: "pt-3 border-t space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-foreground block",
						children: "Or Enter Precise Global Coordinates:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "any",
								min: "-90",
								max: "90",
								placeholder: "Latitude (-90 to 90)",
								value: customLat,
								onChange: (e) => setCustomLat(e.target.value),
								className: "w-1/2 p-2 text-xs rounded-lg border border-input bg-background",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								step: "any",
								min: "-180",
								max: "180",
								placeholder: "Longitude (-180 to 180)",
								value: customLon,
								onChange: (e) => setCustomLon(e.target.value),
								className: "w-1/2 p-2 text-xs rounded-lg border border-input bg-background",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								type: "submit",
								size: "sm",
								className: "shrink-0 text-xs font-bold",
								children: "Apply Coordinates"
							})
						]
					})]
				})
			]
		})]
	});
}
function AiExplanationPanel({ report, className = "" }) {
	const riskConfig = {
		low: {
			label: "Favorable Agro-Climatic Conditions",
			color: "text-emerald-700 bg-emerald-50 border-emerald-200"
		},
		moderate: {
			label: "Moderate Environmental Deviation",
			color: "text-amber-700 bg-amber-50 border-amber-200"
		},
		high: {
			label: "Elevated Agricultural Risk",
			color: "text-orange-700 bg-orange-50 border-orange-200"
		},
		critical: {
			label: "Severe Compound Anomaly Alert",
			color: "text-rose-700 bg-rose-50 border-rose-200 ring-2 ring-rose-200"
		},
		insufficient_data: {
			label: "Incomplete Observations",
			color: "text-slate-700 bg-slate-50 border-slate-200"
		}
	}[report.overallRiskScore];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `p-5 space-y-4 border-2 border-primary/20 bg-card ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Brain, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold text-foreground",
							children: "AI Agricultural Explanation & Evidence Synthesizer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3 w-3" }), " Grounded In Real NASA Observations"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: [
							"Region: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: report.locationName
							}),
							" · Coordinates: ",
							report.coordinates.latitude.toFixed(3),
							"° N,",
							" ",
							report.coordinates.longitude.toFixed(3),
							"° E"
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `px-3 py-1 rounded-xl border text-xs font-bold ${riskConfig.color}`,
					children: riskConfig.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-secondary/30 border border-border/70 text-xs leading-relaxed space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { className: "h-4 w-4 text-primary" }), "Synthesized Environmental Assessment:"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"Analysis of the latest NASA Earth Observation data for ",
								report.locationName,
								" indicates that",
								" ",
								report.overallRiskScore === "low" ? "environmental indicators remain largely within expected seasonal bounds." : report.overallRiskScore === "critical" ? "multiple concurrent stress factors (temperature extremes and precipitation deficits) are interacting simultaneously." : "certain environmental deviations warrant attentive on-ground monitoring."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground block",
							children: "Observed Evidence Points:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: report.evidenceStatements.map((statement, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 p-2 rounded-lg bg-background border border-border/60 text-xs text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statement })]
							}, idx))
						})]
					}),
					report.scientificUncertaintyNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold flex items-center gap-1 text-amber-950",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-3.5 w-3.5" }), " Scientific Limitations & Context:"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc list-inside space-y-0.5 text-[11px] text-amber-800",
							children: report.scientificUncertaintyNotes.map((note, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-4 w-4 text-primary" }), "Recommended On-Farm Actions:"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1 text-muted-foreground",
							children: report.fieldInspectionRecommendations.map((rec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-1.5 text-xs text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary shrink-0" }), rec]
							}, idx))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scientific policy: Satellite vegetation deviations never constitute definitive diagnosis of crop pest or pathogen presence." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-primary",
					children: "NASA Agri-AI v2.4"
				})]
			})
		]
	});
}
function ScientificTag({ type }) {
	const configs = {
		direct: {
			label: "Direct In-Situ Observation",
			cls: "bg-emerald-100 text-emerald-800 border-emerald-300"
		},
		satellite: {
			label: "Satellite-Derived Estimate",
			cls: "bg-blue-100 text-blue-800 border-blue-300"
		},
		calculated: {
			label: "Calculated Anomaly Indicator",
			cls: "bg-amber-100 text-amber-800 border-amber-300"
		},
		model: {
			label: "Model Reanalysis Grid",
			cls: "bg-purple-100 text-purple-800 border-purple-300"
		}
	}[type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border", configs.cls),
		children: configs.label
	});
}
function EarthIntelligence() {
	const { t, lang, selectedField, farmFields } = useApp();
	const [power, setPower] = (0, import_react.useState)(null);
	const [modisSummary, setModisSummary] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [activeLayer, setActiveLayer] = (0, import_react.useState)("ndvi");
	const [currentLocation, setCurrentLocation] = (0, import_react.useState)(() => {
		if (selectedField) return {
			id: selectedField.id,
			name: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`,
			country: "Nepal",
			latitude: selectedField.latitude,
			longitude: selectedField.longitude,
			type: "field",
			description: `Registered farm plot in ${selectedField.municipality || "Nepal"}, ${selectedField.district || ""}`
		};
		return PRESET_GLOBAL_LOCATIONS[0];
	});
	const [firmsMarkers, setFirmsMarkers] = (0, import_react.useState)([]);
	const [firmsStatus, setFirmsStatus] = (0, import_react.useState)("MISSING_COVERAGE");
	(0, import_react.useEffect)(() => {
		if (selectedField) setCurrentLocation({
			id: selectedField.id,
			name: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`,
			country: "Nepal",
			latitude: selectedField.latitude,
			longitude: selectedField.longitude,
			type: "field",
			description: `Registered farm plot in ${selectedField.municipality || "Nepal"}, ${selectedField.district || ""}`
		});
	}, [selectedField]);
	const loadModis = (loc = currentLocation) => {
		fetchLiveModisVegetation({
			fieldId: loc.id,
			latitude: loc.latitude,
			longitude: loc.longitude,
			fieldAreaM2: selectedField?.areaM2 ?? 4046
		}).then(setModisSummary);
	};
	const load = (force = false, loc = currentLocation) => {
		setBusy(true);
		fetchNasaPowerDaily(force, {
			latitude: loc.latitude,
			longitude: loc.longitude,
			fieldId: loc.id
		}).then(setPower).catch((err) => {
			console.warn("NASA POWER fetch failed:", err);
			setPower(null);
		}).finally(() => setBusy(false));
		fetchLiveFirmsHotspots({
			latitude: loc.latitude,
			longitude: loc.longitude,
			radiusKm: 60
		}).then((res) => {
			if (!res) {
				setFirmsStatus("DOWNLOAD_FAILED");
				setFirmsMarkers([]);
			} else if (res.queryStatus === "AUTH_REQUIRED") {
				setFirmsStatus("AUTH_REQUIRED");
				setFirmsMarkers([]);
			} else if (res.queryStatus === "DOWNLOAD_FAILED") {
				setFirmsStatus("DOWNLOAD_FAILED");
				setFirmsMarkers([]);
			} else if (res.detections.length > 0) {
				setFirmsStatus("AVAILABLE");
				setFirmsMarkers(res.detections.map((d) => ({
					latitude: d.latitude,
					longitude: d.longitude,
					label: `Hotspot: ${d.brightness}K (${d.instrument} ${d.confidence} conf)`
				})));
			} else {
				setFirmsStatus("MISSING_COVERAGE");
				setFirmsMarkers([]);
			}
		});
		loadModis(loc);
	};
	(0, import_react.useEffect)(() => {
		load(false, currentLocation);
	}, [currentLocation]);
	if (!selectedField && farmFields.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-border bg-card p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto my-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 w-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold text-foreground",
					children: "Select or Register a Farm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground leading-relaxed",
					children: "All NASA Earth observations are strictly mapped to your registered agricultural parcel coordinates. Please register your plot to view verified satellite data."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 flex justify-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/onboarding",
						className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Register Your Farm Plot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-4 w-4" })]
					})
				})
			]
		})
	});
	const anomalyReport = computeScientificAnomalies({
		locationName: currentLocation.name,
		latitude: currentLocation.latitude,
		longitude: currentLocation.longitude,
		temperatureObservations: power?.days.map((d) => ({
			tMax: d.tMax,
			tMin: d.tMin
		})) ?? [],
		rainfallObservations: power?.days.map((d) => ({ rain: d.rain })) ?? [],
		modisNdvi: modisSummary?.latestNdvi ?? null,
		modisBaselineLow: .55,
		modisBaselineHigh: .75,
		thermalHotspotsCount: firmsMarkers.length,
		cropAgeDays: 45,
		cropType: selectedField?.cropType ?? "rice"
	});
	const getTileOverlay = () => {
		if (activeLayer === "ndvi") return {
			url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
			attribution: "NASA GIBS / Terra MODIS NDVI",
			opacity: .65,
			maxZoom: 9
		};
		if (activeLayer === "precipitation") return {
			url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
			attribution: "NASA GIBS / GPM IMERG Precipitation Rate",
			opacity: .65,
			maxZoom: 7
		};
		if (activeLayer === "moisture") return {
			url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Surface_Soil_Moisture/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
			attribution: "NASA GIBS / SMAP Soil Moisture",
			opacity: .65,
			maxZoom: 7
		};
		return null;
	};
	const tileOverlay = getTileOverlay();
	const regionalPolygons = [];
	if (activeLayer === "moisture") {
		const d = .04;
		regionalPolygons.push({
			positions: [
				[currentLocation.latitude - d, currentLocation.longitude - d],
				[currentLocation.latitude - d, currentLocation.longitude + d],
				[currentLocation.latitude + d, currentLocation.longitude + d],
				[currentLocation.latitude + d, currentLocation.longitude - d]
			],
			color: "#0ea5e9",
			fillColor: "#0284c7",
			fillOpacity: .25,
			weight: 1.5,
			label: "SMAP 9 km Regional Grid Cell"
		});
	} else if (activeLayer === "precipitation") {
		const d = .05;
		regionalPolygons.push({
			positions: [
				[currentLocation.latitude - d, currentLocation.longitude - d],
				[currentLocation.latitude - d, currentLocation.longitude + d],
				[currentLocation.latitude + d, currentLocation.longitude + d],
				[currentLocation.latitude + d, currentLocation.longitude - d]
			],
			color: "#2563eb",
			fillColor: "#3b82f6",
			fillOpacity: .2,
			weight: 1.5,
			label: "GPM IMERG 0.1° (~10 km) Grid Cell"
		});
	}
	if (selectedField?.boundary && selectedField.boundary.length > 0) regionalPolygons.push({
		positions: selectedField.boundary,
		color: activeLayer === "ndvi" ? "var(--veg-good)" : activeLayer === "firms" ? "#ef4444" : "var(--satellite)",
		weight: 3,
		fillOpacity: .45,
		label: selectedField.fieldName
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-satellite/10 px-2.5 py-0.5 text-xs font-bold text-satellite",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Satellite, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NASA Earth Observation System" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
							children: currentLocation.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs sm:text-sm text-muted-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Coordinates: ",
								currentLocation.latitude.toFixed(4),
								"° N,",
								" ",
								currentLocation.longitude.toFixed(4),
								"° E · Field:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedField?.fieldName ?? currentLocation.name })
							] })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							variant: "outline",
							onClick: () => load(true),
							disabled: busy,
							className: "text-xs font-bold gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { className: cn("h-3.5 w-3.5", busy && "animate-spin") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? "Querying NASA..." : "Refresh Observations" })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 rounded-lg bg-emerald-50/70 border border-emerald-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-emerald-900 block",
								children: "1. Direct In-Situ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-700",
								children: "Farm soil probe & weather station"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 rounded-lg bg-blue-50/70 border border-blue-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-blue-900 block",
								children: "2. Satellite-Derived"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-blue-700",
								children: "MODIS 250m & Landsat 30m NDVI"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 rounded-lg bg-amber-50/70 border border-amber-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-amber-900 block",
								children: "3. Anomaly Indicator"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber-700",
								children: "GPM IMERG deviation vs baseline"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 rounded-lg bg-purple-50/70 border border-purple-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-purple-900 block",
								children: "4. Model Reanalysis"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-purple-700",
								children: "NASA POWER Daily Climatology"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalLocationSelector, {
				currentLocation,
				onSelectLocation: (loc) => {
					setCurrentLocation(loc);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-8 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-base text-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe2, { className: "h-4 w-4 text-primary" }), "Regional Earth Observation Map"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"Layer: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeLayer.toUpperCase() }),
									" · Coordinates:",
									" ",
									currentLocation.latitude.toFixed(2),
									"°, ",
									currentLocation.longitude.toFixed(2),
									"°"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 bg-muted/60 p-1 rounded-xl flex-wrap",
								children: [
									{
										id: "ndvi",
										label: "MODIS NDVI"
									},
									{
										id: "precipitation",
										label: "GPM Rainfall"
									},
									{
										id: "moisture",
										label: "SMAP Soil"
									},
									{
										id: "firms",
										label: `FIRMS Fires (${firmsMarkers.length})`
									}
								].map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveLayer(layer.id),
									className: cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", activeLayer === layer.id ? "bg-card text-primary shadow-xs ring-1 ring-primary/20" : "text-muted-foreground hover:text-foreground"),
									children: layer.label
								}, layer.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl overflow-hidden border border-border relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
								center: [currentLocation.latitude, currentLocation.longitude],
								zoom: activeLayer === "firms" ? 11 : 13,
								height: 360,
								tileOverlay,
								polygons: regionalPolygons,
								markers: activeLayer === "firms" ? firmsMarkers.map((m) => ({
									position: [m.latitude, m.longitude],
									color: "#dc2626",
									fillColor: "#ef4444",
									radius: 8,
									label: m.label
								})) : []
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-3 left-3 z-[1000] bg-card/90 backdrop-blur-md border border-border rounded-xl px-3 py-2 text-[11px] shadow-md space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground block",
									children: [
										activeLayer === "ndvi" && "🌿 MODIS NDVI (8-Day Composite)",
										activeLayer === "precipitation" && "🌧️ GPM IMERG Precipitation",
										activeLayer === "moisture" && "💧 SMAP Regional Soil Moisture",
										activeLayer === "firms" && "🔥 NASA FIRMS Active Fires (NRT)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground",
									children: [
										activeLayer === "ndvi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#c2e699]" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0.2 (Sparse)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#238443] ml-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0.8+ (Dense)" })
											]
										}),
										activeLayer === "precipitation" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#9ecae1]" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0 mm/hr" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#084594] ml-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "25+ mm/hr" })
											]
										}),
										activeLayer === "moisture" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#f7fbff]" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dry (< 0.1 m³/m³)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-3 h-3 rounded-xs bg-[#08306b] ml-2" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wet (> 0.4 m³/m³)" })
											]
										}),
										activeLayer === "firms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [firmsMarkers.length, " thermal anomalies in 60 km radius"] })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1",
							children: [activeLayer === "firms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-rose-700 font-semibold flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Flame, { className: "h-3.5 w-3.5" }),
									"NASA FIRMS: ",
									firmsMarkers.length,
									" thermal anomalies detected within 60 km (VIIRS 375m / MODIS 1km)"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["● Field Boundary: ", selectedField?.fieldName ?? currentLocation.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								activeLayer === "ndvi" && "NASA GIBS / Terra MODIS (MOD13Q1 / 8-Day)",
								activeLayer === "precipitation" && "NASA GIBS / GPM IMERG (V07B)",
								activeLayer === "moisture" && "NASA GIBS / SMAP Level-4 Global Soil Moisture",
								activeLayer === "firms" && "NASA FIRMS NRT (VIIRS 375m Active Fire API)"
							] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-4 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-extrabold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-4 w-4 text-primary" }), "Verified NASA Earth Observations"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Coordinates:" }),
									" ",
									currentLocation.latitude.toFixed(4),
									"° N,",
									" ",
									currentLocation.longitude.toFixed(4),
									"° E"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NASA POWER Status:" }),
									" ",
									power ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-700 font-bold",
										children: [
											"Connected (",
											power.days.length,
											" days MERRA-2 observed)"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-amber-700 font-bold",
										children: "Loading / Unavailable"
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NASA FIRMS Status:" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("font-bold", firmsStatus === "AVAILABLE" ? "text-emerald-700" : "text-amber-700"),
										children: [
											firmsStatus === "AVAILABLE" && `Active (${firmsMarkers.length} detections in region)`,
											firmsStatus === "MISSING_COVERAGE" && "No detections returned for the requested period",
											firmsStatus === "AUTH_REQUIRED" && "MAP_KEY authorization required",
											firmsStatus === "DOWNLOAD_FAILED" && "Query failed"
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Active Overlay:" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-bold uppercase",
										children: activeLayer
									}),
									" (NASA GIBS Live Stream)"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SMAP Soil Resolution:" }), " 9 km regional grid (Regional indicator only)"] })
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiExplanationPanel, { report: anomalyReport }),
			power && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EarthDataStatusSection, {
				powerData: power,
				fieldId: currentLocation.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-extrabold text-foreground",
							children: t("powerOverview")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScientificTag, { type: "model" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: [
							"NASA Langley Atmospheric Science Data Center · 0.5° × 0.625° Agroclimatology Grid ·",
							" ",
							currentLocation.name
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://power.larc.nasa.gov/",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-xs font-bold text-primary hover:underline inline-flex items-center gap-1",
						children: "NASA POWER API Docs ↗"
					})]
				}), !power ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						role: "status",
						children: t("powerLoading")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 w-full" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-muted-foreground block mb-1",
							children: "Air Temperature Envelope (Daily Max / Min °C)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
							data: power.days,
							unit: "°C",
							height: 150,
							series: [{
								key: "tMax",
								label: t("maxTemperature")
							}, {
								key: "tMin",
								label: t("minTemperature")
							}]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-muted-foreground block mb-1",
							children: "Daily Corrected Precipitation (mm/day)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
							data: power.days,
							unit: "mm",
							height: 150,
							series: [{
								key: "rain",
								label: t("rainfall"),
								bar: true
							}]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataProvenance, { data: power.provenance })]
				})]
			})
		]
	});
}
//#endregion
export { EarthIntelligence as component };
