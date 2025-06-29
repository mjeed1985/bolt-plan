import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Calendar as CalendarIcon, Users, ChevronDown } from 'lucide-react';

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const reminderOptions = [
  { value: "1_hour", label: "قبل ساعة" },
  { value: "3_hours", label: "قبل 3 ساعات" },
  { value: "1_day", label: "قبل يوم" },
];

const CreateMeetingForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting, 
  meetingTypes = [], 
  suggestedTitles = [] 
}) => {
  const { toast } = useToast();
  const [meetingType, setMeetingType] = useState('');
  const [selectedMeetingTitle, setSelectedMeetingTitle] = useState('');
  const [customMeetingTitle, setCustomMeetingTitle] = useState('');
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false);
  
  const [meetingDateGregorian, setMeetingDateGregorian] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [organizingEntity, setOrganizingEntity] = useState('');
  const [reminderActive, setReminderActive] = useState(false);
  const [reminderTiming, setReminderTiming] = useState('');
  const [attendees, setAttendees] = useState([{ name: '', role: '' }]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const currentHijriYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {year: 'numeric'}).format(new Date()).split(' ')[0];
      const nextHijriYear = parseInt(currentHijriYear) + 1;
      setAcademicYear(`${currentHijriYear}-${nextHijriYear}هـ / ${currentYear}-${nextYear}م`);
    }
  }, [isOpen]);

  useEffect(() => {
    if (meetingDateGregorian) {
      const date = new Date(meetingDateGregorian);
      const dayIndex = date.getDay();
      setMeetingDay(daysOfWeek[dayIndex] || '');
    } else {
      setMeetingDay('');
    }
  }, [meetingDateGregorian]);

  const resetForm = () => {
    setMeetingType('');
    setSelectedMeetingTitle('');
    setCustomMeetingTitle('');
    setShowCustomTitleInput(false);
    setMeetingDateGregorian('');
    setMeetingDay('');
    setMeetingLocation('');
    setMemberCount(1);
    setOrganizingEntity('');
    setReminderActive(false);
    setReminderTiming('');
    setAttendees([{ name: '', role: '' }]);
  };

  const handleAddAttendee = () => {
    if (attendees.length < 99) {
      setAttendees([...attendees, { name: '', role: '' }]);
    } else {
      toast({ title: "تنبيه", description: "لا يمكن إضافة أكثر من 99 حاضر.", variant: "default" });
    }
  };

  const handleRemoveAttendee = (index) => {
    const newAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(newAttendees);
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendees = attendees.map((att, i) =>
      i === index ? { ...att, [field]: value } : att
    );
    setAttendees(newAttendees);
  };
  
  const getFinalMeetingTitle = () => {
    return showCustomTitleInput ? customMeetingTitle : selectedMeetingTitle;
  };

  const handleSubmit = () => {
    const finalTitle = getFinalMeetingTitle();
    if (!meetingType || !finalTitle.trim() || !meetingDateGregorian || !meetingDay || !meetingLocation.trim() || !academicYear.trim() || memberCount < 1 || !organizingEntity.trim()) {
      toast({ title: "بيانات ناقصة", description: "يرجى ملء جميع الحقول الإلزامية.", variant: "destructive" });
      return;
    }
    if (reminderActive && !reminderTiming) {
      toast({ title: "بيانات ناقصة", description: "يرجى اختيار وقت التذكير.", variant: "destructive" });
      return;
    }
    if (attendees.some(att => !att.name.trim() || !att.role.trim())) {
        toast({ title: "بيانات الحضور ناقصة", description: "يرجى ملء جميع بيانات الحضور (الاسم والصفة).", variant: "destructive" });
        return;
    }

    const hijriDate = meetingDateGregorian ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(new Date(meetingDateGregorian)) : '';

    const meetingData = {
      meeting_type: meetingType,
      title: finalTitle,
      meeting_date_hijri: hijriDate,
      meeting_date_gregorian: meetingDateGregorian,
      meeting_day: meetingDay,
      location: meetingLocation,
      academic_year: academicYear,
      member_count: parseInt(memberCount),
      organizing_entity: organizingEntity,
      reminder_active: reminderActive,
      reminder_timing: reminderActive ? reminderTiming : null,
      attendees: attendees,
    };
    onSubmit(meetingData);
  };

  if (!isOpen) return null;
  
  const validSuggestedTitles = suggestedTitles.filter(title => typeof title === 'string' && title.trim() !== "");
  const validMeetingTypes = meetingTypes.filter(type => type && type.value && typeof type.value === 'string' && type.value.trim() !== "" && type.label && typeof type.label === 'string' && type.label.trim() !== "");
  const validReminderOptions = reminderOptions.filter(opt => opt && opt.value && typeof opt.value === 'string' && opt.value.trim() !== "" && opt.label && typeof opt.label === 'string' && opt.label.trim() !== "");
  const validDaysOfWeek = daysOfWeek.filter(day => typeof day === 'string' && day.trim() !== "");


  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 no-print overflow-y-auto"
    >
      <Card className="w-full max-w-3xl bg-white shadow-2xl max-h-[95vh] flex flex-col">
        <CardHeader className="border-b sticky top-0 bg-white z-10">
          <CardTitle className="arabic-text text-center text-2xl text-indigo-700">إنشاء اجتماع جديد</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meetingType" className="arabic-text">نوع الاجتماع</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger id="meetingType" className="arabic-text text-right">
                  <SelectValue placeholder="اختر نوع الاجتماع" />
                </SelectTrigger>
                <SelectContent>
                  {validMeetingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="arabic-text justify-end">{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="meetingTitleSelect" className="arabic-text">عنوان الاجتماع</Label>
              <Select
                value={showCustomTitleInput ? "custom" : (selectedMeetingTitle || "")}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomTitleInput(true);
                    setSelectedMeetingTitle('');
                    setCustomMeetingTitle('');
                  } else {
                    setShowCustomTitleInput(false);
                    setSelectedMeetingTitle(value || '');
                    setCustomMeetingTitle('');
                  }
                }}
              >
                <SelectTrigger id="meetingTitleSelect" className="arabic-text text-right">
                  <SelectValue placeholder="اختر عنوانًا أو أدخل عنوانًا مخصصًا" />
                </SelectTrigger>
                <SelectContent>
                  {validSuggestedTitles.map((title, index) => (
                    <SelectItem key={`${title}-${index}`} value={title} className="arabic-text justify-end">{title}</SelectItem>
                  ))}
                  <SelectItem value="custom" className="arabic-text justify-end font-semibold">عنوان مخصص...</SelectItem>
                </SelectContent>
              </Select>
              {showCustomTitleInput && (
                <Input 
                  id="customMeetingTitle" 
                  value={customMeetingTitle} 
                  onChange={(e) => setCustomMeetingTitle(e.target.value)}
                  placeholder="اكتب عنوان الاجتماع المخصص هنا" 
                  className="mt-2 text-right arabic-text" 
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meetingDateGregorian" className="arabic-text">التاريخ (ميلادي)</Label>
              <Input id="meetingDateGregorian" type="date" value={meetingDateGregorian} onChange={(e) => setMeetingDateGregorian(e.target.value)} className="text-right arabic-text" />
            </div>
            <div>
              <Label htmlFor="meetingDay" className="arabic-text">اليوم</Label>
              <Select value={meetingDay} onValueChange={setMeetingDay} disabled={!!meetingDateGregorian}>
                <SelectTrigger id="meetingDay" className="arabic-text text-right">
                  <SelectValue placeholder="اختر اليوم (يُحدد تلقائياً من التاريخ)" />
                </SelectTrigger>
                <SelectContent>
                  {validDaysOfWeek.map(day => (
                    <SelectItem key={day} value={day} className="arabic-text justify-end">{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meetingLocation" className="arabic-text">مقر الاجتماع</Label>
              <Input id="meetingLocation" value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} placeholder="مثال: غرفة الاجتماعات الرئيسية" className="text-right arabic-text" />
            </div>
            <div>
              <Label htmlFor="academicYear" className="arabic-text">العام الدراسي</Label>
              <Input id="academicYear" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="مثال: 1445-1446هـ" className="text-right arabic-text" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="memberCount" className="arabic-text">عدد الأعضاء</Label>
              <Input id="memberCount" type="number" value={memberCount} onChange={(e) => setMemberCount(parseInt(e.target.value) || 1)} min="1" className="text-center arabic-text" />
            </div>
            <div>
              <Label htmlFor="organizingEntity" className="arabic-text">الجهة المنظمة</Label>
              <Input id="organizingEntity" value={organizingEntity} onChange={(e) => setOrganizingEntity(e.target.value)} placeholder="مثال: إدارة المدرسة" className="text-right arabic-text" />
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id="reminderActive" checked={reminderActive} onCheckedChange={setReminderActive} />
              <Label htmlFor="reminderActive" className="arabic-text cursor-pointer">تفعيل التذكير بالاجتماع</Label>
            </div>
            {reminderActive && (
              <div>
                <Label htmlFor="reminderTiming" className="arabic-text">وقت التذكير</Label>
                <Select value={reminderTiming} onValueChange={setReminderTiming}>
                  <SelectTrigger id="reminderTiming" className="arabic-text text-right">
                    <SelectValue placeholder="اختر وقت التذكير" />
                  </SelectTrigger>
                  <SelectContent>
                    {validReminderOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="arabic-text justify-end">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="arabic-text font-semibold text-lg text-indigo-600">قائمة الحضور ({attendees.length} / 99)</Label>
            {attendees.map((attendee, index) => (
              <Card key={index} className="p-4 bg-indigo-50/30 border border-indigo-200/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-1">
                    <Label htmlFor={`attendeeName-${index}`} className="arabic-text text-sm">اسم الحاضر {index + 1}</Label>
                    <Input 
                      id={`attendeeName-${index}`} 
                      value={attendee.name} 
                      onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)} 
                      placeholder="اسم الحاضر" 
                      className="text-right arabic-text" 
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label htmlFor={`attendeeRole-${index}`} className="arabic-text text-sm">الصفة</Label>
                    <Input 
                      id={`attendeeRole-${index}`} 
                      value={attendee.role} 
                      onChange={(e) => handleAttendeeChange(index, 'role', e.target.value)} 
                      placeholder="مثال: معلم، وكيل" 
                      className="text-right arabic-text" 
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    {attendees.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveAttendee(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1">
                        <Trash2 className="w-4 h-4"/> إزالة
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {attendees.length < 99 && (
              <Button onClick={handleAddAttendee} variant="outline" className="w-full flex items-center gap-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50">
                <Plus className="w-4 h-4"/> إضافة حاضر جديد
              </Button>
            )}
          </div>
        </CardContent>
        <div className="p-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white z-10">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-gray-700 hover:bg-gray-100">إلغاء</Button>
            <Button onClick={handleSubmit} className="gradient-bg-3 text-white px-6 py-3" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإنشاء...' : 'حفظ وإنشاء الاجتماع'}
            </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CreateMeetingForm;