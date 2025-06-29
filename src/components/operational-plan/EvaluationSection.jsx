import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, BarChart3, CheckSquare, CalendarClock } from 'lucide-react';
import { EVALUATION_TOOLS, KPI_OPTIONS } from '@/lib/operationalPlanConstants';

const EvaluationSection = ({ evaluationMonitoring, onChange }) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...evaluationMonitoring, [field]: value });
  };

  const handleMultiSelectItemChange = (field, item) => {
    const currentItems = evaluationMonitoring[field] || [];
    if (!currentItems.includes(item)) {
      onChange({ ...evaluationMonitoring, [field]: [...currentItems, item] });
    }
  };

  const removeMultiSelectItem = (field, itemToRemove) => {
    onChange({
      ...evaluationMonitoring,
      [field]: (evaluationMonitoring[field] || []).filter(item => item !== itemToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <CardTitle className="text-lg">آليات التقويم</CardTitle>
          </div>
          <CardDescription>صف كيف سيتم تقييم مدى نجاح الخطة وتحقيق أهدافها.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            value={evaluationMonitoring.evaluation_mechanisms || ''}
            onChange={(e) => handleFieldChange('evaluation_mechanisms', e.target.value)}
            placeholder="مثال: سيتم إجراء تقييم دوري (شهري/فصلي) لتقدم البرامج، وجمع بيانات حول مؤشرات الأداء..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-lime-600" />
            <CardTitle className="text-lg">مؤشرات النجاح الرئيسية</CardTitle>
          </div>
          <CardDescription>حدد المؤشرات الكمية والنوعية التي ستدل على نجاح الخطة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="flex flex-wrap gap-2">
            {(evaluationMonitoring.success_indicators || []).map((indicator) => (
              <Button
                key={indicator}
                variant="secondary"
                size="sm"
                onClick={() => removeMultiSelectItem('success_indicators', indicator)}
                className="flex items-center gap-1 bg-lime-100 text-lime-800 hover:bg-lime-200"
              >
                {indicator}
                <Trash2 className="w-3 h-3" />
              </Button>
            ))}
          </div>
          <Select onValueChange={(value) => handleMultiSelectItemChange('success_indicators', value)}>
            <SelectTrigger>
              <SelectValue placeholder="أضف مؤشر نجاح" />
            </SelectTrigger>
            <SelectContent>
              {KPI_OPTIONS.map((kpi) => (
                <SelectItem key={kpi} value={kpi}>{kpi}</SelectItem>
              ))}
              <SelectItem value="تحقيق نسبة معينة من الأهداف التفصيلية">تحقيق نسبة معينة من الأهداف التفصيلية</SelectItem>
              <SelectItem value="مستوى مشاركة الطلاب في الأنشطة">مستوى مشاركة الطلاب في الأنشطة</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-sky-600" />
            <CardTitle className="text-lg">جدولة المتابعة وأدواتها</CardTitle>
          </div>
          <CardDescription>حدد الجدول الزمني لعمليات المتابعة والأدوات المستخدمة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="monitoring_schedule">الجدول الزمني للمتابعة</Label>
            <Textarea
              id="monitoring_schedule"
              value={evaluationMonitoring.monitoring_schedule || ''}
              onChange={(e) => handleFieldChange('monitoring_schedule', e.target.value)}
              placeholder="مثال: متابعة أسبوعية لتقدم المهام، اجتماعات شهرية لمراجعة الأداء، تقرير فصلي شامل..."
              rows={3}
            />
          </div>
          <div>
            <Label>الأدوات المستخدمة في المتابعة والتقويم</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(evaluationMonitoring.evaluation_tools || []).map((tool) => (
                <Button
                  key={tool}
                  variant="secondary"
                  size="sm"
                  onClick={() => removeMultiSelectItem('evaluation_tools', tool)}
                  className="flex items-center gap-1 bg-sky-100 text-sky-800 hover:bg-sky-200"
                >
                  {tool}
                  <Trash2 className="w-3 h-3" />
                </Button>
              ))}
            </div>
            <Select onValueChange={(value) => handleMultiSelectItemChange('evaluation_tools', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="أضف أداة متابعة/تقويم" />
              </SelectTrigger>
              <SelectContent>
                {EVALUATION_TOOLS.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationSection;