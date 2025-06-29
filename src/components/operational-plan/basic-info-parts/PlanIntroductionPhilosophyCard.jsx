import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlignLeft, Lightbulb } from 'lucide-react';

const PlanIntroductionPhilosophyCard = ({ localPlanData, renderAIGeneratorField, generateSchoolIntroductionAI, isGeneratingIntroduction, generatePlanPhilosophyAI, isGeneratingPhilosophy }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="text-indigo-600"/> مقدمة وفلسفة الخطة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {renderAIGeneratorField("school_introduction", "مقدمة عن المدرسة", "اكتب مقدمة تعريفية عن المدرسة، تاريخها، موقعها، وأبرز مميزاتها...", localPlanData.school_introduction || '', generateSchoolIntroductionAI, isGeneratingIntroduction, AlignLeft, 6)}
        {renderAIGeneratorField("plan_philosophy", "فلسفة الخطة", "اكتب الفلسفة التي تستند إليها هذه الخطة التشغيلية...", localPlanData.plan_philosophy || '', generatePlanPhilosophyAI, isGeneratingPhilosophy, Lightbulb, 4)}
      </CardContent>
    </Card>
  );
};

export default PlanIntroductionPhilosophyCard;