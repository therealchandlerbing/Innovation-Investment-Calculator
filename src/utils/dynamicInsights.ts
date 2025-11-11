import type { CalculationResults } from '../types/calculator';
import { formatCurrency } from './calculations';

export function generateDynamicInsight(results: CalculationResults): string {
  const { inputs, scenarios } = results;
  const techType = inputs.technologyType.toLowerCase();
  const market = inputs.targetMarket.toLowerCase();

  const optimistic = scenarios[0];
  const realistic = scenarios[1];
  const conservative = scenarios[2];

  // Calculate variance percentage
  const variance = Math.round(((conservative.total - optimistic.total) / realistic.total) * 100);
  const investmentRange = `${formatCurrency(optimistic.total)} to ${formatCurrency(conservative.total)}`;

  let insight = '';

  // Technology-specific insights
  const techInsights: Record<string, string> = {
    // High regulatory burden
    'biotech': 'Biotech innovations require extensive regulatory validation. Budget heavily for FDA approval processes and clinical trials.',
    'medtech': 'Medical device development demands rigorous testing and certification. Plan for extended regulatory timelines.',
    'synthetic biology': 'Synthetic biology faces complex biosafety regulations. Early engagement with regulatory bodies is critical.',
    'nuclear/advanced nuclear': 'Nuclear technology requires the most extensive regulatory compliance. Anticipate multi-year approval processes.',

    // High capital intensity
    'space technology': 'Space technology demands significant capital investment and long development cycles. Phased funding is essential.',
    'aerospace/defense': 'Aerospace development requires substantial upfront capital. Consider strategic partnerships to share risk.',
    'semiconductors/electronics': 'Semiconductor development is capital-intensive with long lead times. Fab partnerships can reduce initial investment.',

    // Platform/Network dynamics
    'two-sided marketplace': 'Two-sided marketplaces face chicken-and-egg challenges. Budget for simultaneous supply and demand acquisition.',
    'multi-sided platform': 'Platform businesses require critical mass. Early subsidies and user acquisition costs will be higher than traditional businesses.',
    'network effects business': 'Network effects take time to materialize. Expect higher burn rates in early stages before momentum builds.',

    // Emerging tech
    'ai/machine learning': 'AI/ML development requires continuous model training and data infrastructure. Plan for ongoing compute costs.',
    'blockchain/web3': 'Blockchain solutions need security audits and community building. Smart contract audits are non-negotiable.',

    // Default
    'default': 'Innovation implementation requires comprehensive planning beyond initial development.'
  };

  // Market-specific insights
  const marketInsights: Record<string, string> = {
    // Government
    'federal/national government': 'Federal procurement cycles are lengthy and complex. Build relationships 18-24 months before RFP responses.',
    'military/defense': 'Defense contracts require security clearances and strict compliance. Factor in 24-36 month sales cycles.',
    'state/local government': 'State and local government sales require navigating diverse procurement processes across jurisdictions.',

    // Healthcare
    'hospital systems/integrated delivery': 'Hospital systems demand clinical evidence and integration capabilities. ROI studies are critical for adoption.',
    'pharmaceutical/biotech companies': 'Pharmaceutical partnerships require extensive validation data. Intellectual property strategy is paramount.',

    // Impact sector
    'ngo/non-profit organizations': 'Non-profit budgets are constrained but relationships are deep. Demonstrate mission alignment and measurable impact.',
    'social enterprises': 'Social enterprises balance impact and economics. Dual bottom line reporting capabilities are valuable.',

    // Enterprise
    'large enterprise (fortune 1000)': 'Enterprise sales require executive buy-in and lengthy pilots. Build champions at multiple organizational levels.',

    // Default
    'default': 'Understanding your target market\'s decision-making process is critical to GTM success.'
  };

  // Find matching tech insight
  const techInsight = Object.keys(techInsights).find(key => techType.includes(key.toLowerCase()))
    ? techInsights[Object.keys(techInsights).find(key => techType.includes(key.toLowerCase()))!]
    : techInsights.default;

  // Find matching market insight
  const marketInsight = Object.keys(marketInsights).find(key => market.includes(key.toLowerCase()))
    ? marketInsights[Object.keys(marketInsights).find(key => market.includes(key.toLowerCase()))!]
    : marketInsights.default;

  insight += techInsight + ' ';
  insight += marketInsight + ' ';

  // Financial guidance based on variance
  if (variance > 100) {
    insight += `Your investment range spans ${variance}% (${investmentRange}), indicating significant execution risk. Consider staged funding with clear milestones to manage uncertainty.`;
  } else if (variance > 60) {
    insight += `With a ${variance}% variance in scenarios (${investmentRange}), phased investment with validation gates is recommended to mitigate risk.`;
  } else {
    insight += `Your investment estimates show ${variance}% variance (${investmentRange}), suggesting relatively predictable execution. Plan for the realistic scenario with appropriate contingencies.`;
  }

  return insight;
}
