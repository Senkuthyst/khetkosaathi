/**
 * Scientific Crop Rotation & Planting Advisory Rules Engine
 * Implements:
 * 1. Existing Crop Harvest Window Estimator (NARC Agronomy grounded)
 * 2. Next Crop Suitability Scoring Engine (NARC, FAO, NASA Environmental fusion)
 * 3. Crop Rotation Calendar Timeline Generator
 */

import {
  CROP_HARVEST_AGRONOMY_CATALOG,
  NEXT_CROP_SUITABILITY_CATALOG,
  type CropHarvestAgronomy,
  type NextCropSuitabilityRule,
  type AgronomicSourceCitation,
} from "./data/crop-advisory-catalog";
import type { FarmField } from "@/lib/farm-fields-service";

export interface ExistingCropHarvestAdvice {
  hasCrop: boolean;
  cropName: string;
  cropNameNe: string;
  cropVariety?: string;
  plantingDate: string;
  cropAgeDays: number;
  expectedDurationRangeDays: [number, number];
  estimatedHarvestStart: string; // ISO date string
  estimatedHarvestEnd: string; // ISO date string
  isHarvestWindowActive: boolean;
  isOverdue: boolean;
  environmentalRiskFactors: {
    factor: string;
    level: "low" | "medium" | "high";
    description: string;
  }[];
  visibleMaturityChecklist: {
    indicatorEn: string;
    indicatorNe: string;
  }[];
  expertAssessmentNote: string;
  citation: AgronomicSourceCitation;
  scientificConfidence: "high" | "medium" | "limited";
  confidenceExplanation: string;
}

export interface NextCropSuitabilityScore {
  cropId: string;
  nameEn: string;
  nameNe: string;
  family: string;
  suitabilityStatus: "highly_suitable" | "suitable" | "caution" | "unsuitable";
  compatibilityReasons: string[];
  incompatibilityReasons: string[];
  missingInformation: string[];
  recommendedPlantingWindow: string; // e.g. "February 15 - March 31"
  growthDurationDays: [number, number];
  rotationBenefits: string;
  rotationRisks: string;
  agronomicRequirements: string;
  citation: AgronomicSourceCitation;
  confidence: "high" | "medium" | "low";
  environmentalEvidence: {
    tempCompatibility: string;
    waterCompatibility: string;
    soilCompatibility: string;
  };
}

export interface RotationTimelineItem {
  stage: "current_crop" | "harvest_window" | "field_prep" | "next_planting" | "next_harvest";
  title: string;
  dateRange: string;
  durationDays: number;
  description: string;
  status: "completed" | "active" | "upcoming";
}

export interface SmartAdvisorAnalysisResult {
  fieldId: string;
  fieldName: string;
  locationLabel: string;
  coordinates: { latitude: number; longitude: number };
  harvestAdvice: ExistingCropHarvestAdvice;
  suitableNextCrops: NextCropSuitabilityScore[];
  timeline: RotationTimelineItem[];
  environmentalSummary: {
    recentAvgTempC: number | null;
    recentMaxTempC: number | null;
    recentMinTempC: number | null;
    recentRainSumMm: number | null;
    soilMoisturePct: number | null;
    observationWindow: string;
    dataSource: string;
  };
}

/**
 * 1. Compute Existing Crop Harvest Advice
 */
export function computeHarvestAdvice(
  field: FarmField,
  env: {
    recentAvgTempC: number | null;
    recentRainSumMm: number | null;
    soilMoisturePct: number | null;
  },
): ExistingCropHarvestAdvice {
  const normCropType = (field.cropType || "").toLowerCase().trim();
  const agronomy = CROP_HARVEST_AGRONOMY_CATALOG[normCropType];

  const plantingTime = new Date(field.plantingDate).getTime();
  const now = Date.now();
  const diffDays = Math.max(0, Math.floor((now - plantingTime) / (1000 * 60 * 60 * 24)));

  if (!agronomy) {
    // Unsupported crop type fallback
    const fallbackStart = new Date(plantingTime + 90 * 86400000).toISOString().slice(0, 10);
    const fallbackEnd = new Date(plantingTime + 120 * 86400000).toISOString().slice(0, 10);

    return {
      hasCrop: Boolean(field.cropType),
      cropName: field.cropType || "Unspecified Crop",
      cropNameNe: field.cropType || "बाली",
      cropVariety: field.cropVariety,
      plantingDate: field.plantingDate,
      cropAgeDays: diffDays,
      expectedDurationRangeDays: [90, 120],
      estimatedHarvestStart: fallbackStart,
      estimatedHarvestEnd: fallbackEnd,
      isHarvestWindowActive: diffDays >= 90 && diffDays <= 120,
      isOverdue: diffDays > 120,
      environmentalRiskFactors: [
        {
          factor: "Crop Growth Duration",
          level: "medium",
          description: `Specific agronomic maturity curves for '${field.cropType}' are not yet calibrated in NARC database. Using standard 90-120 day reference.`,
        },
      ],
      visibleMaturityChecklist: [
        {
          indicatorEn: "Inspect grain hardness, pod color change, or natural leaf yellowing.",
          indicatorNe: "दानाको कडापन वा पातको पहेँलोपन अवलोकन गर्नुहोस्।",
        },
      ],
      expertAssessmentNote:
        "Contact your local agricultural extension service (कृषि ज्ञान केन्द्र) for crop-specific guidance.",
      citation: {
        sourceTitle: "General Crop Production Manual",
        publishingInstitution: "Department of Agriculture, Nepal",
        referenceUrl: "https://doanepal.gov.np/",
        publicationYear: 2020,
      },
      scientificConfidence: "limited",
      confidenceExplanation: `Lack of variety-specific phenological curves for '${field.cropType}'. Advice requires in-field validation.`,
    };
  }

  // Check variety-specific duration if specified
  let minDays = agronomy.typicalDurationDaysMin;
  let maxDays = agronomy.typicalDurationDaysMax;
  const normVariety = (field.cropVariety || "").toLowerCase().trim();

  if (agronomy.varietyDurations && normVariety) {
    for (const [varKey, varData] of Object.entries(agronomy.varietyDurations)) {
      if (normVariety.includes(varKey) || varKey.includes(normVariety)) {
        minDays = varData.minDays;
        maxDays = varData.maxDays;
        break;
      }
    }
  }

  // Calculate projected calendar harvest window
  const harvestStartDate = new Date(plantingTime + minDays * 86400000).toISOString().slice(0, 10);
  const harvestEndDate = new Date(plantingTime + maxDays * 86400000).toISOString().slice(0, 10);

  const isHarvestWindowActive = diffDays >= minDays && diffDays <= maxDays;
  const isOverdue = diffDays > maxDays;

  // Environmental Risk Analysis
  const riskFactors: { factor: string; level: "low" | "medium" | "high"; description: string }[] =
    [];

  // Precipitation & Waterlogging Risk
  if (
    env.recentRainSumMm !== null &&
    env.recentRainSumMm > agronomy.excessiveRainRiskThresholdMmDay
  ) {
    riskFactors.push({
      factor: "Excessive Rainfall / Waterlogging",
      level: "high",
      description: `Recent precipitation (${env.recentRainSumMm.toFixed(1)} mm) exceeds safe harvest threshold (${agronomy.excessiveRainRiskThresholdMmDay} mm). Saturated soil increases tuber rotting (bacterial soft rot) and harvesting machinery sinkage. Delay tuber lifting until soil surface dries.`,
    });
  } else if (env.recentRainSumMm !== null && env.recentRainSumMm > 5) {
    riskFactors.push({
      factor: "Moderate Moisture",
      level: "low",
      description: `Recent rainfall (${env.recentRainSumMm.toFixed(1)} mm) is within manageable range. Ensure adequate soil aeration before field operations.`,
    });
  }

  // Soil Moisture Risk
  if (env.soilMoisturePct !== null) {
    if (env.soilMoisturePct > agronomy.optimalHarvestSoilMoistureMaxPct) {
      riskFactors.push({
        factor: "Soil Moisture Wet Horizon",
        level: "medium",
        description: `Soil moisture (${env.soilMoisturePct.toFixed(1)}%) is above optimal dry-down window (${agronomy.optimalHarvestSoilMoistureMinPct}-${agronomy.optimalHarvestSoilMoistureMaxPct}%). Digging in overly moist soil tears potato skin and promotes post-harvest fungal decay.`,
      });
    } else if (env.soilMoisturePct < agronomy.optimalHarvestSoilMoistureMinPct) {
      riskFactors.push({
        factor: "Hard Soil Crusting",
        level: "low",
        description: `Soil moisture (${env.soilMoisturePct.toFixed(1)}%) is low. In heavy clay soils, dry soil may cause tuber bruising during mechanical lifting.`,
      });
    }
  }

  // Thermal development factor
  if (env.recentAvgTempC !== null && env.recentAvgTempC > 28 && agronomy.cropId === "potato") {
    riskFactors.push({
      factor: "Elevated Late-Season Temperature",
      level: "medium",
      description: `Mean temperature (${env.recentAvgTempC.toFixed(1)}°C) exceeds optimal potato tuber bulking temperature (18-22°C). High soil temperature accelerates vine death but impairs starch accumulation. Prompt harvest and cool shaded curing are advised.`,
    });
  }

  return {
    hasCrop: true,
    cropName: agronomy.nameEn,
    cropNameNe: agronomy.nameNe,
    cropVariety: field.cropVariety,
    plantingDate: field.plantingDate,
    cropAgeDays: diffDays,
    expectedDurationRangeDays: [minDays, maxDays],
    estimatedHarvestStart: harvestStartDate,
    estimatedHarvestEnd: harvestEndDate,
    isHarvestWindowActive,
    isOverdue,
    environmentalRiskFactors: riskFactors,
    visibleMaturityChecklist: agronomy.visibleMaturityIndicators,
    expertAssessmentNote: agronomy.expertAssessmentTrigger,
    citation: agronomy.citation,
    scientificConfidence: "high",
    confidenceExplanation: `Grounded in NARC ${agronomy.nameEn} growth models with real planting date (${field.plantingDate}) and satellite agrometeorology.`,
  };
}

/**
 * 2. Next Crop Suitability Engine
 */
export function evaluateNextCrops(
  field: FarmField,
  env: {
    recentAvgTempC: number | null;
    recentMaxTempC: number | null;
    recentMinTempC: number | null;
    recentRainSumMm: number | null;
    soilMoisturePct: number | null;
  },
): NextCropSuitabilityScore[] {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const followingMonth = nextMonth === 12 ? 1 : nextMonth + 1;
  const targetWindowMonths = [currentMonth, nextMonth, followingMonth];

  const currentCropAgronomy =
    CROP_HARVEST_AGRONOMY_CATALOG[(field.cropType || "").toLowerCase().trim()];
  const currentFamily = currentCropAgronomy?.family;

  const results: NextCropSuitabilityScore[] = [];

  for (const candidate of NEXT_CROP_SUITABILITY_CATALOG) {
    const compReasons: string[] = [];
    const incompReasons: string[] = [];
    const missingInfo: string[] = [];

    // Factor 1: Seasonal Window Compatibility
    const isSeasonMatch = candidate.suitablePlantingMonths.some((m) =>
      targetWindowMonths.includes(m),
    );
    if (isSeasonMatch) {
      compReasons.push(
        `Optimal planting window coincides with upcoming seasonal calendar (Months: ${candidate.suitablePlantingMonths.join(", ")}).`,
      );
    } else {
      incompReasons.push(
        `Current season is outside optimal planting window (Requires sowing in Months: ${candidate.suitablePlantingMonths.join(", ")}).`,
      );
    }

    // Factor 2: Temperature Compatibility
    if (env.recentAvgTempC !== null) {
      if (
        env.recentAvgTempC >= candidate.optimalTempRangeC[0] &&
        env.recentAvgTempC <= candidate.optimalTempRangeC[1]
      ) {
        compReasons.push(
          `Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is directly in the optimal vegetative development range (${candidate.optimalTempRangeC[0]}–${candidate.optimalTempRangeC[1]}°C).`,
        );
      } else if (
        env.recentAvgTempC >= candidate.tempRangeC[0] &&
        env.recentAvgTempC <= candidate.tempRangeC[1]
      ) {
        compReasons.push(
          `Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is tolerable, though slightly outside optimal range.`,
        );
      } else {
        incompReasons.push(
          `Observed temperature (${env.recentAvgTempC.toFixed(1)}°C) is outside acceptable survival/growth limits (${candidate.tempRangeC[0]}–${candidate.tempRangeC[1]}°C).`,
        );
      }
    } else {
      missingInfo.push("Satellite surface temperature observations are currently unavailable.");
    }

    // Factor 3: Crop Rotation & Family Compatibility
    if (currentFamily) {
      if (candidate.incompatiblePrecedingFamilies.includes(currentFamily)) {
        incompReasons.push(
          `Rotation Risk: Planting ${candidate.nameEn} immediately after ${field.cropType} (${currentFamily} family) promotes shared soil-borne pathogen and pest accumulation.`,
        );
      } else if (candidate.beneficialPrecedingFamilies.includes(currentFamily)) {
        compReasons.push(
          `Beneficial Rotation: Highly synergistic following ${field.cropType}. Efficiently absorbs residual nutrients and breaks monoculture pathogen cycles.`,
        );
      } else {
        compReasons.push(
          `Compatible rotational sequence: ${candidate.family} family is botanically distinct from ${currentFamily}.`,
        );
      }
    }

    // Factor 4: Irrigation and Water Requirements
    if (candidate.irrigationNeeded && field.irrigationType === "rainfed") {
      incompReasons.push(
        `Requires assured irrigation (${candidate.waterRequirementMm[0]}-${candidate.waterRequirementMm[1]} mm), but field is registered as rainfed.`,
      );
    } else if (
      candidate.irrigationNeeded &&
      field.irrigationType &&
      field.irrigationType !== "rainfed"
    ) {
      compReasons.push(
        `Water requirement (${candidate.waterRequirementMm[0]}–${candidate.waterRequirementMm[1]} mm) matches field's ${field.irrigationType} irrigation access.`,
      );
    }

    // Factor 5: Soil Type Verification
    if (field.soilType) {
      const normSoil = field.soilType.toLowerCase();
      const soilMatch = candidate.compatibleSoilTextures.some((txt) => normSoil.includes(txt));
      if (soilMatch) {
        compReasons.push(
          `Soil texture '${field.soilType}' matches recommended root aeration and drainage needs.`,
        );
      } else if (!candidate.toleratesHeavyClay && normSoil.includes("clay")) {
        incompReasons.push(`Does not tolerate poorly-drained or heavy clay soils.`);
      }
    } else {
      missingInfo.push(
        "Plot-specific laboratory soil texture & pH unknown (not inferred from satellite).",
      );
    }

    // Compute Overall Suitability Classification
    let suitabilityStatus: "highly_suitable" | "suitable" | "caution" | "unsuitable" = "suitable";
    let confidence: "high" | "medium" | "low" = "medium";

    if (incompReasons.length >= 2 || (incompReasons.length >= 1 && !isSeasonMatch)) {
      suitabilityStatus = "unsuitable";
    } else if (incompReasons.length === 1) {
      suitabilityStatus = "caution";
    } else if (compReasons.length >= 3 && isSeasonMatch) {
      suitabilityStatus = "highly_suitable";
      confidence = "high";
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const plantingWindowStr = candidate.suitablePlantingMonths
      .map((m) => monthNames[m - 1])
      .join(" – ");

    results.push({
      cropId: candidate.cropId,
      nameEn: candidate.nameEn,
      nameNe: candidate.nameNe,
      family: candidate.family,
      suitabilityStatus,
      compatibilityReasons: compReasons,
      incompatibilityReasons: incompReasons,
      missingInformation: missingInfo,
      recommendedPlantingWindow: plantingWindowStr,
      growthDurationDays: candidate.growthDurationDays,
      rotationBenefits: candidate.rotationBenefitsEn,
      rotationRisks: candidate.rotationRisksEn,
      agronomicRequirements: candidate.agronomicRequirementsEn,
      citation: candidate.citation,
      confidence,
      environmentalEvidence: {
        tempCompatibility:
          env.recentAvgTempC !== null
            ? `${env.recentAvgTempC.toFixed(1)}°C (Req: ${candidate.optimalTempRangeC[0]}-${candidate.optimalTempRangeC[1]}°C)`
            : "Unknown",
        waterCompatibility: `${candidate.waterRequirementMm[0]}-${candidate.waterRequirementMm[1]} mm (${candidate.irrigationNeeded ? "Irrigation required" : "Low water / drought tolerant"})`,
        soilCompatibility: candidate.compatibleSoilTextures.join(", "),
      },
    });
  }

  // Sort: Highly suitable first, then suitable, caution, and unsuitable
  const rankOrder = { highly_suitable: 0, suitable: 1, caution: 2, unsuitable: 3 };
  return results.sort((a, b) => rankOrder[a.suitabilityStatus] - rankOrder[b.suitabilityStatus]);
}

/**
 * 3. Crop Rotation Planning Calendar Timeline
 */
export function buildRotationTimeline(
  harvestAdvice: ExistingCropHarvestAdvice,
  topNextCrop: NextCropSuitabilityScore | null,
): RotationTimelineItem[] {
  const items: RotationTimelineItem[] = [];

  const harvestEnd = new Date(harvestAdvice.estimatedHarvestEnd);
  const now = new Date();

  // 1. Current Crop Stage
  items.push({
    stage: "current_crop",
    title: `Existing Crop: ${harvestAdvice.cropName}`,
    dateRange: `${harvestAdvice.plantingDate} to Present (${harvestAdvice.cropAgeDays} days elapsed)`,
    durationDays: harvestAdvice.cropAgeDays,
    description: `Active field tenure. Expected physiological maturity window spans ${harvestAdvice.expectedDurationRangeDays[0]} to ${harvestAdvice.expectedDurationRangeDays[1]} days.`,
    status: harvestAdvice.isHarvestWindowActive ? "active" : "completed",
  });

  // 2. Harvest Window
  items.push({
    stage: "harvest_window",
    title: `Estimated Harvest Window (${harvestAdvice.cropName})`,
    dateRange: `${harvestAdvice.estimatedHarvestStart} to ${harvestAdvice.estimatedHarvestEnd}`,
    durationDays:
      harvestAdvice.expectedDurationRangeDays[1] - harvestAdvice.expectedDurationRangeDays[0],
    description: `Target harvesting operations during dry soil conditions. Follow the in-field skin-set and maturity confirmation checklist.`,
    status: harvestAdvice.isHarvestWindowActive
      ? "active"
      : harvestAdvice.isOverdue
        ? "completed"
        : "upcoming",
  });

  // 3. Field Preparation & Residue Management
  const prepStart = new Date(harvestEnd.getTime() + 1 * 86400000);
  const prepEnd = new Date(harvestEnd.getTime() + 10 * 86400000);
  items.push({
    stage: "field_prep",
    title: "Field Preparation & Solarization Window",
    dateRange: `${prepStart.toISOString().slice(0, 10)} to ${prepEnd.toISOString().slice(0, 10)}`,
    durationDays: 10,
    description:
      "Allow 7-10 days for crop residue incorporation, harrowing, weed flush termination, and soil moisture adjustment prior to seedbed opening.",
    status: "upcoming",
  });

  // 4. Next Crop Planting Window
  if (topNextCrop) {
    const plantStart = new Date(prepEnd.getTime() + 2 * 86400000);
    const plantEnd = new Date(plantStart.getTime() + 14 * 86400000);
    items.push({
      stage: "next_planting",
      title: `Recommended Next Planting: ${topNextCrop.nameEn}`,
      dateRange: `${plantStart.toISOString().slice(0, 10)} to ${plantEnd.toISOString().slice(0, 10)}`,
      durationDays: 14,
      description: `Optimal sowing window following field preparation. Ensures emergence before monsoon peak.`,
      status: "upcoming",
    });

    // 5. Expected Next Harvest
    const nextHarvestStart = new Date(
      plantStart.getTime() + topNextCrop.growthDurationDays[0] * 86400000,
    );
    const nextHarvestEnd = new Date(
      plantStart.getTime() + topNextCrop.growthDurationDays[1] * 86400000,
    );
    items.push({
      stage: "next_harvest",
      title: `Projected Next Harvest: ${topNextCrop.nameEn}`,
      dateRange: `${nextHarvestStart.toISOString().slice(0, 10)} to ${nextHarvestEnd.toISOString().slice(0, 10)}`,
      durationDays: topNextCrop.growthDurationDays[1] - topNextCrop.growthDurationDays[0],
      description: `Target harvest window (${topNextCrop.growthDurationDays[0]}–${topNextCrop.growthDurationDays[1]} days after sowing). Prepares land for subsequent monsoon paddy.`,
      status: "upcoming",
    });
  }

  return items;
}
