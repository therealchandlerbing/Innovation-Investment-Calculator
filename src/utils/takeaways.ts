import type { CalculationResults } from '../types/calculator';
import { formatCurrency } from './calculations';

export interface Takeaway {
  icon: string;
  title: string;
  text: string;
}

export function generateTakeaways(results: CalculationResults): Takeaway[] {
  const takeaways: Takeaway[] = [];
  const { inputs, scenarios } = results;
  const realistic = scenarios[1]; // Realistic scenario
  const techType = inputs.technologyType.toLowerCase();
  const market = inputs.targetMarket.toLowerCase();
  const stage = inputs.currentStage.toLowerCase();

  // 1. Budget-relative takeaway
  if (realistic.total < 1000000) {
    takeaways.push({
      icon: '🎯',
      title: 'Capital Efficient Opportunity',
      text: `At ${formatCurrency(realistic.total)}, this innovation can be funded through angel investment or bootstrapping, maintaining founder control while validating market fit. This positions you well for early-stage funding rounds.`
    });
  } else if (realistic.total >= 1000000 && realistic.total < 3000000) {
    takeaways.push({
      icon: '💼',
      title: 'Seed to Series A Range',
      text: `${formatCurrency(realistic.total)} typically requires institutional seed or Series A funding. Plan for 4-6 months of fundraising with clear traction metrics to show investors.`
    });
  } else if (realistic.total >= 3000000) {
    takeaways.push({
      icon: '💰',
      title: 'Institutional Funding Required',
      text: `${formatCurrency(realistic.total)} typically requires Series A or later stage funding. Plan for 6-9 months of fundraising, and ensure you have significant milestones and market traction to demonstrate.`
    });
  }

  // 2. Timeline takeaway
  if (realistic.timeline > 24) {
    takeaways.push({
      icon: '⏱️',
      title: 'Extended Development Runway',
      text: `${realistic.timeline} months is a substantial development period. Build in quarterly milestones to maintain team morale and investor confidence. Consider staged funding to reduce upfront risk and validate assumptions progressively.`
    });
  } else if (realistic.timeline <= 12) {
    takeaways.push({
      icon: '⚡',
      title: 'Fast Time-to-Market',
      text: `${realistic.timeline} months to market is relatively fast for innovation. This shorter runway reduces capital requirements and allows for quicker market validation. Focus on MVP approach to maximize speed.`
    });
  }

  // 3. Tech-market alignment takeaways
  if ((techType.includes('health') || techType.includes('medical') || techType.includes('biotech') || techType.includes('pharma')) &&
      (market.includes('healthcare') || market.includes('hospital'))) {
    takeaways.push({
      icon: '✓',
      title: 'Strong Product-Market Alignment',
      text: 'Healthcare technology targeting healthcare markets shows highest success rates in industry data. Your regulatory pathway is well-defined, though potentially lengthy. Budget extra time for compliance milestones.'
    });
  }

  if ((techType.includes('ai') || techType.includes('ml') || techType.includes('machine learning')) &&
      (market.includes('enterprise') || market.includes('fortune'))) {
    takeaways.push({
      icon: '🤖',
      title: 'Enterprise AI Sweet Spot',
      text: 'AI/ML solutions for enterprise markets are currently high-demand. Focus on clear ROI metrics and integration simplicity. Enterprise sales cycles are long but contract values are substantial.'
    });
  }

  if (techType.includes('fintech') && market.includes('smb')) {
    takeaways.push({
      icon: '💳',
      title: 'SMB FinTech Opportunity',
      text: 'FinTech for SMBs benefits from faster sales cycles than enterprise while maintaining good unit economics. Regulatory compliance is critical—budget adequately for legal and compliance costs.'
    });
  }

  // 4. Stage-specific insights
  if (stage.includes('concept')) {
    takeaways.push({
      icon: '🔬',
      title: 'Early Stage Validation Critical',
      text: 'At the concept stage, focus your initial funding on rapid prototyping and customer discovery. The goal is to fail fast on bad assumptions and double down on validated insights before committing to full development.'
    });
  }

  if (stage.includes('market ready') || stage === 'production') {
    takeaways.push({
      icon: '🚀',
      title: 'Market Ready Advantage',
      text: 'With a market-ready product, you can demonstrate real traction to investors. Focus funding on GTM execution and scaling rather than product development. Consider revenue-based financing options.'
    });
  }

  // 5. Risk-based insights
  const scenarioSpread = scenarios[2].total - scenarios[0].total; // Conservative - Optimistic
  const spreadPercentage = (scenarioSpread / realistic.total) * 100;

  if (spreadPercentage > 150) {
    takeaways.push({
      icon: '⚠️',
      title: 'High Uncertainty Range',
      text: `Your scenario spread is ${Math.round(spreadPercentage)}% of the realistic estimate, indicating significant uncertainty. Plan for contingencies and consider staged funding with clear go/no-go decision points.`
    });
  }

  // 6. Break-even insights
  if (realistic.breakEven > 36) {
    takeaways.push({
      icon: '📊',
      title: 'Long Path to Profitability',
      text: `${realistic.breakEven} months to break-even requires patient capital. Ensure investors understand this is a long-term play. Consider interim monetization strategies to extend runway.`
    });
  }

  // Limit to top 3 most relevant takeaways
  return takeaways.slice(0, 3);
}
