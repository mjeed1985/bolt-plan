import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { ListOrdered, Settings2 } from 'lucide-react';
import { SCHOOL_ASPECTS_AREAS } from '@/lib/constants/schoolAspectsData';

const SchoolAspectsSummarySection = ({ planData }) => {
  const rankedAspects = planData.ranked_school_aspects || [];
  const detailedAspects = planData.detailed_school_aspects || {};

  const hasRankedAspects = rankedAspects && rankedAspects.length > 0;
  const hasDetailedAspects = detailedAspects && Object.keys(detailedAspects).some(key => detailedAspects[key] && detailedAspects[key].length > 0);

  if (!hasRankedAspects && !hasDetailedAspects) {
    return null;
  }

  const getRankColor = (index) => {
    const colors = [
      'bg-red-500 text-white border-red-700',           // Rank 1
      'bg-red-300 text-red-900 border-red-500',         // Rank 2
      'bg-orange-400 text-white border-orange-600',     // Rank 3
      'bg-yellow-400 text-yellow-900 border-yellow-600',// Rank 4
      'bg-yellow-200 text-yellow-800 border-yellow-400',// Rank 5
      'bg-green-300 text-green-900 border-green-500',   // Rank 6
      'bg-green-500 text-white border-green-700',       // Rank 7
    ];
    return colors[index] || 'bg-slate-200 text-gray-800 border-slate-400';
  };

  return (
    <SummarySection id="school_aspects" title="أولويات التطوير والتحسين" icon={ListOrdered}>
      {hasRankedAspects && (
        <SectionCard title="المجالات الأولى بالترتيب (تنازليًا)" icon={<ListOrdered />} className="mb-6" contentClassName="p-4">
          <div className="space-y-3">
            {rankedAspects.map((aspect, index) => (
              <div
                key={aspect.id}
                className={`flex items-center p-3 rounded-lg border-r-8 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getRankColor(index)}`}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 text-lg font-extrabold text-white ml-4 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-md font-semibold flex-grow">{aspect.name}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {hasDetailedAspects && (
        <SectionCard title="الجوانب المدرسية حسب المجالات (تفصيلي)" icon={<Settings2 />} contentClassName="p-4 space-y-6">
          {SCHOOL_ASPECTS_AREAS.map(mainAspect => (
            detailedAspects[mainAspect.id] && detailedAspects[mainAspect.id].length > 0 && (
              <div key={mainAspect.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <h4 className="font-bold text-lg text-teal-800 mb-3 pb-2 border-b border-teal-200">{mainAspect.name}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className="bg-teal-50">
                      <tr>
                        <th className="p-3 text-right font-semibold text-teal-700 border-b-2 border-teal-200">الجانب الفرعي</th>
                        <th className="p-3 text-right font-semibold text-teal-700 border-b-2 border-teal-200">مؤشرات الأداء</th>
                        <th className="p-3 text-right font-semibold text-teal-700 border-b-2 border-teal-200">ملاحظات / إجراءات مقترحة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedAspects[mainAspect.id].map((subAspect, index) => (
                        <tr key={subAspect.id || index} className="border-b border-slate-200 hover:bg-teal-50/50">
                          <td className="p-3 text-gray-700">{subAspect.name}</td>
                          <td className="p-3 text-gray-700">{subAspect.indicators}</td>
                          <td className="p-3 text-gray-700">{subAspect.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </SectionCard>
      )}
    </SummarySection>
  );
};

export default SchoolAspectsSummarySection;