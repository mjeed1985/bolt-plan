import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MONITORING_NUMBERS,
  MONITORING_PERIODS,
  MONITORING_WEEKS,
  IMPLEMENTATION_LEVELS,
  ACHIEVEMENT_INDICATORS
} from '@/lib/operationalPlanConstants';

const PlanImplementationMonitoringSection = ({ planData, onChange }) => {
  const [monitoringItems, setMonitoringItems] = useState(planData.plan_implementation_monitoring || []);

  const handleItemChange = useCallback((index, field, value) => {
    const newItems = [...monitoringItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setMonitoringItems(newItems);
    onChange({ plan_implementation_monitoring: newItems });
  }, [monitoringItems, onChange]);

  const addItem = useCallback(() => {
    const newItems = [...monitoringItems, {
      id: `monitoring-${Date.now()}`,
      program_or_activity: '',
      monitoring_number: 'first',
      period: 'first_semester',
      week: 'first_week',
      implementation_level: 'not_implemented',
      achievement_indicator: 'achieved',
      notes: ''
    }];
    setMonitoringItems(newItems);
    onChange({ plan_implementation_monitoring: newItems });
  }, [monitoringItems, onChange]);

  const removeItem = useCallback((index) => {
    const newItems = monitoringItems.filter((_, i) => i !== index);
    setMonitoringItems(newItems);
    onChange({ plan_implementation_monitoring: newItems });
  }, [monitoringItems, onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>نموذج متابعة تنفيذ الخطة التشغيلية</CardTitle>
        <CardDescription>أدرج البرامج والأنشطة الرئيسية وتابع تنفيذها دوريًا.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">البرنامج/النشاط</TableHead>
                <TableHead>رقم المتابعة</TableHead>
                <TableHead>الفترة</TableHead>
                <TableHead>الأسبوع</TableHead>
                <TableHead>مستوى التنفيذ</TableHead>
                <TableHead>مؤشر الإنجاز</TableHead>
                <TableHead className="min-w-[200px]">ملاحظات</TableHead>
                <TableHead>إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoringItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.program_or_activity}
                      onChange={(e) => handleItemChange(index, 'program_or_activity', e.target.value)}
                      placeholder="اسم البرنامج"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={item.monitoring_number} onValueChange={(v) => handleItemChange(index, 'monitoring_number', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{MONITORING_NUMBERS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={item.period} onValueChange={(v) => handleItemChange(index, 'period', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{MONITORING_PERIODS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={item.week} onValueChange={(v) => handleItemChange(index, 'week', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{MONITORING_WEEKS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={item.implementation_level} onValueChange={(v) => handleItemChange(index, 'implementation_level', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{IMPLEMENTATION_LEVELS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                     <Select value={item.achievement_indicator} onValueChange={(v) => handleItemChange(index, 'achievement_indicator', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{ACHIEVEMENT_INDICATORS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.notes}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                      placeholder="ملاحظات"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" onClick={addItem} className="mt-4">
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة بند متابعة
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanImplementationMonitoringSection;