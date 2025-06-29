export const toSafeString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join('\n');
  return String(value);
};

export const setupPresentation = (PptxGenJS, planData) => {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.rtlMode = true;
  const schoolName = planData.school_name_full || "اسم المدرسة غير متوفر";
  const textColor = "000000";
  const textShadow = { type: 'outer', color: 'FFFFFF', blur: 1, offset: 1, angle: 45, opacity: 0.5 };
  
  pptx.defineLayout({ name: "MASTER_SLIDE_WITH_BACKGROUND", width: 13.33, height: 7.5 });

  return { pptx, schoolName, textColor, textShadow };
};

export const addBackgroundToSlide = async (slide, templateUrl) => {
  if (templateUrl) {
    try {
      const response = await fetch(templateUrl, { mode: 'cors' });
      if (response.ok) {
        slide.addImage({ path: templateUrl, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: 13.33, h: 7.5 } });
        return true;
      }
    } catch (e) {
      console.warn("Error fetching template image, using fallback color:", e);
    }
  }
  slide.background = { color: "FFFFFF" };
  return false;
};

export const addSectionSlide = async (pptx, title, templateUrl, styles) => {
  const slide = pptx.addSlide({ masterName: "MASTER_SLIDE_WITH_BACKGROUND" });
  await addBackgroundToSlide(slide, templateUrl);
  slide.addText(title, { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: styles.textColor, rtlMode: true, shadow: styles.textShadow });
  return slide;
};

export const createNewSlideIfNeeded = async (pptx, currentSlide, currentY, sectionTitle, templateUrl, styles) => {
  if (currentY > 6.8) {
    const newSlide = await addSectionSlide(pptx, `${sectionTitle} (تابع)`, templateUrl, styles);
    return { slide: newSlide, y: 1.2 };
  }
  return { slide: currentSlide, y: currentY };
};