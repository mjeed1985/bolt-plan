import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import SwotItemCard from '@/components/plan-summary/SwotItemCard';
import { Activity, Lightbulb, Zap, Target, ShieldAlert, Sparkles } from 'lucide-react';

const SwotSection = ({ planData }) => {
  const swot = planData.swot_analysis || {};
  const strengths = [...(swot.strengths?.selected || []), ...(swot.strengths?.custom?.filter(s => s.trim() !== '') || [])];
  const weaknesses = [...(swot.weaknesses?.selected || []), ...(swot.weaknesses?.custom?.filter(w => w.trim() !== '') || [])];
  const opportunities = [...(swot.opportunities?.selected || []), ...(swot.opportunities?.custom?.filter(o => o.trim() !== '') || [])];
  const threats = [...(swot.threats?.selected || []), ...(swot.threats?.custom?.filter(t => t.trim() !== '') || [])];
  const strategicVisions = swot.strategic_visions || "";

  return (
    <SummarySection id="swot" title="تحليل SWOT" icon={Activity}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SwotItemCard title="القوة" items={strengths} icon={<Lightbulb />} bgColorClass="bg-green-50" borderColorClass="border-green-300" textColorClass="text-green-700" />
        <SwotItemCard title="الضعف" items={weaknesses} icon={<Zap />} bgColorClass="bg-red-50" borderColorClass="border-red-300" textColorClass="text-red-700" />
        <SwotItemCard title="الفرص" items={opportunities} icon={<Target />} bgColorClass="bg-blue-50" borderColorClass="border-blue-300" textColorClass="text-blue-700" />
        <SwotItemCard title="التهديدات" items={threats} icon={<ShieldAlert />} bgColorClass="bg-yellow-50" borderColorClass="border-yellow-300" textColorClass="text-yellow-700" />
      </div>
      {strategicVisions && (
        <SectionCard title="الرؤى الاستراتيجية" icon={<Sparkles />} className="mt-8" contentClassName="p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{strategicVisions}</p>
        </SectionCard>
      )}
    </SummarySection>
  );
};

export default SwotSection;