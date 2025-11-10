export type TechnologyType = 'Software' | 'Hardware' | 'Biotech' | 'Clean Energy';
export type Stage = 'Concept (TRL 1-3)' | 'Prototype (TRL 4-6)' | 'Pilot (TRL 7-8)' | 'Production (TRL 9)';
export type Market = 'Enterprise B2B' | 'SMB B2B' | 'Consumer B2C' | 'Government';
export type TeamStatus = 'No team yet' | 'Partial team (1-3 people)' | 'Full team assembled (4+ people)';
export type RegulatoryEnv = 'None' | 'Moderate (compliance, certifications)' | 'Heavy (FDA, EPA, nuclear)';

export interface UserInputs {
  technologyType: TechnologyType;
  stage: Stage;
  market: Market;
  location: string;
  teamStatus: TeamStatus;
  regulatory: RegulatoryEnv;
}

export interface CostBreakdown {
  development: number;
  gtm: number;
  risk: number;
  total: number;
}

export interface Scenario {
  name: 'Optimistic' | 'Realistic' | 'Conservative';
  costs: CostBreakdown;
  timeline: number;
}

export interface CalculationResults {
  optimistic: Scenario;
  realistic: Scenario;
  conservative: Scenario;
  confidenceRange: {
    low: number;
    high: number;
  };
}

export interface StagedFundingPhase {
  name: string;
  investment: number;
  duration: number;
  objective: string;
  milestone: string;
  decisionGate: string;
}
