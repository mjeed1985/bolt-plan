import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import InfoItem from '@/components/plan-summary/InfoItem';
import { AlertOctagon, Layers, Zap, Settings, Users, ShieldCheck } from 'lucide-react';
import { getDisplayValue } from '@/components/plan-summary/summaryHelpers';
import { RISK_CATEGORIES, RISK_SEVERITY_LEVELS, RISK_STRATEGIES, RISK_RESPONSIBLE_PARTIES } from '@/lib/operationalPlanConstants';

const RisksSection = ({ planData }) => {
  const risksManagement = planData.risks_management || [];
  return (
    <SummarySection id="risks" title="إدارة المخاطر" icon={AlertOctagon}>
      {(risksManagement.length > 0) ? (
        risksManagement.map((risk, index) => (
          <SectionCard key={risk.id || index} title={`المخاطرة ${index + 1}: ${risk.description || 'وصف غير متوفر'}`} icon={<AlertOctagon />} className="mb-6 border-red-100">
            <InfoItem label="الفئة" value={getDisplayValue(risk.category, RISK_CATEGORIES)} icon={<Layers />} />
            <InfoItem label="الخطورة" value={getDisplayValue(risk.severity || risk.severity_level, RISK_SEVERITY_LEVELS)} icon={<Zap className={`${(risk.severity || risk.severity_level) === 'critical' ? 'text-red-600' : (risk.severity || risk.severity_level) === 'high' ? 'text-orange-500' : (risk.severity || risk.severity_level) === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />} />
            <InfoItem label="الاستراتيجية" value={getDisplayValue(risk.strategy, RISK_STRATEGIES)} icon={<Settings />} />
            <InfoItem label="المسؤول" value={getDisplayValue(risk.responsible_party, RISK_RESPONSIBLE_PARTIES)} icon={<Users />} />
            <InfoItem label="خطة الطوارئ" value={risk.contingency_plan} icon={<ShieldCheck />} />
          </SectionCard>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">لا توجد مخاطر محددة.</p>
      )}
    </SummarySection>
  );
};

export default RisksSection;