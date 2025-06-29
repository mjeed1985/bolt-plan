import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight, Users, UserCheck, Library, FileArchive, Building, User2 as UserTie, Home } from 'lucide-react';

const MeetingsLogDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [principalName, setPrincipalName] = useState("مديرة المدرسة"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchSchoolDetails();
    }
  }, [user, navigate]);

  const fetchSchoolDetails = async () => {
    setLoading(true);
    try {
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (schoolError && schoolError.code !== 'PGRST116') throw schoolError;
      setSchoolInfo(schoolData);
      
      // Assuming principal's name might be stored in user's metadata or another table
      // For now, using a placeholder or user's email part
      if (user.user_metadata && user.user_metadata.full_name) {
        setPrincipalName(user.user_metadata.full_name);
      } else {
        setPrincipalName(user.email ? user.email.split('@')[0] : "مديرة المدرسة");
      }

    } catch (error) {
      console.error('Error fetching school details:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { title: "اجتماعات اللجان/الفرق", path: "/meetings-log/committees", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "اجتماعات التخصصات", path: "/meetings-log/specializations", icon: UserCheck, color: "text-green-500", bg: "bg-green-100" },
    { title: "محاضر الاجتماعات الفردية مع المعلمات", path: "/meetings-log/individual", icon: UserTie, color: "text-purple-500", bg: "bg-purple-100" },
    { title: "أرشيف الاجتماعات", path: "/meetings-log/archive", icon: FileArchive, color: "text-gray-500", bg: "bg-gray-100" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل بيانات السجل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 p-4 md:p-8 arabic-text">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-700 text-white shadow-md">
                <Library className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                  سجل الاجتماعات المدرسية
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {schoolInfo ? schoolInfo.name : "اسم المدرسة"} - {principalName}
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex items-center gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50">
              <Home className="w-4 h-4" /> العودة للوحة التحكم الرئيسية
            </Button>
          </CardHeader>
        </Card>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {navigationItems.map((item) => (
          <motion.div key={item.title} variants={itemVariants}>
            <Card 
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 group bg-white/90 backdrop-blur-md border-0 overflow-hidden h-full flex flex-col justify-between hover:border-indigo-300"
            >
              <CardHeader className="flex flex-row items-center justify-start space-x-4 space-x-reverse p-6">
                <div className={`p-4 rounded-xl ${item.bg} transition-colors duration-300 group-hover:bg-opacity-80`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-left">
                 <Button variant="ghost" className="text-indigo-600 group-hover:text-indigo-800 transition-colors duration-300">
                    الانتقال <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300 rtl-flip" />
                 </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MeetingsLogDashboardPage;