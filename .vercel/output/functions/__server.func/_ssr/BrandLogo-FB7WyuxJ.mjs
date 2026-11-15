import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, n as cn } from "./utils-DCauY1E4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BrandLogo-FB7WyuxJ.js
var import_jsx_runtime = require_jsx_runtime();
function BrandLogo({ variant = "compact", className, theme = "forest", showTagline = true, showNepali = true }) {
	const { lang } = useApp();
	const textColor = {
		forest: "text-[#123B2A]",
		dark: "text-white",
		light: "text-[#18251E]"
	}[theme];
	const subtextColor = {
		forest: "text-[#237A50]",
		dark: "text-[#B8D987]",
		light: "text-[#758078]"
	}[theme];
	const iconSizes = {
		icon: "h-9 w-9",
		compact: "h-8 w-8 sm:h-9 sm:w-9",
		full: "h-10 w-10 sm:h-11 sm:w-11",
		hero: "h-14 w-14 sm:h-16 sm:w-16"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2.5 select-none", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("relative shrink-0 flex items-center justify-center", iconSizes),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 48 48",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: "w-full h-full drop-shadow-sm",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "24",
						cy: "24",
						r: "22",
						fill: "#237A50",
						fillOpacity: "0.08"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						cx: "24",
						cy: "24",
						rx: "19",
						ry: "9",
						transform: "rotate(-28 24 24)",
						stroke: theme === "dark" ? "#B8D987" : "#237A50",
						strokeWidth: "1.8",
						strokeDasharray: "2.5 2.5",
						strokeOpacity: "0.85"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M15 33C14 26 18 17 29 13C29 23 23 31 15 33Z",
						fill: theme === "dark" ? "#69A96B" : "#123B2A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M17 33C24 33 32 28 35 18C28 17 21 21 17 33Z",
						fill: "#237A50"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M17 31C21 27 25 22 28 16",
						stroke: "#B8D987",
						strokeWidth: "1.5",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "39",
						cy: "18",
						r: "3",
						fill: "#B8D987",
						stroke: "#123B2A",
						strokeWidth: "1.2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "39",
						cy: "18",
						r: "1.2",
						fill: "#FFFFFF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "9",
						cy: "30",
						r: "1.8",
						fill: "#69A96B",
						opacity: "0.9"
					})
				]
			})
		}), variant !== "icon" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center leading-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-extrabold tracking-tight font-sans transition-colors", textColor, variant === "hero" ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"),
					children: "KHETKOSAATHI"
				}), showNepali && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-medium text-xs px-1.5 py-0.5 rounded-md transition-colors", theme === "dark" ? "bg-white/10 text-[#B8D987]" : "bg-[#237A50]/10 text-[#237A50]"),
					title: "खेतको साथी (Nepali)",
					children: "खेतको साथी"
				})]
			}), (variant === "full" || variant === "hero" || showTagline) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-0.5 font-medium tracking-tight truncate", subtextColor, variant === "hero" ? "text-xs sm:text-sm" : "text-[11px]"),
				children: lang === "ne" ? "तपाईंको बौद्धिक कृषि सहयात्री · NASA Earth Intelligence" : "Your Intelligent Agricultural Companion"
			})]
		})]
	});
}
//#endregion
export { BrandLogo as t };
