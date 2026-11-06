import { createFileRoute } from "@tanstack/react-router";
import { Leaf, AlertTriangle } from "lucide-react";
import { PageTitle, DataCard } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { VegetationChart } from "@/components/Charts";
import { InspectionLog } from "@/components/InspectionLog";
import { useApp } from "@/lib/store";
import { summary } from "@/lib/derived";
import { pilotField, neighbourFields, freshness } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/crop-health")({ head: () => pageHead("Crop health", "Explore satellite vegetation trends, uncertainty and pilot field polygons; record field inspections."), component: CropHealth });
function CropHealth() {
  const { t, lang } = useApp();
  const { veg, lastVeg, vegBelow } = summary();
  const source = lastVeg?.sensor ?? "landsat";
  const date = lastVeg?.date ?? null;
  const scale = source === "landsat" ? "30 m" : "~250 m";
  const meta = { source, observedAt: date, scale, freshness: freshness(date, 72) };
  return <div className="space-y-4"><PageTitle>{t("cropHealth")}</PageTitle><p className="text-xs text-muted-foreground">{t("demoNote")}</p>
    <DataCard title={t("map")} {...meta} icon={<Leaf className="h-5 w-5 text-satellite" />}>
      <LazyMap center={pilotField.boundary[0] ?? [27.6775, 84.4333]} zoom={16} height={290} polygons={[{ positions: pilotField.boundary, color: "var(--veg-low)", label: t("vegLow") }, ...neighbourFields.map(f => ({ positions: f.boundary, color: f.status === "good" ? "var(--veg-good)" : "var(--veg-watch)", label: f.name }))]} />
      <div className="mt-3 flex flex-wrap gap-3 text-xs"><span className="text-veg-good">● {t("vegGood")}</span><span className="text-veg-watch">● {t("vegWatch")}</span><span className="text-veg-low">● {t("vegLow")}</span></div>
    </DataCard>
    <DataCard title={t("tsTitle")} {...meta}><VegetationChart data={veg} /><p className="mt-3 text-xs text-muted-foreground">{t("cloudGap")}</p><p className="mt-1 text-xs text-satellite">{t("noYield")}</p></DataCard>
    <DataCard title={t("changeAlert")} {...meta} icon={<AlertTriangle className="h-5 w-5 text-satellite" />}><p className="text-sm font-semibold">{t(vegBelow ? "changeText" : "vegGood")}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-muted-foreground">{t("resolution")}</dt><dd className="font-semibold">{source === "landsat" ? "Landsat" : "MODIS"} {scale}</dd></div><div><dt className="text-xs text-muted-foreground">{t("cloud")}</dt><dd>{lastVeg ? `${num(lang, lastVeg.cloud)}%` : "—"}</dd></div><div><dt className="text-xs text-muted-foreground">{t("quality")}</dt><dd>{lastVeg ? t(lastVeg.quality) : t("missing")}</dd></div><div><dt className="text-xs text-muted-foreground">{t("confidence")}</dt><dd className="font-semibold text-satellite">{t(source === "modis" ? "low" : "medium")}</dd></div></dl><p className="mt-3 text-xs text-muted-foreground">{t("confReason")}</p>
    </DataCard><InspectionLog />
  </div>;
}
