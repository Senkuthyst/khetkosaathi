import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L, { type Map as LMap } from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import type { LatLng } from "@/lib/data";
import { isValidPolygon, polygonAreaM2 } from "@/lib/farm-plot";
import { Btn } from "./kit";
import {
  Pencil,
  RotateCcw,
  Trash2,
  Check,
  AlertTriangle,
  LocateFixed,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlotDrawerMapProps {
  initialCenter: [number, number];
  confirmedPlot: LatLng[] | null;
  onConfirmPlot: (points: LatLng[], areaHectares: number) => void;
  onClearPlot: () => void;
  height?: number;
}

function readRing(layer: L.Polygon): LatLng[] {
  const rings = layer.getLatLngs();
  const first = rings[0];
  const ring = Array.isArray(first) ? (first as L.LatLng[]) : [];
  return ring.map((point) => [point.lat, point.lng] as LatLng);
}

/**
 * Controller to programmatically center/zoom the map on GPS or coords changes
 */
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom() < 15 ? 16 : map.getZoom());
  }, [center, map]);
  return null;
}

/**
 * Geoman active drawing component
 */
function GeomanDrawActive({
  onCreated,
  onCancel,
}: {
  onCreated: (pts: LatLng[]) => void;
  onCancel: () => void;
}) {
  const map = useMap();
  const createdRef = useRef(onCreated);
  const cancelRef = useRef(onCancel);
  createdRef.current = onCreated;
  cancelRef.current = onCancel;

  useEffect(() => {
    let settled = false;

    const onDrawEnd = () => {
      if (settled) return;
      settled = true;
      cancelRef.current();
    };

    const onCreate = (event: L.LeafletEvent) => {
      const layer = (event as L.LeafletEvent & { layer?: L.Layer }).layer;
      if (!(layer instanceof L.Polygon)) return;
      const points = readRing(layer);
      if (points.length < 3) return;
      settled = true;
      map.pm.disableDraw();
      map.removeLayer(layer);
      createdRef.current(points);
    };

    map.on("pm:create", onCreate);
    map.on("pm:drawend", onDrawEnd);
    map.pm.enableDraw("Polygon", {
      allowSelfIntersection: false,
      finishOnEnter: true,
      pathOptions: {
        color: "var(--primary)",
        fillColor: "var(--primary)",
        fillOpacity: 0.25,
        weight: 3,
      },
      templineStyle: { color: "var(--primary)", weight: 3 },
      hintlineStyle: { color: "var(--primary)", dashArray: "6 6", weight: 2 },
    });

    return () => {
      settled = true;
      map.off("pm:create", onCreate);
      map.off("pm:drawend", onDrawEnd);
      map.pm.disableDraw();
    };
  }, [map]);

  return null;
}

/**
 * Editable vertex layer for fine-tuning, moving, or deleting points
 */
function EditableBoundaryLayer({
  points,
  onChange,
}: {
  points: LatLng[];
  onChange: (points: LatLng[]) => void;
}) {
  const ref = useRef<L.Polygon | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    const sync = () => {
      const rings = layer.getLatLngs();
      const first = rings[0];
      const ring = Array.isArray(first) ? (first as L.LatLng[]) : [];
      onChangeRef.current(ring.map((p) => [p.lat, p.lng] as LatLng));
    };

    const events = [
      "pm:markerdrag",
      "pm:markerdragend",
      "pm:update",
      "pm:edit",
      "pm:vertexadded",
      "pm:vertexremoved",
    ] as const;

    events.forEach((ev) => layer.on(ev, sync));
    layer.pm.enable({
      allowSelfIntersection: false,
      removeVertexOn: "click",
      removeLayerBelowMinVertexCount: false,
      hideMiddleMarkers: false,
    });

    return () => {
      events.forEach((ev) => layer.off(ev, sync));
      layer.pm.disable();
    };
  }, []);

  return (
    <Polygon
      ref={ref}
      positions={points}
      pathOptions={{
        color: "var(--primary)",
        fillColor: "var(--primary)",
        fillOpacity: 0.25,
        weight: 3,
      }}
    />
  );
}

export default function PlotDrawerMap({
  initialCenter,
  confirmedPlot,
  onConfirmPlot,
  onClearPlot,
}: PlotDrawerMapProps) {
  const [map, setMap] = useState<LMap | null>(null);
  const [activeMode, setActiveMode] = useState<"idle" | "drawing" | "editing">(
    confirmedPlot ? "editing" : "idle",
  );
  const [currentPoints, setCurrentPoints] = useState<LatLng[]>(confirmedPlot ?? []);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync if parent updates confirmedPlot
  useEffect(() => {
    if (confirmedPlot && confirmedPlot.length >= 3) {
      setCurrentPoints(confirmedPlot);
      setActiveMode("editing");
    } else if (!confirmedPlot) {
      setCurrentPoints([]);
      setActiveMode("idle");
    }
  }, [confirmedPlot]);

  // Compute live area
  const areaM2 = currentPoints.length >= 3 ? polygonAreaM2(currentPoints) : 0;
  const areaHa = Math.round((areaM2 / 10000) * 1000) / 1000;
  const areaBigha = Math.round((areaM2 / 6772.63) * 100) / 100;
  const areaRopani = Math.round((areaM2 / 508.72) * 10) / 10;

  const handlePolygonDrawn = (pts: LatLng[]) => {
    if (!isValidPolygon(pts)) {
      setValidationError("Polygon is invalid or edges self-intersect. Please redraw.");
      setActiveMode("idle");
      return;
    }
    setValidationError(null);
    setCurrentPoints(pts);
    setActiveMode("editing");
  };

  const handlePolygonEdited = (pts: LatLng[]) => {
    if (!isValidPolygon(pts)) {
      setValidationError("Polygon is invalid or self-intersecting. Adjust vertices.");
    } else {
      setValidationError(null);
    }
    setCurrentPoints(pts);
  };

  const handleStartDraw = () => {
    setValidationError(null);
    setCurrentPoints([]);
    setActiveMode("drawing");
  };

  const handleClear = () => {
    setCurrentPoints([]);
    setActiveMode("idle");
    setValidationError(null);
    onClearPlot();
  };

  const handleConfirm = () => {
    if (currentPoints.length < 3 || !isValidPolygon(currentPoints)) {
      setValidationError("Please draw a valid non-overlapping plot with at least 3 points.");
      return;
    }
    setValidationError(null);
    onConfirmPlot(currentPoints, areaHa);
  };

  return (
    <div className="flex flex-col h-full w-full bg-card">
      {/* Top Map Control Bar */}
      <div className="p-3 bg-secondary/40 border-b border-border flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {activeMode === "idle" && currentPoints.length === 0 && (
            <Btn size="sm" onClick={handleStartDraw} className="gap-1.5 text-xs font-bold">
              <Pencil className="h-3.5 w-3.5" />
              <span>Draw Plot Boundary</span>
            </Btn>
          )}

          {activeMode === "drawing" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5 animate-pulse">
                <Pencil className="h-4 w-4" />
                Click on the map to place plot corners. Click first point to finish.
              </span>
              <Btn
                size="sm"
                variant="outline"
                onClick={() => setActiveMode("idle")}
                className="text-xs"
              >
                Cancel
              </Btn>
            </div>
          )}

          {activeMode === "editing" && currentPoints.length >= 3 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Btn
                size="sm"
                variant="outline"
                onClick={handleStartDraw}
                className="gap-1 text-xs"
                title="Discard and redraw plot"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Redraw</span>
              </Btn>
              <Btn
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="gap-1 text-xs text-destructive hover:bg-destructive/10"
                title="Remove polygon"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Selection</span>
              </Btn>
              <Btn
                size="sm"
                onClick={handleConfirm}
                className="gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Confirm Plot</span>
              </Btn>
            </div>
          )}
        </div>

        {/* Live Area Metric Pill */}
        {currentPoints.length >= 3 && (
          <div className="flex items-center gap-2 text-xs bg-card px-3 py-1.5 rounded-xl border border-primary/20 shadow-2xs">
            <span className="text-muted-foreground">Area:</span>
            <strong className="text-foreground">{areaHa} ha</strong>
            <span className="text-muted-foreground">({areaM2.toLocaleString()} m²)</span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span className="text-muted-foreground hidden sm:inline">
              {areaBigha} Bigha / {areaRopani} Ropani
            </span>
          </div>
        )}
      </div>

      {/* Validation Warning Alert */}
      {validationError && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 text-xs text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <div className="relative flex-1 min-h-[340px] w-full">
        <MapContainer
          center={initialCenter}
          zoom={16}
          maxZoom={19}
          scrollWheelZoom={true}
          className="h-full w-full"
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapCenterController center={initialCenter} />

          {activeMode === "drawing" && (
            <GeomanDrawActive
              onCreated={handlePolygonDrawn}
              onCancel={() => setActiveMode("idle")}
            />
          )}

          {activeMode === "editing" && currentPoints.length >= 3 && (
            <EditableBoundaryLayer points={currentPoints} onChange={handlePolygonEdited} />
          )}
        </MapContainer>

        {/* Vertex Editing Instruction Toast */}
        {activeMode === "editing" && currentPoints.length >= 3 && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-card/95 backdrop-blur-xs p-2.5 rounded-xl border border-border shadow-lg text-[11px] text-muted-foreground flex items-center gap-2 z-[500]">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              <strong>Edit vertices:</strong> Drag white circles to adjust parcel boundaries. Click
              a vertex marker to delete it.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
