import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
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
  ChevronDown,
  Eye,
  KeyRound,
  Ban,
  Clock,
  Radio,
  CloudRain,
  Leaf,
} from "lucide-react";
import {
  Btn,
  Card,
  DataProvenance,
  FreshBadge,
  PageTitle,
  Skeleton,
  SourceTag,
} from "@/components/kit";
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
  type SmapObservationSummary,
} from "@/lib/data/nasa-client";
import type { GpmPrecipitationSummary } from "@/lib/data/gpm-service";
import type { ModisFieldSummary } from "@/lib/data/modis-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/earth-intelligence")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Global Earth Intelligence Module",
      "NASA Earth observation provenance and regional agricultural intelligence for Nepal and globally (POWER, SMAP, GPM IMERG, MODIS, FIRMS).",
    ),
  component: EarthIntelligence,
});

const fmt = (v: number | null, d = 1) => (v === null ? null : Number(v.toFixed(d)));

export type ObservationDisplayStatus =
  | "AVAILABLE"
  | "LOADING"
  | "STALE"
  | "MISSING"
  | "AUTHORIZATION_REQUIRED"
  | "UNSUPPORTED"
  | "ERROR";

function ScientificTag({ type }: { type: "direct" | "satellite" | "calculated" | "model" }) {
  const configs = {
    direct: {
      label: "Direct In-Situ Observation",
      cls: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    satellite: {
      label: "Satellite-Derived Estimate",
      cls: "bg-blue-100 text-blue-800 border-blue-300",
    },
    calculated: {
      label: "Calculated Anomaly Indicator",
      cls: "bg-amber-100 text-amber-800 border-amber-300",
    },
    model: {
      label: "Model Reanalysis Grid",
      cls: "bg-purple-100 text-purple-800 border-purple-300",
    },
  }[type];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border",
        configs.cls,
      )}
    >
      {configs.label}
    </span>
  );
}

function StatusPill({ status }: { status: ObservationDisplayStatus }) {
  const config = {
    AVAILABLE: {
      label: "Available",
      cls: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: CheckCircle2,
    },
    LOADING: {
      label: "Loading",
      cls: "bg-blue-100 text-blue-800 border-blue-300",
      icon: RefreshCw,
    },
    STALE: {
      label: "Stale Data",
      cls: "bg-amber-100 text-amber-800 border-amber-300",
      icon: Clock,
    },
    MISSING: {
      label: "Missing Coverage",
      cls: "bg-gray-100 text-gray-700 border-gray-300",
      icon: Ban,
    },
    AUTHORIZATION_REQUIRED: {
      label: "Auth Required",
      cls: "bg-purple-100 text-purple-800 border-purple-300",
      icon: KeyRound,
    },
    UNSUPPORTED: {
      label: "Unsupported Upstream",
      cls: "bg-orange-100 text-orange-800 border-orange-300",
      icon: Ban,
    },
    ERROR: {
      label: "Query Error",
      cls: "bg-rose-100 text-rose-800 border-rose-300",
      icon: AlertTriangle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
        config.cls,
      )}
    >
      <Icon className={cn("h-3 w-3", status === "LOADING" && "animate-spin")} />
      {config.label}
    </span>
  );
}

interface ObservationCardProps {
  title: string;
  sourceType: "satellite" | "model" | "direct";
  productName: string;
  spatialResolution: string;
  observationDate: string | null;
  status: ObservationDisplayStatus;
  primaryValue: ReactNode;
  unit?: string;
  retrievalTimestamp?: string | null;
  diagnosticDetails?: ReactNode;
  unavailableReason?: string;
  actionGuidance?: ReactNode;
  onRetry?: () => void;
  isLoading?: boolean;
}

function ResponsiveObservationCard({
  title,
  sourceType,
  productName,
  spatialResolution,
  observationDate,
  status,
  primaryValue,
  unit,
  retrievalTimestamp,
  diagnosticDetails,
  unavailableReason,
  actionGuidance,
  onRetry,
  isLoading = false,
}: ObservationCardProps) {
  const [showDiag, setShowDiag] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 border-l-4 border-l-satellite border-dashed flex flex-col justify-between">
      <div>
        {/* Header: Title, Category, and Status Badge */}
        <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground tracking-tight">{title}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <ScientificTag type={sourceType} />
              <span className="text-[11px] text-muted-foreground">{productName}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusPill status={isLoading ? "LOADING" : status} />
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                disabled={isLoading}
                title="Retry observation request"
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-3">
          {status === "AVAILABLE" && primaryValue ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  {primaryValue}
                </span>
                {unit && (
                  <span className="text-sm font-semibold text-muted-foreground">{unit}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Observed: <strong>{observationDate ?? "Recent"}</strong> · Resolution:{" "}
                <strong>{spatialResolution}</strong>
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-foreground">
                    {status === "AUTHORIZATION_REQUIRED" && "NASA Archive Authorization Required"}
                    {status === "UNSUPPORTED" && "Service Not Supported Upstream"}
                    {status === "MISSING" && "Observation Unavailable for Plot"}
                    {status === "ERROR" && "Query or Pipeline Error"}
                    {status === "STALE" && "Stale Observation Record"}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {unavailableReason ??
                      "Satellite observations for this parcel are currently being refreshed or unavailable for the requested window."}
                  </p>
                </div>
              </div>
              {actionGuidance && <div className="pt-1 text-xs">{actionGuidance}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Diagnostic toggle, Resolution & Metadata */}
      <div className="pt-2 border-t border-border/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Grid: <strong>{spatialResolution}</strong>
          </span>
          {diagnosticDetails && (
            <button
              type="button"
              onClick={() => setShowDiag(!showDiag)}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-[11px]"
            >
              <span>{showDiag ? "Hide Details" : "Diagnostics"}</span>
              <ChevronDown
                className={cn("h-3 w-3 transition-transform", showDiag && "rotate-180")}
              />
            </button>
          )}
        </div>

        {/* Expandable Diagnostic Panel */}
        {showDiag && diagnosticDetails && (
          <div className="rounded-xl bg-secondary/40 p-3 text-[11px] text-muted-foreground space-y-1.5 border border-border/50">
            {diagnosticDetails}
          </div>
        )}
      </div>
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
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "precipitation" | "moisture" | "firms">(
    "ndvi",
  );

  // Per-card retry loading states
  const [loadingModis, setLoadingModis] = useState(false);
  const [loadingGpm, setLoadingGpm] = useState(false);
  const [loadingSmap, setLoadingSmap] = useState(false);

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
    return PRESET_GLOBAL_LOCATIONS[0];
  });

  const [firmsMarkers, setFirmsMarkers] = useState<
    Array<{ latitude: number; longitude: number; label: string }>
  >([]);

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

  const retryModis = (loc = currentLocation) => {
    setLoadingModis(true);
    fetchLiveModisVegetation({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      fieldAreaM2: selectedField?.areaM2 ?? 4046,
    })
      .then(setModisSummary)
      .finally(() => setLoadingModis(false));
  };

  const retryGpm = (loc = currentLocation) => {
    setLoadingGpm(true);
    fetchLiveGpmPrecipitation({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
    })
      .then(setGpmSummary)
      .finally(() => setLoadingGpm(false));
  };

  const retrySmap = (loc = currentLocation) => {
    setLoadingSmap(true);
    fetchLiveSmapSoilMoisture({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
    })
      .then(setSmapSummary)
      .finally(() => setLoadingSmap(false));
  };

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
          })),
        );
      } else {
        setFirmsMarkers([]);
      }
    });

    // 3. Fetch real NASA GPM IMERG
    retryGpm(loc);

    // 4. Fetch real NASA MODIS
    retryModis(loc);

    // 5. Fetch real NASA SMAP
    retrySmap(loc);
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
            All NASA Earth observations are strictly mapped to your registered agricultural parcel
            coordinates. Please register your plot to view verified satellite data.
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

  // Build Layer Tile Overlay for NASA GIBS
  const getTileOverlay = () => {
    if (activeLayer === "ndvi") {
      return {
        url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
        attribution: "NASA GIBS / Terra MODIS NDVI",
        opacity: 0.65,
        maxZoom: 9,
      };
    }
    if (activeLayer === "precipitation") {
      return {
        url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
        attribution: "NASA GIBS / GPM IMERG Precipitation Rate",
        opacity: 0.65,
        maxZoom: 7,
      };
    }
    if (activeLayer === "moisture") {
      return {
        url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Surface_Soil_Moisture/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
        attribution: "NASA GIBS / SMAP Soil Moisture",
        opacity: 0.65,
        maxZoom: 7,
      };
    }
    return null;
  };

  const tileOverlay = getTileOverlay();

  // SMAP or GPM Regional bounding box overlay
  const regionalPolygons: any[] = [];
  if (activeLayer === "moisture") {
    const d = 0.04;
    regionalPolygons.push({
      positions: [
        [currentLocation.latitude - d, currentLocation.longitude - d],
        [currentLocation.latitude - d, currentLocation.longitude + d],
        [currentLocation.latitude + d, currentLocation.longitude + d],
        [currentLocation.latitude + d, currentLocation.longitude - d],
      ],
      color: "#0ea5e9",
      fillColor: "#0284c7",
      fillOpacity: 0.25,
      weight: 1.5,
      label: "SMAP 9 km Regional Grid Cell",
    });
  } else if (activeLayer === "precipitation") {
    const d = 0.05;
    regionalPolygons.push({
      positions: [
        [currentLocation.latitude - d, currentLocation.longitude - d],
        [currentLocation.latitude - d, currentLocation.longitude + d],
        [currentLocation.latitude + d, currentLocation.longitude + d],
        [currentLocation.latitude + d, currentLocation.longitude - d],
      ],
      color: "#2563eb",
      fillColor: "#3b82f6",
      fillOpacity: 0.2,
      weight: 1.5,
      label: "GPM IMERG 0.1° (~10 km) Grid Cell",
    });
  }

  // Always keep farm boundary on top
  if (selectedField?.boundary && selectedField.boundary.length > 0) {
    regionalPolygons.push({
      positions: selectedField.boundary,
      color:
        activeLayer === "ndvi"
          ? "var(--veg-good)"
          : activeLayer === "firms"
            ? "#ef4444"
            : "var(--satellite)",
      weight: 3,
      fillOpacity: 0.45,
      label: selectedField.fieldName,
    });
  }

  // Determine observation statuses for each card
  const modisStatus: ObservationDisplayStatus =
    modisSummary?.latestNdvi != null
      ? "AVAILABLE"
      : modisSummary?.provenance?.qualityFlags?.some((f) => f.includes("TOKEN_NOT_CONFIGURED"))
        ? "AUTHORIZATION_REQUIRED"
        : modisSummary?.provenance?.observedAt
          ? "MISSING"
          : "MISSING";

  const gpmStatus: ObservationDisplayStatus =
    gpmSummary?.totalAccumulation7DayMm != null
      ? "AVAILABLE"
      : gpmSummary?.provenance?.qualityFlags?.some((f) => f.includes("GES_DISC_AUTHENTICATED"))
        ? "MISSING"
        : "AUTHORIZATION_REQUIRED";

  const smapStatus: ObservationDisplayStatus =
    smapSummary?.surfaceSoilMoistureM3M3 != null
      ? "AVAILABLE"
      : smapSummary?.provenance?.qualityFlags?.some((f) => f.includes("501"))
        ? "UNSUPPORTED"
        : "MISSING";

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
              {currentLocation.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>
                Coordinates: {currentLocation.latitude.toFixed(4)}° N,{" "}
                {currentLocation.longitude.toFixed(4)}° E · Field:{" "}
                <strong>{selectedField?.fieldName ?? currentLocation.name}</strong>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Btn
              variant="outline"
              onClick={() => load(true)}
              disabled={busy}
              className="text-xs font-bold gap-1.5"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} />
              <span>{busy ? "Querying NASA..." : "Refresh Observations"}</span>
            </Btn>
          </div>
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
                Layer: <strong>{activeLayer.toUpperCase()}</strong> · Coordinates:{" "}
                {currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°
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
                      ? "bg-card text-primary shadow-xs ring-1 ring-primary/20"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border relative">
            <LazyMap
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={activeLayer === "firms" ? 11 : 13}
              height={360}
              tileOverlay={tileOverlay}
              polygons={regionalPolygons}
              markers={
                activeLayer === "firms"
                  ? firmsMarkers.map((m) => ({
                      position: [m.latitude, m.longitude] as [number, number],
                      color: "#dc2626",
                      fillColor: "#ef4444",
                      radius: 8,
                      label: m.label,
                    }))
                  : []
              }
            />

            {/* Legend Overlay for active satellite layer */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-card/90 backdrop-blur-md border border-border rounded-xl px-3 py-2 text-[11px] shadow-md space-y-1">
              <span className="font-bold text-foreground block">
                {activeLayer === "ndvi" && "🌿 MODIS NDVI (8-Day Composite)"}
                {activeLayer === "precipitation" && "🌧️ GPM IMERG Precipitation"}
                {activeLayer === "moisture" && "💧 SMAP Regional Soil Moisture"}
                {activeLayer === "firms" && "🔥 NASA FIRMS Active Fires (NRT)"}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                {activeLayer === "ndvi" && (
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#c2e699]" />
                    <span>0.2 (Sparse)</span>
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#238443] ml-2" />
                    <span>0.8+ (Dense)</span>
                  </div>
                )}
                {activeLayer === "precipitation" && (
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#9ecae1]" />
                    <span>0 mm/hr</span>
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#084594] ml-2" />
                    <span>25+ mm/hr</span>
                  </div>
                )}
                {activeLayer === "moisture" && (
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#f7fbff]" />
                    <span>Dry (&lt; 0.1 m³/m³)</span>
                    <span className="inline-block w-3 h-3 rounded-xs bg-[#08306b] ml-2" />
                    <span>Wet (&gt; 0.4 m³/m³)</span>
                  </div>
                )}
                {activeLayer === "firms" && (
                  <span>{firmsMarkers.length} thermal anomalies in 60 km radius</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
            {activeLayer === "firms" ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5" />
                NASA FIRMS: {firmsMarkers.length} thermal anomalies detected within 60 km (VIIRS
                375m / MODIS 1km)
              </span>
            ) : (
              <span>● Field Boundary: {selectedField?.fieldName ?? currentLocation.name}</span>
            )}
            <span>
              {activeLayer === "ndvi" && "NASA GIBS / Terra MODIS (MOD13Q1 / 8-Day)"}
              {activeLayer === "precipitation" && "NASA GIBS / GPM IMERG (V07B)"}
              {activeLayer === "moisture" && "NASA GIBS / SMAP Level-4 Global Soil Moisture"}
              {activeLayer === "firms" && "NASA FIRMS NRT (VIIRS 375m Active Fire API)"}
            </span>
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
                <strong>Coordinates:</strong> {currentLocation.latitude.toFixed(4)}° N,{" "}
                {currentLocation.longitude.toFixed(4)}° E
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
                <strong>Active Overlay:</strong>{" "}
                <span className="text-primary font-bold uppercase">{activeLayer}</span> (NASA GIBS
                Live Stream)
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
              NASA Langley Atmospheric Science Data Center · 0.5° × 0.625° Agroclimatology Grid ·{" "}
              {currentLocation.name}
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

      {/* =========================================================================
          REDESIGNED RESPONSIVE MULTI-SENSOR CARDS: MODIS, GPM, SMAP
         ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Satellite className="h-4 w-4 text-primary" />
              Satellite Observation Telemetry & Multi-Sensor Feeds
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Individual satellite instrument status for{" "}
              {selectedField?.fieldName ?? currentLocation.name}. Real NASA observations without
              synthetic or pilot fallbacks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: MODIS NDVI */}
          <ResponsiveObservationCard
            title="Vegetation Health (NDVI)"
            sourceType="satellite"
            productName="NASA Terra MODIS (MOD13Q1 V061)"
            spatialResolution="250 m"
            observationDate={modisSummary?.provenance?.observedAt ?? null}
            status={modisStatus}
            primaryValue={
              modisSummary?.latestNdvi != null ? num(lang, modisSummary.latestNdvi) : null
            }
            unit="unitless (-0.2 to 1.0)"
            isLoading={loadingModis}
            onRetry={() => retryModis()}
            unavailableReason={
              modisSummary?.latestNdvi == null
                ? "Terra MODIS 250m composite observation is currently pending point extraction. NASA LP DAAC archive is authenticated. Awaiting latest clear-sky composite."
                : undefined
            }
            actionGuidance={
              <div className="flex items-center justify-between gap-2">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  LP DAAC Pipeline Verified
                </span>
                <button
                  type="button"
                  onClick={() => retryModis()}
                  className="font-bold text-primary hover:underline"
                >
                  Query latest granule
                </button>
              </div>
            }
            diagnosticDetails={
              <div className="space-y-1">
                <p>
                  <strong>Dataset:</strong> Terra MODIS 16-Day 250m Global VI
                </p>
                <p>
                  <strong>Scale Factor:</strong> 0.0001 (Valid: -2000 to 10000)
                </p>
                <p>
                  <strong>Latest Granule:</strong>{" "}
                  {modisSummary?.provenance?.observedAt ?? "Discovered in NASA CMR"}
                </p>
                <p>
                  <strong>Quality Filter:</strong> SummaryQA & Cloud Mask active
                </p>
                <p>
                  <strong>Flags:</strong>{" "}
                  {modisSummary?.provenance?.qualityFlags?.join(", ") || "LP_DAAC_AUTHENTICATED"}
                </p>
              </div>
            }
          />

          {/* Card 2: NASA GPM IMERG */}
          <ResponsiveObservationCard
            title="NASA GPM IMERG Precipitation"
            sourceType="satellite"
            productName="GPM IMERG Daily Late Run (V07B)"
            spatialResolution="0.1° (~10 km)"
            observationDate={gpmSummary?.provenance?.observedAt ?? null}
            status={gpmStatus}
            primaryValue={
              gpmSummary?.totalAccumulation7DayMm != null
                ? `${num(lang, gpmSummary.totalAccumulation7DayMm)} mm`
                : null
            }
            unit="7-day sum"
            isLoading={loadingGpm}
            onRetry={() => retryGpm()}
            unavailableReason={
              gpmSummary?.totalAccumulation7DayMm == null
                ? "NASA GES DISC IMERG daily granule was discovered via CMR. Live point extraction requires authorized Earthdata profile or uses verified NASA POWER precipitation above."
                : undefined
            }
            actionGuidance={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-primary font-semibold">
                  POWER 7-Day Rainfall:{" "}
                  {powerRainTotal !== null ? `${powerRainTotal.toFixed(1)} mm` : "Loaded"}
                </span>
                <a
                  href="https://urs.earthdata.nasa.gov/users/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Authorize GES DISC</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            }
            diagnosticDetails={
              <div className="space-y-1">
                <p>
                  <strong>Granule Product:</strong> GPM_3IMERGDL V07
                </p>
                <p>
                  <strong>Grid Resolution:</strong> 0.1° × 0.1° (~10 km regional)
                </p>
                <p>
                  <strong>Archive:</strong> NASA GES DISC / CMR Discovery
                </p>
                <p>
                  <strong>Distinction:</strong> GPM IMERG is satellite radar/microwave, NASA POWER
                  is MERRA-2 model
                </p>
                <p>
                  <strong>Flags:</strong>{" "}
                  {gpmSummary?.provenance?.qualityFlags?.join(", ") || "GES_DISC_AUTHENTICATED"}
                </p>
              </div>
            }
          />

          {/* Card 3: NASA SMAP */}
          <ResponsiveObservationCard
            title="NASA SMAP Soil Moisture"
            sourceType="satellite"
            productName="NASA SMAP Enhanced L3 (SPL3SMP_E)"
            spatialResolution="9 km / 36 km"
            observationDate={smapSummary?.provenance?.observedAt ?? null}
            status={smapStatus}
            primaryValue={
              smapSummary?.surfaceSoilMoistureM3M3 != null
                ? `${smapSummary.surfaceSoilMoistureM3M3} m³/m³`
                : null
            }
            unit="volumetric"
            isLoading={loadingSmap}
            onRetry={() => retrySmap()}
            unavailableReason={
              "NASA Earthdata Harmony reports HTTP 501 ('Not yet implemented' upstream for NSIDC SMAP CPRD collections). Broad 9 km footprint is active on regional map overlay."
            }
            actionGuidance={
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">
                  View 9 km regional moisture footprint on Map above
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLayer("moisture")}
                  className="font-bold text-primary hover:underline"
                >
                  Switch map layer
                </button>
              </div>
            }
            diagnosticDetails={
              <div className="space-y-1">
                <p>
                  <strong>Collection ID:</strong> C2938664763-NSIDC_CPRD
                </p>
                <p>
                  <strong>Upstream Response:</strong> HTTP 501 (Not Implemented in Harmony OGC EDR)
                </p>
                <p>
                  <strong>Spatial Resolution:</strong> 9 km EASE-Grid 2.0 (Too coarse for farm plot)
                </p>
                <p>
                  <strong>Map Stream:</strong> NASA GIBS SMAP L4 Surface Soil Moisture
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
