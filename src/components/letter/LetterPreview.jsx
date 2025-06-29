import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, Download, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LetterPreview = ({ 
  generatedLetter, editingLetterName, setEditingLetterName, pageTitle, letterImage, letterPreviewRef, 
  onEditContent, onSaveLetter, onPrintLetter, onNewLetter, isForImageGeneration = false 
}) => {
  if (!generatedLetter) return null;

  const safePageTitle = typeof pageTitle === 'string' ? pageTitle : 'النموذج';
  const titleSlice = safePageTitle.slice(0, -1);

  const letterContent = (
      <div 
        ref={letterPreviewRef} 
        className="letter-preview bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto letter-content print-page"
        style={{
          backgroundImage: letterImage ? `url(${letterImage})` : 'none',
          backgroundSize: '100% 100%', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
          minHeight: '297mm',
          width: '210mm',
          boxSizing: 'border-box',
          border: letterImage ? 'none' : '2px dashed #ccc'
        }}
      >
        {!letterImage && !isForImageGeneration && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 no-print">
            <ImageOff className="w-16 h-16 mb-4" />
            <p className="font-bold text-lg">لم يتم رفع القالب الرسمي</p>
            <p>يرجى رفع القالب من زر "رفع القالب الرسمي" ليظهر كخلفية للخطاب.</p>
          </div>
        )}
        <div style={{ paddingTop: '100px', paddingBottom: '50px', paddingRight: '50px', paddingLeft: '50px' }} className="text-right">
          {!letterImage && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold arabic-text letter-font mb-2">{generatedLetter.schoolName}</h1>
              <h2 className="text-2xl arabic-text letter-font mb-4">{generatedLetter.template.header}</h2>
            </div>
          )}
           <div className="text-right mb-6">
              <p className="arabic-text letter-font">التاريخ: {generatedLetter.date}</p>
            </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-center arabic-text letter-font mb-6">
              الموضوع: {generatedLetter.title}
            </h3>
          </div>
          <div className="mb-8">
            <p className="arabic-text letter-font text-lg mb-4">{generatedLetter.template.greeting}</p>
            <p className="arabic-text letter-font leading-loose text-justify whitespace-pre-line">
              {generatedLetter.content}
            </p>
          </div>
          <div className="mt-10">
            <p className="arabic-text letter-font text-lg mb-4">{generatedLetter.template.closing}</p>
            <div className="text-center mt-12">
              <p className="arabic-text letter-font font-bold">{generatedLetter.template.signature}</p>
              {!letterImage && <div className="mt-6 border-t border-gray-400 w-60 mx-auto"></div>}
            </div>
          </div>
          {!letterImage && (
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 arabic-text letter-font">
                {generatedLetter.schoolName} - {new Date(generatedLetter.createdAt).getFullYear()}
              </p>
            </div>
          )}
        </div>
      </div>
  );

  if (isForImageGeneration) {
    return letterContent;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg no-print">
          <CardHeader>
              <Input 
                  type="text"
                  value={editingLetterName || generatedLetter.name}
                  onChange={(e) => setEditingLetterName(e.target.value)}
                  className="text-xl font-bold arabic-text text-center border-b-2 border-gray-300 focus:border-purple-500 outline-none"
                  placeholder={`اسم ${titleSlice}`}
              />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={onEditContent} className="flex items-center gap-2" variant="outline">
                <Edit className="w-4 h-4" /> تعديل المحتوى
              </Button>
              <Button onClick={onSaveLetter} className="gradient-bg-2 text-white flex items-center gap-2">
                <Save className="w-4 h-4" /> حفظ {titleSlice}
              </Button>
              <Button onClick={onPrintLetter} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" /> طباعة/تصدير PDF
              </Button>
              <Button onClick={onNewLetter} variant="outline">
                إنشاء {titleSlice} جديد
              </Button>
            </div>
          </CardContent>
        </Card>
        {letterContent}
      </div>
    </motion.div>
  );
};

export default LetterPreview;