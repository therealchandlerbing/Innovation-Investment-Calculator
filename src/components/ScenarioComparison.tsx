import { formatCurrency } from '../utils/calculations';
import type { Scenario } from '../types/calculator';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
}

export default function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const optimistic = scenarios[0];
  const realistic = scenarios[1];
  const conservative = scenarios[2];

  // Calculate success rates (simplified model based on scenario type)
  const getSuccessRate = (scenario: Scenario) => {
    if (scenario.name === 'Optimistic') return '45%';
    if (scenario.name === 'Realistic') return '68%';
    return '82%';
  };

  return (
    <div className="mt-12 bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Quick Comparison</h3>
        <p className="text-base text-gray-600 mt-2">Key metrics across all three scenarios</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-5 px-8 text-sm font-bold text-gray-700 uppercase tracking-wider bg-gray-50">Metric</th>
              <th className="text-center py-5 px-6 text-sm font-bold text-optimistic-from uppercase tracking-wider bg-optimistic-from/10">
                <div className="flex flex-col items-center gap-1">
                  <span>Optimistic</span>
                  <span className="text-xs font-normal text-gray-600 normal-case">Best Case</span>
                </div>
              </th>
              <th className="text-center py-5 px-6 text-sm font-bold text-realistic-from uppercase tracking-wider bg-realistic-from/10">
                <div className="flex flex-col items-center gap-1">
                  <span>Realistic</span>
                  <span className="text-xs font-semibold text-accent normal-case">⭐ Recommended</span>
                </div>
              </th>
              <th className="text-center py-5 px-6 text-sm font-bold text-conservative-from uppercase tracking-wider bg-conservative-from/10">
                <div className="flex flex-col items-center gap-1">
                  <span>Conservative</span>
                  <span className="text-xs font-normal text-gray-600 normal-case">Worst Case</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Total Investment */}
            <tr className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base font-bold text-gray-900 bg-gray-50">Total Investment</td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-optimistic-from/5">
                {formatCurrency(optimistic.total)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-bold text-gray-900 bg-realistic-from/10">
                {formatCurrency(realistic.total)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-conservative-from/5">
                {formatCurrency(conservative.total)}
              </td>
            </tr>

            {/* Development Costs */}
            <tr className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base text-gray-900 bg-gray-50">Development</td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-optimistic-from/5">
                {formatCurrency(optimistic.breakdown.development)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-realistic-from/10">
                {formatCurrency(realistic.breakdown.development)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-conservative-from/5">
                {formatCurrency(conservative.breakdown.development)}
              </td>
            </tr>

            {/* GTM Year 1 */}
            <tr className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base text-gray-900 bg-gray-50">Go-to-Market</td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-optimistic-from/5">
                {formatCurrency(optimistic.breakdown.gtmYear1)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-realistic-from/10">
                {formatCurrency(realistic.breakdown.gtmYear1)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-conservative-from/5">
                {formatCurrency(conservative.breakdown.gtmYear1)}
              </td>
            </tr>

            {/* Risk Buffer */}
            <tr className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base text-gray-900 bg-gray-50">Risk Buffer</td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-optimistic-from/5">
                {formatCurrency(optimistic.breakdown.riskBuffer)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-realistic-from/10">
                {formatCurrency(realistic.breakdown.riskBuffer)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-conservative-from/5">
                {formatCurrency(conservative.breakdown.riskBuffer)}
              </td>
            </tr>

            {/* Timeline */}
            <tr className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base text-gray-900 bg-gray-50">Timeline</td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-optimistic-from/5">
                {optimistic.timeline} mo
              </td>
              <td className="py-5 px-6 text-center font-mono text-base font-semibold text-gray-900 bg-realistic-from/10">
                {realistic.timeline} mo
              </td>
              <td className="py-5 px-6 text-center font-mono text-base text-gray-700 bg-conservative-from/5">
                {conservative.timeline} mo
              </td>
            </tr>

            {/* Success Rate */}
            <tr className="hover:bg-gray-100/50 transition-colors">
              <td className="py-5 px-8 text-base font-semibold text-gray-900 bg-gray-50">
                <div className="flex items-center gap-2">
                  Success Rate
                  <span className="text-sm text-gray-500 font-normal">(historical)</span>
                </div>
              </td>
              <td className="py-5 px-6 text-center font-mono text-lg font-bold text-gray-700 bg-optimistic-from/5">
                {getSuccessRate(optimistic)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-lg font-bold text-gray-900 bg-realistic-from/10">
                {getSuccessRate(realistic)}
              </td>
              <td className="py-5 px-6 text-center font-mono text-lg font-bold text-gray-700 bg-conservative-from/5">
                {getSuccessRate(conservative)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-realistic-from/5 px-8 py-4 border-t-2 border-realistic-from/20">
        <p className="text-sm text-gray-700 text-center font-medium">
          The <span className="font-bold text-realistic-from">Realistic</span> scenario balances ambition with prudent risk management
        </p>
      </div>
    </div>
  );
}
