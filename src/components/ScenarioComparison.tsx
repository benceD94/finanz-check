import { useState } from 'react';
import type { Scenario } from '../types';

interface Props {
  scenarios: Scenario[];
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatYears(y: number): string {
  const years = Math.floor(y);
  const months = Math.round((y - years) * 12);
  return `${years}y ${months}m`;
}

export default function ScenarioComparison({ scenarios }: Props) {
  const [open, setOpen] = useState(false);

  if (scenarios.length < 2) return null;

  const totals = scenarios.map((s) => ({
    scenario: s,
    totalPayment: s.input.loanAmount + s.totalInterest,
  }));

  const cheapest = totals.reduce((min, t) => (t.totalPayment < min.totalPayment ? t : min));
  const fastest = scenarios.reduce((min, s) => (s.payoffYears < min.payoffYears ? s : min));

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full sm:w-auto px-5 h-10 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
      >
        {open ? 'Hide comparison' : 'Compare scenarios'}
      </button>

      {open && (
        <div className="mt-6 space-y-6">
          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-sm text-green-700 font-medium">Cheapest overall</div>
              <div className="text-base sm:text-lg font-bold text-green-900 mt-1 break-words">{cheapest.scenario.label}</div>
              <div className="text-sm text-green-700 mt-1">
                Total: {formatEuro(cheapest.totalPayment)} ({formatEuro(cheapest.scenario.totalInterest)} interest)
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm text-blue-700 font-medium">Fastest payoff</div>
              <div className="text-base sm:text-lg font-bold text-blue-900 mt-1 break-words">{fastest.label}</div>
              <div className="text-sm text-blue-700 mt-1">
                Paid off in {formatYears(fastest.payoffYears)}
              </div>
            </div>
          </div>

          {/* Mobile: card layout */}
          <div className="sm:hidden space-y-3">
            {totals.map((t) => {
              const diffCost = t.totalPayment - cheapest.totalPayment;
              const diffTime = t.scenario.payoffYears - fastest.payoffYears;
              return (
                <div key={t.scenario.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-900 mb-2 truncate">{t.scenario.label}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div className="text-gray-500">Total payment</div>
                    <div className="text-right text-gray-700">{formatEuro(t.totalPayment)}</div>
                    <div className="text-gray-500">Total interest</div>
                    <div className="text-right text-gray-700">{formatEuro(t.scenario.totalInterest)}</div>
                    <div className="text-gray-500">Payoff</div>
                    <div className="text-right text-gray-700">{formatYears(t.scenario.payoffYears)}</div>
                    <div className="text-gray-500">vs cheapest</div>
                    <div className="text-right">
                      {diffCost === 0 ? (
                        <span className="text-green-600 font-medium">best</span>
                      ) : (
                        <span className="text-red-600">+{formatEuro(diffCost)}</span>
                      )}
                    </div>
                    <div className="text-gray-500">vs fastest</div>
                    <div className="text-right">
                      {diffTime === 0 ? (
                        <span className="text-green-600 font-medium">best</span>
                      ) : (
                        <span className="text-red-600">+{formatYears(diffTime)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4 font-medium">Scenario</th>
                  <th className="py-2 pr-4 font-medium text-right">Total payment</th>
                  <th className="py-2 pr-4 font-medium text-right">Total interest</th>
                  <th className="py-2 pr-4 font-medium text-right">Payoff</th>
                  <th className="py-2 pr-4 font-medium text-right">vs cheapest</th>
                  <th className="py-2 font-medium text-right">vs fastest</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((t) => {
                  const diffCost = t.totalPayment - cheapest.totalPayment;
                  const diffTime = t.scenario.payoffYears - fastest.payoffYears;
                  return (
                    <tr key={t.scenario.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-900">{t.scenario.label}</td>
                      <td className="py-2 pr-4 text-right text-gray-700">
                        {formatEuro(t.totalPayment)}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-700">
                        {formatEuro(t.scenario.totalInterest)}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-700">
                        {formatYears(t.scenario.payoffYears)}
                      </td>
                      <td className="py-2 pr-4 text-right">
                        {diffCost === 0 ? (
                          <span className="text-green-600 font-medium">best</span>
                        ) : (
                          <span className="text-red-600">+{formatEuro(diffCost)}</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        {diffTime === 0 ? (
                          <span className="text-green-600 font-medium">best</span>
                        ) : (
                          <span className="text-red-600">+{formatYears(diffTime)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
