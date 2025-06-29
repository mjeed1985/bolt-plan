import React from 'react';
import BasicInfoForm from '../basic-info/BasicInfoForm';

const BasicInfoSection = ({ planData, onPlanDataChange }) => {
  return (
    <div>
      <BasicInfoForm planData={planData} onPlanDataChange={onPlanDataChange} />
    </div>
  );
};

export default BasicInfoSection;