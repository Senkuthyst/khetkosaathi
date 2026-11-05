import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, useMapEvents, Tooltip } from "react-leaflet";
import type { LatLng } from "@/lib/data";

export interface MapPoly { positions: LatLng[]; color: string; label?: string }

function Clicker({ onAdd }: { onAdd: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => onAdd([e.latlng.lat, e.latlng.lng]) });
  return null;
}

export default function FieldMap({ center, zoom = 16, polygons = [], drawing, onAdd, height = 280 }: {
  center: LatLng; zoom?: number; polygons?: MapPoly[]; drawing?: LatLng[]; onAdd?: (p: LatLng) => void; height?: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }} className="z-0 rounded-xl" scrollWheelZoom={false}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      {polygons.map((p, i) => (
        <Polygon key={i} positions={p.positions} pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.45, weight: 3 }}>
          {p.label && <Tooltip permanent direction="center">{p.label}</Tooltip>}
        </Polygon>
      ))}
      {drawing && drawing.length > 0 && (
        <>
          <Polyline positions={drawing.length > 2 ? [...drawing, drawing[0]] : drawing} pathOptions={{ color: "#2f6b3a", dashArray: "6 6", weight: 3 }} />
          {drawing.map((p, i) => <CircleMarker key={i} center={p} radius={7} pathOptions={{ color: "#2f6b3a", fillOpacity: 1 }} />)}
        </>
      )}
      {onAdd && <Clicker onAdd={onAdd} />}
    </MapContainer>
  );
}
