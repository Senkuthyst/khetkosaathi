import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, h as num, n as Btn, t as AppProvider, u as cn } from "./kit-DW9Ou9p5.mjs";
import { n as currentAlerts, r as summary } from "./derived-DND3DPU1.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useLocation, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getCurrentBrowserCoordinates, r as reverseGeocodeCoordinates, t as AuthModal } from "./geolocation-service-DnALuK2_.mjs";
import { t as BrandLogo } from "./BrandLogo-DtceBArD.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-11mcMFDI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
var styles_default = "/assets/styles-CFRdp_xv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function AiAssistant({ isOpen, onClose }) {
	const { lang, field, selectedField } = useApp();
	const [input, setInput] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const messagesEndRef = (0, import_react.useRef)(null);
	const activeFarmLabel = selectedField ? `${selectedField.fieldName}${selectedField.municipality ? ` (${selectedField.municipality})` : ""}` : field?.name ?? "No farm plot registered";
	summary();
	const suggestedQuestions = [
		{
			qNe: "हालको माटोको चिस्यानले मेरो धान बालीलाई कस्तो असर गर्छ?",
			qEn: "How does the current soil moisture reading affect my rice crop?",
			tag: "Soil & Crop"
		},
		{
			qNe: "NASA MODIS NDVI र खेतको सेन्सर बीच के भिन्नता छ?",
			qEn: "What is the difference between NASA MODIS NDVI and on-farm observations?",
			tag: "Earth Observation"
		},
		{
			qNe: "धानपछि माटोको नाइट्रोजन बढाउन कुन बाली चक्र उपयुक्त हुन्छ?",
			qEn: "What crop rotation sequence after rice best replenishes soil nitrogen?",
			tag: "Rotation"
		},
		{
			qNe: "NASA POWER र GPM IMERG वर्षा आँकडाले के संकेत गर्छ?",
			qEn: "What do the NASA POWER and GPM IMERG rainfall figures indicate?",
			tag: "NASA Climate"
		}
	];
	const [messages, setMessages] = (0, import_react.useState)([{
		id: "intro-1",
		sender: "assistant",
		text: lang === "ne" ? "नमस्ते! म खेतको साथीको कृषि बौद्धिक सहायक (KHETKOSAATHI Agricultural Assistant) हुँ। म तपाईंलाई NASA भू-उपग्रह डाटा (POWER, SMAP, GPM IMERG, MODIS), खेतका सेन्सरहरू, र नेपाल कृषि अनुसन्धान परिषद् (NARC) का सिफारिसहरू बुझ्न सहयोग गर्दछु। मलाई कुनै प्रश्न सोध्नुहोस्!" : "Namaste! I am the KHETKOSAATHI Agricultural Intelligence Assistant. I synthesize live NASA Earth observations (NASA POWER, SMAP, GPM IMERG, MODIS), on-farm sensor measurements, and Nepal Agricultural Research Council (NARC) agronomic principles to help you make informed decisions. How may I assist your farm today?",
		timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		}),
		contextData: selectedField ? [
			{
				label: "Selected Farm",
				value: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`
			},
			{
				label: "Coordinates",
				value: `${selectedField.latitude.toFixed(4)}° N, ${selectedField.longitude.toFixed(4)}° E`
			},
			{
				label: "Crop",
				value: `${selectedField.cropType}`
			}
		] : [{
			label: "Selected Farm",
			value: "No farm plot registered yet"
		}, {
			label: "Status",
			value: "Register plot via Onboarding"
		}],
		sources: [
			{
				label: "NASA POWER Daily API",
				url: "https://power.larc.nasa.gov/"
			},
			{
				label: "NASA Earth Observation System",
				url: "https://earthdata.nasa.gov/"
			},
			{
				label: "NARC Agronomy Division",
				url: "https://narc.gov.np"
			}
		]
	}]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);
	const generateAnswer = (userQuery) => {
		const q = userQuery.toLowerCase();
		const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		if (q.includes("soil") || q.includes("चिस्यान") || q.includes("moisture")) {
			const fieldDesc = selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "तपाईंको खेत";
			return {
				id: `resp-${Date.now()}`,
				sender: "assistant",
				text: lang === "ne" ? `${fieldDesc} को लागि माटोको चिस्यान अनुगमन गर्दा: सतह मुनि कम्तीमा २५% भन्दा माथिको चिस्यान धान तथा हिउँदे बालीका लागि आवश्यक हुन्छ। NASA SMAP उपग्रहले ९-३६ कि.मि. क्षेत्रीय दायरामा सतह चिस्यान मापन गर्दछ भने खेत-स्तरको सटीक व्यवस्थापनका लागि सिँचाइ नाला तथा माटोको अवस्था प्रत्यक्ष जाँच्न सिफारिस गरिन्छ।` : `For ${selectedField ? selectedField.fieldName : "your farm plot"}: Active root-zone moisture above 25% volumetric is recommended to sustain vigorous vegetative growth. Regional NASA SMAP microwave observations report regional moisture trends across a 9 km to 36 km grid, while field-level irrigation should be managed based on direct soil inspection.`,
				timestamp: time,
				contextData: [{
					label: "Target Moisture",
					value: "> 25% Volumetric"
				}, {
					label: "SMAP Resolution",
					value: "9 km / 36 km regional grid"
				}],
				sources: [{
					label: "NASA SMAP Mission",
					url: "https://smap.jpl.nasa.gov/"
				}, {
					label: "NARC Soil Science Division",
					url: "https://narc.gov.np"
				}]
			};
		}
		if (q.includes("ndvi") || q.includes("modis") || q.includes("हरियाली") || q.includes("vegetation")) return {
			id: `resp-${Date.now()}`,
			sender: "assistant",
			text: lang === "ne" ? `NASA MODIS (MOD13Q1, २५० मिटर रिजोल्युसन) ले वनस्पति क्यानोपीको हरियाली (NDVI) मापन गर्दछ। ध्यान दिनुहोस्: उपग्रहले बालीको प्रत्यक्ष रोग निदान गर्दैन, बरु क्यानोपीको परावर्तन सूचकाङ्क मात्र देखाउँछ। बाली पाक्ने बेलामा पात पहेँलिँदै जानु स्वाभाविक परिपक्वता (senescence) हो। कुनै शंका लागेमा खेत निरीक्षण गर्नुहोस्।` : `NASA MODIS (MOD13Q1, 250 m spatial resolution) provides vegetation indices (NDVI/EVI) indicating photosynthetic canopy vitality. A satellite vegetation index is an environmental indicator, not a direct disease diagnosis. Declining greenness during late-season crop maturity typically reflects natural senescence rather than distress. Always confirm via ground inspection.`,
			timestamp: time,
			contextData: [
				{
					label: "MODIS Sensor",
					value: "Terra MODIS MOD13Q1"
				},
				{
					label: "Spatial Resolution",
					value: "250 m (16-day composite)"
				},
				{
					label: "Principle",
					value: "Indicator, not direct crop disease diagnosis"
				}
			],
			sources: [{
				label: "NASA LP DAAC MOD13Q1",
				url: "https://lpdaac.usgs.gov/"
			}, { label: "FAO Crop Phenology Guidelines" }]
		};
		if (q.includes("rotation") || q.includes("चक्र") || q.includes("nitrogen") || q.includes("नाइट्रोजन") || q.includes("crop")) return {
			id: `resp-${Date.now()}`,
			sender: "assistant",
			text: lang === "ne" ? `मनसुन धानपछि हिउँदमा गहुँ वा तोरी, र त्यसपछि वसन्त ऋतुमा मुङ (Mungbean) वा ढैँचा (Dhaincha) लगाउँदा माटोमा प्रति हेक्टर ३५ देखि ५० के.जी. जैविक नाइट्रोजन थप हुन्छ। यसले माटोको प्राङ्गारिक पदार्थ बढाउनुका साथै अर्को वर्ष रासायनिक मलको निर्भरता घटाउँछ र माटोको जीवाणु स्वास्थ्य सुधार्छ।` : `According to NARC Agronomy division recommendations for the Chitwan Terai agro-zone, introducing a spring legume such as Mungbean (Vigna radiata) or green manure Dhaincha (Sesbania aculeata) after winter wheat adds between +35 to +50 kg N/ha of biologically fixed nitrogen, while interrupting continuous cereal root-rot fungi.`,
			timestamp: time,
			contextData: [
				{
					label: "Recommended Sequence",
					value: "Rice → Wheat → Mungbean"
				},
				{
					label: "Biological N-Fixation",
					value: "+35 to +50 kg N/ha"
				},
				{
					label: "SOM Impact",
					value: "+0.3% over 3 seasons"
				}
			],
			sources: [{
				label: "NARC Crop Rotation Technical Bulletins",
				url: "https://narc.gov.np"
			}, { label: "CIMMYT South Asia Conservation Agriculture" }]
		};
		if (q.includes("weather") || q.includes("rain") || q.includes("तापक्रम") || q.includes("वर्षा") || q.includes("power") || q.includes("imerg")) {
			const fieldDesc = selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : "तपाईंको खेत";
			return {
				id: `resp-${Date.now()}`,
				sender: "assistant",
				text: lang === "ne" ? `${fieldDesc} को लागि: NASA POWER दैनिक मोडलले खेतको अक्षांश र देशान्तरमा आधारित सतही मौसम (अधिकतम/न्यूनतम तापक्रम, आर्द्रता, वायु गति र सच्याइएको वर्षा) गणना गर्दछ। उपग्रहिय मौसम विश्लेषणले स्थानीय मौसमी उतारचढाव बुझ्न र सिँचाइ समय निर्धारण गर्न मद्दत गर्दछ।` : `For ${selectedField ? selectedField.fieldName : "your farm plot"}: NASA POWER provides daily point meteorology (temperatures, relative humidity, wind speed, corrected precipitation, and solar radiation) parameterized for your exact coordinates. Spaceborne meteorology helps anticipate moisture shifts and optimize irrigation scheduling.`,
				timestamp: time,
				contextData: [{
					label: "Data Source",
					value: "NASA POWER Daily API (MERRA-2)"
				}, {
					label: "Community",
					value: "Agroclimatology (AG)"
				}],
				sources: [{
					label: "NASA POWER Daily Temporal API",
					url: "https://power.larc.nasa.gov/"
				}, {
					label: "NASA Earthdata Science Systems",
					url: "https://earthdata.nasa.gov/"
				}]
			};
		}
		return {
			id: `resp-${Date.now()}`,
			sender: "assistant",
			text: lang === "ne" ? `तपाईंको प्रश्न "${userQuery}" को सन्दर्भमा: KHETKOSAATHI ले उपग्रहिय अवलोकन (NASA POWER, SMAP, IMERG, MODIS) लाई खेतको प्रत्यक्ष सेन्सरसँग जोडेर निर्णय सहयोग प्रदान गर्दछ। माटो चिस्यान, मौसम प्रवृत्ति, बाली चक्र योजना वा भू-उपग्रह सूचकाङ्कबारे थप सोध्न सक्नुहुन्छ।` : `Addressing your inquiry regarding "${userQuery}": KHETKOSAATHI synthesizes spaceborne Earth observations (NASA POWER, SMAP, GPM IMERG, MODIS) with localized field observations to produce evidence-backed guidance. Feel free to ask about soil moisture dynamics, weather patterns, rotation planners, or vegetation anomalies.`,
			timestamp: time,
			sources: [{ label: "KHETKOSAATHI Scientific Rules Engine" }, {
				label: "NASA Earth Science Data Systems (ESDS)",
				url: "https://earthdata.nasa.gov/"
			}]
		};
	};
	const handleSend = (textToSend) => {
		const text = (textToSend || input).trim();
		if (!text) return;
		const userMsg = {
			id: `user-${Date.now()}`,
			sender: "user",
			text,
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setLoading(true);
		setTimeout(() => {
			const response = generateAnswer(text);
			setMessages((prev) => [...prev, response]);
			setLoading(false);
		}, 600);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col w-full max-w-2xl h-[90vh] max-h-[720px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bot, { className: "h-5 w-5 text-accent" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-sm sm:text-base leading-tight",
								children: "KHETKOSAATHI AI Assistant"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent",
								children: "NASA Grounded"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-primary-foreground/75 leading-tight",
							children: lang === "ne" ? "तपाईंको खेत र NASA भू-उपग्रह डाटामा आधारित" : "Contextual AgriTech intelligence for your farm"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 text-primary-foreground/80 hover:text-white transition-colors",
						"aria-label": "Close Assistant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between border-b bg-secondary/50 px-4 py-2 text-xs text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 overflow-x-auto py-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-semibold text-primary shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ShieldCheck, { className: "h-3.5 w-3.5" }), activeFarmLabel]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground shrink-0",
								children: "|"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-muted-foreground",
								children: [
									"📍 Coords:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: selectedField ? `${selectedField.latitude.toFixed(2)}°N, ${selectedField.longitude.toFixed(2)}°E` : "Not set"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-muted-foreground",
								children: [
									"🌾 Crop:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: selectedField?.cropType ?? "Rice"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-muted-foreground",
								children: ["🛰 NASA POWER: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Connected"
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-4",
					children: [
						messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex gap-3 max-w-[88%]", m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"),
							children: [m.sender === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bot, { className: "h-4 w-4 text-accent" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs", m.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-xs" : "bg-muted/80 text-foreground border border-border/80 rounded-tl-xs"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text }),
										m.contextData && m.contextData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60",
											children: m.contextData.map((cd, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg bg-card/70 p-1.5 text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: cd.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground",
													children: cd.value
												})]
											}, i))
										}),
										m.sources && m.sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 pt-2 border-t border-border/50 text-[11px] space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-muted-foreground block flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-3 w-3 text-primary" }),
													lang === "ne" ? "वैज्ञानिक स्रोतहरू" : "Scientific Reference Sources",
													":"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: m.sources.map((src, i) => src.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: src.url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "inline-flex items-center gap-1 rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-semibold text-primary hover:underline",
													children: [src.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ExternalLink, { className: "h-2.5 w-2.5" })]
												}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground",
													children: src.label
												}, i))
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex items-center text-[10px] text-muted-foreground px-1", m.sender === "user" ? "justify-end" : "justify-start"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.timestamp })
								})]
							})]
						}, m.id)),
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.RefreshCw, { className: "h-3.5 w-3.5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "NASA डाटा विश्लेषण हुँदै छ…" : "Synthesizing NASA observations & NARC principles…" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t bg-card px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3 w-3 text-accent" }), lang === "ne" ? "सुझाव गरिएका प्रश्नहरू" : "Suggested Scientific Queries"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
						children: suggestedQuestions.map((sq, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleSend(lang === "ne" ? sq.qNe : sq.qEn),
							className: "shrink-0 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs text-foreground font-medium hover:border-primary/50 hover:bg-secondary transition-all text-left max-w-xs truncate",
							children: lang === "ne" ? sq.qNe : sq.qEn
						}, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSend();
					},
					className: "flex items-center gap-2 border-t p-3 bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: lang === "ne" ? "NASA डाटा, माटो, मौसम वा बालीबारे सोध्नुहोस्…" : "Ask about NASA observations, soil moisture, crop rotation, or weather patterns…",
						className: "flex-1 rounded-xl border border-input bg-muted/30 px-3.5 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !input.trim() || loading,
						className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0",
						"aria-label": "Send Message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Send, { className: "h-4 w-4" })
					})]
				})
			]
		})
	});
}
function Shell({ children }) {
	const { t, lang, setLang, ready, user, profile, signOut, selectedField, setSelectedField, farmFields, currentGpsLocationName, setCurrentGpsLocationName, thresholds, activeView, setActiveView } = useApp();
	const loc = useLocation();
	useNavigate();
	const [online, setOnline] = (0, import_react.useState)(true);
	const [sidebarCollapsed, setSidebarCollapsed] = (0, import_react.useState)(false);
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const [aiAssistantOpen, setAiAssistantOpen] = (0, import_react.useState)(false);
	const [authModalOpen, setAuthModalOpen] = (0, import_react.useState)(false);
	const [fieldDropdownOpen, setFieldDropdownOpen] = (0, import_react.useState)(false);
	const [locatingGps, setLocatingGps] = (0, import_react.useState)(false);
	loc.pathname.startsWith("/onboarding");
	(0, import_react.useEffect)(() => {
		const up = () => setOnline(navigator.onLine);
		up();
		window.addEventListener("online", up);
		window.addEventListener("offline", up);
		return () => {
			window.removeEventListener("online", up);
			window.removeEventListener("offline", up);
		};
	}, []);
	const handleAcquireGps = async () => {
		setLocatingGps(true);
		try {
			const coords = await getCurrentBrowserCoordinates();
			const geocoded = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
			setCurrentGpsLocationName(geocoded.displayName);
		} catch (err) {
			alert(err.message || "Could not retrieve GPS location.");
		} finally {
			setLocatingGps(false);
		}
	};
	const alertCount = ready ? currentAlerts(thresholds).length : 0;
	const navItems = [
		{
			to: "/",
			label: lang === "ne" ? "अवलोकन" : "Overview",
			Icon: import_lucide_react.LayoutDashboard,
			exact: true
		},
		{
			to: "/earth-intelligence",
			label: lang === "ne" ? "भू-सूचना" : "Earth Intelligence",
			Icon: import_lucide_react.Globe2
		},
		{
			to: "/weather",
			label: lang === "ne" ? "मौसम र जलवायु" : "Weather & Climate",
			Icon: import_lucide_react.CloudSun
		},
		{
			to: "/crop-health",
			label: lang === "ne" ? "बाली अनुगमन" : "Crop Monitoring",
			Icon: import_lucide_react.Leaf
		},
		{
			to: "/guidance",
			label: lang === "ne" ? "बाली चक्र योजनाकार" : "Crop Rotation Planner",
			Icon: import_lucide_react.RotateCcw
		},
		{
			to: "/my-farm",
			label: lang === "ne" ? "खेत प्रोफाइलहरू" : "Farm Profiles",
			Icon: import_lucide_react.MapPin
		},
		{
			to: "/alerts",
			label: lang === "ne" ? "प्रतिवेदन तथा सूचना" : "Reports & Alerts",
			Icon: import_lucide_react.Bell,
			badge: alertCount > 0 ? alertCount : void 0
		}
	];
	let locationHeaderLabel = "Location not set";
	if (selectedField) locationHeaderLabel = `${selectedField.fieldName}${selectedField.municipality ? ` · ${selectedField.municipality}` : ""}${selectedField.district ? `, ${selectedField.district}` : ""}`;
	else if (currentGpsLocationName) locationHeaderLabel = currentGpsLocationName;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background font-sans text-foreground antialiased selection:bg-leaf/20 selection:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen z-30", sidebarCollapsed ? "w-20" : "w-64"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center justify-between px-4 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "flex items-center gap-2 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { variant: sidebarCollapsed ? "icon" : "full" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarCollapsed(!sidebarCollapsed),
							className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
							"aria-label": sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar",
							children: sidebarCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronLeft, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-3 py-4 space-y-1.5",
						children: [navItems.map((item) => {
							const active = item.exact ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all relative", active ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground", sidebarCollapsed && "justify-center px-0"),
								title: sidebarCollapsed ? item.label : void 0,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.Icon, { className: cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-primary-foreground" : "text-primary") }),
									!sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									}),
									item.badge !== void 0 && item.badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.2", sidebarCollapsed ? "absolute top-1.5 right-1.5" : "ml-auto"),
										children: num(lang, item.badge)
									})
								]
							}, item.to);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setAiAssistantOpen(true),
							className: cn("w-full group mt-2 flex items-center gap-3 rounded-xl border border-primary/20 bg-secondary/60 px-3 py-2.5 text-xs sm:text-sm font-bold text-primary hover:bg-secondary hover:shadow-xs transition-all relative", sidebarCollapsed ? "justify-center" : "justify-start"),
							title: lang === "ne" ? "AI कृषि सहायक खोल्नुहोस्" : "Open AI Agricultural Assistant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bot, { className: "h-4 w-4 text-primary shrink-0 group-hover:rotate-12 transition-transform" }), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ne" ? "AI कृषि सहायक" : "AI Assistant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-extrabold text-[#123B2A]",
									children: "AI"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border p-3 space-y-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLang(lang === "ne" ? "en" : "ne"),
								className: cn("tap flex-1 rounded-xl border border-border text-xs font-bold text-primary hover:bg-secondary transition-colors text-center py-2", sidebarCollapsed && "px-1 text-[11px]"),
								title: "Toggle Language",
								children: sidebarCollapsed ? lang === "ne" ? "EN" : "ने" : t("langToggle")
							}), !sidebarCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveView(activeView === "dashboard" ? "landing" : "dashboard"),
								className: "tap flex-1 rounded-xl bg-muted hover:bg-secondary text-xs font-bold text-foreground py-2 text-center transition-colors truncate px-2",
								title: activeView === "dashboard" ? "Switch to Landing View" : "Switch to Dashboard",
								children: activeView === "dashboard" ? lang === "ne" ? "ल्यान्डिङ" : "Showcase" : lang === "ne" ? "ड्यासबोर्ड" : "Dashboard"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col min-w-0 overflow-x-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center justify-between gap-3 px-4 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMobileMenuOpen(true),
										className: "md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted",
										"aria-label": "Open Menu",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Menu, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden sm:block min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-semibold text-muted-foreground flex items-center gap-1 leading-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-3 w-3 text-primary" }), selectedField ? "Active Farm Plot" : "Current Region"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-sm font-extrabold text-foreground truncate mt-0.5",
											children: locationHeaderLabel
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:hidden flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { variant: "icon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-extrabold text-xs text-primary truncate max-w-[120px]",
											children: selectedField?.fieldName ?? "KHETKOSAATHI"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative",
								children: farmFields.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setFieldDropdownOpen(!fieldDropdownOpen),
									className: "flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:border-primary/40 hover:bg-secondary transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate max-w-[160px]",
										children: selectedField ? selectedField.fieldName : "Select Active Plot"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" })]
								}), fieldDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 block",
											children: "Your Agricultural Plots"
										}),
										farmFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setSelectedField(f);
												setFieldDropdownOpen(false);
											},
											className: cn("w-full text-left p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between", selectedField?.id === f.id ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: f.fieldName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] opacity-80",
												children: f.cropType
											})]
										}, f.id)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "border-t border-border pt-1 mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/onboarding",
												onClick: () => setFieldDropdownOpen(false),
												className: "w-full text-left p-2 rounded-lg text-xs font-bold text-primary hover:bg-secondary flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "h-3.5 w-3.5" }), "Register New Plot"]
											})
										})
									]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleAcquireGps,
									disabled: locatingGps,
									className: "hidden md:inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Navigation, { className: cn("h-3.5 w-3.5 text-primary", locatingGps && "animate-spin") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: locatingGps ? "Acquiring GPS..." : "Acquire Current GPS" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 sm:gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setAiAssistantOpen(true),
										className: "inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-secondary/80 px-3 py-1.5 text-xs font-extrabold text-primary hover:bg-secondary transition-all shadow-2xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sparkles, { className: "h-3.5 w-3.5 text-leaf" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: lang === "ne" ? "AI सहायक" : "AI Assistant"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/alerts",
										className: "relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted transition-colors",
										"aria-label": "View Alerts",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bell, { className: "h-4 w-4" }), alertCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground",
											children: num(lang, alertCount)
										})]
									}),
									user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/my-farm",
											className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs",
											title: profile?.full_name ?? user.email ?? "Farmer Profile",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.User, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: signOut,
											className: "hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
											title: "Sign Out",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogOut, { className: "h-4 w-4" })
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
										size: "sm",
										variant: "outline",
										onClick: () => setAuthModalOpen(true),
										className: "gap-1.5 text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogIn, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In" })]
									})
								]
							})
						]
					}), !online && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "status",
						className: "flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.WifiOff, { className: "h-4 w-4" }),
							" ",
							t("offline")
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAssistant, {
				isOpen: aiAssistantOpen,
				onClose: () => setAiAssistantOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthModal, {
				isOpen: authModalOpen,
				onClose: () => setAuthModalOpen(false)
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "KHETKOSAATHI — खेतको साथी | NASA Earth Intelligence for Nepal's Farms" },
			{
				name: "description",
				content: "KHETKOSAATHI: Nepal-focused Agricultural Intelligence Platform powered by NASA Earth observation data (NASA POWER, SMAP, GPM IMERG, MODIS)."
			},
			{
				name: "theme-color",
				content: "#123B2A"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:title",
				content: "KHETKOSAATHI — Your Intelligent Agricultural Companion"
			},
			{
				property: "og:description",
				content: "Bringing NASA Earth Intelligence closer to Nepal's farmers."
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@khetkosaathi"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-512.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
function pageHead(title, description) {
	const fullTitle = `${title} — Nepal Agricultural Intelligence Platform`;
	return { meta: [
		{ title: fullTitle },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: fullTitle
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] };
}
var $$splitComponentImporter$7 = () => import("./routes-DzW1C1l4.mjs");
var Route$7 = createFileRoute("/")({
	head: () => pageHead("KHETKOSAATHI — Agricultural Intelligence Center", "Nepal-focused agricultural intelligence dashboard powered by NASA Earth observations (POWER, SMAP, GPM IMERG, MODIS) and on-farm sensors."),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./alerts-CanCvRFz.mjs");
var Route$6 = createFileRoute("/alerts")({
	head: () => pageHead("KHETKOSAATHI — Farm Alerts & Threshold Diagnostics", "Rules-based farm anomaly alerts with severity rating, sensor observation dates, sources, and adjustable alert thresholds."),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./crop-health-CeVRL2qG.mjs");
var Route$5 = createFileRoute("/crop-health")({
	head: () => pageHead("KHETKOSAATHI — Crop Health & Phenology", "Explore satellite vegetation trends (NDVI/EVI), uncertainty bounds, pilot field polygons, and field inspection records."),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./earth-intelligence-kE6UlVCt.mjs");
var Route$4 = createFileRoute("/earth-intelligence")({
	head: () => pageHead("KHETKOSAATHI — Global Earth Intelligence Module", "NASA Earth observation provenance and regional agricultural intelligence for Nepal and globally (POWER, SMAP, GPM IMERG, MODIS, FIRMS)."),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./guidance-Wt9PFZQY.mjs");
var Route$3 = createFileRoute("/guidance")({
	head: () => pageHead("KHETKOSAATHI — Smart Crop Rotation & Planting Advisor", "Farm-specific crop harvest advisor, next crop suitability engine, and source-linked rotation planning for Nepal."),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./my-farm-b_LFtPda.mjs");
var Route$2 = createFileRoute("/my-farm")({
	head: () => pageHead("KHETKOSAATHI — Farmer Profile & Multi-Plot Management", "Manage your personalized farmer profile, registered agricultural plots, cadastral boundaries, and GPS locations."),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./onboarding-Cw-RzHKm.mjs");
var Route$1 = createFileRoute("/onboarding")({
	head: () => pageHead("KHETKOSAATHI — Register Your Farm Plot", "Dynamic farm onboarding: provide farmer details, crop specifications, GPS or map location, and cadastral boundaries."),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./weather-Cq-J0HWL.mjs");
var Route = createFileRoute("/weather")({
	head: () => pageHead("KHETKOSAATHI — Weather & Microclimate Station", "Pilot weather station telemetry, daily microclimate patterns, sensor health diagnostics, and NASA POWER comparisons."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AlertsRoute: Route$6.update({
		id: "/alerts",
		path: "/alerts",
		getParentRoute: () => Route$8
	}),
	CropHealthRoute: Route$5.update({
		id: "/crop-health",
		path: "/crop-health",
		getParentRoute: () => Route$8
	}),
	EarthIntelligenceRoute: Route$4.update({
		id: "/earth-intelligence",
		path: "/earth-intelligence",
		getParentRoute: () => Route$8
	}),
	GuidanceRoute: Route$3.update({
		id: "/guidance",
		path: "/guidance",
		getParentRoute: () => Route$8
	}),
	MyFarmRoute: Route$2.update({
		id: "/my-farm",
		path: "/my-farm",
		getParentRoute: () => Route$8
	}),
	OnboardingRoute: Route$1.update({
		id: "/onboarding",
		path: "/onboarding",
		getParentRoute: () => Route$8
	}),
	WeatherRoute: Route.update({
		id: "/weather",
		path: "/weather",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
