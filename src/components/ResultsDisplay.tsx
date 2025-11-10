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

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isRecommended ? 'ring-2 ring-primary' : ''}`}>
      {isRecommended && (
        <div className="mb-4">
          <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-4">{scenario.name}</h3>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Total Investment</div>
        <div className="text-4xl font-bold text-primary">
          {formatCurrency(scenario.costs.total)}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Timeline</div>
        <div className="text-2xl font-bold text-gray-900">
          {scenario.timeline} months
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
            <span className="text-gray-600">Development</span>
            <span className="font-medium">{formatCurrency(scenario.costs.development)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Go-to-Market</span>
            <span className="font-medium">{formatCurrency(scenario.costs.gtm)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Risk Contingency</span>
            <span className="font-medium">{formatCurrency(scenario.costs.risk)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsDisplay({ results, onViewStagedFunding, onExport }: ResultsDisplayProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Requirements</h1>
        <p className="text-xl text-gray-600">
          Based on your inputs, here are three scenario projections
        </p>
      </div>

      {/* Three scenario cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ScenarioCard scenario={results.optimistic} isRecommended={false} />
        <ScenarioCard scenario={results.realistic} isRecommended={true} />
        <ScenarioCard scenario={results.conservative} isRecommended={false} />
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
            <h3 className="font-medium text-gray-900 mb-1">Confidence Range</h3>
            <p className="text-gray-700">
              The realistic scenario has a confidence range of{' '}
              <span className="font-bold">
                {formatCurrency(results.confidenceRange.low)} - {formatCurrency(results.confidenceRange.high)}
              </span>
              {' '}(±15%)
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewStagedFunding}
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-light font-medium transition-colors"
        >
          View Staged Funding
        </button>
        <button
          onClick={onExport}
          className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
