import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { generatePdf } from '@/components/plan-summary/pdfGenerator';
import { generatePptx } from '@/components/plan-summary/pptxGenerator';

export const usePlanSummary = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isExportingPptx, setIsExportingPptx] = useState(false);
    const [templateUrl, setTemplateUrl] = useState(null);
    const [dialogs, setDialogs] = useState({
        preview: false,
        pptx: false,
        upload: false,
        share: false,
    });

    const getDisplayValue = useCallback((value, optionsArray, placeholder = "غير محدد") => {
        if (value === null || value === undefined || value === '') return placeholder;
        const foundOption = optionsArray.find(opt => String(opt.value) === String(value));
        return foundOption ? foundOption.label : String(value);
    }, []);

    const fetchPlanData = useCallback(async () => {
        if (!user || !planId) {
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const { data: plan, error: planError } = await supabase
                .from('operational_plans')
                .select(`*`)
                .eq('id', planId)
                .eq('user_id', user.id)
                .single();

            if (planError) {
                if (planError.code === 'PGRST116') {
                    toast({ title: "خطأ", description: "لم يتم العثور على الخطة أو لا تملك صلاحية الوصول إليها.", variant: "destructive" });
                    navigate('/operational-plans');
                    return;
                }
                throw planError;
            }
            
            setPlanData(plan);

            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('operational_plan_template_url')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (schoolError && schoolError.code !== 'PGRST116') {
                console.warn("Could not fetch school template URL:", schoolError.message);
            }
            
            setTemplateUrl(schoolData?.operational_plan_template_url || null);

        } catch (error) {
            toast({ title: "خطأ في تحميل الخطة", description: error.message, variant: "destructive" });
            console.error("Error fetching plan:", error);
            navigate('/operational-plans');
        } finally {
            setLoading(false);
        }
    }, [planId, user, navigate, toast]);

    useEffect(() => {
        fetchPlanData();
    }, [fetchPlanData]);

    const handleExportPdf = async () => {
        if (!planData) return;
        setIsExportingPdf(true);
        try {
            await generatePdf(planData, templateUrl);
            toast({ title: "تم التصدير بنجاح", description: "تم إنشاء ملف PDF للخطة." });
        } catch (error) {
            toast({ title: "خطأ في التصدير", description: error.message, variant: "destructive" });
        } finally {
            setIsExportingPdf(false);
        }
    };
    
    const handleExportPptx = () => {
        if (!planData) return;
        setDialogs(d => ({ ...d, pptx: true }));
    };

    const confirmExportPptx = async () => {
      setDialogs(d => ({ ...d, pptx: false }));
      setIsExportingPptx(true);
      try {
          await generatePptx(planData, templateUrl, getDisplayValue);
          toast({ title: "تم التصدير بنجاح", description: "تم إنشاء ملف PowerPoint للخطة." });
      } catch (error) {
          toast({ title: "خطأ في التصدير", description: error.message, variant: "destructive" });
      } finally {
          setIsExportingPptx(false);
      }
    };

    const handleShareStateChange = (isShared) => {
        setPlanData(prev => ({ ...prev, is_shared: isShared }));
    };

    return {
        planData,
        loading,
        isExportingPdf,
        isExportingPptx,
        dialogs,
        setDialogs,
        templateUrl,
        fetchPlanData,
        handleExportPdf,
        handleExportPptx,
        confirmExportPptx,
        handleShareStateChange,
    };
};