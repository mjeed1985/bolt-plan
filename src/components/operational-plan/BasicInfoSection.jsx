import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info, Lightbulb, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { SCHOOL_STAGES } from '@/lib/operationalPlanConstants';

import SchoolDetailsCard from './basic-info-parts/SchoolDetailsCard';
import StaffAndStudentsCard from './basic-info-parts/StaffAndStudentsCard';
import SchoolFacilitiesCard from './basic-info-parts/SchoolFacilitiesCard';
import SchoolManagementCard from './basic-info-parts/SchoolManagementCard';
import PlanIntroductionPhilosophyCard from './basic-info-parts/PlanIntroductionPhilosophyCard';
import PlanGoalsVisionMissionCard from './basic-info-parts/PlanGoalsVisionMissionCard';
import PlanNatureDurationCard from './basic-info-parts/PlanNatureDurationCard';
import SchoolFormationsCard from './basic-info-parts/SchoolFormationsCard';

const BasicInfoSection = ({ planData, onPlanDataChange }) => {
  const { toast } = useToast();
  const [localPlanData, setLocalPlanData] = useState(planData);
  const [isGeneratingPhilosophy, setIsGeneratingPhilosophy] = useState(false);
  const [isGeneratingObjective, setIsGeneratingObjective] = useState(false);
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);
  const [isGeneratingIntroduction, setIsGeneratingIntroduction] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(null);
  const [apiKeyError, setApiKeyError] = useState(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-gemini-api-key');
        if (error) throw error;
        if (data && data.apiKey) {
          setGeminiApiKey(data.apiKey);
        } else {
          throw new Error("مفتاح API الخاص بـ Gemini غير موجود أو غير صالح.");
        }
      } catch (error) {
        console.error("Error fetching Gemini API key:", error);
        setApiKeyError(error.message || "خطأ في جلب مفتاح API الخاص بـ Gemini.");
        toast({
          title: "خطأ في جلب مفتاح API",
          description: "لم نتمكن من جلب مفتاح Gemini API. قد لا تعمل ميزات التوليد التلقائي.",
          variant: "destructive",
          duration: 7000,
        });
      }
    };
    fetchApiKey();
  }, [toast]);

  useEffect(() => {
    setLocalPlanData(planData);
  }, [planData]);

  const handleChange = (field, value) => {
    const updatedData = { ...localPlanData, [field]: value };
    if (field === 'education_department' && value !== 'other') {
      updatedData.education_department_other = ''; 
    }
    setLocalPlanData(updatedData);
    onPlanDataChange(updatedData);
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      handleChange(field, numValue);
    } else if (value === '' || value === null || value === undefined) {
      handleChange(field, 0);
    }
  };
  
  const handleFacilityChange = (facilityId, checked) => {
    const currentFacilities = localPlanData.school_facilities || {};
    let updatedFacilities;
    if (checked) {
      updatedFacilities = { ...currentFacilities, [facilityId]: '1' };
    } else {
      updatedFacilities = { ...currentFacilities };
      delete updatedFacilities[facilityId];
    }
    handleChange('school_facilities', updatedFacilities);
  };

  const handleFacilityCountChange = (facilityId, count) => {
    const updatedFacilities = {
      ...(localPlanData.school_facilities || {}),
      [facilityId]: count,
    };
    handleChange('school_facilities', updatedFacilities);
  };

  const handleFormationChange = (formationId, checked) => {
    const currentFormations = localPlanData.school_formations || {};
    let updatedFormations;
    if (checked) {
      updatedFormations = { ...currentFormations, [formationId]: '1' };
    } else {
      updatedFormations = { ...currentFormations };
      delete updatedFormations[formationId];
    }
    handleChange('school_formations', updatedFormations);
  };

  const handleFormationCountChange = (formationId, count) => {
    const updatedFormations = {
      ...(localPlanData.school_formations || {}),
      [formationId]: String(count),
    };
    handleChange('school_formations', updatedFormations);
  };


  const handleStudentDistributionChange = (index, field, value) => {
    const updatedDistribution = [...(localPlanData.student_distribution_by_stage || [])];
    updatedDistribution[index] = { ...updatedDistribution[index], [field]: value };
    handleChange('student_distribution_by_stage', updatedDistribution);
  };

  const addStudentDistributionEntry = () => {
    const newEntry = { stage: '', student_count: 0, id: Date.now() };
    const updatedDistribution = [...(localPlanData.student_distribution_by_stage || []), newEntry];
    handleChange('student_distribution_by_stage', updatedDistribution);
  };

  const removeStudentDistributionEntry = (index) => {
    const updatedDistribution = (localPlanData.student_distribution_by_stage || []).filter((_, i) => i !== index);
    handleChange('student_distribution_by_stage', updatedDistribution);
  };

  const generateAIText = async (field, setIsGenerating, promptGenerator, toastTitle) => {
    if (!geminiApiKey) {
      toast({
        title: "مفتاح API غير متوفر",
        description: apiKeyError || "مفتاح API الخاص بـ Gemini غير متاح. لا يمكن المتابعة مع التوليد التلقائي.",
        variant: "destructive",
        duration: 7000,
      });
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    toast({ title: `جاري توليد ${toastTitle}...`, description: "قد يستغرق هذا بضع لحظات." });
    
    const studentGenderText = localPlanData.student_gender_type === 'boys' ? 'الطلاب البنين' : localPlanData.student_gender_type === 'girls' ? 'الطالبات البنات' : 'الطلاب والطالبات';
    const schoolStageText = SCHOOL_STAGES.find(s => s.value === localPlanData.school_stage)?.label || 'المرحلة التعليمية';
    const schoolName = localPlanData.school_name_full || 'المدرسة';

    const prompt = promptGenerator(studentGenderText, schoolStageText, schoolName);
    
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      handleChange(field, text);
      toast({ title: `تم توليد ${toastTitle} بنجاح!`, variant: "success" });
    } catch (error) {
      console.error(`Error generating ${toastTitle}:`, error);
      toast({
        title: `خطأ في توليد ${toastTitle}`,
        description: error.message || "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePlanPhilosophyAI = () => {
    generateAIText(
      'plan_philosophy',
      setIsGeneratingPhilosophy,
      (studentGenderText, schoolStageText, schoolName) => `قم بصياغة فلسفة خطة تشغيلية لمدرسة (${schoolName}) تخدم ${studentGenderText} في ${schoolStageText}. يجب أن تركز الفلسفة على توفير تعليم نوعي، تنمية شاملة، بيئة محفزة، وشراكة مجتمعية.`,
      "فلسفة الخطة"
    );
  };

  const generatePlanObjectiveAI = () => {
    generateAIText(
      'plan_objective',
      setIsGeneratingObjective,
      (studentGenderText, schoolStageText, schoolName) => `
      قم بصياغة قائمة أهداف لخطة تشغيلية لمدرسة (${schoolName}) تخدم ${studentGenderText} في ${schoolStageText}. 
      يجب أن تكون الأهداف مشابهة جدًا للقائمة التالية من حيث المحتوى، النسب المئوية، والمجالات، مع تكييفها لتناسب المدرسة المذكورة:
      1. تطوير الأداء الإداري والمهني لمنسوبي المدرسة (التخطيط 3% - قيادة العملية التعليمية 5% - التطوير المؤسسي 6% - مجال الإدارة المدرسية 20%).
      2. تفعيل الشراكة الأسرية والمجتمعية (المجتمع المدرسي 6% - مجال الإدارة المدرسية 20%).
      3. بناء خبرات التعلم للطلبة في المهارات الأساسية (القراءة والرياضيات والعلوم والمهارات الحياتية) (بناء خبرات التعلم 21% - مجال التعليم والتعلم 30%).
      4. تطوير أساليب التعليم والتقويم وتوفير أساليب وأنشطة تعلم متنوعة مع الاهتمام بالرخصة المهنية للمعلمين (تقويم التعلم 9% - مجال التعليم والتعلم 30%).
      5. تحسين نتائج المدرسة في التحصيل الدراسي وفي الاختبارات الوطنية والدولية (التحصيلي-القدرات) بنسبة 5% كل عام دراسي (مجال نواتج التعلم 40%).
      6. ترسيخ القيم والسلوكيات والاتجاهات المرغوبة (البناء المتكامل للطالبات/للطلاب) والتطور الشخصي والصحي والاجتماعي (8% - مجال نواتج التعلم 40%).
      7. توفير بيئة مدرسية آمنة ومحفزة وجاذبة للطلبة (المبنى المدرسي 5% - الأمن والسلامة 5% - مجال البيئة المدرسية 10%).
      اجعل النص المولّد كقائمة مرقمة.`,
      "أهداف الخطة التشغيلية"
    );
  };
  
  const generateSchoolVisionAI = () => {
    generateAIText(
      'school_vision',
      setIsGeneratingVision,
      (studentGenderText, schoolStageText, schoolName) => `قم بصياغة رؤية طموحة لمدرسة (${schoolName}) تخدم ${studentGenderText} في ${schoolStageText}. يجب أن تركز الرؤية على الريادة التعليمية، التميز الأكاديمي، الابتكار، وإعداد جيل واعد.`,
      "رؤية المدرسة"
    );
  };

  const generateSchoolMissionAI = () => {
    generateAIText(
      'school_mission',
      setIsGeneratingMission,
      (studentGenderText, schoolStageText, schoolName) => `قم بصياغة رسالة واضحة لمدرسة (${schoolName}) تخدم ${studentGenderText} في ${schoolStageText}. يجب أن توضح الرسالة التزام المدرسة بتوفير تعليم عالي الجودة، بيئة آمنة وداعمة، وتنمية مهارات الطلاب لمواجهة تحديات المستقبل.`,
      "رسالة المدرسة"
    );
  };
  
  const generateSchoolIntroductionAI = () => {
    generateAIText(
      'school_introduction',
      setIsGeneratingIntroduction,
      (studentGenderText, schoolStageText, schoolName) => `اكتب مقدمة تعريفية شاملة عن مدرسة (${schoolName}) التي تخدم ${studentGenderText} في ${schoolStageText}. يجب أن تتضمن المقدمة نبذة عن تاريخ المدرسة (إذا أمكن)، موقعها، أبرز مرافقها، فلسفتها التعليمية، وأهم إنجازاتها أو ما يميزها.`,
      "مقدمة عن المدرسة"
    );
  };

  const renderField = (id, label, placeholder, type = "text", icon, options = [], component = "input", rows = 3) => {
    const IconComponent = icon || Info;
    const value = localPlanData[id] || (type === 'number' ? 0 : '');

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700">
          <IconComponent className="w-4 h-4 mr-2 text-indigo-600" />
          {label}
        </Label>
        {component === "input" && (
          <Input
            type={type}
            id={id}
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
        )}
        {component === "number_stepper" && (
          <NumberStepper
            id={id}
            value={Number(value)} 
            onChange={(val) => handleNumberChange(id, val)}
            min={0}
            max={10000}
          />
        )}
        {component === "textarea" && (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => handleChange(id, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full"
          />
        )}
        {component === "select" && (
          <Select value={value} onValueChange={(val) => handleChange(id, val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };
  
  const renderAIGeneratorField = (id, label, placeholder, value, onGenerate, isLoading, icon, rows = 4) => {
    const IconComponent = icon || Lightbulb;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor={id} className="flex items-center text-sm font-medium text-gray-700">
            <IconComponent className="w-4 h-4 mr-2 text-teal-600" />
            {label}
          </Label>
          <Button onClick={onGenerate} disabled={isLoading || !geminiApiKey || !!apiKeyError} variant="outline" size="sm" className="text-xs border-teal-500 text-teal-600 hover:bg-teal-50">
            {isLoading ? <Loader2 className="ml-2 h-3 w-3 animate-spin" /> : <RefreshCw className="ml-2 h-3 w-3" />}
            {isLoading ? 'جاري التوليد...' : 'توليد تلقائي'}
          </Button>
        </div>
        <Textarea
          id={id}
          value={value}
          onChange={(e) => handleChange(id, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full"
        />
         {apiKeyError && !geminiApiKey && (
            <p className="text-xs text-red-600 mt-1">
              {apiKeyError}
            </p>
          )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <SchoolDetailsCard 
        localPlanData={localPlanData}
        handleChange={handleChange}
        renderField={renderField}
      />
      <StaffAndStudentsCard
        localPlanData={localPlanData}
        handleChange={handleChange}
        handleNumberChange={handleNumberChange}
        handleStudentDistributionChange={handleStudentDistributionChange}
        addStudentDistributionEntry={addStudentDistributionEntry}
        removeStudentDistributionEntry={removeStudentDistributionEntry}
        renderField={renderField}
      />
      <SchoolFormationsCard
        localPlanData={localPlanData}
        handleFormationChange={handleFormationChange}
        handleFormationCountChange={handleFormationCountChange}
      />
      <SchoolFacilitiesCard
        localPlanData={localPlanData}
        handleFacilityChange={handleFacilityChange}
        handleFacilityCountChange={handleFacilityCountChange}
      />
      <SchoolManagementCard renderField={renderField} />
      <PlanIntroductionPhilosophyCard
        localPlanData={localPlanData}
        renderAIGeneratorField={renderAIGeneratorField}
        generateSchoolIntroductionAI={generateSchoolIntroductionAI}
        isGeneratingIntroduction={isGeneratingIntroduction}
        generatePlanPhilosophyAI={generatePlanPhilosophyAI}
        isGeneratingPhilosophy={isGeneratingPhilosophy}
      />
      <PlanGoalsVisionMissionCard
        localPlanData={localPlanData}
        renderAIGeneratorField={renderAIGeneratorField}
        generatePlanObjectiveAI={generatePlanObjectiveAI}
        isGeneratingObjective={isGeneratingObjective}
        generateSchoolVisionAI={generateSchoolVisionAI}
        isGeneratingVision={isGeneratingVision}
        generateSchoolMissionAI={generateSchoolMissionAI}
        isGeneratingMission={isGeneratingMission}
      />
      <PlanNatureDurationCard
        localPlanData={localPlanData}
        renderField={renderField}
      />
    </div>
  );
};

export default BasicInfoSection;