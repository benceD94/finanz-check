import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Scenario } from '../types';

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#be185d', '#65a30d', '#6366f1', '#ea580c',
];

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

export default function AmortizationChart({ scenarios }: Props) {
  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-400 border border-dashed border-gray-300 rounded-xl">
        Add a scenario to see the chart
      </div>
    );
  }

  // Build unified data: one entry per year, with balance from each scenario
  const maxYear = Math.max(...scenarios.flatMap((s) => s.data.map((d) => d.year)));
  const years = new Set<number>();
  scenarios.forEach((s) => s.data.forEach((d) => years.add(d.year)));
  const sortedYears = [...years].sort((a, b) => a - b);

  const chartData = sortedYears.map((year) => {
    const entry: Record<string, number> = { year };
    scenarios.forEach((s) => {
      // Find the closest data point at or before this year
      const point = s.data.find((d) => d.year === year);
      if (point) {
        entry[`balance_${s.id}`] = point.remainingBalance;
        entry[`interest_${s.id}`] = point.totalInterestPaid;
      }
    });
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
          domain={[0, Math.ceil(maxYear)]}
        />
        <YAxis
          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          label={{ value: 'Balance (€)', angle: -90, position: 'insideLeft', offset: 10 }}
        />
        <Tooltip
          formatter={(value, name) => {
            const v = Number(value);
            const n = String(name);
            const scenario = scenarios.find((s) => n.includes(s.id));
            if (n.startsWith('balance_')) {
              return [formatEuro(v), scenario?.label ?? 'Balance'];
            }
            return [formatEuro(v), 'Interest paid'];
          }}
          labelFormatter={(label) => `Year ${label}`}
        />
        <Legend />
        {scenarios.map((s, i) => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={`balance_${s.id}`}
            name={s.label}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
