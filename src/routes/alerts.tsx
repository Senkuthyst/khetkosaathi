import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, SlidersHorizontal, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageTitle, DataCard, Btn } from "@/components/kit";
import { ThresholdEditor } from "@/components/ThresholdEditor";
import { useApp } from "@/lib/store";
import { currentAlerts } from "@/lib/derived";
import { freshness } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Farm Alerts & Threshold Diagnostics",
      "Rules-based farm anomaly alerts with severity rating, sensor observation dates, sources, and adjustable alert thresholds."
    ),
  component: Alerts,
});

function Alerts() {
  const { t, lang, thresholds } = useApp();
  const [edit, setEdit] = useState(false);
  const alerts = currentAlerts(thresholds);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              <Bell className="h-3.5 w-3.5" />
              <span>Diagnostic Warning System</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              {t("alerts")}{" "}
              <span className="text-sm font-bold text-primary bg-secondary px-2.5 py-0.5 rounded-full">
                {num(lang, alerts.length)} Active
              </span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{t("demoNote")}</p>
          </div>

          <Btn
            variant="outline"
            className="self-start sm:self-auto px-4 py-2 text-xs font-bold"
            aria-expanded={edit}
            onClick={() => setEdit(!edit)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("editThresholds")}
          </Btn>
        </div>
      </div>

      {/* Threshold Editor Section */}
      {edit && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-extrabold text-base text-foreground">{t("thresholds")}</h2>
            <span className="text-xs text-muted-foreground">{t("thresholdsNote")}</span>
          </div>
          <ThresholdEditor />
        </section>
      )}

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">{t("noAlerts")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            All environmental indicators (rainfall, temperature, soil moisture, and vegetative indices) are within your configured bounds.
          </p>
        </div>
      )}

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map((a) => (
          <DataCard
            key={a.id}
            title={t(a.key)}
            source={a.source}
            observedAt={a.time}
            scale={a.source === "station" ? t("pointScale") : "30 m"}
            freshness={freshness(a.time, a.source === "station" ? 2 : 72)}
            icon={<Bell className="h-4 w-4 shrink-0 text-primary" />}
          >
            <div className="mt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold",
                  a.severity === "high"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : a.severity === "medium"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {t("severity")}: {t(a.severity === "high" ? "sevHigh" : a.severity === "medium" ? "sevMed" : "sevLow")}
              </span>
            </div>

            {a.id === "veg" && (
              <p className="mt-3 text-xs sm:text-sm text-satellite leading-relaxed bg-satellite-soft/50 p-3 rounded-xl border border-satellite/20">
                {t("changeText")}
              </p>
            )}
            {a.id === "gap" && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl">
                {t("stationGap")}
              </p>
            )}
            {a.id === "rain" && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl">
                {t("incompleteRain")}
              </p>
            )}
          </DataCard>
        ))}
      </div>
    </div>
  );
}
