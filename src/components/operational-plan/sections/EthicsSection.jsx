import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { CORE_VALUES_LIST } from '@/lib/operationalPlanConstants';

const EthicsSection = ({ ethicsCharter, onChange }) => {
    const [customValues, setCustomValues] = useState(
        ethicsCharter.core_values?.filter(v => v.isCustom) || []
    );

    const handleCharterChange = (e) => {
        onChange({ ...ethicsCharter, charter_text: e.target.value });
    };

    const handlePredefinedValueChange = useCallback((checked, valueName) => {
        const currentValues = ethicsCharter.core_values || [];
        let newValues;
        if (checked) {
            const predefinedValue = CORE_VALUES_LIST.find(v => v.name === valueName);
            newValues = [...currentValues, { ...predefinedValue, isCustom: false }];
        } else {
            newValues = currentValues.filter(v => v.name !== valueName);
        }
        onChange({ ...ethicsCharter, core_values: newValues });
    }, [ethicsCharter, onChange]);
    
    const handleCustomValueChange = (index, field, value) => {
        const updatedCustomValues = [...customValues];
        updatedCustomValues[index][field] = value;
        setCustomValues(updatedCustomValues);
        
        const nonCustomValues = ethicsCharter.core_values?.filter(v => !v.isCustom) || [];
        onChange({ ...ethicsCharter, core_values: [...nonCustomValues, ...updatedCustomValues] });
    };

    const addCustomValue = () => {
        const newCustomValue = { name: '', description: '', isCustom: true };
        const updatedCustomValues = [...customValues, newCustomValue];
        setCustomValues(updatedCustomValues);

        const nonCustomValues = ethicsCharter.core_values?.filter(v => !v.isCustom) || [];
        onChange({ ...ethicsCharter, core_values: [...nonCustomValues, ...updatedCustomValues] });
    };

    const removeCustomValue = (index) => {
        const updatedCustomValues = customValues.filter((_, i) => i !== index);
        setCustomValues(updatedCustomValues);

        const nonCustomValues = ethicsCharter.core_values?.filter(v => !v.isCustom) || [];
        onChange({ ...ethicsCharter, core_values: [...nonCustomValues, ...updatedCustomValues] });
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>ميثاق الأخلاقيات المهنية</CardTitle>
                    <CardDescription>حدد نص الميثاق الذي سيتم اعتماده في الخطة التشغيلية.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="ethics-charter-text">نص الميثاق</Label>
                    <Textarea
                        id="ethics-charter-text"
                        value={ethicsCharter.charter_text}
                        onChange={handleCharterChange}
                        placeholder="أدخل نص الميثاق الأخلاقي هنا..."
                        rows={10}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>القيم الأساسية</CardTitle>
                    <CardDescription>اختر القيم التي تمثل المدرسة أو أضف قيمًا مخصصة.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Label>القيم المقترحة</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {CORE_VALUES_LIST.map(value => (
                                <div key={value.name} className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox
                                        id={`value-${value.name}`}
                                        checked={ethicsCharter.core_values?.some(v => v.name === value.name && !v.isCustom)}
                                        onCheckedChange={(checked) => handlePredefinedValueChange(checked, value.name)}
                                    />
                                    <Label htmlFor={`value-${value.name}`} className="cursor-pointer">{value.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                         <Label>قيم مخصصة</Label>
                        {customValues.map((value, index) => (
                            <div key={index} className="flex items-end gap-4 p-4 border rounded-md">
                                <div className="flex-grow space-y-2">
                                    <Label htmlFor={`custom-value-name-${index}`}>اسم القيمة</Label>
                                    <Input
                                        id={`custom-value-name-${index}`}
                                        value={value.name}
                                        onChange={(e) => handleCustomValueChange(index, 'name', e.target.value)}
                                        placeholder="مثل: الشفافية"
                                    />
                                </div>
                                <div className="flex-grow space-y-2">
                                    <Label htmlFor={`custom-value-desc-${index}`}>وصف القيمة</Label>
                                    <Input
                                        id={`custom-value-desc-${index}`}
                                        value={value.description}
                                        onChange={(e) => handleCustomValueChange(index, 'description', e.target.value)}
                                        placeholder="وصف مختصر للقيمة"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeCustomValue(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={addCustomValue}
                            className="mt-2"
                        >
                            <PlusCircle className="ml-2 h-4 w-4" />
                            إضافة قيمة مخصصة
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EthicsSection;