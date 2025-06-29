import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, RefreshCw, Loader2, ListChecks, Users, CalendarDays, DollarSign, AlertTriangle, Megaphone, Target } from 'lucide-react';
import { 
  PROGRAM_OR_INITIATIVE_TYPES,
  SUGGESTED_PROGRAMS,
  SUGGESTED_INITIATIVES,
  RESPONSIBLE_PARTIES_OPTIONS,
  KPI_PROGRAM_OPTIONS,
  KPI_INITIATIVE_OPTIONS,
  DURATION_PROGRAM_OPTIONS,
  DURATION_INITIATIVE_OPTIONS,
  RESOURCES_SUGGESTIONS,
  CHALLENGES_SUGGESTIONS,
  COMMUNICATION_METHODS_OPTIONS,
  generateContingencyPlan
} from '@/lib/programsOptions';
import { useToast } from '@/components/ui/use-toast';

const ProgramsSection = ({ programs, onChange }) => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState({});

  const getInitialProgramItem = () => ({
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: '', // 'program' or 'initiative'
    name: '',
    customName: '',
    responsible_party: '',
    custom_responsible_party: '',
    kpi: '',
    custom_kpi: '',
    duration: '',
    custom_duration: '',
    resources: [],
    challenges: [],
    contingency_plan: '',
    communication_methods: [],
  });

  const handleAddItem = () => {
    onChange([...programs, getInitialProgramItem()]);
  };

  const handleRemoveItem = (index) => {
    const newPrograms = programs.filter((_, i) => i !== index);
    onChange(newPrograms);
  };

  const handleItemChange = (index, field, value) => {
    const newPrograms = [...programs];
    const currentItem = { ...newPrograms[index] };
    currentItem[field] = value;

    if (field === 'type') {
      currentItem.name = '';
      currentItem.customName = '';
      currentItem.kpi = '';
      currentItem.custom_kpi = '';
      currentItem.duration = '';
      currentItem.custom_duration = '';
      currentItem.resources = RESOURCES_SUGGESTIONS.default.map(r => ({ ...r }));
      currentItem.challenges = CHALLENGES_SUGGESTIONS.default.map(c => ({ ...c }));
      currentItem.contingency_plan = generateContingencyPlan(currentItem.challenges.filter(c => c.selected));
    }
    
    if (field === 'name' && value !== 'other') {
        currentItem.customName = '';
        const suggestedResources = RESOURCES_SUGGESTIONS[value] || RESOURCES_SUGGESTIONS.default;
        currentItem.resources = suggestedResources.map(r => ({ ...r }));
    }
    if (field === 'name' && value === 'other') {
        currentItem.resources = RESOURCES_SUGGESTIONS.default.map(r => ({ ...r }));
    }

    if (field === 'responsible_party' && value !== 'other') currentItem.custom_responsible_party = '';
    if (field === 'kpi' && value !== 'other') currentItem.custom_kpi = '';
    if (field === 'duration' && value !== 'other') currentItem.custom_duration = '';
    
    newPrograms[index] = currentItem;
    onChange(newPrograms);
  };

  const handleCheckboxChange = (programIndex, field, itemIndex, checked) => {
    const newPrograms = [...programs];
    const currentProgram = { ...newPrograms[programIndex] };
    currentProgram[field][itemIndex].selected = checked;

    if (field === 'challenges') {
      currentProgram.contingency_plan = generateContingencyPlan(currentProgram.challenges.filter(c => c.selected));
    }
    
    newPrograms[programIndex] = currentProgram;
    onChange(newPrograms);
  };
  
  const handleCommunicationMethodChange = (programIndex, methodId, checked) => {
    const newPrograms = [...programs];
    const currentProgram = { ...newPrograms[programIndex] };
    let currentMethods = currentProgram.communication_methods || [];
    if (checked) {
      if (!currentMethods.includes(methodId)) {
        currentMethods = [...currentMethods, methodId];
      }
    } else {
      currentMethods = currentMethods.filter(id => id !== methodId);
    }
    currentProgram.communication_methods = currentMethods;
    newPrograms[programIndex] = currentProgram;
    onChange(newPrograms);
  };

  const generateSuggestions = (index, fieldToUpdate) => {
    setIsLoadingAI(prev => ({ ...prev, [`${index}-${fieldToUpdate}`]: true }));
    const currentProgram = programs[index];
    
    setTimeout(() => {
      const newPrograms = [...programs];
      const updatedProgram = { ...newPrograms[index] };

      if (fieldToUpdate === 'resources') {
        const baseResources = RESOURCES_SUGGESTIONS[currentProgram.name] || RESOURCES_SUGGESTIONS.default;
        updatedProgram.resources = baseResources.map(r => ({ ...r, selected: Math.random() > 0.5 })); // Random selection for demo
      } else if (fieldToUpdate === 'challenges') {
        updatedProgram.challenges = CHALLENGES_SUGGESTIONS.default.map(c => ({ ...c, selected: Math.random() > 0.6 }));
        updatedProgram.contingency_plan = generateContingencyPlan(updatedProgram.challenges.filter(c => c.selected));
      } else if (fieldToUpdate === 'contingency_plan') {
         updatedProgram.contingency_plan = generateContingencyPlan(updatedProgram.challenges.filter(c => c.selected));
      }
      
      newPrograms[index] = updatedProgram;
      onChange(newPrograms);
      toast({ title: `تم توليد ${fieldToUpdate === 'resources' ? 'الموارد' : fieldToUpdate === 'challenges' ? 'التحديات' : 'خطة الطوارئ'}`, description: `تم تحديث الاقتراحات لـ "${currentProgram.name && currentProgram.name !== 'other' ? (getNameOptions(currentProgram.type).find(p=>p.value === currentProgram.name)?.label || currentProgram.customName) : (currentProgram.customName || 'البند الحالي')}".` });
      setIsLoadingAI(prev => ({ ...prev, [`${index}-${fieldToUpdate}`]: false }));
    }, 1000);
  };


  const getNameOptions = (type) => {
    if (type === 'program') return SUGGESTED_PROGRAMS;
    if (type === 'initiative') return SUGGESTED_INITIATIVES;
    return [];
  };

  const getKpiOptions = (type) => {
    if (type === 'program') return KPI_PROGRAM_OPTIONS;
    if (type === 'initiative') return KPI_INITIATIVE_OPTIONS;
    return [];
  };

  const getDurationOptions = (type) => {
    if (type === 'program') return DURATION_PROGRAM_OPTIONS;
    if (type === 'initiative') return DURATION_INITIATIVE_OPTIONS;
    return [];
  };

  return (
    <div className="space-y-6">
      {programs.map((program, index) => (
        <Card key={program.id || index} className="border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-indigo-700">
                {program.type ? (program.type === 'program' ? 'برنامج' : 'مبادرة') : 'برنامج/مبادرة'} {index + 1}
                {program.name && program.name !== 'other' && `: ${getNameOptions(program.type).find(p=>p.value === program.name)?.label || ''}`}
                {program.name === 'other' && program.customName && `: ${program.customName}`}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor={`type-${index}`} className="font-semibold flex items-center gap-2"><ListChecks className="w-4 h-4 text-gray-600"/>اختر النوع</Label>
                <Select value={program.type} onValueChange={(value) => handleItemChange(index, 'type', value)}>
                  <SelectTrigger id={`type-${index}`}><SelectValue placeholder="حدد هل هو برنامج أم مبادرة" /></SelectTrigger>
                  <SelectContent>
                    {PROGRAM_OR_INITIATIVE_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {program.type && (
                <div>
                  <Label htmlFor={`name-${index}`} className="font-semibold flex items-center gap-2"><ListChecks className="w-4 h-4 text-gray-600"/>اسم ال{program.type === 'program' ? 'برنامج' : 'مبادرة'}</Label>
                  <Select value={program.name} onValueChange={(value) => handleItemChange(index, 'name', value)}>
                    <SelectTrigger id={`name-${index}`}><SelectValue placeholder={`اختر ${program.type === 'program' ? 'البرنامج' : 'المبادرة'}`} /></SelectTrigger>
                    <SelectContent>
                      {getNameOptions(program.type).map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {program.name === 'other' && (
                    <Input type="text" placeholder={`أدخل اسم ال${program.type === 'program' ? 'برنامج' : 'مبادرة'} المخصص`} value={program.customName} onChange={(e) => handleItemChange(index, 'customName', e.target.value)} className="mt-2"/>
                  )}
                </div>
              )}
            </div>
            
            {program.name && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor={`responsible_party-${index}`} className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-gray-600"/>الجهة المسؤولة عن التنفيذ</Label>
                    <Select value={program.responsible_party} onValueChange={(value) => handleItemChange(index, 'responsible_party', value)}>
                      <SelectTrigger id={`responsible_party-${index}`}><SelectValue placeholder="اختر الجهة المسؤولة" /></SelectTrigger>
                      <SelectContent>
                        {RESPONSIBLE_PARTIES_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {program.responsible_party === 'other' && (
                      <Input type="text" placeholder="أدخل اسم الجهة المسؤولة المخصصة" value={program.custom_responsible_party} onChange={(e) => handleItemChange(index, 'custom_responsible_party', e.target.value)} className="mt-2"/>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`kpi-${index}`} className="font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-gray-600"/>مؤشر الأداء الرئيسي (KPI)</Label>
                    <Select value={program.kpi} onValueChange={(value) => handleItemChange(index, 'kpi', value)}>
                      <SelectTrigger id={`kpi-${index}`}><SelectValue placeholder="اختر مؤشر الأداء" /></SelectTrigger>
                      <SelectContent>
                        {getKpiOptions(program.type).map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {program.kpi === 'other' && (
                      <Input type="text" placeholder="أدخل مؤشر الأداء المخصص" value={program.custom_kpi} onChange={(e) => handleItemChange(index, 'custom_kpi', e.target.value)} className="mt-2"/>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`duration-${index}`} className="font-semibold flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-600"/>الفترة الزمنية المقترحة</Label>
                  <Select value={program.duration} onValueChange={(value) => handleItemChange(index, 'duration', value)}>
                    <SelectTrigger id={`duration-${index}`}><SelectValue placeholder="اختر المدة الزمنية" /></SelectTrigger>
                    <SelectContent>
                      {getDurationOptions(program.type).map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {program.duration === 'other' && (
                    <Input type="text" placeholder="أدخل الفترة الزمنية المخصصة" value={program.custom_duration} onChange={(e) => handleItemChange(index, 'custom_duration', e.target.value)} className="mt-2"/>
                  )}
                </div>

                <Card className="border-gray-100 shadow-inner">
                  <CardHeader className="pb-2 pt-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-gray-700 flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-600"/>الموارد المطلوبة</Label>
                      <Button variant="outline" size="xs" onClick={() => generateSuggestions(index, 'resources')} disabled={isLoadingAI[`${index}-resources`]} className="text-xs border-sky-500 text-sky-600 hover:bg-sky-50">
                        {isLoadingAI[`${index}-resources`] ? <Loader2 className="ml-1 h-3 w-3 animate-spin"/> : <RefreshCw className="ml-1 h-3 w-3"/>}
                        توليد اقتراحات
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(program.resources || []).map((resource, resIndex) => (
                      <div key={resIndex} className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md bg-white">
                        <Checkbox id={`resource-${index}-${resIndex}`} checked={resource.selected} onCheckedChange={(checked) => handleCheckboxChange(index, 'resources', resIndex, checked)} />
                        <Label htmlFor={`resource-${index}-${resIndex}`} className="text-sm font-normal text-gray-600 cursor-pointer">{resource.name}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-inner">
                  <CardHeader className="pb-2 pt-3 bg-gray-50">
                     <div className="flex justify-between items-center">
                        <Label className="font-semibold text-gray-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gray-600"/>التحديات المتوقعة</Label>
                        <Button variant="outline" size="xs" onClick={() => generateSuggestions(index, 'challenges')} disabled={isLoadingAI[`${index}-challenges`]} className="text-xs border-orange-500 text-orange-600 hover:bg-orange-50">
                            {isLoadingAI[`${index}-challenges`] ? <Loader2 className="ml-1 h-3 w-3 animate-spin"/> : <RefreshCw className="ml-1 h-3 w-3"/>}
                            توليد اقتراحات
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(program.challenges || []).map((challenge, chalIndex) => (
                      <div key={chalIndex} className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md bg-white">
                        <Checkbox id={`challenge-${index}-${chalIndex}`} checked={challenge.selected} onCheckedChange={(checked) => handleCheckboxChange(index, 'challenges', chalIndex, checked)} />
                        <Label htmlFor={`challenge-${index}-${chalIndex}`} className="text-sm font-normal text-gray-600 cursor-pointer">{challenge.name}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor={`contingency_plan-${index}`} className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gray-600"/>خطة الطوارئ</Label>
                    <Button variant="outline" size="xs" onClick={() => generateSuggestions(index, 'contingency_plan')} disabled={isLoadingAI[`${index}-contingency_plan`]} className="text-xs border-red-500 text-red-600 hover:bg-red-50">
                        {isLoadingAI[`${index}-contingency_plan`] ? <Loader2 className="ml-1 h-3 w-3 animate-spin"/> : <RefreshCw className="ml-1 h-3 w-3"/>}
                        توليد تلقائي
                    </Button>
                  </div>
                  <Textarea id={`contingency_plan-${index}`} value={program.contingency_plan} onChange={(e) => handleItemChange(index, 'contingency_plan', e.target.value)} placeholder="اكتب خطة بديلة أو إجراءات للتعامل مع التحديات..." rows={3}/>
                </div>

                <div>
                  <Label className="font-semibold flex items-center gap-2"><Megaphone className="w-4 h-4 text-gray-600"/>أساليب التواصل والترويج</Label>
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {COMMUNICATION_METHODS_OPTIONS.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md bg-white shadow-xs">
                        <Checkbox
                          id={`comm-method-${index}-${method.id}`}
                          checked={(program.communication_methods || []).includes(method.id)}
                          onCheckedChange={(checked) => handleCommunicationMethodChange(index, method.id, checked)}
                        />
                        <Label htmlFor={`comm-method-${index}-${method.id}`} className="text-sm font-normal text-gray-600 cursor-pointer">{method.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleAddItem} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 flex items-center justify-center gap-2 py-3 text-base shadow-md hover:shadow-lg transition-all">
        <Plus className="w-5 h-5" /> إضافة برنامج / مبادرة جديدة
      </Button>
    </div>
  );
};

export default ProgramsSection;