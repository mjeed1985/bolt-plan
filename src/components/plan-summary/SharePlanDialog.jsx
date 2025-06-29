import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check, Share2, QrCode } from 'lucide-react';
import QRCode from 'qrcode.react';

const SharePlanDialog = ({ isOpen, onOpenChange, planId, isShared, onShareStateChange }) => {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/operational-plans/view/${planId}`;

    const handleEnableSharing = async () => {
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('operational_plans')
                .update({ is_shared: true })
                .eq('id', planId);

            if (error) throw error;

            toast({ title: "نجاح", description: "تم تفعيل المشاركة. الرابط الآن فعال." });
            onShareStateChange(true);
        } catch (error) {
            console.error('Error enabling sharing:', error);
            toast({ title: "خطأ", description: "لم يتم تفعيل المشاركة.", variant: "destructive" });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({ title: "تم النسخ", description: "تم نسخ الرابط إلى الحافظة." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] arabic-text" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        مشاركة ملخص الخطة
                    </DialogTitle>
                    <DialogDescription>
                        شارك هذا الرابط أو الباركود مع المشرفين للاطلاع على ملخص الخطة.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isShared ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-white rounded-lg border">
                                <QRCode value={shareUrl} size={192} level="H" />
                            </div>
                            <p className="text-sm text-center text-muted-foreground">
                                امسح الباركود أو انسخ الرابط أدناه لمشاركته.
                            </p>
                            <div className="w-full flex items-center space-x-2 dir-ltr">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-grow p-2 border rounded-md bg-muted text-sm"
                                />
                                <Button size="icon" onClick={handleCopyToClipboard}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <QrCode className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                            <p className="mb-4 text-muted-foreground">
                                يجب تفعيل المشاركة أولاً لجعل الرابط والباركود فعالين.
                            </p>
                            <Button onClick={handleEnableSharing} disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Share2 className="ml-2 h-4 w-4" />}
                                تفعيل المشاركة العامة
                            </Button>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>إغلاق</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SharePlanDialog;