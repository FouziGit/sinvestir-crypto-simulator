import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Épingle la racine du workspace (plusieurs lockfiles peuvent exister sur la
  // machine de dev) pour un build déterministe.
  turbopack: { root: projectRoot },
  async headers() {
    return [
      {
        // Autorise l'embarquement iframe cross-origin de la route /embed
        // (frame-ancestors moderne ; remplace X-Frame-Options).
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

export default nextConfig;
