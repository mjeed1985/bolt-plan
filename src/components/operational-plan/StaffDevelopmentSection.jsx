import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Users, Briefcase, KeyRound as UsersRound, Wand2 } from 'lucide-react';
import { STAFF_SPECIALIZATIONS_KSA, TRAINING_AREAS } from '@/lib/operationalPlanConstants';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { useToast } from '@/components/ui/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

const StaffDevelopmentSection = ({ staffDevelopment, onChange, planData }) => {
  const { toast } = useToast();
  const [isGeneratingPlans, setIsGeneratingPlans] = useState(false);
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

  const handleFieldChange = (field, value) => {
    onChange({ ...staffDevelopment, [field]: value });
  };

  const handleSpecializationChange = (index, field, value) => {
    const newList = [...(staffDevelopment.specializations_list || [])];
    const currentItem = { ...newList[index] };
    currentItem[field] = value;

    if (field === 'specialization' && value !== 'other') {
      currentItem.custom_specialization = ''; 
    }
    
    newList[index] = currentItem;
    onChange({ ...staffDevelopment, specializations_list: newList });
  };

  const addSpecialization = () => {
    const newList = [...(staffDevelopment.specializations_list || []), { specialization: '', custom_specialization: '', count: 0 }];
    onChange({ ...staffDevelopment, specializations_list: newList });
  };

  const removeSpecialization = (index) => {
    const newList = (staffDevelopment.specializations_list || []).filter((_, i) => i !== index);
    onChange({ ...staffDevelopment, specializations_list: newList });
  };


  const handleMultiSelectItemChange = (field, item) => {
    const currentItems = staffDevelopment[field] || [];
    if (!currentItems.includes(item)) {
      onChange({ ...staffDevelopment, [field]: [...currentItems, item] });
    }
  };

  const removeMultiSelectItem = (field, itemToRemove) => {
    onChange({
      ...staffDevelopment,
      [field]: (staffDevelopment[field] || []).filter(item => item !== itemToRemove)
    });
  };

  const generateDevelopmentPlans = async () => {
    const trainingNeeds = staffDevelopment.training_needs || [];
    if (trainingNeeds.length === 0) {
      toast({
        title: "لا توجد مجالات تدريب محددة",
        description: "يرجى تحديد مجالات التدريب المطلوبة أولاً لتوليد الخطط.",
        variant: "warning",
      });
      return;
    }

    if (!geminiApiKey) {
      toast({
        title: "مفتاح API غير متوفر",
        description: apiKeyError || "مفتاح API الخاص بـ Gemini غير متاح. يرجى المحاولة مرة أخرى أو التحقق من الإعدادات.",
        variant: "destructive",
        duration: 7000,
      });
      return;
    }

    setIsGeneratingPlans(true);
    toast({
      title: "جاري توليد الخطط...",
      description: "يرجى الانتظار، قد يستغرق هذا بعض الوقت.",
    });

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        بصفتك خبيرًا في التخطيط التربوي والتطوير المهني في المملكة العربية السعودية، قم بإنشاء مقترحات لخطط تطوير مهني مفصلة ومبتكرة بناءً على مجالات التدريب المطلوبة التالية:
        ${trainingNeeds.join('\n- ')}

        الرجاء تقديم مقترحات واقعية وقابلة للتطبيق في البيئة المدرسية السعودية. يجب أن تتضمن المقترحات أمثلة لأنشطة، ورش عمل، دورات تدريبية، أو مبادرات يمكن تنفيذها.
        ركز على تقديم 3-5 مقترحات رئيسية، مع وصف موجز لكل مقترح.
        مثال على التنسيق المطلوب (استخدم هذا التنسيق بالضبط):
        
        1.  **اسم الخطة/البرنامج المقترح 1:**
            *   **الوصف:** شرح موجز للبرنامج وأهدافه الرئيسية.
            *   **الأنشطة المقترحة:** قائمة بالأنشطة مثل (ورشة عمل حول كذا، دورة تدريبية في موضوع كذا، تطبيق برنامج إلكتروني معين).
        
        2.  **اسم الخطة/البرنامج المقترح 2:**
            *   **الوصف:** ...
            *   **الأنشطة المقترحة:** ...
        
        (وهكذا لبقية المقترحات)

        تأكد من أن الرد باللغة العربية الفصحى وواضح ومناسب للسياق التعليمي.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      handleFieldChange('professional_development_plans', text);
      toast({
        title: "تم توليد الخطط بنجاح!",
        description: "تم تحديث حقل خطط التطوير المهني بالمقترحات.",
        variant: "success",
      });

    } catch (error) {
      console.error("Error generating development plans:", error);
      toast({
        title: "خطأ في توليد الخطط",
        description: error.message || "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlans(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-lg">معلومات الكادر</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="total_staff">إجمالي عدد الكادر (تعليمي وإداري)</Label>
            <Input
              id="total_staff"
              type="number"
              value={staffDevelopment.total_staff || 0}
              onChange={(e) => handleFieldChange('total_staff', parseInt(e.target.value) || 0)}
              placeholder="أدخل العدد الإجمالي"
            />
          </div>
          
          <div>
            <Label>التخصصات الرئيسية للكادر التعليمي وعدد المعلمين لكل تخصص</Label>
            {(staffDevelopment.specializations_list || []).map((specItem, index) => (
              <div key={index} className="mt-2 p-3 border rounded-md bg-slate-50 space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Label htmlFor={`specialization-name-${index}`}>التخصص</Label>
                    <Select
                      value={specItem.specialization}
                      onValueChange={(value) => handleSpecializationChange(index, 'specialization', value)}
                    >
                      <SelectTrigger id={`specialization-name-${index}`}>
                        <SelectValue placeholder="اختر التخصص" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAFF_SPECIALIZATIONS_KSA.map((spec) => (
                          <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-shrink-0">
                    <Label htmlFor={`specialization-count-${index}`}>عدد المعلمين</Label>
                    <NumberStepper
                      id={`specialization-count-${index}`}
                      value={specItem.count || 0}
                      onChange={(value) => handleSpecializationChange(index, 'count', value)}
                      min={0}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSpecialization(index)}
                    className="self-end mb-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {specItem.specialization === 'other' && (
                  <div className="flex-grow">
                    <Label htmlFor={`custom-specialization-${index}`}>اسم التخصص (أخرى)</Label>
                    <Input
                      id={`custom-specialization-${index}`}
                      type="text"
                      value={specItem.custom_specialization || ''}
                      onChange={(e) => handleSpecializationChange(index, 'custom_specialization', e.target.value)}
                      placeholder="أدخل اسم التخصص يدويًا"
                    />
                  </div>
                )}
              </div>
            ))}
            <Button type="button" onClick={addSpecialization} className="mt-2" variant="outline">
              <Plus className="ml-2 w-4 h-4" /> إضافة تخصص
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <CardTitle className="text-lg">احتياجات التطوير المهني</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>مجالات التدريب المطلوبة</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(staffDevelopment.training_needs || []).map((need) => (
                <Button
                  key={need}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeMultiSelectItem('training_needs', need)}
                  className="flex items-center gap-1"
                >
                  {need}
                  <Trash2 className="w-3 h-3" />
                </Button>
              ))}
            </div>
            <Select onValueChange={(value) => handleMultiSelectItemChange('training_needs', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="أضف مجال تدريب مطلوب" />
              </SelectTrigger>
              <SelectContent>
                {TRAINING_AREAS.map((area) => (
<<<<<<< HEAD
                  <SelectItem key={area.value} value={area.label}>{area.label}</SelectItem>
=======
                  <SelectItem key={area} value={area}>{area}</SelectItem>
>>>>>>> cd51de4 (initial push)
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <UsersRound className="w-6 h-6 text-cyan-600" />
            <CardTitle className="text-lg">خطط التطوير المهني المقترحة</CardTitle>
          </div>
           <CardDescription>صف البرامج والأنشطة التي سيتم تنفيذها لتلبية احتياجات التطوير المهني. يمكنك استخدام زر التوليد التلقائي للمساعدة.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            value={staffDevelopment.professional_development_plans || ''}
            onChange={(e) => handleFieldChange('professional_development_plans', e.target.value)}
            placeholder="مثال: تنظيم ورش عمل داخلية، إيفاد معلمين لدورات خارجية، تطبيق برامج تدريب إلكترونية... أو استخدم التوليد التلقائي."
            rows={8}
            className="mb-2"
          />
          <Button 
            type="button" 
            onClick={generateDevelopmentPlans} 
            disabled={isGeneratingPlans || !geminiApiKey || !!apiKeyError}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
          >
            {isGeneratingPlans ? (
              <>
                <UsersRound className="ml-2 h-4 w-4 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Wand2 className="ml-2 h-4 w-4" />
                توليد تلقائي لخطط التطوير
              </>
            )}
          </Button>
          {apiKeyError && !geminiApiKey && (
            <p className="text-sm text-red-600 mt-2">
              {apiKeyError} يرجى التأكد من إعداد مفتاح API بشكل صحيح في Supabase Secrets.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDevelopmentSection;