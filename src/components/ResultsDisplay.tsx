import { useState } from 'react';
import type { CalculationResults, Scenario } from '../types/calculator';
import { formatCurrency } from '../utils/calculations';

interface ResultsDisplayProps {
  results: CalculationResults;
  onViewStagedFunding: () => void;
  onExport: () => void;
}

function ScenarioCard({ scenario, isRecommended }: { scenario: Scenario; isRecommended: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Design System: Color scheme per scenario type
  const colors = {
    'Optimistic': {
      topBar: 'bg-success',
      badge: 'bg-success/10 text-success',
      ring: 'ring-success',
    },
    'Realistic': {
      topBar: 'bg-warning',
      badge: 'bg-warning/10 text-warning',
      ring: 'ring-warning',
    },
    'Conservative': {
      topBar: 'bg-danger',
      badge: 'bg-danger/10 text-danger',
      ring: 'ring-danger',
    },
  };

  const colorScheme = colors[scenario.name];

  return (
    <div className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 lg:p-8 border-2 border-gray-200 ${isRecommended ? `ring-2 ${colorScheme.ring}` : ''}`}>
      {/* Colored top bar - Design System signature element */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${colorScheme.topBar}`}></div>

      {/* Scenario badge */}
      <div className="mb-4 flex items-center gap-3">
        <span className={`inline-block ${colorScheme.badge} px-3 py-1 rounded text-xs font-bold uppercase tracking-wider`}>
          {scenario.name}
        </span>
        {isRecommended && (
          <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Recommended
          </span>
        )}
      </div>

      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">{scenario.name} Case</h3>

      {/* Total Investment - Design System: Monospace for numbers */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Total Investment</div>
        <div className="text-3xl lg:text-4xl font-bold text-gray-900 font-mono tracking-tight">
          {formatCurrency(scenario.total)}
        </div>
      </div>

      {/* Timeline metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Development</div>
          <div className="text-lg font-bold text-gray-900 font-mono">
            {scenario.timeline} mo
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Break-even</div>
          <div className="text-lg font-bold text-gray-900 font-mono">
            {scenario.breakEven} mo
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-900">Cost Breakdown</span>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 pl-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Development Costs</span>
            <span className="font-medium">{formatCurrency(scenario.breakdown.development)}</span>
          </div>
          <div className="flex justify-between pl-4">
            <span className="text-gray-500 text-sm">└ Technical Infrastructure</span>
            <span className="font-medium text-sm">{formatCurrency(scenario.breakdown.technical)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Regulatory Costs</span>
            <span className="font-medium">{formatCurrency(scenario.breakdown.regulatory)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GTM Year 1</span>
            <span className="font-medium">{formatCurrency(scenario.breakdown.gtmYear1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Risk Buffer (40% of dev)</span>
            <span className="font-medium">{formatCurrency(scenario.breakdown.riskBuffer)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
            <span className="text-gray-900 font-semibold">Total Investment</span>
            <span className="font-bold">{formatCurrency(scenario.breakdown.total)}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm italic">GTM Years 2-3 (not in total)</span>
              <span className="text-gray-500 text-sm italic">{formatCurrency(scenario.breakdown.gtmYears23)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsDisplay({ results, onViewStagedFunding, onExport }: ResultsDisplayProps) {
  const [optimistic, realistic, conservative] = results.scenarios;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Requirements</h1>
        <p className="text-xl text-gray-600">
          Based on your inputs across {results.inputs.technologyType} and {results.inputs.targetMarket}
        </p>
      </div>

      {/* Three scenario cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ScenarioCard scenario={optimistic} isRecommended={false} />
        <ScenarioCard scenario={realistic} isRecommended={true} />
        <ScenarioCard scenario={conservative} isRecommended={false} />
      </div>

      {/* Confidence interval */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Confidence Interval</h3>
            <p className="text-gray-700">
              The realistic scenario has a confidence range of{' '}
              <span className="font-bold">
                {formatCurrency(results.confidenceInterval.min)} - {formatCurrency(results.confidenceInterval.max)}
              </span>
              {' '}(±15%)
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons - Design System styling */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewStagedFunding}
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-light hover:shadow-lg font-semibold transition-all duration-200 hover:-translate-y-0.5"
        >
          View Staged Funding Model
        </button>
        <button
          onClick={onExport}
          className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-800 rounded-lg hover:border-accent hover:text-accent hover:shadow-md font-semibold transition-all duration-200"
        >
          Export PDF Report
        </button>
      </div>
    </div>
  );
}
