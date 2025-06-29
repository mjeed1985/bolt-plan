import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, UserSquare } from 'lucide-react';

const SchoolManagementCard = ({ renderField }) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-lg flex items-center gap-2"><UserCircle className="text-indigo-600"/> إدارة المدرسة</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {renderField("principal_name", "اسم مدير/ة المدرسة", "اكتب الاسم كاملاً", "text", UserCircle)}
        {renderField("deputy_principal_name", "اسم وكيل/ة المدرسة (إن وجد)", "اكتب الاسم كاملاً", "text", UserSquare)}
      </CardContent>
    </Card>
  );
};

export default SchoolManagementCard;