import html2pdf from 'html2pdf.js';
import { getPdfStyles } from './pdf-parts/pdfStyles';
import {
  generateTitlePage,
  generateVisionMissionPage,
  generateCommitteesPages,
  generateStaffPage,
  generatePlanSourcesPage,
  generateAspectsPages,
  generateSelfAssessmentPages,
  generateSwotPage,
  generateEducationGoalsPages,
  generateMonitoringPage
} from './pdf-parts/pdfSectionGenerators';

export const generatePdf = async (planData, templateUrl) => {
  if (!planData) {
    throw new Error("Plan data is not available for PDF generation.");
  }

  let contentHtml = getPdfStyles();

  contentHtml += generateTitlePage(planData, templateUrl);
  contentHtml += generateVisionMissionPage(planData, templateUrl);
  contentHtml += generateCommitteesPages(planData, templateUrl);
  contentHtml += generateStaffPage(planData, templateUrl);
  contentHtml += generatePlanSourcesPage(planData, templateUrl);
  contentHtml += generateAspectsPages(planData, templateUrl);
  contentHtml += generateSelfAssessmentPages(planData, templateUrl);
  contentHtml += generateSwotPage(planData, templateUrl);
  contentHtml += generateEducationGoalsPages(planData, templateUrl);
  contentHtml += generateMonitoringPage(planData, templateUrl);

  const element = document.createElement('div');
  element.innerHTML = contentHtml;
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  document.body.appendChild(element);

  const opt = {
    margin: 0,
    filename: `خطة-${planData.plan_name || 'المدرسة'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true, allowTaint: true, backgroundColor: null },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("فشل إنشاء ملف PDF.");
  } finally {
    document.body.removeChild(element);
  }
};