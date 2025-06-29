import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { 
    EVALUATION_MECHANISMS,
    SUCCESS_INDICATORS_EXAMPLES,
    MONITORING_SCHEDULE_EXAMPLES,
    EVALUATION_TOOLS_EXAMPLES,
} from '@/lib/operationalPlanConstants';

const CheckboxGroup = ({ title, options, selected, onChange }) => {
    const handleCheckChange = useCallback((checked, optionValue) => {
        const newSelected = checked
            ? [...selected, optionValue]
            : selected.filter(item => item !== optionValue);
        onChange(newSelected);
    }, [selected, onChange]);

    return (
        <div>
            <Label className="text-md font-semibold">{title}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {options.map(option => (
                    <div key={option} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                            id={option}
                            checked={selected.includes(option)}
                            onCheckedChange={checked => handleCheckChange(checked, option)}
                        />
                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomItemsList = ({ title, items, onItemsChange, placeholder }) => {
    const handleItemChange = useCallback((index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    const addItem = useCallback(() => {
        onItemsChange([...items, '']);
    }, [items, onItemsChange]);

    const removeItem = useCallback((index) => {
        onItemsChange(items.filter((_, i) => i !== index));
    }, [items, onItemsChange]);

    return (
        <div className="space-y-2">
            <Label className="text-md font-semibold">{title}</Label>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input
                        value={item}
                        onChange={e => handleItemChange(index, e.target.value)}
                        placeholder={`${placeholder} #${index + 1}`}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" onClick={addItem}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة
            </Button>
        </div>
    );
};


const EvaluationSection = ({ evaluationMonitoring, onChange }) => {
    const handleChange = useCallback((field, value) => {
        onChange({ ...evaluationMonitoring, [field]: value });
    }, [evaluationMonitoring, onChange]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>آليات التقييم</CardTitle>
                    <CardDescription>صف آليات التقييم والمتابعة للخطة.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={evaluationMonitoring.evaluation_mechanisms}
                        onChange={e => handleChange('evaluation_mechanisms', e.target.value)}
                        placeholder={`مثال: ${EVALUATION_MECHANISMS}`}
                        rows={6}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>مؤشرات النجاح وأدوات التقييم</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <CustomItemsList
                        title="مؤشرات النجاح (مخصصة)"
                        items={evaluationMonitoring.success_indicators || []}
                        onItemsChange={items => handleChange('success_indicators', items)}
                        placeholder="أدخل مؤشر نجاح"
                    />
                    <CheckboxGroup
                        title="أدوات التقييم المقترحة"
                        options={EVALUATION_TOOLS_EXAMPLES}
                        selected={evaluationMonitoring.evaluation_tools || []}
                        onChange={items => handleChange('evaluation_tools', items)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>الجدول الزمني للمتابعة</CardTitle>
                    <CardDescription>صف الجدول الزمني للمتابعة والتقويم.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={evaluationMonitoring.monitoring_schedule}
                        onChange={e => handleChange('monitoring_schedule', e.target.value)}
                        placeholder={`مثال: ${MONITORING_SCHEDULE_EXAMPLES}`}
                        rows={6}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default EvaluationSection;