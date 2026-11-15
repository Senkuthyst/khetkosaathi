import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, n as cn, o as num } from "./utils-DCauY1E4.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CropRotationPlanner-CByxUfJC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function CropRotationPlanner() {
	const { lang } = useApp();
	const [step, setStep] = (0, import_react.useState)(1);
	const [location, setLocation] = (0, import_react.useState)("chitwan");
	const [soilType, setSoilType] = (0, import_react.useState)("alluvial");
	const [ph, setPh] = (0, import_react.useState)(6.2);
	const [organicMatter, setOrganicMatter] = (0, import_react.useState)(2.1);
	const [drainage, setDrainage] = (0, import_react.useState)("moderate");
	const [irrigation, setIrrigation] = (0, import_react.useState)("seasonal");
	const [priorities, setPriorities] = (0, import_react.useState)(["soil_health", "water_conservation"]);
	const togglePriority = (id) => {
		setPriorities((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
	};
	const computeSequences = () => {
		const isWaterConserve = priorities.includes("water_conservation");
		const isSoilHealth = priorities.includes("soil_health");
		const isRainfed = irrigation === "rainfed";
		return [
			{
				id: "seq-legume",
				title: "Rice → Wheat → Mungbean / Cowpea",
				titleNe: "धान → गहुँ → मुङ / बोडी (दलहन समावेश)",
				pattern: [
					"Rice (Monsoon)",
					"Wheat (Winter)",
					"Mungbean (Spring Legume)"
				],
				suitabilityScore: Math.min(96, Math.max(60, 78 + (isSoilHealth ? 10 : 0) + (drainage === "moderate" ? 5 : 0) + (ph >= 6 && ph <= 7.2 ? 6 : -4) + (isRainfed ? -15 : 2))),
				waterReqLevel: isRainfed ? "High" : "Medium",
				waterReqMm: "1,150 – 1,350 mm/yr",
				nitrogenImpact: "+35 to +50 kg N/ha biological fixation",
				organicMatterScore: 88,
				pestBreakScore: 82,
				pros: [
					"Mungbean fixes atmospheric nitrogen, reducing subsequent synthetic urea requirement.",
					"Breaks the monoculture weed and insect pathogen cycle between wheat and monsoon rice.",
					"High protein harvest for family nutrition and local market sale."
				],
				cons: ["Requires timely spring sowing before pre-monsoon squalls.", "Sensitive to waterlogging during early legume flowering."],
				scientificEvidence: "Nepal Agricultural Research Council (NARC) Agronomy Division long-term trials in Terai & Mid-Hills (1998–2024); CIMMYT South Asia cropping systems report.",
				limitations: "Legume rhizobium nodulation efficiency depends on adequate phosphorus and absence of extreme soil acidity (pH > 5.8)."
			},
			{
				id: "seq-oilseed",
				title: "Rice → Rapeseed (Mustard) → Spring Maize",
				titleNe: "धान → तोरी → मकै (तेलहन-अन्न विविधता)",
				pattern: [
					"Rice (Monsoon)",
					"Mustard / Toria (Early Winter)",
					"Spring Maize"
				],
				suitabilityScore: Math.min(94, Math.max(55, 74 + (isWaterConserve ? 12 : 0) + (soilType === "sandyLoam" || soilType === "alluvial" ? 6 : 0) + (isRainfed ? 5 : -2))),
				waterReqLevel: "Low",
				waterReqMm: "850 – 1,050 mm/yr",
				nitrogenImpact: "Neutral to slight negative (requires balanced organic manure)",
				organicMatterScore: 74,
				pestBreakScore: 89,
				pros: [
					"High water-use efficiency; mustard thrives on residual monsoon moisture.",
					"Mustard root glucosinolates provide biofumigation against soil nematodes.",
					"Frees land quickly (85–95 days) allowing timely spring maize planting."
				],
				cons: ["Mustard is sensitive to alternating winter aphids during high humidity.", "Does not add biological nitrogen; requires compost or farmyard manure."],
				scientificEvidence: "NARC National Oilseed Research Program (Nawalpur, Sarlahi); Directorate of Agricultural Research (Gandaki/Bagmati).",
				limitations: "Biofumigation effect requires turning under green residues; aphid risk requires frequent visual plot scouting."
			},
			{
				id: "seq-tuber-green",
				title: "Rice → Potato → Dhaincha (Green Manure)",
				titleNe: "धान → आलु → ढैँचा (हरियो मल र आलु)",
				pattern: [
					"Rice (Monsoon)",
					"Potato (Winter Cash Crop)",
					"Dhaincha (Summer Green Manure)"
				],
				suitabilityScore: Math.min(92, Math.max(50, 72 + (drainage === "well" ? 14 : drainage === "poor" ? -18 : 2) + (irrigation === "assured" ? 12 : -15) + (organicMatter >= 2.5 ? 6 : 0))),
				waterReqLevel: "Medium",
				waterReqMm: "1,000 – 1,200 mm/yr",
				nitrogenImpact: "+60 to +80 kg N/ha from Dhaincha biomass",
				organicMatterScore: 95,
				pestBreakScore: 85,
				pros: [
					"Exceptional organic matter building via Sesbania (Dhaincha) incorporation.",
					"Potato offers high economic cash returns per kattha/ropani in winter.",
					"Substantial improvement in soil aggregate stability and water retention."
				],
				cons: ["Requires strict tuber seed storage and reliable irrigation during potato bulking.", "Unsuitable for waterlogged or poorly drained heavy clay parcels."],
				scientificEvidence: "NARC National Potato Research Program (Khumaltar) & Regional Agricultural Research Station (Lumle/Parwanipur).",
				limitations: "Late blight (Phytophthora) vulnerability in cool foggy winter periods; potato requires light, friable, well-drained topsoil."
			}
		];
	};
	const sequences = computeSequences();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-gradient-to-r from-card to-secondary/30 p-5 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-3.5 w-3.5" }), lang === "ne" ? "निर्णय सहयोग प्रणाली" : "Scientific Decision Support"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-xl sm:text-2xl font-extrabold text-foreground tracking-tight",
							children: lang === "ne" ? "बाली चक्र तथा माटो व्यवस्थापन योजनाकार" : "Crop Intelligence & Rotation Planner"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl",
							children: lang === "ne" ? "स्थान, माटोको गुणस्तर, पानी उपलब्धता र वातावरणीय प्राथमिकता अनुसार वैज्ञानिक रूपमा सिफारिस गरिएको ५-चरणे बाली चक्र।" : "Evaluate regenerative crop rotation sequences based on your farm's soil characteristics, water availability, and agro-ecological priorities."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 self-start sm:self-auto bg-muted/60 p-1 rounded-xl",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStep(s),
							className: cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", step === s ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
							children: lang === "ne" ? `चरण ${num(lang, s)}` : `Step ${s}`
						}, s))
					})]
				})
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
							children: "1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-foreground",
							children: lang === "ne" ? "चरण १: खेतको भौगोलिक क्षेत्र चयन गर्नुहोस्" : "Step 1: Select Farm Location & Agro-Ecological Zone"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: lang === "ne" ? "नेपालका फरक कृषि-पारिस्थितिक क्षेत्रहरूमा तापक्रम, सौर्य विकिरण र मनसुनको ढाँचा फरक हुने भएकाले उपयुक्त स्थान छान्नुहोस्।" : "Cropping suitability depends on altitude, thermal units, and precipitation timing across Nepal's diverse agro-ecological belts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
						children: [
							{
								id: "chitwan",
								name: "Chitwan Valley (चितवन उपत्यका)",
								zone: "Inner Terai / Sub-tropical (180–250 m)",
								temp: "15°C – 38°C",
								rain: "1,800 mm/yr"
							},
							{
								id: "jhapa",
								name: "Eastern Terai - Jhapa (झापा तराई)",
								zone: "Eastern Plain (70–120 m)",
								temp: "12°C – 36°C",
								rain: "2,200 mm/yr"
							},
							{
								id: "pokhara",
								name: "Pokhara Valley (पोखरा उपत्यका)",
								zone: "Mid-Hills River Basin (800–950 m)",
								temp: "8°C – 32°C",
								rain: "3,800 mm/yr"
							},
							{
								id: "kavre",
								name: "Kavre Mid-Hills (काभ्रे मध्यपहाड)",
								zone: "Mid-Hills Terraced (1,200–1,600 m)",
								temp: "4°C – 28°C",
								rain: "1,400 mm/yr"
							}
						].map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setLocation(loc.id),
							className: cn("cursor-pointer rounded-xl border-2 p-4 transition-all text-left", location === loc.id ? "border-primary bg-secondary/50 shadow-sm" : "border-border hover:border-primary/40 bg-card"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-sm text-foreground",
										children: loc.name
									}), location === loc.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-4 w-4 text-primary shrink-0" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-primary font-medium",
									children: loc.zone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🌡 ", loc.temp] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🌧 ", loc.rain] })]
								})
							]
						}, loc.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(2),
							className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm",
							children: [lang === "ne" ? "अर्को: माटोका विशेषताहरू" : "Next: Soil Characteristics", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-4 w-4" })]
						})
					})
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
							children: "2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-foreground",
							children: lang === "ne" ? "चरण २: माटोको भौतिक तथा रासायनिक अवस्था" : "Step 2: Enter Soil Characteristics"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-2",
								children: lang === "ne" ? "माटोको प्रकार (Soil Texture)" : "Soil Texture / Classification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [
									{
										id: "alluvial",
										label: "Alluvial Silt (दोमट/पाँगो)"
									},
									{
										id: "clayLoam",
										label: "Clay Loam (चिम्ट्याइलो)"
									},
									{
										id: "sandyLoam",
										label: "Sandy Loam (बलौटे दोमट)"
									},
									{
										id: "siltLoam",
										label: "Silt Loam (मसिनो पाँगो)"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSoilType(s.id),
									className: cn("tap rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all text-left", soilType === s.id ? "border-primary bg-secondary text-primary" : "border-border text-foreground hover:bg-muted"),
									children: s.label
								}, s.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-2",
								children: lang === "ne" ? "पानी निकास (Drainage Capacity)" : "Parcel Drainage Capacity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										id: "well",
										label: "Well Drained (राम्रो)"
									},
									{
										id: "moderate",
										label: "Moderate (मध्यम)"
									},
									{
										id: "poor",
										label: "Poor / Waterlogged (कमजोर)"
									}
								].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDrainage(d.id),
									className: cn("tap rounded-xl border-2 px-2 py-2 text-xs font-semibold transition-all text-center", drainage === d.id ? "border-primary bg-secondary text-primary" : "border-border text-foreground hover:bg-muted"),
									children: d.label
								}, d.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-4 bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground",
											children: lang === "ne" ? "माटोको pH मान" : "Soil pH Level"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-extrabold text-sm text-primary",
											children: [
												num(lang, ph.toFixed(1)),
												" (",
												ph < 5.8 ? "Acidic" : ph > 7.3 ? "Alkaline" : "Optimal Neutral",
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "4.5",
										max: "8.5",
										step: "0.1",
										value: ph,
										onChange: (e) => setPh(parseFloat(e.target.value)),
										className: "w-full mt-3 accent-primary cursor-pointer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[10px] text-muted-foreground mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4.5 (Acidic)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "6.5 (Neutral)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8.5 (Alkaline)" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-4 bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground",
											children: lang === "ne" ? "जैविक पदार्थ (Organic Matter %)" : "Soil Organic Matter (SOM %)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-extrabold text-sm text-primary",
											children: [
												num(lang, organicMatter.toFixed(1)),
												"% (",
												organicMatter < 1.5 ? "Low" : organicMatter < 3 ? "Moderate" : "Good",
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "0.8",
										max: "5.0",
										step: "0.1",
										value: organicMatter,
										onChange: (e) => setOrganicMatter(parseFloat(e.target.value)),
										className: "w-full mt-3 accent-primary cursor-pointer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[10px] text-muted-foreground mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0.8% (Depleted)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2.5% (Average Terai)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5.0% (Enriched)" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-2",
									children: lang === "ne" ? "सिँचाइ सुविधा (Irrigation Infrastructure)" : "Farm Irrigation Infrastructure"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
									children: [
										{
											id: "assured",
											title: "Year-Round Canal / Borewell",
											desc: "कुलो वा बोरिङबाट बाह्रै महिना"
										},
										{
											id: "seasonal",
											title: "Seasonal Irrigation",
											desc: "मनसुन र हिउँदको सुरुमा मात्र"
										},
										{
											id: "rainfed",
											title: "Rainfed (आकासे पानी निर्भर)",
											desc: "कुनै स्थायी सिँचाइ संरचना नभएको"
										}
									].map((irr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setIrrigation(irr.id),
										className: cn("tap rounded-xl border-2 p-3 text-left transition-all", irrigation === irr.id ? "border-primary bg-secondary text-primary" : "border-border text-foreground hover:bg-muted"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-xs",
											children: irr.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: irr.desc
										})]
									}, irr.id))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStep(1),
							className: "rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors",
							children: lang === "ne" ? "पछाडि" : "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(3),
							className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm",
							children: [lang === "ne" ? "अर्को: कृषि प्राथमिकताहरू" : "Next: Farming Priorities", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-4 w-4" })]
						})]
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
							children: "3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-foreground",
							children: lang === "ne" ? "चरण ३: कृषि तथा वातावरणीय प्राथमिकता छान्नुहोस्" : "Step 3: Select Farming Priorities & Goals"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: lang === "ne" ? "तपाईंको खेतका मुख्य आवश्यकताहरू छान्नुहोस्। प्रणालीले सोही अनुसार उपयुक्त बाली चक्रको गणना गर्नेछ।" : "Choose 1 to 4 primary agro-ecological objectives to weight the suitability scoring algorithm."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [
							{
								id: "soil_health",
								Icon: import_lucide_react.Sprout,
								title: "Soil Fertility & N-Fixation (माटो सुधार र नाइट्रोजन)",
								desc: "Rebuild depleted organic carbon and add natural biological nitrogen through leguminous crops."
							},
							{
								id: "water_conservation",
								Icon: import_lucide_react.Droplets,
								title: "Water Conservation & Drought Guard (पानी बचत)",
								desc: "Minimize groundwater pumping and prioritize crops with low evapotranspiration during dry months."
							},
							{
								id: "crop_diversification",
								Icon: import_lucide_react.Layers,
								title: "Crop Diversification & Pest Breaks (रोग-कीरा नियन्त्रण)",
								desc: "Interrupt insect lifecycles and soil fungal pathogens by rotating non-host plant families."
							},
							{
								id: "environmental_resilience",
								Icon: import_lucide_react.Scale,
								title: "Climate & Economic Resilience (जलवायु अनुकूलन)",
								desc: "Balance market profitability with thermal heat-stress tolerance for unpredictable weather."
							}
						].map((p) => {
							const active = priorities.includes(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => togglePriority(p.id),
								className: cn("cursor-pointer rounded-xl border-2 p-4 transition-all flex items-start gap-3", active ? "border-primary bg-secondary/50 shadow-sm" : "border-border hover:border-primary/40 bg-card"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("p-2 rounded-lg shrink-0", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.Icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-foreground",
											children: p.title
										}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-4 w-4 text-primary shrink-0" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 leading-relaxed",
										children: p.desc
									})]
								})]
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStep(2),
							className: "rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors",
							children: lang === "ne" ? "पछाडि" : "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(4),
							disabled: priorities.length === 0,
							className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50",
							children: [lang === "ne" ? "चरण ४: विकल्पहरूको विश्लेषण" : "Step 4: Analyze Rotation Alternatives", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-4 w-4 text-accent" })]
						})]
					})
				]
			}),
			step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
							children: "4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-foreground",
							children: lang === "ne" ? "चरण ४: वैज्ञानिक मोडल विश्लेषण सारांश" : "Step 4: Agro-Ecological Analysis Summary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/40 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground block",
									children: lang === "ne" ? "स्थान" : "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-foreground capitalize",
									children: location
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/40 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground block",
									children: lang === "ne" ? "माटो र pH" : "Texture & pH"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-bold text-foreground capitalize",
									children: [
										soilType,
										" · ",
										ph.toFixed(1)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/40 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground block",
									children: lang === "ne" ? "सिँचाइ" : "Irrigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-foreground capitalize",
									children: irrigation
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/40 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground block",
									children: lang === "ne" ? "प्राथमिकताहरू" : "Priorities"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-bold text-primary",
									children: [priorities.length, " Selected"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-secondary/50 border border-primary/20 p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary font-bold text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.TrendingUp, { className: "h-4 w-4" }), lang === "ne" ? "मोडल विश्लेषण नतिजा तयार छ" : "3 Suitable Multi-Cropping Sequences Evaluated"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-foreground/80 leading-relaxed",
							children: [
								"Based on your field's ",
								soilType,
								" texture, pH of ",
								ph.toFixed(1),
								", and ",
								irrigation,
								" ",
								"status in ",
								location,
								", the decision matrix weighted your",
								" ",
								priorities.join(", ").replaceAll("_", " "),
								" goals against NARC long-term agronomic observations."
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-2 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStep(3),
							className: "rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors",
							children: lang === "ne" ? "पछाडि" : "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(5),
							className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm",
							children: [lang === "ne" ? "चरण ५: तुलनात्मक तालिका हेर्नुहोस्" : "Step 5: View Detailed Comparison", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-4 w-4" })]
						})]
					})
				]
			}),
			step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
								children: "5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-foreground",
								children: lang === "ne" ? "चरण ५: बाली चक्र विकल्पहरूको तुलनात्मक प्रतिवेदन" : "Step 5: Crop Rotation Sequence Comparison"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: lang === "ne" ? "विभिन्न चक्रहरूको अनुकूलता अङ्क, पानी खपत, माटो सुधार र प्राविधिक सीमाहरूको विस्तृत तुलना।" : "Compare suitability scores, water requirements, soil health impacts, and published scientific evidence."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setStep(1),
							className: "inline-flex items-center gap-1.5 self-start text-xs font-semibold text-primary hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RotateCcw, { className: "h-3.5 w-3.5" }), lang === "ne" ? "पुनः कन्फिगर गर्नुहोस्" : "Reconfigure Inputs"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
						children: sequences.map((seq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("rounded-2xl border bg-card p-5 shadow-sm flex flex-col justify-between transition-all", idx === 0 ? "border-primary/60 ring-2 ring-primary/10" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-primary",
										children: idx === 0 ? "⭐ Highest Match" : `Alternative ${idx + 1}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-black text-primary",
												children: num(lang, seq.suitabilityScore)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "/100"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] text-muted-foreground uppercase font-semibold",
												children: "Suitability"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "mt-3 font-extrabold text-base text-foreground leading-snug",
									children: lang === "ne" ? seq.titleNe : seq.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex items-center gap-1 flex-wrap",
									children: seq.pattern.map((p, pIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-lg border bg-muted/60 px-2 py-1 text-[11px] font-semibold text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Leaf, { className: "h-3 w-3 text-leaf" }),
											p,
											pIdx < seq.pattern.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "→"
											})
										]
									}, pIdx))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-2 gap-2 text-xs border-y py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: lang === "ne" ? "पानी आवश्यकता" : "Water Need"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-foreground",
										children: [
											seq.waterReqLevel,
											" (",
											seq.waterReqMm,
											")"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block",
										children: lang === "ne" ? "नाइट्रोजन प्रभाव" : "N Balance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-primary",
										children: seq.nitrogenImpact
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-3.5 w-3.5 text-primary" }), lang === "ne" ? "फाइदाहरू" : "Agronomic Advantages"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1.5 space-y-1 text-xs text-foreground/85",
										children: seq.pros.map((pro, pI) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-bold",
												children: "•"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pro })]
										}, pI))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
										className: "text-xs font-bold text-destructive uppercase tracking-wide flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-3.5 w-3.5 text-destructive" }), lang === "ne" ? "सावधानीहरू" : "Considerations & Risks"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-1.5 space-y-1 text-xs text-muted-foreground",
										children: seq.cons.map((con, cI) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive font-bold",
												children: "•"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: con })]
										}, cI))
									})]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 pt-3 border-t text-[11px] space-y-1.5 bg-muted/30 p-2.5 rounded-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-muted-foreground block",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "inline h-3 w-3 mr-1" }),
										lang === "ne" ? "वैज्ञानिक प्रमाण" : "Supporting Evidence",
										":"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground/80",
									children: seq.scientificEvidence
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-muted-foreground block",
									children: [lang === "ne" ? "वैज्ञानिक सीमाहरू" : "Scientific Limitations", ":"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground/70 italic",
									children: seq.limitations
								})] })]
							})]
						}, seq.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-primary/40 bg-secondary/30 p-4 text-xs text-foreground/80 flex items-start gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-primary block",
							children: lang === "ne" ? "वैज्ञानिक शुद्धता तथा सिफारिस सीमा सूचना" : "Scientific Validation & Field Safety Disclaimer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "यो योजनाकार नेपाल कृषि अनुसन्धान परिषद् (NARC) का सिफारिस र स्थापित कृषि-पारिस्थितिक सिद्धान्तमा आधारित निर्णय-सहयोग उपकरण हो। यसले कुनै अप्रमाणित उत्पादनको ग्यारेन्टी गर्दैन। स्थानीय माटो परीक्षण र कृषि विज्ञको सल्लाह लिनुहोस्।" : "KHETKOSAATHI rotation recommendations are research-based decision aids utilizing NARC crop calendars and agro-ecological modeling. They do not constitute guaranteed yield predictions. Always confirm parcel nutrient status with certified soil laboratory tests." })] })]
					})
				]
			})
		]
	});
}
//#endregion
export { CropRotationPlanner as t };
