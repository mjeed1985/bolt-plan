import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';

const UploadEvidenceDialog = ({ 
  isOpen, 
  onOpenChange, 
  onFileChange, 
  onUpload, 
  fileName, 
  setFileName, 
  fileToUpload,
  setFileToUpload,
  uploading,
  fileInputRef
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setFileToUpload(null);
        setFileName('');
      }
    }}>
      <DialogContent className="sm:max-w-[480px] arabic-text bg-white/90 backdrop-blur-md shadow-2xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-700">رفع شاهد جديد</DialogTitle>
          <DialogDescription>
            اختر ملفًا لرفعه كشاهد أداء للقسم المحدد.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="evidence-file" className="text-gray-700">ملف الشاهد</Label>
            <div 
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-sky-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {fileToUpload ? fileToUpload.name : 'اسحب وأفلت الملف هنا، أو انقر للتصفح'}
                </p>
                <p className="text-xs text-gray-500">ملفات PDF, DOCX, XLSX, PPTX, JPG, PNG (بحد أقصى 10MB)</p>
              </div>
            </div>
            <Input 
              id="evidence-file" 
              type="file" 
              ref={fileInputRef}
              onChange={onFileChange} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <Label htmlFor="file-name" className="text-gray-700">اسم العرض للملف (اختياري)</Label>
            <Input 
              id="file-name" 
              type="text" 
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)} 
              placeholder="اتركه فارغًا لاستخدام اسم الملف الأصلي"
              className="mt-1 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => {onOpenChange(false); setFileToUpload(null); setFileName('');}}>
            إلغاء
          </Button>
          <Button type="button" onClick={onUpload} disabled={uploading || !fileToUpload} className="bg-sky-600 hover:bg-sky-700 text-white">
            {uploading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <UploadCloud className="ml-2 h-4 w-4" />}
            {uploading ? 'جاري الرفع...' : 'رفع الملف'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadEvidenceDialog;