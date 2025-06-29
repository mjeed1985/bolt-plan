import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle, Send, User, Phone } from 'lucide-react';

const ViewSharedLetterPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [letter, setLetter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submission, setSubmission] = useState({
        acknowledged: false,
        employeeName: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchLetter = async () => {
            if (!token) {
                setError("رابط غير صالح.");
                setLoading(false);
                return;
            }

            try {
                const { data, error: fetchError } = await supabase
                    .from('generated_letters')
                    .select('*')
                    .eq('share_token', token)
                    .single();

                if (fetchError || !data) {
                    throw new Error("لم يتم العثور على التبليغ أو أن الرابط غير صحيح.");
                }
                setLetter(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLetter();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubmission(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked) => {
        setSubmission(prev => ({ ...prev, acknowledged: checked }));
    };

    const isFormValid = useMemo(() => {
        const isNameValid = /^[\u0600-\u06FF\s]{2,}$/.test(submission.employeeName);
        const isPhoneValid = /^[0-9]{10}$/.test(submission.phone);
        return submission.acknowledged && isNameValid && isPhoneValid;
    }, [submission]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            toast({
                title: "بيانات غير مكتملة",
                description: "يرجى تعبئة جميع الحقول بشكل صحيح.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error: submitError } = await supabase
                .from('announcement_reads')
                .insert({
                    announcement_id: letter.id,
                    employee_name: submission.employeeName,
                    phone: submission.phone,
                    acknowledged: submission.acknowledged,
                });
            if (submitError) throw submitError;

            setSubmitted(true);
            toast({
                title: "تم الإرسال بنجاح",
                description: "شكراً لك، تم تسجيل اطلاعك على التبليغ.",
            });
        } catch (err) {
            console.error("Submission error:", err);
            toast({
                title: "خطأ في الإرسال",
                description: "حدث خطأ ما، يرجى المحاولة مرة أخرى.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 arabic-text">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
                <p className="ml-4 text-xl">جاري تحميل التبليغ...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-700 p-4 arabic-text">
                <AlertTriangle className="h-16 w-16 mb-4" />
                <h1 className="text-2xl font-bold">حدث خطأ</h1>
                <p className="mt-2">{error}</p>
                <Button onClick={() => navigate('/')} className="mt-6 bg-sky-600 hover:bg-sky-700">العودة للرئيسية</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-center arabic-text">
            <main className="w-full max-w-4xl">
                 <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-xl sm:text-2xl text-sky-700 dark:text-sky-400">
                            {letter.letter_data.name || 'تبليغ إداري'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="border rounded-lg overflow-hidden shadow-inner bg-gray-200">
                            <img src={letter.image_url} alt="صورة التبليغ" className="w-full h-auto" />
                        </div>

                        {submitted ? (
                            <div className="text-center p-8 bg-green-50 text-green-800 rounded-lg border border-green-200">
                               <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                               <h2 className="text-2xl font-bold">شكراً لك</h2>
                               <p className="mt-2 text-lg">تم تسجيل اطلاعك على هذا التبليغ بنجاح.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 border-t pt-6 mt-6">
                                <div className="flex items-start space-x-3 space-x-reverse">
                                    <Checkbox id="acknowledged" checked={submission.acknowledged} onCheckedChange={handleCheckboxChange} className="mt-1" />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="acknowledged" className="text-base font-semibold cursor-pointer">
                                            أقر بأنني اطلعت على محتوى التبليغ أعلاه، وأتعهد بالالتزام بما ورد فيه.
                                        </Label>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="employeeName">اسم الموظف</Label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="employeeName"
                                                name="employeeName"
                                                value={submission.employeeName}
                                                onChange={handleInputChange}
                                                placeholder="الاسم الثلاثي (باللغة العربية)"
                                                required
                                                pattern="^[\u0600-\u06FF\s]{2,}$"
                                                className="pr-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">رقم الجوال</Label>
                                        <div className="relative">
                                             <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={submission.phone}
                                                onChange={handleInputChange}
                                                placeholder="XXXXXXXXXX (10 أرقام)"
                                                required
                                                maxLength="10"
                                                pattern="^[0-9]{10}$"
                                                className="pr-10"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full text-lg py-6 bg-sky-600 hover:bg-sky-700">
                                    {isSubmitting ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Send className="ml-2 h-5 w-5" />}
                                    إرسال التأكيد
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
                <footer className="text-center text-xs text-gray-500 mt-4">
                    <p>نظام إدارة المدارس الذكي - تم إنشاؤه بتاريخ: {new Date(letter.created_at).toLocaleDateString('ar-SA')}</p>
                </footer>
            </main>
        </div>
    );
};

export default ViewSharedLetterPage;