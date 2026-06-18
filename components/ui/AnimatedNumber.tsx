"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "motion/react";

interface AnimatedNumberProps {
  /** Valeur cible. Le ressort interpole en douceur vers cette valeur. */
  value: number;
  /** Formateur appliqué à chaque image (€, %, ×…). Doit gérer les flottants. */
  format: (value: number) => string;
}

/**
 * Compteur animé : la valeur formatée « roule » en douceur vers sa cible
 * quand les paramètres changent (technique useSpring/useTransform, inspirée
 * d'un composant 21st.dev, adaptée au format monétaire fr-FR et aux signes).
 *
 * Ressort sur-amorti (pas de rebond) pour un rendu FinTech sobre, pas gadget.
 * Respecte prefers-reduced-motion.
 */
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const prefersReduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 30, mass: 0.8 });
  const display = useTransform(spring, format);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  if (prefersReduced) {
    return <span className="tabular-nums">{format(value)}</span>;
  }

  return <motion.span className="tabular-nums">{display}</motion.span>;
}
