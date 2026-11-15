// Farm Fields Management Client
// Handles multi-plot persistence, retrieval, updating and primary-field selection
// Directly bound to Supabase auth with full RLS protection.

import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, Json } from "@/integrations/supabase/types";
import type { LatLng } from "./data";
import { fromFeature, toFeature, isFarmFeature, type FarmFeature } from "./farm-plot";

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

export function rowToFarmField(row: FarmFieldRow): FarmField {
  const boundaryJson = row.boundary;
  let pts: LatLng[] = [];
  let boundaryFeature: FarmFeature;

  if (isFarmFeature(boundaryJson)) {
    boundaryFeature = boundaryJson;
    pts = fromFeature(boundaryJson);
  } else {
    // Fallback if legacy or raw GeoJSON feature
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

/**
 * Load all registered agricultural plots for the currently authenticated user.
 */
export async function loadUserFarmFields(): Promise<FarmField[]> {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    // Return empty array for unauthenticated / anonymous state (no Chitwan default!)
    return [];
  }

  const { data, error } = await supabase
    .from("farm_fields")
    .select("*")
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Could not load user farm fields:", error.message);
    return [];
  }

  return (data ?? []).map(rowToFarmField);
}

/**
 * Create a new farm field for the authenticated user.
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
  const { data: session } = await supabase.auth.getSession();
  const user = session?.session?.user;
  if (!user) throw new Error("Authentication required to register farm field.");

  const feature = toFeature(params.fieldName, params.boundary);
  // Calculate centroid
  const latSum = params.boundary.reduce((sum, p) => sum + p[0], 0);
  const lonSum = params.boundary.reduce((sum, p) => sum + p[1], 0);
  const centerLat = latSum / params.boundary.length;
  const centerLon = lonSum / params.boundary.length;

  const insertPayload: TablesInsert<"farm_fields"> = {
    user_id: user.id,
    field_name: params.fieldName.trim(),
    latitude: Math.round(centerLat * 10000) / 10000,
    longitude: Math.round(centerLon * 10000) / 10000,
    boundary: feature as unknown as Json,
    area_m2: feature.properties.area_m2,
    area_unit: "m2",
    crop_type: params.cropType,
    crop_variety: params.cropVariety ?? null,
    planting_date: params.plantingDate,
    irrigation_type: params.irrigationType ?? "rainfed",
    soil_type: params.soilType ?? null,
    municipality: params.municipality ?? null,
    district: params.district ?? null,
    province: params.province ?? null,
    ward_number: params.wardNumber ?? null,
    is_primary: params.isPrimary ?? false,
  };

  const { data, error } = await supabase
    .from("farm_fields")
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache")) {
      throw new Error(
        "The 'farm_fields' table is not yet created in your Lovable Cloud database. Please run the SQL migration (0004_auth_and_farm_fields.sql) in your Lovable Cloud SQL Editor.",
      );
    }
    throw error;
  }
  return rowToFarmField(data);
}

/**
 * Update an existing field.
 */
export async function updateFarmField(
  fieldId: string,
  updates: Partial<TablesInsert<"farm_fields">>,
): Promise<FarmField> {
  const { data, error } = await supabase
    .from("farm_fields")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", fieldId)
    .select()
    .single();

  if (error) throw error;
  return rowToFarmField(data);
}

/**
 * Delete a farm field.
 */
export async function deleteFarmField(fieldId: string): Promise<void> {
  const { error } = await supabase.from("farm_fields").delete().eq("id", fieldId);
  if (error) throw error;
}

/**
 * Set a field as primary for the user.
 */
export async function setPrimaryFarmField(fieldId: string, userId: string): Promise<void> {
  // First unset other primaries
  await supabase.from("farm_fields").update({ is_primary: false }).eq("user_id", userId);
  // Set target primary
  await supabase.from("farm_fields").update({ is_primary: true }).eq("id", fieldId);
}
