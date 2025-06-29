import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Eye, PlusCircle, Archive, Settings, Home, LogOut, List, CheckCircle, Edit, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CLASS_VISIT_PLAN_OBJECTIVES = [
  "التحقق من تطبيق المناهج الدراسية والوقوف على مدى ملاءمتها لقدرات الطلاب.",
  "تقويم أساليب التعليم والوسائل التعليمية والأنشطة التربوية بصورة طبيعية.",
  "ملاحظة أثر المعلم في طلابه والوقوف على مدى تقدمهم التعليمي.",
  "الوقوف على حاجات الطلاب والمعلمين الفعلية والتخطيط لتلبيتها.",
  "معرفة مدى استجابة المعلمين ومدى ترجمتهم للأفكار المطروحة في الزيارات السابقة.",
  "زيادة رصيد المشرف التربوي من المعرفة وإغناء خبراته بما يطلع عليه من أساليب جديدة وتجارب مبتكرة ونشاطات فاعلة."
];

const ClassVisitsDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schoolInfo, setSchoolInfo] = useState({ name: 'مدرسة الفهد الثانوية', principalName: 'رستم نفاع البلادي', academicYear: '١٤٤٦هـ' });
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSchoolInfo();
    fetchRecentPlans();
  }, [user, navigate]);

  const fetchSchoolInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('name, user_id') 
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSchoolInfo(prev => ({
          ...prev,
          name: data.name || prev.name,
          principalName: user.user_metadata?.full_name || user.user_metadata?.name || prev.principalName,
        }));
      }
    } catch (error) {
      console.error('Error fetching school info:', error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل معلومات المدرسة.", variant: "destructive" });
    }
  };

  const fetchRecentPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_visit_plans')
        .select('id, academic_year, created_at, status, visit_entries')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentPlans(data || []);
    } catch (error) {
      console.error('Error fetching recent plans:', error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل أحدث الخطط.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusArabic = (status) => {
    const statuses = { draft: "مسودة", submitted: "مقدمة", archived: "مؤرشفة" };
    return statuses[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-6 arabic-text">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Eye className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">خطة الزيارات الصفية</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <Home className="w-4 h-4" /> <span>الرئيسية</span>
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> <span>تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">{schoolInfo.name}</CardTitle>
            <CardDescription>مدير المدرسة: {schoolInfo.principalName} | العام الدراسي: {schoolInfo.academicYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">أهداف خطة الزيارات الصفية:</h3>
            <ul className="list-disc pr-5 space-y-1 text-gray-600">
              {CLASS_VISIT_PLAN_OBJECTIVES.map((objective, index) => (
                <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  {objective}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Button size="lg" onClick={() => navigate('/class-visits/new')} className="w-full h-24 text-lg bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 shadow-md flex items-center gap-3">
              <PlusCircle className="w-7 h-7" /> إنشاء خطة زيارة جديدة
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Button size="lg" onClick={() => navigate('/class-visits/archive')} className="w-full h-24 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 shadow-md flex items-center gap-3">
              <Archive className="w-7 h-7" /> عرض الخطط المحفوظة / الأرشيف
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Button size="lg" variant="outline" className="w-full h-24 text-lg border-gray-400 text-gray-700 hover:bg-gray-100 shadow-sm flex items-center gap-3">
              <Settings className="w-7 h-7" /> إعدادات الخطة
            </Button>
          </motion.div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">أحدث الخطط</CardTitle>
            <CardDescription>نظرة سريعة على آخر خطط الزيارات التي تم العمل عليها.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div><p className="ml-3">جاري التحميل...</p></div>
            ) : recentPlans.length > 0 ? (
              <div className="space-y-4">
                {recentPlans.map(plan => (
                  <motion.div key={plan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-pink-700">خطة العام الدراسي: {plan.academic_year}</h4>
                          <p className="text-sm text-gray-500">
                            تاريخ الإنشاء: {new Date(plan.created_at).toLocaleDateString('ar-SA')} | 
                            الحالة: <span className={`font-medium ${plan.status === 'draft' ? 'text-yellow-600' : 'text-green-600'}`}>{getStatusArabic(plan.status)}</span> |
                            عدد المعلمين: {(plan.visit_entries || []).length}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/class-visits/view/${plan.id}`)} className="text-blue-600 border-blue-400 hover:bg-blue-50">
                            <FileText className="w-4 h-4 ml-1" /> عرض
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/class-visits/edit/${plan.id}`)} className="text-green-600 border-green-400 hover:bg-green-50">
                            <Edit className="w-4 h-4 ml-1" /> تعديل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <List className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">لا توجد خطط حديثة. ابدأ بإنشاء خطة جديدة!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClassVisitsDashboardPage;