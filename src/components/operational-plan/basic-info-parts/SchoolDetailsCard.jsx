import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Edit3, CheckSquare, Briefcase, GraduationCap, Users2, Building, Mail, Phone } from 'lucide-react';
import { 
  SCHOOL_STAGES, 
  STUDENT_GENDER_TYPES, 
  BUILDING_TYPES, 
  EDUCATION_DEPARTMENTS
} from '@/lib/operationalPlanConstants';

const SchoolDetailsCard = ({ localPlanData, handleChange, renderField }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><School className="text-indigo-600"/> معلومات المدرسة الأساسية</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {renderField("plan_name", "اسم الخطة", "مثال: الخطة التشغيلية لمدرسة الأمل للعام 2024-2025", "text", Edit3)}
        {renderField("school_name_full", "اسم المدرسة الكامل", "اكتب اسم المدرسة كما هو في السجلات الرسمية", "text", School)}
        {renderField("ministry_school_id", "رقم المدرسة الوزاري", "أدخل الرقم الوزاري للمدرسة", "text", CheckSquare)}
        
        <div className="space-y-1.5">
          <Label htmlFor="education_department" className="flex items-center text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
            إدارة التعليم
          </Label>
          <Select value={localPlanData.education_department || ''} onValueChange={(val) => handleChange("education_department", val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر إدارة التعليم" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_DEPARTMENTS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {localPlanData.education_department === 'other' && (
            <Input
              type="text"
              id="education_department_other"
              value={localPlanData.education_department_other || ''}
              onChange={(e) => handleChange("education_department_other", e.target.value)}
              placeholder="يرجى تحديد اسم إدارة التعليم"
              className="w-full mt-2"
            />
          )}
        </div>

        {renderField("school_stage", "المرحلة الدراسية", "اختر المرحلة الدراسية", "select", GraduationCap, SCHOOL_STAGES, "select")}
        {renderField("student_gender_type", "نوع تعليم الطلاب", "اختر نوع تعليم الطلاب (بنين/بنات/مشترك)", "select", Users2, STUDENT_GENDER_TYPES, "select")}
        {renderField("building_type", "نوع المبنى", "اختر نوع المبنى المدرسي", "select", Building, BUILDING_TYPES, "select")}
        {renderField("school_email", "البريد الإلكتروني للمدرسة", "example@school.edu.sa", "email", Mail)}
        {renderField("school_phone", "رقم هاتف المدرسة", "011-XXX-XXXX", "tel", Phone)}
      </CardContent>
    </Card>
  );
};

export default SchoolDetailsCard;