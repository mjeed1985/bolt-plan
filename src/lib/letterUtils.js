import { letterTemplates } from '@/lib/letterTemplates.js';

export const generateLetterContent = async (letterData, type, user, model) => {
  if (!letterData.title.trim()) {
    throw new Error("يجب إدخال عنوان للمحتوى");
  }
  if (type === 'external' && !letterData.recipient.trim()) {
    throw new Error("يرجى تحديد الجهة الموجه إليها الخطاب الخارجي");
  }

  let promptTypeDescription = '';
  let targetAudience = '';
  let genderSpecificPrompt = '';

  if (type === 'external') {
    promptTypeDescription = 'خطاب خارجي رسمي موجه إلى جهة حكومية';
    targetAudience = letterData.recipient;
  } else if (type === 'bulletin') {
    promptTypeDescription = 'نشرة داخلية مدرسية';
    targetAudience = letterData.gender === 'boys' ? 'المعلمين' : 'المعلمات';
    genderSpecificPrompt = letterData.gender === 'boys' ? 'تأكد من أن الصياغة موجهة للمعلمين (مذكر) مثل: معلمون، زملاء، مشرفون.' : 'تأكد من أن الصياغة موجهة للمعلمات (مؤنث) مثل: معلمات، زميلات، مشرفات.';
  } else if (type === 'notification') {
    promptTypeDescription = 'تبليغ إداري مدرسي';
    targetAudience = letterData.gender === 'boys' ? 'المعلمين' : 'المعلمات';
    genderSpecificPrompt = letterData.gender === 'boys' ? 'تأكد من أن الصياغة موجهة للمعلمين (مذكر) مثل: معلمون، زملاء، مشرفون.' : 'تأكد من أن الصياغة موجهة للمعلمات (مؤنث) مثل: معلمات، زميلات، مشرفات.';
  }
  
  const prompt = `
    أنت مساعد متخصص في كتابة المراسلات المدرسية باللغة العربية الفصحى.
    المدرسة: ${user.schoolName}
    المرحلة الدراسية: ${user.schoolStage === 'primary' ? 'الابتدائية' : user.schoolStage === 'middle' ? 'المتوسطة' : user.schoolStage === 'secondary' ? 'الثانوية' : 'رياض الأطفال'}
    نوع المستند المطلوب: ${promptTypeDescription}
    موجه إلى: ${targetAudience}
    عنوان المحتوى: "${letterData.title}"
    ${genderSpecificPrompt}
    
    المطلوب: كتابة نص متكامل ومفصل حول العنوان المذكور، مع مراعاة الآتي:
    1.  استخدام لغة عربية فصحى رسمية وواضحة ومناسبة للمخاطب.
    2.  تضمين مقدمة مناسبة للموضوع.
    3.  عرض الأفكار الرئيسية بشكل منظم.
    4.  إذا كان الأمر يتطلب إجراءات أو توجيهات، اذكرها بوضوح.
    5.  تجنب أي عبارات خارجة عن السياق المدرسي الرسمي.
    6.  يجب أن يكون النص شاملاً بما يكفي ليغطي الموضوع بشكل جيد.
    7.  اجعل النص يتراوح بين 100 و 200 كلمة.
    8.  ${type !== 'external' ? 'استخدم الصيغة المناسبة للجنس المحدد في جميع الكلمات والضمائر.' : ''}
  `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

export const createFinalLetterObject = (letterData, type, pageTitle, user, currentLetterId, editingLetterName) => {
  if (!letterData.title.trim()) {
    throw new Error("يجب إدخال عنوان الخطاب");
  }
  if (type === 'external' && !letterData.recipient.trim()) {
    throw new Error("يرجى تحديد الجهة الموجه إليها الخطاب الخارجي");
  }
  if (!letterData.customContent.trim()) {
    throw new Error("محتوى الخطاب لا يمكن أن يكون فارغاً");
  }

  const userSchoolName = user?.schoolName || 'المدرسة';
  const currentTemplates = letterTemplates(userSchoolName);
  const template = type === 'external' ? currentTemplates.external : currentTemplates[type][letterData.gender];
  const currentDate = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  const letterId = currentLetterId || Date.now().toString();
  const letterFinalName = editingLetterName || `${pageTitle}: ${letterData.title} - ${currentDate}`;
  
  let fullGreeting = template.greeting;
  if (type === 'external') {
      fullGreeting = `${template.greetingPrefix}${letterData.recipient} المحترم،`;
  } else {
      fullGreeting = `${template.greeting}${userSchoolName}،`;
  }

  return {
    id: letterId,
    name: letterFinalName,
    title: letterData.title,
    type: type,
    gender: type === 'external' ? null : letterData.gender,
    recipient: type === 'external' ? letterData.recipient : null,
    content: letterData.customContent,
    template: { ...template, greeting: fullGreeting },
    schoolName: userSchoolName,
    date: currentDate,
    createdAt: new Date().toISOString(),
    userId: user.id
  };
};

export const saveLetterToStorage = (letterToSave, type, userId) => {
  const currentSavedLetters = JSON.parse(localStorage.getItem(`schoolLetters_${type}_${userId}`) || '[]');
  const existingIndex = currentSavedLetters.findIndex(l => l.id === letterToSave.id);

  let updatedLetters;
  if (existingIndex > -1) {
      updatedLetters = currentSavedLetters.map(l => l.id === letterToSave.id ? letterToSave : l);
  } else {
      updatedLetters = [...currentSavedLetters, letterToSave];
  }
  
  localStorage.setItem(`schoolLetters_${type}_${userId}`, JSON.stringify(updatedLetters));
  return updatedLetters;
};

export const loadLettersFromStorage = (type, userId) => {
  return JSON.parse(localStorage.getItem(`schoolLetters_${type}_${userId}`) || '[]');
};

export const deleteLetterFromStorage = (letterIdToDelete, type, userId, currentSavedLetters) => {
  const newSavedLetters = currentSavedLetters.filter(l => l.id !== letterIdToDelete);
  localStorage.setItem(`schoolLetters_${type}_${userId}`, JSON.stringify(newSavedLetters));
  return newSavedLetters;
};

export const printLetterWithPdfBackground = (generatedLetter, letterImage, letterHtmlContent) => {
  const letterheadImageUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/9c626aaf-b60f-48b1-9ea8-45500bea3d61/f5a426789cce78a4aebf1906a57cbbf7.jpg";
  const finalImageToUse = letterImage || letterheadImageUrl; 

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
      <html>
      <head>
          <title>طباعة ${generatedLetter.name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
          <style>
              body { margin: 0; font-family: 'Amiri', 'Times New Roman', serif; direction: rtl; }
              .print-page-container { 
                width: 210mm; 
                height: 297mm; 
                position: relative; 
                margin: auto; 
                background-image: url('${finalImageToUse}');
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-position: center;
                box-sizing: border-box;
              }
              .letter-content-wrapper {
                padding-top: 100px;
                padding-bottom: 50px;
                padding-right: 50px;
                padding-left: 50px;
                box-sizing: border-box;
                font-size: 14pt; 
                line-height: 1.8;
                text-align: right;
              }
              .letter-content-wrapper h1, .letter-content-wrapper h2, .letter-content-wrapper .text-center p { visibility: hidden; }
              .letter-content-wrapper .text-right p { margin-bottom: 10px; }
              .letter-content-wrapper .font-bold { font-weight: bold; }
              .letter-content-wrapper .text-center { text-align: center; }
              .letter-content-wrapper .mb-2 { margin-bottom: 0.5rem; }
              .letter-content-wrapper .mb-4 { margin-bottom: 1rem; }
              .letter-content-wrapper .mb-6 { margin-bottom: 1.5rem; }
              .letter-content-wrapper .mb-8 { margin-bottom: 2rem; }
              .letter-content-wrapper .mt-10 { margin-top: 2.5rem; }
              .letter-content-wrapper .mt-12 { margin-top: 3rem; }
              .letter-content-wrapper .mt-16 { margin-top: 4rem; }
              .letter-content-wrapper .text-3xl { font-size: 1.875rem; }
              .letter-content-wrapper .text-2xl { font-size: 1.5rem; }
              .letter-content-wrapper .text-xl { font-size: 1.25rem; }
              .letter-content-wrapper .text-lg { font-size: 1.125rem; }
              .letter-content-wrapper .text-sm { font-size: 0.875rem; }
              .letter-content-wrapper .leading-loose { line-height: 2; }
              .letter-content-wrapper .text-justify { text-align: justify; }
              .letter-content-wrapper .whitespace-pre-line { white-space: pre-line; }
              .letter-content-wrapper .mx-auto { margin-left: auto; margin-right: auto; }
              .letter-content-wrapper .w-60 { width: 15rem; }
              .letter-content-wrapper .border-t { border-top-width: 1px; }
              .letter-content-wrapper .border-gray-400 { border-color: #9ca3af; }
              
              @media print {
                  @page { size: A4; margin: 0; }
                  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  .no-print { display: none; }
              }
          </style>
      </head>
      <body>
          <div class="print-page-container">
            <div class="letter-content-wrapper">
              <div class="text-right mb-6">
                <p class="arabic-text letter-font">التاريخ: ${generatedLetter.date}</p>
              </div>
              <div class="mb-6">
                <h3 class="text-xl font-bold text-center arabic-text letter-font mb-6">
                  الموضوع: ${generatedLetter.title}
                </h3>
              </div>
              <div class="mb-8">
                <p class="arabic-text letter-font text-lg mb-4">${generatedLetter.template.greeting}</p>
                <p class="arabic-text letter-font leading-loose text-justify whitespace-pre-line">
                  ${generatedLetter.content}
                </p>
              </div>
              <div class="mt-10">
                <p class="arabic-text letter-font text-lg mb-4">${generatedLetter.template.closing}</p>
                <div class="text-center mt-12">
                  <p class="arabic-text letter-font font-bold">${generatedLetter.template.signature}</p>
                </div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
      </body>
      </html>
  `);
  printWindow.document.close();
  printWindow.focus();
};