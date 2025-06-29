import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Search, Filter, Trash2, Edit3, Eye, MessageSquare as MessageSquareText, ArrowUpDown } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ParentCommunicationLogPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    studentName: '',
    parentName: '',
    dateRange: '', 
    communicationPurpose: '',
    messageStatus: '',
  });
  const [schoolId, setSchoolId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'communication_date', direction: 'descending' });

  useEffect(() => {
    const fetchSchoolIdAndCommunications = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data: schoolData, error: schoolError } = await supabase
            .from('schools')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (schoolError) throw schoolError;
          if (!schoolData) {
            toast({ title: "خطأ", description: "لم يتم العثور على معلومات المدرسة.", variant: "destructive" });
            setLoading(false);
            return;
          }
          setSchoolId(schoolData.id);

          let query = supabase
            .from('parent_communications')
            .select('*')
            .eq('school_id', schoolData.id);
          
          const { data, error } = await query.order(sortConfig.key, { ascending: sortConfig.direction === 'ascending' });

          if (error) throw error;
          setCommunications(data || []);
        } catch (error) {
          console.error('Error fetching communications:', error);
          toast({ title: 'خطأ', description: 'فشل تحميل سجل التواصل.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSchoolIdAndCommunications();
  }, [user, toast, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        comm.student_name?.toLowerCase().includes(searchLower) ||
        comm.parent_name?.toLowerCase().includes(searchLower) ||
        comm.message_subject?.toLowerCase().includes(searchLower) ||
        comm.message_content?.toLowerCase().includes(searchLower) ||
        comm.initiated_by_name?.toLowerCase().includes(searchLower)
      );

      const matchesFilters = (
        (filters.studentName ? comm.student_name?.toLowerCase().includes(filters.studentName.toLowerCase()) : true) &&
        (filters.parentName ? comm.parent_name?.toLowerCase().includes(filters.parentName.toLowerCase()) : true) &&
        (filters.communicationPurpose ? comm.communication_purpose === filters.communicationPurpose : true) &&
        (filters.messageStatus ? comm.message_status === filters.messageStatus : true)
      );
      return matchesSearch && matchesFilters;
    });
  }, [communications, searchTerm, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const { error } = await supabase.from('parent_communications').delete().eq('id', id);
      if (error) throw error;
      setCommunications(prev => prev.filter(comm => comm.id !== id));
      toast({ title: 'نجاح', description: 'تم حذف سجل التواصل بنجاح.' });
    } catch (error) {
      console.error('Error deleting communication:', error);
      toast({ title: 'خطأ', description: 'فشل حذف سجل التواصل.', variant: 'destructive' });
    }
    setItemToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString; 
    }
  };
  
  const purposeOptions = ['أكاديمي', 'سلوكي', 'إداري', 'تهنئة', 'دعوة لاجتماع', 'other'];
  const statusOptions = ['تم الإرسال', 'تم الاستلام', 'تمت القراءة', 'تم الرد', 'فشل الإرسال'];

  const SortableHeader = ({ columnKey, title }) => (
    <TableHead onClick={() => handleSort(columnKey)} className="cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        {title}
        {sortConfig.key === columnKey && (
          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
        )}
      </div>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل السجل...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <MessageSquareText className="h-10 w-10 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 arabic-text">سجل التواصل مع أولياء الأمور</h1>
              <p className="text-gray-600 arabic-text">عرض وأرشفة جميع رسائل التواصل مع إمكانيات فلترة متقدمة.</p>
            </div>
          </div>
          <Button onClick={() => navigate('/parent-communication/new')} className="gradient-bg-1 text-white hover:opacity-90 arabic-text">
            إنشاء تواصل جديد
          </Button>
        </div>
      </motion.div>

      <Card className="shadow-xl bg-white/90 backdrop-blur-md border-0">
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="ابحث باسم الطالب، ولي الأمر، الموضوع..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 arabic-text w-full"
              />
            </div>
            <Select onValueChange={(value) => handleFilterChange('communicationPurpose', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full md:w-[200px] arabic-text"><Filter className="ml-2 h-4 w-4" /><SelectValue placeholder="فلترة حسب الغرض" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="arabic-text">كل الأغراض</SelectItem>
                {purposeOptions.map(opt => <SelectItem key={opt} value={opt} className="arabic-text">{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('messageStatus', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full md:w-[200px] arabic-text"><Filter className="ml-2 h-4 w-4" /><SelectValue placeholder="فلترة حسب الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="arabic-text">كل الحالات</SelectItem>
                {statusOptions.map(opt => <SelectItem key={opt} value={opt} className="arabic-text">{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 arabic-text">لا توجد سجلات تواصل تطابق معايير البحث أو الفلترة الحالية.</p>
              <p className="text-sm text-gray-500 arabic-text mt-2">حاول تعديل كلمات البحث أو إزالة بعض الفلاتر.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader columnKey="student_name" title="اسم الطالب" />
                  <SortableHeader columnKey="parent_name" title="ولي الأمر" />
                  <SortableHeader columnKey="communication_date" title="تاريخ التواصل" />
                  <SortableHeader columnKey="initiated_by_name" title="المرسل" />
                  <SortableHeader columnKey="communication_purpose" title="الغرض" />
                  <SortableHeader columnKey="message_status" title="الحالة" />
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommunications.map((comm) => (
                  <TableRow key={comm.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium arabic-text py-3">{comm.student_name}</TableCell>
                    <TableCell className="arabic-text py-3">{comm.parent_name}</TableCell>
                    <TableCell className="arabic-text py-3 text-sm text-gray-600">{formatDate(comm.communication_date)}</TableCell>
                    <TableCell className="arabic-text py-3">{comm.initiated_by_name}</TableCell>
                    <TableCell className="arabic-text py-3">{comm.communication_purpose}</TableCell>
                    <TableCell className="arabic-text py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        comm.message_status === 'تمت القراءة' ? 'bg-green-100 text-green-700' :
                        comm.message_status === 'تم الرد' ? 'bg-blue-100 text-blue-700' :
                        comm.message_status === 'فشل الإرسال' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {comm.message_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <div className="flex justify-center items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {/* TODO: View details */}} title="عرض التفاصيل">
                          <Eye className="h-5 w-5 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {/* TODO: Edit (if applicable) */}} title="تعديل">
                          <Edit3 className="h-5 w-5 text-yellow-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setItemToDelete(comm.id)} title="حذف">
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="arabic-text">تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription className="arabic-text">
                                هل أنت متأكد أنك تريد حذف سجل التواصل هذا؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="arabic-text">إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(itemToDelete)} className="bg-red-600 hover:bg-red-700 arabic-text">
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentCommunicationLogPage;