import React from 'react';
import { ClipboardList, KeyRound as UsersRound, MessageSquare, Zap, Sparkles, ShieldAlert, DollarSign, UserCog, CheckCircle2, UserCheck, BarChartBig, FileSignature, TrendingUp, ClipboardCheck, Goal, Users2 as UsersThree, MonitorPlay, SmilePlus, Building } from 'lucide-react';

export const PERFORMANCE_SECTIONS_CONFIG = [
  { id: 0, title: 'أداء الواجبات الوظيفية', color: 'from-sky-500 to-sky-600', icon: <ClipboardList className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 1, title: 'التفاعل مع المجتمع المهني', color: 'from-indigo-500 to-indigo-600', icon: <UsersRound className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 2, title: 'التفاعل مع أولياء الأمور', color: 'from-purple-500 to-purple-600', icon: <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 3, title: 'مرن وقادر على تنفيذ أعماله في ظل ظروف العمل المختلفة', color: 'from-pink-500 to-pink-600', icon: <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 4, title: 'يدعم ويشارك في المبادرات النوعية', color: 'from-red-500 to-red-600', icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 5, title: 'يتخذ إجراءات تربوية تحقق الانضباط المدرسي', color: 'from-orange-500 to-orange-600', icon: <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 6, title: 'يدير الموارد في المدرسة بكفاءة', color: 'from-amber-500 to-amber-600', icon: <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 7, title: 'يعد خطة للتطوير المهني', color: 'from-yellow-500 to-yellow-600', icon: <UserCog className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 8, title: 'يقدم التغذية الراجعة ويتابع تحقق مؤشرات الأداء الوظيفي', color: 'from-lime-500 to-lime-600', icon: <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 9, title: 'يدعم تنفيذ برامج التطوير المهني', color: 'from-green-500 to-green-600', icon: <UserCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 10, title: 'يقيم أداء منسوبي المدرسة', color: 'from-emerald-500 to-emerald-600', icon: <BarChartBig className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 11, title: 'ينفذ إجراءات علمية لتحسين نتائج التعلم', color: 'from-teal-500 to-teal-600', icon: <FileSignature className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 12, title: 'يسهم في تحسين مستوى أداء المدرسة', color: 'from-cyan-500 to-cyan-600', icon: <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 13, title: 'يعد الخطط المدرسية اللازمة', color: 'from-blue-500 to-blue-600', icon: <ClipboardCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 14, title: 'يتابع تنفيذ الخطط المدرسية بمختلف أنواعها', color: 'from-violet-500 to-violet-600', icon: <Goal className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 15, title: 'يهيئ الفرص والإمكانات الداعمة لمشاركة الطلاب في الأنشطة الصفية وغير الصفية', color: 'from-fuchsia-500 to-fuchsia-600', icon: <UsersThree className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 16, title: 'يوظف المنصات الرقمية وتطبيقاتها المعتمدة في دعم عمليات التعليم والتعلم', color: 'from-rose-500 to-rose-600', icon: <MonitorPlay className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 17, title: 'يتابع تعزيز السلوك الإيجابي للطلاب', color: 'from-slate-500 to-slate-600', icon: <SmilePlus className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
  { id: 18, title: 'يهيئ بيئة مدرسية آمنة ومحفزة على التعلم', color: 'from-gray-500 to-gray-600', icon: <Building className="w-10 h-10 sm:w-12 sm:h-12 text-white" /> },
];