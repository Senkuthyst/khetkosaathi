//#region node_modules/.nitro/vite/services/ssr/assets/geolocation-service-jVN4pwtD.js
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
export { reverseGeocodeCoordinates as n, getCurrentBrowserCoordinates as t };
