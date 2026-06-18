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

export function formatEUR(value: number): string {
  return currency0.format(Math.round(value));
}

export function formatPct(value: number): string {
  return `${percent1.format(value)} %`;
}

export function formatMultiple(value: number): string {
  return `×${decimal1.format(value)}`;
}
