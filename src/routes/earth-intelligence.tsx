import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  imergPilot,
  modisPilot,
  pilotRisk,
  pilotSeasonalMaxTemp,
  powerPilot,
  rainfallAnomaly,
  smapPilot,
  pilotField,
  neighbourFields,
  computeScientificAnomalies,
  type PowerData,
  type Provenance,
  type RiskLevel,
} from "@/lib/data";
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
  const { t, lang } = useApp();
  const [power, setPower] = useState<PowerData | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"ndvi" | "precipitation" | "moisture">("ndvi");
  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(PRESET_GLOBAL_LOCATIONS[0]!);

  const load = (force = false, loc = currentLocation) => {
    setBusy(true);
    fetchNasaPowerDaily(force, {
      latitude: loc.latitude,
      longitude: loc.longitude,
      fieldId: loc.id,
    })
      .then(setPower)
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    load(false, currentLocation);
  }, [currentLocation]);

  const latest = modisPilot.composites.at(-1)!;
  const rainTotal = imergPilot.daily.reduce((a, b) => a + b, 0);
  const rainAnom = rainfallAnomaly(rainTotal, imergPilot.seasonalBaselineMm);
  const p = power ?? powerPilot;
  const maxes = p.days.map((d) => d.tMax).filter((v): v is number => v !== null);
  const meanMax = maxes.length ? maxes.reduce((a, b) => a + b, 0) / maxes.length : null;
  const tempAnom = meanMax === null ? null : meanMax - pilotSeasonalMaxTemp;
  const risk: RiskLevel = pilotRisk(latest.ndvi < latest.baselineLow, rainAnom, tempAnom);

  // Synthesize genuine scientific anomaly report across real observation streams
  const anomalyReport = computeScientificAnomalies({
    locationName: currentLocation.name,
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    temperatureObservations: p.days.map((d) => ({ tMax: d.tMax, tMin: d.tMin })),
    rainfallObservations: p.days.map((d) => ({ rain: d.rain })),
    modisNdvi: latest.ndvi,
    modisBaselineLow: latest.baselineLow,
    modisBaselineHigh: latest.baselineHigh,
    thermalHotspotsCount: 0,
    cropAgeDays: 45,
    cropType: "rice",
  });

  const riskCls = {
    low: "bg-fresh text-primary-foreground",
    moderate: "bg-stale text-accent-foreground",
    high: "bg-destructive text-destructive-foreground",
    critical: "bg-destructive text-destructive-foreground ring-4 ring-destructive/30",
    missing: "bg-missing text-primary-foreground",
  }[risk];

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
              Global Earth Observation Engine · Focus: {currentLocation.name} ({currentLocation.latitude.toFixed(4)}° N, {currentLocation.longitude.toFixed(4)}° E)
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
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
              {[
                { id: "ndvi", label: "MODIS NDVI" },
                { id: "precipitation", label: "GPM Rainfall" },
                { id: "moisture", label: "SMAP Soil" },
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
              polygons={[
                {
                  positions: pilotField.boundary,
                  color: activeLayer === "ndvi" ? "var(--veg-good)" : "var(--satellite)",
                  label: currentLocation.name,
                },
                ...neighbourFields.map((f) => ({
                  positions: f.boundary,
                  color: f.status === "good" ? "var(--veg-good)" : "var(--veg-watch)",
                  label: f.name,
                })),
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
            <span>● Green: Normal Phenology (NDVI &gt; 0.60) · ● Amber: Watch</span>
            <span>NASA MOD13Q1 V061 (LP DAAC)</span>
          </div>
        </div>

        {/* Integrated Risk Deck (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <Metric
            title={t("integratedRisk")}
            data={{ ...modisPilot.provenance, dataset: "MODIS + GPM + POWER", productId: "Multi-sensor analysis" }}
            type="calculated"
          >
            <div className="flex items-center gap-3">
              <span className={cn("rounded-full px-4 py-1.5 text-base font-extrabold shadow-xs", riskCls)}>
                {t(risk)}
              </span>
              <span className="text-xs text-muted-foreground">3 Sensor Signals</span>
            </div>
            <p className="mt-3 flex gap-2 text-xs text-foreground/80 leading-relaxed bg-muted/40 p-2.5 rounded-xl">
              <ShieldAlert className="h-4 w-4 shrink-0 text-accent-foreground mt-0.5" aria-hidden />
              <span>{t("pilotRiskNote")}</span>
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">{t("riskRule")}</p>
          </Metric>
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
            {power.provenance.mode === "pilot" && (
              <p role="alert" className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
                {t("powerFallback")}
              </p>
            )}
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
                  Daily Model Precipitation (mm)
                </span>
                <TrendChart
                  data={power.days}
                  unit="mm"
                  height={150}
                  series={[{ key: "rain", label: t("rainfall"), bar: true }]}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t">
              {t("powerContext")}
            </p>
            <div className="flex items-center justify-between">
              <SourceTag source="nasa_power" />
              <DataProvenance data={power.provenance} />
            </div>
          </div>
        )}
      </Card>

      {/* Multi-Sensor Grid: MODIS, GPM, SMAP */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Metric title={t("earthVegetation")} data={modisPilot.provenance} type="satellite">
          <p className="text-3xl font-extrabold text-foreground">{num(lang, latest.ndvi)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("seasonalPilot")}: <strong>{num(lang, latest.baselineLow)} – {num(lang, latest.baselineHigh)}</strong>
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t("composite16")}</p>
        </Metric>

        <Metric title={t("earthEvi")} data={modisPilot.provenance} type="satellite">
          <p className="text-3xl font-extrabold text-foreground">{num(lang, latest.evi)}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("eviContext")}</p>
        </Metric>

        <Metric title={t("rainfallAnomaly")} data={imergPilot.provenance} type="calculated">
          <p className="text-3xl font-extrabold text-amber-700">{signed(rainAnom, "%")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("sevenDayTotal")}: <strong>{num(lang, fmt(rainTotal)!)} mm</strong> · Baseline:{" "}
            <strong>{num(lang, imergPilot.seasonalBaselineMm)} mm</strong>
          </p>
        </Metric>

        <Metric title={t("temperatureAnomaly")} data={p.provenance} type="calculated">
          <p className="text-3xl font-extrabold text-primary">{signed(tempAnom, "°C")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("weeklyMaxMean")}:{" "}
            <strong>{meanMax === null ? t("missing") : `${num(lang, fmt(meanMax)!)}°C`}</strong> · Baseline:{" "}
            <strong>{num(lang, pilotSeasonalMaxTemp)}°C</strong>
          </p>
        </Metric>
      </div>

      {/* SMAP Soil Moisture Comparison */}
      <Metric title={t("soilComparison")} data={smapPilot.provenance} type="satellite">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-dashed border-satellite bg-satellite-soft/40 p-4">
            <p className="text-xs font-bold text-satellite">{t("surfaceRegional")}</p>
            <p className="text-3xl font-black text-foreground mt-1">{num(lang, smapPilot.surfaceVolumetric)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              m³/m³ volumetric · {num(lang, smapPilot.depthCm)} {t("depthCm")} (Topsoil horizon)
            </p>
          </div>

          <div className="rounded-xl border border-primary bg-secondary/40 p-4">
            <p className="text-xs font-bold text-primary">{t("pilotProbe")}</p>
            <p className="text-3xl font-black text-foreground mt-1">{num(lang, smapPilot.farmVolumetric)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              m³/m³ volumetric · {num(lang, smapPilot.farmDepthCm)} {t("depthCm")} (Active root zone)
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t("soilMismatch")}</p>
      </Metric>
    </div>
  );
}
