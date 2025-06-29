import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Lightbulb, Loader2, HelpCircle } from 'lucide-react';

const GeneralGoalsCard = ({
  generalGoalsText,
  onGeneralGoalsChange,
  onGeneratePredefined,
  onGenerateAI,
  isGeneratingAI,
  isApiReady,
  apiKeyError,
}) => {
  return (
    <Card className="border-gray-200 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="w-6 h-6" />
          الاهداف الاستراتيجية للتعليم (عامة)
        </CardTitle>
        <CardDescription className="text-sky-100">
          الأهداف العليا التي تسعى منظومة التعليم لتحقيقها على المستوى الوطني.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={onGeneratePredefined}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Lightbulb className="ml-2 h-5 w-5" />
            توليد الأهداف الاستراتيجية العامة (نموذجية)
          </Button>
          <Button
            onClick={onGenerateAI}
            disabled={isGeneratingAI || !isApiReady}
            variant="outline"
            className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            {isGeneratingAI ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Lightbulb className="ml-2 h-5 w-5" />}
            {isGeneratingAI ? 'جاري التوليد...' : 'اقتراح أهداف عامة (AI)'}
          </Button>
        </div>
        {!isApiReady && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {apiKeyError} لا يمكن استخدام ميزة الاقتراحات بالذكاء الاصطناعي حاليًا.
          </p>
        )}
        <Textarea
          value={generalGoalsText}
          onChange={(e) => onGeneralGoalsChange(e.target.value)}
          placeholder="أدخل الأهداف الاستراتيجية العامة هنا، أو استخدم أزرار التوليد..."
          rows={10}
          className="border-gray-300 focus:border-sky-500 focus:ring-sky-500 text-base leading-relaxed p-4 rounded-md shadow-sm"
        />
        <p className="mt-4 text-sm text-gray-500 text-center">
          <HelpCircle className="inline w-4 h-4 mr-1" />
          هذه الأهداف تمثل التوجهات الكبرى للتعليم.
        </p>
      </CardContent>
    </Card>
  );
};

export default GeneralGoalsCard;