import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Calendar, Users, Plus, Trash2, Eye, Download, GraduationCap, Edit, Save, Star } from 'lucide-react';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import TeacherForm from '@/components/schedule/TeacherForm';
import SavedSchedulesList from '@/components/schedule/SavedSchedulesList';
import { generateScheduleLogic, saveScheduleToLocalStorage, loadSchedulesFromLocalStorage } from '@/lib/scheduleUtils';

const SchedulePage = () => {
  const { user } = useAuth();
  const { classrooms, setClassrooms: setGlobalClassrooms, teachers, setTeachers: setGlobalTeachers } = useSchedule();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialTeacherState = {
    id: `t${Date.now()}${0}`,
    name: `معلم رقم 1`,
    subjects: ['', '', ''], 
    assignedClassrooms: [] 
  };

  const [step, setStep] = useState(1);
  const [scheduleData, setScheduleData] = useState({
    classroomDetails: classrooms.map(c => ({ id: c.id, name: c.name })),
    teachers: teachers.map((t, index) => ({ 
      ...t, 
      id: t.id || `t${Date.now()}${index}`, 
      name: t.name || `معلم رقم ${index + 1}`, 
      subjects: Array.isArray(t.subjects) ? (t.subjects.length >= 3 ? t.subjects.slice(0,3) : [...t.subjects, ...Array(3 - t.subjects.length).fill('')]) : ['', '', ''],
      assignedClassrooms: Array.isArray(t.assignedClassrooms) ? t.assignedClassrooms : []
    })),
    goldenDayActive: false,
  });
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [viewMode, setViewMode] = useState('classroom'); 
  const [editingScheduleName, setEditingScheduleName] = useState('');
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSavedSchedules(loadSchedulesFromLocalStorage(user.id));
    setScheduleData(prev => ({
      ...prev,
      classroomDetails: classrooms.map(c => ({ id: c.id, name: c.name })),
      teachers: teachers.map((t, index) => ({ 
        ...t, 
        id: t.id || `t${Date.now()}${index}`, 
        name: t.name || `معلم رقم ${index + 1}`, 
        subjects: Array.isArray(t.subjects) ? (t.subjects.length >= 3 ? t.subjects.slice(0,3) : [...t.subjects, ...Array(3 - t.subjects.length).fill('')]) : ['', '', ''],
        assignedClassrooms: Array.isArray(t.assignedClassrooms) ? t.assignedClassrooms : []
      })),
    }));
  }, [user, navigate, classrooms, teachers]);

  const handleClassroomCountChange = (count) => {
    const newCount = Math.max(1, parseInt(count) || 1);
    const currentClassrooms = scheduleData.classroomDetails;
    const newClassroomDetails = [];
    for (let i = 0; i < newCount; i++) {
      if (currentClassrooms[i]) {
        newClassroomDetails.push(currentClassrooms[i]);
      } else {
        newClassroomDetails.push({ id: `c${Date.now()}${i}`, name: `الفصل ${i + 1}` });
      }
    }
    setScheduleData(prev => ({ ...prev, classroomDetails: newClassroomDetails }));
  };

  const handleClassroomNameChange = (id, name) => {
    setScheduleData(prev => ({
      ...prev,
      classroomDetails: prev.classroomDetails.map(c => c.id === id ? { ...c, name } : c)
    }));
  };

  const addTeacher = useCallback(() => {
    setScheduleData(prev => {
      const newTeacherId = `t${Date.now()}${prev.teachers.length}`;
      const newTeacherName = `معلم رقم ${prev.teachers.length + 1}`;
      return {
        ...prev,
        teachers: [...prev.teachers, { 
          id: newTeacherId, 
          name: newTeacherName, 
          subjects: ['', '', ''], 
          assignedClassrooms: [] 
        }]
      };
    });
  }, []);

  const updateTeacher = useCallback((id, field, value) => {
    setScheduleData(prev => ({
      ...prev,
      teachers: prev.teachers.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  }, []);

  const removeTeacher = useCallback((id) => {
    setScheduleData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));
  }, []);

  const handleGenerateSchedule = () => {
    if (scheduleData.teachers.length === 0) {
      toast({ title: "خطأ", description: "يجب إضافة معلم واحد على الأقل", variant: "destructive" });
      return;
    }
    if (scheduleData.teachers.some(t => !t.name.trim() || !t.subjects[0].trim())) {
        toast({ title: "خطأ", description: "يرجى إدخال أسماء والمادة الإلزامية (الأولى) لجميع المعلمين", variant: "destructive"});
        return;
    }
    if (scheduleData.classroomDetails.some(c => !c.name.trim())) {
        toast({ title: "خطأ", description: "يرجى إدخال أسماء جميع الفصول", variant: "destructive"});
        return;
    }
    if (scheduleData.teachers.some(t => !t.assignedClassrooms || t.assignedClassrooms.length === 0)) {
        toast({ title: "خطأ", description: "يرجى تحديد فصل واحد على الأقل لكل معلم", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        setGlobalClassrooms(scheduleData.classroomDetails);
        setGlobalTeachers(scheduleData.teachers.map((t, index) => ({...t, name: t.name || `معلم رقم ${index + 1}`})));

        const scheduleInput = {
          classrooms: scheduleData.classroomDetails,
          teachers: scheduleData.teachers.map((t, index) => ({...t, name: t.name || `معلم رقم ${index + 1}`})),
          goldenDayActive: scheduleData.goldenDayActive,
        };
        const newScheduleResult = generateScheduleLogic(scheduleInput);
        const scheduleId = currentScheduleId || Date.now().toString();
        const scheduleName = editingScheduleName || `جدول ${user.schoolName || 'المدرسة'} - ${new Date().toLocaleDateString('ar-SA')}`;

        setGeneratedSchedule({
          id: scheduleId,
          name: scheduleName,
          schedule: newScheduleResult.schedule,
          teacherNisab: newScheduleResult.teacherNisab,
          createdAt: new Date().toISOString(),
          classroomDetails: scheduleData.classroomDetails,
          teachers: scheduleData.teachers.map((t, index) => ({...t, name: t.name || `معلم رقم ${index + 1}`})),
          goldenDayActive: scheduleData.goldenDayActive,
          userId: user.id,
        });
        toast({ title: "تم إنشاء الجدول بنجاح", description: "يمكنك الآن عرض وحفظ الجدول" });
        setStep(3);
      } catch (error) {
        console.error("Error generating schedule:", error);
        toast({ title: "خطأ فادح", description: "حدث خطأ غير متوقع أثناء توليد الجدول. قد يكون بسبب عدد كبير من المعلمين أو الفصول. يرجى المحاولة بعدد أقل أو مراجعة البيانات.", variant: "destructive"});
      } finally {
        setIsLoading(false);
      }
    }, 100); 
  };

  const handleSaveSchedule = () => {
    if (!generatedSchedule) return;
    
    const scheduleToSave = {
      ...generatedSchedule,
      name: editingScheduleName || generatedSchedule.name,
    };
    const updatedSchedules = saveScheduleToLocalStorage(scheduleToSave, user.id);
    setSavedSchedules(updatedSchedules);
    
    toast({ title: "تم حفظ الجدول", description: "تم حفظ الجدول بنجاح" });
  };

  const handleLoadSchedule = (scheduleToLoad) => {
    setScheduleData({
      classroomDetails: scheduleToLoad.classroomDetails,
      teachers: scheduleToLoad.teachers.map((t, index) => ({
        ...t, 
        name: t.name || `معلم رقم ${index + 1}`,
        subjects: Array.isArray(t.subjects) ? (t.subjects.length >= 3 ? t.subjects.slice(0,3) : [...t.subjects, ...Array(3 - t.subjects.length).fill('')]) : ['', '', ''],
        assignedClassrooms: Array.isArray(t.assignedClassrooms) ? t.assignedClassrooms : []
      })),
      goldenDayActive: scheduleToLoad.goldenDayActive || false,
    });
    setGeneratedSchedule(scheduleToLoad);
    setEditingScheduleName(scheduleToLoad.name);
    setCurrentScheduleId(scheduleToLoad.id);
    setGlobalClassrooms(scheduleToLoad.classroomDetails);
    setGlobalTeachers(scheduleToLoad.teachers.map((t, index) => ({...t, name: t.name || `معلم رقم ${index + 1}`})));
    setStep(3);
  };
  
  const handleDeleteSchedule = (scheduleId) => {
    const currentSchedules = loadSchedulesFromLocalStorage(user.id);
    const newSavedSchedules = currentSchedules.filter(s => s.id !== scheduleId);
    localStorage.setItem('schoolSchedules', JSON.stringify(
      JSON.parse(localStorage.getItem('schoolSchedules') || '[]').filter(s => s.userId !== user.id || s.id !== scheduleId)
    ));
    setSavedSchedules(newSavedSchedules);
    toast({ title: "تم حذف الجدول", description: "تم حذف الجدول المحدد بنجاح."});
    if(generatedSchedule && generatedSchedule.id === scheduleId) {
        setGeneratedSchedule(null);
        setStep(1);
    }
  };

  const printSchedule = () => window.print();

  if (!user) return null;
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4"
            ></motion.div>
            <p className="text-xl text-purple-700 arabic-text">جاري توليد الجدول، يرجى الانتظار...</p>
            <p className="text-sm text-gray-600 arabic-text">قد يستغرق هذا بعض الوقت حسب عدد المعلمين والفصول.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
            </Button>
            <div className="w-10 h-10 gradient-bg-1 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">الجدول المدرسي الذكي</h1>
              <p className="text-sm text-gray-600 arabic-text">إنشاء وتعديل الجداول الدراسية بسهولة</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
              <CardHeader><CardTitle className="text-center arabic-text">معلومات الفصول الدراسية</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="arabic-text">عدد الفصول الدراسية</Label>
                  <Input type="number" min="1" max="50" value={scheduleData.classroomDetails.length}
                         onChange={(e) => handleClassroomCountChange(e.target.value)}
                         className="text-center" />
                </div>
                {scheduleData.classroomDetails.map((classroom, index) => (
                  <div key={classroom.id}>
                    <Label htmlFor={`classroomName-${classroom.id}`} className="arabic-text">اسم الفصل {index + 1}</Label>
                    <Input id={`classroomName-${classroom.id}`} value={classroom.name}
                           onChange={(e) => handleClassroomNameChange(classroom.id, e.target.value)}
                           placeholder={`مثال: أول ثانوي أ`} className="text-right arabic-text"/>
                  </div>
                ))}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox id="goldenDay" checked={scheduleData.goldenDayActive} onCheckedChange={(checked) => setScheduleData(prev => ({...prev, goldenDayActive: checked}))} />
                  <Label htmlFor="goldenDay" className="arabic-text">تفعيل اليوم الذهبي (أول 4 حصص نشاط)</Label>
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => { setCurrentScheduleId(null); setEditingScheduleName(''); setStep(2); }} className="gradient-bg-1 text-white px-8">
                    التالي: إضافة المعلمين
                  </Button>
                </div>
              </CardContent>
            </Card>
            <SavedSchedulesList 
              savedSchedules={savedSchedules} 
              onLoadSchedule={handleLoadSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          </motion.div>
        )}

        {step === 2 && (
          <TeacherForm
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            addTeacher={addTeacher}
            updateTeacher={updateTeacher}
            removeTeacher={removeTeacher}
            onNext={handleGenerateSchedule}
            onBack={() => setStep(1)}
            classroomDetails={scheduleData.classroomDetails}
          />
        )}

        {step === 3 && generatedSchedule && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg no-print">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Input 
                      type="text"
                      value={editingScheduleName || generatedSchedule.name}
                      onChange={(e) => setEditingScheduleName(e.target.value)}
                      onBlur={() => {
                        if (editingScheduleName.trim() !== '' && generatedSchedule) {
                            setGeneratedSchedule(prev => ({...prev, name: editingScheduleName}));
                        }
                      }}
                      className="text-xl font-bold arabic-text text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none"
                      placeholder="اسم الجدول"
                    />
                    <Button size="sm" onClick={() => setStep(2)} className="flex items-center gap-1">
                        <Edit className="w-3 h-3"/> تعديل البيانات
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    <Button onClick={() => setViewMode('main')} variant={viewMode === 'main' ? 'default' : 'outline'} className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> الجدول الرئيسي (حسب المعلم)
                    </Button>
                    <Button onClick={() => setViewMode('classroom')} variant={viewMode === 'classroom' ? 'default' : 'outline'} className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> عرض حسب الفصل
                    </Button>
                    <Button onClick={() => setViewMode('teacher')} variant={viewMode === 'teacher' ? 'default' : 'outline'} className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> عرض حسب المعلم (فردي)
                    </Button>
                    <Button onClick={handleSaveSchedule} className="gradient-bg-2 text-white flex items-center gap-2">
                      <Save className="w-4 h-4" /> حفظ الجدول
                    </Button>
                    <Button onClick={printSchedule} variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" /> طباعة/تصدير PDF
                    </Button>
                  </div>
                  {generatedSchedule.goldenDayActive && (
                    <div className="text-center p-2 bg-yellow-100 text-yellow-700 rounded-md mb-4 flex items-center justify-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500"/>
                      <span className="arabic-text">تم تفعيل اليوم الذهبي (أول 4 حصص أنشطة).</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <ScheduleTable 
                  schedule={generatedSchedule.schedule} 
                  viewMode={viewMode} 
                  teachers={generatedSchedule.teachers} 
                  classrooms={generatedSchedule.classroomDetails}
                  teacherNisab={generatedSchedule.teacherNisab}
                  goldenDayActive={generatedSchedule.goldenDayActive}
                />
              </div>
              <div className="flex justify-center no-print">
                <Button onClick={() => { setStep(1); setGeneratedSchedule(null); setCurrentScheduleId(null); setEditingScheduleName(''); }} variant="outline">
                  العودة أو إنشاء جدول جديد
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;