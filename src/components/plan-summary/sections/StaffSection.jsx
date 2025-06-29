import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { KeyRound, Users, GraduationCap, Briefcase, ListChecks, Sparkles, BookOpen } from 'lucide-react';
import { STAFF_SPECIALIZATIONS_KSA, TRAINING_AREAS } from '@/lib/operationalPlanConstants';

const StaffSection = ({ planData }) => {
  const staffDevelopment = planData.staff_development || {};

  const formattedSpecializations = (staffDevelopment.specializations_list || []).map(spec => {
    const label = STAFF_SPECIALIZATIONS_KSA.find(s => s.value === spec.specialization)?.label || spec.custom_specialization || spec.specialization;
    return {
      name: `${label} (العدد: ${spec.count || 0})`
    };
  });

  const formattedTrainingNeeds = (staffDevelopment.training_needs || []).map(need => {
    if (typeof need === 'object' && need !== null) {
      return need.label || need.value || JSON.stringify(need);
    }
    return TRAINING_AREAS.find(area => area.value === need)?.label || need;
  });

  return (
    <SummarySection id="staff" title="الكادر والتطوير المهني" icon={KeyRound}>
      <SectionCard title="معلومات الكادر" icon={<Users />} className="mb-6">
        <InfoItem label="إجمالي الكادر" value={staffDevelopment.total_staff?.toString()} icon={<Users />} />
        <InfoItem label="التخصصات والعدد" value={formattedSpecializations} icon={<GraduationCap />} isList={true} subListKey="name" />
      </SectionCard>
      <SectionCard title="احتياجات التطوير" icon={<Briefcase />} className="mb-6">
        <InfoItem label="مجالات التدريب" value={formattedTrainingNeeds} icon={<ListChecks />} isList={true} />
      </SectionCard>
      <SectionCard title="خطط التطوير المقترحة" icon={<Sparkles />} contentClassName="p-4">
        <InfoItem label="الخطط" value={staffDevelopment.professional_development_plans} icon={<BookOpen />} />
      </SectionCard>
    </SummarySection>
  );
};

export default StaffSection;