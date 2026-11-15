// Scientific Anomaly & Evidence-Grounded AI Explanation Engine
// Pure, deterministic, rigorous calculations. Zero fabricated predictions or false disease claims.

export interface ScientificAnomalyReport {
  locationName: string;
  coordinates: { latitude: number; longitude: number };
  temperatureMaxMean: number | null;
  temperatureBaseline: number;
  temperatureAnomalyDegC: number | null;
  isHeatStressed: boolean;

  rainfallAccumulation7DayMm: number | null;
  rainfallBaselineMm: number;
  rainfallAnomalyPct: number | null;
  isRainfallDeficit: boolean;
  isExcessRainfall: boolean;

  vegetationNdvi: number | null;
  vegetationBaseline: number;
  vegetationAnomaly: number | null;
  isVegetationDecline: boolean;

  thermalAnomaliesCount: number;

  overallRiskScore: "low" | "moderate" | "high" | "critical" | "insufficient_data";
  evidenceStatements: string[];
  scientificUncertaintyNotes: string[];
  fieldInspectionRecommendations: string[];

  // Agro-climate enhancements
  maturityDetectionMethod?: "gdd" | "crop_age_fallback";
  isMaturing?: boolean;
  gddStageKey?: string | null;
  waterBalance14DayNetMm?: number | null;
  waterBalanceClimatologyPercentile?: number | null;
}

/**
 * Computes scientific anomalies across NASA POWER, GPM, MODIS, and FIRMS observations.
 */
export function computeScientificAnomalies(input: {
  locationName: string;
  latitude: number;
  longitude: number;
  temperatureObservations?: Array<{ tMax: number | null; tMin: number | null }>;
  rainfallObservations?: Array<{ rain: number | null }>;
  modisNdvi?: number | null;
  modisBaselineLow?: number;
  modisBaselineHigh?: number;
  thermalHotspotsCount?: number;
  cropAgeDays?: number;
  cropType?: string;
  gddStage?: {
    stageKey: string;
    nameEn: string;
    isMaturing?: boolean;
    cumulativeGdd?: number;
  } | null;
  waterBalance14Day?: {
    rollingNetMm: number;
    percentile: number | null;
  } | null;
}): ScientificAnomalyReport {
  const {
    locationName,
    latitude,
    longitude,
    temperatureObservations = [],
    rainfallObservations = [],
    modisNdvi = null,
    modisBaselineLow = 0.55,
    modisBaselineHigh = 0.7,
    thermalHotspotsCount = 0,
    cropAgeDays = 45,
    cropType = "rice",
    gddStage = null,
    waterBalance14Day = null,
  } = input;

  // 1. Temperature Analysis
  const validTMax = temperatureObservations
    .map((o) => o.tMax)
    .filter((v): v is number => v !== null);
  const tempMeanMax =
    validTMax.length > 0 ? validTMax.reduce((a, b) => a + b, 0) / validTMax.length : null;
  const tempBaseline = 28.0; // Seasonal climatological baseline
  const tempAnomaly =
    tempMeanMax !== null ? Math.round((tempMeanMax - tempBaseline) * 10) / 10 : null;
  const isHeatStressed = tempAnomaly !== null && tempAnomaly >= 2.0;

  // 2. Rainfall Analysis
  const validRain = rainfallObservations.map((o) => o.rain).filter((v): v is number => v !== null);
  const rainTotal = validRain.length > 0 ? validRain.reduce((a, b) => a + b, 0) : null;
  const rainBaseline = 12.0; // Seasonal reference
  const rainAnomalyPct =
    rainTotal !== null && rainBaseline > 0
      ? Math.round(((rainTotal - rainBaseline) / rainBaseline) * 1000) / 10
      : null;
  const isRainfallDeficit = rainAnomalyPct !== null && rainAnomalyPct <= -30.0;
  const isExcessRainfall = rainAnomalyPct !== null && rainAnomalyPct >= 100.0;

  // 3. Vegetation & Phenology Analysis
  const modisBaselineMean = (modisBaselineLow + modisBaselineHigh) / 2;
  const vegAnomaly =
    modisNdvi !== null ? Math.round((modisNdvi - modisBaselineMean) * 100) / 100 : null;

  let isMaturing: boolean;
  let maturityDetectionMethod: "gdd" | "crop_age_fallback";
  if (gddStage !== null && gddStage !== undefined) {
    isMaturing = Boolean(
      gddStage.isMaturing ||
      gddStage.stageKey === "grain_fill" ||
      gddStage.stageKey === "tuber_bulking" ||
      gddStage.stageKey === "fruit_development" ||
      gddStage.stageKey === "mature" ||
      gddStage.stageKey === "ripening",
    );
    maturityDetectionMethod = "gdd";
  } else {
    isMaturing = cropAgeDays >= 95; // Fallback legacy shortcut
    maturityDetectionMethod = "crop_age_fallback";
  }

  const isVegetationDecline = !isMaturing && vegAnomaly !== null && vegAnomaly <= -0.06;

  // 4. Evidence Statements Generation
  const evidence: string[] = [];
  const uncertainties: string[] = [];
  const recommendations: string[] = [];

  // GDD Phenology Evidence
  if (gddStage !== null && gddStage !== undefined) {
    evidence.push(
      `Crop phenology (GDD): Model indicates "${gddStage.nameEn}" stage${gddStage.cumulativeGdd !== undefined ? ` with ${gddStage.cumulativeGdd} accumulated thermal units` : ""}.`,
    );
    uncertainties.push(
      "GDD stage estimation is derived from ~0.5° regional reanalysis and serves as an approximate phenological guide.",
    );
  }

  // Water Balance Context Evidence
  if (waterBalance14Day !== null && waterBalance14Day !== undefined) {
    evidence.push(
      `Water balance context: 14-day rolling net balance of ${waterBalance14Day.rollingNetMm >= 0 ? "+" : ""}${waterBalance14Day.rollingNetMm.toFixed(1)} mm (precipitation minus reference ET₀)${waterBalance14Day.percentile !== null ? `, ranking at the ${waterBalance14Day.percentile}th percentile of 15-year climatology` : ""}.`,
    );
    uncertainties.push(
      "Water balance context reflects atmospheric moisture supply vs evaporative demand and is not a direct measure of root-zone soil water content or an irrigation schedule.",
    );
  }

  if (tempMeanMax !== null && tempAnomaly !== null) {
    evidence.push(
      `NASA POWER reanalysis indicates 7-day mean maximum temperature of ${tempMeanMax.toFixed(1)}°C (${tempAnomaly > 0 ? "+" : ""}${tempAnomaly.toFixed(1)}°C anomaly relative to the ${tempBaseline}°C seasonal baseline).`,
    );
  } else {
    uncertainties.push("Temperature reanalysis data is incomplete for this window.");
  }

  if (rainTotal !== null && rainAnomalyPct !== null) {
    evidence.push(
      `Precipitation observation shows ${rainTotal.toFixed(1)} mm accumulated (${rainAnomalyPct > 0 ? "+" : ""}${rainAnomalyPct.toFixed(1)}% deviation against the ${rainBaseline} mm reference baseline).`,
    );
  }

  if (modisNdvi !== null) {
    evidence.push(
      `MODIS MOD13Q1 250m composite shows an NDVI of ${modisNdvi.toFixed(2)} (Reference range: ${modisBaselineLow.toFixed(2)}–${modisBaselineHigh.toFixed(2)}).`,
    );
    if (isMaturing) {
      uncertainties.push(
        "Vegetation index decrease coincides with physiological grain filling and expected crop maturation senescence.",
      );
    }
  }

  if (thermalHotspotsCount > 0) {
    evidence.push(
      `NASA FIRMS detected ${thermalHotspotsCount} thermal anomaly hotspots within the regional radius.`,
    );
    uncertainties.push(
      "Thermal hotspots indicate elevated surface temperatures (e.g. brick kilns, residue burns, or clearings); they do not prove localized agricultural damage.",
    );
  }

  // 5. Risk Assessment
  let activeFlags = 0;
  if (isHeatStressed) activeFlags++;
  if (isRainfallDeficit) activeFlags++;
  if (isVegetationDecline) activeFlags++;

  let overallRiskScore: ScientificAnomalyReport["overallRiskScore"] = "low";
  if (tempMeanMax === null || rainTotal === null) {
    overallRiskScore = "insufficient_data";
  } else if (activeFlags >= 3) {
    overallRiskScore = "critical";
  } else if (activeFlags === 2) {
    overallRiskScore = "high";
  } else if (activeFlags === 1) {
    overallRiskScore = "moderate";
  }

  // Recommendations
  if (isRainfallDeficit) {
    recommendations.push(
      "Verify soil moisture in the root zone (0–15 cm) and inspect field bund water retention.",
    );
  }
  if (isHeatStressed) {
    recommendations.push(
      "Monitor canopy temperature and consider light morning/evening irrigation to mitigate heat stress.",
    );
  }
  if (isVegetationDecline) {
    recommendations.push(
      "Perform multi-point field walkthrough to check for nitrogen depletion, moisture stress, or weed competition.",
    );
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain standard agronomic monitoring and routine scouting.");
  }

  return {
    locationName,
    coordinates: { latitude, longitude },
    temperatureMaxMean: tempMeanMax !== null ? Math.round(tempMeanMax * 10) / 10 : null,
    temperatureBaseline: tempBaseline,
    temperatureAnomalyDegC: tempAnomaly,
    isHeatStressed,
    rainfallAccumulation7DayMm: rainTotal !== null ? Math.round(rainTotal * 10) / 10 : null,
    rainfallBaselineMm: rainBaseline,
    rainfallAnomalyPct: rainAnomalyPct,
    isRainfallDeficit,
    isExcessRainfall,
    vegetationNdvi: modisNdvi,
    vegetationBaseline: Math.round(modisBaselineMean * 100) / 100,
    vegetationAnomaly: vegAnomaly,
    isVegetationDecline,
    thermalAnomaliesCount: thermalHotspotsCount,
    overallRiskScore,
    evidenceStatements: evidence,
    scientificUncertaintyNotes: uncertainties,
    fieldInspectionRecommendations: recommendations,
    maturityDetectionMethod,
    isMaturing,
    gddStageKey: gddStage?.stageKey ?? null,
    waterBalance14DayNetMm: waterBalance14Day?.rollingNetMm ?? null,
    waterBalanceClimatologyPercentile: waterBalance14Day?.percentile ?? null,
  };
}
