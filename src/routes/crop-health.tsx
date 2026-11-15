import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Leaf,
  AlertTriangle,
  Satellite,
  Info,
  ShieldCheck,
  ThermometerSun,
  Droplets,
  Sprout,
} from "lucide-react";
import { PageTitle, DataCard, Skeleton } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { VegetationChart, TrendChart } from "@/components/Charts";
import { InspectionLog } from "@/components/InspectionLog";
import { useApp } from "@/lib/store";
import { summary } from "@/lib/derived";
import { pilotField, neighbourFields, freshness } from "@/lib/data";
import { num, fmtDate } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import { fetchLiveAgroClimate, type AgroClimateResult } from "@/lib/data/nasa-client";

export const Route = createFileRoute("/crop-health")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Crop Health & Phenology",
      "Explore satellite vegetation trends (NDVI/EVI), uncertainty bounds, pilot field polygons, and field inspection records.",
    ),
  component: CropHealth,
});

function CropHealth() {
  const { t, lang, field, selectedField } = useApp();
  const { veg, lastVeg, vegBelow } = summary();
  const source = lastVeg?.sensor ?? "landsat";
  const date = lastVeg?.date ?? null;
  const scale = source === "landsat" ? "30 m" : "~250 m";
  const meta = { source, observedAt: date, scale, freshness: freshness(date, 72) };

  const [agroClimate, setAgroClimate] = useState<AgroClimateResult | null>(null);
  const [loadingAgro, setLoadingAgro] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingAgro(true);

    const lat = selectedField
      ? selectedField.latitude
      : (field?.boundary?.[0]?.[0] ?? pilotField.boundary[0][0]);
    const lon = selectedField
      ? selectedField.longitude
      : (field?.boundary?.[0]?.[1] ?? pilotField.boundary[0][1]);
    const cropId = selectedField?.cropType ?? field?.crop ?? "rice";
    const plantingDate = selectedField?.plantingDate ?? field?.plantingDate ?? "2026-06-15";

    fetchLiveAgroClimate({
      latitude: lat,
      longitude: lon,
      fieldId: selectedField?.id ?? field?.id ?? "crop-health",
      cropId,
      plantingDate,
    }).then((res) => {
      if (!cancelled) {
        setAgroClimate(res);
        setLoadingAgro(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedField, field]);

  const agroObsDate = agroClimate?.provenance?.observedAt ?? null;
  const agroMeta = {
    source: "nasa_power" as const,
    observedAt: agroObsDate,
    scale: "0.5° (~50 km)",
    freshness: freshness(agroObsDate, 120),
  };

  const fieldLocationLabel = selectedField
    ? `${selectedField.fieldName} (${selectedField.municipality || "Nepal"})`
    : t("demoNote");

  const centerCoords: [number, number] = selectedField
    ? [selectedField.latitude, selectedField.longitude]
    : [27.6775, 84.4333];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-satellite/10 px-2.5 py-0.5 text-xs font-bold text-satellite">
            Multi-spectral Canopy Analysis
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {t("cropHealth")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{fieldLocationLabel}</p>
      </div>

      {/* Map Card */}
      <DataCard title={t("map")} {...meta} icon={<Leaf className="h-5 w-5 text-satellite" />}>
        <div className="rounded-xl overflow-hidden border border-border my-2">
          <LazyMap
            center={centerCoords}
            zoom={16}
            height={320}
            polygons={[
              {
                positions:
                  selectedField?.boundary && selectedField.boundary.length > 0
                    ? selectedField.boundary
                    : (field?.boundary ?? pilotField.boundary),
                color: "var(--veg-low)",
                label: selectedField?.fieldName ?? t("vegLow"),
              },
              ...neighbourFields.map((f) => ({
                positions: f.boundary,
                color: f.status === "good" ? "var(--veg-good)" : "var(--veg-watch)",
                label: f.name,
              })),
            ]}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
          <span className="text-veg-good">● {t("vegGood")} (NDVI &gt; 0.65)</span>
          <span className="text-veg-watch">● {t("vegWatch")} (0.50 – 0.65)</span>
          <span className="text-veg-low">● {t("vegLow")} (&lt; 0.50)</span>
        </div>
      </DataCard>

      {/* Time-Series Chart */}
      <DataCard title={t("tsTitle")} {...meta}>
        <VegetationChart data={veg} />
        <div className="mt-3 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("cloudGap")}</span>
          <span className="font-semibold text-satellite">{t("noYield")}</span>
        </div>
      </DataCard>

      {/* Agro-Climate Card 1: Crop stage (GDD) */}
      <DataCard
        title={t("cropStageGdd")}
        {...agroMeta}
        icon={<ThermometerSun className="h-5 w-5 text-satellite" />}
      >
        {loadingAgro ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : agroClimate?.gdd.status === "success" && agroClimate.gdd.estimatedStage ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-foreground">
                  {lang === "ne" ? agroClimate.gdd.cropNameNe : agroClimate.gdd.cropNameEn}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({t("step")} {num(lang, agroClimate.gdd.estimatedStage.stageIndex)}/
                  {num(lang, agroClimate.gdd.estimatedStage.totalStages)})
                </span>
              </div>
              {agroClimate.gdd.isApproximate && (
                <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-[11px] font-bold">
                  {t("approximateBadge")}
                </span>
              )}
            </div>

            <div className="rounded-xl border border-primary/20 bg-secondary/30 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {lang === "ne"
                    ? agroClimate.gdd.estimatedStage.nameNe
                    : agroClimate.gdd.estimatedStage.nameEn}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {num(lang, agroClimate.gdd.cumulativeGdd ?? 0)} {t("thermalUnits")}
                </span>
              </div>
              <div className="mt-2.5 w-full bg-muted rounded-full h-3 overflow-hidden border border-border/40">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(5, agroClimate.gdd.progressToNextStagePct ?? 0))}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {t("progressToNextStage")}:{" "}
                  <strong>{num(lang, agroClimate.gdd.progressToNextStagePct ?? 0)}%</strong>
                </span>
                {agroClimate.gdd.estimatedStage.nextStageNameEn && (
                  <span>
                    Next:{" "}
                    {lang === "ne"
                      ? agroClimate.gdd.estimatedStage.nextStageNameNe
                      : agroClimate.gdd.estimatedStage.nextStageNameEn}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">
              {agroClimate.gdd.confidenceNote || t("gddReanalysisNote")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-muted/40 border border-border p-4 text-xs text-muted-foreground">
            {agroClimate?.gdd.reason || t("missing")}
          </div>
        )}
      </DataCard>

      {/* Agro-Climate Card 2: Water balance (14 days) */}
      <DataCard
        title={t("waterBalance14")}
        {...agroMeta}
        icon={<Droplets className="h-5 w-5 text-satellite" />}
      >
        {loadingAgro ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : agroClimate?.waterBalance.status === "success" ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border p-3 bg-muted/20">
                <dt className="text-muted-foreground">{t("rainfall")}</dt>
                <dd className="font-bold text-foreground mt-0.5">
                  {num(lang, agroClimate.waterBalance.totalRainfallMm ?? 0)} mm
                </dd>
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <dt className="text-muted-foreground">Reference ET₀</dt>
                <dd className="font-bold text-foreground mt-0.5">
                  {num(lang, agroClimate.waterBalance.totalEToMm ?? 0)} mm
                </dd>
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <dt className="text-muted-foreground">{t("netBalance")}</dt>
                <dd
                  className={`font-bold mt-0.5 ${(agroClimate.waterBalance.rollingNetMm ?? 0) >= 0 ? "text-emerald-700" : "text-amber-700"}`}
                >
                  {(agroClimate.waterBalance.rollingNetMm ?? 0) >= 0 ? "+" : ""}
                  {num(lang, agroClimate.waterBalance.rollingNetMm ?? 0)} mm
                </dd>
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <dt className="text-muted-foreground">{t("historicalPercentile")}</dt>
                <dd className="font-bold text-satellite mt-0.5">
                  {agroClimate.waterBalance.climatologicalPercentile !== null &&
                  agroClimate.waterBalance.climatologicalPercentile !== undefined
                    ? `${num(lang, agroClimate.waterBalance.climatologicalPercentile)}th`
                    : "—"}
                </dd>
              </div>
            </dl>

            {agroClimate.waterBalance.dailyBreakdown &&
              agroClimate.waterBalance.dailyBreakdown.length > 0 && (
                <div className="pt-2">
                  <TrendChart
                    data={agroClimate.waterBalance.dailyBreakdown}
                    series={[
                      {
                        key: "rainMm",
                        label: lang === "ne" ? "वर्षा (मि.मि.)" : "Rain (mm)",
                        bar: true,
                        color: "#2B6CB0",
                      },
                      {
                        key: "et0Mm",
                        label: lang === "ne" ? "वाष्पीकरण ET₀" : "ET₀ (mm)",
                        color: "#DD6B20",
                      },
                      {
                        key: "netMm",
                        label: lang === "ne" ? "खुद सन्तुलन" : "Net (mm)",
                        color: "#2F855A",
                      },
                    ]}
                    unit="mm"
                    height={190}
                  />
                </div>
              )}

            <div className="border-t border-border/60 pt-2 text-xs text-muted-foreground italic">
              {agroClimate.waterBalance.contextNote}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-muted/40 border border-border p-4 text-xs text-muted-foreground">
            {agroClimate?.waterBalance.reason || t("missing")}
          </div>
        )}
      </DataCard>

      {/* Satellite Sensor Confidence & Metadata */}
      <DataCard
        title={t("changeAlert")}
        {...meta}
        icon={<AlertTriangle className="h-5 w-5 text-satellite" />}
      >
        <div className="rounded-xl bg-secondary/50 border border-primary/20 p-3.5">
          <p className="text-xs sm:text-sm font-bold text-foreground">
            {t(vegBelow ? "changeText" : "vegGood")}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border p-3 bg-muted/20">
            <dt className="text-muted-foreground">{t("resolution")}</dt>
            <dd className="font-bold text-foreground mt-0.5">
              {source === "landsat" ? "Landsat" : "MODIS"} {scale}
            </dd>
          </div>
          <div className="rounded-xl border p-3 bg-muted/20">
            <dt className="text-muted-foreground">{t("cloud")}</dt>
            <dd className="font-bold text-foreground mt-0.5">
              {lastVeg ? `${num(lang, lastVeg.cloud)}%` : "—"}
            </dd>
          </div>
          <div className="rounded-xl border p-3 bg-muted/20">
            <dt className="text-muted-foreground">{t("quality")}</dt>
            <dd className="font-bold text-foreground mt-0.5">
              {lastVeg ? t(lastVeg.quality) : t("missing")}
            </dd>
          </div>
          <div className="rounded-xl border p-3 bg-muted/20">
            <dt className="text-muted-foreground">{t("confidence")}</dt>
            <dd className="font-bold text-satellite mt-0.5">
              {t(source === "modis" ? "low" : "medium")}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">{t("confReason")}</p>
      </DataCard>

      {/* Field Inspection Log (Preserved Supabase / Local Storage) */}
      <InspectionLog />
    </div>
  );
}
