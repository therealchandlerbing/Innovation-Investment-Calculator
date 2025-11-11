import type { CalculationResults } from '../types/calculator';
import { formatCurrency } from './calculations';

export type TakeawayType = 'warning' | 'success' | 'tip' | 'info';

export interface Takeaway {
  type: TakeawayType;
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

  // 1. Stage-based insights (highest priority)
  if (stage.includes('concept')) {
    takeaways.push({
      type: 'warning',
      icon: '⚠️',
      title: 'High Uncertainty Stage',
      text: 'Concept stage has the highest failure rate (65%). Consider breaking funding into smaller validation milestones to reduce risk. Focus on rapid prototyping and customer discovery before committing to full development.'
    });
  }

  if (stage.includes('market ready') || stage === 'production') {
    takeaways.push({
      type: 'success',
      icon: '✓',
      title: 'Lower Technical Risk',
      text: 'Market-ready stage significantly reduces technical risk. Focus budget on GTM and customer acquisition rather than development. You can demonstrate real traction to investors and consider revenue-based financing options.'
    });
  }

  // 2. Tech-market misalignment warnings
  if ((techType.includes('health') || techType.includes('medical') || techType.includes('biotech') || techType.includes('pharma')) &&
      !market.includes('healthcare') && !market.includes('hospital')) {
    takeaways.push({
      type: 'tip',
      icon: '💡',
      title: 'Market Alignment Consideration',
      text: 'Healthcare technologies typically find fastest traction within healthcare systems. Your chosen market may extend timeline by 6-12 months as you navigate different buyer personas and value propositions.'
    });
  }

  // 3. Government/compliance insights
  if ((market.includes('federal') || market.includes('government') || market.includes('military')) &&
      (techType.includes('software') || techType.includes('saas') || techType.includes('cloud'))) {
    takeaways.push({
      type: 'info',
      icon: 'ℹ️',
      title: 'Compliance Costs Required',
      text: 'Government sales require FedRAMP, DoD compliance, or similar certifications. Budget an additional $200K-$500K for security certifications, audits, and ongoing compliance maintenance.'
    });
  }

  // 4. Budget-relative insights
  if (realistic.total < 1000000) {
    takeaways.push({
      type: 'success',
      icon: '🎯',
      title: 'Bootstrap-Friendly Investment',
      text: `At ${formatCurrency(realistic.total)}, this innovation is viable for angel funding or bootstrapping. Consider revenue-based financing to maintain control while validating market fit and scaling efficiently.`
    });
  } else if (realistic.total >= 1000000 && realistic.total < 3000000) {
    takeaways.push({
      type: 'info',
      icon: '💼',
      title: 'Seed to Series A Range',
      text: `${formatCurrency(realistic.total)} typically requires institutional seed or Series A funding. Plan for 4-6 months of fundraising with clear traction metrics and customer validation to show investors.`
    });
  } else if (realistic.total >= 3000000) {
    takeaways.push({
      type: 'warning',
      icon: '💰',
      title: 'Significant Capital Required',
      text: `Investment >${formatCurrency(3000000)} typically requires institutional funding (Series A or later). Plan for 6-9 months of fundraising time before starting development. Demonstrate significant milestones and market traction.`
    });
  }

  // 5. Timeline insights
  if (realistic.timeline > 24) {
    takeaways.push({
      type: 'tip',
      icon: '⏱️',
      title: 'Extended Development Timeline',
      text: `${realistic.timeline} months is a long runway. Consider interim milestones that demonstrate progress to investors and prevent team burnout. Build in quarterly checkpoints to validate assumptions and adjust course.`
    });
  } else if (realistic.timeline <= 12) {
    takeaways.push({
      type: 'success',
      icon: '⚡',
      title: 'Fast Time-to-Market Advantage',
      text: `${realistic.timeline} months to market is relatively fast for innovation. This shorter runway reduces capital requirements and allows for quicker market validation. Leverage this speed advantage against competitors.`
    });
  }

  // 6. Tech-market alignment success cases
  if ((techType.includes('health') || techType.includes('medical') || techType.includes('biotech') || techType.includes('pharma')) &&
      (market.includes('healthcare') || market.includes('hospital'))) {
    takeaways.push({
      type: 'success',
      icon: '✓',
      title: 'Strong Product-Market Alignment',
      text: 'Healthcare technology targeting healthcare markets shows highest success rates in industry data. Your regulatory pathway is well-defined, though potentially lengthy. Budget extra time for compliance milestones.'
    });
  }

  if ((techType.includes('ai') || techType.includes('ml') || techType.includes('machine learning')) &&
      (market.includes('enterprise') || market.includes('fortune'))) {
    takeaways.push({
      type: 'tip',
      icon: '🤖',
      title: 'Enterprise AI Sweet Spot',
      text: 'AI/ML solutions for enterprise markets are currently high-demand. Focus on clear ROI metrics and integration simplicity. Enterprise sales cycles are long (9-18 months) but contract values are substantial.'
    });
  }

  if (techType.includes('fintech') && market.includes('smb')) {
    takeaways.push({
      type: 'tip',
      icon: '💳',
      title: 'SMB FinTech Opportunity',
      text: 'FinTech for SMBs benefits from faster sales cycles than enterprise while maintaining good unit economics. Regulatory compliance is critical—budget adequately for legal and compliance costs.'
    });
  }

  // 7. High uncertainty warning
  const scenarioSpread = scenarios[2].total - scenarios[0].total;
  const spreadPercentage = (scenarioSpread / realistic.total) * 100;

  if (spreadPercentage > 150) {
    takeaways.push({
      type: 'warning',
      icon: '⚠️',
      title: 'High Uncertainty Range',
      text: `Your scenario spread is ${Math.round(spreadPercentage)}% of the realistic estimate, indicating significant uncertainty. Plan for contingencies and consider staged funding with clear go/no-go decision points.`
    });
  }

  // 8. Break-even insights
  if (realistic.breakEven > 36) {
    takeaways.push({
      type: 'info',
      icon: '📊',
      title: 'Long Path to Profitability',
      text: `${realistic.breakEven} months to break-even requires patient capital. Ensure investors understand this is a long-term play. Consider interim monetization strategies to extend runway and reduce dilution.`
    });
  }

  // Limit to top 3-4 most relevant takeaways, prioritizing warnings and success types
  const prioritized = [
    ...takeaways.filter(t => t.type === 'warning'),
    ...takeaways.filter(t => t.type === 'success'),
    ...takeaways.filter(t => t.type === 'tip'),
    ...takeaways.filter(t => t.type === 'info'),
  ];

  return prioritized.slice(0, 4);
}
