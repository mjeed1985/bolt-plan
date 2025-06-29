import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { STAFF_SPECIALIZATIONS_KSA, TRAINING_AREAS } from '@/lib/operationalPlanConstants';
import NumberStepper from '@/components/ui/NumberStepper';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StaffDevelopmentSection = ({ staffDevelopment, onChange }) => {
    
    const handleFieldChange = useCallback((field, value) => {
        onChange({ ...staffDevelopment, [field]: value });
    }, [staffDevelopment, onChange]);

    const handleSpecializationChange = useCallback((index, field, value) => {
        const newList = [...(staffDevelopment.specializations_list || [])];
        newList[index] = { ...newList[index], [field]: value };
        
        if (field === 'specialization' && value !== 'other') {
            newList[index].custom_specialization = '';
        }

        handleFieldChange('specializations_list', newList);
    }, [staffDevelopment, handleFieldChange]);

    const addSpecialization = useCallback(() => {
        const newList = [...(staffDevelopment.specializations_list || []), { specialization: '', custom_specialization: '', count: 1 }];
        handleFieldChange('specializations_list', newList);
    }, [staffDevelopment, handleFieldChange]);

    const removeSpecialization = useCallback((index) => {
        const newList = (staffDevelopment.specializations_list || []).filter((_, i) => i !== index);
        handleFieldChange('specializations_list', newList);
    }, [staffDevelopment, handleFieldChange]);

    const handleTrainingNeedChange = useCallback((checked, need) => {
        const currentNeeds = staffDevelopment.training_needs || [];
        const newNeeds = checked
            ? [...currentNeeds, need]
            : currentNeeds.filter(item => item !== need);
        handleFieldChange('training_needs', newNeeds);
    }, [staffDevelopment, handleFieldChange]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>بيانات الكادر التعليمي والإداري</CardTitle>
                    <CardDescription>حدد إجمالي الكادر وتوزيعهم حسب التخصص.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="total-staff">إجمالي الكادر</Label>
                        <NumberStepper
                            id="total-staff"
                            value={staffDevelopment.total_staff || 0}
                            onValueChange={value => handleFieldChange('total_staff', value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>توزيع الكادر حسب التخصص</Label>
                        {(staffDevelopment.specializations_list || []).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <div className="flex-grow">
                                    <Select
                                      value={item.specialization}
                                      onValueChange={value => handleSpecializationChange(index, 'specialization', value)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="اختر التخصص..." /></SelectTrigger>
                                        <SelectContent>
                                            {STAFF_SPECIALIZATIONS_KSA.map(spec => (
                                                <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                                            ))}
                                            <SelectItem value="other">تخصص آخر</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {item.specialization === 'other' && (
                                        <Input
                                            className="mt-2"
                                            value={item.custom_specialization || ''}
                                            onChange={e => handleSpecializationChange(index, 'custom_specialization', e.target.value)}
                                            placeholder="اكتب اسم التخصص"
                                        />
                                    )}
                                </div>
                                <div className="w-24">
                                     <NumberStepper
                                        value={item.count || 1}
                                        onValueChange={value => handleSpecializationChange(index, 'count', value)}
                                        min={1}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeSpecialization(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                         <Button variant="outline" onClick={addSpecialization}>
                            <PlusCircle className="ml-2 h-4 w-4" />
                            إضافة تخصص
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>الاحتياجات التدريبية والتطوير المهني</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-md font-semibold">مجالات التدريب المطلوبة</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                            {TRAINING_AREAS.map(area => (
                                <div key={area} className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id={area}
                                        checked={(staffDevelopment.training_needs || []).includes(area)}
                                        onCheckedChange={checked => handleTrainingNeedChange(checked, area)}
                                    />
                                    <Label htmlFor={area} className="cursor-pointer">{area}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="prof-dev-plans" className="text-md font-semibold">خطط التطوير المهني المقترحة</Label>
                        <Textarea
                            id="prof-dev-plans"
                            value={staffDevelopment.professional_development_plans}
                            onChange={e => handleFieldChange('professional_development_plans', e.target.value)}
                            placeholder="صف الخطط والبرامج التي سيتم تنفيذها لتلبية الاحتياجات التدريبية..."
                            rows={5}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffDevelopmentSection;