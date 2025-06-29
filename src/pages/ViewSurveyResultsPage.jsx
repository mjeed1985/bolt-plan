import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Download, BarChart2, FileText, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { targetGroupOptions } from '@/lib/surveyConstants'; // Added targetGroupOptions

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ViewSurveyResultsPage = () => {
  const { surveyId } = useParams();
  const { user, schoolId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [processedResults, setProcessedResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  const fetchSurveyAndResponses = useCallback(async () => {
    if (!user || !schoolId) return;
    setLoading(true);
    try {
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .eq('school_id', schoolId)
        .single();

      if (surveyError || !surveyData) throw surveyError || new Error("Survey not found or access denied.");
      setSurvey(surveyData);

      const { data: responsesData, error: responsesError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('survey_id', surveyId);
      
      if (responsesError) throw responsesError;
      setResponses(responsesData || []);
      processResults(surveyData, responsesData || []);

    } catch (error) {
      console.error("Error fetching survey data:", error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل بيانات الاستبيان.", variant: "destructive" });
      navigate('/surveys');
    } finally {
      setLoading(false);
    }
  }, [user, schoolId, surveyId, navigate, toast]);


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (!schoolId) {
        toast({ title: "بيانات المدرسة ناقصة", description: "يرجى إكمال بيانات المدرسة أولاً.", variant: "destructive" });
        navigate('/settings');
        return;
    }
    fetchSurveyAndResponses();
  }, [user, schoolId, authLoading, navigate, fetchSurveyAndResponses, toast]);


  const processResults = (currentSurvey, surveyResponses) => {
    if (!currentSurvey || surveyResponses.length === 0) {
      setProcessedResults({ totalResponses: 0, questionResults: [] });
      return;
    }

    const questionResults = currentSurvey.questions.map(question => {
      const questionStat = {
        id: question.text, 
        text: question.text,
        type: question.type,
        answers: [],
        counts: {},
        averageRating: 0,
      };

      surveyResponses.forEach(response => {
        const answerObj = response.answers.find(ans => ans.questionText === question.text);
        if (answerObj && answerObj.answer !== undefined && answerObj.answer !== null) {
          questionStat.answers.push(answerObj.answer);
        }
      });
      
      if (question.type === 'rating') {
        const numericAnswers = questionStat.answers.map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 5);
        questionStat.averageRating = numericAnswers.length > 0 ? (numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length).toFixed(1) : 'N/A';
        for (let i = 1; i <= 5; i++) questionStat.counts[i.toString()] = 0;
        numericAnswers.forEach(ans => {
          questionStat.counts[ans.toString()]++;
        });
      } else if (question.type === 'choice') {
        (question.options || []).forEach(opt => questionStat.counts[opt] = 0);
        questionStat.answers.forEach(ans => {
          if (questionStat.counts.hasOwnProperty(ans)) {
            questionStat.counts[ans]++;
          }
        });
      }
      return questionStat;
    });
    setProcessedResults({ totalResponses: surveyResponses.length, questionResults });
  };

  const generateChartData = (questionResult) => {
    const labels = Object.keys(questionResult.counts);
    const data = Object.values(questionResult.counts);
    const backgroundColor = labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 70%, 60%)`);
    return {
      labels,
      datasets: [{
        label: `إجابات سؤال: ${questionResult.text.substring(0,20)}...`,
        data,
        backgroundColor,
        borderColor: labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 70%, 50%)`),
        borderWidth: 1
      }]
    };
  };

  const handleGeneratePdf = () => {
    const element = reportRef.current;
    if (!element) {
        toast({title: "خطأ", description: "لا يمكن إنشاء التقرير حاليًا.", variant: "destructive"});
        return;
    }
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `survey_results_${survey?.title.replace(/\s+/g, '_') || surveyId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, dpi: 192, letterRendering: true, scrollX: 0, scrollY: -window.scrollY },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const printContainer = element.cloneNode(true); 
    
    Array.from(printContainer.querySelectorAll('.no-pdf-print')).forEach(el => el.remove());

    const canvases = element.querySelectorAll('canvas'); 
    const clonedCanvases = printContainer.querySelectorAll('canvas');
    
    canvases.forEach((canvas, index) => {
        if (clonedCanvases[index]) {
            const image = canvas.toDataURL('image/png');
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.display = 'block';
            clonedCanvases[index].parentNode.replaceChild(imgElement, clonedCanvases[index]);
        }
    });
    
    printContainer.style.fontFamily = "'Cairo', 'Amiri', sans-serif";
    Array.from(printContainer.querySelectorAll('*')).forEach(el => {
        el.style.fontFamily = "'Cairo', 'Amiri', sans-serif";
    });


    html2pdf().from(printContainer).set(opt).save().then(() => {
        toast({title: "تم إنشاء التقرير بنجاح!"});
    }).catch(err => {
        toast({title: "خطأ", description: "فشل إنشاء التقرير.", variant: "destructive"});
        console.error("PDF generation error:", err);
    });
  };


  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl arabic-text">جاري تحميل نتائج الاستبيان...</p>
      </div>
    );
  }

  if (!survey || !processedResults) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl arabic-text text-red-700 font-semibold">تعذر تحميل بيانات الاستبيان.</p>
            <p className="text-md arabic-text text-red-600">قد يكون الاستبيان غير موجود أو ليس لديك صلاحية الوصول إليه.</p>
            <Button onClick={() => navigate('/surveys')} className="mt-6 gradient-bg-1 text-white">
                العودة لقائمة الاستبيانات
            </Button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print no-pdf-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/surveys')} className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> العودة للاستبيانات
          </Button>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 arabic-text text-center truncate max-w-xs md:max-w-md lg:max-w-lg">نتائج: {survey.title}</h1>
          <Button onClick={handleGeneratePdf} className="gradient-bg-2 text-white flex items-center gap-2">
            <Download className="w-4 h-4" /> تحميل PDF
          </Button>
        </div>
      </motion.header>

      <div ref={reportRef} className="container mx-auto px-4 py-8">
        <Card className="mb-6 bg-white/90 print-section">
          <CardHeader className="border-b">
            <CardTitle className="arabic-text text-center text-xl md:text-2xl">{survey.title}</CardTitle>
            <CardDescription className="arabic-text text-center text-sm md:text-base">
              إجمالي الردود: {processedResults.totalResponses} | 
              الفئات المستهدفة: {(survey.target_group || []).map(id => targetGroupOptions.find(opt => opt.id === id)?.label || id).join(', ')} |
              تاريخ الإنشاء: {new Date(survey.created_at).toLocaleDateString('ar-SA')}
            </CardDescription>
          </CardHeader>
        </Card>

        {processedResults.questionResults.map((qResult, index) => (
          <motion.div key={index} initial={{ opacity: 0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: index * 0.1 }} className="print-section">
            <Card className="mb-6 bg-white/90">
              <CardHeader className="border-b">
                <CardTitle className="arabic-text text-md md:text-lg">سؤال {index + 1}: {qResult.text}</CardTitle>
                <CardDescription className="arabic-text text-sm md:text-base">نوع السؤال: {qResult.type === 'text' ? 'نصي' : qResult.type === 'rating' ? 'تقييم رقمي' : 'اختيار من متعدد'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {qResult.type === 'text' && (
                  <ul className="list-disc pr-5 space-y-1 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-md border">
                    {qResult.answers.length > 0 ? qResult.answers.slice(0, 20).map((ans, i) => (
                        <li key={i} className="text-sm arabic-text border-b last:border-b-0 py-1">{ans}</li>
                    )) : <p className="text-sm arabic-text text-gray-500">لا توجد ردود نصية لهذا السؤال.</p>}
                    {qResult.answers.length > 20 && <li className="text-xs arabic-text text-gray-500 pt-2">... والمزيد من الردود (يتم عرض أول 20 رد)</li>}
                  </ul>
                )}
                {qResult.type === 'rating' && (
                  <div className="space-y-3">
                    <p className="arabic-text font-semibold text-md">متوسط التقييم: <span className="text-indigo-600">{qResult.averageRating} / 5</span></p>
                    <div className="relative h-[250px] md:h-[300px] w-full">
                      <Bar options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} data={generateChartData(qResult)} />
                    </div>
                  </div>
                )}
                {qResult.type === 'choice' && (
                  <div className="grid md:grid-cols-2 gap-4 items-center">
                     <div className="relative h-[250px] md:h-[300px] w-full">
                        <Pie options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: {font: { family: 'Cairo' }} } } }} data={generateChartData(qResult)} />
                    </div>
                    <ul className="space-y-1 bg-gray-50 p-3 rounded-md border">
                        {Object.entries(qResult.counts).map(([option, count]) => (
                            <li key={option} className="text-sm arabic-text flex justify-between border-b last:border-b-0 py-1">
                                <span>{option}:</span>
                                <span className="font-semibold">{count} ({((count / (processedResults.totalResponses || 1)) * 100 || 0).toFixed(1)}%)</span>
                            </li>
                        ))}
                         {Object.keys(qResult.counts).length === 0 && <p className="text-sm arabic-text text-gray-500">لا توجد بيانات لعرضها.</p>}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {processedResults.totalResponses === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="print-section">
                <Card className="bg-white/90">
                    <CardContent className="p-8 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl arabic-text text-gray-600">لم يتم استلام أي ردود لهذا الاستبيان حتى الآن.</p>
                        <p className="text-sm arabic-text text-gray-500">سيتم عرض النتائج هنا بمجرد بدء المشاركة في الاستبيان.</p>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewSurveyResultsPage;