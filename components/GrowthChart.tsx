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

/** True uniquement après hydratation client (SSR-safe, sans setState/effet). */
const subscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
import type { YearPoint } from "@/lib/calc";
import { formatEUR } from "@/lib/format";

const BRAND = "#1098f7";
const GOLD = "#f8d047";

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
    <div className="rounded-lg border border-white/10 bg-[#0b1220]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-white">
        Année {point.year}
      </p>
      <Row color={BRAND} label="Capital investi" value={point.invested} />
      <Row color={GOLD} label="Plus-values" value={point.gains} />
      <div className="mt-1.5 border-t border-white/10 pt-1.5">
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
    <div className="flex items-center justify-between gap-6">
      <span className="flex items-center gap-1.5 text-white/60">
        {color ? (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ) : null}
        {label}
      </span>
      <span className={bold ? "font-semibold text-white" : "text-white/80"}>
        {formatEUR(value)}
      </span>
    </div>
  );
}

/** Graphique d'évolution empilé : capital investi (bleu) vs plus-values (or). */
export function GrowthChart({ data }: GrowthChartProps) {
  // Recharts mesure son conteneur côté client : on diffère le rendu après
  // hydratation pour éviter l'avertissement de dimensions au prerender SSR.
  const hydrated = useHydrated();

  return (
    <div className="h-[280px] w-full sm:h-[320px]">
      {!hydrated ? null : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity={0.55} />
              <stop offset="100%" stopColor={BRAND} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="fillGains" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.6} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `${y} an${y > 1 ? "s" : ""}`}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={compactEUR}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="invested"
            name="Capital investi"
            stackId="total"
            stroke={BRAND}
            strokeWidth={2}
            fill="url(#fillInvested)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="gains"
            name="Plus-values"
            stackId="total"
            stroke={GOLD}
            strokeWidth={2}
            fill="url(#fillGains)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
