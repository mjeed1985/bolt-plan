import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, CheckSquare, Target, Shield, Users2, Briefcase, GraduationCap, HeartHandshake, Lightbulb, Loader2, BarChart3, UserCheck, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

const SELF_ASSESSMENT_DOMAINS = [
  { 
    name: "القيادة والإدارة المدرسية", 
    icon: Briefcase, 
    subDomains: ["التخطيط", "قيادة العملية التعليمية", "التطوير المؤسسي", "مجال الإدارة المدرسية"] 
  },
  { 
    name: "التعليم والتعلم", 
    icon: GraduationCap,
    subDomains: ["بناء خبرات التعلم", "تقويم التعلم", "نواتج التعلم (التحصيل العلمي، المهارات الحياتية)"]
  },
  { name: "البيئة المدرسية", icon: Shield, subDomains: ["المبنى المدرسي", "الأمن والسلامة", "المناخ المدرسي"] },
  { name: "الاتجاهات والسلوك", icon: Users2, subDomains: ["القيم الإسلامية والهوية الوطنية", "السلوك الإيجابي والمواطنة المسؤولة"] },
  { name: "التحصيل الدراسي", icon: Target, subDomains: ["النتائج في المواد الأساسية", "النتائج في الاختبارات الوطنية والدولية"] },
  { name: "الشراكة الأسرية والمجتمعية", icon: HeartHandshake, subDomains: ["تواصل المدرسة مع الأسرة", "تفاعل المدرسة مع المجتمع المحلي"] },
  { name: "الصحة واللياقة العامة", icon: UserCheck, subDomains: ["الصحة البدنية والنفسية", "البرامج الرياضية والأنشطة الصحية"] },
];

const BENEFICIARY_TYPES = [
  { id: 'students', label: 'الطلاب' },
  { id: 'administrative_staff', label: 'الهيئة الإدارية' },
  { id: 'student_counselor', label: 'الموجه الطلابي' },
  { id: 'parents', label: 'أولياء الأمور' },
  { id: 'activity_leader', label: 'رائد النشاط' },
  { id: 'local_community', label: 'المجتمع المحلي' },
  { id: 'health_counselor', label: 'الموجه الصحي' },
];

const SelfAssessmentBeneficiariesSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(planData.beneficiaries_data || []);
  const [isGeneratingAI, setIsGeneratingAI] = useState({});
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
    setSelectedBeneficiaries(planData.beneficiaries_data || []);
  }, [planData.beneficiaries_data]);

  const handleBeneficiaryToggle = (beneficiaryId, beneficiaryLabel) => {
    const currentIndex = selectedBeneficiaries.findIndex(b => b.id === beneficiaryId);
    let newSelectedBeneficiaries;

    if (currentIndex === -1) {
      newSelectedBeneficiaries = [...selectedBeneficiaries, { id: beneficiaryId, label: beneficiaryLabel, description: '' }];
    } else {
      newSelectedBeneficiaries = selectedBeneficiaries.filter(b => b.id !== beneficiaryId);
    }
    setSelectedBeneficiaries(newSelectedBeneficiaries);
    onChange({ beneficiaries_data: newSelectedBeneficiaries });
  };

  const handleBeneficiaryDescriptionChange = (beneficiaryId, description) => {
    const updatedBeneficiaries = selectedBeneficiaries.map(b =>
      b.id === beneficiaryId ? { ...b, description } : b
    );
    setSelectedBeneficiaries(updatedBeneficiaries);
    onChange({ beneficiaries_data: updatedBeneficiaries });
  };
  
  const generateBeneficiaryDescriptionAI = useCallback(async (beneficiaryId, beneficiaryLabel) => {
    if (!geminiApiKey) {
      toast({
        title: "مفتاح API غير متوفر",
        description: apiKeyError || "مفتاح API الخاص بـ Gemini غير متاح. لا يمكن المتابعة مع التوليد التلقائي.",
        variant: "destructive",
        duration: 7000,
      });
      return;
    }

    setIsGeneratingAI(prev => ({ ...prev, [beneficiaryId]: true }));
    toast({ title: `جاري توليد وصف لـ ${beneficiaryLabel}...`, description: "قد يستغرق هذا بعض الوقت." });

    const schoolContext = ` اسم المدرسة: ${planData.school_name_full || 'المدرسة'}، المرحلة الدراسية: ${planData.school_stage || 'غير محددة'}، نوع التعليم: ${planData.student_gender_type || 'غير محدد'}.`;
    const planObjectivesSummary = planData.plan_objective || "تحسين جودة التعليم وتطوير البيئة المدرسية.";
    
    const prompt = `
      بصفتك خبيرًا في التخطيط الاستراتيجي للمدارس، قم بصياغة وصف موجز ومقنع (لا يتجاوز 3-4 أسطر) يوضح كيف سيستفيد "${beneficiaryLabel}" بشكل مباشر وغير مباشر من الخطة التشغيلية للمدرسة.
      السياق: ${schoolContext}
      ملخص أهداف الخطة: ${planObjectivesSummary}
      
      ركز على الفوائد العملية والملموسة لهذه الفئة من المستفيدين.
      مثال: إذا كان المستفيد "الطلاب"، يمكن أن يكون الوصف: "سيستفيد الطلاب من خلال تحسين جودة البرامج التعليمية المقدمة، وتوفير بيئة تعليمية أكثر تحفيزًا وأمانًا، بالإضافة إلى تطوير مهاراتهم وقدراتهم لتلبية متطلبات المستقبل."
      
      الرد يجب أن يكون باللغة العربية الفصحى وواضحًا ومناسبًا.
    `;

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      handleBeneficiaryDescriptionChange(beneficiaryId, text);
      toast({ title: `تم توليد الوصف لـ ${beneficiaryLabel} بنجاح!`, variant: "success" });
    } catch (error) {
      console.error(`Error generating description for ${beneficiaryLabel}:`, error);
      toast({ title: `خطأ في توليد الوصف لـ ${beneficiaryLabel}`, description: error.message || "فشل الاتصال بالذكاء الاصطناعي.", variant: "destructive" });
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [beneficiaryId]: false }));
    }
  }, [geminiApiKey, apiKeyError, toast, planData.school_name_full, planData.school_stage, planData.student_gender_type, planData.plan_objective, onChange]);


  return (
    <div className="space-y-12">
      <Card className="border-gray-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-xl flex items-center gap-2"><BarChart3 className="w-6 h-6" /> مجالات التقويم الذاتي التي تم مراعاتها عند وضع الخطة</CardTitle>
          <CardDescription className="text-indigo-100">نظرة عامة على المجالات الرئيسية التي وجهت عملية التخطيط.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SELF_ASSESSMENT_DOMAINS.map((domain, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Card className="relative h-full shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="bg-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <domain.icon className="w-7 h-7 text-indigo-600" />
                      <CardTitle className="text-md font-semibold text-gray-800">{domain.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {domain.subDomains.map((sub, subIndex) => (
                        <li key={subIndex} className="flex items-start">
                          <CheckSquare className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
           <p className="mt-6 text-sm text-gray-500 text-center">
            <HelpCircle className="inline w-4 h-4 mr-1" />
            تم تصميم هذه المجالات بناءً على أطر التقويم الذاتي المعتمدة لضمان شمولية الخطة.
          </p>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <CardTitle className="text-xl flex items-center gap-2"><Users className="w-6 h-6" /> المستفيدون من الخطة التشغيلية</CardTitle>
          <CardDescription className="text-teal-100">حدد الفئات المستفيدة من الخطة واذكر كيف ستؤثر الخطة عليهم إيجابًا.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {BENEFICIARY_TYPES.map((beneficiary) => (
              <div key={beneficiary.id} className="flex items-center space-x-2 space-x-reverse bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <Checkbox
                  id={`beneficiary-${beneficiary.id}`}
                  checked={selectedBeneficiaries.some(b => b.id === beneficiary.id)}
                  onCheckedChange={() => handleBeneficiaryToggle(beneficiary.id, beneficiary.label)}
                  className="form-checkbox h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <Label htmlFor={`beneficiary-${beneficiary.id}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  {beneficiary.label}
                </Label>
              </div>
            ))}
          </div>

          {selectedBeneficiaries.length > 0 && (
            <div className="space-y-6 mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800">تفاصيل استفادة كل فئة:</h3>
              {selectedBeneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="bg-slate-50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md text-teal-700">{beneficiary.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={beneficiary.description}
                      onChange={(e) => handleBeneficiaryDescriptionChange(beneficiary.id, e.target.value)}
                      placeholder={`صف كيف سيستفيد ${beneficiary.label} من الخطة...`}
                      rows={3}
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                    <Button
                      onClick={() => generateBeneficiaryDescriptionAI(beneficiary.id, beneficiary.label)}
                      disabled={isGeneratingAI[beneficiary.id] || !geminiApiKey || !!apiKeyError}
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs border-teal-500 text-teal-600 hover:bg-teal-50"
                    >
                      {isGeneratingAI[beneficiary.id] ? <Loader2 className="ml-2 h-3 w-3 animate-spin" /> : <Lightbulb className="ml-2 h-3 w-3" />}
                      {isGeneratingAI[beneficiary.id] ? 'جاري التوليد...' : 'توليد تلقائي للوصف'}
                    </Button>
                     {apiKeyError && !geminiApiKey && (
                        <p className="text-xs text-red-600 mt-1">
                          {apiKeyError}
                        </p>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfAssessmentBeneficiariesSection;