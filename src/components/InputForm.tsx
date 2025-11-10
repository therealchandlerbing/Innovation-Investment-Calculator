import { useState } from 'react';
import type { UserInputs, TechnologyType, Stage, Market, TeamStatus, RegulatoryEnv } from '../types/calculator';
import { COEFFICIENTS } from '../utils/coefficients';

interface InputFormProps {
  onSubmit: (inputs: UserInputs) => void;
  onLoadExample?: (example: UserInputs) => void;
}

export default function InputForm({ onSubmit, onLoadExample }: InputFormProps) {
  const [formData, setFormData] = useState<Partial<UserInputs>>({});

  const technologyTypes: TechnologyType[] = ['Software', 'Hardware', 'Biotech', 'Clean Energy'];
  const stages: Stage[] = [
    'Concept (TRL 1-3)',
    'Prototype (TRL 4-6)',
    'Pilot (TRL 7-8)',
    'Production (TRL 9)',
  ];
  const markets: Market[] = ['Enterprise B2B', 'SMB B2B', 'Consumer B2C', 'Government'];
  const teamStatuses: TeamStatus[] = [
    'No team yet',
    'Partial team (1-3 people)',
    'Full team assembled (4+ people)',
  ];
  const regulatoryEnvs: RegulatoryEnv[] = [
    'None',
    'Moderate (compliance, certifications)',
    'Heavy (FDA, EPA, nuclear)',
  ];

  const locations = Object.keys(COEFFICIENTS.geographyModifiers);

  const isFormComplete = () => {
    return (
      formData.technologyType &&
      formData.stage &&
      formData.market &&
      formData.location &&
      formData.teamStatus &&
      formData.regulatory
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
      name: 'Low-Cost Software',
      data: {
        technologyType: 'Software' as TechnologyType,
        stage: 'Prototype (TRL 4-6)' as Stage,
        market: 'SMB B2B' as Market,
        location: 'Remote US',
        teamStatus: 'Partial team (1-3 people)' as TeamStatus,
        regulatory: 'None' as RegulatoryEnv,
      },
    },
    {
      name: 'High-Cost Biotech',
      data: {
        technologyType: 'Biotech' as TechnologyType,
        stage: 'Pilot (TRL 7-8)' as Stage,
        market: 'Enterprise B2B' as Market,
        location: 'San Francisco Bay Area',
        teamStatus: 'No team yet' as TeamStatus,
        regulatory: 'Heavy (FDA, EPA, nuclear)' as RegulatoryEnv,
      },
    },
    {
      name: 'Mid-Range Hardware',
      data: {
        technologyType: 'Hardware' as TechnologyType,
        stage: 'Production (TRL 9)' as Stage,
        market: 'Consumer B2C' as Market,
        location: 'Austin',
        teamStatus: 'Full team assembled (4+ people)' as TeamStatus,
        regulatory: 'Moderate (compliance, certifications)' as RegulatoryEnv,
      },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Innovation Investment Calculator</h1>
        <p className="text-gray-600 mb-8">
          Get an evidence-based estimate of your innovation investment requirements
        </p>

        {onLoadExample && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Start Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example.name}
                  onClick={() => {
                    setFormData(example.data);
                    onLoadExample(example.data);
                  }}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technology Type *
            </label>
            <select
              value={formData.technologyType || ''}
              onChange={(e) => handleChange('technologyType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select technology type...</option>
              {technologyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Development Stage *
            </label>
            <select
              value={formData.stage || ''}
              onChange={(e) => handleChange('stage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market *
            </label>
            <select
              value={formData.market || ''}
              onChange={(e) => handleChange('market', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select target market...</option>
              {markets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geographic Location *
            </label>
            <select
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select location...</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Status *
            </label>
            <select
              value={formData.teamStatus || ''}
              onChange={(e) => handleChange('teamStatus', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regulatory Environment *
            </label>
            <select
              value={formData.regulatory || ''}
              onChange={(e) => handleChange('regulatory', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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

          <button
            type="submit"
            disabled={!isFormComplete()}
            className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors ${
              isFormComplete()
                ? 'bg-primary hover:bg-primary-light cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Calculate Investment
          </button>
        </form>
      </div>
    </div>
  );
}
