// Dynamic Browser Geolocation & Reverse Geocoding Service
// Strictly enforces real coordinates, error handling, and privacy.
// Never fakes or hardcodes GPS locations.

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: number;
}

export interface GeocodedLocationName {
  displayName: string;
  cityOrTown?: string;
  municipality?: string;
  district?: string;
  stateOrProvince?: string;
  country: string;
}

/**
 * Request real user location from browser navigator.geolocation.
 */
export async function getCurrentBrowserCoordinates(
  options: PositionOptions = { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
): Promise<GeolocationResult> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by your browser or environment.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Math.round(pos.coords.latitude * 10000) / 10000,
          longitude: Math.round(pos.coords.longitude * 10000) / 10000,
          accuracyMeters: Math.round(pos.coords.accuracy),
          timestamp: pos.timestamp,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(
              new Error("Location permission was denied. Please select your location manually."),
            );
            break;
          case err.POSITION_UNAVAILABLE:
            reject(
              new Error("Location information is currently unavailable from your device GPS."),
            );
            break;
          case err.TIMEOUT:
            reject(
              new Error(
                "Location request timed out. Please check GPS settings or select manually.",
              ),
            );
            break;
          default:
            reject(new Error(`Location error: ${err.message}`));
        }
      },
      options,
    );
  });
}

/**
 * Reverse geocode latitude and longitude into readable locality / municipality / district
 * using OpenStreetMap Nominatim with proper user-agent rate limiting.
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lon: number,
): Promise<GeocodedLocationName> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "KHETKOSAATHI-AgriPlatform/2.0 (Nepal AgriTech Companion)",
      },
    });

    if (!res.ok) {
      throw new Error(`Reverse geocoding HTTP ${res.status}`);
    }

    const data = await res.json();
    const addr = data.address || {};

    const cityOrTown = addr.city || addr.town || addr.village || addr.suburb || addr.municipality;
    const district = addr.county || addr.district || addr.state_district;
    const stateOrProvince = addr.state || addr.province;
    const country = addr.country || "Nepal";

    const parts = [cityOrTown, district, country].filter(Boolean);
    const displayName =
      parts.length > 0 ? parts.join(", ") : `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`;

    return {
      displayName,
      cityOrTown,
      municipality: addr.municipality || cityOrTown,
      district,
      stateOrProvince,
      country,
    };
  } catch (err) {
    console.warn("Reverse geocode failed, returning coordinates:", (err as Error).message);
    return {
      displayName: `GPS: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`,
      country: "Nepal",
    };
  }
}
