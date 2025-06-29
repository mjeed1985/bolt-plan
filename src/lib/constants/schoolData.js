export const SCHOOL_STAGES = [
  { value: 'kindergarten', label: 'رياض أطفال' },
  { value: 'primary', label: 'ابتدائي' },
  { value: 'middle', label: 'متوسط' },
  { value: 'secondary', label: 'ثانوي' },
  { value: 'continuous_education', label: 'تعليم مستمر' },
  { value: 'multiple', label: 'مجمع (يشمل مراحل متعددة)' },
];

export const STUDENT_GENDER_TYPES = [
  { value: 'boys', label: 'بنين' },
  { value: 'girls', label: 'بنات' },
  { value: 'mixed', label: 'مشترك (بنين وبنات)' },
];

export const BUILDING_TYPES = [
  { value: 'governmental_morning', label: 'حكومي صباحي' },
  { value: 'governmental_evening', label: 'حكومي مسائي' },
  { value: 'rented_morning', label: 'مستأجر صباحي' },
  { value: 'rented_evening', label: 'مستأجر مسائي' },
  { value: 'private', label: 'أهلي' },
];

export const PLAN_NATURES = [
  { value: 'annual', label: 'خطة سنوية' },
  { value: 'multi_year', label: 'خطة متعددة السنوات' },
];

export const ACADEMIC_YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const startYear = new Date().getFullYear() - 2 + i;
  const hijriStartYear = 1445 + i;
  return { 
    value: `${startYear}-${startYear + 1}`, 
    label: `${startYear}-${startYear + 1} م / ${hijriStartYear}-${hijriStartYear + 1} هـ` 
  };
});

export const EDUCATION_DEPARTMENTS = [
  { value: 'riyadh', label: 'إدارة تعليم الرياض' },
  { value: 'jeddah', label: 'إدارة تعليم جدة' },
  { value: 'makkah', label: 'إدارة تعليم مكة المكرمة' },
  { value: 'madinah', label: 'إدارة تعليم المدينة المنورة' },
  { value: 'eastern_province', label: 'إدارة تعليم المنطقة الشرقية (الدمام)' },
  { value: 'qassim', label: 'إدارة تعليم القصيم' },
  { value: 'asir', label: 'إدارة تعليم عسير' },
  { value: 'tabuk', label: 'إدارة تعليم تبوك' },
  { value: 'hail', label: 'إدارة تعليم حائل' },
  { value: 'northern_borders', label: 'إدارة تعليم الحدود الشمالية' },
  { value: 'jizan', label: 'إدارة تعليم جازان' },
  { value: 'najran', label: 'إدارة تعليم نجران' },
  { value: 'al_baha', label: 'إدارة تعليم الباحة' },
  { value: 'al_jouf', label: 'إدارة تعليم الجوف' },
  { value: 'taif', label: 'إدارة تعليم الطائف' },
  { value: 'al_ahsa', label: 'إدارة تعليم الأحساء' },
  { value: 'hafr_al_batin', label: 'إدارة تعليم حفر الباطن' },
  { value: 'yanbu', label: 'إدارة تعليم ينبع' },
  { value: 'al_qurayyat', label: 'إدارة تعليم القريات' },
  { value: 'al_lith', label: 'إدارة تعليم الليث' },
  { value: 'al_qunfudah', label: 'إدارة تعليم القنفذة' },
  { value: 'sabya', label: 'إدارة تعليم صبيا' },
  { value: 'mahail_asir', label: 'إدارة تعليم محايل عسير' },
  { value: 'bisha', label: 'إدارة تعليم بيشة' },
  { value: 'al_namas', label: 'إدارة تعليم النماص' },
  { value: 'dawadmi', label: 'إدارة تعليم الدوادمي' },
  { value: 'al_zulfi', label: 'إدارة تعليم الزلفي' },
  { value: 'al_kharj', label: 'إدارة تعليم الخرج' },
  { value: 'al_majmaah', label: 'إدارة تعليم المجمعة' },
  { value: 'wadi_al_dawasir', label: 'إدارة تعليم وادي الدواسر' },
  { value: 'afif', label: 'إدارة تعليم عفيف' },
  { value: 'al_ghat', label: 'إدارة تعليم الغاط' },
  { value: 'al_muzahimiyah', label: 'إدارة تعليم المزاحمية' },
  { value: 'hotat_bani_tamim', label: 'إدارة تعليم حوطة بني تميم والحريق' },
  { value: 'shaqra', label: 'إدارة تعليم شقراء' },
  { value: 'dhurma', label: 'إدارة تعليم ضرما' },
  { value: 'al_qassim_bukayriyah', label: 'إدارة تعليم البكيرية (القصيم)' },
  { value: 'al_qassim_rass', label: 'إدارة تعليم الرس (القصيم)' },
  { value: 'al_qassim_unaizah', label: 'إدارة تعليم عنيزة (القصيم)' },
  { value: 'al_qassim_midhnab', label: 'إدارة تعليم المذنب (القصيم)' },
  { value: 'other', label: 'أخرى (يرجى التحديد)' }
];

export const SCHOOL_FACILITIES_OPTIONS = [
  { id: 'learning_resources', label: 'مصادر تعلم' },
  { id: 'gym', label: 'صالة رياضية' },
  { id: 'computer_lab', label: 'معمل حاسب آلي' },
  { id: 'science_lab', label: 'مختبر علوم' },
  { id: 'prayer_room', label: 'مصلى مستقل' },
  { id: 'art_room', label: 'قاعة تربية فنية' },
  { id: 'library', label: 'مكتبة' },
  { id: 'theater', label: 'مسرح احتفال' },
];

export const FACILITY_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));