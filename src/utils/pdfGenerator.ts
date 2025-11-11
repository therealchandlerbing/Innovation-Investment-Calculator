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
  pdf.setFillColor(15, 23, 42); // --primary color
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative accent circle
  pdf.setFillColor(59, 130, 246, 15); // --accent with low opacity
  pdf.circle(pageWidth - 30, 30, 50, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Innovation Investment', pageWidth / 2, 100, { align: 'center' });
  pdf.text('Analysis Report', pageWidth / 2, 115, { align: 'center' });

  // Subtitle
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inputs.technologyType, pageWidth / 2, 140, { align: 'center' });
  pdf.text(`${inputs.currentStage} • ${inputs.targetMarket}`, pageWidth / 2, 150, { align: 'center' });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text('Prepared by Innovation Investment Calculator', pageWidth / 2, 270, { align: 'center' });
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(dateStr, pageWidth / 2, 277, { align: 'center' });

  // ========== PAGE 2: EXECUTIVE SUMMARY ==========
  pdf.addPage();
  pdf.setTextColor(0, 0, 0);

  // Header
  addSectionHeader(pdf, 'Executive Summary', 'Investment Overview', margin, 25);

  let yPos = 50;

  // Hero investment box
  pdf.setFillColor(245, 158, 11, 20); // Warning color with opacity
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(2);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'S');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(120, 53, 15);
  pdf.text('RECOMMENDED TOTAL INVESTMENT', margin + 5, yPos + 8);

  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(formatCurrency(realisticScenario.total), margin + 5, yPos + 20);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Confidence Range: ${formatCurrency(results.confidenceInterval.min)} - ${formatCurrency(results.confidenceInterval.max)} (±15%)`,
    margin + 5, yPos + 28);

  yPos += 45;

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

  // ========== PAGE 3: INVESTMENT SCENARIOS ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Investment Scenarios', 'Three Planning Horizons', margin, 25);

  yPos = 50;

  results.scenarios.forEach((scenario, index) => {
    const colors: Array<{ fill: [number, number, number]; border: [number, number, number]; text: [number, number, number] }> = [
      { fill: [209, 250, 229], border: [16, 185, 129], text: [6, 78, 59] }, // Green - Optimistic
      { fill: [254, 243, 199], border: [245, 158, 11], text: [120, 53, 15] }, // Yellow - Realistic
      { fill: [254, 226, 226], border: [239, 68, 68], text: [127, 29, 29] }, // Red - Conservative
    ];

    const color = colors[index];

    // Scenario box
    pdf.setFillColor(...color.fill);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 55, 3, 3, 'F');
    pdf.setDrawColor(...color.border);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 55, 3, 3, 'S');

    // Scenario name
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...color.text);
    pdf.text(scenario.name, margin + 5, yPos + 8);

    if (index === 1) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('★ RECOMMENDED', pageWidth - margin - 35, yPos + 8);
    }

    // Total
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatCurrency(scenario.total), margin + 5, yPos + 20);

    // Breakdown
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const breakdown = [
      `Development: ${formatCurrency(scenario.breakdown.development)}`,
      `Regulatory: ${formatCurrency(scenario.breakdown.regulatory)}`,
      `GTM Year 1: ${formatCurrency(scenario.breakdown.gtmYear1)}`,
      `Risk Buffer: ${formatCurrency(scenario.breakdown.riskBuffer)}`,
    ];

    let bx = margin + 5;
    let by = yPos + 30;
    breakdown.forEach((line, i) => {
      if (i === 2) {
        bx = margin + 5 + (pageWidth - 2 * margin) / 2;
        by = yPos + 30;
      }
      pdf.text(line, bx, by);
      by += 5;
    });

    // Timeline & Break-even
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text(`${scenario.timeline} months timeline`, margin + 5, yPos + 50);
    pdf.text(`Month ${scenario.breakEven} break-even`, margin + 5 + (pageWidth - 2 * margin) / 2, yPos + 50);

    yPos += 62;
  });

  addPageFooter(pdf);

  // ========== PAGE 4: KEY INSIGHTS ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Key Insights', 'Personalized Considerations', margin, 25);

  yPos = 50;
  const insights = generateTakeaways(results);

  insights.forEach((insight, index) => {
    const typeColors: Record<string, { fill: [number, number, number]; border: [number, number, number] }> = {
      warning: { fill: [254, 243, 199], border: [245, 158, 11] },
      success: { fill: [209, 250, 229], border: [16, 185, 129] },
      tip: { fill: [219, 234, 254], border: [59, 130, 246] },
      info: { fill: [224, 231, 255], border: [99, 102, 241] },
    };

    const color = typeColors[insight.type];

    pdf.setFillColor(...color.fill);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 2, 2, 'F');
    pdf.setDrawColor(...color.border);
    pdf.setLineWidth(2);
    pdf.line(margin, yPos, margin, yPos + 30);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${insight.icon} ${insight.title}`, margin + 5, yPos + 8);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    const textLines = pdf.splitTextToSize(insight.text, pageWidth - 2 * margin - 10);
    pdf.text(textLines, margin + 5, yPos + 15);

    yPos += 35;

    if (yPos > pageHeight - 40 && index < insights.length - 1) {
      addPageFooter(pdf);
      pdf.addPage();
      addSectionHeader(pdf, 'Key Insights (continued)', '', margin, 25);
      yPos = 50;
    }
  });

  addPageFooter(pdf);

  // ========== PAGE 5: STAGED FUNDING ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Staged Funding Strategy', 'Three-Phase Approach', margin, 25);

  yPos = 50;

  stagedFunding.phases.forEach((phase, index) => {
    const phaseColors: Array<{ fill: [number, number, number]; border: [number, number, number] }> = [
      { fill: [219, 234, 254], border: [59, 130, 246] },
      { fill: [209, 250, 229], border: [16, 185, 129] },
      { fill: [233, 213, 255], border: [168, 85, 247] },
    ];

    const color = phaseColors[index];

    pdf.setFillColor(...color.fill);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, 'F');
    pdf.setDrawColor(...color.border);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 45, 3, 3, 'S');

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(phase.name, margin + 5, yPos + 8);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(String(phase.duration), margin + 5, yPos + 15);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatCurrency(phase.investment), pageWidth - margin - 35, yPos + 10);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${phase.percentage}% of total`, pageWidth - margin - 35, yPos + 17);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text('Validation Gate:', margin + 5, yPos + 25);
    pdf.setFont('helvetica', 'normal');
    const gateLines = pdf.splitTextToSize(phase.decisionGate, pageWidth - 2 * margin - 10);
    pdf.text(gateLines.slice(0, 2), margin + 5, yPos + 32);

    yPos += 50;
  });

  addPageFooter(pdf);

  // ========== PAGE 6: EXIT SCENARIOS ==========
  pdf.addPage();
  addSectionHeader(pdf, 'Potential Exit Scenarios', 'Return Expectations', margin, 25);

  yPos = 50;

  const exitScenarios = [
    { name: 'Acqui-hire', multiple: '0.5-2x', timeline: '12-18 months', desc: 'Team and technology acquisition by larger player' },
    { name: 'Strategic Acquisition', multiple: '3-5x', timeline: '3-5 years', desc: 'Acquisition by strategic partner for market position' },
    { name: 'Growth Trajectory', multiple: '10x+', timeline: '5-10 years', desc: 'Continue growth to IPO or major acquisition' },
  ];

  exitScenarios.forEach((exit) => {
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'S');

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(exit.multiple, margin + 5, yPos + 15);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(exit.name, margin + 40, yPos + 10);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Typical Timeline: ' + exit.timeline, margin + 40, yPos + 17);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    const descLines = pdf.splitTextToSize(exit.desc, pageWidth - 2 * margin - 45);
    pdf.text(descLines, margin + 40, yPos + 24);

    yPos += 40;
  });

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
