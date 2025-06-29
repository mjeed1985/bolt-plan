import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Send, Sparkles, FileText, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const messageTemplates = [
  { id: 'congrats', name: 'تهنئة', content: 'عزيزي ولي أمر الطالب/ة [اسم الطالب]،\nنهنئكم على [الإنجاز/السلوك الإيجابي] الذي أظهره/أظهرته ابنكم/ابنتكم مؤخرًا في [المادة/الموقف].\nنقدر دعمكم المستمر.\nمع خالص التقدير،\n[اسم المرسل]\nمدرسة يمناك' },
  { id: 'absence', name: 'إشعار بغياب', content: 'عزيزي ولي أمر الطالب/ة [اسم الطالب]،\nنود إبلاغكم بأن ابنكم/ابنتكم [اسم الطالب] تغيب عن المدرسة اليوم [التاريخ] في الحصة/الحصص [رقم الحصة/اسم المادة].\nنرجو تزويدنا بسبب الغياب في أقرب وقت ممكن.\nمع خالص التقدير،\n[اسم المرسل]\nمدرسة يمناك' },
  { id: 'behavior_note', name: 'ملاحظة سلوكية', content: 'عزيزي ولي أمر الطالب/ة [اسم الطالب]،\nنود لفت انتباهكم إلى [وصف الملاحظة السلوكية] التي بدرت من ابنكم/ابنتكم [اسم الطالب] اليوم في [الموقف/الحصة].\nنأمل التعاون معنا لمعالجة هذا الأمر.\nمع خالص التقدير،\n[اسم المرسل]\nمدرسة يمناك' },
  { id: 'meeting_invite', name: 'دعوة لاجتماع', content: 'عزيزي ولي أمر الطالب/ة [اسم الطالب]،\nيسرنا دعوتكم لحضور اجتماع لمناقشة [موضوع الاجتماع] وذلك يوم [التاريخ] في تمام الساعة [الوقت] بمقر المدرسة.\nحضوركم يهمنا.\nمع خالص التقدير،\n[اسم المرسل]\nمدرسة يمناك' },
  { id: 'level_report', name: 'تقرير مستوى', content: 'عزيزي ولي أمر الطالب/ة [اسم الطالب]،\nنرفق لكم تقريرًا موجزًا عن مستوى ابنكم/ابنتكم [اسم الطالب] في مادة [اسم المادة] خلال الفترة [الفترة الزمنية].\n[نقاط القوة]\n[نقاط تحتاج إلى تحسين]\nنأمل منكم الاطلاع والتواصل معنا لمزيد من التفاصيل.\nمع خالص التقدير،\n[اسم المرسل]\nمدرسة يمناك' },
];

const CreateParentMessagePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [schoolId, setSchoolId] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    parentContactInfo: '',
    communicationChannel: '',
    communicationPurpose: '',
    messageSubject: '',
    messageContent: '',
    messageTone: 'ودية', 
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchSchoolId = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('schools')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching school_id:', error);
        } else if (data) {
          setSchoolId(data.id);
        }
      }
    };
    fetchSchoolId();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateId) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      let content = template.content;
      content = content.replace('[اسم المرسل]', user?.user_metadata?.full_name || 'إدارة المدرسة');
      setFormData(prev => ({ ...prev, messageContent: content, messageSubject: template.name }));
    }
  };
  
  const generateAIMessage = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: 'خطأ', description: 'الرجاء إدخال النقاط الرئيسية للرسالة.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      // Placeholder for actual AI API call
      // For now, simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const generatedMessage = `بناءً على النقاط: "${aiPrompt}" والنبرة المطلوبة "${formData.messageTone}", تم صياغة الرسالة التالية:\n\nعزيزي ولي الأمر،\nنود إعلامكم بخصوص الطالب/ة ${formData.studentName || '[اسم الطالب]'}.\n${aiPrompt}\n\nنأمل منكم التكرم بمتابعة الأمر.\n\nمع خالص التقدير،\n${user?.user_metadata?.full_name || 'إدارة المدرسة'}\nمدرسة يمناك`;
      
      setFormData(prev => ({ ...prev, messageContent: generatedMessage }));
      toast({ title: 'نجاح', description: 'تم إنشاء محتوى الرسالة بواسطة الذكاء الاصطناعي.' });
    } catch (error) {
      console.error("Error generating AI message:", error);
      toast({ title: 'خطأ', description: 'فشل إنشاء الرسالة بواسطة الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolId) {
      toast({ title: 'خطأ', description: 'لم يتم تحديد المدرسة. يرجى التأكد من تسجيل الدخول بشكل صحيح.', variant: 'destructive' });
      return;
    }
    setIsSending(true);
    try {
      const communicationData = {
        ...formData,
        school_id: schoolId,
        user_id: user.id,
        initiated_by_name: user?.user_metadata?.full_name || 'النظام',
        ai_generated_content: formData.messageContent.includes("بناءً على النقاط:"), // Simple check
        ai_prompt: aiPrompt,
      };

      const { error } = await supabase.from('parent_communications').insert(communicationData);

      if (error) throw error;

      toast({ title: 'نجاح!', description: 'تم إرسال وحفظ رسالة التواصل بنجاح.' });
      navigate('/parent-communication/log'); 
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: 'خطأ في الإرسال', description: error.message || 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.', variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div initial="hidden" animate="visible" variants={itemVariants}>
        <Card className="max-w-3xl mx-auto shadow-2xl bg-white/90 backdrop-blur-md border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white p-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold arabic-text">إنشاء تواصل جديد مع ولي الأمر</CardTitle>
                <CardDescription className="text-yellow-100 arabic-text">املأ النموذج أدناه لإرسال رسالة أو استخدم المساعدة الذكية.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="studentName" className="arabic-text font-semibold text-gray-700">اسم الطالب/ة</Label>
                  <Input id="studentName" name="studentName" value={formData.studentName} onChange={handleInputChange} required className="mt-1 arabic-text" />
                </div>
                <div>
                  <Label htmlFor="parentName" className="arabic-text font-semibold text-gray-700">اسم ولي الأمر</Label>
                  <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleInputChange} required className="mt-1 arabic-text" />
                </div>
              </div>

              <div>
                <Label htmlFor="parentContactInfo" className="arabic-text font-semibold text-gray-700">معلومات الاتصال بولي الأمر (هاتف/بريد)</Label>
                <Input id="parentContactInfo" name="parentContactInfo" value={formData.parentContactInfo} onChange={handleInputChange} required className="mt-1 arabic-text" placeholder="مثال: 05xxxxxxxx أو parent@example.com" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="communicationChannel" className="arabic-text font-semibold text-gray-700">قناة التواصل</Label>
                  <Select name="communicationChannel" onValueChange={(value) => handleSelectChange('communicationChannel', value)} value={formData.communicationChannel}>
                    <SelectTrigger className="w-full mt-1 arabic-text"><SelectValue placeholder="اختر قناة التواصل" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app_notification" className="arabic-text">إشعار عبر تطبيق المدرسة</SelectItem>
                      <SelectItem value="sms" className="arabic-text">رسالة نصية SMS</SelectItem>
                      <SelectItem value="email" className="arabic-text">بريد إلكتروني</SelectItem>
                      <SelectItem value="phone_call_log" className="arabic-text">توثيق مكالمة هاتفية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="communicationPurpose" className="arabic-text font-semibold text-gray-700">الغرض من التواصل</Label>
                  <Select name="communicationPurpose" onValueChange={(value) => handleSelectChange('communicationPurpose', value)} value={formData.communicationPurpose}>
                    <SelectTrigger className="w-full mt-1 arabic-text"><SelectValue placeholder="اختر الغرض من التواصل" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic" className="arabic-text">أكاديمي</SelectItem>
                      <SelectItem value="behavioral" className="arabic-text">سلوكي</SelectItem>
                      <SelectItem value="administrative" className="arabic-text">إداري</SelectItem>
                      <SelectItem value="congratulatory" className="arabic-text">تهنئة</SelectItem>
                      <SelectItem value="meeting_invitation" className="arabic-text">دعوة لاجتماع</SelectItem>
                      <SelectItem value="other" className="arabic-text">آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="messageSubject" className="arabic-text font-semibold text-gray-700">موضوع الرسالة (اختياري)</Label>
                <Input id="messageSubject" name="messageSubject" value={formData.messageSubject} onChange={handleInputChange} className="mt-1 arabic-text" />
              </div>

              <div className="space-y-2">
                <Label className="arabic-text font-semibold text-gray-700">قوالب الرسائل الجاهزة</Label>
                <div className="flex flex-wrap gap-2">
                  {messageTemplates.map(template => (
                    <Button key={template.id} type="button" variant="outline" size="sm" onClick={() => handleTemplateSelect(template.id)} className="arabic-text border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                      <FileText className="ml-2 h-4 w-4" /> {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="messageContent" className="arabic-text font-semibold text-gray-700">محتوى الرسالة</Label>
                <Textarea id="messageContent" name="messageContent" value={formData.messageContent} onChange={handleInputChange} rows={6} required className="mt-1 arabic-text" placeholder="اكتب رسالتك هنا أو استخدم المساعدة الذكية أدناه..." />
              </div>

              <Card className="bg-yellow-50 border-yellow-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-yellow-700 arabic-text flex items-center">
                    <Sparkles className="ml-2 h-5 w-5 text-yellow-600" />
                    مساعدة الذكاء الاصطناعي لصياغة الرسالة
                  </CardTitle>
                  <CardDescription className="text-yellow-600 arabic-text">أدخل النقاط الرئيسية، وسيقوم الذكاء الاصطناعي بصياغة رسالة احترافية.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="aiPrompt" className="arabic-text font-medium text-gray-700">النقاط الرئيسية للرسالة</Label>
                    <Textarea id="aiPrompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={3} className="mt-1 arabic-text" placeholder="مثال: تأخر الطالب عن الحصة الأولى، عدم إحضار الواجب لمادة الرياضيات" />
                  </div>
                  <div>
                    <Label htmlFor="messageTone" className="arabic-text font-medium text-gray-700">نبرة الرسالة</Label>
                    <Select name="messageTone" onValueChange={(value) => handleSelectChange('messageTone', value)} value={formData.messageTone}>
                      <SelectTrigger className="w-full mt-1 arabic-text"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="رسمية" className="arabic-text">رسمية</SelectItem>
                        <SelectItem value="ودية" className="arabic-text">ودية</SelectItem>
                        <SelectItem value="عاجلة" className="arabic-text">عاجلة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={generateAIMessage} disabled={isGenerating} variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-100 arabic-text">
                    {isGenerating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
                    {isGenerating ? 'جاري الإنشاء...' : 'إنشاء محتوى الرسالة بالذكاء الاصطناعي'}
                  </Button>
                </CardContent>
              </Card>
              
              <CardFooter className="pt-6 flex justify-end gap-3 px-0">
                <Button type="button" variant="outline" onClick={() => navigate('/parent-communication')} className="arabic-text">
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSending} className="gradient-bg-1 text-white hover:opacity-90 transition-opacity duration-300 arabic-text">
                  {isSending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                  {isSending ? 'جاري الإرسال...' : 'إرسال وحفظ الرسالة'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateParentMessagePage;