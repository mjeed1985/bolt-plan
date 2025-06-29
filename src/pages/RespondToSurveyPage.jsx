import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Import supabase client

const RespondToSurveyPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .select('*')
          .eq('id', surveyId)
          .single();

        if (surveyError || !surveyData) {
          throw new Error(surveyError?.message || "لم يتم العثور على الاستبيان أو أنه غير صالح.");
        }

        if (!surveyData.is_active || new Date(surveyData.end_date) < new Date()) {
          setError("هذا الاستبيان مغلق أو انتهت صلاحيته.");
          setSurvey(null);
        } else {
          setSurvey(surveyData);
          const initialAnswers = {};
          surveyData.questions.forEach(q => {
            initialAnswers[q.text] = q.type === 'rating' ? 3 : ''; // Default rating to 3
          });
          setAnswers(initialAnswers);
        }
      } catch (e) {
        setError(e.message);
        console.error("Error fetching survey:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (surveyId) {
      fetchSurvey();
    } else {
      setError("معرّف الاستبيان غير صالح.");
      setIsLoading(false);
    }
  }, [surveyId]);

  const handleAnswerChange = (questionText, value) => {
    setAnswers(prev => ({ ...prev, [questionText]: value }));
  };

  const handleSubmitSurvey = async () => {
    if (!survey) return;

    for (const question of survey.questions) {
      const answerValue = answers[question.text];
      if (question.type === 'rating') {
        if (answerValue === '' || answerValue === null || answerValue < 1 || answerValue > 5) {
          toast({ title: "خطأ", description: `يرجى تقديم تقييم صحيح (1-5) لسؤال: "${question.text}"`, variant: "destructive" });
          return;
        }
      } else if (question.type === 'choice') {
        if (!answerValue) {
          toast({ title: "خطأ", description: `يرجى اختيار إجابة لسؤال: "${question.text}"`, variant: "destructive" });
          return;
        }
      }
      // Text questions can be empty, no specific validation here
    }

    try {
      const { error: responseError } = await supabase
        .from('survey_responses')
        .insert([{
          survey_id: survey.id,
          answers: Object.entries(answers).map(([questionText, answer]) => ({ questionText, answer })),
          respondent_identifier: `anon_${Date.now()}` // Simple anonymous identifier
        }]);

      if (responseError) throw responseError;
      
      setIsSubmitted(true);
      toast({ title: "شكراً لك!", description: "تم إرسال ردك بنجاح." });

    } catch (e) {
      console.error("Error submitting survey response:", e);
      toast({ title: "خطأ في الإرسال", description: e.message || "لم نتمكن من إرسال ردك.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div><p className="ml-4 text-xl arabic-text">جاري التحميل...</p></div>;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-700 arabic-text mb-2">خطأ في الاستبيان</h1>
        <p className="text-lg text-red-600 arabic-text">{error}</p>
        <Button onClick={() => navigate('/')} className="mt-6 gradient-bg-1 text-white">العودة للرئيسية</Button>
      </div>
    );
  }
  if (!survey) { // Should be covered by error state, but as a fallback
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-yellow-700 arabic-text mb-2">الاستبيان غير متوفر</h1>
        <p className="text-lg text-yellow-600 arabic-text">قد يكون الرابط غير صحيح أو تم حذف الاستبيان.</p>
         <Button onClick={() => navigate('/')} className="mt-6 gradient-bg-1 text-white">العودة للرئيسية</Button>
      </div>
    );
  }


  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-green-700 arabic-text mb-3">شكراً لمشاركتك!</h1>
        <p className="text-xl text-green-600 arabic-text mb-8">تم استلام ردودك بنجاح.</p>
        <Button onClick={() => window.location.hostname.includes("localhost") ? navigate('/') : window.close()} className="gradient-bg-2 text-white">
          {window.location.hostname.includes("localhost") ? "العودة للرئيسية" : "إغلاق الصفحة"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <Card className="max-w-2xl mx-auto bg-white shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold text-center arabic-text text-gray-800">{survey.title}</CardTitle>
            <CardDescription className="text-center arabic-text text-gray-600">
             {/* No target group display for anonymous survey */}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {survey.questions.map((question, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b pb-6 last:border-b-0 last:pb-0"
              >
                <Label className="text-lg font-semibold arabic-text text-gray-700 block mb-3">{index + 1}. {question.text}</Label>
                {question.type === 'text' && (
                  <Textarea
                    value={answers[question.text] || ''}
                    onChange={(e) => handleAnswerChange(question.text, e.target.value)}
                    placeholder="اكتب إجابتك هنا..."
                    className="text-right arabic-text"
                    rows={3}
                  />
                )}
                {question.type === 'rating' && (
                  <div className="flex flex-col items-center space-y-2">
                     <Slider
                        defaultValue={[3]}
                        min={1} max={5} step={1}
                        value={[answers[question.text]]} // Ensure value is an array
                        onValueChange={(value) => handleAnswerChange(question.text, value[0])}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600 arabic-text">التقييم: {answers[question.text] || 3} من 5</span>
                  </div>
                )}
                {question.type === 'choice' && (
                  <RadioGroup
                    value={answers[question.text] || ''}
                    onValueChange={(value) => handleAnswerChange(question.text, value)}
                    className="space-y-2"
                  >
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value={option} id={`${index}-${optIndex}`} />
                        <Label htmlFor={`${index}-${optIndex}`} className="arabic-text text-gray-700">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </motion.div>
            ))}
            <div className="flex justify-center pt-6">
              <Button onClick={handleSubmitSurvey} size="lg" className="gradient-bg-1 text-white px-10 py-3 text-lg flex items-center gap-2">
                <Send className="w-5 h-5"/> إرسال الردود
              </Button>
            </div>
          </CardContent>
        </Card>
         <p className="text-center text-xs text-gray-500 mt-6 arabic-text">
            يتم جمع الردود بسرية تامة. نشكر لك وقتك ومساهمتك.
        </p>
      </motion.div>
    </div>
  );
};

export default RespondToSurveyPage;