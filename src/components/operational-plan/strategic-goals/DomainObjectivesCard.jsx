import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ObjectiveItem from './ObjectiveItem';

const DomainObjectivesCard = ({
  domain,
  objectives,
  onObjectiveChange,
  onCustomInputChange,
  onKpiChange,
  onResourceSelection,
  onGenerateKpisOrResources,
  onAddObjective,
  onRemoveObjective,
  icon: Icon,
}) => {
  return (
    <Card className="border-indigo-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-indigo-600" />
          <CardTitle className="text-xl text-indigo-700">أهداف مجال: {domain.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {objectives.map((objective, objIndex) => (
          <ObjectiveItem
            key={objective.id}
            domain={domain}
            objective={objective}
            objectiveIndex={objIndex}
            onObjectiveChange={onObjectiveChange}
            onCustomInputChange={onCustomInputChange}
            onKpiChange={onKpiChange}
            onResourceSelection={onResourceSelection}
            onGenerateKpisOrResources={onGenerateKpisOrResources}
            onRemoveObjective={onRemoveObjective}
          />
        ))}
        <Button
          variant="outline"
          onClick={() => onAddObjective(domain.id)}
          className="w-full flex items-center justify-center gap-2 border-dashed border-indigo-500 text-indigo-600 hover:bg-indigo-100 py-3 mt-4 shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-5 h-5" /> إضافة هدف جديد لهذا المجال
        </Button>
      </CardContent>
    </Card>
  );
};

export default DomainObjectivesCard;