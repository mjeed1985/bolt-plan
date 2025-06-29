import React from 'react';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const QRCodeDisplay = ({ url, title }) => {
  if (!url) return null;

  const safeUrl = encodeURI(url);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-50 dark:bg-slate-800/50 border-dashed border-slate-300 dark:border-slate-700 text-center">
        <CardHeader>
          <CardTitle className="text-md font-semibold text-slate-700 dark:text-slate-200">
            {title || 'رابط ملف الشاهد'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="p-2 bg-white rounded-lg shadow-md">
            <QRCode
              value={safeUrl}
              size={128}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
              renderAs={"svg"}
            />
          </div>
          <a 
            href={safeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline break-all"
          >
            {url}
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QRCodeDisplay;