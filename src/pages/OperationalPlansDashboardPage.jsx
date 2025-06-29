import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Edit, FileText, HelpCircle, LogOut, Home, Search, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OperationalPlansDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isHelpAlertOpen, setIsHelpAlertOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPlans();
  }, [user, navigate]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operational_plans')
        .select('id, plan_name, school_stage, created_at, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من تحميل الخطط التشغيلية.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const getStageArabic = (stage) => {
    const stages = {
      kindergarten: "رياض الأطفال",
      primary: "ابتدائي",
      intermediate: "متوسط",
      secondary: "ثانوي"
    };
    return stages[stage] || stage;
  };

  const getStatusArabic = (status) => {
    const statuses = {
      draft: "مسودة",
      completed: "مكتملة",
      in_progress: "قيد التنفيذ"
    };
    return statuses[status] || status;
  };

  const openDeleteConfirmDialog = (planId) => {
    setPlanToDelete(planId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    setIsDeleteAlertOpen(false);
    setLoading(true);
    try {
      const { error } = await supabase
        .from('operational_plans')
        .delete()
        .eq('id', planToDelete);

      if (error) throw error;

      toast({
        title: "نجاح",
        description: `تم حذف الخطة بنجاح.`,
        variant: "default",
      });
      setPlanToDelete(null);
      fetchPlans(); 
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "خطأ",
        description: "لم نتمكن من حذف الخطة.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const filteredPlans = plans.filter(plan => 
    plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getStageArabic(plan.school_stage).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 p-6 arabic-text">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ rotate: 360, scale: 1 }}
             transition={{
               type: "spring",
               stiffness: 260,
               damping: 20
             }}
             className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
           >
            <FileText className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الخطط التشغيلية</h1>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">مرحباً بك، {user?.user_metadata?.name || 'المستخدم'}</CardTitle>
            <CardDescription>
              هنا يمكنك إدارة خططك التشغيلية، إنشاء خطط جديدة، ومتابعة الخطط القائمة.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/operational-plans/new')} 
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 transition-opacity shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              بدء خطة تشغيلية جديدة
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsHelpAlertOpen(true)}
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 shadow-sm"
            >
              <HelpCircle className="w-5 h-5" />
              معلومات عن التطبيق/مساعدة
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <CardTitle className="text-2xl">خططي التشغيلية</CardTitle>
              <div className="relative w-full sm:w-72">
                <Input 
                  type="text"
                  placeholder="ابحث عن خطة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && plans.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-gray-600">جاري تحميل الخطط...</p>
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300 border-gray-200">
                      <CardHeader>
                        <div>
                          <CardTitle className="text-xl">{plan.plan_name || "خطة بدون اسم"}</CardTitle>
                          <CardDescription>
                            المرحلة: {getStageArabic(plan.school_stage)}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-500">
                          تاريخ الإنشاء: {new Date(plan.created_at).toLocaleDateString('ar-SA')}
                        </p>
                        <p className={`text-sm font-semibold ${plan.status === 'completed' ? 'text-green-600' : plan.status === 'in_progress' ? 'text-blue-600' : 'text-yellow-600'}`}>
                          الحالة: {getStatusArabic(plan.status)}
                        </p>
                      </CardContent>
                      <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={() => navigate(`/operational-plans/edit/${plan.id}`)}
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          تعديل الخطة
                        </Button>
                        <Button 
                          onClick={() => navigate(`/operational-plans/summary/${plan.id}`)}
                          variant="outline"
                          className="flex-1 border-teal-500 text-teal-600 hover:bg-teal-50 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          عرض الخطة
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => openDeleteConfirmDialog(plan.id)}
                          className="flex-1 flex items-center justify-center gap-2"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "لم يتم العثور على خطط تطابق بحثك." : "لا توجد خطط تشغيلية حتى الآن. ابدأ بإنشاء خطة جديدة!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذه الخطة بشكل دائم. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlanToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 hover:bg-red-700">
              نعم، قم بالحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isHelpAlertOpen} onOpenChange={setIsHelpAlertOpen}>
        <AlertDialogContent dir="rtl" className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-indigo-700 flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-indigo-600" />
              مساعدة ومعلومات عن التطبيق
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-gray-600 leading-relaxed pt-2">
              <strong className="text-indigo-600 block mb-2">مرحباً بك في الجناح الذكي للمدرسة!</strong>
              يهدف هذا التطبيق إلى تمكين قادة المدارس من بناء وإدارة الخطط التشغيلية بكفاءة وفعالية، مستفيدين من أحدث التقنيات والذكاء الاصطناعي.
              <br /><br />
              <strong className="text-indigo-600">الخطط التشغيلية:</strong>
              <ul className="list-disc list-inside my-2 space-y-1 text-gray-700">
                <li>أنشئ خططًا تشغيلية شاملة تغطي جميع جوانب العمل المدرسي.</li>
                <li>استخدم أدوات التحليل الذكية مثل SWOT لبناء خطط مدروسة.</li>
                <li>حدد الأهداف الاستراتيجية، البرامج، والمبادرات بوضوح.</li>
                <li>استفد من ميزة التوليد التلقائي المقترح بالذكاء الاصطناعي للمساعدة في صياغة بعض أجزاء الخطة.</li>
                <li>تابع تقدم خططك وقم بتعديلها بسهولة.</li>
                <li>صدّر ملخصات الخطط كملفات PowerPoint لمشاركتها مع فريقك.</li>
              </ul>
              <strong className="text-indigo-600">نصائح للاستخدام الأمثل:</strong>
              <ul className="list-disc list-inside my-2 space-y-1 text-gray-700">
                <li>ابدأ بإدخال المعلومات الأساسية لمدرستك بدقة.</li>
                <li>استثمر وقتًا في تحليل SWOT لتحديد نقاط القوة والضعف والفرص والتحديات.</li>
                <li>اجعل أهدافك ذكية (محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، ومحددة زمنيًا).</li>
                <li>استشر فريق عملك عند بناء الخطة لضمان المشاركة والالتزام.</li>
              </ul>
              نأمل أن يساهم "الجناح الذكي للمدرسة" في تطوير العمل المدرسي وتحقيق التميز.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsHelpAlertOpen(false)} className="bg-indigo-600 hover:bg-indigo-700">
              فهمت
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OperationalPlansDashboardPage;