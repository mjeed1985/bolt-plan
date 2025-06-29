import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { ClipboardList, TrendingUp } from 'lucide-react';
import {
  MONITORING_NUMBERS,
  MONITORING_PERIODS,
  MONITORING_WEEKS,
  IMPLEMENTATION_LEVELS,
  ACHIEVEMENT_INDICATORS
} from '@/lib/operationalPlanConstants';

const getDisplayValue = (value, optionsArray, placeholder = "غير محدد") => {
  if (value === null || value === undefined || value === '') return placeholder;
  const foundOption = optionsArray.find(opt => String(opt.value) === String(value));
  return foundOption ? foundOption.label : String(value);
};

const getImplementationLevelInfo = (level) => {
  const levelConfig = IMPLEMENTATION_LEVELS.find(l => l.value === level);
  if (!levelConfig) return { label: 'غير محدد', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  return levelConfig;
};

const PlanMonitoringSummarySection = ({ planData }) => {
  const monitoringEntries = planData.plan_implementation_monitoring || [];

  if (monitoringEntries.length === 0) {
    return null;
  }

  const stats = {
    good: monitoringEntries.filter(e => e.implementation_level === 'good').length,
    average: monitoringEntries.filter(e => e.implementation_level === 'average').length,
    weak: monitoringEntries.filter(e => e.implementation_level === 'weak').length,
  };
  const totalRated = stats.good + stats.average + stats.weak;
  const averageImplementation = totalRated > 0 ? Math.round(
    (stats.good * 100 + stats.average * 70 + stats.weak * 40) / totalRated
  ) : 0;

  return (
    <SummarySection id="plan_monitoring" title="متابعة تنفيذ الخطة" icon={ClipboardList}>
      <SectionCard title="ملخص المتابعة" icon={<TrendingUp />} className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <div className="bg-green-100 p-4 rounded-lg border border-green-300 text-center">
            <p className="text-sm font-medium text-green-700">مستوى جيد</p>
            <p className="text-2xl font-bold text-green-800">{stats.good}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300 text-center">
            <p className="text-sm font-medium text-yellow-700">مستوى متوسط</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.average}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg border border-red-300 text-center">
            <p className="text-sm font-medium text-red-700">مستوى ضعيف</p>
            <p className="text-2xl font-bold text-red-800">{stats.weak}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-300 text-center">
            <p className="text-sm font-medium text-blue-700">متوسط التنفيذ</p>
            <p className="text-2xl font-bold text-blue-800">{averageImplementation}%</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="تفاصيل المتابعات" icon={<ClipboardList />}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">رقم المتابعة</th>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">موعد المتابعة</th>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">الأسبوع</th>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">مستوى التنفيذ</th>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">مؤشرات التحقق</th>
                <th className="p-3 text-right font-semibold text-slate-700 border-b-2 border-slate-200">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {monitoringEntries.map((entry, index) => {
                const levelInfo = getImplementationLevelInfo(entry.implementation_level);
                return (
                  <tr key={entry.id || index} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="p-3 text-gray-700">{getDisplayValue(entry.monitoring_number, MONITORING_NUMBERS)}</td>
                    <td className="p-3 text-gray-700">{getDisplayValue(entry.monitoring_period, MONITORING_PERIODS)}</td>
                    <td className="p-3 text-gray-700">{getDisplayValue(entry.week_number, MONITORING_WEEKS, `الأسبوع ${entry.week_number}`)}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${levelInfo.color}`}>
                        {levelInfo.label}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{getDisplayValue(entry.achievement_indicator, ACHIEVEMENT_INDICATORS)}</td>
                    <td className="p-3 text-gray-700">{entry.notes || 'لا يوجد'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </SummarySection>
  );
};

export default PlanMonitoringSummarySection;