import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Users2, Building, UserPlus, Trash2, PlusCircle } from 'lucide-react';
import { NumberStepper } from '@/components/ui/NumberStepper';

const StaffAndStudentsCard = ({ localPlanData, handleChange, handleNumberChange, handleStudentDistributionChange, addStudentDistributionEntry, removeStudentDistributionEntry, renderField }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><Users className="text-indigo-600"/> الكادر التعليمي والإداري والطلاب</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderField("teacher_count", "عدد المعلمين/المعلمات", "أدخل العدد", "number", Users, [], "number_stepper")}
          {renderField("student_count", "إجمالي عدد الطلاب/الطالبات", "أدخل العدد", "number", Users2, [], "number_stepper")}
          {renderField("admin_count", "عدد الإداريين/الإداريات", "أدخل العدد", "number", UserCheck, [], "number_stepper")}
          {renderField("classroom_count", "عدد الفصول الدراسية", "أدخل العدد", "number", Building, [], "number_stepper")}
        </div>
        <div className="mt-6">
          <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <UserPlus className="w-4 h-4 mr-2 text-indigo-600" />
            أعداد الطلاب لكل مرحلة
          </Label>
          {(localPlanData.student_distribution_by_stage || []).map((entry, index) => (
            <div key={entry.id || index} className="flex items-center gap-4 mb-3 p-3 border rounded-md bg-indigo-50/50">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="اكتب اسم المرحلة (مثال: الصف الأول الابتدائي)"
                  value={entry.stage || ''}
                  onChange={(e) => handleStudentDistributionChange(index, 'stage', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <NumberStepper
                  value={entry.student_count}
                  onChange={(value) => handleStudentDistributionChange(index, 'student_count', value)}
                  min={0}
                  max={5000}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeStudentDistributionEntry(index)} className="text-red-500 hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addStudentDistributionEntry} variant="outline" className="w-full border-dashed border-indigo-400 text-indigo-600 hover:bg-indigo-50">
            <PlusCircle className="mr-2 h-4 w-4" /> إضافة توزيع طلاب لمرحلة جديدة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffAndStudentsCard;