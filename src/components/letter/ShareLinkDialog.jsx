import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Copy, ExternalLink, Check } from 'lucide-react';

const ShareLinkDialog = ({ isOpen, onOpenChange, announcementUrl }) => {
    const { toast } = useToast();
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(announcementUrl)
            .then(() => {
                toast({ title: "✅ تم نسخ الرابط بنجاح" });
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(() => {
                toast({ title: "❌ فشل نسخ الرابط، انسخه يدوياً", variant: 'destructive' });
            });
    };

    const handleOpen = () => {
        window.open(announcementUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md arabic-text">
                <DialogHeader>
                    <DialogTitle>مشاركة رابط التبليغ</DialogTitle>
                    <DialogDescription>
                        يمكنك نسخ الرابط التالي وإرساله للموظفين للاطلاع على التبليغ.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2 mt-4">
                    <Label htmlFor="share-link">رابط المشاركة</Label>
                    <Input
                        id="share-link"
                        value={announcementUrl}
                        readOnly
                        className="text-left"
                        dir="ltr"
                    />
                </div>
                <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                    <Button onClick={handleOpen} variant="outline" className="w-full sm:w-auto">
                        <ExternalLink className="ml-2 h-4 w-4" /> فتح الرابط
                    </Button>
                    <Button onClick={handleCopy} className="w-full sm:w-auto">
                        {isCopied ? <Check className="ml-2 h-4 w-4" /> : <Copy className="ml-2 h-4 w-4" />}
                        {isCopied ? 'تم النسخ!' : 'نسخ الرابط'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShareLinkDialog;