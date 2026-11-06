import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudRain, Thermometer, Droplets, Leaf, Sprout, MapPin, ChevronRight } from "lucide-react";
import { DataCard, PageTitle } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import { useApp } from "@/lib/store";
import { summary, cropAgeDays } from "@/lib/derived";
import { stationCurrent, freshness, calendar, DEMO_NOW, municipalities } from "@/lib/data";
import { num } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/")({ head: () => pageHead("Farm overview", "Pilot farm weather, soil measurements, satellite trends and crop-calendar reminders for Nepal."), component: Index });
function Index() {
  const { t, lang, field } = useApp();
  const s = summary();
  if (!field) return null;
  const f = freshness(stationCurrent.observedAt, 2);
  const muni = municipalities.find(m => m.id === field.municipality);
  return <div className="space-y-4">
    <div><p className="mb-1 text-xs font-semibold text-muted-foreground">{t("demo")}</p><PageTitle>{field.name}</PageTitle><p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{muni?.[lang]}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-y py-3"><span className="flex items-center gap-2 text-sm font-semibold"><Sprout className="h-4 w-4 text-primary" />{t(field.crop)} · {num(lang, cropAgeDays(field.plantingDate))} {t("days")}</span><Link to="/onboarding" className="text-xs font-semibold text-primary underline">{t("editField")}</Link></div>
    </div>
    <p className="text-xs leading-relaxed text-muted-foreground">{t("demoNote")}</p>
    <DataCard title={t("rain7")} source="station" observedAt={stationCurrent.observedAt} scale={t("pointScale")} freshness={f} icon={<CloudRain className="h-5 w-5 text-station" />}><p className="text-3xl font-bold">{num(lang, s.rain7)} <span className="text-sm font-normal">mm</span></p><TrendChart data={s.last7} series={[{ key: "rain", label: t("rain7"), bar: true }]} unit="mm" height={115} /><p className="text-xs text-muted-foreground">{t("incompleteRain")}</p></DataCard>
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
      <DataCard title={t("temperature")} source="station" observedAt={stationCurrent.observedAt} scale={t("pointScale")} freshness={f} icon={<Thermometer className="h-4 w-4" />}><p className="text-3xl font-bold">{num(lang, stationCurrent.temp)}°C</p></DataCard>
      <DataCard title={t("humidity")} source="station" observedAt={stationCurrent.observedAt} scale={t("pointScale")} freshness={f} icon={<Droplets className="h-4 w-4" />}><p className="text-3xl font-bold">{num(lang, stationCurrent.humidity)}%</p></DataCard>
    </div>
    <DataCard title={t("soilMoisture")} source="station" observedAt={stationCurrent.observedAt} scale={t("pointScale")} freshness={f} icon={<Droplets className="h-5 w-5" />}><p className="text-3xl font-bold">{num(lang, stationCurrent.soil)}% <span className="text-xs font-normal text-muted-foreground">{t("soilDepth")}</span></p><TrendChart data={s.daily} series={[{ key: "soil", label: t("soilMoisture") }]} unit="%" height={140} /><p className="text-xs text-muted-foreground">{t("missingNote")}</p></DataCard>
    <DataCard title={t("vegTrend")} source={s.lastVeg?.sensor ?? "landsat"} observedAt={s.lastVeg?.date ?? null} scale={s.lastVeg?.sensor === "landsat" ? "30 m" : "~250 m"} freshness={freshness(s.lastVeg?.date ?? null, 72)} icon={<Leaf className="h-5 w-5 text-satellite" />}><p className="text-3xl font-bold">{s.lastVeg?.ndvi != null ? num(lang, s.lastVeg.ndvi) : "—"}</p><p className="mt-1 text-sm text-satellite">{t(s.vegBelow ? "vegLow" : "vegGood")}</p><TrendChart data={s.veg} series={[{ key: "ndvi", label: "NDVI", color: "var(--satellite)" }]} height={130} /><Link to="/crop-health" className="tap inline-flex items-center gap-1 text-sm font-semibold text-satellite">{t("cropHealth")}<ChevronRight className="h-4 w-4" /></Link></DataCard>
    <DataCard title={t("reminders")} source="nasa_power" observedAt={DEMO_NOW.toISOString()} scale={t("calendarScale")} freshness="fresh"><ul className="space-y-3">{calendar.filter(c => c.crops.includes(field.crop)).map(c => <li key={c.id} className="border-b pb-3 last:border-0"><span className="text-xs font-bold text-primary">{num(lang, c.inDays)} {t("inDays")}</span><p className="mt-1 text-sm">{c[lang]}</p></li>)}</ul><Link to="/guidance" className="tap inline-flex items-center gap-1 text-sm font-semibold text-primary">{t("guidance")}<ChevronRight className="h-4 w-4" /></Link></DataCard>
  </div>;
}
