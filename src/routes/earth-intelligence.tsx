import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, ShieldAlert } from "lucide-react";
import { Btn, Card, DataProvenance, FreshBadge, PageTitle, Skeleton, SourceTag } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import { useApp } from "@/lib/store";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import { fetchNasaPowerDaily, imergPilot, modisPilot, pilotRisk, pilotSeasonalMaxTemp, powerPilot, rainfallAnomaly, smapPilot, type PowerData, type Provenance, type RiskLevel } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/earth-intelligence")({
  head: () => pageHead("Earth Intelligence", "NASA Earth observation provenance and regional agricultural context for Chitwan, Nepal."),
  component: EarthIntelligence,
});

const fmt = (v: number | null, d = 1) => (v === null ? null : Number(v.toFixed(d)));

function Metric({ title, data, children }: { title: string; data: Provenance; children: ReactNode }) {
  const sat = data.source !== "nasa_power";
  return <section className={cn("rounded-2xl border bg-card p-4 shadow-sm border-l-4", sat ? "border-l-satellite border-dashed" : "border-l-station")}>
    <div className="mb-2 flex items-start justify-between gap-2">
      <h2 className="text-base font-bold">{title}</h2>
      <FreshBadge f={data.mode === "pilot" ? "stale" : data.observedAt ? "fresh" : "missing"} />
    </div>
    {children}
    <div className="mt-3 border-t pt-2"><SourceTag source={data.source} /></div>
    <DataProvenance data={data} />
  </section>;
}

function EarthIntelligence() {
  const { t, lang } = useApp();
  const [power, setPower] = useState<PowerData | null>(null);
  const [busy, setBusy] = useState(false);
  const load = (force = false) => { setBusy(true); fetchNasaPowerDaily(force).then(setPower).finally(() => setBusy(false)); };
  useEffect(() => { load(); }, []);

  const latest = modisPilot.composites.at(-1)!;
  const rainTotal = imergPilot.daily.reduce((a, b) => a + b, 0);
  const rainAnom = rainfallAnomaly(rainTotal, imergPilot.seasonalBaselineMm);
  const p = power ?? powerPilot;
  const maxes = p.days.map(d => d.tMax).filter((v): v is number => v !== null);
  const meanMax = maxes.length ? maxes.reduce((a, b) => a + b, 0) / maxes.length : null;
  const tempAnom = meanMax === null ? null : meanMax - pilotSeasonalMaxTemp;
  const risk: RiskLevel = pilotRisk(latest.ndvi < latest.baselineLow, rainAnom, tempAnom);
  const riskCls = { low: "bg-fresh text-primary-foreground", moderate: "bg-stale text-accent-foreground", high: "bg-destructive text-destructive-foreground", critical: "bg-destructive text-destructive-foreground ring-4 ring-destructive/30", missing: "bg-missing text-primary-foreground" }[risk];
  const signed = (v: number | null, unit: string) => v === null ? t("missing") : `${v > 0 ? "+" : ""}${num(lang, fmt(v)!)}${unit}`;

  return <div className="space-y-4">
    <PageTitle>{t("earthIntelligence")}</PageTitle>
    <p className="text-sm font-semibold">{t("chitwanRegion")} · {num(lang, "27.6775")}° N, {num(lang, "84.4333")}° E</p>
    <p className="rounded-xl bg-secondary p-3 text-xs">{t("earthScope")}</p>

    <Metric title={t("integratedRisk")} data={{ ...modisPilot.provenance, dataset: "MODIS + GPM + POWER", productId: "Pilot rule" }}>
      <p className={cn("inline-block rounded-full px-4 py-1.5 text-lg font-bold", riskCls)}>{t(risk)}</p>
      <p className="mt-2 flex gap-2 text-sm"><ShieldAlert className="h-5 w-5 shrink-0 text-accent-foreground" aria-hidden />{t("pilotRiskNote")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("riskRule")}</p>
    </Metric>

    <Card>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold">{t("powerOverview")}</h2>
        <Btn variant="outline" className="min-h-10 px-3 text-xs" onClick={() => load(true)} disabled={busy} aria-label={t("refreshData")}><RefreshCw className={cn("h-4 w-4", busy && "animate-spin")} />{t("refreshData")}</Btn>
      </div>
      {!power ? <><p className="text-sm text-muted-foreground" role="status">{t("powerLoading")}</p><Skeleton className="mt-2 h-44" /></> : <>
        {power.provenance.mode === "pilot" && <p role="alert" className="mb-2 rounded-lg bg-stale/20 p-2 text-xs">{t("powerFallback")}</p>}
        <TrendChart data={power.days} unit="°C" series={[{ key: "tMax", label: t("maxTemperature") }, { key: "tMin", label: t("minTemperature") }]} />
        <TrendChart data={power.days} unit="mm" height={120} series={[{ key: "rain", label: t("rainfall"), bar: true }]} />
        <p className="mt-2 text-xs text-muted-foreground">{t("powerContext")}</p>
        <div className="mt-2"><SourceTag source="nasa_power" /></div>
        <DataProvenance data={power.provenance} />
      </>}
    </Card>

    <div className="grid gap-4 sm:grid-cols-2">
      <Metric title={t("earthVegetation")} data={modisPilot.provenance}>
        <p className="text-3xl font-bold">{num(lang, latest.ndvi)}</p>
        <p className="text-xs">{t("seasonalPilot")}: {num(lang, latest.baselineLow)} – {num(lang, latest.baselineHigh)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("composite16")}</p>
      </Metric>
      <Metric title={t("earthEvi")} data={modisPilot.provenance}>
        <p className="text-3xl font-bold">{num(lang, latest.evi)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("eviContext")}</p>
      </Metric>
      <Metric title={t("rainfallAnomaly")} data={imergPilot.provenance}>
        <p className="text-3xl font-bold">{signed(rainAnom, "%")}</p>
        <p className="text-xs">{t("sevenDayTotal")}: {num(lang, fmt(rainTotal)!)} mm · {t("seasonalPilot")}: {num(lang, imergPilot.seasonalBaselineMm)} mm</p>
      </Metric>
      <Metric title={t("temperatureAnomaly")} data={p.provenance}>
        <p className="text-3xl font-bold">{signed(tempAnom, "°C")}</p>
        <p className="text-xs">{t("weeklyMaxMean")}: {meanMax === null ? t("missing") : `${num(lang, fmt(meanMax)!)}°C`} · {t("seasonalPilot")}: {num(lang, pilotSeasonalMaxTemp)}°C</p>
      </Metric>
    </div>

    <Metric title={t("soilComparison")} data={smapPilot.provenance}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-dashed border-satellite p-3"><p className="text-xs">{t("surfaceRegional")}</p><p className="text-2xl font-bold">{num(lang, smapPilot.surfaceVolumetric)}</p><p className="text-xs text-muted-foreground">m³/m³ · {num(lang, smapPilot.depthCm)} {t("depthCm")}</p></div>
        <div className="rounded-xl border border-station p-3"><p className="text-xs">{t("pilotProbe")}</p><p className="text-2xl font-bold">{num(lang, smapPilot.farmVolumetric)}</p><p className="text-xs text-muted-foreground">m³/m³ · {num(lang, smapPilot.farmDepthCm)} {t("depthCm")}</p></div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{t("soilMismatch")}</p>
    </Metric>
  </div>;
}
