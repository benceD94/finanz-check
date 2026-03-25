import { useState } from 'react';
import type { Scenario, ScenarioInput } from './types';
import { calculateAmortization, formatLabel } from './utils/amortization';
import ScenarioForm from './components/ScenarioForm';
import AmortizationChart from './components/AmortizationChart';
import ScenarioSummary from './components/ScenarioSummary';
import ScenarioComparison from './components/ScenarioComparison';

let nextId = 1;

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const addScenario = (input: ScenarioInput) => {
    const data = calculateAmortization(input);
    const lastPoint = data[data.length - 1];
    const scenario: Scenario = {
      id: String(nextId++),
      label: formatLabel(input),
      input,
      data,
      totalInterest: lastPoint.totalInterestPaid,
      payoffYears: lastPoint.year,
    };
    setScenarios((prev) => [...prev, scenario]);
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Mortgage Comparison</h1>
          <p className="text-gray-500 mt-1">
            Compare different mortgage scenarios side by side
          </p>
        </header>

        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <ScenarioForm onAdd={addScenario} />
        </section>

        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <AmortizationChart scenarios={scenarios} />
        </section>

        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <ScenarioSummary scenarios={scenarios} onRemove={removeScenario} />
        </section>

        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <ScenarioComparison scenarios={scenarios} />
        </section>
      </div>
    </div>
  );
}
