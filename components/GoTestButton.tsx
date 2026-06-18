"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GoTestButtonProps {
  label?: string;
  className?: string;
}

export function GoTestButton({
  label = "Lancer le simulateur",
  className,
}: GoTestButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-block ${className ?? ""}`}
    >
      <Link
        href="/simulateur"
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-6 py-3.5 text-base font-semibold tracking-tight text-zinc-950 shadow-lg shadow-emerald-500/30 transition-shadow hover:shadow-emerald-500/50"
      >
        {label}
        <ArrowRight
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </motion.div>
  );
}
