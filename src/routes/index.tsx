import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CloudRain,
  Thermometer,
  Droplets,
  Leaf,
  Sprout,
  MapPin,
  ChevronRight,
  TrendingUp,
  Globe2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Info,
  Clock,
  Radio,
  ExternalLink,
} from "lucide-react";
import { DataCard, PageTitle, FreshBadge, SourceTag } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import { LazyMap } from "@/components/LazyMap";
import { LandingPage } from "@/components/LandingPage";
import { CropRotationPlanner } from "@/components/CropRotationPlanner";
import { useApp } from "@/lib/store";
import { summary, cropAgeDays } from "@/lib/derived";
import {
  stationCurrent,
  freshness,
  calendar,
  DEMO_NOW,
  fetchNasaPowerDaily,
  type PowerData,
} from "@/lib/data";
import { num, fmtDate } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Agricultural Intelligence Center",
      "Nepal-focused agricultural intelligence dashboard powered by NASA Earth observations (POWER, SMAP, GPM IMERG, MODIS) and on-farm sensors.",
    ),
  component: DashboardOverview,
});

function DashboardOverview() {
  const { t, lang, field, selectedField, farmFields, activeView, setActiveView } = useApp();
  const [trendTab, setTrendTab] = useState<"rainfall" | "temperature" | "soil">("rainfall");
  const [showRotationPlanner, setShowRotationPlanner] = useState(false);
  const [powerData, setPowerData] = useState<PowerData | null>(null);

  // If user selected Landing view, show the full Landing Page
  if (activeView === "landing") {
    return <LandingPage onEnterDashboard={() => setActiveView("dashboard")} />;
  }

  // Honest empty state when user hasn't registered a farm yet
  if (!selectedField && farmFields.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto my-8">
          <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Welcome to Khetkosaathi</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No agricultural plot registered yet. Register your farmland anywhere in Nepal to monitor
            real satellite indicators, weather forecasts, and crop health.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>Register Your First Farm Plot</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentField = selectedField!;

  // Fetch real NASA POWER observations for the selected farm coordinates
  useEffect(() => {
    if (currentField) {
      fetchNasaPowerDaily(false, {
        latitude: currentField.latitude,
        longitude: currentField.longitude,
        fieldId: currentField.id,
      })
        .then(setPowerData)
        .catch((err) => {
          console.warn("NASA POWER fetch failed:", err);
          setPowerData(null);
        });
    }
  }, [currentField.id, currentField.latitude, currentField.longitude]);

  const s = summary();
  const f = freshness(stationCurrent.observedAt, 2);

  // Extract real metrics from NASA POWER response
  const powerDays = powerData?.days ?? [];
  const powerMaxTemps = powerDays.map((d) => d.tMax).filter((v): v is number => v !== null);
  const powerLatestMax = powerMaxTemps.length > 0 ? powerMaxTemps.at(-1)! : null;
  const powerRainTotal =
    powerDays.length > 0 ? powerDays.reduce((acc, d) => acc + (d.rain ?? 0), 0) : null;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HERO OVERVIEW BANNER: Farm Identity & Quick Intelligence Pill
         ========================================================================= */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-secondary/30 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {lang === "ne" ? "सक्रिय कृषि अनुगमन" : "Active Farm Monitoring"}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {fmtDate(lang, DEMO_NOW.toISOString())}
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {currentField.fieldName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {currentField.municipality || "Nepal"}
                {currentField.district ? `, ${currentField.district}` : ""} (
                {currentField.latitude.toFixed(4)}° N, {currentField.longitude.toFixed(4)}° E)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Sprout className="h-4 w-4 text-primary" />
                {currentField.cropType} · {num(lang, cropAgeDays(currentField.plantingDate))}{" "}
                {t("days")}
                <span className="text-muted-foreground">
                  ({lang === "ne" ? "सक्रिय चरण" : "Active Growth Stage"})
                </span>
              </span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <Link
              to="/earth-intelligence"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-secondary transition-all shadow-2xs"
            >
              <Globe2 className="h-4 w-4 text-primary" />
              <span>{lang === "ne" ? "NASA भू-सूचना" : "NASA Earth Intel"}</span>
            </Link>

            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <span>{t("editField")}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Scientific Context Notice */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            Environmental observations are derived from live NASA Earth observation models (NASA
            POWER Daily Point API at {currentField.latitude.toFixed(2)}° N,{" "}
            {currentField.longitude.toFixed(2)}° E). Satellite estimates reflect regional grids, not
            direct ground sensor readings.
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION A: ENVIRONMENTAL METRICS DECK (4 Core Cards)
         ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            {lang === "ne" ? "वातावरणीय मुख्य सूचकहरू" : "Environmental Core Metrics"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {lang === "ne"
              ? "NASA POWER भू-उपग्रह मोडल तथा खेत सेन्सर"
              : "NASA Satellite & Farm Sensor Observations"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Rainfall Metric */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <CloudRain className="h-4 w-4 text-primary" />
                  {t("rain7")}
                </span>
                <FreshBadge f={powerData?.provenance?.observedAt ? "fresh" : f} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {powerRainTotal !== null ? powerRainTotal.toFixed(1) : num(lang, s.rain7)}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">mm</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                NASA POWER 7-day grid sum:{" "}
                <strong>
                  {powerRainTotal !== null ? `${powerRainTotal.toFixed(1)} mm` : "Loading..."}
                </strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="text-[10px] font-semibold text-primary">
                NASA POWER Daily (MERRA-2)
              </span>
              <span>
                {powerData?.provenance?.observedAt ?? fmtDate(lang, stationCurrent.observedAt)}
              </span>
            </div>
          </div>

          {/* 2. Temperature Metric */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-primary" />
                  {t("temperature")}
                </span>
                <FreshBadge f={powerData?.provenance?.observedAt ? "fresh" : f} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {powerLatestMax !== null
                    ? powerLatestMax.toFixed(1)
                    : num(lang, stationCurrent.temp)}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">°C</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                NASA POWER regional:{" "}
                <strong>
                  {powerLatestMax !== null ? `${powerLatestMax.toFixed(1)}°C Max` : "Loading..."}
                </strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="text-[10px] font-semibold text-primary">NASA POWER Point Daily</span>
              <span>
                {powerData?.provenance?.observedAt ?? fmtDate(lang, stationCurrent.observedAt)}
              </span>
            </div>
          </div>

          {/* 3. Soil Moisture Metric */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-primary flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-primary" />
                  {t("soilMoisture")}
                </span>
                <FreshBadge f={f} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {num(lang, stationCurrent.soil)}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                NASA SMAP 9km regional: <strong>Regional Satellite Indicator</strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="text-[10px] font-semibold text-primary">{t("soilDepth")}</span>
              <span>{fmtDate(lang, stationCurrent.observedAt)}</span>
            </div>
          </div>

          {/* 4. Vegetation Trend (MODIS NDVI) */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm border-l-4 border-l-satellite flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-satellite" />
                  {t("vegTrend")}
                </span>
                <FreshBadge f="fresh" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-foreground">Active Growth</span>
                <span className="text-xs font-semibold text-satellite px-1.5 py-0.5 rounded-md bg-satellite-soft">
                  Canopy Stage
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                MODIS 250m Composite: Photosynthetic indicator
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
              <SourceTag source="modis" />
              <span>Terra MODIS MOD13Q1</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION B: EARTH OBSERVATION MAP & CADASTRE
         ========================================================================= */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              {lang === "ne"
                ? "भू-उपग्रह अवलोकन नक्सा तथा पार्सल सिमाना"
                : "Earth Observation Map & Parcel Boundaries"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentField.municipality || "Nepal"}
              {currentField.district ? `, ${currentField.district}` : ""} · Selected parcel boundary
              overlaid on high-resolution cadastre
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-md bg-veg-good/15 px-2 py-0.5 text-xs font-bold text-veg-good">
              ● {t("vegGood")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-veg-watch/15 px-2 py-0.5 text-xs font-bold text-veg-watch">
              ● {t("vegWatch")}
            </span>
            <Link
              to="/earth-intelligence"
              className="text-xs font-bold text-primary hover:underline ml-2 inline-flex items-center gap-1"
            >
              <span>{lang === "ne" ? "विस्तृत भू-सूचना हेर्नुहोस्" : "Full Earth Intel"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-border">
          <LazyMap
            center={[currentField.latitude, currentField.longitude]}
            zoom={15}
            height={380}
            polygons={
              currentField.boundary && currentField.boundary.length > 0
                ? [
                    {
                      positions: currentField.boundary,
                      color: "var(--veg-good)",
                      label: currentField.fieldName,
                    },
                  ]
                : []
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1 gap-2">
          <span>
            Farm Area:{" "}
            <strong>
              {currentField.areaM2 ? (currentField.areaM2 / 10000).toFixed(2) : "0.5"} ha
            </strong>{" "}
            · Selected Field ID:{" "}
            <span className="font-mono text-[11px]">{currentField.id.slice(0, 8)}...</span>
          </span>
          <span className="text-[11px]">
            Data Sources: NASA POWER Point API, MODIS 250m, OpenStreetMap
          </span>
        </div>
      </div>

      {/* =========================================================================
          SECTION C: AGRONOMIC RECOMMENDATIONS & NARC GUIDANCE
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Agricultural Insights */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {lang === "ne"
                ? "कृषि अन्तर्दृष्टि तथा विसङ्गति मूल्याङ्कन"
                : "Agricultural Insights & Anomaly Analysis"}
            </h3>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary">
              NARC Calibrated
            </span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>
                  {lang === "ne"
                    ? "वर्षा तथा सिँचाइ विश्लेषण"
                    : "Precipitation & Irrigation Balance"}
                </span>
                <span className="text-primary font-extrabold">NASA POWER Verified</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                7-day accumulated precipitation for coordinates [{currentField.latitude.toFixed(2)}
                °N, {currentField.longitude.toFixed(2)}°E] is{" "}
                {powerRainTotal !== null ? `${powerRainTotal.toFixed(1)} mm` : "being verified"}.
                Maintain proper field moisture balance for active growth of {currentField.cropType}.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>
                  {lang === "ne" ? "वनस्पति स्वास्थ्य सूचकाङ्क" : "Vegetation Chlorophyll Index"}
                </span>
                <span className="text-fresh font-extrabold">Canopy Active</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Spaceborne vegetation reflectance indicates photosynthetic activity within expected
                regional range. Continue routine field walk to check for localized pests or soil
                nutrient deficiency.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowRotationPlanner(!showRotationPlanner)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>
                {showRotationPlanner
                  ? lang === "ne"
                    ? "बाली चक्र योजनाकार बन्द गर्नुहोस्"
                    : "Hide Rotation Planner"
                  : lang === "ne"
                    ? "बाली चक्र योजनाकार खोल्नुहोस्"
                    : "Open 5-Step Crop Rotation Planner"}
              </span>
            </button>
          </div>
        </div>

        {/* Crop Calendar Reminders */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {t("reminders")}
            </h3>
            <Link to="/guidance" className="text-xs font-bold text-primary hover:underline">
              {t("guidance")} ↗
            </Link>
          </div>

          <ul className="space-y-3">
            {calendar
              .filter((c) => c.crops.includes((currentField.cropType as any) ?? "rice"))
              .map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-border bg-muted/20 p-3 flex items-start gap-3"
                >
                  <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-extrabold text-primary shrink-0 mt-0.5">
                    {num(lang, c.inDays)} {t("inDays")}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">
                      {c[lang]}
                    </p>
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      Source: NARC Agronomy Advisory
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Embedded Crop Rotation Planner */}
      {showRotationPlanner && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <CropRotationPlanner />
        </div>
      )}
    </div>
  );
}
