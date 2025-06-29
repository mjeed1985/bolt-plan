import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { BarChart3, BarChart2, ShieldCheck } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';

const ChartsSection = ({ programStatusData, goalsByDomainData, risksBySeverityData }) => {
  return (
    <SummarySection id="charts" title="المؤشرات والرسوم البيانية" icon={BarChart3}>
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="حالة البرامج والمبادرات" icon={<BarChart3 />} contentClassName="p-4 h-[350px]">
          {programStatusData ? <Pie data={programStatusData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}
        </SectionCard>
        <SectionCard title="توزيع الأهداف على المجالات" icon={<BarChart2 />} contentClassName="p-4 h-[350px]">
          {goalsByDomainData ? <Bar data={goalsByDomainData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}
        </SectionCard>
        <SectionCard title="توزيع المخاطر حسب الخطورة" icon={<ShieldCheck />} className="lg:col-span-2" contentClassName="p-4 h-[350px]">
          {risksBySeverityData ? <Pie data={risksBySeverityData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}
        </SectionCard>
      </div>
    </SummarySection>
  );
};

export default ChartsSection;