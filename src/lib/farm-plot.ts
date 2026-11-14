import type { LatLng } from "./data";
import turfArea from "@turf/area";
import kinks from "@turf/kinks";

function geometry(pts: LatLng[]) {
  const ring = pts.map(([lat, lng]) => [lng, lat]);
  const first = ring[0];
  if (first) ring.push([...first]);
  return { type: "Polygon" as const, coordinates: [ring] };
}

/** Geodesic polygon area on a sphere (m²). Input is [lat, lng] vertices, open ring. */
export function polygonAreaM2(pts: LatLng[]): number {
  if (pts.length < 3) return 0;
  return turfArea(geometry(pts));
}
/** At least 3 distinct points, non-zero area, no self-intersecting edges. */
export function isValidPolygon(pts: LatLng[]): boolean {
  if (pts.length < 3) return false;
  if (pts.some(([lat, lng]) => !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) return false;
  if (new Set(pts.map((p) => p.join(","))).size !== pts.length) return false;
  if (polygonAreaM2(pts) <= 0) return false;
  return kinks(geometry(pts)).features.length === 0;
}

export interface FarmFeature {
  type: "Feature";
  properties: { name: string; area_hectares: number; area_m2: number };
  geometry: { type: "Polygon"; coordinates: [number, number][][] };
}

/** GeoJSON uses [lng, lat]; ring is closed. Coordinates are kept exactly as drawn. */
export function toFeature(name: string, pts: LatLng[]): FarmFeature {
  if (!isValidPolygon(pts)) throw new Error("Invalid farm boundary");
  const area = polygonAreaM2(pts);
  const ring = pts.map(([lat, lng]) => [lng, lat] as [number, number]);
  const first = ring[0];
  if (first) ring.push([...first]);
  return { type: "Feature", properties: { name, area_hectares: Math.round((area / 10000) * 10000) / 10000, area_m2: Math.round(area) }, geometry: { type: "Polygon", coordinates: [ring] } };
}
export function fromFeature(f: FarmFeature): LatLng[] {
  const ring = f.geometry.coordinates[0] ?? [];
  return ring.slice(0, -1).map(([lng, lat]) => [lat, lng] as LatLng);
}
