import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FolderKanban, Library, Eye, Users, Home, LogOut, ArrowRight } from 'lucide-react';

const SchoolRecordsHubPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schoolInfo, setSchoolInfo] = useState({ name: 'اسم المدرسة (يتم جلبه تلقائياً)', principalName: 'اسم المدير (يتم جلبه تلقائياً)' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSchoolAndPrincipalInfo();
  }, [user, navigate]);

  const fetchSchoolAndPrincipalInfo = async () => {
    setLoading(true);
    try {
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('user_id', user.id)
        .limit(1);

      if (schoolError) throw schoolError;
      
      if (schoolData && schoolData.length > 0) {
        setSchoolInfo({
          name: schoolData[0].name || 'اسم المدرسة (يتم جلبه تلقائياً)',
          principalName: user.user_metadata?.full_name || user.user_metadata?.name || 'اسم المدير (يتم جلبه تلقائياً)'
        });
      }
    } catch (error) {
      console.error('Error fetching school/principal info:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sections = [
    {
      title: "سجل الاجتماعات المدرسية",
      description: "إدارة وتسجيل جميع أنواع الاجتماعات المدرسية، بما في ذلك اجتماعات اللجان، التخصصات، والاجتماعات الفردية.",
      icon: Library,
      path: "/meetings-log",
      color: "text-indigo-500",
      bg: "bg-indigo-100"
    },
    {
      title: "خطة الزيارات الصفية",
      description: "تخطيط، تسجيل، ومتابعة الزيارات الصفية لمدير المدرسة لضمان جودة التعليم وتقديم الدعم للمعلمين.",
      icon: Eye,
      path: "/class-visits",
      color: "text-pink-500",
      bg: "bg-pink-100"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-stone-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-600"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-4 md:p-8 arabic-text">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-tr from-slate-600 to-gray-700 text-white shadow-md">
                <FolderKanban className="w-9 h-9" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                  إدارة السجلات المدرسية
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm mt-1">
                  {schoolInfo.name} - {schoolInfo.principalName}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex items-center gap-2 text-slate-600 border-slate-300 hover:bg-slate-100">
                  <Home className="w-4 h-4" /> العودة للوحة التحكم
                </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sections.map((section) => (
          <motion.div key={section.title} variants={itemVariants} className="h-full">
            <Card 
              onClick={() => navigate(section.path)}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 group bg-white/90 backdrop-blur-md border border-gray-200/80 overflow-hidden h-full flex flex-col justify-between hover:border-gray-300"
            >
              <CardHeader className="p-6">
                <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-lg ${section.bg} transition-colors duration-300 group-hover:bg-opacity-80`}>
                        <section.icon className={`w-8 h-8 ${section.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                        {section.title}
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-left">
                 <Button variant="ghost" className={`${section.color} group-hover:opacity-90 transition-opacity duration-300 font-semibold`}>
                    الذهاب للقسم <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300 rtl-flip" />
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SchoolRecordsHubPage;