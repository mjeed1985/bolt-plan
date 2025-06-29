import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Sparkles, ChevronDown } from 'lucide-react';

const SurveyForm = ({ isOpen, onClose, onSubmit, isSubmitting, suggestedTitles, targetGroups }) => {
  const { toast } = useToast();
  const [selectedSurveyTitle, setSelectedSurveyTitle] = useState('');
  const [customSurveyTitle, setCustomSurveyTitle] = useState('');
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false);
  const [selectedTargetGroups, setSelectedTargetGroups] = useState([]);
  const [questions, setQuestions] = useState([{ text: '', type: 'text', options: [] }]);
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedSurveyTitle('');
    setCustomSurveyTitle('');
    setShowCustomTitleInput(false);
    setSelectedTargetGroups([]);
    setQuestions([{ text: '', type: 'text', options: [] }]);
    setDurationDays(7);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [] }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
  };
  
  const handleQuestionOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = questions.map((q, i) => {
      if (i === qIndex) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = questions.map((q, i) => {
      if (i === qIndex) {
        return { ...q, options: [...(q.options || []), ''] };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
     const newQuestions = questions.map((q, i) => {
      if (i === qIndex) {
        const newOptions = (q.options || []).filter((_, oi) => oi !== optIndex);
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  const handleTargetGroupChange = (groupId) => {
    setSelectedTargetGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };
  
  const getFinalSurveyTitle = () => {
    return showCustomTitleInput ? customSurveyTitle : selectedSurveyTitle;
  };

  const suggestDuration = (title, targets) => {
    let suggestedDuration = 7; 
    if (targets.includes('students') && title && title.includes('رضا')) {
      suggestedDuration = 3;
    } else if (targets.includes('teachers') && title && title.includes('تقييم شامل')) {
      suggestedDuration = 10;
    }
    setDurationDays(suggestedDuration);
  };

  const generateAIQuestions = () => {
    const finalTitle = getFinalSurveyTitle();
    if (!finalTitle || selectedTargetGroups.length === 0) {
      toast({ title: "معلومات ناقصة", description: "يرجى اختيار عنوان وفئة مستهدفة أولاً.", variant: "destructive" });
      return;
    }

    let generatedQuestions = [];
    if (finalTitle.includes("رضا") && selectedTargetGroups.includes("students")) {
      generatedQuestions = [
        { text: "ما مدى رضاك العام عن المدرسة؟", type: "rating", options: [] },
        { text: "ما هي أكثر مادة دراسية تستمتع بها ولماذا؟", type: "text", options: [] },
        { text: "هل تشعر بالأمان في البيئة المدرسية؟", type: "choice", options: ["نعم", "إلى حد ما", "لا"] },
      ];
    } else if (finalTitle.includes("تواصل") && selectedTargetGroups.includes("parents")) {
       generatedQuestions = [
        { text: "ما مدى رضاك عن وضوح وسرعة وصول الإعلانات من المدرسة؟", type: "rating", options: [] },
        { text: "ما هي قناة التواصل التي تفضلها (رسائل نصية، بريد إلكتروني، تطبيق المدرسة)؟", type: "choice", options: ["رسائل نصية", "بريد إلكتروني", "تطبيق المدرسة", "أخرى"] },
        { text: "هل تجد سهولة في التواصل مع المعلمين عند الحاجة؟", type: "choice", options: ["نعم دائماً", "غالباً", "أحياناً", "نادراً", "لا أبداً"] },
      ];
    } else {
       generatedQuestions = [
        { text: "ما هي أبرز نقاط القوة في الموضوع المحدد؟", type: "text", options: [] },
        { text: "ما هي اقتراحاتك للتحسين؟", type: "text", options: [] },
      ];
    }
    setQuestions(generatedQuestions);
    suggestDuration(finalTitle, selectedTargetGroups);
    toast({ title: "تم توليد الأسئلة!", description: "يمكنك مراجعتها وتعديلها." });
  };

  const handleSubmit = () => {
    const finalTitle = getFinalSurveyTitle();
    if (!finalTitle.trim()) {
      toast({ title: "خطأ", description: "الرجاء إدخال عنوان للاستبيان.", variant: "destructive" });
      return;
    }
    if (selectedTargetGroups.length === 0) {
      toast({ title: "خطأ", description: "الرجاء اختيار فئة مستهدفة واحدة على الأقل.", variant: "destructive" });
      return;
    }
    if (questions.some(q => !q.text.trim() || (q.type === 'choice' && (q.options || []).some(opt => !opt.trim())))) {
      toast({ title: "خطأ", description: "الرجاء ملء جميع حقول الأسئلة وخياراتها.", variant: "destructive" });
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(durationDays));

    const newSurveyData = {
      title: finalTitle,
      target_group: selectedTargetGroups,
      questions,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: true,
      duration_days: parseInt(durationDays),
    };
    onSubmit(newSurveyData);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 no-print overflow-y-auto"
    >
      <Card className="w-full max-w-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="arabic-text text-center">إنشاء استبيان جديد</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 overflow-y-auto flex-grow">
          <div>
            <Label htmlFor="surveyTitleSelect" className="arabic-text">عنوان الاستبيان</Label>
            <Select
              value={showCustomTitleInput ? "custom" : selectedSurveyTitle}
              onValueChange={(value) => {
                if (value === "custom") {
                  setShowCustomTitleInput(true);
                  setSelectedSurveyTitle('');
                  setCustomSurveyTitle(''); 
                } else {
                  setShowCustomTitleInput(false);
                  setSelectedSurveyTitle(value);
                  setCustomSurveyTitle(''); 
                }
                suggestDuration(value === "custom" ? "" : value, selectedTargetGroups);
              }}
            >
              <SelectTrigger id="surveyTitleSelect" className="arabic-text text-right">
                <SelectValue placeholder="اختر عنوانًا أو أدخل عنوانًا مخصصًا" />
              </SelectTrigger>
              <SelectContent>
                {suggestedTitles.map((title, index) => (
                  <SelectItem key={`${title}-${index}`} value={title} className="arabic-text justify-end">{title}</SelectItem>
                ))}
                <SelectItem value="custom" className="arabic-text justify-end font-semibold">عنوان مخصص...</SelectItem>
              </SelectContent>
            </Select>
            {showCustomTitleInput && (
              <Input 
                id="customSurveyTitle" 
                value={customSurveyTitle} 
                onChange={(e) => {
                    setCustomSurveyTitle(e.target.value);
                    suggestDuration(e.target.value, selectedTargetGroups);
                }}
                placeholder="اكتب عنوان الاستبيان المخصص هنا" 
                className="mt-2 text-right arabic-text" 
              />
            )}
          </div>
          
          <div>
            <Label className="arabic-text">الفئة المستهدفة</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between arabic-text">
                  {selectedTargetGroups.length > 0 ? selectedTargetGroups.map(id => targetGroups.find(opt => opt.id === id)?.label).join(', ') : "اختر الفئات المستهدفة"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel className="arabic-text">اختر فئة واحدة أو أكثر</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {targetGroups.map(option => (
                  <DropdownMenuItem key={option.id} onSelect={(e) => e.preventDefault()} className="arabic-text justify-end">
                    <Checkbox
                      id={`target-${option.id}`}
                      checked={selectedTargetGroups.includes(option.id)}
                      onCheckedChange={() => {
                        const newSelectedGroups = selectedTargetGroups.includes(option.id) 
                          ? selectedTargetGroups.filter(id => id !== option.id)
                          : [...selectedTargetGroups, option.id];
                        setSelectedTargetGroups(newSelectedGroups);
                        suggestDuration(getFinalSurveyTitle(), newSelectedGroups);
                      }}
                      className="ml-2"
                    />
                    <label htmlFor={`target-${option.id}`} className="cursor-pointer flex-grow">{option.label}</label>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button onClick={generateAIQuestions} variant="outline" className="w-full flex items-center justify-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-50">
            <Sparkles className="w-5 h-5 text-purple-500" />
            ✨ توليد الاستبيان بالذكاء الاصطناعي
          </Button>

          <div>
            <Label htmlFor="durationDays" className="arabic-text">مدة الاستبيان (أيام)</Label>
            <Input id="durationDays" type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} min="1" className="text-center arabic-text" />
          </div>

          <div className="space-y-3 pt-3 border-t">
            <Label className="arabic-text font-semibold">أسئلة الاستبيان ({questions.length})</Label>
            {questions.map((q, qIndex) => (
              <Card key={qIndex} className="p-4 bg-gray-50/50 border border-gray-200/80">
                <div className="space-y-2">
                  <Label htmlFor={`qtext-${qIndex}`} className="arabic-text">نص السؤال {qIndex + 1}</Label>
                  <Textarea id={`qtext-${qIndex}`} value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} placeholder="اكتب نص السؤال هنا" className="text-right arabic-text" />
                  <Label htmlFor={`qtype-${qIndex}`} className="arabic-text">نوع السؤال</Label>
                   <Select value={q.type} onValueChange={(value) => handleQuestionChange(qIndex, 'type', value)}>
                    <SelectTrigger id={`qtype-${qIndex}`} className="arabic-text text-right">
                      <SelectValue placeholder="اختر نوع السؤال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text" className="arabic-text justify-end">نصي (إجابة مفتوحة)</SelectItem>
                      <SelectItem value="rating" className="arabic-text justify-end">تقييم رقمي (1-5)</SelectItem>
                      <SelectItem value="choice" className="arabic-text justify-end">اختيار من متعدد</SelectItem>
                    </SelectContent>
                  </Select>
                  {q.type === 'choice' && (
                    <div className="pl-4 space-y-2 mt-2 border-r-2 border-indigo-200 pr-3">
                      <Label className="arabic-text text-sm">خيارات السؤال:</Label>
                      {(q.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input value={opt} onChange={(e) => handleQuestionOptionChange(qIndex, optIndex, e.target.value)} placeholder={`خيار ${optIndex + 1}`} className="text-right arabic-text flex-grow text-sm" />
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveOption(qIndex, optIndex)}><Trash2 className="w-4 h-4 text-red-400 hover:text-red-600"/></Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => handleAddOption(qIndex)} className="flex items-center gap-1 text-xs"><Plus className="w-3 h-3"/> إضافة خيار</Button>
                    </div>
                  )}
                </div>
                <div className="text-left mt-3">
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"><Trash2 className="w-4 h-4"/> إزالة السؤال</Button>
                </div>
              </Card>
            ))}
            <Button onClick={handleAddQuestion} variant="outline" className="w-full flex items-center gap-2"><Plus className="w-4 h-4"/> إضافة سؤال جديد</Button>
          </div>
        </CardContent>
        <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>إلغاء</Button>
            <Button onClick={handleSubmit} className="gradient-bg-2 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإنشاء...' : 'حفظ وإنشاء الاستبيان'}
            </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default SurveyForm;