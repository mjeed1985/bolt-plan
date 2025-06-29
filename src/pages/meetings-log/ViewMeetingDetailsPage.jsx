import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { ArrowRight, FileText, Users, User, CalendarDays, MapPin, Bookmark, ListChecks, CheckSquare, Printer, Download } from 'lucide-react';

const ViewMeetingDetailsPage = () => {
  const { meetingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [meeting, setMeeting] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMeetingDetails = useCallback(async () => {
    if (!user || !meetingId) return;
    setLoading(true);
    try {
      const { data: meetingData, error: meetingError } = await supabase
        .from('school_meetings')
        .select('*')
        .eq('id', meetingId)
        .eq('school_id', user.school_id) 
        .single();

      if (meetingError) throw meetingError;
      setMeeting(meetingData);

      const { data: attendeesData, error: attendeesError } = await supabase
        .from('meeting_attendees')
        .select('*')
        .eq('meeting_id', meetingId);
      
      if (attendeesError) throw attendeesError;
      setAttendees(attendeesData || []);

      if (meetingData && meetingData.meeting_category === 'individual') {
        const { data: teacherData, error: teacherError } = await supabase
          .from('individual_meeting_teacher_details')
          .select('*')
          .eq('meeting_id', meetingId)
          .single();
        if (teacherError && teacherError.code !== 'PGRST116') throw teacherError; // Ignore if no teacher details found
        setTeacherDetails(teacherData);
      }

    } catch (error) {
      console.error("Error fetching meeting details:", error);
      toast({ title: "خطأ في جلب التفاصيل", description: error.message, variant: "destructive" });
      navigate('/meetings-log/archive');
    } finally {
      setLoading(false);
    }
  }, [user, meetingId, toast, navigate]);

  useEffect(() => {
    fetchMeetingDetails();
  }, [fetchMeetingDetails]);
  
  const formatMeetingDate = (gregorianDate) => {
    if (!gregorianDate) return 'غير محدد';
    try {
      return new Date(gregorianDate).toLocaleDateString('ar-SA-u-nu-latn', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
      });
    } catch (e) { return gregorianDate; }
  };

  const renderField = (label, value, icon) => {
    if (!value && value !== 0 && value !== false) return null;
    const IconComponent = icon || Bookmark;
    return (
      <div className="flex items-start mb-3 p-3 bg-slate-50 rounded-md border border-slate-200">
        <IconComponent className="w-5 h-5 text-slate-500 mt-1 ml-3" />
        <div>
          <p className="text-sm text-slate-600 font-medium">{label}:</p>
          <p className="text-md text-slate-800">{String(value)}</p>
        </div>
      </div>
    );
  };

  const renderList = (label, items, icon) => {
    if (!items || items.length === 0) return null;
    const IconComponent = icon || ListChecks;
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
          <IconComponent className="w-5 h-5 mr-2 text-slate-500" /> {label}
        </h3>
        <ul className="list-disc list-inside space-y-1 pr-6">
          {items.map((item, index) => (
            <li key={index} className="text-slate-800 bg-slate-100 p-2 rounded-md">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-700"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل تفاصيل الاجتماع...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-slate-100 to-gray-200">
        <FileText className="w-24 h-24 text-gray-400 mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-4">لم يتم العثور على الاجتماع</h1>
        <p className="text-gray-600 mb-6">قد يكون الاجتماع قد تم حذفه أو أن الرابط غير صحيح.</p>
        <Button onClick={() => navigate('/meetings-log/archive')} className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> العودة إلى الأرشيف
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8 arabic-text print:bg-white"
    >
      <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg shadow-2xl border-0 print:shadow-none print:border">
        <CardHeader className="border-b pb-4 print:border-b-2 print:border-black">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              تفاصيل محضر الاجتماع
            </CardTitle>
            <div className="no-print space-x-2 space-x-reverse">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1">
                <Printer className="w-4 h-4" /> طباعة
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/meetings-log/archive')} className="flex items-center gap-1">
                <ArrowRight className="w-4 h-4" /> العودة للأرشيف
              </Button>
            </div>
          </div>
          <CardDescription className="text-slate-600 mt-1">{meeting.title}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {renderField("نوع الاجتماع", meeting.meeting_type)}
            {renderField("فئة الاجتماع", meeting.meeting_category)}
            {renderField("تاريخ الاجتماع", formatMeetingDate(meeting.meeting_date_gregorian), CalendarDays)}
            {renderField("اليوم", meeting.meeting_day)}
            {renderField("مقر الاجتماع", meeting.location, MapPin)}
            {renderField("العام الدراسي", meeting.academic_year)}
            {renderField("عدد الأعضاء المقرر", meeting.member_count, Users)}
            {renderField("الجهة المنظمة", meeting.organizing_entity)}
            {meeting.meeting_subject && renderField("موضوع الاجتماع (فردي)", meeting.meeting_subject)}
            {renderField("حالة الاجتماع", meeting.status)}
          </div>

          {teacherDetails && (
            <Card className="bg-indigo-50/50 border-indigo-200 p-4">
              <CardTitle className="text-xl text-indigo-700 mb-3 flex items-center gap-2"><User className="w-6 h-6"/> بيانات المعلمة (للاجتماع الفردي)</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                {renderField("اسم المعلمة", teacherDetails.teacher_name)}
                {renderField("السجل المدني", teacherDetails.national_id)}
                {renderField("الجنسية", teacherDetails.nationality)}
                {renderField("المؤهل", teacherDetails.qualification)}
                {renderField("التخصص", teacherDetails.specialization)}
                {renderField("سنوات الخدمة", teacherDetails.years_of_service)}
                {renderField("تاريخ المباشرة", teacherDetails.direct_employment_date ? new Date(teacherDetails.direct_employment_date).toLocaleDateString('ar-SA') : '')}
                {renderField("رقم الجوال", teacherDetails.phone_number)}
                {renderField("توقيع المعلمة", teacherDetails.signature)}
              </div>
            </Card>
          )}

          {meeting.meeting_items && (meeting.meeting_items.items || meeting.meeting_items.points) && renderList(meeting.meeting_category === 'individual' ? "نقاط الاجتماع" : "بنود الاجتماع", meeting.meeting_items.items || meeting.meeting_items.points, ListChecks)}
          {meeting.meeting_recommendations && (meeting.meeting_recommendations.recommendations || meeting.meeting_recommendations.results) && renderList(meeting.meeting_category === 'individual' ? "نتائج الاجتماع" : "التوصيات", meeting.meeting_recommendations.recommendations || meeting.meeting_recommendations.results, CheckSquare)}

          {attendees.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-slate-500" /> قائمة الحضور والتوقيعات
              </h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-600 uppercase">الاسم</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-600 uppercase">الصفة</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-600 uppercase">التوقيع</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-slate-600 uppercase">حالة التوقيع</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {attendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-800">{attendee.attendee_name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">{attendee.attendee_role}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">{attendee.signature || 'N/A'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">{attendee.signature_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ViewMeetingDetailsPage;