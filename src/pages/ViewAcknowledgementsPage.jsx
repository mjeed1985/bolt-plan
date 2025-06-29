import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users, FileX, ArrowRight, Printer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ViewAcknowledgementsPage = () => {
    const { id: announcementId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    
    const [acknowledgements, setAcknowledgements] = useState([]);
    const [letter, setLetter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (announcementId) {
            const fetchAcknowledgements = async () => {
                setLoading(true);
                try {
                    const { data: letterData, error: letterError } = await supabase
                        .from('generated_letters')
                        .select('letter_data')
                        .eq('id', announcementId)
                        .eq('user_id', user.id)
                        .single();

                    if (letterError || !letterData) throw new Error("لم يتم العثور على التبليغ أو لا تملك صلاحية الوصول.");
                    setLetter(letterData);

                    const { data, error } = await supabase
                        .from('announcement_reads')
                        .select('*')
                        .eq('announcement_id', announcementId)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setAcknowledgements(data);
                } catch (error) {
                    console.error('Error fetching acknowledgements:', error);
                    toast({
                        title: "خطأ",
                        description: error.message || "لم نتمكن من جلب قائمة المطلعين.",
                        variant: "destructive",
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchAcknowledgements();
        }
    }, [announcementId, toast, user, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-8 arabic-text">
            <Card className="max-w-4xl mx-auto printable-area">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center no-print">
                         <Button variant="outline" onClick={() => navigate('/letters/notifications')}>
                            <ArrowRight className="ml-2 h-4 w-4" /> العودة للتبليغات
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="ml-2 h-4 w-4" /> طباعة القائمة
                        </Button>
                    </div>
                    <div className="text-center pt-4">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2">
                            <Users className="w-8 h-8 text-sky-600" />
                            قائمة المطلعين على التبليغ
                        </CardTitle>
                        <CardDescription className="mt-2 text-lg">
                            {letter?.letter_data?.name || '...'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="mt-6">
                    {acknowledgements.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>اسم الموظف</TableHead>
                                    <TableHead>رقم الجوال</TableHead>
                                    <TableHead>تاريخ ووقت الاطلاع</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {acknowledgements.map((ack, index) => (
                                    <TableRow key={ack.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{ack.employee_name}</TableCell>
                                        <TableCell dir="ltr" className="text-right">{ack.phone}</TableCell>
                                        <TableCell>{new Date(ack.created_at).toLocaleString('ar-SA')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-52 text-center text-gray-500">
                           <FileX className="w-16 h-16 mb-4" />
                           <p className="font-semibold text-xl">لم يطلع أحد على هذا التبليغ بعد.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
             <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .printable-area {
                        box-shadow: none !important;
                        border: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ViewAcknowledgementsPage;