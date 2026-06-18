/**
 * Moteur de calcul du simulateur d'investissement crypto.
 *
 * Logique : intérêts composés + versements programmés (DCA), avec
 * imposition optionnelle à la Flat Tax (PFU) sur la plus-value.
 *
 * Toute la logique métier est isolée ici, sans dépendance à React, afin
 * d'être testable unitairement et réutilisable côté serveur comme client.
 */

export interface SimulationInput {
  /** Capital initial investi à t0, en euros. */
  initialCapital: number;
  /** Versement récurrent mensuel (DCA), en euros. */
  monthlyContribution: number;
  /** Durée du placement, en années. */
  years: number;
  /** Rendement annuel estimé, en pourcentage (ex. 10 = 10 %). */
  annualReturnPct: number;
  /** Taux d'imposition appliqué à la plus-value (ex. 0.3 pour la Flat Tax). */
  flatTaxRate: number;
}

/** Un point de la courbe d'évolution (une valeur par fin d'année). */
export interface YearPoint {
  year: number;
  /** Capital cumulé réellement investi à cette date. */
  invested: number;
  /** Valeur brute du portefeuille à cette date. */
  value: number;
  /** Plus-value latente (value - invested). Peut être négative. */
  gains: number;
}

export interface SimulationResult {
  /** Total des sommes versées (capital initial + versements). */
  totalInvested: number;
  /** Capital final avant impôt. */
  finalGross: number;
  /** Plus-value brute générée. */
  grossGains: number;
  /** Montant de l'impôt (Flat Tax) prélevé sur la plus-value positive. */
  tax: number;
  /** Capital final après impôt. */
  finalNet: number;
  /** Plus-value nette d'impôt. */
  netGains: number;
  /** Multiple du capital investi (finalNet / totalInvested). */
  multiple: number;
  /** Série annuelle pour le graphique d'évolution. */
  series: YearPoint[];
}

/**
 * Convertit un rendement annuel effectif en taux mensuel équivalent.
 * On utilise la moyenne géométrique : (1 + annuel)^(1/12) - 1, de sorte
 * que 12 mois composés reproduisent exactement le rendement annuel saisi.
 */
export function monthlyRateFromAnnual(annualReturnPct: number): number {
  return Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
}

/**
 * Lance la simulation mois par mois.
 *
 * Convention : le versement mensuel est déposé en début de mois puis
 * fructifie sur le mois (rente de début de période / "annuity due"), tout
 * comme le capital initial. Une photographie de l'encours est prise à chaque
 * fin d'année pour alimenter le graphique.
 */
export function simulate(input: SimulationInput): SimulationResult {
  const years = Math.max(0, Math.floor(input.years));
  const months = years * 12;
  const monthlyRate = monthlyRateFromAnnual(input.annualReturnPct);
  const initial = Math.max(0, input.initialCapital);
  const monthly = Math.max(0, input.monthlyContribution);
  const flatTaxRate = clamp(input.flatTaxRate, 0, 1);

  let balance = initial;
  const series: YearPoint[] = [
    { year: 0, invested: initial, value: initial, gains: 0 },
  ];

  for (let m = 1; m <= months; m++) {
    balance = (balance + monthly) * (1 + monthlyRate);

    if (m % 12 === 0) {
      const year = m / 12;
      const invested = initial + monthly * m;
      series.push({
        year,
        invested,
        value: balance,
        gains: balance - invested,
      });
    }
  }

  const totalInvested = initial + monthly * months;
  const finalGross = balance;
  const grossGains = finalGross - totalInvested;
  const tax = Math.max(0, grossGains) * flatTaxRate;
  const finalNet = finalGross - tax;
  const netGains = grossGains - tax;
  const multiple = totalInvested > 0 ? finalNet / totalInvested : 0;

  return {
    totalInvested,
    finalGross,
    grossGains,
    tax,
    finalNet,
    netGains,
    multiple,
    series,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
