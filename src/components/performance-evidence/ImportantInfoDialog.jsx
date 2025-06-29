import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Target, CalendarDays, BarChart3 } from 'lucide-react';

const ImportantInfoDialog = ({ isOpen, onOpenChange }) => {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-sky-500" />,
      title: "توثيق شامل ومنظم",
      description: "نظام متكامل لجمع وأرشفة جميع شواهد أدائك المهني كمدير مدرسة في مكان واحد آمن وسهل الوصول."
    },
    {
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      title: "ربط بالأهداف والمعايير",
      description: "صُممت الأقسام لتتوافق مع معايير الأداء المعتمدة، مما يساعدك على تتبع إنجازاتك بشكل منهجي."
    },
    {
      icon: <CalendarDays className="w-6 h-6 text-purple-500" />,
      title: "دعم على مدار العام",
      description: "يمكنك إضافة الشواهد بشكل مستمر طوال العام الدراسي، مما يضمن عدم إغفال أي إنجاز أو ممارسة متميزة."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
      title: "استعداد للتقييمات",
      description: "يسهل عليك استعراض وتقديم ملف أدائك عند الحاجة، سواء للتقييمات الدورية أو لتوثيق مسيرتك المهنية."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl arabic-text bg-white/95 backdrop-blur-lg shadow-2xl rounded-xl border-0">
        <DialogHeader className="text-center pb-4 border-b border-gray-200">
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-700">
            شواهد الأداء: رفيقك نحو التميز
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-md sm:text-lg mt-2 leading-relaxed">
            نظام توثيق شواهد الأداء مصمم خصيصًا لدعم مديري المدارس في توثيق إنجازاتهم وممارساتهم المتميزة على مدار العام الدراسي.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 px-2 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50/70 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 mt-1">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-6 border-t border-gray-200">
          <DialogClose asChild>
            <Button 
              type="button" 
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-md px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              فهمت، لنبدأ!
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportantInfoDialog;