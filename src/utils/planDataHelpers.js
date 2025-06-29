export const getInitialPlanData = () => ({
  plan_name: '',
  school_stage: '',
  student_gender_type: '', 
  school_name_full: '',
  ministry_school_id: '',
  education_department: '',
  education_department_other: '',
  building_type: '',
  teacher_count: 0,
  student_count: 0,
  admin_count: 0,
  classroom_count: 0,
  school_facilities: {}, 
  school_formations: {}, 
  student_distribution_by_stage: [], 
  school_email: '',
  school_phone: '',
  principal_name: '',
  deputy_principal_name: '',
  plan_philosophy: '',
  plan_objective: '',
  plan_nature: '',
  target_academic_year: '',
  multi_year_plan_duration: null,
  school_vision: '',
  school_mission: '',
  school_introduction: '',
  planning_committee_data: [],
  team_responsibilities_data: '',
  excellence_committee_members: [],
  excellence_committee_responsibilities: '',
  school_staff_list: [],
  plan_sources_text: '',
  ranked_school_aspects: [],
  detailed_school_aspects: {},
  self_assessment_domains_notes: {}, 
  beneficiaries_data: [],
  general_strategic_goals_text: '',
  stage_specific_goals_data: {},
  implementation_strategies_text: '',
  plan_implementation_monitoring: [],
  swot_analysis: {
    strengths: { selected: [], custom: [''] },
    weaknesses: { selected: [], custom: [''] },
    opportunities: { selected: [], custom: [''] },
    threats: { selected: [], custom: [''] },
    strategic_visions: ''
  },
  ethics_charter: { 
    charter_text: '', 
    core_values: [] 
  },
  strategic_goals: [],
  programs_initiatives: [],
  tech_strategy: {
    current_level: '', 
    goals: [], 
    tools: [], 
    impact_description: '', 
    responsible_team: '',
    kpis: [],
    budget_allocation: '',
    training_plan: ''
  },
  risks_management: [],
  partnerships: [],
  staff_development: { total_staff: 0, specializations_summary: '', training_needs: [], professional_development_plans: [] },
  evaluation_monitoring: { evaluation_mechanisms: '', success_indicators: [], monitoring_schedule: '', evaluation_tools: [] },
  status: 'draft'
});

export const validatePlanData = (dataToSave) => {
  const freshInitialDataForSave = getInitialPlanData();
  
  if (!Array.isArray(dataToSave.planning_committee_data)) {
    dataToSave.planning_committee_data = freshInitialDataForSave.planning_committee_data;
  }
  if (typeof dataToSave.team_responsibilities_data !== 'string') {
    dataToSave.team_responsibilities_data = freshInitialDataForSave.team_responsibilities_data;
  }
  if (!Array.isArray(dataToSave.excellence_committee_members)) {
    dataToSave.excellence_committee_members = freshInitialDataForSave.excellence_committee_members;
  }
  if (typeof dataToSave.excellence_committee_responsibilities !== 'string') {
    dataToSave.excellence_committee_responsibilities = freshInitialDataForSave.excellence_committee_responsibilities;
  }
  if (!Array.isArray(dataToSave.school_staff_list)) {
    dataToSave.school_staff_list = freshInitialDataForSave.school_staff_list;
  }
  if (typeof dataToSave.plan_sources_text !== 'string') {
    dataToSave.plan_sources_text = freshInitialDataForSave.plan_sources_text;
  }
  if (!Array.isArray(dataToSave.ranked_school_aspects)) {
    dataToSave.ranked_school_aspects = freshInitialDataForSave.ranked_school_aspects;
  }
  if (typeof dataToSave.detailed_school_aspects !== 'object' || dataToSave.detailed_school_aspects === null) {
    dataToSave.detailed_school_aspects = freshInitialDataForSave.detailed_school_aspects;
  }
  if (typeof dataToSave.self_assessment_domains_notes !== 'object' || dataToSave.self_assessment_domains_notes === null) {
    dataToSave.self_assessment_domains_notes = freshInitialDataForSave.self_assessment_domains_notes;
  }
  if (!Array.isArray(dataToSave.beneficiaries_data)) {
    dataToSave.beneficiaries_data = freshInitialDataForSave.beneficiaries_data;
  }
  if (typeof dataToSave.general_strategic_goals_text !== 'string') {
    dataToSave.general_strategic_goals_text = freshInitialDataForSave.general_strategic_goals_text;
  }
  if (typeof dataToSave.stage_specific_goals_data !== 'object' || dataToSave.stage_specific_goals_data === null) {
    dataToSave.stage_specific_goals_data = freshInitialDataForSave.stage_specific_goals_data;
  }
  if (typeof dataToSave.implementation_strategies_text !== 'string') {
    dataToSave.implementation_strategies_text = freshInitialDataForSave.implementation_strategies_text;
  }
  if (!Array.isArray(dataToSave.plan_implementation_monitoring)) {
    dataToSave.plan_implementation_monitoring = freshInitialDataForSave.plan_implementation_monitoring;
  }

  if (!Array.isArray(dataToSave.programs_initiatives)) {
    dataToSave.programs_initiatives = freshInitialDataForSave.programs_initiatives;
  }

  if (!dataToSave.tech_strategy || typeof dataToSave.tech_strategy !== 'object') {
    dataToSave.tech_strategy = freshInitialDataForSave.tech_strategy;
  } else {
      dataToSave.tech_strategy.goals = Array.isArray(dataToSave.tech_strategy.goals) ? dataToSave.tech_strategy.goals : [];
      dataToSave.tech_strategy.tools = Array.isArray(dataToSave.tech_strategy.tools) ? dataToSave.tech_strategy.tools : [];
      dataToSave.tech_strategy.kpis = Array.isArray(dataToSave.tech_strategy.kpis) ? dataToSave.tech_strategy.kpis : [];
  }

  if (!dataToSave.swot_analysis || typeof dataToSave.swot_analysis !== 'object') {
    dataToSave.swot_analysis = freshInitialDataForSave.swot_analysis;
  } else {
    ['strengths', 'weaknesses', 'opportunities', 'threats'].forEach(category => {
      if (!dataToSave.swot_analysis[category] || typeof dataToSave.swot_analysis[category] !== 'object') {
        dataToSave.swot_analysis[category] = freshInitialDataForSave.swot_analysis[category];
      } else {
        dataToSave.swot_analysis[category].selected = dataToSave.swot_analysis[category].selected || [];
        dataToSave.swot_analysis[category].custom = (dataToSave.swot_analysis[category].custom || ['']).filter(c => typeof c === 'string');
      }
    });
    if (typeof dataToSave.swot_analysis.strategic_visions !== 'string') {
      dataToSave.swot_analysis.strategic_visions = '';
    }
  }
  
  if (!dataToSave.ethics_charter || typeof dataToSave.ethics_charter !== 'object') {
    dataToSave.ethics_charter = freshInitialDataForSave.ethics_charter;
  } else {
    dataToSave.ethics_charter.charter_text = typeof dataToSave.ethics_charter.charter_text === 'string' ? dataToSave.ethics_charter.charter_text : '';
    dataToSave.ethics_charter.core_values = Array.isArray(dataToSave.ethics_charter.core_values) ? dataToSave.ethics_charter.core_values.map(cv => ({
      name: typeof cv.name === 'string' ? cv.name : '',
      description: typeof cv.description === 'string' ? cv.description : '',
      isCustom: typeof cv.isCustom === 'boolean' ? cv.isCustom : false,
    })) : [];
  }

  if (!Array.isArray(dataToSave.strategic_goals)) {
      dataToSave.strategic_goals = freshInitialDataForSave.strategic_goals;
  } else {
      dataToSave.strategic_goals = dataToSave.strategic_goals.map(domain => ({
          ...domain,
          objectives: Array.isArray(domain.objectives) ? domain.objectives.map(obj => ({
              ...obj,
              kpis: Array.isArray(obj.kpis) ? obj.kpis : [],
              required_resources: Array.isArray(obj.required_resources) ? obj.required_resources.map(res => ({
                  name: typeof res.name === 'string' ? res.name : '',
                  selected: typeof res.selected === 'boolean' ? res.selected : false,
              })) : []
          })) : []
      }));
  }

  if (!Array.isArray(dataToSave.partnerships)) {
      dataToSave.partnerships = freshInitialDataForSave.partnerships;
  }
  
  if (!Array.isArray(dataToSave.risks_management)) {
      dataToSave.risks_management = freshInitialDataForSave.risks_management;
  }
  
  if (!dataToSave.staff_development || typeof dataToSave.staff_development !== 'object') {
      dataToSave.staff_development = freshInitialDataForSave.staff_development;
  }
  
  if (!dataToSave.evaluation_monitoring || typeof dataToSave.evaluation_monitoring !== 'object') {
      dataToSave.evaluation_monitoring = freshInitialDataForSave.evaluation_monitoring;
  }

  if (typeof dataToSave.school_facilities !== 'object' || dataToSave.school_facilities === null) {
    dataToSave.school_facilities = freshInitialDataForSave.school_facilities;
  }

  if (typeof dataToSave.school_formations !== 'object' || dataToSave.school_formations === null) {
    dataToSave.school_formations = freshInitialDataForSave.school_formations;
  } else {
    Object.keys(dataToSave.school_formations).forEach(key => {
        if (dataToSave.school_formations[key] === undefined || dataToSave.school_formations[key] === null || dataToSave.school_formations[key] === '') {
            dataToSave.school_formations[key] = '0'; 
        } else {
            dataToSave.school_formations[key] = String(parseInt(dataToSave.school_formations[key], 10) || 0);
        }
    });
  }


  if (!Array.isArray(dataToSave.student_distribution_by_stage)) {
    dataToSave.student_distribution_by_stage = freshInitialDataForSave.student_distribution_by_stage;
  } else {
    dataToSave.student_distribution_by_stage = dataToSave.student_distribution_by_stage.map(entry => ({
      stage: typeof entry.stage === 'string' ? entry.stage : '',
      student_count: (typeof entry.student_count === 'number' || typeof entry.student_count === 'string') ? parseInt(String(entry.student_count).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      id: entry.id || Date.now() 
    }));
  }
  
  if (typeof dataToSave.education_department_other !== 'string') {
    dataToSave.education_department_other = freshInitialDataForSave.education_department_other;
  }
  if (dataToSave.education_department !== 'other') {
    dataToSave.education_department_other = '';
  }

  delete dataToSave.education_office;

  return dataToSave;
};