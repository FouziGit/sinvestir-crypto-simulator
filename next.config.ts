import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Export 100 % statique : l'app n'a aucune logique serveur. Le build produit
  // un dossier `out/` déployable sur n'importe quel CDN (Netlify, Vercel…),
  // idéal pour un widget embarquable. Les en-têtes (CSP iframe) sont gérés au
  // niveau de l'hébergeur (voir netlify.toml).
  output: "export",
  // Épingle la racine du workspace (plusieurs lockfiles peuvent exister sur la
  // machine de dev) pour un build déterministe.
  turbopack: { root: projectRoot },
};

export default nextConfig;
