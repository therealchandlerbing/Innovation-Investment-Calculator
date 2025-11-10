import type { StagedFunding as StagedFundingType } from '../types';
import { formatCurrency } from '../utils/calculator';

interface StagedFundingProps {
  stagedFunding: StagedFundingType;
  onBack: () => void;
  onExportReport: () => void;
}

function PhaseCard({ phase, index }: { phase: StagedFundingType['phases'][0]; index: number }) {
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-600' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-600' },
  ];

  const color = colors[index] || colors[0];

  return (
    <div className={`card ${color.bg} ${color.border} border-2 relative`}>
      {/* Phase Number Badge */}
      <div className={`absolute -top-3 -left-3 w-8 h-8 ${color.dot} rounded-full flex items-center justify-center text-white font-bold`}>
        {index + 1}
      </div>

      <h3 className={`text-xl font-bold ${color.text} mb-4`}>{phase.name}</h3>

      {/* Investment Amount */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Investment Required</div>
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(phase.investment)}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Duration</div>
        <div className="text-xl font-bold text-gray-900">
          {phase.duration} months
        </div>
      </div>

      {/* Objective */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Objective</div>
        <p className="text-gray-600">{phase.objective}</p>
      </div>

      {/* Key Milestone */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Key Milestone</div>
        <p className="text-gray-600">{phase.keyMilestone}</p>
      </div>

      {/* Decision Gate */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Decision Gate
        </div>
        <p className="text-sm text-gray-600">{phase.decisionGate}</p>
      </div>
    </div>
  );
}

export default function StagedFunding({
  stagedFunding,
  onBack,
  onExportReport,
}: StagedFundingProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Staged Funding Model</h1>
        <p className="text-xl text-gray-600">
          De-risk your investment with a phased approach
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="text-sm text-gray-600 mb-2">Total Investment</div>
          <div className="text-4xl font-bold text-primary-600">
            {formatCurrency(stagedFunding.totalInvestment)}
          </div>
          <div className="text-sm text-gray-600 mt-2">Across all phases</div>
        </div>

        <div className="card bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-sm text-gray-600 mb-2">Total Timeline</div>
          <div className="text-4xl font-bold text-green-600">
            {stagedFunding.totalDuration} months
          </div>
          <div className="text-sm text-gray-600 mt-2">From start to break-even</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="mb-12">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200 hidden lg:block" />

          {/* Phase Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {stagedFunding.phases.map((phase, index) => (
              <PhaseCard key={phase.name} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* De-risking Strategy Info */}
      <div className="card bg-gray-50 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Why Stage Your Investment?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900">Reduce Risk</span>
            </div>
            <p className="text-sm text-gray-600">
              Validate assumptions before committing full capital
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium text-gray-900">Track Progress</span>
            </div>
            <p className="text-sm text-gray-600">
              Clear milestones to measure success at each stage
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-gray-900">Optimize Capital</span>
            </div>
            <p className="text-sm text-gray-600">
              Deploy resources efficiently as you de-risk
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Results
        </button>
        <button onClick={onExportReport} className="btn-primary">
          Export PDF Report
        </button>
      </div>
    </div>
  );
}
