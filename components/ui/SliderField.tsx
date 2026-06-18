"use client";

import { useId } from "react";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Suffixe d'unité affiché à droite de la valeur (€, %, ans...). */
  unit?: string;
  /** Texte d'aide optionnel sous le libellé. */
  hint?: string;
}

/**
 * Champ de saisie combinant un input numérique éditable et un slider,
 * synchronisés. La valeur est bornée à [min, max] dans les deux sens.
 */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: SliderFieldProps) {
  const id = useId();

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-white/80">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/40">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange(Number.isNaN(v) ? min : clamp(v));
            }}
            className="w-20 bg-transparent text-right text-sm font-semibold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {unit ? (
            <span className="select-none text-sm font-medium text-white/50">
              {unit}
            </span>
          ) : null}
        </div>
      </div>

      {hint ? <p className="text-xs text-white/40">{hint}</p> : null}

      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="slider-input w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />

      <div className="flex justify-between text-[11px] text-white/30">
        <span>
          {min}
          {unit ? ` ${unit}` : ""}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
    </div>
  );
}
