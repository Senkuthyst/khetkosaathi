import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, i as deleteFarmField, s as setPrimaryFarmField } from "./utils-DhMm3-3l.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { l as inputCls, n as Card, s as Skeleton, t as Btn } from "./kit-DxF7mxZ9.mjs";
import { C as ClientOnly, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as reverseGeocodeCoordinates, t as getCurrentBrowserCoordinates } from "./geolocation-service-jVN4pwtD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-farm-BweuMMgQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function MyFarm() {
	const { t, lang, demoProfile, updateDemoProfile, farmFields, selectedField, setSelectedField, reloadFarmFields, currentGpsLocationName, setCurrentGpsLocationName } = useApp();
	const [editingProfile, setEditingProfile] = (0, import_react.useState)(false);
	const [profileName, setProfileName] = (0, import_react.useState)(demoProfile.name);
	const [locatingGps, setLocatingGps] = (0, import_react.useState)(false);
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const fb = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[calc(100dvh-20rem)] min-h-[420px] w-full rounded-2xl" });
	const handleAcquireGps = async () => {
		setLocatingGps(true);
		try {
			const gps = await getCurrentBrowserCoordinates();
			const geocoded = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
			setCurrentGpsLocationName(geocoded.displayName);
		} catch (err) {
			alert(err instanceof Error ? err.message : "Could not retrieve GPS coordinates.");
		} finally {
			setLocatingGps(false);
		}
	};
	const handleSaveProfile = async (e) => {
		e.preventDefault();
		setSavingProfile(true);
		try {
			updateDemoProfile({ name: profileName.trim() || "Demo Farmer" });
			setEditingProfile(false);
		} finally {
			setSavingProfile(false);
		}
	};
	const handleDeleteField = async (fieldId) => {
		if (!confirm("Are you sure you want to delete this agricultural plot?")) return;
		try {
			await deleteFarmField(fieldId);
			await reloadFarmFields();
		} catch (err) {
			alert(`Error deleting field: ${err instanceof Error ? err.message : String(err)}`);
		}
	};
	const handleSetPrimary = async (fieldId) => {
		try {
			await setPrimaryFarmField(fieldId);
			await reloadFarmFields();
		} catch (err) {
			alert(`Error setting primary field: ${err instanceof Error ? err.message : String(err)}`);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
							children: "Personalized Agricultural Management"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-6 w-6 text-primary" }), "Farmer Profile & Registered Plots"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl",
						children: "Manage your personal identity, current geographic coordinates, cadastral boundaries, and crop inventory."
					})
				] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.User, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-extrabold text-foreground",
									children: demoProfile.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Demo Account — stored locally"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEditingProfile(!editingProfile),
								className: "text-xs font-bold text-primary hover:underline flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Edit3, { className: "h-3.5 w-3.5" }), editingProfile ? "Cancel" : "Edit"]
							})]
						}),
						editingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSaveProfile,
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block font-bold text-foreground mb-1",
								children: "Farmer Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: profileName,
								onChange: (e) => setProfileName(e.target.value),
								className: inputCls,
								required: true
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								type: "submit",
								size: "sm",
								disabled: savingProfile,
								className: "w-full font-bold mt-2",
								children: savingProfile ? "Saving..." : "Save Profile Details"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Account type:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold text-foreground",
									children: "Local Demo"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Preferred Language:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold text-primary uppercase",
									children: lang
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-secondary/40 border border-border space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-foreground flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Navigation, { className: "h-3.5 w-3.5 text-primary" }), "Current Device Location"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: handleAcquireGps,
										disabled: locatingGps,
										className: "text-[11px] font-bold text-primary hover:underline",
										children: locatingGps ? "Acquiring..." : "Update GPS"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-foreground font-mono",
									children: currentGpsLocationName ?? "GPS not acquired. Click Update GPS to detect."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground leading-tight",
									children: "Your current device GPS is separate from your agricultural farmland location."
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-extrabold text-foreground",
							children: [
								"Registered Plots (",
								farmFields.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Switch or manage your farmland parcels"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/onboarding",
							className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-2xs hover:bg-primary/90 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Plus, { className: "h-3.5 w-3.5" }), "Add Plot"]
						})]
					}), farmFields.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertCircle, { className: "h-6 w-6 text-muted-foreground mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "No farm registered yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Add your first agricultural plot to enable personalized monitoring." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/onboarding",
								className: "inline-block text-primary font-bold hover:underline pt-1",
								children: "Start Registration →"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-80 overflow-y-auto pr-1",
						children: farmFields.map((f) => {
							const isSelected = selectedField?.id === f.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-xl border transition-all text-xs space-y-2 ${isSelected ? "border-primary bg-primary/10 shadow-xs" : "border-border hover:bg-muted/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground text-sm",
											children: f.fieldName
										}), f.isPrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary text-primary-foreground",
											children: "Primary"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground text-[11px] block mt-0.5",
										children: [
											f.municipality || "Nepal",
											" · ",
											f.cropType,
											" · ",
											f.areaM2,
											" m²"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setSelectedField(f),
											className: `px-2 py-1 rounded text-xs font-bold transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`,
											children: isSelected ? "Active" : "Select"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteField(f.id),
											className: "p-1 text-muted-foreground hover:text-destructive transition-colors",
											title: "Delete plot",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Trash2, { className: "h-3.5 w-3.5" })
										})]
									})]
								}), !f.isPrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleSetPrimary(f.id),
									className: "text-[10px] font-semibold text-primary hover:underline",
									children: "Mark as Primary Plot"
								})]
							}, f.id);
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7 rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-extrabold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Layers, { className: "h-4 w-4 text-primary" }), "Cadastral Parcel Map"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: selectedField ? `Viewing: ${selectedField.fieldName} (${selectedField.areaM2} m²)` : "No active parcel selected"
					})] }), selectedField && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono font-bold text-foreground",
						children: [
							selectedField.latitude.toFixed(4),
							"° N, ",
							selectedField.longitude.toFixed(4),
							"° E"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl overflow-hidden border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: fb })
				})]
			})]
		})]
	});
}
//#endregion
export { MyFarm as component };
