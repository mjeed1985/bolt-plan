import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { getInitialPlanData, validatePlanData } from '@/utils/planDataHelpers';

export const useOperationalPlan = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isPlanLoaded, setIsPlanLoaded] = useState(false);

    const initialPlanDataMemo = useMemo(() => getInitialPlanData(), []);
    const [planData, setPlanData] = useState(initialPlanDataMemo);

    const loadPlanData = useCallback(async (id) => {
        if (!user) return;
        setLoading(true);
        setIsPlanLoaded(false);
        try {
            const { data, error } = await supabase
                .from('operational_plans')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    toast({
                        title: "الخطة غير موجودة",
                        description: "لم يتم العثور على الخطة المطلوبة أو لا تملك صلاحية الوصول إليها.",
                        variant: "destructive",
                    });
                    navigate('/operational-plans');
                    return;
                }
                throw error;
            }

            if (data) {
                const freshInitialData = getInitialPlanData();
                
                const mergedSwotAnalysis = {
                  strengths: (data.swot_analysis && data.swot_analysis.strengths) 
                               ? { selected: data.swot_analysis.strengths.selected || [], custom: data.swot_analysis.strengths.custom || [''] } 
                               : freshInitialData.swot_analysis.strengths,
                  weaknesses: (data.swot_analysis && data.swot_analysis.weaknesses) 
                               ? { selected: data.swot_analysis.weaknesses.selected || [], custom: data.swot_analysis.weaknesses.custom || [''] } 
                               : freshInitialData.swot_analysis.weaknesses,
                  opportunities: (data.swot_analysis && data.swot_analysis.opportunities) 
                               ? { selected: data.swot_analysis.opportunities.selected || [], custom: data.swot_analysis.opportunities.custom || [''] } 
                               : freshInitialData.swot_analysis.opportunities,
                  threats: (data.swot_analysis && data.swot_analysis.threats) 
                               ? { selected: data.swot_analysis.threats.selected || [], custom: data.swot_analysis.threats.custom || [''] } 
                               : freshInitialData.swot_analysis.threats,
                  strategic_visions: (data.swot_analysis && data.swot_analysis.strategic_visions) 
                                     ? data.swot_analysis.strategic_visions 
                                     : freshInitialData.swot_analysis.strategic_visions,
                };

                const mergedEthicsCharter = {
                  charter_text: (data.ethics_charter && data.ethics_charter.charter_text) 
                                ? data.ethics_charter.charter_text 
                                : freshInitialData.ethics_charter.charter_text,
                  core_values: (data.ethics_charter && Array.isArray(data.ethics_charter.core_values))
                               ? data.ethics_charter.core_values
                               : freshInitialData.ethics_charter.core_values,
                };
                
                const mergedTechStrategy = {
                    ...freshInitialData.tech_strategy,
                    ...(data.tech_strategy || {}),
                    goals: (data.tech_strategy && Array.isArray(data.tech_strategy.goals)) ? data.tech_strategy.goals : freshInitialData.tech_strategy.goals,
                    tools: (data.tech_strategy && Array.isArray(data.tech_strategy.tools)) ? data.tech_strategy.tools : freshInitialData.tech_strategy.tools,
                    kpis: (data.tech_strategy && Array.isArray(data.tech_strategy.kpis)) ? data.tech_strategy.kpis : freshInitialData.tech_strategy.kpis,
                };

                setPlanData({ 
                  ...freshInitialData, 
                  ...data, 
                  planning_committee_data: data.planning_committee_data && Array.isArray(data.planning_committee_data) ? data.planning_committee_data : freshInitialData.planning_committee_data,
                  team_responsibilities_data: data.team_responsibilities_data || freshInitialData.team_responsibilities_data,
                  excellence_committee_members: data.excellence_committee_members && Array.isArray(data.excellence_committee_members) ? data.excellence_committee_members : freshInitialData.excellence_committee_members,
                  excellence_committee_responsibilities: data.excellence_committee_responsibilities || freshInitialData.excellence_committee_responsibilities,
                  school_staff_list: data.school_staff_list && Array.isArray(data.school_staff_list) ? data.school_staff_list : freshInitialData.school_staff_list,
                  plan_sources_text: data.plan_sources_text || freshInitialData.plan_sources_text,
                  ranked_school_aspects: data.ranked_school_aspects && Array.isArray(data.ranked_school_aspects) ? data.ranked_school_aspects : freshInitialData.ranked_school_aspects,
                  detailed_school_aspects: data.detailed_school_aspects || freshInitialData.detailed_school_aspects,
                  self_assessment_domains_notes: data.self_assessment_domains_notes || freshInitialData.self_assessment_domains_notes,
                  beneficiaries_data: data.beneficiaries_data && Array.isArray(data.beneficiaries_data) ? data.beneficiaries_data : freshInitialData.beneficiaries_data,
                  general_strategic_goals_text: data.general_strategic_goals_text || freshInitialData.general_strategic_goals_text,
                  stage_specific_goals_data: data.stage_specific_goals_data || freshInitialData.stage_specific_goals_data,
                  implementation_strategies_text: data.implementation_strategies_text || freshInitialData.implementation_strategies_text,
                  plan_implementation_monitoring: data.plan_implementation_monitoring && Array.isArray(data.plan_implementation_monitoring) ? data.plan_implementation_monitoring : freshInitialData.plan_implementation_monitoring,
                  swot_analysis: mergedSwotAnalysis,
                  ethics_charter: mergedEthicsCharter,
                  strategic_goals: data.strategic_goals && Array.isArray(data.strategic_goals) ? data.strategic_goals : freshInitialData.strategic_goals,
                  programs_initiatives: data.programs_initiatives && Array.isArray(data.programs_initiatives) ? data.programs_initiatives : freshInitialData.programs_initiatives,
                  tech_strategy: mergedTechStrategy,
                  risks_management: data.risks_management && Array.isArray(data.risks_management) ? data.risks_management : freshInitialData.risks_management,
                  partnerships: data.partnerships && Array.isArray(data.partnerships) ? data.partnerships : freshInitialData.partnerships,
                  staff_development: data.staff_development || freshInitialData.staff_development,
                  evaluation_monitoring: data.evaluation_monitoring || freshInitialData.evaluation_monitoring,
                  teacher_count: data.teacher_count ?? 0,
                  student_count: data.student_count ?? 0,
                  admin_count: data.admin_count ?? 0,
                  classroom_count: data.classroom_count ?? 0,
                  multi_year_plan_duration: data.multi_year_plan_duration === undefined ? null : data.multi_year_plan_duration,
                });
            } else {
                toast({
                    title: "الخطة غير موجودة",
                    description: "لم يتم العثور على بيانات الخطة المطلوبة.",
                    variant: "destructive",
                });
                navigate('/operational-plans');
                return;
            }
        } catch (error) {
            console.error('Error loading plan:', error);
            toast({
                title: "خطأ في التحميل",
                description: `حدث خطأ أثناء تحميل بيانات الخطة: ${error.message}`,
                variant: "destructive"
            });
            navigate('/operational-plans');
        } finally {
            setLoading(false);
            setIsPlanLoaded(true);
        }
    }, [user, toast, navigate]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (planId) {
            loadPlanData(planId);
        } else {
            setPlanData(initialPlanDataMemo);
            setIsPlanLoaded(true);
            setLoading(false);
        }
    }, [user, navigate, planId, loadPlanData, initialPlanDataMemo]);

    const handlePlanDataChange = (newData) => {
        setPlanData(prevData => ({ ...prevData, ...newData }));
    };

    const handleSectionSpecificChange = (sectionKey, data) => {
        setPlanData(prevData => ({
            ...prevData,
            [sectionKey]: data
        }));
    };

    const savePlan = useCallback(async (newStatus = planData.status, showSuccessToast = true) => {
        if (!user) {
            toast({
                title: "خطأ",
                description: "يجب تسجيل الدخول لحفظ الخطة.",
                variant: "destructive"
            });
            return null;
        }

        setLoading(true);
        if (showSuccessToast) {
            toast({
                title: "جاري الحفظ...",
                description: "يتم الآن حفظ بيانات الخطة التشغيلية.",
            });
        }

        const dataToSave = { ...planData, user_id: user.id, status: newStatus };

        Object.keys(dataToSave).forEach(key => {
            if (dataToSave[key] === undefined) {
                dataToSave[key] = null;
            }
        });

        if (dataToSave.plan_nature !== 'multi_year') {
            dataToSave.multi_year_plan_duration = null;
        }

        const validatedData = validatePlanData(dataToSave);

        try {
            let result;
            let operationSucceeded = false;
            const currentPlanId = planData.id || planId;

            if (currentPlanId) {
                const { data, error } = await supabase
                    .from('operational_plans')
                    .update(validatedData)
                    .eq('id', currentPlanId)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
                operationSucceeded = true;
            } else {
                const { data, error } = await supabase
                    .from('operational_plans')
                    .insert(validatedData)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
                operationSucceeded = true;

                if (result?.id) {
                    setPlanData(prev => ({ ...prev, id: result.id }));
                    if (window.location.pathname.includes('/new')) {
                        navigate(`/operational-plans/edit/${result.id}`, { replace: true });
                    }
                }
            }

            if (operationSucceeded && showSuccessToast) {
                toast({
                    title: "تم حفظ البيانات بنجاح",
                    description: "تم حفظ بيانات الخطة التشغيلية.",
                });
            }
            return result;

        } catch (error) {
            console.error('Error saving plan:', error);
            toast({
                title: "حدث خطأ أثناء الحفظ",
                description: `فشل حفظ الخطة: ${error.message}`,
                variant: "destructive",
            });
            return null;
        } finally {
            setLoading(false);
        }
    }, [user, planData, planId, navigate, toast]);

    return {
        planId,
        planData,
        loading,
        isPlanLoaded,
        currentSectionIndex,
        setCurrentSectionIndex,
        handlePlanDataChange,
        handleSectionSpecificChange,
        savePlan,
    };
};