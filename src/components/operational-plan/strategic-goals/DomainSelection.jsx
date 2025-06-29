import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ListChecks, Lightbulb } from 'lucide-react';
import { STRATEGIC_DOMAINS_OPTIONS } from '@/lib/goalsOptions';
import { BookOpen, Users, TrendingUp, Settings, Briefcase, Cpu, BarChart3, Target } from 'lucide-react';

const iconMapping = {
  '📚': BookOpen,
  '🤝': Users,
  '🌟': TrendingUp,
  '👩‍💼': Settings,
  '📈': Briefcase,
  '💻': Cpu,
  '✅': BarChart3,
  '🎯': Target,
  '💡': Lightbulb,
};

const DomainSelection = ({ selectedDomains, onDomainSelectionChange }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><ListChecks className="text-indigo-600" /> اختيار المجالات الاستراتيجية</CardTitle>
        <CardDescription>اختر المجالات الرئيسية التي تركز عليها خطتك التشغيلية.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
        {STRATEGIC_DOMAINS_OPTIONS.map(domain => {
          const IconComponent = iconMapping[domain.icon] || Lightbulb;
          return (
            <div
              key={domain.id}
              className="flex items-center space-x-2 space-x-reverse p-3 border rounded-lg hover:bg-indigo-50 transition-colors duration-150 cursor-pointer shadow-xs hover:shadow-md"
              onClick={() => onDomainSelectionChange(domain.id, !selectedDomains.includes(domain.id))}
            >
              <Checkbox
                id={`domain-${domain.id}`}
                checked={selectedDomains.includes(domain.id)}
                onCheckedChange={(checked) => onDomainSelectionChange(domain.id, checked)}
                className="cursor-pointer"
              />
              <Label htmlFor={`domain-${domain.id}`} className="font-medium cursor-pointer flex items-center gap-2 text-sm text-gray-700">
                <IconComponent className="w-5 h-5 text-indigo-500" />
                {domain.label}
              </Label>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DomainSelection;