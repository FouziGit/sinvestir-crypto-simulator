# Simulateur Crypto — S'investir

Simulateur d'investissement en crypto‑monnaie aux couleurs de la suite
[simulateurs.sinvestir.fr](https://simulateurs.sinvestir.fr). Il projette la
croissance d'une épargne grâce aux **intérêts composés** et aux **versements
programmés (DCA)**, et applique la **Flat Tax (PFU) de 30 %** sur la plus‑value
pour estimer le gain net réel.

> Test technique réalisé pour la candidature « Développeur IA » chez S'investir.

## Démo

- **Page complète** : `/` — le simulateur intégré dans une page au design S'investir.
- **Version intégrable (iframe)** : `/embed` — le simulateur seul, sans header/footer, prêt à être embarqué.

## Lancer le projet en local

Prérequis : **Node 20+** (développé sous Node 22).

```bash
npm install
npm run dev          # http://localhost:3000  (et /embed pour l'intégration)
```

Autres commandes :

```bash
npm run build        # build de production
npm run start        # sert le build de production
npm run test         # tests unitaires du moteur de calcul (Vitest)
npm run lint         # ESLint
```

## Fonctionnalités

- **Entrées** : capital initial, versement mensuel (optionnel), durée, rendement annuel estimé, et activation de la Flat Tax.
- **Sorties** : capital final brut et net, total investi, plus‑values brutes et nettes, montant de l'impôt, multiple du capital.
- **Graphique interactif** (Recharts) : aire empilée *Capital investi* (bleu) vs *Plus‑values* (or), avec tooltip détaillé par année.
- **Sliders + saisie directe** synchronisés, format monétaire `fr-FR`, **responsive** desktop / mobile, et accessibilité (labels, `role="switch"`, focus visible).

## Partis pris techniques

### Stack

| Choix | Pourquoi |
| --- | --- |
| **Next.js 16 (App Router) + TypeScript** | Aligné sur votre stack interne. SSR/SSG natif, typage strict, et un composant client isolé pour l'interactivité. |
| **Tailwind CSS v4** | Même base que `simulateurs.sinvestir.fr` (thème via `@theme`, police **Lexend**, palette bleu `#1098f7` / or `#f8d047` reprise du site). |
| **Recharts** | Graphiques React déclaratifs, légers, sans dépendance lourde. |
| **lucide-react** | Jeu d'icônes cohérent et léger. |
| **Vitest** | Tests unitaires rapides sur la logique métier. |

### Architecture pensée pour l'intégration

- **Logique métier isolée** dans [`lib/calc.ts`](lib/calc.ts) : une fonction pure
  `simulate()`, sans React, **testée unitairement** ([`lib/calc.test.ts`](lib/calc.test.ts)).
  On peut la réutiliser côté serveur, dans une API, un agent ou un job n8n.
- **Composant autonome** [`components/CryptoSimulator.tsx`](components/CryptoSimulator.tsx) :
  état 100 % local, aucune dépendance à un contexte de page. Une seule prop,
  `isEmbed`, suffit à le passer du mode « page » au mode « iframe autonome ».
  → Il peut **remplacer le simulateur actuel** dans `simulateurs.sinvestir.fr`
  comme être **embarqué** depuis `sinvestir.fr`.
- **Route `/embed`** : sert le composant seul, avec l'en‑tête HTTP
  `Content-Security-Policy: frame-ancestors *` (voir [`next.config.ts`](next.config.ts))
  pour autoriser l'embarquement cross‑origin.

```html
<iframe src="https://<votre-domaine>/embed" width="100%" height="900" style="border:0"></iframe>
```

### Méthode de calcul

Simulation **mois par mois**. Le rendement annuel est converti en taux mensuel
géométrique `(1 + r)^(1/12) − 1`, de sorte que 12 mois composés reproduisent
exactement le rendement annuel saisi. Les versements suivent une convention de
**début de période** (le versement du mois fructifie sur ce mois). La Flat Tax
n'est prélevée que sur une **plus‑value positive** (jamais sur une perte).
Projection hors frais, à rendement constant — donc indicative.

### Déploiement

- **Vercel (recommandé, votre stack)** : zéro configuration. Importer le repo →
  build auto (`next build`). Aucun fichier spécifique requis.
- **Netlify** : un [`netlify.toml`](netlify.toml) est fourni (plugin officiel
  `@netlify/plugin-nextjs`) pour un déploiement équivalent.

J'ai laissé les deux car l'énoncé mentionne Netlify tandis que vos simulateurs
tournent sur Vercel : le projet est prêt pour l'un comme pour l'autre.

## Mon regard de partenaire — pistes IA & automatisation

Au‑delà du simulateur, voici comment je transformerais cet outil en **brique de
génération de leads et de pilotage**, dans l'esprit des missions internes :

1. **Capture de lead + nurturing via n8n → HubSpot.**
   Ajouter un champ e‑mail (« recevez votre projection en PDF ») qui déclenche un
   webhook **n8n** : génération du PDF, création/mise à jour du contact dans
   **HubSpot** avec les paramètres de simulation (capital, horizon, profil) comme
   propriétés, puis séquence de nurturing automatique. Le simulateur devient une
   porte d'entrée commerciale qualifiée, pas seulement un gadget.

2. **Hypothèses de rendement dynamiques via Supabase + agent IA.**
   Stocker dans **Supabase** des scénarios de rendement (prudent / médian /
   optimiste) alimentés par un agent (ex. **Claude Code**) qui synthétise des
   données de marché publiques chaque semaine. Le champ « rendement » proposerait
   alors des fourchettes réalistes et sourcées plutôt qu'un chiffre saisi à
   l'aveugle, avec un disclaimer généré automatiquement.

3. **Dashboard de pilotage des simulations.**
   Logguer chaque simulation (anonymisée) dans **Supabase**, puis exposer un
   dashboard interne (ranges de capital, horizons, taux de conversion lead). Un
   agent IA produirait un résumé hebdomadaire (« +18 % de simulations > 50 k€,
   horizon médian 8 ans ») poussé sur Slack/HubSpot pour orienter le contenu et
   les offres. La même logique `simulate()` réutilisée côté serveur garantit des
   chiffres cohérents entre le front et l'analytics.

## Structure du projet

```
app/
  layout.tsx          Police Lexend, métadonnées, langue fr
  page.tsx            Page complète (header, hero, simulateur, footer)
  embed/page.tsx      Version iframe (isEmbed)
  globals.css         Thème S'investir (tokens Tailwind v4 + slider)
components/
  CryptoSimulator.tsx Composant principal (prop isEmbed)
  GrowthChart.tsx     Graphique Recharts
  ui/SliderField.tsx  Champ slider + saisie
  ui/StatCard.tsx     Carte de KPI
lib/
  calc.ts             Moteur de calcul (pur, testé)
  calc.test.ts        Tests unitaires Vitest
  format.ts           Formatage fr-FR (€, %, ×)
netlify.toml          Config déploiement Netlify
```
