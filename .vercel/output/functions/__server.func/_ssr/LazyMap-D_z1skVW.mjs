import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as Skeleton } from "./kit-DxF7mxZ9.mjs";
import { C as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LazyMap-D_z1skVW.js
var import_jsx_runtime = require_jsx_runtime();
function LazyMap(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height: props.height ?? 280 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full" }) })
	});
}
//#endregion
export { LazyMap as t };
