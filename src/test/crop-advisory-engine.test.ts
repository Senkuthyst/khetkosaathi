import { describe, it, expect } from "vitest";
import {
  computeHarvestAdvice,
  evaluateNextCrops,
  buildRotationTimeline,
} from "../lib/crop-advisory-engine";
import type { FarmField } from "../lib/farm-fields-service";

describe("Smart Crop Rotation & Harvest Advisor Engine", () => {
  const mockField: FarmField = {
    id: "test-field-1",
    userId: "user-123",
    fieldName: "Uttardhoka Pilot Plot",
    province: "Koshi Province",
    district: "Sunsari",
    municipality: "Itahari",
    latitude: 26.666,
    longitude: 87.279,
    boundary: [
      [26.667, 87.278],
      [26.667, 87.280],
      [26.665, 87.280],
      [26.665, 87.278],
    ],
    boundaryFeature: {
      type: "Feature",
      properties: { name: "Uttardhoka", area_hectares: 0.45, area_m2: 4500 },
      geometry: { type: "Polygon", coordinates: [[[87.278, 26.667], [87.280, 26.667], [87.280, 26.665], [87.278, 26.665], [87.278, 26.667]]] },
    },
    areaM2: 4500,
    areaUnit: "m2",
    cropType: "potato",
    cropVariety: "Cardinal",
    plantingDate: "2026-08-01",
    irrigationType: "canal",
    soilType: "Sandy Loam",
    isPrimary: true,
    createdAt: "2026-08-01T00:00:00Z",
  };

  it("calculates potato harvest window using variety-specific duration", () => {
    const advice = computeHarvestAdvice(mockField, {
      recentAvgTempC: 22.0,
      recentRainSumMm: 2.0,
      soilMoisturePct: 18.0,
    });

    expect(advice.hasCrop).toBe(true);
    expect(advice.cropName).toBe("Potato");
    expect(advice.expectedDurationRangeDays).toEqual([90, 105]); // Cardinal specific
    expect(advice.estimatedHarvestStart).toBeDefined();
    expect(advice.estimatedHarvestEnd).toBeDefined();
    expect(advice.visibleMaturityChecklist.length).toBeGreaterThan(0);
  });

  it("identifies waterlogging and excess rainfall risks correctly", () => {
    const advice = computeHarvestAdvice(mockField, {
      recentAvgTempC: 24.0,
      recentRainSumMm: 25.0, // Exceeds potato 15mm threshold
      soilMoisturePct: 26.0, // Saturated soil
    });

    const rainRisk = advice.environmentalRiskFactors.find((r) => r.factor.includes("Rainfall"));
    expect(rainRisk).toBeDefined();
    expect(rainRisk?.level).toBe("high");
  });

  it("recommends non-Solanaceae crops and flags rotation benefits", () => {
    const nextCrops = evaluateNextCrops(mockField, {
      recentAvgTempC: 24.0,
      recentMaxTempC: 29.0,
      recentMinTempC: 19.0,
      recentRainSumMm: 12.0,
      soilMoisturePct: 20.0,
    });

    expect(nextCrops.length).toBeGreaterThan(0);
    // Highest ranked should have high suitability
    const top = nextCrops[0];
    expect(top).toBeDefined();
    expect(top?.suitabilityStatus).toMatch(/highly_suitable|suitable/);

    // Mungbean should be present and beneficial after potato
    const mung = nextCrops.find((c) => c.cropId === "mungbean");
    expect(mung).toBeDefined();
    expect(mung?.rotationBenefits).toContain("nitrogen fixation");
  });

  it("constructs a sequential timeline including field preparation", () => {
    const advice = computeHarvestAdvice(mockField, {
      recentAvgTempC: 20.0,
      recentRainSumMm: 0,
      soilMoisturePct: 18.0,
    });
    const nextCrops = evaluateNextCrops(mockField, {
      recentAvgTempC: 20.0,
      recentMaxTempC: 25.0,
      recentMinTempC: 15.0,
      recentRainSumMm: 0,
      soilMoisturePct: 18.0,
    });

    const timeline = buildRotationTimeline(advice, nextCrops[0] ?? null);
    expect(timeline.length).toBeGreaterThanOrEqual(4);

    const stages = timeline.map((t) => t.stage);
    expect(stages).toContain("current_crop");
    expect(stages).toContain("harvest_window");
    expect(stages).toContain("field_prep");
    expect(stages).toContain("next_planting");
  });
});
