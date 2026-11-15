//#region node_modules/.nitro/vite/services/ssr/assets/modis-service-CxFMJJcE.js
var MODIS_SCALE_FACTOR = 1e-4;
/**
* Decode 16-bit MOD13Q1 VI Quality flag
* Bits 0-1: MODLAND QA
* Bits 2-5: VI usefulness
* Bits 6-7: Aerosol quantity
* Bits 8: Adjacent cloud detected
* Bits 9: Atmosphere BRDF correction performed
* Bits 10: Mixed clouds
* Bits 11-13: Land/Water mask
* Bits 14: Possible snow/ice
* Bits 15: Possible shadow
*/
function decodeModisVIQuality(qa) {
	if (qa == null || !Number.isFinite(qa) || qa < 0) return {
		rawQA: -1,
		qualityLevel: "cloudy",
		modlandQA: "not_produced_cloud",
		viUsefulness: 15,
		cloudState: "significant_clouds"
	};
	const modlandBits = qa & 3;
	const usefulnessBits = qa >> 2 & 15;
	const mixedClouds = qa >> 10 & 1;
	const snowIce = qa >> 14 & 1;
	const shadow = qa >> 15 & 1;
	let modlandQA = "good_quality";
	if (modlandBits === 1) modlandQA = "check_other_qa";
	else if (modlandBits === 2) modlandQA = "not_produced_cloud";
	else if (modlandBits === 3) modlandQA = "not_produced_other";
	let cloudState = "clear";
	if (mixedClouds === 1) cloudState = "mixed";
	if (modlandBits === 2) cloudState = "significant_clouds";
	if (shadow === 1) cloudState = "shadow";
	let qualityLevel = "good";
	if (snowIce === 1) qualityLevel = "snow_ice";
	else if (modlandBits >= 2 || cloudState === "significant_clouds") qualityLevel = "cloudy";
	else if (modlandBits === 1 || usefulnessBits > 4) qualityLevel = "marginal";
	return {
		rawQA: qa,
		qualityLevel,
		modlandQA,
		viUsefulness: usefulnessBits,
		cloudState
	};
}
/**
* Normalizes raw MODIS MOD13Q1 observations, applying the official 0.0001 scale factor,
* rejecting fill values, evaluating pixel quality, and formatting standard observation records.
*/
function normalizeModisObservations(options) {
	const { fieldId, fieldAreaM2 = 4046, latitude, longitude, rawSamples, retrievalTimestamp = (/* @__PURE__ */ new Date()).toISOString() } = options;
	const isFieldTooSmallForModis = fieldAreaM2 < 62500;
	const composites = [];
	const records = [];
	for (const sample of rawSamples) {
		const qa = decodeModisVIQuality(sample.qaRaw);
		const parseIndex = (rawVal) => {
			if (rawVal === -3e3 || rawVal < -2e3 || rawVal > 1e4) return null;
			if (qa.qualityLevel === "cloudy" || qa.qualityLevel === "snow_ice") return null;
			return Math.round(rawVal * MODIS_SCALE_FACTOR * 1e4) / 1e4;
		};
		const ndvi = parseIndex(sample.ndviRaw);
		const evi = parseIndex(sample.eviRaw);
		const startDate = new Date(sample.date);
		const endDate = new Date(startDate);
		endDate.setUTCDate(endDate.getUTCDate() + 15);
		const endStr = endDate.toISOString().slice(0, 10);
		const totalPix = sample.totalPixels ?? 1;
		const validPix = sample.validPixels ?? (ndvi !== null ? 1 : 0);
		const validCoveragePct = totalPix > 0 ? Math.round(validPix / totalPix * 100) : 0;
		composites.push({
			compositeStart: sample.date,
			compositeEnd: endStr,
			ndvi,
			evi,
			quality: qa,
			rawNdvi: sample.ndviRaw,
			rawEvi: sample.eviRaw,
			validPixelCount: validPix,
			totalPixelCount: totalPix,
			validCoveragePct
		});
		const qualityStatus = ndvi === null ? "missing" : qa.qualityLevel === "good" ? "good" : "marginal";
		records.push({
			fieldId,
			sourceName: "nasa_modis",
			productId: "MOD13Q1",
			productVersion: "061",
			variableName: "NDVI",
			value: ndvi,
			unit: "unitless (-0.2 to 1.0)",
			observationStart: `${sample.date}T00:00:00Z`,
			observationEnd: `${endStr}T23:59:59Z`,
			retrievalTimestamp,
			spatialResolution: "250 m",
			temporalResolution: "16-day",
			spatialExtractionMethod: "polygon_centroid",
			qualityStatus,
			qualityFlags: [qa.qualityLevel, qa.cloudState],
			validSpatialCoverage: isFieldTooSmallForModis ? "Sub-pixel Field (Area < 250m Grid)" : "Adequate Grid Coverage",
			processingVersion: "MODIS Collection 6.1",
			provenanceMetadata: {
				rawQA: sample.qaRaw,
				viUsefulness: qa.viUsefulness,
				scaleFactor: MODIS_SCALE_FACTOR,
				latitude,
				longitude,
				fieldAreaM2,
				validCoveragePct
			}
		});
		records.push({
			fieldId,
			sourceName: "nasa_modis",
			productId: "MOD13Q1",
			productVersion: "061",
			variableName: "EVI",
			value: evi,
			unit: "unitless (-0.2 to 1.0)",
			observationStart: `${sample.date}T00:00:00Z`,
			observationEnd: `${endStr}T23:59:59Z`,
			retrievalTimestamp,
			spatialResolution: "250 m",
			temporalResolution: "16-day",
			spatialExtractionMethod: "polygon_centroid",
			qualityStatus,
			qualityFlags: [qa.qualityLevel, qa.cloudState],
			validSpatialCoverage: isFieldTooSmallForModis ? "Sub-pixel Field (Area < 250m Grid)" : "Adequate Grid Coverage",
			processingVersion: "MODIS Collection 6.1",
			provenanceMetadata: {
				rawQA: sample.qaRaw,
				viUsefulness: qa.viUsefulness,
				scaleFactor: MODIS_SCALE_FACTOR,
				latitude,
				longitude,
				fieldAreaM2,
				validCoveragePct
			}
		});
	}
	const latestValid = composites.filter((c) => c.ndvi !== null).at(-1);
	const provenance = {
		dataset: "NASA MODIS MOD13Q1 V061 (Vegetation Indices 16-Day L3 Global 250m)",
		productId: "MOD13Q1.061",
		source: "nasa_modis",
		resolution: "250 m",
		temporalResolution: "16-day",
		spatialExtractionMethod: "polygon_centroid",
		processingVersion: "Collection 6.1 Tier 1",
		observedAt: composites.at(-1)?.compositeEnd ?? null,
		periodStart: composites[0]?.compositeStart,
		retrievedAt: retrievalTimestamp,
		quality: latestValid?.quality.qualityLevel === "good" ? "good" : "marginal",
		mode: "live",
		url: "https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1"
	};
	return {
		fieldId,
		fieldAreaM2,
		compositeObservations: composites,
		latestNdvi: latestValid?.ndvi ?? null,
		latestEvi: latestValid?.evi ?? null,
		isFieldTooSmallForModis,
		spatialResolution: "250 m",
		provenance,
		records
	};
}
//#endregion
export { normalizeModisObservations as n, decodeModisVIQuality as t };
