import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cuz4zpuo.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { _ as useApp, m as inputCls, n as Btn, r as Card } from "./kit-DW9Ou9p5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geolocation-service-DnALuK2_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
function AuthModal({ isOpen, onClose, defaultMode = "login" }) {
	const { lang, t, refreshProfile, reloadFarmFields } = useApp();
	const [mode, setMode] = (0, import_react.useState)(defaultMode);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [successMsg, setSuccessMsg] = (0, import_react.useState)(null);
	if (!isOpen) return null;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMsg(null);
		setSuccessMsg(null);
		setBusy(true);
		try {
			if (mode === "signup") {
				if (password.length < 8) throw new Error("Password must be at least 8 characters long.");
				if (password !== confirmPassword) throw new Error("Passwords do not match.");
				const { data, error } = await supabase.auth.signUp({
					email: email.trim(),
					password,
					options: { data: {
						full_name: fullName.trim(),
						preferred_language: lang
					} }
				});
				if (error) throw error;
				if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
					setErrorMsg("An account with this email address already exists. Please sign in or reset your password.");
					return;
				}
				setSuccessMsg(data.session ? "Account created successfully! Welcome to Khetkosaathi." : "Sign-up successful! Please check your email to confirm your account.");
				await refreshProfile();
				await reloadFarmFields();
				setTimeout(() => onClose(), 1500);
			} else if (mode === "login") {
				const { error } = await supabase.auth.signInWithPassword({
					email: email.trim(),
					password
				});
				if (error) throw error;
				setSuccessMsg("Logged in successfully!");
				await refreshProfile();
				await reloadFarmFields();
				setTimeout(() => onClose(), 1e3);
			} else if (mode === "reset") {
				const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/` });
				if (error) throw error;
				setSuccessMsg("Password reset email sent. Please check your inbox.");
			}
		} catch (err) {
			let msg = err.message || "An unexpected error occurred.";
			const lower = msg.toLowerCase();
			if (lower.includes("weak_password") || lower.includes("easy to guess") || lower.includes("pwned")) msg = "Password is too weak or commonly used. Please choose a stronger password with at least 8 characters including letters, numbers, and symbols.";
			else if (lower.includes("already registered") || lower.includes("user_already_exists")) msg = "An account with this email is already registered. Please sign in or use 'Forgot password'.";
			else if (lower.includes("invalid format") || lower.includes("validate email")) msg = "Please enter a valid email address (e.g. name@example.com).";
			else if (lower.includes("email signups are disabled") || lower.includes("signup is disabled")) msg = "Email signups are currently disabled in the backend authentication settings.";
			setErrorMsg(msg);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md p-6 bg-card border-2 border-primary/20 shadow-2xl relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold",
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2",
							children: mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.UserPlus, { className: "h-6 w-6" }) : mode === "reset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.KeyRound, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LogIn, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-extrabold text-foreground tracking-tight",
							children: mode === "signup" ? "Create Farmer Account" : mode === "reset" ? "Reset Your Password" : "Sign In to Khetkosaathi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: mode === "signup" ? "Register to manage personalized plots and satellite alerts" : mode === "reset" ? "Enter your registered email to receive recovery instructions" : "Access your personalized agricultural intelligence center"
						})
					]
				}),
				errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.AlertCircle, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
				}),
				successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.CheckCircle2, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-3.5",
					children: [
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground mb-1",
							children: "Full Name / पुरा नाम"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.User, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Ram Bahadur Thapa",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								className: `tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all pl-9`
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground mb-1",
							children: "Email Address / इमेल"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								placeholder: "farmer@example.com",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: `${inputCls} pl-9`
							})]
						})] }),
						mode !== "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-bold text-foreground",
								children: "Password / पासवर्ड"
							}), mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Min. 8 chars, strong"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: `tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all pl-9`
							})]
						})] }),
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-foreground mb-1",
							children: "Confirm Password / पासवर्ड पुष्टि गर्नुहोस्"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.Lock, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								placeholder: "••••••••",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								className: `tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all pl-9`
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							type: "submit",
							disabled: busy,
							className: "w-full mt-2 font-bold py-2.5",
							children: busy ? "Processing..." : mode === "signup" ? "Create Account" : mode === "reset" ? "Send Reset Link" : "Sign In"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground",
					children: mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("reset");
							setErrorMsg(null);
							setSuccessMsg(null);
						},
						className: "hover:underline font-semibold text-primary",
						children: "Forgot password?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("signup");
							setErrorMsg(null);
							setSuccessMsg(null);
						},
						className: "hover:underline font-bold text-primary",
						children: "Create Account"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode("login");
							setErrorMsg(null);
							setSuccessMsg(null);
						},
						className: "hover:underline font-bold text-primary mx-auto",
						children: "Back to Sign In"
					})
				})
			]
		})
	});
}
/**
* Request real user location from browser navigator.geolocation.
*/
async function getCurrentBrowserCoordinates(options = {
	enableHighAccuracy: true,
	timeout: 12e3,
	maximumAge: 3e4
}) {
	if (typeof window === "undefined" || !("geolocation" in navigator)) throw new Error("Geolocation is not supported by your browser or environment.");
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition((pos) => {
			resolve({
				latitude: Math.round(pos.coords.latitude * 1e4) / 1e4,
				longitude: Math.round(pos.coords.longitude * 1e4) / 1e4,
				accuracyMeters: Math.round(pos.coords.accuracy),
				timestamp: pos.timestamp
			});
		}, (err) => {
			switch (err.code) {
				case err.PERMISSION_DENIED:
					reject(/* @__PURE__ */ new Error("Location permission was denied. Please select your location manually."));
					break;
				case err.POSITION_UNAVAILABLE:
					reject(/* @__PURE__ */ new Error("Location information is currently unavailable from your device GPS."));
					break;
				case err.TIMEOUT:
					reject(/* @__PURE__ */ new Error("Location request timed out. Please check GPS settings or select manually."));
					break;
				default: reject(/* @__PURE__ */ new Error(`Location error: ${err.message}`));
			}
		}, options);
	});
}
/**
* Reverse geocode latitude and longitude into readable locality / municipality / district
* using OpenStreetMap Nominatim with proper user-agent rate limiting.
*/
async function reverseGeocodeCoordinates(lat, lon) {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
		const res = await fetch(url, { headers: {
			Accept: "application/json",
			"User-Agent": "KHETKOSAATHI-AgriPlatform/2.0 (Nepal AgriTech Companion)"
		} });
		if (!res.ok) throw new Error(`Reverse geocoding HTTP ${res.status}`);
		const addr = (await res.json()).address || {};
		const cityOrTown = addr.city || addr.town || addr.village || addr.suburb || addr.municipality;
		const district = addr.county || addr.district || addr.state_district;
		const stateOrProvince = addr.state || addr.province;
		const country = addr.country || "Nepal";
		const parts = [
			cityOrTown,
			district,
			country
		].filter(Boolean);
		return {
			displayName: parts.length > 0 ? parts.join(", ") : `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
			cityOrTown,
			municipality: addr.municipality || cityOrTown,
			district,
			stateOrProvince,
			country
		};
	} catch (err) {
		console.warn("Reverse geocode failed, returning coordinates:", err.message);
		return {
			displayName: `GPS: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`,
			country: "Nepal"
		};
	}
}
//#endregion
export { getCurrentBrowserCoordinates as n, reverseGeocodeCoordinates as r, AuthModal as t };
