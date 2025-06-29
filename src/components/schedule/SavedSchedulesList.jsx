import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Trash2 } from 'lucide-react';

const SavedSchedulesList = ({ savedSchedules, onLoadSchedule, onDeleteSchedule }) => {
  if (savedSchedules.length === 0) {
    return null; 
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-8 max-w-2xl mx-auto"
    >
      <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="arabic-text text-center">الجداول الدراسية المحفوظة</CardTitle>
        </CardHeader>
        <CardContent>
          {savedSchedules.length === 0 ? (
            <p className="text-center text-gray-600 arabic-text">لا توجد جداول محفوظة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {savedSchedules.map((schedule) => (
                <div key={schedule.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-medium arabic-text mb-1">{schedule.name || `جدول تاريخ ${new Date(schedule.createdAt).toLocaleDateString('ar-SA')}`}</h4>
                    <p className="text-xs text-gray-500">
                      الفصول: {schedule.classrooms} | المعلمون: {schedule.teachers.length} | آخر تحديث: {new Date(schedule.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoadSchedule(schedule)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> عرض وتعديل
                    </Button>
                     <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedSchedulesList;