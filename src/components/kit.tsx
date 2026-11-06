import { useState, type ReactNode } from "react";
import { Satellite, Radio, Globe2, Flag, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { fmtDate } from "@/lib/i18n";
import type { Freshness, Source } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FreshBadge({ f }: { f: Freshness }) {
  const { t } = useApp();
  const cls = { fresh: "bg-fresh text-primary-foreground", stale: "bg-stale text-accent-foreground", missing: "bg-missing text-primary-foreground" }[f];
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", cls)}>{t(f)}</span>;
}

const isSat = (s: Source) => s === "landsat" || s === "modis";

export function SourceTag({ source }: { source: Source }) {
  const { t } = useApp();
  const Icon = isSat(source) ? Satellite : source === "station" ? Radio : Globe2;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold", isSat(source) ? "bg-satellite-soft text-satellite" : "bg-station-soft text-station")}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {t(`src_${source}`)}
    </span>
  );
}

/** Card that ALWAYS shows source, observation date, scale and freshness. Satellite vs station are visually separated. */
export function DataCard({
  title, source, observedAt, scale, freshness, children, icon,
}: { title: string; source: Source; observedAt: string | null; scale: string; freshness: Freshness; children: ReactNode; icon?: ReactNode }) {
  const { t, lang } = useApp();
  const sat = isSat(source);
  return (
    <section className={cn("rounded-2xl border bg-card p-4 shadow-sm", sat ? "border-l-4 border-l-satellite border-dashed" : "border-l-4 border-l-station")}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold">{icon}{title}</h2>
        <FreshBadge f={freshness} />
      </div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{sat ? t("estimate") : source === "station" ? t("measured") : t("gridded")}</p>
      {children}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-2 text-xs text-muted-foreground">
        <SourceTag source={source} />
        <span>{t("observed")}: {observedAt ? fmtDate(lang, observedAt) : "—"}</span>
        <span>{t("scale")}: {scale}</span>
      </div>
      <ReportButton cardId={title} />
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border bg-card p-4 shadow-sm", className)}>{children}</section>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-3 text-2xl font-bold text-primary">{children}</h1>;
}

export function Btn({ className, variant = "primary", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border-2 border-primary text-primary bg-card hover:bg-secondary",
    ghost: "text-primary hover:bg-secondary",
  }[variant];
  return <button {...p} className={cn("tap inline-flex items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40", v, className)} />;
}

export const inputCls = "tap w-full rounded-xl border-2 border-input bg-card px-3 text-base focus:border-primary focus:outline-none";

export function ReportButton({ cardId }: { cardId: string }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!details.trim()) return;
    setState("saving");
    try {
      const { error } = await supabase.from("information_reports").insert({ card_id: cardId.slice(0, 150), details: details.trim() });
      if (error) throw error;
      setState("saved");
    } catch { setState("error"); }
  }
  return <>
    <Btn variant="ghost" className="mt-2 min-h-10 px-0 text-xs" onClick={() => { setOpen(true); setState("idle"); setDetails(""); }}><Flag className="h-3.5 w-3.5" />{t("report")}</Btn>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="w-[calc(100%-2rem)] rounded-lg">
      <DialogTitle>{t("report")}</DialogTitle><DialogDescription>{cardId}</DialogDescription>
      {state === "saved" ? <p role="status" className="flex items-center gap-2 text-primary"><Check className="h-5 w-5" />{t("reported")}</p> : <form onSubmit={submit} className="space-y-3">
        <label className="block text-sm font-semibold">{t("reportDetails")}<textarea required maxLength={2000} value={details} onChange={e => setDetails(e.target.value)} className={`${inputCls} mt-2 min-h-28 py-3`} /></label>
        {state === "error" && <p role="alert" className="text-sm text-destructive">{t("saveError")}</p>}
        <Btn type="submit" className="w-full" disabled={state === "saving" || !details.trim()}>{t(state === "saving" ? "saving" : "sendReport")}</Btn>
      </form>}
    </DialogContent></Dialog>
  </>;
}
