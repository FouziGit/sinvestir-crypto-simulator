"use client";

import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearPoint } from "@/lib/calc";
import { formatEUR } from "@/lib/format";

const INVESTED = "#38bdf8";
const GAINS = "#34d399";

const subscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

interface GrowthChartProps {
  data: YearPoint[];
}

function compactEUR(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000)} k€`;
  }
  return `${Math.round(value)} €`;
}

interface TooltipPayloadItem {
  payload: YearPoint;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-3 text-xs shadow-2xl shadow-black/60 backdrop-blur-md">
      <p className="mb-2 font-semibold tracking-tight text-white">
        Année {point.year}
      </p>
      <Row color={INVESTED} label="Capital investi" value={point.invested} />
      <Row color={GAINS} label="Plus-values" value={point.gains} />
      <div className="mt-2 border-t border-white/10 pt-2">
        <Row label="Valeur totale" value={point.value} bold />
      </div>
    </div>
  );
}

function Row({
  color,
  label,
  value,
  bold,
}: {
  color?: string;
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-8">
      <span className="flex items-center gap-1.5 text-zinc-400">
        {color ? (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ) : null}
        {label}
      </span>
      <span
        className={
          bold ? "font-semibold tabular-nums text-white" : "tabular-nums text-zinc-200"
        }
      >
        {formatEUR(value)}
      </span>
    </div>
  );
}

export function GrowthChart({ data }: GrowthChartProps) {
  const hydrated = useHydrated();

  return (
    <div className="h-[280px] w-full sm:h-[340px]">
      {!hydrated ? null : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INVESTED} stopOpacity={0.5} />
                <stop offset="100%" stopColor={INVESTED} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillGains" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GAINS} stopOpacity={0.7} />
                <stop offset="100%" stopColor={GAINS} stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tickFormatter={(y) => `${y} an${y > 1 ? "s" : ""}`}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={compactEUR}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "rgba(255,255,255,0.18)",
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="invested"
              name="Capital investi"
              stackId="total"
              stroke={INVESTED}
              strokeWidth={2}
              fill="url(#fillInvested)"
              activeDot={{ r: 3.5, fill: INVESTED, stroke: "#09090b", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="gains"
              name="Plus-values"
              stackId="total"
              stroke={GAINS}
              strokeWidth={2}
              fill="url(#fillGains)"
              activeDot={{ r: 4, fill: GAINS, stroke: "#09090b", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
