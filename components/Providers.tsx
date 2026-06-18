"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Honore prefers-reduced-motion globalement : Motion réduit alors les
 * animations de transformation/layout sans code conditionnel dispersé.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
