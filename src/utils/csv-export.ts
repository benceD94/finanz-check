import type { ScenarioInput } from '../types';

interface MonthlyRow {
  datum: string;
  saldo: number;
  zahlung: number;
  zinsen: number;
  tilgung: number;
  gebuehren: number;
  kontofuehrungsgebuehr: number;
}

function formatNumber(n: number): string {
  return n.toFixed(2).replace('.', ',');
}

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export function generateMonthlyRows(input: ScenarioInput, startDate: Date): MonthlyRow[] {
  const { loanAmount, interestRate, tilgungRate, extraPayment } = input;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = ((interestRate + tilgungRate) / 100 / 12) * loanAmount;

  let balance = loanAmount;
  const rows: MonthlyRow[] = [];
  const maxMonths = 40 * 12;

  for (let month = 0; month <= maxMonths; month++) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);

    if (month === 0) {
      rows.push({
        datum: formatDate(date),
        saldo: balance,
        zahlung: 0,
        zinsen: 0,
        tilgung: 0,
        gebuehren: 0,
        kontofuehrungsgebuehr: 0,
      });
      continue;
    }

    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance -= principal;

    rows.push({
      datum: formatDate(date),
      saldo: Math.round(balance * 100) / 100,
      zahlung: Math.round(monthlyPayment * 100) / 100,
      zinsen: Math.round(interest * 100) / 100,
      tilgung: Math.round(principal * 100) / 100,
      gebuehren: 0,
      kontofuehrungsgebuehr: 0,
    });

    // Extra payment at end of each year
    if (month % 12 === 0 && balance > 0 && extraPayment > 0) {
      const extra = Math.min(extraPayment, balance);
      balance -= extra;
      const extraDate = new Date(date.getFullYear(), date.getMonth(), 2);
      rows.push({
        datum: formatDate(extraDate),
        saldo: Math.round(balance * 100) / 100,
        zahlung: Math.round(extra * 100) / 100,
        zinsen: 0,
        tilgung: Math.round(extra * 100) / 100,
        gebuehren: 0,
        kontofuehrungsgebuehr: 0,
      });
    }

    if (balance <= 0) break;
  }

  return rows;
}

export function exportScenarioCsv(input: ScenarioInput, label: string, startDate: Date): void {
  const rows = generateMonthlyRows(input, startDate);
  const sep = ';';
  const header = [
    'Datum',
    'Saldo',
    'Zahlung',
    'Zinsen',
    'Tilgung(+) / Belastung(-)',
    'Gebühren',
    'Kontoführungsgebühr',
  ].join(sep);

  const lines = rows.map((r) =>
    [
      r.datum,
      formatNumber(r.saldo),
      formatNumber(r.zahlung),
      formatNumber(r.zinsen),
      formatNumber(r.tilgung),
      formatNumber(r.gebuehren),
      formatNumber(r.kontofuehrungsgebuehr),
    ].join(sep)
  );

  const csv = '\uFEFF' + [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${label.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
