import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SwotItemCard = ({ title, items, icon, bgColorClass = "bg-green-50", borderColorClass = "border-green-200", textColorClass = "text-green-700" }) => {
  if (!items || items.length === 0) {
    return (
<<<<<<< HEAD
      <Card className={`bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
        <CardHeader className="pb-2 pt-3 bg-gradient-to-r from-gray-500/10 to-gray-400/10 border-b border-white/20">
          <CardTitle className={`text-md font-semibold text-gray-700 flex items-center`}>
=======
      <Card className={`${bgColorClass} ${borderColorClass} border shadow-sm`}>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className={`text-md font-semibold ${textColorClass} flex items-center`}>
>>>>>>> cd51de4 (initial push)
            {React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">لا توجد عناصر محددة.</p>
        </CardContent>
      </Card>
    );
  }
  return (
<<<<<<< HEAD
    <Card className={`bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}>
      <CardHeader className="pb-2 pt-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
        <CardTitle className={`text-md font-semibold ${textColorClass} flex items-center group-hover:scale-105 transition-transform`}>
=======
    <Card className={`${bgColorClass} ${borderColorClass} border shadow-sm`}>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className={`text-md font-semibold ${textColorClass} flex items-center`}>
>>>>>>> cd51de4 (initial push)
          {React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside pl-2 space-y-1">
          {items.map((item, index) => (
<<<<<<< HEAD
            <li key={index} className="text-sm text-gray-700 hover:text-gray-900 transition-colors">{item}</li>
=======
            <li key={index} className="text-sm text-gray-700">{item}</li>
>>>>>>> cd51de4 (initial push)
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SwotItemCard;