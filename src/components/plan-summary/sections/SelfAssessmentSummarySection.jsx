import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { BarChart3, Users, CheckSquare } from 'lucide-react';
import { SELF_ASSESSMENT_DOMAINS } from '@/lib/constants/selfAssessmentData';

const SelfAssessmentSummarySection = ({ planData }) => {
  const beneficiaries = planData.beneficiaries_data || [];
  const hasBeneficiaries = beneficiaries.length > 0;

  return (
    <SummarySection id="self_assessment" title="التقويم الذاتي والمستفيدون" icon={BarChart3}>
      <SectionCard title="مجالات التقويم الذاتي التي تم مراعاتها" icon={<BarChart3 />} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {SELF_ASSESSMENT_DOMAINS.map(domain => (
            <div key={domain.name} className="flex items-start bg-slate-50 p-3 rounded-lg">
              <domain.icon className="w-6 h-6 text-sky-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">{domain.name}</h4>
                <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                  {domain.subDomains.map(sub => <li key={sub}>{sub}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {hasBeneficiaries && (
        <SectionCard title="المستفيدون من الخطة" icon={<Users />}>
          <div className="space-y-4 p-4">
            {beneficiaries.map(beneficiary => (
              <div key={beneficiary.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <h4 className="font-bold text-lg text-teal-800 mb-2 flex items-center">
                  <CheckSquare className="w-5 h-5 text-teal-600 mr-2" />
                  {beneficiary.label}
                </h4>
                <p className="text-gray-700 leading-relaxed text-md whitespace-pre-line">
                  {beneficiary.description || "لم يتم تحديد وصف لكيفية الاستفادة."}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </SummarySection>
  );
};

export default SelfAssessmentSummarySection;