"use client";

import { useEffect, useId, useState } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
}

const THUMB = 20;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const thumbLeft = (p: number) =>
  `calc(${clamp01(p) * 100}% - ${clamp01(p) * THUMB}px)`;

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
  const hintId = `${id}-hint`;
  const reduced = useReducedMotion();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = max > min ? clamp01((value - min) / (max - min)) : 0;

  const [draft, setDraft] = useState(String(value));
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(String(value));
  }

  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);

  const progress = useSpring(pct, { stiffness: 260, damping: 32, mass: 0.6 });
  useEffect(() => {
    progress.set(pct);
  }, [pct, progress]);

  const springWidth = useTransform(progress, (p) => `${clamp01(p) * 100}%`);
  const springLeft = useTransform(progress, thumbLeft);

  const width = reduced ? `${pct * 100}%` : springWidth;
  const left = reduced ? thumbLeft(pct) : springLeft;
  const active = dragging || focused;

  const commitDraft = (raw: string) => {
    setDraft(raw);
    const n = Number(raw);
    if (raw.trim() !== "" && Number.isFinite(n)) {
      onChange(clamp(n));
    }
  };

  const normalizeDraft = () => {
    const n = Number(draft);
    const next = draft.trim() === "" || !Number.isFinite(n) ? value : clamp(n);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium tracking-tight text-zinc-300"
        >
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition-colors focus-within:border-emerald-400/60 focus-within:bg-emerald-400/[0.06]">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={draft}
            aria-describedby={hint ? hintId : undefined}
            onChange={(e) => commitDraft(e.target.value)}
            onBlur={normalizeDraft}
            className="w-20 bg-transparent text-right text-sm font-semibold tabular-nums text-white outline-none"
          />
          {unit ? (
            <span className="select-none text-sm font-medium text-zinc-500">
              {unit}
            </span>
          ) : null}
        </div>
      </div>

      {hint ? (
        <p id={hintId} className="text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}

      <div className="relative flex h-6 items-center">
        <div className="relative h-2 w-full rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/[0.04]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
            style={{ width }}
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400/40 blur-[6px]" />
          </motion.div>

          <input
            type="range"
            aria-label={`${label} (curseur)`}
            aria-describedby={hint ? hintId : undefined}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="absolute left-0 top-1/2 z-10 h-6 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent opacity-0"
          />

          <motion.div
            className="pointer-events-none absolute top-1/2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-emerald-400 shadow-[0_2px_14px_rgba(16,185,129,0.5)]"
            style={{ left, y: "-50%" }}
            animate={
              reduced
                ? undefined
                : { scale: dragging ? 1.32 : hovering ? 1.14 : 1 }
            }
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {reduced ? null : (
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-emerald-400/40"
                animate={{ scale: active ? 2.1 : 1, opacity: active ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            )}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-between text-[11px] tabular-nums text-zinc-600">
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
