import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cuz4zpuo.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, c as Skeleton, h as num, i as DataCard, m as inputCls, n as Btn, p as fmtDate, s as ReportButton } from "./kit-DW9Ou9p5.mjs";
import { l as neighbourFields, r as freshness, u as pilotField } from "./mock-CNUdIL6z.mjs";
import { r as summary } from "./derived-DND3DPU1.mjs";
import { t as LazyMap } from "./LazyMap-Di1JnT8X.mjs";
import { n as VegetationChart } from "./Charts-Bf9dEUuO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crop-health-CeVRL2qG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function deviceToken() {
	let token = localStorage.getItem("naip.device");
	if (!token) {
		token = crypto.randomUUID();
		localStorage.setItem("naip.device", token);
	}
	return token;
}
async function loadInspections(fieldId) {
	const { data, error } = await supabase.rpc("list_inspections", {
		device_token: deviceToken(),
		target_field: fieldId
	});
	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		date: row.date,
		note: row.note,
		...row.photo ? { photo: row.photo } : {},
		outcome: row.outcome
	}));
}
async function saveInspection(fieldId, entry) {
	const { data, error } = await supabase.rpc("save_inspection", {
		device_token: deviceToken(),
		target_field: fieldId,
		entry_note: entry.note.trim(),
		entry_photo: entry.photo ?? "",
		entry_outcome: entry.outcome
	});
	if (error) throw error;
	if (!data) throw new Error("Inspection was not saved");
	return data;
}
async function compressPhoto(file) {
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(file.type) || file.size > 10485760) throw new Error("Invalid photo");
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Cannot read photo");
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const data = canvas.toDataURL("image/jpeg", .65);
	if (data.length > 7e5) throw new Error("Photo too large");
	return data;
}
function InspectionLog() {
	const { t, lang, field } = useApp();
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadFailed, setLoadFailed] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)();
	const [outcome, setOutcome] = (0, import_react.useState)("unsure");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [photoLoading, setPhotoLoading] = (0, import_react.useState)(false);
	const [reload, setReload] = (0, import_react.useState)(0);
	const upload = (0, import_react.useRef)(null);
	const fieldId = field?.id;
	(0, import_react.useEffect)(() => {
		let active = true;
		if (!fieldId) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setLoadFailed(false);
		loadInspections(fieldId).then((rows) => {
			if (active) setEntries(rows);
		}).catch(() => {
			if (active) setLoadFailed(true);
		}).finally(() => {
			if (active) setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [fieldId, reload]);
	async function save(e) {
		e.preventDefault();
		if (!fieldId || !note.trim()) return;
		setStatus("saving");
		try {
			const entry = {
				id: crypto.randomUUID(),
				date: (/* @__PURE__ */ new Date()).toISOString(),
				note: note.trim(),
				...photo ? { photo } : {},
				outcome
			};
			const id = await saveInspection(fieldId, entry);
			setEntries((rows) => [{
				...entry,
				id
			}, ...rows]);
			setNote("");
			setPhoto(void 0);
			setStatus("saved");
		} catch {
			setStatus("error");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t pt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-1 text-lg font-bold",
				children: t("inspLog")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-xs text-muted-foreground",
				children: [
					t("fieldScope"),
					" · ",
					field?.name
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: [t("notes"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							maxLength: 2e3,
							value: note,
							onChange: (e) => {
								setNote(e.target.value);
								setStatus("idle");
							},
							className: `${inputCls} mt-1 min-h-24 py-3`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-2 text-sm font-semibold",
						children: t("outcome")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"noIssue",
							"problem",
							"unsure"
						].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "tap flex items-center gap-2 rounded-lg border bg-card px-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "outcome",
								checked: outcome === o,
								onChange: () => setOutcome(o),
								className: "accent-primary"
							}), t(o)]
						}, o))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: upload,
						className: "sr-only",
						type: "file",
						"aria-label": t("photo"),
						accept: "image/jpeg,image/png,image/webp",
						onChange: async (e) => {
							const f = e.target.files?.[0];
							if (!f) return;
							setPhotoLoading(true);
							try {
								setPhoto(await compressPhoto(f));
								setStatus("idle");
							} catch {
								setStatus("photoError");
							} finally {
								setPhotoLoading(false);
								e.target.value = "";
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							type: "button",
							variant: "outline",
							disabled: photoLoading,
							onClick: () => upload.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Camera, { className: "h-4 w-4" }), t("photo")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
							type: "submit",
							disabled: status === "saving" || photoLoading || !note.trim(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Save, { className: "h-4 w-4" }), t(status === "saving" ? "saving" : "save")]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: t("photoLimit")
					}),
					photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo,
							alt: t("photo"),
							className: "h-24 w-32 rounded-lg object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "ghost",
							type: "button",
							title: t("removePhoto"),
							"aria-label": t("removePhoto"),
							onClick: () => setPhoto(void 0),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-4 w-4" })
						})]
					}),
					status === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "text-sm text-primary",
						children: t("saved")
					}),
					(status === "error" || status === "photoError") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-sm text-destructive",
						children: t(status === "photoError" ? "photoError" : "saveError")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24" }) : loadFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "outline",
						onClick: () => setReload((n) => n + 1),
						children: t("retry")
					})]
				}) : entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-3 text-sm text-muted-foreground",
					children: t("noEntries")
				}) : entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								dateTime: entry.date,
								children: fmtDate(lang, entry.date)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-primary",
								children: t(entry.outcome)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap break-words text-sm",
							children: entry.note
						}),
						entry.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: entry.photo,
							alt: t("photo"),
							loading: "lazy",
							className: "mt-3 max-h-64 w-full rounded-lg object-contain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportButton, { cardId: `Inspection ${entry.id}` })
					]
				}, entry.id))
			})
		]
	});
}
function CropHealth() {
	const { t, lang, field, selectedField } = useApp();
	const { veg, lastVeg, vegBelow } = summary();
	const source = lastVeg?.sensor ?? "landsat";
	const date = lastVeg?.date ?? null;
	const scale = source === "landsat" ? "30 m" : "~250 m";
	const meta = {
		source,
		observedAt: date,
		scale,
		freshness: freshness(date, 72)
	};
	const fieldLocationLabel = selectedField ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})` : t("demoNote");
	const centerCoords = selectedField ? [selectedField.latitude, selectedField.longitude] : [27.6775, 84.4333];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-satellite/10 px-2.5 py-0.5 text-xs font-bold text-satellite",
							children: "Multi-spectral Canopy Analysis"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: t("cropHealth")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground",
						children: fieldLocationLabel
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("map"),
				...meta,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Leaf, { className: "h-5 w-5 text-satellite" }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl overflow-hidden border border-border my-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
						center: centerCoords,
						zoom: 16,
						height: 320,
						polygons: [{
							positions: selectedField?.boundary && selectedField.boundary.length > 0 ? selectedField.boundary : field?.boundary ?? pilotField.boundary,
							color: "var(--veg-low)",
							label: selectedField?.fieldName ?? t("vegLow")
						}, ...neighbourFields.map((f) => ({
							positions: f.boundary,
							color: f.status === "good" ? "var(--veg-good)" : "var(--veg-watch)",
							label: f.name
						}))]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-4 text-xs font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-veg-good",
							children: [
								"● ",
								t("vegGood"),
								" (NDVI > 0.65)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-veg-watch",
							children: [
								"● ",
								t("vegWatch"),
								" (0.50 – 0.65)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-veg-low",
							children: [
								"● ",
								t("vegLow"),
								" (< 0.50)"
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("tsTitle"),
				...meta,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VegetationChart, { data: veg }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("cloudGap") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-satellite",
						children: t("noYield")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataCard, {
				title: t("changeAlert"),
				...meta,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertTriangle, { className: "h-5 w-5 text-satellite" }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-secondary/50 border border-primary/20 p-3.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm font-bold text-foreground",
							children: t(vegBelow ? "changeText" : "vegGood")
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: t("resolution")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-bold text-foreground mt-0.5",
									children: [
										source === "landsat" ? "Landsat" : "MODIS",
										" ",
										scale
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: t("cloud")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-bold text-foreground mt-0.5",
									children: lastVeg ? `${num(lang, lastVeg.cloud)}%` : "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: t("quality")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-bold text-foreground mt-0.5",
									children: lastVeg ? t(lastVeg.quality) : t("missing")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-3 bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: t("confidence")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-bold text-satellite mt-0.5",
									children: t(source === "modis" ? "low" : "medium")
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: t("confReason")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectionLog, {})
		]
	});
}
//#endregion
export { CropHealth as component };
