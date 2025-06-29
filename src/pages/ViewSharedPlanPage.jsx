import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import * as Sections from '@/components/plan-summary/sections';
import { Eye, Info, Users, BookOpen, ShieldCheck, Target, Briefcase, Cpu, AlertTriangle, HeartHandshake as Handshake, KeyRound, BarChart2, Loader2, Brain, BookText, ListOrdered, BarChart3, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewSharedPlanPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [planData, setPlanData] = useState(null);
    const [loading, setLoading] = useState(true);

    const sections = [
        { id: 'overview', title: 'نظرة عامة', icon: Eye, component: Sections.OverviewSection },
        { id: 'details', title: 'تفاصيل الخطة', icon: Info, component: Sections.DetailsSection },
        { id: 'structure_team', title: 'هيكل وفريق الخطة', icon: Users, component: Sections.StructureTeamSection },
        { id: 'excellence_committee', title: 'لجنة التميز', icon: ShieldCheck, component: Sections.ExcellenceCommitteeSection },
        { id: 'school_staff', title: 'منسوبي المدرسة', icon: Users, component: Sections.SchoolStaffSummarySection },
        { id: 'plan_sources', title: 'مصادر بناء الخطة', icon: BookText, component: Sections.PlanSourcesSummarySection },
        { id: 'school_aspects', title: 'أولويات التطوير', icon: ListOrdered, component: Sections.SchoolAspectsSummarySection },
        { id: 'self_assessment', title: 'التقويم الذاتي والمستفيدون', icon: BarChart3, component: Sections.SelfAssessmentSummarySection },
        { id: 'ethics', title: 'الميثاق الأخلاقي', icon: BookOpen, component: Sections.EthicsSection },
        { id: 'swot', title: 'تحليل SWOT', icon: '🎯', component: Sections.SwotSection },
        { id: 'education_goals', title: 'أهداف التعليم', icon: Brain, component: Sections.EducationGoalsSummarySection },
        { id: 'goals', title: 'الأهداف الاستراتيجية', icon: Target, component: Sections.GoalsSection },
        { id: 'programs', title: 'البرامج والمبادرات', icon: Briefcase, component: Sections.ProgramsSection },
        { id: 'tech', title: 'استراتيجية التقنية', icon: Cpu, component: Sections.TechSection },
        { id: 'risks', title: 'إدارة المخاطر', icon: AlertTriangle, component: Sections.RisksSection },
        { id: 'partnerships', title: 'الشراكات', icon: Handshake, component: Sections.PartnershipsSection },
        { id: 'staff', title: 'الكادر والتطوير', icon: KeyRound, component: Sections.StaffSection },
        { id: 'plan_monitoring', title: 'متابعة تنفيذ الخطة', icon: ClipboardList, component: Sections.PlanMonitoringSummarySection },
        { id: 'charts', title: 'رسوم بيانية', icon: BarChart2, component: Sections.ChartsSection },
    ];

    const fetchPlanData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: plan, error } = await supabase
                .from('operational_plans')
                .select(`*`)
                .eq('id', planId)
                .eq('is_shared', true)
                .single();

            if (error || !plan) {
                toast({ title: "خطأ", description: "الخطة غير متاحة للمشاركة أو غير موجودة.", variant: "destructive" });
                navigate('/');
                return;
            }
            
            setPlanData(plan);
        } catch (error) {
            toast({ title: "خطأ في تحميل الخطة", description: error.message, variant: "destructive" });
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [planId, navigate, toast]);

    useEffect(() => {
        fetchPlanData();
    }, [fetchPlanData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <Loader2 className="animate-spin h-12 w-12 text-sky-600" />
                <p className="mr-4 text-lg">جاري تحميل الخطة...</p>
            </div>
        );
    }

    if (!planData) {
        return <div className="text-center py-10">لم يتم العثور على بيانات الخطة.</div>;
    }

    const visibleSections = sections.filter(({ component: Component }) => {
        if (!Component) return false;
        const result = Component({ planData });
        return result !== null;
    });

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 arabic-text" dir="rtl">
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-20">
              <div>
                <h1 className="text-2xl font-bold text-sky-800 dark:text-sky-300">{planData.plan_name}</h1>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">ملخص الخطة التشغيلية للعام: {planData.target_academic_year}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <AnimatePresence mode="wait">
            {visibleSections.map(({ id, component: Component }) => (
              <div key={id}>
                <Component planData={planData} />
              </div>
            ))}
          </AnimatePresence>
        </main>
        <footer className="text-center py-4 text-sm text-muted-foreground">
            <p>تم إنشاؤه بواسطة منصة قائد</p>
        </footer>
      </div>
    );
};

export default ViewSharedPlanPage;