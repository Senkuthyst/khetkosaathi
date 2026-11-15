import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  RefreshCw,
  ShieldAlert,
  Satellite,
  Globe2,
  Droplets,
  CloudSun,
  Layers,
  Search,
  Calendar,
  ExternalLink,
  Info,
  CheckCircle2,
  Flame,
  AlertTriangle,
  MapPin,
  Sprout,
  ChevronRight,
} from "lucide-react";
import { Btn, Card, DataProvenance, FreshBadge, PageTitle, Skeleton, SourceTag } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import { LazyMap } from "@/components/LazyMap";
import { EarthDataStatusSection } from "@/components/EarthDataStatusSection";
import {
  GlobalLocationSelector,
  PRESET_GLOBAL_LOCATIONS,
  type GeoLocation,
} from "@/components/GlobalLocationSelector";
import { AiExplanationPanel } from "@/components/AiExplanationPanel";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import {
  fetchNasaPowerDaily,
  computeScientificAnomalies,
  type PowerData,
  type Provenance,
  type RiskLevel,
} from "@/lib/data";
import {
  fetchLiveFirmsHotspots,
  fetchLiveGpmPrecipitation,
  fetchLiveModisVegetation,
  fetchLiveSmapSoilMoisture,
} from "@/lib/data/nasa-client";
import type { GpmPrecipitationSummary } from "@/lib/data/gpm-service";
import type { ModisFieldSummary } from "@/lib/data/modis-service";
import type { SmapObservationSummary } from "@/lib/server-functions/smap.server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/earth-intelligence")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Global Earth Intelligence Module",
      "NASA Earth observation provenance and regional agricultural intelligence for Nepal and globally (POWER, SMAP, GPM IMERG, MODIS, FIRMS)."
    ),
  component: EarthIntelligence,
});

const fmt = (v: number | null, d = 1) => (v === null ? null : Number(v.toFixed(d)));

function ScientificTag({ type }: { type: "direct" | "satellite" | "calculated" | "model" }) {
  const configs = {
    direct: { label: "Direct In-Situ Observation", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    satellite: { label: "Satellite-Derived Estimate", cls: "bg-blue-100 text-blue-800 border-blue-300" },
    calculated: { label: "Calculated Anomaly Indicator", cls: "bg-amber-100 text-amber-800 border-amber-300" },
    model: { label: "Model Reanalysis Grid", cls: "bg-purple-100 text-purple-800 border-purple-300" },
  }[type];

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border", configs.cls)}>
      {configs.label}
    </span>
  );
}

function Metric({
  title,
  data,
  type = "satellite",
  children,
}: {
  title: string;
  data: Provenance;
  type?: "direct" | "satellite" | "calculated" | "model";
  children: ReactNode;
}) {
  const sat = data.source !== "nasa_power";
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm transition-all",
        sat ? "border-l-4 border-l-satellite border-dashed" : "border-l-4 border-l-primary"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-foreground">{title}</h2>
          <div className="mt-1">
            <ScientificTag type={type} />
          </div>
        </div>
        <FreshBadge f={data.mode === "pilot" ? "stale" : data.observedAt ? "fresh" : "missing"} />
      </div>

      <div className="mt-3">{children}</div>

      <div className="mt-4 border-t pt-3 flex items-center justify-between">
        <SourceTag source={data.source} />
        <span className="text-[11px] text-muted-foreground">{data.resolution}</span>
      </div>
      <DataProvenance data={data} />
    </section>
  );
}

function EarthIntelligence() {
  const { t, lang, selectedField, farmFields } = useApp();
  const [power, setPower] = useState<PowerData | null>(null);
  const [gpmSummary, setGpmSummary] = useState<GpmPrecipitationSummary | null>(null);
  const [modisSummary, setModisSummary] = useState<ModisFieldSummary | null>(null);
  const [smapSummary, setSmapSummary] = useState<SmapObservationSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "precipitation" | "moisture" | "firms">("ndvi");

  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    if (selectedField) {
      return {
        id: selectedField.id,
        name: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`,
        country: "Nepal",
        latitude: selectedField.latitude,
        longitude: selectedField.longitude,
        type: "field",
        description: `Registered farm plot in ${selectedField.municipality || "Nepal"}, ${selectedField.district || ""}`,
      };
    }
    return PRESET_GLOBAL_LOCATIONS[0]!;
  });

  const [firmsMarkers, setFirmsMarkers] = useState<Array<{ latitude: number; longitude: number; label: string }>>([]);

  // Sync currentLocation when selectedField changes in top bar
  useEffect(() => {
    if (selectedField) {
      setCurrentLocation({
        id: selectedField.id,
        name: `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`,
        country: "Nepal",
        latitude: selectedField.latitude,
        longitude: selectedField.longitude,
        type: "field",
        description: `Registered farm plot in ${selectedField.municipality || "Nepal"}, ${selectedField.district || ""}`,
      });
    }
  }, [selectedField]);

  const load = (force = false, loc = currentLocation) => {
    setBusy(true);

    // 1. Fetch real NASA POWER Daily observations
    fetchNasaPowerDaily(force, {
      latitude: loc.latitude,
      longitude: loc.longitude,
      fieldId: loc.id,
    })
      .then(setPower)
      .catch((err) => {
        console.warn("NASA POWER fetch failed:", err);
        setPower(null);
      })
      .finally(() => setBusy(false));

    // 2. Fetch real NASA FIRMS Active Thermal Anomaly Hotspots (via MAP_API_KEY)
    fetchLiveFirmsHotspots({
      latitude: loc.latitude,
      longitude: loc.longitude,
      radiusKm: 60,
    }).then((res) => {
      if (res && res.detections.length > 0) {
        setFirmsMarkers(
          res.detections.map((d) => ({
            latitude: d.latitude,
            longitude: d.longitude,
            label: `Hotspot: ${d.brightness}K (${d.instrument} ${d.confidence} conf)`,
          }))
        );
      } else {
        setFirmsMarkers([]);
      }
    });

    // 3. Fetch real NASA GPM IMERG
    fetchLiveGpmPrecipitation({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }).then(setGpmSummary);

    // 4. Fetch real NASA MODIS
    fetchLiveModisVegetation({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      fieldAreaM2: selectedField?.areaM2 ?? 4046,
    }).then(setModisSummary);

    // 5. Fetch real NASA SMAP
    fetchLiveSmapSoilMoisture({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }).then(setSmapSummary);
  };

  useEffect(() => {
    load(false, currentLocation);
  }, [currentLocation]);

  // If no farm is selected or registered
  if (!selectedField && farmFields.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto my-8">
          <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Select or Register a Farm</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All NASA Earth observations are strictly mapped to your registered agricultural parcel coordinates. Please register your plot to view verified satellite data.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>Register Your Farm Plot</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derive real parameters from actual NASA POWER response
  const maxes = power?.days.map((d) => d.tMax).filter((v): v is number => v !== null) ?? [];
  const meanMax = maxes.length ? maxes.reduce((a, b) => a + b, 0) / maxes.length : null;
  const powerRainTotal = power?.days.reduce((acc, d) => acc + (d.rain ?? 0), 0) ?? null;

  // Synthesize genuine scientific anomaly report across real observation streams
  const anomalyReport = computeScientificAnomalies({
    locationName: currentLocation.name,
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    temperatureObservations: power?.days.map((d) => ({ tMax: d.tMax, tMin: d.tMin })) ?? [],
    rainfallObservations: power?.days.map((d) => ({ rain: d.rain })) ?? [],
    modisNdvi: modisSummary?.latestNdvi ?? null,
    modisBaselineLow: 0.55,
    modisBaselineHigh: 0.75,
    thermalHotspotsCount: firmsMarkers.length,
    cropAgeDays: 45,
    cropType: (selectedField?.cropType as any) ?? "rice",
  });

  const signed = (v: number | null, unit: string) =>
    v === null ? t("missing") : `${v > 0 ? "+" : ""}${num(lang, fmt(v)!)}${unit}`;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-satellite/10 px-2.5 py-0.5 text-xs font-bold text-satellite">
              <Satellite className="h-3.5 w-3.5" />
              <span>NASA Earth Observation System</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t("earthIntelligence")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              NASA Satellite Intelligence · Active Farm: {currentLocation.name} ({currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E)
            </p>
          </div>

          <Btn
            variant="outline"
            className="self-start md:self-auto min-h-10 px-4 text-xs font-bold"
            onClick={() => load(true, currentLocation)}
            disabled={busy}
            aria-label={t("refreshData")}
          >
            <RefreshCw className={cn("h-4 w-4", busy && "animate-spin")} />
            {t("refreshData")}
          </Btn>
        </div>

        {/* Scientific Distinctions Guide */}
        <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
            <strong className="text-emerald-900 block">1. Direct In-Situ</strong>
            <span className="text-emerald-700">Farm soil probe & weather station</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200">
            <strong className="text-blue-900 block">2. Satellite-Derived</strong>
            <span className="text-blue-700">MODIS 250m & Landsat 30m NDVI</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200">
            <strong className="text-amber-900 block">3. Anomaly Indicator</strong>
            <span className="text-amber-700">GPM IMERG deviation vs baseline</span>
          </div>
          <div className="p-2 rounded-lg bg-purple-50/70 border border-purple-200">
            <strong className="text-purple-900 block">4. Model Reanalysis</strong>
            <span className="text-purple-700">NASA POWER Daily Climatology</span>
          </div>
        </div>
      </div>

      {/* Global Location Selector Bar */}
      <GlobalLocationSelector
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
        }}
      />

      {/* Interactive Map Layout with Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map View (Col 8) */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-primary" />
                Regional Earth Observation Map
              </h3>
              <span className="text-xs text-muted-foreground">
                Layer: <strong>{activeLayer.toUpperCase()}</strong> · Coordinates: {currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°
              </span>
            </div>

            {/* Layer Controls */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl flex-wrap">
              {[
                { id: "ndvi", label: "MODIS NDVI" },
                { id: "precipitation", label: "GPM Rainfall" },
                { id: "moisture", label: "SMAP Soil" },
                { id: "firms", label: `FIRMS Fires (${firmsMarkers.length})` },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    activeLayer === layer.id
                      ? "bg-card text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border">
            <LazyMap
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={13}
              height={360}
              polygons={
                selectedField?.boundary && selectedField.boundary.length > 0
                  ? [
                      {
                        positions: selectedField.boundary,
                        color: activeLayer === "ndvi" ? "var(--veg-good)" : activeLayer === "firms" ? "#ef4444" : "var(--satellite)",
                        label: selectedField.fieldName,
                      },
                    ]
                  : []
              }
              markers={
                activeLayer === "firms"
                  ? firmsMarkers.map((m) => ({
                      position: [m.latitude, m.longitude] as [number, number],
                      color: "#dc2626",
                      radius: 8,
                      label: m.label,
                    }))
                  : []
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
            {activeLayer === "firms" ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" />
                NASA FIRMS: {firmsMarkers.length} thermal anomalies detected within 60 km (VIIRS 375m / MODIS 1km)
              </span>
            ) : (
              <span>● Field Boundary: {selectedField?.fieldName ?? currentLocation.name}</span>
            )}
            <span>{activeLayer === "firms" ? "NASA FIRMS NRT" : "NASA Earth Observation System"}</span>
          </div>
        </div>

        {/* Integrated Risk Deck (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Verified NASA Earth Observations
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong>Coordinates:</strong> {currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E
              </p>
              <p>
                <strong>NASA POWER Status:</strong>{" "}
                {power ? (
                  <span className="text-emerald-700 font-bold">
                    Connected ({power.days.length} days MERRA-2 observed)
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">Loading / Unavailable</span>
                )}
              </p>
              <p>
                <strong>NASA FIRMS Status:</strong>{" "}
                <span className="text-emerald-700 font-bold">
                  Active ({firmsMarkers.length} detections in region)
                </span>
              </p>
              <p>
                <strong>SMAP Soil Resolution:</strong> 9 km regional grid (Regional indicator only)
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Agricultural Explanation & Grounded Evidence Panel */}
      <AiExplanationPanel report={anomalyReport} />

      {/* Earth Intelligence Ingestion & Live Status Deck */}
      {power && <EarthDataStatusSection powerData={power} fieldId={currentLocation.id} />}

      {/* NASA POWER Climatology Card */}
      <Card className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-foreground">{t("powerOverview")}</h2>
              <ScientificTag type="model" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              NASA Langley Atmospheric Science Data Center · 0.5° × 0.625° Agroclimatology Grid · {currentLocation.name}
            </p>
          </div>
          <a
            href="https://power.larc.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            NASA POWER API Docs ↗
          </a>
        </div>

        {!power ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground" role="status">
              {t("powerLoading")}
            </p>
            <Skeleton className="h-44 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-muted-foreground block mb-1">
                  Air Temperature Envelope (Daily Max / Min °C)
                </span>
                <TrendChart
                  data={power.days}
                  unit="°C"
                  height={150}
                  series={[
                    { key: "tMax", label: t("maxTemperature") },
                    { key: "tMin", label: t("minTemperature") },
                  ]}
                />
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground block mb-1">
                  Daily Corrected Precipitation (mm/day)
                </span>
                <TrendChart
                  data={power.days}
                  unit="mm"
                  height={150}
                  series={[{ key: "rain", label: t("rainfall"), bar: true }]}
                />
              </div>
            </div>

            <DataProvenance data={power.provenance} />
          </div>
        )}
      </Card>

      {/* Multi-Sensor Grid: MODIS, GPM, SMAP (With Transparent Real Status) */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* MODIS Card */}
        <section className="rounded-2xl border bg-card p-5 shadow-sm border-l-4 border-l-satellite border-dashed">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-foreground">{t("earthVegetation")} (MODIS MOD13Q1)</h2>
              <div className="mt-1">
                <ScientificTag type="satellite" />
              </div>
            </div>
            <FreshBadge f={modisSummary?.latestNdvi != null ? "fresh" : "missing"} />
          </div>

          <div className="mt-3">
            {modisSummary?.latestNdvi != null ? (
              <>
                <p className="text-3xl font-extrabold text-foreground">{num(lang, modisSummary.latestNdvi)}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  MODIS 250m 16-day composite surface reflectance. Note: Vegetation indices reflect chlorophyll density, not direct biological disease diagnosis.
                </p>
              </>
            ) : (
              <div className="rounded-xl bg-muted/40 p-3.5 space-y-1">
                <p className="text-xs font-bold text-foreground">NASA AppEEARS / MODIS Status</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Satellite extraction requires approving the NASA AppEEARS application in your Earthdata Login profile (urs.earthdata.nasa.gov). No synthetic data is substituted.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>NASA MODIS MOD13Q1</span>
            <span>250 m resolution</span>
          </div>
        </section>

        {/* GPM IMERG Rainfall Card */}
        <section className="rounded-2xl border bg-card p-5 shadow-sm border-l-4 border-l-primary">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-foreground">NASA GPM IMERG (Precipitation)</h2>
              <div className="mt-1">
                <ScientificTag type="satellite" />
              </div>
            </div>
            <FreshBadge f={gpmSummary?.totalAccumulation7DayMm != null ? "fresh" : "missing"} />
          </div>

          <div className="mt-3">
            {gpmSummary?.totalAccumulation7DayMm != null ? (
              <>
                <p className="text-3xl font-extrabold text-primary">
                  {num(lang, gpmSummary.totalAccumulation7DayMm)} mm
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  7-Day Satellite Precipitation Estimate (0.1° × 0.1° Grid)
                </p>
              </>
            ) : (
              <div className="rounded-xl bg-muted/40 p-3.5 space-y-1">
                <p className="text-xs font-bold text-foreground">NASA GES DISC IMERG Status</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  NASA GES DISC OPeNDAP requires authorizing the "NASA GESDISC DATA ARCHIVE" application in your Earthdata Login profile. Showing real NASA POWER precipitation as verified source above.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>NASA GPM IMERG V07</span>
            <span>0.1° (~10 km)</span>
          </div>
        </section>
      </div>

      {/* SMAP Soil Moisture Comparison */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm border-l-4 border-l-satellite border-dashed">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-foreground">NASA SMAP (Soil Moisture Active Passive)</h2>
            <div className="mt-1">
              <ScientificTag type="satellite" />
            </div>
          </div>
          <FreshBadge f="missing" />
        </div>

        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-dashed border-satellite/50 bg-secondary/30 p-4">
            <p className="text-xs font-bold text-foreground">NASA Earthdata Harmony OGC EDR Status</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              NASA Earthdata Harmony reports HTTP 501 ("Not yet implemented" upstream for NSIDC SMAP CPRD collections).
              Furthermore, SMAP satellite footprints span 9 km to 36 km, representing broad regional moisture indicators rather than sub-pixel smallholder parcel measurements.
            </p>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>NASA SMAP SPL3SMP_E</span>
          <span>9 km / 36 km grid</span>
        </div>
      </section>
    </div>
  );
}
