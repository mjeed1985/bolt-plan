import React from 'react';
import CommitteeMembersForm from '../plan-structure/CommitteeMembersForm';
import TeamResponsibilitiesForm from '../plan-structure/TeamResponsibilitiesForm';

const PlanStructureTeamSection = ({ planData, onChange }) => {
  return (
    <div className="space-y-8">
      <CommitteeMembersForm
        members={planData.planning_committee_data || []}
        onChange={(newMembers) => onChange({ planning_committee_data: newMembers })}
      />
      <TeamResponsibilitiesForm
        responsibilities={planData.team_responsibilities_data || ''}
        onChange={(newResponsibilities) => onChange({ team_responsibilities_data: newResponsibilities })}
      />
    </div>
  );
};

export default PlanStructureTeamSection;