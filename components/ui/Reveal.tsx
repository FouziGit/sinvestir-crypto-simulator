"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Décalage vertical initial, en pixels. */
  y?: number;
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Révèle son contenu en fondu + légère translation à l'entrée dans le viewport.
 * Une seule fois, sobre (durée 0.5 s, ease-out). MotionConfig désactive le
 * mouvement pour les utilisateurs qui le préfèrent.
 */
export function Reveal({ children, className, delay = 0, y = 12 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
