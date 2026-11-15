import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  useMapEvents,
  useMap,
  Tooltip,
} from "react-leaflet";
import { useEffect } from "react";
import type { LatLng } from "@/lib/data";

export interface MapPoly {
  positions: LatLng[];
  color: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  label?: string;
}

export interface MapPointMarker {
  position: LatLng;
  color: string;
  fillColor?: string;
  radius?: number;
  label?: string;
  tooltipContent?: string;
}

export interface MapTileOverlay {
  url: string;
  attribution?: string;
  opacity?: number;
  maxZoom?: number;
}

function Clicker({ onAdd }: { onAdd: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onAdd([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function MapViewController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center[0], center[1], zoom, map]);
  return null;
}

export default function FieldMap({
  center,
  zoom = 16,
  polygons = [],
  markers = [],
  tileOverlay,
  drawing,
  onAdd,
  height = 280,
}: {
  center: LatLng;
  zoom?: number;
  polygons?: MapPoly[];
  markers?: MapPointMarker[];
  tileOverlay?: MapTileOverlay | null;
  drawing?: LatLng[];
  onAdd?: (p: LatLng) => void;
  height?: number;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%" }}
      className="z-0 rounded-xl"
      scrollWheelZoom={false}
    >
      <MapViewController center={center} zoom={zoom} />

      {/* Base OpenStreetMap layer */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors &middot; NASA Earth Data"
      />

      {/* Dynamic Satellite Tile Overlay (NASA GIBS / WMS Tile Stream) */}
      {tileOverlay && (
        <TileLayer
          key={tileOverlay.url}
          url={tileOverlay.url}
          attribution={tileOverlay.attribution ?? "NASA GIBS / EOSDIS"}
          opacity={tileOverlay.opacity ?? 0.65}
          maxZoom={tileOverlay.maxZoom ?? 9}
        />
      )}

      {/* Render Field Polygons and Regional Bounds */}
      {polygons.map((p, i) => (
        <Polygon
          key={i}
          positions={p.positions}
          pathOptions={{
            color: p.color,
            fillColor: p.fillColor ?? p.color,
            fillOpacity: p.fillOpacity ?? 0.45,
            weight: p.weight ?? 3,
          }}
        >
          {p.label && (
            <Tooltip permanent direction="center">
              {p.label}
            </Tooltip>
          )}
        </Polygon>
      ))}

      {/* Render Point Markers (FIRMS Hotspots, Observation Stations) */}
      {markers.map((m, i) => (
        <CircleMarker
          key={i}
          center={m.position}
          radius={m.radius ?? 6}
          pathOptions={{
            color: m.color,
            fillColor: m.fillColor ?? m.color,
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          {m.label && <Tooltip direction="top">{m.label}</Tooltip>}
        </CircleMarker>
      ))}

      {/* Drawing Mode for Farm Boundaries */}
      {drawing && drawing.length > 0 && (
        <>
          <Polyline
            positions={drawing.length > 2 && drawing[0] ? [...drawing, drawing[0]] : drawing}
            pathOptions={{ color: "var(--primary)", dashArray: "6 6", weight: 3 }}
          />
          {drawing.map((p, i) => (
            <CircleMarker
              key={i}
              center={p}
              radius={7}
              pathOptions={{ color: "var(--primary)", fillOpacity: 1 }}
            />
          ))}
        </>
      )}

      {onAdd && <Clicker onAdd={onAdd} />}
    </MapContainer>
  );
}
