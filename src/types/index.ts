export type TechnologyType = 'Software' | 'Hardware' | 'Biotech' | 'Clean Energy';
export type CurrentStage = 'Concept (TRL 1-3)' | 'Prototype (TRL 4-6)' | 'Pilot (TRL 7-8)' | 'Production (TRL 9)';
export type TargetMarket = 'Enterprise B2B' | 'SMB B2B' | 'Consumer B2C' | 'Government';
export type TeamStatus = 'No team yet' | 'Partial team' | 'Full team assembled';
export type RegulatoryEnvironment = 'None' | 'Moderate' | 'Heavy (FDA/EPA level)';

export interface GeographicLocation {
  name: string;
  index: number;
}

export interface UserInputs {
  technologyType: TechnologyType;
  currentStage: CurrentStage;
  targetMarket: TargetMarket;
  geographicLocation: string;
  teamStatus: TeamStatus;
  regulatoryEnvironment: RegulatoryEnvironment;
}

export interface CostBreakdown {
  development: number;
  technical: number;
  infrastructure: number;
  regulatory: number;
  gtm: number;
  marketEntry: number;
  scaling: number;
  riskContingency: number;
  total: number;
}

export interface Scenario {
  name: 'Optimistic' | 'Realistic' | 'Conservative';
  total: number;
  timeline: number;
  breakdown: CostBreakdown;
}

export interface CalculationResults {
  scenarios: Scenario[];
  confidenceInterval: {
    min: number;
    max: number;
  };
  inputs: UserInputs;
}

export interface FundingPhase {
  name: string;
  investment: number;
  duration: number;
  objective: string;
  keyMilestone: string;
  decisionGate: string;
}

export interface StagedFunding {
  phases: FundingPhase[];
  totalInvestment: number;
  totalDuration: number;
}
