import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { Cpu, BarChart3, Target, Wrench, ListChecks, Sparkles, Users, BookOpen, BarChart2, TrendingUp, DollarSign } from 'lucide-react';

const TechSection = ({ planData }) => {
  const techStrategy = planData.tech_strategy || {};
  return (
    <SummarySection id="tech" title="استراتيجية التقنية" icon={Cpu}>
      <SectionCard title="الوضع الحالي والأهداف" icon={<Cpu />}>
        <InfoItem label="المستوى الحالي" value={techStrategy.current_level} icon={<BarChart3 />} />
        <InfoItem label="الأهداف التقنية" value={techStrategy.goals} icon={<Target />} isList={true} />
      </SectionCard>
      <SectionCard title="التقنيات والأدوات" icon={<Wrench />} className="mt-6">
        <InfoItem label="الأدوات المقترحة" value={techStrategy.tools} icon={<ListChecks />} isList={true} />
        <InfoItem label="تأثير التقنية" value={techStrategy.impact_description} icon={<Sparkles />} />
      </SectionCard>
      <SectionCard title="التنفيذ والمسؤوليات" icon={<Users />} className="mt-6">
        <InfoItem label="الفريق المسؤول" value={techStrategy.responsible_team} icon={<Users />} />
        <InfoItem label="خطة التدريب" value={techStrategy.training_plan} icon={<BookOpen />} />
      </SectionCard>
      <SectionCard title="المتابعة والتقييم والميزانية" icon={<BarChart2 />} className="mt-6">
        <InfoItem label="KPIs" value={techStrategy.kpis} icon={<TrendingUp />} isList={true} />
        <InfoItem label="الميزانية" value={techStrategy.budget_allocation} icon={<DollarSign />} />
      </SectionCard>
    </SummarySection>
  );
};

export default TechSection;