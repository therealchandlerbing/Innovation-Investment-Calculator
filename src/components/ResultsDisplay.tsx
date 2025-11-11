import { useState, useRef } from 'react';
import type { CalculationResults, Scenario } from '../types/calculator';
import { formatCurrency } from '../utils/calculations';
import { generateTakeaways } from '../utils/takeaways';
import TakeawayCallout from './TakeawayCallout';

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
      <section className="bg-white rounded-xl shadow-xl overflow-hidden mb-12">
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
              <div className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-3">
                Recommended Total Investment
              </div>
              <div className="font-mono text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {formatCurrency(realistic.total)}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center px-3 py-1.5 bg-success/20 border border-success/30 rounded-lg text-sm font-semibold text-green-200">
                  ±15% confidence range
                </span>
                <span className="font-mono text-lg font-semibold text-white/90">
                  {formatCurrency(results.confidenceInterval.min)} - {formatCurrency(results.confidenceInterval.max)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-gray-200 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Timeline Metric */}
          <div className="flex items-center gap-4 lg:gap-6 p-6 lg:p-8 hover:bg-gray-50 transition-colors">
            <div className="text-4xl lg:text-5xl opacity-80 flex-shrink-0">⏱️</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Development Timeline
              </div>
              <div className="font-mono text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
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
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Break-Even Point
              </div>
              <div className="font-mono text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
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
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Best to Worst Case
              </div>
              <div className="font-mono text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 break-words">
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

      {/* Key Insights */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Considerations for Your Scenario</h2>
          <p className="text-gray-600">
            Personalized insights based on your specific combination of technology, stage, and market
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {generateTakeaways(results).map((takeaway, index) => (
            <TakeawayCallout
              key={index}
              type={takeaway.type}
              icon={takeaway.icon}
              title={takeaway.title}
              text={takeaway.text}
              delay={index * 150}
            />
          ))}
        </div>
      </section>

      {/* Three scenario cards */}
      <div ref={scenariosRef} className="scroll-mt-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Scenarios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ScenarioCard scenario={optimistic} isRecommended={false} />
          <ScenarioCard scenario={realistic} isRecommended={true} />
          <ScenarioCard scenario={conservative} isRecommended={false} />
        </div>
      </div>

      {/* Section 2: Development Requirements */}
      <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Section 2
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Development Requirements</h2>
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
      <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Section 3
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Go-to-Market Investment</h2>
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
      <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Section 4
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Risk Contingencies</h2>
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
      <div ref={fundingRef} className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8 border-2 border-gray-200 scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Section 5
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Recommended Funding Strategy</h2>
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
              <div className="text-3xl font-bold font-mono text-gray-900">{formatCurrency(realistic.total * 0.15)}</div>
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
              <div className="w-10 h-10 bg-success text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <div className="font-bold text-gray-900 text-lg">Phase 2: Build</div>
                <div className="text-sm text-gray-600">Months 7-18</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold font-mono text-gray-900">{formatCurrency(realistic.total * 0.35)}</div>
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
              <div className="text-3xl font-bold font-mono text-gray-900">{formatCurrency(realistic.total * 0.50)}</div>
              <div className="text-sm text-gray-600">50% of total</div>
            </div>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Validation Gate:</div>
              <div className="text-sm text-gray-900">Revenue traction with clear path to profitability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Exit Scenarios */}
      <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-8 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Section 6
          </span>
          <h2 className="text-2xl font-bold text-gray-900">Potential Exit Scenarios</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Acqui-hire */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold font-mono text-gray-900 mb-2">0.5-2x</div>
              <div className="text-lg font-bold text-gray-900">Acqui-hire</div>
            </div>
            <p className="text-gray-700 text-sm text-center mb-4">Team and technology acquisition by larger player</p>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline:</div>
              <div className="text-sm text-gray-900">12-18 months</div>
            </div>
          </div>

          {/* Strategic Acquisition */}
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-success rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold font-mono text-success mb-2">3-5x</div>
              <div className="text-lg font-bold text-gray-900">Strategic Acquisition</div>
            </div>
            <p className="text-gray-700 text-sm text-center mb-4">Acquisition by strategic partner for market position</p>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline:</div>
              <div className="text-sm text-gray-900">3-5 years</div>
            </div>
          </div>

          {/* Growth Trajectory */}
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-accent rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold font-mono text-accent mb-2">10x+</div>
              <div className="text-lg font-bold text-gray-900">Growth Trajectory</div>
            </div>
            <p className="text-gray-700 text-sm text-center mb-4">Continue growth to IPO or major acquisition</p>
            <div className="bg-white rounded p-3 border border-gray-200">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Typical Timeline:</div>
              <div className="text-sm text-gray-900">5-10 years</div>
            </div>
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
