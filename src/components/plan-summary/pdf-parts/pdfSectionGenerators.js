import { createPage, getDisplayValue, formatDate } from './pdfHelpers';
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

export const generateTitlePage = (planData, templateUrl) => {
  const schoolName = planData.school_name_full || "اسم المدرسة غير متوفر";
  const academicYear = planData.target_academic_year || 'N/A';
  return createPage(`
    <div class="title-page-content">
      <h1>الخطة التشغيلية</h1>
      <h1 style="margin-top: 20px;">${schoolName}</h1>
      <h2 style="border: none; margin-top: 40px;">للعام الدراسي: ${academicYear}</h2>
    </div>
  `, templateUrl);
};

export const generateVisionMissionPage = (planData, templateUrl) => {
  return createPage(`
    <h2>الرؤية والرسالة</h2>
    <h3>الرؤية</h3>
    <p>${planData.school_vision || "لم يتم تحديد الرؤية."}</p>
    <br/>
    <h3>الرسالة</h3>
    <p>${planData.school_mission || "لم يتم تحديد الرسالة."}</p>
    <br/>
    <h3>فلسفة القائد التعليمية</h3>
    <p>${planData.plan_philosophy || "لم يتم تحديد فلسفة القائد."}</p>
  `, templateUrl);
};

export const generateCommitteesPages = (planData, templateUrl) => {
  let html = '';
  if (planData.planning_committee_data?.length > 0) {
    html += createPage(`
      <h2>لجنة إعداد الخطة</h2>
      <table>
        <thead><tr><th>الاسم</th><th>المسمى الوظيفي</th><th>الدور في اللجنة</th></tr></thead>
        <tbody>
          ${planData.planning_committee_data.map(member => `
            <tr>
              <td>${member.name || 'N/A'}</td>
              <td>${getDisplayValue(member.job_title, JOB_TITLES_KSA, member.job_title || 'N/A')}</td>
              <td>${getDisplayValue(member.role_in_committee, COMMITTEE_MEMBER_ROLES, member.role_in_committee || 'N/A')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, templateUrl);
  }
  if (planData.excellence_committee_members?.length > 0) {
    html += createPage(`
      <h2>لجنة التميز المدرسي</h2>
      <table>
        <thead><tr><th>الاسم</th><th>المسمى الوظيفي</th><th>الدور في اللجنة</th></tr></thead>
        <tbody>
          ${planData.excellence_committee_members.map(member => `
            <tr>
              <td>${member.name || 'N/A'}</td>
              <td>${getDisplayValue(member.job_title, JOB_TITLES_KSA, member.job_title || 'N/A')}</td>
              <td>${getDisplayValue(member.role_in_committee, COMMITTEE_MEMBER_ROLES, member.role_in_committee || 'N/A')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `, templateUrl);
  }
  if (planData.excellence_committee_responsibilities) {
    html += createPage(`
      <h2>مسؤوليات لجنة التميز المدرسي</h2>
      <p style="white-space: pre-line;">${planData.excellence_committee_responsibilities || "لم يتم تحديد المسؤوليات."}</p>
    `, templateUrl);
  }
  return html;
};

export const generateStaffPage = (planData, templateUrl) => {
  if (!planData.school_staff_list?.length > 0) return '';
  return createPage(`
    <h2>بيانات منسوبي المدرسة</h2>
    <table style="font-size: 8pt;">
      <thead>
        <tr><th>الاسم</th><th>السجل المدني</th><th>المؤهل</th><th>التخصص</th><th>تاريخ التخرج</th><th>مباشرة (تعليم)</th><th>مباشرة (مدرسة)</th><th>النصاب</th><th>برامج تدريبية</th><th>ملاحظات</th></tr>
      </thead>
      <tbody>
        ${planData.school_staff_list.map(staff => `
          <tr>
            <td>${staff.fullName || 'N/A'}</td><td>${staff.nationalId || 'N/A'}</td><td>${staff.qualification || 'N/A'}</td><td>${staff.specialization || 'N/A'}</td><td>${formatDate(staff.graduationDate)}</td><td>${formatDate(staff.teachingStartDate)}</td><td>${formatDate(staff.currentSchoolStartDate)}</td><td>${staff.workload || 'N/A'}</td><td>${staff.trainingPrograms || 'N/A'}</td><td>${staff.notes || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `, templateUrl);
};

export const generatePlanSourcesPage = (planData, templateUrl) => {
  if (!planData.plan_sources_text) return '';
  return createPage(`
    <h2>مصادر بناء الخطة</h2>
    <p style="white-space: pre-line;">${planData.plan_sources_text}</p>
  `, templateUrl);
};

export const generateAspectsPages = (planData, templateUrl) => {
  let html = '';
  if (planData.ranked_school_aspects?.length > 0) {
    let aspectsContent = `<h2>أولويات التطوير والتحسين</h2><h3>المجالات الأولى بالترتيب (تنازليًا)</h3><ol>`;
    planData.ranked_school_aspects.forEach(aspect => {
      aspectsContent += `<li>${aspect.name}</li>`;
    });
    aspectsContent += `</ol>`;
    html += createPage(aspectsContent, templateUrl);
  }
  if (planData.detailed_school_aspects && Object.keys(planData.detailed_school_aspects).length > 0) {
    let detailedAspectsContent = `<h2>الجوانب المدرسية حسب المجالات (تفصيلي)</h2>`;
    SCHOOL_ASPECTS_AREAS.forEach(mainAspect => {
      if (planData.detailed_school_aspects[mainAspect.id]?.length > 0) {
        detailedAspectsContent += `<h3>${mainAspect.name}</h3><table><thead><tr><th>الجانب الفرعي</th><th>مؤشرات الأداء</th><th>ملاحظات / إجراءات مقترحة</th></tr></thead><tbody>`;
        planData.detailed_school_aspects[mainAspect.id].forEach(subAspect => {
          detailedAspectsContent += `<tr><td>${subAspect.name || ''}</td><td>${subAspect.indicators || ''}</td><td>${subAspect.notes || ''}</td></tr>`;
        });
        detailedAspectsContent += `</tbody></table><br/>`;
      }
    });
    html += createPage(detailedAspectsContent, templateUrl);
  }
  return html;
};

export const generateSelfAssessmentPages = (planData, templateUrl) => {
  let html = '';
  let selfAssessmentContent = `<h2>مجالات التقويم الذاتي التي تم مراعاتها</h2>`;
  selfAssessmentContent += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
  SELF_ASSESSMENT_DOMAINS.forEach(domain => {
    selfAssessmentContent += `<div style="border: 1px solid rgba(0,0,0,0.2); padding: 10px; border-radius: 5px;"><h4>${domain.name}</h4><ul>${domain.subDomains.map(sub => `<li>${sub}</li>`).join('')}</ul></div>`;
  });
  selfAssessmentContent += '</div>';
  html += createPage(selfAssessmentContent, templateUrl);

  if (planData.beneficiaries_data?.length > 0) {
    let beneficiariesContent = `<h2>المستفيدون من الخطة التشغيلية</h2>`;
    planData.beneficiaries_data.forEach(beneficiary => {
      beneficiariesContent += `<h3>${beneficiary.label}</h3><p style="white-space: pre-line;">${beneficiary.description || "لم يتم تحديد وصف."}</p><br/>`;
    });
    html += createPage(beneficiariesContent, templateUrl);
  }
  return html;
};

export const generateSwotPage = (planData, templateUrl) => {
  const swot = planData.swot_analysis || {};
  const strengths = [...(swot.strengths?.selected || []), ...(swot.strengths?.custom?.filter(s => s.trim() !== '') || [])];
  const weaknesses = [...(swot.weaknesses?.selected || []), ...(swot.weaknesses?.custom?.filter(w => w.trim() !== '') || [])];
  const opportunities = [...(swot.opportunities?.selected || []), ...(swot.opportunities?.custom?.filter(o => o.trim() !== '') || [])];
  const threats = [...(swot.threats?.selected || []), ...(swot.threats?.custom?.filter(t => t.trim() !== '') || [])];

  return createPage(`
    <h2>تحليل SWOT</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div><h3>نقاط القوة</h3><ul>${strengths.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div><h3>نقاط الضعف</h3><ul>${weaknesses.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div><h3>الفرص</h3><ul>${opportunities.map(item => `<li>${item}</li>`).join('')}</ul></div>
        <div><h3>التهديدات</h3><ul>${threats.map(item => `<li>${item}</li>`).join('')}</ul></div>
    </div>
  `, templateUrl);
};

export const generateEducationGoalsPages = (planData, templateUrl) => {
  let html = '';
  if (planData.general_strategic_goals_text) {
    html += createPage(`
      <h2>الأهداف الاستراتيجية للتعليم (عامة)</h2>
      <p style="white-space: pre-line;">${planData.general_strategic_goals_text}</p>
    `, templateUrl);
  }

  if (planData.stage_specific_goals_data && Object.keys(planData.stage_specific_goals_data).length > 0) {
    const EDUCATIONAL_STAGES_INFO_PDF = {
      kindergarten: { label: 'أهداف في مرحلة رياض الأطفال' },
      primary: { label: 'أهداف في المرحلة الابتدائية' },
      middle: { label: 'أهداف في المرحلة المتوسطة' },
      secondary: { label: 'أهداف في المرحلة الثانوية' },
    };
    let stageGoalsContent = '<h2>أهداف التعليم حسب المرحلة الدراسية</h2>';
    for (const [stageId, goalsText] of Object.entries(planData.stage_specific_goals_data)) {
        if (goalsText && goalsText.trim() !== '') {
            const stageLabel = EDUCATIONAL_STAGES_INFO_PDF[stageId]?.label || `أهداف مرحلة ${stageId}`;
            stageGoalsContent += `<h3>${stageLabel}</h3><p style="white-space: pre-line;">${goalsText}</p><br/>`;
        }
    }
    html += createPage(stageGoalsContent, templateUrl);
  }
  
  if (planData.implementation_strategies_text) {
    html += createPage(`
      <h2>استراتيجيات التنفيذ</h2>
      <p style="white-space: pre-line;">${planData.implementation_strategies_text}</p>
    `, templateUrl);
  }
  return html;
};

export const generateMonitoringPage = (planData, templateUrl) => {
  if (!planData.plan_implementation_monitoring?.length > 0) return '';
  const stats = {
      good: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'good').length,
      average: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'average').length,
      weak: planData.plan_implementation_monitoring.filter(e => e.implementation_level === 'weak').length,
  };
  const totalRated = stats.good + stats.average + stats.weak;
  const averageImplementation = totalRated > 0 ? Math.round((stats.good * 100 + stats.average * 70 + stats.weak * 40) / totalRated) : 0;

  let monitoringContent = `<h2>متابعة تنفيذ الخطة</h2>
  <h3>ملخص المتابعة</h3>
  <p>مستوى جيد: ${stats.good} | مستوى متوسط: ${stats.average} | مستوى ضعيف: ${stats.weak} | متوسط التنفيذ: ${averageImplementation}%</p>
  <br/>
  <table><thead><tr><th>رقم المتابعة</th><th>موعد المتابعة</th><th>الأسبوع</th><th>مستوى التنفيذ</th><th>مؤشرات التحقق</th><th>ملاحظات</th></tr></thead><tbody>`;
  planData.plan_implementation_monitoring.forEach(entry => {
      monitoringContent += `<tr>
          <td>${getDisplayValue(entry.monitoring_number, MONITORING_NUMBERS)}</td>
          <td>${getDisplayValue(entry.monitoring_period, MONITORING_PERIODS)}</td>
          <td>${getDisplayValue(entry.week_number, MONITORING_WEEKS, `الأسبوع ${entry.week_number}`)}</td>
          <td>${getDisplayValue(entry.implementation_level, IMPLEMENTATION_LEVELS)}</td>
          <td>${getDisplayValue(entry.achievement_indicator, ACHIEVEMENT_INDICATORS)}</td>
          <td>${entry.notes || 'لا يوجد'}</td>
      </tr>`;
  });
  monitoringContent += `</tbody></table>`;
  return createPage(monitoringContent, templateUrl);
};