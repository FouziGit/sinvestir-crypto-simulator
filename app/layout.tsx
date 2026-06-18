import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simulateur Crypto | S'investir Simulateurs",
  description:
    "Estimez les gains de votre investissement crypto : intérêts composés, versements programmés (DCA) et Flat Tax 30 %. Un simulateur de la suite S'investir.",
  applicationName: "S'investir Simulateurs",
  authors: [{ name: "S'investir" }],
  openGraph: {
    title: "Simulateur Crypto | S'investir",
    description:
      "Projetez la croissance de votre investissement crypto avec les intérêts composés et le DCA.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
