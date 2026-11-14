import { useState, type ReactNode } from "react";
import { Satellite, Radio, Globe2, Flag, Check, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/store";
import { fmtDate, num } from "@/lib/i18n";
import type { Freshness, Source, Provenance } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FreshBadge({ f }: { f: Freshness }) {
  const { t } = useApp();
  const cls = {
    fresh: "bg-emerald-100 text-emerald-800 border-emerald-300",
    stale: "bg-amber-100 text-amber-800 border-amber-300",
    missing: "bg-gray-100 text-gray-700 border-gray-300",
  }[f];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold border", cls)}>
      {t(f)}
    </span>
  );
}

const isSat = (s: Source) => s === "landsat" || s === "modis" || s === "gpm" || s === "smap";

export function DataProvenance({ data }: { data: Provenance }) {
  const { t, lang } = useApp();
  const timestamp = (date: string) =>
    new Date(date).toLocaleString(lang === "ne" ? "ne-NP" : "en-GB", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Btn variant="ghost" className="mt-2 w-full justify-start px-0 text-xs font-semibold" aria-label={`${t("provenance")}: ${data.dataset}`}>
          <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <span>{t("provenance")} · {t(data.mode)}</span>
        </Btn>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-w-[calc(100vw-2rem)] w-96 rounded-2xl p-4 text-xs shadow-xl border-border">
        <div className="flex items-center gap-2 border-b pb-2 mb-3">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="font-extrabold text-sm text-foreground">{t("provenance")}</h3>
        </div>
        <dl className="space-y-2.5 break-words">
          {[
            [t("dataset"), data.dataset],
            [t("productId"), num(lang, data.productId)],
            [t("resolution"), num(lang, data.resolution)],
            [
              t("observationPeriod"),
              data.observedAt
                ? `${data.periodStart ? `${num(lang, data.periodStart)} → ` : ""}${num(lang, data.observedAt.slice(0, 10))}`
                : t("missing"),
            ],
            [t("retrieved"), data.retrievedAt ? timestamp(data.retrievedAt) : t("notRetrieved")],
            [t("quality"), t(data.quality)],
            [t("date"), t(data.mode)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-2 border-b border-border/40 pb-1.5 last:border-0">
              <dt className="text-muted-foreground">{label}:</dt>
              <dd className="font-bold text-foreground text-right">{value}</dd>
            </div>
          ))}
        </dl>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          {t("sourceLink")} ↗
        </a>
      </PopoverContent>
    </Popover>
  );
}

export function SourceTag({ source }: { source: Source }) {
  const { t } = useApp();
  const Icon = isSat(source) ? Satellite : source === "station" ? Radio : Globe2;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-bold",
        isSat(source) ? "bg-satellite-soft text-satellite" : "bg-primary/10 text-primary"
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {t(`src_${source}`)}
    </span>
  );
}

/** Card that ALWAYS shows source, observation date, scale and freshness. Satellite vs station are visually separated. */
export function DataCard({
  title,
  source,
  observedAt,
  scale,
  freshness,
  children,
  icon,
}: {
  title: string;
  source: Source;
  observedAt: string | null;
  scale: string;
  freshness: Freshness;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const { t, lang } = useApp();
  const sat = isSat(source);
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm transition-all",
        sat ? "border-l-4 border-l-satellite border-dashed" : "border-l-4 border-l-primary"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
          {icon}
          {title}
        </h2>
        <FreshBadge f={freshness} />
      </div>
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        {sat ? t("estimate") : source === "station" ? t("measured") : t("gridded")}
      </p>
      {children}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-border pt-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <SourceTag source={source} />
          <span>
            {t("observed")}: <strong>{observedAt ? fmtDate(lang, observedAt) : "—"}</strong>
          </span>
          <span>
            {t("scale")}: <strong>{scale}</strong>
          </span>
        </div>
        <ReportButton cardId={title} />
      </div>
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>{children}</section>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-3 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{children}</h1>;
}

export function Btn({
  className,
  variant = "primary",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs",
    outline: "border-2 border-primary text-primary bg-card hover:bg-secondary shadow-2xs",
    ghost: "text-primary hover:bg-secondary",
  }[variant];
  return (
    <button
      {...p}
      className={cn(
        "tap inline-flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        v,
        className
      )}
    />
  );
}

export const inputCls =
  "tap w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all";

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
    } catch {
      setState("error");
    }
  }
  return (
    <>
      <Btn
        variant="ghost"
        className="min-h-8 px-1 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => {
          setOpen(true);
          setState("idle");
          setDetails("");
        }}
      >
        <Flag className="h-3.5 w-3.5" />
        {t("report")}
      </Btn>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-6">
          <DialogTitle className="text-base font-extrabold text-foreground">{t("report")}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">{cardId}</DialogDescription>
          {state === "saved" ? (
            <p role="status" className="flex items-center gap-2 text-primary font-bold text-sm py-2">
              <Check className="h-5 w-5 text-fresh" />
              {t("reported")}
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4 mt-2">
              <label className="block text-xs font-bold text-foreground">
                {t("reportDetails")}
                <textarea
                  required
                  maxLength={2000}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`${inputCls} mt-1.5 min-h-28 py-2.5`}
                  placeholder="Describe the incorrect value, date, or interpretation..."
                />
              </label>
              {state === "error" && (
                <p role="alert" className="text-xs font-semibold text-destructive">
                  {t("saveError")}
                </p>
              )}
              <Btn type="submit" className="w-full py-2.5" disabled={state === "saving" || !details.trim()}>
                {t(state === "saving" ? "saving" : "sendReport")}
              </Btn>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
