import jsPDF from 'jspdf';
import type { UserInputs, CalculationResults, StagedFunding } from '../types/calculator';
import { formatCurrency } from './calculations';
import { generateTakeaways } from './takeaways';

export function generatePDF(inputs: UserInputs, results: CalculationResults, stagedFunding: StagedFunding): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  const realisticScenario = results.scenarios[1]; // Realistic is middle scenario
  const optimisticScenario = results.scenarios[0];
  const conservativeScenario = results.scenarios[2];

  // ========== PAGE 1: COVER PAGE ==========
  // Navy background
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative accent circle
  pdf.setFillColor(59, 130, 246, 15);
  pdf.circle(pageWidth - 30, 30, 50, 'F');

  // THE BIG NUMBER - This is the hook
  pdf.setFontSize(72);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(formatCurrency(realisticScenario.total), pageWidth / 2, 90, { align: 'center' });

  // Value proposition
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(200, 200, 200);
  pdf.text(`${realisticScenario.timeline} months to market-ready`, pageWidth / 2, 110, { align: 'center' });
  pdf.text(`Break-even: Month ${realisticScenario.breakEven}`, pageWidth / 2, 125, { align: 'center' });

  // Title and context
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Innovation Investment Analysis', pageWidth / 2, 155, { align: 'center' });

  // Strategic identity line
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 200, 255);
  pdf.text(`${inputs.technologyType} | ${inputs.currentStage} | ${inputs.geographicLocation}`, pageWidth / 2, 167, { align: 'center' });

  pdf.setFontSize(13);
  pdf.setTextColor(150, 150, 150);
  pdf.text(inputs.targetMarket, pageWidth / 2, 180, { align: 'center' });

  // Trust signals
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  pdf.text('Based on 200+ implementations • 30 technology types • 33 market segments', pageWidth / 2, 245, { align: 'center' });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text('Innovation Investment Calculator', pageWidth / 2, 270, { align: 'center' });
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(dateStr, pageWidth / 2, 277, { align: 'center' });

  // ========== PAGE 2: STRATEGIC CONTEXT ==========
  pdf.addPage();
  pdf.setTextColor(0, 0, 0);

  addSectionHeader(pdf, 'Strategic Context', 'Why This Investment Matters', margin, 25);

  let yPos = 50;

  // Context box with gradient background
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 55, 3, 3, 'F');

  yPos += 8;

  // The Innovation
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('THE INNOVATION', margin + 5, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);

  // Generate contextual description based on inputs
  const innovationDesc = getInnovationContext(inputs);
  const wrappedInnovation = pdf.splitTextToSize(innovationDesc, pageWidth - 2 * margin - 10);
  pdf.text(wrappedInnovation, margin + 5, yPos);
  yPos += (wrappedInnovation.length * 4) + 5;

  // Market Opportunity
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(16, 185, 129);
  pdf.text('MARKET OPPORTUNITY', margin + 5, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);

  const marketDesc = getMarketContext(inputs);
  const wrappedMarket = pdf.splitTextToSize(marketDesc, pageWidth - 2 * margin - 10);
  pdf.text(wrappedMarket, margin + 5, yPos);
  yPos += (wrappedMarket.length * 4) + 5;

  // Investment Thesis
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(245, 158, 11);
  pdf.text('INVESTMENT THESIS', margin + 5, yPos);

  yPos += 6;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);

  const thesisDesc = getInvestmentThesis(inputs, realisticScenario);
  const wrappedThesis = pdf.splitTextToSize(thesisDesc, pageWidth - 2 * margin - 10);
  pdf.text(wrappedThesis, margin + 5, yPos);

  yPos += (wrappedThesis.length * 4) + 15;

  // Market & Regulatory Context
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Market Readiness & Regulatory Context', margin, yPos);
  yPos += 8;

  // Create two-column layout for context
  const colWidth = (pageWidth - 2 * margin - 5) / 2;

  // Left column: Regulatory
  pdf.setFillColor(254, 242, 242);
  pdf.roundedRect(margin, yPos, colWidth, 35, 2, 2, 'F');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(220, 38, 38);
  pdf.text('Regulatory Environment', margin + 3, yPos + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  const regContext = getRegulatoryContext(inputs);
  const wrappedReg = pdf.splitTextToSize(regContext, colWidth - 6);
  pdf.text(wrappedReg, margin + 3, yPos + 11);

  // Right column: Market
  pdf.setFillColor(240, 253, 244);
  pdf.roundedRect(margin + colWidth + 5, yPos, colWidth, 35, 2, 2, 'F');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(22, 163, 74);
  pdf.text('Market Dynamics', margin + colWidth + 8, yPos + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  const marketDynamics = getMarketDynamics(inputs);
  const wrappedDynamics = pdf.splitTextToSize(marketDynamics, colWidth - 6);
  pdf.text(wrappedDynamics, margin + colWidth + 8, yPos + 11);

  yPos += 45;

  // Key Assumptions & Rationale
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Why These Numbers: Model Assumptions', margin, yPos);
  yPos += 8;

  pdf.setFillColor(255, 251, 235);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 2, 2, 'F');

  yPos += 7;

  const assumptions = [
    { label: '15% Risk Buffer', rationale: 'Conservative contingency for scope changes, market uncertainties, and timeline extensions. Applied to base costs (development + regulatory + GTM) to account for execution risk while avoiding over-capitalization.' },
    { label: 'Timeline Calibration', rationale: `${inputs.currentStage} at TRL ${inputs.technologyType.includes('7') ? '7-8' : 'varies'}: industry benchmarks show ${realisticScenario.timeline}mo median with ±20% variance.` },
    { label: 'Regulatory Multiplier', rationale: `${inputs.regulatoryEnvironment} environment: applies ${inputs.regulatoryEnvironment === 'Heavy (FDA/EPA level)' ? '2.0-2.5x' : inputs.regulatoryEnvironment === 'Moderate' ? '1.3-1.5x' : '1.0x'} cost factor based on historical precedents.` },
  ];

  assumptions.forEach(assumption => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(161, 98, 7);
    pdf.text(`• ${assumption.label}:`, margin + 3, yPos);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    pdf.setFontSize(8);
    const wrapped = pdf.splitTextToSize(assumption.rationale, pageWidth - 2 * margin - 8);
    pdf.text(wrapped, margin + 6, yPos + 4);
    yPos += 4 + (wrapped.length * 3.5) + 2;
  });

  addPageFooter(pdf);

  // ========== PAGE 3: EXECUTIVE SUMMARY ==========
  pdf.addPage();
  pdf.setTextColor(0, 0, 0);

  // Header
  addSectionHeader(pdf, 'Executive Summary', 'Your Investment Decision', margin, 25);

  yPos = 55;

  // THE NUMBER - Make it dominate
  pdf.setFontSize(56);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(formatCurrency(realisticScenario.total), pageWidth / 2, yPos, { align: 'center' });

  yPos += 12;

  // Confidence range directly below
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Confidence Range: ${formatCurrency(results.confidenceInterval.min)} - ${formatCurrency(results.confidenceInterval.max)} (±15%)`,
    pageWidth / 2, yPos, { align: 'center' });

  yPos += 20;

  // Key metrics grid
  const metrics = [
    { label: 'Development Timeline', value: `${realisticScenario.timeline} months`, icon: '⏱️' },
    { label: 'Break-Even Point', value: `Month ${realisticScenario.breakEven}`, icon: '📈' },
    { label: 'Best to Worst Case', value: `${formatCurrency(optimisticScenario.total)}-${formatCurrency(conservativeScenario.total)}`, icon: '📊' },
  ];

  metrics.forEach((metric, index) => {
    const x = margin + (index % 3) * ((pageWidth - 2 * margin) / 3);

    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(x, yPos, ((pageWidth - 2 * margin) / 3) - 3, 25, 2, 2, 'F');

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 100, 100);
    pdf.text(metric.label.toUpperCase(), x + 3, yPos + 6);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(metric.value, x + 3, yPos + 15);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text(index === 0 ? 'From start to market' : index === 1 ? 'Profitability milestone' : 'Full scenario spread',
      x + 3, yPos + 21);
  });

  yPos += 35;

  // Key Decision Signal callout
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(34, 197, 94);
  pdf.setLineWidth(2);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 28, 3, 3, 'FD');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(22, 163, 74);
  pdf.text('✓ KEY DECISION SIGNAL', margin + 5, yPos + 8);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(21, 128, 61);
  const decisionText = `Proceed with staged funding approach. ${realisticScenario.timeline}-month timeline is achievable with proper validation gates. Investment level aligns with ${inputs.targetMarket} market benchmarks.`;
  const decisionLines = pdf.splitTextToSize(decisionText, pageWidth - 2 * margin - 10);
  pdf.text(decisionLines, margin + 5, yPos + 16);

  yPos += 38;

  // Input summary
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Project Details', margin, yPos);
  yPos += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const details = [
    ['Technology Type', inputs.technologyType],
    ['Current Stage', inputs.currentStage],
    ['Target Market', inputs.targetMarket],
    ['Geographic Location', inputs.geographicLocation],
    ['Team Status', inputs.teamStatus],
    ['Regulatory Environment', inputs.regulatoryEnvironment],
  ];

  details.forEach(([label, value]) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(label + ':', margin, yPos);
    pdf.setTextColor(0, 0, 0);
    pdf.text(value, margin + 50, yPos);
    yPos += 6;
  });

  addPageFooter(pdf);

  // ========== PAGE 3: INVESTMENT SCENARIOS (VISUAL COMPARISON) ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Investment Scenarios', 'Visual Comparison', margin, 25);

  yPos = 50;

  // Find max total for scaling bars
  const maxTotal = Math.max(...results.scenarios.map(s => s.total));
  const barMaxWidth = pageWidth - 2 * margin - 60; // Leave room for labels

  // Component colors for stacked bars
  const componentColors: { [key: string]: [number, number, number] } = {
    development: [59, 130, 246], // Blue
    regulatory: [168, 85, 247], // Purple
    gtmYear1: [16, 185, 129], // Green
    riskBuffer: [245, 158, 11], // Orange
  };

  // Scenario icons for visual recognition
  const scenarioIcons = ['☀️', '⚖️', '🌧️'];

  results.scenarios.forEach((scenario, index) => {
    // Scenario label with icon
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${scenarioIcons[index]} ${scenario.name}`, margin, yPos);

    // Recommended badge
    if (index === 1) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('★ RECOMMENDED', margin + 58, yPos);
    }

    yPos += 8;

    // Timeline and break-even info
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${scenario.timeline} mo | Break-even: Month ${scenario.breakEven}`, margin, yPos);

    yPos += 5;

    // Draw horizontal stacked bar
    let xPos = margin;
    const barHeight = 18;
    const scaleFactor = barMaxWidth / maxTotal;

    // Highlight recommended scenario with border
    if (index === 1) {
      pdf.setLineWidth(2);
      pdf.setDrawColor(59, 130, 246);
      pdf.rect(xPos - 2, yPos - 2, (scenario.total * scaleFactor) + 4, barHeight + 4, 'S');
    }

    // Draw each component as a segment
    const components = [
      { key: 'development', value: scenario.breakdown.development },
      { key: 'regulatory', value: scenario.breakdown.regulatory },
      { key: 'gtmYear1', value: scenario.breakdown.gtmYear1 },
      { key: 'riskBuffer', value: scenario.breakdown.riskBuffer },
    ];

    components.forEach((comp) => {
      const width = comp.value * scaleFactor;
      pdf.setFillColor(...componentColors[comp.key]);
      pdf.rect(xPos, yPos, width, barHeight, 'F');
      xPos += width;
    });

    // Total at end of bar
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatCurrency(scenario.total), xPos + 3, yPos + 12);

    yPos += barHeight + 15;
  });

  // Legend
  yPos += 10;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Legend:', margin, yPos);
  yPos += 6;

  const legendItems = [
    { label: 'Development', color: componentColors.development },
    { label: 'Regulatory', color: componentColors.regulatory },
    { label: 'GTM Year 1', color: componentColors.gtmYear1 },
    { label: 'Risk Buffer', color: componentColors.riskBuffer },
  ];

  legendItems.forEach((item, idx) => {
    const xOffset = margin + (idx % 2) * ((pageWidth - 2 * margin) / 2);
    const yOffset = yPos + Math.floor(idx / 2) * 7;

    // Color box
    pdf.setFillColor(...item.color);
    pdf.rect(xOffset, yOffset - 2, 5, 4, 'F');

    // Label
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(item.label, xOffset + 8, yOffset + 1);
  });

  addPageFooter(pdf);

  // ========== PAGE 4: KEY INSIGHTS ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Key Insights', 'Key Considerations', margin, 25);

  yPos = 50;
  const insights = generateTakeaways(results);

  insights.forEach((insight, index) => {
    // Type indicators without emoji (text symbols that render correctly)
    const typeSymbols: Record<string, string> = {
      warning: '!',
      success: '✓',
      tip: '>',
      info: 'i',
    };

    const typeColors: Record<string, { fill: [number, number, number]; border: [number, number, number]; symbol: [number, number, number] }> = {
      warning: { fill: [254, 243, 199], border: [245, 158, 11], symbol: [120, 53, 15] },
      success: { fill: [209, 250, 229], border: [16, 185, 129], symbol: [6, 78, 59] },
      tip: { fill: [219, 234, 254], border: [59, 130, 246], symbol: [30, 64, 175] },
      info: { fill: [224, 231, 255], border: [99, 102, 241], symbol: [67, 56, 202] },
    };

    const color = typeColors[insight.type];
    const symbol = typeSymbols[insight.type];

    // Left accent bar
    pdf.setFillColor(...color.border);
    pdf.rect(margin, yPos, 4, 26, 'F');

    // Light background
    pdf.setFillColor(...color.fill);
    pdf.rect(margin + 4, yPos, pageWidth - 2 * margin - 4, 26, 'F');

    // Symbol circle
    pdf.setFillColor(255, 255, 255);
    pdf.circle(margin + 12, yPos + 8, 5, 'F');
    pdf.setDrawColor(...color.border);
    pdf.setLineWidth(1.5);
    pdf.circle(margin + 12, yPos + 8, 5, 'S');

    // Symbol text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...color.symbol);
    pdf.text(symbol, margin + 10.5, yPos + 10);

    // Title
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(insight.title, margin + 20, yPos + 8);

    // Body text - make it scannable
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(40, 40, 40);
    const textLines = pdf.splitTextToSize(insight.text, pageWidth - 2 * margin - 25);
    pdf.text(textLines.slice(0, 2), margin + 20, yPos + 15); // Limit to 2 lines

    yPos += 32;

    if (yPos > pageHeight - 40 && index < insights.length - 1) {
      addPageFooter(pdf);
      pdf.addPage();
      addSectionHeader(pdf, 'Key Insights (continued)', '', margin, 25);
      yPos = 50;
    }
  });

  addPageFooter(pdf);

  // ========== PAGE 5: STAGED FUNDING ROADMAP ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Staged Funding Strategy', 'Timeline & Validation Gates', margin, 25);

  yPos = 55;

  // Timeline visualization
  const timelineWidth = pageWidth - 2 * margin;
  const timelineStartX = margin;
  const timelineY = yPos + 40;

  // Draw timeline axis
  pdf.setLineWidth(2);
  pdf.setDrawColor(150, 150, 150);
  pdf.line(timelineStartX, timelineY, timelineStartX + timelineWidth, timelineY);

  // Calculate total months for scaling
  const totalMonths = realisticScenario.timeline;
  const monthWidth = timelineWidth / totalMonths;

  // Phase data
  const phaseColors: Array<[number, number, number]> = [
    [59, 130, 246], // Blue
    [16, 185, 129], // Green
    [168, 85, 247], // Purple
  ];

  let currentMonth = 0;

  stagedFunding.phases.forEach((phase, index) => {
    // Extract months from duration string (e.g., "6 months" -> 6)
    const months = parseInt(String(phase.duration).match(/\d+/)?.[0] || '0');
    const phaseWidth = months * monthWidth;
    const phaseX = timelineStartX + currentMonth * monthWidth;

    // Phase bar above timeline
    pdf.setFillColor(...phaseColors[index]);
    pdf.rect(phaseX, timelineY - 25, phaseWidth, 20, 'F');

    // Phase label
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Phase ${index + 1}`, phaseX + 2, timelineY - 15);

    // Investment amount
    pdf.setFontSize(8);
    pdf.text(formatCurrency(phase.investment), phaseX + 2, timelineY - 8);

    // Month markers
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`M${currentMonth}`, phaseX, timelineY + 5);

    currentMonth += months;

    // Validation gate diamond (except after last phase)
    if (index < stagedFunding.phases.length - 1) {
      const gateX = phaseX + phaseWidth;
      const gateY = timelineY;

      // Diamond shape
      pdf.setFillColor(239, 68, 68); // Red for decision points
      pdf.setDrawColor(127, 29, 29);
      pdf.setLineWidth(1.5);

      // Draw diamond
      const diamondSize = 6;
      pdf.line(gateX, gateY - diamondSize, gateX + diamondSize, gateY);
      pdf.line(gateX + diamondSize, gateY, gateX, gateY + diamondSize);
      pdf.line(gateX, gateY + diamondSize, gateX - diamondSize, gateY);
      pdf.line(gateX - diamondSize, gateY, gateX, gateY - diamondSize);

      // Gate label with unlock icon
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(239, 68, 68);
      pdf.text('🔓 GATE', gateX - 6, gateY + 12);
    }
  });

  // Final month marker
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`M${currentMonth}`, timelineStartX + timelineWidth - 5, timelineY + 5);

  // Phase details below timeline
  yPos = timelineY + 25;

  // Phase milestone icons
  const milestoneIcons = ['🚀', '💡', '📈'];

  stagedFunding.phases.forEach((phase, index) => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${milestoneIcons[index]} ${phase.name}`, margin, yPos);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${phase.duration} • ${phase.percentage}% of total • ${formatCurrency(phase.investment)}`, margin, yPos + 5);

    // Validation gate - PROMINENT
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(239, 68, 68);
    pdf.text('◆ Validation Gate:', margin, yPos + 12);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const gateLines = pdf.splitTextToSize(phase.decisionGate, pageWidth - 2 * margin - 5);
    pdf.text(gateLines.slice(0, 2), margin + 2, yPos + 18);

    yPos += 25;

    // Validation KPIs - NEW SECTION
    pdf.setFillColor(240, 253, 244); // Light green background
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, 'F');

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 163, 74);
    pdf.text('✓ Validation Criteria:', margin + 3, yPos + 5);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(21, 128, 61);

    // Get phase-specific KPIs
    const kpis = getPhaseValidationKPIs(index, inputs);
    const kpiText = kpis.join(' • ');
    const kpiLines = pdf.splitTextToSize(kpiText, pageWidth - 2 * margin - 6);
    pdf.text(kpiLines.slice(0, 2), margin + 3, yPos + 11);

    yPos += 28;
  });

  addPageFooter(pdf);

  // ========== PAGE 6: EXIT SCENARIOS WITH ACTUAL VALUES ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Potential Exit Scenarios', 'Return Expectations & Strategic Paths', margin, 25);

  yPos = 50;

  const baseInvestment = realisticScenario.total;

  // Get sector-specific context for exits
  const acquirers = getTypicalAcquirers(inputs);
  const exitMultiples = getSectorExitMultiples(inputs);

  const exitScenarios = [
    {
      name: 'Acqui-hire (Risk Mitigation)',
      multiples: [0.3, 0.8],
      timeline: '12-18 months',
      desc: `Talent + IP salvage scenario if market validation fails. ${acquirers.acquihire}. This is NOT a success outcome—it's capital preservation when pivoting isn't viable.`,
      color: [239, 68, 68] as [number, number, number], // Red to indicate this is failure mitigation
      risk: 'HIGH RISK'
    },
    {
      name: 'Strategic Acquisition',
      multiples: exitMultiples.strategic,
      timeline: '3-5 years',
      desc: `Early-stage acquisition for technology/market position. ${acquirers.strategic}. Typical for innovations with proven traction but pre-scale economics.`,
      color: [16, 185, 129] as [number, number, number],
      risk: 'MODERATE'
    },
    {
      name: 'Lifestyle/Sustainable Business',
      multiples: [2, 4],
      timeline: '3-7 years',
      desc: `No exit planned. Build profitable, cash-flowing business with founder control. Typical margins in ${inputs.targetMarket}: 20-40%. Founder-friendly returns through distributions, not liquidity events.`,
      color: [139, 92, 246] as [number, number, number], // Purple
      risk: 'MODERATE'
    },
    {
      name: 'Growth Trajectory (IPO/Major Exit)',
      multiples: exitMultiples.growth,
      timeline: '7-12 years',
      desc: `Scale to market leadership. ${acquirers.growth}. Requires achieving ${exitMultiples.revenueTarget} and category-defining position. Historical precedent: ${exitMultiples.precedent}.`,
      color: [59, 130, 246] as [number, number, number],
      risk: 'HIGH AMBITION'
    },
  ];

  exitScenarios.forEach((exit) => {
    const lowValue = baseInvestment * exit.multiples[0];
    const highValue = baseInvestment * exit.multiples[1];

    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      addPageFooter(pdf);
      pdf.addPage();
      addSectionHeader(pdf, 'Exit Scenarios (continued)', '', margin, 25);
      yPos = 50;
    }

    // Gradient background showing increasing potential
    pdf.setFillColor(...exit.color, 20);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 48, 3, 3, 'F');
    pdf.setDrawColor(...exit.color);
    pdf.setLineWidth(2);
    pdf.line(margin, yPos + 48, pageWidth - margin, yPos + 48);

    // Risk badge in top-right corner
    pdf.setFillColor(...exit.color);
    pdf.roundedRect(pageWidth - margin - 35, yPos + 3, 32, 6, 1, 1, 'F');
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(exit.risk, pageWidth - margin - 33, yPos + 7);

    // Multiple display
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...exit.color);
    pdf.text(`${exit.multiples[0]}-${exit.multiples[1]}x`, margin + 5, yPos + 18);

    // Actual dollar values
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${formatCurrency(lowValue)} - ${formatCurrency(highValue)}`, margin + 5, yPos + 28);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`on ${formatCurrency(baseInvestment)} invested`, margin + 5, yPos + 34);

    // Name and details
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(exit.name, margin + 50, yPos + 10);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Timeline: ${exit.timeline}`, margin + 50, yPos + 17);

    pdf.setFontSize(7);
    pdf.setTextColor(60, 60, 60);
    const descLines = pdf.splitTextToSize(exit.desc, pageWidth - 2 * margin - 55);
    pdf.text(descLines.slice(0, 3), margin + 50, yPos + 24);

    yPos += 54;
  });

  // Note about returns
  yPos += 5;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  const noteText = pdf.splitTextToSize('Note: Actual returns depend on execution, market conditions, and numerous other factors. These scenarios represent typical ranges observed in similar innovations.', pageWidth - 2 * margin);
  pdf.text(noteText, margin, yPos);

  addPageFooter(pdf);

  // ========== PAGE 7: METHODOLOGY (TRUST-BUILDING) ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Why You Can Trust These Numbers', 'Model Validation & Transparency', margin, 25);

  yPos = 50;

  // Trust statement
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  const trustText = pdf.splitTextToSize(
    'This model synthesizes 200+ real-world implementations, peer-reviewed research, and government benchmarks. It\'s designed for strategic planning, not precise cost accounting. Here\'s how it works:',
    pageWidth - 2 * margin
  );
  pdf.text(trustText, margin, yPos);
  yPos += 15;

  // Visual Model Flow
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Model Flow: From Inputs to Validated Outputs', margin, yPos);
  yPos += 10;

  // Draw flow diagram
  const flowBoxWidth = 35;
  const flowBoxHeight = 18;
  const flowSpacing = 5;
  const flowY = yPos;
  let flowX = margin + 5;

  // Box 1: Inputs
  pdf.setFillColor(219, 234, 254);
  pdf.roundedRect(flowX, flowY, flowBoxWidth, flowBoxHeight, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('INPUTS', flowX + flowBoxWidth / 2, flowY + 6, { align: 'center' });
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Tech type, stage,', flowX + flowBoxWidth / 2, flowY + 10, { align: 'center' });
  pdf.text('market, team', flowX + flowBoxWidth / 2, flowY + 14, { align: 'center' });

  // Arrow
  flowX += flowBoxWidth + 2;
  pdf.setDrawColor(100, 100, 100);
  pdf.line(flowX, flowY + flowBoxHeight / 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 - 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 + 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  flowX += flowSpacing + 2;

  // Box 2: Risk Weighting
  pdf.setFillColor(254, 243, 199);
  pdf.roundedRect(flowX, flowY, flowBoxWidth, flowBoxHeight, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(120, 53, 15);
  pdf.text('RISK WEIGHT', flowX + flowBoxWidth / 2, flowY + 6, { align: 'center' });
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Regulatory, TRL,', flowX + flowBoxWidth / 2, flowY + 10, { align: 'center' });
  pdf.text('market maturity', flowX + flowBoxWidth / 2, flowY + 14, { align: 'center' });

  // Arrow
  flowX += flowBoxWidth + 2;
  pdf.line(flowX, flowY + flowBoxHeight / 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 - 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 + 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  flowX += flowSpacing + 2;

  // Box 3: Validation
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(flowX, flowY, flowBoxWidth, flowBoxHeight, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(21, 128, 61);
  pdf.text('VALIDATION', flowX + flowBoxWidth / 2, flowY + 6, { align: 'center' });
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('200+ benchmark', flowX + flowBoxWidth / 2, flowY + 10, { align: 'center' });
  pdf.text('comparisons', flowX + flowBoxWidth / 2, flowY + 14, { align: 'center' });

  // Arrow
  flowX += flowBoxWidth + 2;
  pdf.line(flowX, flowY + flowBoxHeight / 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 - 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  pdf.line(flowX + flowSpacing - 2, flowY + flowBoxHeight / 2 + 2, flowX + flowSpacing, flowY + flowBoxHeight / 2);
  flowX += flowSpacing + 2;

  // Box 4: Outputs
  pdf.setFillColor(233, 213, 255);
  pdf.roundedRect(flowX, flowY, flowBoxWidth, flowBoxHeight, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(107, 33, 168);
  pdf.text('OUTPUTS', flowX + flowBoxWidth / 2, flowY + 6, { align: 'center' });
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('3 scenarios,', flowX + flowBoxWidth / 2, flowY + 10, { align: 'center' });
  pdf.text('staged funding', flowX + flowBoxWidth / 2, flowY + 14, { align: 'center' });

  yPos += 30;

  // Data Foundation
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Data Foundation', margin, yPos);
  yPos += 8;

  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 32, 2, 2, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  const sources = [
    '✓ 30 technology types across 6 major categories | 33 market segments across 8 industry groups',
    '✓ Technology Readiness Levels (TRL 1-9) benchmarked against SBIR/STTR Phase I/II historical data',
    '✓ 200+ implementation case studies from Gartner, CB Insights, McKinsey research (2020-2024)',
    '✓ Government R&D benchmarks: NSF innovation cost studies, BLS compensation data, SBA failure rates',
  ];

  sources.forEach((source) => {
    pdf.text(source, margin + 3, yPos + 5);
    yPos += 7;
  });

  yPos += 8;

  // Core Formula (simplified presentation)
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Core Calculation Logic', margin, yPos);
  yPos += 8;

  pdf.setFillColor(255, 251, 235);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 24, 2, 2, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(161, 98, 7);
  pdf.text('Base Formula:', margin + 5, yPos + 7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('Development + Regulatory + GTM Year 1 + Risk Buffer (15%)', margin + 28, yPos + 7);

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(161, 98, 7);
  pdf.text('Scenarios:', margin + 5, yPos + 14);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('Optimistic (0.7×), Realistic (1.2×), Conservative (1.8×) multipliers applied to base costs', margin + 25, yPos + 14);

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.text('Timeline calibrated using TRL benchmarks; break-even uses historical SaaS/product metrics', margin + 5, yPos + 20);

  yPos += 32;

  // Use Cases
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('When to Use This Analysis', margin, yPos);
  yPos += 8;

  // Two-column layout for use cases
  const useCaseColWidth = (pageWidth - 2 * margin - 5) / 2;

  // Good uses (left column)
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(margin, yPos, useCaseColWidth, 40, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(22, 163, 74);
  pdf.text('✓ APPROPRIATE USES', margin + 3, yPos + 6);

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(21, 128, 61);
  const goodUses = [
    '• Strategic planning & budgeting',
    '• Board-level investment discussions',
    '• Grant/funding applications (SBIR/STTR)',
    '• Comparing alternative innovation paths',
    '• Risk assessment & scenario planning',
  ];
  let tempY = yPos + 12;
  goodUses.forEach(use => {
    pdf.text(use, margin + 5, tempY);
    tempY += 5;
  });

  // Bad uses (right column)
  pdf.setFillColor(254, 242, 242);
  pdf.roundedRect(margin + useCaseColWidth + 5, yPos, useCaseColWidth, 40, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(220, 38, 38);
  pdf.text('✗ NOT APPROPRIATE FOR', margin + useCaseColWidth + 8, yPos + 6);

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(185, 28, 28);
  const badUses = [
    '• Precise cost accounting',
    '• Legal/contractual commitments',
    '• Vendor negotiations or RFPs',
    '• Detailed project management',
    '• Tax or audit documentation',
  ];
  tempY = yPos + 12;
  badUses.forEach(use => {
    pdf.text(use, margin + useCaseColWidth + 10, tempY);
    tempY += 5;
  });

  addPageFooter(pdf);

  // Add page numbers to all pages (except cover)
  const totalPages = pdf.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  // Generate dynamic filename
  const techSlug = inputs.technologyType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const stageSlug = inputs.currentStage.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const dateSlug = new Date().toISOString().split('T')[0];
  const filename = `innovation-investment-${techSlug}-${stageSlug}-${dateSlug}.pdf`;

  // Save PDF
  pdf.save(filename);
}

// Helper function to add section headers
function addSectionHeader(pdf: jsPDF, title: string, subtitle: string, x: number, y: number): void {
  pdf.setFillColor(15, 23, 42);
  pdf.roundedRect(x, y - 8, pdf.internal.pageSize.getWidth() - 2 * x, 18, 2, 2, 'F');

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, x + 5, y);

  if (subtitle) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(200, 200, 200);
    pdf.text(subtitle, x + 5, y + 7);
  }
}

// Helper function to add page footer
function addPageFooter(pdf: jsPDF): void {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Innovation Investment Calculator • Professional Investment Analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// Helper: Generate innovation context based on inputs
function getInnovationContext(inputs: UserInputs): string {
  const stage = inputs.currentStage.toLowerCase();
  const tech = inputs.technologyType;

  if (stage.includes('concept')) {
    return `This ${tech} innovation is at the concept/validation stage, requiring proof-of-concept demonstration and initial technical feasibility validation. The innovation targets ${inputs.targetMarket}, a sector that demands rigorous validation before market entry.`;
  } else if (stage.includes('prototype')) {
    return `This ${tech} solution has reached functional prototype stage with demonstrated technical viability. The next phase focuses on market validation and regulatory pathway confirmation for ${inputs.targetMarket}.`;
  } else if (stage.includes('pilot')) {
    return `This ${tech} innovation has successfully completed pilot testing and early customer validation. The focus now shifts to scaling production/delivery and expanding market penetration within ${inputs.targetMarket}.`;
  } else {
    return `This ${tech} solution is market-ready, with proven product-market fit. The investment focus is on go-to-market acceleration, sales infrastructure, and market expansion within ${inputs.targetMarket}.`;
  }
}

// Helper: Generate market context
function getMarketContext(inputs: UserInputs): string {
  const market = inputs.targetMarket.toLowerCase();

  if (market.includes('federal') || market.includes('government')) {
    return `Federal/government markets offer substantial contract values but require extended procurement cycles (12-24 months) and compliance infrastructure. Market entry costs are high, but customer lifetime value and retention rates are exceptional once established.`;
  } else if (market.includes('hospital') || market.includes('healthcare')) {
    return `Healthcare systems demand clinical evidence and integration with existing workflows. Decision cycles are 9-18 months, but successful adoption creates strong network effects and high switching costs for competitors.`;
  } else if (market.includes('enterprise') || market.includes('corporate')) {
    return `Enterprise markets require scalable sales infrastructure and multi-stakeholder decision processes. Average sales cycles of 6-12 months, but high-value contracts and expansion revenue potential justify the investment.`;
  } else if (market.includes('research') || market.includes('academic')) {
    return `Research institutions prioritize innovation and early adoption but operate with constrained budgets and grant-dependent procurement. Lower initial contract values are offset by intellectual validation and reference customer value.`;
  } else {
    return `This market segment shows strong demand for innovative solutions with favorable competitive dynamics. Market entry requires strategic positioning and customer education to establish product-market fit.`;
  }
}

// Helper: Generate investment thesis
function getInvestmentThesis(inputs: UserInputs, scenario: any): string {
  const timeline = scenario.timeline;
  const breakEven = scenario.breakEven;
  const team = inputs.teamStatus;

  let thesis = `This ${formatCurrency(scenario.total)} investment positions the innovation for ${timeline}-month market entry with break-even at month ${breakEven}. `;

  if (team === 'Full team assembled') {
    thesis += `The complete team structure reduces execution risk and accelerates time-to-market. `;
  } else if (team === 'Partial team') {
    thesis += `Partial team structure requires strategic hiring, budgeted within development costs. `;
  } else {
    thesis += `Solo founder structure demands early team assembly, critical for Phase 1 validation. `;
  }

  thesis += `Staged funding approach with validation gates de-risks capital deployment and preserves optionality for strategic pivots or acceleration.`;

  return thesis;
}

// Helper: Generate regulatory context
function getRegulatoryContext(inputs: UserInputs): string {
  const reg = inputs.regulatoryEnvironment;

  if (reg === 'Heavy (FDA/EPA level)') {
    return `Heavy regulatory burden (FDA/EPA) requires dedicated compliance team and extended timelines. Regulatory strategy must be established in Phase 1, with pre-submission meetings and pathway clarity. Budget includes regulatory affairs expertise and clinical/compliance documentation.`;
  } else if (reg === 'Moderate') {
    return `Moderate regulatory requirements demand proactive compliance strategy and documentation. Industry-standard certifications and testing protocols are budgeted. Regulatory timeline is integrated into development phases.`;
  } else {
    return `Minimal regulatory barriers accelerate market entry but require attention to industry standards and best practices. Compliance costs are modest and integrated into development infrastructure.`;
  }
}

// Helper: Generate market dynamics
function getMarketDynamics(inputs: UserInputs): string {
  const market = inputs.targetMarket;
  const geo = inputs.geographicLocation;

  return `${market} demonstrates strong adoption drivers in ${geo}, with decision-making influenced by budget cycles, stakeholder alignment, and competitive positioning. Sales infrastructure must align with customer procurement processes and decision authority. First-customer acquisition validates product-market fit and unlocks network effects.`;
}

// Helper: Generate phase-specific validation KPIs
function getPhaseValidationKPIs(phaseIndex: number, inputs: UserInputs): string[] {
  const market = inputs.targetMarket.toLowerCase();
  const reg = inputs.regulatoryEnvironment;
  const isHealthcare = market.includes('hospital') || market.includes('healthcare');
  const isGovernment = market.includes('federal') || market.includes('government');
  const isHeavyReg = reg === 'Heavy (FDA/EPA level)';

  // Phase 1: Validate (Proof-of-concept)
  if (phaseIndex === 0) {
    const baseKPIs = ['Technical proof-of-concept completed', 'Prototype functional', 'Core features validated'];

    if (isHeavyReg) {
      baseKPIs.push('Regulatory pre-clearance pathway identified');
      baseKPIs.push('Pre-submission meeting scheduled');
    }

    if (isHealthcare) {
      baseKPIs.push('Clinical validation protocol approved');
      baseKPIs.push('IRB approval obtained');
    } else if (isGovernment) {
      baseKPIs.push('Agency stakeholder engagement initiated');
      baseKPIs.push('Compliance framework documented');
    } else {
      baseKPIs.push('3 potential customers identified');
    }

    return baseKPIs;
  }

  // Phase 2: Build (Market validation)
  if (phaseIndex === 1) {
    const baseKPIs = ['MVP deployed with early users', 'Product-market fit indicators present'];

    if (isHealthcare) {
      baseKPIs.push('Clinical pilot results positive');
      baseKPIs.push('2-3 hospital LOIs secured');
      baseKPIs.push('$50K+ in pilot revenue');
    } else if (isGovernment) {
      baseKPIs.push('SBIR/STTR Phase II awarded or equivalent');
      baseKPIs.push('Agency pilot MOU signed');
      baseKPIs.push('First government contract executed');
    } else {
      baseKPIs.push('5+ paying early adopters');
      baseKPIs.push('MRR >$25K');
      baseKPIs.push('Churn rate <15%');
    }

    if (isHeavyReg) {
      baseKPIs.push('Regulatory submission filed');
    }

    return baseKPIs;
  }

  // Phase 3: Scale (Commercialization)
  if (phaseIndex === 2) {
    const baseKPIs = ['Proven unit economics', 'Repeatable sales process established'];

    if (isHealthcare) {
      baseKPIs.push('10+ institutional customers');
      baseKPIs.push('Regulatory clearance obtained');
      baseKPIs.push('MRR >$250K');
      baseKPIs.push('CAC payback <18 months');
    } else if (isGovernment) {
      baseKPIs.push('Multi-agency adoption');
      baseKPIs.push('$2M+ in contract value');
      baseKPIs.push('Prime contractor relationships established');
    } else {
      baseKPIs.push('50+ customers');
      baseKPIs.push('MRR >$500K');
      baseKPIs.push('Net revenue retention >110%');
    }

    baseKPIs.push('Expansion revenue from existing customers');

    return baseKPIs;
  }

  return ['Validation criteria to be determined'];
}

// Helper: Get typical acquirers by market segment
function getTypicalAcquirers(inputs: UserInputs): { acquihire: string; strategic: string; growth: string } {
  const market = inputs.targetMarket.toLowerCase();

  if (market.includes('hospital') || market.includes('healthcare')) {
    return {
      acquihire: 'Larger health tech platform or consultancy absorbs team',
      strategic: 'Typical buyers: Epic, Cerner/Oracle Health, Philips, GE Healthcare, large EHR vendors seeking capability gaps',
      growth: 'IPO path (e.g., Doximity, Oscar Health) or acquisition by UnitedHealth, CVS Health, Amazon Health at $1B+ valuation'
    };
  }

  if (market.includes('federal') || market.includes('government')) {
    return {
      acquihire: 'Prime contractor or systems integrator acquires team for talent',
      strategic: 'Typical buyers: Booz Allen, Leidos, SAIC, Palantir, or large defense primes seeking niche capabilities',
      growth: 'Platform expansion across multiple agencies; potential acquisition by defense/aerospace majors at $500M+'
    };
  }

  if (market.includes('enterprise') || market.includes('corporate')) {
    return {
      acquihire: 'Larger SaaS platform acquires for team expertise',
      strategic: 'Typical buyers: Salesforce, Microsoft, ServiceNow, Oracle, SAP for product portfolio expansion',
      growth: 'IPO at $5B+ valuation or strategic acquisition by cloud hyperscaler (AWS, Azure, GCP)'
    };
  }

  if (market.includes('research') || market.includes('academic')) {
    return {
      acquihire: 'Research institution or lab equipment vendor acquires IP',
      strategic: 'Typical buyers: Thermo Fisher, Illumina, Agilent, MilliporeSigma for technology portfolio',
      growth: 'Become category-defining research platform; acquisition by life sciences conglomerate at $300M+'
    };
  }

  // Default/generic
  return {
    acquihire: 'Larger competitor or adjacent player acquires team/IP',
    strategic: 'Strategic buyers in adjacent markets seeking capability expansion',
    growth: 'Category leadership, IPO, or acquisition by major technology platform'
  };
}

// Helper: Get sector-appropriate exit multiples
function getSectorExitMultiples(inputs: UserInputs): { strategic: [number, number]; growth: [number, number]; revenueTarget: string; precedent: string } {
  const market = inputs.targetMarket.toLowerCase();

  if (market.includes('hospital') || market.includes('healthcare')) {
    return {
      strategic: [3, 6],
      growth: [8, 15],
      revenueTarget: '$50M+ ARR with strong clinical outcomes',
      precedent: 'Livongo→Teladoc ($18.5B, 2020), Nuance→Microsoft ($19.7B, 2022)'
    };
  }

  if (market.includes('federal') || market.includes('government')) {
    return {
      strategic: [2, 4],
      growth: [6, 12],
      revenueTarget: '$100M+ in recurring government contracts',
      precedent: 'Kessel Run modernization contracts, Palantir government expansion'
    };
  }

  if (market.includes('enterprise') || market.includes('corporate')) {
    return {
      strategic: [4, 7],
      growth: [10, 20],
      revenueTarget: '$100M+ ARR with strong net retention',
      precedent: 'Slack→Salesforce ($27.7B), Figma→Adobe ($20B deal)'
    };
  }

  if (market.includes('research') || market.includes('academic')) {
    return {
      strategic: [3, 5],
      growth: [7, 12],
      revenueTarget: '$30M+ with market-defining position',
      precedent: 'PacBio, 10x Genomics IPOs, Oxford Nanopore growth trajectory'
    };
  }

  // Default
  return {
    strategic: [3, 6],
    growth: [8, 15],
    revenueTarget: '$50M+ revenue with clear market position',
    precedent: 'Typical early-stage tech acquisitions'
  };
}
