import type { UserInputs, CalculationResults, Scenario, CostBreakdown, StagedFunding, FundingPhase } from '../types';
import {
  MONTHLY_BURN_RATES,
  DEVELOPMENT_MONTHS,
  TEAM_MULTIPLIERS,
  GEOGRAPHIC_LOCATIONS,
  TECHNICAL_RISK_PROBABILITY,
  MARKET_RISK_PROBABILITY,
  REGULATORY_RISK_PROBABILITY,
  COMPETITIVE_RISK_PROBABILITY,
  RISK_IMPACTS,
  GTM_RAMP_MONTHS,
  SCENARIO_MODIFIERS,
  INFRASTRUCTURE_COSTS,
  REGULATORY_COSTS,
  MARKET_ENTRY_COSTS,
  SCALING_MULTIPLIER,
} from '../config/coefficients';

export function calculateInvestment(inputs: UserInputs): CalculationResults {
  // Get base values
  const monthlyBurnRate = MONTHLY_BURN_RATES[inputs.technologyType];
  const developmentMonths = DEVELOPMENT_MONTHS[inputs.currentStage];
  const teamMultiplier = TEAM_MULTIPLIERS[inputs.teamStatus];
  const geoLocation = GEOGRAPHIC_LOCATIONS.find(loc => loc.name === inputs.geographicLocation);
  const geoMultiplier = geoLocation?.index || 1.0;
  const gtmRampMonths = GTM_RAMP_MONTHS[inputs.targetMarket];

  // Calculate base technical costs
  const baseTechnical = monthlyBurnRate * developmentMonths * teamMultiplier * geoMultiplier;

  // Calculate infrastructure costs
  const infrastructure = INFRASTRUCTURE_COSTS[inputs.technologyType] * geoMultiplier;

  // Calculate regulatory costs
  const regulatory = REGULATORY_COSTS[inputs.regulatoryEnvironment] * geoMultiplier;

  // Calculate total development costs
  const developmentCosts = baseTechnical + infrastructure + regulatory;

  // Calculate GTM costs
  const marketEntry = MARKET_ENTRY_COSTS[inputs.targetMarket] * geoMultiplier;
  const scaling = developmentCosts * SCALING_MULTIPLIER;
  const gtmCosts = marketEntry + scaling;

  // Calculate risk factor
  const technicalRiskProb = TECHNICAL_RISK_PROBABILITY[inputs.currentStage];
  const marketRiskProb = MARKET_RISK_PROBABILITY[inputs.targetMarket];
  const regulatoryRiskProb = REGULATORY_RISK_PROBABILITY[inputs.regulatoryEnvironment];

  const expectedRiskImpact =
    (technicalRiskProb * RISK_IMPACTS.technical) +
    (marketRiskProb * RISK_IMPACTS.market) +
    (regulatoryRiskProb * RISK_IMPACTS.regulatory) +
    (COMPETITIVE_RISK_PROBABILITY * RISK_IMPACTS.competitive);

  // Calculate realistic scenario (base case)
  const realisticRiskContingency = (developmentCosts + gtmCosts) * expectedRiskImpact;
  const realisticTotal = developmentCosts + gtmCosts + realisticRiskContingency;
  const realisticTimeline = developmentMonths + gtmRampMonths;

  const realisticBreakdown: CostBreakdown = {
    development: developmentCosts,
    technical: baseTechnical,
    infrastructure,
    regulatory,
    gtm: gtmCosts,
    marketEntry,
    scaling,
    riskContingency: realisticRiskContingency,
    total: realisticTotal,
  };

  // Calculate optimistic scenario
  const optimisticDev = developmentCosts * SCENARIO_MODIFIERS.optimistic.development;
  const optimisticGTM = gtmCosts * SCENARIO_MODIFIERS.optimistic.gtm;
  const optimisticRisk = (optimisticDev + optimisticGTM) * expectedRiskImpact * SCENARIO_MODIFIERS.optimistic.risk;
  const optimisticTotal = optimisticDev + optimisticGTM + optimisticRisk;
  const optimisticTimeline = Math.round(realisticTimeline * 0.85);

  const optimisticBreakdown: CostBreakdown = {
    development: optimisticDev,
    technical: baseTechnical * SCENARIO_MODIFIERS.optimistic.development,
    infrastructure: infrastructure * SCENARIO_MODIFIERS.optimistic.development,
    regulatory: regulatory * SCENARIO_MODIFIERS.optimistic.development,
    gtm: optimisticGTM,
    marketEntry: marketEntry * SCENARIO_MODIFIERS.optimistic.gtm,
    scaling: scaling * SCENARIO_MODIFIERS.optimistic.gtm,
    riskContingency: optimisticRisk,
    total: optimisticTotal,
  };

  // Calculate conservative scenario
  const conservativeDev = developmentCosts * SCENARIO_MODIFIERS.conservative.development;
  const conservativeGTM = gtmCosts * SCENARIO_MODIFIERS.conservative.gtm;
  const conservativeRisk = (conservativeDev + conservativeGTM) * expectedRiskImpact * SCENARIO_MODIFIERS.conservative.risk;
  const conservativeTotal = conservativeDev + conservativeGTM + conservativeRisk;
  const conservativeTimeline = Math.round(realisticTimeline * 1.20);

  const conservativeBreakdown: CostBreakdown = {
    development: conservativeDev,
    technical: baseTechnical * SCENARIO_MODIFIERS.conservative.development,
    infrastructure: infrastructure * SCENARIO_MODIFIERS.conservative.development,
    regulatory: regulatory * SCENARIO_MODIFIERS.conservative.development,
    gtm: conservativeGTM,
    marketEntry: marketEntry * SCENARIO_MODIFIERS.conservative.gtm,
    scaling: scaling * SCENARIO_MODIFIERS.conservative.gtm,
    riskContingency: conservativeRisk,
    total: conservativeTotal,
  };

  const scenarios: Scenario[] = [
    {
      name: 'Optimistic',
      total: optimisticTotal,
      timeline: optimisticTimeline,
      breakdown: optimisticBreakdown,
    },
    {
      name: 'Realistic',
      total: realisticTotal,
      timeline: realisticTimeline,
      breakdown: realisticBreakdown,
    },
    {
      name: 'Conservative',
      total: conservativeTotal,
      timeline: conservativeTimeline,
      breakdown: conservativeBreakdown,
    },
  ];

  // Calculate confidence interval (±15% of realistic)
  const confidenceInterval = {
    min: realisticTotal * 0.85,
    max: realisticTotal * 1.15,
  };

  return {
    scenarios,
    confidenceInterval,
    inputs,
  };
}

export function calculateStagedFunding(realisticScenario: Scenario): StagedFunding {
  const totalInvestment = realisticScenario.total;
  const totalTimeline = realisticScenario.timeline;

  // Phase 1: Validation (25% of total)
  const phase1Investment = totalInvestment * 0.25;
  const phase1Duration = Math.round(totalTimeline * 0.30);

  // Phase 2: Development (50% of total)
  const phase2Investment = totalInvestment * 0.50;
  const phase2Duration = Math.round(totalTimeline * 0.45);

  // Phase 3: Scaling (25% of total)
  const phase3Investment = totalInvestment * 0.25;
  const phase3Duration = Math.round(totalTimeline * 0.25);

  const phases: FundingPhase[] = [
    {
      name: 'Phase 1: Validation',
      investment: phase1Investment,
      duration: phase1Duration,
      objective: 'Validate core technology and product-market fit',
      keyMilestone: 'Working prototype with initial customer validation',
      decisionGate: 'Technical feasibility confirmed, clear market need identified',
    },
    {
      name: 'Phase 2: Development',
      investment: phase2Investment,
      duration: phase2Duration,
      objective: 'Build production-ready product and establish go-to-market foundation',
      keyMilestone: 'Production-ready product, pilot customers acquired',
      decisionGate: 'Product meets quality standards, positive customer feedback, clear path to scale',
    },
    {
      name: 'Phase 3: Scaling',
      investment: phase3Investment,
      duration: phase3Duration,
      objective: 'Scale operations and achieve market penetration',
      keyMilestone: 'Revenue growth, market traction, operational efficiency',
      decisionGate: 'Sustainable unit economics, repeatable sales process, path to profitability',
    },
  ];

  return {
    phases,
    totalInvestment,
    totalDuration: phase1Duration + phase2Duration + phase3Duration,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
