export const PROGRAM_OR_INITIATIVE_TYPES = [
  { value: 'program', label: 'برنامج' },
  { value: 'initiative', label: 'مبادرة' },
];

export const SUGGESTED_PROGRAMS = [
  { value: 'teacher_training_excellence', label: 'برنامج تدريب المعلمين للتميز التربوي' },
  { value: 'student_academic_support', label: 'برنامج الدعم الأكاديمي للطلاب (متفوقين ومتعثرين)' },
  { value: 'digital_literacy_enhancement', label: 'برنامج تعزيز المهارات الرقمية للطلاب والمعلمين' },
  { value: 'school_community_engagement', label: 'برنامج تفعيل الشراكة المجتمعية المدرسية' },
  { value: 'stem_innovation_program', label: 'برنامج الابتكار في العلوم والتكنولوجيا والهندسة والرياضيات (STEM)' },
  { value: 'leadership_development_students', label: 'برنامج تطوير القيادات الطلابية الشابة' },
  { value: 'environmental_sustainability_edu', label: 'برنامج التثقيف والتطبيق للاستدامة البيئية' },
  { value: 'other', label: 'برنامج آخر (حدد الاسم)' },
];

export const SUGGESTED_INITIATIVES = [
  { value: 'reading_challenge_schoolwide', label: 'مبادرة تحدي القراءة على مستوى المدرسة' },
  { value: 'coding_club_establishment', label: 'مبادرة تأسيس نادي البرمجة للناشئين' },
  { value: 'mental_health_awareness_week', label: 'مبادرة أسبوع التوعية بالصحة النفسية' },
  { value: 'school_garden_project', label: 'مبادرة مشروع حديقة المدرسة التعليمية' },
  { value: 'peer_tutoring_network', label: 'مبادرة شبكة تعليم الأقران الداعمة' },
  { value: 'career_exploration_days', label: 'مبادرة أيام استكشاف المسارات المهنية' },
  { value: 'anti_bullying_campaign', label: 'مبادرة حملة "مدرستي آمنة" لمكافحة التنمر' },
  { value: 'other', label: 'مبادرة أخرى (حدد الاسم)' },
];

export const RESPONSIBLE_PARTIES_OPTIONS = [
  { value: 'school_management', label: 'إدارة المدرسة' },
  { value: 'academic_affairs_dept', label: 'قسم الشؤون التعليمية' },
  { value: 'student_counselor', label: 'المرشد الطلابي' },
  { value: 'activity_committee', label: 'لجنة النشاط' },
  { value: 'subject_teachers_team', label: 'فريق معلمي المواد' },
  { value: 'administrative_staff', label: 'الكادر الإداري' },
  { value: 'student_council', label: 'المجلس الطلابي' },
  { value: 'parent_teacher_association', label: 'مجلس الآباء والمعلمين' },
  { value: 'external_partners', label: 'شركاء خارجيون (مؤسسات/متطوعون)' },
  { value: 'other', label: 'جهة أخرى (حدد)' },
];

export const KPI_PROGRAM_OPTIONS = [
  { value: 'completion_rate_80', label: 'نسبة إكمال البرنامج من قبل المشاركين (80% فأكثر)' },
  { value: 'skill_improvement_25', label: 'تحسن مهارات المشاركين بنسبة 25% (وفقًا لتقييم قبلي/بعدي)' },
  { value: 'satisfaction_rate_90', label: 'نسبة رضا المشاركين عن محتوى البرنامج (90% فأكثر)' },
  { value: 'projects_submitted_10', label: 'عدد المشاريع أو المخرجات المقدمة نتيجة البرنامج (10 فأكثر)' },
  { value: 'other', label: 'مؤشر آخر (حدد)' },
];

export const KPI_INITIATIVE_OPTIONS = [
  { value: 'participation_rate_50_students', label: 'مشاركة 50 طالبًا على الأقل في المبادرة' },
  { value: 'awareness_increase_30', label: 'زيادة الوعي بالقضية المستهدفة بنسبة 30% بين الفئة المستهدفة' },
  { value: 'successful_events_3', label: 'تنفيذ 3 فعاليات ناجحة ضمن إطار المبادرة' },
  { value: 'community_impact_positive_feedback', label: 'تحقيق أثر مجتمعي إيجابي (وفقًا للتغذية الراجعة)' },
  { value: 'other', label: 'مؤشر آخر (حدد)' },
];


export const DURATION_PROGRAM_OPTIONS = [
  { value: 'one_semester', label: 'فصل دراسي واحد' },
  { value: 'full_academic_year', label: 'عام دراسي كامل' },
  { value: 'intensive_2_weeks', label: 'برنامج مكثف لمدة أسبوعين' },
  { value: 'monthly_workshops_6_months', label: 'ورش عمل شهرية لمدة 6 أشهر' },
  { value: 'other', label: 'مدة أخرى (حدد)' },
];

export const DURATION_INITIATIVE_OPTIONS = [
  { value: 'one_week_campaign', label: 'حملة لمدة أسبوع واحد' },
  { value: 'monthly_event_semester', label: 'فعالية شهرية على مدار فصل دراسي' },
  { value: 'ongoing_throughout_year', label: 'مستمرة على مدار العام (بفعاليات متقطعة)' },
  { value: 'short_term_project_1_month', label: 'مشروع قصير الأمد (شهر واحد)' },
  { value: 'other', label: 'مدة أخرى (حدد)' },
];

export const RESOURCES_SUGGESTIONS = {
  // General resources, can be expanded based on program/initiative type
  default: [
    { name: 'كوادر بشرية (معلمين/إداريين/متطوعين)', selected: false },
    { name: 'ميزانية مخصصة (مواد، ضيافة، مكافآت)', selected: false },
    { name: 'قاعات أو مساحات مجهزة (فصول، مختبرات، مسرح)', selected: false },
    { name: 'تجهيزات تقنية (حواسيب، أجهزة عرض، إنترنت)', selected: false },
    { name: 'مواد تعليمية أو تدريبية (كتيبات، عروض تقديمية)', selected: false },
    { name: 'أدوات ومعدات خاصة بالنشاط', selected: false },
    { name: 'وسائل نقل (إذا تطلب الأمر)', selected: false },
    { name: 'دعم لوجستي (تصاريح، تنسيق)', selected: false },
  ],
  teacher_training_excellence: [
    { name: 'مدربون خبراء ومواد تدريبية متخصصة', selected: true },
    { name: 'منصات تدريب إلكترونية', selected: false },
  ],
  student_academic_support: [
    { name: 'معلمون إضافيون أو متخصصون في الدعم', selected: true },
    { name: 'مواد تعليمية إثرائية أو علاجية', selected: true },
  ],
  digital_literacy_enhancement: [
    { name: 'برمجيات وتطبيقات تعليمية حديثة', selected: true },
    { name: 'أجهزة لوحية أو حواسيب شخصية', selected: true },
  ],
  // Add more specific suggestions for other programs/initiatives
};

export const CHALLENGES_SUGGESTIONS = {
  default: [
    { name: 'ضعف إقبال الفئة المستهدفة', selected: false },
    { name: 'محدودية الميزانية المتاحة', selected: false },
    { name: 'نقص الكوادر المتخصصة أو المتفرغة للتنفيذ', selected: false },
    { name: 'صعوبة التنسيق بين الجهات المختلفة', selected: false },
    { name: 'تحديات تقنية (ضعف الإنترنت، نقص الأجهزة)', selected: false },
    { name: 'مقاومة التغيير من بعض المعنيين', selected: false },
    { name: 'ضيق الوقت المتاح للتنفيذ مع الالتزامات الأخرى', selected: false },
    { name: 'صعوبة قياس الأثر بشكل دقيق', selected: false },
  ],
  // Add more specific suggestions
};

export const COMMUNICATION_METHODS_OPTIONS = [
  { id: 'internal_meetings', label: 'اجتماعات دورية مع فريق العمل' },
  { id: 'school_broadcast', label: ' الإذاعة المدرسية والإعلانات الداخلية' },
  { id: 'social_media_school_accounts', label: 'حسابات المدرسة على وسائل التواصل الاجتماعي' },
  { id: 'official_website_news', label: 'الموقع الرسمي للمدرسة (قسم الأخبار)' },
  { id: 'sms_parent_notifications', label: 'رسائل نصية لأولياء الأمور' },
  { id: 'email_newsletters', label: 'نشرات بريدية للكادر وأولياء الأمور' },
  { id: 'awareness_workshops_seminars', label: 'ورش عمل وندوات توعوية' },
  { id: 'printed_materials_brochures', label: 'مواد مطبوعة (ملصقات، كتيبات)' },
  { id: 'local_media_collaboration', label: 'التعاون مع وسائل الإعلام المحلية (إذا أمكن)' },
  { id: 'student_ambassadors_program', label: 'برنامج سفراء طلابيين للترويج' },
];

export const generateContingencyPlan = (selectedChallenges = []) => {
  if (selectedChallenges.length === 0) {
    return "لم يتم تحديد تحديات رئيسية، ولكن يجب وضع خطط استباقية لضمان سير العمل بسلاسة.";
  }
  let plan = "للتغلب على التحديات المتوقعة، سيتم اتخاذ الإجراءات التالية:\n";
  if (selectedChallenges.some(c => c.name.includes('إقبال'))) {
    plan += "- تكثيف الحملات الترويجية واستخدام قنوات تواصل متنوعة لزيادة الوعي وجذب المشاركين.\n";
  }
  if (selectedChallenges.some(c => c.name.includes('ميزانية'))) {
    plan += "- البحث عن مصادر تمويل بديلة أو رعاة، وترشيد النفقات قدر الإمكان.\n";
  }
  if (selectedChallenges.some(c => c.name.includes('كوادر'))) {
    plan += "- تدريب الكوادر المتاحة أو الاستعانة بمتطوعين أو خبراء خارجيين.\n";
  }
  if (selectedChallenges.some(c => c.name.includes('تنسيق'))) {
    plan += "- عقد اجتماعات تنسيقية دورية وتحديد نقاط اتصال واضحة بين الجهات.\n";
  }
  if (selectedChallenges.some(c => c.name.includes('تقنية'))) {
    plan += "- توفير دعم فني سريع، وإعداد خطط بديلة للعمل في حال انقطاع الخدمات التقنية.\n";
  }
  plan += "- مراجعة الخطة بشكل دوري وتكييفها مع المستجدات لضمان تحقيق الأهداف.";
  return plan;
};