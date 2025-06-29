import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Download, Share2, Printer, Home, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ViewClassVisitPlanPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const loadPlanData = useCallback(async () => {
    if (!user || !planId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_visit_plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setPlanData(data);
      } else {
        toast({ title: "خطأ", description: "لم يتم العثور على الخطة المطلوبة.", variant: "destructive" });
        navigate('/class-visits/archive');
      }
    } catch (error) {
      console.error('Error loading plan:', error);
      toast({ title: "خطأ في التحميل", description: "حدث خطأ أثناء تحميل بيانات الخطة.", variant: "destructive" });
      navigate('/class-visits/archive');
    } finally {
      setLoading(false);
    }
  }, [user, planId, navigate, toast]);

  useEffect(() => {
    loadPlanData();
  }, [loadPlanData]);

  const handleDeletePlan = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('class_visit_plans')
        .delete()
        .eq('id', planId);
      if (error) throw error;
      toast({ title: "تم الحذف", description: "تم حذف الخطة بنجاح." });
      navigate('/class-visits/archive');
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({ title: "خطأ", description: "لم نتمكن من حذف الخطة.", variant: "destructive" });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <p className="ml-3 text-gray-700">جاري تحميل الخطة...</p>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 text-center">
        <Eye className="w-24 h-24 text-pink-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">لم يتم العثور على الخطة</h1>
        <p className="text-gray-500 mb-6">قد تكون الخطة قد حذفت أو أن الرابط غير صحيح.</p>
        <Button onClick={() => navigate('/class-visits/archive')} className="bg-pink-600 hover:bg-pink-700">
          <ArrowRight className="ml-2 h-4 w-4" /> العودة للأرشيف
        </Button>
      </div>
    );
  }
  
  const executionStatusOptions = ["في الموعد", "تعديل", "لم تتم", "مؤجلة", "منفذة جزئياً"];


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 sm:p-8 arabic-text"
    >
      <header className="mb-8 print:hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              عرض خطة الزيارات الصفية
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/class-visits/archive')} className="flex items-center gap-2">
              <ArrowRight className="ml-1 h-4 w-4" /> العودة للأرشيف
            </Button>
             <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <Home className="w-4 h-4" /> الرئيسية
            </Button>
          </div>
        </div>
      </header>

      <Card className="mb-6 shadow-lg bg-white/90 backdrop-blur-md print:shadow-none print:border-0">
        <CardHeader className="border-b print:border-b-2 print:border-black">
          <CardTitle className="text-xl sm:text-2xl text-pink-700">خطة الزيارات الصفية للعام الدراسي {planData.academic_year}</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600 print:text-xs">
            <p><strong>المدرسة:</strong> {planData.school_name || 'غير محدد'}</p>
            <p><strong>مدير المدرسة:</strong> {planData.principal_name || 'غير محدد'}</p>
            <p><strong>نموذج رقم:</strong> {planData.form_number}</p>
            <p><strong>اسم النموذج:</strong> {planData.form_name}</p>
            <p><strong>رمز النموذج:</strong> {planData.form_code}</p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 print:mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 print:text-base">ملاحظات هامة:</h3>
            <ul className="list-disc pr-5 space-y-1 text-sm text-gray-600 print:text-xs">
              {(planData.important_notes || []).map((note, index) => <li key={index}>{note}</li>)}
            </ul>
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-3 print:text-base">جدول خطة الزيارات:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-400 print:divide-black print:border-black">
              <thead className="bg-gray-100 print:bg-gray-200">
                <tr>
                  {["م", "اسم المعلم", "التخصص", "الزيارة الأولى", "الزيارة الثانية", "التنفيذ", "ملاحظات"].map(header => (
                    <th key={header} scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300 last:border-l-0 print:border-black print:text-xxs">
                      {header === "الزيارة الأولى" || header === "الزيارة الثانية" ? (
                        <div className="text-center">{header}
                          <div className="grid grid-cols-4 gap-px mt-1">
                            {["التاريخ", "الوحدة", "النشاط", "الفصل"].map(sub => <span key={sub} className="text-xxs border-t border-gray-300 pt-1 print:border-black">{sub}</span>)}
                          </div>
                        </div>
                      ) : header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300 print:divide-black">
                {(planData.visit_entries || []).map((entry, index) => (
                  <tr key={entry.id || index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border-l border-gray-300 print:border-black print:text-xs">{index + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border-l border-gray-300 print:border-black print:text-xs">{entry.teacher_name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border-l border-gray-300 print:border-black print:text-xs">{entry.specialization}</td>
                    <td className="px-1 py-2 whitespace-nowrap border-l border-gray-300 print:border-black print:text-xs">
                      <div className="grid grid-cols-4 gap-1 text-center">
                        <span>{entry.visit1_date || '-'}</span><span>{entry.visit1_unit || '-'}</span><span>{entry.visit1_activity || '-'}</span><span>{entry.visit1_class || '-'}</span>
                      </div>
                    </td>
                    <td className="px-1 py-2 whitespace-nowrap border-l border-gray-300 print:border-black print:text-xs">
                      <div className="grid grid-cols-4 gap-1 text-center">
                        <span>{entry.visit2_date || '-'}</span><span>{entry.visit2_unit || '-'}</span><span>{entry.visit2_activity || '-'}</span><span>{entry.visit2_class || '-'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border-l border-gray-300 print:border-black print:text-xs">{entry.execution_status}</td>
                    <td className="px-3 py-2 text-sm text-gray-700 border-l border-gray-300 print:border-black print:text-xs min-w-[150px]">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {planData.general_notes && (
            <div className="mt-6 print:mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 print:text-base">ملاحظات عامة على الخطة:</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap print:text-xs">{planData.general_notes}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t print:mt-6 print:pt-4 print:border-t-2 print:border-black">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 print:text-base">اعتمادات الخطة:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 print:text-xs">
              <p><strong>الوكيل المسند للمتابعة:</strong> {planData.assigned_deputy || 'غير محدد'}</p>
              <p><strong>مدير المدرسة:</strong> {planData.principal_name || 'غير محدد'}</p>
            </div>
             <p className="text-xs text-gray-500 mt-4 print:mt-2">تاريخ الإنشاء: {new Date(planData.created_at).toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' })}</p>
             <p className="text-xs text-gray-500 print:mt-1">آخر تحديث: {new Date(planData.updated_at).toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex flex-wrap gap-3 justify-end print:hidden">
        <Button onClick={() => navigate(`/class-visits/edit/${planId}`)} className="bg-green-600 hover:bg-green-700">
          <Edit className="ml-2 h-4 w-4" /> تعديل الخطة
        </Button>
        <Button onClick={handlePrint} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
          <Printer className="ml-2 h-4 w-4" /> طباعة / PDF
        </Button>
        <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
          <Share2 className="ml-2 h-4 w-4" /> مشاركة
        </Button>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="ml-2 h-4 w-4" /> حذف الخطة
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذه الخطة بشكل دائم؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 hover:bg-red-700">
                {loading ? 'جاري الحذف...' : 'نعم، قم بالحذف'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export default ViewClassVisitPlanPage;