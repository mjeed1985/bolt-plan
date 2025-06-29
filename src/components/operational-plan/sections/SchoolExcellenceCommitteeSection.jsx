import React from 'react';
import CommitteeMembersForm from '../school-excellence/CommitteeMembersForm';
import CommitteeResponsibilitiesForm from '../school-excellence/CommitteeResponsibilitiesForm';

const SchoolExcellenceCommitteeSection = ({ planData, onChange }) => {
    const handleMembersChange = (newMembers) => {
        onChange({ ...planData, excellence_committee_members: newMembers });
    };

    const handleResponsibilitiesChange = (newResponsibilities) => {
        onChange({ ...planData, excellence_committee_responsibilities: newResponsibilities });
    };

    return (
        <div className="space-y-8">
            <CommitteeMembersForm
                members={planData.excellence_committee_members || []}
                onChange={handleMembersChange}
            />
            <CommitteeResponsibilitiesForm
                responsibilities={planData.excellence_committee_responsibilities || ''}
                onChange={handleResponsibilitiesChange}
            />
        </div>
    );
};

export default SchoolExcellenceCommitteeSection;