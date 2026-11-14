import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { MapContainer, TileLayer, Polygon, Circle, CircleMarker, useMap } from "react-leaflet";
import L, { type Map as LMap } from "leaflet";
import { useBlocker } from "@tanstack/react-router";
import "@geoman-io/leaflet-geoman-free";
import { Btn } from "./kit";
import {
  AlertTriangle,
  Check,
  LocateFixed,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";
import type { LatLng } from "@/lib/data";
import { fromFeature, isFarmFeature, isValidPolygon, polygonAreaM2, toFeature } from "@/lib/farm-plot";
import { loadFarmPlot, saveFarmPlot } from "@/lib/farm-plot-storage";

const NEPAL_CENTER: LatLng = [28.3949, 84.124];
const DEFAULT_NAME = "My Farm";
const NOMINATIM_MIN_INTERVAL_MS = 1100;

type Mode = "view" | "draw" | "edit" | "confirm";
type Loc = { lat: number; lng: number; acc: number };
type Place = { name: string; lat: number; lng: number; bounds: [[number, number], [number, number]] | null };
type Notice = { text: string; kind: "info" | "error" | "ok" };

/** Larger uncertainty should be shown at a wider map zoom, not a false street-level zoom. */
function zoomForAccuracy(accuracy: number) {
  if (!Number.isFinite(accuracy) || accuracy <= 0) return 16;
  if (accuracy <= 20) return 17;
  if (accuracy <= 50) return 16;
  if (accuracy <= 100) return 15;
  if (accuracy <= 250) return 14;
  if (accuracy <= 1000) return 12;
  return 10;
}

function samePoints(a: LatLng[], b: LatLng[]) {
  return a.length === b.length && a.every((point, index) => point[0] === b[index]?.[0] && point[1] === b[index]?.[1]);
}

function readRing(layer: L.Polygon): LatLng[] {
  const rings = layer.getLatLngs();
  const first = rings[0];
  const ring = Array.isArray(first) ? (first as L.LatLng[]) : [];
  return ring.map((point) => [point.lat, point.lng] as LatLng);
}

/**
 * Geoman owns polygon creation. The temporary layer is removed as soon as it is
 * finished so React remains the single source of truth for the saved boundary.
 */
function GeomanDraw({ onCreated, onCancel }: { onCreated: (pts: LatLng[]) => void; onCancel: () => void }) {
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
      pathOptions: { color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.2, weight: 3 },
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
 * Geoman vertex editing. Events are read through a ref so the layer is not
 * re-enabled on every React render (which would interrupt an active drag).
 */
function EditableBoundary({ pts, onChange }: { pts: LatLng[]; onChange: (pts: LatLng[]) => void }) {
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
      onChangeRef.current(ring.map((point) => [point.lat, point.lng] as LatLng));
    };

    const events = ["pm:markerdrag", "pm:markerdragend", "pm:update", "pm:edit", "pm:vertexadded", "pm:vertexremoved"] as const;
    events.forEach((event) => layer.on(event, sync));
    layer.pm.enable({
      allowSelfIntersection: false,
      removeVertexOn: "click",
      removeLayerBelowMinVertexCount: false,
      hideMiddleMarkers: false,
    });

    return () => {
      events.forEach((event) => layer.off(event, sync));
      layer.pm.disable();
    };
  }, []);

  return (
    <Polygon
      ref={ref}
      positions={pts}
      pathOptions={{ color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.2, weight: 3 }}
    />
  );
}

const fab =
  "flex h-12 w-12 items-center justify-center rounded-full bg-card p-0 text-foreground shadow-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export default function MyFarmMap() {
  const { t, lang, field } = useApp();
  const [map, setMap] = useState<LMap | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [pts, setPts] = useState<LatLng[]>([]);
  const [saved, setSaved] = useState<LatLng[] | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [backup, setBackup] = useState<LatLng[] | null>(null);
  const [backupName, setBackupName] = useState<string | null>(null);
  const [name, setName] = useState(field?.name ?? DEFAULT_NAME);
  const [loc, setLoc] = useState<Loc | null>(null);
  const [msg, setMsg] = useState<Notice | null>(null);
  const [locating, setLocating] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[] | null>(null);
  const [searchPin, setSearchPin] = useState<{ lat: number; lng: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [tileErr, setTileErr] = useState(false);
  const [drawKey, setDrawKey] = useState(0);
  const lastSearch = useRef(0);
  const searchAbort = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    loadFarmPlot()
      .then((feature) => {
        if (!feature) {
          setSaved(null);
          setSavedName(null);
          setPts([]);
          return;
        }
        const points = fromFeature(feature);
        if (!isFarmFeature(feature)) throw new Error("Invalid saved farm");
        setSaved(points);
        setSavedName(feature.properties.name);
        setPts(points);
        setName(feature.properties.name);
        setBackup(null);
        setBackupName(null);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return () => searchAbort.current?.abort();
  }, []);

  useEffect(() => {
    if (!map) return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  // Show the saved farm first; otherwise the field the farmer registered.
  // This never treats the registered boundary as the farmer's live position.
  useEffect(() => {
    if (!map || loading) return;
    const target = saved && isValidPolygon(saved) ? saved : field?.boundary;
    if (target && isValidPolygon(target)) {
      map.fitBounds(L.latLngBounds(target), { padding: [36, 36], maxZoom: 18 });
    }
  }, [map, loading, saved, field?.boundary]);

  useEffect(() => {
    if (!map) return;
    if (mode === "draw" || mode === "edit") map.doubleClickZoom.disable();
    else map.doubleClickZoom.enable();
  }, [map, mode]);

  const dirty = useMemo(() => {
    const persisted = saved ?? [];
    if (!samePoints(pts, persisted)) return true;
    return saved !== null && name.trim() !== (savedName ?? "");
  }, [pts, saved, savedName, name]);

  useBlocker({
    shouldBlockFn: () => dirty && !window.confirm(t("unsavedConfirm")),
    enableBeforeUnload: () => dirty,
  });

  const valid = isValidPolygon(pts);
  const area = valid ? polygonAreaM2(pts) : 0;
  const editing = mode === "draw" || mode === "edit";
  const initialCenter: LatLng = field?.boundary[0] ?? NEPAL_CENTER;
  const initialZoom = field?.boundary.length ? 15 : 7;

  const locate = () => {
    if (!navigator.geolocation) {
      setMsg({ text: t("locUnsupported"), kind: "error" });
      return;
    }
    setLocating(true);
    setMsg({ text: t("locating"), kind: "info" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy,
        };
        setLoc(current);
        setSearchPin(null);
        map?.flyTo([current.lat, current.lng], zoomForAccuracy(current.acc));
        const accuracy = `${t("accuracy")} ±${num(lang, Math.round(current.acc))} m.`;
        setMsg({
          text: `${current.acc > 100 ? `${t("lowAccuracy")} · ` : ""}${accuracy} ${t("notFarmNote")}`,
          kind: current.acc > 100 ? "error" : "info",
        });
      },
      (error) => {
        setLocating(false);
        setMsg({
          text: error.code === error.PERMISSION_DENIED ? t("locDenied") : t("locUnavailable"),
          kind: "error",
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const search = async (event: FormEvent) => {
    event.preventDefault();
    const query = q.trim();
    if (!query) {
      setResults(null);
      return;
    }
    if (searching) return;
    if (Date.now() - lastSearch.current < NOMINATIM_MIN_INTERVAL_MS) {
      setMsg({ text: t("searchWait"), kind: "info" });
      return;
    }

    lastSearch.current = Date.now();
    searchAbort.current?.abort();
    const controller = new AbortController();
    searchAbort.current = controller;
    setSearching(true);
    setResults(null);
    setMsg(null);

    try {
      // Nominatim usage policy: max 1 request/second, identify the app through
      // the browser Referer, and never run this request on every keystroke.
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}&accept-language=${lang}`,
        { signal: controller.signal, headers: { Accept: "application/json" } },
      );
      if (!response.ok) throw new Error("Search request failed");
      const rows = (await response.json()) as {
        display_name: string;
        lat: string;
        lon: string;
        boundingbox?: [string, string, string, string];
      }[];
      setResults(
        rows.map((row) => {
          const box = row.boundingbox?.map(Number);
          const bounds =
            box?.length === 4 && box.every(Number.isFinite)
              ? ([[box[0]!, box[2]!], [box[1]!, box[3]!]] as [[number, number], [number, number]])
              : null;
          return { name: row.display_name, lat: Number(row.lat), lng: Number(row.lon), bounds };
        }),
      );
    } catch (error) {
      if ((error as { name?: string }).name !== "AbortError") {
        setResults(null);
        setMsg({ text: t("searchFail"), kind: "error" });
      }
    } finally {
      setSearching(false);
    }
  };

  const choosePlace = (place: Place) => {
    setResults(null);
    setSearchPin({ lat: place.lat, lng: place.lng });
    if (place.bounds) {
      map?.flyToBounds(L.latLngBounds(place.bounds), { padding: [36, 36], maxZoom: 17 });
    } else {
      map?.flyTo([place.lat, place.lng], 16);
    }
  };

  const resetDraft = () => {
    setPts(backup ?? saved ?? []);
    setName(backupName ?? savedName ?? field?.name ?? DEFAULT_NAME);
    setBackup(null);
    setBackupName(null);
    setMode("view");
    setMsg(null);
  };

  const beginDraw = () => {
    setBackup(pts);
    setBackupName(name);
    setPts([]);
    setDrawKey((key) => key + 1);
    setResults(null);
    setMode("draw");
    setMsg({ text: t("drawHelp"), kind: "info" });
  };

  const created = (points: LatLng[]) => {
    const ok = isValidPolygon(points);
    setPts(points);
    setMode("edit");
    setMsg({ text: ok ? t("editHelp") : t("invalidPoly"), kind: ok ? "info" : "error" });
  };

  const editBoundary = () => {
    setBackup(pts);
    setBackupName(name);
    setMode("edit");
    setMsg({ text: t("editHelp"), kind: "info" });
  };

  const clearBoundary = () => {
    if (!backup) {
      setBackup(pts);
      setBackupName(name);
    }
    setPts([]);
    setDrawKey((key) => key + 1);
    setMode("draw");
    setMsg({ text: `${t("cleared")} ${t("drawHelp")}`, kind: "info" });
  };

  const undo = () => {
    setPts((points) => points.slice(0, -1));
    setMsg({ text: t("editHelp"), kind: "info" });
  };

  const restore = () => {
    if (!backup) return;
    setPts(backup);
    setName(backupName ?? name);
    setMode(backup.length > 2 ? "edit" : "view");
    setMsg({ text: t("editHelp"), kind: "info" });
  };

  const confirm = () => {
    if (!valid) {
      setMsg({ text: t("invalidPoly"), kind: "error" });
      return;
    }
    setMode("confirm");
    setMsg(null);
  };

  const save = async () => {
    if (!valid) {
      setMsg({ text: t("invalidPoly"), kind: "error" });
      return;
    }
    setBusy(true);
    setMsg(null);
    const finalName = name.trim().slice(0, 100) || DEFAULT_NAME;
    try {
      await saveFarmPlot(toFeature(finalName, pts));
      setSaved(pts);
      setSavedName(finalName);
      setName(finalName);
      setBackup(null);
      setBackupName(null);
      setMode("view");
      setMsg({ text: t("plotSaved"), kind: "ok" });
    } catch {
      setMsg({ text: t("plotSaveFail"), kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  const canRestore = !!backup && backup.length > 2 && !samePoints(backup, pts);

  return (
    <div className="relative h-[calc(100dvh-18rem)] min-h-[380px] overflow-hidden rounded-lg border lg:h-[calc(100dvh-16rem)]">
      <MapContainer
        ref={setMap}
        center={initialCenter}
        zoom={initialZoom}
        zoomControl={false}
        className="z-0 h-full w-full"
        style={{ cursor: editing ? "crosshair" : undefined }}
        doubleClickZoom={!editing}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          maxZoom={19}
          eventHandlers={{ tileerror: () => setTileErr(true), load: () => setTileErr(false) }}
        />
        {loc && (
          <>
            <Circle
              center={[loc.lat, loc.lng]}
              radius={Math.max(loc.acc, 3)}
              pathOptions={{ color: "var(--location)", fillColor: "var(--location)", fillOpacity: 0.12, weight: 1 }}
            />
            <CircleMarker
              center={[loc.lat, loc.lng]}
              radius={8}
              pathOptions={{ color: "var(--card)", weight: 3, fillColor: "var(--location)", fillOpacity: 1 }}
            />
          </>
        )}
        {searchPin && (
          <CircleMarker
            center={[searchPin.lat, searchPin.lng]}
            radius={9}
            pathOptions={{ color: "var(--card)", weight: 3, fillColor: "var(--satellite)", fillOpacity: 1 }}
          />
        )}
        {mode === "view" && pts.length > 2 && (
          <Polygon positions={pts} pathOptions={{ color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.3, weight: 3 }} />
        )}
        {mode === "confirm" && pts.length > 2 && (
          <Polygon positions={pts} pathOptions={{ color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.3, weight: 3 }} />
        )}
        {mode === "edit" && pts.length > 2 && <EditableBoundary pts={pts} onChange={setPts} />}
        {mode === "draw" && <GeomanDraw key={drawKey} onCreated={created} onCancel={resetDraft} />}
      </MapContainer>

      {/* Search */}
      <div className="absolute inset-x-3 top-3 z-[500]">
        <form onSubmit={search} className="flex items-center gap-2 rounded-full border bg-card px-4 shadow-lg">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(event) => {
              setQ(event.target.value);
              if (!event.target.value.trim()) setResults(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setResults(null);
            }}
            placeholder={t("searchPlace")}
            aria-label={t("searchPlace")}
            aria-expanded={results !== null}
            className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setResults(null);
              }}
              aria-label={t("clearSearch")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Btn type="submit" variant="ghost" className="shrink-0 px-1 text-sm" disabled={searching || !q.trim()}>
            {searching ? t("searching") : t("search")}
          </Btn>
        </form>
        {results && (
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border bg-card shadow-lg">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">{t("searchNone")}</p>
            ) : (
              <ul>
                {results.map((place) => (
                  <li key={`${place.lat},${place.lng},${place.name}`}>
                    <button
                      type="button"
                      className="tap flex w-full items-start px-4 py-3 text-left text-sm hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => choosePlace(place)}
                    >
                      <span className="line-clamp-3">{place.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="border-t px-4 py-2 text-[11px] text-muted-foreground">
              <a
                href="https://nominatim.openstreetmap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {t("searchAttribution")}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Zoom + locate */}
      <div className="absolute right-3 top-20 z-[500] flex flex-col gap-2">
        <Btn variant="outline" className={fab} onClick={() => map?.zoomIn()} aria-label={t("zoomIn")} title={t("zoomIn")}>
          <Plus className="h-5 w-5" />
        </Btn>
        <Btn variant="outline" className={fab} onClick={() => map?.zoomOut()} aria-label={t("zoomOut")} title={t("zoomOut")}>
          <Minus className="h-5 w-5" />
        </Btn>
      </div>
      <Btn
        variant="outline"
        className={`${fab} absolute left-3 top-20 z-[500] text-location`}
        onClick={locate}
        disabled={locating}
        aria-busy={locating}
        aria-label={t("myLocation")}
        title={t("myLocation")}
      >
        <LocateFixed className={`h-6 w-6 ${locating ? "animate-pulse" : ""}`} />
      </Btn>

      {/* Bottom panel */}
      <div className="absolute inset-x-3 bottom-6 z-[500] max-h-[60%] space-y-2 overflow-auto rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        {loading && <p role="status" className="text-sm text-muted-foreground">{t("plotLoading")}</p>}
        {loadError && (
          <div role="alert" className="flex items-center justify-between gap-2 text-sm text-destructive">
            <span>{t("plotLoadFail")}</span>
            <Btn variant="ghost" onClick={load}>{t("retry")}</Btn>
          </div>
        )}
        {tileErr && (
          <p className="flex items-center gap-1 text-xs font-semibold text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            {t("tileFail")}
          </p>
        )}
        {msg && (
          <p
            role="status"
            className={`text-sm ${
              msg.kind === "error"
                ? "font-semibold text-destructive"
                : msg.kind === "ok"
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
            }`}
          >
            {msg.text}
          </p>
        )}

        {editing && <p className="text-xs font-semibold text-muted-foreground">{mode === "draw" ? t("stepDraw") : t("stepAdjust")}</p>}
        {mode === "confirm" && <p className="text-xs font-semibold text-muted-foreground">{t("stepSave")}</p>}

        {pts.length > 2 && (
          <p className="text-sm font-semibold">
            {t("area")}: {valid ? `${num(lang, Math.round(area))} ${t("sqm")} · ${num(lang, +(area / 10000).toFixed(3))} ${t("hectares")}` : "—"}{" "}
            <span className="font-normal text-muted-foreground">({num(lang, pts.length)} {t("points")})</span>
          </p>
        )}
        {editing && pts.length > 0 && !valid && (
          <p role="alert" className="text-xs font-semibold text-destructive">{t("invalidPoly")}</p>
        )}

        {mode === "view" && !loading && (
          pts.length > 2 ? (
            <div className="flex gap-2">
              <Btn variant="outline" className="min-w-0 flex-1 px-2 text-sm" onClick={editBoundary}>
                <Pencil className="h-4 w-4 shrink-0" />
                {t("editBoundary")}
              </Btn>
              <Btn className="min-w-0 flex-1 px-2 text-sm" onClick={beginDraw}>{t("drawBoundary")}</Btn>
            </div>
          ) : (
            <Btn className="tap w-full rounded-xl bg-primary font-bold text-primary-foreground" onClick={beginDraw}>
              <Pencil className="mr-2 inline h-5 w-5" />
              {t("drawBoundary")}
            </Btn>
          )
        )}

        {mode === "draw" && (
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="outline" className="flex-col gap-1 px-1 py-1 text-xs" onClick={resetDraft}>
              <X className="h-4 w-4" />
              {t("cancel")}
            </Btn>
            <Btn variant="outline" className="flex-col gap-1 px-1 py-1 text-xs" onClick={clearBoundary}>
              <RotateCcw className="h-4 w-4" />
              {t("clear")}
            </Btn>
          </div>
        )}

        {mode === "edit" && (
          <div className="grid grid-cols-4 gap-2">
            <Btn variant="outline" className="flex-col gap-1 px-1 py-1 text-xs" onClick={resetDraft}>
              <X className="h-4 w-4" />
              {t("cancel")}
            </Btn>
            <Btn variant="outline" className="flex-col gap-1 px-1 py-1 text-xs" disabled={!pts.length} onClick={undo}>
              <Undo2 className="h-4 w-4" />
              {t("undo")}
            </Btn>
            <Btn variant="outline" className="flex-col gap-1 px-1 py-1 text-xs" disabled={!pts.length} onClick={clearBoundary}>
              <Trash2 className="h-4 w-4" />
              {t("clear")}
            </Btn>
            <Btn className="flex-col gap-1 px-1 py-1 text-xs" disabled={!valid} onClick={confirm}>
              <Check className="h-4 w-4" />
              {t("confirm")}
            </Btn>
          </div>
        )}

        {editing && canRestore && (
          <Btn variant="ghost" className="h-auto px-0 py-1 text-sm font-semibold text-primary underline" onClick={restore}>
            {t("restorePrevious")}
          </Btn>
        )}

        {mode === "confirm" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              {t("fieldName")}
              <input
                className="tap mt-1 w-full rounded-xl border-2 border-input bg-card px-3 text-base"
                value={name}
                maxLength={100}
                autoComplete="off"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <p className="text-xs text-muted-foreground">{t("resolutionNote")}</p>
            <div className="flex gap-2">
              <Btn className="tap flex-1 rounded-xl border-2 font-semibold" onClick={() => setMode("edit")}>
                {t("back")}
              </Btn>
              <Btn
                className="tap flex-1 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-50"
                disabled={busy}
                onClick={save}
              >
                {busy ? t("saving") : t("savePlot")}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
