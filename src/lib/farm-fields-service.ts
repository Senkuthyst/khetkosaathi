// Farm Fields Management — localStorage-backed guest storage
// Replaces the previous Supabase-authenticated implementation.
// All five public function signatures are preserved so the rest of the app
// (store.tsx, my-farm.tsx, onboarding.tsx, farm-check.tsx) requires zero call-site changes.
// Supabase client, types, and migrations are intentionally untouched.

import type { Tables, TablesInsert, Json } from "@/integrations/supabase/types";
import type { LatLng } from "./data";
import { fromFeature, toFeature, isFarmFeature, type FarmFeature } from "./farm-plot";
import { DEMO_USER_ID, FARM_FIELDS_KEY } from "./demo-profile";

// Keep FarmFieldRow type alias for any code that still references it.
export type FarmFieldRow = Tables<"farm_fields">;

export interface FarmField {
  id: string;
  userId: string;
  fieldName: string;
  province?: string;
  district?: string;
  municipality?: string;
  wardNumber?: string;
  latitude: number;
  longitude: number;
  boundary: LatLng[];
  boundaryFeature: FarmFeature;
  areaM2: number;
  areaUnit: string;
  cropType: string;
  cropVariety?: string;
  plantingDate: string;
  irrigationType: string;
  soilType?: string;
  elevation?: number;
  isPrimary: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Internal localStorage helpers
// ---------------------------------------------------------------------------

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): FarmField[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(FARM_FIELDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FarmField[];
  } catch {
    return [];
  }
}

function writeAll(fields: FarmField[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(FARM_FIELDS_KEY, JSON.stringify(fields));
  } catch {
    /* quota protection */
  }
}

// ---------------------------------------------------------------------------
// rowToFarmField — kept for type compatibility; not used by localStorage path
// ---------------------------------------------------------------------------
export function rowToFarmField(row: FarmFieldRow): FarmField {
  const boundaryJson = row.boundary;
  let pts: LatLng[] = [];
  let boundaryFeature: FarmFeature;

  if (isFarmFeature(boundaryJson)) {
    boundaryFeature = boundaryJson;
    pts = fromFeature(boundaryJson);
  } else {
    boundaryFeature = toFeature(row.field_name, [[row.latitude, row.longitude]]);
  }

  return {
    id: row.id,
    userId: row.user_id,
    fieldName: row.field_name,
    province: row.province ?? undefined,
    district: row.district ?? undefined,
    municipality: row.municipality ?? undefined,
    wardNumber: row.ward_number ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    boundary: pts,
    boundaryFeature,
    areaM2: row.area_m2,
    areaUnit: row.area_unit,
    cropType: row.crop_type,
    cropVariety: row.crop_variety ?? undefined,
    plantingDate: row.planting_date,
    irrigationType: row.irrigation_type,
    soilType: row.soil_type ?? undefined,
    elevation: row.elevation ?? undefined,
    isPrimary: row.is_primary,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Public API — same signatures as before
// ---------------------------------------------------------------------------

/**
 * Load all registered agricultural plots for the demo account from localStorage.
 */
export async function loadUserFarmFields(): Promise<FarmField[]> {
  const fields = readAll();
  // Return primary first, then by creation date descending — mirrors the old Supabase ORDER BY
  return [...fields].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

/**
 * Create a new farm field and persist it to localStorage.
 */
export async function createFarmField(params: {
  fieldName: string;
  boundary: LatLng[];
  cropType: string;
  cropVariety?: string;
  plantingDate: string;
  irrigationType?: string;
  soilType?: string;
  municipality?: string;
  district?: string;
  province?: string;
  wardNumber?: string;
  isPrimary?: boolean;
}): Promise<FarmField> {
  const feature = toFeature(params.fieldName, params.boundary);
  const latSum = params.boundary.reduce((s, p) => s + p[0], 0);
  const lonSum = params.boundary.reduce((s, p) => s + p[1], 0);
  const centerLat = Math.round((latSum / params.boundary.length) * 10000) / 10000;
  const centerLon = Math.round((lonSum / params.boundary.length) * 10000) / 10000;

  const newField: FarmField = {
    id: crypto.randomUUID(),
    userId: DEMO_USER_ID,
    fieldName: params.fieldName.trim() || "My Farm Plot",
    province: params.province,
    district: params.district,
    municipality: params.municipality,
    wardNumber: params.wardNumber,
    latitude: centerLat,
    longitude: centerLon,
    boundary: params.boundary,
    boundaryFeature: feature,
    areaM2: feature.properties.area_m2,
    areaUnit: "m2",
    cropType: params.cropType,
    cropVariety: params.cropVariety,
    plantingDate: params.plantingDate,
    irrigationType: params.irrigationType ?? "rainfed",
    soilType: params.soilType,
    isPrimary: params.isPrimary ?? false,
    createdAt: new Date().toISOString(),
  };

  const existing = readAll();

  // If this is marked primary, unset others first
  let updated = params.isPrimary ? existing.map((f) => ({ ...f, isPrimary: false })) : existing;

  updated = [newField, ...updated];
  writeAll(updated);
  return newField;
}

/**
 * Update an existing field. Accepts a partial TablesInsert for column-name compatibility.
 */
export async function updateFarmField(
  fieldId: string,
  updates: Partial<TablesInsert<"farm_fields">>,
): Promise<FarmField> {
  const fields = readAll();
  const idx = fields.findIndex((f) => f.id === fieldId);
  if (idx === -1) throw new Error(`Farm field ${fieldId} not found in local storage.`);

  // Map snake_case column names → camelCase FarmField properties
  const f = fields[idx];
  const merged: FarmField = {
    ...f,
    fieldName: (updates.field_name as string | undefined) ?? f.fieldName,
    cropType: (updates.crop_type as string | undefined) ?? f.cropType,
    cropVariety: (updates.crop_variety as string | undefined) ?? f.cropVariety,
    plantingDate: (updates.planting_date as string | undefined) ?? f.plantingDate,
    irrigationType: (updates.irrigation_type as string | undefined) ?? f.irrigationType,
    soilType: (updates.soil_type as string | undefined) ?? f.soilType,
    isPrimary: updates.is_primary !== undefined ? Boolean(updates.is_primary) : f.isPrimary,
    province: (updates.province as string | undefined) ?? f.province,
    district: (updates.district as string | undefined) ?? f.district,
    municipality: (updates.municipality as string | undefined) ?? f.municipality,
    wardNumber: (updates.ward_number as string | undefined) ?? f.wardNumber,
  };

  fields[idx] = merged;
  writeAll(fields);
  return merged;
}

/**
 * Delete a farm field from localStorage.
 */
export async function deleteFarmField(fieldId: string): Promise<void> {
  const fields = readAll().filter((f) => f.id !== fieldId);
  writeAll(fields);
}

/**
 * Set a field as primary for the demo account.
 * The userId param is kept for signature compatibility but ignored.
 */
export async function setPrimaryFarmField(fieldId: string, _userId?: string): Promise<void> {
  const fields = readAll().map((f) => ({ ...f, isPrimary: f.id === fieldId }));
  writeAll(fields);
}
