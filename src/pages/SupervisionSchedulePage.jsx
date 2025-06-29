import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ShieldCheck, Download, Save, Edit, CalendarDays } from 'lucide-react';

const SupervisionSchedulePage = () => {
  const { user } = useAuth();
  const { teachers: allTeachersFromContext } = useSchedule();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fixedSupervisionAssignments, setFixedSupervisionAssignments] = useState(null); // Store assignments once generated
  const [selectedDaySupervision, setSelectedDaySupervision] = useState(null);
  const [selectedDisplayDay, setSelectedDisplayDay] = useState('الأحد'); // Default to Sunday
  
  const supervisionSlots = ['فسحة بعد الحصة الثالثة', 'الصلاة بعد الحصة السابعة'];
  const schoolDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const studentCountForRules = 300; // Fixed internal student count for supervisor rule

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Load or generate fixed assignments
    const savedAssignments = JSON.parse(localStorage.getItem(`fixedSupervisionAssignments_${user.id}`) || 'null');
    if (savedAssignments) {
      setFixedSupervisionAssignments(savedAssignments);
      displaySupervisionForDay(selectedDisplayDay, savedAssignments);
    } else if (allTeachersFromContext.length > 0) {
      const assignments = generateFixedSupervisionAssignments();
      setFixedSupervisionAssignments(assignments);
      localStorage.setItem(`fixedSupervisionAssignments_${user.id}`, JSON.stringify(assignments));
      displaySupervisionForDay(selectedDisplayDay, assignments);
    }
  }, [user, navigate, allTeachersFromContext.length]); // Rerun if teacher count changes to regenerate if needed

  const getNumberOfSupervisorsInternal = () => {
    // Internal rule, not shown to user
    if (studentCountForRules >= 1 && studentCountForRules <= 50) return 2;
    if (studentCountForRules >= 51 && studentCountForRules <= 200) return 5;
    if (studentCountForRules >= 201 && studentCountForRules <= 450) return 7;
    if (studentCountForRules >= 451 && studentCountForRules <= 600) return 10;
    if (studentCountForRules >= 601) return 15;
    return 2; // Default if somehow out of range
  };

  const generateFixedSupervisionAssignments = () => {
    if (allTeachersFromContext.length === 0) {
      toast({ title: "لا يوجد معلمون", description: "لا يمكن إنشاء جدول إشراف بدون معلمين.", variant: "destructive" });
      return null;
    }

    const numSupervisorsNeeded = getNumberOfSupervisorsInternal();
    if (allTeachersFromContext.length < numSupervisorsNeeded) {
      toast({ title: "عدد المعلمين غير كافٍ", description: `تحتاج إلى ${numSupervisorsNeeded} مشرفين على الأقل. المتوفر: ${allTeachersFromContext.length}. سيتم استخدام جميع المعلمين المتاحين.`, variant: "warning" });
    }
    
    const assignments = {};
    let teacherPool = [...allTeachersFromContext].sort(() => 0.5 - Math.random()); // Shuffle once

    supervisionSlots.forEach(slot => {
      assignments[slot] = [];
      const supervisorsForThisSlot = Math.min(numSupervisorsNeeded, teacherPool.length);
      for (let i = 0; i < supervisorsForThisSlot; i++) {
        const teacherIndex = (i + (slot === supervisionSlots[1] ? Math.floor(supervisorsForThisSlot/2) : 0)) % teacherPool.length; // Simple rotation for second slot
        assignments[slot].push(teacherPool[teacherIndex].name);
      }
       // Ensure a different set if possible for the second slot by slightly rotating the pool for selection
      if (slot === supervisionSlots[1] && teacherPool.length > supervisorsForThisSlot) {
         const tempPool = [...teacherPool];
         const firstHalf = tempPool.splice(0, Math.floor(supervisorsForThisSlot/2));
         teacherPool = [...tempPool, ...firstHalf]; // Rotate
      }
    });
    return assignments;
  };
  
  const displaySupervisionForDay = (day, assignments = fixedSupervisionAssignments) => {
    if (assignments) {
      setSelectedDisplayDay(day);
      setSelectedDaySupervision(assignments); // Assignments are fixed, so just display them
    }
  };

  const printSupervisionSchedule = () => window.print();


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
            <div className="w-10 h-10 gradient-bg-3 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">جدول الإشراف الثابت</h1>
              <p className="text-sm text-gray-600 arabic-text">عرض مهام الإشراف اليومي</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {allTeachersFromContext.length === 0 && (
            <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
                <CardHeader><CardTitle className="text-center arabic-text text-red-600">تنبيه هام</CardTitle></CardHeader>
                <CardContent className="text-center arabic-text">
                    يجب إضافة معلمين في الجدول المدرسي الرئيسي أولاً ليتمكن النظام من اقتراح جدول الإشراف.
                    <Button onClick={() => navigate('/schedule')} className="mt-4 gradient-bg-1 text-white">
                        الذهاب لصفحة الجداول
                    </Button>
                </CardContent>
            </Card>
        )}
        
        {allTeachersFromContext.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center arabic-text">عرض جدول الإشراف لليوم</CardTitle>
                <div className="flex justify-center mt-4">
                    <select 
                        value={selectedDisplayDay} 
                        onChange={(e) => displaySupervisionForDay(e.target.value)}
                        className="p-2 border rounded text-right arabic-text bg-white"
                    >
                        {schoolDays.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                </div>
              </CardHeader>
              {selectedDaySupervision && (
                <CardContent className="space-y-6 pt-4">
                  <div className="bg-white rounded-lg p-6 shadow-md overflow-x-auto print-page">
                    <h3 className="text-2xl font-bold text-center arabic-text mb-6">جدول الإشراف ليوم {selectedDisplayDay}</h3>
                    <table className="w-full border-collapse border border-gray-300 schedule-table">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 arabic-text">فترة الإشراف</th>
                          <th className="border border-gray-300 p-2 arabic-text">المعلمون المشرفون</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supervisionSlots.map(slot => (
                          <tr key={slot}>
                            <td className="border border-gray-300 p-2 font-medium arabic-text">{slot}</td>
                            <td className="border border-gray-300 p-2 schedule-cell text-center arabic-text">
                              {(selectedDaySupervision[slot] || []).join('، ') || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center no-print">
                    <Button onClick={printSupervisionSchedule} variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" /> طباعة جدول اليوم
                    </Button>
                  </div>
                </CardContent>
              )}
               {!selectedDaySupervision && !fixedSupervisionAssignments && allTeachersFromContext.length > 0 && (
                <CardContent className="text-center arabic-text">
                    <p>يتم الآن إعداد جدول الإشراف الثابت...</p>
                    <Button onClick={() => {
                        const assignments = generateFixedSupervisionAssignments();
                        if (assignments) {
                            setFixedSupervisionAssignments(assignments);
                            localStorage.setItem(`fixedSupervisionAssignments_${user.id}`, JSON.stringify(assignments));
                            displaySupervisionForDay(selectedDisplayDay, assignments);
                            toast({title: "تم إعداد جدول الإشراف الثابت بنجاح"});
                        }
                    }} className="mt-2 gradient-bg-1 text-white">إعادة إنشاء الجدول الثابت</Button>
                </CardContent>
            )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupervisionSchedulePage;