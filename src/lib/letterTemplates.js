export const letterTemplates = (schoolName) => ({
  external: {
    header: 'بسم الله الرحمن الرحيم', 
    greetingPrefix: 'سعادة مدير عام / رئيس / محافظ ',
    closing: 'وتفضلوا بقبول فائق الاحترام والتقدير،', 
    signature: `إدارة مدرسة ${schoolName || 'المدرسة'}`
  },
  bulletin: {
    boys: { 
      header: 'نشرة داخلية للمعلمين', 
      greeting: 'الزملاء الكرام معلمي مدرسة/', 
      closing: 'مع خالص تمنياتنا لكم بالتوفيق والسداد،', 
      signature: `إدارة مدرسة ${schoolName || 'المدرسة'}`
    },
    girls: { 
      header: 'نشرة داخلية للمعلمات', 
      greeting: 'الزميلات الكريمات معلمات مدرسة/', 
      closing: 'مع خالص تمنياتنا لكنّ بالتوفيق والسداد،', 
      signature: `إدارة مدرسة ${schoolName || 'المدرسة'}`
    },
  },
  notification: {
    boys: { 
      header: 'تبليغ إداري للمعلمين', 
      greeting: 'الزملاء الكرام معلمي مدرسة/', 
      closing: 'نشكر لكم حسن تعاونكم وتفهمكم،', 
      signature: `إدارة مدرسة ${schoolName || 'المدرسة'}`
    },
    girls: { 
      header: 'تبليغ إداري للمعلمات', 
      greeting: 'الزميلات الكريمات معلمات مدرسة/', 
      closing: 'نشكر لكنّ حسن تعاونكنّ وتفهمكنّ،', 
      signature: `إدارة مدرسة ${schoolName || 'المدرسة'}`
    },
  }
});