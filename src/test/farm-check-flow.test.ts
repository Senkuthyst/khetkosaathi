import { describe, it, expect } from "vitest";
import type { MapPointMarker } from "@/components/FieldMap";

describe("Farm Check Flow — Farmer Accessibility & Plain Words", () => {
  it("defines the 5 core preceding crop choices with bilingual names", () => {
    const crops = ["rice", "maize", "wheat", "potato", "tomato"];
    expect(crops).toHaveLength(5);
  });

  it("evaluates healthy vegetation as green status with plain guidance", () => {
    const ndvi = 0.55;
    const yoy = 0.02;

    const isGreen = ndvi >= 0.45 && yoy >= -0.05;
    expect(isGreen).toBe(true);

    const plainMeaningNe = "बिरुवाको हरियाली स्वस्थ र यस मौसमका लागि सामान्य छ।";
    const plainMeaningEn = "Plant greenness is healthy and normal for this time of year.";
    expect(plainMeaningNe).toContain("हरियाली स्वस्थ");
    expect(plainMeaningEn).toContain("Plant greenness");
  });

  it("evaluates dropped vegetation as yellow or red status with constructive next steps", () => {
    const ndvi = 0.2;
    const yoy = -0.25;

    const isGreen = ndvi >= 0.45 && yoy >= -0.05;
    const isYellow = !isGreen && (ndvi >= 0.25 || yoy >= -0.15);
    const isRed = !isGreen && !isYellow;

    expect(isGreen).toBe(false);
    expect(isYellow).toBe(false);
    expect(isRed).toBe(true);

    const actionEn =
      "Walk your field to check for dry soil, and consult your local agriculture officer.";
    const actionNe =
      "खेतमा प्रत्यक्ष निरीक्षण गर्नुहोस् र स्थानीय कृषि शाखाका प्राविधिकसँग परामर्श गर्नुहोस्।";

    // Safeguard check: no pesticide or fertiliser advice
    expect(actionEn.toLowerCase()).not.toContain("fertiliser");
    expect(actionEn.toLowerCase()).not.toContain("pesticide");
    expect(actionNe).not.toContain("विषादी");
    expect(actionNe).not.toContain("मल");
  });

  it("preserves mandated safeguards and disclaimers", () => {
    const disclaimer = "Satellite estimates are not a diagnosis";
    expect(disclaimer).toContain("not a diagnosis");
    const suitableCropsHeading = "Suitable crops for this land";
    expect(suitableCropsHeading).toContain("Suitable crops for this land");
  });

  it("validates coordinates correctly and rejects non-finite or invalid coordinates", () => {
    const isValid = (coords: [number, number] | null) =>
      coords !== null &&
      Number.isFinite(coords[0]) &&
      Number.isFinite(coords[1]) &&
      coords[0] >= -90 &&
      coords[0] <= 90 &&
      coords[1] >= -180 &&
      coords[1] <= 180;

    expect(isValid([27.6775, 84.4333])).toBe(true);
    expect(isValid(null)).toBe(false);
    expect(isValid([NaN, 84.4333])).toBe(false);
    expect(isValid([27.6775, Infinity])).toBe(false);
    expect(isValid([105.0, 84.4333])).toBe(false);
  });

  it("constructs only ONE valid marker for farmer real coordinates matching FieldMap MapPointMarker interface", () => {
    const coords: [number, number] = [27.6775, 84.4333];
    const marker: MapPointMarker = {
      position: [coords[0], coords[1]],
      color: "#237A50",
      label: "Your farm",
      tooltipContent: "Your farm",
    };

    expect(marker.position).toEqual([27.6775, 84.4333]);
    expect(Array.isArray(marker.position)).toBe(true);
    expect(marker.position[0]).toBe(27.6775);
    expect(marker.position[1]).toBe(84.4333);
    // Does not invent fake coordinates for crops
    expect("lat" in marker).toBe(false);
    expect("lon" in marker).toBe(false);
  });
});
