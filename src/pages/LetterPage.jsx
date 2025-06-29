import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, FileText, Upload, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2pdf from 'html2pdf.js';

import { useLetterTemplates } from '@/contexts/LetterImageContext';
import LetterForm from '@/components/letter/LetterForm';
import LetterPreview from '@/components/letter/LetterPreview';
import SavedLettersList from '@/components/letter/SavedLettersList.jsx';
import LetterPreviewDialog from '@/components/letter/LetterPreviewDialog.jsx';
import ShareLinkDialog from '@/components/letter/ShareLinkDialog.jsx';
import { generateLetterContent, createFinalLetterObject, saveLetterToStorage, loadLettersFromStorage, deleteLetterFromStorage } from '@/lib/letterUtils.js';
import { supabase } from '@/lib/supabase';
import TemplateUploadDialog from '@/components/operational-plan/TemplateUploadDialog';

const LetterPage = ({ type, title: pageTitle }) => {
  const { user, schoolId } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { letterTemplates, updateLetterTemplate } = useLetterTemplates();
  const currentTemplateUrl = letterTemplates[type];
  const offscreenPreviewRef = useRef(null);

  const [geminiApiKey, setGeminiApiKey] = useState(null);
  const [loadingApiKey, setLoadingApiKey] = useState(true);
  const [genAI, setGenAI] = useState(null);
  const [model, setModel] = useState(null);
  
  const initialLetterData = {
    title: '',
    gender: type === 'external' ? '' : 'boys',
    customContent: '', 
    recipient: type === 'external' ? 'وزارة التعليم' : '',
  };

  const [letterData, setLetterData] = useState(initialLetterData);
  const [currentFinalLetter, setCurrentFinalLetter] = useState(null);
  const [savedLetters, setSavedLetters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewImageDataUrl, setPreviewImageDataUrl] = useState('');
  
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const templateColumnMap = {
    external: 'official_pdf_template_url',
    bulletin: 'bulletin_template_url',
    notification: 'notification_template_url',
  };
  const templateColumn = templateColumnMap[type];

  useEffect(() => {
    const fetchApiKeyAndInitialize = async () => {
      setLoadingApiKey(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-gemini-api-key');
        if (error) throw error;
        if (data && data.apiKey) {
          setGeminiApiKey(data.apiKey);
          const aiInstance = new GoogleGenerativeAI(data.apiKey);
          setGenAI(aiInstance);
          setModel(aiInstance.getGenerativeModel({ model: "gemini-1.5-flash-latest" }));
        } else {
          throw new Error("API Key not found in function response.");
        }
      } catch (error) {
        console.error("Error fetching Gemini API Key:", error);
        toast({ title: "خطأ في تهيئة الذكاء الاصطناعي", description: "لم نتمكن من تحميل مفتاح API.", variant: "destructive" });
      } finally {
        setLoadingApiKey(false);
      }
    };
    fetchApiKeyAndInitialize();
  }, [toast]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSavedLetters(loadLettersFromStorage(type, user.id));
    
    const fetchTemplate = async () => {
        if (schoolId && !letterTemplates[type]) {
            const { data, error } = await supabase
                .from('schools')
                .select(templateColumn)
                .eq('id', schoolId)
                .single();

            if (error) {
                console.warn(`Could not fetch template for ${type}:`, error.message);
            } else if (data && data[templateColumn]) {
                updateLetterTemplate(type, data[templateColumn]);
            }
        }
    };
    fetchTemplate();

  }, [user, navigate, type, schoolId, letterTemplates, updateLetterTemplate, templateColumn]);

  useEffect(() => {
      if (currentFinalLetter && offscreenPreviewRef.current) {
          const element = offscreenPreviewRef.current;
          const opt = {
              margin: 0,
              filename: 'letter.png',
              image: { type: 'png', quality: 1.0 },
              html2canvas: { scale: 3, useCORS: true, logging: false },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
              pagebreak: { mode: 'avoid-all' }
          };

          html2pdf().from(element).set(opt).outputImg('datauristring').then((dataUrl) => {
              setPreviewImageDataUrl(dataUrl);
              setIsPreviewDialogOpen(true);
              setCurrentFinalLetter(null);
              setIsCreatingPreview(false);
          }).catch(err => {
              console.error("Image generation failed", err);
              toast({ title: "خطأ", description: "فشل في إنشاء معاينة الصورة.", variant: "destructive" });
              setCurrentFinalLetter(null);
              setIsCreatingPreview(false);
          });
      }
  }, [currentFinalLetter, toast]);


  const handleGenerateContent = async () => {
    if (!model || loadingApiKey) {
      toast({ title: "الذكاء الاصطناعي غير جاهز", description: "يرجى الانتظار.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const content = await generateLetterContent(letterData, type, user, model);
      setLetterData(prev => ({ ...prev, customContent: content }));
      toast({ title: "تم توليد النص بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في توليد النص", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateLetter = () => {
    setIsCreatingPreview(true);
    try {
      const finalLetter = createFinalLetterObject(letterData, type, pageTitle, user);
      setCurrentFinalLetter(finalLetter);
    } catch (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      setIsCreatingPreview(false);
    }
  };
  
  const onLinkGenerated = useCallback((dbId, letterName, shareToken) => {
      const letterToSave = createFinalLetterObject(letterData, type, pageTitle, user);
      const finalObjectToSave = {
          ...letterToSave,
          name: letterName,
          db_id: dbId,
          share_token: shareToken
      };
      const updatedLetters = saveLetterToStorage(finalObjectToSave, type, user.id);
      setSavedLetters(updatedLetters);
      
      const shareUrl = `${window.location.origin}/announcement/view/${shareToken}`;
      setShareableLink(shareUrl);
      setIsShareDialogOpen(true);
  }, [letterData, type, pageTitle, user.id]);

  const handleLoadLetter = (letterToLoad) => {
    setLetterData({
        title: letterToLoad.title,
        gender: letterToLoad.gender || (type === 'external' ? '' : 'boys'),
        customContent: letterToLoad.content,
        recipient: letterToLoad.recipient || (type === 'external' ? 'وزارة التعليم' : ''),
    });
    toast({ title: `تم تحميل "${letterToLoad.name}"` });
  };

  const handleDeleteLetter = (letterIdToDelete) => {
    const updatedLetters = deleteLetterFromStorage(letterIdToDelete, type, user.id, savedLetters);
    setSavedLetters(updatedLetters);
    toast({ title: "تم حذف النموذج" });
  };
  
  const handleViewAcknowledgements = (letterDbId) => {
    navigate(`/announcement/admin/${letterDbId}`);
  };

  const handleShareLetter = (letter) => {
      if (!letter.share_token) {
          toast({ title: "خطأ", description: "رابط المشاركة غير متوفر لهذا النموذج.", variant: "destructive" });
          return;
      }
      const url = `${window.location.origin}/announcement/view/${letter.share_token}`;
      setShareableLink(url);
      setIsShareDialogOpen(true);
  };

  const handleTemplateUploadSuccess = (url) => {
    updateLetterTemplate(type, url);
  };
  
  if (!user || (loadingApiKey && !genAI)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
        <p className="ml-4 text-xl text-gray-700 arabic-text">جاري تهيئة المكونات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.header
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 no-print"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hidden sm:flex items-center gap-2">
              <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
            </Button>
            <div className="w-10 h-10 gradient-bg-2 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 arabic-text">{pageTitle}</h1>
              <p className="text-sm text-gray-600 arabic-text">إنشاء وتعديل {pageTitle.toLowerCase()}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            رفع القالب الرسمي
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <LetterForm
          letterData={letterData}
          setLetterData={setLetterData}
          type={type}
          pageTitle={pageTitle}
          isGenerating={isGenerating}
          onGenerateContent={handleGenerateContent}
          onCreateFinalLetter={handleCreateLetter}
          isApiKeyLoading={loadingApiKey}
          isModelReady={!!model}
          isCreatingPreview={isCreatingPreview}
        />
        <SavedLettersList
          savedLetters={savedLetters}
          pageTitle={pageTitle}
          onLoadLetter={handleLoadLetter}
          onDeleteLetter={handleDeleteLetter}
          onViewAcknowledgements={handleViewAcknowledgements}
          onShareLetter={handleShareLetter}
          type={type}
        />
      </div>

      <TemplateUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onTemplateUpload={handleTemplateUploadSuccess}
        templateType={templateColumn}
        schoolId={schoolId}
        title={`رفع القالب الرسمي لـ ${pageTitle}`}
        description="ارفع قالب بصيغة صورة (عمودي) ليتم استخدامه كخلفية للمستندات في هذا القسم."
      />
      
      {isPreviewDialogOpen && (
          <LetterPreviewDialog
              isOpen={isPreviewDialogOpen}
              onOpenChange={setIsPreviewDialogOpen}
              imageDataUrl={previewImageDataUrl}
              letterData={letterData}
              letterType={type}
              pageTitle={pageTitle}
              onLinkGenerated={onLinkGenerated}
          />
      )}

      {isShareDialogOpen && (
          <ShareLinkDialog
              isOpen={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
              announcementUrl={shareableLink}
          />
      )}

      {currentFinalLetter && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
          <div ref={offscreenPreviewRef} className="letter-container-for-image">
             <LetterPreview
              generatedLetter={currentFinalLetter}
              letterImage={currentTemplateUrl}
              isForImageGeneration={true}
              pageTitle={pageTitle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterPage;