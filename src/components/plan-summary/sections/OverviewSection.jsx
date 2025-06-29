import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import MetricCard from '@/components/plan-summary/MetricCard';
import SectionCard from '@/components/plan-summary/SectionCard';
import { Eye, Building, UserCheck, Users, Users2, Layers, BookOpen, ShieldCheck, ChevronsRight } from 'lucide-react';
import { PLAN_NATURES } from '@/lib/operationalPlanConstants';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';

const OverviewSection = ({ planData }) => {
  return (
    <SummarySection id="overview" title="نظرة عامة" icon={Eye}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        <MetricCard title="اسم المدرسة" value={planData.school_name_full || 'N/A'} icon={<Building />} />
        <MetricCard title="قائد المدرسة" value={planData.principal_name || 'N/A'} icon={<UserCheck />} />
        <MetricCard title="عدد الطلاب" value={planData.student_count?.toString() || '0'} icon={<Users />} color="text-green-600" />
        <MetricCard title="عدد المعلمين" value={planData.teacher_count?.toString() || '0'} icon={<Users2 />} color="text-blue-600" />
        <MetricCard title="عدد الإداريين" value={planData.admin_count?.toString() || '0'} icon={<Users />} color="text-purple-600" />
        <MetricCard title="عدد الفصول" value={planData.classroom_count?.toString() || '0'} icon={<Layers />} color="text-orange-600" />
        <MetricCard title="طبيعة الخطة" value={getDisplayValue(planData.plan_nature, PLAN_NATURES)} icon={<BookOpen />} />
        <MetricCard title="حالة الخطة" value={planData.status === 'completed' ? 'مكتملة' : 'مسودة'} icon={<ShieldCheck />} color={planData.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}/>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SectionCard title="الرؤية" icon={<ChevronsRight />} contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.school_vision || "لم يتم تحديد الرؤية."}</p></SectionCard>
        <SectionCard title="الرسالة" icon={<ChevronsRight />} contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.school_mission || "لم يتم تحديد الرسالة."}</p></SectionCard>
        <SectionCard title="فلسفة القائد التعليمية" icon={<ChevronsRight />} className="lg:col-span-2" contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.plan_philosophy || "لم يتم تحديد فلسفة القائد."}</p></SectionCard>
      </div>
    </SummarySection>
  );
};

export default OverviewSection;