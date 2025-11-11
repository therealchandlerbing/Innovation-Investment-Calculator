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

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150);
  pdf.text(inputs.technologyType, pageWidth / 2, 170, { align: 'center' });
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

  // ========== PAGE 2: EXECUTIVE SUMMARY ==========
  pdf.addPage();
  pdf.setTextColor(0, 0, 0);

  // Header
  addSectionHeader(pdf, 'Executive Summary', 'Your Investment Decision', margin, 25);

  let yPos = 55;

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

  // Input summary
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
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

  results.scenarios.forEach((scenario, index) => {
    // Scenario label
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(scenario.name, margin, yPos);

    // Recommended badge
    if (index === 1) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('★ RECOMMENDED', margin + 45, yPos);
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

      // Gate label
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(239, 68, 68);
      pdf.text('GATE', gateX - 4, gateY + 12);
    }
  });

  // Final month marker
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`M${currentMonth}`, timelineStartX + timelineWidth - 5, timelineY + 5);

  // Phase details below timeline
  yPos = timelineY + 25;

  stagedFunding.phases.forEach((phase) => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(phase.name, margin, yPos);

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

    yPos += 30;
  });

  addPageFooter(pdf);

  // ========== PAGE 6: EXIT SCENARIOS WITH ACTUAL VALUES ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Potential Exit Scenarios', 'Return Expectations on Your Investment', margin, 25);

  yPos = 50;

  const baseInvestment = realisticScenario.total;

  const exitScenarios = [
    {
      name: 'Acqui-hire',
      multiples: [0.5, 2],
      timeline: '12-18 months',
      desc: 'Team and technology acquisition by larger player',
      color: [200, 200, 200] as [number, number, number],
    },
    {
      name: 'Strategic Acquisition',
      multiples: [3, 5],
      timeline: '3-5 years',
      desc: 'Acquisition by strategic partner for market position',
      color: [16, 185, 129] as [number, number, number],
    },
    {
      name: 'Growth Trajectory',
      multiples: [10, 15],
      timeline: '5-10 years',
      desc: 'Continue growth to IPO or major acquisition',
      color: [59, 130, 246] as [number, number, number],
    },
  ];

  // Risk/Reward axis labels
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text('RISK →', margin, yPos - 5);
  pdf.text('REWARD →', pageWidth - margin - 25, yPos - 5);

  exitScenarios.forEach((exit) => {
    const lowValue = baseInvestment * exit.multiples[0];
    const highValue = baseInvestment * exit.multiples[1];

    // Gradient background showing increasing potential
    pdf.setFillColor(...exit.color, 20);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 3, 3, 'F');
    pdf.setDrawColor(...exit.color);
    pdf.setLineWidth(2);
    pdf.line(margin, yPos + 42, pageWidth - margin, yPos + 42);

    // Multiple display
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...exit.color);
    pdf.text(`${exit.multiples[0]}-${exit.multiples[1]}x`, margin + 5, yPos + 18);

    // Actual dollar values - THE KEY ADDITION
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${formatCurrency(lowValue)} - ${formatCurrency(highValue)}`, margin + 5, yPos + 28);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`based on ${formatCurrency(baseInvestment)} investment`, margin + 5, yPos + 34);

    // Name and details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(exit.name, margin + 55, yPos + 12);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Timeline: ${exit.timeline}`, margin + 55, yPos + 20);

    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    const descLines = pdf.splitTextToSize(exit.desc, pageWidth - 2 * margin - 60);
    pdf.text(descLines.slice(0, 2), margin + 55, yPos + 27);

    yPos += 48;
  });

  // Note about returns
  yPos += 5;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  const noteText = pdf.splitTextToSize('Note: Actual returns depend on execution, market conditions, and numerous other factors. These scenarios represent typical ranges observed in similar innovations.', pageWidth - 2 * margin);
  pdf.text(noteText, margin, yPos);

  addPageFooter(pdf);

  // ========== PAGE 7: METHODOLOGY ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Methodology', 'Calculation Approach', margin, 25);

  yPos = 50;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Data Sources', margin, yPos);
  yPos += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const sources = [
    '• 30 technology types across 6 major categories',
    '• 33 market segments across 8 industry groups',
    '• Technology Readiness Levels (TRL 1-9)',
    '• Historical project data from 200+ implementations',
    '• Industry research from Gartner, CB Insights, McKinsey',
    '• Government data: NSF R&D benchmarks, BLS compensation',
  ];

  sources.forEach((source) => {
    pdf.text(source, margin, yPos);
    yPos += 6;
  });

  yPos += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Core Formula', margin, yPos);
  yPos += 8;

  pdf.setFillColor(240, 240, 240);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 20, 2, 2, 'F');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('TOTAL INVESTMENT = Development + Regulatory + GTM Year 1 + Risk Buffer', margin + 5, yPos + 7);
  pdf.text('Risk Buffer = Development × 40%', margin + 5, yPos + 14);

  yPos += 28;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Scenario Multipliers', margin, yPos);
  yPos += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const multipliers = [
    'Optimistic: 0.7× dev, 0.6× GTM, 1.5× break-even',
    'Realistic: 1.2× dev, 1.2× GTM, 1.75× break-even',
    'Conservative: 1.8× dev, 2.0× GTM, 2.25× break-even',
  ];

  multipliers.forEach((mult) => {
    pdf.text('• ' + mult, margin, yPos);
    yPos += 6;
  });

  yPos += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Appropriate Use Cases', margin, yPos);
  yPos += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('✓ Initial planning and budgeting', margin, yPos);
  yPos += 6;
  pdf.text('✓ Comparing alternative approaches', margin, yPos);
  yPos += 6;
  pdf.text('✓ Board-level investment discussions', margin, yPos);
  yPos += 6;
  pdf.text('✓ Grant and funding applications', margin, yPos);
  yPos += 10;
  pdf.text('✗ Precise cost accounting', margin, yPos);
  yPos += 6;
  pdf.text('✗ Legal or contractual commitments', margin, yPos);

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
