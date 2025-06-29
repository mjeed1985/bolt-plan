import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Users, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedLettersList = ({ savedLetters, pageTitle, onLoadLetter, onDeleteLetter, onViewAcknowledgements, onShareLetter, type }) => {
  if (!savedLetters || savedLetters.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="max-w-3xl mx-auto mt-8 bg-white/80 backdrop-blur-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="arabic-text text-center">النماذج المحفوظة من {pageTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 arabic-text">لا توجد نماذج محفوظة حالياً.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <Card className="max-w-3xl mx-auto mt-8 bg-white/80 backdrop-blur-md border-0 shadow-lg">
        <CardHeader><CardTitle className="arabic-text text-center">النماذج المحفوظة من {pageTitle}</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {savedLetters.map(l => (
              <li key={l.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm">
                <span className="arabic-text font-medium">{l.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onLoadLetter(l)} className="flex items-center gap-1">
                    <Eye className="w-4 h-4"/> عرض
                  </Button>
                   {(type === 'notification' || type === 'bulletin') && l.db_id && (
                    <>
                      <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => onShareLetter(l)} 
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                          <Share2 className="w-4 h-4"/> مشاركة
                      </Button>
                      <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => onViewAcknowledgements(l.db_id)} 
                          className="flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                      >
                          <Users className="w-4 h-4"/> المطلعون
                      </Button>
                    </>
                   )}
                  <Button size="sm" variant="destructive" onClick={() => onDeleteLetter(l.id)} className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4"/> حذف
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavedLettersList;