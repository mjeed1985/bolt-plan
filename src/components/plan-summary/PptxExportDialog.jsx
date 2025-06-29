import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileImage } from 'lucide-react';

const PptxExportDialog = ({ isOpen, onOpenChange, onConfirmExport, previewImageUrl }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] arabic-text">
        <DialogHeader>
          <DialogTitle className="text-sky-700 text-xl">معاينة قالب PowerPoint</DialogTitle>
          <DialogDescription>
            سيتم استخدام هذا القالب كخلفية لشرائح العرض التقديمي. هل ترغب بالمتابعة؟
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex justify-center">
          {previewImageUrl ? (
            <img src={previewImageUrl} alt="معاينة قالب PowerPoint" className="rounded-md shadow-lg max-h-[300px] object-contain border border-sky-200" />
          ) : (
            <div className="h-[200px] w-full bg-gray-100 flex flex-col items-center justify-center rounded-md">
              <FileImage className="h-16 w-16 text-gray-400" />
              <p className="mt-2 text-gray-500">لا يوجد قالب مخصص. سيتم استخدام خلفية افتراضية.</p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:justify-start">
          <Button type="button" onClick={onConfirmExport} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="ml-2 h-4 w-4" />
            تأكيد التصدير
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PptxExportDialog;