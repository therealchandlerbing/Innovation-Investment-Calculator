import { COEFFICIENTS } from './coefficients';
import type { UserInputs, CalculationResults } from '../types/calculator';

export function calculateInvestment(inputs: UserInputs): CalculationResults {
  // Base calculations
  const burnRate = COEFFICIENTS.monthlyBurnRates[inputs.technologyType];
  const devMonths = COEFFICIENTS.developmentMonths[inputs.stage];
  const teamMultiplier = COEFFICIENTS.teamMultipliers[inputs.teamStatus];
  const geoModifier = COEFFICIENTS.geographyModifiers[inputs.location as keyof typeof COEFFICIENTS.geographyModifiers];
  const gtmMonths = COEFFICIENTS.gtmRampMonths[inputs.market];

  // Development costs
  const baseDevelopment = burnRate * devMonths * teamMultiplier * geoModifier;

  // GTM costs (typically 60-80% of development for B2B, 80-120% for B2C)
  const gtmRatio = inputs.market.includes('B2C') ? 1.0 : 0.7;
  const baseGTM = baseDevelopment * gtmRatio;

  // Risk calculation
  const techRisk = COEFFICIENTS.riskProbabilities.technical[inputs.stage];
  const marketRisk = COEFFICIENTS.riskProbabilities.market[inputs.market];
  const regRisk = COEFFICIENTS.riskProbabilities.regulatory[inputs.regulatory];
  const compRisk = COEFFICIENTS.riskProbabilities.competitive;

  const totalRiskProb =
    (techRisk * COEFFICIENTS.riskImpacts.technical) +
    (marketRisk * COEFFICIENTS.riskImpacts.market) +
    (regRisk * COEFFICIENTS.riskImpacts.regulatory) +
    (compRisk * COEFFICIENTS.riskImpacts.competitive);

  const baseRiskContingency = (baseDevelopment + baseGTM) * totalRiskProb;

  // Calculate three scenarios
  const scenarios = ['optimistic', 'realistic', 'conservative'] as const;
  const results: any = {};

  scenarios.forEach(scenario => {
    const modifiers = COEFFICIENTS.scenarioModifiers[scenario];

    const development = baseDevelopment * modifiers.development;
    const gtm = baseGTM * modifiers.gtm;
    const risk = baseRiskContingency * modifiers.risk;
    const total = development + gtm + risk;
    const timeline = devMonths + (gtmMonths * modifiers.development);

    results[scenario] = {
      name: scenario.charAt(0).toUpperCase() + scenario.slice(1),
      costs: {
        development: Math.round(development / 10000) * 10000,
        gtm: Math.round(gtm / 10000) * 10000,
        risk: Math.round(risk / 10000) * 10000,
        total: Math.round(total / 10000) * 10000,
      },
      timeline: Math.round(timeline),
    };
  });

  // Confidence range (±15% of realistic)
  const realisticTotal = results.realistic.costs.total;

  return {
    ...results,
    confidenceRange: {
      low: Math.round(realisticTotal * 0.85 / 10000) * 10000,
      high: Math.round(realisticTotal * 1.15 / 10000) * 10000,
    },
  };
}

export function calculateStagedFunding(realistic: any): any[] {
  const total = realistic.costs.total;
  const timeline = realistic.timeline;

  return [
    {
      name: 'Validation',
      investment: Math.round(total * 0.25),
      duration: Math.round(timeline * 0.3),
      objective: 'Prove technical feasibility',
      milestone: 'Working prototype / validated concept',
      decisionGate: 'Technical validation complete, proceed to development?',
    },
    {
      name: 'Development',
      investment: Math.round(total * 0.50),
      duration: Math.round(timeline * 0.45),
      objective: 'Build market-ready solution',
      milestone: 'Pilot customers / beta testing complete',
      decisionGate: 'Product-market fit validated, proceed to scale?',
    },
    {
      name: 'Scaling',
      investment: Math.round(total * 0.25),
      duration: Math.round(timeline * 0.25),
      objective: 'Achieve commercial traction',
      milestone: 'Revenue threshold / user growth targets',
      decisionGate: 'Unit economics positive, continue scaling?',
    },
  ];
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}
