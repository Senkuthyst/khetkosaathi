import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as fmtDate, c as useApp, o as num } from "./utils-DhMm3-3l.mjs";
import { a as Line, c as ResponsiveContainer, i as Area, l as Tooltip, n as YAxis, o as CartesianGrid, r as XAxis, s as Bar, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Charts-Bo3yBtml.js
var import_jsx_runtime = require_jsx_runtime();
function TrendChart({ data, series, unit = "", height = 180 }) {
	const { lang } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		"aria-label": series.map((s) => s.label).join(", "),
		role: "img",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
				data,
				margin: {
					left: -18,
					right: 8,
					top: 8,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "#E5EAE2",
						strokeDasharray: "3 3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "date",
						tickFormatter: (v) => fmtDate(lang, String(v)),
						tick: {
							fontSize: 10,
							fill: "#758078"
						},
						minTickGap: 38,
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tickFormatter: (v) => num(lang, v),
						tick: {
							fontSize: 10,
							fill: "#758078"
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							backgroundColor: "#FFFFFF",
							borderColor: "#E5EAE2",
							borderRadius: 12,
							boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
							fontSize: 12,
							fontWeight: 600,
							color: "#18251E"
						},
						labelFormatter: (v) => fmtDate(lang, String(v)),
						formatter: (v, n) => [`${num(lang, v)} ${unit}`, n]
					}),
					series.map((s, i) => s.bar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: s.key,
						name: s.label,
						fill: s.color ?? `var(--chart-${i + 1})`,
						radius: [
							4,
							4,
							0,
							0
						],
						isAnimationActive: false
					}, s.key) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: s.key,
						name: s.label,
						stroke: s.color ?? `var(--chart-${i + 1})`,
						strokeWidth: 2.5,
						dot: false,
						connectNulls: false,
						isAnimationActive: false
					}, s.key))
				]
			})
		}), series.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-4 text-xs font-semibold text-muted-foreground mt-2",
			children: series.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-3 rounded-xs",
					style: { backgroundColor: s.color ?? `var(--chart-${i + 1})` }
				}), s.label]
			}, s.key))
		})]
	});
}
function VegetationChart({ data }) {
	const { lang, t } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "img",
		"aria-label": t("tsTitle"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: 235,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
				data: data.map((p) => ({
					...p,
					baseline: [p.baseLow, p.baseHigh]
				})),
				margin: {
					left: -22,
					right: 8,
					top: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "#E5EAE2",
						strokeDasharray: "3 3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "date",
						tickFormatter: (v) => fmtDate(lang, String(v)),
						tick: {
							fontSize: 10,
							fill: "#758078"
						},
						minTickGap: 38,
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [0, 1],
						tickFormatter: (v) => num(lang, v),
						tick: {
							fontSize: 10,
							fill: "#758078"
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							backgroundColor: "#FFFFFF",
							borderColor: "#E5EAE2",
							borderRadius: 12,
							boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
							fontSize: 12,
							fontWeight: 600,
							color: "#18251E"
						},
						labelFormatter: (v) => fmtDate(lang, String(v)),
						formatter: (v, name) => [Array.isArray(v) ? v.map((n) => num(lang, n)).join(" – ") : num(lang, v), name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "baseline",
						name: t("baseline"),
						fill: "#1D5C8A",
						fillOpacity: .12,
						stroke: "none",
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "ndvi",
						name: "NDVI",
						stroke: "#237A50",
						dot: {
							r: 3.5,
							fill: "#237A50"
						},
						strokeWidth: 2.5,
						connectNulls: false,
						isAnimationActive: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "evi",
						name: "EVI",
						stroke: "#1D5C8A",
						dot: false,
						strokeWidth: 2,
						connectNulls: false,
						isAnimationActive: false
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap justify-center gap-4 text-xs font-semibold mt-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary" }), "NDVI (Chlorophyll Greenness)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-satellite",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-satellite" }), "EVI (Enhanced Vegetation)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-md bg-satellite-soft px-2 py-0.5 text-[11px] font-bold text-satellite",
					children: [t("baseline"), " (0.60–0.75)"]
				})
			]
		})]
	});
}
//#endregion
export { VegetationChart as n, TrendChart as t };
