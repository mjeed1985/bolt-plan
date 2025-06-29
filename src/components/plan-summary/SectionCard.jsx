import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionCard = ({ title, icon, children, className = "", contentClassName = "pt-4 space-y-3" }) => (
  <Card className={`bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${className}`}>
    <CardHeader className="flex flex-row items-center space-x-3 space-y-0 pb-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/20">
      {React.cloneElement(icon, { className: "h-6 w-6 text-indigo-600" })}
      <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
    </CardHeader>
    <CardContent className={contentClassName}>
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;