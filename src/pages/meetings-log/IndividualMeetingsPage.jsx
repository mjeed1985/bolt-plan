import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, ArrowRight, User2 as UserTie } from 'lucide-react';

const IndividualMeetingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [meetingDate, setMeetingDate] = useState('');
  const [recordNumber, setRecordNumber] = useState('');
  const [teacherName, setTeacherName] = useState('');
  
  // Teacher details
  const [nationalId, setNationalId] = useState('');
  const [nationality, setNationality] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [directEmploymentDate, setDirectEmploymentDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [teacherSignature, setTeacherSignature] = useState('');

  const [meetingSubject, setMeetingSubject] = useState('');
  const [discussionPoints, setDiscussionPoints] = useState('');
  const [meetingResults, setMeetingResults] = useState('');
  
  const [otherSigners, setOtherSigners] = useState([{ name: '', role: '', signature: '' }]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleAddSigner = () => {
    setOtherSigners([...otherSigners, { name: '', role: '', signature: '' }]);
  };

  const handleRemoveSigner = (index) => {
    setOtherSigners(otherSigners.filter((_, i) => i !== index));
  };

  const handleSignerChange = (index, field, value) => {
    const newSigners = [...otherSigners];
    newSigners[index][field] = value;
    setOtherSigners(newSigners);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!meetingDate || !recordNumber.trim() || !teacherName.trim() || !meetingSubject.trim() || !discussionPoints.trim() || !meetingResults.trim()) {
      toast({ title: "بيانات ناقصة", description: "يرجى ملء جميع الحقول الأساسية للمحضر.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const meetingData = {
      school_id: user.school_id,
      user_id: user.id,
      meeting_type: `اجتماع فردي مع ${teacherName}`,
      meeting_category: 'individual',
      title: `محضر اجتماع فردي رقم ${recordNumber} مع ${teacherName}`,
      meeting_date_gregorian: meetingDate,
      meeting_day: new Date(meetingDate).toLocaleDateString('ar-SA', { weekday: 'long' }), // Auto-generate day
      academic_year: new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {year: 'numeric'}).format(new Date()).split(' ')[0] + 'هـ', // Auto-generate academic year (simplified)
      location: 'مكتب مديرة المدرسة', // Default or make it a field
      member_count: 1 + otherSigners.length, // Teacher + other signers
      organizing_entity: 'مديرة المدرسة',
      meeting_subject: meetingSubject,
      meeting_items: { points: discussionPoints.split('\n').filter(item => item.trim() !== '') },
      meeting_recommendations: { results: meetingResults.split('\n').filter(rec => rec.trim() !== '') },
      status: 'completed',
    };

    try {
      const { data: meetingResult, error: meetingError } = await supabase
        .from('school_meetings')
        .insert(meetingData)
        .select('id')
        .single();

      if (meetingError) throw meetingError;
      if (!meetingResult) throw new Error('Failed to create meeting entry.');
      
      const meetingId = meetingResult.id;

      // Save teacher details
      const teacherDetailsData = {
        meeting_id: meetingId,
        teacher_name: teacherName,
        national_id: nationalId,
        nationality: nationality,
        qualification: qualification,
        specialization: specialization,
        years_of_service: yearsOfService ? parseInt(yearsOfService) : null,
        direct_employment_date: directEmploymentDate || null,
        phone_number: phoneNumber,
        signature: teacherSignature,
      };
      const { error: teacherDetailsError } = await supabase.from('individual_meeting_teacher_details').insert(teacherDetailsData);
      if (teacherDetailsError) throw teacherDetailsError;

      // Save other signers as attendees
      if (otherSigners.length > 0 && otherSigners.some(s => s.name.trim())) {
        const attendeeData = otherSigners
          .filter(s => s.name.trim())
          .map(att => ({
            meeting_id: meetingId,
            attendee_name: att.name,
            attendee_role: att.role,
            signature: att.signature,
            signature_status: att.signature ? 'signed_manual' : 'pending',
        }));
        const { error: attendeesError } = await supabase.from('meeting_attendees').insert(attendeeData);
        if (attendeesError) throw attendeesError;
      }

      toast({ title: "نجاح", description: "تم حفظ محضر الاجتماع الفردي بنجاح." });
      navigate('/meetings-log');
    } catch (error) {
      console.error('Error saving individual meeting:', error);
      toast({ title: "خطأ", description: `لم نتمكن من حفظ المحضر: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-8 arabic-text"
    >
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-xl border-0">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              <UserTie className="w-7 h-7" />
              محضر اجتماع فردي مع معلمة
            </CardTitle>
            <Button variant="ghost" onClick={() => navigate('/meetings-log')} className="flex items-center gap-1 text-sm">
              <ArrowRight className="w-4 h-4" /> العودة لسجل الاجتماعات
            </Button>
          </div>
          <CardDescription className="text-gray-600">قم بتعبئة بيانات محضر الاجتماع الفردي.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><Label htmlFor="meetingDate">التاريخ</Label><Input id="meetingDate" type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} /></div>
            <div><Label htmlFor="recordNumber">رقم المحضر</Label><Input id="recordNumber" value={recordNumber} onChange={e => setRecordNumber(e.target.value)} /></div>
            <div><Label htmlFor="teacherName">اسم المعلمة</Label><Input id="teacherName" value={teacherName} onChange={e => setTeacherName(e.target.value)} /></div>
          </div>

          <Card className="p-4 bg-purple-50/30 border-purple-200/80">
            <CardTitle className="text-lg text-purple-600 mb-3">بيانات المعلمة (اختياري)</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label htmlFor="nationalId" className="text-xs">السجل المدني</Label><Input id="nationalId" value={nationalId} onChange={e => setNationalId(e.target.value)} /></div>
                <div><Label htmlFor="nationality" className="text-xs">الجنسية</Label><Input id="nationality" value={nationality} onChange={e => setNationality(e.target.value)} /></div>
                <div><Label htmlFor="qualification" className="text-xs">المؤهل</Label><Input id="qualification" value={qualification} onChange={e => setQualification(e.target.value)} /></div>
                <div><Label htmlFor="specialization" className="text-xs">التخصص</Label><Input id="specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} /></div>
                <div><Label htmlFor="yearsOfService" className="text-xs">سنوات الخدمة</Label><Input id="yearsOfService" type="number" value={yearsOfService} onChange={e => setYearsOfService(e.target.value)} /></div>
                <div><Label htmlFor="directEmploymentDate" className="text-xs">تاريخ المباشرة</Label><Input id="directEmploymentDate" type="date" value={directEmploymentDate} onChange={e => setDirectEmploymentDate(e.target.value)} /></div>
                <div><Label htmlFor="phoneNumber" className="text-xs">رقم الجوال</Label><Input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /></div>
            </div>
             <div className="mt-3">
                <Label htmlFor="teacherSignature" className="text-xs">توقيع المعلمة (نصي)</Label>
                <Input id="teacherSignature" value={teacherSignature} onChange={e => setTeacherSignature(e.target.value)} placeholder="اكتب توقيع المعلمة هنا" />
            </div>
          </Card>
          
          <div>
            <Label htmlFor="meetingSubject" className="text-lg font-semibold text-purple-600">موضوع الاجتماع</Label>
            <Input id="meetingSubject" value={meetingSubject} onChange={e => setMeetingSubject(e.target.value)} placeholder="اكتب موضوع الاجتماع هنا..." />
          </div>

          <div>
            <Label htmlFor="discussionPoints" className="text-lg font-semibold text-purple-600">نقاط الاجتماع (كل نقطة في سطر جديد)</Label>
            <Textarea id="discussionPoints" value={discussionPoints} onChange={e => setDiscussionPoints(e.target.value)} rows={5} placeholder="اكتب نقاط الاجتماع هنا..." />
          </div>

          <div>
            <Label htmlFor="meetingResults" className="text-lg font-semibold text-purple-600">نتائج الاجتماع (كل نتيجة في سطر جديد)</Label>
            <Textarea id="meetingResults" value={meetingResults} onChange={e => setMeetingResults(e.target.value)} rows={5} placeholder="اكتب نتائج الاجتماع هنا..." />
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-lg font-semibold text-purple-600">الموقعون الآخرون (إن وجد)</Label>
            {otherSigners.map((signer, index) => (
              <Card key={index} className="p-3 bg-purple-50/30 border-purple-200/80">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <Input value={signer.name} onChange={e => handleSignerChange(index, 'name', e.target.value)} placeholder={`اسم الموقع ${index + 1}`} />
                  <Input value={signer.role} onChange={e => handleSignerChange(index, 'role', e.target.value)} placeholder="الصفة" />
                  <Input value={signer.signature} onChange={e => handleSignerChange(index, 'signature', e.target.value)} placeholder="التوقيع (نصي)" />
                  {otherSigners.length >= 1 && ( // Keep one signer at least, or allow removal of all
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSigner(index)} className="text-red-500 hover:text-red-600 h-9 self-center">
                      <Trash2 className="w-4 h-4 mr-1" /> إزالة
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            <Button onClick={handleAddSigner} variant="outline" className="w-full border-purple-400 text-purple-600 hover:bg-purple-50">
              <Plus className="w-4 h-4 mr-2" /> إضافة موقع آخر
            </Button>
          </div>


          <div className="flex justify-end pt-6">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gradient-bg-2 text-white px-8 py-3 text-lg">
              <Save className="w-5 h-5 ml-2" /> {isSubmitting ? 'جاري الحفظ...' : 'حفظ المحضر'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IndividualMeetingsPage;