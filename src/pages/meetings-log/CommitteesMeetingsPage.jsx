import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, ArrowRight, Users } from 'lucide-react';

const committeeTeamOptions = [
  { id: 'quality_committee', label: 'لجنة الجودة والتميز' },
  { id: 'student_guidance_committee', label: 'لجنة التوجيه الطلابي' },
  { id: 'activity_committee', label: 'لجنة النشاط المدرسي' },
  { id: 'health_committee', label: 'لجنة الصحة المدرسية' },
  { id: 'security_safety_committee', label: 'لجنة الأمن والسلامة' },
  { id: 'other_committee', label: 'أخرى (تحديد يدوي)' },
];

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const CommitteesMeetingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [academicYear, setAcademicYear] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [meetingDay, setMeetingDay] = useState('placeholder_day');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [selectedCommittees, setSelectedCommittees] = useState([]);
  const [customCommitteeName, setCustomCommitteeName] = useState('');
  const [showCustomCommitteeInput, setShowCustomCommitteeInput] = useState(false);
  const [attendees, setAttendees] = useState([{ name: '', role: '', signature: '' }]);
  const [meetingItems, setMeetingItems] = useState('');
  const [meetingRecommendations, setMeetingRecommendations] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const currentHijriYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {year: 'numeric'}).format(new Date()).split(' ')[0];
    const nextHijriYear = parseInt(currentHijriYear) + 1;
    setAcademicYear(`${currentHijriYear}-${nextHijriYear}هـ / ${currentYear}-${nextYear}م`);
  }, [user, navigate]);

  useEffect(() => {
    if (meetingDate) {
      const date = new Date(meetingDate);
      const dayIndex = date.getDay();
      setMeetingDay(daysOfWeek[dayIndex] || 'placeholder_day');
    } else {
      setMeetingDay('placeholder_day');
    }
  }, [meetingDate]);
  
  const handleCommitteeChange = (committeeId) => {
    const isOtherSelected = committeeId === 'other_committee';
    let newSelectedCommittees;

    if (selectedCommittees.includes(committeeId)) {
        newSelectedCommittees = selectedCommittees.filter(id => id !== committeeId);
    } else {
        newSelectedCommittees = [...selectedCommittees, committeeId];
    }
    setSelectedCommittees(newSelectedCommittees);

    if (isOtherSelected && newSelectedCommittees.includes('other_committee')) {
        setShowCustomCommitteeInput(true);
    } else if (!newSelectedCommittees.includes('other_committee')) {
        setShowCustomCommitteeInput(false);
        setCustomCommitteeName('');
    }
  };


  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: '', role: '', signature: '' }]);
  };

  const handleRemoveAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = [...attendees];
    newAttendees[index][field] = value;
    setAttendees(newAttendees);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const validCommitteeOptions = committeeTeamOptions.filter(opt => opt && opt.id && typeof opt.id === 'string' && opt.id.trim() !== "" && opt.label && typeof opt.label === 'string' && opt.label.trim() !== "");
    let meetingWithLabels = selectedCommittees
      .filter(c_id => c_id !== 'other_committee')
      .map(c_id => (validCommitteeOptions.find(opt => opt.id === c_id) || {}).label || c_id);

    if (selectedCommittees.includes('other_committee') && customCommitteeName.trim()) {
        meetingWithLabels.push(customCommitteeName.trim());
    }

    if (meetingWithLabels.length === 0 || !academicYear || !meetingDate || meetingDay === 'placeholder_day' || !meetingLocation || memberCount < 1 || !meetingItems.trim() || !meetingRecommendations.trim()) {
      toast({ title: "بيانات ناقصة", description: "يرجى ملء جميع الحقول الإلزامية.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const meetingData = {
      school_id: user.school_id,
      user_id: user.id,
      meeting_type: 'اجتماع لجنة/فريق',
      meeting_category: 'committee_team',
      title: `اجتماع ${meetingWithLabels.join(', ')}`,
      meeting_date_gregorian: meetingDate,
      meeting_day: meetingDay,
      academic_year: academicYear,
      location: meetingLocation,
      member_count: parseInt(memberCount),
      organizing_entity: meetingWithLabels.join(', '),
      meeting_items: { items: meetingItems.split('\n').filter(item => item.trim() !== '') },
      meeting_recommendations: { recommendations: meetingRecommendations.split('\n').filter(rec => rec.trim() !== '') },
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
      const attendeeData = attendees.map(att => ({
        meeting_id: meetingId,
        attendee_name: att.name,
        attendee_role: att.role,
        signature: att.signature,
        signature_status: att.signature ? 'signed_manual' : 'pending', 
      }));

      const { error: attendeesError } = await supabase.from('meeting_attendees').insert(attendeeData);
      if (attendeesError) throw attendeesError;

      toast({ title: "نجاح", description: "تم حفظ محضر اجتماع اللجنة/الفريق بنجاح." });
      navigate('/meetings-log'); 
    } catch (error) {
      console.error('Error saving committee meeting:', error);
      toast({ title: "خطأ", description: `لم نتمكن من حفظ الاجتماع: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validDaysOfWeek = daysOfWeek.filter(day => typeof day === 'string' && day.trim() !== "");
  const validCommitteeTeamOptions = committeeTeamOptions.filter(opt => opt && opt.id && typeof opt.id === 'string' && opt.id.trim() !== "" && opt.label && typeof opt.label === 'string' && opt.label.trim() !== "");


  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 arabic-text"
    >
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-xl border-0">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <Users className="w-7 h-7" />
              محضر اجتماع اللجان / الفرق
            </CardTitle>
            <Button variant="ghost" onClick={() => navigate('/meetings-log')} className="flex items-center gap-1 text-sm">
              <ArrowRight className="w-4 h-4" /> العودة لسجل الاجتماعات
            </Button>
          </div>
          <CardDescription className="text-gray-600">قم بتعبئة بيانات محضر اجتماع اللجنة أو الفريق.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="academicYear">العام الدراسي</Label>
              <Input id="academicYear" value={academicYear} onChange={e => setAcademicYear(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="memberCount">عدد الأعضاء</Label>
              <Input id="memberCount" type="number" value={memberCount} onChange={e => setMemberCount(parseInt(e.target.value) || 1)} min="1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="meetingDate">التاريخ</Label>
              <Input id="meetingDate" type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="meetingDay">اليوم</Label>
              <Select value={meetingDay} onValueChange={setMeetingDay} disabled={!!meetingDate}>
                <SelectTrigger id="meetingDay"><SelectValue placeholder="اختر اليوم" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder_day" disabled>اختر اليوم</SelectItem>
                  {validDaysOfWeek.map(d => <SelectItem key={d} value={d} className="justify-end">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="meetingLocation">مقر الاجتماع</Label>
              <Input id="meetingLocation" value={meetingLocation} onChange={e => setMeetingLocation(e.target.value)} />
            </div>
          </div>
          
          <div>
            <Label>الاجتماع بـ (لجنة/فريق):</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-3 border rounded-md bg-gray-50/50">
              {validCommitteeTeamOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`committee-${option.id}`} 
                    checked={selectedCommittees.includes(option.id)}
                    onCheckedChange={() => handleCommitteeChange(option.id)}
                  />
                  <Label htmlFor={`committee-${option.id}`} className="cursor-pointer text-sm">{option.label}</Label>
                </div>
              ))}
            </div>
            {showCustomCommitteeInput && (
              <Input 
                value={customCommitteeName} 
                onChange={e => setCustomCommitteeName(e.target.value)} 
                placeholder="ادخل اسم اللجنة/الفريق المخصص" 
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-lg font-semibold text-blue-600">جدول الأعضاء</Label>
            {attendees.map((attendee, index) => (
              <Card key={index} className="p-3 bg-blue-50/30 border-blue-200/80">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <Input value={attendee.name} onChange={e => handleAttendeeChange(index, 'name', e.target.value)} placeholder={`اسم العضو ${index + 1}`} />
                  <Input value={attendee.role} onChange={e => handleAttendeeChange(index, 'role', e.target.value)} placeholder="الصفة" />
                  <Input value={attendee.signature} onChange={e => handleAttendeeChange(index, 'signature', e.target.value)} placeholder="التوقيع (نصي)" />
                  {attendees.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAttendee(index)} className="text-red-500 hover:text-red-600 h-9 self-center">
                      <Trash2 className="w-4 h-4 mr-1" /> إزالة
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            <Button onClick={handleAddAttendee} variant="outline" className="w-full border-blue-400 text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" /> إضافة عضو
            </Button>
          </div>

          <div>
            <Label htmlFor="meetingItems" className="text-lg font-semibold text-blue-600">بنود الاجتماع (كل بند في سطر جديد)</Label>
            <Textarea id="meetingItems" value={meetingItems} onChange={e => setMeetingItems(e.target.value)} rows={5} placeholder="اكتب بنود الاجتماع هنا..." />
          </div>

          <div>
            <Label htmlFor="meetingRecommendations" className="text-lg font-semibold text-blue-600">التوصيات (كل توصية في سطر جديد)</Label>
            <Textarea id="meetingRecommendations" value={meetingRecommendations} onChange={e => setMeetingRecommendations(e.target.value)} rows={5} placeholder="اكتب التوصيات هنا..." />
          </div>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gradient-bg-1 text-white px-8 py-3 text-lg">
              <Save className="w-5 h-5 ml-2" /> {isSubmitting ? 'جاري الحفظ...' : 'حفظ المحضر'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommitteesMeetingsPage;