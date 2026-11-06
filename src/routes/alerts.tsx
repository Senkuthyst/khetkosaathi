import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, SlidersHorizontal } from "lucide-react";
import { PageTitle, DataCard, Btn } from "@/components/kit";
import { ThresholdEditor } from "@/components/ThresholdEditor";
import { useApp } from "@/lib/store";
import { currentAlerts } from "@/lib/derived";
import { freshness } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/alerts")({ head: () => pageHead("Farm alerts", "Rules-based pilot farm alerts with severity, observation dates, sources and adjustable thresholds."), component: Alerts });
function Alerts() {
  const { t, lang, thresholds } = useApp();
  const [edit, setEdit] = useState(false);
  const alerts = currentAlerts(thresholds);
  return <div className="space-y-4"><div className="flex items-start justify-between gap-3"><PageTitle>{t("alerts")} <span className="text-muted-foreground">{num(lang, alerts.length)}</span></PageTitle><Btn variant="outline" className="px-3 text-sm" aria-expanded={edit} onClick={() => setEdit(!edit)}><SlidersHorizontal className="h-4 w-4" />{t("editThresholds")}</Btn></div><p className="text-xs text-muted-foreground">{t("demoNote")}</p>
    {edit && <section className="border-y py-4"><h2 className="mb-3 font-bold">{t("thresholds")}</h2><ThresholdEditor /></section>}
    {alerts.length === 0 && <p className="py-8 text-center text-muted-foreground">{t("noAlerts")}</p>}
    {alerts.map(a => <DataCard key={a.id} title={t(a.key)} source={a.source} observedAt={a.time} scale={a.source === "station" ? t("pointScale") : "30 m"} freshness={freshness(a.time, a.source === "station" ? 2 : 72)} icon={<Bell className="h-4 w-4 shrink-0" />}><p className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-bold ${a.severity === "high" ? "bg-destructive/10 text-destructive" : a.severity === "medium" ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{t("severity")}: {t(a.severity === "high" ? "sevHigh" : a.severity === "medium" ? "sevMed" : "sevLow")}</p>{a.id === "veg" && <p className="mt-3 text-sm text-satellite">{t("changeText")}</p>}{a.id === "gap" && <p className="mt-3 text-xs text-muted-foreground">{t("stationGap")}</p>}{a.id === "rain" && <p className="mt-3 text-xs text-muted-foreground">{t("incompleteRain")}</p>}</DataCard>)}
  </div>;
}
