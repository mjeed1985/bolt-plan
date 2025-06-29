import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RefreshCcw, Trash2, CheckCircle, XCircle, Loader2, UserPlus, Filter, Users, DollarSign, BarChart2, FileText, Download, ExternalLink, CalendarDays, Tag } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Correctly imported, needs to be installed
import { arSA } from 'date-fns/locale';
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { useAdminAuth } from '@/contexts/AdminAuthContext';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale);

const StatCard = ({ title, value, icon, description, trend, unit = '' }) => (
  <Card className="shadow-lg bg-white dark:bg-gray-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{unit}{value}</div>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      {trend && <p className={`text-xs ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</p>}
    </CardContent>
  </Card>
);

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [filterCity, setFilterCity] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const { toast } = useToast();
  const { logAdminAction } = useAdminAuth();


  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      let usersQuery = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        usersQuery = usersQuery.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      if (filterStatus === 'active') usersQuery = usersQuery.eq('is_subscribed', true);
      if (filterStatus === 'inactive') usersQuery = usersQuery.eq('is_subscribed', false);
      if (filterPaymentMethod !== 'all') usersQuery = usersQuery.eq('payment_method', filterPaymentMethod);
      if (filterCity) usersQuery = usersQuery.ilike('city', `%${filterCity}%`);
      
      let startDateTransformed = null;
      let endDateTransformed = null;

      if (filterDateRange.start) {
        startDateTransformed = `${filterDateRange.start}T00:00:00.000Z`;
        usersQuery = usersQuery.gte('created_at', startDateTransformed);
      }
      if (filterDateRange.end) {
        endDateTransformed = `${filterDateRange.end}T23:59:59.999Z`;
        usersQuery = usersQuery.lte('created_at', endDateTransformed);
      }


      const { data: usersData, error: usersError } = await usersQuery;
      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch payments for revenue calculation (basic)
      const { data: paymentsData, error: paymentsError } = await supabase.from('payments').select('amount, payment_date, status');
      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({ title: "خطأ في جلب البيانات", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, filterPaymentMethod, filterCity, filterDateRange, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSubscriptionAction = async (userId, userName, action) => {
    let updates = {};
    let successMessage = "";
    let logAction = "";

    if (action === 'cancel') {
      updates = { is_subscribed: false, subscription_status: 'cancelled' };
      successMessage = "تم إلغاء اشتراك المستخدم بنجاح.";
      logAction = "user_subscription_cancelled";
    } else if (action === 'renew') {
      updates = { is_subscribed: true, subscription_status: 'active', created_at: new Date().toISOString() };
      successMessage = "تم تجديد اشتراك المستخدم بنجاح.";
      logAction = "user_subscription_renewed";
    } else {
      return;
    }

    try {
      const { error } = await supabase.from('users').update(updates).eq('id', userId);
      if (error) throw error;
      toast({ title: "نجاح", description: successMessage });
      logAdminAction(logAction, { userName: userName, userId: userId }, userId);
      fetchDashboardData(); 
    } catch (error) {
      console.error(`Error ${action} subscription:`, error);
      toast({ title: `خطأ في ${action === 'cancel' ? 'إلغاء' : 'تجديد'} الاشتراك`, description: error.message, variant: "destructive" });
    }
  };
  
  const totalUsers = users.length;
  const activeSubscriptions = users.filter(u => u.is_subscribed).length;
  
  const monthlyRevenue = useMemo(() => {
    return payments
      .filter(p => p.status === 'succeeded' || p.status === 'paid' || p.status === 'active') // Consider 'active' for recurring
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }, [payments]);

  const averageSubscriptionDuration = useMemo(() => {
    if (users.length === 0) return 0;
    const activeSubscribedUsers = users.filter(u => u.is_subscribed && u.created_at);
    if (activeSubscribedUsers.length === 0) return 0;

    const totalDuration = activeSubscribedUsers
      .reduce((sum, u) => {
        const startDate = new Date(u.created_at);
        const endDate = u.subscription_end_date ? new Date(u.subscription_end_date) : new Date();
        return sum + (endDate.getTime() - startDate.getTime());
      }, 0);
    const avgMilliseconds = totalDuration / activeSubscribedUsers.length;
    return Math.floor(avgMilliseconds / (1000 * 60 * 60 * 24)); 
  }, [users]);

  const subscriptionGrowthData = useMemo(() => {
    const last12Months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    });

    const labels = last12Months.map(date => format(date, 'MMM yyyy', { locale: arSA }));
    const data = last12Months.map(monthStart => {
      const monthEnd = endOfMonth(monthStart);
      return users.filter(user => {
        if (!user.created_at) return false;
        try {
            const userCreationDate = parseISO(user.created_at);
            return userCreationDate >= monthStart && userCreationDate <= monthEnd;
        } catch (e) {
            console.warn("Invalid date format for user:", user.id, user.created_at);
            return false;
        }
      }).length;
    });

    return {
      labels,
      datasets: [{
        label: 'عدد الاشتراكات الجديدة',
        data,
        fill: true,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.1,
      }],
    };
  }, [users]);
  
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { 
            color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
            stepSize: 1 
        } 
      },
      x: { 
        ticks: { 
            color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151' 
        } 
      },
    },
    plugins: {
      legend: { 
        labels: { 
            color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
            font: { family: 'Cairo' }
        } 
      },
      tooltip: { 
        titleFont: { family: 'Cairo' }, 
        bodyFont: { family: 'Cairo' },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += context.parsed.y;
                }
                return label;
            }
        }
      }
    },
  }), [document.documentElement.classList.contains('dark')]);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">لوحة التحكم الرئيسية</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="إجمالي المستخدمين" value={totalUsers} icon={<Users className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />} description="جميع المستخدمين المسجلين" />
        <StatCard title="الاشتراكات النشطة" value={activeSubscriptions} icon={<CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />} description="عدد المستخدمين باشتراك فعال" />
        <StatCard title="إجمالي الإيرادات" value={monthlyRevenue.toFixed(2)} unit="ر.س " icon={<DollarSign className="h-5 w-5 text-amber-500 dark:text-amber-400" />} description="الشهر الحالي (مثال)" />
        <StatCard title="متوسط مدة الاشتراك" value={averageSubscriptionDuration > 0 ? averageSubscriptionDuration : 'N/A'} unit={averageSubscriptionDuration > 0 ? ' يوم' : ''} icon={<CalendarDays className="h-5 w-5 text-purple-500 dark:text-purple-400" />} description="للمشتركين النشطين" />
      </div>

      <Card className="shadow-xl bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-indigo-700 dark:text-indigo-300">نمو الاشتراكات (آخر 12 شهرًا)</CardTitle>
        </CardHeader>
        <CardContent className="h-80 md:h-96">
          {loading ? <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto mt-10" /> : 
          users.length > 0 ? <Line options={chartOptions} data={subscriptionGrowthData} /> : <p className="text-center text-gray-500 dark:text-gray-400 mt-10">لا توجد بيانات كافية لعرض الرسم البياني.</p>}
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-300">إدارة المستخدمين والاشتراكات</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">عرض وتعديل معلومات المستخدمين وحالات اشتراكاتهم.</CardDescription>
            </div>
            <Button onClick={fetchDashboardData} variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-gray-700">
              <RefreshCcw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث القائمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow">
            <Input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:flex-1 min-w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[160px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <SelectValue placeholder="حالة الاشتراك" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="active">اشتراك مفعل</SelectItem>
                <SelectItem value="inactive">اشتراك غير مفعل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
              <SelectTrigger className="w-full md:w-[160px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <SelectValue placeholder="وسيلة الدفع" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="myfatoorah">MyFatoorah</SelectItem>
                <SelectItem value="manual">يدوي</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="المدينة..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full md:w-[140px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
            />
            <Input
              type="date"
              value={filterDateRange.start}
              onChange={(e) => setFilterDateRange(prev => ({...prev, start: e.target.value}))}
              className="w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              title="تاريخ البدء"
            />
             <Input
              type="date"
              value={filterDateRange.end}
              onChange={(e) => setFilterDateRange(prev => ({...prev, end: e.target.value}))}
              className="w-full md:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              title="تاريخ الانتهاء"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <p className="ml-4 text-lg text-indigo-700 dark:text-indigo-300">جاري تحميل المستخدمين...</p>
            </div>
          ) : users.length === 0 ? (
             <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">لا يوجد مستخدمون لعرضهم حاليًا.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">حاول تعديل معايير البحث أو الفلترة.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-indigo-50 dark:bg-gray-700/50">
                  <TableRow>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">الاسم</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">حالة الاشتراك</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">المدينة</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">طريقة الدفع</TableHead>
                    <TableHead className="text-right text-indigo-700 dark:text-indigo-300">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-indigo-50/50 dark:hover:bg-gray-700/70 transition-colors">
                      <TableCell className="font-medium text-gray-800 dark:text-gray-200">{user.name || 'غير متوفر'}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_subscribed ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
                        }`}>
                          {user.is_subscribed ? 'مفعل' : 'غير مفعل'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : '-'}</TableCell>
                       <TableCell className="text-gray-600 dark:text-gray-300">{user.city || '-'}</TableCell>
                       <TableCell className="text-gray-600 dark:text-gray-300">{user.payment_method || '-'}</TableCell>
                      <TableCell className="space-x-1 space-x-reverse">
                        {!user.is_subscribed ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-700/30"
                            onClick={() => handleSubscriptionAction(user.id, user.name || user.email, 'renew')}
                          >
                            <CheckCircle className="ml-1 h-4 w-4" /> تجديد
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-700/30"
                            onClick={() => handleSubscriptionAction(user.id, user.name || user.email, 'cancel')}
                          >
                            <XCircle className="ml-1 h-4 w-4" /> إلغاء
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-gray-700" onClick={() => toast({ title: "ملف المستخدم (قيد التطوير)", description: `عرض تفاصيل المستخدم ${user.name || user.email} سيتم إضافته لاحقًا.`})}>
                           <ExternalLink className="ml-1 h-4 w-4" /> تفاصيل
                        </Button>
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

export default AdminDashboardPage;