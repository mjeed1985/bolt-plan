import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';

const UploadSubItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onUpload, 
  subItemTitle,
  uploading
}) => {
  const [fileToUpload, setFileToUpload] = useState(null);
  const [barcodeTitle, setBarcodeTitle] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileToUpload(file);
      if (!barcodeTitle) {
        setBarcodeTitle(file.name);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileToUpload && barcodeTitle) {
      onUpload(fileToUpload, barcodeTitle);
    }
  };

  const resetState = () => {
    setFileToUpload(null);
    setBarcodeTitle('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetState();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[480px] arabic-text bg-card/90 backdrop-blur-md shadow-2xl rounded-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">رفع شاهد جديد</DialogTitle>
          <DialogDescription>
            {subItemTitle || 'اختر ملفًا لرفعه كشاهد أداء.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="evidence-file" className="text-foreground">ملف الشاهد</Label>
            <div 
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors border-border hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {fileToUpload ? fileToUpload.name : 'اسحب وأفلت الملف هنا، أو انقر للتصفح'}
                </p>
                <p className="text-xs text-muted-foreground">ملفات PDF, DOCX, JPG, PNG (بحد أقصى 10MB)</p>
              </div>
            </div>
            <Input 
              id="evidence-file" 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              className="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <Label htmlFor="barcode-title" className="text-foreground">عنوان العرض للباركود</Label>
            <Input 
              id="barcode-title" 
              type="text" 
              value={barcodeTitle} 
              onChange={(e) => setBarcodeTitle(e.target.value)} 
              placeholder="مثال: قرار تشكيل لجنة الخطة"
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button type="button" onClick={handleUploadClick} disabled={uploading || !fileToUpload || !barcodeTitle.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {uploading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <UploadCloud className="ml-2 h-4 w-4" />}
            {uploading ? 'جاري الرفع...' : 'رفع الملف'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSubItemDialog;