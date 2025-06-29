<<<<<<< HEAD
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
=======
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Home, AlertTriangle, Edit3, Download, Eye, Info, BarChart3, Users, BookOpen, Target, ShieldCheck, Briefcase, Users2 as UsersTwo, TrendingUp, CalendarDays, Building, Mail, Phone, UserCheck, Hash, MapPin, Layers, Book, ChevronsRight, Activity, Lightbulb, Zap, ShieldAlert as ShieldAlertIcon, Sparkles as SparklesIcon, Gem, CheckCircle, ListChecks, Cpu, Users as UsersIcon, TrendingUp as TrendingUpIcon, Settings, Briefcase as BriefcaseIcon, BarChart3 as BarChart3Icon, CheckSquare, ListChecks as ListChecksIcon, DollarSign, Megaphone, Wrench as ToolIcon, BarChart2 as BarChart2Icon, AlertOctagon, HeartHandshake as Handshake, KeyRound as UsersRound, GraduationCap, FileImage, Users as CommitteeIcon, FileText as ResponsibilitiesIcon } from 'lucide-react';

import SummarySection from '@/components/plan-summary/SummarySection';
import MetricCard from '@/components/plan-summary/MetricCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import SwotItemCard from '@/components/plan-summary/SwotItemCard';
import CoreValueDisplayCard from '@/components/plan-summary/CoreValueDisplayCard';
import SectionCard from '@/components/plan-summary/SectionCard';
import PptxExportDialog from '@/components/plan-summary/PptxExportDialog';
import TemplateUploadDialog from '@/components/operational-plan/TemplateUploadDialog';
import { generatePptx } from '@/components/plan-summary/pptxGenerator';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import { 
  STUDENT_GENDER_TYPES, 
  PLAN_NATURES,
  EDUCATION_DEPARTMENTS,
  SCHOOL_STAGES,
  BUILDING_TYPES,
  RISK_CATEGORIES,
  RISK_STRATEGIES,
  RISK_RESPONSIBLE_PARTIES,
  RISK_SEVERITY_LEVELS,
  PARTNERSHIP_TYPES,
  STAFF_SPECIALIZATIONS_KSA,
  TRAINING_AREAS,
  COMMITTEE_MEMBER_ROLES,
  JOB_TITLES_KSA
} from '@/lib/operationalPlanConstants'; 
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';
import { 
  PROGRAM_OR_INITIATIVE_TYPES,
  SUGGESTED_PROGRAMS,
  SUGGESTED_INITIATIVES,
  RESPONSIBLE_PARTIES_OPTIONS,
  KPI_PROGRAM_OPTIONS,
  KPI_INITIATIVE_OPTIONS,
  DURATION_PROGRAM_OPTIONS,
  DURATION_INITIATIVE_OPTIONS,
  COMMUNICATION_METHODS_OPTIONS
} from '@/lib/programsOptions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const iconMapping = {
  '📚': BookOpen, '🤝': UsersIcon, '🌟': TrendingUpIcon, '👩‍💼': Settings,
  '📈': BriefcaseIcon, '💻': Cpu, '✅': BarChart3Icon, '🎯': Target, '💡': Lightbulb,
};

const PlanSummaryDashboardPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user, schoolId } = useAuth();
  const { toast } = useToast();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showPptxPreviewDialog, setShowPptxPreviewDialog] = useState(false);
  const [showTemplateUploadDialog, setShowTemplateUploadDialog] = useState(false);
  const [planTemplateUrl, setPlanTemplateUrl] = useState(null);

  const getDisplayValue = (value, optionsArray, placeholder = "غير محدد") => {
    if (value === null || value === undefined || value === '') return placeholder;
    const foundOption = optionsArray.find(opt => opt.value === value);
    return foundOption ? foundOption.label : value;
  };

  const loadPlanData = useCallback(async () => {
    if (!user || !planId) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data: plan, error: planError } = await supabase.from('operational_plans').select('*').eq('id', planId).eq('user_id', user.id).single();
      if (planError) {
        if (planError.code === 'PGRST116') {
          toast({ title: "الخطة غير موجودة", description: "لم يتم العثور على الخطة أو لا تملك صلاحية الوصول.", variant: "destructive" });
          navigate('/operational-plans'); return;
        }
        throw planError;
      }
      setPlanData(plan);

      if (schoolId) {
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('operational_plan_template_url')
          .eq('id', schoolId)
          .single();
        
        if (schoolError) {
          console.warn("Could not fetch school template URL:", schoolError.message);
        } else if (schoolData) {
          setPlanTemplateUrl(schoolData.operational_plan_template_url);
        }
      }

    } catch (error) {
      console.error("Error loading plan summary data:", error);
      toast({ title: "خطأ في التحميل", description: error.message, variant: "destructive" });
      navigate('/operational-plans');
    } finally {
      setLoading(false);
    }
  }, [planId, user, schoolId, navigate, toast]);

  useEffect(() => { loadPlanData(); }, [loadPlanData]);
  
  const programStatusData = useMemo(() => {
    if (!planData || !planData.programs_initiatives || !Array.isArray(planData.programs_initiatives)) return null;
    const completed = planData.programs_initiatives.filter(p => p.status === 'completed').length;
    const inProgress = planData.programs_initiatives.filter(p => p.status === 'in_progress').length;
    const notStarted = planData.programs_initiatives.filter(p => p.status === 'not_started' || !p.status).length;
    if (completed === 0 && inProgress === 0 && notStarted === 0 && planData.programs_initiatives.length > 0 && !planData.programs_initiatives.some(p => p.status)) {
        return { labels: ['لم يبدأ'], datasets: [{ label: 'حالة البرامج والمبادرات', data: [planData.programs_initiatives.length], backgroundColor: ['#F44336'], }] };
    }
    if (completed === 0 && inProgress === 0 && notStarted === 0) return null;
    return { labels: ['مكتمل', 'قيد التنفيذ', 'لم يبدأ'], datasets: [{ label: 'حالة البرامج والمبادرات', data: [completed, inProgress, notStarted], backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], }] };
  }, [planData]);

  const goalsByDomainData = useMemo(() => {
    if (!planData || !planData.strategic_goals || !Array.isArray(planData.strategic_goals)) return null;
    const domainCounts = planData.strategic_goals.reduce((acc, domainGoal) => {
      const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainGoal.domain_id);
      const domainName = domainInfo ? domainInfo.label : (domainGoal.domain_name || 'غير محدد');
      if (domainGoal.objectives && Array.isArray(domainGoal.objectives)) { acc[domainName] = (acc[domainName] || 0) + domainGoal.objectives.length; }
      return acc;
    }, {});
    if (Object.keys(domainCounts).length === 0) return null;
    return { labels: Object.keys(domainCounts), datasets: [{ label: 'توزيع الأهداف التفصيلية على المجالات', data: Object.values(domainCounts), backgroundColor: ['#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1', '#22D3EE', '#A855F7', '#D946EF', '#F43F5E'], }] };
  }, [planData]);

  const risksBySeverityData = useMemo(() => {
    if (!planData || !planData.risks_management || !Array.isArray(planData.risks_management)) return null;
    const severityCounts = planData.risks_management.reduce((acc, risk) => {
        const severity = risk.severity || risk.severity_level || 'غير محدد';
        acc[severity] = (acc[severity] || 0) + 1; return acc;
    }, {});
    if (Object.keys(severityCounts).length === 0) return null;
    const severityLabels = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع', critical: 'حرج', 'غير محدد': 'غير محدد' };
    const severityColors = { low: '#4CAF50', medium: '#FFC107', high: '#FF9800', critical: '#F44336', 'غير محدد': '#9E9E9E' };
    return { labels: Object.keys(severityCounts).map(key => severityLabels[key] || key), datasets: [{ label: 'توزيع المخاطر حسب الخطورة', data: Object.values(severityCounts), backgroundColor: Object.keys(severityCounts).map(key => severityColors[key] || '#9E9E9E'), }] };
  }, [planData]);

  const handleInitiateExport = () => {
    setShowPptxPreviewDialog(true);
  };

  const confirmAndExportToPptx = async () => {
    if (!planData) { 
      toast({ title: "بيانات غير كافية", description: "لا يمكن تصدير الخطة، البيانات غير مكتملة.", variant: "destructive" }); 
      return; 
    }
    setShowPptxPreviewDialog(false);
    setExporting(true); 
    toast({ title: "جاري التصدير...", description: "يتم إعداد ملف PowerPoint." });
    
    try {
      await generatePptx(planData, planTemplateUrl, getDisplayValue);
      toast({ title: "تم التصدير بنجاح", description: "تم تنزيل ملف PowerPoint.", variant: "default" });
    } catch (err) { 
      console.error("PptxGenJS error: ", err); 
      toast({ title: "خطأ في التصدير", description: `حدث خطأ أثناء إنشاء ملف PowerPoint. ${err.message}`, variant: "destructive" });
    } finally { 
      setExporting(false); 
    }
  };

  if (loading) return <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 p-8 arabic-text"><Loader2 className="h-16 w-16 text-sky-600 animate-spin mb-4" /><p className="text-xl text-sky-700 font-semibold">جاري تحميل ملخص الخطة...</p></div>;
  if (!planData) return <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 p-8 arabic-text"><AlertTriangle className="h-16 w-16 text-red-600 mb-4" /><p className="text-xl text-red-700 font-semibold">تعذر تحميل بيانات الخطة.</p><Button onClick={() => navigate('/operational-plans')} className="mt-4 bg-sky-600 hover:bg-sky-700"><Home className="ml-2 h-4 w-4" /> العودة لقائمة الخطط</Button></div>;

  const swot = planData.swot_analysis || {};
  const strengths = [...(swot.strengths?.selected || []), ...(swot.strengths?.custom?.filter(s => s.trim() !== '') || [])];
  const weaknesses = [...(swot.weaknesses?.selected || []), ...(swot.weaknesses?.custom?.filter(w => w.trim() !== '') || [])];
  const opportunities = [...(swot.opportunities?.selected || []), ...(swot.opportunities?.custom?.filter(o => o.trim() !== '') || [])];
  const threats = [...(swot.threats?.selected || []), ...(swot.threats?.custom?.filter(t => t.trim() !== '') || [])];
  const strategicVisions = swot.strategic_visions || "";
  const ethicsCharter = planData.ethics_charter || { charter_text: '', core_values: [] };
  const techStrategy = planData.tech_strategy || {};
  const risksManagement = planData.risks_management || [];
  const partnerships = planData.partnerships || [];
  const staffDevelopment = planData.staff_development || {};
  const planningCommittee = planData.planning_committee_data || [];
  const teamResponsibilities = planData.team_responsibilities_data || "";
  const valueIconMapping = { 'النزاهة والشفافية': ShieldCheck, 'الابتكار والتطوير المستمر': SparklesIcon, 'الاحترام المتبادل والتقدير': Users, 'المسؤولية المجتمعية والانتماء': Home, 'التعاون والعمل بروح الفريق': UsersTwo, 'التميز والجودة في الأداء': TrendingUp, 'العدالة وتكافؤ الفرص': CheckCircle, 'الالتزام والانضباط': BookOpen, };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 p-4 sm:p-8 arabic-text">
      <main className="flex-1">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-800 text-center sm:text-right">ملخص الخطة التشغيلية: {planData.plan_name}</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={() => navigate(`/operational-plans/edit/${planId}`)} variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50"><Edit3 className="ml-2 h-4 w-4" /> تعديل</Button>
              <Button onClick={() => navigate('/operational-plans')} variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50"><Home className="ml-2 h-4 w-4" /> الخطط</Button>
              <Button onClick={() => setShowTemplateUploadDialog(true)} variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
                <FileImage className="ml-2 h-4 w-4" /> رفع قالب الخطة
              </Button>
              <Button onClick={handleInitiateExport} disabled={exporting} className="bg-green-600 hover:bg-green-700 text-white"><Download className="ml-2 h-4 w-4" />{exporting ? "تصدير..." : "تصدير"}</Button>
            </div>
          </div>
          <p className="text-lg text-gray-600 mt-2 text-center sm:text-right">{planData.school_name_full || "اسم المدرسة"} - {planData.target_academic_year || "العام الدراسي"}</p>
        </header>

        <SummarySection id="overview" title="نظرة عامة" icon={Eye}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
            <MetricCard title="اسم المدرسة" value={planData.school_name_full || 'N/A'} icon={<Building />} />
            <MetricCard title="قائد المدرسة" value={planData.principal_name || 'N/A'} icon={<UserCheck />} />
            <MetricCard title="عدد الطلاب" value={planData.student_count?.toString() || '0'} icon={<Users />} color="text-green-600" />
            <MetricCard title="عدد المعلمين" value={planData.teacher_count?.toString() || '0'} icon={<UsersTwo />} color="text-blue-600" />
            <MetricCard title="عدد الإداريين" value={planData.admin_count?.toString() || '0'} icon={<UsersIcon />} color="text-purple-600" />
            <MetricCard title="عدد الفصول" value={planData.classroom_count?.toString() || '0'} icon={<Layers />} color="text-orange-600" />
            <MetricCard title="طبيعة الخطة" value={getDisplayValue(planData.plan_nature, PLAN_NATURES)} icon={<BookOpen />} />
            <MetricCard title="حالة الخطة" value={planData.status === 'completed' ? 'مكتملة' : 'مسودة'} icon={<ShieldCheck />} color={planData.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}/>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <SectionCard title="الرؤية" icon={<ChevronsRight />} contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.school_vision || "لم يتم تحديد الرؤية."}</p></SectionCard>
            <SectionCard title="الرسالة" icon={<ChevronsRight />} contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.school_mission || "لم يتم تحديد الرسالة."}</p></SectionCard>
            <SectionCard title="فلسفة القائد التعليمية" icon={<ChevronsRight />} className="lg:col-span-2" contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.plan_philosophy || "لم يتم تحديد فلسفة القائد."}</p></SectionCard>
          </div>
        </SummarySection>

        <SummarySection id="details" title="تفاصيل الخطة والمدرسة" icon={Info}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <SectionCard title="معلومات المدرسة الأساسية" icon={<Info />}><InfoItem label="اسم المدرسة" value={planData.school_name_full} icon={<Building />} /><InfoItem label="رقم الوزاري" value={planData.ministry_school_id} icon={<Hash />} /><InfoItem label="الإدارة التعليمية" value={getDisplayValue(planData.education_department, EDUCATION_DEPARTMENTS)} icon={<MapPin />} /><InfoItem label="مكتب التعليم" value={planData.education_office} icon={<MapPin />} /></SectionCard>
            <SectionCard title="خصائص المدرسة" icon={<Layers />}><InfoItem label="المرحلة" value={getDisplayValue(planData.school_stage, SCHOOL_STAGES)} icon={<Book />} /><InfoItem label="نوع التعليم" value={getDisplayValue(planData.student_gender_type, STUDENT_GENDER_TYPES)} icon={<Users />} /><InfoItem label="نوع المبنى" value={getDisplayValue(planData.building_type, BUILDING_TYPES)} icon={<Building />} /></SectionCard>
            <SectionCard title="معلومات الاتصال" icon={<Phone />}><InfoItem label="البريد الإلكتروني" value={planData.school_email} icon={<Mail />} /><InfoItem label="رقم الهاتف" value={planData.school_phone} icon={<Phone />} /></SectionCard>
            <SectionCard title="قيادة المدرسة" icon={<UserCheck />}><InfoItem label="القائد" value={planData.principal_name} icon={<UserCheck />} /><InfoItem label="الوكيل" value={planData.deputy_principal_name} icon={<UserCheck />} /></SectionCard>
            <SectionCard title="إطار الخطة" icon={<CalendarDays />}><InfoItem label="العام الدراسي" value={planData.target_academic_year} icon={<CalendarDays />} /><InfoItem label="طبيعة الخطة" value={getDisplayValue(planData.plan_nature, PLAN_NATURES)} icon={<BookOpen />} />{planData.plan_nature === 'multi_year' && <InfoItem label="مدة الخطة متعددة السنوات" value={`${planData.multi_year_plan_duration || 'N/A'} سنوات`} icon={<CalendarDays />} />}<InfoItem label="الهدف العام" value={planData.plan_objective} icon={<Target />} /></SectionCard>
            <SectionCard title="مقدمة عن المدرسة" icon={<Info />} className="md:col-span-2 xl:col-span-1" contentClassName="p-4"><p className="text-gray-700 leading-relaxed text-md">{planData.school_introduction || "لم يتم تحديد مقدمة عن المدرسة."}</p></SectionCard>
          </div>
        </SummarySection>

        <SummarySection id="structure_team" title="هيكل وفريق إعداد الخطة" icon={CommitteeIcon}>
          {planningCommittee && planningCommittee.length > 0 ? (
            <SectionCard title="لجنة إعداد الخطة التشغيلية" icon={<CommitteeIcon />} className="mb-6" contentClassName="p-0 sm:p-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المسمى الوظيفي</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور في اللجنة</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مسؤوليات إضافية</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {planningCommittee.map((member, index) => (
                      <tr key={member.id || index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.name || 'N/A'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{getDisplayValue(member.job_title, JOB_TITLES_KSA, member.job_title || 'N/A')}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{getDisplayValue(member.role_in_committee, COMMITTEE_MEMBER_ROLES, member.role_in_committee || 'N/A')}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.additional_responsibilities || 'لا يوجد'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          ) : (
            <p className="text-gray-500 text-center py-4">لم يتم تحديد أعضاء لجنة إعداد الخطة.</p>
          )}
          <SectionCard title="مسؤوليات ومهام فريق التخطيط المدرسي" icon={<ResponsibilitiesIcon />} contentClassName="p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{teamResponsibilities || "لم يتم تحديد مسؤوليات فريق التخطيط."}</p>
          </SectionCard>
        </SummarySection>

        <SummarySection id="ethics" title="الميثاق الأخلاقي والقيم الأساسية" icon={BookOpen}>
            <SectionCard title="الميثاق الأخلاقي" icon={<BookOpen />} className="mb-6" contentClassName="p-4"><p className="text-gray-700 leading-relaxed whitespace-pre-line text-md">{ethicsCharter.charter_text || "لم يتم تحديد نص الميثاق."}</p></SectionCard>
            <SectionCard title="القيم الأساسية" icon={<Gem />} contentClassName="p-4">
                {ethicsCharter.core_values && ethicsCharter.core_values.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{ethicsCharter.core_values.map((value, index) => (<CoreValueDisplayCard key={index} valueName={value.name} description={value.description} icon={valueIconMapping[value.name] || Gem}/>))}</div>) : (<p className="text-gray-500 text-center py-4">لم تحدد قيم أساسية.</p>)}
            </SectionCard>
        </SummarySection>

        <SummarySection id="swot" title="تحليل SWOT" icon={Activity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SwotItemCard title="القوة" items={strengths} icon={<Lightbulb />} bgColorClass="bg-green-50" borderColorClass="border-green-300" textColorClass="text-green-700" />
                <SwotItemCard title="الضعف" items={weaknesses} icon={<Zap />} bgColorClass="bg-red-50" borderColorClass="border-red-300" textColorClass="text-red-700" />
                <SwotItemCard title="الفرص" items={opportunities} icon={<Target />} bgColorClass="bg-blue-50" borderColorClass="border-blue-300" textColorClass="text-blue-700" />
                <SwotItemCard title="التهديدات" items={threats} icon={<ShieldAlertIcon />} bgColorClass="bg-yellow-50" borderColorClass="border-yellow-300" textColorClass="text-yellow-700" />
            </div>
            {strategicVisions && <SectionCard title="الرؤى الاستراتيجية" icon={<SparklesIcon />} className="mt-8" contentClassName="p-4"><p className="text-gray-700 leading-relaxed whitespace-pre-line">{strategicVisions}</p></SectionCard>}
        </SummarySection>
        
        <SummarySection id="goals" title="الأهداف الاستراتيجية" icon={Target}>
            {(planData.strategic_goals && planData.strategic_goals.length > 0) ? (planData.strategic_goals.map((domainGoal, domainIndex) => { const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainGoal.domain_id); const DomainIcon = domainInfo ? iconMapping[domainInfo.icon] || ListChecksIcon : ListChecksIcon;
            return (<SectionCard key={domainGoal.domain_id || domainIndex} title={`${domainInfo ? domainInfo.label : (domainGoal.domain_name || 'مجال غير مسمى')}`} icon={<DomainIcon />} className="mb-6 border-sky-100">
                {domainGoal.objectives && domainGoal.objectives.length > 0 ? (domainGoal.objectives.map((objective, objIndex) => (<SectionCard key={objective.id || objIndex} title={objective.objective_title_label || objective.domain_objective_label || 'هدف تفصيلي'} icon={<Target />} className="mb-4 bg-slate-50/70 shadow-sm" contentClassName="p-3 space-y-2">{objective.kpis && objective.kpis.length > 0 && (<div><p className="text-sm font-medium text-gray-600">المؤشرات:</p><ul className="list-disc list-inside text-sm text-gray-500">{objective.kpis.map((kpi, kpiIndex) => <li key={kpiIndex}>{kpi}</li>)}</ul></div>)}{(objective.required_resources?.filter(r => r.selected).length > 0 || (objective.isCustomResources && objective.customResources)) && (<div><p className="text-sm font-medium text-gray-600">الموارد:</p><ul className="list-disc list-inside text-sm text-gray-500">{objective.isCustomResources && objective.customResources ? objective.customResources.split(',').map(r => r.trim()).filter(r => r !== '').map((res, resIdx) => <li key={`custom-res-${resIdx}`}>{res}</li>) : objective.required_resources.filter(r => r.selected).map((resource, resIndex) => <li key={resIndex}>{resource.name}</li>)}</ul></div>)}</SectionCard>))) : (<p className="text-gray-500 text-center py-2">لا أهداف تفصيلية.</p>)}</SectionCard>);})) : (<p className="text-gray-500 text-center py-4">لا أهداف استراتيجية.</p>)}
        </SummarySection>

        <SummarySection id="programs" title="البرامج والمبادرات" icon={Briefcase}>
            {(planData.programs_initiatives && planData.programs_initiatives.filter(p => p.name || p.customName).length > 0) ? (planData.programs_initiatives.filter(p => p.name || p.customName).map((program, index) => { const typeLabel = getDisplayValue(program.type, PROGRAM_OR_INITIATIVE_TYPES, 'بند'); const nameLabel = program.name === 'other' ? program.customName : (getDisplayValue(program.name, program.type === 'program' ? SUGGESTED_PROGRAMS : SUGGESTED_INITIATIVES, 'غير مسمى'));
            return (<SectionCard key={program.id || index} title={`${typeLabel}: ${nameLabel}`} icon={<BriefcaseIcon />} className="mb-6 border-green-100">
                <InfoItem label="المسؤول" value={program.responsible_party === 'other' ? program.custom_responsible_party : getDisplayValue(program.responsible_party, RESPONSIBLE_PARTIES_OPTIONS)} icon={<UsersIcon />} />
                <InfoItem label="KPI" value={program.kpi === 'other' ? program.custom_kpi : getDisplayValue(program.kpi, program.type === 'program' ? KPI_PROGRAM_OPTIONS : KPI_INITIATIVE_OPTIONS)} icon={<Target />} />
                <InfoItem label="المدة" value={program.duration === 'other' ? program.custom_duration : getDisplayValue(program.duration, program.type === 'program' ? DURATION_PROGRAM_OPTIONS : DURATION_INITIATIVE_OPTIONS)} icon={<CalendarDays />} />
                <InfoItem label="الموارد" value={program.resources?.filter(r => r.selected)} icon={<DollarSign />} isList={true} subListKey="name" />
                <InfoItem label="التحديات" value={program.challenges?.filter(c => c.selected)} icon={<AlertTriangle />} isList={true} subListKey="name" />
                <InfoItem label="خطة الطوارئ" value={program.contingency_plan} icon={<ShieldCheck />} />
                <InfoItem label="أساليب التواصل" value={program.communication_methods?.map(id => COMMUNICATION_METHODS_OPTIONS.find(opt => opt.id === id)?.label).filter(Boolean) || []} icon={<Megaphone />} isList={true} />
            </SectionCard>);})) : (<p className="text-gray-500 text-center py-4">لا برامج أو مبادرات.</p>)}
        </SummarySection>

        <SummarySection id="tech" title="استراتيجية التقنية" icon={Cpu}>
            <SectionCard title="الوضع الحالي والأهداف" icon={<Cpu />}><InfoItem label="المستوى الحالي" value={techStrategy.current_level} icon={<BarChart3Icon />} /><InfoItem label="الأهداف التقنية" value={techStrategy.goals} icon={<Target />} isList={true} /></SectionCard>
            <SectionCard title="التقنيات والأدوات" icon={<ToolIcon />} className="mt-6"><InfoItem label="الأدوات المقترحة" value={techStrategy.tools} icon={<ListChecksIcon />} isList={true} /><InfoItem label="تأثير التقنية" value={techStrategy.impact_description} icon={<SparklesIcon />} /></SectionCard>
            <SectionCard title="التنفيذ والمسؤوليات" icon={<UsersIcon />} className="mt-6"><InfoItem label="الفريق المسؤول" value={techStrategy.responsible_team} icon={<UsersTwo />} /><InfoItem label="خطة التدريب" value={techStrategy.training_plan} icon={<BookOpen />} /></SectionCard>
            <SectionCard title="المتابعة والتقييم والميزانية" icon={<BarChart2Icon />} className="mt-6"><InfoItem label="KPIs" value={techStrategy.kpis} icon={<TrendingUpIcon />} isList={true} /><InfoItem label="الميزانية" value={techStrategy.budget_allocation} icon={<DollarSign />} /></SectionCard>
        </SummarySection>

        <SummarySection id="risks" title="إدارة المخاطر" icon={AlertOctagon}>
            {(risksManagement && risksManagement.length > 0) ? (risksManagement.map((risk, index) => (<SectionCard key={risk.id || index} title={`المخاطرة ${index + 1}: ${risk.description || 'وصف غير متوفر'}`} icon={<AlertOctagon />} className="mb-6 border-red-100">
                <InfoItem label="الفئة" value={getDisplayValue(risk.category, RISK_CATEGORIES)} icon={<Layers />} />
                <InfoItem label="الخطورة" value={getDisplayValue(risk.severity || risk.severity_level, RISK_SEVERITY_LEVELS)} icon={<Zap className={`${(risk.severity || risk.severity_level) === 'critical' ? 'text-red-600' : (risk.severity || risk.severity_level) === 'high' ? 'text-orange-500' : (risk.severity || risk.severity_level) === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />} />
                <InfoItem label="الاستراتيجية" value={getDisplayValue(risk.strategy, RISK_STRATEGIES)} icon={<Settings />} />
                <InfoItem label="المسؤول" value={getDisplayValue(risk.responsible_party, RISK_RESPONSIBLE_PARTIES)} icon={<UsersIcon />} />
                <InfoItem label="خطة الطوارئ" value={risk.contingency_plan} icon={<ShieldCheck />} />
            </SectionCard>))) : (<p className="text-gray-500 text-center py-4">لا توجد مخاطر محددة.</p>)}
        </SummarySection>

        <SummarySection id="partnerships" title="الشراكات والتعاون" icon={Handshake}>
            {(partnerships && partnerships.length > 0) ? (partnerships.map((partnership, index) => (<SectionCard key={partnership.id || index} title={`الشراكة ${index + 1}: ${partnership.partner_name || 'شريك غير مسمى'}`} icon={<Handshake />} className="mb-6 border-teal-100">
                <InfoItem label="النوع" value={getDisplayValue(partnership.partnership_type, PARTNERSHIP_TYPES)} icon={<Layers />} />
                <InfoItem label="الأهداف" value={partnership.objectives} icon={<Target />} />
                <InfoItem label="الأنشطة" value={partnership.activities} icon={<ListChecks />} />
                <InfoItem label="المسؤول" value={partnership.responsible_person} icon={<UserCheck />} />
            </SectionCard>))) : (<p className="text-gray-500 text-center py-4">لا توجد شراكات محددة.</p>)}
        </SummarySection>
        
        <SummarySection id="staff" title="الكادر والتطوير المهني" icon={UsersRound}>
            <SectionCard title="معلومات الكادر" icon={<UsersIcon />} className="mb-6"><InfoItem label="إجمالي الكادر" value={staffDevelopment.total_staff?.toString()} icon={<Users />} /><InfoItem label="التخصصات والعدد" value={(staffDevelopment.specializations_list || []).map(spec => ({ name: `${STAFF_SPECIALIZATIONS_KSA.find(s => s.value === spec.specialization)?.label || spec.custom_specialization || spec.specialization}`, count: spec.count }))} icon={<GraduationCap />} isList={true} /></SectionCard>
            <SectionCard title="احتياجات التطوير" icon={<BriefcaseIcon />} className="mb-6"><InfoItem label="مجالات التدريب" value={(staffDevelopment.training_needs || []).map(need => TRAINING_AREAS.find(area => area === need) || need )} icon={<ListChecksIcon />} isList={true} /></SectionCard>
            <SectionCard title="خطط التطوير المقترحة" icon={<SparklesIcon />} contentClassName="p-4"><InfoItem label="الخطط" value={staffDevelopment.professional_development_plans} icon={<BookOpen />} /></SectionCard>
        </SummarySection>

        <SummarySection id="charts" title="المؤشرات والرسوم البيانية" icon={BarChart3}>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="حالة البرامج والمبادرات" icon={<BarChart3 />} contentClassName="p-4 h-[350px]">{programStatusData ? <Pie data={programStatusData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}</SectionCard>
                <SectionCard title="توزيع الأهداف على المجالات" icon={<BarChart2Icon />} contentClassName="p-4 h-[350px]">{goalsByDomainData ? <Bar data={goalsByDomainData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}</SectionCard>
                <SectionCard title="توزيع المخاطر حسب الخطورة" icon={<ShieldCheck />} className="lg:col-span-2" contentClassName="p-4 h-[350px]">{risksBySeverityData ? <Pie data={risksBySeverityData} options={{ responsive: true, maintainAspectRatio: false }} /> : <p className="text-gray-500 text-center py-4">لا توجد بيانات كافية.</p>}</SectionCard>
            </div>
        </SummarySection>
      </main>

      <PptxExportDialog
        isOpen={showPptxPreviewDialog}
        onOpenChange={setShowPptxPreviewDialog}
        onConfirmExport={confirmAndExportToPptx}
        previewImageUrl={planTemplateUrl}
      />

      <TemplateUploadDialog
        isOpen={showTemplateUploadDialog}
        onOpenChange={setShowTemplateUploadDialog}
        onTemplateUpload={(newUrl) => {
          setPlanTemplateUrl(newUrl);
          toast({ title: "تم رفع القالب بنجاح!" });
        }}
        templateType="operational_plan_template_url"
        schoolId={schoolId}
        title="رفع قالب الخطة التشغيلية"
        description="اختر صورة لاستخدامها كخلفية لشرائح العرض التقديمي (PPTX). يفضل استخدام صورة أفقية (Landscape) للحصول على أفضل النتائج."
      />

    </div>
  );
>>>>>>> cd51de4 (initial push)
};

export default PlanSummaryDashboardPage;