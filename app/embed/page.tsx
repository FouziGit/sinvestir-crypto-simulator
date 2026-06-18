import type { Metadata } from "next";
import CryptoSimulator from "@/components/CryptoSimulator";

export const metadata: Metadata = {
  title: "Simulateur Crypto — Intégration | S'investir",
  robots: { index: false, follow: false },
};

export default function EmbedPage() {
  return <CryptoSimulator isEmbed />;
}
