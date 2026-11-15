import {
  Calendar,
  Clock,
  Database,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Activity,
} from "lucide-react";
import { FreshBadge, SourceTag, DataProvenance } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import type { PowerData } from "@/lib/data";
import { num } from "@/lib/i18n";
import { useApp } from "@/lib/store";

interface EarthDataStatusProps {
  powerData: PowerData | null;
  fieldId?: string;
  className?: string;
}

export function EarthDataStatusSection({
  powerData,
  fieldId = "pilot-1",
  className = "",
}: EarthDataStatusProps) {
  const { lang, t } = useApp();

  if (!powerData) return null;

  const prov = powerData.provenance;
  const days = powerData.days;
  const latestObsDate = prov.observedAt ?? days.at(-1)?.date ?? "—";
  const retrievalIso = prov.retrievedAt;
  const retrievalFormatted = retrievalIso
    ? new Date(retrievalIso).toLocaleString(lang === "ne" ? "ne-NP" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Pilot Preset";

  // Check data completeness & stale/missing status
  const missingCount = days.filter((d) => d.tMax == null || d.rain == null).length;
  const isStale =
    prov.mode === "pilot" ||
    (prov.observedAt ? Date.now() - new Date(prov.observedAt).getTime() > 7 * 86400000 : false);
  const isMissing = days.length === 0 || days.every((d) => d.tMax == null && d.rain == null);

  const statusBadge = isMissing ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
      <AlertTriangle className="h-3.5 w-3.5" />
      Data Missing
    </span>
  ) : isStale ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
      <Clock className="h-3.5 w-3.5" />
      {prov.mode === "pilot" ? "Pilot Record" : "Stale Observations"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Live Verified
    </span>
  );

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 ${className}`}
    >
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Earth Observation Stream Status
            </h3>
            {statusBadge}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            NASA POWER Agroclimatology Point Ingestion · Field:{" "}
            <span className="font-mono font-bold text-foreground">{fieldId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FreshBadge f={isMissing ? "missing" : isStale ? "stale" : "fresh"} />
          <SourceTag source="nasa_power" />
        </div>
      </div>

      {/* Metadata Metrics Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl bg-secondary/40 p-3 border border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-semibold">Observation Date</span>
          </div>
          <p className="text-sm font-black text-foreground">{num(lang, latestObsDate)}</p>
          <span className="text-[10px] text-muted-foreground">UTC Day Standard</span>
        </div>

        <div className="rounded-xl bg-secondary/40 p-3 border border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-semibold">Latest Retrieval</span>
          </div>
          <p className="text-sm font-black text-foreground">{retrievalFormatted}</p>
          <span className="text-[10px] text-muted-foreground">
            {prov.mode === "live" ? "Direct API Sync" : "Cached / Fallback"}
          </span>
        </div>

        <div className="rounded-xl bg-secondary/40 p-3 border border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-semibold">Spatial Resolution</span>
          </div>
          <p className="text-sm font-black text-foreground">{prov.resolution}</p>
          <span className="text-[10px] text-muted-foreground">Nearest Grid Centroid</span>
        </div>

        <div className="rounded-xl bg-secondary/40 p-3 border border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Database className="h-3.5 w-3.5" />
            <span className="font-semibold">Data Integrity</span>
          </div>
          <p className="text-sm font-black text-foreground">
            {missingCount === 0 ? "100% Complete" : `${missingCount} days partial`}
          </p>
          <span className="text-[10px] text-muted-foreground">Quality: {prov.quality}</span>
        </div>
      </div>

      {/* Micro Trend Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="rounded-xl border border-border/70 p-3.5 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Temperature Dynamic (°C)</span>
            <span className="text-[11px] text-muted-foreground">T2M Max / Min</span>
          </div>
          <TrendChart
            data={days}
            unit="°C"
            height={130}
            series={[
              { key: "tMax", label: t("maxTemperature") },
              { key: "tMin", label: t("minTemperature") },
            ]}
          />
        </div>

        <div className="rounded-xl border border-border/70 p-3.5 bg-background/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Daily Precipitation (mm/day)</span>
            <span className="text-[11px] text-muted-foreground">Corrected Total (PRECTOTCORR)</span>
          </div>
          <TrendChart
            data={days}
            unit="mm"
            height={130}
            series={[{ key: "rain", label: t("rainfall"), bar: true }]}
          />
        </div>
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5" />
          No fabricated values — gaps and missing observations reflect authentic NASA fill values
          (-999).
        </span>
        <DataProvenance data={prov} />
      </div>
    </div>
  );
}
