import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as fmtDate, c as useApp, n as cn, o as num } from "./utils-DhMm3-3l.mjs";
import { t as supabase } from "./client-Cuz4zpuo.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kit-DxF7mxZ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function FreshBadge({ f }) {
	const { t } = useApp();
	const cls = {
		fresh: "bg-emerald-100 text-emerald-800 border-emerald-300",
		stale: "bg-amber-100 text-amber-800 border-amber-300",
		missing: "bg-gray-100 text-gray-700 border-gray-300"
	}[f];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold border", cls),
		children: t(f)
	});
}
var isSat = (s) => s === "landsat" || s === "modis" || s === "gpm" || s === "smap";
function DataProvenance({ data }) {
	const { t, lang } = useApp();
	const timestamp = (date) => new Date(date).toLocaleString(lang === "ne" ? "ne-NP" : "en-GB", {
		timeZone: "Asia/Kathmandu",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
			variant: "ghost",
			className: "mt-2 w-full justify-start px-0 text-xs font-semibold",
			"aria-label": `${t("provenance")}: ${data.dataset}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, {
				className: "h-4 w-4 shrink-0 text-primary",
				"aria-hidden": true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				t("provenance"),
				" · ",
				t(data.mode)
			] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "start",
		className: "max-w-[calc(100vw-2rem)] w-96 rounded-2xl p-4 text-xs shadow-xl border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b pb-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-extrabold text-sm text-foreground",
					children: t("provenance")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "space-y-2.5 break-words",
				children: [
					[t("dataset"), data.dataset],
					[t("productId"), num(lang, data.productId)],
					[t("resolution"), num(lang, data.resolution)],
					[t("observationPeriod"), data.observedAt ? `${data.periodStart ? `${num(lang, data.periodStart)} → ` : ""}${num(lang, data.observedAt.slice(0, 10))}` : t("missing")],
					[t("retrieved"), data.retrievedAt ? timestamp(data.retrievedAt) : t("notRetrieved")],
					[t("quality"), t(data.quality)],
					[t("date"), t(data.mode)]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-2 border-b border-border/40 pb-1.5 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
						className: "text-muted-foreground",
						children: [label, ":"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-bold text-foreground text-right",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: data.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-primary hover:underline",
				children: [t("sourceLink"), " ↗"]
			})
		]
	})] });
}
function SourceTag({ source }) {
	const { t } = useApp();
	const Icon = isSat(source) ? import_lucide_react.Satellite : source === "station" ? import_lucide_react.Radio : import_lucide_react.Globe2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-bold", isSat(source) ? "bg-satellite-soft text-satellite" : "bg-primary/10 text-primary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "h-3.5 w-3.5",
			"aria-hidden": true
		}), t(`src_${source}`)]
	});
}
/** Card that ALWAYS shows source, observation date, scale and freshness. Satellite vs station are visually separated. */
function DataCard({ title, source, observedAt, scale, freshness, children, icon }) {
	const { t, lang } = useApp();
	const sat = isSat(source);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-2xl border border-border bg-card p-5 shadow-sm transition-all", sat ? "border-l-4 border-l-satellite border-dashed" : "border-l-4 border-l-primary"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-base font-extrabold text-foreground",
					children: [icon, title]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreshBadge, { f: freshness })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs font-medium text-muted-foreground",
				children: sat ? t("estimate") : source === "station" ? t("measured") : t("gridded")
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-border pt-2.5 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceTag, { source }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							t("observed"),
							": ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: observedAt ? fmtDate(lang, observedAt) : "—" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							t("scale"),
							": ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: scale })
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportButton, { cardId: title })]
			})
		]
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-2xl bg-muted", className) });
}
function Card({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className),
		children
	});
}
function Btn({ className, variant = "primary", ...p }) {
	const v = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs",
		outline: "border-2 border-primary text-primary bg-card hover:bg-secondary shadow-2xs",
		ghost: "text-primary hover:bg-secondary"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...p,
		className: cn("tap inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40", v, className)
	});
}
var inputCls = "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all";
function ReportButton({ cardId }) {
	const { t } = useApp();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [details, setDetails] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("idle");
	async function submit(e) {
		e.preventDefault();
		if (!details.trim()) return;
		setState("saving");
		try {
			const { error } = await supabase.from("information_reports").insert({
				card_id: cardId.slice(0, 150),
				details: details.trim()
			});
			if (error) throw error;
			setState("saved");
		} catch {
			setState("error");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
		variant: "ghost",
		className: "min-h-8 px-1 text-xs text-muted-foreground hover:text-foreground",
		onClick: () => {
			setOpen(true);
			setState("idle");
			setDetails("");
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Flag, { className: "h-3.5 w-3.5" }), t("report")]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[calc(100%-2rem)] max-w-md rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base font-extrabold text-foreground",
					children: t("report")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: cardId
				}),
				state === "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "status",
					className: "flex items-center gap-2 text-primary font-bold text-sm py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Check, { className: "h-5 w-5 text-fresh" }), t("reported")]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4 mt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs font-bold text-foreground",
							children: [t("reportDetails"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								maxLength: 2e3,
								value: details,
								onChange: (e) => setDetails(e.target.value),
								className: `${inputCls} mt-1.5 min-h-28 py-2.5`,
								placeholder: "Describe the incorrect value, date, or interpretation..."
							})]
						}),
						state === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-xs font-semibold text-destructive",
							children: t("saveError")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							type: "submit",
							className: "w-full py-2.5",
							disabled: state === "saving" || !details.trim(),
							children: t(state === "saving" ? "saving" : "sendReport")
						})
					]
				})
			]
		})
	})] });
}
//#endregion
export { FreshBadge as a, SourceTag as c, DataProvenance as i, inputCls as l, Card as n, ReportButton as o, DataCard as r, Skeleton as s, Btn as t };
