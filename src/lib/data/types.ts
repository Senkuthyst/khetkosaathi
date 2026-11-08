// Shared types for the data layer. Real adapters (NASA POWER, AppEEARS, MQTT) must return these shapes.
export type Source = "station" | "nasa_power" | "landsat" | "modis" | "gpm" | "smap";
export type Freshness = "fresh" | "stale" | "missing";
export type CropId = "rice" | "maize" | "wheat" | "potato" | "tomato";
export type LatLng = [number, number];

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number | null; // null = missing
}

export interface Meta {
  source: Source;
  observedAt: string | null; // ISO
  scale: string; // e.g. "Point (farm)", "~50 km grid", "30 m"
}

export interface VegPoint {
  date: string;
  ndvi: number | null;
  evi: number | null;
  baseLow: number;
  baseHigh: number;
  cloud: number; // % cloud cover
  quality: "good" | "marginal" | "cloudy";
  sensor: "landsat" | "modis";
}

export interface Field {
  id: string;
  name: string;
  crop: CropId;
  plantingDate: string;
  municipality: string;
  boundary: LatLng[];
}
