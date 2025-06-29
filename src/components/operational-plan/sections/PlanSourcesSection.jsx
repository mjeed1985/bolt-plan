import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const PLAN_SOURCES_TEMPLATE = `
1.  رؤية المملكة 2030 وأهدافها الاستراتيجية.
2.  سياسات وزارة التعليم وتوجهاتها العامة.
3.  نتائج التقويم الذاتي المدرسي للعام السابق.
4.  نتائج الاختبارات الوطنية والدولية.
5.  نتائج استبانات رضا المستفيدين (طلاب، أولياء أمور، معلمين).
6.  تقارير المشرفين التربويين وزياراتهم.
7.  الخطة التشغيلية لمكتب التعليم.
`.trim();

const PlanSourcesSection = ({ planData, onChange }) => {
    const handleTextChange = (e) => {
        onChange({ plan_sources_text: e.target.value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>مصادر بناء الخطة</CardTitle>
                <CardDescription>حدد المراجع والوثائق التي تم الاستناد إليها في بناء هذه الخطة.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="plan-sources-text">نص مصادر بناء الخطة</Label>
                <Textarea
                    id="plan-sources-text"
                    value={planData.plan_sources_text || PLAN_SOURCES_TEMPLATE}
                    onChange={handleTextChange}
                    placeholder="اذكر المصادر هنا..."
                    rows={10}
                    className="mt-2"
                />
                 <p className="text-xs text-gray-500 mt-2">
                    القائمة أعلاه هي قالب مقترح، يمكنك التعديل عليه بما يتناسب مع خطتك.
                </p>
            </CardContent>
        </Card>
    );
};

export default PlanSourcesSection;