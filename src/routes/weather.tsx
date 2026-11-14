import { createFileRoute } from "@tanstack/react-router";
import { Radio, Battery, Thermometer, Droplets, CloudRain, Activity, SlidersHorizontal, Info } from "lucide-react";
import { PageTitle, DataCard, SourceTag } from "@/components/kit";
import { TrendChart } from "@/components/Charts";
import { ThresholdEditor } from "@/components/ThresholdEditor";
import { useApp } from "@/lib/store";
import {
  getStationDaily,
  getNasaPowerDaily,
  stationCurrent,
  sensorHealth,
  stationMeta,
  nasaPowerMeta,
  freshness,
} from "@/lib/data";
import { num, fmtDate } from "@/lib/i18n";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/weather")({
  head: () =>
    pageHead(
      "KHETKOSAATHI — Weather & Microclimate Station",
      "Pilot weather station telemetry, daily microclimate patterns, sensor health diagnostics, and NASA POWER comparisons."
    ),
  component: Weather,
});

function Weather() {
  const { t, lang } = useApp();
  const daily = getStationDaily(14);
  const regional = getNasaPowerDaily(14);
  const comparison = daily.map((d) => ({
    date: d.date,
    farm: d.tMax,
    regional: regional.find((n) => n.date === d.date)?.tMax ?? null,
  }));

  const meta = {
    source: "station" as const,
    observedAt: stationCurrent.observedAt,
    scale: t("pointScale"),
    freshness: freshness(stationCurrent.observedAt, 2),
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-secondary/30 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            In-Situ Automated Telemetry
          </span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {t("station")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {stationMeta.id} · Chitwan Sub-tropical Valley · Live Readings & Climatology
        </p>
      </div>

      {/* Real-time Telemetry Dashboard Card */}
      <DataCard title={t("current")} {...meta} icon={<Radio className="h-5 w-5 text-station" />}>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Station Node: <strong>{stationMeta.id}</strong></span>
          <span>{num(lang, 12)} {t("minAgo")}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "temperature" as const, value: stationCurrent.temp, unit: "°C", Icon: Thermometer, color: "text-primary" },
            { key: "humidity" as const, value: stationCurrent.humidity, unit: "%", Icon: Droplets, color: "text-satellite" },
            { key: "rainToday" as const, value: stationCurrent.rainToday, unit: "mm", Icon: CloudRain, color: "text-primary" },
            { key: "soilMoisture" as const, value: stationCurrent.soil, unit: "%", Icon: Droplets, color: "text-primary" },
          ].map((m) => (
            <div key={m.key} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <m.Icon className={`h-4 w-4 ${m.color}`} />
                {t(m.key)}
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
                {num(lang, m.value)}{" "}
                <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
              </p>
              {m.key === "soilMoisture" && (
                <p className="mt-1 text-[11px] text-muted-foreground">{t("soilDepth")}</p>
              )}
            </div>
          ))}
        </div>
      </DataCard>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCard title={`${t("temperature")} · ${t("trends")}`} {...meta}>
          <TrendChart
            data={daily}
            series={[
              { key: "tMax", label: `${t("max")} °C` },
              { key: "tMin", label: `${t("min")} °C` },
            ]}
            unit="°C"
          />
          <p className="mt-3 text-xs text-muted-foreground">{t("missingNote")}</p>
        </DataCard>

        <DataCard title={`${t("rainToday")} · ${t("trends")}`} {...meta}>
          <TrendChart
            data={daily}
            series={[{ key: "rain", label: t("rainToday"), bar: true }]}
            unit="mm"
          />
        </DataCard>

        <div id="soil">
          <DataCard title={`${t("soilMoisture")} · ${t("trends")}`} {...meta}>
            <TrendChart
              data={daily}
              series={[{ key: "soil", label: t("soilMoisture") }]}
              unit="%"
            />
            <p className="mt-2 text-xs text-muted-foreground">{t("soilDepth")}</p>
          </DataCard>
        </div>

        <DataCard title={`${t("humidity")} · ${t("trends")}`} {...meta}>
          <TrendChart
            data={daily}
            series={[{ key: "humidity", label: t("humidity") }]}
            unit="%"
          />
        </DataCard>
      </div>

      {/* Daily Records Table */}
      <DataCard title={t("daily")} {...meta}>
        <div className="overflow-x-auto rounded-xl border border-border mt-2">
          <table className="w-full text-right text-xs">
            <caption className="sr-only">{t("daily")}</caption>
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-muted-foreground font-semibold">
                <th className="py-2.5 px-3 text-left">{t("date")}</th>
                <th className="py-2.5 px-3">{t("max")} °C</th>
                <th className="py-2.5 px-3">{t("min")} °C</th>
                <th className="py-2.5 px-3">Rain (mm)</th>
                <th className="py-2.5 px-3">{t("soilMoisture")} %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...daily].reverse().map((d) => (
                <tr key={d.date} className="hover:bg-muted/30 transition-colors">
                  <th scope="row" className="py-2.5 px-3 text-left font-semibold text-foreground">
                    {fmtDate(lang, d.date)}
                  </th>
                  <td className="py-2.5 px-3 font-mono">{d.tMax == null ? "—" : num(lang, d.tMax)}</td>
                  <td className="py-2.5 px-3 font-mono">{d.tMin == null ? "—" : num(lang, d.tMin)}</td>
                  <td className="py-2.5 px-3 font-mono">{d.rain == null ? "—" : num(lang, d.rain)}</td>
                  <td className="py-2.5 px-3 font-mono">{d.soil == null ? "—" : num(lang, d.soil)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{t("missingNote")}</p>
      </DataCard>

      {/* Sensor Health Diagnostics */}
      <DataCard title={t("sensorHealth")} {...meta} icon={<Battery className="h-5 w-5 text-primary" />}>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: t("lastSeen"), value: `${fmtDate(lang, sensorHealth.lastSeen)} · ${num(lang, 12)} ${t("minAgo")}` },
            { label: t("uptime"), value: `${num(lang, sensorHealth.uptime)}%` },
            { label: t("battery"), value: `${num(lang, sensorHealth.battery)}%` },
            { label: t("signal"), value: `${num(lang, sensorHealth.signal)} dBm` },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-muted/20 p-3">
              <dt className="text-muted-foreground">{m.label}</dt>
              <dd className="mt-1 font-extrabold text-sm text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
          <Activity className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {t("dataGap")}: {num(lang, sensorHealth.gaps[0]?.hours ?? 0)} {t("hours")}
            </p>
            <p className="mt-0.5 text-[11px]">
              {sensorHealth.gaps[0] && fmtDate(lang, sensorHealth.gaps[0].from)} · {t("stationGap")}
            </p>
          </div>
        </div>
      </DataCard>

      {/* Farm Probe vs NASA POWER Comparison */}
      <DataCard
        title={t("compare")}
        source="nasa_power"
        observedAt={nasaPowerMeta.observedAt}
        scale={nasaPowerMeta.scale}
        freshness={freshness(nasaPowerMeta.observedAt, 24)}
      >
        <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{t("compareNote")}</p>
        <TrendChart
          data={comparison}
          series={[
            { key: "farm", label: `${t("farm")} ${t("max")} °C` },
            { key: "regional", label: "NASA POWER 0.5° Grid" },
          ]}
          unit="°C"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <SourceTag source="station" />
          <span>{t("pointScale")}</span>
          <SourceTag source="nasa_power" />
          <span>{nasaPowerMeta.scale}</span>
        </div>
      </DataCard>

      {/* Thresholds Settings Section */}
      <section id="thresholds" className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-extrabold text-foreground">{t("thresholds")}</h2>
            <p className="text-xs text-muted-foreground">{t("thresholdsNote")}</p>
          </div>
        </div>
        <ThresholdEditor />
      </section>
    </div>
  );
}
