import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X, Download } from 'lucide-react';
import { generatePdf } from '@/components/plan-summary/pdfGenerator';

const EditableField = ({ label, value, onChange, name, type = "text" }) => {
    const Component = type === 'textarea' ? Textarea : Input;
    return (
        <div className="mb-4">
            <Label htmlFor={name} className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</Label>
            <Component
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                className="mt-1 bg-white/80 dark:bg-gray-900/80"
            />
        </div>
    );
};

const PlanPreviewModal = ({ isOpen, onOpenChange, planData: initialPlanData, templateUrl, onSaveChangesSuccess }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [editableData, setEditableData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (initialPlanData) {
            setEditableData(JSON.parse(JSON.stringify(initialPlanData)));
        }
    }, [initialPlanData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!user || !editableData?.id) {
            toast({ title: "خطأ", description: "لا يمكن حفظ التعديلات.", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('operational_plans')
                .update(editableData)
                .eq('id', editableData.id)
                .eq('user_id', user.id);

            if (error) throw error;

            toast({ title: "نجاح", description: "تم حفظ التعديلات بنجاح." });
            onSaveChangesSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving plan:', error);
            toast({ title: "خطأ في الحفظ", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!editableData) return;
        setIsExporting(true);
        try {
            await generatePdf(editableData, templateUrl);
            toast({ title: "تم التصدير بنجاح", description: "تم إنشاء ملف PDF." });
        } catch (error) {
            toast({ title: "خطأ في التصدير", description: error.message, variant: "destructive" });
        } finally {
            setIsExporting(false);
        }
    };

    if (!editableData) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent><div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-sky-600" />
                    <p className="mr-3">جاري تحميل المعاينة...</p>
                </div></DialogContent>
            </Dialog>
        );
    }
    
    const pageStyle = {
        backgroundImage: templateUrl ? `url('${templateUrl}')` : 'none',
        backgroundColor: templateUrl ? 'transparent' : '#ffffff',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: 'rtl',
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 arabic-text">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>معاينة وتعديل الخطة</DialogTitle>
                    <DialogDescription>
                        يمكنك تعديل البيانات مباشرة في النموذج أدناه ثم حفظها أو تصديرها.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-auto p-8 bg-gray-200 dark:bg-gray-900">
                    <div 
                        className="w-[297mm] min-h-[210mm] mx-auto shadow-lg"
                        style={pageStyle}
                    >
                        <div className="bg-background/90 dark:bg-black/80 backdrop-blur-sm p-8 rounded-lg shadow-inner h-full flex flex-col">
                            <h1 className="text-3xl font-bold text-center mb-2 text-sky-800 dark:text-sky-400">
                                الخطة التشغيلية
                            </h1>
                            <h2 className="text-2xl text-center mb-8 text-foreground/80">{editableData.plan_name}</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 flex-grow">
                                <EditableField label="اسم المدرسة الكامل" name="school_name_full" value={editableData.school_name_full} onChange={handleInputChange} />
                                <EditableField label="قائد المدرسة" name="principal_name" value={editableData.principal_name} onChange={handleInputChange} />
                                <EditableField label="العام الدراسي المستهدف" name="target_academic_year" value={editableData.target_academic_year} onChange={handleInputChange} />
                                <EditableField label="الهدف العام للخطة" name="plan_objective" value={editableData.plan_objective} onChange={handleInputChange} />
                                <div className="md:col-span-2">
                                    <EditableField label="رؤية المدرسة" name="school_vision" value={editableData.school_vision} onChange={handleInputChange} type="textarea" />
                                </div>
                                <div className="md:col-span-2">
                                    <EditableField label="رسالة المدرسة" name="school_mission" value={editableData.school_mission} onChange={handleInputChange} type="textarea" />
                                </div>
                                <div className="md:col-span-2">
                                    <EditableField label="فلسفة القائد التعليمية" name="plan_philosophy" value={editableData.plan_philosophy} onChange={handleInputChange} type="textarea" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-4 border-t bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isExporting}>
                        <X className="ml-2 h-4 w-4" />
                        إلغاء
                    </Button>
                    <Button onClick={handleSaveChanges} disabled={isSaving || isExporting} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isSaving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                        حفظ التعديلات
                    </Button>
                    <Button onClick={handleExport} disabled={isSaving || isExporting} className="bg-green-600 hover:bg-green-700 text-white">
                        {isExporting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Download className="ml-2 h-4 w-4" />}
                        تصدير PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanPreviewModal;