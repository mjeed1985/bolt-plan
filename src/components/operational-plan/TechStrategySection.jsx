import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Cpu, Target, Wrench as Tool, Users, BarChart2, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { 
  TECH_LEVELS, 
  TECH_GOALS, 
  TECH_TOOLS 
} from '@/lib/operationalPlanConstants';
import { useToast } from '@/components/ui/use-toast';

const TechStrategySection = ({ techStrategy, onChange, planData }) => {
  const { toast } = useToast();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [localTechStrategy, setLocalTechStrategy] = useState({
    current_level: '', 
    goals: [], 
    tools: [], 
    impact_description: '', 
    responsible_team: '',
    kpis: [],
    budget_allocation: '',
    training_plan: ''
  });

  useEffect(() => {
    if (techStrategy) {
      setLocalTechStrategy({
        current_level: techStrategy.current_level || '',
        goals: techStrategy.goals || [],
        tools: techStrategy.tools || [],
        impact_description: techStrategy.impact_description || '',
        responsible_team: techStrategy.responsible_team || '',
        kpis: techStrategy.kpis || [],
        budget_allocation: techStrategy.budget_allocation || '',
        training_plan: techStrategy.training_plan || ''
      });
    }
  }, [techStrategy]);

  const handleTechStrategyChange = (field, value) => {
    const newStrategy = { ...localTechStrategy, [field]: value };
    setLocalTechStrategy(newStrategy);
    onChange(newStrategy);
  };

  const handleMultiSelectChange = (field, value) => {
    const currentSelection = localTechStrategy[field] || [];
    if (value && !currentSelection.includes(value)) {
      const newStrategy = { ...localTechStrategy, [field]: [...currentSelection, value] };
      setLocalTechStrategy(newStrategy);
      onChange(newStrategy);
    }
  };

  const removeMultiSelectItem = (field, valueToRemove) => {
    const newStrategy = {
      ...localTechStrategy,
      [field]: (localTechStrategy[field] || []).filter(value => value !== valueToRemove)
    };
    setLocalTechStrategy(newStrategy);
    onChange(newStrategy);
  };

  const generateTechStrategyAI = async () => {
    setIsGeneratingAI(true);
    toast({ title: "جاري توليد استراتيجية التقنية...", description: "يرجى الانتظار قليلاً." });

    let generatedStrategy = {
      current_level: localTechStrategy.current_level,
      goals: [...localTechStrategy.goals],
      tools: [...localTechStrategy.tools],
      impact_description: localTechStrategy.impact_description,
      responsible_team: localTechStrategy.responsible_team,
      kpis: [...localTechStrategy.kpis],
      budget_allocation: localTechStrategy.budget_allocation,
      training_plan: localTechStrategy.training_plan
    };

    // Simulate AI generation based on planData
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!generatedStrategy.current_level && TECH_LEVELS.length > 0) {
      generatedStrategy.current_level = TECH_LEVELS[Math.floor(Math.random() * TECH_LEVELS.length)];
    }

    if (generatedStrategy.goals.length === 0 && TECH_GOALS.length > 0) {
      const numGoals = Math.min(TECH_GOALS.length, 2 + Math.floor(Math.random() * 2)); // 2 to 3 goals
      for (let i = 0; i < numGoals; i++) {
        const randomGoal = TECH_GOALS[Math.floor(Math.random() * TECH_GOALS.length)];
        if (!generatedStrategy.goals.includes(randomGoal)) {
          generatedStrategy.goals.push(randomGoal);
        }
      }
    }
    
    if (generatedStrategy.tools.length === 0 && TECH_TOOLS.length > 0) {
        const numTools = Math.min(TECH_TOOLS.length, 2 + Math.floor(Math.random() * 3)); // 2 to 4 tools
        for (let i = 0; i < numTools; i++) {
            const randomTool = TECH_TOOLS[Math.floor(Math.random() * TECH_TOOLS.length)];
            if (!generatedStrategy.tools.includes(randomTool)) {
            generatedStrategy.tools.push(randomTool);
            }
        }
    }

    if (!generatedStrategy.impact_description) {
      generatedStrategy.impact_description = `تهدف استراتيجية دمج التقنية إلى تحسين مخرجات التعلم بشكل كبير من خلال توفير أدوات تفاعلية ومصادر متنوعة. من المتوقع أن تزيد مشاركة الطلاب وتفاعلهم مع المحتوى التعليمي، وتنمية مهاراتهم الرقمية اللازمة لمواكبة متطلبات العصر. كما ستساهم التقنية في تسهيل عمليات التقييم والمتابعة، وتوفير بيانات دقيقة لدعم اتخاذ القرارات التربوية.`;
    }
    
    if (!generatedStrategy.responsible_team) {
        const teams = ["وحدة التقنية", "فريق التحول الرقمي", "إدارة المدرسة بالتعاون مع قسم الحاسب الآلي"];
        generatedStrategy.responsible_team = teams[Math.floor(Math.random() * teams.length)];
    }

    if (generatedStrategy.kpis.length === 0) {
        generatedStrategy.kpis = [
            `زيادة استخدام المنصات التعليمية بنسبة ${10 + Math.floor(Math.random() * 21)}% خلال العام.`,
            `تدريب ${60 + Math.floor(Math.random() * 31)}% من المعلمين على الأدوات التقنية الجديدة.`,
            `تحسن رضا الطلاب عن استخدام التقنية في التعليم بنسبة ${5 + Math.floor(Math.random() * 16)}%.`
        ];
    }

    if (!generatedStrategy.budget_allocation) {
        generatedStrategy.budget_allocation = `سيتم تخصيص ميزانية تقديرية لتغطية تكاليف شراء التراخيص، الأجهزة، وبرامج التدريب. سيتم البحث عن مصادر تمويل إضافية من خلال الشراكات المجتمعية أو المبادرات الوزارية لدعم تنفيذ الاستراتيجية.`;
    }

    if (!generatedStrategy.training_plan) {
        generatedStrategy.training_plan = `سيتم وضع خطة تدريب شاملة للكادر التعليمي والإداري لضمان الاستخدام الأمثل للتقنيات المعتمدة. ستشمل الخطة ورش عمل تطبيقية، جلسات تدريب فردية، ومصادر تعلم ذاتي. سيتم التركيز على بناء الكفايات الرقمية الأساسية والمتقدمة.`;
    }

    setLocalTechStrategy(generatedStrategy);
    onChange(generatedStrategy);
    setIsGeneratingAI(false);
    toast({ title: "تم التوليد بنجاح!", description: "تم ملء حقول استراتيجية التقنية بناءً على الاقتراحات." });
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button
          onClick={generateTechStrategyAI}
          disabled={isGeneratingAI}
          variant="outline"
          className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
        >
          {isGeneratingAI ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
          {isGeneratingAI ? 'جاري التوليد...' : 'التوليد التلقائي بما يناسب'}
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-lg">الوضع الحالي والأهداف</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="current_level">المستوى الحالي لدمج التقنية في المدرسة</Label>
            <Select
              value={localTechStrategy.current_level || ''}
              onValueChange={(value) => handleTechStrategyChange('current_level', value)}
            >
              <SelectTrigger id="current_level">
                <SelectValue placeholder="اختر المستوى الحالي" />
              </SelectTrigger>
              <SelectContent>
                {TECH_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الأهداف الاستراتيجية لدمج التقنية</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(localTechStrategy.goals || []).map((goal) => (
                <Button
                  key={goal}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeMultiSelectItem('goals', goal)}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {goal}
                  <Trash2 className="w-3 h-3" />
                </Button>
              ))}
            </div>
            <Select onValueChange={(value) => handleMultiSelectChange('goals', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="أضف هدفاً تقنياً" />
              </SelectTrigger>
              <SelectContent>
                {TECH_GOALS.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Tool className="w-6 h-6 text-green-600" />
            <CardTitle className="text-lg">التقنيات والأدوات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>التقنيات والأدوات المقترحة للتنفيذ</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(localTechStrategy.tools || []).map((tool) => (
                <Button
                  key={tool}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeMultiSelectItem('tools', tool)}
                  className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {tool}
                  <Trash2 className="w-3 h-3" />
                </Button>
              ))}
            </div>
            <Select onValueChange={(value) => handleMultiSelectChange('tools', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="أضف تقنية أو أداة" />
              </SelectTrigger>
              <SelectContent>
                {TECH_TOOLS.map((tool) => (
                  <SelectItem key={tool} value={tool}>
                    {tool}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="impact_description">وصف تأثير التقنية على تعلم الطلاب ومشاركتهم</Label>
            <Textarea
              id="impact_description"
              value={localTechStrategy.impact_description || ''}
              onChange={(e) => handleTechStrategyChange('impact_description', e.target.value)}
              placeholder="اشرح كيف ستؤثر التقنيات المختارة على عملية التعلم والمشاركة..."
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <CardTitle className="text-lg">التنفيذ والمسؤوليات</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="responsible_team">القسم/الفريق المسؤول عن تنفيذ الاستراتيجية</Label>
            <Select
              value={localTechStrategy.responsible_team || ''}
              onValueChange={(value) => handleTechStrategyChange('responsible_team', value)}
            >
              <SelectTrigger id="responsible_team">
                <SelectValue placeholder="اختر الفريق المسؤول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="وحدة التقنية">وحدة التقنية</SelectItem>
                <SelectItem value="إدارة المدرسة">إدارة المدرسة</SelectItem>
                <SelectItem value="فريق التحول الرقمي">فريق التحول الرقمي</SelectItem>
                <SelectItem value="لجنة مشتركة من المعلمين والإداريين">لجنة مشتركة من المعلمين والإداريين</SelectItem>
                <SelectItem value="أخرى">أخرى (حدد في الوصف)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="training_plan">خطة تدريب الكادر على استخدام التقنيات الجديدة</Label>
            <Textarea
              id="training_plan"
              value={localTechStrategy.training_plan || ''}
              onChange={(e) => handleTechStrategyChange('training_plan', e.target.value)}
              placeholder="صف خطة التدريب المقترحة، مثل ورش العمل، الدورات التدريبية، الدعم الفردي..."
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-red-600" />
            <CardTitle className="text-lg">المتابعة والتقييم والميزانية</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
           <div>
            <Label>مؤشرات الأداء الرئيسية (KPIs) لقياس نجاح الاستراتيجية</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(localTechStrategy.kpis || []).map((kpi, index) => (
                <div key={index} className="flex items-center gap-1 p-2 border rounded-md bg-red-100 text-red-800">
                  <span>{kpi}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMultiSelectItem('kpis', kpi)}
                    className="h-6 w-6 p-0 hover:bg-red-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Textarea
              value={(localTechStrategy.kpis || []).join('\n')}
              onChange={(e) => handleTechStrategyChange('kpis', e.target.value.split('\n').filter(k => k.trim() !== ''))}
              placeholder="أدخل كل مؤشر في سطر جديد. مثال: زيادة استخدام الطلاب للمنصات التعليمية بنسبة 20%."
              className="mt-2"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="budget_allocation">الميزانية المخصصة وخطة التمويل</Label>
            <Textarea
              id="budget_allocation"
              value={localTechStrategy.budget_allocation || ''}
              onChange={(e) => handleTechStrategyChange('budget_allocation', e.target.value)}
              placeholder="صف الميزانية التقديرية المطلوبة، ومصادر التمويل المحتملة..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechStrategySection;