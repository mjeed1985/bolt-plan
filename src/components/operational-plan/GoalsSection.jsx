import React, { useState, useEffect } from 'react';
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';
import { useToast } from '@/components/ui/use-toast';
import DomainSelection from './strategic-goals/DomainSelection';
import DomainObjectivesCard from './strategic-goals/DomainObjectivesCard';
import { BookOpen, Users, TrendingUp, Settings, Briefcase, Cpu, BarChart3, Target, Lightbulb } from 'lucide-react';

const iconMapping = {
  '📚': BookOpen, '🤝': Users, '🌟': TrendingUp, '👩‍💼': Settings,
  '📈': Briefcase, '💻': Cpu, '✅': BarChart3, '🎯': Target, '💡': Lightbulb,
};

const GoalsSection = ({ strategicGoals, onChange }) => {
  const { toast } = useToast();
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [domainObjectives, setDomainObjectives] = useState({});

  useEffect(() => {
    if (strategicGoals && strategicGoals.length > 0) {
      const initialSelectedDomains = strategicGoals.map(sg => sg.domain_id);
      setSelectedDomains(initialSelectedDomains);
      
      const initialDomainObjectives = {};
      strategicGoals.forEach(sg => {
        initialDomainObjectives[sg.domain_id] = (sg.objectives || []).map(obj => ({
          ...obj,
          isCustomDomainObjective: obj.domain_objective_value === 'other',
          customDomainObjectiveLabel: obj.domain_objective_value === 'other' ? obj.domain_objective_label : '',
          isCustomObjectiveTitle: obj.objective_title_value === 'other',
          customObjectiveTitleLabel: obj.objective_title_value === 'other' ? obj.objective_title_label : '',
          isCustomKpis: obj.objective_title_value === 'other' || obj.domain_objective_value === 'other',
          customKpis: (obj.objective_title_value === 'other' || obj.domain_objective_value === 'other') ? (obj.kpis || ['','','']) : ['','',''],
          isCustomResources: obj.objective_title_value === 'other' || obj.domain_objective_value === 'other',
          customResources: (obj.objective_title_value === 'other' || obj.domain_objective_value === 'other') ? (obj.required_resources?.map(r => r.name).join(', ') || '') : '',
        }));
      });
      setDomainObjectives(initialDomainObjectives);
    } else {
      setSelectedDomains([]);
      setDomainObjectives({});
    }
  }, [strategicGoals]);

  const updateParentState = (currentSelectedDomains, currentDomainObjectives) => {
    const newStrategicGoals = currentSelectedDomains.map(domainId => {
      const domainOption = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainId);
      return {
        domain_id: domainId,
        domain_name: domainOption ? domainOption.label : '',
        domain_icon: domainOption ? domainOption.icon : '',
        objectives: (currentDomainObjectives[domainId] || []).map(obj => ({
            id: obj.id,
            domain_objective_value: obj.domain_objective_value,
            domain_objective_label: obj.isCustomDomainObjective ? obj.customDomainObjectiveLabel : obj.domain_objective_label,
            objective_title_value: obj.objective_title_value,
            objective_title_label: obj.isCustomObjectiveTitle ? obj.customObjectiveTitleLabel : obj.objective_title_label,
            kpis: obj.isCustomKpis ? obj.customKpis.filter(kpi => kpi && kpi.trim() !== '') : (obj.kpis || []),
            required_resources: obj.isCustomResources 
                ? obj.customResources.split(',').map(r => r.trim()).filter(r => r !== '').map(r => ({ name: r, selected: true }))
                : (obj.required_resources || []),
        }))
      };
    });
    onChange(newStrategicGoals);
  };

  const handleDomainSelectionChange = (domainId, checked) => {
    let newSelectedDomains;
    let newDomainObjectives = { ...domainObjectives };

    if (checked) {
      newSelectedDomains = [...selectedDomains, domainId];
      if (!newDomainObjectives[domainId]) {
        newDomainObjectives[domainId] = []; 
      }
    } else {
      newSelectedDomains = selectedDomains.filter(id => id !== domainId);
      delete newDomainObjectives[domainId]; 
    }
    setSelectedDomains(newSelectedDomains);
    setDomainObjectives(newDomainObjectives);
    updateParentState(newSelectedDomains, newDomainObjectives);
  };

  const addFieldObjective = (domainId) => {
    const newDomainObjectives = { ...domainObjectives };
    if (!newDomainObjectives[domainId]) {
      newDomainObjectives[domainId] = [];
    }
    newDomainObjectives[domainId].push({
      id: `obj_${Date.now()}`, 
      domain_objective_value: '', domain_objective_label: '',
      objective_title_value: '', objective_title_label: '',
      kpis: [], required_resources: [],
      isCustomDomainObjective: false, customDomainObjectiveLabel: '',
      isCustomObjectiveTitle: false, customObjectiveTitleLabel: '',
      isCustomKpis: false, customKpis: ['','',''],
      isCustomResources: false, customResources: '',
    });
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };

  const handleFieldObjectiveChange = (domainId, objectiveIndex, field, value, labelField, label) => {
    const newDomainObjectives = { ...domainObjectives };
    const objectives = [...newDomainObjectives[domainId]];
    const currentObjective = { ...objectives[objectiveIndex] };

    currentObjective[field] = value;
    if (labelField && label) {
        currentObjective[labelField] = label;
    }

    const isChoosingOtherDomainObjective = value === 'other' && field === 'domain_objective_value';
    const isChoosingOtherObjectiveTitle = value === 'other' && field === 'objective_title_value';

    if (isChoosingOtherDomainObjective) {
        currentObjective.isCustomDomainObjective = true;
        currentObjective.customDomainObjectiveLabel = '';
        currentObjective.objective_title_value = 'other'; 
        currentObjective.objective_title_label = '';
        currentObjective.isCustomObjectiveTitle = true; 
        currentObjective.customObjectiveTitleLabel = '';
        currentObjective.kpis = []; 
        currentObjective.required_resources = [];
        currentObjective.isCustomKpis = true;
        currentObjective.customKpis = ['','',''];
        currentObjective.isCustomResources = true;
        currentObjective.customResources = '';
    } else if (field === 'domain_objective_value') {
        currentObjective.isCustomDomainObjective = false;
        currentObjective.objective_title_value = '';
        currentObjective.objective_title_label = '';
        currentObjective.isCustomObjectiveTitle = false;
        currentObjective.kpis = [];
        currentObjective.required_resources = [];
        currentObjective.isCustomKpis = false;
        currentObjective.isCustomResources = false;
    }

    if (isChoosingOtherObjectiveTitle) {
        currentObjective.isCustomObjectiveTitle = true;
        currentObjective.customObjectiveTitleLabel = '';
        currentObjective.kpis = [];
        currentObjective.required_resources = [];
        currentObjective.isCustomKpis = true;
        currentObjective.customKpis = ['','',''];
        currentObjective.isCustomResources = true;
        currentObjective.customResources = '';
    } else if (field === 'objective_title_value' && !currentObjective.isCustomDomainObjective) {
        currentObjective.isCustomObjectiveTitle = false;
        const domainOption = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainId);
        const selectedDomainObjective = domainOption?.objectives.find(o => o.value === currentObjective.domain_objective_value);
        const selectedTitle = selectedDomainObjective?.titles.find(t => t.value === value);
        currentObjective.kpis = selectedTitle?.suggested_kpis || [];
        currentObjective.required_resources = selectedTitle?.suggested_resources.map(r => ({ name: r, selected: false })) || [];
        currentObjective.isCustomKpis = false;
        currentObjective.isCustomResources = false;
    }
    
    objectives[objectiveIndex] = currentObjective;
    newDomainObjectives[domainId] = objectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };
  
  const handleCustomInputChange = (domainId, objectiveIndex, field, value) => {
    const newDomainObjectives = { ...domainObjectives };
    const objectives = [...newDomainObjectives[domainId]];
    objectives[objectiveIndex][field] = value;
    newDomainObjectives[domainId] = objectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };

  const handleKpiChange = (domainId, objectiveIndex, kpiIndex, newValue) => {
    const newDomainObjectives = { ...domainObjectives };
    const objectives = [...newDomainObjectives[domainId]];
    const targetKpisArray = objectives[objectiveIndex].isCustomKpis ? 'customKpis' : 'kpis';
    const kpis = [...objectives[objectiveIndex][targetKpisArray]];
    
    kpis[kpiIndex] = newValue;
    objectives[objectiveIndex][targetKpisArray] = kpis;
    
    newDomainObjectives[domainId] = objectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };

  const handleResourceSelection = (domainId, objectiveIndex, resourceIndex, checked) => {
    const newDomainObjectives = { ...domainObjectives };
    const objectives = [...newDomainObjectives[domainId]];
    const resources = [...objectives[objectiveIndex].required_resources];
    resources[resourceIndex].selected = checked;
    objectives[objectiveIndex].required_resources = resources;
    newDomainObjectives[domainId] = objectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };

  const removeFieldObjective = (domainId, objectiveIndex) => {
    const newDomainObjectives = { ...domainObjectives };
    const objectives = newDomainObjectives[domainId].filter((_, i) => i !== objectiveIndex);
    newDomainObjectives[domainId] = objectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };
  
  const generateKpisOrResourcesAI = (domainId, objectiveIndex, type) => {
    const objectives = domainObjectives[domainId];
    if (!objectives || !objectives[objectiveIndex]) return;

    const currentObjective = objectives[objectiveIndex];
    if (currentObjective.isCustomDomainObjective || currentObjective.isCustomObjectiveTitle) {
        toast({ title: "تنبيه", description: "لا يمكن التوليد التلقائي للحقول المخصصة.", variant: "default", className: "bg-yellow-100 border-yellow-500 text-yellow-700" });
        return;
    }

    const domainOption = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainId);
    const selectedDomainObjective = domainOption?.objectives.find(o => o.value === currentObjective.domain_objective_value);
    const selectedTitle = selectedDomainObjective?.titles.find(t => t.value === currentObjective.objective_title_value);

    const newDomainObjectives = { ...domainObjectives };
    const modifiableObjectives = [...newDomainObjectives[domainId]];

    if (type === 'kpis' && selectedTitle?.suggested_kpis) {
      modifiableObjectives[objectiveIndex].kpis = [...selectedTitle.suggested_kpis];
      toast({ title: "تم توليد المؤشرات", description: `تم توليد مؤشرات الأداء لـ "${currentObjective.objective_title_label}".` });
    } else if (type === 'resources' && selectedTitle?.suggested_resources) {
       modifiableObjectives[objectiveIndex].required_resources = selectedTitle.suggested_resources.map(r => ({ name: r, selected: false }));
       toast({ title: "تم توليد الموارد", description: `تم توليد الموارد المطلوبة لـ "${currentObjective.objective_title_label}".` });
    }
    
    newDomainObjectives[domainId] = modifiableObjectives;
    setDomainObjectives(newDomainObjectives);
    updateParentState(selectedDomains, newDomainObjectives);
  };

  return (
    <div className="space-y-6">
      <DomainSelection
        selectedDomains={selectedDomains}
        onDomainSelectionChange={handleDomainSelectionChange}
      />

      {selectedDomains.map(domainId => {
        const domain = STRATEGIC_DOMAINS_OPTIONS.find(d => d.id === domainId);
        if (!domain) return null;
        const IconComponent = iconMapping[domain.icon] || Lightbulb;

        return (
          <DomainObjectivesCard
            key={domainId}
            domain={domain}
            objectives={domainObjectives[domainId] || []}
            onObjectiveChange={handleFieldObjectiveChange}
            onCustomInputChange={handleCustomInputChange}
            onKpiChange={handleKpiChange}
            onResourceSelection={handleResourceSelection}
            onGenerateKpisOrResources={generateKpisOrResourcesAI}
            onAddObjective={addFieldObjective}
            onRemoveObjective={removeFieldObjective}
            icon={IconComponent}
          />
        );
      })}
    </div>
  );
};

export default GoalsSection;