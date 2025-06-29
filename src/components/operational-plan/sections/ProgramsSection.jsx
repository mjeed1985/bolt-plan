import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import { 
  PROGRAM_OR_INITIATIVE_TYPES,
  SUGGESTED_PROGRAMS,
  SUGGESTED_INITIATIVES,
  RESPONSIBLE_PARTIES_OPTIONS,
  KPI_PROGRAM_OPTIONS,
  KPI_INITIATIVE_OPTIONS,
  DURATION_PROGRAM_OPTIONS,
  DURATION_INITIATIVE_OPTIONS,
  RESOURCES_OPTIONS,
  CHALLENGES_OPTIONS,
  COMMUNICATION_METHODS_OPTIONS
} from '@/lib/programsOptions';
import { Textarea } from '@/components/ui/textarea';

const ProgramCard = ({ program, index, onProgramChange, onRemoveProgram }) => {
  const isProgram = program.type === 'program';
  const nameOptions = isProgram ? SUGGESTED_PROGRAMS : SUGGESTED_INITIATIVES;
  const kpiOptions = isProgram ? KPI_PROGRAM_OPTIONS : KPI_INITIATIVE_OPTIONS;
  const durationOptions = isProgram ? DURATION_PROGRAM_OPTIONS : DURATION_INITIATIVE_OPTIONS;
  
  const handleFieldChange = useCallback((field, value) => {
    onProgramChange(index, { ...program, [field]: value });
  }, [index, program, onProgramChange]);
  
  const handleNestedChange = useCallback((field, subfield, value) => {
      const updatedField = program[field] ? [...program[field]] : [];
      const itemIndex = updatedField.findIndex(item => item.id === subfield);
      if(itemIndex > -1) {
          updatedField[itemIndex].selected = value;
      } else {
          updatedField.push({id: subfield, selected: value, name: RESOURCES_OPTIONS.find(o => o.id === subfield)?.name || CHALLENGES_OPTIONS.find(o => o.id === subfield)?.name });
      }
      onProgramChange(index, { ...program, [field]: updatedField });
  }, [index, program, onProgramChange]);
  
  const handleCommunicationChange = useCallback((methodId, checked) => {
    const currentMethods = program.communication_methods || [];
    const newMethods = checked 
      ? [...currentMethods, methodId] 
      : currentMethods.filter(id => id !== methodId);
    onProgramChange(index, { ...program, communication_methods: newMethods });
  }, [index, program, onProgramChange]);

  return (
    <Card className="relative border-indigo-100">
      <Button variant="ghost" size="icon" className="absolute top-2 left-2" onClick={() => onRemoveProgram(index)}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      <CardHeader>
        <CardTitle>البند رقم {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>النوع</Label>
            <Select value={program.type} onValueChange={(value) => handleFieldChange('type', value)}>
              <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
              <SelectContent>
                {PROGRAM_OR_INITIATIVE_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>اسم البرنامج/المبادرة</Label>
            <Select value={program.name} onValueChange={(value) => handleFieldChange('name', value)}>
              <SelectTrigger><SelectValue placeholder="اختر الاسم" /></SelectTrigger>
              <SelectContent>
                {nameOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {program.name === 'other' && (
              <Input
                value={program.customName || ''}
                onChange={(e) => handleFieldChange('customName', e.target.value)}
                placeholder="أدخل اسمًا مخصصًا"
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label>الجهة المسؤولة</Label>
                <Select value={program.responsible_party} onValueChange={(value) => handleFieldChange('responsible_party', value)}>
                  <SelectTrigger><SelectValue placeholder="اختر الجهة المسؤولة" /></SelectTrigger>
                  <SelectContent>
                    {RESPONSIBLE_PARTIES_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {program.responsible_party === 'other' && (
                  <Input
                    value={program.custom_responsible_party || ''}
                    onChange={(e) => handleFieldChange('custom_responsible_party', e.target.value)}
                    placeholder="أدخل جهة مخصصة"
                    className="mt-2"
                  />
                )}
            </div>
             <div>
                <Label>مؤشر الأداء (KPI)</Label>
                <Select value={program.kpi} onValueChange={(value) => handleFieldChange('kpi', value)}>
                  <SelectTrigger><SelectValue placeholder="اختر مؤشر الأداء" /></SelectTrigger>
                  <SelectContent>
                    {kpiOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {program.kpi === 'other' && (
                  <Input
                    value={program.custom_kpi || ''}
                    onChange={(e) => handleFieldChange('custom_kpi', e.target.value)}
                    placeholder="أدخل مؤشر أداء مخصص"
                    className="mt-2"
                  />
                )}
            </div>
             <div>
                <Label>المدة الزمنية</Label>
                <Select value={program.duration} onValueChange={(value) => handleFieldChange('duration', value)}>
                  <SelectTrigger><SelectValue placeholder="اختر المدة" /></SelectTrigger>
                  <SelectContent>
                    {durationOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {program.duration === 'other' && (
                  <Input
                    value={program.custom_duration || ''}
                    onChange={(e) => handleFieldChange('custom_duration', e.target.value)}
                    placeholder="أدخل مدة مخصصة"
                    className="mt-2"
                  />
                )}
            </div>
        </div>

        <div>
            <Label>الموارد المطلوبة</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {RESOURCES_OPTIONS.map(resource => (
                    <div key={resource.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox 
                          id={`resource-${index}-${resource.id}`} 
                          checked={program.resources?.find(r => r.id === resource.id)?.selected || false}
                          onCheckedChange={(checked) => handleNestedChange('resources', resource.id, checked)}
                        />
                        <Label htmlFor={`resource-${index}-${resource.id}`}>{resource.name}</Label>
                    </div>
                ))}
            </div>
        </div>
        
        <div>
            <Label>التحديات المحتملة</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {CHALLENGES_OPTIONS.map(challenge => (
                    <div key={challenge.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox 
                          id={`challenge-${index}-${challenge.id}`} 
                          checked={program.challenges?.find(c => c.id === challenge.id)?.selected || false}
                          onCheckedChange={(checked) => handleNestedChange('challenges', challenge.id, checked)}
                        />
                        <Label htmlFor={`challenge-${index}-${challenge.id}`}>{challenge.name}</Label>
                    </div>
                ))}
            </div>
        </div>

        <div>
          <Label htmlFor={`contingency-${index}`}>خطة الطوارئ</Label>
          <Textarea 
            id={`contingency-${index}`}
            value={program.contingency_plan || ''}
            onChange={(e) => handleFieldChange('contingency_plan', e.target.value)}
            placeholder="صف خطة الطوارئ في حال مواجهة التحديات..."
          />
        </div>

        <div>
          <Label>أساليب التواصل مع المستهدفين</Label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {COMMUNICATION_METHODS_OPTIONS.map(method => (
                <div key={method.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`comm-${index}-${method.id}`}
                    checked={(program.communication_methods || []).includes(method.id)}
                    onCheckedChange={(checked) => handleCommunicationChange(method.id, checked)}
                  />
                  <Label htmlFor={`comm-${index}-${method.id}`}>{method.label}</Label>
                </div>
              ))}
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

const ProgramsSection = ({ programs, onChange }) => {
    const handleAddProgram = () => {
        const newProgram = {
            id: `prog-${Date.now()}`,
            type: 'program',
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
            communication_methods: []
        };
        onChange([...programs, newProgram]);
    };

    const handleRemoveProgram = (index) => {
        onChange(programs.filter((_, i) => i !== index));
    };

    const handleProgramChange = (index, updatedProgram) => {
        const newPrograms = [...programs];
        newPrograms[index] = updatedProgram;
        onChange(newPrograms);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>البرامج والمبادرات</CardTitle>
                    <CardDescription>
                        أضف البرامج والمبادرات التي ستنفذها المدرسة لتحقيق الأهداف الاستراتيجية.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {programs.map((prog, index) => (
                        <ProgramCard
                            key={prog.id || index}
                            program={prog}
                            index={index}
                            onProgramChange={handleProgramChange}
                            onRemoveProgram={handleRemoveProgram}
                        />
                    ))}
                    <Button variant="outline" onClick={handleAddProgram}>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة برنامج أو مبادرة
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProgramsSection;