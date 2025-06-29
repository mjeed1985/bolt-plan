import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Eye, Save, X, Plus, Trash2, CalendarDays, BookOpen, Users, UserCheck, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ACADEMIC_YEAR_OPTIONS } from '@/lib/operationalPlanConstants'; 

const CreateClassVisitPlanPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isPlanLoaded, setIsPlanLoaded] = useState(false);

  const initialVisitEntry = {
    teacher_name: '',
    specialization: '',
    visit1_date: '',
    visit1_unit: '',
    visit1_activity: '',
    visit1_class: '',
    visit2_date: '',
    visit2_unit: '',
    visit2_activity: '',
    visit2_class: '',
    execution_status: 'placeholder',
    notes: ''
  };

  const defaultAcademicYear = ACADEMIC_YEAR_OPTIONS && ACADEMIC_YEAR_OPTIONS.length > 0 ? ACADEMIC_YEAR_OPTIONS[0].value : 'default_year_value';

  const initialPlanData = {
    academic_year: defaultAcademicYear,
    form_number: 'نموذج رقم (٤٩)',
    form_name: 'خطة الزيارات الصفية لمدير المدرسة',
    form_code: 'م.م.ع.ن - ٠٣ - ٠١',
    important_notes: [
      "يعبأ هذا الجدول بداية كل فصل دراسي.",
      "يفضل أن تكون الزيارة الأولى في الأسبوعين الثالث والرابع، والزيارة الثانية بعد شهر من انتهاء الزيارة الأولى."
    ],
    visit_entries: Array(5).fill(null).map(() => ({ ...initialVisitEntry, id: crypto.randomUUID() })),
    general_notes: '',
    assigned_deputy: '',
    principal_name: '', 
    status: 'draft'
  };

  const [planData, setPlanData] = useState(initialPlanData);

  const fetchSchoolAndPrincipalInfo = useCallback(async () => {
    if (!user) return;
    try {
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (schoolError && schoolError.code !== 'PGRST116') throw schoolError;
      
      setPlanData(prev => ({
        ...prev,
        school_name: schoolData?.name || 'اسم المدرسة (يتم جلبه تلقائياً)',
        principal_name: user.user_metadata?.full_name || user.user_metadata?.name || 'اسم المدير (يتم جلبه تلقائياً)'
      }));
    } catch (error) {
      console.error('Error fetching school/principal info:', error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل معلومات المدرسة/المدير.", variant: "destructive" });
    }
  }, [user, toast]);


  const loadPlanData = useCallback(async (id) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_visit_plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setPlanData({
          ...initialPlanData,
          ...data,
          academic_year: data.academic_year || defaultAcademicYear,
          visit_entries: (data.visit_entries || initialPlanData.visit_entries).map(entry => ({...entry, id: entry.id || crypto.randomUUID(), execution_status: entry.execution_status || 'placeholder'})),
          important_notes: data.important_notes || initialPlanData.important_notes,
        });
      } else {
        await fetchSchoolAndPrincipalInfo();
      }
    } catch (error) {
      console.error('Error loading plan:', error);
      toast({ title: "خطأ في التحميل", description: "حدث خطأ أثناء تحميل بيانات الخطة.", variant: "destructive" });
      await fetchSchoolAndPrincipalInfo(); 
    } finally {
      setLoading(false);
      setIsPlanLoaded(true);
    }
  }, [user, toast, fetchSchoolAndPrincipalInfo, defaultAcademicYear]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (planId) {
      loadPlanData(planId);
    } else {
      fetchSchoolAndPrincipalInfo();
      setPlanData(prev => ({
        ...initialPlanData,
        principal_name: user.user_metadata?.full_name || user.user_metadata?.name || prev.principal_name,
        academic_year: prev.academic_year || defaultAcademicYear
      }));
      setIsPlanLoaded(true);
    }
  }, [user, navigate, planId, loadPlanData, fetchSchoolAndPrincipalInfo, defaultAcademicYear]);


  const handleInputChange = (field, value) => {
    setPlanData(prev => ({ ...prev, [field]: value }));
  };

  const handleVisitEntryChange = (index, field, value) => {
    const updatedEntries = [...planData.visit_entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setPlanData(prev => ({ ...prev, visit_entries: updatedEntries }));
  };

  const addVisitEntry = () => {
    setPlanData(prev => ({
      ...prev,
      visit_entries: [...prev.visit_entries, { ...initialVisitEntry, id: crypto.randomUUID() }]
    }));
  };

  const removeVisitEntry = (index) => {
    if (planData.visit_entries.length <= 1) {
        toast({ title: "تنبيه", description: "يجب أن تحتوي الخطة على صف واحد على الأقل.", variant: "default" });
        return;
    }
    const updatedEntries = planData.visit_entries.filter((_, i) => i !== index);
    setPlanData(prev => ({ ...prev, visit_entries: updatedEntries }));
  };

  const savePlan = async (newStatus = planData.status) => {
    if (!user) {
      toast({ title: "خطأ", description: "يجب تسجيل الدخول لحفظ الخطة.", variant: "destructive" });
      return null;
    }
    setLoading(true);
    const dataToSave = { 
      ...planData, 
      user_id: user.id, 
      status: newStatus,
      school_id: (await supabase.from('schools').select('id').eq('user_id', user.id).single()).data?.id || null,
      visit_entries: planData.visit_entries.map(entry => ({
        ...entry,
        execution_status: entry.execution_status === 'placeholder' ? '' : entry.execution_status
      }))
    };

    try {
      let result;
      if (planId) {
        const { data, error } = await supabase
          .from('class_visit_plans')
          .update(dataToSave)
          .eq('id', planId)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('class_visit_plans')
          .insert(dataToSave)
          .select()
          .single();
        if (error) throw error;
        result = data;
        if (result?.id) {
          navigate(`/class-visits/edit/${result.id}`, { replace: true });
        }
      }
      toast({ title: "تم الحفظ بنجاح!", description: "تم حفظ بيانات خطة الزيارات الصفية.", icon: <CheckCircle className="text-green-500" /> });
      return result;
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({ title: "خطأ في الحفظ", description: `فشل حفظ الخطة: ${error.message}`, variant: "destructive", icon: <AlertTriangle className="text-red-500" /> });
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (!isPlanLoaded && !planId) { 
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <p className="ml-3 text-gray-700">جاري تحميل النموذج...</p>
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
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {planId ? `تعديل خطة الزيارات الصفية` : `إنشاء خطة زيارات صفية جديدة`}
            </h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/class-visits')} className="flex items-center gap-2">
             العودة للوحة التحكم
          </Button>
        </div>
        <Card className="bg-white/80 backdrop-blur-md shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-pink-700">
              خطة الزيارات الصفية للعام الدراسي{' '}
              {ACADEMIC_YEAR_OPTIONS && ACADEMIC_YEAR_OPTIONS.length > 0 ? (
                <Select 
                  value={planData.academic_year || defaultAcademicYear} 
                  onValueChange={(value) => handleInputChange('academic_year', value)}
                >
                  <SelectTrigger className="w-[220px] inline-flex text-pink-700 border-pink-300">
                    <SelectValue placeholder="اختر العام الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEAR_OPTIONS.map(year => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                planData.academic_year || defaultAcademicYear
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p className="text-sm text-gray-600"><strong>{planData.form_number}</strong></p>
            <p className="text-sm text-gray-600">اسم النموذج: <strong>{planData.form_name}</strong></p>
            <p className="text-sm text-gray-600">رمز النموذج: <strong>{planData.form_code}</strong></p>
          </CardContent>
        </Card>
      </header>

      <Card className="mb-8 shadow-lg bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">ملاحظات هامة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pr-5 space-y-1 text-sm text-gray-600">
            {planData.important_notes.map((note, index) => <li key={index}>{note}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl text-gray-700">جدول خطة الزيارات</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {["م", "اسم المعلم", "التخصص", "الزيارة الأولى", "الزيارة الثانية", "التنفيذ", "ملاحظات", "إجراء"].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300 last:border-l-0">
                    {header === "الزيارة الأولى" || header === "الزيارة الثانية" ? (
                      <div className="text-center">{header}
                        <div className="grid grid-cols-4 gap-px mt-1">
                          {["التاريخ", "الوحدة", "النشاط", "الفصل"].map(sub => <span key={sub} className="text-xxs border-t border-gray-300 pt-1">{sub}</span>)}
                        </div>
                      </div>
                    ) : header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planData.visit_entries.map((entry, index) => (
                <tr key={entry.id || index} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-l border-gray-300">{index + 1}</td>
                  <td className="px-4 py-2 whitespace-nowrap border-l border-gray-300">
                    <Input type="text" value={entry.teacher_name} onChange={(e) => handleVisitEntryChange(index, 'teacher_name', e.target.value)} placeholder="اسم المعلم" className="text-sm"/>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-l border-gray-300">
                    <Input type="text" value={entry.specialization} onChange={(e) => handleVisitEntryChange(index, 'specialization', e.target.value)} placeholder="التخصص" className="text-sm"/>
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap border-l border-gray-300">
                    <div className="grid grid-cols-4 gap-1">
                      <Input type="text" value={entry.visit1_date} onChange={(e) => handleVisitEntryChange(index, 'visit1_date', e.target.value)} placeholder=" / / ١٤٤٦هـ" className="text-xs"/>
                      <Input type="text" value={entry.visit1_unit} onChange={(e) => handleVisitEntryChange(index, 'visit1_unit', e.target.value)} placeholder="الوحدة" className="text-xs"/>
                      <Input type="text" value={entry.visit1_activity} onChange={(e) => handleVisitEntryChange(index, 'visit1_activity', e.target.value)} placeholder="النشاط" className="text-xs"/>
                      <Input type="text" value={entry.visit1_class} onChange={(e) => handleVisitEntryChange(index, 'visit1_class', e.target.value)} placeholder="الفصل" className="text-xs"/>
                    </div>
                  </td>
                  <td className="px-1 py-2 whitespace-nowrap border-l border-gray-300">
                     <div className="grid grid-cols-4 gap-1">
                      <Input type="text" value={entry.visit2_date} onChange={(e) => handleVisitEntryChange(index, 'visit2_date', e.target.value)} placeholder=" / / ١٤٤٦هـ" className="text-xs"/>
                      <Input type="text" value={entry.visit2_unit} onChange={(e) => handleVisitEntryChange(index, 'visit2_unit', e.target.value)} placeholder="الوحدة" className="text-xs"/>
                      <Input type="text" value={entry.visit2_activity} onChange={(e) => handleVisitEntryChange(index, 'visit2_activity', e.target.value)} placeholder="النشاط" className="text-xs"/>
                      <Input type="text" value={entry.visit2_class} onChange={(e) => handleVisitEntryChange(index, 'visit2_class', e.target.value)} placeholder="الفصل" className="text-xs"/>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-l border-gray-300">
                    <Select value={entry.execution_status || 'placeholder'} onValueChange={(value) => handleVisitEntryChange(index, 'execution_status', value)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="حالة التنفيذ" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>اختر حالة التنفيذ</SelectItem>
                        {executionStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border-l border-gray-300">
                    <Textarea value={entry.notes} onChange={(e) => handleVisitEntryChange(index, 'notes', e.target.value)} placeholder="ملاحظات" rows={1} className="text-sm min-h-[38px]"/>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <Button variant="ghost" size="icon" onClick={() => removeVisitEntry(index)} className="text-red-500 hover:bg-red-100" disabled={planData.visit_entries.length <= 1}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button onClick={addVisitEntry} variant="outline" className="mt-4 w-full flex items-center gap-2 border-dashed border-pink-400 text-pink-600 hover:bg-pink-50">
            <Plus className="w-4 h-4" /> إضافة صف جديد
          </Button>
        </CardContent>
      </Card>

      <Card className="my-8 shadow-lg bg-white/90 backdrop-blur-md">
        <CardHeader><CardTitle className="text-lg text-gray-700">ملاحظات عامة على الخطة</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={planData.general_notes} onChange={(e) => handleInputChange('general_notes', e.target.value)} placeholder="أدخل ملاحظاتك العامة هنا..." rows={4} />
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-lg bg-white/90 backdrop-blur-md">
        <CardHeader><CardTitle className="text-lg text-gray-700">اعتمادات الخطة</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="assigned_deputy">الوكيل المسند للمتابعة</Label>
            <Input id="assigned_deputy" value={planData.assigned_deputy} onChange={(e) => handleInputChange('assigned_deputy', e.target.value)} placeholder="اسم الوكيل" />
          </div>
          <div>
            <Label htmlFor="principal_name">مدير المدرسة</Label>
            <Input id="principal_name" value={planData.principal_name} readOnly disabled placeholder="اسم المدير (تلقائي)" className="bg-gray-100"/>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8">
        <Button variant="outline" onClick={() => navigate('/class-visits')} className="w-full sm:w-auto">
          <X className="w-5 h-5 ml-2" /> إلغاء
        </Button>
        <Button onClick={() => savePlan()} disabled={loading} className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 flex items-center gap-2">
          <Save className="w-5 h-5" /> {loading ? 'جاري الحفظ...' : (planId ? 'حفظ التعديلات' : 'حفظ الخطة')}
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateClassVisitPlanPage;