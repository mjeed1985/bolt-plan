import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { PLAN_SECTIONS } from '@/lib/operationalPlanConstants';
import { useOperationalPlan } from '@/hooks/useOperationalPlan';

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
        if (savedPlan) {
          setCurrentSectionIndex(prev => prev + 1);
          window.scrollTo(0, 0);
          toast({
            title: "تم الحفظ والانتقال بنجاح",
            description: `انتقلت إلى قسم: ${PLAN_SECTIONS[currentSectionIndex + 1].title}`,
            action: <CheckCircle className="text-green-500" />,
          });
        } else {
          toast({
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
          title: "تم إنشاء الخطة بنجاح!",
          description: "يتم الآن توجيهك لملخص الخطة.",
          action: <CheckCircle className="text-green-500" />,
        });
        navigate(`/operational-plans/summary/${savedPlan.id}`);
      } else {
        toast({
          title: "فشل إنشاء الخطة",
          description: "حدث خطأ أثناء محاولة حفظ وإنشاء الخطة.",
          variant: "destructive",
        });
      }
    });
  };

  const renderSectionContent = () => {
    if (loading && !isPlanLoaded && planId) {
      return (
        <div className="flex justify-center items-center h-64">
          <PageLoader className="animate-spin h-12 w-12 text-indigo-500" />
          <p className="mr-3 text-lg">جاري تحميل بيانات الخطة...</p>
        </div>
      );
    }
    if (!isPlanLoaded) {
      return (
        <div className="flex justify-center items-center h-64">
          <PageLoader className="animate-spin h-12 w-12 text-indigo-500" />
          <p className="mr-3 text-lg">جاري تهيئة بيانات الخطة...</p>
        </div>
      );
    }

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
      default:
        return <p className="text-center text-gray-500">محتوى هذا القسم ({PLAN_SECTIONS[currentSectionIndex].title}) سيتم إضافته قريباً.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 p-4 sm:p-8 arabic-text">
      <PlanHeader
        planId={planData.id || planId}
        planName={planData.plan_name || 'خطة تشغيلية جديدة'}
        currentSectionIndex={currentSectionIndex}
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