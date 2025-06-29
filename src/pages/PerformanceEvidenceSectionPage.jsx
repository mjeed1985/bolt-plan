import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, Search, Home, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PERFORMANCE_SECTIONS_CONFIG } from '@/pages/PerformanceEvidencePage';
import { SUB_ITEMS_CONFIG } from '@/lib/performanceEvidenceSubItems';
import SubItemCard from '@/components/performance-evidence/SubItemCard';
import UploadSubItemDialog from '@/components/performance-evidence/UploadSubItemDialog';
import ViewEvidenceDialog from '@/components/performance-evidence/ViewEvidenceDialog';
import ThemeToggle from '@/components/ui/ThemeToggle';

const sanitizeFileName = (fileName) => {
  const decodedFileName = decodeURIComponent(fileName.trim());
  let sanitized = decodedFileName.replace(/\s+/g, '_');
  sanitized = sanitized.replace(/[^a-zA-Z0-9_.-]/g, '');
  sanitized = sanitized.replace(/\.\.+/g, '.');
  sanitized = sanitized.replace(/^\.|\.$/g, '');
  
  const lowerCaseName = sanitized.toLowerCase();
  if (lowerCaseName.endsWith('.png.png')) return sanitized.slice(0, -4);
  if (lowerCaseName.endsWith('.jpg.jpg')) return sanitized.slice(0, -4);
  if (lowerCaseName.endsWith('.jpeg.jpeg')) return sanitized.slice(0, -5);
  if (lowerCaseName.endsWith('.pdf.pdf')) return sanitized.slice(0, -4);

  if (!sanitized.split('.')[0]) {
    const ext = sanitized.split('.').pop();
    return `file_${Date.now()}.${ext}`;
  }

  return sanitized;
};

const PerformanceEvidenceSectionPage = () => {
  const { sectionId } = useParams();
  const { user, schoolId, schoolName } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [evidenceMap, setEvidenceMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedSubItemId, setSelectedSubItemId] = useState(null);

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [fileToView, setFileToView] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  const currentSectionConfig = PERFORMANCE_SECTIONS_CONFIG.find(s => s.id.toString() === sectionId);
  const currentSubItemsConfig = SUB_ITEMS_CONFIG.find(s => s.sectionId.toString() === sectionId);

  const loadEvidence = useCallback(async () => {
    if (!user || !schoolId || !currentSectionConfig) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('performance_evidence_sub_items')
        .select('*')
        .eq('school_id', schoolId)
        .eq('section_id', currentSectionConfig.id.toString());

      if (error) throw error;

      const newEvidenceMap = new Map();
      data.forEach(item => {
        newEvidenceMap.set(item.sub_item_id, item);
      });
      setEvidenceMap(newEvidenceMap);

    } catch (error) {
      console.error('Error loading section evidence:', error);
      toast({ title: 'خطأ في تحميل شواهد القسم', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, schoolId, currentSectionConfig, toast]);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (!schoolId) setLoading(false);
    else if (!currentSectionConfig) {
      toast({ title: 'قسم غير صالح', description: 'لم يتم العثور على تفاصيل هذا القسم.', variant: 'destructive' });
      navigate('/performance-evidence');
    } else {
      loadEvidence();
    }
  }, [user, schoolId, navigate, loadEvidence, currentSectionConfig, toast]);

  const handleUpload = async (file, barcodeTitle) => {
    if (!file || !barcodeTitle || !selectedSubItemId || !user || !schoolId || !currentSectionConfig) return;
    setUploading(true);
    try {
      const sanitizedName = sanitizeFileName(file.name);
      const filePath = `${schoolId}/performance_evidence/section_${sectionId}/${selectedSubItemId}_${Date.now()}_${sanitizedName}`;
      const { error: uploadError } = await supabase.storage.from('performance-evidence').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('performance-evidence').getPublicUrl(filePath);
      
      const newEvidence = {
        school_id: schoolId,
        user_id: user.id,
        section_id: sectionId,
        sub_item_id: selectedSubItemId,
        file_name: sanitizedName,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        barcode_title: barcodeTitle,
      };

      const { data, error: dbError } = await supabase
        .from('performance_evidence_sub_items')
        .insert(newEvidence)
        .select()
        .single();

      if (dbError) throw dbError;

      setEvidenceMap(prev => new Map(prev).set(selectedSubItemId, data));
      toast({ title: 'تم رفع الملف بنجاح' });
      setShowUploadDialog(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ title: 'خطأ في رفع الملف', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الشاهد؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    setLoading(true);
    try {
      const { error: storageError } = await supabase.storage.from('performance-evidence').remove([filePath]);
      if (storageError) console.warn("Storage deletion warning:", storageError.message);

      const { error: dbError } = await supabase.from('performance_evidence_sub_items').delete().eq('id', id);
      if (dbError) throw dbError;

      await loadEvidence();
      toast({ title: 'تم حذف الشاهد بنجاح' });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({ title: 'خطأ في حذف الشاهد', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openUploadDialog = (subItemId) => {
    setSelectedSubItemId(subItemId);
    setShowUploadDialog(true);
  };

  const openViewDialog = (file) => {
    setFileToView(file);
    setShowViewDialog(true);
  };

  const filteredSubItems = currentSubItemsConfig?.subItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || (!schoolId && !loading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 arabic-text">
        <AlertTriangle className="h-20 w-20 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-destructive mb-3">خطأ في الوصول</h1>
        <p className="text-lg text-foreground mb-6 text-center">
          { !user ? 'يجب عليك تسجيل الدخول أولاً.' : 'معرّف المدرسة غير متوفر.'}
        </p>
        <Button onClick={() => navigate(user ? '/dashboard' : '/login')}>
          {user ? 'العودة للوحة التحكم' : 'تسجيل الدخول'}
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!currentSectionConfig || !currentSubItemsConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 arabic-text">
        <XCircle className="h-16 w-16 text-destructive animate-pulse mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-4">خطأ</h1>
        <p className="text-lg text-foreground mb-6">لم يتم العثور على قسم شواهد الأداء المطلوب.</p>
        <Button onClick={() => navigate('/performance-evidence')}>
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة إلى شواهد الأداء
        </Button>
      </div>
    );
  }

  const selectedSubItemForDialog = currentSubItemsConfig.subItems.find(si => si.id === selectedSubItemId);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 arabic-text">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button onClick={() => navigate('/performance-evidence')} variant="outline" className="self-start">
              <ArrowRight className="ml-2 w-4 h-4" /> العودة لقائمة الأقسام
            </Button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className={`p-4 rounded-xl shadow-lg bg-gradient-to-br ${currentSectionConfig.color}`}>
              {React.cloneElement(currentSectionConfig.icon, { className: "w-8 h-8 text-white" })}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {currentSectionConfig.title}
              </h1>
              <p className="text-muted-foreground text-md">{schoolName || 'مدرستك'}</p>
            </div>
          </div>
        </header>

        <div className="mb-6 relative max-w-md">
          <Input
            type="text"
            placeholder="ابحث في الشواهد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg w-full arabic-text shadow-sm"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSubItems.map(subItem => (
            <SubItemCard
              key={subItem.id}
              subItem={subItem}
              evidence={evidenceMap.get(subItem.id)}
              onUpload={openUploadDialog}
              onView={openViewDialog}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredSubItems.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl font-semibold">لا توجد نتائج مطابقة للبحث.</p>
        </div>
      )}

      <UploadSubItemDialog
        isOpen={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUpload}
        subItemTitle={selectedSubItemForDialog?.title}
        uploading={uploading}
      />

      <ViewEvidenceDialog
        isOpen={showViewDialog}
        onOpenChange={setShowViewDialog}
        fileToView={fileToView}
      />
    </div>
  );
};

export default PerformanceEvidenceSectionPage;