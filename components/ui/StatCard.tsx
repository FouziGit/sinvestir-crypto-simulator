import type { ReactNode } from "react";

type Tone = "default" | "brand" | "gold" | "gain" | "hero";

interface StatCardProps {
  label: string;
  value: string;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}

const toneValue: Record<Tone, string> = {
  default: "text-white",
  brand: "text-brand",
  gold: "text-gold",
  gain: "text-gain",
  hero: "text-white",
};

const toneShell: Record<Tone, string> = {
  default: "border-white/10 bg-white/[0.03]",
  brand: "border-brand/20 bg-brand/[0.06]",
  gold: "border-gold/20 bg-gold/[0.06]",
  gain: "border-gain/20 bg-gain/[0.06]",
  hero: "border-brand/30 bg-gradient-to-br from-brand/15 via-brand/[0.06] to-transparent",
};

/** Carte de KPI : libellé, valeur mise en avant et indice optionnel. */
export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: StatCardProps) {
  const isHero = tone === "hero";

  return (
    <div
      className={`rounded-xl border p-4 ${toneShell[tone]} ${
        isHero ? "sm:p-5" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">
          {label}
        </p>
        {icon ? <span className="text-white/40">{icon}</span> : null}
      </div>
      <p
        className={`mt-1.5 font-bold tabular-nums ${toneValue[tone]} ${
          isHero ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        }`}
      >
        {value}
      </p>
      {hint ? (
        <div className="mt-1 text-xs text-white/45">{hint}</div>
      ) : null}
    </div>
  );
}
