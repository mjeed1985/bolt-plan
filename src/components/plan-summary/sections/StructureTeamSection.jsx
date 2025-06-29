import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { Users as CommitteeIcon, FileText as ResponsibilitiesIcon } from 'lucide-react';
import { JOB_TITLES_KSA, COMMITTEE_MEMBER_ROLES } from '@/lib/operationalPlanConstants';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';

const StructureTeamSection = ({ planData }) => {
  const planningCommittee = planData.planning_committee_data || [];
  const teamResponsibilities = planData.team_responsibilities_data || "";

  return (
    <SummarySection id="structure_team" title="هيكل وفريق إعداد الخطة" icon={CommitteeIcon}>
      {planningCommittee.length > 0 ? (
        <SectionCard title="لجنة إعداد الخطة التشغيلية" icon={<CommitteeIcon />} className="mb-6" contentClassName="p-0 sm:p-2">
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
                {planningCommittee.map((member, index) => (
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
        <p className="text-gray-500 text-center py-4">لم يتم تحديد أعضاء لجنة إعداد الخطة.</p>
      )}
      <SectionCard title="مسؤوليات ومهام فريق التخطيط المدرسي" icon={<ResponsibilitiesIcon />} contentClassName="p-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{teamResponsibilities || "لم يتم تحديد مسؤوليات فريق التخطيط."}</p>
      </SectionCard>
    </SummarySection>
  );
};

export default StructureTeamSection;