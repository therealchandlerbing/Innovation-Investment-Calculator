import { useForm } from 'react-hook-form';
import type { UserInputs, TechnologyType, CurrentStage, TargetMarket, TeamStatus, RegulatoryEnvironment } from '../types';
import { GEOGRAPHIC_LOCATIONS } from '../config/coefficients';

interface InputFormProps {
  onSubmit: (data: UserInputs) => void;
  isLoading: boolean;
}

const technologyTypes: TechnologyType[] = ['Software', 'Hardware', 'Biotech', 'Clean Energy'];
const currentStages: CurrentStage[] = [
  'Concept (TRL 1-3)',
  'Prototype (TRL 4-6)',
  'Pilot (TRL 7-8)',
  'Production (TRL 9)',
];
const targetMarkets: TargetMarket[] = ['Enterprise B2B', 'SMB B2B', 'Consumer B2C', 'Government'];
const teamStatuses: TeamStatus[] = ['No team yet', 'Partial team', 'Full team assembled'];
const regulatoryEnvironments: RegulatoryEnvironment[] = ['None', 'Moderate', 'Heavy (FDA/EPA level)'];

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserInputs>();

  const watchedFields = watch();
  const totalFields = 6;
  const filledFields = Object.values(watchedFields).filter(Boolean).length;
  const progress = (filledFields / totalFields) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Innovation Investment Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Calculate your true implementation requirements
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{filledFields} of {totalFields} fields completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          {/* Technology Type */}
          <div className="mb-6">
            <label className="label">
              1. Technology Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technologyTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedFields.technologyType === type
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type}
                    {...register('technologyType', { required: 'Technology type is required' })}
                    className="mr-3"
                  />
                  <span className="font-medium">{type}</span>
                </label>
              ))}
            </div>
            {errors.technologyType && (
              <p className="text-red-500 text-sm mt-2">{errors.technologyType.message}</p>
            )}
          </div>

          {/* Current Stage */}
          <div className="mb-6">
            <label className="label">
              2. Current Stage
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStages.map((stage) => (
                <label
                  key={stage}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedFields.currentStage === stage
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={stage}
                    {...register('currentStage', { required: 'Current stage is required' })}
                    className="mr-3"
                  />
                  <span className="font-medium">{stage}</span>
                </label>
              ))}
            </div>
            {errors.currentStage && (
              <p className="text-red-500 text-sm mt-2">{errors.currentStage.message}</p>
            )}
          </div>

          {/* Target Market */}
          <div className="mb-6">
            <label className="label">
              3. Target Market
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {targetMarkets.map((market) => (
                <label
                  key={market}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedFields.targetMarket === market
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={market}
                    {...register('targetMarket', { required: 'Target market is required' })}
                    className="mr-3"
                  />
                  <span className="font-medium">{market}</span>
                </label>
              ))}
            </div>
            {errors.targetMarket && (
              <p className="text-red-500 text-sm mt-2">{errors.targetMarket.message}</p>
            )}
          </div>

          {/* Geographic Location */}
          <div className="mb-6">
            <label className="label">
              4. Geographic Location
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register('geographicLocation', { required: 'Geographic location is required' })}
              className="input-field"
            >
              <option value="">Select location...</option>
              {GEOGRAPHIC_LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name} (Index: {location.index})
                </option>
              ))}
            </select>
            {errors.geographicLocation && (
              <p className="text-red-500 text-sm mt-2">{errors.geographicLocation.message}</p>
            )}
          </div>

          {/* Team Status */}
          <div className="mb-6">
            <label className="label">
              5. Team Status
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {teamStatuses.map((status) => (
                <label
                  key={status}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedFields.teamStatus === status
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={status}
                    {...register('teamStatus', { required: 'Team status is required' })}
                    className="mr-3"
                  />
                  <span className="font-medium text-sm">{status}</span>
                </label>
              ))}
            </div>
            {errors.teamStatus && (
              <p className="text-red-500 text-sm mt-2">{errors.teamStatus.message}</p>
            )}
          </div>

          {/* Regulatory Environment */}
          <div className="mb-6">
            <label className="label">
              6. Regulatory Environment
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {regulatoryEnvironments.map((env) => (
                <label
                  key={env}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watchedFields.regulatoryEnvironment === env
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={env}
                    {...register('regulatoryEnvironment', { required: 'Regulatory environment is required' })}
                    className="mr-3"
                  />
                  <span className="font-medium text-sm">{env}</span>
                </label>
              ))}
            </div>
            {errors.regulatoryEnvironment && (
              <p className="text-red-500 text-sm mt-2">{errors.regulatoryEnvironment.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-lg"
          >
            {isLoading ? 'Calculating...' : 'Calculate Investment Requirements'}
          </button>
        </div>
      </form>

      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <a href="#methodology" className="hover:text-primary-600 mr-4">
            Methodology
          </a>
          <a href="#data-sources" className="hover:text-primary-600 mr-4">
            Data Sources
          </a>
          <a href="#version-log" className="hover:text-primary-600">
            Version Log
          </a>
        </div>
      </footer>
    </div>
  );
}
