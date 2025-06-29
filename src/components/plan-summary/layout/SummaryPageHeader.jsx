import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Settings, Upload, Share2, Menu, X, Loader2 } from 'lucide-react';

const SummaryPageHeader = ({
  planData,
  onToggleSidebar,
  isSidebarOpen,
  onShare,
  onUploadTemplate,
  onPreview,
  onExportPptx,
  isExportingPptx,
  onExportPdf,
  isExportingPdf,
}) => {
  const navigate = useNavigate();

  return (
    <header className="relative z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden text-white hover:bg-white/20"
            >
              <span className="sr-only">Toggle sidebar</span>
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{planData.plan_name}</h1>
              <p className="text-white/70 text-sm">ملخص الخطة التشغيلية للعام: {planData.target_academic_year}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" size="sm" onClick={onShare} className="text-white hover:bg-white/20 hidden sm:flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              مشاركة
            </Button>
            <Button variant="ghost" size="sm" onClick={onUploadTemplate} className="text-white hover:bg-white/20 hidden sm:flex items-center gap-2">
              <Upload className="h-4 w-4" />
              رفع قالب
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreview} className="text-white hover:bg-white/20 hidden md:flex items-center gap-2">
              <Settings className="h-4 w-4" />
              معاينة وتعديل
            </Button>
            <Button onClick={onExportPptx} disabled={isExportingPptx} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white hidden md:flex items-center gap-2">
              {isExportingPptx ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              PPTX
            </Button>
            <Button onClick={onExportPdf} disabled={isExportingPdf} size="sm" className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
              {isExportingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              PDF
            </Button>
            <Button onClick={() => navigate('/operational-plans')} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
              العودة
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SummaryPageHeader;