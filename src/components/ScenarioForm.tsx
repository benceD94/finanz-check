import { useState } from 'react';
import type { ScenarioInput } from '../types';

interface Props {
  onAdd: (input: ScenarioInput) => void;
}

const defaults: ScenarioInput = {
  loanAmount: 468000,
  interestRate: 3.76,
  tilgungRate: 2,
  extraPayment: 10000,
};

export default function ScenarioForm({ onAdd }: Props) {
  const [form, setForm] = useState<ScenarioInput>(defaults);

  const set = (field: keyof ScenarioInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.loanAmount <= 0) return;
    onAdd(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 items-end">
      <Field
        label="Loan amount (€)"
        value={form.loanAmount}
        onChange={(v) => set('loanAmount', v)}
        step={1000}
        min={0}
      />
      <Field
        label="Interest rate (%)"
        value={form.interestRate}
        onChange={(v) => set('interestRate', v)}
        step={0.01}
        min={0}
        max={20}
      />
      <Field
        label="Tilgung (%)"
        value={form.tilgungRate}
        onChange={(v) => set('tilgungRate', v)}
        step={0.1}
        min={0}
        max={20}
      />
      <Field
        label="Extra payment (€/yr)"
        value={form.extraPayment}
        onChange={(v) => set('extraPayment', v)}
        step={1000}
        min={0}
      />
      <button
        type="submit"
        className="h-10 px-5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer col-span-2 sm:col-span-1"
      >
        Add scenario
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
  step: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-600">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="h-10 w-full sm:w-44 px-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </label>
  );
}
