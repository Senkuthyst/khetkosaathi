import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage with an in-memory map
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => {
    store[k] = v;
  },
  removeItem: (k: string) => {
    delete store[k];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (i: number) => Object.keys(store)[i] ?? null,
};

vi.stubGlobal("localStorage", localStorageMock);
vi.stubGlobal("window", { localStorage: localStorageMock });

import {
  loadDemoProfile,
  saveDemoProfile,
  resetDemoData,
} from "@/lib/demo-profile";
import {
  loadUserFarmFields,
  createFarmField,
  deleteFarmField,
  setPrimaryFarmField,
} from "@/lib/farm-fields-service";

describe("Demo Profile", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns default profile when storage is empty", () => {
    const p = loadDemoProfile();
    expect(p.name).toBe("Demo Farmer");
  });

  it("saveDemoProfile persists and loadDemoProfile restores", () => {
    saveDemoProfile({ name: "Ram Bahadur" });
    const p = loadDemoProfile();
    expect(p.name).toBe("Ram Bahadur");
  });

  it("resetDemoData clears all naip.* keys", () => {
    store["naip.demo_profile"] = JSON.stringify({ name: "Test" });
    store["naip.farm_fields"] = JSON.stringify([]);
    store["other.key"] = "preserved";
    resetDemoData();
    expect(store["naip.demo_profile"]).toBeUndefined();
    expect(store["naip.farm_fields"]).toBeUndefined();
    expect(store["other.key"]).toBe("preserved");
  });

  it("resetDemoData restores default profile after clear", () => {
    saveDemoProfile({ name: "Custom" });
    resetDemoData();
    expect(loadDemoProfile().name).toBe("Demo Farmer");
  });
});

describe("Farm Fields (localStorage)", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns empty array on first visit", async () => {
    const fields = await loadUserFarmFields("any");
    expect(fields).toEqual([]);
  });

  it("createFarmField persists to localStorage", async () => {
    const f = await createFarmField({
      fieldName: "My Test Field",
      boundary: [
        [27.7, 85.3],
        [27.71, 85.31],
        [27.72, 85.32],
      ],
      cropType: "rice",
      cropVariety: "Radha-4",
      plantingDate: "2026-07-15",
      irrigationType: "canal",
      soilType: "Clay",
      municipality: "Itahari",
      district: "Sunsari",
      province: "Koshi",
      wardNumber: "4",
      isPrimary: false,
    });
    expect(f.fieldName).toBe("My Test Field");
    expect(f.id).toBeTruthy();
    expect(f.cropType).toBe("rice");
    const fields = await loadUserFarmFields("any");
    expect(fields).toHaveLength(1);
    expect(fields[0].fieldName).toBe("My Test Field");
  });

  it("deleteFarmField removes the field", async () => {
    const f = await createFarmField({
      fieldName: "Del Field",
      boundary: [
        [27.7, 85.3],
        [27.71, 85.31],
        [27.72, 85.32],
      ],
      cropType: "maize",
      cropVariety: "Rampur",
      plantingDate: "2026-04-01",
      irrigationType: "rainfed",
      soilType: "Loam",
      municipality: "Test",
      district: "Test",
      province: "Test",
      wardNumber: "1",
      isPrimary: false,
    });
    await deleteFarmField(f.id);
    const fields = await loadUserFarmFields("any");
    expect(fields).toHaveLength(0);
  });

  it("setPrimaryFarmField sets isPrimary correctly and clears others", async () => {
    const f1 = await createFarmField({
      fieldName: "Field 1",
      boundary: [
        [27.7, 85.3],
        [27.71, 85.31],
        [27.72, 85.32],
      ],
      cropType: "wheat",
      cropVariety: "NL-297",
      plantingDate: "2026-11-01",
      irrigationType: "canal",
      soilType: "Sandy",
      municipality: "M1",
      district: "D1",
      province: "P1",
      wardNumber: "1",
      isPrimary: true,
    });
    const f2 = await createFarmField({
      fieldName: "Field 2",
      boundary: [
        [27.7, 85.3],
        [27.71, 85.31],
        [27.72, 85.32],
      ],
      cropType: "potato",
      cropVariety: "Kufri",
      plantingDate: "2026-10-01",
      irrigationType: "drip",
      soilType: "Clay",
      municipality: "M2",
      district: "D2",
      province: "P2",
      wardNumber: "2",
      isPrimary: false,
    });
    await setPrimaryFarmField(f2.id);
    const fields = await loadUserFarmFields("any");
    const prim = fields.find((f) => f.id === f2.id);
    const other = fields.find((f) => f.id === f1.id);
    expect(prim?.isPrimary).toBe(true);
    expect(other?.isPrimary).toBe(false);
  });
});
