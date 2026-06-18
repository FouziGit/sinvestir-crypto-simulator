"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
}

export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const prefersReduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 30, mass: 0.8 });
  const display = useTransform(spring, format);

  useEffect(() => {
    if (!prefersReduced) spring.set(value);
  }, [value, spring, prefersReduced]);

  if (prefersReduced) {
    return <span className="tabular-nums">{format(value)}</span>;
  }

  return <motion.span className="tabular-nums">{display}</motion.span>;
}
