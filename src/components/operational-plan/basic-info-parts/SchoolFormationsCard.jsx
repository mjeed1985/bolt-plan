import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { UserCog as UsersCog } from 'lucide-react';
import { SCHOOL_FORMATIONS_OPTIONS } from '@/lib/operationalPlanConstants';

const SchoolFormationsCard = ({ localPlanData, handleFormationChange, handleFormationCountChange }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <UsersCog className="text-indigo-600"/> 
          التشكيلات المدرسية للهيئتين الإدارية والتعليمية (بالعدد)
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {SCHOOL_FORMATIONS_OPTIONS.map((formation) => (
          <div key={formation.id} className="flex items-center space-x-2 p-3 border rounded-md bg-sky-50/50">
            <Checkbox
              id={`formation-${formation.id}`}
              checked={!!(localPlanData.school_formations && localPlanData.school_formations[formation.id])}
              onCheckedChange={(checked) => handleFormationChange(formation.id, checked)}
            />
            <Label htmlFor={`formation-${formation.id}`} className="flex-1 text-sm font-medium text-gray-800">
              {formation.label}
            </Label>
            {localPlanData.school_formations && localPlanData.school_formations[formation.id] && (
              <div className="w-28">
                <NumberStepper
                  value={parseInt(localPlanData.school_formations[formation.id], 10) || 0}
                  onChange={(value) => handleFormationCountChange(formation.id, value)}
                  min={0}
                  max={50} 
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SchoolFormationsCard;