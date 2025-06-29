import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import CoreValueDisplayCard from '@/components/plan-summary/CoreValueDisplayCard';
import { BookOpen, Gem, ShieldCheck, Sparkles, Users, Home, Users2, TrendingUp, CheckCircle } from 'lucide-react';

const EthicsSection = ({ planData }) => {
  const ethicsCharter = planData.ethics_charter || { charter_text: '', core_values: [] };
  const valueIconMapping = {
    'النزاهة والشفافية': ShieldCheck,
    'الابتكار والتطوير المستمر': Sparkles,
    'الاحترام المتبادل والتقدير': Users,
    'المسؤولية المجتمعية والانتماء': Home,
    'التعاون والعمل بروح الفريق': Users2,
    'التميز والجودة في الأداء': TrendingUp,
    'العدالة وتكافؤ الفرص': CheckCircle,
    'الالتزام والانضباط': BookOpen,
  };

  return (
    <SummarySection id="ethics" title="الميثاق الأخلاقي والقيم الأساسية" icon={BookOpen}>
      <SectionCard title="الميثاق الأخلاقي" icon={<BookOpen />} className="mb-6" contentClassName="p-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{ethicsCharter.charter_text || "لم يتم تحديد نص الميثاق."}</p>
      </SectionCard>
      <SectionCard title="القيم الأساسية" icon={<Gem />} contentClassName="p-4">
        {ethicsCharter.core_values && ethicsCharter.core_values.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ethicsCharter.core_values.map((value, index) => (
              <CoreValueDisplayCard key={index} valueName={value.name} description={value.description} icon={valueIconMapping[value.name] || Gem} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">لم تحدد قيم أساسية.</p>
        )}
      </SectionCard>
    </SummarySection>
  );
};

export default EthicsSection;