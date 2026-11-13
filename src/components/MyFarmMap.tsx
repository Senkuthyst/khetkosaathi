import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Circle, CircleMarker, useMapEvents } from "react-leaflet";
import L, { type Map as LMap } from "leaflet";
import { useBlocker } from "@tanstack/react-router";
import { LocateFixed, Plus, Minus, Search, Pencil, Undo2, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";
import type { LatLng } from "@/lib/data";
import { fromFeature, isValidPolygon, polygonAreaM2, toFeature } from "@/lib/farm-plot";
import { loadFarmPlot, saveFarmPlot } from "@/lib/farm-plot-storage";

const CHITWAN: LatLng = [27.6775, 84.4333];
const vertexIcon = L.divIcon({ className: "", html: '<div style="width:22px;height:22px;border-radius:9999px;background:#fff;border:3px solid var(--primary);box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });

type Mode = "view" | "draw" | "edit" | "confirm";
type Loc = { lat: number; lng: number; acc: number };

function Clicks({ on }: { on: (p: LatLng) => void }) {
  useMapEvents({ click: (e) => on([e.latlng.lat, e.latlng.lng]) });
  return null;
}

const fab = "flex h-12 w-12 items-center justify-center rounded-full bg-card text-foreground shadow-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export default function MyFarmMap() {
  const { t, lang, field } = useApp();
  const [map, setMap] = useState<LMap | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [pts, setPts] = useState<LatLng[]>([]);
  const [saved, setSaved] = useState<LatLng[] | null>(null);
  const [backup, setBackup] = useState<LatLng[] | null>(null);
  const [name, setName] = useState(field?.name ?? "My Farm");
  const [loc, setLoc] = useState<Loc | null>(null);
  const [msg, setMsg] = useState<{ text: string; kind: "info" | "error" | "ok" } | null>(null);
  const [locating, setLocating] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ name: string; lat: number; lng: number }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [tileErr, setTileErr] = useState(false);
  const lastSearch = useRef(0);

  useEffect(() => {
    loadFarmPlot().then((f) => { if (f) { const p = fromFeature(f); setSaved(p); setPts(p); setName(f.properties.name); } }).catch(() => {});
  }, []);
  useEffect(() => { if (map && saved?.length) map.fitBounds(L.latLngBounds(saved), { padding: [40, 40] }); }, [map, saved]);

  const dirty = useMemo(() => JSON.stringify(pts) !== JSON.stringify(saved ?? []), [pts, saved]);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  useBlocker({ shouldBlockFn: () => dirty && !window.confirm(t("unsaved")) });

  const valid = isValidPolygon(pts);
  const area = valid ? polygonAreaM2(pts) : 0;

  const locate = () => {
    if (!navigator.geolocation) return setMsg({ text: t("locUnsupported"), kind: "error" });
    setLocating(true); setMsg({ text: t("locating"), kind: "info" });
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        const l = { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy };
        setLoc(l);
        map?.flyTo([l.lat, l.lng], Math.max(map.getZoom(), 16));
        setMsg({ text: `${l.acc > 100 ? t("lowAccuracy") + " · " : ""}${t("accuracy")} ±${num(lang, Math.round(l.acc))} m. ${t("notFarmNote")}`, kind: l.acc > 100 ? "error" : "info" });
      },
      (e) => { setLocating(false); setMsg({ text: e.code === e.PERMISSION_DENIED ? t("locDenied") : t("locUnavailable"), kind: "error" }); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const search = async (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query || Date.now() - lastSearch.current < 1100) return; // Nominatim: max 1 request/second
    lastSearch.current = Date.now();
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}&accept-language=${lang}`);
      if (!r.ok) throw new Error();
      const rows = (await r.json()) as { display_name: string; lat: string; lon: string }[];
      setResults(rows.map((x) => ({ name: x.display_name, lat: +x.lat, lng: +x.lon })));
    } catch { setResults(null); setMsg({ text: t("searchFail"), kind: "error" }); }
  };

  const start = () => { setBackup(pts); setPts([]); setMode("draw"); setMsg({ text: t("drawHelp"), kind: "info" }); };
  const edit = () => { setBackup(pts); setMode("edit"); setMsg({ text: t("drawHelp"), kind: "info" }); };
  const cancel = () => { setPts(backup ?? saved ?? []); setMode("view"); setMsg(null); };
  const clear = () => { setBackup(pts); setPts([]); setMode("draw"); setMsg({ text: t("cleared"), kind: "info" }); };
  const confirm = () => { if (!valid) return setMsg({ text: t("invalidPoly"), kind: "error" }); setMode("confirm"); setMsg(null); };
  const save = async () => {
    setBusy(true);
    try { await saveFarmPlot(toFeature(name.trim() || "My Farm", pts)); setSaved(pts); setMode("view"); setMsg({ text: t("plotSaved"), kind: "ok" }); }
    catch { setMsg({ text: t("plotSaveFail"), kind: "error" }); }
    finally { setBusy(false); }
  };

  const editing = mode === "draw" || mode === "edit";
  const ring = editing && pts.length > 2 ? [...pts, pts[0]!] : pts;

  return (
    <div className="relative h-[calc(100dvh-14rem)] min-h-[420px] overflow-hidden rounded-2xl border">
      <MapContainer ref={setMap} center={CHITWAN} zoom={13} zoomControl={false} className="z-0 h-full w-full" style={{ cursor: editing ? "crosshair" : undefined }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" maxZoom={19} eventHandlers={{ tileerror: () => setTileErr(true), tileload: () => setTileErr(false) }} />
        {loc && <><Circle center={[loc.lat, loc.lng]} radius={loc.acc} pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.12, weight: 1 }} /><CircleMarker center={[loc.lat, loc.lng]} radius={8} pathOptions={{ color: "#fff", weight: 3, fillColor: "#2563eb", fillOpacity: 1 }} /></>}
        {pts.length > 2 && !editing && <Polygon positions={pts} pathOptions={{ color: "var(--primary)", fillColor: "var(--primary)", fillOpacity: 0.3, weight: 3 }} />}
        {editing && pts.length > 2 && <Polygon positions={pts} pathOptions={{ color: valid ? "var(--primary)" : "var(--destructive)", fillOpacity: 0.2, weight: 0 }} />}
        {editing && pts.length > 1 && <Polyline positions={ring} pathOptions={{ color: valid || pts.length < 3 ? "var(--primary)" : "var(--destructive)", weight: 3, dashArray: mode === "draw" ? "6 6" : undefined }} />}
        {editing && pts.map((p, i) => (
          <Marker key={i} position={p} icon={vertexIcon} draggable
            eventHandlers={{
              dragend: (e) => { const ll = (e.target as L.Marker).getLatLng(); setPts((x) => x.map((v, j) => (j === i ? [ll.lat, ll.lng] : v))); },
              click: () => setPts((x) => x.filter((_, j) => j !== i)),
            }} />
        ))}
        {mode === "draw" && <Clicks on={(p) => setPts((x) => [...x, p])} />}
      </MapContainer>

      {/* Search */}
      <div className="absolute inset-x-3 top-3 z-[500]">
        <form onSubmit={search} className="flex items-center gap-2 rounded-full border bg-card px-4 shadow-lg">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlace")} aria-label={t("searchPlace")} className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none" />
          <button type="submit" className="text-sm font-semibold text-primary">{t("search")}</button>
        </form>
        {results && (
          <ul className="mt-2 max-h-56 overflow-auto rounded-2xl border bg-card shadow-lg">
            {results.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">{t("searchNone")}</li>}
            {results.map((r, i) => (
              <li key={i}><button className="w-full px-4 py-3 text-left text-sm hover:bg-secondary" onClick={() => { map?.flyTo([r.lat, r.lng], 16); setResults(null); }}>{r.name}</button></li>
            ))}
          </ul>
        )}
      </div>

      {/* Zoom + locate */}
      <div className="absolute right-3 top-20 z-[500] flex flex-col gap-2">
        <button className={fab} onClick={() => map?.zoomIn()} aria-label="Zoom in"><Plus className="h-5 w-5" /></button>
        <button className={fab} onClick={() => map?.zoomOut()} aria-label="Zoom out"><Minus className="h-5 w-5" /></button>
      </div>
      <button className={`${fab} absolute bottom-40 right-3 z-[500] text-[#2563eb]`} onClick={locate} disabled={locating} aria-label={t("myLocation")} title={t("myLocation")}>
        <LocateFixed className={`h-6 w-6 ${locating ? "animate-pulse" : ""}`} />
      </button>

      {/* Bottom panel */}
      <div className="absolute inset-x-3 bottom-3 z-[500] space-y-2 rounded-2xl border bg-card p-3 shadow-lg">
        {tileErr && <p className="flex items-center gap-1 text-xs font-semibold text-destructive"><AlertTriangle className="h-3.5 w-3.5" />{t("tileFail")}</p>}
        {msg && <p role="status" className={`text-sm ${msg.kind === "error" ? "font-semibold text-destructive" : msg.kind === "ok" ? "font-semibold text-primary" : "text-muted-foreground"}`}>{msg.text}</p>}
        {(editing || mode === "confirm" || (pts.length > 2 && valid)) && (
          <p className="text-sm font-semibold">{t("area")}: {valid ? `${num(lang, Math.round(area))} ${t("sqm")} · ${num(lang, +(area / 10000).toFixed(3))} ${t("hectares")}` : "—"} <span className="font-normal text-muted-foreground">({num(lang, pts.length)} {t("points")})</span></p>
        )}
        {mode === "view" && (
          pts.length > 2
            ? <div className="flex gap-2"><button className="tap flex-1 rounded-xl border-2 font-semibold" onClick={edit}><Pencil className="mr-1 inline h-4 w-4" />{t("editBoundary")}</button><button className="tap flex-1 rounded-xl bg-primary font-semibold text-primary-foreground" onClick={start}>{t("drawBoundary")}</button></div>
            : <button className="tap w-full rounded-xl bg-primary font-bold text-primary-foreground" onClick={start}><Pencil className="mr-2 inline h-5 w-5" />{t("drawBoundary")}</button>
        )}
        {editing && (
          <div className="grid grid-cols-4 gap-2">
            <button className="tap rounded-xl border-2 text-sm font-semibold" onClick={cancel}><X className="mx-auto h-4 w-4" />{t("cancel")}</button>
            <button className="tap rounded-xl border-2 text-sm font-semibold disabled:opacity-40" disabled={!pts.length} onClick={() => setPts((x) => x.slice(0, -1))}><Undo2 className="mx-auto h-4 w-4" />{t("undo")}</button>
            <button className="tap rounded-xl border-2 text-sm font-semibold disabled:opacity-40" disabled={!pts.length} onClick={clear}><Trash2 className="mx-auto h-4 w-4" />{t("clear")}</button>
            <button className="tap rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40" disabled={pts.length < 3} onClick={confirm}><Check className="mx-auto h-4 w-4" />{t("confirm")}</button>
          </div>
        )}
        {editing && backup && backup.length > 2 && pts.length === 0 && (
          <button className="text-sm font-semibold text-primary underline" onClick={() => setPts(backup)}>{t("restore")}</button>
        )}
        {mode === "confirm" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold">{t("fieldName")}
              <input className="tap mt-1 w-full rounded-xl border-2 border-input bg-card px-3 text-base" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} /></label>
            <p className="text-xs text-muted-foreground">{t("resolutionNote")}</p>
            <div className="flex gap-2">
              <button className="tap flex-1 rounded-xl border-2 font-semibold" onClick={() => setMode("edit")}>{t("back")}</button>
              <button className="tap flex-1 rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-50" disabled={busy} onClick={save}>{busy ? t("saving") : t("savePlot")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
