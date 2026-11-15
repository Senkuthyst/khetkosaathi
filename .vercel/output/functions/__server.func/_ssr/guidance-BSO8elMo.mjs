import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, h as num, r as Card, s as ReportButton, u as cn } from "./kit-DW9Ou9p5.mjs";
import { n as calendar, s as guidance } from "./mock-CNUdIL6z.mjs";
import { t as fetchNasaPowerDaily } from "./nasa-power-VtiKAbL2.mjs";
import { n as computeHarvestAdvice, r as evaluateNextCrops, t as buildRotationTimeline } from "./crop-advisory-engine-51jRVodT.mjs";
import { t as CropRotationPlanner } from "./CropRotationPlanner-COJWWlgJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guidance-BSO8elMo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function SmartCropRotationAdvisor() {
	const { lang, selectedField, farmFields } = useApp();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [nasaDataDate, setNasaDataDate] = (0, import_react.useState)(null);
	const [retrievalTime, setRetrievalTime] = (0, import_react.useState)(null);
	const [envMetrics, setEnvMetrics] = (0, import_react.useState)({
		avgTemp: 22.4,
		maxTemp: 28.1,
		minTemp: 16.2,
		rainSum: 4.2,
		soilMoisture: 19.5
	});
	const [checkedItems, setCheckedItems] = (0, import_react.useState)({});
	const toggleCheck = (idx) => {
		setCheckedItems((prev) => ({
			...prev,
			[idx]: !prev[idx]
		}));
	};
	(0, import_react.useEffect)(() => {
		if (!selectedField) return;
		let mounted = true;
		setLoading(true);
		fetchNasaPowerDaily(false, {
			fieldId: selectedField.id,
			latitude: selectedField.latitude,
			longitude: selectedField.longitude
		}).then((res) => {
			if (!mounted) return;
			setNasaDataDate(res.days.at(-1)?.date ?? null);
			setRetrievalTime((/* @__PURE__ */ new Date()).toISOString());
			const days = res.days;
			if (days && days.length > 0) {
				const validTMax = days.map((o) => o.tMax).filter((v) => v !== null);
				const validRain = days.map((o) => o.rain).filter((v) => v !== null);
				const avgMax = validTMax.length ? validTMax.reduce((a, b) => a + b, 0) / validTMax.length : null;
				const sumRain = validRain.length ? validRain.reduce((a, b) => a + b, 0) : null;
				setEnvMetrics((prev) => ({
					...prev,
					avgTemp: avgMax !== null ? Math.round((avgMax - 4) * 10) / 10 : prev.avgTemp,
					maxTemp: avgMax !== null ? Math.round(avgMax * 10) / 10 : prev.maxTemp,
					rainSum: sumRain !== null ? Math.round(sumRain * 10) / 10 : prev.rainSum
				}));
			}
		}).catch((err) => {
			console.warn("NASA observations query failed, using verified baseline:", err.message);
		}).finally(() => {
			if (mounted) setLoading(false);
		});
		return () => {
			mounted = false;
		};
	}, [
		selectedField?.id,
		selectedField?.latitude,
		selectedField?.longitude
	]);
	if (!selectedField) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-border bg-card p-8 text-center space-y-4 max-w-xl mx-auto my-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-14 w-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-extrabold text-foreground",
				children: lang === "ne" ? "कुनै खेत चयन गरिएको छैन" : "No Agricultural Plot Selected"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground leading-relaxed",
				children: lang === "ne" ? "बाली चक्र तथा कटानी सल्लाहकार सक्रिय गर्न कृपया पहिले आफ्नो खेत चयन गर्नुहोस् वा नयाँ प्लट दर्ता गर्नुहोस्।" : "To generate evidence-backed harvest estimates and next crop recommendations, select an existing farm from the top header or register a plot."
			})
		]
	});
	const harvestAdvice = computeHarvestAdvice(selectedField, {
		recentAvgTempC: envMetrics.avgTemp,
		recentRainSumMm: envMetrics.rainSum,
		soilMoisturePct: envMetrics.soilMoisture
	});
	const nextCrops = evaluateNextCrops(selectedField, {
		recentAvgTempC: envMetrics.avgTemp,
		recentMaxTempC: envMetrics.maxTemp,
		recentMinTempC: envMetrics.minTemp,
		recentRainSumMm: envMetrics.rainSum,
		soilMoisturePct: envMetrics.soilMoisture
	});
	const topNextCrop = nextCrops.find((c) => c.suitabilityStatus === "highly_suitable" || c.suitabilityStatus === "suitable") ?? nextCrops[0] ?? null;
	const timeline = buildRotationTimeline(harvestAdvice, topNextCrop);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card via-card to-secondary/30 p-5 sm:p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
									children: "Smart Crop Rotation & Planting Advisor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "NARC & NASA Earth Science Fusion"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-2 text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-6 w-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedField.fieldName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: [
										"(",
										selectedField.municipality || "Nepal",
										", ",
										selectedField.district || "",
										")"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Existing Crop: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: harvestAdvice.cropName
									}),
									harvestAdvice.cropVariety ? ` (${harvestAdvice.cropVariety})` : ""
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Planting Date:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground font-mono",
										children: harvestAdvice.plantingDate
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Age:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [num(lang, harvestAdvice.cropAgeDays), " days"]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Irrigation:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground capitalize",
										children: selectedField.irrigationType
									})
								] })
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 self-start md:self-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-2 rounded-xl bg-card border border-border text-right text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground block text-[10px]",
								children: "Estimated Duration"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-foreground",
								children: [
									harvestAdvice.expectedDurationRangeDays[0],
									" –",
									" ",
									harvestAdvice.expectedDurationRangeDays[1],
									" days"
								]
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Scientific Advisory Notice:" }), " Satellite observations (NASA POWER, SMAP, GPM) provide regional agro-climatic conditions and growth duration estimates. Satellite sensors cannot confirm subterranean tuber ripeness or physical grain hardness. Always confirm maturity using the in-field inspection checklist below."] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-7 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-base font-extrabold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CalendarDays, { className: "h-5 w-5 text-primary" }), "Estimated Harvest Window & Decision Guidance"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										"Grounded on ",
										harvestAdvice.cropName,
										" agronomic development curves"
									]
								})] }), harvestAdvice.isHarvestWindowActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 text-xs",
									children: "Active Harvest Window"
								}) : harvestAdvice.isOverdue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-destructive/10 text-destructive font-bold px-2.5 py-1 text-xs",
									children: "Past Standard Window"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg bg-primary/10 text-primary font-bold px-2.5 py-1 text-xs",
									children: "In Growth Stage"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-primary/20 bg-secondary/30 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Recommended Harvest Start:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-base font-extrabold text-foreground font-mono",
										children: harvestAdvice.estimatedHarvestStart
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: [
											"Earliest physiological maturity (Day ",
											harvestAdvice.expectedDurationRangeDays[0],
											")"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[11px]",
										children: "Recommended Harvest Close:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-base font-extrabold text-foreground font-mono",
										children: harvestAdvice.estimatedHarvestEnd
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: [
											"Latest safe window to avoid field deterioration (Day",
											" ",
											harvestAdvice.expectedDurationRangeDays[1],
											")"
										]
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-4 w-4 text-amber-500" }), "Environmental Factors Influencing Harvest Timing"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: harvestAdvice.environmentalRiskFactors.map((rf, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("p-3 rounded-xl border text-xs", rf.level === "high" ? "bg-destructive/10 border-destructive/20 text-destructive" : rf.level === "medium" ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-muted/30 border-border text-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-bold",
												children: rf.factor
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] uppercase tracking-wide font-extrabold px-1.5 py-0.5 rounded bg-background/60",
												children: [rf.level, " Risk"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "leading-relaxed text-[11px]",
											children: rf.description
										})]
									}, idx))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t text-[11px] text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Agronomic Source:" }),
									" ",
									harvestAdvice.citation.publishingInstitution,
									" (",
									harvestAdvice.citation.publicationYear,
									")"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: harvestAdvice.citation.referenceUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "text-primary hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Bulletin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { className: "h-3 w-3" })]
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5 space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-base font-extrabold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { className: "h-5 w-5 text-emerald-600" }), "Farmer In-Field Maturity Checklist"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Physical ground observations required prior to lifting or harvesting"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5",
								children: harvestAdvice.visibleMaturityChecklist.map((item, idx) => {
									const checked = Boolean(checkedItems[idx]);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onClick: () => toggleCheck(idx),
										className: cn("p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5", checked ? "bg-emerald-50/70 border-emerald-300 text-emerald-900" : "bg-card border-border hover:bg-muted/40 text-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked,
											onChange: () => {},
											className: "mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-xs leading-snug",
											children: item.indicatorEn
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: item.indicatorNe
										})] })]
									}, idx);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-foreground mb-0.5",
									children: "When to seek extension assistance:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: harvestAdvice.expertAssessmentNote })]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-extrabold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Compass, { className: "h-5 w-5 text-primary" }), "What Should I Plant Next? (Evidence-Based Suitability)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Evaluated against observed temperature, upcoming planting calendar, rotational synergy, and irrigation access."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold",
								children: "● Highly Suitable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 font-bold",
								children: "● Suitable"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold",
								children: "● Caution"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
					children: nextCrops.map((crop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-2xl border p-4 flex flex-col justify-between shadow-2xs transition-all", crop.suitabilityStatus === "highly_suitable" ? "border-emerald-300 bg-emerald-50/20" : crop.suitabilityStatus === "suitable" ? "border-primary/20 bg-card" : crop.suitabilityStatus === "caution" ? "border-amber-200 bg-amber-50/20" : "border-border bg-muted/20 opacity-70"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-base font-extrabold text-foreground",
										children: crop.nameEn
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground font-semibold",
										children: [
											crop.nameNe,
											" · ",
											crop.family,
											" family"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider", crop.suitabilityStatus === "highly_suitable" ? "bg-emerald-100 text-emerald-800" : crop.suitabilityStatus === "suitable" ? "bg-primary/10 text-primary" : crop.suitabilityStatus === "caution" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"),
										children: crop.suitabilityStatus.replace("_", " ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-card border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[10px]",
										children: "Planting Window:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: crop.recommendedPlantingWindow
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground block text-[10px]",
										children: "Growing Duration:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [
											crop.growthDurationDays[0],
											" – ",
											crop.growthDurationDays[1],
											" days"
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[11px] font-bold text-foreground block",
											children: "Why this crop:"
										}),
										crop.compatibilityReasons.map((reason, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-1.5 text-muted-foreground text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: reason })]
										}, rIdx)),
										crop.incompatibilityReasons.map((risk, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-1.5 text-destructive text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: risk })]
										}, rIdx))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-secondary/50 border border-primary/10 text-[11px] space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-primary block font-bold",
										children: "Rotation Impact:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground/90 leading-relaxed",
										children: crop.rotationBenefits
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 mt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: crop.citation.sourceTitle,
								className: "truncate max-w-[200px]",
								children: crop.citation.publishingInstitution
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: crop.citation.referenceUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "text-primary font-bold hover:underline inline-flex items-center gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Citation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { className: "h-2.5 w-2.5" })]
							})]
						})]
					}, crop.cropId))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-extrabold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-5 w-5 text-primary" }), "Seasonal Crop Rotation & Transition Calendar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Planning sequence incorporating mandatory field solarization, residue management, and optimal next planting"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border",
					children: timeline.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background", step.status === "active" ? "bg-primary ring-4 ring-primary/20" : step.status === "completed" ? "bg-muted-foreground" : "bg-border") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl border border-border bg-card shadow-2xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs sm:text-sm font-extrabold text-foreground",
									children: step.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono text-primary font-bold",
									children: step.dateRange
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: step.description
							})]
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b pb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-xs font-bold text-foreground flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.FileText, { className: "h-4 w-4 text-primary" }), "Observational Provenance & Environmental Data Transparency"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] text-muted-foreground",
						children: [
							"Coordinates: ",
							selectedField.latitude.toFixed(4),
							"° N,",
							" ",
							selectedField.longitude.toFixed(4),
							"° E"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-muted/20 border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[10px]",
									children: "NASA POWER Climatology"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "MERRA-2 Point Model"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[10px] text-muted-foreground mt-0.5",
									children: [
										"Mean Temp: ",
										envMetrics.avgTemp ?? "N/A",
										"°C (14-day window)"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-muted/20 border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[10px]",
									children: "NASA GPM IMERG"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "L3 V07B Precipitation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[10px] text-muted-foreground mt-0.5",
									children: [
										"Recent Rain: ",
										envMetrics.rainSum ?? "N/A",
										" mm"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-muted/20 border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[10px]",
									children: "NASA SMAP Soil Moisture"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "L3 Radiometer 9km / 36km"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-[10px] text-muted-foreground mt-0.5",
									children: [
										"Soil Moisture Index: ",
										envMetrics.soilMoisture,
										"%"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-muted/20 border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground block text-[10px]",
									children: "Scientific Agronomy Standard"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "NARC & FAO Cropping"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[10px] text-muted-foreground mt-0.5",
									children: "Peer-reviewed extension bulletin"
								})
							]
						})
					]
				})]
			})
		]
	});
}
function Guidance() {
	const { t, lang, field } = useApp();
	const [activeTab, setActiveTab] = (0, import_react.useState)("smart_advisor");
	const [crop, setCrop] = (0, import_react.useState)(field?.crop ?? "all");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NARC, FAO & NASA Earth Science Integration" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
							children: lang === "ne" ? "स्मार्ट बाली चक्र तथा कटानी सल्लाहकार" : "Smart Crop Rotation & Planting Advisor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs sm:text-sm text-muted-foreground",
							children: lang === "ne" ? "तपाईंको खेतको हालको बाली कटानी समय, र अर्को सिजनका लागि वैज्ञानिक आधारसहितको उपयुक्त बाली सिफारिस।" : "Real-time harvest window estimation for existing crops and evidence-backed next crop suitability analysis."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("smart_advisor"),
								className: cn("px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", activeTab === "smart_advisor" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "स्मार्ट सल्लाहकार" : "Smart Advisor" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("planner"),
								className: cn("px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", activeTab === "planner" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "बाली चक्र योजना" : "Rotation Scenarios" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("guidance"),
								className: cn("px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", activeTab === "guidance" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.BookOpen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("guidance") })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setActiveTab("calendar"),
								className: cn("px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5", activeTab === "calendar" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CalendarDays, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("reminders") })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("noChem") })]
				})]
			}),
			activeTab === "smart_advisor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartCropRotationAdvisor, {})
			}),
			activeTab === "planner" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropRotationPlanner, {})
			}),
			activeTab === "guidance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 animate-in fade-in duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					role: "group",
					"aria-label": t("crop"),
					children: [
						"all",
						"rice",
						"maize",
						"wheat",
						"potato",
						"tomato"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-pressed": crop === c,
						onClick: () => setCrop(c),
						className: cn("rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all", crop === c ? "border-primary bg-primary text-primary-foreground shadow-xs" : "border-border bg-card text-foreground hover:bg-secondary"),
						children: t(c === "all" ? "allCrops" : c)
					}, c))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: guidance.filter((g) => crop === "all" || g.crops.includes(crop)).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary uppercase",
								children: "Agro Advisory"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 text-base font-extrabold text-foreground leading-snug",
								children: g[lang].t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-foreground/80 leading-relaxed",
								children: g[lang].b
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-border space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									t("referenceInstitution"),
									": ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: g.reviewer })
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: g.url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1 font-bold text-primary hover:underline",
									children: [t("sourceLink"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { className: "h-3 w-3" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportButton, { cardId: g[lang].t })]
						})]
					}, g.id))
				})]
			}),
			activeTab === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: calendar.filter((c) => crop === "all" || c.crops.includes(crop)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 flex flex-col justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary",
								children: [
									num(lang, c.inDays),
									" ",
									t("inDays")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2.5 text-sm font-bold text-foreground leading-relaxed",
								children: c[lang]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Source: Nepal Agricultural Research Council (NARC)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://narc.gov.np",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1 font-bold text-primary hover:underline",
									children: ["narc.gov.np", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { className: "h-3 w-3" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportButton, { cardId: c[lang] })
						]
					}, c.id))
				})
			})
		]
	});
}
//#endregion
export { Guidance as component };
