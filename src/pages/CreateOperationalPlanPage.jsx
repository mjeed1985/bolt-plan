<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { PLAN_SECTIONS } from '@/lib/operationalPlanConstants';
import { useOperationalPlan } from '@/hooks/useOperationalPlan';

=======
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { PLAN_SECTIONS } from '@/lib/operationalPlanConstants';
import { getInitialPlanData, validatePlanData } from '@/utils/planDataHelpers';

// Import all section components
>>>>>>> cd51de4 (initial push)
import PlanHeader from '@/components/operational-plan/PlanHeader';
import PlanNavigation from '@/components/operational-plan/PlanNavigation';
import BasicInfoSection from '@/components/operational-plan/BasicInfoSection';
import PlanStructureTeamSection from '@/components/operational-plan/PlanStructureTeamSection';
import SchoolExcellenceCommitteeSection from '@/components/operational-plan/SchoolExcellenceCommitteeSection';
import EducationStrategicGoalsSection from '@/components/operational-plan/EducationStrategicGoalsSection';
import SchoolStaffSection from '@/components/operational-plan/SchoolStaffSection';
import PlanSourcesSection from '@/components/operational-plan/PlanSourcesSection';
import SchoolAspectsPrioritizationSection from '@/components/operational-plan/SchoolAspectsPrioritizationSection';
import SelfAssessmentBeneficiariesSection from '@/components/operational-plan/SelfAssessmentBeneficiariesSection';
import ProgramsSection from '@/components/operational-plan/ProgramsSection';
import TechStrategySection from '@/components/operational-plan/TechStrategySection';
import PlanImplementationMonitoringSection from '@/components/operational-plan/PlanImplementationMonitoringSection';
import SwotAnalysisSection from '@/components/operational-plan/SwotAnalysisSection.jsx';
import EthicsSection from '@/components/operational-plan/EthicsSection.jsx';
import GoalsSection from '@/components/operational-plan/GoalsSection.jsx';
import RisksManagementSection from '@/components/operational-plan/RisksManagementSection.jsx';
import PartnershipsSection from '@/components/operational-plan/PartnershipsSection.jsx';
import StaffDevelopmentSection from '@/components/operational-plan/StaffDevelopmentSection.jsx';
import EvaluationSection from '@/components/operational-plan/EvaluationSection.jsx';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Loader2 as PageLoader } from 'lucide-react';

const CreateOperationalPlanPage = () => {
<<<<<<< HEAD
  const {
    planId,
    planData,
    loading,
    isPlanLoaded,
    currentSectionIndex,
    setCurrentSectionIndex,
    savePlan,
    handlePlanDataChange,
    handleSectionSpecificChange,
  } = useOperationalPlan();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [planTemplateUrl, setPlanTemplateUrl] = useState(null);

  const handleNextSection = () => {
    if (currentSectionIndex < PLAN_SECTIONS.length - 1) {
      savePlan(planData.status, false).then((savedPlan) => {
=======
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [isPlanLoaded, setIsPlanLoaded] = useState(false);
  const [planTemplateUrl, setPlanTemplateUrl] = useState(null);

  const initialPlanDataMemo = useMemo(() => getInitialPlanData(), []);
  const [planData, setPlanData] = useState(initialPlanDataMemo);

  const loadPlanData = useCallback(async (id) => {
    if (!user) return;
    setLoading(true);
    setIsPlanLoaded(false);
    try {
      const { data, error } = await supabase
        .from('operational_plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "الخطة غير موجودة",
            description: "لم يتم العثور على الخطة المطلوبة أو لا تملك صلاحية الوصول إليها.",
            variant: "destructive",
          });
          navigate('/operational-plans');
          return;
        }
        throw error;
      }
      
      if (data) {
        const freshInitialData = getInitialPlanData();
        
        const mergedSwotAnalysis = {
          strengths: (data.swot_analysis && data.swot_analysis.strengths) 
                       ? { selected: data.swot_analysis.strengths.selected || [], custom: data.swot_analysis.strengths.custom || [''] } 
                       : freshInitialData.swot_analysis.strengths,
          weaknesses: (data.swot_analysis && data.swot_analysis.weaknesses) 
                       ? { selected: data.swot_analysis.weaknesses.selected || [], custom: data.swot_analysis.weaknesses.custom || [''] } 
                       : freshInitialData.swot_analysis.weaknesses,
          opportunities: (data.swot_analysis && data.swot_analysis.opportunities) 
                       ? { selected: data.swot_analysis.opportunities.selected || [], custom: data.swot_analysis.opportunities.custom || [''] } 
                       : freshInitialData.swot_analysis.opportunities,
          threats: (data.swot_analysis && data.swot_analysis.threats) 
                       ? { selected: data.swot_analysis.threats.selected || [], custom: data.swot_analysis.threats.custom || [''] } 
                       : freshInitialData.swot_analysis.threats,
          strategic_visions: (data.swot_analysis && data.swot_analysis.strategic_visions) 
                             ? data.swot_analysis.strategic_visions 
                             : freshInitialData.swot_analysis.strategic_visions,
        };

        const mergedEthicsCharter = {
          charter_text: (data.ethics_charter && data.ethics_charter.charter_text) 
                        ? data.ethics_charter.charter_text 
                        : freshInitialData.ethics_charter.charter_text,
          core_values: (data.ethics_charter && Array.isArray(data.ethics_charter.core_values))
                       ? data.ethics_charter.core_values
                       : freshInitialData.ethics_charter.core_values,
        };
        
        const mergedTechStrategy = {
            ...freshInitialData.tech_strategy,
            ...(data.tech_strategy || {}),
            goals: (data.tech_strategy && Array.isArray(data.tech_strategy.goals)) ? data.tech_strategy.goals : freshInitialData.tech_strategy.goals,
            tools: (data.tech_strategy && Array.isArray(data.tech_strategy.tools)) ? data.tech_strategy.tools : freshInitialData.tech_strategy.tools,
            kpis: (data.tech_strategy && Array.isArray(data.tech_strategy.kpis)) ? data.tech_strategy.kpis : freshInitialData.tech_strategy.kpis,
        };

        setPlanData({ 
          ...freshInitialData, 
          ...data, 
          planning_committee_data: data.planning_committee_data && Array.isArray(data.planning_committee_data) ? data.planning_committee_data : freshInitialData.planning_committee_data,
          team_responsibilities_data: data.team_responsibilities_data || freshInitialData.team_responsibilities_data,
          excellence_committee_members: data.excellence_committee_members && Array.isArray(data.excellence_committee_members) ? data.excellence_committee_members : freshInitialData.excellence_committee_members,
          excellence_committee_responsibilities: data.excellence_committee_responsibilities || freshInitialData.excellence_committee_responsibilities,
          school_staff_list: data.school_staff_list && Array.isArray(data.school_staff_list) ? data.school_staff_list : freshInitialData.school_staff_list,
          plan_sources_text: data.plan_sources_text || freshInitialData.plan_sources_text,
          ranked_school_aspects: data.ranked_school_aspects && Array.isArray(data.ranked_school_aspects) ? data.ranked_school_aspects : freshInitialData.ranked_school_aspects,
          detailed_school_aspects: data.detailed_school_aspects || freshInitialData.detailed_school_aspects,
          self_assessment_domains_notes: data.self_assessment_domains_notes || freshInitialData.self_assessment_domains_notes,
          beneficiaries_data: data.beneficiaries_data && Array.isArray(data.beneficiaries_data) ? data.beneficiaries_data : freshInitialData.beneficiaries_data,
          general_strategic_goals_text: data.general_strategic_goals_text || freshInitialData.general_strategic_goals_text,
          stage_specific_goals_data: data.stage_specific_goals_data || freshInitialData.stage_specific_goals_data,
          implementation_strategies_text: data.implementation_strategies_text || freshInitialData.implementation_strategies_text,
          plan_implementation_monitoring: data.plan_implementation_monitoring && Array.isArray(data.plan_implementation_monitoring) ? data.plan_implementation_monitoring : freshInitialData.plan_implementation_monitoring,
          swot_analysis: mergedSwotAnalysis,
          ethics_charter: mergedEthicsCharter,
          strategic_goals: data.strategic_goals && Array.isArray(data.strategic_goals) ? data.strategic_goals : freshInitialData.strategic_goals,
          programs_initiatives: data.programs_initiatives && Array.isArray(data.programs_initiatives) ? data.programs_initiatives : freshInitialData.programs_initiatives,
          tech_strategy: mergedTechStrategy,
          risks_management: data.risks_management && Array.isArray(data.risks_management) ? data.risks_management : freshInitialData.risks_management,
          partnerships: data.partnerships && Array.isArray(data.partnerships) ? data.partnerships : freshInitialData.partnerships,
          staff_development: data.staff_development || freshInitialData.staff_development,
          evaluation_monitoring: data.evaluation_monitoring || freshInitialData.evaluation_monitoring,
          teacher_count: data.teacher_count ?? 0,
          student_count: data.student_count ?? 0,
          admin_count: data.admin_count ?? 0,
          classroom_count: data.classroom_count ?? 0,
          multi_year_plan_duration: data.multi_year_plan_duration === undefined ? null : data.multi_year_plan_duration,
        });
      } else {
        toast({
            title: "الخطة غير موجودة",
            description: "لم يتم العثور على بيانات الخطة المطلوبة.",
            variant: "destructive",
        });
        navigate('/operational-plans');
        return;
      }
    } catch (error) {
      console.error('Error loading plan:', error);
      toast({
        title: "خطأ في التحميل",
        description: `حدث خطأ أثناء تحميل بيانات الخطة: ${error.message}`,
        variant: "destructive"
      });
      navigate('/operational-plans');
    } finally {
      setLoading(false);
      setIsPlanLoaded(true);
    }
  }, [user, toast, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (planId) {
      loadPlanData(planId);
    } else {
      setPlanData(initialPlanDataMemo);
      setIsPlanLoaded(true);
      setLoading(false); 
    }
  }, [user, navigate, planId, loadPlanData, initialPlanDataMemo]);

  const handlePlanDataChange = (newData) => {
    setPlanData(prevData => ({ ...prevData, ...newData }));
  };
  
  const handleSectionSpecificChange = (sectionKey, data) => {
    setPlanData(prevData => ({
      ...prevData,
      [sectionKey]: data
    }));
  };

  const savePlan = useCallback(async (newStatus = planData.status, showSuccessToast = true) => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لحفظ الخطة.",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    if (showSuccessToast) { 
        toast({
            title: "جاري الحفظ...",
            description: "يتم الآن حفظ بيانات الخطة التشغيلية.",
        });
    }

    const dataToSave = { ...planData, user_id: user.id, status: newStatus };
    
    Object.keys(dataToSave).forEach(key => {
      if (dataToSave[key] === undefined) {
        dataToSave[key] = null;
      }
    });
    
    if (dataToSave.plan_nature !== 'multi_year') {
      dataToSave.multi_year_plan_duration = null;
    }
    
    // Validate and clean data
    const validatedData = validatePlanData(dataToSave);

    try {
      let result;
      let operationSucceeded = false;
      const currentPlanId = planData.id || planId; 

      if (currentPlanId) {
        const { data, error } = await supabase
          .from('operational_plans')
          .update(validatedData)
          .eq('id', currentPlanId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        operationSucceeded = true;
      } else {
        const { data, error } = await supabase
          .from('operational_plans')
          .insert(validatedData)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        operationSucceeded = true;
        
        if (result?.id) {
          setPlanData(prev => ({...prev, id: result.id})); 
          if (window.location.pathname.includes('/new')) {
            navigate(`/operational-plans/edit/${result.id}`, { replace: true });
          }
        }
      }
      
      if(operationSucceeded && showSuccessToast) {
        toast({
          title: "تم حفظ البيانات بنجاح",
          description: "تم حفظ بيانات الخطة التشغيلية.",
          action: <CheckCircle className="text-green-500" />,
        });
      }
      return result;

    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "حدث خطأ أثناء الحفظ",
        description: `فشل حفظ الخطة: ${error.message}`,
        variant: "destructive",
        action: <AlertTriangle className="text-red-500" />,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, planData, planId, navigate, toast]);

  const handleNextSection = () => {
    if (currentSectionIndex < PLAN_SECTIONS.length - 1) {
      toast({ title: "جاري الحفظ والانتقال..." });
      savePlan(planData.status, false).then((savedPlan) => { 
>>>>>>> cd51de4 (initial push)
        if (savedPlan) {
          setCurrentSectionIndex(prev => prev + 1);
          window.scrollTo(0, 0);
          toast({
            title: "تم الحفظ والانتقال بنجاح",
            description: `انتقلت إلى قسم: ${PLAN_SECTIONS[currentSectionIndex + 1].title}`,
            action: <CheckCircle className="text-green-500" />,
          });
        } else {
<<<<<<< HEAD
          toast({
=======
           toast({
>>>>>>> cd51de4 (initial push)
            title: "فشل الانتقال",
            description: "لم يتم حفظ البيانات، لذا لا يمكن الانتقال للقسم التالي.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
<<<<<<< HEAD
      savePlan(planData.status, false).then((savedPlan) => {
        if (savedPlan) {
          setCurrentSectionIndex(prev => prev - 1);
          window.scrollTo(0, 0);
          toast({
            title: "تم الحفظ والانتقال بنجاح",
            description: `انتقلت إلى قسم: ${PLAN_SECTIONS[currentSectionIndex - 1].title}`,
            action: <CheckCircle className="text-green-500" />,
          });
        } else {
          toast({
=======
      toast({ title: "جاري الحفظ والانتقال..." });
       savePlan(planData.status, false).then((savedPlan) => { 
        if (savedPlan) {
          setCurrentSectionIndex(prev => prev - 1);
          window.scrollTo(0, 0);
           toast({
            title: "تم الحفظ والانتقال بنجاح",
            description: `انتقلت إلى قسم: ${PLAN_SECTIONS[currentSectionIndex -1].title}`,
            action: <CheckCircle className="text-green-500" />,
          });
        } else {
           toast({
>>>>>>> cd51de4 (initial push)
            title: "فشل الانتقال",
            description: "لم يتم حفظ البيانات، لذا لا يمكن الانتقال للقسم السابق.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleFinishPlan = () => {
    savePlan('completed', true).then((savedPlan) => {
      if (savedPlan && savedPlan.id) {
        toast({
<<<<<<< HEAD
          title: "تم إنشاء الخطة بنجاح!",
          description: "يتم الآن توجيهك لملخص الخطة.",
          action: <CheckCircle className="text-green-500" />,
=======
            title: "تم إنشاء الخطة بنجاح!",
            description: "يتم الآن توجيهك لملخص الخطة.",
            action: <CheckCircle className="text-green-500" />,
>>>>>>> cd51de4 (initial push)
        });
        navigate(`/operational-plans/summary/${savedPlan.id}`);
      } else {
        toast({
<<<<<<< HEAD
          title: "فشل إنشاء الخطة",
          description: "حدث خطأ أثناء محاولة حفظ وإنشاء الخطة.",
          variant: "destructive",
=======
            title: "فشل إنشاء الخطة",
            description: "حدث خطأ أثناء محاولة حفظ وإنشاء الخطة.",
            variant: "destructive",
>>>>>>> cd51de4 (initial push)
        });
      }
    });
  };
<<<<<<< HEAD

  const renderSectionContent = () => {
    if (loading && !isPlanLoaded && planId) {
=======
  
  const renderSectionContent = () => {
    if (loading && !isPlanLoaded && planId) { 
>>>>>>> cd51de4 (initial push)
      return (
        <div className="flex justify-center items-center h-64">
          <PageLoader className="animate-spin h-12 w-12 text-indigo-500" />
          <p className="mr-3 text-lg">جاري تحميل بيانات الخطة...</p>
        </div>
      );
    }
<<<<<<< HEAD
    if (!isPlanLoaded) {
      return (
=======
    if (!isPlanLoaded && planId) {
         return (
>>>>>>> cd51de4 (initial push)
        <div className="flex justify-center items-center h-64">
          <PageLoader className="animate-spin h-12 w-12 text-indigo-500" />
          <p className="mr-3 text-lg">جاري تهيئة بيانات الخطة...</p>
        </div>
      );
    }
<<<<<<< HEAD

    const currentSection = PLAN_SECTIONS[currentSectionIndex];

    switch (currentSection.id) {
      case 'info':
        return <BasicInfoSection planData={planData} onPlanDataChange={handlePlanDataChange} />;
      case 'structure_team':
        return <PlanStructureTeamSection planData={planData} onChange={handlePlanDataChange} />;
      case 'school_excellence_committee':
        return <SchoolExcellenceCommitteeSection planData={planData} onChange={handlePlanDataChange} />;
      case 'education_strategic_goals':
        return <EducationStrategicGoalsSection planData={planData} onChange={handlePlanDataChange} />;
      case 'school_staff_data':
        return <SchoolStaffSection planData={planData} onChange={handlePlanDataChange} />;
      case 'plan_sources':
        return <PlanSourcesSection planData={planData} onChange={handlePlanDataChange} />;
      case 'school_aspects_prioritization':
        return <SchoolAspectsPrioritizationSection planData={planData} onChange={handlePlanDataChange} />;
      case 'self_assessment_beneficiaries':
        return <SelfAssessmentBeneficiariesSection planData={planData} onChange={handlePlanDataChange} />;
      case 'swot':
        return <SwotAnalysisSection swotAnalysis={planData.swot_analysis} onChange={(data) => handleSectionSpecificChange('swot_analysis', data)} planData={planData} />;
      case 'ethics':
        return <EthicsSection ethicsCharter={planData.ethics_charter} onChange={(data) => handleSectionSpecificChange('ethics_charter', data)} planData={planData} />;
      case 'goals':
        return <GoalsSection strategicGoals={planData.strategic_goals || []} onChange={(data) => handleSectionSpecificChange('strategic_goals', data)} />;
      case 'programs':
        return <ProgramsSection programs={planData.programs_initiatives} onChange={(data) => handleSectionSpecificChange('programs_initiatives', data)} />;
      case 'tech':
        return <TechStrategySection techStrategy={planData.tech_strategy} onChange={(data) => handleSectionSpecificChange('tech_strategy', data)} planData={planData} />;
      case 'plan_monitoring':
        return <PlanImplementationMonitoringSection planData={planData} onChange={handlePlanDataChange} />;
      case 'risks':
        return <RisksManagementSection risksManagement={planData.risks_management} onChange={(data) => handleSectionSpecificChange('risks_management', data)} />;
      case 'partnerships':
        return <PartnershipsSection partnerships={planData.partnerships} onChange={(data) => handleSectionSpecificChange('partnerships', data)} planData={planData} />;
      case 'staff':
        return <StaffDevelopmentSection staffDevelopment={planData.staff_development} onChange={(data) => handleSectionSpecificChange('staff_development', data)} />;
      case 'evaluation':
        return <EvaluationSection evaluationMonitoring={planData.evaluation_monitoring} onChange={(data) => handleSectionSpecificChange('evaluation_monitoring', data)} />;
=======
    if (!isPlanLoaded && !planId) {
        return (
         <div className="flex justify-center items-center h-64">
          <p className="mr-3 text-lg">جاري تهيئة خطة جديدة...</p>
        </div>
      );
    }

    const currentSection = PLAN_SECTIONS[currentSectionIndex];
    
    switch (currentSection.id) {
      case 'info':
        return <BasicInfoSection 
                  planData={planData} 
                  onPlanDataChange={handlePlanDataChange}
               />;
      case 'structure_team':
        return <PlanStructureTeamSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'school_excellence_committee':
        return <SchoolExcellenceCommitteeSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'education_strategic_goals':
        return <EducationStrategicGoalsSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'school_staff_data':
        return <SchoolStaffSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'plan_sources':
        return <PlanSourcesSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'school_aspects_prioritization':
        return <SchoolAspectsPrioritizationSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'self_assessment_beneficiaries':
        return <SelfAssessmentBeneficiariesSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'swot':
        return <SwotAnalysisSection 
                  swotAnalysis={planData.swot_analysis} 
                  onChange={(data) => handleSectionSpecificChange('swot_analysis', data)}
                  planData={planData} 
               />;
      case 'ethics':
        return <EthicsSection 
                  ethicsCharter={planData.ethics_charter} 
                  onChange={(data) => handleSectionSpecificChange('ethics_charter', data)} 
                  planData={planData}
               />;
      case 'goals':
        return <GoalsSection 
                  strategicGoals={planData.strategic_goals || []} 
                  onChange={(data) => handleSectionSpecificChange('strategic_goals', data)} 
               />;
      case 'programs':
        return <ProgramsSection 
                  programs={planData.programs_initiatives} 
                  onChange={(data) => handleSectionSpecificChange('programs_initiatives', data)} 
               />;
      case 'tech':
        return <TechStrategySection 
                  techStrategy={planData.tech_strategy} 
                  onChange={(data) => handleSectionSpecificChange('tech_strategy', data)}
                  planData={planData}
               />;
      case 'plan_monitoring':
        return <PlanImplementationMonitoringSection
                  planData={planData}
                  onChange={handlePlanDataChange}
                />;
      case 'risks':
        return <RisksManagementSection 
                  risksManagement={planData.risks_management} 
                  onChange={(data) => handleSectionSpecificChange('risks_management', data)}
               />;
      case 'partnerships':
        return <PartnershipsSection 
                  partnerships={planData.partnerships} 
                  onChange={(data) => handleSectionSpecificChange('partnerships', data)}
                  planData={planData} 
               />;
      case 'staff':
        return <StaffDevelopmentSection 
                  staffDevelopment={planData.staff_development} 
                  onChange={(data) => handleSectionSpecificChange('staff_development', data)}
               />;
      case 'evaluation':
        return <EvaluationSection 
                  evaluationMonitoring={planData.evaluation_monitoring} 
                  onChange={(data) => handleSectionSpecificChange('evaluation_monitoring', data)}
               />;
>>>>>>> cd51de4 (initial push)
      default:
        return <p className="text-center text-gray-500">محتوى هذا القسم ({PLAN_SECTIONS[currentSectionIndex].title}) سيتم إضافته قريباً.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 p-4 sm:p-8 arabic-text">
<<<<<<< HEAD
      <PlanHeader
        planId={planData.id || planId}
        planName={planData.plan_name || 'خطة تشغيلية جديدة'}
        currentSectionIndex={currentSectionIndex}
=======
      <PlanHeader 
        planId={planData.id || planId} 
        planName={planData.plan_name || 'خطة تشغيلية جديدة'} 
        currentSectionIndex={currentSectionIndex} 
>>>>>>> cd51de4 (initial push)
        totalSections={PLAN_SECTIONS.length}
        onNavigateHome={() => navigate('/operational-plans')}
        onTemplateUploadSuccess={(url) => setPlanTemplateUrl(url)}
      />

      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl sm:text-2xl text-indigo-700">
            {PLAN_SECTIONS[currentSectionIndex].title}
          </CardTitle>
          <CardDescription>يرجى ملء الحقول أدناه بعناية.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {renderSectionContent()}
          </motion.div>
        </CardContent>
      </Card>

      <PlanNavigation
        currentSectionIndex={currentSectionIndex}
        totalSections={PLAN_SECTIONS.length}
        onPrev={handlePrevSection}
        onNext={handleNextSection}
        onFinish={handleFinishPlan}
        loading={loading}
      />
    </div>
  );
};

export default CreateOperationalPlanPage;