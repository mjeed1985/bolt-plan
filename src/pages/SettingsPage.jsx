import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    stage: '',
    school_region: '',
    school_id_number: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loadingSchool, setLoadingSchool] = useState(true);
  const [isSavingSchool, setIsSavingSchool] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fetchSchoolInfo = useCallback(async () => {
    if (!user) return;
    setLoadingSchool(true);
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('name, stage, school_region, school_id_number')
        .eq('user_id', user.id)
        .limit(1);

      if (data && data.length > 0) {
        setSchoolInfo(data[0]);
      } else if (error && error.code !== 'PGRST116') {
        throw error;
      }
    } catch (error) {
      console.error('Error fetching school info:', error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل بيانات المدرسة.", variant: "destructive" });
    } finally {
      setLoadingSchool(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchSchoolInfo();
      }
    }
  }, [user, authLoading, navigate, fetchSchoolInfo]);

  const handleSchoolInfoChange = (e) => {
    const { name, value } = e.target;
    setSchoolInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSchoolInfo = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingSchool(true);
    try {
      const { error } = await supabase
        .from('schools')
        .upsert({ ...schoolInfo, user_id: user.id, id: user.user_metadata?.school_id }, { onConflict: 'user_id' });

      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم تحديث بيانات المدرسة بنجاح." });
    } catch (error) {
      console.error('Error updating school info:', error);
      toast({ title: "خطأ", description: "فشل تحديث بيانات المدرسة.", variant: "destructive" });
    } finally {
      setIsSavingSchool(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({ title: "خطأ", description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.", variant: "destructive" });
      return;
    }
    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) throw error;
      toast({ title: "تم بنجاح", description: "تم تغيير كلمة المرور بنجاح." });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({ title: "خطأ", description: "فشل تغيير كلمة المرور.", variant: "destructive" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (authLoading || loadingSchool) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 p-4 sm:p-8 arabic-text">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>
        </div>

        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-indigo-100 text-indigo-700">
            <TabsTrigger value="school"><Building className="inline-block ml-2 h-4 w-4" />بيانات المدرسة</TabsTrigger>
            <TabsTrigger value="profile"><User className="inline-block ml-2 h-4 w-4" />الملف الشخصي</TabsTrigger>
            <TabsTrigger value="security"><Lock className="inline-block ml-2 h-4 w-4" />الأمان</TabsTrigger>
          </TabsList>

          <TabsContent value="school">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>معلومات المدرسة</CardTitle>
                <CardDescription>تحديث البيانات الأساسية لمدرستك.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSchoolInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم المدرسة</Label>
                      <Input id="name" name="name" value={schoolInfo.name} onChange={handleSchoolInfoChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stage">المرحلة الدراسية</Label>
                      <Input id="stage" name="stage" value={schoolInfo.stage} onChange={handleSchoolInfoChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school_region">المنطقة التعليمية</Label>
                      <Input id="school_region" name="school_region" value={schoolInfo.school_region} onChange={handleSchoolInfoChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school_id_number">رقم المدرسة الوزاري</Label>
                      <Input id="school_id_number" name="school_id_number" value={schoolInfo.school_id_number} onChange={handleSchoolInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSavingSchool} className="w-full md:w-auto">
                    {isSavingSchool ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSavingSchool ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>معلومات حسابك الحالي.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input value={user?.email || ''} readOnly disabled className="bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>اختر كلمة مرور قوية لحماية حسابك.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                  </div>
                  <Button type="submit" disabled={isSavingPassword} className="w-full md:w-auto">
                    {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSavingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SettingsPage;