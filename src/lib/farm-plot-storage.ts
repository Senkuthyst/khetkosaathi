import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { FarmFeature } from "./farm-plot";

function deviceToken() {
  let token = localStorage.getItem("naip.device");
  if (!token) { token = crypto.randomUUID(); localStorage.setItem("naip.device", token); }
  return token;
}
export async function loadFarmPlot(): Promise<FarmFeature | null> {
  const { data, error } = await supabase.rpc("get_farm_plot", { device_token: deviceToken() });
  if (error) throw error;
  const row = data?.[0];
  return row ? (row.boundary as unknown as FarmFeature) : null;
}
export async function saveFarmPlot(feature: FarmFeature) {
  const { data, error } = await supabase.rpc("save_farm_plot", { device_token: deviceToken(), plot_name: feature.properties.name, plot_boundary: feature as unknown as Json, plot_area: feature.properties.area_m2 });
  if (error) throw error;
  if (!data) throw new Error("Plot was not saved");
  return data;
}
