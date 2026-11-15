import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  RefreshCw,
  ShieldAlert,
  Satellite,
  Globe2,
  Flame,
  MapPin,
  Sprout,
  ChevronRight,
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
import type { MapPoly } from "@/components/FieldMap";
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
} from "@/lib/data";
import {
  fetchLiveFirmsHotspots,
  fetchLiveModisVegetation,
} from "@/lib/data/nasa-client";
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

type ActiveLayer = "ndvi" | "precipitation" | "moisture" | "firms";

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

function EarthIntelligence() {
  const { t, lang, selectedField, farmFields } = useApp();
  const [power, setPower] = useState<PowerData | null>(null);
  const [modisSummary, setModisSummary] = useState<ModisFieldSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>("ndvi");

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
  const [firmsStatus, setFirmsStatus] = useState<
    "AVAILABLE" | "AUTH_REQUIRED" | "DOWNLOAD_FAILED" | "MISSING_COVERAGE"
  >("MISSING_COVERAGE");

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

  const loadModis = (loc = currentLocation) => {
    fetchLiveModisVegetation({
      fieldId: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      fieldAreaM2: selectedField?.areaM2 ?? 4046,
    })
      .then(setModisSummary);
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

    // 2. Fetch real NASA FIRMS Active Thermal Anomaly Hotspots
    fetchLiveFirmsHotspots({
      latitude: loc.latitude,
      longitude: loc.longitude,
      radiusKm: 60,
    }).then((res) => {
      if (!res) {
        setFirmsStatus("DOWNLOAD_FAILED");
        setFirmsMarkers([]);
      } else if (res.queryStatus === "AUTH_REQUIRED") {
        setFirmsStatus("AUTH_REQUIRED");
        setFirmsMarkers([]);
      } else if (res.queryStatus === "DOWNLOAD_FAILED") {
        setFirmsStatus("DOWNLOAD_FAILED");
        setFirmsMarkers([]);
      } else if (res.detections.length > 0) {
        setFirmsStatus("AVAILABLE");
        setFirmsMarkers(
          res.detections.map((d) => ({
            latitude: d.latitude,
            longitude: d.longitude,
            label: `Hotspot: ${d.brightness}K (${d.instrument} ${d.confidence} conf)`,
          })),
        );
      } else {
        setFirmsStatus("MISSING_COVERAGE");
        setFirmsMarkers([]);
      }
    });

    // Fetch real NASA MODIS for the anomaly analysis panel.
    loadModis(loc);
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
    cropType: selectedField?.cropType ?? "rice",
  });

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
  const regionalPolygons: MapPoly[] = [];
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
                  onClick={() => setActiveLayer(layer.id as ActiveLayer)}
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
                <span
                  className={cn(
                    "font-bold",
                    firmsStatus === "AVAILABLE" ? "text-emerald-700" : "text-amber-700",
                  )}
                >
                  {firmsStatus === "AVAILABLE" &&
                    `Active (${firmsMarkers.length} detections in region)`}
                  {firmsStatus === "MISSING_COVERAGE" &&
                    "No detections returned for the requested period"}
                  {firmsStatus === "AUTH_REQUIRED" && "MAP_KEY authorization required"}
                  {firmsStatus === "DOWNLOAD_FAILED" && "Query failed"}
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

    </div>
  );
}
