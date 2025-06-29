import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ListChecks } from 'lucide-react';
import { 
  PLAN_NATURES, 
  ACADEMIC_YEAR_OPTIONS
} from '@/lib/operationalPlanConstants';

const PlanNatureDurationCard = ({ localPlanData, renderField }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="text-indigo-600"/> طبيعة الخطة والمدة الزمنية</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {renderField("plan_nature", "طبيعة الخطة", "اختر طبيعة الخطة", "select", ListChecks, PLAN_NATURES, "select")}
        {localPlanData.plan_nature === 'multi_year' && 
          renderField("multi_year_plan_duration", "مدة الخطة (سنوات)", "أدخل عدد سنوات الخطة", "number", CalendarDays, [], "number_stepper")
        }
        {renderField("target_academic_year", "العام الدراسي المستهدف", "اختر العام الدراسي", "select", CalendarDays, ACADEMIC_YEAR_OPTIONS, "select")}
      </CardContent>
    </Card>
  );
};

export default PlanNatureDurationCard;