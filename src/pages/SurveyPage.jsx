import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Plus, Trash2, Link2, QrCode, Eye, Sparkles, ChevronDown, BarChart3, AlertTriangle, Settings } from 'lucide-react';
import QRCode from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import SurveyForm from '@/components/survey/SurveyForm';
import SurveyList from '@/components/survey/SurveyList';
import { suggestedSurveyTitlesInitial, targetGroupOptions } from '@/lib/surveyConstants';

const SurveyPage = () => {
  const { user, schoolId: userSchoolId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [surveys, setSurveys] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingSurveys, setLoadingSurveys] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedSurveyTitles, setSuggestedSurveyTitles] = useState(suggestedSurveyTitlesInitial);
  const [showSchoolDataAlert, setShowSchoolDataAlert] = useState(false);

  const fetchSurveys = useCallback(async () => {
    if (!user || !userSchoolId) {
      setLoadingSurveys(false);
      return;
    }
    setLoadingSurveys(true);
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('school_id', userSchoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
      
      const uniqueSuggestedTitles = new Set(suggestedSurveyTitlesInitial);
      (data || []).forEach(survey => {
        if (survey.suggested_titles && Array.isArray(survey.suggested_titles)) {
          survey.suggested_titles.forEach(title => uniqueSuggestedTitles.add(title));
        }
      });
      setSuggestedSurveyTitles(Array.from(uniqueSuggestedTitles));

    } catch (error) {
      console.error("Error fetching surveys:", error);
      toast({ title: "خطأ", description: "لم نتمكن من تحميل الاستبيانات.", variant: "destructive" });
    } finally {
      setLoadingSurveys(false);
    }
  }, [user, userSchoolId, toast]);

  useEffect(() => {
    if (authLoading) {
      setLoadingSurveys(true); // Keep loading surveys true while auth is loading
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!userSchoolId) {
      setShowSchoolDataAlert(true);
      setLoadingSurveys(false); 
    } else {
      setShowSchoolDataAlert(false);
      fetchSurveys();
    }
  }, [user, userSchoolId, navigate, fetchSurveys, authLoading]);

  const handleCreateSurvey = async (newSurveyData) => {
    if (!user || !userSchoolId) {
      toast({ title: "خطأ", description: "معلومات المستخدم أو المدرسة غير متوفرة.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert([{ ...newSurveyData, school_id: userSchoolId, user_id: user.id, suggested_titles: Array.from(new Set([...suggestedSurveyTitles, newSurveyData.title])) }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSurveys(prev => [data, ...prev]);
        setSuggestedSurveyTitles(prev => Array.from(new Set([...prev, newSurveyData.title])));
        toast({ title: "تم إنشاء الاستبيان بنجاح!" });
        setShowCreateModal(false);
      } else {
        throw new Error("لم يتم إرجاع بيانات بعد الإنشاء.");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      toast({ title: "خطأ في الإنشاء", description: error.message || "لم نتمكن من إنشاء الاستبيان.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);
      if (error) throw error;
      setSurveys(prev => prev.filter(s => s.id !== surveyId));
      toast({title: "تم حذف الاستبيان"});
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast({ title: "خطأ", description: "لم نتمكن من حذف الاستبيان.", variant: "destructive" });
    }
  };

  if (authLoading || loadingSurveys && !showSchoolDataAlert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (showSchoolDataAlert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-md w-full"
        >
          <AlertTriangle className="w-20 h-20 text-orange-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 arabic-text">بيانات المدرسة غير مكتملة</h2>
          <p className="text-slate-600 mb-8 arabic-text text-lg leading-relaxed">
            لاستخدام ميزة قياس رضا المستفيدين، يرجى أولاً إكمال بيانات مدرستك في صفحة الإعدادات.
          </p>
          <Button 
            onClick={() => navigate('/settings')}
            className="gradient-bg-2 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-lg px-8 py-3 w-full flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            الانتقال إلى الإعدادات
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mt-4 w-full text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors text-md"
          >
             العودة إلى لوحة التحكم
          </Button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
            </Button>
            <div className="w-10 h-10 gradient-bg-4 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">منصة قياس رضا المستفيدين</h1>
              <p className="text-sm text-gray-600 arabic-text">إنشاء وإدارة استبيانات الرضا</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gradient-bg-1 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> إنشاء استبيان جديد
          </Button>
        </div>
      </motion.header>

      {showCreateModal && (
        <SurveyForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSurvey}
          isSubmitting={isSubmitting}
          suggestedTitles={suggestedSurveyTitles}
          targetGroups={targetGroupOptions}
        />
      )}
      
      <SurveyList
        surveys={surveys}
        onDelete={handleDeleteSurvey}
        onShowCreateModal={() => setShowCreateModal(true)}
        loading={loadingSurveys} 
      />
    </div>
  );
};

export default SurveyPage;