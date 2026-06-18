import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simulateur Crypto | S'investir",
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
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-950 text-zinc-50">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_78%_55%_at_50%_-5%,#000_10%,transparent_72%)]" />
          <div className="absolute -top-48 right-[-12%] h-[540px] w-[540px] rounded-full bg-emerald-500/15 blur-[140px]" />
          <div className="absolute -top-44 left-[-12%] h-[480px] w-[480px] rounded-full bg-sky-500/10 blur-[140px]" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
