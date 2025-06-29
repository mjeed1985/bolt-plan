import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Loader2, Rocket } from 'lucide-react';

const PlanNavigation = ({ currentSectionIndex, totalSections, onPrev, onNext, onFinish, loading }) => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <Button 
        onClick={onPrev} 
        disabled={currentSectionIndex === 0 || loading}
        variant="outline"
        className="w-full sm:w-auto flex items-center gap-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
      >
        <ChevronRight className="w-5 h-5" /> السابق
      </Button>
      

      {currentSectionIndex === totalSections - 1 ? (
        <Button 
          onClick={onFinish} 
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-green-500 text-white hover:opacity-90 flex items-center gap-2 shadow-md"
        >
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Rocket className="w-5 h-5" />}
          {loading ? 'جاري الإنشاء...' : 'قم بإنشاء الخطة'}
        </Button>
      ) : (
        <Button 
          onClick={onNext} 
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 flex items-center gap-2 shadow-md"
        >
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? 'جاري الحفظ...' : 'احفظ والتالي'} <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default PlanNavigation;