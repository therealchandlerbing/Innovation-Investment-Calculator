import {
  DEVELOPMENT_COSTS,
  REGULATORY_COSTS,
  GTM_COSTS,
  STAGE_TIMELINES,
  GEOGRAPHIC_LOCATIONS,
} from './coefficients';
import type { UserInputs, CalculationResults, Scenario, CostBreakdown, StagedFunding, FundingPhase } from '../types/calculator';

export function calculateInvestment(inputs: UserInputs): CalculationResults {
  // Get base costs from new comprehensive models
  const developmentCost = DEVELOPMENT_COSTS[inputs.technologyType][inputs.currentStage];
  const regulatoryCost = REGULATORY_COSTS[inputs.technologyType];
  const gtmYear1 = GTM_COSTS[inputs.targetMarket].year1;
  const gtmYears23 = GTM_COSTS[inputs.targetMarket].years23;
  const timeline = STAGE_TIMELINES[inputs.currentStage];

  // Get geographic cost modifier
  const geoLocation = GEOGRAPHIC_LOCATIONS.find(loc => loc.name === inputs.geographicLocation);
  const geoModifier = geoLocation ? geoLocation.index : 1.0;

  // Apply team status multiplier
  const teamMultipliers = {
    'No team yet': 1.25,
    'Partial team': 1.10,
    'Full team assembled': 1.00,
  };
  const teamMultiplier = teamMultipliers[inputs.teamStatus];

  // Apply regulatory environment multiplier
  const regulatoryMultipliers = {
    'None': 0.5,
    'Moderate': 1.0,
    'Heavy (FDA/EPA level)': 1.8,
  };
  const regulatoryMultiplier = regulatoryMultipliers[inputs.regulatoryEnvironment];

  // Scenario modifiers
  const scenarioConfigs = {
    'Optimistic': { devMultiplier: 0.85, timelineMultiplier: 1.5 },
    'Realistic': { devMultiplier: 1.0, timelineMultiplier: 1.75 },
    'Conservative': { devMultiplier: 1.20, timelineMultiplier: 2.25 },
  };

  // Calculate scenarios
  const scenarios: Scenario[] = Object.entries(scenarioConfigs).map(([name, config]) => {
    // Base costs with modifiers
    const development = developmentCost * config.devMultiplier * geoModifier * teamMultiplier;
    const regulatory = regulatoryCost * regulatoryMultiplier * config.devMultiplier;
    const gtmTotal = (gtmYear1 + gtmYears23) * config.devMultiplier * geoModifier;

    // Technical costs (included in development)
    const technical = development * 0.15; // ~15% of development goes to technical infrastructure

    // Risk buffer (40% of base costs)
    const riskBuffer = (development + regulatory + gtmTotal) * 0.40;

    // Total investment
    const total = development + regulatory + gtmTotal + riskBuffer;

    // Break-even timeline
    const breakEven = timeline * config.timelineMultiplier;

    const breakdown: CostBreakdown = {
      development: Math.round(development),
      technical: Math.round(technical),
      regulatory: Math.round(regulatory),
      gtm: Math.round(gtmTotal),
      gtmYear1: Math.round(gtmYear1 * config.devMultiplier * geoModifier),
      gtmYears23: Math.round(gtmYears23 * config.devMultiplier * geoModifier),
      riskBuffer: Math.round(riskBuffer),
      total: Math.round(total),
      breakEven: Math.round(breakEven),
    };

    return {
      name: name as 'Optimistic' | 'Realistic' | 'Conservative',
      total: breakdown.total,
      timeline: Math.round(timeline),
      breakEven: breakdown.breakEven,
      breakdown,
    };
  });

  // Confidence interval (±20% of realistic scenario)
  const realisticTotal = scenarios[1].total; // Realistic is the middle scenario
  const confidenceInterval = {
    min: Math.round(realisticTotal * 0.80),
    max: Math.round(realisticTotal * 1.20),
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

  // Phase 1: Validate (25% of investment, 30% of timeline)
  const phase1Investment = Math.round(total * 0.25);
  const phase1Duration = Math.round(timeline * 0.30);

  // Phase 2: Build (50% of investment, 45% of timeline)
  const phase2Investment = Math.round(total * 0.50);
  const phase2Duration = Math.round(timeline * 0.45);

  // Phase 3: Scale (25% of investment, 25% of timeline)
  const phase3Investment = total - phase1Investment - phase2Investment; // Ensure exact total
  const phase3Duration = timeline - phase1Duration - phase2Duration; // Ensure exact timeline

  const phases: FundingPhase[] = [
    {
      name: 'Phase 1: Validate',
      investment: phase1Investment,
      duration: phase1Duration,
      percentage: 25,
      objective: 'Prove technical feasibility and validate core assumptions',
      keyMilestone: 'Working prototype demonstrating core functionality',
      decisionGate: 'Technical validation complete. Proceed to full development?',
    },
    {
      name: 'Phase 2: Build',
      investment: phase2Investment,
      duration: phase2Duration,
      percentage: 50,
      objective: 'Develop market-ready product and establish initial traction',
      keyMilestone: 'Beta testing complete with pilot customers',
      decisionGate: 'Product-market fit validated. Proceed to scaling?',
    },
    {
      name: 'Phase 3: Scale',
      investment: phase3Investment,
      duration: phase3Duration,
      percentage: 25,
      objective: 'Achieve commercial scale and sustainable growth',
      keyMilestone: 'Revenue targets met with positive unit economics',
      decisionGate: 'Business model proven. Continue growth investment?',
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
