import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; 
import { useToast } from "@/components/ui/use-toast";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const ADMIN_EMAIL_FOR_PASSWORD_AUTH = "idaxxx.sa@gmail.com";
  const ADMIN_PASSWORD = "123456";

  useEffect(() => {
    const checkAdminSession = async () => {
      setLoading(true);
      try {
        const adminLoggedIn = localStorage.getItem('isAdminLoggedIn');
        const adminUserId = localStorage.getItem('adminUserId');

        if (adminLoggedIn === 'true' && adminUserId) {
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', adminUserId)
            .eq('role', 'admin')
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is handled
            console.error("Error fetching admin user from DB:", error);
            throw error; 
          }

          if (user) {
            setIsAdmin(true);
            setAdminUser(user);
          } else {
            // User not found in DB with admin role or ID mismatch, clear session
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('adminUserId');
            setIsAdmin(false);
            setAdminUser(null);
            // Optionally, inform the user their session was invalid
            // toast({ title: "جلسة المدير غير صالحة", description: "يرجى تسجيل الدخول مرة أخرى.", variant: "destructive" });
          }
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
        // Clear local storage on any error to prevent invalid state
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUserId');
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAdminSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    let loggedInSuccessfully = false; 
    try {
      if (email.toLowerCase() === ADMIN_EMAIL_FOR_PASSWORD_AUTH.toLowerCase() && password === ADMIN_PASSWORD) {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email.toLowerCase())
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found, handled below
            console.error("Database error during admin login:", error);
            throw error; 
        }
        
        if (user) {
          setIsAdmin(true);
          setAdminUser(user);
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('adminUserId', user.id);
          toast({ title: "تم تسجيل الدخول بنجاح", description: `مرحباً بك ${user.name || 'أيها المدير'}.` });
          
          await supabase.from('admin_audit_logs').insert({
            admin_user_id: user.id,
            action: 'admin_login_success',
            details: { email: user.email }
          }).catch(err => console.error("Error logging admin_login_success:", err));
          
          loggedInSuccessfully = true;
          navigate('/admin/dashboard');

        } else {
          toast({ title: "فشل تسجيل الدخول", description: "بيانات الاعتماد صحيحة ولكن لم يتم العثور على حساب مدير مطابق أو أن الدور غير صحيح.", variant: "destructive" });
          await supabase.from('admin_audit_logs').insert({
            action: 'admin_login_failed_no_admin_found',
            details: { email: email }
          }).catch(err => console.error("Error logging admin_login_failed_no_admin_found:", err));
        }
      } else {
        toast({ title: "فشل تسجيل الدخول", description: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", variant: "destructive" });
        await supabase.from('admin_audit_logs').insert({
          action: 'admin_login_failed_credentials',
          details: { email: email }
        }).catch(err => console.error("Error logging admin_login_failed_credentials:", err));
      }
    } catch (error) {
      console.error("Unhandled error during admin login:", error);
      toast({ title: "خطأ في تسجيل الدخول", description: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.", variant: "destructive" });
    } finally {
      setLoading(false);
      // If login failed, ensure state is clean
      if (!loggedInSuccessfully) {
        setIsAdmin(false);
        setAdminUser(null);
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUserId');
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    if (adminUser) {
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: adminUser.id,
        action: 'admin_logout',
        details: { email: adminUser.email }
      }).catch(err => console.error("Error logging admin_logout:", err));
    }
    setIsAdmin(false);
    setAdminUser(null);
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUserId');
    setLoading(false);
    toast({ title: "تم تسجيل الخروج", description: "تم تسجيل خروجك من لوحة التحكم." });
    navigate('/admin/login');
  };

  const logAdminAction = async (action, details = {}, targetUserId = null) => {
    if (!adminUser || !isAdmin) return;
    try {
      await supabase.from('admin_audit_logs').insert({
        admin_user_id: adminUser.id,
        action,
        target_user_id: targetUserId,
        details: { ...details, admin_email: adminUser.email }
      });
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminUser, login, logout, loading, logAdminAction }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};