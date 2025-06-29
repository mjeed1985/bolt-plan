import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, Users, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const SchoolStaffSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [staffList, setStaffList] = useState(planData.school_staff_list || []);
  const [showStaffForm, setShowStaffForm] = useState(planData.school_staff_list && planData.school_staff_list.length > 0);

  useEffect(() => {
    setStaffList(planData.school_staff_list || []);
    setShowStaffForm(planData.school_staff_list && planData.school_staff_list.length > 0);
  }, [planData.school_staff_list]);

  const handleStaffChange = (index, field, value) => {
    const updatedStaff = [...staffList];
    updatedStaff[index] = { ...updatedStaff[index], [field]: value };
    setStaffList(updatedStaff);
    onChange({ school_staff_list: updatedStaff });
  };

  const addStaffMember = () => {
    const newMember = {
      id: Date.now(),
      fullName: '',
      nationalId: '',
      qualification: '',
      specialization: '',
      graduationDate: '',
      teachingStartDate: '',
      currentSchoolStartDate: '',
      workload: '',
      trainingPrograms: '',
      notes: ''
    };
    const updatedStaff = [...staffList, newMember];
    setStaffList(updatedStaff);
    onChange({ school_staff_list: updatedStaff });
  };

  const removeStaffMember = (index) => {
    const updatedStaff = staffList.filter((_, i) => i !== index);
    setStaffList(updatedStaff);
    onChange({ school_staff_list: updatedStaff });
    if (updatedStaff.length === 0) {
      setShowStaffForm(false);
    }
    toast({
      title: "تم الحذف",
      description: "تم حذف بيانات المنسوب بنجاح.",
      variant: "success",
    });
  };
  
  const staffCount = staffList.length;
  const averageWorkload = staffList.length > 0 
    ? (staffList.reduce((sum, staff) => sum + (parseInt(staff.workload, 10) || 0), 0) / staffList.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <Card className="border-indigo-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-6 h-6" />
            بيانات منسوبي المدرسة
          </CardTitle>
          <CardDescription className="text-indigo-100">
            أدخل بيانات الكادر التعليمي والإداري في المدرسة.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-gray-50">
          {!showStaffForm ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center py-8">
              <p className="text-gray-600 text-lg">هل ترغب في إضافة بيانات منسوبي المدرسة الآن؟</p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => { setShowStaffForm(true); if(staffList.length === 0) addStaffMember(); }} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
                >
                  <PlusCircle className="ml-2 h-5 w-5" /> نعم، إضافة بيانات المنسوبين
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowStaffForm(false)}
                  className="px-6 py-3 rounded-lg border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  التخطي لاحقًا
                </Button>
              </div>
            </div>
          ) : (
            <>
              {staffList.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-inner">
                  <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-lg text-gray-600">لم يتم إضافة أي منسوبين بعد.</p>
                  <p className="text-sm text-gray-500">انقر على الزر أدناه لإضافة أول منسوب إلى القائمة.</p>
                  <Button onClick={addStaffMember} className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105">
                    <PlusCircle className="ml-2 h-5 w-5" /> إضافة أول منسوب
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-x-auto bg-white p-4 rounded-lg shadow-md"
                >
                  <Table>
                    <TableHeader className="bg-indigo-50">
                      <TableRow>
                        <TableHead className="w-[3%] text-center">م</TableHead>
                        <TableHead className="w-[15%]">الاسم الرباعي</TableHead>
                        <TableHead className="w-[10%]">السجل المدني</TableHead>
                        <TableHead className="w-[10%]">المؤهل</TableHead>
                        <TableHead className="w-[10%]">التخصص</TableHead>
                        <TableHead className="w-[8%]">تاريخ التخرج</TableHead>
                        <TableHead className="w-[8%]">تاريخ المباشرة (تعليم)</TableHead>
                        <TableHead className="w-[8%]">تاريخ المباشرة (مدرسة)</TableHead>
                        <TableHead className="w-[7%] text-center">النصاب</TableHead>
                        <TableHead className="w-[12%]">البرامج التدريبية</TableHead>
                        <TableHead className="w-[12%]">ملاحظات</TableHead>
                        <TableHead className="w-[5%] text-center">إجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffList.map((staff, index) => (
                        <motion.tr 
                          key={staff.id || index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/30'}
                        >
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell><Input type="text" value={staff.fullName} onChange={(e) => handleStaffChange(index, 'fullName', e.target.value)} placeholder="الاسم" className="min-w-[150px]" /></TableCell>
                          <TableCell><Input type="text" value={staff.nationalId} onChange={(e) => handleStaffChange(index, 'nationalId', e.target.value)} placeholder="السجل المدني" className="min-w-[120px]" /></TableCell>
                          <TableCell><Input type="text" value={staff.qualification} onChange={(e) => handleStaffChange(index, 'qualification', e.target.value)} placeholder="المؤهل" className="min-w-[100px]" /></TableCell>
                          <TableCell><Input type="text" value={staff.specialization} onChange={(e) => handleStaffChange(index, 'specialization', e.target.value)} placeholder="التخصص" className="min-w-[100px]" /></TableCell>
                          <TableCell><Input type="date" value={staff.graduationDate} onChange={(e) => handleStaffChange(index, 'graduationDate', e.target.value)} className="min-w-[130px]" /></TableCell>
                          <TableCell><Input type="date" value={staff.teachingStartDate} onChange={(e) => handleStaffChange(index, 'teachingStartDate', e.target.value)} className="min-w-[130px]" /></TableCell>
                          <TableCell><Input type="date" value={staff.currentSchoolStartDate} onChange={(e) => handleStaffChange(index, 'currentSchoolStartDate', e.target.value)} className="min-w-[130px]" /></TableCell>
                          <TableCell><Input type="number" value={staff.workload} onChange={(e) => handleStaffChange(index, 'workload', e.target.value)} placeholder="النصاب" className="min-w-[70px] text-center" /></TableCell>
                          <TableCell><Input type="text" value={staff.trainingPrograms} onChange={(e) => handleStaffChange(index, 'trainingPrograms', e.target.value)} placeholder="البرامج" className="min-w-[150px]" /></TableCell>
                          <TableCell><Input type="text" value={staff.notes} onChange={(e) => handleStaffChange(index, 'notes', e.target.value)} placeholder="ملاحظات" className="min-w-[150px]" /></TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="icon" onClick={() => removeStaffMember(index)} aria-label="حذف المنسوب">
                              <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <Button 
                  onClick={addStaffMember} 
                  variant="outline" 
                  className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg shadow-sm transition-transform hover:scale-105"
                >
                  <PlusCircle className="ml-2 h-5 w-5" /> إضافة منسوب جديد
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => { setShowStaffForm(false); onChange({ school_staff_list: [] }); setStaffList([]); }}
                  className="text-gray-600 hover:text-indigo-700 transition-colors"
                >
                  إلغاء وإخفاء جدول المنسوبين
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showStaffForm && (
        <Card className="border-teal-200 bg-teal-50/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-teal-700">ملخص بيانات المنسوبين</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <p className="text-3xl font-bold text-teal-600">{staffCount}</p>
              <p className="text-md text-gray-700 mt-1">إجمالي عدد المنسوبين</p>
              {staffCount > 0 ? <CheckCircle className="w-7 h-7 text-green-500 mx-auto mt-2" /> : <XCircle className="w-7 h-7 text-red-500 mx-auto mt-2" />}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-white rounded-xl shadow-lg"
            >
              <p className="text-3xl font-bold text-teal-600">{averageWorkload}</p>
              <p className="text-md text-gray-700 mt-1">متوسط النصاب</p>
              {parseFloat(averageWorkload) > 0 ? <CheckCircle className="w-7 h-7 text-green-500 mx-auto mt-2" /> : <XCircle className="w-7 h-7 text-red-500 mx-auto mt-2" />}
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchoolStaffSection;