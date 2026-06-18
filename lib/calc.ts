export interface SimulationInput {
  initialCapital: number;
  monthlyContribution: number;
  years: number;
  annualReturnPct: number;
  flatTaxRate: number;
}

export interface YearPoint {
  year: number;
  invested: number;
  value: number;
  gains: number;
}

export interface SimulationResult {
  totalInvested: number;
  finalGross: number;
  grossGains: number;
  tax: number;
  finalNet: number;
  netGains: number;
  multiple: number;
  series: YearPoint[];
}

export function monthlyRateFromAnnual(annualReturnPct: number): number {
  return Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
}

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
