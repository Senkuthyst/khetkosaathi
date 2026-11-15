import { i as __toESM } from "../_runtime.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as fmtDate, c as useApp, o as num } from "./utils-DCauY1E4.mjs";
import { f as stationCurrent, n as calendar, r as freshness, t as DEMO_NOW } from "./mock-CNUdIL6z.mjs";
import { r as summary, t as cropAgeDays } from "./derived-DND3DPU1.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { a as FreshBadge, c as SourceTag } from "./kit-B1K0EjSI.mjs";
import { t as LazyMap } from "./nasa-client-D4FuOaVZ.mjs";
import { t as fetchNasaPowerDaily } from "./nasa-power-Cqs2AoZI.mjs";
import { t as FarmCheckFlow } from "./FarmCheckFlow-DK4pdUAR.mjs";
import { t as CropRotationPlanner } from "./CropRotationPlanner-CByxUfJC.mjs";
import { t as BrandLogo } from "./BrandLogo-FB7WyuxJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D8Davnws.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function LandingPage({ onEnterDashboard }) {
	const { lang, setLang } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#F7F8F2] text-[#18251E] selection:bg-[#B8D987] selection:text-[#123B2A]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-[#E5EAE2] bg-[#FFFFFF]/95 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
							variant: "full",
							theme: "forest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-[#18251E]/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#hero",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "गृह" : "Home"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/earth-intelligence",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "भू-सूचना" : "Earth Intelligence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/crop-health",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "बाली अन्तर्दृष्टि" : "Crop Insights"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/weather",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "खेत अनुगमन" : "Farm Monitoring"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#nasa-integration",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "NASA इन्टिग्रेसन" : "NASA Data"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#about",
									className: "hover:text-[#237A50] transition-colors",
									children: lang === "ne" ? "हाम्रो बारेमा" : "About"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setLang(lang === "ne" ? "en" : "ne"),
									className: "rounded-lg border border-[#E5EAE2] px-2.5 py-1.5 text-xs font-bold text-[#237A50] hover:bg-[#EBF4EC] transition-colors",
									"aria-label": "Switch Language",
									children: lang === "ne" ? "English" : "नेपाली"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: onEnterDashboard,
									className: "hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#123B2A] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#123B2A] hover:bg-[#EBF4EC] transition-colors",
									children: lang === "ne" ? "लग इन" : "Sign In"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: onEnterDashboard,
									className: "inline-flex items-center gap-1.5 rounded-xl bg-[#123B2A] px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold text-[#F7F8F2] shadow-sm hover:bg-[#237A50] transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "ड्यासबोर्ड खोल्नुहोस्" : "Open Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-3.5 w-3.5" })]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "hero",
				className: "relative overflow-hidden pt-4 pb-16 lg:pt-8 lg:pb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#237A50_1px,transparent_1px)] [background-size:24px_24px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-3xl bg-white border border-[#E5EAE2] shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 p-2.5 rounded-2xl bg-[#EBF4EC]/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-base shadow-xs",
										children: "📍"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "block text-xs sm:text-sm font-bold text-[#123B2A]",
										children: lang === "ne" ? "१. खेतको स्थान" : "1. Farm Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-[#18251E]/70 block leading-tight",
										children: lang === "ne" ? "एक ट्यापमा GPS वा नक्सा" : "One tap GPS or map"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 p-2.5 rounded-2xl bg-[#EBF4EC]/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#237A50] text-white font-extrabold text-base shadow-xs",
										children: "🛰️"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "block text-xs sm:text-sm font-bold text-[#123B2A]",
										children: lang === "ne" ? "२. उपग्रह जाँच" : "2. Satellite Check"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-[#18251E]/70 block leading-tight",
										children: lang === "ne" ? "नासा उपग्रहबाट वर्षा र हरियाली" : "NASA rain & greenness"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 p-2.5 rounded-2xl bg-[#EBF4EC]/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B8D987] text-[#123B2A] font-extrabold text-base shadow-xs",
										children: "🌾"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "block text-xs sm:text-sm font-bold text-[#123B2A]",
										children: lang === "ne" ? "३. सरल नतिजा" : "3. Plain Results"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-[#18251E]/70 block leading-tight",
										children: lang === "ne" ? "बत्ती, आवाज र उपयुक्त बाली" : "Light, voice & next crops"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FarmCheckFlow, { ...onEnterDashboard ? { onViewDashboard: onEnterDashboard } : {} })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-[#E5EAE2]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-7 space-y-6 text-center lg:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 rounded-full border border-[#B8D987] bg-[#EBF4EC] px-3.5 py-1.5 text-xs font-extrabold text-[#123B2A]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Satellite, { className: "h-3.5 w-3.5 text-[#237A50]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NASA Earth Observation Intelligence · Nepal" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#123B2A] leading-[1.15]",
										children: "Bringing NASA Earth Intelligence to Nepal's Farms."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base sm:text-lg font-semibold text-[#237A50]",
										children: "खेतको साथी: खेतको सूक्ष्म चिस्यानदेखि अन्तरिक्षको भू-उपग्रह दृष्टिकोणसम्म।"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base sm:text-lg text-[#18251E]/80 max-w-2xl leading-relaxed mx-auto lg:mx-0",
										children: "Monitor changing environmental conditions, explore satellite-powered agricultural insights, and make smarter farming decisions with KHETKOSAATHI. Grounded in real-time NASA POWER, SMAP, GPM IMERG, and MODIS observations calibrated for Nepal."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/earth-intelligence",
											className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#123B2A] px-6 py-3.5 text-sm font-bold text-[#F7F8F2] shadow-md hover:bg-[#237A50] hover:shadow-lg transition-all",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe2, { className: "h-4 w-4 text-[#B8D987]" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "भू-सूचना अन्वेषण गर्नुहोस्" : "Explore Earth Intelligence" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-4 w-4" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: onEnterDashboard,
											className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#123B2A] bg-white px-6 py-3.5 text-sm font-bold text-[#123B2A] hover:bg-[#EBF4EC] transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Compass, { className: "h-4 w-4 text-[#237A50]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "हाम्रो मञ्च जान्नुहोस्" : "Discover Our Platform" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 grid grid-cols-3 gap-4 border-t border-[#E5EAE2] text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-2xl font-extrabold text-[#123B2A]",
												children: "4+"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#758078] font-medium",
												children: "NASA Satellites Ingested"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-2xl font-extrabold text-[#237A50]",
												children: "250 m"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#758078] font-medium",
												children: "MODIS Phenology Grid"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-2xl font-extrabold text-[#123B2A]",
												children: "100%"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#758078] font-medium",
												children: "Bilingual (नेपाली / EN)"
											})] })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:col-span-5 relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border-2 border-[#123B2A]/20 bg-gradient-to-br from-[#0C1821] to-[#152432] p-4 sm:p-6 text-white shadow-2xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/10 bg-[#1E3A4C]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
												viewBox: "0 0 400 320",
												fill: "none",
												xmlns: "http://www.w3.org/2000/svg",
												className: "w-full h-full object-cover opacity-85",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
														width: "400",
														height: "320",
														fill: "#143224"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M-20 60 C80 90, 140 40, 220 110 C300 180, 360 210, 420 260",
														stroke: "#2A5C7E",
														strokeWidth: "14",
														strokeLinecap: "round"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M-20 60 C80 90, 140 40, 220 110 C300 180, 360 210, 420 260",
														stroke: "#4287B5",
														strokeWidth: "8",
														strokeLinecap: "round"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "50,130 110,120 130,190 70,200",
														fill: "#2E7D32",
														fillOpacity: "0.7",
														stroke: "#81C784",
														strokeWidth: "1"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "120,115 190,95 210,165 140,185",
														fill: "#388E3C",
														fillOpacity: "0.8",
														stroke: "#A5D6A7",
														strokeWidth: "1"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "65,210 145,195 160,280 80,290",
														fill: "#1B5E20",
														fillOpacity: "0.9",
														stroke: "#66BB6A",
														strokeWidth: "1.5"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "230,130 310,110 330,190 250,210",
														fill: "#43A047",
														fillOpacity: "0.75",
														stroke: "#81C784",
														strokeWidth: "1"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "260,220 340,200 360,280 280,295",
														fill: "#689F38",
														fillOpacity: "0.7",
														stroke: "#C5E1A5",
														strokeWidth: "1"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: "155,200 235,180 250,260 170,275",
														fill: "#B8D987",
														fillOpacity: "0.4",
														stroke: "#B8D987",
														strokeWidth: "2.5",
														strokeDasharray: "4 2"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														cx: "205",
														cy: "230",
														r: "4",
														fill: "#B8D987"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														cx: "205",
														cy: "230",
														r: "10",
														stroke: "#B8D987",
														strokeWidth: "1",
														strokeDasharray: "2 2",
														className: "animate-ping"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute top-3 left-3 bg-[#0C1821]/80 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] font-mono text-[#B8D987] border border-white/10 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Satellite, { className: "h-3.5 w-3.5 text-[#B8D987]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MOD13Q1 · 27.6775° N, 84.4333° E" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute bottom-3 right-3 bg-[#0C1821]/80 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] text-white/90 border border-white/10",
												children: "Chitwan Pilot Field · 3.42 ha"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px] text-[#B8D987]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NDVI Health" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Leaf, { className: "h-3.5 w-3.5" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl font-bold mt-1 block",
														children: "0.68"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-white/70",
														children: "MODIS 16-day Composite"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px] text-[#B8D987]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Soil Moisture" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Droplets, { className: "h-3.5 w-3.5" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl font-bold mt-1 block",
														children: "24.8%"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-white/70",
														children: "15 cm In-Situ Sensor"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px] text-[#B8D987]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NASA POWER Temp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CloudSun, { className: "h-3.5 w-3.5" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl font-bold mt-1 block",
														children: "29.3°C"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-white/70",
														children: "Daily UTC Mean Max"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl bg-white/10 backdrop-blur-md border border-white/15 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px] text-[#B8D987]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GPM Rainfall" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.TrendingUp, { className: "h-3.5 w-3.5" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl font-bold mt-1 block",
														children: "4.3 mm"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-white/70",
														children: "7-Day Cumulative"
													})
												]
											})
										]
									})]
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 bg-white border-y border-[#E5EAE2]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-[#237A50]/10 px-3 py-1 text-xs font-bold text-[#237A50]",
								children: "EARTH OBSERVATION PORTFOLIO"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight",
								children: "Four NASA Missions. One Unified Agro-Intelligence System."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-[#18251E]/75",
								children: "KHETKOSAATHI transforms raw spaceborne observations into actionable agricultural intelligence for extension workers and smallholder farmers."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
						children: [
							{
								title: "NASA POWER",
								tag: "Meteorology & Solar",
								resolution: "0.5° × 0.625° Grid",
								source: "NASA Langley Research Center",
								desc: "Surface solar irradiance, 2-meter air temperature dynamics, and agroclimatology models for energy budgeting.",
								icon: import_lucide_react.CloudSun
							},
							{
								title: "NASA SMAP",
								tag: "Soil Moisture Active Passive",
								resolution: "36 km / 9 km Enhanced",
								source: "NASA Jet Propulsion Laboratory",
								desc: "L-band microwave radiometry detecting surface soil moisture in the top 5 cm to map regional drought stress.",
								icon: import_lucide_react.Droplets
							},
							{
								title: "NASA GPM IMERG",
								tag: "Global Precipitation Measurement",
								resolution: "0.1° (~10 km) Multi-satellite",
								source: "NASA Goddard Space Flight Center",
								desc: "Half-hourly and daily rainfall accumulation tracking monsoon anomalies across river basins.",
								icon: import_lucide_react.TrendingUp
							},
							{
								title: "NASA MODIS / Landsat",
								tag: "Vegetation Indices",
								resolution: "250 m (MODIS) / 30 m (Landsat)",
								source: "USGS / NASA LP DAAC",
								desc: "NDVI and EVI 16-day composites illustrating canopy greenness and crop maturation phenology.",
								icon: import_lucide_react.Sprout
							}
						].map((card, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-lg bg-white p-2.5 shadow-xs border border-[#E5EAE2] text-[#237A50]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-[#758078] bg-white px-2 py-0.5 rounded-md border border-[#E5EAE2]",
										children: card.resolution
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 text-lg font-bold text-[#123B2A]",
									children: card.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-[#237A50] block mt-0.5",
									children: card.tag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-[#18251E]/80 leading-relaxed",
									children: card.desc
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-[#E5EAE2] text-[11px] text-[#758078]",
								children: ["Source: ", card.source]
							})]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 bg-[#F7F8F2]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-[#B8D987]/30 px-3 py-1 text-xs font-bold text-[#123B2A]",
									children: "GROUND-TO-SPACE FUSION"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight",
									children: "Calibrating Orbital Data with On-Farm Realities"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm sm:text-base text-[#18251E]/80 leading-relaxed",
									children: "Satellite data provides invaluable macro context, but smallholder agriculture in Nepal requires precise measurement. KHETKOSAATHI seamlessly bridges the gap by comparing regional estimates with local field station sensors."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3.5",
									children: [
										{
											title: "Volumetric Moisture Discrepancy Detection",
											desc: "Compare SMAP regional topsoil (5 cm) against farm probe (15 cm) to determine root-zone water penetration."
										},
										{
											title: "Rainfall Anomaly vs. In-Situ Gauges",
											desc: "Cross-check GPM IMERG 10 km grid estimates against farm tipping buckets to detect rainshadow effects."
										},
										{
											title: "Microclimate Temperature Offset",
											desc: "Analyze local valley inversion against NASA POWER gridded 2-meter air temperature records."
										}
									].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 rounded-xl bg-white p-4 border border-[#E5EAE2]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle, { className: "h-5 w-5 text-[#237A50] shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-sm text-[#123B2A]",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-[#758078] mt-0.5",
											children: item.desc
										})] })]
									}, i))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-[#E5EAE2] bg-white p-6 sm:p-8 shadow-sm space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-[#E5EAE2] pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-base text-[#123B2A]",
										children: "Chitwan Pilot Calibration Dashboard"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#758078]",
										children: "Bharatpur-14 · Co-registered Sensors"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-[#EBF4EC] px-3 py-1 text-xs font-bold text-[#237A50]",
										children: "Live Validated"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-[#18251E]",
												children: "Soil Moisture (15 cm Probe)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-extrabold text-[#237A50]",
												children: "24.8% Volumetric"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-[#18251E]",
												children: "NASA SMAP Surface (5 cm)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-extrabold text-[#1D5C8A]",
												children: "0.21 m³/m³ (21.0%)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-[#18251E]",
												children: "NASA GPM IMERG 7-Day Rainfall"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-extrabold text-[#1D5C8A]",
												children: "4.3 mm (Deficit: -64%)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl bg-[#F7F8F2] border border-[#E5EAE2]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-[#18251E]",
												children: "MODIS NDVI Vegetation Index"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-extrabold text-[#237A50]",
												children: "0.68 (Normal vegetative)"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-[#EBF4EC] p-3 text-xs text-[#123B2A] flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldAlert, { className: "h-4 w-4 shrink-0 text-[#237A50] mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Scientific Rule:" }), " Never assume coarse satellite pixels equal farm-level microclimate. Always calibrate using ground-truth observations."] })]
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 bg-white border-y border-[#E5EAE2]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-[#237A50]/10 px-3 py-1 text-xs font-bold text-[#237A50]",
								children: "REGENERATIVE CROPPING SYSTEMS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight",
								children: "Regenerative Crop Intelligence & Soil Rebuilding"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-[#18251E]/75",
								children: "Empowering farmers to restore degraded soils through evidence-based crop rotations, biological nitrogen fixation, and reduced chemical dependency."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-[#123B2A]",
										children: "5-Step Interactive Planner"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#758078] leading-relaxed",
										children: "Input your parcel location, soil pH, organic matter, and drainage to receive dynamically weighted multi-season rotation options."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Database, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-[#123B2A]",
										children: "NARC Validated Knowledge"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#758078] leading-relaxed",
										children: "Rules calibrated against multi-decade trials by the Nepal Agricultural Research Council across Terai, Inner Terai, and Mid-Hills agro-ecological zones."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-[#E5EAE2] bg-[#F7F8F2] p-6 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4EC] text-[#237A50]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.BarChart3, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-[#123B2A]",
										children: "Water & Nitrogen Scoring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#758078] leading-relaxed",
										children: "Transparent quantitative metrics including cubic meters of water consumed and biological nitrogen fixed (+35 to +80 kg N/ha)."
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 bg-[#F7F8F2]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-[#B8D987]/30 px-3 py-1 text-xs font-bold text-[#123B2A]",
								children: "END-TO-END WORKFLOW"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold text-[#123B2A] tracking-tight",
								children: "How KHETKOSAATHI Works in Practice"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-[#18251E]/75",
								children: "From drawing farm boundaries on high-resolution maps to receiving timely anomaly alerts."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: [
							{
								step: "01",
								title: "Register & Draw Field",
								desc: "Locate your parcel in Nepal and use the Geoman polygon tool to draw exact plot boundaries."
							},
							{
								step: "02",
								title: "Ingest Satellite Data",
								desc: "The system fetches regional NASA POWER daily climatology and overlay records for your coordinates."
							},
							{
								step: "03",
								title: "Rule-Based Evaluation",
								desc: "Algorithmic checks evaluate soil moisture deficits, thermal heat stress, and phenological milestones."
							},
							{
								step: "04",
								title: "Informed Decision Action",
								desc: "Plan crop rotations, inspect flagged anomalies in person, and share reports with extension officers."
							}
						].map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-[#E5EAE2] bg-white p-6 shadow-sm relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black text-[#237A50]/20 block mb-2",
									children: st.step
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-base text-[#123B2A]",
									children: st.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-[#758078] leading-relaxed",
									children: st.desc
								})
							]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-20 bg-gradient-to-br from-[#123B2A] via-[#1A4F38] to-[#123B2A] text-white relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#B8D987_1px,transparent_1px)] [background-size:20px_20px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-[#B8D987] border border-white/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NASA Space Apps Challenge 2026 Ready" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight",
							children: "Empower Nepal's Agriculture with Earth Intelligence."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed",
							children: "KHETKOSAATHI brings the power of NASA Earth observation satellites down to the farmers of Nepal, fostering sustainable, climate-resilient, and food-secure rural communities."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 flex flex-col sm:flex-row items-center justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onEnterDashboard,
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#B8D987] px-8 py-4 text-base font-extrabold text-[#123B2A] shadow-lg hover:bg-white hover:scale-105 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "कृषि ड्यासबोर्ड खोल्नुहोस्" : "Open Agricultural Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ArrowRight, { className: "h-5 w-5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/earth-intelligence",
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe2, { className: "h-5 w-5 text-[#B8D987]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "NASA डाटा मञ्च हेर्नुहोस्" : "Explore NASA Datasets" })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				id: "about",
				className: "border-t border-[#E5EAE2] bg-[#FFFFFF] py-12 text-xs text-[#758078]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
									variant: "compact",
									theme: "forest"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#758078] leading-relaxed",
									children: "KHETKOSAATHI (खेतको साथी) — Your Intelligent Agricultural Companion. Bringing NASA Earth Intelligence closer to Nepal's farmers."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-sm text-[#123B2A] mb-3",
								children: "Core Modules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/earth-intelligence",
										className: "hover:text-[#237A50]",
										children: "Earth Intelligence"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/crop-health",
										className: "hover:text-[#237A50]",
										children: "Crop Health & NDVI"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/weather",
										className: "hover:text-[#237A50]",
										children: "Weather & Station"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/my-farm",
										className: "hover:text-[#237A50]",
										children: "Farm Plot Boundary"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/guidance",
										className: "hover:text-[#237A50]",
										children: "Crop Rotation Guidance"
									}) })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-bold text-sm text-[#123B2A] mb-3",
								children: "Scientific Data Sources"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://power.larc.nasa.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-[#237A50]",
										children: "NASA POWER Daily AG API"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://smap.jpl.nasa.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-[#237A50]",
										children: "NASA SMAP Soil Moisture"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://gpm.nasa.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-[#237A50]",
										children: "NASA GPM IMERG Precipitation"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://lpdaac.usgs.gov/",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-[#237A50]",
										children: "NASA / USGS MODIS & Landsat"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://narc.gov.np",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-[#237A50]",
										children: "NARC Agronomy Division"
									}) })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-[#123B2A] mb-3",
									children: "Compliance & Attribution"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#758078] leading-relaxed",
									children: "Developed for the NASA Space Apps Challenge 2026. This platform adheres to NASA Open Science data policies. Satellite estimates are regional indicators and do not diagnose farm crop diseases."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-[11px] text-[#758078]",
									children: "© 2026 KHETKOSAATHI · खेतको साथी. All rights reserved."
								})
							] })
						]
					})
				})
			})
		]
	});
}
function DashboardOverview() {
	const { t, lang, field, selectedField, farmFields, activeView, setActiveView } = useApp();
	const [trendTab, setTrendTab] = (0, import_react.useState)("rainfall");
	const [showRotationPlanner, setShowRotationPlanner] = (0, import_react.useState)(false);
	const [powerData, setPowerData] = (0, import_react.useState)(null);
	const selectedFieldId = selectedField?.id;
	const selectedFieldLatitude = selectedField?.latitude;
	const selectedFieldLongitude = selectedField?.longitude;
	(0, import_react.useEffect)(() => {
		let active = true;
		if (!selectedFieldId || selectedFieldLatitude === void 0 || selectedFieldLongitude === void 0) {
			setPowerData(null);
			return () => {
				active = false;
			};
		}
		fetchNasaPowerDaily(false, {
			latitude: selectedFieldLatitude,
			longitude: selectedFieldLongitude,
			fieldId: selectedFieldId
		}).then((data) => {
			if (active) setPowerData(data);
		}).catch((err) => {
			if (!active) return;
			console.warn("NASA POWER fetch failed:", err);
			setPowerData(null);
		});
		return () => {
			active = false;
		};
	}, [
		selectedFieldId,
		selectedFieldLatitude,
		selectedFieldLongitude
	]);
	if (activeView === "landing") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPage, { onEnterDashboard: () => setActiveView("dashboard") });
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
					children: "Welcome to Khetkosaathi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground leading-relaxed",
					children: "No agricultural plot registered yet. Register your farmland anywhere in Nepal to monitor real satellite indicators, weather forecasts, and crop health."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 flex justify-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/onboarding",
						className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Register Your First Farm Plot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-4 w-4" })]
					})
				})
			]
		})
	});
	const currentField = selectedField;
	const s = summary();
	const f = freshness(stationCurrent.observedAt, 2);
	const powerDays = powerData?.days ?? [];
	const powerMaxTemps = powerDays.map((d) => d.tMax).filter((v) => v !== null);
	const powerLatestMax = powerMaxTemps.length > 0 ? powerMaxTemps.at(-1) : null;
	const powerRainTotal = powerDays.length > 0 ? powerDays.reduce((acc, d) => acc + (d.rain ?? 0), 0) : null;
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
									children: lang === "ne" ? "सक्रिय कृषि अनुगमन" : "Active Farm Monitoring"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Clock, { className: "h-3.5 w-3.5" }), fmtDate(lang, DEMO_NOW.toISOString())]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
							children: currentField.fieldName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 text-primary" }),
										currentField.municipality || "Nepal",
										currentField.district ? `, ${currentField.district}` : "",
										" (",
										currentField.latitude.toFixed(4),
										"° N, ",
										currentField.longitude.toFixed(4),
										"° E)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-4 w-4 text-primary" }),
										currentField.cropType,
										" · ",
										num(lang, cropAgeDays(currentField.plantingDate)),
										" ",
										t("days"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"(",
												lang === "ne" ? "सक्रिय चरण" : "Active Growth Stage",
												")"
											]
										})
									]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 self-start md:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/earth-intelligence",
							className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-secondary transition-all shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe2, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "NASA भू-सूचना" : "NASA Earth Intel" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/onboarding",
							className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("editField") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-3.5 w-3.5" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Environmental observations are derived from live NASA Earth observation models (NASA POWER Daily Point API at ",
						currentField.latitude.toFixed(2),
						"° N,",
						" ",
						currentField.longitude.toFixed(2),
						"° E). Satellite estimates reflect regional grids, not direct ground sensor readings."
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-extrabold text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Radio, { className: "h-4 w-4 text-primary" }), lang === "ne" ? "वातावरणीय मुख्य सूचकहरू" : "Environmental Core Metrics"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: lang === "ne" ? "NASA POWER भू-उपग्रह मोडल तथा खेत सेन्सर" : "NASA Satellite & Farm Sensor Observations"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CloudRain, { className: "h-4 w-4 text-primary" }), t("rain7")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f: powerData?.provenance?.observedAt ? "fresh" : f })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold text-foreground",
									children: powerRainTotal !== null ? powerRainTotal.toFixed(1) : num(lang, s.rain7)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-muted-foreground",
									children: "mm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									"NASA POWER 7-day grid sum:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: powerRainTotal !== null ? `${powerRainTotal.toFixed(1)} mm` : "Loading..." })
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-primary",
								children: "NASA POWER Daily (MERRA-2)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: powerData?.provenance?.observedAt ?? fmtDate(lang, stationCurrent.observedAt) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Thermometer, { className: "h-4 w-4 text-primary" }), t("temperature")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f: powerData?.provenance?.observedAt ? "fresh" : f })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold text-foreground",
									children: powerLatestMax !== null ? powerLatestMax.toFixed(1) : num(lang, stationCurrent.temp)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-muted-foreground",
									children: "°C"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									"NASA POWER regional:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: powerLatestMax !== null ? `${powerLatestMax.toFixed(1)}°C Max` : "Loading..." })
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-primary",
								children: "NASA POWER Point Daily"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: powerData?.provenance?.observedAt ?? fmtDate(lang, stationCurrent.observedAt) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Droplets, { className: "h-4 w-4 text-primary" }), t("soilMoisture")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold text-foreground",
									children: num(lang, stationCurrent.soil)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-muted-foreground",
									children: "%"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: ["NASA SMAP 9km regional: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Regional Satellite Indicator" })]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-primary",
								children: t("soilDepth")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtDate(lang, stationCurrent.observedAt) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-satellite flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-muted-foreground flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Leaf, { className: "h-4 w-4 text-satellite" }), t("vegTrend")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f: "fresh" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-extrabold text-foreground",
									children: "Active Growth"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-satellite px-1.5 py-0.5 rounded-md bg-satellite-soft",
									children: "Canopy Stage"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "MODIS 250m Composite: Photosynthetic indicator"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTag, { source: "modis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terra MODIS MOD13Q1" })]
						})]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-base text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Globe2, { className: "h-4 w-4 text-primary" }), lang === "ne" ? "भू-उपग्रह अवलोकन नक्सा तथा पार्सल सिमाना" : "Earth Observation Map & Parcel Boundaries"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								currentField.municipality || "Nepal",
								currentField.district ? `, ${currentField.district}` : "",
								" · Selected parcel boundary overlaid on high-resolution cadastre"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-veg-good/15 px-2 py-0.5 text-xs font-bold text-veg-good",
									children: ["● ", t("vegGood")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-veg-watch/15 px-2 py-0.5 text-xs font-bold text-veg-watch",
									children: ["● ", t("vegWatch")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/earth-intelligence",
									className: "text-xs font-bold text-primary hover:underline ml-2 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "विस्तृत भू-सूचना हेर्नुहोस्" : "Full Earth Intel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-3.5 w-3.5" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl overflow-hidden border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
							center: [currentField.latitude, currentField.longitude],
							zoom: 15,
							height: 380,
							polygons: currentField.boundary && currentField.boundary.length > 0 ? [{
								positions: currentField.boundary,
								color: "var(--veg-good)",
								label: currentField.fieldName
							}] : []
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Farm Area:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [currentField.areaM2 ? (currentField.areaM2 / 1e4).toFixed(2) : "0.5", " ha"] }),
							" ",
							"· Selected Field ID:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px]",
								children: [currentField.id.slice(0, 8), "..."]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px]",
							children: "Data Sources: NASA POWER Point API, MODIS 250m, OpenStreetMap"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-base text-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-4 w-4 text-primary" }), lang === "ne" ? "कृषि अन्तर्दृष्टि तथा विसङ्गति मूल्याङ्कन" : "Agricultural Insights & Anomaly Analysis"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary",
								children: "NARC Calibrated"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "वर्षा तथा सिँचाइ विश्लेषण" : "Precipitation & Irrigation Balance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-extrabold",
										children: "NASA POWER Verified"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: [
										"7-day accumulated precipitation for coordinates [",
										currentField.latitude.toFixed(2),
										"°N, ",
										currentField.longitude.toFixed(2),
										"°E] is",
										" ",
										powerRainTotal !== null ? `${powerRainTotal.toFixed(1)} mm` : "being verified",
										". Maintain proper field moisture balance for active growth of ",
										currentField.cropType,
										"."
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-bold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "वनस्पति स्वास्थ्य सूचकाङ्क" : "Vegetation Chlorophyll Index" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fresh font-extrabold",
										children: "Canopy Active"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Spaceborne vegetation reflectance indicates photosynthetic activity within expected regional range. Continue routine field walk to check for localized pests or soil nutrient deficiency."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowRotationPlanner(!showRotationPlanner),
								className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RotateCcw, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showRotationPlanner ? lang === "ne" ? "बाली चक्र योजनाकार बन्द गर्नुहोस्" : "Hide Rotation Planner" : lang === "ne" ? "बाली चक्र योजनाकार खोल्नुहोस्" : "Open 5-Step Crop Rotation Planner" })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-base text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Calendar, { className: "h-4 w-4 text-primary" }), t("reminders")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/guidance",
							className: "text-xs font-bold text-primary hover:underline",
							children: [t("guidance"), " ↗"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: calendar.filter((c) => c.crops.includes(currentField.cropType ?? "rice")).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-border bg-muted/20 p-3 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-lg bg-primary/10 px-2 py-1 text-xs font-extrabold text-primary shrink-0 mt-0.5",
								children: [
									num(lang, c.inDays),
									" ",
									t("inDays")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground leading-relaxed",
								children: c[lang]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground block mt-1",
								children: "Source: NARC Agronomy Advisory"
							})] })]
						}, c.id))
					})]
				})]
			}),
			showRotationPlanner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropRotationPlanner, {})
			})
		]
	});
}
//#endregion
export { DashboardOverview as component };
