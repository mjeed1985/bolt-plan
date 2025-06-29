import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Share2, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

const LetterPreviewDialog = ({ isOpen, onOpenChange, imageDataUrl, letterData, letterType, pageTitle, onLinkGenerated }) => {
    const { toast } = useToast();
    const { user, schoolId } = useAuth();
    const [isSharing, setIsSharing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const previewRef = useRef(null);

    const handleExport = () => {
        if (!previewRef.current) return;
        setIsExporting(true);
        const element = previewRef.current;
        const opt = {
            margin: 0,
            filename: `${letterType}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save().then(() => {
            setIsExporting(false);
            toast({ title: "تم التصدير بنجاح" });
        }).catch(err => {
            console.error(err);
            toast({
                title: "خطأ في التصدير",
                description: "حدث خطأ أثناء تصدير الملف.",
                variant: "destructive"
            });
            setIsExporting(false);
        });
    };
    
    const handleShare = async () => {
        if (!imageDataUrl) {
            toast({ title: "خطأ", description: "لا توجد صورة للمشاركة.", variant: "destructive" });
            return;
        }
        if (!user || !schoolId) {
            toast({ title: "خطأ", description: "معلومات المستخدم أو المدرسة غير متوفرة.", variant: "destructive" });
            return;
        }

        setIsSharing(true);
        try {
            const file = dataURLtoFile(imageDataUrl, `${letterType}_${Date.now()}.png`);
            const filePath = `${schoolId}/shared_letters/${crypto.randomUUID()}.png`;

            const { error: uploadError } = await supabase.storage
                .from('performance-evidence')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('performance-evidence')
                .getPublicUrl(filePath);

            const share_token = crypto.randomUUID();
            const currentDate = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
            const letterFinalName = `${pageTitle}: ${letterData.title} - ${currentDate}`;

            const { data: insertedData, error: dbError } = await supabase
                .from('generated_letters')
                .insert({
                    user_id: user.id,
                    school_id: schoolId,
                    letter_type: letterType,
                    letter_data: {...letterData, name: letterFinalName},
                    image_url: publicUrl,
                    share_token: share_token,
                })
                .select('id')
                .single();
            
            if (dbError) throw dbError;
            if (!insertedData || !insertedData.id) {
                throw new Error("فشل تأكيد حفظ التبليغ في قاعدة البيانات.");
            }
            
            toast({ title: "تم إنشاء رابط المشاركة بنجاح!", variant: "success" });
            onOpenChange(false);
            onLinkGenerated(insertedData.id, letterFinalName, share_token);

        } catch (error) {
            console.error("Sharing error:", error);
            toast({
                title: "خطأ في المشاركة",
                description: error.message || "فشلت عملية إنشاء رابط المشاركة. يرجى المحاولة مرة أخرى.",
                variant: "destructive"
            });
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-2 sm:p-6">
                <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
                    <DialogTitle>معاينة {pageTitle}</DialogTitle>
                    <DialogDescription>
                        تأكد من صحة البيانات قبل الحفظ أو المشاركة. للتصدير بجودة عالية، استخدم زر "تصدير PDF".
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow my-4 overflow-auto border rounded-md bg-gray-100 dark:bg-gray-800 p-2">
                    <div ref={previewRef} className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg">
                        {imageDataUrl ? <img src={imageDataUrl} alt={`معاينة ${pageTitle}`} className="w-full h-full object-contain" /> : <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin"/></div>}
                    </div>
                </div>
                <DialogFooter className="flex-shrink-0 pt-4 gap-2 flex-wrap justify-center sm:justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSharing || isExporting}>إغلاق</Button>
                    <Button onClick={handleExport} disabled={isExporting || isSharing || !imageDataUrl}>
                        {isExporting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Download className="ml-2 h-4 w-4" />}
                        تصدير PDF
                    </Button>
                    {(letterType === 'notification' || letterType === 'bulletin') && (
                        <Button onClick={handleShare} disabled={isSharing || isExporting || !imageDataUrl} className="bg-green-600 hover:bg-green-700 text-white">
                            {isSharing ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Share2 className="ml-2 h-4 w-4" />}
                            مشاركة وحفظ
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LetterPreviewDialog;