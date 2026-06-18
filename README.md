# Simulateur Crypto — S'investir

Simulateur d'investissement crypto au design « cinétique » : un widget sombre,
fluide et premium qui projette la croissance d'une épargne grâce aux **intérêts
composés** et aux **versements programmés (DCA)**, puis applique la **Flat Tax
(PFU) de 30 %** sur la plus-value pour estimer le gain net réel.

> Test technique réalisé pour la candidature « Développeur IA » chez S'investir.

## Démo

- **Accueil** : `/` — page de présentation (design + animations) qui explique le
  simulateur, avec un bouton vers l'outil.
- **Simulateur** : `/simulateur` — l'outil interactif complet.
- **Version intégrable (iframe)** : `/embed` — le widget seul, sans header/footer,
  prêt à être embarqué partout sans friction.

## Lancer le projet en local

Prérequis : **Node 20+** (développé sous Node 22).

```bash
npm install
npm run dev          # http://localhost:3000  (et /embed pour l'intégration)
```

Autres commandes :

```bash
npm run build        # build statique -> dossier out/ (output: "export")
npx serve out        # sert le build statique en local
npm run test         # tests unitaires du moteur de calcul (Vitest)
npm run lint         # ESLint
```

## Le design : un parti pris anti « interface générique »

L'objectif n'était pas de poser des composants par défaut, mais de produire une
interface qui donne envie d'agir.

- **Dark mode sophistiqué** sur fond `zinc-950`, avec un pattern de points et des
  **lueurs radiales** (emeraude / sky) générées **100 % en CSS** — zéro image.
- **Verre dépoli** (`backdrop-blur`) sur toutes les cartes, contrastes typographiques
  affirmés (`text-zinc-400` vs `text-white`) et **tracking serré**.
- **Palette** : emeraude comme signal de croissance (plus-values, capital net),
  sky pour le capital investi, rose pour l'impôt. Lisible et cohérente.

## Les animations : Framer Motion, physique de ressort

Toutes les animations passent par **Framer Motion**, pilotées par une **physique
de ressort** (`useSpring`) plutôt que par des durées fixes — c'est ce qui donne
la sensation « vivante » sans jamais tomber dans le gadget.

- **Compteurs KPI animés** — chaque chiffre est une `MotionValue` interpolée par un
  ressort sur-amorti (`stiffness: 140, damping: 30`) puis formatée à la volée via
  `useTransform` (format monétaire `fr-FR`). Quand on bouge un curseur, les montants
  « roulent » vers leur nouvelle valeur au lieu de sauter.
- **Sliders custom** — le rail natif est masqué ; la jauge et le curseur sont des
  éléments Motion dont la position suit un `useSpring` (`stiffness: 260`). Le curseur
  réagit au survol, au focus clavier et au drag avec un ressort de scale dédié
  (`stiffness: 420`). On garde l'`<input type="range">` natif pour l'accessibilité
  (clavier, tactile, lecteurs d'écran).
- **Révélations progressives** — le hero et les sections d'explication entrent en
  `whileInView` (et restent visibles sous `prefers-reduced-motion`) ; les cartes de
  KPI se soulèvent légèrement au survol. Les KPI et le graphique, eux, sont toujours
  rendus : aucune donnée n'est masquée derrière une animation.
- **`MotionConfig reducedMotion="user"`** — toutes les animations de transformation
  sont coupées automatiquement si l'utilisateur a activé « réduire les animations ».

## Le graphique

`AreaChart` Recharts entièrement recustomisé, jamais le style par défaut :

- deux **dégradés SVG verticaux** (`<defs>`) — emeraude pour les plus-values, sky pour
  le capital investi — passant de l'opaque vers le transparent ;
- un **tooltip React custom** : carte flottante en verre dépoli, flou d'arrière-plan
  et ombre portée douce, valeurs formatées `fr-FR` ;
- axes et grille réduits à l'essentiel, points actifs nets au survol.

## Partis pris techniques

### Stack

| Choix                                    | Pourquoi                                                                                                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 (App Router) + TypeScript** | Aligné sur votre stack interne. Build en **export statique** (`output: "export"`) car l'app n'a aucune logique serveur ; typage strict, composants client isolés pour l'interactivité. |
| **Tailwind CSS v4**                      | Thème via `@theme`, palette `zinc` + `emerald` native, patterns et lueurs en pur CSS.                                                                                                  |
| **Framer Motion**                        | Toutes les animations et micro-interactions, en physique de ressort, avec respect de `prefers-reduced-motion`.                                                                         |
| **Recharts**                             | Graphiques React déclaratifs, légers, entièrement recustomisés (dégradés SVG + tooltip maison).                                                                                        |
| **lucide-react**                         | Jeu d'icônes cohérent et léger.                                                                                                                                                        |
| **Vitest**                               | Tests unitaires rapides sur la logique métier.                                                                                                                                         |

### Architecture pensée pour l'intégration

- **Logique métier isolée** dans [`lib/calc.ts`](lib/calc.ts) : une fonction pure
  `simulate()`, sans React, **testée unitairement** ([`lib/calc.test.ts`](lib/calc.test.ts)).
  Réutilisable côté serveur, dans une API, un agent ou un workflow n8n.
- **Composant autonome** [`components/CryptoSimulator.tsx`](components/CryptoSimulator.tsx) :
  état 100 % local, aucune dépendance à un contexte de page. Une seule prop,
  `isEmbed`, le fait passer du mode « page » au mode « widget iframe autonome ».
  Il peut donc **remplacer le simulateur actuel** de `simulateurs.sinvestir.fr`
  comme être **embarqué** depuis `sinvestir.fr`.
- **Route `/embed`** : sert le composant seul, avec l'en-tête HTTP
  `Content-Security-Policy: frame-ancestors *` (configuré dans [`netlify.toml`](netlify.toml))
  pour autoriser l'embarquement cross-origin.

```html
<iframe
  src="https://<votre-domaine>/embed"
  width="100%"
  height="900"
  style="border:0"
></iframe>
```

### Méthode de calcul

Simulation **mois par mois**. Le rendement annuel est converti en taux mensuel
géométrique `(1 + r)^(1/12) − 1`, de sorte que 12 mois composés reproduisent
exactement le rendement annuel saisi. Les versements suivent une convention de
**début de période**. La Flat Tax n'est prélevée que sur une **plus-value positive**
(jamais sur une perte). Projection hors frais, à rendement constant, donc indicative.

### Déploiement

Compilé en **export 100 % statique** (`output: "export"`) : `npm run build` produit
un dossier `out/` servable par n'importe quel CDN, sans runtime serveur.

- **Netlify (démo en ligne)** : [`netlify.toml`](netlify.toml) publie `out/` et pose
  l'en-tête CSP sur `/embed`. Déploiement : `netlify deploy --prod --dir=out`.
- **Vercel (votre stack)** : import zéro-configuration ; sert le même export statique.

## Mon regard de partenaire — 3 pistes IA & automatisation

Au-delà du simulateur, voici comment je le transformerais en **brique d'acquisition
et de pilotage** pour l'écosystème commercial S'investir.

1. **Capture de lead + nurturing piloté par scénario, via n8n → HubSpot.**
   Un champ « recevez votre projection en PDF » déclenche un webhook **n8n** :
   génération du PDF, upsert du contact **HubSpot** avec les paramètres de simulation
   (capital, horizon, profil de risque) en propriétés, puis séquence de nurturing
   choisie automatiquement selon le segment. Le simulateur devient une porte d'entrée
   commerciale qualifiée, pas un simple gadget.

2. **Hypothèses de rendement sourcées et expliquées par un agent IA.**
   Un agent (orchestré dans n8n) synthétise chaque semaine des données de marché
   publiques et alimente dans **Supabase** trois scénarios — prudent / médian /
   optimiste. Le champ « rendement » propose alors des fourchettes réalistes et
   datées plutôt qu'un chiffre saisi à l'aveugle, avec un disclaimer généré
   automatiquement et conforme.

3. **Boucle de conversion augmentée : scoring + relance intelligente.**
   Chaque simulation (anonymisée) est logguée dans **Supabase** ; un agent score
   l'intention (montant, horizon, récurrence des visites) et déclenche via **n8n**
   la bonne action : e-mail personnalisé, attribution à un conseiller, ou résumé
   hebdo poussé sur Slack/HubSpot (« +18 % de simulations > 50 k€, horizon médian
   8 ans ») pour orienter contenus et offres. La même logique `simulate()` réutilisée
   côté serveur garantit des chiffres cohérents entre le front et l'analytics.

## Structure du projet

```
app/
  layout.tsx          Police Inter, fond (grille + lueurs CSS), métadonnées, langue fr
  page.tsx            Accueil : présentation + CTA "Ouais, go test"
  simulateur/page.tsx L'outil interactif (CryptoSimulator)
  embed/page.tsx      Version iframe (isEmbed)
  globals.css         Thème (tokens Tailwind v4 + reset slider natif)
components/
  CryptoSimulator.tsx Composant principal (prop isEmbed)
  GoTestButton.tsx    Bouton CTA animé vers /simulateur
  GrowthChart.tsx     Graphique Recharts custom (dégradés SVG + tooltip maison)
  Providers.tsx       MotionConfig (prefers-reduced-motion)
  ui/SliderField.tsx  Slider custom à ressort (Framer Motion)
  ui/StatCard.tsx     Carte de KPI en verre dépoli
  ui/AnimatedNumber.tsx  Compteur animé (useSpring + useTransform)
  ui/Reveal.tsx       Révélation à l'entrée dans le viewport
lib/
  calc.ts             Moteur de calcul (pur, testé)
  calc.test.ts        Tests unitaires Vitest
  format.ts           Formatage fr-FR (€, %, ×)
netlify.toml          Config déploiement Netlify
```
