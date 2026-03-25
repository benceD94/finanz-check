import type { ScenarioInput, DataPoint } from '../types';

export function calculateAmortization(input: ScenarioInput): DataPoint[] {
  const { loanAmount, interestRate, tilgungRate, extraPayment } = input;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = ((interestRate + tilgungRate) / 100 / 12) * loanAmount;

  let balance = loanAmount;
  let totalInterest = 0;
  let yearInterest = 0;
  let yearTilgung = 0;

  const data: DataPoint[] = [
    { year: 0, remainingBalance: balance, totalInterestPaid: 0, yearlyInterest: 0, yearlyTilgung: 0 },
  ];

  const maxMonths = 40 * 12;

  for (let month = 1; month <= maxMonths; month++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    yearInterest += interest;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance -= principal;
    yearTilgung += principal;

    // Apply extra payment at end of each year
    if (month % 12 === 0 && balance > 0) {
      const extra = Math.min(extraPayment, balance);
      balance -= extra;
      yearTilgung += extra;
    }

    if (balance <= 0) {
      balance = 0;
      const year = Math.round((month / 12) * 100) / 100;
      data.push({
        year,
        remainingBalance: 0,
        totalInterestPaid: Math.round(totalInterest * 100) / 100,
        yearlyInterest: Math.round(yearInterest * 100) / 100,
        yearlyTilgung: Math.round(yearTilgung * 100) / 100,
      });
      break;
    }

    // Record yearly snapshot
    if (month % 12 === 0) {
      data.push({
        year: month / 12,
        remainingBalance: Math.round(balance * 100) / 100,
        totalInterestPaid: Math.round(totalInterest * 100) / 100,
        yearlyInterest: Math.round(yearInterest * 100) / 100,
        yearlyTilgung: Math.round(yearTilgung * 100) / 100,
      });
      yearInterest = 0;
      yearTilgung = 0;
    }
  }

  return data;
}

export function formatLabel(input: ScenarioInput): string {
  const rate = input.interestRate % 1 === 0
    ? input.interestRate.toFixed(0)
    : input.interestRate.toFixed(2).replace(/0+$/, '');
  const tilgung = input.tilgungRate % 1 === 0
    ? input.tilgungRate.toFixed(0)
    : input.tilgungRate.toFixed(2).replace(/0+$/, '');
  const extra = input.extraPayment >= 1000
    ? `${(input.extraPayment / 1000)}k`
    : `${input.extraPayment}`;
  const loan = input.loanAmount >= 1000
    ? `${(input.loanAmount / 1000)}k`
    : `${input.loanAmount}`;
  return `${loan} @ ${rate}% / ${tilgung}% / ${extra} extra`;
}
