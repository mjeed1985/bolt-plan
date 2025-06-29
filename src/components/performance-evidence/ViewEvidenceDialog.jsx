import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';

const ViewEvidenceDialog = ({ isOpen, onOpenChange, fileToView }) => {
  const safeFileUrl = fileToView ? encodeURI(fileToView.file_url) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl arabic-text bg-card/90 backdrop-blur-md shadow-2xl rounded-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">{fileToView?.file_name}</DialogTitle>
          <DialogDescription>
            معاينة الملف. يمكنك تنزيله من الرابط أدناه.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-1">
          <div className="md:col-span-2">
            {fileToView && safeFileUrl && (
              safeFileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img-replace src={safeFileUrl} alt={`معاينة ${fileToView.file_name}`} className="max-w-full h-auto rounded-md shadow-md border" />
              ) : safeFileUrl.match(/\.pdf$/i) ? (
                <iframe src={safeFileUrl} className="w-full h-[60vh] border rounded-md" title={`معاينة ${fileToView.file_name}`}></iframe>
              ) : (
                <div className="p-6 bg-background rounded-md text-center h-full flex flex-col justify-center items-center">
                  <FileText className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-foreground">لا يمكن عرض معاينة لهذا النوع من الملفات مباشرة.</p>
                  <p className="text-sm text-muted-foreground mt-1">الرجاء تنزيل الملف لعرضه.</p>
                </div>
              )
            )}
          </div>
          <div className="md:col-span-1">
            {fileToView && <QRCodeDisplay url={fileToView.file_url} title={fileToView.barcode_title} />}
          </div>
        </div>
        <DialogFooter className="gap-2">
           <DialogClose asChild>
              <Button type="button" variant="outline">إغلاق</Button>
           </DialogClose>
          {fileToView && safeFileUrl && (
            <a href={safeFileUrl} target="_blank" rel="noopener noreferrer" download={fileToView.file_name}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="ml-2 h-4 w-4" /> تنزيل الملف
              </Button>
            </a>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEvidenceDialog;