import type { Source } from "./types";

export interface Provenance {
  dataset: string;
  productId: string;
  source: Source;
  resolution: string;
  observedAt: string | null;
  periodStart?: string;
  retrievedAt: string | null;
  quality: "good" | "marginal" | "missing" | "pilotQuality";
  mode: "live" | "cached" | "pilot";
  url: string;
}

export interface PowerDay {
  date: string;
  tMax: number | null;
  tMin: number | null;
  rain: number | null;
  humidity: number | null;
  solar: number | null;
}

export interface PowerData {
  days: PowerDay[];
  provenance: Provenance;
}