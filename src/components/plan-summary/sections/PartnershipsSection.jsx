import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { HeartHandshake, Layers, Target, ListChecks, UserCheck } from 'lucide-react';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';
import { PARTNERSHIP_TYPES } from '@/lib/operationalPlanConstants';

const PartnershipsSection = ({ planData }) => {
  const partnerships = planData.partnerships || [];
  return (
    <SummarySection id="partnerships" title="الشراكات والتعاون" icon={HeartHandshake}>
      {(partnerships.length > 0) ? (
        partnerships.map((partnership, index) => (
          <SectionCard key={partnership.id || index} title={`الشراكة ${index + 1}: ${partnership.partner_name || 'شريك غير مسمى'}`} icon={<HeartHandshake />} className="mb-6 border-teal-100">
            <InfoItem label="النوع" value={getDisplayValue(partnership.partnership_type, PARTNERSHIP_TYPES)} icon={<Layers />} />
            <InfoItem label="الأهداف" value={partnership.objectives} icon={<Target />} />
            <InfoItem label="الأنشطة" value={partnership.activities} icon={<ListChecks />} />
            <InfoItem label="المسؤول" value={partnership.responsible_person} icon={<UserCheck />} />
          </SectionCard>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">لا توجد شراكات محددة.</p>
      )}
    </SummarySection>
  );
};

export default PartnershipsSection;