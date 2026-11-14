import { describe, expect, it } from "vitest";
import {
  buildNasaPowerUrl,
  normalizeNasaPowerResponse,
  NASA_POWER_PARAMETERS,
  NASA_POWER_VARIABLE_METADATA,
} from "@/lib/data/nasa-power-service";
import { reconstructPowerDailySets } from "@/lib/earth-observation-storage";

describe("NASA POWER Data Integration and Contracts", () => {
  it("builds valid NASA POWER Daily Point API URL with UTC time standard and AG community", () => {
    const url = buildNasaPowerUrl({
      latitude: 27.6775,
      longitude: 84.4333,
      startDate: "20261101",
      endDate: "20261107",
    });

    expect(url).toContain("https://power.larc.nasa.gov/api/temporal/daily/point?");
    expect(url).toContain("latitude=27.6775");
    expect(url).toContain("longitude=84.4333");
    expect(url).toContain("community=AG");
    expect(url).toContain("time-standard=UTC");
    expect(url).toContain("parameters=T2M%2CT2M_MAX%2CT2M_MIN%2CRH2M%2CPRECTOTCORR%2CALLSKY_SFC_SW_DWN");
  });

  it("rejects invalid coordinates and out-of-order dates", () => {
    expect(() =>
      buildNasaPowerUrl({
        latitude: 95, // invalid
        longitude: 84.4333,
        startDate: "20261101",
        endDate: "20261107",
      })
    ).toThrow(/Invalid latitude/);

    expect(() =>
      buildNasaPowerUrl({
        latitude: 27.6775,
        longitude: 190, // invalid
        startDate: "20261101",
        endDate: "20261107",
      })
    ).toThrow(/Invalid longitude/);

    expect(() =>
      buildNasaPowerUrl({
        latitude: 27.6775,
        longitude: 84.4333,
        startDate: "20261110",
        endDate: "20261101", // reversed
      })
    ).toThrow(/startDate .* cannot be after endDate/);
  });

  it("normalizes NASA POWER response and filters fill values (-999)", () => {
    const mockApiResponse = {
      header: {
        fill_value: -999,
        api: { version: "v2.0" },
      },
      geometry: { coordinates: [84.4333, 27.6775] },
      properties: {
        parameter: {
          T2M: { "20261101": 24.5, "20261102": -999 },
          T2M_MAX: { "20261101": 29.8, "20261102": 30.1 },
          T2M_MIN: { "20261101": 18.2, "20261102": 17.9 },
          RH2M: { "20261101": 76.5, "20261102": 150 }, // 150 is out of valid range (0-100)
          PRECTOTCORR: { "20261101": 0.0, "20261102": 1.4 },
          ALLSKY_SFC_SW_DWN: { "20261101": 17.5, "20261102": 16.8 },
        },
      },
    };

    const normalized = normalizeNasaPowerResponse(mockApiResponse, {
      fieldId: "pilot-chitwan-1",
      latitude: 27.6775,
      longitude: 84.4333,
    });

    expect(normalized.fieldId).toBe("pilot-chitwan-1");
    expect(normalized.observations.length).toBe(2);

    // Day 1
    const day1 = normalized.observations[0];
    expect(day1.date).toBe("2026-11-01");
    expect(day1.t2m).toBe(24.5);
    expect(day1.t2mMax).toBe(29.8);
    expect(day1.t2mMin).toBe(18.2);
    expect(day1.rh2m).toBe(76.5);
    expect(day1.prectotcorr).toBe(0.0);
    expect(day1.allskySfcSwDwn).toBe(17.5);
    expect(day1.qualityStatus).toBe("good");

    // Day 2 (Contains fill value -999 for T2M and invalid 150 for RH2M)
    const day2 = normalized.observations[1];
    expect(day2.date).toBe("2026-11-02");
    expect(day2.t2m).toBeNull();
    expect(day2.rh2m).toBeNull();
    expect(day2.prectotcorr).toBe(1.4);
    expect(day2.qualityStatus).toBe("marginal");

    // Granular typed observation records verification
    expect(normalized.records.length).toBe(12); // 2 days * 6 parameters
    const t2mDay2Record = normalized.records.find(
      (r) => r.observationStart.startsWith("2026-11-02") && r.variableName === "T2M"
    );
    expect(t2mDay2Record).toBeDefined();
    expect(t2mDay2Record?.value).toBeNull();
    expect(t2mDay2Record?.qualityStatus).toBe("missing");
    expect(t2mDay2Record?.qualityFlags).toContain("FILL_VALUE_OR_OUT_OF_RANGE");
    expect(t2mDay2Record?.spatialResolution).toBe("0.5° × 0.625°");

    // Provenance validation
    expect(normalized.provenance.dataset).toContain("NASA POWER Daily");
    expect(normalized.provenance.quality).toBe("marginal");
    expect(normalized.provenance.spatialExtractionMethod).toBe("point_nearest_grid");
  });

  it("reconstructs daily sets from stored observation records", () => {
    const records = [
      {
        fieldId: "pilot-chitwan-1",
        sourceName: "nasa_power" as const,
        productId: "POWER_DAILY_AG",
        productVersion: "v1",
        variableName: "T2M_MAX",
        value: 28.5,
        unit: "°C",
        observationStart: "2026-11-01T00:00:00Z",
        observationEnd: "2026-11-01T23:59:59Z",
        retrievalTimestamp: new Date().toISOString(),
        spatialResolution: "0.5° × 0.625°",
        temporalResolution: "daily" as const,
        spatialExtractionMethod: "point_nearest_grid" as const,
        qualityStatus: "good" as const,
        qualityFlags: ["VALID"],
        processingVersion: "v1",
        provenanceMetadata: {},
      },
      {
        fieldId: "pilot-chitwan-1",
        sourceName: "nasa_power" as const,
        productId: "POWER_DAILY_AG",
        productVersion: "v1",
        variableName: "PRECTOTCORR",
        value: 4.2,
        unit: "mm/day",
        observationStart: "2026-11-01T00:00:00Z",
        observationEnd: "2026-11-01T23:59:59Z",
        retrievalTimestamp: new Date().toISOString(),
        spatialResolution: "0.5° × 0.625°",
        temporalResolution: "daily" as const,
        spatialExtractionMethod: "point_nearest_grid" as const,
        qualityStatus: "good" as const,
        qualityFlags: ["VALID"],
        processingVersion: "v1",
        provenanceMetadata: {},
      },
    ];

    const reconstructed = reconstructPowerDailySets(records);
    expect(reconstructed.length).toBe(1);
    expect(reconstructed[0].date).toBe("2026-11-01");
    expect(reconstructed[0].t2mMax).toBe(28.5);
    expect(reconstructed[0].prectotcorr).toBe(4.2);
    expect(reconstructed[0].qualityStatus).toBe("good");
  });

  it("verifies all agricultural parameters exist in catalog with units", () => {
    expect(NASA_POWER_PARAMETERS).toEqual([
      "T2M",
      "T2M_MAX",
      "T2M_MIN",
      "RH2M",
      "PRECTOTCORR",
      "ALLSKY_SFC_SW_DWN",
    ]);

    expect(NASA_POWER_VARIABLE_METADATA.T2M.unit).toBe("°C");
    expect(NASA_POWER_VARIABLE_METADATA.RH2M.unit).toBe("%");
    expect(NASA_POWER_VARIABLE_METADATA.PRECTOTCORR.unit).toBe("mm/day");
    expect(NASA_POWER_VARIABLE_METADATA.ALLSKY_SFC_SW_DWN.unit).toBe("MJ/m²/day");
  });
});
