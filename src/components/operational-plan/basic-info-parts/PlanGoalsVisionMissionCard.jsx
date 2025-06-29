import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Lightbulb } from 'lucide-react';

const PlanGoalsVisionMissionCard = ({ localPlanData, renderAIGeneratorField, generatePlanObjectiveAI, isGeneratingObjective, generateSchoolVisionAI, isGeneratingVision, generateSchoolMissionAI, isGeneratingMission }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><Target className="text-indigo-600"/> أهداف ورؤية ورسالة الخطة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {renderAIGeneratorField("plan_objective", "أهداف الخطة التشغيلية", "اكتب الأهداف الرئيسية للخطة التشغيلية...", localPlanData.plan_objective || '', generatePlanObjectiveAI, isGeneratingObjective, Target, 6)}
        {renderAIGeneratorField("school_vision", "رؤية المدرسة", "اكتب رؤية المدرسة الطموحة...", localPlanData.school_vision || '', generateSchoolVisionAI, isGeneratingVision, Lightbulb, 3)}
        {renderAIGeneratorField("school_mission", "رسالة المدرسة", "اكتب رسالة المدرسة التي توضح التزامها تجاه طلابها ومجتمعها...", localPlanData.school_mission || '', generateSchoolMissionAI, isGeneratingMission, Lightbulb, 4)}
      </CardContent>
    </Card>
  );
};

export default PlanGoalsVisionMissionCard;