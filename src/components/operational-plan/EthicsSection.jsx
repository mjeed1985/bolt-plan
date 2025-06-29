import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, BookOpen, Gem, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { CORE_VALUES_OPTIONS } from '@/lib/ethicsOptions';
import { useToast } from '@/components/ui/use-toast';

const EthicsSection = ({ ethicsCharter, onChange, planData }) => {
  const { toast } = useToast();
  const [localEthicsCharter, setLocalEthicsCharter] = useState({
    charter_text: '',
    core_values: [] 
  });
  const [isGeneratingCharter, setIsGeneratingCharter] = useState(false);
  const [generatingValueDescIndex, setGeneratingValueDescIndex] = useState(null);
  const [customValueInput, setCustomValueInput] = useState('');

  useEffect(() => {
    if (ethicsCharter) {
      setLocalEthicsCharter({
        charter_text: ethicsCharter.charter_text || '',
        core_values: ethicsCharter.core_values || []
      });
    }
  }, [ethicsCharter]);

  const handleCharterTextChange = (value) => {
    const newCharter = { ...localEthicsCharter, charter_text: value };
    setLocalEthicsCharter(newCharter);
    onChange(newCharter);
  };

  const handleCoreValueDescriptionChange = useCallback((valueName, description) => {
    setLocalEthicsCharter(prevCharter => {
      const newCoreValues = prevCharter.core_values.map(cv => 
        cv.name === valueName ? { ...cv, description: description } : cv
      );
      const newCharterData = { ...prevCharter, core_values: newCoreValues };
      onChange(newCharterData);
      return newCharterData;
    });
  }, [onChange]);

  const generateValueDescriptionAI = useCallback(async (valueName, index) => {
    setGeneratingValueDescIndex(index);
    toast({ title: `جاري توليد وصف احترافي لـ "${valueName}"...`, description: "نصوغ كلمات تعكس عمق هذه القيمة." });

    const studentGenderText = planData?.student_gender_type === 'boys' ? 'الطلاب البنين' : 'الطالبات البنات';
    const schoolName = planData?.school_name_full || 'مدرستنا الموقرة';
    const schoolStage = planData?.school_stage || 'المرحلة التعليمية';

    let specificPromptPart = "";
    switch (valueName) {
      case 'النزاهة والشفافية':
        specificPromptPart = `اشرح كيف تجسد ${schoolName} الالتزام المطلق بالصدق والوضوح في جميع معاملاتها وقراراتها. صف آليات ضمان الشفافية مع ${studentGenderText} والمعلمين وأولياء الأمور، وكيف يتم غرس هذه القيمة في نفوس الطلاب من خلال المناهج والأنشطة. اذكر أمثلة على تطبيق النزاهة في التعاملات اليومية لبناء مجتمع مدرسي قائم على الثقة.`;
        break;
      case 'الابتكار والتطوير المستمر':
        specificPromptPart = `صف كيف تتبنى ${schoolName} ثقافة الإبداع وتشجع على تبني الأفكار الجديدة لتحسين العملية التعليمية والبيئة المدرسية بشكل مستدام. اذكر مبادرات محددة لدعم الابتكار لدى ${studentGenderText} والمعلمين، وكيف يتم تقييم وتطبيق الأفكار التطويرية.`;
        break;
      case 'الاحترام المتبادل والتقدير':
        specificPromptPart = `وضح كيف تعزز ${schoolName} بيئة يسودها الاحترام لجميع أفراد المجتمع المدرسي، وتقدير التنوع الثقافي والفكري والاختلافات الفردية. صف البرامج والممارسات التي ترسخ هذه القيمة بين ${studentGenderText} والمعلمين والإداريين.`;
        break;
      case 'المسؤولية المجتمعية والانتماء':
        specificPromptPart = `اشرح كيف تغرس ${schoolName} الشعور بالمسؤولية تجاه المجتمع المحلي والوطن لدى ${studentGenderText}. اذكر أمثلة على مبادرات مجتمعية تشارك فيها المدرسة أو تنظمها، وكيف يتم تعزيز شعور الانتماء للمدرسة والهوية الوطنية.`;
        break;
      case 'التعاون والعمل بروح الفريق':
        specificPromptPart = `صف كيف تشجع ${schoolName} على العمل الجماعي والتعاون المثمر بين ${studentGenderText}، وبين المعلمين، وبين الإدارة وجميع الأطراف المعنية. اذكر آليات دعم الفرق والمشاريع المشتركة لتحقيق الأهداف التربوية وتطوير بيئة عمل إيجابية ومحفزة.`;
        break;
      case 'التميز والجودة في الأداء':
        specificPromptPart = `وضح كيف تسعى ${schoolName} جاهدة لتحقيق أعلى معايير الجودة والتميز في جميع جوانب الأداء الأكاديمي والتربوي والإداري. اذكر كيف يتم تحفيز ${studentGenderText} والمعلمين على الإتقان والابتكار، وآليات قياس ومتابعة معايير الجودة.`;
        break;
      case 'العدالة وتكافؤ الفرص':
        specificPromptPart = `اشرح كيف تضمن ${schoolName} توفير فرص متكافئة وعادلة لجميع ${studentGenderText} في كافة جوانب العملية التعليمية والتربوية، بغض النظر عن خلفياتهم وقدراتهم. صف السياسات والممارسات التي تكفل تطبيق مبادئ العدالة والإنصاف في التعامل مع الجميع.`;
        break;
      case 'الالتزام والانضباط':
        specificPromptPart = `صف كيف تؤكد ${schoolName} على أهمية الالتزام بالقوانين واللوائح والأنظمة المدرسية، وتعزيز الانضباط الذاتي والسلوكي لدى ${studentGenderText}. وضح كيف يساهم ذلك في بناء بيئة تعليمية آمنة ومنظمة ومحفزة على التعلم.`;
        break;
      default:
        specificPromptPart = `وضح بالتفصيل كيف تترجم هذه القيمة الهامة إلى سلوكيات ومبادرات وممارسات عملية وملموسة داخل البيئة المدرسية في ${schoolName}، مع التركيز على تأثيرها الإيجابي على ${studentGenderText} والمجتمع المدرسي.`;
    }

    const prompt = `أنت خبير في صياغة القيم المؤسسية للمدارس. قم بصياغة وصف احترافي، ملهم، وعميق للقيمة الأساسية "${valueName}" لمدرسة (${schoolName})، التي تخدم ${studentGenderText} في ${schoolStage}. يجب أن يكون الوصف شاملاً ويعكس التزام المدرسة الراسخ بهذه القيمة وتطبيقاتها العملية. ${specificPromptPart}`;
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    // المحاكاة يجب أن تكون أكثر تفصيلاً لتعكس جودة المطالبة الجديدة
    const simulatedProfessionalDescription = `في ${schoolName}، نؤمن إيمانًا راسخًا بأن قيمة "${valueName}" هي حجر الزاوية في بناء مستقبل واعد لـ ${studentGenderText}. هذا يتجلى في التزامنا بـ [تفصيل مبني على specificPromptPart، مثل: تطبيق أعلى معايير الشفافية في سياسات القبول والتسجيل، وتوفير قنوات تواصل مفتوحة وفعالة مع أولياء الأمور لمناقشة تقدم أبنائهم]. كما نسعى لـ [تفصيل إضافي، مثل: تمكين ${studentGenderText} من خلال برامج تعزز التفكير النقدي والمساءلة الذاتية]. إننا نرى أن "${valueName}" ليست مجرد شعار، بل هي ممارسة يومية تنعكس في كل جانب من جوانب بيئتنا التعليمية، لضمان تخريج جيل واعٍ ومسؤول وقادر على إحداث تغيير إيجابي. (وصف مولَّد باحترافية بناءً على: ${prompt})`;
    
    handleCoreValueDescriptionChange(valueName, simulatedProfessionalDescription);
    setGeneratingValueDescIndex(null);
    toast({ title: `تم توليد وصف احترافي لـ "${valueName}" بنجاح!`, variant: "success" });
  }, [planData, handleCoreValueDescriptionChange, toast]);

  const handleCoreValueSelection = useCallback(async (valueLabel, checked) => {
    let newCoreValues;
    let shouldGenerateDescription = false;
    let selectedValueIndex = -1;

    if (checked) {
      const newValue = { name: valueLabel, description: '' };
      newCoreValues = [...localEthicsCharter.core_values, newValue];
      shouldGenerateDescription = true;
      selectedValueIndex = newCoreValues.length - 1;
    } else {
      newCoreValues = localEthicsCharter.core_values.filter(cv => cv.name !== valueLabel);
    }
    
    const newCharter = { ...localEthicsCharter, core_values: newCoreValues };
    setLocalEthicsCharter(newCharter);
    onChange(newCharter);

    if (shouldGenerateDescription && selectedValueIndex !== -1) {
      await generateValueDescriptionAI(valueLabel, selectedValueIndex);
    }
  }, [localEthicsCharter, onChange, generateValueDescriptionAI]);


  const addCustomCoreValue = () => {
    if (customValueInput.trim() === '') {
      toast({ title: "خطأ", description: "يرجى إدخال اسم القيمة المخصصة.", variant: "destructive" });
      return;
    }
    if (localEthicsCharter.core_values.find(cv => cv.name === customValueInput.trim()) || CORE_VALUES_OPTIONS.find(opt => opt.label === customValueInput.trim())) {
      toast({ title: "خطأ", description: "هذه القيمة موجودة بالفعل.", variant: "destructive" });
      return;
    }
    const newCoreValues = [...localEthicsCharter.core_values, { name: customValueInput.trim(), description: '', isCustom: true }];
    const newCharter = { ...localEthicsCharter, core_values: newCoreValues };
    setLocalEthicsCharter(newCharter);
    onChange(newCharter);
    setCustomValueInput('');
  };

  const removeCustomCoreValue = (valueName) => {
    const newCoreValues = localEthicsCharter.core_values.filter(cv => cv.name !== valueName);
    const newCharter = { ...localEthicsCharter, core_values: newCoreValues };
    setLocalEthicsCharter(newCharter);
    onChange(newCharter);
  };


  const generateCharterTextAI = async () => {
    setIsGeneratingCharter(true);
    const studentGenderText = planData?.student_gender_type === 'boys' ? 'للطلاب البنين' : 'للطالبات البنات';
    const schoolName = planData?.school_name_full || 'مدرستنا';
    
    let prompt = `قم بصياغة نص ميثاق أخلاقي شامل واحترافي لمدرسة (${schoolName}) التي تخدم ${studentGenderText}. يجب أن يركز الميثاق على تعزيز بيئة تعليمية آمنة، محفزة، وداعمة للتميز والإبداع، قائمة على الاحترام المتبادل، العدالة، الشفافية، النزاهة، الابتكار، والمسؤولية. اذكر بوضوح التزامات المدرسة تجاه الطلاب، المعلمين، وأولياء الأمور، والمجتمع.`;

    if (localEthicsCharter.core_values && localEthicsCharter.core_values.length > 0) {
      const selectedValuesText = localEthicsCharter.core_values.map(cv => cv.name).join('، ');
      prompt += `\nالقيم الأساسية التي تم اختيارها للمدرسة هي: ${selectedValuesText}. يرجى دمج هذه القيم بشكل عضوي ومؤثر في نص الميثاق، مع إبراز كيف تشكل هذه القيم أساس ثقافة المدرسة وهويتها.`;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const generatedText = `في ${schoolName}، نلتزم بتوفير بيئة تعليمية وتربوية استثنائية ${studentGenderText}، قائمة على مبادئ الاحترام المتبادل، العدالة، والشفافية. نسعى جاهدين لغرس قيم النزاهة، الابتكار، والمسؤولية في نفوس طلابنا. نؤمن بأن كل فرد في مجتمعنا المدرسي يستحق التقدير والدعم لتحقيق أقصى إمكاناته.
التزاماتنا:
1.  تجاه الطلاب: توفير تعليم نوعي يواكب متطلبات العصر، بيئة آمنة وداعمة نفسيًا وجسديًا، تشجيع التفكير النقدي والإبداع، واحترام حقوقهم وتلبية احتياجاتهم الفردية.
2.  تجاه المعلمين: توفير بيئة عمل محفزة ومهنية، فرص مستمرة للتطوير المهني والنمو، وتقدير جهودهم وإسهاماتهم القيمة في العملية التربوية.
3.  تجاه أولياء الأمور والمجتمع: بناء شراكة فعالة ومتينة، التواصل المستمر والشفاف، والمساهمة بفعالية في خدمة المجتمع وتنميته.
${localEthicsCharter.core_values && localEthicsCharter.core_values.length > 0 ? `قيمنا الأساسية (${localEthicsCharter.core_values.map(cv => cv.name).join('، ')}) هي المنارة التي توجه جميع أعمالنا وقراراتنا، وتشكل جوهر هويتنا المؤسسية.` : ''}
نحن جميعًا - إدارة، معلمين، طلاب، وأولياء أمور - مسؤولون عن الالتزام بهذا الميثاق وجعله واقعًا ملموسًا في حياتنا اليومية بالمدرسة، لنصنع معًا مستقبلًا أفضل لأجيالنا القادمة. (محاكاة لتوليد نص الميثاق بناءً على: ${prompt})`;
    
    handleCharterTextChange(generatedText);
    setIsGeneratingCharter(false);
    toast({ title: "تم توليد نص الميثاق بنجاح!", description: "تمت صياغة نص الميثاق الأخلاقي بشكل احترافي." });
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <CardTitle className="text-lg">نص الميثاق الأخلاقي</CardTitle>
            </div>
            <Button
              onClick={generateCharterTextAI}
              disabled={isGeneratingCharter}
              variant="outline"
              size="sm"
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
            >
              {isGeneratingCharter ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <RefreshCw className="ml-2 h-4 w-4" />}
              {isGeneratingCharter ? 'جاري التوليد...' : 'توليد تلقائي احترافي'}
            </Button>
          </div>
          <CardDescription className="mt-1">
            اكتب هنا الميثاق الأخلاقي الذي تتبناه المدرسة، أو استخدم زر التوليد التلقائي لإنشاء مسودة احترافية.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            value={localEthicsCharter.charter_text}
            onChange={(e) => handleCharterTextChange(e.target.value)}
            placeholder="مثال: نلتزم في مدرستنا بتوفير بيئة تعليمية آمنة ومحفزة، قائمة على الاحترام المتبادل والعدالة والشفافية..."
            rows={8}
            className="text-base leading-relaxed"
          />
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <Gem className="w-6 h-6 text-teal-600" />
            <CardTitle className="text-lg">القيم الأساسية</CardTitle>
          </div>
          <CardDescription>
            اختر القيم الجوهرية التي توجه عمل المدرسة وقراراتها. سيتم توليد وصف احترافي تلقائي لكل قيمة تختارها.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CORE_VALUES_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`cv-${option.id}`}
                  checked={localEthicsCharter.core_values.some(cv => cv.name === option.label)}
                  onCheckedChange={(checked) => handleCoreValueSelection(option.label, checked)}
                />
                <Label htmlFor={`cv-${option.id}`} className="font-medium cursor-pointer flex-grow">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          
          {localEthicsCharter.core_values.filter(cv => !cv.isCustom).length > 0 && <hr/>}

          {localEthicsCharter.core_values.map((value, index) => (
            <Card key={value.name} className="bg-slate-50/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md text-slate-700">{value.name}</CardTitle>
                  {value.isCustom && (
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد أنك تريد حذف القيمة المخصصة "{value.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeCustomCoreValue(value.name)} className="bg-destructive hover:bg-destructive/90">
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Textarea
                  value={value.description}
                  onChange={(e) => handleCoreValueDescriptionChange(value.name, e.target.value)}
                  placeholder={`أدخل وصفًا للقيمة "${value.name}"...`}
                  rows={3}
                  className="mb-2 text-sm"
                />
                <Button
                  onClick={() => generateValueDescriptionAI(value.name, index)}
                  disabled={generatingValueDescIndex === index}
                  variant="outline"
                  size="sm"
                  className="w-full border-teal-500 text-teal-600 hover:bg-teal-50"
                >
                  {generatingValueDescIndex === index ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
                  {generatingValueDescIndex === index ? 'جاري التوليد...' : `إعادة توليد وصف احترافي لـ "${value.name}"`}
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <hr />
          <div className="space-y-2">
            <Label htmlFor="custom_value_input" className="font-semibold">إضافة قيمة أساسية مخصصة:</Label>
            <div className="flex items-center gap-2">
              <Input
                id="custom_value_input"
                value={customValueInput}
                onChange={(e) => setCustomValueInput(e.target.value)}
                placeholder="أدخل اسم القيمة المخصصة هنا"
                className="flex-grow"
              />
              <Button
                variant="outline"
                onClick={addCustomCoreValue}
                className="border-dashed border-teal-400 text-teal-600 hover:bg-teal-50"
              >
                <Plus className="w-4 h-4 ml-1" /> إضافة قيمة مخصصة
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default EthicsSection;