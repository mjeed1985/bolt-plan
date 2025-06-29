import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users, FileX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AcknowledgementsDialog = ({ isOpen, onOpenChange, letterId, letterTitle }) => {
    const [acknowledgements, setAcknowledgements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && letterId) {
            const fetchAcknowledgements = async () => {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('letter_acknowledgments')
                        .select('*')
                        .eq('letter_id', letterId)
                        .order('acknowledged_at', { ascending: false });

                    if (error) throw error;
                    setAcknowledgements(data);
                } catch (error) {
                    console.error('Error fetching acknowledgements:', error);
                    toast({
                        title: "خطأ",
                        description: "لم نتمكن من جلب قائمة المطلعين.",
                        variant: "destructive",
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchAcknowledgements();
        }
    }, [isOpen, letterId, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px] arabic-text">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-sky-600" />
                        قائمة المطلعين على التبليغ
                    </DialogTitle>
                    <DialogDescription>
                        {letterTitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                        </div>
                    ) : acknowledgements.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم الموظف</TableHead>
                                    <TableHead>رقم الجوال</TableHead>
                                    <TableHead>تاريخ الاطلاع</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {acknowledgements.map((ack) => (
                                    <TableRow key={ack.id}>
                                        <TableCell className="font-medium">{ack.employee_name}</TableCell>
                                        <TableCell>{ack.employee_phone}</TableCell>
                                        <TableCell>{new Date(ack.acknowledged_at).toLocaleString('ar-SA')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                           <FileX className="w-12 h-12 mb-2" />
                           <p className="font-semibold">لم يطلع أحد على هذا التبليغ بعد.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AcknowledgementsDialog;