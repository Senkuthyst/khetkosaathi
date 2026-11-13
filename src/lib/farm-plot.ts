import type { LatLng } from "./data";

const R = 6378137; // WGS84 equatorial radius (m)

/** Geodesic polygon area on a sphere (m²). Input is [lat, lng] vertices, open ring. */
export function polygonAreaM2(pts: LatLng[]): number {
  if (pts.length < 3) return 0;
  let sum = 0;
  const rad = Math.PI / 180;
  for (let i = 0; i < pts.length; i++) {
    const [lat1, lng1] = pts[i]!;
    const [lat2, lng2] = pts[(i + 1) % pts.length]!;
    sum += (lng2 - lng1) * rad * (2 + Math.sin(lat1 * rad) + Math.sin(lat2 * rad));
  }
  return Math.abs((sum * R * R) / 2);
}

function cross(a: LatLng, b: LatLng, c: LatLng) {
  return (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]);
}
function segmentsCross(a: LatLng, b: LatLng, c: LatLng, d: LatLng) {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return d1 * d2 < 0 && d3 * d4 < 0;
}
/** At least 3 distinct points, non-zero area, no self-intersecting edges. */
export function isValidPolygon(pts: LatLng[]): boolean {
  if (pts.length < 3) return false;
  if (new Set(pts.map((p) => p.join(","))).size !== pts.length) return false;
  if (polygonAreaM2(pts) <= 0) return false;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || (i === 0 && j === n - 1)) continue;
      if (segmentsCross(pts[i]!, pts[(i + 1) % n]!, pts[j]!, pts[(j + 1) % n]!)) return false;
    }
  }
  return true;
}

export interface FarmFeature {
  type: "Feature";
  properties: { name: string; area_hectares: number; area_m2: number };
  geometry: { type: "Polygon"; coordinates: [number, number][][] };
}

/** GeoJSON uses [lng, lat]; ring is closed. Coordinates are kept exactly as drawn. */
export function toFeature(name: string, pts: LatLng[]): FarmFeature {
  const area = polygonAreaM2(pts);
  const ring = pts.map(([lat, lng]) => [lng, lat] as [number, number]);
  ring.push([...ring[0]!] as [number, number]);
  return { type: "Feature", properties: { name, area_hectares: Math.round((area / 10000) * 10000) / 10000, area_m2: Math.round(area) }, geometry: { type: "Polygon", coordinates: [ring] } };
}
export function fromFeature(f: FarmFeature): LatLng[] {
  const ring = f.geometry.coordinates[0] ?? [];
  return ring.slice(0, -1).map(([lng, lat]) => [lat, lng] as LatLng);
}
