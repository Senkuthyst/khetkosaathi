import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useApp, n as cn, o as num, r as createFarmField } from "./utils-DhMm3-3l.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { n as Card, s as Skeleton, t as Btn } from "./kit-DxF7mxZ9.mjs";
import { C as ClientOnly, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as reverseGeocodeCoordinates, t as getCurrentBrowserCoordinates } from "./geolocation-service-jVN4pwtD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-BfOfkTxo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function LazyPlotDrawerMap(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height: props.height ?? 380 },
		className: "relative w-full rounded-2xl overflow-hidden border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full" }) })
	});
}
var crops = [
	"rice",
	"maize",
	"wheat",
	"potato",
	"tomato"
];
var provinces = [
	"Koshi Province",
	"Madhesh Province",
	"Bagmati Province",
	"Gandaki Province",
	"Lumbini Province",
	"Karnali Province",
	"Sudurpashchim Province"
];
function Onboarding() {
	const { lang, t, reloadFarmFields, setSelectedField } = useApp();
	const nav = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [province, setProvince] = (0, import_react.useState)("Koshi Province");
	const [district, setDistrict] = (0, import_react.useState)("Sunsari");
	const [municipality, setMunicipality] = (0, import_react.useState)("Itahari Sub-Metropolitan");
	const [ward, setWard] = (0, import_react.useState)("4");
	const [fieldName, setFieldName] = (0, import_react.useState)("My Rice Field (मेरो खेत)");
	const [crop, setCrop] = (0, import_react.useState)("rice");
	const [cropVariety, setCropVariety] = (0, import_react.useState)("Sabitri / Radha-4");
	const [plantingDate, setPlantingDate] = (0, import_react.useState)("2026-07-15");
	const [irrigation, setIrrigation] = (0, import_react.useState)("canal");
	const [soilType, setSoilType] = (0, import_react.useState)("Silty Clay Loam");
	const [mapCenter, setMapCenter] = (0, import_react.useState)([27.7172, 85.324]);
	const [confirmedBoundary, setConfirmedBoundary] = (0, import_react.useState)(null);
	const [confirmedAreaHa, setConfirmedAreaHa] = (0, import_react.useState)(0);
	const [locatingGps, setLocatingGps] = (0, import_react.useState)(false);
	const [gpsAcquired, setGpsAcquired] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (step === 3 && !gpsAcquired) handleAcquireGps(false);
	}, [step]);
	const handleAcquireGps = async (showAlert = true) => {
		setLocatingGps(true);
		try {
			const gps = await getCurrentBrowserCoordinates();
			setMapCenter([gps.latitude, gps.longitude]);
			setGpsAcquired(true);
			const geocoded = await reverseGeocodeCoordinates(gps.latitude, gps.longitude);
			if (geocoded.cityOrTown) setMunicipality(geocoded.cityOrTown);
			if (geocoded.district) setDistrict(geocoded.district);
			if (geocoded.stateOrProvince) setProvince(geocoded.stateOrProvince);
		} catch (err) {
			if (showAlert) alert(err instanceof Error ? err.message : "Could not retrieve GPS coordinates. You can pan and zoom the map manually.");
		} finally {
			setLocatingGps(false);
		}
	};
	const handleConfirmPlot = (points, areaHa) => {
		setConfirmedBoundary(points);
		setConfirmedAreaHa(areaHa);
	};
	const handleClearPlot = () => {
		setConfirmedBoundary(null);
		setConfirmedAreaHa(0);
	};
	const handleFinish = async () => {
		if (!confirmedBoundary || confirmedBoundary.length < 3) {
			alert("Please draw and confirm your agricultural plot on the map before proceeding.");
			setStep(3);
			return;
		}
		setSaving(true);
		try {
			const newField = await createFarmField({
				fieldName: fieldName.trim() || "My Farm Plot",
				boundary: confirmedBoundary,
				cropType: crop,
				cropVariety,
				plantingDate,
				irrigationType: irrigation,
				soilType,
				municipality,
				district,
				province,
				wardNumber: ward,
				isPrimary: true
			});
			await reloadFarmFields();
			setSelectedField(newField);
			nav({ to: "/" });
		} catch (err) {
			alert(`Error saving field: ${err instanceof Error ? err.message : String(err)}`);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl mx-auto space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
							children: "Farm Registration & Dynamic Parcel Setup"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: "Register Your Agricultural Plot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs sm:text-sm text-muted-foreground",
						children: "Tailored to your actual location in Nepal or globally. Zero default Chitwan presets."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex items-center gap-2",
						children: [
							1,
							2,
							3,
							4
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("flex-1 h-2 rounded-full transition-colors", step >= s ? "bg-primary" : "bg-muted") }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs font-bold text-primary",
						children: [
							"Step ",
							num(lang, step),
							" of ",
							num(lang, 4)
						]
					})
				]
			}),
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MapPin, { className: "h-4 w-4 text-primary" }), "1. Farmer Administrative Location"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-1",
								children: "Province / प्रदेश"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: province,
								onChange: (e) => setProvince(e.target.value),
								className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
								children: provinces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: p,
									children: p
								}, p))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-1",
								children: "District / जिल्ला"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: district,
								onChange: (e) => setDistrict(e.target.value),
								placeholder: "e.g. Sunsari, Kathmandu, Morang",
								className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-1",
								children: "Municipality / गाउँपालिका / नगरपालिका"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: municipality,
								onChange: (e) => setMunicipality(e.target.value),
								placeholder: "e.g. Itahari Sub-Metropolitan",
								className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-1",
								children: "Ward Number / वडा नं."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: ward,
								onChange: (e) => setWard(e.target.value),
								placeholder: "e.g. 4",
								className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3 border-t flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: () => setStep(2),
							children: "Next: Crop Details →"
						})
					})
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Sprout, { className: "h-4 w-4 text-primary" }), "2. Agricultural Specifications"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground mb-1",
								children: "Field Name / खेतको नाम"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: fieldName,
								onChange: (e) => setFieldName(e.target.value),
								placeholder: "e.g. Uttardhoka Khet, Tarahara Plot B",
								className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: "Crop Type / मुख्य बाली"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: crop,
									onChange: (e) => setCrop(e.target.value),
									className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
									children: crops.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: t(c)
									}, c))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: "Crop Variety / जात"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: cropVariety,
									onChange: (e) => setCropVariety(e.target.value),
									placeholder: "e.g. Radha-4, Khumal-4",
									className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: "Planting Date / रोपाईं मिति"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: plantingDate,
									onChange: (e) => setPlantingDate(e.target.value),
									className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
									required: true
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-foreground mb-1",
									children: "Irrigation / सिँचाइ प्रकार"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: irrigation,
									onChange: (e) => setIrrigation(e.target.value),
									className: "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rainfed",
											children: "Rainfed (आकासे पानी)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "canal",
											children: "Canal Irrigation (नहर/कुलो)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "borewell",
											children: "Groundwater / Borewell (बोरिङ)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "drip",
											children: "Drip Irrigation (थोपा सिँचाइ)"
										})
									]
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "outline",
							onClick: () => setStep(1),
							children: "← Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: () => setStep(3),
							children: "Next: Select Agricultural Plot →"
						})]
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-extrabold text-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Layers, { className: "h-4 w-4 text-primary" }), "3. Select Your Agricultural Plot"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Locate your land on the map, draw its boundary, and adjust vertices. Zero default preselection."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleAcquireGps(true),
							disabled: locatingGps,
							className: "text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Navigation, { className: cn("h-3.5 w-3.5", locatingGps && "animate-spin") }), locatingGps ? "Acquiring GPS..." : "Center on My GPS Location"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyPlotDrawerMap, {
						initialCenter: mapCenter,
						confirmedPlot: confirmedBoundary,
						onConfirmPlot: handleConfirmPlot,
						onClearPlot: handleClearPlot,
						height: 400
					}),
					confirmedBoundary && confirmedBoundary.length >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-4 w-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Plot Confirmed:" }),
								" ",
								confirmedBoundary.length,
								" boundary vertices · Area: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [confirmedAreaHa, " ha"] })
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md",
							children: "Ready to Proceed"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Info, { className: "h-4 w-4 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Action Required:" }),
							" Click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Draw Plot Boundary\"" }),
							" above to outline your parcel, adjust vertices, and click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Confirm Plot\"" }),
							" ",
							"before proceeding to review."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "outline",
							onClick: () => setStep(2),
							children: "← Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: () => {
								if (!confirmedBoundary || confirmedBoundary.length < 3) {
									alert("Please draw your farm boundary and click 'Confirm Plot' before moving to the next step.");
									return;
								}
								setStep(4);
							},
							disabled: !confirmedBoundary || confirmedBoundary.length < 3,
							children: "Review & Confirm →"
						})]
					})
				]
			}),
			step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-extrabold text-foreground flex items-center gap-1.5 border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-4 w-4 text-primary" }), "4. Review & Confirm Farm Registration"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Field Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: fieldName
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Location:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [
										municipality,
										", ",
										district,
										" (",
										province,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Crop:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [
										t(crop),
										" (",
										cropVariety,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Planting Date:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: plantingDate
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Calculated Land Area:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground font-mono",
									children: [confirmedAreaHa, " hectares"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Boundary Vertices:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: confirmedBoundary ? `${confirmedBoundary.length} polygon points` : "None"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "outline",
							onClick: () => setStep(3),
							children: "← Back to Plot Map"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: handleFinish,
							disabled: saving,
							className: "font-bold",
							children: saving ? "Registering Farm..." : "Complete & Open My Dashboard"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Onboarding as component };
