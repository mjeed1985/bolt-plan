import React from 'react';
import SummarySection from '@/components/plan-summary/SummarySection';
import SectionCard from '@/components/plan-summary/SectionCard';
import { Target, BookOpen, Users, TrendingUp, Settings, Briefcase, Cpu, BarChart3, Lightbulb, ListChecks } from 'lucide-react';
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';

const iconMapping = {
  '📚': BookOpen, '🤝': Users, '🌟': TrendingUp, '👩‍💼': Settings,
  '📈': Briefcase, '💻': Cpu, '✅': BarChart3, '🎯': Target, '💡': Lightbulb,
};

const GoalsSection = ({ planData }) => {
  return (
    <SummarySection id="goals" title="الأهداف الاستراتيجية" icon={Target}>
      {(planData.strategic_goals && planData.strategic_goals.length > 0) ? (
        planData.strategic_goals.map((domainGoal, domainIndex) => {
          const domainInfo = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainGoal.domain_id);
          const DomainIcon = domainInfo ? iconMapping[domainInfo.icon] || ListChecks : ListChecks;
          return (
            <SectionCard key={domainGoal.domain_id || domainIndex} title={`${domainInfo ? domainInfo.label : (domainGoal.domain_name || 'مجال غير مسمى')}`} icon={<DomainIcon />} className="mb-6 border-sky-100">
              {domainGoal.objectives && domainGoal.objectives.length > 0 ? (
                domainGoal.objectives.map((objective, objIndex) => (
                  <SectionCard key={objective.id || objIndex} title={objective.objective_title_label || objective.domain_objective_label || 'هدف تفصيلي'} icon={<Target />} className="mb-4 bg-slate-50/70 shadow-sm" contentClassName="p-3 space-y-2">
                    {objective.kpis && objective.kpis.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">المؤشرات:</p>
                        <ul className="list-disc list-inside text-sm text-gray-500">
                          {objective.kpis.map((kpi, kpiIndex) => <li key={kpiIndex}>{kpi}</li>)}
                        </ul>
                      </div>
                    )}
                    {(objective.required_resources?.filter(r => r.selected).length > 0 || (objective.isCustomResources && objective.customResources)) && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">الموارد:</p>
                        <ul className="list-disc list-inside text-sm text-gray-500">
                          {objective.isCustomResources && objective.customResources ?
                            objective.customResources.split(',').map(r => r.trim()).filter(r => r !== '').map((res, resIdx) => <li key={`custom-res-${resIdx}`}>{res}</li>) :
                            objective.required_resources.filter(r => r.selected).map((resource, resIndex) => <li key={resIndex}>{resource.name}</li>)
                          }
                        </ul>
                      </div>
                    )}
                  </SectionCard>
                ))
              ) : (
                <p className="text-gray-500 text-center py-2">لا أهداف تفصيلية.</p>
              )}
            </SectionCard>
          );
        })
      ) : (
        <p className="text-gray-500 text-center py-4">لا أهداف استراتيجية.</p>
      )}
    </SummarySection>
  );
};

export default GoalsSection;