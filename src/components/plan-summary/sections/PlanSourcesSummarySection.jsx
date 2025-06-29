import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { BookText } from 'lucide-react';

const PlanSourcesSummarySection = ({ planData }) => {
  const sourcesText = planData.plan_sources_text;

  if (!sourcesText || sourcesText.trim() === '') {
    return null;
  }

  return (
    <SummarySection id="plan_sources" title="مصادر بناء الخطة" icon={BookText}>
      <SectionCard title="المصادر التي اعتمد عليها فريق اعداد الخطة" icon={<BookText />} contentClassName="p-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{sourcesText}</p>
      </SectionCard>
    </SummarySection>
  );
};

export default PlanSourcesSummarySection;