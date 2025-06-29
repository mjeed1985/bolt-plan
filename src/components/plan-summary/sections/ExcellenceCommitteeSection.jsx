import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { ShieldCheck, Users, FileText } from 'lucide-react';
import { JOB_TITLES_KSA, COMMITTEE_MEMBER_ROLES } from '@/lib/operationalPlanConstants';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';

const ExcellenceCommitteeSection = ({ planData }) => {
  const committeeMembers = planData.excellence_committee_members || [];
  const committeeResponsibilities = planData.excellence_committee_responsibilities || "";

  return (
    <SummarySection id="excellence_committee" title="لجنة التميز المدرسي" icon={<ShieldCheck />}>
      {committeeMembers.length > 0 ? (
        <SectionCard title="أعضاء لجنة التميز المدرسي" icon={<Users />} className="mb-6" contentClassName="p-0 sm:p-2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسمى الوظيفي</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور في اللجنة</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مسؤوليات إضافية</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {committeeMembers.map((member, index) => (
                  <tr key={member.id || index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.name || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{getDisplayValue(member.job_title, JOB_TITLES_KSA, member.job_title || 'N/A')}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{getDisplayValue(member.role_in_committee, COMMITTEE_MEMBER_ROLES, member.role_in_committee || 'N/A')}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.additional_responsibilities || 'لا يوجد'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="أعضاء لجنة التميز المدرسي" icon={<Users />} className="mb-6">
            <p className="text-gray-500 text-center py-4">لم يتم تحديد أعضاء لجنة التميز المدرسي.</p>
        </SectionCard>
      )}

      <SectionCard title="مسؤوليات ومهام لجنة التميز المدرسي" icon={<FileText />} contentClassName="p-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{committeeResponsibilities || "لم يتم تحديد مسؤوليات لجنة التميز."}</p>
      </SectionCard>
    </SummarySection>
  );
};

export default ExcellenceCommitteeSection;