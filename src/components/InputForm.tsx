import { useState } from 'react';
import type { UserInputs, TechnologyType, Stage, Market, TeamStatus, RegulatoryEnvironment } from '../types/calculator';
import { TECHNOLOGY_GROUPS, MARKET_GROUPS, GEOGRAPHIC_LOCATIONS } from '../utils/coefficients';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  onLoadExample?: (example: UserInputs) => void;
}

export default function InputForm({ onSubmit, onLoadExample }: InputFormProps) {
  const [formData, setFormData] = useState<Partial<UserInputs>>({});

  const stages: Stage[] = [
    'Concept (TRL 1-3)',
    'Prototype (TRL 4-6)',
    'Pilot (TRL 7-8)',
    'Market Ready (TRL 9)',
  ];

  const teamStatuses: TeamStatus[] = [
    'No team yet',
    'Partial team',
    'Full team assembled',
  ];

  const regulatoryEnvs: RegulatoryEnvironment[] = [
    'None',
    'Moderate',
    'Heavy (FDA/EPA level)',
  ];

  const isFormComplete = () => {
    return (
      formData.technologyType &&
      formData.currentStage &&
      formData.targetMarket &&
      formData.geographicLocation &&
      formData.teamStatus &&
      formData.regulatoryEnvironment
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete()) {
      onSubmit(formData as UserInputs);
    }
  };

  const handleChange = (field: keyof UserInputs, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const examples = [
    {
      name: 'EdTech + K-12',
      data: {
        technologyType: 'EdTech/Learning Platform' as TechnologyType,
        currentStage: 'Prototype (TRL 4-6)' as Stage,
        targetMarket: 'K-12 Education Systems' as Market,
        geographicLocation: 'Austin',
        teamStatus: 'Partial team' as TeamStatus,
        regulatoryEnvironment: 'Moderate' as RegulatoryEnvironment,
      },
    },
    {
      name: 'Space Tech + Military',
      data: {
        technologyType: 'Space Technology' as TechnologyType,
        currentStage: 'Pilot (TRL 7-8)' as Stage,
        targetMarket: 'Military/Defense' as Market,
        geographicLocation: 'San Francisco Bay Area',
        teamStatus: 'Full team assembled' as TeamStatus,
        regulatoryEnvironment: 'Heavy (FDA/EPA level)' as RegulatoryEnvironment,
      },
    },
    {
      name: 'FinTech + SMB',
      data: {
        technologyType: 'FinTech/Financial Services' as TechnologyType,
        currentStage: 'Market Ready (TRL 9)' as Stage,
        targetMarket: 'Small Business B2B (<500 employees)' as Market,
        geographicLocation: 'Remote US',
        teamStatus: 'Full team assembled' as TeamStatus,
        regulatoryEnvironment: 'Moderate' as RegulatoryEnvironment,
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Enhanced visual container with subtle gradient */}
      <div className="bg-gradient-to-br from-white via-white to-blue-50/30 rounded-xl shadow-xl border border-gray-200 p-8 lg:p-10">
        {/* Improved header with better hierarchy */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Innovation Investment Calculator
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 font-medium mb-3 leading-relaxed">
            Get evidence-based investment estimates across 30 technology types and 33 market segments
          </p>
          {/* Trust signal / credibility marker */}
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Based on 200+ implementation benchmarks • Calibrated to industry data</span>
          </p>
        </div>

        {onLoadExample && (
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Start Examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.name}
                  onClick={() => {
                    setFormData(example.data);
                    onLoadExample(example.data);
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-white border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Technology Type *
            </label>
            <p className="text-xs text-gray-500 mb-2">30 options across 6 technology groups</p>
            <select
              value={formData.technologyType || ''}
              onChange={(e) => handleChange('technologyType', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select technology type...</option>
              {Object.entries(TECHNOLOGY_GROUPS).map(([groupName, technologies]) => (
                <optgroup key={groupName} label={groupName}>
                  {technologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Current Development Stage *
            </label>
            <select
              value={formData.currentStage || ''}
              onChange={(e) => handleChange('currentStage', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select development stage...</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Target Market *
            </label>
            <p className="text-xs text-gray-500 mb-2">33 market segments across 8 industry groups</p>
            <select
              value={formData.targetMarket || ''}
              onChange={(e) => handleChange('targetMarket', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select target market...</option>
              {Object.entries(MARKET_GROUPS).map(([groupName, markets]) => (
                <optgroup key={groupName} label={groupName}>
                  {markets.map((market) => (
                    <option key={market} value={market}>
                      {market}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Geographic Location *
            </label>
            <select
              value={formData.geographicLocation || ''}
              onChange={(e) => handleChange('geographicLocation', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select location...</option>
              {GEOGRAPHIC_LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name} (Cost Index: {location.index})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Team Status *
            </label>
            <select
              value={formData.teamStatus || ''}
              onChange={(e) => handleChange('teamStatus', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select team status...</option>
              {teamStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Regulatory Environment *
            </label>
            <select
              value={formData.regulatoryEnvironment || ''}
              onChange={(e) => handleChange('regulatoryEnvironment', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400 text-gray-900 font-medium"
              required
            >
              <option value="">Select regulatory environment...</option>
              {regulatoryEnvs.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>

          {/* Enhanced Calculate Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={!isFormComplete()}
              className={`w-full py-4 px-8 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                isFormComplete()
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>{isFormComplete() ? 'Calculate Investment' : 'Complete All Fields to Calculate'}</span>
            </button>
            {!isFormComplete() && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Fill in all required fields above to generate your investment estimate
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
