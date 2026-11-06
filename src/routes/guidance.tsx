import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, BookOpen, CalendarDays } from "lucide-react";
import { PageTitle, Card, ReportButton, Btn } from "@/components/kit";
import { useApp } from "@/lib/store";
import { guidance, calendar, type CropId } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/guidance")({ head: () => pageHead("Crop guidance", "Source-linked crop guidance and seasonal reminders for Nepal's pilot farm, with review status and information reporting."), component: Guidance });
function Guidance() {
  const { t, lang, field } = useApp();
  const [crop, setCrop] = useState<CropId | "all">(field?.crop ?? "all");
  return <div className="space-y-4"><PageTitle>{t("guidance")}</PageTitle><p className="rounded-lg bg-secondary p-3 text-xs leading-relaxed">{t("noChem")}</p><p className="text-xs text-muted-foreground">{t("reviewDemo")}</p>
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("crop")}>{(["all", "rice", "maize", "wheat", "potato", "tomato"] as const).map(c => <Btn key={c} variant={crop === c ? "primary" : "outline"} className="px-3 text-sm" aria-pressed={crop === c} onClick={() => setCrop(c)}>{t(c === "all" ? "allCrops" : c)}</Btn>)}</div>
    <h2 className="flex items-center gap-2 border-t pt-4 text-lg font-bold"><BookOpen className="h-5 w-5" />{t("guidance")}</h2>
    {guidance.filter(g => crop === "all" || g.crops.includes(crop)).map(g => <Card key={g.id}><h3 className="font-bold text-primary">{g[lang].t}</h3><p className="mt-2 text-sm leading-relaxed">{g[lang].b}</p><div className="mt-4 border-t pt-3 text-xs text-muted-foreground"><p className="font-semibold">{t("reviewPending")}</p><p className="mt-1">{t("referenceInstitution")}: {g.reviewer}</p><a href={g.url} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center gap-1 text-primary underline">{t("sourceLink")}<ExternalLink className="h-3 w-3" /></a></div><ReportButton cardId={g[lang].t} /></Card>)}
    <h2 className="flex items-center gap-2 border-t pt-4 text-lg font-bold"><CalendarDays className="h-5 w-5" />{t("reminders")}</h2>
    {calendar.filter(c => crop === "all" || c.crops.includes(crop)).map(c => <Card key={c.id}><p className="mb-2 text-xs font-bold text-primary">{num(lang, c.inDays)} {t("inDays")} · {t("demo")}</p><h3 className="text-sm font-semibold">{c[lang]}</h3><p className="mt-3 text-xs text-muted-foreground">{t("reviewPending")}</p><p className="mt-1 text-xs text-muted-foreground">{t("referenceInstitution")}: NARC</p><a href="https://narc.gov.np" target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center gap-1 text-xs text-primary underline">{t("sourceLink")}<ExternalLink className="h-3 w-3" /></a><div><ReportButton cardId={c[lang]} /></div></Card>)}
  </div>;
}
