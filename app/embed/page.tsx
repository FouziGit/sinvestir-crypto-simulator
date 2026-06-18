import type { Metadata } from "next";
import CryptoSimulator from "@/components/CryptoSimulator";

export const metadata: Metadata = {
  title: "Simulateur Crypto — Intégration | S'investir",
  // Page destinée à l'embarquement iframe : on évite son indexation directe.
  robots: { index: false, follow: false },
};

/**
 * Démonstration de l'intégration iframe.
 *
 * Cette route sert le simulateur seul (sans header/footer du site), prêt à
 * être embarqué depuis sinvestir.fr via :
 *   <iframe src="https://<domaine>/embed" width="100%" height="900" />
 */
export default function EmbedPage() {
  return <CryptoSimulator isEmbed />;
}
