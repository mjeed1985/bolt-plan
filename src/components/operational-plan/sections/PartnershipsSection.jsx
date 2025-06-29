import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { PARTNERSHIP_TYPES, PARTNERSHIP_AREAS } from '@/lib/operationalPlanConstants';

const PartnershipsSection = ({ partnerships, onChange, planData }) => {

    const handlePartnershipChange = useCallback((index, field, value) => {
        const newPartnerships = [...partnerships];
        newPartnerships[index][field] = value;
        onChange(newPartnerships);
    }, [partnerships, onChange]);

    const addPartnership = useCallback(() => {
        onChange([...partnerships, {
            id: `p-${Date.now()}`,
            partner_name: '',
            partnership_type: '',
            partnership_area: '',
            objectives: '',
            activities: '',
            responsible_person: '',
            start_date: '',
            end_date: '',
            kpis: ''
        }]);
    }, [partnerships, onChange]);

    const removePartnership = useCallback((index) => {
        onChange(partnerships.filter((_, i) => i !== index));
    }, [partnerships, onChange]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>الشراكات المجتمعية والمؤسسية</CardTitle>
                <CardDescription>إدارة الشراكات التي تدعم تحقيق أهداف الخطة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {partnerships.map((partnership, index) => (
                    <div key={partnership.id || index} className="p-4 border rounded-lg space-y-4 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 left-2"
                            onClick={() => removePartnership(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`partner-name-${index}`}>اسم الشريك</Label>
                                <Input
                                    id={`partner-name-${index}`}
                                    value={partnership.partner_name}
                                    onChange={e => handlePartnershipChange(index, 'partner_name', e.target.value)}
                                    placeholder="اسم الجهة أو المؤسسة الشريكة"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`partnership-type-${index}`}>نوع الشراكة</Label>
                                <Select
                                    value={partnership.partnership_type}
                                    onValueChange={value => handlePartnershipChange(index, 'partnership_type', value)}
                                >
                                    <SelectTrigger id={`partnership-type-${index}`}>
                                        <SelectValue placeholder="اختر نوع الشراكة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PARTNERSHIP_TYPES.map(type => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor={`partnership-objectives-${index}`}>أهداف الشراكة</Label>
                            <Textarea
                                id={`partnership-objectives-${index}`}
                                value={partnership.objectives}
                                onChange={e => handlePartnershipChange(index, 'objectives', e.target.value)}
                                placeholder="صف الأهداف المرجوة من هذه الشراكة"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`partnership-activities-${index}`}>الأنشطة المقترحة</Label>
                            <Textarea
                                id={`partnership-activities-${index}`}
                                value={partnership.activities}
                                onChange={e => handlePartnershipChange(index, 'activities', e.target.value)}
                                placeholder="اذكر الأنشطة والبرامج المشتركة"
                            />
                        </div>
                         <div>
                            <Label htmlFor={`partnership-responsible-${index}`}>المسؤول عن المتابعة</Label>
                            <Input
                                id={`partnership-responsible-${index}`}
                                value={partnership.responsible_person}
                                onChange={e => handlePartnershipChange(index, 'responsible_person', e.target.value)}
                                placeholder="اسم الشخص المسؤول عن متابعة الشراكة"
                            />
                        </div>
                    </div>
                ))}
                <Button variant="outline" onClick={addPartnership}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة شراكة جديدة
                </Button>
            </CardContent>
        </Card>
    );
};

export default PartnershipsSection;