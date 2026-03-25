import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Scenario } from '../types';

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#0891b2', '#be185d', '#65a30d', '#6366f1', '#ea580c',
];

const COLORS_LIGHT = [
  '#93c5fd', '#fca5a5', '#86efac', '#fcd34d', '#c4b5fd',
  '#67e8f9', '#f9a8d4', '#bef264', '#a5b4fc', '#fdba74',
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
      <div className="flex items-center justify-center h-48 sm:h-80 text-gray-400 border border-dashed border-gray-300 rounded-xl text-sm sm:text-base">
        Add a scenario to see the chart
      </div>
    );
  }

  // Build unified data: one entry per year
  // For each scenario, compute remaining Tilgung (= balance) and remaining Zinsen (= total future interest)
  const years = new Set<number>();
  scenarios.forEach((s) => s.data.forEach((d) => years.add(d.year)));
  const sortedYears = [...years].sort((a, b) => a - b);

  const chartData = sortedYears.map((year) => {
    const entry: Record<string, number> = { year };
    scenarios.forEach((s) => {
      const point = s.data.find((d) => d.year === year);
      if (point) {
        const remainingTilgung = point.remainingBalance;
        const remainingZinsen = s.totalInterest - point.totalInterestPaid;
        entry[`tilgung_${s.id}`] = Math.round(remainingTilgung * 100) / 100;
        entry[`zinsen_${s.id}`] = Math.round(Math.max(0, remainingZinsen) * 100) / 100;
      }
    });
    return entry;
  });

  const isSingle = scenarios.length === 1;

  return (
    <>
    <ResponsiveContainer width="100%" height={300} minHeight={250}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis
          tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
          width={45}
        />
        <Tooltip
          formatter={(value, name) => [formatEuro(Number(value)), String(name)]}
          labelFormatter={(label) => `Year ${label}`}
        />
        {scenarios.map((s, i) => (
          <Area
            key={`zinsen_${s.id}`}
            type="monotone"
            dataKey={`zinsen_${s.id}`}
            name={`Remaining Zinsen${isSingle ? '' : ` (${s.label})`}`}
            fill={COLORS_LIGHT[i % COLORS_LIGHT.length]}
            stroke={COLORS_LIGHT[i % COLORS_LIGHT.length]}
            stackId={`stack_${s.id}`}
          />
        ))}
        {scenarios.map((s, i) => (
          <Area
            key={`tilgung_${s.id}`}
            type="monotone"
            dataKey={`tilgung_${s.id}`}
            name={`Remaining Tilgung${isSingle ? '' : ` (${s.label})`}`}
            fill={COLORS[i % COLORS.length]}
            stroke={COLORS[i % COLORS.length]}
            stackId={`stack_${s.id}`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>

    {/* Legend outside chart so it doesn't shrink the plot area */}
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-600 justify-center">
      {scenarios.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS_LIGHT[i % COLORS_LIGHT.length] }} />
            Zinsen
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            Tilgung
          </span>
          {!isSingle && <span className="text-gray-400">({s.label})</span>}
        </div>
      ))}
    </div>
    </>
  );
}
