import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Info, FileText as FileTextIcon, Home } from 'lucide-react';

const PerformanceEvidenceLanding = ({
  onStartDocumenting,
  onShowImportantInfo,
  onNavigateToDashboard
}) => {
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-200 p-4 sm:p-8 arabic-text">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl p-8 sm:p-12 max-w-2xl text-center relative"
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 150 }} 
          className="mx-auto mb-8 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg"
        >
          <FileTextIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }} 
          className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700 mb-6"
        >
          توثيق شواهد الأداء الوظيفي لمدير المدرسة
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.6 }} 
          className="text-gray-700 text-lg sm:text-xl mb-10 leading-relaxed"
        >
          نظام متكامل لتنظيم وأرشفة شواهد الأداء المدرسية، مما يسهل عليك متابعة التقدم وإبراز إنجازات مدرستك بكل ثقة.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.8 }} 
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={onStartDocumenting} 
            size="lg" 
            className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-lg px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            لننطلق برحلة التميز ونبدأ بتوثيق الشواهد
          </Button>
          <Button 
            onClick={onShowImportantInfo} 
            variant="outline" 
            size="lg" 
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Info className="w-5 h-5" />
            معلومات هامة قبل البدء
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-6"
        >
          <Button
            onClick={onNavigateToDashboard}
            variant="ghost"
            size="lg"
            className="text-gray-600 hover:text-sky-700 hover:bg-sky-50 text-md px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            العودة إلى لوحة التحكم الرئيسية
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5, delay: 1.2 }} 
        className="mt-12 text-center text-gray-600"
      >
        <p className="text-sm">
          مدعوم بأحدث التقنيات لضمان سهولة الاستخدام وأمان البيانات.
        </p>
      </motion.div>
    </div>;
};
export default PerformanceEvidenceLanding;