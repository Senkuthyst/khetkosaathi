import { describe, expect, it, vi } from "vitest";
import {
  decodeHlsFmask,
  calculateHlsNdvi,
  HLS_SCALE_FACTOR,
} from "@/lib/data/hls-service";
import {
  resolveHlsVegetation,
  fetchHlsVegetationServerFn,
} from "@/lib/server-functions/hls.server";

describe("NASA HLS 30m Vegetation Pipeline & Fallback Tests", () => {
  describe("HLS Fmask QA Decoding", () => {
    it("identifies clear land pixels correctly", () => {
      const clear = decodeHlsFmask(0);
      expect(clear.isValidLand).toBe(true);
      expect(clear.description).toBe("Clear Land");
    });

    it("rejects cloud pixels (bit 1 = 1)", () => {
      const cloud = decodeHlsFmask(0b00000010);
      expect(cloud.isValidLand).toBe(false);
      expect(cloud.description).toBe("Cloud Masked");
    });

    it("rejects cloud shadow pixels (bit 2 = 1)", () => {
      const shadow = decodeHlsFmask(0b00000100);
      expect(shadow.isValidLand).toBe(false);
      expect(shadow.description).toBe("Cloud Shadow Masked");
    });

    it("rejects snow/ice pixels (bit 4 = 1)", () => {
      const snow = decodeHlsFmask(0b00010000);
      expect(snow.isValidLand).toBe(false);
      expect(snow.description).toBe("Snow / Ice Masked");
    });

    it("rejects water pixels (bit 5 = 1)", () => {
      const water = decodeHlsFmask(0b00100000);
      expect(water.isValidLand).toBe(false);
      expect(water.description).toBe("Water Body");
    });

    it("rejects fill values (255 or negative)", () => {
      expect(decodeHlsFmask(255).isValidLand).toBe(false);
      expect(decodeHlsFmask(-1).isValidLand).toBe(false);
    });
  });

  describe("NDVI Calculation Logic", () => {
    it("computes accurate NDVI for Sentinel-2 (B08 NIR, B04 Red)", () => {
      // NIR = 0.60, Red = 0.20 -> (0.6 - 0.2) / (0.6 + 0.2) = 0.4 / 0.8 = 0.50
      const result = calculateHlsNdvi(0.60, 0.20, 0);
      expect(result.isValid).toBe(true);
      expect(result.ndvi).toBe(0.5);
      expect(result.description).toBe("Clear Land");
    });

    it("computes accurate NDVI for Landsat-8/9 (B05 NIR, B04 Red)", () => {
      // Dense healthy crop: NIR = 0.70, Red = 0.10 -> 0.6 / 0.8 = 0.75
      const result = calculateHlsNdvi(0.70, 0.10, 0);
      expect(result.isValid).toBe(true);
      expect(result.ndvi).toBe(0.75);
    });

    it("returns null NDVI when masked by cloud in Fmask", () => {
      const result = calculateHlsNdvi(0.60, 0.20, 2); // Fmask = 2 (cloud)
      expect(result.isValid).toBe(false);
      expect(result.ndvi).toBeNull();
      expect(result.description).toBe("Cloud Masked");
    });

    it("applies 0.0001 scale factor correctly", () => {
      const rawNir = 6000;
      const rawRed = 2000;
      const nirRef = rawNir * HLS_SCALE_FACTOR;
      const redRef = rawRed * HLS_SCALE_FACTOR;
      const result = calculateHlsNdvi(nirRef, redRef, 0);
      expect(result.ndvi).toBe(0.5);
    });
  });

  describe("HLS to MODIS Honest Fallback Logic", () => {
    it("gracefully falls back to MODIS when Python microservice is unreachable, with honest attribution", async () => {
      // Mock modis fallback function returning verified MODIS summary
      const mockModisFallback = vi.fn().mockResolvedValue({
        fieldId: "test-farm-hls",
        latestNdvi: 0.62,
        latestEvi: 0.38,
        provenance: {
          dataset: "NASA MODIS MOD13Q1",
          observedAt: "2026-10-16",
          qualityFlags: ["ORNL_DAAC_MODIS_WEB_SERVICE"],
        },
      });

      const summary = await resolveHlsVegetation(
        {
          fieldId: "test-farm-hls",
          latitude: 27.6775,
          longitude: 84.4333,
          windowDays: 30,
          force: false,
        },
        {
          hlsServiceUrl: "http://127.0.0.1:9999", // non-existent port forces network error
          modisFallback: mockModisFallback,
        },
      );

      expect(mockModisFallback).toHaveBeenCalledTimes(1);
      expect(summary.fieldId).toBe("test-farm-hls");
      expect(summary.isFallback).toBe(true);
      expect(summary.dataSource).toBe("NASA MODIS MOD13Q1 (HLS Fallback)");
      expect(summary.fallbackReason).toContain("HLS service offline");
      expect(summary.latestNdvi).toBe(0.62);
      expect(summary.provenance.dataset).toBe("NASA MODIS MOD13Q1 (HLS Fallback)");
      expect(summary.provenance.qualityFlags).toContain("HLS_MICROSERVICE_UNREACHABLE_OR_CLOUDY");
      expect(summary.provenance.qualityFlags).toContain("ORNL_DAAC_MODIS_WEB_SERVICE");
    });

    it("serves live 30m HLS data without fallback when Python microservice responds successfully", async () => {
      const mockHlsResponse = {
        fieldId: "test-farm-hls",
        status: "AVAILABLE",
        currentYearObservation: {
          scene_id: "HLS.S30.T45RVP.2026300T044819.v2.0",
          collection: "HLSS30.v2.0",
          sensor: "MSI (Sentinel-2A)",
          date: "2026-10-27",
          cloud_cover: 5.2,
          ndvi: 0.724,
          fmask_valid: true,
          fmask_description: "Clear Land",
        },
        lastYearObservation: {
          scene_id: "HLS.S30.T45RVP.2025301T044821.v2.0",
          collection: "HLSS30.v2.0",
          sensor: "MSI (Sentinel-2A)",
          date: "2025-10-28",
          cloud_cover: 3.1,
          ndvi: 0.681,
          fmask_valid: true,
          fmask_description: "Clear Land",
        },
        ndviDelta: 0.043,
        ndviDeltaPct: 6.31,
      };

      const mockFetcher = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockHlsResponse,
      });

      const summary = await resolveHlsVegetation(
        {
          fieldId: "test-farm-hls",
          latitude: 27.6775,
          longitude: 84.4333,
          windowDays: 30,
          force: false,
        },
        {
          fetcher: mockFetcher as any,
        },
      );

      expect(summary.isFallback).toBe(false);
      expect(summary.dataSource).toBe("NASA HLS (HLSS30/HLSL30)");
      expect(summary.spatialResolution).toBe("30 m");
      expect(summary.latestNdvi).toBe(0.724);
      expect(summary.ndviDelta).toBe(0.043);
      expect(summary.currentYearObservation?.sceneId).toBe("HLS.S30.T45RVP.2026300T044819.v2.0");
      expect(summary.lastYearObservation?.sceneId).toBe("HLS.S30.T45RVP.2025301T044821.v2.0");
      expect(summary.provenance.dataset).toBe("NASA HLS (HLSS30.v2.0)");
    });
  });
});
