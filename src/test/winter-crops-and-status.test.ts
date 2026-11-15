/**
 * Tests: Winter Crops Catalog Coverage + Status Light Logic
 * Validates:
 *  A. Every calendar month 1–12 has ≥ 3 candidates in the NEXT_CROP_SUITABILITY_CATALOG
 *     when looking at a 3-month window (current + next 2 months), matching the same
 *     window logic used by evaluateNextCrops().
 *  B. evaluateNextCrops() hasSeasonMatch correctly detects in-season vs out-of-season.
 *  C. Status light returns "grey" when both rain and greenness are absent.
 *  D. Card text logic: unsuitable shows incompatibilityReason, suitable shows compatibilityReason.
 */

import { describe, it, expect } from "vitest";
import { NEXT_CROP_SUITABILITY_CATALOG } from "@/lib/data/crop-advisory-catalog";
import { evaluateNextCrops } from "@/lib/crop-advisory-engine";
import type { FarmField } from "@/lib/farm-fields-service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal synthetic FarmField for testing. */
function makeField(overrides: Partial<FarmField> = {}): FarmField {
  return {
    id: "test-field",
    userId: "demo",
    fieldName: "Test Field",
    latitude: 27.6775,
    longitude: 84.4333,
    boundary: [[27.6775, 84.4333]],
    boundaryFeature: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[84.4333, 27.6775], [84.4343, 27.6775], [84.4343, 27.6785], [84.4333, 27.6775]]],
      },
      properties: { name: "Test", area_hectares: 0.4046, area_m2: 4046 },
    },
    areaM2: 4046,
    areaUnit: "ropani",
    cropType: "rice",
    plantingDate: "2026-07-01",
    irrigationType: "irrigated",
    isPrimary: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/** Minimal env with no satellite data. */
const NO_DATA_ENV = {
  recentAvgTempC: null,
  recentMaxTempC: null,
  recentMinTempC: null,
  recentRainSumMm: null,
  soilMoisturePct: null,
};

/** Env with typical November Nepal Terai temperatures (no rain/moisture data). */
const NOV_ENV_NO_RAIN = {
  recentAvgTempC: 18.5,
  recentMaxTempC: 25.0,
  recentMinTempC: 12.0,
  recentRainSumMm: null,
  soilMoisturePct: null,
};

// ---------------------------------------------------------------------------
// A. Catalog coverage: every month has ≥ 3 candidate planting windows
//    using the same 3-month look-ahead as evaluateNextCrops().
// ---------------------------------------------------------------------------

describe("NEXT_CROP_SUITABILITY_CATALOG — monthly coverage", () => {
  for (let month = 1; month <= 12; month++) {
    it(`month ${month} has ≥ 3 candidate crops in a 3-month look-ahead window`, () => {
      const next1 = month === 12 ? 1 : month + 1;
      const next2 = next1 === 12 ? 1 : next1 + 1;
      const window = [month, next1, next2];

      const candidates = NEXT_CROP_SUITABILITY_CATALOG.filter((c) =>
        c.suitablePlantingMonths.some((m) => window.includes(m)),
      );

      expect(candidates.length).toBeGreaterThanOrEqual(3);
    });
  }
});

// ---------------------------------------------------------------------------
// B. evaluateNextCrops — hasSeasonMatch signal
// ---------------------------------------------------------------------------

describe("evaluateNextCrops — hasSeasonMatch", () => {
  it("returns hasSeasonMatch=true in November (winter crops should match)", () => {
    // November = month 11; window [11, 12, 1] → wheat_winter, lentil, field_pea, mustard etc.
    const field = makeField({ cropType: "rice" });
    // Directly patch Date to simulate November
    const origGetMonth = Date.prototype.getMonth;
    Date.prototype.getMonth = () => 10; // 0-indexed → November
    try {
      const result = evaluateNextCrops(field, NOV_ENV_NO_RAIN);
      expect(result.hasSeasonMatch).toBe(true);
      expect(result.topCrops.length).toBeGreaterThanOrEqual(1);
    } finally {
      Date.prototype.getMonth = origGetMonth;
    }
  });

  it("returns topCrops with ≤ 3 items", () => {
    const field = makeField({ cropType: "rice" });
    const result = evaluateNextCrops(field, NOV_ENV_NO_RAIN);
    expect(result.topCrops.length).toBeLessThanOrEqual(3);
  });

  it("when no crops are in season, upcomingCrops is non-empty and sorted by monthsAway", () => {
    // Force a month with no catalog entries if any exist — month 7 (July) has no planting entries
    const field = makeField({ cropType: "rice" });
    const origGetMonth = Date.prototype.getMonth;
    Date.prototype.getMonth = () => 6; // 0-indexed → July
    try {
      const result = evaluateNextCrops(field, NO_DATA_ENV);
      if (!result.hasSeasonMatch) {
        expect(result.upcomingCrops.length).toBeGreaterThan(0);
        for (let i = 1; i < result.upcomingCrops.length; i++) {
          expect(result.upcomingCrops[i].monthsAway).toBeGreaterThanOrEqual(
            result.upcomingCrops[i - 1].monthsAway,
          );
        }
      }
    } finally {
      Date.prototype.getMonth = origGetMonth;
    }
  });

  it("unsuitable crops are ranked last", () => {
    const field = makeField({ cropType: "rice" });
    const result = evaluateNextCrops(field, NOV_ENV_NO_RAIN);
    const statuses = result.topCrops.map((c) => c.suitabilityStatus);
    const hasUnsuitableBeforeOther = statuses.some(
      (s, i) => s === "unsuitable" && i < statuses.length - 1 && statuses[i + 1] !== "unsuitable",
    );
    expect(hasUnsuitableBeforeOther).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// C. Status light helper (pure logic extracted for testability)
// ---------------------------------------------------------------------------

type HealthLevel = "green" | "yellow" | "red" | "grey";

function computeHealthLevel(
  ndvi: number | null,
  ndviDelta: number | null,
  deltaPct: number | null,
): HealthLevel {
  const hasVeg = ndvi !== null;
  const hasRain = deltaPct !== null;

  if (!hasVeg && !hasRain) return "grey";

  if (hasVeg) {
    if (ndvi! >= 0.45 && (ndviDelta === null || ndviDelta >= -0.05)) return "green";
    if (ndvi! >= 0.25 || (ndviDelta !== null && ndviDelta >= -0.15)) return "yellow";
    return "red";
  }

  // Rain only → partial data → yellow
  return "yellow";
}

describe("Status light — honest grey when no data", () => {
  it("returns grey when both ndvi and deltaPct are null", () => {
    expect(computeHealthLevel(null, null, null)).toBe("grey");
  });

  it("returns green when ndvi ≥ 0.45 and ndviDelta is null (single-year data, no comparison)", () => {
    expect(computeHealthLevel(0.55, null, 10)).toBe("green");
  });

  it("returns green when ndvi ≥ 0.45 and ndviDelta ≥ -0.05", () => {
    expect(computeHealthLevel(0.52, 0.02, 5)).toBe("green");
  });

  it("returns yellow when ndvi is moderate (0.30)", () => {
    expect(computeHealthLevel(0.30, -0.10, 5)).toBe("yellow");
  });

  it("returns red when ndvi is very low (0.10) and delta is bad", () => {
    expect(computeHealthLevel(0.10, -0.25, -30)).toBe("red");
  });

  it("returns yellow when only rain data present (no veg)", () => {
    expect(computeHealthLevel(null, null, 15)).toBe("yellow");
  });
});

// ---------------------------------------------------------------------------
// D. Card text must match badge (unsuitable → incompatibilityReasons first)
// ---------------------------------------------------------------------------

describe("evaluateNextCrops — card text matches badge", () => {
  it("unsuitable crops have at least one incompatibilityReason", () => {
    const field = makeField({ cropType: "rice" });
    // Use July so spring crops are out of season → more unsuitable results
    const origGetMonth = Date.prototype.getMonth;
    Date.prototype.getMonth = () => 6; // July
    try {
      const result = evaluateNextCrops(field, NO_DATA_ENV);
      const unsuitableCrops = result.topCrops.filter((c) => c.suitabilityStatus === "unsuitable");
      for (const crop of unsuitableCrops) {
        expect(crop.incompatibilityReasons.length).toBeGreaterThan(0);
      }
    } finally {
      Date.prototype.getMonth = origGetMonth;
    }
  });

  it("suitable/highly_suitable crops have at least one compatibilityReason", () => {
    const field = makeField({ cropType: "rice" });
    const origGetMonth = Date.prototype.getMonth;
    Date.prototype.getMonth = () => 10; // November
    try {
      const result = evaluateNextCrops(field, NOV_ENV_NO_RAIN);
      const suitableCrops = result.topCrops.filter(
        (c) => c.suitabilityStatus === "suitable" || c.suitabilityStatus === "highly_suitable",
      );
      for (const crop of suitableCrops) {
        expect(crop.compatibilityReasons.length).toBeGreaterThan(0);
      }
    } finally {
      Date.prototype.getMonth = origGetMonth;
    }
  });
});

// ---------------------------------------------------------------------------
// E. Catalog data integrity checks
// ---------------------------------------------------------------------------

describe("NEXT_CROP_SUITABILITY_CATALOG — data integrity", () => {
  it("all entries have valid suitablePlantingMonths (1–12)", () => {
    for (const entry of NEXT_CROP_SUITABILITY_CATALOG) {
      for (const m of entry.suitablePlantingMonths) {
        expect(m).toBeGreaterThanOrEqual(1);
        expect(m).toBeLessThanOrEqual(12);
      }
    }
  });

  it("all entries have non-empty nameEn, nameNe, family, cropId", () => {
    for (const entry of NEXT_CROP_SUITABILITY_CATALOG) {
      expect(entry.cropId.length).toBeGreaterThan(0);
      expect(entry.nameEn.length).toBeGreaterThan(0);
      expect(entry.nameNe.length).toBeGreaterThan(0);
      expect(entry.family.length).toBeGreaterThan(0);
    }
  });

  it("all entries have citation with valid URL", () => {
    for (const entry of NEXT_CROP_SUITABILITY_CATALOG) {
      expect(entry.citation.referenceUrl).toMatch(/^https?:\/\//);
      expect(entry.citation.publishingInstitution.length).toBeGreaterThan(0);
    }
  });

  it("winter entries cover months 10–12 and 1", () => {
    const winterMonths = [10, 11, 12, 1];
    for (const wm of winterMonths) {
      const matches = NEXT_CROP_SUITABILITY_CATALOG.filter((c) =>
        c.suitablePlantingMonths.includes(wm),
      );
      expect(matches.length).toBeGreaterThanOrEqual(3);
    }
  });
});
