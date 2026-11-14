import {
  Brain,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { Card, FreshBadge } from "@/components/kit";
import type { ScientificAnomalyReport } from "@/lib/data/scientific-anomaly-engine";

interface AiExplanationPanelProps {
  report: ScientificAnomalyReport;
  className?: string;
}

export function AiExplanationPanel({ report, className = "" }: AiExplanationPanelProps) {
  const riskConfig = {
    low: { label: "Favorable Agro-Climatic Conditions", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    moderate: { label: "Moderate Environmental Deviation", color: "text-amber-700 bg-amber-50 border-amber-200" },
    high: { label: "Elevated Agricultural Risk", color: "text-orange-700 bg-orange-50 border-orange-200" },
    critical: { label: "Severe Compound Anomaly Alert", color: "text-rose-700 bg-rose-50 border-rose-200 ring-2 ring-rose-200" },
    insufficient_data: { label: "Incomplete Observations", color: "text-slate-700 bg-slate-50 border-slate-200" },
  }[report.overallRiskScore];

  return (
    <Card className={`p-5 space-y-4 border-2 border-primary/20 bg-card ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-foreground">
                AI Agricultural Explanation & Evidence Synthesizer
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" /> Grounded In Real NASA Observations
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Region: <span className="font-semibold text-foreground">{report.locationName}</span> · 
              Coordinates: {report.coordinates.latitude.toFixed(3)}° N, {report.coordinates.longitude.toFixed(3)}° E
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-xl border text-xs font-bold ${riskConfig.color}`}>
          {riskConfig.label}
        </div>
      </div>

      {/* Structured Grounded Explanation */}
      <div className="space-y-3">
        <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/70 text-xs leading-relaxed space-y-2">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Synthesized Environmental Assessment:
          </p>
          <p className="text-muted-foreground">
            Analysis of the latest NASA Earth Observation data for {report.locationName} indicates that{" "}
            {report.overallRiskScore === "low"
              ? "environmental indicators remain largely within expected seasonal bounds."
              : report.overallRiskScore === "critical"
                ? "multiple concurrent stress factors (temperature extremes and precipitation deficits) are interacting simultaneously."
                : "certain environmental deviations warrant attentive on-ground monitoring."}
          </p>
        </div>

        {/* Evidence Points */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            Observed Evidence Points:
          </span>
          <div className="space-y-1">
            {report.evidenceStatements.map((statement, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-background border border-border/60 text-xs text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{statement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Uncertainty & Responsible Caveats */}
        {report.scientificUncertaintyNotes.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-950">
              <Info className="h-3.5 w-3.5" /> Scientific Limitations & Context:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
              {report.scientificUncertaintyNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Field Scouting Action */}
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1.5">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-primary" />
            Recommended On-Farm Actions:
          </span>
          <ul className="space-y-1 text-muted-foreground">
            {report.fieldInspectionRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Scientific policy: Satellite vegetation deviations never constitute definitive diagnosis of crop pest or pathogen presence.</span>
        <span className="font-semibold text-primary">NASA Agri-AI v2.4</span>
      </div>
    </Card>
  );
}
