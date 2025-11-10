import jsPDF from 'jspdf';
import type { CalculationResults, StagedFunding } from '../types';
import { formatCurrency } from './calculator';

export function generatePDFReport(
  results: CalculationResults,
  stagedFunding: StagedFunding
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper functions
  const addText = (text: string, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, margin, yPosition);
    yPosition += size * 0.5;
  };

  const addWrappedText = (text: string, size: number, maxWidth: number) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * size * 0.5;
  };

  const addLine = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  };

  const addPageNumber = (pageNum: number) => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // PAGE 1: Executive Summary
  addText('Innovation Investment Calculator', 20, 'bold', [8, 105, 201]);
  yPosition += 5;
  addText('Investment Requirements Report', 16, 'normal', [75, 85, 99]);
  yPosition += 15;

  addLine();

  // User Inputs Section
  addText('Your Inputs', 14, 'bold');
  yPosition += 5;

  const inputs = [
    ['Technology Type', results.inputs.technologyType],
    ['Current Stage', results.inputs.currentStage],
    ['Target Market', results.inputs.targetMarket],
    ['Geographic Location', results.inputs.geographicLocation],
    ['Team Status', results.inputs.teamStatus],
    ['Regulatory Environment', results.inputs.regulatoryEnvironment],
  ];

  doc.setFontSize(10);
  inputs.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(label + ':', margin, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin + 60, yPosition);
    yPosition += 6;
  });

  yPosition += 10;
  addLine();

  // Realistic Scenario (Prominent)
  const realistic = results.scenarios.find(s => s.name === 'Realistic')!;
  addText('Recommended Investment (Realistic Scenario)', 14, 'bold');
  yPosition += 5;

  doc.setFillColor(8, 105, 201);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(realistic.total), pageWidth / 2, yPosition + 15, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Timeline: ${realistic.timeline} months to break-even`, pageWidth / 2, yPosition + 25, { align: 'center' });

  yPosition += 40;

  // Confidence Interval
  addText('Confidence Interval', 12, 'bold');
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  addWrappedText(
    `Based on your inputs, the realistic scenario range is ${formatCurrency(results.confidenceInterval.min)} - ${formatCurrency(results.confidenceInterval.max)}`,
    10,
    pageWidth - 2 * margin
  );

  yPosition += 10;

  // Key Recommendation
  addText('Key Recommendation', 12, 'bold');
  yPosition += 5;
  addWrappedText(
    'We recommend pursuing a staged funding approach to de-risk your investment. Begin with Phase 1 (Validation) to confirm technical feasibility and market demand before committing the full investment amount.',
    10,
    pageWidth - 2 * margin
  );

  addPageNumber(1);

  // PAGE 2: Full Breakdown
  doc.addPage();
  yPosition = margin;

  addText('Detailed Cost Breakdown', 16, 'bold', [8, 105, 201]);
  yPosition += 10;

  // Scenarios Table
  results.scenarios.forEach((scenario, index) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    addText(scenario.name + ' Scenario', 12, 'bold');
    yPosition += 5;

    const scenarioData = [
      ['Total Investment', formatCurrency(scenario.total)],
      ['Timeline', scenario.timeline + ' months'],
      ['Break-even', scenario.breakEven + ' months'],
      ['Development Costs', formatCurrency(scenario.breakdown.development)],
      ['  - Technical Development', formatCurrency(scenario.breakdown.technical)],
      ['  - Regulatory', formatCurrency(scenario.breakdown.regulatory)],
      ['Go-to-Market Year 1', formatCurrency(scenario.breakdown.gtmYear1)],
      ['Go-to-Market Years 2-3', formatCurrency(scenario.breakdown.gtmYears23)],
      ['Risk Buffer (40%)', formatCurrency(scenario.breakdown.riskBuffer)],
    ];

    doc.setFontSize(9);
    scenarioData.forEach(([label, value]) => {
      const isIndented = label.startsWith('  -');
      const xPos = isIndented ? margin + 10 : margin;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(label, xPos, yPosition);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(value, pageWidth - margin, yPosition, { align: 'right' });

      yPosition += 5;
    });

    yPosition += 10;
    if (index < results.scenarios.length - 1) {
      addLine();
    }
  });

  addPageNumber(2);

  // PAGE 3: Staged Funding Model
  doc.addPage();
  yPosition = margin;

  addText('Staged Funding Model', 16, 'bold', [8, 105, 201]);
  yPosition += 10;

  addText('De-Risk Your Investment with a Phased Approach', 12, 'normal');
  yPosition += 15;

  stagedFunding.phases.forEach((phase, index) => {
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    // Phase Header
    doc.setFillColor(8, 105, 201);
    doc.circle(margin + 5, yPosition + 3, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text((index + 1).toString(), margin + 5, yPosition + 4.5, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(phase.name, margin + 15, yPosition + 5);

    yPosition += 12;

    // Phase Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(phase.investment), margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Duration:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(phase.duration + ' months', margin + 40, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Objective:', margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    addWrappedText(phase.objective, 9, pageWidth - 2 * margin - 10);

    doc.setFont('helvetica', 'bold');
    doc.text('Key Milestone:', margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    addWrappedText(phase.keyMilestone, 9, pageWidth - 2 * margin - 10);

    doc.setFont('helvetica', 'bold');
    doc.text('Decision Gate:', margin + 5, yPosition);
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    addWrappedText(phase.decisionGate, 9, pageWidth - 2 * margin - 10);

    yPosition += 10;
    if (index < stagedFunding.phases.length - 1) {
      addLine();
    }
  });

  addPageNumber(3);

  // PAGE 4: Methodology Appendix
  doc.addPage();
  yPosition = margin;

  addText('Methodology & Data Sources', 16, 'bold', [8, 105, 201]);
  yPosition += 10;

  addText('Calculation Approach', 12, 'bold');
  yPosition += 5;
  addWrappedText(
    'This calculator uses industry-standard coefficients and formulas to estimate innovation implementation costs. The calculation considers technology type, development stage, market characteristics, geographic costs, team readiness, and regulatory requirements.',
    10,
    pageWidth - 2 * margin
  );
  yPosition += 10;

  addText('Data Sources', 12, 'bold');
  yPosition += 5;
  addWrappedText(
    '• Bureau of Labor Statistics (BLS) - Geographic cost indices\n• Industry research reports - Burn rates and development timelines\n• Historical client data - Risk probabilities and scaling costs\n• Regulatory agencies - Compliance cost estimates',
    10,
    pageWidth - 2 * margin
  );
  yPosition += 15;

  addText('Key Assumptions', 12, 'bold');
  yPosition += 5;
  addWrappedText(
    '• Monthly burn rates vary by technology type\n• Development timelines based on Technology Readiness Levels (TRL)\n• Risk factors calculated using probability × impact methodology\n• Geographic cost adjustments based on local market indices\n• Team multipliers reflect hiring and onboarding overhead',
    10,
    pageWidth - 2 * margin
  );
  yPosition += 15;

  addText('Limitations', 12, 'bold');
  yPosition += 5;
  addWrappedText(
    'This calculator provides estimates based on typical scenarios. Actual costs may vary based on specific circumstances, market conditions, and unforeseen challenges. Use these results as a planning guide, not a guarantee.',
    10,
    pageWidth - 2 * margin
  );
  yPosition += 15;

  addText('Last Updated', 12, 'bold');
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(), margin, yPosition);

  addPageNumber(4);

  // Save the PDF
  doc.save('investment-requirements-report.pdf');
}
