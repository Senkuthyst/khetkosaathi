import { describe, expect, it } from "vitest";
import {
  isValidPolygon,
  polygonAreaM2,
  toFeature,
  fromFeature,
  isFarmFeature,
} from "@/lib/farm-plot";
import type { LatLng } from "@/lib/data";

// ~100 m x ~100 m square near the equator
const d = 100 / 111319.49;
const square: LatLng[] = [
  [0, 0],
  [0, d],
  [d, d],
  [d, 0],
];

describe("farm plot geometry", () => {
  it("computes area of a 100 m square as ~1 ha", () => {
    expect(polygonAreaM2(square)).toBeGreaterThan(9900);
    expect(polygonAreaM2(square)).toBeLessThan(10100);
  });
  it("rejects fewer than 3 points and crossing edges", () => {
    expect(isValidPolygon(square.slice(0, 2))).toBe(false);
    expect(
      isValidPolygon([
        [0, 0],
        [d, d],
        [0, d],
        [d, 0],
      ]),
    ).toBe(false);
    expect(isValidPolygon(square)).toBe(true);
  });
  it("writes GeoJSON as closed [lng, lat] ring and preserves coordinates", () => {
    const pts: LatLng[] = [
      [27.6775, 84.4333],
      [27.678, 84.434],
      [27.677, 84.435],
    ];
    const f = toFeature("My Farm", pts);
    const ring = f.geometry.coordinates[0] ?? [];
    expect(ring[0]).toEqual([84.4333, 27.6775]);
    expect(ring[ring.length - 1]).toEqual(ring[0]);
    expect(fromFeature(f)).toEqual(pts);
  });
  it("rejects repeated corners, invalid coordinates and touching nonadjacent edges", () => {
    expect(
      isValidPolygon([
        [0, 0],
        [0, 2],
        [2, 2],
        [0, 1],
        [2, 0],
      ]),
    ).toBe(false);
    expect(
      isValidPolygon([
        [91, 0],
        [0, 1],
        [0, 0],
      ]),
    ).toBe(false);
    expect(
      isValidPolygon([
        [0, 0],
        [0, 1],
        [NaN, 1],
      ]),
    ).toBe(false);
    expect(isValidPolygon([...square, square[0] ?? [0, 0]])).toBe(false);
    expect(() =>
      toFeature("Incomplete", [
        [0, 0],
        [0, 1],
      ]),
    ).toThrow();
  });
  it("accepts a valid farm far away from the farmer's current location", () => {
    expect(
      isValidPolygon([
        [51, -1],
        [51, -0.999],
        [51.001, -0.999],
        [51.001, -1],
      ]),
    ).toBe(true);
  });
  it("accepts only the closed, property-complete GeoJSON features this app writes", () => {
    const feature = toFeature("My Farm", [
      [27.6775, 84.4333],
      [27.678, 84.434],
      [27.677, 84.435],
    ]);
    expect(isFarmFeature(feature)).toBe(true);
    expect(
      isFarmFeature({
        ...feature,
        geometry: { type: "Polygon", coordinates: [[[84.4333, 27.6775]]] },
      }),
    ).toBe(false);
    expect(isFarmFeature({ ...feature, properties: { ...feature.properties, area_m2: 0 } })).toBe(
      false,
    );
    expect(isFarmFeature({ ...feature, properties: { ...feature.properties, name: "" } })).toBe(
      false,
    );
    expect(isFarmFeature(null)).toBe(false);
  });
});
