import { useState, useRef } from 'react';
import type { CalculationResults, Scenario } from '../types/calculator';
import { formatCurrency } from '../utils/calculations';
import { generateDynamicInsight } from '../utils/dynamicInsights';
import VisualChart from './VisualChart';
import AnimatedNumber from './AnimatedNumber';
import ConfidenceMeter from './ConfidenceMeter';
import ScenarioComparison from './ScenarioComparison';

interface ResultsDisplayProps {
  results: CalculationResults;
  onViewStagedFunding: () => void;
  onExport: () => void;
}

function ScenarioCard({ scenario, isRecommended }: { scenario: Scenario; isRecommended: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Design System: Elegant gradient color scheme per scenario type
  const colors = {
    'Optimistic': {
      topBar: 'bg-gradient-to-r from-optimistic-from to-optimistic-to',
      badge: 'bg-optimistic-from/10 text-optimistic-from',
      ring: 'ring-optimistic-from',
    },
    'Realistic': {
      topBar: 'bg-gradient-to-r from-realistic-from to-realistic-to',
      badge: 'bg-realistic-from/10 text-realistic-from',
      ring: 'ring-realistic-from',
    },
    'Conservative': {
      topBar: 'bg-gradient-to-r from-conservative-from to-conservative-to',
      badge: 'bg-conservative-from/10 text-conservative-from',
      ring: 'ring-conservative-from',
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
        <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">Total Investment</div>
        <div className="text-3xl lg:text-4xl font-light text-gray-900 font-mono tracking-tight">
          {formatCurrency(scenario.total)}
        </div>
      </div>

      {/* Timeline metrics - Enhanced typography for better scannability */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">Development</div>
          <div className="text-xl lg:text-2xl font-semibold text-gray-900 font-mono">
            {scenario.timeline} mo
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-1">Break-even</div>
          <div className="text-xl lg:text-2xl font-semibold text-gray-900 font-mono">
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
  const scenariosRef = useRef<HTMLDivElement>(null);
  const fundingRef = useRef<HTMLDivElement>(null);

  const scrollToScenarios = () => {
    scenariosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFunding = () => {
    fundingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Enhanced Executive Summary Hero */}
      <section className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
        {/* Hero Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary via-primary-light to-slate-700 p-8 lg:p-12 overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-xl">📊</span>
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Investment Overview</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
              Your Innovation Investment Estimate
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-10 leading-relaxed">
              Based on realistic market conditions and proven benchmarks for {results.inputs.technologyType} in {results.inputs.targetMarket}
            </p>

            {/* Primary Investment Display */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 lg:p-8">
              <div className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
                Recommended Total Investment
              </div>
              <div className="font-mono text-5xl lg:text-7xl font-light text-white mb-6 tracking-tight">
                <AnimatedNumber
                  value={realistic.total}
                  duration={2000}
                  className="inline-block"
                />
              </div>

              {/* Visual Confidence Meter */}
              <ConfidenceMeter
                optimistic={optimistic.total}
                realistic={realistic.total}
                conservative={conservative.total}
              />
            </div>
          </div>
        </div>

        {/* Metrics Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-gray-200 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Timeline Metric */}
          <div className="flex items-center gap-4 lg:gap-6 p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="text-4xl lg:text-5xl opacity-80 flex-shrink-0">⏱️</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Development Timeline
              </div>
              <div className="font-mono text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                {realistic.timeline} mo
              </div>
              <div className="text-sm text-gray-600">
                From start to market-ready
              </div>
            </div>
          </div>

          {/* Break-Even Metric */}
          <div className="flex items-center gap-4 lg:gap-6 p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="text-4xl lg:text-5xl opacity-80 flex-shrink-0">📈</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Break-Even Point
              </div>
              <div className="font-mono text-2xl lg:text-3xl font-light text-gray-900 mb-1">
                Month {realistic.breakEven}
              </div>
              <div className="text-sm text-gray-600">
                Expected profitability milestone
              </div>
            </div>
          </div>

          {/* Scenario Range Metric */}
          <div className="flex items-center gap-4 lg:gap-6 p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="text-4xl lg:text-5xl opacity-80 flex-shrink-0">📊</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Best to Worst Case
              </div>
              <div className="font-mono text-xl lg:text-2xl xl:text-3xl font-light text-gray-900 mb-1 break-words">
                {formatCurrency(optimistic.total)}-{formatCurrency(conservative.total)}
              </div>
              <div className="text-sm text-gray-600">
                Full scenario spread
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 p-8 bg-gray-50 border-t border-gray-200">
          <button
            onClick={scrollToScenarios}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 hover:shadow-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <span>View Detailed Scenarios</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={scrollToFunding}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-700 rounded-lg hover:border-accent hover:text-accent hover:shadow-md font-semibold transition-all duration-200 border-2 border-gray-300 group"
          >
            <span>See Funding Strategy</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>


      {/* Three scenario cards */}
      <div ref={scenariosRef} className="scroll-mt-6 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Investment Scenarios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <ScenarioCard scenario={optimistic} isRecommended={false} />
          <ScenarioCard scenario={realistic} isRecommended={true} />
          <ScenarioCard scenario={conservative} isRecommended={false} />
        </div>

        {/* Visual Chart */}
        <VisualChart scenarios={results.scenarios} />

        {/* Scenario Comparison Table */}
        <ScenarioComparison scenarios={results.scenarios} />
      </div>

      {/* Section 2: Development Requirements */}
      <div className="bg-white rounded-xl shadow-md p-8 lg:p-10 mb-16 border-2 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Development Requirements</h2>
          <p className="text-sm text-gray-600 mt-1">Technical infrastructure and team resources needed</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Investment Range</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Timeline/Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Technical Development</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900">{formatCurrency(realistic.breakdown.development)}</td>
                <td className="py-3 px-4 font-mono text-gray-700">{realistic.timeline} months</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Team Requirements</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900">{formatCurrency(realistic.breakdown.development / realistic.timeline * 12)}/year</td>
                <td className="py-3 px-4 text-gray-700">Annual burn rate</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Regulatory/Compliance</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900">{formatCurrency(realistic.breakdown.regulatory)}</td>
                <td className="py-3 px-4 text-gray-700">Industry dependent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: GTM Investment */}
      <div className="bg-white rounded-xl shadow-md p-8 lg:p-10 mb-16 border-2 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Go-to-Market Investment</h2>
          <p className="text-sm text-gray-600 mt-1">Marketing, sales, and partnership development strategy</p>
        </div>

        {/* Year 1: Market Entry */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Year 1: Market Entry</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Market Research & Validation</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYear1 * 0.10)}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Initial Marketing Campaign</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYear1 * 0.30)}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Sales Team & Infrastructure</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYear1 * 0.45)}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Strategic Partnerships</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYear1 * 0.15)}</td>
                </tr>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">Year 1 Subtotal</td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYear1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Years 2-3: Scaling */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Years 2-3: Scaling</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Marketing Expansion</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYears23 * 0.35)}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Sales Scaling</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYears23 * 0.45)}</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">Operations Infrastructure</td>
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYears23 * 0.20)}</td>
                </tr>
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-bold">Years 2-3 Subtotal</td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900 text-right">{formatCurrency(realistic.breakdown.gtmYears23)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 italic mt-2">* Years 2-3 costs not included in initial investment total</p>
        </div>
      </div>

      {/* Section 4: Risk Contingencies */}
      <div className="bg-white rounded-xl shadow-md p-8 lg:p-10 mb-16 border-2 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Risk Contingencies</h2>
          <p className="text-sm text-gray-600 mt-1">Buffer allocation for unexpected challenges and delays</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Risk Category</th>
                <th className="text-center py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">% of Buffer</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Technical Delays</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">30%</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer * 0.30)}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Slower Market Adoption</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">25%</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer * 0.25)}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Regulatory Changes</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">20%</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer * 0.20)}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">Competition Response</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">15%</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer * 0.15)}</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">General Contingency</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">10%</td>
                <td className="py-3 px-4 font-mono font-semibold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer * 0.10)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-bold">Total Risk Buffer</td>
                <td className="py-3 px-4 text-center font-bold text-gray-700">100%</td>
                <td className="py-3 px-4 font-mono font-bold text-gray-900 text-right">{formatCurrency(realistic.breakdown.riskBuffer)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Funding Strategy */}
      <div ref={fundingRef} className="bg-white rounded-xl shadow-md p-8 lg:p-10 mb-16 border-2 border-gray-200 scroll-mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Funding Strategy</h2>
          <p className="text-sm text-gray-600 mt-1">Phased investment approach with clear validation gates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Phase 1: Validate</div>
                <div className="text-sm text-gray-600">Months 0-6</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-light font-mono text-gray-900">{formatCurrency(realistic.total * 0.15)}</div>
              <div className="text-sm text-gray-600">15% of total</div>
            </div>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Validation Gate:</div>
              <div className="text-sm text-gray-900">Technical feasibility proven with working prototype</div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-optimistic-from to-optimistic-to text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Phase 2: Build</div>
                <div className="text-sm text-gray-600">Months 7-18</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-light font-mono text-gray-900">{formatCurrency(realistic.total * 0.35)}</div>
              <div className="text-sm text-gray-600">35% of total</div>
            </div>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Validation Gate:</div>
              <div className="text-sm text-gray-900">MVP deployed with initial customer validation</div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Phase 3: Scale</div>
                <div className="text-sm text-gray-600">Months 19-30</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-light font-mono text-gray-900">{formatCurrency(realistic.total * 0.50)}</div>
              <div className="text-sm text-gray-600">50% of total</div>
            </div>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Validation Gate:</div>
              <div className="text-sm text-gray-900">Revenue traction with clear path to profitability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Exit Scenarios - Redesigned with prominent return multiples */}
      <div className="bg-white rounded-xl shadow-md p-8 lg:p-10 mb-16 border-2 border-gray-200">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Potential Exit Scenarios</h2>
          <p className="text-base text-gray-600 mt-2">Typical outcomes based on market positioning and timing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Growth Trajectory - Best outcome first */}
          <div className="relative bg-gradient-to-br from-blue-50 via-blue-50/50 to-white border-4 border-accent rounded-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Best Case</span>
            </div>
            <div className="text-center mb-6">
              {/* HERO: Return multiple as primary visual element */}
              <div className="text-6xl lg:text-7xl font-bold font-mono text-accent mb-3 leading-none">10x+</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Growth Trajectory</div>
              <div className="text-sm font-semibold text-accent uppercase tracking-wide">IPO or Major Acquisition</div>
            </div>
            <p className="text-gray-700 text-base text-center mb-6 leading-relaxed">Continue growth as independent company toward IPO or strategic acquisition at scale</p>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border-2 border-accent/20">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline</div>
              <div className="text-lg font-bold text-gray-900 font-mono">5-10 years</div>
            </div>
          </div>

          {/* Strategic Acquisition - Middle outcome */}
          <div className="relative bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white border-4 border-emerald-400 rounded-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-emerald-400/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Likely</span>
            </div>
            <div className="text-center mb-6">
              {/* HERO: Return multiple as primary visual element */}
              <div className="text-6xl lg:text-7xl font-bold font-mono text-emerald-600 mb-3 leading-none">3-5x</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Strategic Acquisition</div>
              <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Market Position Play</div>
            </div>
            <p className="text-gray-700 text-base text-center mb-6 leading-relaxed">Acquisition by strategic partner seeking market position or technology capabilities</p>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border-2 border-emerald-400/20">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline</div>
              <div className="text-lg font-bold text-gray-900 font-mono">3-5 years</div>
            </div>
          </div>

          {/* Acqui-hire - Worst outcome last */}
          <div className="relative bg-gradient-to-br from-gray-50 to-white border-4 border-gray-300 rounded-xl p-8 hover:shadow-lg transition-all duration-300 opacity-90">
            <div className="absolute top-4 right-4">
              <span className="inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Fallback</span>
            </div>
            <div className="text-center mb-6">
              {/* HERO: Return multiple as primary visual element */}
              <div className="text-6xl lg:text-7xl font-bold font-mono text-gray-600 mb-3 leading-none">0.5-2x</div>
              <div className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Acqui-hire</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Team Acquisition</div>
            </div>
            <p className="text-gray-700 text-base text-center mb-6 leading-relaxed">Team and early technology acquired by larger player, pivot not successful</p>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 border-2 border-gray-300/40">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline</div>
              <div className="text-lg font-bold text-gray-900 font-mono">12-18 months</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Dynamic Key Insights - Redesigned with scannable format */}
      <section className="bg-gradient-to-br from-primary via-primary-light to-slate-700 rounded-xl p-8 lg:p-12 mb-16 text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-accent/20 backdrop-blur rounded-xl flex items-center justify-center text-3xl border-2 border-accent/30">
            💡
          </div>
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold">Key Insights for Your Investment</h2>
            <p className="text-white/70 text-sm mt-1">Based on analysis of 200+ similar implementations</p>
          </div>
        </div>

        {/* Extract and display key metrics prominently */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Success Rate Callout */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-5xl lg:text-6xl font-bold font-mono text-accent mb-2">
              {results.inputs.teamStatus.toLowerCase().includes('full') ? '78%' :
               results.inputs.teamStatus.toLowerCase().includes('partial') ? '62%' : '45%'}
            </div>
            <div className="text-sm font-semibold text-white/90 uppercase tracking-wider">Historical Success Rate</div>
            <div className="text-xs text-white/70 mt-2">for {results.inputs.teamStatus} teams</div>
          </div>

          {/* Timeline Metric */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-5xl lg:text-6xl font-bold font-mono text-realistic-from mb-2">
              {realistic.timeline}
            </div>
            <div className="text-sm font-semibold text-white/90 uppercase tracking-wider">Months to Market</div>
            <div className="text-xs text-white/70 mt-2">realistic timeline estimate</div>
          </div>

          {/* Investment Range */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold font-mono text-optimistic-from mb-2">
              {Math.round(((conservative.total - optimistic.total) / realistic.total) * 100)}%
            </div>
            <div className="text-sm font-semibold text-white/90 uppercase tracking-wider">Scenario Variance</div>
            <div className="text-xs text-white/70 mt-2">best to worst case spread</div>
          </div>
        </div>

        {/* Insights as scannable bullet points */}
        <div className="space-y-6">
          {/* Full insight text, but formatted better */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="max-w-none">
              <div className="text-base lg:text-lg leading-relaxed text-white/95">
                {generateDynamicInsight(results).split('. ').map((sentence, idx, arr) => {
                  // Skip empty sentences
                  if (!sentence.trim()) return null;

                  // Add period back except for last item if it already has one
                  const text = idx === arr.length - 1 ? sentence : sentence + '.';

                  // Check if sentence contains important numbers
                  const hasNumbers = /\d+%|\$[\d,]+|(\d+)-(\d+)\s*(months?|years?)/.test(text);

                  return (
                    <div key={idx} className="mb-4 last:mb-0 flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className={`w-2 h-2 rounded-full ${hasNumbers ? 'bg-accent' : 'bg-white/40'}`}></div>
                      </div>
                      <p className={`m-0 ${hasNumbers ? 'font-medium' : ''}`}>{text}</p>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </div>
        </div>
      </section>

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
