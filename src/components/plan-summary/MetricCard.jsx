import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<<<<<<< HEAD
const MetricCard = ({ title, value, icon, color = "text-indigo-600", subValue }) => (
  <Card className="bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">{title}</CardTitle>
      {React.cloneElement(icon, { className: `h-5 w-5 ${color} group-hover:scale-110 transition-transform` })}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{value}</div>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
=======
const MetricCard = ({ title, value, icon, color = "text-sky-600", subValue }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/90 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
>>>>>>> cd51de4 (initial push)
    </CardContent>
  </Card>
);

export default MetricCard;