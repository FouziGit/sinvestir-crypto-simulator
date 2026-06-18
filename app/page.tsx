import Link from "next/link";
import {
  ArrowRight,
  Coins,
  LineChart,
  Percent,
  Repeat,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GoTestButton } from "@/components/GoTestButton";

export default function Home() {
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

          <nav className="flex items-center gap-2">
            <Link
              href="/simulateur"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
            >
              Le simulateur
            </Link>
            <a
              href="https://sinvestir.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold tracking-tight text-zinc-950 transition hover:bg-zinc-200"
            >
              S&apos;investir
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="pt-16 pb-12 text-center sm:pt-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Suite d&apos;outils S&apos;investir
            </span>
          </Reveal>
          <Reveal delay={0.07}>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-bold tracking-[-0.03em] text-white sm:text-6xl">
              Combien votre épargne{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                crypto
              </span>{" "}
              peut-elle rapporter ?
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-zinc-400 sm:text-lg">
              Intérêts composés, versements programmés (DCA) et Flat Tax 30 % :
              ce simulateur projette votre capital net, année après année.
              Bougez les curseurs, le graphique se recalcule en direct.
            </p>
          </Reveal>
          <Reveal delay={0.21}>
            <div className="mt-9 flex flex-col items-center gap-3">
              <GoTestButton />
              <p className="text-xs text-zinc-500">
                ≈ 30 secondes · aucune inscription
              </p>
            </div>
          </Reveal>
        </section>

        <section className="border-t border-white/[0.06] py-16">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Comment ça marche
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-400">
              Trois leviers, un seul résultat : votre capital net réel.
            </p>
          </Reveal>
          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Reveal delay={0.05} className="h-full">
              <Feature
                icon={<Percent className="h-5 w-5" aria-hidden />}
                title="Intérêts composés"
                text="Vos gains sont réinvestis chaque mois et génèrent à leur tour des gains : l'effet boule de neige sur tout l'horizon."
              />
            </Reveal>
            <Reveal delay={0.13} className="h-full">
              <Feature
                icon={<Repeat className="h-5 w-5" aria-hidden />}
                title="Versements programmés"
                text="Le DCA lisse vos points d'entrée : un montant fixe investi chaque mois, quelle que soit la volatilité du marché."
              />
            </Reveal>
            <Reveal delay={0.21} className="h-full">
              <Feature
                icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
                title="Fiscalité incluse"
                text="La Flat Tax (PFU) de 30 % est appliquée à la plus-value pour estimer votre gain net, pas un chiffre brut trompeur."
              />
            </Reveal>
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-16">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ce que vous obtenez
            </h2>
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Reveal delay={0.05} className="h-full">
              <Output
                icon={<TrendingUp className="h-4 w-4" aria-hidden />}
                title="Capital final net"
                text="Après Flat Tax, en euros."
              />
            </Reveal>
            <Reveal delay={0.11} className="h-full">
              <Output
                icon={<Wallet className="h-4 w-4" aria-hidden />}
                title="Total investi"
                text="Ce que vous avez réellement versé."
              />
            </Reveal>
            <Reveal delay={0.17} className="h-full">
              <Output
                icon={<Sparkles className="h-4 w-4" aria-hidden />}
                title="Multiple du capital"
                text="Le ×N réalisé sur votre mise."
              />
            </Reveal>
            <Reveal delay={0.23} className="h-full">
              <Output
                icon={<LineChart className="h-4 w-4" aria-hidden />}
                title="Graphe annuel"
                text="Capital vs plus-values, an par an."
              />
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-zinc-900/50 p-8 text-center backdrop-blur-md sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-sky-500/15 blur-[90px]"
              />
              <h2 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Prêt à voir les chiffres ?
              </h2>
              <p className="relative mx-auto mt-3 max-w-md text-sm text-zinc-400">
                Vos hypothèses, votre horizon, votre résultat net — en temps
                réel.
              </p>
              <div className="relative mt-7 flex justify-center">
                <GoTestButton />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-7 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <p>© 2026 S&apos;investir — Démo technique.</p>
          <Link
            href="/embed"
            className="flex items-center gap-1.5 font-medium text-zinc-400 transition hover:text-white"
          >
            Voir la version intégrable (iframe)
            <LineChart className="h-3.5 w-3.5" aria-hidden />
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
    <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md transition-colors hover:border-emerald-400/20 hover:bg-emerald-400/[0.02]">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}

function Output({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-300 ring-1 ring-inset ring-white/10">
        {icon}
      </span>
      <h3 className="mt-3.5 text-sm font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}
