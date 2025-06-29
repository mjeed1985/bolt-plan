import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, Zap, ShieldAlert, Target, RefreshCw, Loader2, Sparkles, Trash2, Plus } from 'lucide-react';
import { SWOT_OPTIONS } from '@/lib/swotOptions';
import { useToast } from '@/components/ui/use-toast';

const SwotCategory = ({ title, categoryKey, predefinedOptions, selectedItems, customItems, onSelectionChange, onCustomChange, icon: Icon, description }) => {
  const handleCheckboxChange = (itemId) => {
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelectedItems);
  };

  const handleCustomItemChange = (index, value) => {
    const newCustomItems = [...customItems];
    newCustomItems[index] = value;
    onCustomChange(newCustomItems);
  };
  
  const addCustomItem = () => {
    onCustomChange([...customItems, '']);
  };

  const removeCustomItem = (index) => {
    onCustomChange(customItems.filter((_, i) => i !== index));
  };


  return (
    <Card className="border-gray-200 flex flex-col">
      <CardHeader className="bg-gray-50">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-indigo-600" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {description && <CardDescription className="mt-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3 pt-4 flex-grow">
        <Label className="font-semibold text-sm">خيارات محددة مسبقًا:</Label>
        <div className="space-y-2">
          {predefinedOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`${categoryKey}-${option.id}`}
                checked={selectedItems.includes(option.label)}
                onCheckedChange={() => handleCheckboxChange(option.label)}
              />
              <Label htmlFor={`${categoryKey}-${option.id}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <Label className="font-semibold text-sm">عناصر إضافية خاصة بمدرستكم:</Label>
        {customItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Textarea
              value={item}
              onChange={(e) => handleCustomItemChange(index, e.target.value)}
              placeholder={`عنصر إضافي ${index + 1}`}
              rows={1}
              className="flex-grow"
            />
             {customItems.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCustomItem(index)}
                className="text-red-500 hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addCustomItem}
          className="w-full flex items-center gap-2 border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50"
        >
          <Plus className="w-4 h-4" /> إضافة عنصر مخصص
        </Button>
      </CardContent>
    </Card>
  );
};

const SwotAnalysisSection = ({ swotAnalysis, onChange, planData }) => {
  const [localSwot, setLocalSwot] = useState({
    strengths: { selected: [], custom: [''] },
    weaknesses: { selected: [], custom: [''] },
    opportunities: { selected: [], custom: [''] },
    threats: { selected: [], custom: [''] },
    strategic_visions: ''
  });
  const [isGeneratingVisions, setIsGeneratingVisions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (swotAnalysis) {
      setLocalSwot({
        strengths: swotAnalysis.strengths || { selected: [], custom: [''] },
        weaknesses: swotAnalysis.weaknesses || { selected: [], custom: [''] },
        opportunities: swotAnalysis.opportunities || { selected: [], custom: [''] },
        threats: swotAnalysis.threats || { selected: [], custom: [''] },
        strategic_visions: swotAnalysis.strategic_visions || ''
      });
    }
  }, [swotAnalysis]);

  const handleCategoryChange = (categoryKey, type, newValues) => {
    const updatedCategory = {
      ...localSwot[categoryKey],
      [type]: newValues
    };
    const newSwot = {
      ...localSwot,
      [categoryKey]: updatedCategory
    };
    setLocalSwot(newSwot);
    onChange(newSwot);
  };

  const handleStrategicVisionsChange = (value) => {
    const newSwot = { ...localSwot, strategic_visions: value };
    setLocalSwot(newSwot);
    onChange(newSwot); 
  };

  const generateStrategicVisions = async () => {
    setIsGeneratingVisions(true);

    const { strengths, weaknesses, opportunities, threats } = localSwot;
    const allStrengths = [...strengths.selected, ...strengths.custom.filter(s => s.trim() !== '')];
    const allWeaknesses = [...weaknesses.selected, ...weaknesses.custom.filter(w => w.trim() !== '')];
    const allOpportunities = [...opportunities.selected, ...opportunities.custom.filter(o => o.trim() !== '')];
    const allThreats = [...threats.selected, ...threats.custom.filter(t => t.trim() !== '')];

    if (allStrengths.length === 0 && allWeaknesses.length === 0 && allOpportunities.length === 0 && allThreats.length === 0) {
      toast({
        title: "لا يمكن التوليد",
        description: "يرجى إدخال بعض نقاط القوة أو الضعف أو الفرص أو التهديدات أولاً.",
        variant: "destructive",
      });
      setIsGeneratingVisions(false);
      return;
    }
    
    let prompt = "بناءً على تحليل SWOT التالي لمدرسة، قم بصياغة 3-4 رؤى استراتيجية رئيسية. \n";
    if (allStrengths.length > 0) prompt += `نقاط القوة: ${allStrengths.join('، ')}. \n`;
    if (allWeaknesses.length > 0) prompt += `نقاط الضعف: ${allWeaknesses.join('، ')}. \n`;
    if (allOpportunities.length > 0) prompt += `الفرص: ${allOpportunities.join('، ')}. \n`;
    if (allThreats.length > 0) prompt += `التهديدات: ${allThreats.join('، ')}. \n`;
    prompt += "الرؤى الاستراتيجية يجب أن تكون واضحة وقابلة للتنفيذ وتهدف إلى تعظيم الاستفادة من نقاط القوة والفرص، ومعالجة نقاط الضعف، والتصدي للتهديدات.";
    
    let generatedVisions = "محاكاة لتوليد الرؤى الاستراتيجية:\n";
    generatedVisions += "1. استثمار الكادر التعليمي المؤهل والتجهيزات التقنية (قوة) لتقديم برامج تدريب متقدمة (فرصة) لتطوير مهارات الكادر (ضعف) ومواكبة التطور التقني (فرصة).\n";
    generatedVisions += "2. بناء شراكات مع القطاع الخاص (فرصة) لتوفير موارد إضافية (لمواجهة قيود الميزانية - ضعف) ودعم المبادرات التعليمية (استغلال الدعم الحكومي - فرصة).\n";
    generatedVisions += "3. تعزيز المشاركة المجتمعية لأولياء الأمور (قوة) من خلال برامج توعية وتواصل فعال لمواجهة تغير توقعات المجتمع (تهديد) وتحسين دعمهم للمدرسة (معالجة ضعف المشاركة - ضعف).\n";
    generatedVisions += "4. تطوير برامج لاصفية متنوعة (قوة) واستغلال التوجه نحو التعلم الرقمي (فرصة) لجذب الطلاب وتلبية احتياجاتهم المتنوعة، مع الأخذ في الاعتبار التحديات التقنية (تهديد).";


    await new Promise(resolve => setTimeout(resolve, 1500)); 

    handleStrategicVisionsChange(generatedVisions);
    setIsGeneratingVisions(false);
    toast({
      title: "تم توليد الرؤى الاستراتيجية",
      description: "تمت صياغة الرؤى بناءً على تحليل SWOT المدخل.",
    });
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwotCategory
          title="نقاط القوة (Strengths)"
          description="العوامل الداخلية الإيجابية التي تميز مدرستكم"
          categoryKey="strengths"
          predefinedOptions={SWOT_OPTIONS.strengths}
          selectedItems={localSwot.strengths.selected}
          customItems={localSwot.strengths.custom}
          onSelectionChange={(items) => handleCategoryChange('strengths', 'selected', items)}
          onCustomChange={(items) => handleCategoryChange('strengths', 'custom', items)}
          icon={Lightbulb}
        />
        <SwotCategory
          title="نقاط الضعف (Weaknesses)"
          description="العوامل الداخلية التي قد تعيق أداء مدرستكم"
          categoryKey="weaknesses"
          predefinedOptions={SWOT_OPTIONS.weaknesses}
          selectedItems={localSwot.weaknesses.selected}
          customItems={localSwot.weaknesses.custom}
          onSelectionChange={(items) => handleCategoryChange('weaknesses', 'selected', items)}
          onCustomChange={(items) => handleCategoryChange('weaknesses', 'custom', items)}
          icon={Zap}
        />
        <SwotCategory
          title="الفرص المتاحة (Opportunities)"
          description="العوامل الخارجية التي يمكن أن تفيد مدرستكم"
          categoryKey="opportunities"
          predefinedOptions={SWOT_OPTIONS.opportunities}
          selectedItems={localSwot.opportunities.selected}
          customItems={localSwot.opportunities.custom}
          onSelectionChange={(items) => handleCategoryChange('opportunities', 'selected', items)}
          onCustomChange={(items) => handleCategoryChange('opportunities', 'custom', items)}
          icon={Target}
        />
        <SwotCategory
          title="التهديدات المحتملة (Threats)"
          description="العوامل الخارجية التي قد تتحدى مدرستكم"
          categoryKey="threats"
          predefinedOptions={SWOT_OPTIONS.threats}
          selectedItems={localSwot.threats.selected}
          customItems={localSwot.threats.custom}
          onSelectionChange={(items) => handleCategoryChange('threats', 'selected', items)}
          onCustomChange={(items) => handleCategoryChange('threats', 'custom', items)}
          icon={ShieldAlert}
        />
      </div>
      
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <CardTitle className="text-lg">الرؤى الاستراتيجية</CardTitle>
            </div>
            <Button
              onClick={generateStrategicVisions}
              disabled={isGeneratingVisions}
              variant="outline"
              size="sm"
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
            >
              {isGeneratingVisions ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <RefreshCw className="ml-2 h-4 w-4" />}
              {isGeneratingVisions ? 'جاري التوليد...' : 'توليد تلقائي'}
            </Button>
          </div>
          <CardDescription className="mt-1">
            بناءً على تحليل SWOT، قم بصياغة أو توليد الرؤى الاستراتيجية الرئيسية للخطة.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="strategic_visions"
            value={localSwot.strategic_visions || ''}
            onChange={(e) => handleStrategicVisionsChange(e.target.value)}
            placeholder="أدخل الرؤى الاستراتيجية هنا، أو استخدم زر التوليد التلقائي..."
            rows={6}
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SwotAnalysisSection;