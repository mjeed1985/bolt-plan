import React from 'react';
import StaffListForm from '../school-staff/StaffListForm';

const SchoolStaffSection = ({ planData, onChange }) => {
    const handleStaffListChange = (newStaffList) => {
        onChange({ school_staff_list: newStaffList });
    };
    
    return (
        <div>
            <StaffListForm
                staffList={planData.school_staff_list || []}
                onChange={handleStaffListChange}
            />
        </div>
    );
};

export default SchoolStaffSection;