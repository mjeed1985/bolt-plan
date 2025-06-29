import { addSectionSlide, createNewSlideIfNeeded, toSafeString, addBackgroundToSlide } from './pptxHelpers';
import { 
  JOB_TITLES_KSA,
  COMMITTEE_MEMBER_ROLES,
  MONITORING_NUMBERS,
  MONITORING_PERIODS,
  MONITORING_WEEKS,
  IMPLEMENTATION_LEVELS,
  ACHIEVEMENT_INDICATORS
} from '@/lib/operationalPlanConstants';
import { SCHOOL_ASPECTS_AREAS } from '@/lib/constants/schoolAspectsData';
import { SELF_ASSESSMENT_DOMAINS } from '@/lib/constants/selfAssessmentData';

export const generateTitleSlide = async (pptx, planData, templateUrl, styles) => {
  let slide = pptx.addSlide({ masterName: "MASTER_SLIDE_WITH_BACKGROUND" });
  await addBackgroundToSlide(slide, templateUrl);
  slide.addText(`الخطة التشغيلية لـ ${planData.school_name_full || 'المدرسة'}`, { x: 0.5, y: 2.5, w: '90%', h: 1.5, fontSize: 36, bold: true, align: 'center', color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
  slide.addText(`العام الدراسي: ${planData.target_academic_year || 'N/A'}`, { x: 0.5, y: 4.0, w: '90%', h: 1, fontSize: 24, align: 'center', color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
};

export const generateVisionMissionSlide = async (pptx, planData, templateUrl, styles) => {
  if (!planData.school_vision && !planData.school_mission && !planData.plan_philosophy) return;

  let slide = await addSectionSlide(pptx, "الرؤية والرسالة وفلسفة القائد", templateUrl, styles);
  let y = 1.2;

  if (planData.school_vision) {
    slide.addText("الرؤية:", { x: 0.5, y, fontSize: 20, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.5;
    const visionText = toSafeString(planData.school_vision, "لم تحدد الرؤية");
    slide.addText(visionText, { x: 0.5, y, w: '90%', fontSize: 16, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
    y += visionText.split('\n').length * 0.3 + 0.3;
  }
  
  let s = await createNewSlideIfNeeded(pptx, slide, y, "الرؤية والرسالة", templateUrl, styles); slide = s.slide; y = s.y;
  
  if (planData.school_mission) {
    slide.addText("الرسالة:", { x: 0.5, y, fontSize: 20, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.5;
    const missionText = toSafeString(planData.school_mission, "لم تحدد الرسالة");
    slide.addText(missionText, { x: 0.5, y, w: '90%', fontSize: 16, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
    y += missionText.split('\n').length * 0.3 + 0.3;
  }
  
  s = await createNewSlideIfNeeded(pptx, slide, y, "فلسفة القائد", templateUrl, styles); slide = s.slide; y = s.y;

  if (planData.plan_philosophy) {
    slide.addText("فلسفة القائد:", { x: 0.5, y, fontSize: 20, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.5;
    const philosophyText = toSafeString(planData.plan_philosophy, "لم تحدد فلسفة القائد");
    slide.addText(philosophyText, { x: 0.5, y, w: '90%', fontSize: 16, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
  }
};

export const generateCommitteesSlides = async (pptx, planData, templateUrl, getDisplayValue, styles) => {
  if (planData.planning_committee_data?.length > 0) {
    const slide = await addSectionSlide(pptx, "لجنة إعداد الخطة", templateUrl, styles);
    let tableData = [[{ text: "الاسم", options: { bold: true, fill: "F1F5F9" } }, { text: "المسمى الوظيفي", options: { bold: true, fill: "F1F5F9" } }, { text: "الدور في اللجنة", options: { bold: true, fill: "F1F5F9" } }]];
    planData.planning_committee_data.forEach(m => tableData.push([getDisplayValue(m.name, []), getDisplayValue(m.job_title, JOB_TITLES_KSA), getDisplayValue(m.role_in_committee, COMMITTEE_MEMBER_ROLES)]));
    slide.addTable(tableData, { x: 0.5, y: 1.2, w: 12.33, autoPage: true, rowH: 0.4, fontSize: 12, border: { type: "solid", pt: 1, color: "CCCCCC" }, rtlMode: true });
  }

  if (planData.team_responsibilities_data) {
    const slide = await addSectionSlide(pptx, "مسؤوليات فريق التخطيط", templateUrl, styles);
    slide.addText(toSafeString(planData.team_responsibilities_data), { x: 0.5, y: 1.2, w: '90%', fontSize: 14, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
  }

  if (planData.excellence_committee_members?.length > 0) {
    const slide = await addSectionSlide(pptx, "لجنة التميز المدرسي", templateUrl, styles);
    let tableData = [[{ text: "الاسم", options: { bold: true, fill: "F1F5F9" } }, { text: "المسمى الوظيفي", options: { bold: true, fill: "F1F5F9" } }, { text: "الدور", options: { bold: true, fill: "F1F5F9" } }]];
    planData.excellence_committee_members.forEach(m => tableData.push([getDisplayValue(m.name, []), getDisplayValue(m.job_title, JOB_TITLES_KSA), getDisplayValue(m.role_in_committee, COMMITTEE_MEMBER_ROLES)]));
    slide.addTable(tableData, { x: 0.5, y: 1.2, w: 12.33, autoPage: true, rowH: 0.4, fontSize: 12, border: { type: "solid", pt: 1, color: "CCCCCC" }, rtlMode: true });
  }

  if (planData.excellence_committee_responsibilities) {
    const slide = await addSectionSlide(pptx, "مسؤوليات لجنة التميز", templateUrl, styles);
    slide.addText(toSafeString(planData.excellence_committee_responsibilities), { x: 0.5, y: 1.2, w: '90%', fontSize: 14, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
  }
};

export const generateStaffSlide = async (pptx, planData, templateUrl, styles) => {
  if (!planData.school_staff_list?.length > 0) return;
  const slide = await addSectionSlide(pptx, "بيانات منسوبي المدرسة", templateUrl, styles);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('ar-SA') : 'N/A';
  let headers = ["الاسم", "السجل المدني", "المؤهل", "التخصص", "تخرج", "مباشرة (تعليم)", "مباشرة (مدرسة)", "النصاب", "برامج تدريبية", "ملاحظات"].map(h => ({text: h, options:{bold:true, fill:"F1F5F9"}}));
  let tableData = [headers];
  planData.school_staff_list.forEach(s => tableData.push([s.fullName, s.nationalId, s.qualification, s.specialization, formatDate(s.graduationDate), formatDate(s.teachingStartDate), formatDate(s.currentSchoolStartDate), s.workload, s.trainingPrograms, s.notes].map(toSafeString)));
  slide.addTable(tableData, { x: 0.25, y: 1.2, w: 12.83, autoPage: true, rowH: 0.4, fontSize: 8, border: { pt: 1, color: "CCCCCC" }, colW: [2.33,1.2,1.2,1.2,1.1,1.1,1.1,0.6,1.5,1.5], rtlMode: true });
};

export const generatePlanSourcesSlide = async (pptx, planData, templateUrl, styles) => {
  if (!planData.plan_sources_text) return;
  const slide = await addSectionSlide(pptx, "مصادر بناء الخطة", templateUrl, styles);
  slide.addText(toSafeString(planData.plan_sources_text), { x: 0.5, y: 1.2, w: '90%', fontSize: 14, bullet: true, rtlMode: true, shadow: styles.textShadow });
};

export const generateAspectsSlides = async (pptx, planData, templateUrl, styles) => {
  if (planData.ranked_school_aspects?.length > 0) {
    const slide = await addSectionSlide(pptx, "أولويات التطوير والتحسين", templateUrl, styles);
    const rankedTexts = planData.ranked_school_aspects.map((a, i) => ({ text: `${i + 1}. ${a.name}`, options: { paraSpaceAfter: 8 } }));
    slide.addText(rankedTexts, { x: 0.5, y: 1.2, w: '90%', fontSize: 16, bullet: {type: 'number'}, rtlMode: true, shadow: styles.textShadow });
  }

  if (planData.detailed_school_aspects && Object.keys(planData.detailed_school_aspects).length > 0) {
    for (const mainAspect of SCHOOL_ASPECTS_AREAS) {
      if (planData.detailed_school_aspects[mainAspect.id]?.length > 0) {
        const slide = await addSectionSlide(pptx, `تفاصيل: ${mainAspect.name}`, templateUrl, styles);
        let headers = ["الجانب الفرعي", "مؤشرات الأداء", "ملاحظات"].map(h => ({text: h, options:{bold:true, fill:"F1F5F9"}}));
        let tableData = [headers];
        planData.detailed_school_aspects[mainAspect.id].forEach(s => tableData.push([s.name, s.indicators, s.notes].map(toSafeString)));
        slide.addTable(tableData, { x: 0.5, y: 1.2, w: 12.33, autoPage: true, rowH: 0.5, fontSize: 10, border: { pt: 1, color: "CCCCCC" }, rtlMode: true });
      }
    }
  }
};

export const generateSelfAssessmentSlides = async (pptx, planData, templateUrl, styles) => {
  const slide = await addSectionSlide(pptx, "مجالات التقويم الذاتي", templateUrl, styles);
  let y = 1.2;
  SELF_ASSESSMENT_DOMAINS.forEach((domain, i) => {
    slide.addText(domain.name, { x: (i % 2 === 0 ? 0.5: 7), y, w: '45%', fontSize: 14, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
    if (i % 2 !== 0) y += 1.5;
  });
  
  if (planData.beneficiaries_data?.length > 0) {
    let slide = await addSectionSlide(pptx, "المستفيدون من الخطة", templateUrl, styles);
    let y = 1.2;
    for(const b of planData.beneficiaries_data) {
      let s = await createNewSlideIfNeeded(pptx, slide, y, "المستفيدون", templateUrl, styles); slide = s.slide; y = s.y;
      slide.addText(b.label, { x: 0.5, y, fontSize: 16, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.4;
      slide.addText(toSafeString(b.description), { x: 0.7, y, w: '88%', fontSize: 14, color: "333333", rtlMode: true, shadow: styles.textShadow }); y += toSafeString(b.description).split('\n').length * 0.3 + 0.3;
    }
  }
};

export const generateEducationGoalsSlides = async (pptx, planData, templateUrl, styles) => {
  if (planData.general_strategic_goals_text) {
    const slide = await addSectionSlide(pptx, "الأهداف الاستراتيجية للتعليم (عامة)", templateUrl, styles);
    slide.addText(toSafeString(planData.general_strategic_goals_text), { x: 0.5, y: 1.2, w: '90%', fontSize: 14, bullet: true, rtlMode: true, shadow: styles.textShadow });
  }

  if (planData.implementation_strategies_text) {
    const slide = await addSectionSlide(pptx, "استراتيجيات التنفيذ", templateUrl, styles);
    slide.addText(toSafeString(planData.implementation_strategies_text), { x: 0.5, y: 1.2, w: '90%', fontSize: 14, bullet: true, rtlMode: true, shadow: styles.textShadow });
  }
};

export const generateEthicsSlide = async (pptx, planData, templateUrl, styles) => {
  if (!planData.ethics_charter) return;
  let slide = await addSectionSlide(pptx, "الميثاق الأخلاقي والقيم الأساسية", templateUrl, styles);
  let y = 1.2;
  slide.addText("نص الميثاق الأخلاقي:", { x: 0.5, y, fontSize: 18, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.5;
  const charterText = toSafeString(planData.ethics_charter.charter_text, "لم يحدد.");
  slide.addText(charterText, { x: 0.5, y, w: '90%', fontSize: 14, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += charterText.split('\n').length * 0.3 + 0.3;
  if (planData.ethics_charter.core_values?.length > 0) {
    let s = await createNewSlideIfNeeded(pptx, slide, y, "القيم الأساسية", templateUrl, styles); slide = s.slide; y = s.y;
    slide.addText("القيم الأساسية:", { x: 0.5, y, fontSize: 18, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow }); y += 0.5;
    const valueTexts = planData.ethics_charter.core_values.map(v => ({ text: `${v.name}${v.description ? `: ${v.description}` : ''}`, options: { paraSpaceAfter: 8 } }));
    slide.addText(valueTexts, { x: 0.5, y, w: '90%', fontSize: 14, bullet: true, rtlMode: true, shadow: styles.textShadow });
  }
};

export const generateMonitoringSlide = async (pptx, planData, templateUrl, getDisplayValue, styles) => {
  if (!planData.plan_implementation_monitoring?.length > 0) return;
  const slide = await addSectionSlide(pptx, "متابعة تنفيذ الخطة", templateUrl, styles);
    
  const stats = {
      good: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'good').length,
      average: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'average').length,
      weak: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'weak').length,
  };
  const totalRated = stats.good + stats.average + stats.weak;
  const averageImplementation = totalRated > 0 ? Math.round((stats.good * 100 + stats.average * 70 + stats.weak * 40) / totalRated) : 0;

  slide.addText(`ملخص المتابعة: جيد (${stats.good}), متوسط (${stats.average}), ضعيف (${stats.weak}) - متوسط التنفيذ: ${averageImplementation}%`, { x: 0.5, y: 1.2, w: '90%', fontSize: 14, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });

  let headers = ["رقم المتابعة", "موعد المتابعة", "الأسبوع", "مستوى التنفيذ", "مؤشرات التحقق", "ملاحظات"].map(h => ({text: h, options:{bold:true, fill:"F1F5F9"}}));
  let tableData = [headers];
  planData.plan_implementation_monitoring.forEach(entry => {
      tableData.push([
          getDisplayValue(entry.monitoring_number, MONITORING_NUMBERS),
          getDisplayValue(entry.monitoring_period, MONITORING_PERIODS),
          getDisplayValue(entry.week_number, MONITORING_WEEKS, `الأسبوع ${entry.week_number}`),
          getDisplayValue(entry.implementation_level, IMPLEMENTATION_LEVELS),
          getDisplayValue(entry.achievement_indicator, ACHIEVEMENT_INDICATORS),
          toSafeString(entry.notes, 'لا يوجد')
      ]);
  });
  slide.addTable(tableData, { x: 0.5, y: 1.8, w: 12.33, autoPage: true, rowH: 0.5, fontSize: 10, border: { pt: 1, color: "CCCCCC" }, rtlMode: true });
};