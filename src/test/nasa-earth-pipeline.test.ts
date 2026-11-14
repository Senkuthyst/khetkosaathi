import { describe, expect, it } from "vitest";
import {
  decodeModisVIQuality,
  normalizeModisObservations,
  MODIS_SCALE_FACTOR,
} from "@/lib/data/modis-service";
import {
  normalizeGpmImergObservations,
  calculateRainfallAnomaly,
} from "@/lib/data/gpm-service";
import { parseFirmsCsv } from "@/lib/data/firms-service";
import { computeScientificAnomalies } from "@/lib/data/scientific-anomaly-engine";

describe("Stage 2-8 NASA Scientific Data Pipeline Tests", () => {
  describe("NASA MODIS MOD13Q1 Pipeline", () => {
    it("correctly decodes MODIS 16-bit VI Quality flags", () => {
      // QA = 0: Good quality, clear sky
      const goodQA = decodeModisVIQuality(0);
      expect(goodQA.qualityLevel).toBe("good");
      expect(goodQA.cloudState).toBe("clear");

      // QA with modlandQA = 2 (not produced due to cloud)
      const cloudQA = decodeModisVIQuality(0b0000000000000010);
      expect(cloudQA.qualityLevel).toBe("cloudy");
      expect(cloudQA.cloudState).toBe("significant_clouds");
    });

    it("applies 0.0001 scale factor and calculates field polygon pixel coverage", () => {
      const summary = normalizeModisObservations({
        fieldId: "test-farm-1",
        fieldAreaM2: 125000, // 2 MODIS pixels
        latitude: 27.6775,
        longitude: 84.4333,
        rawSamples: [
          {
            date: "2026-10-16",
            ndviRaw: 6500, // 6500 * 0.0001 = 0.65
            eviRaw: 4200, // 4200 * 0.0001 = 0.42
            qaRaw: 0,
            validPixels: 2,
            totalPixels: 2,
          },
        ],
      });

      expect(summary.latestNdvi).toBe(0.65);
      expect(summary.latestEvi).toBe(0.42);
      expect(summary.isFieldTooSmallForModis).toBe(false);
      expect(summary.compositeObservations[0].validCoveragePct).toBe(100);
      expect(summary.records.length).toBe(2); // NDVI & EVI
      expect(summary.records[0].spatialResolution).toBe("250 m");
      expect(summary.records[0].unit).toBe("unitless (-0.2 to 1.0)");
    });

    it("flags sub-pixel fields (< 62,500 m²)", () => {
      const summary = normalizeModisObservations({
        fieldId: "small-farm",
        fieldAreaM2: 5000, // 0.5 hectare (much smaller than 250m x 250m)
        latitude: 27.6775,
        longitude: 84.4333,
        rawSamples: [{ date: "2026-10-16", ndviRaw: 6000, eviRaw: 4000, qaRaw: 0 }],
      });

      expect(summary.isFieldTooSmallForModis).toBe(true);
      expect(summary.records[0].validSpatialCoverage).toContain("Sub-pixel Field");
    });
  });

  describe("NASA GPM IMERG V07B Pipeline", () => {
    it("normalizes precipitation daily accumulation and calculates rainfall anomalies", () => {
      const summary = normalizeGpmImergObservations({
        fieldId: "gpm-pilot-1",
        latitude: 27.6775,
        longitude: 84.4333,
        productType: "Final",
        seasonalBaselineMm: 20.0,
        samples: [
          { date: "2026-11-01", precipitationMm: 2.5 },
          { date: "2026-11-02", precipitationMm: 0.0 },
          { date: "2026-11-03", precipitationMm: 1.5 },
          { date: "2026-11-04", precipitationMm: 0.0 },
          { date: "2026-11-05", precipitationMm: 0.0 },
          { date: "2026-11-06", precipitationMm: 1.0 },
          { date: "2026-11-07", precipitationMm: 0.0 },
        ],
      });

      expect(summary.dailyPoints.length).toBe(7);
      expect(summary.totalAccumulation7DayMm).toBe(5.0);
      // (5.0 - 20.0) / 20.0 * 100 = -75.0%
      expect(summary.rainfallAnomalyPct).toBe(-75.0);
      expect(summary.spatialResolution).toBe("0.1° (~10 km)");
    });
  });

  describe("NASA FIRMS Active Fire Parser", () => {
    it("parses CSV thermal anomaly hotspots with authentic confidence and sensor info", () => {
      const mockCsv = `latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight
27.6850,84.4420,335.4,0.4,0.4,2026-11-10,0745,Suomi-NPP,VIIRS,nominal,2.0NRT,298.2,14.5,D`;

      const detections = parseFirmsCsv(mockCsv);
      expect(detections.length).toBe(1);
      expect(detections[0].latitude).toBe(27.685);
      expect(detections[0].longitude).toBe(84.442);
      expect(detections[0].instrument).toBe("VIIRS");
      expect(detections[0].brightness).toBe(335.4);
      expect(detections[0].frp).toBe(14.5);
    });
  });

  describe("Scientific Anomaly & Grounded AI Engine", () => {
    it("synthesizes multi-sensor evidence without fabricated disease diagnoses", () => {
      const report = computeScientificAnomalies({
        locationName: "Chitwan Pilot",
        latitude: 27.6775,
        longitude: 84.4333,
        temperatureObservations: [{ tMax: 31.0, tMin: 20.0 }], // +3.0°C anomaly
        rainfallObservations: [{ rain: 2.0 }], // deficit vs 12mm baseline
        modisNdvi: 0.45, // below 0.60
        cropAgeDays: 45, // mid-growth stage
      });

      expect(report.isHeatStressed).toBe(true);
      expect(report.isRainfallDeficit).toBe(true);
      expect(report.isVegetationDecline).toBe(true);
      expect(report.overallRiskScore).toBe("critical");
      expect(report.evidenceStatements.length).toBeGreaterThanOrEqual(3);
      expect(report.fieldInspectionRecommendations.length).toBeGreaterThan(0);
      expect(
        report.fieldInspectionRecommendations.some((r) =>
          r.toLowerCase().includes("soil moisture")
        )
      ).toBe(true);
    });
  });
});
