// Pure functions for Growing Degree Days (GDD) calculation and crop phenology estimation.
// Uses NASA POWER Daily point reanalysis data (T2M_MAX, T2M_MIN).
// Standard Clamped Thermal Time Model:
//   Daily GDD = max(0, (min(Tmax, Tupper) + max(Tmin, Tbase)) / 2 - Tbase)

import type { CropId } from "./types";

export interface CropStageDefinition {
  stageKey: string;
  nameEn: string;
  nameNe: string;
  cumulativeGddThreshold: number; // Cumulative GDD boundary to complete this stage
  isMaturing?: boolean; // Whether stage represents grain fill, tuber bulking, senescence or harvest
  isApproximate?: boolean;
}

export interface CropGddParameters {
  cropId: CropId;
  nameEn: string;
  nameNe: string;
  tBase: number;
  tUpper: number;
  stages: CropStageDefinition[];
  isApproximate?: boolean;
  citation: {
    sourceTitle: string;
    publishingInstitution: string;
    referenceUrl?: string;
    publicationYear?: number;
  };
}

/**
 * Agrometeorological thermal time parameters for key crops in Nepal.
 * Aligned with NARC / FAO agronomic recommendations.
 */
export const CROP_GDD_CATALOG: Record<CropId, CropGddParameters> = {
  // 1. Rice (धान) - Semi-dwarf indica cultivars (e.g. Hardinath, Chaite, Radha-4)
  // Base 10°C, Upper 35°C (heat stress cutoff).
  // Source: Gao et al. / IRRI Rice Knowledge Bank / NARC Rice Agronomy
  rice: {
    cropId: "rice",
    nameEn: "Rice (Paddy)",
    nameNe: "धान",
    tBase: 10.0,
    tUpper: 35.0,
    stages: [
      {
        stageKey: "vegetative",
        nameEn: "Vegetative (Tillering & Stem Elongation)",
        nameNe: "वानस्पतिक अवस्था (पलाउने र डाँठ बढ्ने)",
        cumulativeGddThreshold: 800,
        isMaturing: false,
      },
      {
        stageKey: "flowering",
        nameEn: "Reproductive (Panicle Initiation & Flowering)",
        nameNe: "प्रजनन तथा फूल फुल्ने अवस्था",
        cumulativeGddThreshold: 1150,
        isMaturing: false,
      },
      {
        stageKey: "grain_fill",
        nameEn: "Grain Filling / Ripening",
        nameNe: "दाना भरिने तथा पाक्ने अवस्था",
        cumulativeGddThreshold: 1500,
        isMaturing: true,
      },
      {
        stageKey: "mature",
        nameEn: "Harvest Maturity",
        nameNe: "बाली पाकेको / काट्न योग्य",
        cumulativeGddThreshold: Infinity,
        isMaturing: true,
      },
    ],
    citation: {
      sourceTitle: "Rice Knowledge Bank & Varietal Thermal Requirements",
      publishingInstitution:
        "International Rice Research Institute (IRRI) & NARC National Rice Research Program",
      referenceUrl: "https://narc.gov.np/",
      publicationYear: 2021,
    },
  },

  // 2. Maize (मकै) - Subtropical open-pollinated & hybrid maize (e.g. Rampur Composite, Arun-2)
  // Base 10°C, Upper 30°C (standard 86/50 modified thermal units).
  // Source: National Maize Research Program (NMRP), Rampur, Chitwan, NARC / FAO-56
  maize: {
    cropId: "maize",
    nameEn: "Maize",
    nameNe: "मकै",
    tBase: 10.0,
    tUpper: 30.0,
    stages: [
      {
        stageKey: "vegetative",
        nameEn: "Vegetative (Emergence to Tasseling)",
        nameNe: "वानस्पतिक अवस्था (उम्रिनेदेखि चमर हाल्नेसम्म)",
        cumulativeGddThreshold: 750,
        isMaturing: false,
      },
      {
        stageKey: "flowering",
        nameEn: "Silking & Tasseling",
        nameNe: "जुँगा तथा चमर हाल्ने अवस्था",
        cumulativeGddThreshold: 1050,
        isMaturing: false,
      },
      {
        stageKey: "grain_fill",
        nameEn: "Grain Filling (Blister to Dent)",
        nameNe: "दाना भरिने अवस्था",
        cumulativeGddThreshold: 1400,
        isMaturing: true,
      },
      {
        stageKey: "mature",
        nameEn: "Physiological Maturity (Black Layer)",
        nameNe: "पूर्ण परिपक्व अवस्था (कालो दाग बस्ने)",
        cumulativeGddThreshold: Infinity,
        isMaturing: true,
      },
    ],
    citation: {
      sourceTitle: "Maize Production Technologies in Nepal",
      publishingInstitution: "National Maize Research Program (NMRP), Rampur, NARC",
      referenceUrl: "https://narc.gov.np/",
      publicationYear: 2021,
    },
  },

  // 3. Wheat (गहुँ) - Spring wheat cultivars grown in winter (e.g. Gautam, Bhrikuti, NL-971)
  // Base 4.5°C, Upper 30°C (terminal heat stress cutoff).
  // Source: National Wheat Research Program (NWRP), Bhairahawa, NARC / McMaster & Wilhelm (1997)
  wheat: {
    cropId: "wheat",
    nameEn: "Wheat",
    nameNe: "गहुँ",
    tBase: 4.5,
    tUpper: 30.0,
    stages: [
      {
        stageKey: "vegetative",
        nameEn: "Vegetative (Crown Root to Jointing)",
        nameNe: "वानस्पतिक अवस्था (जरा हाल्ने र गाँज आउने)",
        cumulativeGddThreshold: 700,
        isMaturing: false,
      },
      {
        stageKey: "flowering",
        nameEn: "Heading & Anthesis (Flowering)",
        nameNe: "बाला निस्कने तथा फूल फुल्ने अवस्था",
        cumulativeGddThreshold: 1050,
        isMaturing: false,
      },
      {
        stageKey: "grain_fill",
        nameEn: "Grain Filling (Milky / Dough)",
        nameNe: "दाना भरिने अवस्था (दूधिया र पीठो बन्ने)",
        cumulativeGddThreshold: 1450,
        isMaturing: true,
      },
      {
        stageKey: "mature",
        nameEn: "Harvest Maturity (Hard Dough)",
        nameNe: "पूर्ण परिपक्व अवस्था (कटनी योग्य)",
        cumulativeGddThreshold: Infinity,
        isMaturing: true,
      },
    ],
    citation: {
      sourceTitle: "Wheat Production Guidelines for Nepal",
      publishingInstitution: "National Wheat Research Program (NWRP), Bhairahawa, NARC",
      referenceUrl: "https://narc.gov.np/",
      publicationYear: 2021,
    },
  },

  // 4. Potato (आलु) - Short to medium season tuber crops (e.g. Kufri Jyoti, Cardinal, Desiree)
  // Base 7.0°C, Upper 28°C (tuberization stops above 28°C).
  // Source: National Potato Research Program (NPRP), Khumaltar, NARC / FAO Potato Guide
  potato: {
    cropId: "potato",
    nameEn: "Potato",
    nameNe: "आलु",
    tBase: 7.0,
    tUpper: 28.0,
    stages: [
      {
        stageKey: "vegetative",
        nameEn: "Sprouting & Canopy Emergence",
        nameNe: "मुन्टा पलाउने र पात बढ्ने अवस्था",
        cumulativeGddThreshold: 450,
        isMaturing: false,
      },
      {
        stageKey: "tuber_initiation",
        nameEn: "Tuber Initiation & Flowering",
        nameNe: "आलुको दाना बन्ने सुरुवाती अवस्था",
        cumulativeGddThreshold: 800,
        isMaturing: false,
      },
      {
        stageKey: "tuber_bulking",
        nameEn: "Tuber Bulking",
        nameNe: "आलुको दाना ठूलो हुने अवस्था",
        cumulativeGddThreshold: 1200,
        isMaturing: true,
      },
      {
        stageKey: "mature",
        nameEn: "Skin Hardening & Senescence (Maturity)",
        nameNe: "परिपक्व तथा छाला कडा हुने अवस्था",
        cumulativeGddThreshold: Infinity,
        isMaturing: true,
      },
    ],
    citation: {
      sourceTitle: "Potato Production Technology in Nepal",
      publishingInstitution: "National Potato Research Program (NPRP), Khumaltar, NARC",
      referenceUrl: "https://narc.gov.np/",
      publicationYear: 2021,
    },
  },

  // 5. Tomato (गोलभेंडा) - Open-field / tunnel indeterminate & determinate tomatoes
  // Base 10.0°C, Upper 32.0°C.
  // Note: Varietal thresholds vary widely by hybrid cultivar; marked approximate.
  // Source: Horticulture Research Division, NARC, Khumaltar / Wolf et al. (1986)
  tomato: {
    cropId: "tomato",
    nameEn: "Tomato",
    nameNe: "गोलभेंडा",
    tBase: 10.0,
    tUpper: 32.0,
    isApproximate: true,
    stages: [
      {
        stageKey: "vegetative",
        nameEn: "Vegetative Growth",
        nameNe: "वानस्पतिक वृद्धि",
        cumulativeGddThreshold: 600,
        isMaturing: false,
        isApproximate: true,
      },
      {
        stageKey: "flowering",
        nameEn: "Flowering & Fruit Set",
        nameNe: "फूल फुल्ने तथा फल लाग्ने",
        cumulativeGddThreshold: 1000,
        isMaturing: false,
        isApproximate: true,
      },
      {
        stageKey: "fruit_development",
        nameEn: "Fruit Development / Breaker Stage",
        nameNe: "फल बढ्ने तथा रङ परिवर्तन हुने अवस्था",
        cumulativeGddThreshold: 1350,
        isMaturing: true,
        isApproximate: true,
      },
      {
        stageKey: "mature",
        nameEn: "Red Ripe Harvest Stage",
        nameNe: "रातो पाकेको फल / टिप्ने अवस्था",
        cumulativeGddThreshold: Infinity,
        isMaturing: true,
        isApproximate: true,
      },
    ],
    citation: {
      sourceTitle: "Commercial Tomato Production in Tunnel and Open Field",
      publishingInstitution: "Horticulture Research Division, NARC, Khumaltar",
      referenceUrl: "https://narc.gov.np/",
      publicationYear: 2020,
    },
  },
};

/**
 * Compute daily Growing Degree Days using the standard clamped method:
 *   GDD = max(0, (min(Tmax, Tupper) + max(Tmin, Tbase)) / 2 - Tbase)
 *
 * If either temperature input is null or non-finite, returns null (honest missing state).
 */
export function calculateDailyGdd(
  tMax: number | null,
  tMin: number | null,
  tBase: number,
  tUpper: number,
): number | null {
  if (tMax === null || tMin === null || !Number.isFinite(tMax) || !Number.isFinite(tMin)) {
    return null;
  }

  const clampedMax = Math.min(tMax, tUpper);
  const clampedMin = Math.max(tMin, tBase);

  const meanClamped = (clampedMax + clampedMin) / 2;
  const gdd = meanClamped - tBase;

  return Math.max(0, Math.round(gdd * 100) / 100);
}

export interface GddStageProgress {
  stageKey: string;
  nameEn: string;
  nameNe: string;
  stageIndex: number;
  totalStages: number;
  cumulativeGddThreshold: number;
  currentGdd: number;
  progressPct: number; // 0 to 100% within the current stage boundary
  nextStageNameEn: string | null;
  nextStageNameNe: string | null;
  isMaturing: boolean;
  isApproximate: boolean;
}

export interface GddAccumulationResult {
  status: "success" | "missing";
  cropId?: CropId;
  cropNameEn?: string;
  cropNameNe?: string;
  plantingDate?: string;
  latestObservationDate?: string;
  cumulativeGdd?: number;
  dailyGddRecords?: Array<{ date: string; gdd: number | null }>;
  estimatedStage?: GddStageProgress;
  progressToNextStagePct?: number;
  confidenceNote?: string;
  isApproximate?: boolean;
  daysCounted?: number;
  missingDaysCount?: number;
  reason?: string;
}

/**
 * Accumulate GDD from planting date to the latest available observation date.
 * Returns cumulative GDD, estimated phenological stage, % progress to next stage,
 * and agrometeorological confidence metadata.
 */
export function accumulateGdd(options: {
  cropId: string;
  plantingDate: string; // YYYY-MM-DD
  dailyData: Array<{
    date: string; // YYYY-MM-DD
    t2mMax: number | null;
    t2mMin: number | null;
  }>;
}): GddAccumulationResult {
  const { cropId, plantingDate, dailyData } = options;

  const crop = CROP_GDD_CATALOG[cropId as CropId];
  if (!crop) {
    return {
      status: "missing",
      reason: `Crop "${cropId}" is not in the GDD phenology catalog. Supported crops: ${Object.keys(CROP_GDD_CATALOG).join(", ")}.`,
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(plantingDate)) {
    return {
      status: "missing",
      reason: `Invalid planting date format "${plantingDate}". Expected YYYY-MM-DD.`,
    };
  }

  if (!dailyData || dailyData.length === 0) {
    return {
      status: "missing",
      reason: "No temperature observations provided.",
    };
  }

  // Sort chronologically ascending
  const sorted = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  if (!latest) {
    return {
      status: "missing",
      reason: "No temperature observations provided.",
    };
  }
  const latestObsDate = latest.date;

  if (plantingDate > latestObsDate) {
    return {
      status: "missing",
      plantingDate,
      latestObservationDate: latestObsDate,
      reason: `Planting date (${plantingDate}) is after the latest available NASA POWER observation date (${latestObsDate}).`,
    };
  }

  // Filter observations from plantingDate through latest available date
  const windowDays = sorted.filter((d) => d.date >= plantingDate && d.date <= latestObsDate);

  if (windowDays.length === 0) {
    return {
      status: "missing",
      plantingDate,
      latestObservationDate: latestObsDate,
      reason: "No observations found within the crop growth window.",
    };
  }

  let cumulativeGdd = 0;
  let daysCounted = 0;
  let missingDaysCount = 0;
  const dailyGddRecords: Array<{ date: string; gdd: number | null }> = [];

  for (const day of windowDays) {
    const dailyGdd = calculateDailyGdd(day.t2mMax, day.t2mMin, crop.tBase, crop.tUpper);
    dailyGddRecords.push({ date: day.date, gdd: dailyGdd });

    if (dailyGdd !== null) {
      cumulativeGdd += dailyGdd;
      daysCounted++;
    } else {
      missingDaysCount++;
    }
  }

  if (daysCounted === 0) {
    return {
      status: "missing",
      plantingDate,
      latestObservationDate: latestObsDate,
      daysCounted: 0,
      missingDaysCount,
      reason: "All daily temperature records in the growth window were missing or invalid.",
    };
  }

  cumulativeGdd = Math.round(cumulativeGdd * 10) / 10;

  // Determine phenological stage from cumulative GDD
  const lastStage = crop.stages[crop.stages.length - 1];
  if (!lastStage) {
    return {
      status: "missing",
      reason: "No crop stages configured.",
    };
  }

  let previousThreshold = 0;
  let currentStage: CropStageDefinition = lastStage;
  let currentStageIndex = crop.stages.length - 1;
  let nextStage: CropStageDefinition | null = null;
  let progressPct = 100;

  for (let i = 0; i < crop.stages.length; i++) {
    const stage = crop.stages[i];
    if (!stage) continue;
    if (cumulativeGdd < stage.cumulativeGddThreshold) {
      currentStage = stage;
      currentStageIndex = i;
      nextStage = crop.stages[i + 1] ?? null;

      const stageSpan = stage.cumulativeGddThreshold - previousThreshold;
      const gddIntoStage = cumulativeGdd - previousThreshold;
      progressPct =
        stageSpan > 0
          ? Math.min(100, Math.max(0, Math.round((gddIntoStage / stageSpan) * 100)))
          : 100;
      break;
    }
    previousThreshold = stage.cumulativeGddThreshold;
  }

  const isApproximate = Boolean(crop.isApproximate || currentStage.isApproximate);

  const estimatedStage: GddStageProgress = {
    stageKey: currentStage.stageKey,
    nameEn: currentStage.nameEn,
    nameNe: currentStage.nameNe,
    stageIndex: currentStageIndex + 1,
    totalStages: crop.stages.length,
    cumulativeGddThreshold: currentStage.cumulativeGddThreshold,
    currentGdd: cumulativeGdd,
    progressPct,
    nextStageNameEn: nextStage?.nameEn ?? null,
    nextStageNameNe: nextStage?.nameNe ?? null,
    isMaturing: Boolean(currentStage.isMaturing),
    isApproximate,
  };

  return {
    status: "success",
    cropId: crop.cropId,
    cropNameEn: crop.nameEn,
    cropNameNe: crop.nameNe,
    plantingDate,
    latestObservationDate: latestObsDate,
    cumulativeGdd,
    dailyGddRecords,
    estimatedStage,
    progressToNextStagePct: progressPct,
    confidenceNote: "POWER is a ~0.5° reanalysis grid, so stage is an estimate.",
    isApproximate,
    daysCounted,
    missingDaysCount,
  };
}
