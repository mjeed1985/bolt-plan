import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoreValueDisplayCard = ({ valueName, description, icon: IconComponent }) => (
    <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
        <CardHeader className="flex flex-row items-center space-x-3 pb-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
            {IconComponent && <IconComponent className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />}
            <CardTitle className="text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{valueName}</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
            <p className="text-sm text-gray-600 leading-relaxed">{description || "لم يتم تقديم وصف لهذه القيمة."}</p>
        </CardContent>
    </Card>
);

export default CoreValueDisplayCard;