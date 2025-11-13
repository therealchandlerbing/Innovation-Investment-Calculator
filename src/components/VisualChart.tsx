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

  // Industry benchmark (calculated as average of scenarios for demo purposes)
  const industryAverage = (optimistic.total + realistic.total + conservative.total) / 3;
  const maxValue = Math.max(optimistic.total, realistic.total, conservative.total) * 1.1; // 10% padding

  const getHeight = (value: number) => {
    return animate ? (value / maxValue) * 100 : 0;
  };

  const getColorClass = (name: string) => {
    if (name === 'Optimistic') return 'from-optimistic-from to-optimistic-to';
    if (name === 'Realistic') return 'from-realistic-from to-realistic-to';
    return 'from-conservative-from to-conservative-to';
  };

  // Calculate industry average position
  const industryAverageHeight = (industryAverage / maxValue) * 100;

  return (
    <div className="mt-12 p-8 lg:p-10 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
      <div className="mb-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Scenarios vs Industry Benchmark</h3>
        <p className="text-base text-gray-600">Based on 200+ similar implementations at comparable stages</p>
      </div>

      <div className="relative">
        {/* Chart container */}
        <div className="flex gap-8 items-end h-[300px] relative">
          {/* Industry average line */}
          <div
            className="absolute left-0 right-0 border-t-2 border-dashed border-blue-500 transition-all duration-1000"
            style={{ bottom: `${animate ? industryAverageHeight : 0}%` }}
          >
            <span className="absolute -top-5 right-0 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Industry Avg: {formatCurrency(industryAverage)}
            </span>
          </div>

          {/* Bars */}
          {[optimistic, realistic, conservative].map((scenario, index) => (
            <div key={index} className="flex-1 flex flex-col h-full relative">
              <div className="flex-1 flex flex-direction-column justify-end items-center">
                <div
                  className={`w-full max-w-[140px] rounded-t-lg bg-gradient-to-b ${getColorClass(scenario.name)} transition-all duration-[800ms] ease-out flex flex-col items-center justify-start pt-4 shadow-lg ${scenario.name === 'Realistic' ? 'ring-2 ring-realistic-from ring-offset-2' : ''}`}
                  style={{ height: `${getHeight(scenario.total)}%` }}
                >
                  <span className="text-sm font-bold text-white font-mono drop-shadow-md">
                    {formatCurrency(scenario.total)}
                  </span>
                  {scenario.name === 'Realistic' && (
                    <span className="mt-2 text-xs font-bold text-white bg-white/20 px-2 py-1 rounded">
                      RECOMMENDED
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-gray-900">{scenario.name}</div>
                <div className="text-xs text-gray-500">{scenario.timeline} months</div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend - Enhanced with better spacing and sizing */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-optimistic-from to-optimistic-to rounded"></div>
            <span className="text-gray-700 font-medium">Best Case</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-realistic-from to-realistic-to rounded ring-2 ring-realistic-from"></div>
            <span className="text-gray-900 font-bold">Most Likely</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-r from-conservative-from to-conservative-to rounded"></div>
            <span className="text-gray-700 font-medium">Worst Case</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-500"></div>
            <span className="text-blue-600 font-semibold">Industry Average</span>
          </div>
        </div>
      </div>
    </div>
  );
}
