import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';

const MeetingsFilterControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  filterStatus, 
  setFilterStatus, 
  meetingTypes, 
  meetingStatuses 
}) => {

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return { label: 'مجدول' };
      case 'completed': return { label: 'مكتمل' };
      case 'cancelled': return { label: 'ملغى' };
      default: return { label: status || 'غير محدد' };
    }
  };

  const validMeetingTypes = meetingTypes.filter(type => type && type.value && typeof type.value === 'string' && type.value.trim() !== "" && type.label && typeof type.label === 'string' && type.label.trim() !== "");
  const validMeetingStatuses = meetingStatuses.filter(status => typeof status === 'string' && status.trim() !== "");


  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Input 
          type="text" 
          placeholder="ابحث عن عنوان أو جهة منظمة..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
      <Select value={filterType || ''} onValueChange={setFilterType}>
        <SelectTrigger className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="تصفية حسب النوع" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="justify-end">الكل</SelectItem>
          {validMeetingTypes.map(type => <SelectItem key={type.value} value={type.value} className="justify-end">{type.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filterStatus || ''} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="تصفية حسب الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" className="justify-end">الكل</SelectItem>
          {validMeetingStatuses.map(status => {
              const statusInfo = getStatusLabel(status);
              return <SelectItem key={status} value={status} className="justify-end">{statusInfo.label}</SelectItem>
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MeetingsFilterControls;