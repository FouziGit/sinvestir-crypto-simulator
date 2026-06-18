import type { ReactNode } from "react";

type Tone = "default" | "invested" | "gain" | "hero";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}

const toneValue: Record<Tone, string> = {
  default: "text-white",
  invested: "text-sky-300",
  gain: "text-emerald-300",
  hero: "text-white",
};

const toneShell: Record<Tone, string> = {
  default: "border-white/[0.08] bg-white/[0.03]",
  invested: "border-sky-400/20 bg-sky-400/[0.05]",
  gain: "border-emerald-400/20 bg-emerald-400/[0.05]",
  hero: "border-emerald-400/25 bg-zinc-900/60",
};

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
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md ${toneShell[tone]} ${
        isHero ? "p-5 sm:p-6" : "p-4"
      }`}
    >
      {isHero ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-[80px]"
        />
      ) : null}

      <div className="relative flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {label}
        </p>
        {icon ? <span className="text-zinc-500">{icon}</span> : null}
      </div>
      <p
        className={`relative mt-1.5 font-semibold tracking-tight tabular-nums ${toneValue[tone]} ${
          isHero ? "text-4xl sm:text-5xl" : "text-xl sm:text-2xl"
        }`}
      >
        {value}
      </p>
      {hint ? (
        <div className="relative mt-2 text-xs text-zinc-400">{hint}</div>
      ) : null}
    </div>
  );
}
