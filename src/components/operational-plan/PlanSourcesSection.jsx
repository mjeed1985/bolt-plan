import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookText, Lightbulb, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const PREDEFINED_SOURCES_LIST = [
  "قرار مجلس الوزراء ذي الرقم (308) بتاريخ 18/7/1437هـ بالموافقة على رؤية المملكة العربية السعودية 2030.",
  "قرار مجلس الوزراء ذي الرقم (362) بتاريخ 1/9/1437هـ بالموافقة على برنامج التحول الوطني المنبثق من الرؤية.",
  "الأهداف الاستراتيجية لوزارة التعليم - المشاريع الوزارية - الاستراتيجية الوطنية لتطوير التعليم العام.",
  "مؤشرات قياس الأداء + دليل مجتمعات التعلم المهنية.",
  "مبادرة وزارة التعليم في برنامج التحول الوطني.",
  "الاختبارات الوطنية والمنافسات (عالميًا، إقليميًا، محليًا).",
  "الصلاحيات الممنوحة لمدير التعليم ومديري المدرسة.",
  "نتائج تقويم الخطط التشغيلية للشؤون التعليمية لتحليل تشخيص الواقع التعليمي للبيئة المدرسية (لجنة التميز المدرسي والتقويم الذاتي للمدرسة).",
  "الدليل التنفيذي لخطة النشاط + دليل الأنشطة + دليل الشراكة المجتمعية والأسرة.",
  "لائحة تقويم الطالب - اللائحة التنظيمية للعمل التطوعي في مدارس التعليم العام.",
  "وثيقة الدعم المالي للمشاريع النوعية.",
  "دليل الإشراف الجديد لتمكين المدارس.",
  "إصدارات هيئة تقويم التعليم والتدريب."
];

const PlanSourcesSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [sourcesText, setSourcesText] = useState(planData.plan_sources_text || '');

  useEffect(() => {
    setSourcesText(planData.plan_sources_text || '');
  }, [planData.plan_sources_text]);

  const handleSourcesChange = (newText) => {
    setSourcesText(newText);
    onChange({ plan_sources_text: newText });
  };

  const generatePredefinedSources = () => {
    const formattedSources = PREDEFINED_SOURCES_LIST.map((source, index) => `${index + 1}. ${source}`).join('\n');
    handleSourcesChange(formattedSources);
    toast({
      title: "تم توليد المصادر المقترحة",
      description: "تمت إضافة قائمة المصادر الأساسية لبناء الخطة.",
      variant: "success",
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="border-gray-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-lime-600 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <BookText className="w-6 h-6" /> 
            المصادر التي اعتمد عليها فريق اعداد الخطة وبناء الخطة
          </CardTitle>
          <CardDescription className="text-green-100">
            قائمة بالوثائق والمراجع الأساسية التي استند إليها فريق العمل في تطوير هذه الخطة التشغيلية.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              onClick={generatePredefinedSources}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Lightbulb className="ml-2 h-5 w-5" />
              توليد قائمة المصادر الأساسية
            </Button>
          </div>

          <Textarea
            value={sourcesText}
            onChange={(e) => handleSourcesChange(e.target.value)}
            placeholder="يمكنك إدخال المصادر هنا، أو استخدام زر التوليد التلقائي أعلاه..."
            rows={15}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500 text-base leading-relaxed p-4 rounded-md shadow-sm"
          />
          <p className="mt-4 text-sm text-gray-500 text-center">
            <HelpCircle className="inline w-4 h-4 mr-1" />
            تأكد من مراجعة وتحديث هذه القائمة لتعكس جميع المصادر التي تم الرجوع إليها بدقة.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlanSourcesSection;