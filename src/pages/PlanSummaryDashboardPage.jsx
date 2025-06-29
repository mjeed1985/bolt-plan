import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sections from '@/components/plan-summary/sections';
import { Eye, Info, Users, BookOpen, ShieldCheck, Target, Briefcase, Cpu, AlertTriangle, HeartHandshake as Handshake, KeyRound, BarChart2, Loader2, Brain, BookText, ListOrdered, BarChart3, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanSummary } from '@/hooks/usePlanSummary';
import SummaryPageHeader from '@/components/plan-summary/layout/SummaryPageHeader';
import SummarySidebar from '@/components/plan-summary/layout/SummarySidebar';
import SummaryMainContent from '@/components/plan-summary/layout/SummaryMainContent';
import SummaryModals from '@/components/plan-summary/layout/SummaryModals';
import { Button } from '@/components/ui/button';

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

const PlanSummaryDashboardPage = () => {
    const {
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
    } = usePlanSummary();

    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const sectionRefs = useRef({});

    useEffect(() => {
        const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1024);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const scrollToSection = (sectionId) => {
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(sectionId);
        setIsSidebarOpen(false);
    };

    const handleIntersection = useCallback((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
            }
        });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0.1,
        });

        const currentRefs = sectionRefs.current;
        Object.values(currentRefs).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            Object.values(currentRefs).forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [planData, handleIntersection]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="relative">
                        <Loader2 className="animate-spin h-16 w-16 text-white mx-auto mb-4" />
                        <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-white/20 animate-ping"></div>
                    </div>
                    <p className="text-white text-xl font-medium">جاري تحميل ملخص الخطة...</p>
                    <p className="text-white/70 text-sm mt-2">يرجى الانتظار قليلاً</p>
                </motion.div>
            </div>
        );
    }

    if (!planData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">لم يتم العثور على بيانات الخطة</h2>
                    <Button onClick={() => navigate('/operational-plans')} className="bg-white text-gray-900 hover:bg-gray-100">
                        العودة للخطط
                    </Button>
                </div>
            </div>
        );
    }
    
    const visibleSections = sections.filter(({ component: Component }) => {
        if (!Component) return false;
        const result = Component({ planData });
        return result !== null;
    });

    const shouldShowSidebar = isSidebarOpen || isLargeScreen;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 arabic-text" dir="rtl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            
            <SummaryPageHeader
                planData={planData}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onShare={() => setDialogs(d => ({ ...d, share: true }))}
                onUploadTemplate={() => setDialogs(d => ({ ...d, upload: true }))}
                onPreview={() => setDialogs(d => ({ ...d, preview: true }))}
                onExportPptx={handleExportPptx}
                isExportingPptx={isExportingPptx}
                onExportPdf={handleExportPdf}
                isExportingPdf={isExportingPdf}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <AnimatePresence>
                        {shouldShowSidebar && (
                            <motion.aside
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className={`${isSidebarOpen ? 'fixed inset-y-0 right-0 z-50' : ''} w-80 lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)] overflow-y-auto`}
                            >
                                <SummarySidebar
                                    sections={visibleSections}
                                    activeSection={activeSection}
                                    onScrollToSection={scrollToSection}
                                    onClose={() => setIsSidebarOpen(false)}
                                />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    <SummaryMainContent
                        sections={visibleSections}
                        sectionRefs={sectionRefs}
                        planData={planData}
                    />
                </div>
            </div>

            {isSidebarOpen && !isLargeScreen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <SummaryModals
                planData={planData}
                dialogs={dialogs}
                setDialogs={setDialogs}
                templateUrl={templateUrl}
                onDataRefresh={fetchPlanData}
                onConfirmExportPptx={confirmExportPptx}
                onShareStateChange={handleShareStateChange}
            />
        </div>
    );
};

export default PlanSummaryDashboardPage;