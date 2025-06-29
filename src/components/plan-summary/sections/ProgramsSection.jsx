import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { Briefcase, Users, Target, CalendarDays, DollarSign, AlertTriangle, ShieldCheck, Megaphone } from 'lucide-react';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';
import { 
  PROGRAM_OR_INITIATIVE_TYPES,
  SUGGESTED_PROGRAMS,
  SUGGESTED_INITIATIVES,
  RESPONSIBLE_PARTIES_OPTIONS,
  KPI_PROGRAM_OPTIONS,
  KPI_INITIATIVE_OPTIONS,
  DURATION_PROGRAM_OPTIONS,
  DURATION_INITIATIVE_OPTIONS,
  COMMUNICATION_METHODS_OPTIONS
} from '@/lib/programsOptions';

const ProgramsSection = ({ planData }) => {
  const programs = planData.programs_initiatives || [];
  return (
    <SummarySection id="programs" title="البرامج والمبادرات" icon={Briefcase}>
      {(programs.filter(p => p.name || p.customName).length > 0) ? (
        programs.filter(p => p.name || p.customName).map((program, index) => {
          const typeLabel = getDisplayValue(program.type, PROGRAM_OR_INITIATIVE_TYPES, 'بند');
          const nameLabel = program.name === 'other' ? program.customName : (getDisplayValue(program.name, program.type === 'program' ? SUGGESTED_PROGRAMS : SUGGESTED_INITIATIVES, 'غير مسمى'));
          return (
            <SectionCard key={program.id || index} title={`${typeLabel}: ${nameLabel}`} icon={<Briefcase />} className="mb-6 border-green-100">
              <InfoItem label="المسؤول" value={program.responsible_party === 'other' ? program.custom_responsible_party : getDisplayValue(program.responsible_party, RESPONSIBLE_PARTIES_OPTIONS)} icon={<Users />} />
              <InfoItem label="KPI" value={program.kpi === 'other' ? program.custom_kpi : getDisplayValue(program.kpi, program.type === 'program' ? KPI_PROGRAM_OPTIONS : KPI_INITIATIVE_OPTIONS)} icon={<Target />} />
              <InfoItem label="المدة" value={program.duration === 'other' ? program.custom_duration : getDisplayValue(program.duration, program.type === 'program' ? DURATION_PROGRAM_OPTIONS : DURATION_INITIATIVE_OPTIONS)} icon={<CalendarDays />} />
              <InfoItem label="الموارد" value={program.resources?.filter(r => r.selected)} icon={<DollarSign />} isList={true} subListKey="name" />
              <InfoItem label="التحديات" value={program.challenges?.filter(c => c.selected)} icon={<AlertTriangle />} isList={true} subListKey="name" />
              <InfoItem label="خطة الطوارئ" value={program.contingency_plan} icon={<ShieldCheck />} />
              <InfoItem label="أساليب التواصل" value={program.communication_methods?.map(id => COMMUNICATION_METHODS_OPTIONS.find(opt => opt.id === id)?.label).filter(Boolean) || []} icon={<Megaphone />} isList={true} />
            </SectionCard>
          );
        })
      ) : (
        <p className="text-gray-500 text-center py-4">لا برامج أو مبادرات.</p>
      )}
    </SummarySection>
  );
};

export default ProgramsSection;