import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/calculations';
import type { Scenario } from '../types/calculator';

interface VisualChartProps {
  scenarios: Scenario[];
}

export default function VisualChart({ scenarios }: VisualChartProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const optimistic = scenarios[0];
  const realistic = scenarios[1];
  const conservative = scenarios[2];

  const maxValue = Math.max(optimistic.total, realistic.total, conservative.total);

  const getHeight = (value: number) => {
    return animate ? (value / maxValue) * 100 : 0;
  };

  const getColorClass = (name: string) => {
    if (name === 'Optimistic') return 'from-optimistic-from to-optimistic-to';
    if (name === 'Realistic') return 'from-realistic-from to-realistic-to';
    return 'from-conservative-from to-conservative-to';
  };

  return (
    <div className="mt-10 p-8 bg-neutral-50 rounded-xl border border-neutral-200">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Investment Comparison</h3>
        <p className="text-sm text-neutral-600">Visual representation of total investment across all three scenarios</p>
      </div>

      <div className="flex gap-8 items-end h-[280px]">
        {[optimistic, realistic, conservative].map((scenario, index) => (
          <div key={index} className="flex-1 flex flex-col h-full">
            <div className="flex-1 flex flex-direction-column justify-end items-center">
              <div
                className={`w-full max-w-[140px] rounded-t-lg bg-gradient-to-b ${getColorClass(scenario.name)} transition-all duration-[800ms] ease-out flex flex-col items-center justify-start pt-4`}
                style={{ height: `${getHeight(scenario.total)}%` }}
              >
                <span className="text-sm font-bold text-white font-mono">
                  {formatCurrency(scenario.total)}
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm font-semibold text-neutral-700">
              {scenario.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
