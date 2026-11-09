import { describe, expect, it } from "vitest";
import { assessEarth, rainfallAnomalyPct } from "@/lib/earth-intelligence";

const base = { rainCurrent: 12, rainNormal: 12, ndviCurrent: 0.6, ndviNormal: 0.6, tempCurrent: 28, tempNormal: 28, crop: "rice" as const, cropAgeDays: 40 };

describe("earth anomaly engine", () => {
  it("computes rainfall anomaly as percent of seasonal normal", () => {
    expect(rainfallAnomalyPct(6, 12)).toBe(-50);
  });
  it("is low when nothing is anomalous", () => {
    expect(assessEarth(base).risk).toBe("low");
  });
  it("is critical when dry, hot and vegetation dropped mid-season", () => {
    expect(assessEarth({ ...base, rainCurrent: 4, ndviCurrent: 0.45, tempCurrent: 31 }).risk).toBe("critical");
  });
  it("ignores NDVI decline for a maturing crop", () => {
    const r = assessEarth({ ...base, ndviCurrent: 0.4, cropAgeDays: 110 });
    expect(r.risk).toBe("low");
    expect(r.signals.find(s => s.id === "veg")?.suppressed).toBe(true);
  });
  it("reports missing when an observation is absent", () => {
    expect(assessEarth({ ...base, tempCurrent: null }).risk).toBe("missing");
  });
});
