import React from 'react';
import GeneralGoalsCard from '../education-goals/GeneralGoalsCard';
import StageGoalsCard from '../education-goals/StageGoalsCard';
import ImplementationStrategiesCard from '../education-goals/ImplementationStrategiesCard';

const EducationStrategicGoalsSection = ({ planData, onChange }) => {
    return (
        <div className="space-y-8">
            <GeneralGoalsCard planData={planData} onChange={onChange} />
            <StageGoalsCard planData={planData} onChange={onChange} />
            <ImplementationStrategiesCard planData={planData} onChange={onChange} />
        </div>
    );
};

export default EducationStrategicGoalsSection;