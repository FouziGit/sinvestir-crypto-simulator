"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Coins,
  Landmark,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { simulate } from "@/lib/calc";
import { formatEUR, formatMultiple, formatPct } from "@/lib/format";
import { SliderField } from "@/components/ui/SliderField";
import { StatCard } from "@/components/ui/StatCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GrowthChart } from "@/components/GrowthChart";

const FLAT_TAX_RATE = 0.3;
const INVESTED_COLOR = "#38bdf8";
const GAINS_COLOR = "#34d399";

const DEFAULTS = {
  initialCapital: 1000,
  monthlyContribution: 150,
  years: 10,
  annualReturnPct: 10,
};

export interface CryptoSimulatorProps {
  isEmbed?: boolean;
}

export default function CryptoSimulator({
  isEmbed = false,
}: CryptoSimulatorProps) {
  const [initialCapital, setInitialCapital] = useState(DEFAULTS.initialCapital);
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULTS.monthlyContribution,
  );
  const [years, setYears] = useState(DEFAULTS.years);
  const [annualReturnPct, setAnnualReturnPct] = useState(
    DEFAULTS.annualReturnPct,
  );
  const [applyTax, setApplyTax] = useState(true);

  const result = useMemo(
    () =>
      simulate({
        initialCapital,
        monthlyContribution,
        years,
        annualReturnPct,
        flatTaxRate: applyTax ? FLAT_TAX_RATE : 0,
      }),
    [initialCapital, monthlyContribution, years, annualReturnPct, applyTax],
  );

  const reset = () => {
    setInitialCapital(DEFAULTS.initialCapital);
    setMonthlyContribution(DEFAULTS.monthlyContribution);
    setYears(DEFAULTS.years);
    setAnnualReturnPct(DEFAULTS.annualReturnPct);
    setApplyTax(true);
  };

  const tool = (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-10 -bottom-10 -z-10 rounded-[2.5rem] bg-emerald-500/[0.04] blur-3xl"
      />

      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900/40 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <header className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/25">
              <Coins className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Simulateur Crypto
              </h2>
              <p className="text-sm text-zinc-400">
                Intérêts composés &amp; versements programmés (DCA)
              </p>
            </div>
          </div>

          <TaxToggle
            enabled={applyTax}
            onToggle={() => setApplyTax((v) => !v)}
          />
        </header>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                Vos paramètres
              </h3>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Réinitialiser
              </button>
            </div>

            <div className="mt-6 space-y-7">
              <SliderField
                label="Capital initial"
                value={initialCapital}
                onChange={setInitialCapital}
                min={0}
                max={100000}
                step={100}
                unit="€"
              />
              <SliderField
                label="Versement mensuel"
                value={monthlyContribution}
                onChange={setMonthlyContribution}
                min={0}
                max={2000}
                step={10}
                unit="€"
                hint="Optionnel — laissez à 0 pour un investissement unique."
              />
              <SliderField
                label="Durée du placement"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                unit="ans"
              />
              <SliderField
                label="Rendement annuel estimé"
                value={annualReturnPct}
                onChange={setAnnualReturnPct}
                min={0}
                max={50}
                step={0.5}
                unit="%"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <StatCard
              tone="hero"
              label={
                applyTax
                  ? "Capital final net (après Flat Tax)"
                  : "Capital final"
              }
              value={
                <AnimatedNumber value={result.finalNet} format={formatEUR} />
              }
              icon={<TrendingUp className="h-5 w-5" aria-hidden />}
              hint={
                <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span>
                    Brut&nbsp;:{" "}
                    <strong className="font-semibold text-zinc-200">
                      <AnimatedNumber
                        value={result.finalGross}
                        format={formatEUR}
                      />
                    </strong>
                  </span>
                  {applyTax ? (
                    <span>
                      Impôt&nbsp;:{" "}
                      <strong className="font-semibold text-rose-400">
                        −
                        <AnimatedNumber value={result.tax} format={formatEUR} />
                      </strong>
                    </span>
                  ) : null}
                  <span>
                    Soit{" "}
                    <strong className="font-semibold text-emerald-300">
                      <AnimatedNumber
                        value={result.multiple}
                        format={formatMultiple}
                      />
                    </strong>{" "}
                    le capital investi
                  </span>
                </span>
              }
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <motion.div whileHover={{ y: -3 }}>
                <StatCard
                  tone="invested"
                  label="Total investi"
                  value={
                    <AnimatedNumber
                      value={result.totalInvested}
                      format={formatEUR}
                    />
                  }
                  icon={<Wallet className="h-4 w-4" aria-hidden />}
                />
              </motion.div>
              <motion.div whileHover={{ y: -3 }}>
                <StatCard
                  tone="gain"
                  label={applyTax ? "Plus-values nettes" : "Plus-values"}
                  value={
                    <AnimatedNumber
                      value={result.netGains}
                      format={formatEUR}
                    />
                  }
                />
              </motion.div>
              <motion.div whileHover={{ y: -3 }}>
                <StatCard
                  tone="default"
                  label="Plus-values brutes"
                  value={
                    <AnimatedNumber
                      value={result.grossGains}
                      format={formatEUR}
                    />
                  }
                />
              </motion.div>
              <motion.div whileHover={{ y: -3 }}>
                <StatCard
                  tone="default"
                  label={`Flat Tax (${formatPct(FLAT_TAX_RATE * 100)})`}
                  value={
                    applyTax ? (
                      <>
                        −
                        <AnimatedNumber value={result.tax} format={formatEUR} />
                      </>
                    ) : (
                      "—"
                    )
                  }
                  icon={<Landmark className="h-4 w-4" aria-hidden />}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Évolution de votre investissement
              </h3>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <LegendDot color={INVESTED_COLOR} label="Capital investi" />
                <LegendDot color={GAINS_COLOR} label="Plus-values" />
              </div>
            </div>
            <GrowthChart data={result.series} />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Projection à titre indicatif, hors frais, sur la base d&apos;un
            rendement annuel constant. Les performances passées ne préjugent pas
            des performances futures. Investir dans les crypto-actifs comporte
            un risque de perte en capital.
          </p>
        </div>
      </div>
    </section>
  );

  if (!isEmbed) return tool;

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <Wordmark />
          <a
            href="https://simulateurs.sinvestir.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            simulateurs.sinvestir.fr
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
        {tool}
      </div>
    </div>
  );
}

function TaxToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Appliquer la Flat Tax de 30 %"
      onClick={onToggle}
      className={`flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-sm font-medium tracking-tight transition ${
        enabled
          ? "border-emerald-400/40 bg-emerald-400/10 text-white"
          : "border-white/10 bg-white/[0.04] text-zinc-400"
      }`}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          enabled ? "bg-emerald-500" : "bg-white/15"
        }`}
      >
        <motion.span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.45)]"
          animate={{ left: enabled ? "1.125rem" : "0.125rem" }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </span>
      Flat Tax 30 %
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/25">
        <Coins className="h-4 w-4" aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight text-white">
          S&apos;investir
        </p>
        <p className="text-[11px] text-zinc-500">Simulateurs</p>
      </div>
    </div>
  );
}
