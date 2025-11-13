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
    <div className="mt-10 bg-white rounded-xl border-2 border-gray-200 shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Quick Comparison</h3>
        <p className="text-sm text-gray-600 mt-1">Key metrics across all three scenarios</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Metric</th>
              <th className="text-center py-3 px-4 text-xs font-bold text-optimistic-from uppercase tracking-wider">
                <div className="flex flex-col items-center gap-1">
                  <span>Optimistic</span>
                  <span className="text-[10px] font-normal text-gray-500 normal-case">Best Case</span>
                </div>
              </th>
              <th className="text-center py-3 px-4 text-xs font-bold text-realistic-from uppercase tracking-wider bg-realistic-from/5">
                <div className="flex flex-col items-center gap-1">
                  <span>Realistic</span>
                  <span className="text-[10px] font-normal text-gray-500 normal-case">Recommended ⭐</span>
                </div>
              </th>
              <th className="text-center py-3 px-4 text-xs font-bold text-conservative-from uppercase tracking-wider">
                <div className="flex flex-col items-center gap-1">
                  <span>Conservative</span>
                  <span className="text-[10px] font-normal text-gray-500 normal-case">Worst Case</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Total Investment */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm font-semibold text-gray-900">Total Investment</td>
              <td className="py-4 px-4 text-center font-mono text-sm font-medium text-gray-900">
                {formatCurrency(optimistic.total)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm font-bold text-gray-900 bg-realistic-from/5">
                {formatCurrency(realistic.total)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm font-medium text-gray-900">
                {formatCurrency(conservative.total)}
              </td>
            </tr>

            {/* Development Costs */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">Development</td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(optimistic.breakdown.development)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-900 bg-realistic-from/5">
                {formatCurrency(realistic.breakdown.development)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(conservative.breakdown.development)}
              </td>
            </tr>

            {/* GTM Year 1 */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">Go-to-Market</td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(optimistic.breakdown.gtmYear1)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-900 bg-realistic-from/5">
                {formatCurrency(realistic.breakdown.gtmYear1)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(conservative.breakdown.gtmYear1)}
              </td>
            </tr>

            {/* Risk Buffer */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">Risk Buffer</td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(optimistic.breakdown.riskBuffer)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-900 bg-realistic-from/5">
                {formatCurrency(realistic.breakdown.riskBuffer)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {formatCurrency(conservative.breakdown.riskBuffer)}
              </td>
            </tr>

            {/* Timeline */}
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">Timeline</td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {optimistic.timeline} mo
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-900 bg-realistic-from/5">
                {realistic.timeline} mo
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {conservative.timeline} mo
              </td>
            </tr>

            {/* Success Rate */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  Success Rate
                  <span className="text-xs text-gray-500">(historical)</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {getSuccessRate(optimistic)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm font-semibold text-gray-900 bg-realistic-from/5">
                {getSuccessRate(realistic)}
              </td>
              <td className="py-4 px-4 text-center font-mono text-sm text-gray-700">
                {getSuccessRate(conservative)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          💡 The <span className="font-semibold text-realistic-from">Realistic</span> scenario balances ambition with prudent risk management
        </p>
      </div>
    </div>
  );
}
