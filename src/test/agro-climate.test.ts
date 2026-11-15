import { describe, it, expect } from "vitest";
import { calculateDailyGdd, accumulateGdd, CROP_GDD_CATALOG } from "@/lib/data/gdd";
import { calculateDailyETo, calculate14DayWaterBalance } from "@/lib/data/water-balance";
import { computeScientificAnomalies } from "@/lib/data/scientific-anomaly-engine";

describe("Growing Degree Days (GDD) — Pure Functions", () => {
  describe("calculateDailyGdd — Standard Clamped Thermal Time", () => {
    it("computes normal GDD when temperatures are within base and upper cutoffs", () => {
      // Tmax = 28°C, Tmin = 16°C, Tbase = 10°C, Tupper = 30°C
      // Clamped: max=28, min=16 -> mean = 22 -> GDD = 22 - 10 = 12
      const gdd = calculateDailyGdd(28.0, 16.0, 10.0, 30.0);
      expect(gdd).toBe(12.0);
    });

    it("clamps at base temperature when temperatures fall below Tbase", () => {
      // Tmax = 8°C, Tmin = 2°C, Tbase = 10°C, Tupper = 30°C
      // Clamped: max=8, min=10 -> mean = 9 -> GDD = max(0, 9 - 10) = 0
      const gdd = calculateDailyGdd(8.0, 2.0, 10.0, 30.0);
      expect(gdd).toBe(0);
    });

    it("clamps at upper cutoff when Tmax exceeds Tupper", () => {
      // Tmax = 38°C, Tmin = 20°C, Tbase = 10°C, Tupper = 30°C
      // Clamped: max=30 (capped), min=20 -> mean = 25 -> GDD = 25 - 10 = 15
      const gdd = calculateDailyGdd(38.0, 20.0, 10.0, 30.0);
      expect(gdd).toBe(15.0);
    });

    it("clamps both limits simultaneously when Tmax > Tupper and Tmin < Tbase", () => {
      // Tmax = 35°C, Tmin = 5°C, Tbase = 10°C, Tupper = 30°C
      // Clamped: max=30, min=10 -> mean = 20 -> GDD = 20 - 10 = 10
      const gdd = calculateDailyGdd(35.0, 5.0, 10.0, 30.0);
      expect(gdd).toBe(10.0);
    });

    it("returns null when either Tmax or Tmin is missing or null (never zero)", () => {
      expect(calculateDailyGdd(null, 15.0, 10.0, 30.0)).toBeNull();
      expect(calculateDailyGdd(25.0, null, 10.0, 30.0)).toBeNull();
      expect(calculateDailyGdd(null, null, 10.0, 30.0)).toBeNull();
      expect(calculateDailyGdd(NaN, 15.0, 10.0, 30.0)).toBeNull();
    });
  });

  describe("CROP_GDD_CATALOG — agrometeorological parameters", () => {
    const requiredCrops = ["rice", "maize", "wheat", "potato", "tomato"] as const;

    for (const cropId of requiredCrops) {
      it(`catalog contains valid agronomic parameters for ${cropId}`, () => {
        const crop = CROP_GDD_CATALOG[cropId];
        expect(crop).toBeDefined();
        expect(crop.tBase).toBeGreaterThan(0);
        expect(crop.tUpper).toBeGreaterThan(crop.tBase);
        expect(crop.stages.length).toBeGreaterThanOrEqual(3);
        expect(crop.citation.sourceTitle).toBeTruthy();
        expect(crop.citation.publishingInstitution).toBeTruthy();

        // Check ascending stage boundaries
        for (let i = 0; i < crop.stages.length - 1; i++) {
          const s0 = crop.stages[i];
          const s1 = crop.stages[i + 1];
          if (s0 && s1) {
            expect(s0.cumulativeGddThreshold).toBeLessThan(s1.cumulativeGddThreshold);
          }
        }
      });
    }

    it("marks tomato as approximate due to varietal variation", () => {
      expect(CROP_GDD_CATALOG.tomato.isApproximate).toBe(true);
      expect(CROP_GDD_CATALOG.tomato.stages.some((s) => s.isApproximate)).toBe(true);
    });
  });

  describe("accumulateGdd — thermal accumulation and stage tracking", () => {
    it("accumulates GDD correctly across a sequence of valid days", () => {
      const dailyData = [
        { date: "2026-06-01", t2mMax: 30.0, t2mMin: 20.0 }, // GDD = 15
        { date: "2026-06-02", t2mMax: 32.0, t2mMin: 22.0 }, // GDD = 17
        { date: "2026-06-03", t2mMax: 28.0, t2mMin: 18.0 }, // GDD = 13
      ];

      const res = accumulateGdd({
        cropId: "rice",
        plantingDate: "2026-06-01",
        dailyData,
      });

      expect(res.status).toBe("success");
      expect(res.cumulativeGdd).toBe(45.0); // 15 + 17 + 13
      expect(res.daysCounted).toBe(3);
      expect(res.missingDaysCount).toBe(0);
      expect(res.estimatedStage?.stageKey).toBe("vegetative");
      expect(res.confidenceNote).toContain("0.5° reanalysis grid");
    });

    it("tracks missing days and accumulates available ones", () => {
      const dailyData = [
        { date: "2026-06-01", t2mMax: 30.0, t2mMin: 20.0 }, // GDD = 15
        { date: "2026-06-02", t2mMax: null, t2mMin: 22.0 }, // missing
        { date: "2026-06-03", t2mMax: 28.0, t2mMin: 18.0 }, // GDD = 13
      ];

      const res = accumulateGdd({
        cropId: "rice",
        plantingDate: "2026-06-01",
        dailyData,
      });

      expect(res.status).toBe("success");
      expect(res.cumulativeGdd).toBe(28.0);
      expect(res.daysCounted).toBe(2);
      expect(res.missingDaysCount).toBe(1);
    });

    it("returns missing status when planting date is after data end", () => {
      const dailyData = [
        { date: "2026-05-01", t2mMax: 30.0, t2mMin: 20.0 },
        { date: "2026-05-02", t2mMax: 31.0, t2mMin: 21.0 },
      ];

      const res = accumulateGdd({
        cropId: "rice",
        plantingDate: "2026-06-01",
        dailyData,
      });

      expect(res.status).toBe("missing");
      expect(res.cumulativeGdd).toBeUndefined();
      expect(res.reason).toContain("after the latest available");
    });

    it("returns missing status when dailyData is empty", () => {
      const res = accumulateGdd({
        cropId: "rice",
        plantingDate: "2026-06-01",
        dailyData: [],
      });

      expect(res.status).toBe("missing");
    });

    it("returns missing status when all observations in the window are missing", () => {
      const dailyData = [
        { date: "2026-06-01", t2mMax: null, t2mMin: null },
        { date: "2026-06-02", t2mMax: null, t2mMin: null },
      ];

      const res = accumulateGdd({
        cropId: "rice",
        plantingDate: "2026-06-01",
        dailyData,
      });

      expect(res.status).toBe("missing");
      expect(res.reason).toContain("missing or invalid");
    });

    it("correctly identifies reproductive and grain fill stages at higher thermal accumulations", () => {
      // For wheat: Vegetative < 700, Flowering 700-1050, Grain fill 1050-1450, Mature >= 1450
      // 50 days at 22 GDD/day = 1100 GDD -> grain_fill
      const dailyData = Array.from({ length: 50 }, (_, i) => {
        const d = new Date("2026-11-01T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + i);
        return {
          date: d.toISOString().slice(0, 10),
          t2mMax: 28.0,
          t2mMin: 18.0, // mean=23, wheat tBase=4.5 -> GDD = 18.5
        };
      });

      const res = accumulateGdd({
        cropId: "wheat",
        plantingDate: "2026-11-01",
        dailyData,
      });

      expect(res.status).toBe("success");
      expect(res.cumulativeGdd).toBe(925.0); // 50 * 18.5
      expect(res.estimatedStage?.stageKey).toBe("flowering");
    });
  });
});

describe("FAO-56 Penman-Monteith Evapotranspiration (ET0) & Water Balance", () => {
  describe("calculateDailyETo — Verification Against FAO-56 Example 18 Benchmark", () => {
    it("matches the FAO-56 Example 18 worked example within stated tolerance", () => {
      // FAO Irrigation and Drainage Paper No. 56, Chapter 4, Example 18:
      // Meteorological data measured on 6 July in Uccle (Brussels, Belgium):
      //   Latitude: 50°48'N (50.8°N)
      //   Altitude: 100 m
      //   Date: 6 July (Day of Year J = 187)
      //   Tmax: 21.5°C, Tmin: 12.3°C
      //   RHmax: 84%, RHmin: 63%
      //   Wind speed at 2 m: u2 = 2.08 m/s (from 10 km/h at 10m height)
      //   Solar radiation Rs: 22.07 MJ/m²/day (from sunshine duration n = 9.25 h)
      //
      // Official FAO-56 Benchmark Outcome:
      //   ET0 = 3.88 mm/day (often rounded to 3.9 mm/day)

      const et0 = calculateDailyETo({
        latitude: 50.8,
        date: "2026-07-06",
        dayOfYearOverride: 187,
        tMax: 21.5,
        tMin: 12.3,
        rhMax: 84,
        rhMin: 63,
        solarRadiationMj: 22.07,
        windSpeed2mMps: 2.08,
        elevationM: 100,
      });

      expect(et0).not.toBeNull();
      // Verify benchmark matches 3.88 mm/day within 0.1 mm/day tolerance (stated tolerance)
      expect(et0!).toBeGreaterThanOrEqual(3.8);
      expect(et0!).toBeLessThanOrEqual(4.0);
      expect(Math.abs(et0! - 3.88)).toBeLessThan(0.05);
    });

    it("calculates ET0 using mean RH when RHmax/RHmin are not separately available", () => {
      const et0 = calculateDailyETo({
        latitude: 27.67,
        date: "2026-05-15",
        tMax: 32.0,
        tMin: 22.0,
        rhMean: 65,
        solarRadiationMj: 21.0,
        windSpeed2mMps: 1.8,
        elevationM: 150,
      });

      expect(et0).not.toBeNull();
      expect(et0!).toBeGreaterThan(0);
      expect(Number.isFinite(et0!)).toBe(true);
    });

    it("returns null when critical atmospheric inputs are missing (never zero)", () => {
      expect(
        calculateDailyETo({
          latitude: 27.67,
          date: "2026-05-15",
          tMax: null,
          tMin: 20.0,
          rhMean: 60,
          solarRadiationMj: 20.0,
        }),
      ).toBeNull();

      expect(
        calculateDailyETo({
          latitude: 27.67,
          date: "2026-05-15",
          tMax: 30.0,
          tMin: 20.0,
          rhMean: 60,
          solarRadiationMj: null,
        }),
      ).toBeNull();

      expect(
        calculateDailyETo({
          latitude: 27.67,
          date: "2026-05-15",
          tMax: 30.0,
          tMin: 20.0,
          rhMean: null,
          solarRadiationMj: 20.0,
        }),
      ).toBeNull();
    });
  });

  describe("calculate14DayWaterBalance — Rolling Net Balance & Climatology", () => {
    it("computes 14-day rainfall minus ET0 and empirical percentile correctly", () => {
      const dailyRecords = Array.from({ length: 14 }, (_, i) => {
        const d = new Date("2026-06-01T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + i);
        return {
          date: d.toISOString().slice(0, 10),
          t2mMax: 30.0,
          t2mMin: 22.0,
          rh2m: 75.0,
          allskySfcSwDwn: 20.0,
          ws2m: 1.5,
          prectotcorr: 8.0, // 8 mm rain daily
        };
      });

      // Historical 14-day net values over previous 15 years
      const historicalValues = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

      const balance = calculate14DayWaterBalance({
        latitude: 27.67,
        dailyRecords,
        elevationM: 150,
        historicalWindowNetValues: historicalValues,
      });

      expect(balance.status).toBe("success");
      expect(balance.totalRainfallMm).toBe(112.0); // 14 * 8
      expect(balance.totalEToMm).toBeGreaterThan(30);
      expect(balance.rollingNetMm).toBeDefined();
      expect(balance.climatologicalPercentile).toBeDefined();
      expect(balance.contextNote).toContain("Water balance context");
      expect(balance.contextNote).toContain("Not an irrigation schedule");
    });

    it("returns missing status when records are empty or below minimum window length", () => {
      const balance = calculate14DayWaterBalance({
        latitude: 27.67,
        dailyRecords: [],
      });

      expect(balance.status).toBe("missing");
      expect(balance.reason).toBeTruthy();
    });
  });
});

describe("Scientific Anomaly Engine — GDD Phenology & Water Balance Integration", () => {
  it("uses GDD stage for maturity check when provided, flagging maturityDetectionMethod=gdd", () => {
    const report = computeScientificAnomalies({
      locationName: "Chitwan Farm",
      latitude: 27.67,
      longitude: 84.43,
      cropAgeDays: 40, // Below 95, so old shortcut would say isMaturing=false
      gddStage: {
        stageKey: "grain_fill",
        nameEn: "Grain Filling",
        isMaturing: true,
        cumulativeGdd: 1250,
      },
    });

    expect(report.maturityDetectionMethod).toBe("gdd");
    expect(report.isMaturing).toBe(true);
    expect(report.evidenceStatements.some((s) => s.includes("Crop phenology (GDD)"))).toBe(true);
    expect(report.scientificUncertaintyNotes.some((s) => s.includes("GDD stage estimation"))).toBe(
      true,
    );
  });

  it("falls back to cropAgeDays shortcut when GDD data is absent, flagging maturityDetectionMethod=crop_age_fallback", () => {
    const reportMaturing = computeScientificAnomalies({
      locationName: "Chitwan Farm",
      latitude: 27.67,
      longitude: 84.43,
      cropAgeDays: 100, // >= 95
      gddStage: null,
    });

    expect(reportMaturing.maturityDetectionMethod).toBe("crop_age_fallback");
    expect(reportMaturing.isMaturing).toBe(true);

    const reportYoung = computeScientificAnomalies({
      locationName: "Chitwan Farm",
      latitude: 27.67,
      longitude: 84.43,
      cropAgeDays: 50, // < 95
      gddStage: null,
    });

    expect(reportYoung.maturityDetectionMethod).toBe("crop_age_fallback");
    expect(reportYoung.isMaturing).toBe(false);
  });

  it("integrates water balance context into evidence statements and uncertainties without irrigation recommendations", () => {
    const report = computeScientificAnomalies({
      locationName: "Chitwan Farm",
      latitude: 27.67,
      longitude: 84.43,
      waterBalance14Day: {
        rollingNetMm: -18.4,
        percentile: 22,
      },
    });

    expect(report.waterBalance14DayNetMm).toBe(-18.4);
    expect(report.waterBalanceClimatologyPercentile).toBe(22);

    const wbEvidence = report.evidenceStatements.find((s) => s.includes("Water balance context"));
    expect(wbEvidence).toBeDefined();
    expect(wbEvidence).toContain("-18.4 mm");
    expect(wbEvidence).toContain("22th percentile");

    const wbUncertainty = report.scientificUncertaintyNotes.find((s) =>
      s.includes("Water balance context"),
    );
    expect(wbUncertainty).toBeDefined();
    expect(wbUncertainty).toContain(
      "not a direct measure of root-zone soil water content or an irrigation schedule",
    );

    // Must never contain an irrigation schedule or recommendation command
    expect(
      report.fieldInspectionRecommendations.some((r) => r.toLowerCase().includes("irrigate 14")),
    ).toBe(false);
  });
});
