import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import { RISK_CATEGORIES, RISK_STRATEGIES, RISK_RESPONSIBLE_PARTIES, RISK_SEVERITY_LEVELS } from '@/lib/operationalPlanConstants';

const RisksManagementSection = ({ risksManagement, onChange }) => {
  const handleRiskChange = (index, field, value) => {
    const newRisks = [...risksManagement];
    newRisks[index] = { ...newRisks[index], [field]: value };
    onChange(newRisks);
  };

  const addRisk = () => {
    onChange([
      ...risksManagement,
      {
        category: '',
        description: '',
        severity: '',
        strategy: '',
        responsible_party: '',
        contingency_plan: ''
      }
    ]);
  };

  const removeRisk = (index) => {
    onChange(risksManagement.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {risksManagement.map((risk, index) => (
        <Card key={index} className="border-gray-200">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-600" />
                <CardTitle className="text-lg">المخاطرة/التحدي {index + 1}</CardTitle>
              </div>
              {risksManagement.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRisk(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف المخاطرة
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>فئة المخاطرة</Label>
                <Select
                  value={risk.category || ''}
                  onValueChange={(value) => handleRiskChange(index, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة المخاطرة" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>مستوى الخطورة</Label>
                <Select
                  value={risk.severity || ''}
                  onValueChange={(value) => handleRiskChange(index, 'severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الخطورة" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>وصف المخاطرة/التحدي</Label>
              <Textarea
                value={risk.description || ''}
                onChange={(e) => handleRiskChange(index, 'description', e.target.value)}
                placeholder="مثال: نقص في عدد المعلمين المتخصصين في مادة معينة"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>استراتيجية التعامل</Label>
                <Select
                  value={risk.strategy || ''}
                  onValueChange={(value) => handleRiskChange(index, 'strategy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر استراتيجية التعامل" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الجهة المسؤولة</Label>
                <Select
                  value={risk.responsible_party || ''}
                  onValueChange={(value) => handleRiskChange(index, 'responsible_party', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجهة المسؤولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_RESPONSIBLE_PARTIES.map((party) => (
                      <SelectItem key={party} value={party}>
                        {party}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>خطة الطوارئ/الإجراءات البديلة</Label>
              <Textarea
                value={risk.contingency_plan || ''}
                onChange={(e) => handleRiskChange(index, 'contingency_plan', e.target.value)}
                placeholder="مثال: التعاقد مع معلمين بدلاء، إعادة توزيع المهام"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={addRisk}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        إضافة مخاطرة/تحدي جديد
      </Button>
    </div>
  );
};

export default RisksManagementSection;