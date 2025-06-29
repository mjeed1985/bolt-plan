import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, MessageSquarePlus, BookOpenText, Users, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ParentCommunicationDashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'إجمالي الرسائل المرسلة', value: '1,250', icon: MessageSquarePlus, color: 'text-blue-500', change: '+50 هذا الأسبوع' },
    { title: 'متوسط تفاعل أولياء الأمور', value: '75%', icon: Users, color: 'text-green-500', change: '+5% عن الشهر الماضي' },
    { title: 'أهم المواضيع المتداولة', value: 'الواجبات المنزلية', icon: BookOpenText, color: 'text-purple-500', change: '30 رسالة هذا الأسبوع' },
  ];

  const alerts = [
    { id: 1, studentName: 'أحمد عبدالله', reason: 'لم يتم التواصل مع ولي أمره منذ أسبوعين.', type: 'warning', icon: AlertTriangle },
    { id: 2, studentName: 'فاطمة علي', reason: 'تراجع ملحوظ في المستوى الأكاديمي.', type: 'critical', icon: AlertTriangle },
    { id: 3, studentName: 'خالد محمد', reason: 'تحسن سلوكي ملحوظ، يستحق إشادة.', type: 'positive', icon: CheckCircle2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800 arabic-text">لوحة تحكم التواصل مع أولياء الأمور</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            العودة إلى لوحة التحكم الرئيسية
          </Button>
        </div>
        <p className="text-gray-600 arabic-text">نظرة عامة على أنشطة التواصل والمؤشرات الرئيسية.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-md border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 arabic-text">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800 arabic-text">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1 arabic-text">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg bg-white/80 backdrop-blur-md border-0 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">إنشاء تواصل جديد</CardTitle>
              <CardDescription className="text-gray-600 arabic-text">ابدأ محادثة جديدة مع ولي أمر أو استخدم القوالب الذكية.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link to="/parent-communication/new">
                <Button size="lg" className="w-full gradient-bg-1 text-white hover:opacity-90 transition-opacity duration-300 arabic-text">
                  <MessageSquarePlus className="ml-2 h-5 w-5" /> إنشاء رسالة جديدة
                </Button>
              </Link>
              <p className="text-sm text-gray-500 arabic-text">
                يمكنك الاستفادة من مولّد النصوص بالذكاء الاصطناعي لصياغة رسائل احترافية.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg bg-white/80 backdrop-blur-md border-0 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">إشعارات وتنبيهات ذكية</CardTitle>
              <CardDescription className="text-gray-600 arabic-text">تنبيهات هامة تتطلب انتباهك.</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <ul className="space-y-3">
                  {alerts.map((alert) => (
                    <li key={alert.id} className={`flex items-start p-3 rounded-md border-l-4 ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : 
                      alert.type === 'critical' ? 'bg-red-50 border-red-500' : 
                      'bg-green-50 border-green-500'
                    }`}>
                      <alert.icon className={`h-5 w-5 mt-1 ml-3 flex-shrink-0 ${
                        alert.type === 'warning' ? 'text-yellow-500' : 
                        alert.type === 'critical' ? 'text-red-600' : 
                        'text-green-600'
                      }`} />
                      <div>
                        <p className="font-medium text-sm text-gray-700 arabic-text">{alert.studentName}</p>
                        <p className="text-xs text-gray-600 arabic-text">{alert.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 arabic-text">لا توجد تنبيهات حاليًا.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link to="/parent-communication/log">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-md border-0 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpenText className="h-8 w-8 text-indigo-500" />
                  <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">سجل التواصل الشامل</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 arabic-text">
                  عرض وأرشفة جميع رسائل التواصل مع أولياء الأمور مع إمكانيات فلترة متقدمة.
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/parent-communication/reports">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-md border-0 h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart className="h-8 w-8 text-teal-500" />
                  <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">التقارير والتحليلات</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 arabic-text">
                  إنشاء تقارير دورية وتحليل بيانات التواصل لاستخلاص رؤى قيمة.
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParentCommunicationDashboardPage;