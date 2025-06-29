import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, Mail, Lock, User, School, ListChecks, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    schoolName: '',
    schoolStage: '',
    studentCount: ''
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setEmailError('');

    try {
      if (!validateEmail(formData.email)) {
        throw new Error("عنوان البريد الإلكتروني غير صالح. يرجى إدخال بريد إلكتروني صحيح");
      }

      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "تم تسجيل الدخول بنجاح!",
          description: "مرحباً بك مجدداً في المنصة",
        });
        navigate('/dashboard');
      } else {
        if (!formData.name || !formData.schoolName || !formData.schoolStage || !formData.studentCount) {
          throw new Error("يرجى ملء جميع الحقول المطلوبة");
        }

        if (formData.password.length < 6) {
          throw new Error("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
        }

        if (isNaN(formData.studentCount) || parseInt(formData.studentCount) <= 0) {
          throw new Error("يرجى إدخال عدد صحيح وموجب للطلاب");
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              school_name: formData.schoolName,
              school_stage: formData.schoolStage,
              student_count: parseInt(formData.studentCount)
            }
          }
        });

        if (authError) {
          if (authError.message.includes("email_address_invalid")) {
            throw new Error("عنوان البريد الإلكتروني غير صالح. يرجى إدخال بريد إلكتروني صحيح");
          }
          if (authError.message.toLowerCase().includes("failed to fetch")) {
            throw new Error("فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت أو تعطيل إضافات المتصفح التي قد تعيق الاتصال.");
          }
          throw authError;
        }

        const { error: schoolError } = await supabase
          .from('schools')
          .insert([
            {
              name: formData.schoolName,
              stage: formData.schoolStage,
              student_count: parseInt(formData.studentCount),
              user_id: authData.user.id
            }
          ])
          .select()
          .single();

        if (schoolError) throw schoolError;

        toast({
          title: "تم إنشاء الحساب بنجاح!",
          description: `أهلاً بك في المنصة، ${formData.name}!`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const errorMessage = error.message.includes("duplicate key") 
        ? "هذا البريد الإلكتروني مسجل مسبقاً" 
        : error.message.includes("Invalid login credentials")
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : error.message;
      
      if (errorMessage.includes("البريد الإلكتروني")) {
        setEmailError(errorMessage);
      }
      
      toast({
        title: "حدث خطأ",
        description: errorMessage || "يرجى المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'email') {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 gradient-bg-1 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse-glow">
            <ListChecks className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 arabic-text">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-gray-600 arabic-text">
            {isLogin ? 'مرحباً بك مجدداً في منصة الجدول والخطابات الذكية' : 'انضم إلينا وابدأ في إدارة مدرستك بذكاء'}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right arabic-text font-medium">
                      اسم المسؤول
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pr-10 text-right arabic-text"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-right arabic-text font-medium">
                      اسم المدرسة
                    </Label>
                    <div className="relative">
                      <School className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="schoolName"
                        name="schoolName"
                        type="text"
                        required={!isLogin}
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="pr-10 text-right arabic-text"
                        placeholder="أدخل اسم المدرسة"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolStage" className="text-right arabic-text font-medium">
                      المرحلة الدراسية
                    </Label>
                    <select
                      id="schoolStage"
                      name="schoolStage"
                      required={!isLogin}
                      value={formData.schoolStage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-right arabic-text bg-white"
                    >
                      <option value="">اختر المرحلة الدراسية</option>
                      <option value="kindergarten">رياض الأطفال</option>
                      <option value="primary">الابتدائية</option>
                      <option value="middle">المتوسطة</option>
                      <option value="secondary">الثانوية</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentCount" className="text-right arabic-text font-medium">
                      عدد طلاب المدرسة
                    </Label>
                    <div className="relative">
                      <Users className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="studentCount"
                        name="studentCount"
                        type="number"
                        required={!isLogin}
                        value={formData.studentCount}
                        onChange={handleInputChange}
                        className="pr-10 text-right arabic-text"
                        placeholder="أدخل عدد الطلاب"
                        min="1"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right arabic-text font-medium">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pr-10 text-right ${emailError ? 'border-red-500' : ''}`}
                    placeholder="example@school.com"
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 text-right mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right arabic-text font-medium">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 text-right"
                    placeholder="أدخل كلمة المرور"
                    minLength={6}
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 text-right mt-1">
                    يجب أن تتكون كلمة المرور من 6 أحرف على الأقل
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg-1 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl py-3 text-lg arabic-text"
              >
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-800 transition-colors arabic-text"
              >
                {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً الآن!' : 'لديك حساب بالفعل؟ سجل الدخول'}
              </button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 arabic-text"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;