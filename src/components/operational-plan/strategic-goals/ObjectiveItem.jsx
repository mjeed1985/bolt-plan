import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Target, RefreshCw } from 'lucide-react';

const ObjectiveItem = ({
  domain,
  objective,
  objectiveIndex,
  onObjectiveChange,
  onCustomInputChange,
  onKpiChange,
  onResourceSelection,
  onGenerateKpisOrResources,
  onRemoveObjective,
}) => {
  const selectedDomainObjectiveDetails = domain.objectives.find(o => o.value === objective.domain_objective_value);

  return (
    <Card className="bg-white border-slate-200 shadow-md">
      <CardHeader className="pb-3 pt-4 bg-slate-50 rounded-t-md">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-semibold text-slate-700 flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-600" /> الهدف {objectiveIndex + 1}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onRemoveObjective(domain.id, objectiveIndex)} className="text-red-500 hover:bg-red-100 rounded-full">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div>
          <Label className="font-semibold">الهدف من المجال</Label>
          <Select
            value={objective.domain_objective_value}
            onValueChange={(value) => {
              const selectedOpt = domain.objectives.find(opt => opt.value === value);
              onObjectiveChange(domain.id, objectiveIndex, 'domain_objective_value', value, 'domain_objective_label', selectedOpt?.label);
            }}
          >
            <SelectTrigger><SelectValue placeholder="اختر هدف المجال" /></SelectTrigger>
            <SelectContent>
              {domain.objectives.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {objective.isCustomDomainObjective && (
            <Input
              type="text"
              placeholder="أدخل هدف المجال المخصص هنا"
              value={objective.customDomainObjectiveLabel}
              onChange={(e) => onCustomInputChange(domain.id, objectiveIndex, 'customDomainObjectiveLabel', e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {(objective.domain_objective_value && (objective.isCustomDomainObjective || selectedDomainObjectiveDetails)) && (
          <div>
            <Label className="font-semibold">عنوان الهدف التفصيلي</Label>
            {objective.isCustomDomainObjective ? (
              <Input
                type="text"
                placeholder="أدخل عنوان الهدف التفصيلي المخصص هنا"
                value={objective.customObjectiveTitleLabel}
                onChange={(e) => onCustomInputChange(domain.id, objectiveIndex, 'customObjectiveTitleLabel', e.target.value)}
                className="mt-1"
              />
            ) : (
              <>
                <Select
                  value={objective.objective_title_value}
                  onValueChange={(value) => {
                    const selectedOpt = selectedDomainObjectiveDetails?.titles.find(opt => opt.value === value);
                    onObjectiveChange(domain.id, objectiveIndex, 'objective_title_value', value, 'objective_title_label', selectedOpt?.label);
                  }}
                  disabled={!selectedDomainObjectiveDetails}
                >
                  <SelectTrigger><SelectValue placeholder="اختر عنوان الهدف التفصيلي" /></SelectTrigger>
                  <SelectContent>
                    {selectedDomainObjectiveDetails?.titles.map(titleOpt => (
                      <SelectItem key={titleOpt.value} value={titleOpt.value}>{titleOpt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {objective.isCustomObjectiveTitle && (
                  <Input
                    type="text"
                    placeholder="أدخل عنوان الهدف التفصيلي المخصص هنا"
                    value={objective.customObjectiveTitleLabel}
                    onChange={(e) => onCustomInputChange(domain.id, objectiveIndex, 'customObjectiveTitleLabel', e.target.value)}
                    className="mt-2"
                  />
                )}
              </>
            )}
          </div>
        )}

        {(objective.objective_title_value || objective.isCustomObjectiveTitle || objective.isCustomDomainObjective) && (
          <>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold text-sm">المؤشرات الرئيسية (KPIs)</Label>
                {!objective.isCustomKpis && !objective.isCustomDomainObjective && !objective.isCustomObjectiveTitle && (
                  <Button variant="outline" size="xs" onClick={() => onGenerateKpisOrResources(domain.id, objectiveIndex, 'kpis')} className="text-xs border-sky-500 text-sky-600 hover:bg-sky-50">
                    <RefreshCw className="ml-1 h-3 w-3" /> توليد تلقائي للمؤشرات
                  </Button>
                )}
              </div>
              {(objective.isCustomKpis || objective.isCustomDomainObjective || objective.isCustomObjectiveTitle ? objective.customKpis : objective.kpis).map((kpi, kpiIndex) => (
                <Input
                  key={`kpi-${kpiIndex}`}
                  value={kpi}
                  onChange={(e) => onKpiChange(domain.id, objectiveIndex, kpiIndex, e.target.value)}
                  placeholder={`المؤشر ${kpiIndex + 1}`}
                  className="text-sm"
                />
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <Label className="font-semibold text-sm">الموارد المطلوبة</Label>
                {!objective.isCustomResources && !objective.isCustomDomainObjective && !objective.isCustomObjectiveTitle && (
                  <Button variant="outline" size="xs" onClick={() => onGenerateKpisOrResources(domain.id, objectiveIndex, 'resources')} className="text-xs border-teal-500 text-teal-600 hover:bg-teal-50">
                    <RefreshCw className="ml-1 h-3 w-3" /> توليد تلقائي للموارد
                  </Button>
                )}
              </div>
              {objective.isCustomResources || objective.isCustomDomainObjective || objective.isCustomObjectiveTitle ? (
                <Textarea
                  value={objective.customResources}
                  onChange={(e) => onCustomInputChange(domain.id, objectiveIndex, 'customResources', e.target.value)}
                  placeholder="أدخل الموارد المطلوبة (افصل بينها بفاصلة)"
                  className="text-sm"
                  rows={2}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(objective.required_resources || []).map((resource, resIndex) => (
                    <div key={resIndex} className="flex items-center space-x-2 space-x-reverse p-2 border rounded-md bg-white shadow-xs">
                      <Checkbox
                        id={`resource-${domain.id}-${objectiveIndex}-${resIndex}`}
                        checked={resource.selected}
                        onCheckedChange={(checked) => onResourceSelection(domain.id, objectiveIndex, resIndex, checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <Label htmlFor={`resource-${domain.id}-${objectiveIndex}-${resIndex}`} className="font-normal text-xs cursor-pointer text-gray-700">
                        {resource.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectiveItem;