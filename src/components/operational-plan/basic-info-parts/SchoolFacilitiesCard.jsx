import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Home } from 'lucide-react';
import { 
  SCHOOL_FACILITIES_OPTIONS,
  FACILITY_COUNT_OPTIONS
} from '@/lib/operationalPlanConstants';

const SchoolFacilitiesCard = ({ localPlanData, handleFacilityChange, handleFacilityCountChange }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><Home className="text-indigo-600"/> المرافق التعليمية المساندة</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {SCHOOL_FACILITIES_OPTIONS.map((facility) => (
          <div key={facility.id} className="flex items-center space-x-2 p-3 border rounded-md bg-purple-50/50">
            <Checkbox
              id={`facility-${facility.id}`}
              checked={!!(localPlanData.school_facilities && localPlanData.school_facilities[facility.id])}
              onCheckedChange={(checked) => handleFacilityChange(facility.id, checked)}
            />
            <Label htmlFor={`facility-${facility.id}`} className="flex-1 text-sm font-medium text-gray-800">
              {facility.label}
            </Label>
            {localPlanData.school_facilities && localPlanData.school_facilities[facility.id] && (
              <div className="w-24">
                <Select
                  value={localPlanData.school_facilities[facility.id]}
                  onValueChange={(value) => handleFacilityCountChange(facility.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="العدد" />
                  </SelectTrigger>
                  <SelectContent>
                    {FACILITY_COUNT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SchoolFacilitiesCard;