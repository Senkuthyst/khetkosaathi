// Storage and synchronization client for Earth Observation data.
// Communicates with Supabase using capability RPCs (get_earth_observations, save_earth_observations)
// and handles fallback to local cache / pilot data when offline or during initial sync.

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type {
  EarthObservationRecord,
  EarthProvenance,
  NasaPowerDailySet,
  NasaPowerObservationResult,
} from "./data/earth-observation-contract";
import { createId } from "./id";

function deviceToken(): string {
  if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000000";
  let token = localStorage.getItem("naip.device");
  if (!token) {
    token = createId();
    localStorage.setItem("naip.device", token);
  }
  return token;
}

/**
 * Load persisted Earth observations for a field from Cloud storage via RPC.
 */
export async function loadEarthObservations(
  fieldId: string,
  sourceName?: string,
): Promise<EarthObservationRecord[]> {
  try {
    const { data, error } = await supabase.rpc("get_earth_observations", {
      device_token: deviceToken(),
      target_field: fieldId,
      target_source: sourceName ?? null,
    });

    if (error) {
      console.warn("Could not fetch remote earth observations:", error.message);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      fieldId: row.field_id,
      sourceName: row.source_name as EarthObservationRecord["sourceName"],
      productId: row.product_id,
      productVersion: "v1",
      variableName: row.variable_name,
      value: row.value,
      unit: row.unit,
      observationStart: row.observation_start,
      observationEnd: row.observation_end,
      retrievalTimestamp: (row.provenance_metadata as any)?.retrievedAt ?? new Date().toISOString(),
      spatialResolution: row.spatial_resolution,
      temporalResolution: "daily",
      spatialExtractionMethod: "point_nearest_grid",
      qualityStatus: row.quality_status as EarthObservationRecord["qualityStatus"],
      qualityFlags: [],
      processingVersion: "v1",
      provenanceMetadata: (row.provenance_metadata as Record<string, unknown>) ?? {},
    }));
  } catch (err) {
    console.warn("loadEarthObservations error:", err);
    return [];
  }
}

/**
 * Save Earth observations to Cloud storage via RPC (upsert/idempotent).
 */
export async function saveEarthObservations(
  fieldId: string,
  records: EarthObservationRecord[],
): Promise<number> {
  if (!records.length) return 0;

  try {
    const { data, error } = await supabase.rpc("save_earth_observations", {
      device_token: deviceToken(),
      target_field: fieldId,
      obs_records: records as unknown as Json,
    });

    if (error) {
      console.warn("Could not save remote earth observations:", error.message);
      return 0;
    }

    return data ?? 0;
  } catch (err) {
    console.warn("saveEarthObservations error:", err);
    return 0;
  }
}

/**
 * Converts granular observation records back into daily parameter sets.
 */
export function reconstructPowerDailySets(records: EarthObservationRecord[]): NasaPowerDailySet[] {
  const byDate = new Map<string, Partial<NasaPowerDailySet>>();

  for (const r of records) {
    const date = r.observationStart.slice(0, 10);
    const curr = byDate.get(date) ?? { date, qualityStatus: "good" };

    switch (r.variableName) {
      case "T2M":
        curr.t2m = r.value;
        break;
      case "T2M_MAX":
        curr.t2mMax = r.value;
        break;
      case "T2M_MIN":
        curr.t2mMin = r.value;
        break;
      case "RH2M":
        curr.rh2m = r.value;
        break;
      case "PRECTOTCORR":
        curr.prectotcorr = r.value;
        break;
      case "ALLSKY_SFC_SW_DWN":
        curr.allskySfcSwDwn = r.value;
        break;
    }

    if (r.qualityStatus === "missing") curr.qualityStatus = "missing";
    else if (r.qualityStatus === "marginal" && curr.qualityStatus !== "missing")
      curr.qualityStatus = "marginal";

    byDate.set(date, curr);
  }

  return Array.from(byDate.values())
    .filter((d): d is NasaPowerDailySet => Boolean(d.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}
