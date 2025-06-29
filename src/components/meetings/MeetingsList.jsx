import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, FileText, Users, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const MeetingsList = ({ meetings, loading, currentPage, setCurrentPage, onDelete, onEdit, onExport }) => {
  const navigate = useNavigate();
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  const totalPages = Math.ceil(meetings.length / ITEMS_PER_PAGE);
  const paginatedMeetings = meetings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const formatMeetingDate = (gregorianDate) => {
    if (!gregorianDate) return 'غير محدد';
    try {
      return new Date(gregorianDate).toLocaleDateString('ar-SA-u-nu-latn', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) { return gregorianDate; }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return { label: 'مجدول', color: 'bg-blue-500' };
      case 'completed': return { label: 'مكتمل', color: 'bg-green-500' };
      case 'cancelled': return { label: 'ملغى', color: 'bg-red-500' };
      default: return { label: status || 'غير محدد', color: 'bg-gray-500' };
    }
  };

  const handleDeleteConfirmation = () => {
    if (meetingToDelete) {
      onDelete(meetingToDelete.id, meetingToDelete.title);
      setMeetingToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-gray-600">تحديث القائمة...</p>
      </div>
    );
  }

  if (paginatedMeetings.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">لا توجد اجتماعات تطابق معايير البحث أو التصفية الحالية.</p>
        {meetings.length > 0 && (
             <p className="text-sm text-gray-500 mt-2">قد تحتاج إلى تعديل الفلاتر لعرض المزيد من النتائج.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المقر</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحضور</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedMeetings.map((meeting) => {
              const statusInfo = getStatusLabel(meeting.status);
              const attendeeCount = meeting.meeting_attendees && meeting.meeting_attendees.length > 0 && meeting.meeting_attendees[0].count !== undefined ? meeting.meeting_attendees[0].count : (meeting.attendees ? meeting.attendees.length : 0);
              return (
                <motion.tr 
                    key={meeting.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meeting.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.meeting_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMeetingDate(meeting.meeting_date_gregorian)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-1" /> {attendeeCount} / {meeting.member_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color} text-white`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-1 space-x-reverse">
                    <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-900 h-8 w-8" onClick={() => navigate(`/meetings-log/view/${meeting.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-900 h-8 w-8" onClick={() => onEdit(meeting)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900 h-8 w-8" onClick={() => onExport(meeting)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900 h-8 w-8" onClick={() => setMeetingToDelete(meeting)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      {meetingToDelete && meetingToDelete.id === meeting.id && (
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الاجتماع بشكل دائم: "{meetingToDelete.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setMeetingToDelete(null)}>إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirmation} className="bg-red-600 hover:bg-red-700">نعم، قم بالحذف</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <Button onClick={goToPreviousPage} disabled={currentPage === 1} variant="outline" className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" /> السابق
          </Button>
          <span className="text-sm text-gray-700">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="outline" className="flex items-center gap-2">
            التالي <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default MeetingsList;