import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, BookOpen } from 'lucide-react';

const TeacherForm = ({ scheduleData, setScheduleData, addTeacher, updateTeacher, removeTeacher, onNext, onBack, classroomDetails }) => {

  const handleSubjectChange = (teacherId, subjectIndex, value) => {
    updateTeacher(teacherId, 'subjects', 
      scheduleData.teachers.find(t => t.id === teacherId).subjects.map((subject, index) => 
        index === subjectIndex ? value : subject
      )
    );
  };

  const handleAssignedClassroomsChange = (teacherId, classroomId, checked) => {
    const currentTeacher = scheduleData.teachers.find(t => t.id === teacherId);
    let newAssignedClassrooms;
    if (checked) {
      newAssignedClassrooms = [...(currentTeacher.assignedClassrooms || []), classroomId];
    } else {
      newAssignedClassrooms = (currentTeacher.assignedClassrooms || []).filter(id => id !== classroomId);
    }
    updateTeacher(teacherId, 'assignedClassrooms', newAssignedClassrooms);
  };
  

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center arabic-text">إدارة المعلمين ({scheduleData.teachers.length} معلم)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {scheduleData.teachers.map((teacher, index) => (
              <div key={teacher.id} className="p-4 border rounded-lg bg-gray-50/80 backdrop-blur-sm shadow relative">
                <div className="absolute right-4 top-4 text-lg font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  {index + 1}
                </div>
                <div className="grid md:grid-cols-3 gap-6 items-start pt-12">
                  <div className="md:col-span-1">
                    <Label htmlFor={`teacherName-${teacher.id}`} className="arabic-text mb-1 block">اسم المعلم</Label>
                    <Input 
                      id={`teacherName-${teacher.id}`} 
                      value={teacher.name} 
                      onChange={(e) => updateTeacher(teacher.id, 'name', e.target.value)} 
                      placeholder="أدخل اسم المعلم" 
                      className="text-right arabic-text"
                    />
                  </div>
                  
                  <div className="md:col-span-1 space-y-3">
                    <Label className="arabic-text mb-1 block flex items-center">
                      <BookOpen className="w-4 h-4 ml-2 text-purple-600" />
                      المواد التي يتم تدريسها
                    </Label>
                    {teacher.subjects.map((subject, subIndex) => (
                      <div key={subIndex}>
                        <Input 
                          id={`teacherSubject-${teacher.id}-${subIndex}`} 
                          value={subject} 
                          onChange={(e) => handleSubjectChange(teacher.id, subIndex, e.target.value)} 
                          placeholder={`المادة ${subIndex + 1} ${subIndex === 0 ? '(إلزامية)' : '(اختيارية)'}`}
                          className="text-right arabic-text"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-1 space-y-2">
                    <Label className="arabic-text mb-1 block">الفصول المسندة إليه</Label>
                    <div className="p-3 border rounded-md bg-white max-h-40 overflow-y-auto space-y-2">
                      {classroomDetails.length > 0 ? classroomDetails.map(c => (
                        <div key={c.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`classroom-${teacher.id}-${c.id}`}
                            checked={(teacher.assignedClassrooms || []).includes(c.id)}
                            onCheckedChange={(checked) => handleAssignedClassroomsChange(teacher.id, c.id, checked)}
                          />
                          <Label htmlFor={`classroom-${teacher.id}-${c.id}`} className="arabic-text font-normal text-sm cursor-pointer">
                            {c.name}
                          </Label>
                        </div>
                      )) : <p className="text-sm text-gray-500 arabic-text">لا توجد فصول متاحة. يرجى إضافتها أولاً.</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeTeacher(teacher.id)} 
                        className="flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4"/> حذف المعلم
                    </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={addTeacher} variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> إضافة معلم جديد
            </Button>
          </div>
          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button onClick={onBack} variant="outline">السابق: معلومات الفصول</Button>
            <Button onClick={onNext} className="gradient-bg-1 text-white px-8">إنشاء أو تحديث الجدول</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeacherForm;