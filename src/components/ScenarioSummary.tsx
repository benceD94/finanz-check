import type { Scenario } from '../types';

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#be185d', '#65a30d', '#6366f1', '#ea580c',
];

interface Props {
  scenarios: Scenario[];
  onRemove: (id: string) => void;
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ScenarioSummary({ scenarios, onRemove }: Props) {
  if (scenarios.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4 font-medium">Scenario</th>
            <th className="py-2 pr-4 font-medium text-right">Loan</th>
            <th className="py-2 pr-4 font-medium text-right">Rate</th>
            <th className="py-2 pr-4 font-medium text-right">Tilgung</th>
            <th className="py-2 pr-4 font-medium text-right">Extra/yr</th>
            <th className="py-2 pr-4 font-medium text-right">Payoff</th>
            <th className="py-2 pr-4 font-medium text-right">Total interest</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => {
            const years = Math.floor(s.payoffYears);
            const months = Math.round((s.payoffYears - years) * 12);
            return (
              <tr key={s.id} className="border-b border-gray-100">
                <td className="py-2 pr-4 flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-gray-900 font-medium">{s.label}</span>
                </td>
                <td className="py-2 pr-4 text-right text-gray-700">
                  {formatEuro(s.input.loanAmount)}
                </td>
                <td className="py-2 pr-4 text-right text-gray-700">
                  {s.input.interestRate}%
                </td>
                <td className="py-2 pr-4 text-right text-gray-700">
                  {s.input.tilgungRate}%
                </td>
                <td className="py-2 pr-4 text-right text-gray-700">
                  {formatEuro(s.input.extraPayment)}
                </td>
                <td className="py-2 pr-4 text-right text-gray-700">
                  {years}y {months}m
                </td>
                <td className="py-2 pr-4 text-right font-medium text-gray-900">
                  {formatEuro(s.totalInterest)}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => onRemove(s.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove scenario"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
