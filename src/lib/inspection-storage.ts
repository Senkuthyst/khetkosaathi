import { supabase } from "@/integrations/supabase/client";
import type { Inspection } from "./store";

function deviceToken() {
  let token = localStorage.getItem("naip.device");
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("naip.device", token);
  }
  return token;
}
export async function loadInspections(fieldId: string): Promise<Inspection[]> {
  const { data, error } = await supabase.rpc("list_inspections", {
    device_token: deviceToken(),
    target_field: fieldId,
  });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    date: row.date,
    note: row.note,
    ...(row.photo ? { photo: row.photo } : {}),
    outcome: row.outcome as Inspection["outcome"],
  }));
}
export async function saveInspection(fieldId: string, entry: Inspection) {
  const { data, error } = await supabase.rpc("save_inspection", {
    device_token: deviceToken(),
    target_field: fieldId,
    entry_note: entry.note.trim(),
    entry_photo: entry.photo ?? "",
    entry_outcome: entry.outcome,
  });
  if (error) throw error;
  if (!data) throw new Error("Inspection was not saved");
  return data;
}
export async function compressPhoto(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Invalid photo");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot read photo");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const data = canvas.toDataURL("image/jpeg", 0.65);
  if (data.length > 700000) throw new Error("Photo too large");
  return data;
}
