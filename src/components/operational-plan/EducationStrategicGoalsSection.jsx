import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import GeneralGoalsCard from './education-goals/GeneralGoalsCard';
import StageGoalsCard from './education-goals/StageGoalsCard';
import ImplementationStrategiesCard from './education-goals/ImplementationStrategiesCard';
import { 
  GENERAL_EDUCATION_STRATEGIC_GOALS, 
  IMPLEMENTATION_STRATEGIES
} from '@/lib/operationalPlanConstants';

const EducationStrategicGoalsSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [generalGoalsText, setGeneralGoalsText] = useState(planData.general_strategic_goals_text || '');
  const [stageGoals, setStageGoals] = useState(planData.stage_specific_goals_data || {});
  const [selectedStages, setSelectedStages] = useState(
    Object.keys(planData.stage_specific_goals_data || {})
  );
  const [implementationStrategiesText, setImplementationStrategiesText] = useState(planData.implementation_strategies_text || '');
  const [isGeneratingGeneralAI, setIsGeneratingGeneralAI] = useState(false);
  const [isGeneratingStageAI, setIsGeneratingStageAI] = useState({});
  const [isGeneratingImplementationAI, setIsGeneratingImplementationAI] = useState(false);
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
          description: "لم نتمكن من جلب مفتاح Gemini API. قد لا تعمل ميزة التوليد التلقائي.",
          variant: "destructive",
          duration: 7000,
        });
      }
    };
    fetchApiKey();
  }, [toast]);

  useEffect(() => {
    setGeneralGoalsText(planData.general_strategic_goals_text || '');
    setStageGoals(planData.stage_specific_goals_data || {});
    setSelectedStages(Object.keys(planData.stage_specific_goals_data || {}));
    setImplementationStrategiesText(planData.implementation_strategies_text || '');
  }, [planData.general_strategic_goals_text, planData.stage_specific_goals_data, planData.implementation_strategies_text]);

  const handleGeneralGoalsChange = (newText) => {
    setGeneralGoalsText(newText);
    onChange({ general_strategic_goals_text: newText });
  };

  const handleStageGoalChange = (stageId, newText) => {
    const updatedStageGoals = { ...stageGoals, [stageId]: newText };
    setStageGoals(updatedStageGoals);
    onChange({ stage_specific_goals_data: updatedStageGoals });
  };

  const handleImplementationStrategiesChange = (newText) => {
    setImplementationStrategiesText(newText);
    onChange({ implementation_strategies_text: newText });
  };

  const handleStageToggle = (stageId) => {
    const currentIndex = selectedStages.indexOf(stageId);
    let newSelectedStages = [...selectedStages];
    let updatedStageGoals = { ...stageGoals };

    if (currentIndex === -1) {
      newSelectedStages.push(stageId);
      if (!updatedStageGoals[stageId]) {
        updatedStageGoals[stageId] = ''; 
      }
    } else {
      newSelectedStages.splice(currentIndex, 1);
      delete updatedStageGoals[stageId];
    }
    setSelectedStages(newSelectedStages);
    setStageGoals(updatedStageGoals);
    onChange({ stage_specific_goals_data: updatedStageGoals });
  };

  const generatePredefinedGeneralGoals = () => {
    const formattedGoals = GENERAL_EDUCATION_STRATEGIC_GOALS.map((goal, index) => `${index + 1}. ${goal}`).join('\n');
    handleGeneralGoalsChange(formattedGoals);
    toast({
      title: "تم توليد الأهداف الاستراتيجية العامة",
      description: "تمت إضافة قائمة الأهداف الاستراتيجية العامة للتعليم.",
      variant: "success",
    });
  };

  const generatePredefinedStageGoals = (stageId) => {
    const stageConfig = StageGoalsCard.EDUCATIONAL_STAGES.find(s => s.id === stageId);
    if (stageConfig && stageConfig.goalsConstant) {
      const formattedGoals = stageConfig.goalsConstant.map((goal, index) => `${index + 1}. ${goal}`).join('\n');
      handleStageGoalChange(stageId, formattedGoals);
      toast({
        title: `تم توليد أهداف ${stageConfig.label}`,
        description: `تمت إضافة قائمة الأهداف لمرحلة ${stageConfig.label}.`,
        variant: "success",
      });
    } else {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على أهداف محددة مسبقًا لهذه المرحلة.",
        variant: "destructive",
      });
    }
  };

  const generatePredefinedImplementationStrategies = () => {
    const formattedStrategies = IMPLEMENTATION_STRATEGIES.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n');
    handleImplementationStrategiesChange(formattedStrategies);
    toast({
      title: "تم توليد استراتيجيات التنفيذ",
      description: "تمت إضافة قائمة استراتيجيات التنفيذ النموذجية.",
      variant: "success",
    });
  };
  
  const generateAIGoals = useCallback(async (type, options = {}) => {
    if (!geminiApiKey) {
      toast({ title: "مفتاح API غير متوفر", description: apiKeyError || "مفتاح API الخاص بـ Gemini غير متاح.", variant: "destructive" });
      return;
    }

    let prompt = '';
    let currentText = '';
    let successTitle = '';
    let errorTitle = '';
    let stateSetter;
    let loadingSetter;

    switch (type) {
      case 'general':
        loadingSetter = setIsGeneratingGeneralAI;
        stateSetter = handleGeneralGoalsChange;
        currentText = generalGoalsText;
        successTitle = "تم توليد الأهداف الاستراتيجية العامة بنجاح!";
        errorTitle = "خطأ في توليد الأهداف العامة";
        prompt = `بصفتك خبيرًا في سياسات التعليم والتخطيط الاستراتيجي في المملكة العربية السعودية، قم بصياغة 5-7 أهداف استراتيجية عامة للتعليم. يجب أن تكون الأهداف شاملة وطموحة، متوافقة مع رؤية المملكة 2030، وتركز على تطوير الطالب والمعلم والبيئة التعليمية. قدمها كقائمة مرقمة.`;
        break;
      case 'stage':
        loadingSetter = (isLoading) => setIsGeneratingStageAI(prev => ({ ...prev, [options.stageId]: isLoading }));
        stateSetter = (text) => handleStageGoalChange(options.stageId, text);
        currentText = stageGoals[options.stageId] || "";
        successTitle = `تم توليد أهداف ${options.stageLabel} بنجاح!`;
        errorTitle = `خطأ في توليد أهداف ${options.stageLabel}`;
        prompt = `بصفتك خبيرًا في تطوير المناهج للمراحل الدراسية في المملكة العربية السعودية، قم بصياغة 4-6 أهداف تعليمية رئيسية لمرحلة "${options.stageLabel}". ركز على: ${options.stagePromptFocus}. يجب أن تكون الأهداف محددة ومناسبة للمرحلة العمرية. قدمها كقائمة مرقمة.`;
        break;
      case 'implementation':
        loadingSetter = setIsGeneratingImplementationAI;
        stateSetter = handleImplementationStrategiesChange;
        currentText = implementationStrategiesText;
        successTitle = "تم توليد استراتيجيات التنفيذ بنجاح!";
        errorTitle = "خطأ في توليد استراتيجيات التنفيذ";
        prompt = `بصفتك مستشارًا تربويًا، قم بصياغة 6-8 استراتيجيات تنفيذ عامة وفعالة لتحقيق الأهداف التعليمية في المدارس السعودية. يجب أن تكون الاستراتيجيات عملية ومتنوعة. قدمها كقائمة مرقمة.`;
        break;
      default:
        return;
    }

    loadingSetter(true);
    toast({ title: `جاري توليد ${successTitle.split(' ')[2]}...`, description: "قد يستغرق هذا بعض الوقت." });

    const fullPrompt = `${prompt}\n\nإذا كانت هناك مدخلات حالية، حاول اقتراح محتوى جديد أو مكمل لها.\nالمدخلات الحالية:\n${currentText || "لا يوجد"}`;

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      const updatedText = `${currentText ? currentText + '\n\n' : ''}مقترحات بالذكاء الاصطناعي:\n${text}`;
      stateSetter(updatedText);
      toast({ title: successTitle, variant: "success" });
    } catch (error) {
      console.error(`Error generating AI content for ${type}:`, error);
      toast({ title: errorTitle, description: error.message || "فشل الاتصال بالذكاء الاصطناعي.", variant: "destructive" });
    } finally {
      loadingSetter(false);
    }
  }, [geminiApiKey, apiKeyError, toast, generalGoalsText, stageGoals, implementationStrategiesText]);

  return (
    <div className="space-y-12">
      <GeneralGoalsCard
        generalGoalsText={generalGoalsText}
        onGeneralGoalsChange={handleGeneralGoalsChange}
        onGeneratePredefined={generatePredefinedGeneralGoals}
        onGenerateAI={() => generateAIGoals('general')}
        isGeneratingAI={isGeneratingGeneralAI}
        isApiReady={!!geminiApiKey}
        apiKeyError={apiKeyError}
      />
      <StageGoalsCard
        selectedStages={selectedStages}
        stageGoals={stageGoals}
        onStageToggle={handleStageToggle}
        onStageGoalChange={handleStageGoalChange}
        onGeneratePredefined={generatePredefinedStageGoals}
        onGenerateAI={(stageId, stageLabel, stagePromptFocus) => generateAIGoals('stage', { stageId, stageLabel, stagePromptFocus })}
        isGeneratingAI={isGeneratingStageAI}
        isApiReady={!!geminiApiKey}
        apiKeyError={apiKeyError}
      />
      <ImplementationStrategiesCard
        strategiesText={implementationStrategiesText}
        onStrategiesChange={handleImplementationStrategiesChange}
        onGeneratePredefined={generatePredefinedImplementationStrategies}
        onGenerateAI={() => generateAIGoals('implementation')}
        isGeneratingAI={isGeneratingImplementationAI}
        isApiReady={!!geminiApiKey}
        apiKeyError={apiKeyError}
      />
    </div>
  );
};

export default EducationStrategicGoalsSection;