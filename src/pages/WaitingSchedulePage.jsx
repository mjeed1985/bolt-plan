import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Clock, Users, Download, Save, Edit, Filter } from 'lucide-react';
import { loadSchedulesFromLocalStorage } from '@/lib/scheduleUtils';

const WaitingSchedulePage = () => {
  const { user } = useAuth();
  const { classrooms, teachers: allTeachersFromContext } = useSchedule();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mainScheduleData, setMainScheduleData] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(1); // Default to first period
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [excludedTeachers, setExcludedTeachers] = useState([]);
  
  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']; // 7 days
  const periodsPerDay = 7;


  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const mainSchedules = loadSchedulesFromLocalStorage(user.id);
    if (mainSchedules.length > 0) {
      setMainScheduleData(mainSchedules[0]); // Load the first saved main schedule
      if (classrooms.length > 0) {
        setSelectedClassroom(classrooms[0].id);
      }
    } else {
      toast({ title: "لا توجد جداول رئيسية", description: "يرجى إنشاء جدول مدرسي رئيسي أولاً.", variant: "destructive" });
    }
  }, [user, navigate, toast, classrooms]);

  const findSubstituteTeachers = () => {
    if (!mainScheduleData || !selectedClassroom || !allTeachersFromContext.length) {
      toast({ title: "بيانات غير كافية", description: "يرجى التأكد من وجود جدول رئيسي واختيار فصل.", variant: "destructive" });
      return;
    }

    const currentDayIndex = new Date().getDay(); // Sunday is 0, Saturday is 6
    const currentDayName = daysOfWeek[currentDayIndex];
    const targetPeriod = parseInt(selectedPeriod);

    let available = [];
    let excluded = [];

    allTeachersFromContext.forEach(teacher => {
      let isBusyInTargetPeriod = false;
      let hasNearbySession = false;
      let endedBeforeTarget = true; // Assume ended before unless a later session is found

      // Check if teacher is busy in the target period in any classroom
      Object.values(mainScheduleData.schedule).forEach(classroomSchedule => {
        const daySchedule = classroomSchedule[currentDayName] || [];
        daySchedule.forEach(session => {
          if (session.teacher === teacher.name && session.period === targetPeriod) {
            isBusyInTargetPeriod = true;
          }
          if (session.teacher === teacher.name && session.period >= targetPeriod) {
            endedBeforeTarget = false; // Found a session at or after target
          }
          if (session.teacher === teacher.name && 
              (session.period === targetPeriod - 1 || session.period === targetPeriod - 2 || 
               session.period === targetPeriod + 1 || session.period === targetPeriod + 2)) {
            hasNearbySession = true;
          }
        });
      });

      if (isBusyInTargetPeriod) {
        excluded.push({ name: teacher.name, reason: "مرتبط في نفس الحصة" });
      } else if (endedBeforeTarget) {
        excluded.push({ name: teacher.name, reason: "حصصه انتهت قبل حصة الغياب" });
      } else if (hasNearbySession) {
        available.push({ name: teacher.name, reason: "لديه حصص قريبة" });
      } else {
         // If not busy, not ended, and no nearby, could be available but less priority
         // For now, let's add to available if not explicitly excluded
         available.push({ name: teacher.name, reason: "متاح" });
      }
    });
    
    // Simple sort: those with "nearby sessions" first
    available.sort((a,b) => (a.reason === "لديه حصص قريبة" ? -1 : 1));


    setAvailableTeachers(available);
    setExcludedTeachers(excluded);
    toast({ title: "تم تحديث قائمة المعلمين" });
  };
  

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
            </Button>
            <div className="w-10 h-10 gradient-bg-2 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">نظام الانتظار (المعلم البديل)</h1>
              <p className="text-sm text-gray-600 arabic-text">اختيار معلم بديل للحصص الشاغرة</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {!mainScheduleData && (
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
                <CardHeader><CardTitle className="text-center arabic-text text-red-600">تنبيه هام</CardTitle></CardHeader>
                <CardContent className="text-center arabic-text">
                    يجب إنشاء جدول مدرسي رئيسي أولاً لتتمكن من استخدام نظام الانتظار.
                    <Button onClick={() => navigate('/schedule')} className="mt-4 gradient-bg-1 text-white">
                        الذهاب لإنشاء جدول رئيسي
                    </Button>
                </CardContent>
            </Card>
        )}

        {mainScheduleData && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
              <CardHeader><CardTitle className="text-center arabic-text">اختيار معلم بديل</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="classroomSelect" className="arabic-text">اختر الفصل</Label>
                    <select 
                      id="classroomSelect" 
                      value={selectedClassroom} 
                      onChange={(e) => setSelectedClassroom(e.target.value)}
                      className="w-full p-2 border rounded text-right arabic-text bg-white"
                    >
                      <option value="">-- اختر الفصل --</option>
                      {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="periodSelect" className="arabic-text">اختر الحصة الشاغرة</Label>
                    <select 
                      id="periodSelect" 
                      value={selectedPeriod} 
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full p-2 border rounded text-right arabic-text bg-white"
                    >
                      {[...Array(periodsPerDay)].map((_, i) => (
                        <option key={i+1} value={i+1}>الحصة {i+1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={findSubstituteTeachers} className="gradient-bg-2 text-white px-8 flex items-center gap-2">
                    <Filter className="w-4 h-4"/> البحث عن معلمين بدلاء
                  </Button>
                </div>

                {(availableTeachers.length > 0 || excludedTeachers.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                      <h3 className="text-lg font-semibold arabic-text text-green-600 mb-3">المعلمون المتاحون</h3>
                      {availableTeachers.length > 0 ? (
                        <ul className="space-y-2">
                          {availableTeachers.map(t => (
                            <li key={t.name} className="p-3 bg-green-50 rounded-md arabic-text">
                              {t.name} <span className="text-xs text-green-700">({t.reason})</span>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="arabic-text text-gray-500">لا يوجد معلمون متاحون حالياً.</p>}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold arabic-text text-red-600 mb-3">المعلمون المستبعدون</h3>
                       {excludedTeachers.length > 0 ? (
                        <ul className="space-y-2">
                          {excludedTeachers.map(t => (
                            <li key={t.name} className="p-3 bg-red-50 rounded-md arabic-text">
                              {t.name} <span className="text-xs text-red-700">({t.reason})</span>
                            </li>
                          ))}
                        </ul>
                       ) : <p className="arabic-text text-gray-500">لا يوجد معلمون مستبعدون حالياً.</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WaitingSchedulePage;