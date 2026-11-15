import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as fmtDate, c as useApp, o as num } from "./utils-DhMm3-3l.mjs";
import { a as getStationDaily, c as nasaPowerMeta, d as sensorHealth, f as stationCurrent, i as getNasaPowerDaily, p as stationMeta, r as freshness } from "./mock-CNUdIL6z.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { c as SourceTag, r as DataCard } from "./kit-DxF7mxZ9.mjs";
import { t as ThresholdEditor } from "./ThresholdEditor-Vhn4Gp0K.mjs";
import { t as TrendChart } from "./Charts-Bo3yBtml.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/weather-C-aDs3ur.js
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function Weather() {
	const { t, lang } = useApp();
	const daily = getStationDaily(14);
	const regional = getNasaPowerDaily(14);
	const comparison = daily.map((d) => ({
		date: d.date,
		farm: d.tMax,
		regional: regional.find((n) => n.date === d.date)?.tMax ?? null
	}));
	const meta = {
		source: "station",
		observedAt: stationCurrent.observedAt,
		scale: t("pointScale"),
		freshness: freshness(stationCurrent.observedAt, 2)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
							children: "In-Situ Automated Telemetry"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: t("station")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground",
						children: [stationMeta.id, " · Local Weather Telemetry & Climatology"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("current"),
				...meta,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Radio, { className: "h-5 w-5 text-station" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Station Node: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stationMeta.id })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						num(lang, 12),
						" ",
						t("minAgo")
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						{
							key: "temperature",
							value: stationCurrent.temp,
							unit: "°C",
							Icon: import_lucide_react.Thermometer,
							color: "text-primary"
						},
						{
							key: "humidity",
							value: stationCurrent.humidity,
							unit: "%",
							Icon: import_lucide_react.Droplets,
							color: "text-satellite"
						},
						{
							key: "rainToday",
							value: stationCurrent.rainToday,
							unit: "mm",
							Icon: import_lucide_react.CloudRain,
							color: "text-primary"
						},
						{
							key: "soilMoisture",
							value: stationCurrent.soil,
							unit: "%",
							Icon: import_lucide_react.Droplets,
							color: "text-primary"
						}
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5 text-xs font-bold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.Icon, { className: `h-4 w-4 ${m.color}` }), t(m.key)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground",
								children: [
									num(lang, m.value),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-normal text-muted-foreground",
										children: m.unit
									})
								]
							}),
							m.key === "soilMoisture" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: t("soilDepth")
							})
						]
					}, m.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
						title: `${t("temperature")} · ${t("trends")}`,
						...meta,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
							data: daily,
							series: [{
								key: "tMax",
								label: `${t("max")} °C`
							}, {
								key: "tMin",
								label: `${t("min")} °C`
							}],
							unit: "°C"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: t("missingNote")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataCard, {
						title: `${t("rainToday")} · ${t("trends")}`,
						...meta,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
							data: daily,
							series: [{
								key: "rain",
								label: t("rainToday"),
								bar: true
							}],
							unit: "mm"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "soil",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
							title: `${t("soilMoisture")} · ${t("trends")}`,
							...meta,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
								data: daily,
								series: [{
									key: "soil",
									label: t("soilMoisture")
								}],
								unit: "%"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: t("soilDepth")
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataCard, {
						title: `${t("humidity")} · ${t("trends")}`,
						...meta,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
							data: daily,
							series: [{
								key: "humidity",
								label: t("humidity")
							}],
							unit: "%"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("daily"),
				...meta,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-right text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
								className: "sr-only",
								children: t("daily")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/50 border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "text-muted-foreground font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 text-left",
											children: t("date")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: "py-2.5 px-3",
											children: [t("max"), " °C"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: "py-2.5 px-3",
											children: [t("min"), " °C"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3",
											children: "Rain (mm)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: "py-2.5 px-3",
											children: [t("soilMoisture"), " %"]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border",
								children: [...daily].reverse().map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											scope: "row",
											className: "py-2.5 px-3 text-left font-semibold text-foreground",
											children: fmtDate(lang, d.date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-mono",
											children: d.tMax == null ? "—" : num(lang, d.tMax)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-mono",
											children: d.tMin == null ? "—" : num(lang, d.tMin)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-mono",
											children: d.rain == null ? "—" : num(lang, d.rain)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-mono",
											children: d.soil == null ? "—" : num(lang, d.soil)
										})
									]
								}, d.date))
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] text-muted-foreground",
					children: t("missingNote")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("sensorHealth"),
				...meta,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Battery, { className: "h-5 w-5 text-primary" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
					children: [
						{
							label: t("lastSeen"),
							value: `${fmtDate(lang, sensorHealth.lastSeen)} · ${num(lang, 12)} ${t("minAgo")}`
						},
						{
							label: t("uptime"),
							value: `${num(lang, sensorHealth.uptime)}%`
						},
						{
							label: t("battery"),
							value: `${num(lang, sensorHealth.battery)}%`
						},
						{
							label: t("signal"),
							value: `${num(lang, sensorHealth.signal)} dBm`
						}
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-extrabold text-sm text-foreground",
							children: m.value
						})]
					}, m.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Activity, { className: "h-4 w-4 text-amber-700 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold",
						children: [
							t("dataGap"),
							": ",
							num(lang, sensorHealth.gaps[0]?.hours ?? 0),
							" ",
							t("hours")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-[11px]",
						children: [
							sensorHealth.gaps[0] && fmtDate(lang, sensorHealth.gaps[0].from),
							" · ",
							t("stationGap")
						]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("compare"),
				source: "nasa_power",
				observedAt: nasaPowerMeta.observedAt,
				scale: nasaPowerMeta.scale,
				freshness: freshness(nasaPowerMeta.observedAt, 24),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs text-muted-foreground leading-relaxed",
						children: t("compareNote")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
						data: comparison,
						series: [{
							key: "farm",
							label: `${t("farm")} ${t("max")} °C`
						}, {
							key: "regional",
							label: "NASA POWER 0.5° Grid"
						}],
						unit: "°C"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTag, { source: "station" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("pointScale") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTag, { source: "nasa_power" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: nasaPowerMeta.scale })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "thresholds",
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SlidersHorizontal, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-extrabold text-foreground",
						children: t("thresholds")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: t("thresholdsNote")
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThresholdEditor, {})]
			})
		]
	});
}
//#endregion
export { Weather as component };
