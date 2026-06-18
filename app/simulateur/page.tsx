import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import CryptoSimulator from "@/components/CryptoSimulator";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Simulateur Crypto — S'investir",
  description:
    "Projetez la croissance de votre épargne crypto : intérêts composés, versements programmés (DCA) et Flat Tax 30 %.",
};

export default function SimulateurPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-zinc-950/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-950 shadow-lg shadow-emerald-500/25">
              <Coins className="h-4 w-4" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-white">
                S&apos;investir
              </p>
              <p className="text-[11px] text-zinc-500">Simulateurs</p>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="pt-12 pb-8 text-center sm:pt-16">
          <Reveal>
            <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
              Simulateur{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                crypto
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.07}>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-zinc-400 sm:text-lg">
              Bougez les curseurs : capital net, plus-values et graphique se
              recalculent en direct.
            </p>
          </Reveal>
        </section>

        <section className="pb-14">
          <CryptoSimulator />
        </section>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-7 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <p>© 2026 S&apos;investir — Démo technique.</p>
          <Link
            href="/embed"
            className="font-medium text-zinc-400 transition hover:text-white"
          >
            Voir la version intégrable (iframe) →
          </Link>
        </div>
      </footer>
    </div>
  );
}
