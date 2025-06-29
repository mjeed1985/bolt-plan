import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { Target, BookOpen, Brain, Route, GraduationCap, Users } from 'lucide-react';

const EDUCATIONAL_STAGES_INFO = {
  kindergarten: { label: 'أهداف في مرحلة رياض الأطفال', icon: GraduationCap },
  primary: { label: 'أهداف في المرحلة الابتدائية', icon: BookOpen },
  middle: { label: 'أهداف في المرحلة المتوسطة', icon: Brain },
  secondary: { label: 'أهداف في المرحلة الثانوية', icon: Users },
};

const EducationGoalsSummarySection = ({ planData }) => {
  const generalGoals = planData.general_strategic_goals_text || "";
  const stageGoals = planData.stage_specific_goals_data || {};
  const implementationStrategies = planData.implementation_strategies_text || "";

  const hasStageGoals = Object.keys(stageGoals).some(key => stageGoals[key]?.trim());
  const hasData = generalGoals || hasStageGoals || implementationStrategies;

  if (!hasData) {
    return null;
  }

  return (
    <SummarySection id="education_goals" title="الأهداف الاستراتيجية للتعليم" icon={Brain}>
      {generalGoals && (
        <SectionCard title="الأهداف الاستراتيجية العامة" icon={<Target />} className="mb-6" contentClassName="p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{generalGoals}</p>
        </SectionCard>
      )}

      {hasStageGoals && (
         <SectionCard title="أهداف التعليم حسب المرحلة الدراسية" icon={<Brain />} className="mb-6" contentClassName="p-4 space-y-4">
            {Object.entries(stageGoals).map(([stageId, goalsText]) => {
                if (!goalsText?.trim()) return null;
                const stageInfo = EDUCATIONAL_STAGES_INFO[stageId] || { label: `أهداف ${stageId}`, icon: Brain };
                const StageIcon = stageInfo.icon;
                return (
                    <div key={stageId} className="p-4 bg-slate-50/70 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-lg text-emerald-700 flex items-center mb-2">
                           <StageIcon className="w-5 h-5 ml-2" />
                           {stageInfo.label}
                        </h4>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{goalsText}</p>
                    </div>
                )
            })}
        </SectionCard>
      )}

      {implementationStrategies && (
        <SectionCard title="استراتيجيات التنفيذ" icon={<Route />} contentClassName="p-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{implementationStrategies}</p>
        </SectionCard>
      )}
    </SummarySection>
  );
};

export default EducationGoalsSummarySection;