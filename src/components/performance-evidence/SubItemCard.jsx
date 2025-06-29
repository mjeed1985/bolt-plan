import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import QRCodeDisplay from './QRCodeDisplay';

const SubItemCard = ({ subItem, evidence, onUpload, onView, onDelete }) => {
  const hasEvidence = evidence && evidence.file_url;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="h-full flex flex-col bg-card/80 dark:bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/50">
        <CardHeader className="flex-row items-start gap-4 pb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${hasEvidence ? 'bg-green-100 dark:bg-green-900/50' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
            {hasEvidence ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <CardTitle className="text-md font-bold text-foreground">{subItem.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">{subItem.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          {hasEvidence ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-background p-3 rounded-md border">
                <FileText className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground truncate flex-grow" title={evidence.file_name}>
                  {evidence.file_name}
                </p>
              </div>
              <QRCodeDisplay url={evidence.file_url} title={evidence.barcode_title} />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => onDelete(evidence.id, evidence.file_path)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600">
                  <Trash2 className="w-4 h-4 ml-1" />
                  حذف
                </Button>
                <Button variant="outline" size="sm" onClick={() => onView(evidence)}>
                  <Eye className="w-4 h-4 ml-1" />
                  عرض
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Button onClick={() => onUpload(subItem.id)} className="w-full">
                <Upload className="w-4 h-4 ml-2" />
                رفع ملف الشاهد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubItemCard;