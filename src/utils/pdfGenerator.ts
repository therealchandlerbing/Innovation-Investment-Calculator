import jsPDF from 'jspdf';
import type { UserInputs, CalculationResults } from '../types/calculator';
import { formatCurrency } from './calculations';

export function generatePDF(inputs: UserInputs, results: CalculationResults, stagedFunding: any[]): void {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Page 1: Executive Summary
  pdf.setFontSize(20);
  pdf.text('Innovation Investment Report', margin, 30);

  pdf.setFontSize(12);
  pdf.text('Executive Summary', margin, 50);

  pdf.setFontSize(10);
  let yPos = 60;

  // Inputs
  pdf.text(`Technology: ${inputs.technologyType}`, margin, yPos);
  yPos += 7;
  pdf.text(`Stage: ${inputs.stage}`, margin, yPos);
  yPos += 7;
  pdf.text(`Market: ${inputs.market}`, margin, yPos);
  yPos += 7;
  pdf.text(`Location: ${inputs.location}`, margin, yPos);
  yPos += 7;
  pdf.text(`Team: ${inputs.teamStatus}`, margin, yPos);
  yPos += 7;
  pdf.text(`Regulatory: ${inputs.regulatory}`, margin, yPos);
  yPos += 15;

  // Realistic scenario
  pdf.setFontSize(14);
  pdf.text('Recommended Investment: ' + formatCurrency(results.realistic.costs.total), margin, yPos);
  yPos += 10;
  pdf.setFontSize(10);
  pdf.text(`Timeline: ${results.realistic.timeline} months`, margin, yPos);
  yPos += 7;
  pdf.text(`Confidence Range: ${formatCurrency(results.confidenceRange.low)} - ${formatCurrency(results.confidenceRange.high)}`, margin, yPos);

  // Page 2: Full Breakdown
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Investment Breakdown', margin, 30);

  yPos = 45;
  pdf.setFontSize(10);

  ['optimistic', 'realistic', 'conservative'].forEach((scenario) => {
    const data = results[scenario as keyof CalculationResults];
    if (typeof data === 'object' && 'costs' in data) {
      pdf.setFontSize(12);
      pdf.text(scenario.charAt(0).toUpperCase() + scenario.slice(1), margin, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      pdf.text(`Total: ${formatCurrency(data.costs.total)}`, margin + 5, yPos);
      yPos += 6;
      pdf.text(`Development: ${formatCurrency(data.costs.development)}`, margin + 5, yPos);
      yPos += 6;
      pdf.text(`Go-to-Market: ${formatCurrency(data.costs.gtm)}`, margin + 5, yPos);
      yPos += 6;
      pdf.text(`Risk Contingency: ${formatCurrency(data.costs.risk)}`, margin + 5, yPos);
      yPos += 6;
      pdf.text(`Timeline: ${data.timeline} months`, margin + 5, yPos);
      yPos += 12;
    }
  });

  // Page 3: Staged Funding
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Staged Funding Model', margin, 30);

  yPos = 45;
  stagedFunding.forEach((phase, index) => {
    pdf.setFontSize(12);
    pdf.text(`Phase ${index + 1}: ${phase.name}`, margin, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    pdf.text(`Investment: ${formatCurrency(phase.investment)}`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Duration: ${phase.duration} months`, margin + 5, yPos);
    yPos += 6;
    pdf.text(`Objective: ${phase.objective}`, margin + 5, yPos);
    yPos += 6;
    const milestone = pdf.splitTextToSize(`Milestone: ${phase.milestone}`, pageWidth - 2 * margin - 5);
    pdf.text(milestone, margin + 5, yPos);
    yPos += 6 * milestone.length;
    const gate = pdf.splitTextToSize(`Decision Gate: ${phase.decisionGate}`, pageWidth - 2 * margin - 5);
    pdf.text(gate, margin + 5, yPos);
    yPos += 6 * gate.length + 10;
  });

  // Page 4: Methodology
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.text('Methodology', margin, 30);

  pdf.setFontSize(10);
  yPos = 45;
  pdf.text('This calculator uses validated industry data including:', margin, yPos);
  yPos += 8;
  pdf.text('• Bureau of Labor Statistics wage data', margin + 5, yPos);
  yPos += 6;
  pdf.text('• Industry benchmark research', margin + 5, yPos);
  yPos += 6;
  pdf.text('• Historical project data from 100+ implementations', margin + 5, yPos);
  yPos += 10;
  pdf.text('Core Formula: TOTAL = (DEVELOPMENT + GTM) × (1 + RISK_FACTOR)', margin, yPos);
  yPos += 10;
  pdf.text('For complete methodology, visit:', margin, yPos);
  yPos += 6;
  pdf.text('github.com/yourusername/innovation-calculator', margin, yPos);

  // Footer
  pdf.setFontSize(8);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pdf.internal.pageSize.getHeight() - 10);

  // Download
  pdf.save('innovation-investment-report.pdf');
}
