import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { Users, FileSpreadsheet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SchoolStaffSummarySection = ({ planData }) => {
  const staffList = planData.school_staff_list || [];

  if (staffList.length === 0) {
    return null;
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch (e) {
      return dateString;
    }
  };

  const averageWorkload = (staffList.reduce((sum, staff) => sum + (parseInt(staff.workload, 10) || 0), 0) / (staffList.length || 1)).toFixed(1);

  return (
    <SummarySection id="school_staff" title="منسوبي المدرسة" icon={Users}>
      <SectionCard title="قائمة منسوبي المدرسة" icon={<Users />} contentClassName="p-0">
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>الاسم الرباعي</TableHead>
                    <TableHead>السجل المدني</TableHead>
                    <TableHead>المؤهل</TableHead>
                    <TableHead>التخصص</TableHead>
                    <TableHead>تاريخ التخرج</TableHead>
                    <TableHead>المباشرة (تعليم)</TableHead>
                    <TableHead>المباشرة (مدرسة)</TableHead>
                    <TableHead>النصاب</TableHead>
                    <TableHead>البرامج التدريبية</TableHead>
                    <TableHead>ملاحظات</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {staffList.map((staff, index) => (
                    <TableRow key={staff.id || index}>
                        <TableCell>{staff.fullName || 'N/A'}</TableCell>
                        <TableCell>{staff.nationalId || 'N/A'}</TableCell>
                        <TableCell>{staff.qualification || 'N/A'}</TableCell>
                        <TableCell>{staff.specialization || 'N/A'}</TableCell>
                        <TableCell>{formatDate(staff.graduationDate)}</TableCell>
                        <TableCell>{formatDate(staff.teachingStartDate)}</TableCell>
                        <TableCell>{formatDate(staff.currentSchoolStartDate)}</TableCell>
                        <TableCell>{staff.workload || 'N/A'}</TableCell>
                        <TableCell>{staff.trainingPrograms || 'N/A'}</TableCell>
                        <TableCell>{staff.notes || 'N/A'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
      </SectionCard>
      
      <SectionCard title="ملخص بيانات المنسوبين" icon={<FileSpreadsheet />} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{staffList.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">إجمالي عدد المنسوبين</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{averageWorkload}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">متوسط النصاب</p>
            </div>
        </div>
      </SectionCard>
    </SummarySection>
  );
};

export default SchoolStaffSummarySection;