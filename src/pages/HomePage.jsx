import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, FileText, Users, BookOpen, ShieldCheck, Clock, ListChecks, BarChartHorizontalBig, Star, Users2, CheckCircle, BarChart3, Presentation, FolderKanban as SchoolRecordsIcon, BookCopy as OperationalPlansIcon } from 'lucide-react';
const HomePage = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Calendar,
    title: 'الجدول المدرسي الذكي',
    description: 'إنشاء جداول دراسية متوازنة تلقائياً مع توزيع عادل للمعلمين والحصص.',
    gradient: 'gradient-bg-1',
    path: '/dashboard'
  }, {
    icon: Clock,
    title: 'جدول الانتظار الذكي',
    description: 'توزيع المعلمين المتاحين لتغطية الحصص الشاغرة بكفاءة وعدالة.',
    gradient: 'gradient-bg-2',
    path: '/waiting-schedule'
  }, {
    icon: ShieldCheck,
    title: 'جدول الإشراف الذكي',
    description: 'تنظيم مهام الإشراف اليومي على المعلمين بشكل متوازن ومنظم.',
    gradient: 'gradient-bg-3',
    path: '/supervision-schedule'
  }, {
    icon: FileText,
    title: 'مولد الخطابات الذكي',
    description: 'إنشاء خطابات ونشرات وتبليغات بتنسيق احترافي باستخدام الذكاء الاصطناعي.',
    gradient: 'gradient-bg-4',
    path: '/letters/external'
  }, {
    icon: BarChartHorizontalBig,
    title: 'شواهد الأداء',
    description: 'إدارة وتوثيق شواهد الأداء لمدير المدرسة بسهولة وفعالية.',
    gradient: 'gradient-bg-1',
    path: '/performance-evidence'
  }, {
    icon: BarChart3,
    title: 'قياس رضا المستفيدين',
    description: 'إنشاء استبيانات وتحليل النتائج لقياس رضا الطلاب، المعلمين، وأولياء الأمور.',
    gradient: 'gradient-bg-2',
    path: '/surveys'
  }, {
    icon: Presentation,
    title: 'الاجتماعات المدرسية',
    description: 'تنظيم وإدارة الاجتماعات المدرسية، وتوثيق الحضور والمحاضر بسهولة.',
    gradient: 'gradient-bg-3',
    path: '/school-meetings'
  }, {
    icon: OperationalPlansIcon,
    title: 'الخطط التشغيلية',
    description: 'إنشاء وإدارة الخطط التشغيلية للمدرسة بشكل شامل ومتكامل.',
    gradient: 'gradient-bg-1',
    // Re-using gradient, can be unique
    path: '/operational-plans'
  }, {
    icon: SchoolRecordsIcon,
    title: 'إدارة السجلات المدرسية',
    description: 'نقطة وصول مركزية لإدارة سجلات الاجتماعات وخطط الزيارات الصفية.',
    gradient: 'gradient-bg-4',
    // Consider a unique gradient
    path: '/school-records-hub'
  }];
  const reviews = [{
    stars: 5,
    text: "التطبيق غيّر طريقة شغلنا تمامًا",
    author: "أ. نورة العتيبي - مديرة مدرسة الريادة"
  }, {
    stars: 5,
    text: "وفر وقت وجهد غير طبيعي",
    author: "أ. سارة القحطاني - مديرة مدرسة التميز"
  }, {
    stars: 5,
    text: "كل شي جاهز ومنظم وسهل",
    author: "أ. منيرة السبيعي - مديرة مدرسة الإبداع"
  }, {
    stars: 5,
    text: "حتى المعلمين ارتاحوا منه",
    author: "أ. عبير المطيري - مديرة مدرسة النجاح"
  }, {
    stars: 5,
    text: "أنصح فيه كل مدرسة",
    author: "أ. ريم الدوسري - مديرة مدرسة الأفق"
  }, {
    stars: 5,
    text: "خدمة ممتازة وتواصل سريع",
    author: "أ. هيا الشمري - مديرة مدرسة المستقبل"
  }, {
    stars: 5,
    text: "شكرًا لكم على التحديثات المستمرة",
    author: "أ. لطيفة العنزي - مديرة مدرسة الرواد"
  }, {
    stars: 5,
    text: "نظام متكامل وفوق التوقعات",
    author: "أ. مها الحربي - مديرة مدرسة التفوق"
  }, {
    stars: 5,
    text: "وفّر لنا أرشفة رسمية مرتبة",
    author: "أ. جواهر الغامدي - مديرة مدرسة القمة"
  }, {
    stars: 5,
    text: "جهد عظيم يستحق الدعم",
    author: "أ. العنود الرشيدي - مديرة مدرسة الإنجاز"
  }];
  return <div className="min-h-screen">
      {/* Header */}
      <motion.header initial={{
      y: -100,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      duration: 0.8
    }} className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-bg-1 rounded-xl flex items-center justify-center">
              <ListChecks className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">مساعدك الذكي (يُمناك)</h1>
              <p className="text-sm text-gray-600">School Smart Suite v2</p>
            </div>
          </div>
          <Button onClick={() => navigate('/login')} className="gradient-bg-1 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
            تسجيل الدخول
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 1
        }} className="mb-12">
            <div className="w-32 h-32 gradient-bg-1 rounded-full mx-auto mb-8 flex items-center justify-center animate-float">
              <ListChecks className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 arabic-text">
              مساعدك الذكي (يُمناك)
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto arabic-text leading-relaxed">
              الحل المتكامل لإدارة مدرسية ذكية وفعالة: جداول دراسية، انتظار، إشراف، خطابات، شواهد أداء، استبيانات رضا، واجتماعات مدرسية بكل سهولة واحترافية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/login')} size="lg" className="gradient-bg-1 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg px-8 py-4">
                ابدأ الآن
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300 text-lg px-8 py-4">
                تعرف على المزيد
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div initial={{
          y: 50,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 arabic-text">
              مميزات المنصة المتطورة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto arabic-text">
              أدوات ذكية مصممة خصيصاً لتلبية احتياجات مدرستك وتحقيق أعلى مستويات الكفاءة.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Changed to 3 cols for better fit */}
            {features.map((feature, index) => <motion.div key={index} initial={{
            y: 50,
            opacity: 0
          }} whileInView={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} whileHover={{
            y: -10,
            scale: 1.05
          }} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col" onClick={() => feature.path && navigate(feature.path)}>
                <div className={`w-16 h-16 ${feature.gradient} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center arabic-text">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center arabic-text leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} whileInView={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold gradient-bg-1 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <p className="text-gray-600 arabic-text">مدرسة تعتمد على منصتنا</p>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-bg-2 bg-clip-text text-transparent mb-2">
                  200+
                </div>
                <p className="text-gray-600 arabic-text">جدول ذكي تم إنشاؤه</p>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-bg-3 bg-clip-text text-transparent mb-2">
                  2000+
                </div>
                <p className="text-gray-600 arabic-text">مستند رسمي تم توليده</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.div initial={{
          y: 50,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 arabic-text">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto arabic-text">آراء حقيقية من مدراء مدارس  استفادوا من خدماتنا المتميزة.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => <motion.div key={index} initial={{
            y: 50,
            opacity: 0
          }} whileInView={{
            y: 0,
            opacity: 1
          }} transition={{
            duration: 0.6,
            delay: index * 0.15
          }} viewport={{
            once: true
          }} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(review.stars)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 mb-4 arabic-text leading-relaxed">"{review.text}"</p>
                <p className="text-sm font-semibold text-purple-600 arabic-text">{review.author}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg-1">
        <div className="container mx-auto text-center">
          <motion.div initial={{
          y: 50,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }}>
            <h2 className="text-4xl font-bold text-white mb-6 arabic-text">
              هل أنت جاهز لثورة في إدارة مدرستك؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto arabic-text">
              انضم إلى نخبة المدارس التي اختارت الذكاء والكفاءة مع منصتنا المتكاملة.
            </p>
            <Button onClick={() => navigate('/login')} size="lg" className="bg-white text-purple-700 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg px-8 py-4">
              جرب المنصة مجاناً
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 gradient-bg-1 rounded-lg flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold arabic-text">مساعدك الذكي (يُمناك)</span>
          </div>
          <p className="text-gray-400 arabic-text">
            © {new Date().getFullYear()} مساعدك الذكي (يُمناك). جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>;
};
export default HomePage;