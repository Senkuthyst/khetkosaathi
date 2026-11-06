import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart, Area, Bar } from "recharts";
import { useApp } from "@/lib/store";
import { fmtDate, num } from "@/lib/i18n";
import type { VegPoint } from "@/lib/data";

export interface ChartSeries { key: string; label: string; color?: string; bar?: boolean }
export function TrendChart({ data, series, unit = "", height = 180 }: { data: Record<string, unknown>[]; series: ChartSeries[]; unit?: string; height?: number }) {
  const { lang } = useApp();
  return <div className="min-w-0" aria-label={series.map(s => s.label).join(", ")} role="img">
    <ResponsiveContainer width="100%" height={height}><ComposedChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={v => fmtDate(lang, String(v))} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} minTickGap={38} axisLine={false} tickLine={false} />
      <YAxis tickFormatter={v => num(lang, v)} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} labelFormatter={v => fmtDate(lang, String(v))} formatter={(v: number, n: string) => [`${num(lang, v)} ${unit}`, n]} />
      {series.map((s, i) => s.bar ? <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color ?? `var(--chart-${i + 1})`} radius={[3, 3, 0, 0]} isAnimationActive={false} /> : <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color ?? `var(--chart-${i + 1})`} strokeWidth={2.5} dot={false} connectNulls={false} isAnimationActive={false} />)}
    </ComposedChart></ResponsiveContainer>
    {series.length > 1 && <div className="flex flex-wrap justify-center gap-4 text-xs">{series.map((s, i) => <span key={s.key} className="flex items-center gap-1.5"><svg width="14" height="6" aria-hidden><path d="M0 3H14" stroke={s.color ?? `var(--chart-${i + 1})`} strokeWidth="3" /></svg>{s.label}</span>)}</div>}
  </div>;
}
export function VegetationChart({ data }: { data: VegPoint[] }) {
  const { lang, t } = useApp();
  return <div role="img" aria-label={t("tsTitle")}>
    <ResponsiveContainer width="100%" height={235}><ComposedChart data={data.map(p => ({ ...p, baseline: [p.baseLow, p.baseHigh] }))} margin={{ left: -22, right: 8, top: 8 }}>
      <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={v => fmtDate(lang, String(v))} tick={{ fontSize: 10 }} minTickGap={38} tickLine={false} axisLine={false} />
      <YAxis domain={[0, 1]} tickFormatter={v => num(lang, v)} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8 }} labelFormatter={v => fmtDate(lang, String(v))} formatter={(v: number | number[], name: string) => [Array.isArray(v) ? v.map(n => num(lang, n)).join(" – ") : num(lang, v), name]} />
      <Area type="monotone" dataKey="baseline" name={t("baseline")} fill="var(--satellite)" fillOpacity={0.13} stroke="none" isAnimationActive={false} />
      <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="var(--chart-1)" dot={{ r: 3 }} strokeWidth={2.5} connectNulls={false} isAnimationActive={false} />
      <Line type="monotone" dataKey="evi" name="EVI" stroke="var(--chart-2)" dot={false} strokeWidth={2} connectNulls={false} isAnimationActive={false} />
    </ComposedChart></ResponsiveContainer>
    <div className="flex flex-wrap justify-center gap-3 text-xs"><span className="text-primary">● NDVI</span><span className="text-satellite">● EVI</span><span className="rounded bg-satellite-soft px-1 text-satellite">{t("baseline")}</span></div>
  </div>;
}