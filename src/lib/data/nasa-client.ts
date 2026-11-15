// Client-safe invocation helpers for NASA Server Functions
// Facilitates fetching real NASA POWER, FIRMS, GPM, SMAP, MODIS, and HLS observations
// without exposing backend credentials or importing server-only packages in browser.

import { fetchFirmsHotspotsServerFn } from "@/lib/server-functions/firms.server";
import { fetchGpmPrecipitationServerFn } from "@/lib/server-functions/gpm.server";
import { fetchModisVegetationServerFn } from "@/lib/server-functions/modis.server";
import { fetchSmapSoilMoistureServerFn, type SmapObservationSummary } from "@/lib/server-functions/smap.server";
import { fetchHlsVegetationServerFn } from "@/lib/server-functions/hls.server";
import type { FirmsSummary } from "./firms-service";
import type { GpmPrecipitationSummary } from "./gpm-service";
import type { ModisFieldSummary } from "./modis-service";
import type { HlsVegetationSummary } from "./hls-service";

export type { SmapObservationSummary, HlsVegetationSummary };

export async function fetchLiveFirmsHotspots(options: {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  dayRange?: number;
}): Promise<FirmsSummary | null> {
  try {
    const res = await (fetchFirmsHotspotsServerFn as any)({
      data: {
        latitude: options.latitude,
        longitude: options.longitude,
        radiusKm: options.radiusKm ?? 50,
        dayRange: options.dayRange ?? 3,
        source: "VIIRS_SNPP_NRT",
      },
    });
    return res;
  } catch (err) {
    console.warn("fetchLiveFirmsHotspots error:", (err as Error).message);
    return null;
  }
}

export async function fetchLiveGpmPrecipitation(options: {
  fieldId: string;
  latitude: number;
  longitude: number;
  days?: number;
}): Promise<GpmPrecipitationSummary | null> {
  try {
    const res = await (fetchGpmPrecipitationServerFn as any)({
      data: {
        fieldId: options.fieldId,
        latitude: options.latitude,
        longitude: options.longitude,
        days: options.days ?? 7,
        runType: "Late",
        force: false,
      },
    });
    return res;
  } catch (err) {
    console.warn("fetchLiveGpmPrecipitation error:", (err as Error).message);
    return null;
  }
}

export async function fetchLiveModisVegetation(options: {
  fieldId: string;
  latitude: number;
  longitude: number;
  fieldAreaM2?: number;
}): Promise<ModisFieldSummary | null> {
  try {
    const res = await (fetchModisVegetationServerFn as any)({
      data: {
        fieldId: options.fieldId,
        latitude: options.latitude,
        longitude: options.longitude,
        fieldAreaM2: options.fieldAreaM2 ?? 4046,
        force: false,
      },
    });
    return res;
  } catch (err) {
    console.warn("fetchLiveModisVegetation error:", (err as Error).message);
    return null;
  }
}

export async function fetchLiveHlsVegetation(options: {
  fieldId: string;
  latitude: number;
  longitude: number;
  windowDays?: number;
}): Promise<HlsVegetationSummary | null> {
  try {
    const res = await (fetchHlsVegetationServerFn as any)({
      data: {
        fieldId: options.fieldId,
        latitude: options.latitude,
        longitude: options.longitude,
        windowDays: options.windowDays ?? 30,
        force: false,
      },
    });
    return res;
  } catch (err) {
    console.warn("fetchLiveHlsVegetation error:", (err as Error).message);
    return null;
  }
}

export async function fetchLiveSmapSoilMoisture(options: {
  fieldId: string;
  latitude: number;
  longitude: number;
}): Promise<SmapObservationSummary | null> {
  try {
    const res = await (fetchSmapSoilMoistureServerFn as any)({
      data: {
        fieldId: options.fieldId,
        latitude: options.latitude,
        longitude: options.longitude,
        force: false,
      },
    });
    return res;
  } catch (err) {
    console.warn("fetchLiveSmapSoilMoisture error:", (err as Error).message);
    return null;
  }
}
