import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Archive, Search, Filter, Edit, Trash2, FileText, Home, LogOut, Eye, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ArchivedClassVisitPlansPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ academic_year: 'all', specialization: 'all', teacher_name: '', execution_status: 'all' });
  const [academicYears, setAcademicYears] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [planToDelete, setPlanToDelete] = useState(null);


  const fetchPlans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_visit_plans')
        .select('id, academic_year, created_at, status, visit_entries, school_name, principal_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
      setFilteredPlans(data || []);
      
      const years = [...new Set(data.map(p => p.academic_year))].filter(Boolean);
      setAcademicYears(years);

      const specs = [...new Set(data.flatMap(p => (p.visit_entries || []).map(e => e.specialization)))].filter(Boolean);
      setSpecializations(specs);

    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل الخطط المؤرشفة.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchPlans();
  }, [user, navigate, fetchPlans]);

  useEffect(() => {
    let currentPlans = [...plans];
    if (searchTerm) {
      currentPlans = currentPlans.filter(plan =>
        (plan.school_name && plan.school_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.principal_name && plan.principal_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.academic_year && plan.academic_year.includes(searchTerm)) ||
        (plan.visit_entries || []).some(entry => 
          (entry.teacher_name && entry.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry.specialization && entry.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }

    if (filters.academic_year && filters.academic_year !== 'all') {
      currentPlans = currentPlans.filter(plan => plan.academic_year === filters.academic_year);
    }
    if (filters.specialization && filters.specialization !== 'all') {
      currentPlans = currentPlans.filter(plan => (plan.visit_entries || []).some(e => e.specialization === filters.specialization));
    }
    if (filters.teacher_name) {
      currentPlans = currentPlans.filter(plan => (plan.visit_entries || []).some(e => e.teacher_name && e.teacher_name.toLowerCase().includes(filters.teacher_name.toLowerCase())));
    }
    if (filters.execution_status && filters.execution_status !== 'all') {
      currentPlans = currentPlans.filter(plan => (plan.visit_entries || []).some(e => e.execution_status === filters.execution_status));
    }
    setFilteredPlans(currentPlans);
  }, [searchTerm, filters, plans]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value === 'all' ? '' : value }));
  };
  
  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('class_visit_plans')
        .delete()
        .eq('id', planToDelete);
      if (error) throw error;
      toast({ title: "تم الحذف", description: "تم حذف الخطة بنجاح." });
      fetchPlans(); 
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({ title: "خطأ", description: "لم نتمكن من حذف الخطة.", variant: "destructive" });
    } finally {
      setLoading(false);
      setPlanToDelete(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const executionStatusOptions = ["في الموعد", "تعديل", "لم تتم", "مؤجلة", "منفذة جزئياً"];


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-stone-100 p-6 arabic-text"
    >
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Archive className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">أرشيف خطط الزيارات الصفية</h1>
        </div>
         <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/class-visits')} className="flex items-center gap-2">
             لوحة التحكم 
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <Home className="w-4 h-4" /> الرئيسية
          </Button>
        </div>
      </header>

      <Card className="mb-8 shadow-lg bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="بحث عام..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Select value={filters.academic_year || 'all'} onValueChange={(value) => handleFilterChange('academic_year', value)}>
            <SelectTrigger><SelectValue placeholder="العام الدراسي" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {academicYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.specialization || 'all'} onValueChange={(value) => handleFilterChange('specialization', value)}>
            <SelectTrigger><SelectValue placeholder="التخصص" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {specializations.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.execution_status || 'all'} onValueChange={(value) => handleFilterChange('execution_status', value)}>
            <SelectTrigger><SelectValue placeholder="حالة التنفيذ" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {executionStatusOptions.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p className="ml-3">جاري تحميل الخطط...</p></div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -5 }}>
              <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">خطة العام: {plan.academic_year}</CardTitle>
                  <CardDescription>
                    المدرسة: {plan.school_name || 'غير محدد'} <br/>
                    المدير: {plan.principal_name || 'غير محدد'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">
                    تاريخ الإنشاء: {new Date(plan.created_at).toLocaleDateString('ar-SA')}
                  </p>
                  <p className="text-sm text-gray-600">
                    عدد المعلمين المزارين: {(plan.visit_entries || []).length}
                  </p>
                  <p className={`text-sm font-semibold ${plan.status === 'archived' ? 'text-gray-500' : plan.status === 'submitted' ? 'text-green-600' : 'text-yellow-600'}`}>
                    الحالة: {plan.status === 'archived' ? 'مؤرشفة' : plan.status === 'submitted' ? 'مقدمة' : 'مسودة'}
                  </p>
                </CardContent>
                <CardContent className="border-t pt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/class-visits/view/${plan.id}`)} className="text-sky-600 border-sky-400 hover:bg-sky-50 flex-1 min-w-[80px]">
                    <Eye className="w-4 h-4 ml-1" /> عرض
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/class-visits/edit/${plan.id}`)} className="text-green-600 border-green-400 hover:bg-green-50 flex-1 min-w-[80px]">
                    <Edit className="w-4 h-4 ml-1" /> تعديل
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="text-white bg-red-500 hover:bg-red-600 flex-1 min-w-[80px]" onClick={() => setPlanToDelete(plan.id)}>
                        <Trash2 className="w-4 h-4 ml-1" /> حذف
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد أنك تريد حذف هذه الخطة؟ لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 hover:bg-red-700">حذف</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button size="sm" variant="outline" className="text-purple-600 border-purple-400 hover:bg-purple-50 flex-1 min-w-[80px]">
                    <Download className="w-4 h-4 ml-1" /> تصدير
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-xl">
            {plans.length === 0 ? "لا توجد خطط زيارات مؤرشفة حتى الآن." : "لم يتم العثور على خطط تطابق معايير البحث."}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ArchivedClassVisitPlansPage;