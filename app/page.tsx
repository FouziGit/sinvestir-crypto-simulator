import Link from "next/link";
import {
  ArrowRight,
  Coins,
  LineChart,
  Percent,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import CryptoSimulator from "@/components/CryptoSimulator";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-surface/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/30">
              <Coins className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">S&apos;investir</p>
              <p className="text-[11px] text-white/40">Simulateurs</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <a
              href="https://simulateurs.sinvestir.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition hover:text-white sm:block"
            >
              Tous les simulateurs
            </a>
            <a
              href="https://sinvestir.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand/90"
            >
              S&apos;investir
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero + simulateur */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="pt-12 pb-8 text-center sm:pt-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
              <LineChart className="h-3.5 w-3.5 text-brand" aria-hidden />
              Suite d&apos;outils S&apos;investir
            </span>
          </Reveal>
          <Reveal delay={0.07}>
            <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Simulateur d&apos;investissement{" "}
              <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">
                crypto
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/55 sm:text-lg">
              Estimez la croissance de votre épargne crypto grâce aux intérêts
              composés et aux versements programmés (DCA), impôts compris.
            </p>
          </Reveal>
        </section>

        <section className="pb-12">
          <CryptoSimulator />
        </section>

        {/* Comment ça marche */}
        <section className="border-t border-white/5 py-12">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-white">
              Comment fonctionne le simulateur
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Reveal delay={0.05} className="h-full">
              <Feature
                icon={<Percent className="h-5 w-5" aria-hidden />}
                title="Intérêts composés"
                text="Vos gains sont réinvestis chaque mois et génèrent à leur tour des gains, pour un effet boule de neige."
              />
            </Reveal>
            <Reveal delay={0.13} className="h-full">
              <Feature
                icon={<Repeat className="h-5 w-5" aria-hidden />}
                title="Versements programmés"
                text="Le DCA lisse vos points d'entrée : un montant fixe investi chaque mois, quelle que soit la volatilité."
              />
            </Reveal>
            <Reveal delay={0.21} className="h-full">
              <Feature
                icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
                title="Fiscalité incluse"
                text="La Flat Tax (PFU) de 30 % est appliquée à la plus-value pour estimer votre gain net réel."
              />
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white/40 sm:flex-row sm:px-6">
          <p>© 2026 S&apos;investir — Démo technique.</p>
          <Link
            href="/embed"
            className="font-medium text-white/60 transition hover:text-white"
          >
            Voir la version intégrable (iframe) →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-white/50">{text}</p>
    </div>
  );
}
