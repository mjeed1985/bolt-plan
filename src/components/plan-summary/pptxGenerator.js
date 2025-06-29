import PptxGenJS from 'pptxgenjs';
import { setupPresentation } from './pptx-parts/pptxHelpers';
import { 
  generateTitleSlide,
  generateVisionMissionSlide,
  generateCommitteesSlides,
  generateStaffSlide,
  generatePlanSourcesSlide,
  generateAspectsSlides,
  generateSelfAssessmentSlides,
  generateEducationGoalsSlides,
  generateEthicsSlide,
  generateMonitoringSlide
} from './pptx-parts/pptxSectionGenerators';

const generateAllSlides = async (pptx, planData, templateUrl, getDisplayValue, styles) => {
  await generateTitleSlide(pptx, planData, templateUrl, styles);
  await generateVisionMissionSlide(pptx, planData, templateUrl, styles);
  await generateCommitteesSlides(pptx, planData, templateUrl, getDisplayValue, styles);
  await generateStaffSlide(pptx, planData, templateUrl, styles);
  await generatePlanSourcesSlide(pptx, planData, templateUrl, styles);
  await generateAspectsSlides(pptx, planData, templateUrl, styles);
  await generateSelfAssessmentSlides(pptx, planData, templateUrl, styles);
  await generateEducationGoalsSlides(pptx, planData, templateUrl, styles);
  await generateEthicsSlide(pptx, planData, templateUrl, styles);
  await generateMonitoringSlide(pptx, planData, templateUrl, getDisplayValue, styles);
  // Note: Swot, Risks, Partnerships, etc. slides can be added here following the same pattern.
};

export const generatePptx = async (planData, templateUrl, getDisplayValue) => {
  if (!planData) {
    throw new Error("Plan data is not available for PPTX generation.");
  }
  const { pptx, schoolName, textColor, textShadow } = setupPresentation(PptxGenJS, planData);
  const styles = { textColor, textShadow };

  await generateAllSlides(pptx, planData, templateUrl, getDisplayValue, styles);

  await pptx.writeFile({ fileName: `خطة-${schoolName}.pptx` });
};