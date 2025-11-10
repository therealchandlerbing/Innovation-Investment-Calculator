import { useState } from 'react';
import type { CalculationResults, Scenario } from '../types';
import { formatCurrency } from '../utils/calculator';

interface ResultsDisplayProps {
  results: CalculationResults;
  onViewStagedFunding: () => void;
  onExportReport: () => void;
  onBack: () => void;
}

function ScenarioCard({ scenario, isRealistic }: { scenario: Scenario; isRealistic: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <div className={`card ${isRealistic ? 'ring-2 ring-primary-600' : ''} relative`}>
      {isRealistic && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Recommended
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.name}</h3>

      {/* Total Investment */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Total Investment</div>
        <div className="text-4xl font-bold text-primary-600">
          {formatCurrency(scenario.total)}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Timeline to Break-Even</div>
        <div className="text-2xl font-bold text-gray-900">
          {scenario.timeline} months
        </div>
      </div>

      {/* Development Costs */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('development')}
          className="w-full flex justify-between items-center text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          aria-expanded={expanded === 'development'}
        >
          <span className="font-medium text-gray-900">Development Costs</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{formatCurrency(scenario.breakdown.development)}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expanded === 'development' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {expanded === 'development' && (
          <div className="pl-6 pr-3 py-3 space-y-2 text-sm bg-gray-50 rounded-lg mt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Technical Development</span>
              <span className="font-medium">{formatCurrency(scenario.breakdown.technical)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regulatory</span>
              <span className="font-medium">{formatCurrency(scenario.breakdown.regulatory)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Go-to-Market Costs */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('gtm')}
          className="w-full flex justify-between items-center text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          aria-expanded={expanded === 'gtm'}
        >
          <span className="font-medium text-gray-900">Go-to-Market Costs</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{formatCurrency(scenario.breakdown.gtm)}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expanded === 'gtm' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {expanded === 'gtm' && (
          <div className="pl-6 pr-3 py-3 space-y-2 text-sm bg-gray-50 rounded-lg mt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Year 1 GTM</span>
              <span className="font-medium">{formatCurrency(scenario.breakdown.gtmYear1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Years 2-3 GTM</span>
              <span className="font-medium">{formatCurrency(scenario.breakdown.gtmYears23)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Risk Contingency */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('risk')}
          className="w-full flex justify-between items-center text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          aria-expanded={expanded === 'risk'}
        >
          <span className="font-medium text-gray-900">Risk Buffer</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{formatCurrency(scenario.breakdown.riskBuffer)}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expanded === 'risk' ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {expanded === 'risk' && (
          <div className="pl-6 pr-3 py-3 text-sm bg-gray-50 rounded-lg mt-2">
            <p className="text-gray-600">
              Calculated based on technical, market, regulatory, and competitive risk factors
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsDisplay({
  results,
  onViewStagedFunding,
  onExportReport,
  onBack,
}: ResultsDisplayProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Requirements</h1>
        <p className="text-xl text-gray-600">
          Based on your inputs, here are three scenario projections
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {results.scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.name}
            scenario={scenario}
            isRealistic={scenario.name === 'Realistic'}
          />
        ))}
      </div>

      {/* Confidence Interval */}
      <div className="card bg-primary-50 border-primary-200 mb-8">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1"
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
              Based on your inputs, the realistic scenario range is{' '}
              <span className="font-bold">
                {formatCurrency(results.confidenceInterval.min)} -{' '}
                {formatCurrency(results.confidenceInterval.max)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Link */}
      <div className="text-center mb-8">
        <a
          href="#methodology"
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View Methodology
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button onClick={onViewStagedFunding} className="btn-primary">
          View Staged Funding Model
        </button>
        <button onClick={onExportReport} className="btn-secondary">
          Export PDF Report
        </button>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium">
          ← Back to Input Form
        </button>
      </div>
    </div>
  );
}
