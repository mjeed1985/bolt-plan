import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Home, Upload } from 'lucide-react';
import TemplateUploadDialog from './TemplateUploadDialog';

const PlanHeader = ({ planId, planName, currentSectionIndex, totalSections, onNavigateHome, onTemplateUploadSuccess }) => {
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {planId ? `تعديل الخطة: ${planName || 'خطة غير مسماة'}` : "إنشاء خطة تشغيلية جديدة"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>رفع قالب الخطة</span>
          </Button>
          <Button
            variant="outline"
            onClick={onNavigateHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </Button>
        </div>
      </header>

      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                القسم {currentSectionIndex + 1} من {totalSections}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <motion.div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <TemplateUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        title="رفع قالب الخطة التشغيلية"
        description="ارفع قالب بصيغة صورة (أفقي) ليتم استخدامه كخلفية عند تصدير الخطة."
<<<<<<< HEAD
        templateType="operational_plan_template_url"
        onTemplateUpload={onTemplateUploadSuccess}
=======
        storagePath="plan_templates"
        dbColumnName="operational_plan_template_url"
        onUploadSuccess={onTemplateUploadSuccess}
        orientation="landscape"
>>>>>>> cd51de4 (initial push)
      />
    </>
  );
};

export default PlanHeader;