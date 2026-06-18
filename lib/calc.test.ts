import { describe, it, expect } from "vitest";
import { simulate, monthlyRateFromAnnual } from "./calc";

const base = {
  initialCapital: 0,
  monthlyContribution: 0,
  years: 1,
  annualReturnPct: 0,
  flatTaxRate: 0.3,
};

describe("monthlyRateFromAnnual", () => {
  it("returns 0 for a 0 % annual return", () => {
    expect(monthlyRateFromAnnual(0)).toBe(0);
  });

  it("compounds back to the annual return over 12 months", () => {
    const r = monthlyRateFromAnnual(10);
    expect(Math.pow(1 + r, 12) - 1).toBeCloseTo(0.1, 10);
  });
});

describe("simulate", () => {
  it("keeps capital flat with a 0 % return", () => {
    const r = simulate({ ...base, initialCapital: 1000 });
    expect(r.finalGross).toBeCloseTo(1000, 6);
    expect(r.grossGains).toBeCloseTo(0, 6);
    expect(r.tax).toBe(0);
    expect(r.finalNet).toBeCloseTo(1000, 6);
  });

  it("applies compound interest to a lump sum", () => {
    const r = simulate({ ...base, initialCapital: 1000, annualReturnPct: 10 });
    expect(r.finalGross).toBeCloseTo(1100, 6);
    expect(r.grossGains).toBeCloseTo(100, 6);
    expect(r.tax).toBeCloseTo(30, 6);
    expect(r.finalNet).toBeCloseTo(1070, 6);
    expect(r.netGains).toBeCloseTo(70, 6);
  });

  it("counts every monthly contribution in the invested total", () => {
    const r = simulate({ ...base, monthlyContribution: 100, annualReturnPct: 0 });
    expect(r.totalInvested).toBe(1200);
    expect(r.finalGross).toBeCloseTo(1200, 6);
    expect(r.grossGains).toBeCloseTo(0, 6);
  });

  it("never taxes a loss", () => {
    const r = simulate({ ...base, initialCapital: 1000, annualReturnPct: -10 });
    expect(r.finalGross).toBeCloseTo(900, 6);
    expect(r.grossGains).toBeCloseTo(-100, 6);
    expect(r.tax).toBe(0);
    expect(r.finalNet).toBeCloseTo(900, 6);
  });

  it("exposes one chart point per year plus the origin", () => {
    const r = simulate({ ...base, initialCapital: 1000, years: 10, annualReturnPct: 8 });
    expect(r.series).toHaveLength(11);
    expect(r.series[0]).toEqual({ year: 0, invested: 1000, value: 1000, gains: 0 });
    expect(r.series.at(-1)!.year).toBe(10);
  });

  it("keeps invested + gains equal to value at every point", () => {
    const r = simulate({
      initialCapital: 5000,
      monthlyContribution: 200,
      years: 15,
      annualReturnPct: 12,
      flatTaxRate: 0.3,
    });
    for (const p of r.series) {
      expect(p.invested + p.gains).toBeCloseTo(p.value, 6);
    }
  });

  it("combines a lump sum with DCA and taxes only the gain", () => {
    const r = simulate({
      initialCapital: 1000,
      monthlyContribution: 150,
      years: 10,
      annualReturnPct: 10,
      flatTaxRate: 0.3,
    });
    expect(r.totalInvested).toBe(1000 + 150 * 120);
    expect(r.finalGross).toBeGreaterThan(r.totalInvested);
    expect(r.tax).toBeCloseTo(r.grossGains * 0.3, 6);
    expect(r.finalNet).toBeCloseTo(r.finalGross - r.tax, 6);
    expect(r.multiple).toBeCloseTo(r.finalNet / r.totalInvested, 6);
  });

  it("handles a zero-duration simulation gracefully", () => {
    const r = simulate({ ...base, initialCapital: 1000, years: 0 });
    expect(r.series).toHaveLength(1);
    expect(r.finalGross).toBe(1000);
    expect(r.multiple).toBeCloseTo(1, 6);
  });

  it("pins beginning-of-period (annuity-due) contribution timing", () => {
    const r = simulate({
      initialCapital: 1000,
      monthlyContribution: 150,
      years: 10,
      annualReturnPct: 10,
      flatTaxRate: 0.3,
    });
    expect(r.finalGross).toBeCloseTo(32812.38, 1);
    expect(r.finalNet).toBeCloseTo(28668.67, 1);
  });
});
