import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, BookOpen, CalendarDays, RotateCcw, Sprout, ShieldAlert } from "lucide-react";
import { PageTitle, Card, ReportButton, Btn } from "@/components/kit";
import { CropRotationPlanner } from "@/components/CropRotationPlanner";
import { useApp } from "@/lib/store";
import { guidance, calendar, type CropId } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guidance")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Crop Intelligence & Guidance",
      "Source-linked crop guidance, 5-step regenerative crop rotation planner, and seasonal reminders for Nepal."
    ),
  component: Guidance,
});

function Guidance() {
  const { t, lang, field } = useApp();
  const [activeTab, setActiveTab] = useState<"planner" | "guidance" | "calendar">("planner");
  const [crop, setCrop] = useState<CropId | "all">(field?.crop ?? "all");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              <Sprout className="h-3.5 w-3.5" />
              <span>NARC & CIMMYT Agronomy Guidelines</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {lang === "ne" ? "बाली सल्लाह तथा चक्र योजनाकार" : "Crop Guidance & Rotation Planner"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {lang === "ne"
                ? "नेपालका विभिन्न भौगोलिक क्षेत्रका लागि प्रमाणित बाली चक्र, माटो संरक्षण र मौसमी कार्यतालिका।"
                : "Regenerative crop rotations, field management practices, and scheduled seasonal reminders."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("planner")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "planner"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{lang === "ne" ? "बाली चक्र योजना" : "Rotation Planner"}</span>
            </button>
            <button
              onClick={() => setActiveTab("guidance")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "guidance"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t("guidance")}</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={cn(
                "px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "calendar"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{t("reminders")}</span>
            </button>
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-4 pt-3 border-t border-border flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>{t("noChem")}</span>
        </div>
      </div>

      {/* TAB 1: 5-STEP ROTATION PLANNER */}
      {activeTab === "planner" && (
        <div className="animate-in fade-in duration-200">
          <CropRotationPlanner />
        </div>
      )}

      {/* TAB 2: AGRONOMIC GUIDANCE */}
      {activeTab === "guidance" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Crop Filter Bar */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("crop")}>
            {(["all", "rice", "maize", "wheat", "potato", "tomato"] as const).map((c) => (
              <button
                key={c}
                aria-pressed={crop === c}
                onClick={() => setCrop(c)}
                className={cn(
                  "rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all",
                  crop === c
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-border bg-card text-foreground hover:bg-secondary"
                )}
              >
                {t(c === "all" ? "allCrops" : c)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidance
              .filter((g) => crop === "all" || g.crops.includes(crop))
              .map((g) => (
                <div
                  key={g.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                      Agro Advisory
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-foreground leading-snug">
                      {g[lang].t}
                    </h3>
                    <p className="mt-2 text-xs text-foreground/80 leading-relaxed">{g[lang].b}</p>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{t("referenceInstitution")}: <strong>{g.reviewer}</strong></span>
                      <a
                        href={g.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        {t("sourceLink")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <ReportButton cardId={g[lang].t} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: CALENDAR REMINDERS */}
      {activeTab === "calendar" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendar
              .filter((c) => crop === "all" || c.crops.includes(crop))
              .map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
                      {num(lang, c.inDays)} {t("inDays")}
                    </span>
                    <h3 className="mt-2.5 text-sm font-bold text-foreground leading-relaxed">
                      {c[lang]}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Source: Nepal Agricultural Research Council (NARC)</span>
                    <a
                      href="https://narc.gov.np"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                    >
                      narc.gov.np
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <ReportButton cardId={c[lang]} />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
