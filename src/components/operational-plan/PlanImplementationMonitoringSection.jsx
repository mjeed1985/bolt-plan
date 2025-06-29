import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ClipboardList, Calendar, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MONITORING_NUMBERS,
  MONITORING_PERIODS,
  MONITORING_WEEKS,
  IMPLEMENTATION_LEVELS,
  ACHIEVEMENT_INDICATORS
} from '@/lib/operationalPlanConstants';

const PlanImplementationMonitoringSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [monitoringEntries, setMonitoringEntries] = useState(
    planData.plan_implementation_monitoring || []
  );

  useEffect(() => {
    setMonitoringEntries(planData.plan_implementation_monitoring || []);
  }, [planData.plan_implementation_monitoring]);

  const handleMonitoringChange = (newEntries) => {
    setMonitoringEntries(newEntries);
    onChange({ plan_implementation_monitoring: newEntries });
  };

  const addNewMonitoring = () => {
    const newEntry = {
      id: Date.now(),
      monitoring_number: '',
      monitoring_period: '',
      week_number: '',
      implementation_level: '',
      achievement_indicator: '',
      notes: '',
      created_at: new Date().toISOString()
    };
    
    const updatedEntries = [...monitoringEntries, newEntry];
    handleMonitoringChange(updatedEntries);
    
    toast({
      title: "تمت إضافة متابعة جديدة",
      description: "يمكنك الآن ملء تفاصيل المتابعة.",
      variant: "success",
    });
  };

  const updateMonitoringEntry = (entryId, field, value) => {
    const updatedEntries = monitoringEntries.map(entry =>
      entry.id === entryId ? { ...entry, [field]: value } : entry
    );
    handleMonitoringChange(updatedEntries);
  };

  const removeMonitoringEntry = (entryId) => {
    const updatedEntries = monitoringEntries.filter(entry => entry.id !== entryId);
    handleMonitoringChange(updatedEntries);
    
    toast({
      title: "تم حذف المتابعة",
      description: "تم حذف المتابعة بنجاح.",
      variant: "default",
    });
  };

  const getImplementationLevelColor = (level) => {
    const levelConfig = IMPLEMENTATION_LEVELS.find(l => l.value === level);
    return levelConfig ? levelConfig.color : 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getCompletionStats = () => {
    const total = monitoringEntries.length;
    const completed = monitoringEntries.filter(entry => 
      entry.monitoring_number && 
      entry.monitoring_period && 
      entry.week_number && 
      entry.implementation_level && 
      entry.achievement_indicator
    ).length;
    
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-8">
      <Card className="border-indigo-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            متابعة تنفيذ الخطة من قبل الإدارة المدرسية
          </CardTitle>
          <CardDescription className="text-indigo-100">
            نظام متابعة شامل لتقييم مستوى تنفيذ الخطة التشغيلية على مدار العام الدراسي
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">إجمالي المتابعات</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                </div>
                <ClipboardList className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">المتابعات المكتملة</p>
                  <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">نسبة الإنجاز</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.percentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          <Button 
            onClick={addNewMonitoring}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة متابعة جديدة
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {monitoringEntries.length > 0 ? (
          <div className="space-y-6">
            {monitoringEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        المتابعة رقم {index + 1}
                      </CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMonitoringEntry(entry.id)}
                        className="hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`monitoring-number-${entry.id}`} className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-indigo-600" />
                          رقم المتابعة
                        </Label>
                        <Select
                          value={entry.monitoring_number?.toString() || ''}
                          onValueChange={(value) => updateMonitoringEntry(entry.id, 'monitoring_number', parseInt(value))}
                        >
                          <SelectTrigger id={`monitoring-number-${entry.id}`}>
                            <SelectValue placeholder="اختر رقم المتابعة" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONITORING_NUMBERS.map((number) => (
                              <SelectItem key={number.value} value={number.value.toString()}>
                                {number.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`monitoring-period-${entry.id}`} className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          موعد المتابعة
                        </Label>
                        <Select
                          value={entry.monitoring_period || ''}
                          onValueChange={(value) => updateMonitoringEntry(entry.id, 'monitoring_period', value)}
                          disabled={!entry.monitoring_number}
                        >
                          <SelectTrigger id={`monitoring-period-${entry.id}`}>
                            <SelectValue placeholder="اختر موعد المتابعة" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONITORING_PERIODS.map((period) => (
                              <SelectItem key={period.value} value={period.value}>
                                {period.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`week-number-${entry.id}`} className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          الأسبوع
                        </Label>
                        <Select
                          value={entry.week_number?.toString() || ''}
                          onValueChange={(value) => updateMonitoringEntry(entry.id, 'week_number', parseInt(value))}
                          disabled={!entry.monitoring_period}
                        >
                          <SelectTrigger id={`week-number-${entry.id}`}>
                            <SelectValue placeholder="اختر الأسبوع" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONITORING_WEEKS.map((week) => (
                              <SelectItem key={week.value} value={week.value.toString()}>
                                الأسبوع {week.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`implementation-level-${entry.id}`} className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          مستوى التنفيذ
                        </Label>
                        <Select
                          value={entry.implementation_level || ''}
                          onValueChange={(value) => updateMonitoringEntry(entry.id, 'implementation_level', value)}
                          disabled={!entry.week_number}
                        >
                          <SelectTrigger id={`implementation-level-${entry.id}`}>
                            <SelectValue placeholder="اختر مستوى التنفيذ" />
                          </SelectTrigger>
                          <SelectContent>
                            {IMPLEMENTATION_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${level.color}`}>
                                  {level.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {entry.implementation_level && (
                          <div className={`px-3 py-2 rounded-lg text-sm font-medium border ${getImplementationLevelColor(entry.implementation_level)} mt-2`}>
                            المستوى المحدد: {IMPLEMENTATION_LEVELS.find(l => l.value === entry.implementation_level)?.label}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`achievement-indicator-${entry.id}`} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                          مؤشرات التحقق
                        </Label>
                        <Select
                          value={entry.achievement_indicator || ''}
                          onValueChange={(value) => updateMonitoringEntry(entry.id, 'achievement_indicator', value)}
                          disabled={!entry.implementation_level}
                        >
                          <SelectTrigger id={`achievement-indicator-${entry.id}`}>
                            <SelectValue placeholder="اختر مؤشر التحقق" />
                          </SelectTrigger>
                          <SelectContent>
                            {ACHIEVEMENT_INDICATORS.map((indicator) => (
                              <SelectItem key={indicator.value} value={indicator.value}>
                                {indicator.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 lg:col-span-3">
                        <Label htmlFor={`notes-${entry.id}`} className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                          ملاحظات إضافية
                        </Label>
                        <Textarea
                          id={`notes-${entry.id}`}
                          value={entry.notes || ''}
                          onChange={(e) => updateMonitoringEntry(entry.id, 'notes', e.target.value)}
                          placeholder="أضف أي ملاحظات أو تفاصيل إضافية حول هذه المتابعة..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200 shadow-md">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد متابعات حتى الآن</h3>
                <p className="text-gray-500 mb-6">
                  ابدأ بإضافة متابعة جديدة لتتبع تنفيذ الخطة التشغيلية
                </p>
                <Button 
                  onClick={addNewMonitoring}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                >
                  <Plus className="ml-2 h-5 w-5" />
                  إضافة أول متابعة
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>

      {monitoringEntries.length > 0 && (
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              ملخص المتابعة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-600">مستوى جيد</p>
                <p className="text-xl font-bold text-green-800">
                  {monitoringEntries.filter(e => e.implementation_level === 'good').length}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-600">مستوى متوسط</p>
                <p className="text-xl font-bold text-yellow-800">
                  {monitoringEntries.filter(e => e.implementation_level === 'average').length}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-600">مستوى ضعيف</p>
                <p className="text-xl font-bold text-red-800">
                  {monitoringEntries.filter(e => e.implementation_level === 'weak').length}
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-600">متوسط التنفيذ</p>
                <p className="text-xl font-bold text-blue-800">
                  {monitoringEntries.length > 0 && monitoringEntries.filter(e => e.implementation_level).length > 0 ? Math.round(
                    (monitoringEntries.filter(e => e.implementation_level === 'good').length * 100 +
                     monitoringEntries.filter(e => e.implementation_level === 'average').length * 70 +
                     monitoringEntries.filter(e => e.implementation_level === 'weak').length * 40) / 
                    monitoringEntries.filter(e => e.implementation_level).length
                  ) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanImplementationMonitoringSection;