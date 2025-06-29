import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Users, UserCheck, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

const LetterForm = ({ letterData, setLetterData, type, pageTitle, isGenerating, onGenerateContent, onCreateFinalLetter, isApiKeyLoading, isModelReady, isCreatingPreview }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(letterData.customContent);

  const handleContentEdit = () => {
    setIsEditing(true);
    setEditedContent(letterData.customContent);
  };

  const saveContentEdit = () => {
    setLetterData(prev => ({ ...prev, customContent: editedContent }));
    setIsEditing(false);
  };

  const boysButtonClass = cn(
    "flex-1 flex items-center gap-2 transition-all duration-300",
    letterData.gender === 'boys' 
      ? "bg-green-100 hover:bg-green-200 text-green-700 border-green-300 shadow-md scale-105" 
      : "border-gray-300 hover:bg-gray-50"
  );

  const girlsButtonClass = cn(
    "flex-1 flex items-center gap-2 transition-all duration-300",
    letterData.gender === 'girls' 
      ? "bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300 shadow-md scale-105" 
      : "border-gray-300 hover:bg-gray-50"
  );
  
  const isCreateButtonDisabled = !letterData.customContent.trim() || !letterData.title.trim() || (type === 'external' && !letterData.recipient.trim()) || isCreatingPreview;

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center arabic-text">إعداد {pageTitle.slice(0, -1)} جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="arabic-text">عنوان {pageTitle.slice(0, -1)}</Label>
            <Input 
              value={letterData.title} 
              onChange={(e) => setLetterData({...letterData, title: e.target.value})} 
              placeholder={`أدخل عنوان ${pageTitle.slice(0, -1)}`} 
              className="text-right arabic-text" 
            />
          </div>
          
          {type === 'external' && (
            <div>
              <Label className="arabic-text">الخطاب موجّه إلى من؟</Label>
              <Input 
                value={letterData.recipient} 
                onChange={(e) => setLetterData({...letterData, recipient: e.target.value})} 
                placeholder="مثال: وزارة التعليم، إدارة التعليم بمنطقة..." 
                className="text-right arabic-text" 
              />
            </div>
          )}

          {(type === 'bulletin' || type === 'notification') && (
            <div>
              <Label className="arabic-text">موجه إلى:</Label>
              <div className="flex gap-4 mt-2">
                <Button 
                  onClick={() => setLetterData({...letterData, gender: 'boys'})} 
                  variant={'outline'}
                  className={boysButtonClass}
                >
                  <Users className="w-4 h-4"/> بنين (معلمين)
                </Button>
                <Button 
                  onClick={() => setLetterData({...letterData, gender: 'girls'})} 
                  variant={'outline'}
                  className={girlsButtonClass}
                >
                  <UserCheck className="w-4 h-4"/> بنات (معلمات)
                </Button>
              </div>
            </div>
          )}

          <div>
            <Button 
              onClick={onGenerateContent} 
              disabled={isGenerating || !letterData.title.trim() || (type === 'external' && !letterData.recipient.trim()) || isApiKeyLoading || !isModelReady} 
              className="w-full gradient-bg-3 text-white flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isGenerating ? 'جاري توليد النص...' : (isApiKeyLoading || !isModelReady) ? 'الذكاء الاصطناعي قيد التهيئة...' : `توليد محتوى ${pageTitle.slice(0,-1)} (بالذكاء الاصطناعي)`}
            </Button>
            {(isApiKeyLoading || !isModelReady) && <p className="text-xs text-center text-gray-500 mt-1">قد يستغرق تهيئة الذكاء الاصطناعي بضع لحظات عند التحميل الأول.</p>}
          </div>

          <div>
            <Label className="arabic-text">محتوى {pageTitle.slice(0, -1)}</Label>
            {isEditing ? (
              <>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="text-right arabic-text letter-font mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">إلغاء</Button>
                  <Button onClick={saveContentEdit} className="gradient-bg-2">حفظ التعديلات</Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="bg-gray-50 p-4 rounded-md text-right arabic-text letter-font min-h-[200px]">
                    {letterData.customContent}
                  </div>
                  {letterData.customContent && (
                    <Button
                      onClick={handleContentEdit}
                      className="absolute top-2 left-2"
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل المحتوى
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={onCreateFinalLetter} 
              disabled={isCreateButtonDisabled} 
              className="gradient-bg-2 text-white px-8 flex items-center gap-2"
            >
              {isCreatingPreview ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isCreatingPreview ? `جاري إنشاء المعاينة...` : `معاينة وإنشاء ${pageTitle.slice(0,-1)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LetterForm;