import type { TechnologyType, CurrentStage, TargetMarket, TeamStatus, RegulatoryEnvironment } from '../types';

// Monthly Burn Rates by Technology Type
export const MONTHLY_BURN_RATES: Record<TechnologyType, number> = {
  'Software': 75000,
  'Hardware': 95000,
  'Biotech': 125000,
  'Clean Energy': 110000,
};

// Development Months by Stage Transition
export const DEVELOPMENT_MONTHS: Record<string, number> = {
  'Concept (TRL 1-3)': 18,
  'Prototype (TRL 4-6)': 12,
  'Pilot (TRL 7-8)': 9,
  'Production (TRL 9)': 6,
};

// Team Multipliers
export const TEAM_MULTIPLIERS: Record<TeamStatus, number> = {
  'No team yet': 1.3,
  'Partial team': 1.1,
  'Full team assembled': 1.0,
};

// Geographic Location Cost Indices
export const GEOGRAPHIC_LOCATIONS = [
  { name: 'Bay Area (San Francisco)', index: 1.35 },
  { name: 'New York City', index: 1.30 },
  { name: 'Seattle', index: 1.25 },
  { name: 'Boston', index: 1.22 },
  { name: 'Los Angeles', index: 1.20 },
  { name: 'Austin', index: 1.05 },
  { name: 'Denver', index: 1.03 },
  { name: 'Remote US', index: 1.00 },
  { name: 'Chicago', index: 0.98 },
  { name: 'Atlanta', index: 0.95 },
  { name: 'Miami', index: 0.92 },
  { name: 'Toronto', index: 0.88 },
  { name: 'London', index: 1.15 },
  { name: 'Berlin', index: 0.85 },
  { name: 'Singapore', index: 1.10 },
  { name: 'Tel Aviv', index: 1.05 },
  { name: 'São Paulo', index: 0.65 },
  { name: 'Bangalore', index: 0.45 },
  { name: 'Warsaw', index: 0.55 },
  { name: 'Cape Town', index: 0.50 },
];

// Risk Probabilities - Technical Risk by Stage
export const TECHNICAL_RISK_PROBABILITY: Record<CurrentStage, number> = {
  'Concept (TRL 1-3)': 0.65,
  'Prototype (TRL 4-6)': 0.45,
  'Pilot (TRL 7-8)': 0.28,
  'Production (TRL 9)': 0.15,
};

// Risk Probabilities - Market Risk by Target Market
export const MARKET_RISK_PROBABILITY: Record<TargetMarket, number> = {
  'Enterprise B2B': 0.40,
  'SMB B2B': 0.35,
  'Consumer B2C': 0.50,
  'Government': 0.55,
};

// Risk Probabilities - Regulatory Risk by Environment
export const REGULATORY_RISK_PROBABILITY: Record<RegulatoryEnvironment, number> = {
  'None': 0.05,
  'Moderate': 0.18,
  'Heavy (FDA/EPA level)': 0.35,
};

// Competitive Risk (constant)
export const COMPETITIVE_RISK_PROBABILITY = 0.25;

// Risk Impacts
export const RISK_IMPACTS = {
  technical: 0.25,
  market: 0.20,
  regulatory: 0.15,
  competitive: 0.12,
};

// GTM Ramp Months by Market Type
export const GTM_RAMP_MONTHS: Record<TargetMarket, number> = {
  'Enterprise B2B': 18,
  'SMB B2B': 14,
  'Consumer B2C': 10,
  'Government': 24,
};

// Scenario Modifiers
export const SCENARIO_MODIFIERS = {
  optimistic: {
    development: 0.75,
    gtm: 0.70,
    risk: 0.60,
  },
  realistic: {
    development: 1.0,
    gtm: 1.0,
    risk: 1.0,
  },
  conservative: {
    development: 1.25,
    gtm: 1.35,
    risk: 1.30,
  },
};

// Infrastructure Costs by Technology Type
export const INFRASTRUCTURE_COSTS: Record<TechnologyType, number> = {
  'Software': 50000,
  'Hardware': 250000,
  'Biotech': 500000,
  'Clean Energy': 400000,
};

// Regulatory Costs by Environment
export const REGULATORY_COSTS: Record<RegulatoryEnvironment, number> = {
  'None': 0,
  'Moderate': 150000,
  'Heavy (FDA/EPA level)': 750000,
};

// Market Entry Costs by Market Type
export const MARKET_ENTRY_COSTS: Record<TargetMarket, number> = {
  'Enterprise B2B': 300000,
  'SMB B2B': 200000,
  'Consumer B2C': 400000,
  'Government': 250000,
};

// Scaling Cost Multiplier (percentage of development costs)
export const SCALING_MULTIPLIER = 0.40;
