import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Route, Lightbulb, Loader2, HelpCircle } from 'lucide-react';

const ImplementationStrategiesCard = ({
  strategiesText,
  onStrategiesChange,
  onGeneratePredefined,
  onGenerateAI,
  isGeneratingAI,
  isApiReady,
  apiKeyError,
}) => {
  return (
    <Card className="border-gray-200 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Route className="w-6 h-6" />
          استراتيجيات التنفيذ
        </CardTitle>
        <CardDescription className="text-indigo-100">
          الاستراتيجيات العامة التي سيتم اتباعها لتنفيذ الأهداف التعليمية.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={onGeneratePredefined}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            <Lightbulb className="ml-2 h-5 w-5" />
            توليد استراتيجيات التنفيذ (نموذجية)
          </Button>
          <Button
            onClick={onGenerateAI}
            disabled={isGeneratingAI || !isApiReady}
            variant="outline"
            className="flex-1 border-pink-500 text-pink-600 hover:bg-pink-50"
          >
            {isGeneratingAI ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Lightbulb className="ml-2 h-5 w-5" />}
            {isGeneratingAI ? 'جاري التوليد...' : 'اقتراح استراتيجيات تنفيذ (AI)'}
          </Button>
        </div>
        {!isApiReady && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {apiKeyError} لا يمكن استخدام ميزة الاقتراحات بالذكاء الاصطناعي حاليًا.
          </p>
        )}
        <Textarea
          value={strategiesText}
          onChange={(e) => onStrategiesChange(e.target.value)}
          placeholder="أدخل استراتيجيات التنفيذ هنا، أو استخدم أزرار التوليد..."
          rows={10}
          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-base leading-relaxed p-4 rounded-md shadow-sm"
        />
        <p className="mt-4 text-sm text-gray-500 text-center">
          <HelpCircle className="inline w-4 h-4 mr-1" />
          هذه الاستراتيجيات توضح كيفية تحقيق الأهداف المحددة.
        </p>
      </CardContent>
    </Card>
  );
};

export default ImplementationStrategiesCard;