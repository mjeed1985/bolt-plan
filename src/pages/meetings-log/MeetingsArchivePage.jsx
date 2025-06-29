import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FileArchive, ArrowRight, Search, Filter, Eye, Users, UserCheck, User2 as UserTie, CalendarDays, Home } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const MeetingsArchivePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const meetingCategories = [
    { id: 'all', label: 'جميع الفئات' },
    { id: 'committee_team', label: 'اجتماعات اللجان/الفرق', icon: Users },
    { id: 'specialization', label: 'اجتماعات التخصصات', icon: UserCheck },
    { id: 'individual', label: 'الاجتماعات الفردية', icon: UserTie },
    { id: 'general_meeting', label: 'اجتماع عام', icon: CalendarDays }, 
    { id: 'committee_team_general', label: 'اجتماع لجنة/فريق (عام)' },
    { id: 'specialization_general', label: 'اجتماع تخصص (عام)' },
  ];

  const fetchArchivedMeetings = useCallback(async () => {
    if (!user || !user.school_id) {
      toast({ title: "خطأ", description: "معلومات المدرسة أو المستخدم غير متوفرة.", variant: "destructive" });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('school_meetings')
        .select('*') 
        .eq('school_id', user.school_id)
        .order('meeting_date_gregorian', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
      setFilteredMeetings(data || []);
    } catch (error) {
      console.error("Error fetching archived meetings:", error);
      toast({ title: "خطأ في جلب الأرشيف", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchArchivedMeetings();
  }, [user, navigate, fetchArchivedMeetings]);

  useEffect(() => {
    let results = meetings;
    if (searchTerm) {
      results = results.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.meeting_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCategory && filterCategory !== 'all') {
        if (filterCategory === 'committee_team_general') {
            results = results.filter(meeting => meeting.meeting_type === 'اجتماع لجنة/فريق');
        } else if (filterCategory === 'specialization_general') {
            results = results.filter(meeting => meeting.meeting_type === 'اجتماع تخصص');
        } else {
            results = results.filter(meeting => meeting.meeting_category === filterCategory || meeting.meeting_type === filterCategory);
        }
    }
    setFilteredMeetings(results);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, meetings]);

  const totalPages = Math.ceil(filteredMeetings.length / ITEMS_PER_PAGE);
  const paginatedMeetings = filteredMeetings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatMeetingDate = (gregorianDate) => {
    if (!gregorianDate) return 'غير محدد';
    try {
      return new Date(gregorianDate).toLocaleDateString('ar-SA-u-nu-latn', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return gregorianDate; }
  };
  
  const getCategoryIcon = (category) => {
    const catInfo = meetingCategories.find(c => c.id === category);
    if (catInfo && catInfo.icon) return <catInfo.icon className="w-5 h-5 mr-2 text-gray-500" />;
    
    if (category && category.includes("لجن") || category && category.includes("فريق")) return <Users className="w-5 h-5 mr-2 text-gray-500" />;
    if (category && category.includes("تخصص")) return <UserCheck className="w-5 h-5 mr-2 text-gray-500" />;
    if (category && category.includes("فردي")) return <UserTie className="w-5 h-5 mr-2 text-gray-500" />;
    return <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />;
  };


  if (loading && meetings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-slate-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-700"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل أرشيف الاجتماعات...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-4 md:p-8 arabic-text"
    >
      <Card className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-xl border-0">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <FileArchive className="w-7 h-7" />
              أرشيف الاجتماعات المدرسية
            </CardTitle>
            <Button variant="ghost" onClick={() => navigate('/meetings-log')} className="flex items-center gap-1 text-sm">
              <Home className="w-4 h-4" /> العودة لسجل الاجتماعات
            </Button>
          </div>
          <CardDescription className="text-gray-600">تصفح واطلع على تفاصيل الاجتماعات المحفوظة.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث في عنوان الاجتماع أو نوعه..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger><SelectValue placeholder="تصفية حسب فئة الاجتماع" /></SelectTrigger>
              <SelectContent>
                {meetingCategories.map(cat => <SelectItem key={cat.id} value={cat.id} className="justify-end">{cat.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {paginatedMeetings.length === 0 && !loading ? (
            <div className="text-center py-12">
              <FileArchive className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-500">لا توجد اجتماعات مؤرشفة تطابق بحثك أو التصفية.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedMeetings.map(meeting => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-200 border-gray-200">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-indigo-700 flex items-center">
                            {getCategoryIcon(meeting.meeting_category || meeting.meeting_type)}
                            {meeting.title}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            النوع: {meeting.meeting_type} | التاريخ: {formatMeetingDate(meeting.meeting_date_gregorian)} | الحالة: {meeting.status || 'مكتمل'}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/meetings-log/view/${meeting.id}`)} className="flex items-center gap-1 text-sm text-indigo-600 border-indigo-400 hover:bg-indigo-50">
                          <Eye className="w-4 h-4" /> عرض التفاصيل
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2 space-x-reverse">
              <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline">
                السابق
              </Button>
              <span className="text-sm text-gray-700">صفحة {currentPage} من {totalPages}</span>
              <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline">
                التالي
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MeetingsArchivePage;