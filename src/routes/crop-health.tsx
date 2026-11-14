import { createFileRoute } from "@tanstack/react-router";
import { Leaf, AlertTriangle, Satellite, Info, ShieldCheck } from "lucide-react";
import { PageTitle, DataCard } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { VegetationChart } from "@/components/Charts";
import { InspectionLog } from "@/components/InspectionLog";
import { useApp } from "@/lib/store";
import { summary } from "@/lib/derived";
import { pilotField, neighbourFields, freshness } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/crop-health")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Crop Health & Phenology",
      "Explore satellite vegetation trends (NDVI/EVI), uncertainty bounds, pilot field polygons, and field inspection records."
    ),
  component: CropHealth,
});

function CropHealth() {
  const { t, lang, field } = useApp();
  const { veg, lastVeg, vegBelow } = summary();
  const source = lastVeg?.sensor ?? "landsat";
  const date = lastVeg?.date ?? null;
  const scale = source === "landsat" ? "30 m" : "~250 m";
  const meta = { source, observedAt: date, scale, freshness: freshness(date, 72) };

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
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {t("demoNote")} · Chitwan Pilot Parcels (Bharatpur-14)
        </p>
      </div>

      {/* Map Card */}
      <DataCard title={t("map")} {...meta} icon={<Leaf className="h-5 w-5 text-satellite" />}>
        <div className="rounded-xl overflow-hidden border border-border my-2">
          <LazyMap
            center={pilotField.boundary[0] ?? [27.6775, 84.4333]}
            zoom={16}
            height={320}
            polygons={[
              {
                positions: field?.boundary ?? pilotField.boundary,
                color: "var(--veg-low)",
                label: t("vegLow"),
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

      {/* Satellite Sensor Confidence & Metadata */}
      <DataCard title={t("changeAlert")} {...meta} icon={<AlertTriangle className="h-5 w-5 text-satellite" />}>
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
