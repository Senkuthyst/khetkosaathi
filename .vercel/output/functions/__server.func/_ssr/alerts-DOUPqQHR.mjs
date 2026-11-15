import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, n as cn, o as num } from "./utils-DCauY1E4.mjs";
import { r as freshness } from "./mock-CNUdIL6z.mjs";
import { n as currentAlerts } from "./derived-DND3DPU1.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { r as DataCard, t as Btn } from "./kit-B1K0EjSI.mjs";
import { t as ThresholdEditor } from "./ThresholdEditor-BbWWfFc0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-DOUPqQHR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function Alerts() {
	const { t, lang, thresholds } = useApp();
	const [edit, setEdit] = (0, import_react.useState)(false);
	const alerts = currentAlerts(thresholds);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bell, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Diagnostic Warning System" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2",
							children: [
								t("alerts"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full",
									children: [num(lang, alerts.length), " Active"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs sm:text-sm text-muted-foreground",
							children: t("demoNote")
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						variant: "outline",
						className: "self-start sm:self-auto px-4 py-2 text-xs font-bold",
						"aria-expanded": edit,
						onClick: () => setEdit(!edit),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.SlidersHorizontal, { className: "h-4 w-4" }), t("editThresholds")]
					})]
				})
			}),
			edit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-in fade-in duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-extrabold text-base text-foreground",
						children: t("thresholds")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: t("thresholdsNote")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThresholdEditor, {})]
			}),
			alerts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-12 text-center shadow-sm space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-foreground",
						children: t("noAlerts")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground max-w-sm mx-auto",
						children: "All environmental indicators (rainfall, temperature, soil moisture, and vegetative indices) are within your configured bounds."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
					title: t(a.key),
					source: a.source,
					observedAt: a.time,
					scale: a.source === "station" ? t("pointScale") : "30 m",
					freshness: freshness(a.time, a.source === "station" ? 2 : 72),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Bell, { className: "h-4 w-4 shrink-0 text-primary" }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold", a.severity === "high" ? "bg-red-100 text-red-800 border border-red-300" : a.severity === "medium" ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-muted text-muted-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-3.5 w-3.5" }),
									t("severity"),
									":",
									" ",
									t(a.severity === "high" ? "sevHigh" : a.severity === "medium" ? "sevMed" : "sevLow")
								]
							})
						}),
						a.id === "veg" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs sm:text-sm text-satellite leading-relaxed bg-satellite-soft/50 p-3 rounded-xl border border-satellite/20",
							children: t("changeText")
						}),
						a.id === "gap" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl",
							children: t("stationGap")
						}),
						a.id === "rain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl",
							children: t("incompleteRain")
						})
					]
				}, a.id))
			})
		]
	});
}
//#endregion
export { Alerts as component };
