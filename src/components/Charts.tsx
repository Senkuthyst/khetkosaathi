import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Area,
  Bar,
} from "recharts";
import { useApp } from "@/lib/store";
import { fmtDate, num } from "@/lib/i18n";
import type { VegPoint } from "@/lib/data";

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
  bar?: boolean;
}

export function TrendChart({
  data,
  series,
  unit = "",
  height = 180,
}: {
  data: object[];
  series: ChartSeries[];
  unit?: string;
  height?: number;
}) {
  const { lang } = useApp();
  return (
    <div className="min-w-0" aria-label={series.map((s) => s.label).join(", ")} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E5EAE2" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => fmtDate(lang, String(v))}
            tick={{ fontSize: 10, fill: "#758078" }}
            minTickGap={38}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => num(lang, v)}
            tick={{ fontSize: 10, fill: "#758078" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5EAE2",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              fontSize: 12,
              fontWeight: 600,
              color: "#18251E",
            }}
            labelFormatter={(v) => fmtDate(lang, String(v))}
            formatter={(v: number, n: string) => [`${num(lang, v)} ${unit}`, n]}
          />
          {series.map((s, i) =>
            s.bar ? (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color ?? `var(--chart-${i + 1})`}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            ) : (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color ?? `var(--chart-${i + 1})`}
                strokeWidth={2.5}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ),
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {series.length > 1 && (
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-muted-foreground mt-2">
          {series.map((s, i) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-3 rounded-xs"
                style={{ backgroundColor: s.color ?? `var(--chart-${i + 1})` }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function VegetationChart({ data }: { data: VegPoint[] }) {
  const { lang, t } = useApp();
  return (
    <div role="img" aria-label={t("tsTitle")}>
      <ResponsiveContainer width="100%" height={235}>
        <ComposedChart
          data={data.map((p) => ({ ...p, baseline: [p.baseLow, p.baseHigh] }))}
          margin={{ left: -22, right: 8, top: 8 }}
        >
          <CartesianGrid vertical={false} stroke="#E5EAE2" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => fmtDate(lang, String(v))}
            tick={{ fontSize: 10, fill: "#758078" }}
            minTickGap={38}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => num(lang, v)}
            tick={{ fontSize: 10, fill: "#758078" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5EAE2",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              fontSize: 12,
              fontWeight: 600,
              color: "#18251E",
            }}
            labelFormatter={(v) => fmtDate(lang, String(v))}
            formatter={(v: number | number[], name: string) => [
              Array.isArray(v) ? v.map((n) => num(lang, n)).join(" – ") : num(lang, v),
              name,
            ]}
          />
          <Area
            type="monotone"
            dataKey="baseline"
            name={t("baseline")}
            fill="#1D5C8A"
            fillOpacity={0.12}
            stroke="none"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="ndvi"
            name="NDVI"
            stroke="#237A50"
            dot={{ r: 3.5, fill: "#237A50" }}
            strokeWidth={2.5}
            connectNulls={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="evi"
            name="EVI"
            stroke="#1D5C8A"
            dot={false}
            strokeWidth={2}
            connectNulls={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold mt-2.5">
        <span className="flex items-center gap-1.5 text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
          NDVI (Chlorophyll Greenness)
        </span>
        <span className="flex items-center gap-1.5 text-satellite">
          <span className="h-2 w-2 rounded-full bg-satellite" />
          EVI (Enhanced Vegetation)
        </span>
        <span className="rounded-md bg-satellite-soft px-2 py-0.5 text-[11px] font-bold text-satellite">
          {t("baseline")} (0.60–0.75)
        </span>
      </div>
    </div>
  );
}
