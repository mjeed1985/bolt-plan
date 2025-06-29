import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  RISK_CATEGORIES,
  RISK_SEVERITY_LEVELS,
  RISK_STRATEGIES,
  RISK_RESPONSIBLE_PARTIES
} from '@/lib/operationalPlanConstants';

const RisksManagementSection = ({ risksManagement, onChange }) => {

    const handleRiskChange = useCallback((index, field, value) => {
        const newRisks = [...risksManagement];
        newRisks[index][field] = value;
        onChange(newRisks);
    }, [risksManagement, onChange]);

    const addRisk = useCallback(() => {
        onChange([...risksManagement, {
            id: `risk-${Date.now()}`,
            description: '',
            category: '',
            probability: '',
            impact: '',
            severity: 'low',
            strategy: '',
            responsible_party: '',
            contingency_plan: ''
        }]);
    }, [risksManagement, onChange]);

    const removeRisk = useCallback((index) => {
        onChange(risksManagement.filter((_, i) => i !== index));
    }, [risksManagement, onChange]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>إدارة المخاطر</CardTitle>
                <CardDescription>حدد المخاطر المحتملة التي قد تواجه الخطة وكيفية التعامل معها.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {risksManagement.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 border rounded-lg space-y-4 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 left-2"
                            onClick={() => removeRisk(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        
                        <div>
                            <Label htmlFor={`risk-description-${index}`}>وصف المخاطرة</Label>
                            <Textarea
                                id={`risk-description-${index}`}
                                value={risk.description}
                                onChange={e => handleRiskChange(index, 'description', e.target.value)}
                                placeholder="صف المخاطرة بشكل واضح"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`risk-category-${index}`}>فئة المخاطرة</Label>
                                <Select
                                    value={risk.category}
                                    onValueChange={value => handleRiskChange(index, 'category', value)}
                                >
                                    <SelectTrigger id={`risk-category-${index}`}>
                                        <SelectValue placeholder="اختر الفئة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RISK_CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor={`risk-severity-${index}`}>مستوى الخطورة</Label>
                                <Select
                                    value={risk.severity}
                                    onValueChange={value => handleRiskChange(index, 'severity', value)}
                                >
                                    <SelectTrigger id={`risk-severity-${index}`}>
                                        <SelectValue placeholder="اختر مستوى الخطورة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RISK_SEVERITY_LEVELS.map(level => (
                                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`risk-strategy-${index}`}>استراتيجية المواجهة</Label>
                                <Select
                                    value={risk.strategy}
                                    onValueChange={value => handleRiskChange(index, 'strategy', value)}
                                >
                                    <SelectTrigger id={`risk-strategy-${index}`}>
                                        <SelectValue placeholder="اختر الاستراتيجية" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RISK_STRATEGIES.map(strat => (
                                            <SelectItem key={strat.value} value={strat.value}>{strat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor={`risk-responsible-${index}`}>الجهة المسؤولة</Label>
                                <Select
                                    value={risk.responsible_party}
                                    onValueChange={value => handleRiskChange(index, 'responsible_party', value)}
                                >
                                    <SelectTrigger id={`risk-responsible-${index}`}>
                                        <SelectValue placeholder="اختر الجهة المسؤولة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RISK_RESPONSIBLE_PARTIES.map(party => (
                                            <SelectItem key={party.value} value={party.value}>{party.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                         <div>
                            <Label htmlFor={`risk-contingency-${index}`}>خطة الطوارئ</Label>
                            <Textarea
                                id={`risk-contingency-${index}`}
                                value={risk.contingency_plan}
                                onChange={e => handleRiskChange(index, 'contingency_plan', e.target.value)}
                                placeholder="صف الإجراءات التي سيتم اتخاذها في حال وقوع المخاطرة"
                            />
                        </div>
                    </div>
                ))}
                <Button variant="outline" onClick={addRisk}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة مخاطرة جديدة
                </Button>
            </CardContent>
        </Card>
    );
};

export default RisksManagementSection;