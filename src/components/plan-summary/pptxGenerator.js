import PptxGenJS from 'pptxgenjs';
<<<<<<< HEAD
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
=======
import { 
  JOB_TITLES_KSA,
  COMMITTEE_MEMBER_ROLES,
  RISK_CATEGORIES,
  RISK_SEVERITY_LEVELS,
  RISK_STRATEGIES,
  RISK_RESPONSIBLE_PARTIES,
  PARTNERSHIP_TYPES,
  STAFF_SPECIALIZATIONS_KSA
} from '@/lib/operationalPlanConstants';
import { 
  PROGRAM_OR_INITIATIVE_TYPES,
  SUGGESTED_PROGRAMS,
  SUGGESTED_INITIATIVES
} from '@/lib/programsOptions';
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';
>>>>>>> cd51de4 (initial push)

export const generatePptx = async (planData, templateUrl, getDisplayValue) => {
  if (!planData) {
    throw new Error("Plan data is not available for PPTX generation.");
  }
<<<<<<< HEAD
  const { pptx, schoolName, textColor, textShadow } = setupPresentation(PptxGenJS, planData);
  const styles = { textColor, textShadow };

  await generateAllSlides(pptx, planData, templateUrl, getDisplayValue, styles);

  await pptx.writeFile({ fileName: `خطة-${schoolName}.pptx` });
=======

  let pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.rtlMode = true;

  const schoolName = planData.school_name_full || "اسم المدرسة غير متوفر";

  pptx.defineLayout({
    name: "MASTER_SLIDE_WITH_BACKGROUND",
    width: 10,
    height: 5.625,
  });

  const addBackgroundToSlide = async (slide) => {
    if (templateUrl) {
      try {
        const response = await fetch(templateUrl, { mode: 'cors' });
        if (response.ok) {
          slide.addImage({
            path: templateUrl,
            x: 0, y: 0, w: '100%', h: '100%',
            sizing: { type: 'cover', w: 10, h: 5.625 }
          });
          return true;
        } else {
          console.warn(`Template image URL not accessible (status: ${response.status}), using fallback color.`);
          slide.background = { color: "F0F8FF" };
          return false;
        }
      } catch (e) {
        console.warn("Error fetching template image, using fallback color:", e);
        slide.background = { color: "F0F8FF" };
        return false;
      }
    } else {
      slide.background = { color: "F0F8FF" };
      return false;
    }
  };

  let titleSlide = pptx.addSlide({ masterName: "MASTER_SLIDE_WITH_BACKGROUND" });
  await addBackgroundToSlide(titleSlide);
  
  titleSlide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 2.0, w: '90%', h: 2.5,
    fill: { color: 'FFFFFF', transparency: 20 }
  });

  titleSlide.addText(`الخطة التشغيلية لـ ${schoolName}`, { x: 0.5, y: 2.5, w: '90%', h: 1.5, fontSize: 36, bold: true, align: 'center', color: '003366', rtlMode: true });
  titleSlide.addText(`العام الدراسي: ${planData.target_academic_year || 'N/A'}`, { x: 0.5, y: 4.0, w: '90%', h: 1, fontSize: 24, align: 'center', color: '333333', rtlMode: true });

  const addSectionToPptx = async (title, dataCallback) => {
    let slide = pptx.addSlide({ masterName: "MASTER_SLIDE_WITH_BACKGROUND" });
    await addBackgroundToSlide(slide);
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.2, y: 0.2, w: '96%', h: '94%', fill: { color: 'FFFFFF', transparency: 15 } });
    slide.addText(title, { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: "003366", rtlMode: true });
    await dataCallback(slide, 1.2);
  };
  
  const createNewSlideIfNeeded = async (currentSlide, currentY, sectionTitle) => {
    if (currentY > 5.0) {
        let newSlide = pptx.addSlide({ masterName: "MASTER_SLIDE_WITH_BACKGROUND" });
        await addBackgroundToSlide(newSlide);
        newSlide.addShape(pptx.shapes.RECTANGLE, { x: 0.2, y: 0.2, w: '96%', h: '94%', fill: { color: 'FFFFFF', transparency: 15 } });
        newSlide.addText(`${sectionTitle} (تابع)`, { x:0.5, y:0.5, fontSize:22, bold:true, color:"003366", rtlMode: true });
        return { slide: newSlide, y: 1.2 };
    }
    return { slide: currentSlide, y: currentY };
  };


  await addSectionToPptx("معلومات المدرسة", async (slide, yStart) => {
    slide.addText([
      { text: "اسم المدرسة: ", options: { bold: true, rtlMode: true } }, { text: schoolName, options: { rtlMode: true } },
      { text: "\nقائد المدرسة: ", options: { bold: true, rtlMode: true } }, { text: planData.principal_name || 'N/A', options: { rtlMode: true } },
      { text: "\nعدد الطلاب: ", options: { bold: true, rtlMode: true } }, { text: planData.student_count?.toString() || 'N/A', options: { rtlMode: true } },
      { text: "\nعدد المعلمين: ", options: { bold: true, rtlMode: true } }, { text: planData.teacher_count?.toString() || 'N/A', options: { rtlMode: true } },
    ], { x: 0.5, y: yStart, w: '90%', h: 3, fontSize: 18, bullet: true, color: "333333", rtlMode: true });
  });

  await addSectionToPptx("الرؤية والرسالة وفلسفة القائد", async (slide, yStart) => {
    let currentY = yStart;
    slide.addText("الرؤية:", { x: 0.5, y: currentY, fontSize: 20, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.5;
    slide.addText(planData.school_vision || "لم تحدد الرؤية", { x: 0.5, y: currentY, w: '90%', fontSize: 16, color: "333333", rtlMode: true }); currentY += (planData.school_vision || " ").split('\n').length * 0.3 + 0.3;
    
    let slideState = await createNewSlideIfNeeded(slide, currentY, "الرؤية والرسالة");
    slide = slideState.slide; currentY = slideState.y;

    slide.addText("الرسالة:", { x: 0.5, y: currentY, fontSize: 20, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.5;
    slide.addText(planData.school_mission || "لم تحدد الرسالة", { x: 0.5, y: currentY, w: '90%', fontSize: 16, color: "333333", rtlMode: true }); currentY += (planData.school_mission || " ").split('\n').length * 0.3 + 0.3;

    slideState = await createNewSlideIfNeeded(slide, currentY, "فلسفة القائد");
    slide = slideState.slide; currentY = slideState.y;
    
    slide.addText("فلسفة القائد:", { x: 0.5, y: currentY, fontSize: 20, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.5;
    slide.addText(planData.plan_philosophy || "لم تحدد فلسفة القائد", { x: 0.5, y: currentY, w: '90%', fontSize: 16, color: "333333", rtlMode: true });
  });

  if (planData.planning_committee_data && planData.planning_committee_data.length > 0) {
    await addSectionToPptx("لجنة إعداد الخطة", async (slide, yStart) => {
      let tableData = [
        [{ text: "الاسم", options: { bold: true, fill: "E0E0E0", rtlMode: true } }, { text: "المسمى الوظيفي", options: { bold: true, fill: "E0E0E0", rtlMode: true } }, { text: "الدور في اللجنة", options: { bold: true, fill: "E0E0E0", rtlMode: true } }]
      ];
      planData.planning_committee_data.forEach(member => {
        tableData.push([
          { text: member.name || 'N/A', options: { rtlMode: true } },
          { text: getDisplayValue(member.job_title, JOB_TITLES_KSA, member.job_title || 'N/A'), options: { rtlMode: true } },
          { text: getDisplayValue(member.role_in_committee, COMMITTEE_MEMBER_ROLES, member.role_in_committee || 'N/A'), options: { rtlMode: true } }
        ]);
      });
      slide.addTable(tableData, { x: 0.5, y: yStart, w: 9, autoPage: true, rowH: 0.4, fontSize: 12, border: { type: "solid", pt: 1, color: "C0C0C0" }, rtlMode: true });
    });
  }

  if (planData.team_responsibilities_data) {
    await addSectionToPptx("مسؤوليات فريق التخطيط", async (slide, yStart) => {
      slide.addText(planData.team_responsibilities_data, { x: 0.5, y: yStart, w: '90%', fontSize: 14, color: "333333", rtlMode: true });
    });
  }

  if (planData.ethics_charter) {
    await addSectionToPptx("الميثاق الأخلاقي والقيم الأساسية", async (slide, yStart) => {
      let currentY = yStart;
      slide.addText("نص الميثاق الأخلاقي:", { x: 0.5, y: currentY, fontSize: 18, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.5;
      slide.addText(planData.ethics_charter.charter_text || "لم يحدد نص الميثاق.", { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: "333333", rtlMode: true }); currentY += (planData.ethics_charter.charter_text || " ").split('\n').length * 0.3 + 0.3;
      
      let slideState = await createNewSlideIfNeeded(slide, currentY, "القيم الأساسية");
      slide = slideState.slide; currentY = slideState.y;

      if (planData.ethics_charter.core_values && planData.ethics_charter.core_values.length > 0) {
        slide.addText("القيم الأساسية:", { x: 0.5, y: currentY, fontSize: 18, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.5;
        const valueTexts = planData.ethics_charter.core_values.map(v => ({ text: `${v.name}${v.description ? `: ${v.description}` : ''}`, options: { paraSpaceAfter: 8, rtlMode: true } }));
        slide.addText(valueTexts, { x: 0.5, y: currentY, w: '90%', fontSize: 14, bullet: true, color: "333333", rtlMode: true });
      }
    });
  }

  if (planData.strategic_goals && planData.strategic_goals.length > 0) {
    await addSectionToPptx("المجالات والأهداف الاستراتيجية", async (slide, yStart) => {
      let currentY = yStart;
      for (const domainGoal of planData.strategic_goals) {
        const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainGoal.domain_id);
        const domainName = domainInfo ? domainInfo.label : (domainGoal.domain_name || 'مجال غير مسمى');
        
        let slideState = await createNewSlideIfNeeded(slide, currentY, domainName);
        slide = slideState.slide; currentY = slideState.y;

        slide.addText(`مجال: ${domainName}`, { x: 0.5, y: currentY, fontSize: 18, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.4;

        for (const [idx, obj] of (domainGoal.objectives || []).entries()) {
          slideState = await createNewSlideIfNeeded(slide, currentY, `${domainName} - الأهداف`);
          slide = slideState.slide; currentY = slideState.y;

          slide.addText(` الهدف ${idx + 1}: ${obj.objective_title_label || obj.domain_objective_label || 'هدف غير مسمى'}`, { x: 0.7, y: currentY, w: '88%', fontSize: 14, color: "333333", rtlMode: true }); currentY += 0.3;
          if (obj.kpis && obj.kpis.length > 0) {
            slide.addText(`  المؤشرات: ${obj.kpis.join('، ')}`, { x: 0.9, y: currentY, w: '85%', fontSize: 12, color: "555555", rtlMode: true }); currentY += 0.3;
          }
        }
        currentY += 0.2; 
      }
    });
  }

  if (planData.programs_initiatives && planData.programs_initiatives.length > 0) {
    await addSectionToPptx("البرامج والمبادرات", async (slide, yStart) => {
      let currentY = yStart;
      for (const program of planData.programs_initiatives) {
        let slideState = await createNewSlideIfNeeded(slide, currentY, "البرامج والمبادرات");
        slide = slideState.slide; currentY = slideState.y;

        const typeLabel = getDisplayValue(program.type, PROGRAM_OR_INITIATIVE_TYPES, 'بند');
        const nameLabel = program.name === 'other' ? program.customName : (getDisplayValue(program.name, program.type === 'program' ? SUGGESTED_PROGRAMS : SUGGESTED_INITIATIVES, 'غير مسمى'));
        slide.addText(`${typeLabel}: ${nameLabel}`, { x: 0.5, y: currentY, fontSize: 16, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.4;
      }
    });
  }

  if (planData.tech_strategy) {
    await addSectionToPptx("استراتيجية التقنية", async (slide, yStart) => {
      let currentY = yStart;
      const tech = planData.tech_strategy;
      const addTechText = async (label, value) => {
        let slideState = await createNewSlideIfNeeded(slide, currentY, "استراتيجية التقنية");
        slide = slideState.slide; currentY = slideState.y;
        
        slide.addText([{ text: `${label}: `, options: { bold: true, rtlMode: true } }, { text: value || 'N/A', options: { rtlMode: true } }], { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: "333333", rtlMode: true });
        currentY += 0.5;
      };
      await addTechText("المستوى الحالي", tech.current_level);
      await addTechText("الأهداف", tech.goals?.join('، '));
      await addTechText("الأدوات", tech.tools?.join('، '));
      await addTechText("التأثير المتوقع", tech.impact_description);
    });
  }

  if (planData.risks_management && planData.risks_management.length > 0) {
    await addSectionToPptx("إدارة المخاطر", async (slide, yStart) => {
      let currentY = yStart;
      for (const risk of planData.risks_management) {
        let slideState = await createNewSlideIfNeeded(slide, currentY, "إدارة المخاطر");
        slide = slideState.slide; currentY = slideState.y;

        slide.addText(`وصف المخاطرة: ${risk.description || 'N/A'}`, { x: 0.5, y: currentY, fontSize: 16, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.4;
        slide.addText(`  الفئة: ${getDisplayValue(risk.category, RISK_CATEGORIES)}, الخطورة: ${getDisplayValue(risk.severity || risk.severity_level, RISK_SEVERITY_LEVELS)}`, { x: 0.7, y: currentY, w: '88%', fontSize: 12, color: "333333", rtlMode: true }); currentY += 0.3;
        slide.addText(`  الاستراتيجية: ${getDisplayValue(risk.strategy, RISK_STRATEGIES)}`, { x: 0.7, y: currentY, w: '88%', fontSize: 12, color: "333333", rtlMode: true }); currentY += 0.3;
      }
    });
  }

  if (planData.partnerships && planData.partnerships.length > 0) {
    await addSectionToPptx("الشراكات", async (slide, yStart) => {
      let currentY = yStart;
      for (const p of planData.partnerships) {
        let slideState = await createNewSlideIfNeeded(slide, currentY, "الشراكات");
        slide = slideState.slide; currentY = slideState.y;

        slide.addText(`الشريك: ${p.partner_name || 'N/A'} (${getDisplayValue(p.partnership_type, PARTNERSHIP_TYPES)})`, { x: 0.5, y: currentY, fontSize: 16, bold: true, color: "005A9C", rtlMode: true }); currentY += 0.4;
        slide.addText(`  الأهداف: ${p.objectives || 'N/A'}`, { x: 0.7, y: currentY, w: '88%', fontSize: 12, color: "333333", rtlMode: true }); currentY += 0.3;
      }
    });
  }

  if (planData.staff_development) {
    await addSectionToPptx("الكادر والتطوير المهني", async (slide, yStart) => {
      let currentY = yStart;
      const staff = planData.staff_development;
      const addStaffText = async (label, value, isList = false) => {
        let slideState = await createNewSlideIfNeeded(slide, currentY, "الكادر والتطوير");
        slide = slideState.slide; currentY = slideState.y;

        if (isList && Array.isArray(value) && value.length > 0) {
          slide.addText(`${label}:`, { x: 0.5, y: currentY, w: '90%', fontSize: 14, bold: true, color: "333333", rtlMode: true }); currentY += 0.3;
          for (const item of value) {
            slideState = await createNewSlideIfNeeded(slide, currentY, "الكادر والتطوير");
            slide = slideState.slide; currentY = slideState.y;
            
            let itemText = typeof item === 'object' ? (STAFF_SPECIALIZATIONS_KSA.find(s => s.value === item.specialization)?.label || item.custom_specialization || item.specialization) : item;
            if (typeof item === 'object' && item.count !== undefined) itemText += ` (العدد: ${item.count})`;
            slide.addText(`- ${itemText}`, { x: 0.7, y: currentY, w: '85%', fontSize: 12, color: "555555", rtlMode: true }); currentY += 0.3;
          }
        } else if (!isList) {
          const textContent = value || 'N/A';
          slide.addText([{ text: `${label}: `, options: { bold: true, rtlMode: true } }, { text: textContent, options: { rtlMode: true } }], { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: "333333", rtlMode: true });
          currentY += (textContent && textContent.split('\n').length > 1 ? 0.3 * textContent.split('\n').length : 0.5);
        } else {
          slide.addText([{ text: `${label}: `, options: { bold: true, rtlMode: true } }, { text: 'N/A', options: { rtlMode: true } }], { x: 0.5, y: currentY, w: '90%', fontSize: 14, color: "333333", rtlMode: true }); currentY += 0.5;
        }
      };
      await addStaffText("إجمالي الكادر", staff.total_staff?.toString());
      await addStaffText("التخصصات", staff.specializations_list, true);
      await addStaffText("احتياجات التدريب", staff.training_needs, true);
      await addStaffText("خطط التطوير", staff.professional_development_plans);
    });
  }

  await pptx.writeFile({ fileName: `خطة-${planData.plan_name || 'المدرسة'}.pptx` });
>>>>>>> cd51de4 (initial push)
};