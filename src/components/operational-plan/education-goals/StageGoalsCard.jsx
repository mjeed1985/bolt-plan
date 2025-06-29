import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Building, Lightbulb, Loader2 } from 'lucide-react';
import {
  KINDERGARTEN_GOALS,
  PRIMARY_SCHOOL_GOALS,
  MIDDLE_SCHOOL_GOALS,
  SECONDARY_SCHOOL_GOALS,
} from '@/lib/operationalPlanConstants';
import { GraduationCap, BookOpen, Brain, Users } from 'lucide-react';

const EDUCATIONAL_STAGES = [
  { id: 'kindergarten', label: 'في مرحلة رياض الأطفال', icon: GraduationCap, goalsConstant: KINDERGARTEN_GOALS, promptFocus: "النمو الشامل للطفل، الاستعداد للمدرسة، اللعب والتعلم." },
  { id: 'primary', label: 'في المرحلة الابتدائية', icon: BookOpen, goalsConstant: PRIMARY_SCHOOL_GOALS, promptFocus: "تأسيس المهارات الأساسية، القيم الإسلامية، حب الوطن، اكتشاف المواهب." },
  { id: 'middle', label: 'في المرحلة المتوسطة', icon: Brain, goalsConstant: MIDDLE_SCHOOL_GOALS, promptFocus: "تنمية التفكير الناقد، المهارات الحياتية، الهوية الشخصية، الاستعداد للمرحلة الثانوية." },
  { id: 'secondary', label: 'في المرحلة الثانوية', icon: Users, goalsConstant: SECONDARY_SCHOOL_GOALS, promptFocus: "التخصص الأكاديمي والمهني، المواطنة الفاعلة، الاستعداد للجامعة وسوق العمل." },
];

const StageGoalsCard = ({
  selectedStages,
  stageGoals,
  onStageToggle,
  onStageGoalChange,
  onGeneratePredefined,
  onGenerateAI,
  isGeneratingAI,
  isApiReady,
  apiKeyError,
}) => {
  return (
    <Card className="border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
        <CardTitle className="text-xl flex items-center gap-2"><Building className="w-6 h-6" /> اهداف التعليم حسب المرحلة الدراسية</CardTitle>
        <CardDescription className="text-emerald-100">حدد المراحل الدراسية وقم بتوليد أو إدخال الأهداف الخاصة بكل مرحلة.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {EDUCATIONAL_STAGES.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-center space-x-3 space-x-reverse bg-slate-50 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
            >
              <Checkbox
                id={`stage-${stage.id}`}
                checked={selectedStages.includes(stage.id)}
                onCheckedChange={() => onStageToggle(stage.id)}
                className="form-checkbox h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <Label htmlFor={`stage-${stage.id}`} className="text-md font-medium text-gray-700 cursor-pointer flex-1 flex items-center">
                <stage.icon className="w-5 h-5 text-emerald-600 ml-2" />
                {stage.label}
              </Label>
            </motion.div>
          ))}
        </div>

        {selectedStages.length > 0 && (
          <div className="space-y-8 mt-6 border-t pt-8">
            {EDUCATIONAL_STAGES.filter(stage => selectedStages.includes(stage.id)).map((stage) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white shadow-md overflow-hidden rounded-lg">
                  <CardHeader className="pb-3 bg-slate-100 border-b">
                    <CardTitle className="text-lg text-emerald-700 flex items-center gap-2">
                      <stage.icon className="w-6 h-6" />
                      أهداف {stage.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <Button
                        onClick={() => onGeneratePredefined(stage.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Lightbulb className="ml-2 h-4 w-4" />
                        توليد أهداف المرحلة (نموذجية)
                      </Button>
                      <Button
                        onClick={() => onGenerateAI(stage.id, stage.label, stage.promptFocus)}
                        disabled={isGeneratingAI[stage.id] || !isApiReady}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        {isGeneratingAI[stage.id] ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Lightbulb className="ml-2 h-4 w-4" />}
                        {isGeneratingAI[stage.id] ? 'جاري التوليد...' : `اقتراح أهداف لـ ${stage.label.substring(3)} (AI)`}
                      </Button>
                    </div>
                    {!isApiReady && isGeneratingAI[stage.id] === undefined && (
                      <p className="text-xs text-red-600 mb-2 text-center">
                        {apiKeyError} لا يمكن استخدام ميزة الاقتراحات بالذكاء الاصطناعي حاليًا.
                      </p>
                    )}
                    <Textarea
                      value={stageGoals[stage.id] || ''}
                      onChange={(e) => onStageGoalChange(stage.id, e.target.value)}
                      placeholder={`أدخل أهداف ${stage.label} هنا، أو استخدم أزرار التوليد...`}
                      rows={8}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StageGoalsCard;