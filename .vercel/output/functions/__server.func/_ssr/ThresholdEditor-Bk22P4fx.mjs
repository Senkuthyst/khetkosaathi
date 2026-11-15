import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, m as inputCls, n as Btn } from "./kit-DW9Ou9p5.mjs";
import { n as external_exports, t as zod_exports } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThresholdEditor-Bk22P4fx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
var z = external_exports ?? zod_exports;
var thresholdSchema = z.object({
	minRain7: z.number().min(0).max(500),
	minSoil: z.number().min(0).max(100),
	maxTemp: z.number().min(-20).max(60),
	minBattery: z.number().min(0).max(100)
});
var fields = [
	{
		key: "minRain7",
		label: "minRain",
		min: 0,
		max: 500
	},
	{
		key: "minSoil",
		label: "minSoil",
		min: 0,
		max: 100
	},
	{
		key: "maxTemp",
		label: "maxTemp",
		min: -20,
		max: 60
	},
	{
		key: "minBattery",
		label: "minBattery",
		min: 0,
		max: 100
	}
];
function ThresholdEditor() {
	const { t, thresholds, setThresholds } = useApp();
	const [draft, setDraft] = (0, import_react.useState)(thresholds);
	const [status, setStatus] = (0, import_react.useState)("idle");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3",
		onSubmit: (e) => {
			e.preventDefault();
			const result = thresholdSchema.safeParse(draft);
			if (!result.success) {
				setStatus("error");
				return;
			}
			setThresholds(result.data);
			setStatus("saved");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: t("thresholdsNote")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-semibold",
					children: [t(f.label), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						step: "0.1",
						required: true,
						min: f.min,
						max: f.max,
						className: `${inputCls} mt-1`,
						value: Number.isNaN(draft[f.key]) ? "" : draft[f.key],
						onChange: (e) => {
							setDraft({
								...draft,
								[f.key]: e.target.value === "" ? NaN : Number(e.target.value)
							});
							setStatus("idle");
						}
					})]
				}, f.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
				type: "submit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { className: "h-4 w-4" }), t("save")]
			}),
			status !== "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: status === "error" ? "text-sm text-destructive" : "text-sm text-primary",
				children: t(status === "saved" ? "saved" : "thresholdError")
			})
		]
	});
}
//#endregion
export { ThresholdEditor as t };
