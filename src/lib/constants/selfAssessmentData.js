import { Briefcase, GraduationCap, Shield, Users2, Target, HeartHandshake, UserCheck } from 'lucide-react';

export const SELF_ASSESSMENT_DOMAINS = [
  { 
    name: "القيادة والإدارة المدرسية", 
    icon: Briefcase, 
    subDomains: ["التخطيط", "قيادة العملية التعليمية", "التطوير المؤسسي", "مجال الإدارة المدرسية"] 
  },
  { 
    name: "التعليم والتعلم", 
    icon: GraduationCap,
    subDomains: ["بناء خبرات التعلم", "تقويم التعلم", "نواتج التعلم (التحصيل العلمي، المهارات الحياتية)"]
  },
  { name: "البيئة المدرسية", icon: Shield, subDomains: ["المبنى المدرسي", "الأمن والسلامة", "المناخ المدرسي"] },
  { name: "الاتجاهات والسلوك", icon: Users2, subDomains: ["القيم الإسلامية والهوية الوطنية", "السلوك الإيجابي والمواطنة المسؤولة"] },
  { name: "التحصيل الدراسي", icon: Target, subDomains: ["النتائج في المواد الأساسية", "النتائج في الاختبارات الوطنية والدولية"] },
  { name: "الشراكة الأسرية والمجتمعية", icon: HeartHandshake, subDomains: ["تواصل المدرسة مع الأسرة", "تفاعل المدرسة مع المجتمع المحلي"] },
  { name: "الصحة واللياقة العامة", icon: UserCheck, subDomains: ["الصحة البدنية والنفسية", "البرامج الرياضية والأنشطة الصحية"] },
];

export const BENEFICIARY_TYPES = [
  { id: 'students', label: 'الطلاب' },
  { id: 'administrative_staff', label: 'الهيئة الإدارية' },
  { id: 'student_counselor', label: 'الموجه الطلابي' },
  { id: 'parents', label: 'أولياء الأمور' },
  { id: 'activity_leader', label: 'رائد النشاط' },
  { id: 'local_community', label: 'المجتمع المحلي' },
  { id: 'health_counselor', label: 'الموجه الصحي' },
];