import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { Info, Building, Hash, MapPin, Layers, Book, Users, Phone, Mail, UserCheck, CalendarDays, BookOpen, Target } from 'lucide-react';
import { EDUCATION_DEPARTMENTS, SCHOOL_STAGES, STUDENT_GENDER_TYPES, BUILDING_TYPES, PLAN_NATURES } from '@/lib/operationalPlanConstants';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';

const DetailsSection = ({ planData }) => {
  return (
    <SummarySection id="details" title="تفاصيل الخطة والمدرسة" icon={Info}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard title="معلومات المدرسة الأساسية" icon={<Info />}>
          <InfoItem label="اسم المدرسة" value={planData.school_name_full} icon={<Building />} />
          <InfoItem label="رقم الوزاري" value={planData.ministry_school_id} icon={<Hash />} />
          <InfoItem label="الإدارة التعليمية" value={getDisplayValue(planData.education_department, EDUCATION_DEPARTMENTS)} icon={<MapPin />} />
          <InfoItem label="مكتب التعليم" value={planData.education_office} icon={<MapPin />} />
        </SectionCard>
        <SectionCard title="خصائص المدرسة" icon={<Layers />}>
          <InfoItem label="المرحلة" value={getDisplayValue(planData.school_stage, SCHOOL_STAGES)} icon={<Book />} />
          <InfoItem label="نوع التعليم" value={getDisplayValue(planData.student_gender_type, STUDENT_GENDER_TYPES)} icon={<Users />} />
          <InfoItem label="نوع المبنى" value={getDisplayValue(planData.building_type, BUILDING_TYPES)} icon={<Building />} />
        </SectionCard>
        <SectionCard title="معلومات الاتصال" icon={<Phone />}>
          <InfoItem label="البريد الإلكتروني" value={planData.school_email} icon={<Mail />} />
          <InfoItem label="رقم الهاتف" value={planData.school_phone} icon={<Phone />} />
        </SectionCard>
        <SectionCard title="قيادة المدرسة" icon={<UserCheck />}>
          <InfoItem label="القائد" value={planData.principal_name} icon={<UserCheck />} />
          <InfoItem label="الوكيل" value={planData.deputy_principal_name} icon={<UserCheck />} />
        </SectionCard>
        <SectionCard title="إطار الخطة" icon={<CalendarDays />}>
          <InfoItem label="العام الدراسي" value={planData.target_academic_year} icon={<CalendarDays />} />
          <InfoItem label="طبيعة الخطة" value={getDisplayValue(planData.plan_nature, PLAN_NATURES)} icon={<BookOpen />} />
          {planData.plan_nature === 'multi_year' && <InfoItem label="مدة الخطة متعددة السنوات" value={`${planData.multi_year_plan_duration || 'N/A'} سنوات`} icon={<CalendarDays />} />}
          <InfoItem label="الهدف العام" value={planData.plan_objective} icon={<Target />} />
        </SectionCard>
        <SectionCard title="مقدمة عن المدرسة" icon={<Info />} className="md:col-span-2 xl:col-span-1" contentClassName="p-4">
          <p className="text-gray-700 leading-relaxed text-md">{planData.school_introduction || "لم يتم تحديد مقدمة عن المدرسة."}</p>
        </SectionCard>
      </div>
    </SummarySection>
  );
};

export default DetailsSection;