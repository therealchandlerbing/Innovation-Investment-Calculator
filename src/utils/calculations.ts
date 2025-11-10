import {
  DEVELOPMENT_COSTS,
  REGULATORY_COSTS,
  GTM_COSTS,
  STAGE_TIMELINES,
  GEOGRAPHIC_LOCATIONS,
} from './coefficients';
import type { UserInputs, CalculationResults, Scenario, CostBreakdown, StagedFunding, FundingPhase } from '../types/calculator';

export function calculateInvestment(inputs: UserInputs): CalculationResults {
  // Get base costs from comprehensive models
  const baseDevelopmentCost = DEVELOPMENT_COSTS[inputs.technologyType][inputs.currentStage];
  const baseRegulatoryCost = REGULATORY_COSTS[inputs.technologyType];
  const gtmYear1Base = GTM_COSTS[inputs.targetMarket].year1;
  const gtmYears23Base = GTM_COSTS[inputs.targetMarket].years23;
  const timeline = STAGE_TIMELINES[inputs.currentStage];

  // Geographic cost modifier (defaults to 1.0)
  const geoLocation = GEOGRAPHIC_LOCATIONS.find(loc => loc.name === inputs.geographicLocation);
  const geoModifier = geoLocation ? geoLocation.index : 1.0;

  // Team status multiplier (defaults to 1.0 for full team)
  const teamMultipliers = {
    'No team yet': 1.25,
    'Partial team': 1.10,
    'Full team assembled': 1.00,
  };
  const teamMultiplier = teamMultipliers[inputs.teamStatus];

  // Regulatory environment multiplier (defaults to 1.0 for moderate)
  const regulatoryMultipliers = {
    'None': 0.5,
    'Moderate': 1.0,
    'Heavy (FDA/EPA level)': 1.8,
  };
  const regulatoryMultiplier = regulatoryMultipliers[inputs.regulatoryEnvironment];

  // Scenario configurations per reference document
  const scenarioConfigs = {
    'Optimistic': {
      devMultiplier: 0.7,
      gtmMultiplier: 0.6,
      timelineMultiplier: 0.75,
      breakEvenMultiplier: 1.5
    },
    'Realistic': {
      devMultiplier: 1.2,
      gtmMultiplier: 1.2,
      timelineMultiplier: 1.0,
      breakEvenMultiplier: 1.75
    },
    'Conservative': {
      devMultiplier: 1.8,
      gtmMultiplier: 2.0,
      timelineMultiplier: 1.5,
      breakEvenMultiplier: 2.25
    },
  };

  // Calculate scenarios
  const scenarios: Scenario[] = Object.entries(scenarioConfigs).map(([name, config]) => {
    // Development costs with scenario, geographic, and team multipliers
    const development = baseDevelopmentCost * config.devMultiplier * geoModifier * teamMultiplier;

    // Regulatory costs (with environment multiplier only, not scenario multiplier)
    const regulatory = baseRegulatoryCost * regulatoryMultiplier;

    // GTM Year 1 only (with scenario and geographic multipliers)
    const gtmYear1 = gtmYear1Base * config.gtmMultiplier * geoModifier;

    // GTM Years 2-3 for reference (not included in total investment)
    const gtmYears23 = gtmYears23Base * config.gtmMultiplier * geoModifier;

    // Technical costs (subset of development, for breakdown display)
    const technical = development * 0.15;

    // Risk buffer (40% of development costs only, per reference)
    const riskBuffer = development * 0.40;

    // Total investment (Development + Regulatory + GTM Year 1 + Risk Buffer)
    const total = development + regulatory + gtmYear1 + riskBuffer;

    // Timeline with scenario adjustment
    const adjustedTimeline = timeline * config.timelineMultiplier;

    // Break-even timeline
    const breakEven = timeline * config.breakEvenMultiplier;

    const breakdown: CostBreakdown = {
      development: Math.round(development),
      technical: Math.round(technical),
      regulatory: Math.round(regulatory),
      gtm: Math.round(gtmYear1), // Only Year 1 in total
      gtmYear1: Math.round(gtmYear1),
      gtmYears23: Math.round(gtmYears23), // For reference only
      riskBuffer: Math.round(riskBuffer),
      total: Math.round(total),
      breakEven: Math.round(breakEven),
    };

    return {
      name: name as 'Optimistic' | 'Realistic' | 'Conservative',
      total: breakdown.total,
      timeline: Math.round(adjustedTimeline),
      breakEven: breakdown.breakEven,
      breakdown,
    };
  });

  // Confidence interval (±15% of realistic scenario per reference)
  const realisticTotal = scenarios[1].total; // Realistic is the middle scenario
  const confidenceInterval = {
    min: Math.round(realisticTotal * 0.85),
    max: Math.round(realisticTotal * 1.15),
  };

  return {
    scenarios,
    confidenceInterval,
    inputs,
  };
}

export function calculateStagedFunding(results: CalculationResults): StagedFunding {
  const realisticScenario = results.scenarios.find(s => s.name === 'Realistic');
  if (!realisticScenario) {
    throw new Error('Realistic scenario not found');
  }

  const total = realisticScenario.total;
  const timeline = realisticScenario.timeline;

  // Phase 1: Validate (15% of investment, 20% of timeline per reference)
  const phase1Percentage = 15;
  const phase1Investment = Math.round(total * 0.15);
  const phase1Duration = Math.round(timeline * 0.20);

  // Phase 2: Build (35% of investment, 40% of timeline per reference)
  const phase2Percentage = 35;
  const phase2Investment = Math.round(total * 0.35);
  const phase2Duration = Math.round(timeline * 0.40);

  // Phase 3: Scale (50% of investment, 40% of timeline per reference)
  const phase3Percentage = 50;
  const phase3Investment = total - phase1Investment - phase2Investment; // Ensure exact total
  const phase3Duration = timeline - phase1Duration - phase2Duration; // Ensure exact timeline

  const phases: FundingPhase[] = [
    {
      name: 'Phase 1: Validate',
      investment: phase1Investment,
      duration: phase1Duration,
      percentage: phase1Percentage,
      objective: 'Proof of concept, initial customer validation, technical feasibility',
      keyMilestone: 'Technical milestone achieved',
      decisionGate: 'Technical milestone achieved?',
    },
    {
      name: 'Phase 2: Build',
      investment: phase2Investment,
      duration: phase2Duration,
      percentage: phase2Percentage,
      objective: 'Product development, market validation, initial sales',
      keyMilestone: 'Market traction confirmed',
      decisionGate: 'Market traction confirmed?',
    },
    {
      name: 'Phase 3: Scale',
      investment: phase3Investment,
      duration: phase3Duration,
      percentage: phase3Percentage,
      objective: 'Market expansion, team scaling, operations buildout',
      keyMilestone: 'Unit economics proven',
      decisionGate: 'Unit economics proven?',
    },
  ];

  return {
    phases,
    totalInvestment: total,
    totalDuration: timeline,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}
