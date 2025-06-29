import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Link2, QrCode, Eye, BarChart3 } from 'lucide-react';
import QRCode from 'qrcode.react';
import { targetGroupOptions } from '@/lib/surveyConstants';


const SurveyList = ({ surveys, onDelete, onShowCreateModal, loading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSurveyLink = (surveyId) => {
    return `${window.location.origin}/survey/${surveyId}`;
  };

  if (loading) {
     return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل الاستبيانات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {surveys.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <BarChart3 className="w-24 h-24 text-indigo-300 mx-auto mb-6"/>
          <p className="text-2xl text-gray-600 arabic-text mb-4">لا توجد استبيانات منشأة حالياً.</p>
          <p className="text-gray-500 arabic-text mb-6">ابدأ بإنشاء استبيانك الأول لجمع آراء المستفيدين.</p>
          <Button onClick={onShowCreateModal} className="gradient-bg-1 text-white flex items-center gap-2 mx-auto px-8 py-3 text-lg">
            <Plus className="w-5 h-5" /> إنشاء أول استبيان لك
          </Button>
        </motion.div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map(survey => (
          <motion.div key={survey.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="arabic-text text-lg leading-tight text-indigo-700">{survey.title}</CardTitle>
                <CardDescription className="arabic-text">
                  الفئات: {(survey.target_group || []).map(id => targetGroupOptions.find(opt => opt.id === id)?.label || id).join(', ')}
                </CardDescription>
                <CardDescription className="arabic-text">
                  الحالة: {new Date(survey.end_date) > new Date() && survey.is_active ? 
                    <span className="text-green-600 font-semibold">نشط</span> : 
                    <span className="text-red-600 font-semibold">مغلق</span>} 
                  | ينتهي في: {new Date(survey.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow pt-4">
                <p className="text-sm text-gray-600 arabic-text">عدد الأسئلة: {survey.questions.length}</p>
                <div className="p-3 bg-indigo-50 rounded-md border border-indigo-200">
                  <Label className="text-xs arabic-text text-indigo-800">رابط الاستبيان:</Label>
                  <div className="flex items-center gap-2 mt-1">
                     <Input type="text" readOnly value={getSurveyLink(survey.id)} className="text-xs flex-grow bg-white" />
                     <Button size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(getSurveyLink(survey.id)).then(() => toast({title: "تم نسخ الرابط!"}))} className="text-indigo-600 hover:text-indigo-800 h-8 w-8">
                       <Link2 className="w-4 h-4"/>
                     </Button>
                  </div>
                </div>
                <div className="text-center py-2">
                   <QRCode value={getSurveyLink(survey.id)} size={100} level="H" fgColor="#4338CA" bgColor="#F0F4FF" />
                </div>
              </CardContent>
              <CardContent className="border-t pt-4 flex flex-col sm:flex-row justify-between gap-2">
                 <Button variant="outline" size="sm" onClick={() => navigate(`/surveys/${survey.id}/results`)} className="w-full sm:w-auto flex items-center gap-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                  <Eye className="w-4 h-4" /> عرض النتائج
                </Button>
                 <Button variant="outline" size="sm" onClick={() => onDelete(survey.id)} className="w-full sm:w-auto flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> حذف
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SurveyList;