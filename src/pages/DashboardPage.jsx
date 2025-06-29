import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, FileText, Users, BarChartHorizontalBig, ListChecks, Settings, LogOut, ShieldCheck, Clock, BarChart3, Bell, Library, Eye, Newspaper, Mail, MessageSquare as MessageSquareText } from 'lucide-react';

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loadingSchoolInfo, setLoadingSchoolInfo] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchSchoolInfo();
    }
  }, [user, navigate]);

  const fetchSchoolInfo = async () => {
    setLoadingSchoolInfo(true);
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('name, stage, school_region, school_id_number')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { 
        throw error;
      }
      setSchoolInfo(data);
    } catch (error) {
      console.error('Error fetching school info:', error);
    } finally {
      setLoadingSchoolInfo(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { title: 'الجدول المدرسي', path: '/schedule', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100' },
    { title: 'جدول الانتظار', path: '/waiting-schedule', icon: Clock, color: 'text-sky-500', bg: 'bg-sky-100' },
    { title: 'جدول الإشراف', path: '/supervision-schedule', icon: ShieldCheck, color: 'text-teal-500', bg: 'bg-teal-100' },
    { title: 'الخطابات الخارجية', path: '/letters/external', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'النشرات الداخلية', path: '/letters/bulletins', icon: Newspaper, color: 'text-green-500', bg: 'bg-green-100' },
    { title: 'التبليغات الإدارية', path: '/letters/notifications', icon: Bell, color: 'text-red-500', bg: 'bg-red-100' },
    { title: 'التواصل مع أولياء الأمور', path: '/parent-communication', icon: MessageSquareText, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { title: 'شواهد الأداء', path: '/performance-evidence', icon: BarChartHorizontalBig, color: 'text-rose-500', bg: 'bg-rose-100' },
    { title: 'قياس رضا المستفيدين', path: '/surveys', icon: BarChart3, color: 'text-lime-500', bg: 'bg-lime-100' },
    { title: 'الخطط التشغيلية', path: '/operational-plans', icon: ListChecks, color: 'text-cyan-500', bg: 'bg-cyan-100' },
    { title: 'سجل الاجتماعات المدرسية', path: '/meetings-log', icon: Library, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { title: 'خطة الزيارات الصفية', path: '/class-visits', icon: Eye, color: 'text-pink-500', bg: 'bg-pink-100' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (loadingSchoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-bg-1 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">
                {schoolInfo ? schoolInfo.name : 'لوحة تحكم يمناك'}
              </h1>
              <p className="text-sm text-gray-600 arabic-text">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-indigo-600" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700">
              <LogOut className="w-4 h-4" /> تسجيل الخروج
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {!schoolInfo && (
          <motion.div
            variants={itemVariants}
            className="mb-8 p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-md"
          >
            <h2 className="text-lg font-semibold mb-2 arabic-text">استكمال بيانات المدرسة</h2>
            <p className="arabic-text">
              يرجى استكمال بيانات المدرسة للاستفادة الكاملة من جميع مزايا المنصة. يمكنك إضافة معلومات المدرسة من <Button variant="link" className="p-0 h-auto text-yellow-700 hover:text-yellow-800 arabic-text" onClick={() => navigate('/settings')}>صفحة الإعدادات</Button>.
            </p>
          </motion.div>
        )}
        
        {schoolInfo && (
           <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold arabic-text">{schoolInfo.name}</CardTitle>
                    <CardDescription className="text-indigo-100 arabic-text mt-1">
                      {schoolInfo.stage} - {schoolInfo.school_region || 'لم يحدد'} - رقم المدرسة: {schoolInfo.school_id_number || 'غير مسجل'}
                    </CardDescription>
                  </div>
                  <GraduationCap className="w-12 h-12 text-indigo-200 opacity-70" />
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card 
                onClick={() => navigate(item.path)}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 group bg-white/70 backdrop-blur-md border-0 overflow-hidden h-full flex flex-col"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                  <div className={`p-3 rounded-lg ${item.bg} transition-colors duration-300 group-hover:bg-opacity-80`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4 pt-0">
                  <CardTitle className="text-md font-semibold mb-1 text-gray-800 arabic-text group-hover:text-indigo-600 transition-colors duration-300">{item.title}</CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;