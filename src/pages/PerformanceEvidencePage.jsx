import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, Search, Home, XCircle, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

import PerformanceEvidenceLanding from '@/components/performance-evidence/PerformanceEvidenceLanding';
import ImportantInfoDialog from '@/components/performance-evidence/ImportantInfoDialog';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { PERFORMANCE_SECTIONS_CONFIG } from '@/constants/performanceSections';

const PerformanceEvidencePage = () => {
  const { user, schoolId, schoolName } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showImportantInfoDialog, setShowImportantInfoDialog] = useState(false);

  const loadData = useCallback(async () => {
    if (!user || !schoolId) {
      setLoading(false);
      return;
    }
    setLoading(false); 
  }, [user, schoolId]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!schoolId) {
       setLoading(false); 
    } else {
      loadData();
    }
  }, [user, schoolId, navigate, loadData]);


  const filteredSectionsConfig = PERFORMANCE_SECTIONS_CONFIG.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartDocumenting = () => {
    setShowLandingPage(false);
  };

  const handleShowImportantInfo = () => {
    setShowImportantInfoDialog(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-red-900/20 p-8 arabic-text">
        <AlertTriangle className="h-20 w-20 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-3">غير مصرح بالوصول</h1>
        <p className="text-lg text-foreground mb-6 text-center">
          يجب عليك تسجيل الدخول أولاً للوصول إلى هذه الصفحة.
        </p>
        <Button onClick={() => navigate('/login')} className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105">
          تسجيل الدخول
        </Button>
      </div>
    );
  }
  
  if (!schoolId && !loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 dark:bg-orange-900/20 p-8 arabic-text">
            <AlertTriangle className="h-20 w-20 text-orange-500 mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-3">خطأ: معرّف المدرسة غير متوفر</h1>
            <p className="text-lg text-foreground mb-6 text-center max-w-md">
                لا يمكن عرض أو إدارة شواهد الأداء بدون معرّف مدرسة صالح مرتبط بحسابك. يرجى التأكد من أن حسابك مرتبط بمدرسة بشكل صحيح.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-sky-600 hover:bg-sky-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                <Home className="w-5 h-5" /> العودة إلى لوحة التحكم
            </Button>
        </div>
    );
  }

  if (showLandingPage) {
    return (
      <>
        <PerformanceEvidenceLanding 
          onStartDocumenting={handleStartDocumenting}
          onShowImportantInfo={handleShowImportantInfo}
          onNavigateToDashboard={() => navigate('/dashboard')}
        />
        <ImportantInfoDialog 
          isOpen={showImportantInfoDialog} 
          onOpenChange={setShowImportantInfoDialog} 
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background p-8 arabic-text">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-xl text-foreground font-semibold">جاري تحميل...</p>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 arabic-text">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            شواهد الأداء الوظيفي لمدير المدرسة
          </h1>
          <p className="text-muted-foreground text-md">{schoolName || 'مدرستك'}</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ThemeToggle />
          <Button onClick={() => setShowLandingPage(true)} variant="outline">
            <Home className="ml-2 w-4 h-4" /> الواجهة
          </Button>
        </div>
      </header>
      
      <div className="mb-6 relative flex-grow sm:flex-grow-0 w-full sm:w-auto max-w-md">
        <Input
          type="text"
          placeholder="ابحث عن قسم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg w-full arabic-text shadow-sm"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      </div>

      {filteredSectionsConfig.length === 0 && searchTerm !== '' && (
        <Card className="shadow-xl bg-card border-0 mb-6">
          <CardContent className="p-6 text-center">
            <XCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">لا توجد أقسام مطابقة</p>
            <p className="text-muted-foreground">لم يتم العثور على أقسام تطابق مصطلح البحث "{searchTerm}".</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSectionsConfig.map((section, index) => (
          <motion.div
            key={section.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to={`/performance-evidence/${section.id}`} className="block group">
              <Card className={`shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-br ${section.color} text-white rounded-xl overflow-hidden h-full flex flex-col`}>
                <CardHeader className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }} 
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-4 p-3 bg-white/20 rounded-full shadow-inner"
                  >
                    {section.icon}
                  </motion.div>
                  <CardTitle className="text-lg sm:text-xl font-bold leading-tight">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-black/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span>فتح القسم</span>
                    <ClipboardList className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <ImportantInfoDialog 
        isOpen={showImportantInfoDialog} 
        onOpenChange={setShowImportantInfoDialog} 
      />
    </div>
  );
};

export default PerformanceEvidencePage;