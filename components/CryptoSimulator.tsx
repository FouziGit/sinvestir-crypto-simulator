"use client";

import { useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";
import {
  ArrowUpRight,
  Coins,
  Landmark,
  RotateCcw,
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

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const DEFAULTS = {
  initialCapital: 1000,
  monthlyContribution: 150,
  years: 10,
  annualReturnPct: 10,
};

export interface CryptoSimulatorProps {
  /**
   * Mode intégration (iframe). Quand `true`, le composant s'affiche en pleine
   * page avec sa propre identité visuelle et masque tout le chrome de page
   * (header / footer du site hôte) pour une intégration iframe autonome.
   */
  isEmbed?: boolean;
}

/**
 * Simulateur d'investissement crypto : intérêts composés + versements
 * programmés (DCA), avec imposition à la Flat Tax (30 %).
 *
 * Composant autonome et réutilisable : aucune dépendance à un contexte de
 * page, état entièrement local, et un seul point d'entrée (`isEmbed`) pour
 * l'embarquer proprement dans un iframe.
 */
export default function CryptoSimulator({ isEmbed = false }: CryptoSimulatorProps) {
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
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl shadow-black/40 backdrop-blur">
      {/* En-tête */}
      <header className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/30">
            <Coins className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Simulateur Crypto
            </h2>
            <p className="text-sm text-white/50">
              Intérêts composés &amp; versements programmés (DCA)
            </p>
          </div>
        </div>

        <TaxToggle enabled={applyTax} onToggle={() => setApplyTax((v) => !v)} />
      </header>

      <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-12">
        {/* Paramètres */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/40">
              Vos paramètres
            </h3>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Réinitialiser
            </button>
          </div>

          <div className="mt-5 space-y-6">
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

        {/* Résultats */}
        <motion.div
          className="lg:col-span-7"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <StatCard
              tone="hero"
              label={
                applyTax ? "Capital final net (après Flat Tax)" : "Capital final"
              }
              value={<AnimatedNumber value={result.finalNet} format={formatEUR} />}
              icon={<TrendingUp className="h-5 w-5" aria-hidden />}
              hint={
                <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span>
                    Brut&nbsp;:{" "}
                    <strong className="text-white/70">
                      <AnimatedNumber value={result.finalGross} format={formatEUR} />
                    </strong>
                  </span>
                  {applyTax ? (
                    <span>
                      Impôt&nbsp;:{" "}
                      <strong className="text-loss/90">
                        −<AnimatedNumber value={result.tax} format={formatEUR} />
                      </strong>
                    </span>
                  ) : null}
                  <span>
                    Soit{" "}
                    <strong className="text-gain">
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
          </motion.div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <motion.div variants={item} whileHover={{ y: -2 }}>
              <StatCard
                tone="brand"
                label="Total investi"
                value={
                  <AnimatedNumber value={result.totalInvested} format={formatEUR} />
                }
                icon={<Wallet className="h-4 w-4" aria-hidden />}
              />
            </motion.div>
            <motion.div variants={item} whileHover={{ y: -2 }}>
              <StatCard
                tone="gold"
                label={applyTax ? "Plus-values nettes" : "Plus-values"}
                value={<AnimatedNumber value={result.netGains} format={formatEUR} />}
              />
            </motion.div>
            <motion.div variants={item} whileHover={{ y: -2 }}>
              <StatCard
                tone="default"
                label="Plus-values brutes"
                value={
                  <AnimatedNumber value={result.grossGains} format={formatEUR} />
                }
              />
            </motion.div>
            <motion.div variants={item} whileHover={{ y: -2 }}>
              <StatCard
                tone="default"
                label={`Flat Tax (${formatPct(FLAT_TAX_RATE * 100)})`}
                value={
                  applyTax ? (
                    <>
                      −<AnimatedNumber value={result.tax} format={formatEUR} />
                    </>
                  ) : (
                    "—"
                  )
                }
                icon={<Landmark className="h-4 w-4" aria-hidden />}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Graphique */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <motion.div
          className="rounded-xl border border-white/10 bg-black/20 p-4 sm:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">
              Évolution de votre investissement
            </h3>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <LegendDot color="#1098f7" label="Capital investi" />
              <LegendDot color="#f8d047" label="Plus-values" />
            </div>
          </div>
          <GrowthChart data={result.series} />
        </motion.div>

        <p className="mt-4 text-xs leading-relaxed text-white/35">
          Projection à titre indicatif, hors frais, sur la base d&apos;un
          rendement annuel constant. Les performances passées ne préjugent pas
          des performances futures. Investir dans les crypto-actifs comporte un
          risque de perte en capital.
        </p>
      </div>
    </section>
  );

  if (!isEmbed) return tool;

  // Mode iframe : page autonome, auto-identifiée, avec lien vers le site.
  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Wordmark />
          <a
            href="https://simulateurs.sinvestir.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-white/50 transition hover:text-white"
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
      onClick={onToggle}
      className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        enabled
          ? "border-brand/40 bg-brand/10 text-white"
          : "border-white/10 bg-white/5 text-white/50"
      }`}
    >
      <span
        className={`relative h-5 w-9 rounded-full transition ${
          enabled ? "bg-brand" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            enabled ? "left-[1.125rem]" : "left-0.5"
          }`}
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
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/30">
        <Coins className="h-4.5 w-4.5" aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">
          S&apos;investir
        </p>
        <p className="text-[11px] text-white/40">Simulateurs</p>
      </div>
    </div>
  );
}
