import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, X } from 'lucide-react';

<<<<<<< HEAD
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
=======
const cleanFileName = (fileName) => {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    const ext = parts.pop();
    const name = parts.join('.');
    const cleanedName = name.replace(new RegExp(`\\.${ext}$`, 'i'), '');
    return `${cleanedName}.${ext}`;
  }
  return fileName;
>>>>>>> cd51de4 (initial push)
};

const TemplateUploadDialog = ({ isOpen, onOpenChange, onTemplateUpload, templateType, schoolId, title, description }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "ملف غير صالح",
        description: "يرجى اختيار ملف بصيغة PNG أو JPG.",
        variant: "destructive",
      });
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !schoolId || !templateType) {
      toast({
        title: "معلومات ناقصة",
        description: "لا يمكن رفع الملف. يرجى التأكد من اختيار ملف وتسجيل الدخول.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
<<<<<<< HEAD
    const cleanedName = sanitizeFileName(selectedFile.name);
=======
    const cleanedName = cleanFileName(selectedFile.name);
>>>>>>> cd51de4 (initial push)
    const fileName = `${Date.now()}_${cleanedName}`;
    const filePath = `${schoolId}/letter_templates/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('performance-evidence')
<<<<<<< HEAD
        .upload(filePath, selectedFile, {
            upsert: true,
        });
=======
        .upload(filePath, selectedFile);
>>>>>>> cd51de4 (initial push)

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('performance-evidence')
        .getPublicUrl(filePath);

      if (!publicUrl) throw new Error("Could not get public URL for the uploaded file.");
<<<<<<< HEAD
      
      const fullPublicUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: dbError } = await supabase
        .from('schools')
        .update({ [templateType]: fullPublicUrl })
=======

      const { error: dbError } = await supabase
        .from('schools')
        .update({ [templateType]: publicUrl })
>>>>>>> cd51de4 (initial push)
        .eq('id', schoolId);

      if (dbError) throw dbError;

      toast({
        title: "نجاح",
        description: "تم رفع القالب بنجاح.",
      });
<<<<<<< HEAD
      onTemplateUpload(fullPublicUrl);
=======
      onTemplateUpload(publicUrl);
>>>>>>> cd51de4 (initial push)
      handleClose();
    } catch (error) {
      console.error('Error uploading template:', error);
      toast({
        title: "خطأ في الرفع",
        description: error.message || "فشل رفع القالب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px] arabic-text">
        <DialogHeader>
          <DialogTitle className="text-xl">{title || 'رفع قالب رسمي'}</DialogTitle>
          <DialogDescription>
            {description || 'اختر ملف صورة (PNG, JPG) لاستخدامه كقالب. سيتم تطبيقه على المستندات المصدرة.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {preview ? (
            <div className="relative group w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center">
              <img src={preview} alt="معاينة القالب" className="max-h-full max-w-full object-contain rounded-md" />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={triggerFileSelect}
              className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">انقر هنا لاختيار ملف</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG (بحد أقصى 5 ميجا)</p>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isUploading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="ml-2 h-4 w-4" />
            )}
            {isUploading ? 'جاري الرفع...' : 'رفع وتعيين كقالب'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUploadDialog;