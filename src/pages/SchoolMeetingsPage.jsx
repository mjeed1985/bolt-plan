import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, CalendarDays } from 'lucide-react';
import CreateMeetingForm from '@/components/meetings/CreateMeetingForm';
import MeetingsList from '@/components/meetings/MeetingsList';
import MeetingsFilterControls from '@/components/meetings/MeetingsFilterControls';
import { supabase } from '@/lib/supabase';

const predefinedMeetingTypes = [
  { value: "قيادة مدرسية", label: "قيادة مدرسية" },
  { value: "مجلس معلمين", label: "مجلس معلمين" },
  { value: "لجان", label: "لجان" },
  { value: "فرق", label: "فرق" },
  { value: "تخصص", label: "تخصص" },
  { value: "اجتماع فردي", label: "اجتماع فردي" },
  { value: "اجتماع طارئ", label: "اجتماع طارئ" },
  { value: "اجتماع دوري", label: "اجتماع دوري" },
];

const predefinedSuggestedTitles = [
  "مناقشة الخطة التشغيلية",
  "تقييم أداء الطلاب للفترة الحالية",
  "الاستعداد للاختبارات النهائية",
  "تطوير الأنشطة اللاصفية",
  "متابعة توصيات الاجتماع السابق",
];

const meetingStatuses = ["scheduled", "completed", "cancelled"];

const SchoolMeetingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const fetchMeetings = useCallback(async () => {
    if (!user || !user.school_id) {
      toast({ title: "خطأ", description: "معلومات المدرسة غير متوفرة.", variant: "destructive" });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('school_meetings')
        .select(`*, meeting_attendees ( count )`)
        .eq('school_id', user.school_id)
        .order('meeting_date_gregorian', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast({ title: "خطأ في جلب الاجتماعات", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMeetings();
    }
  }, [user, navigate, fetchMeetings]);

  useEffect(() => {
    let results = meetings;
    if (searchTerm) {
      results = results.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (meeting.organizing_entity && meeting.organizing_entity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filterType) {
      results = results.filter(meeting => meeting.meeting_type === filterType);
    }
    if (filterStatus) {
      results = results.filter(meeting => meeting.status === filterStatus);
    }
    setFilteredMeetings(results);
    setCurrentPage(1); 
  }, [searchTerm, filterType, filterStatus, meetings]);

  const handleCreateMeetingSubmit = async (meetingData) => {
    if (!user || !user.school_id) {
      toast({ title: "خطأ", description: "معلومات المستخدم أو المدرسة غير متوفرة.", variant: "destructive" });
      return;
    }
    setIsSubmittingForm(true);
    try {
      const { attendees, ...newMeetingCoreData } = meetingData;
      const meetingToInsert = {
        ...newMeetingCoreData,
        school_id: user.school_id,
        user_id: user.id,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: insertedMeeting, error: meetingError } = await supabase
        .from('school_meetings')
        .insert(meetingToInsert)
        .select('*, meeting_attendees (count)')
        .single();

      if (meetingError) throw meetingError;

      if (insertedMeeting && attendees && attendees.length > 0) {
        const attendeesToInsert = attendees.map(att => ({
          meeting_id: insertedMeeting.id,
          attendee_name: att.name,
          attendee_role: att.role,
          signature_status: 'pending',
        }));
        const { error: attendeesError } = await supabase
          .from('meeting_attendees')
          .insert(attendeesToInsert);
        if (attendeesError) throw attendeesError;
      }
      
      const finalMeetingData = {
          ...insertedMeeting,
          meeting_attendees: [{ count: attendees ? attendees.length : 0 }]
      };

      setMeetings(prev => [finalMeetingData, ...prev]);
      setShowCreateForm(false);
      toast({ title: "نجاح", description: "تم إنشاء الاجتماع بنجاح." });

    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({ title: "خطأ في الإنشاء", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteMeeting = async (meetingId, meetingTitle) => {
    try {
      const { error: attendeesError } = await supabase
        .from('meeting_attendees')
        .delete()
        .eq('meeting_id', meetingId);
      if (attendeesError) throw attendeesError;
      
      const { error: meetingError } = await supabase
        .from('school_meetings')
        .delete()
        .eq('id', meetingId);
      if (meetingError) throw meetingError;
      
      setMeetings(prev => prev.filter(m => m.id !== meetingId));
      toast({ title: "تم الحذف", description: `تم حذف الاجتماع "${meetingTitle}" بنجاح.` });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({ title: "خطأ في الحذف", description: error.message, variant: "destructive" });
    }
  };
  
  if (loading && meetings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل الاجتماعات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8 arabic-text">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
                <CalendarDays className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                  إدارة الاجتماعات المدرسية
                </CardTitle>
                <CardDescription className="text-gray-600">
                  تنظيم وإنشاء وتتبع جميع اجتماعات المدرسة بكفاءة.
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="gradient-bg-1 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" /> إنشاء اجتماع جديد
            </Button>
          </CardHeader>
        </Card>
      </motion.header>

      {showCreateForm && (
        <CreateMeetingForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateMeetingSubmit}
          isSubmitting={isSubmittingForm}
          meetingTypes={predefinedMeetingTypes}
          suggestedTitles={predefinedSuggestedTitles}
        />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-700">قائمة الاجتماعات</CardTitle>
            <MeetingsFilterControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              meetingTypes={predefinedMeetingTypes}
              meetingStatuses={meetingStatuses}
            />
          </CardHeader>
          <CardContent>
            <MeetingsList
              meetings={filteredMeetings}
              loading={loading && meetings.length > 0}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onDelete={handleDeleteMeeting}
              onEdit={() => { /* TODO: Implement edit functionality */ }}
              onExport={() => { /* TODO: Implement export functionality */ }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SchoolMeetingsPage;