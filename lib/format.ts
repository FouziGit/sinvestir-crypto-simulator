/** Formatage localisé (fr-FR) des montants et pourcentages. */

const currency0 = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const percent1 = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const decimal1 = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

/** Montant en euros, arrondi à l'unité : « 12 345 € ». */
export function formatEUR(value: number): string {
  return currency0.format(Math.round(value));
}

/** Pourcentage : « 8,5 % ». */
export function formatPct(value: number): string {
  return `${percent1.format(value)} %`;
}

/** Multiple : « ×3,2 ». */
export function formatMultiple(value: number): string {
  return `×${decimal1.format(value)}`;
}
