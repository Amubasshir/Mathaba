"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// type Language = 'en' | 'ar';
type Language =
  | "ar"
  | "en"
  | "fr"
  | "fa"
  | "ms"
  | "ur"
  | "tr"
  | "id"
  | "ha"
  | "es"
  | "ru"
  | "si"
  | "am"
  | "my"
  | "hi"
  | "uz";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  categories: Category[];
};

// Add these new type definitions
type Category = {
  id: number;
  category: {
    name: {
      en: string;
      ar: string;
      fr: string;
      fa: string;
      ms: string;
      ur: string;
      tr: string;
      id: string;
      ha: string;
      es: string;
      ru: string;
      si: string;
      am: string;
      my: string;
      hi: string;
      uz: string;
    };
    questions: Question[];
  };
};

type Question = {
  question: {
    en: string;
    ar: string;
    fr: string;
    fa: string;
    ms: string;
    ur: string;
    tr: string;
    id: string;
    ha: string;
    es: string;
    ru: string;
    si: string;
    am: string;
    my: string;
    hi: string;
    uz: string;
  };
  answer: {
    en: string;
    ar: string;
    fr: string;
    fa: string;
    ms: string;
    ur: string;
    tr: string;
    id: string;
    ha: string;
    es: string;
    ru: string;
    si: string;
    am: string;
    my: string;
    hi: string;
    uz: string;
  };
};

// const translations = {
//   en: {
//     "research.centers": "Locations",
//     "ask.me": "Ask me",
//     feedback: "Feedback",
//     // Add more translations as needed
//   },
//   ar: {
//     "research.centers": "المواقع",
//     "ask.me": "اسألني",
//     feedback: "تعليقات",
//     // Add more translations as needed
//   },
// };
const translations: Record<Language, {
  "research.centers": string;
  "ask.me": string;
  feedback: string;
}> = {
  en: {
    "research.centers": "Locations",
    "ask.me": "Ask me",
    feedback: "Feedback",
  },
  ar: {
    "research.centers": "المواقع",
    "ask.me": "اسألني",
    feedback: "تعليقات",
  },
  fr: {
    "research.centers": "Emplacements",
    "ask.me": "Demande-moi",
    feedback: "Retour d'information",
  },
  fa: {
    "research.centers": "مکان‌ها",
    "ask.me": "از من بپرس",
    feedback: "بازخورد",
  },
  ms: {
    "research.centers": "Lokasi",
    "ask.me": "Tanya saya",
    feedback: "Maklum balas",
  },
  ur: {
    "research.centers": "مقامات",
    "ask.me": "مجھ سے پوچھیں",
    feedback: "رائے",
  },
  tr: {
    "research.centers": "Konumlar",
    "ask.me": "Bana sor",
    feedback: "Geri bildirim",
  },
  id: {
    "research.centers": "Lokasi",
    "ask.me": "Tanya saya",
    feedback: "Masukan",
  },
  ha: {
    "research.centers": "Wurare",
    "ask.me": "Tambaye ni",
    feedback: "Ra'ayi",
  },
  es: {
    "research.centers": "Ubicaciones",
    "ask.me": "Pregúntame",
    feedback: "Comentarios",
  },
  ru: {
    "research.centers": "Места",
    "ask.me": "Спроси меня",
    feedback: "Обратная связь",
  },
  si: {
    "research.centers": "ස්ථාන",
    "ask.me": "මගෙන් අහන්න",
    feedback: "ප්‍රතිපෝෂණය",
  },
  am: {
    "research.centers": "አካባቢዎች",
    "ask.me": "እኔን ጠይቅ",
    feedback: "አስተያየት",
  },
  my: {
    "research.centers": "နေရာများ",
    "ask.me": "ငါ့ကိုမေးပါ",
    feedback: "တုံ့ပြန်ချက်",
  },
  hi: {
    "research.centers": "स्थान",
    "ask.me": "मुझसे पूछें",
    feedback: "प्रतिपुष्टि",
  },
  uz: {
    "research.centers": "Joylashuvlar",
    "ask.me": "Mendan so‘ra",
    feedback: "Fikr-mulohaza",
  },
};

// const categories = [
//   {
//     id: 1,
//     category: {
//       name: {
//         en: "Health Question",
//         ar: "سؤال صحي",
//       },
//       questions: [
//         {
//           question: {
//             en: "What is the significance of physical ability in performing Umrah and Hajj?",
//             ar: "ما أهمية القدرة البدنية في أداء العمرة والحج؟",
//           },
//           answer: {
//             en: "Physical ability is a condition for performing Umrah and Hajj as it requires great physical effort.",
//             ar: "القدرة البدنية شرط لأداء العمرة والحج حيث يتطلب جهداً بدنياً كبيراً.",
//           },
//         },
//         {
//           question: {
//             en: "How should pilgrims manage their medications during Umrah and Hajj?",
//             ar: "كيف يجب على الحجاج إدارة أدويتهم خلال العمرة والحج؟",
//           },
//           answer: {
//             en: "Pilgrims should take sufficient medications and store them at the correct temperature.",
//             ar: "يجب على الحجاج أخذ الأدوية الكافية وتخزينها في درجة الحرارة المناسبة.",
//           },
//         },
//         {
//           question: {
//             en: "What are the recommendations for preventing food poisoning during Umrah and Hajj?",
//             ar: "ما هي التوصيات للوقاية من التسمم الغذائي خلال العمرة والحج؟",
//           },
//           answer: {
//             en: "Avoid eating food that has been stored for long periods and ensure fruits and vegetables are washed.",
//             ar: "تجنب تناول الطعام المخزن لفترات طويلة والتأكد من غسل الفواكه والخضروات.",
//           },
//         },
//         {
//           question: {
//             en: "Why are face masks important during Umrah and Hajj?",
//             ar: "لماذا تعتبر الكمامات مهمة خلال العمرة والحج؟",
//           },
//           answer: {
//             en: "Face masks help prevent the spread of infectious viruses and should be worn in crowded places.",
//             ar: "تساعد الكمامات في منع انتشار الفيروسات المعدية ويجب ارتداؤها في الأماكن المزدحمة.",
//           },
//         },
//       ],
//     },
//   },
//   {
//     id: 2,
//     category: {
//       name: {
//         en: "Financial Awareness Question",
//         ar: "سؤال التوعية المالية",
//       },
//       questions: [
//         {
//           question: {
//             en: "What are the ways to convert currency in Saudi Arabia?",
//             ar: "ما هي طرق تحويل العملة في المملكة العربية السعودية؟",
//           },
//           answer: {
//             en: "Currency conversion can be done at certified exchanges, licensed banks, and electronic banks.",
//             ar: "يمكن تحويل العملة في مراكز الصرافة المعتمدة والبنوك المرخصة والبنوك الإلكترونية.",
//           },
//         },
//         {
//           question: {
//             en: "What items require a customs declaration upon entering and leaving Saudi Arabia?",
//             ar: "ما هي الأشياء التي تتطلب إقراراً جمركياً عند دخول المملكة العربية السعودية ومغادرتها؟",
//           },
//           answer: {
//             en: "You must declare cash over 60,000 riyals, gold bars, and precious metals.",
//             ar: "يجب الإقرار عن النقد الذي يزيد عن 60,000 ريال، وسبائك الذهب، والمعادن الثمينة.",
//           },
//         },
//         {
//           question: {
//             en: "Which electronic payment methods are accepted in Saudi Arabia?",
//             ar: "ما هي وسائل الدفع الإلكترونية المقبولة في المملكة العربية السعودية؟",
//           },
//           answer: {
//             en: "Credit cards, bank transfers, and SADAD are commonly accepted electronic payment methods.",
//             ar: "البطاقات الائتمانية والتحويلات البنكية ونظام سداد هي وسائل الدفع الإلكترونية الشائعة.",
//           },
//         },
//         {
//           question: {
//             en: "Is it necessary to carry a lot of cash during a trip to Saudi Arabia?",
//             ar: "هل من الضروري حمل الكثير من النقود خلال الرحلة إلى المملكة العربية السعودية؟",
//           },
//           answer: {
//             en: "No, as most financial transactions can be made with electronic payments.",
//             ar: "لا، حيث يمكن إجراء معظم المعاملات المالية عبر وسائل الدفع الإلكترونية.",
//           },
//         },
//       ],
//     },
//   },
//   {
//     id: 3,
//     category: {
//       name: {
//         en: "Legal Awareness Question",
//         ar: "سؤال التوعية القانونية",
//       },
//       questions: [
//         {
//           question: {
//             en: "What penalties face a licensee who violates rules in Saudi Arabia for pilgrim-related services?",
//             ar: "ما هي العقوبات التي يواجهها المرخص له الذي يخالف القواعد في المملكة العربية السعودية للخدمات المتعلقة بالحجاج؟",
//           },
//           answer: {
//             en: "Penalties include license revocation, fines up to SR100,000, and possible suspension.",
//             ar: "تشمل العقوبات إلغاء الترخيص وغرامات تصل إلى 100,000 ريال سعودي والإيقاف المحتمل.",
//           },
//         },
//         {
//           question: {
//             en: "What happens if someone provides pilgrim services without a license?",
//             ar: "ماذا يحدث إذا قدم شخص خدمات للحجاج بدون ترخيص؟",
//           },
//           answer: {
//             en: "They face a fine up to SR100,000, which can double upon repeat offenses.",
//             ar: "يواجهون غرامة تصل إلى 100,000 ريال سعودي، ويمكن أن تتضاعف عند تكرار المخالفات.",
//           },
//         },
//         {
//           question: {
//             en: "What are the responsibilities of a domestic pilgrims service provider?",
//             ar: "ما هي مسؤوليات مقدم خدمات الحجاج المحليين؟",
//           },
//           answer: {
//             en: "They must provide all necessary services to registered pilgrims and ensure smooth performance of rituals.",
//             ar: "يجب عليهم تقديم جميع الخدمات اللازمة للحجاج المسجلين وضمان أداء المناسك بسلاسة.",
//           },
//         },
//         {
//           question: {
//             en: "Is it mandatory for service contracts with pilgrims to follow a standard model?",
//             ar: "هل من الإلزامي أن تتبع عقود الخدمة مع الحجاج نموذجاً موحداً؟",
//           },
//           answer: {
//             en: "Yes, they should follow a unified form issued by the Ministry of Umrah and Hajj.",
//             ar: "نعم، يجب أن تتبع النموذج الموحد الصادر عن وزارة العمرة والحج.",
//           },
//         },
//       ],
//     },
//   },
//   {
//     id: 4,
//     category: {
//       name: {
//         en: "Al-Masjid Al-Haram Question",
//         ar: "سؤال المسجد الحرام",
//       },
//       questions: [
//         {
//           question: {
//             en: "What is the significance of the Black Stone in Islam?",
//             ar: "ما هي أهمية الحجر الأسود في الإسلام؟",
//           },
//           answer: {
//             en: "The Black Stone is a stone from Paradise and serves as the start and finish point of each circuit around the Ka'ba.",
//             ar: "الحجر الأسود هو حجر من الجنة ويعتبر نقطة البداية والنهاية لكل شوط حول الكعبة.",
//           },
//         },
//         {
//           question: {
//             en: "Where is the Black Stone located in the Ka'ba?",
//             ar: "أين يقع الحجر الأسود في الكعبة؟",
//           },
//           answer: {
//             en: "It is located in the southeastern corner of the Ka'ba, 1.5 meters from the ground.",
//             ar: "يقع في الركن الجنوبي الشرقي للكعبة، على ارتفاع 1.5 متر من الأرض.",
//           },
//         },
//         {
//           question: {
//             en: "How should pilgrims interact with the Black Stone during pilgrimage?",
//             ar: "كيف يجب على الحجاج التعامل مع الحجر الأسود أثناء الحج؟",
//           },
//           answer: {
//             en: "Pilgrims should touch and kiss the Black Stone after each circuit if possible; otherwise, waving at it from afar is acceptable.",
//             ar: "يجب على الحجاج لمس وتقبيل الحجر الأسود بعد كل شوط إذا أمكن؛ وإلا فالإشارة إليه من بعيد مقبولة.",
//           },
//         },
//         {
//           question: {
//             en: "What is Maqam Ibraaheem and its significance?",
//             ar: "ما هو مقام إبراهيم وما أهميته؟",
//           },
//           answer: {
//             en: "Maqam Ibraaheem is where Ibrahim stood building the Ka'ba, and it is a sign in the Haram with the prophet's footprints.",
//             ar: "مقام إبراهيم هو المكان الذي وقف فيه إبراهيم عند بناء الكعبة، وهو علامة في الحرم تحتوي على آثار أقدام النبي.",
//           },
//         },
//       ],
//     },
//   },
// ];

const categories = [
  {
    id: 1,
    category: {
      name: {
        en: "Health Question",
        ar: "سؤال صحي",
        fr: "Question de santé",
        fa: "سوال بهداشتی",
        ms: "Soalan Kesihatan",
        ur: "صحت کا سوال",
        tr: "Sağlık Sorusu",
        id: "Pertanyaan Kesehatan",
        ha: "Tambayar Lafiya",
        es: "Pregunta de salud",
        ru: "Вопрос о здоровье",
        si: "සෞඛ්‍ය ප්‍රශ්නය",
        am: "የጤና ጥያቄ",
        my: "ကျန်းမာရေးမေးခွန်း",
        hi: "स्वास्थ्य प्रश्न",
        uz: "Sog'liq savoli",
      },
      questions: [
        {
          question: {
            en: "What is the significance of physical ability in performing Umrah and Hajj?",
            ar: "ما أهمية القدرة البدنية في أداء العمرة والحج؟",
            fr: "Quelle est l'importance de la capacité physique dans l'accomplissement de la Omra et du Hajj ?",
            fa: "اهمیت توانایی جسمی در انجام عمره و حج چیست؟",
            ms: "Apakah kepentingan keupayaan fizikal dalam melaksanakan Umrah dan Haji?",
            ur: "عمرہ اور حج کرنے میں جسمانی صلاحیت کی کیا اہمیت ہے؟",
            tr: "Umre ve Hac yapmada fiziksel yeteneğin önemi nedir?",
            id: "Apa pentingnya kemampuan fisik dalam melaksanakan Umrah dan Haji?",
            ha: "Menene mahimmancin iyawar jiki wajen yin Umrah da Hajji?",
            es: "¿Cuál es la importancia de la capacidad física para realizar la Umrah y el Hajj?",
            ru: "Каково значение физической способности в совершении Умры и Хаджа?",
            si: "උම්රා සහ හජ් ඉටු කිරීමේදී ශාරීරික හැකියාවේ වැදගත්කම කුමක්ද?",
            am: "ኡምራ እና ሀጅን በመፈጸም ረገድ የአካል ብቃት አስፈላጊነት ምንድነው?",
            my: "အုမ်ရာနှင့် ဟဂ်ျပြုလုပ်ရာတွင် ရုပ်ပိုင်းဆိုင်ရာစွမ်းရည်၏ အရေးပါမှုကား အဘယ်နည်း။",
            hi: "उमराह और हज करने में शारीरिक क्षमता का क्या महत्व है?",
            uz: "Umra va Haj qilishda jismoniy qobiliyatning ahamiyati nimada?",
          },
          answer: {
            en: "Physical ability is a condition for performing Umrah and Hajj as it requires great physical effort.",
            ar: "القدرة البدنية شرط لأداء العمرة والحج حيث يتطلب جهداً بدنياً كبيراً.",
            fr: "La capacité physique est une condition pour effectuer la Omra et le Hajj car elle nécessite un grand effort physique.",
            fa: "توانایی جسمی شرط انجام عمره و حج است زیرا تلاش بدنی زیادی را می طلبد.",
            ms: "Keupayaan fizikal adalah syarat untuk melaksanakan Umrah dan Haji kerana ia memerlukan usaha fizikal yang besar.",
            ur: "عمرہ اور حج کرنے کے لیے جسمانی صلاحیت ایک شرط ہے کیونکہ اس میں جسمانی محنت درکار ہوتی ہے۔",
            tr: "Fiziksel yetenek, büyük fiziksel çaba gerektirdiği için Umre ve Hac yapmanın bir koşuludur.",
            id: "Kemampuan fisik adalah syarat untuk melaksanakan Umrah dan Haji karena membutuhkan usaha fisik yang besar.",
            ha: "Iyawar jiki wani sharadi ne na yin Umrah da Hajji domin yana bukatar kokari mai yawa.",
            es: "La capacidad física es una condición para realizar la Umrah y el Hajj, ya que requiere un gran esfuerzo físico.",
            ru: "Физическая способность является условием для совершения Умры и Хаджа, поскольку это требует больших физических усилий.",
            si: "උම්රා සහ හජ් ඉටු කිරීම සඳහා ශාරීරික හැකියාව කොන්දේසියක් වන අතර එයට විශාල ශාරීරික වෑයමක් අවශ්‍ය වේ.",
            am: "የአካል ብቃት ኡምራን እና ሀጅን ለመፈፀም ቅድመ ሁኔታ ነው ምክንያቱም ከፍተኛ የአካል ብቃት እንቅስቃሴን ይጠይቃል።",
            my: "ရုပ်ပိုင်းဆိုင်ရာစွမ်းရည်သည် အွမ္မရာနှင့်ဟဂ်ျပြုလုပ်ရန်အတွက် အခြေအနေတစ်ခုဖြစ်ပြီး ၎င်းသည် ကြီးမားသောရုပ်ပိုင်းဆိုင်ရာအားထုတ်မှုကို လိုအပ်သောကြောင့်ဖြစ်သည်။",
            hi: "उमराह और हज करने के लिए शारीरिक क्षमता एक शर्त है क्योंकि इसमें बहुत शारीरिक प्रयास की आवश्यकता होती है।",
            uz: "Jismoniy qobiliyat Umra va Haj qilish uchun shartdir, chunki u katta jismoniy kuch talab qiladi.",
          },
        },
        {
          question: {
            en: "How should pilgrims manage their medications during Umrah and Hajj?",
            ar: "كيف يجب على الحجاج إدارة أدويتهم خلال العمرة والحج؟",
            fr: "Comment les pèlerins doivent-ils gérer leurs médicaments pendant la Omra et le Hajj ?",
            fa: "حجاج چگونه باید داروهای خود را در طول عمره و حج مدیریت کنند؟",
            ms: "Bagaimanakah jemaah haji harus menguruskan ubat-ubatan mereka semasa Umrah dan Haji?",
            ur: "عمرہ اور حج کے دوران حجاج کو اپنی دوائیں کیسے سنبھالنی چاہئیں؟",
            tr: "Hacılar Umre ve Hac sırasında ilaçlarını nasıl yönetmelidir?",
            id: "Bagaimana seharusnya jamaah haji mengelola obat-obatan mereka selama Umrah dan Haji?",
            ha: "Yaya mahajjata ya kamata su kula da magungunansu a lokacin Umrah da Hajji?",
            es: "¿Cómo deben los peregrinos administrar sus medicamentos durante la Umrah y el Hajj?",
            ru: "Как паломники должны управлять своими лекарствами во время Умры и Хаджа?",
            si: "උම්රා සහ හජ් සමයේදී වන්දනාකරුවන් ඔවුන්ගේ ඖෂධ කළමනාකරණය කළ යුත්තේ කෙසේද?",
            am: "ሐጅ አድራጊዎች በዑምራ እና በሐጅ ወቅት መድኃኒቶቻቸውን እንዴት ማስተዳደር አለባቸው?",
            my: "အုမ်ရာနှင့် ဟဂ်ျပြုလုပ်နေစဉ်အတွင်း ဘုရားဖူးများသည် ၎င်းတို့၏ဆေးဝါးများကို မည်သို့စီမံခန့်ခွဲသင့်သနည်း။",
            hi: "उमराह और हज के दौरान तीर्थयात्रियों को अपनी दवाएं कैसे प्रबंधित करनी चाहिए?",
            uz: "Ziyoratchilar Umra va Haj paytida o'z dori-darmonlarini qanday boshqarishlari kerak?",
          },
          answer: {
            en: "Pilgrims should take sufficient medications and store them at the correct temperature.",
            ar: "يجب على الحجاج أخذ الأدوية الكافية وتخزينها في درجة الحرارة المناسبة.",
            fr: "Les pèlerins doivent prendre suffisamment de médicaments et les conserver à la bonne température.",
            fa: "حجاج باید داروهای کافی مصرف کرده و در دمای مناسب نگهداری کنند.",
            ms: "Jemaah haji harus mengambil ubat-ubatan yang mencukupi dan menyimpannya pada suhu yang betul.",
            ur: "حجاج کو مناسب مقدار میں دوائیں لینی چاہئیں اور انہیں درست درجہ حرارت پر ذخیرہ کرنا چاہیے۔",
            tr: "Hacılar yeterli miktarda ilaç almalı ve bunları doğru sıcaklıkta saklamalıdır.",
            id: "Jamaah haji harus minum obat yang cukup dan menyimpannya pada suhu yang tepat.",
            ha: "Mahajjata ya kamata su sha magunguna sosai kuma su adana su a yanayin zafi da ya dace.",
            es: "Los peregrinos deben tomar suficientes medicamentos y almacenarlos a la temperatura correcta.",
            ru: "Паломники должны принимать достаточное количество лекарств и хранить их при правильной температуре.",
            si: "වන්දනාකරුවන් ප්‍රමාණවත් ඖෂධ ලබා ගත යුතු අතර ඒවා නිවැරදි උෂ්ණත්වයේ ගබඩා කළ යුතුය.",
            am: "ሐጅ አድራጊዎች በቂ መድሃኒት መውሰድ እና በትክክለኛው የሙቀት መጠን ማከማቸት አለባቸው።",
            my: "ဘုရားဖူးများသည် ဆေးဝါးများလုံလောက်စွာသောက်ပြီး မှန်ကန်သောအပူချိန်တွင် သိမ်းဆည်းထားသင့်သည်။",
            hi: "तीर्थयात्रियों को पर्याप्त दवाएं लेनी चाहिए और उन्हें सही तापमान पर स्टोर करना चाहिए।",
            uz: "Ziyoratchilar etarli miqdorda dori ichishlari va ularni to'g'ri haroratda saqlashlari kerak.",
          },
        },
        {
          question: {
            en: "What are the recommendations for preventing food poisoning during Umrah and Hajj?",
            ar: "ما هي التوصيات للوقاية من التسمم الغذائي خلال العمرة والحج؟",
            fr: "Quelles sont les recommandations pour prévenir les intoxications alimentaires pendant la Omra et le Hajj ?",
            fa: "توصیه ها برای پیشگیری از مسمومیت غذایی در طول عمره و حج چیست؟",
            ms: "Apakah cadangan untuk mencegah keracunan makanan semasa Umrah dan Haji?",
            ur: "عمرہ اور حج کے دوران فوڈ پوائزننگ سے بچنے کے لیے کیا تجاویز ہیں؟",
            tr: "Umre ve Hac sırasında gıda zehirlenmesini önlemek için öneriler nelerdir?",
            id: "Apa saja rekomendasi untuk mencegah keracunan makanan selama Umrah dan Haji?",
            ha: "Menene shawarwarin don hana guba a lokacin Umrah da Hajji?",
            es: "¿Cuáles son las recomendaciones para prevenir la intoxicación alimentaria durante la Umrah y el Hajj?",
            ru: "Какие рекомендации по предотвращению пищевых отравлений во время Умры и Хаджа?",
            si: "උම්රා සහ හජ් සමයේදී ආහාර විෂ වීම වැළැක්වීම සඳහා නිර්දේශ මොනවාද?",
            am: "በዑምራ እና በሐጅ ወቅት የምግብ መመረዝን ለመከላከል የሚረዱ ምክሮች ምንድን ናቸው?",
            my: "အုမ်ရာနှင့် ဟဂ်ျပြုလုပ်နေစဉ်အတွင်း အစာအဆိပ်သင့်ခြင်းကို ကာကွယ်ရန် အကြံပြုချက်များကား အဘယ်နည်း။",
            hi: "उमराह और हज के दौरान फूड पॉइजनिंग को रोकने के लिए क्या सिफारिशें हैं?",
            uz: "Umra va Haj paytida ovqatdan zaharlanishning oldini olish bo'yicha tavsiyalar qanday?",
          },
          answer: {
            en: "Avoid eating food that has been stored for long periods and ensure fruits and vegetables are washed.",
            ar: "تجنب تناول الطعام المخزن لفترات طويلة والتأكد من غسل الفواكه والخضروات.",
            fr: "Évitez de manger des aliments qui ont été stockés pendant de longues périodes et assurez-vous que les fruits et légumes sont lavés.",
            fa: "از خوردن غذاهایی که برای مدت طولانی نگهداری شده اند خودداری کنید و از شستن میوه ها و سبزیجات اطمینان حاصل کنید.",
            ms: "Elakkan makan makanan yang telah disimpan untuk jangka masa yang lama dan pastikan buah-buahan dan sayur-sayuran dicuci.",
            ur: "ایسے کھانے سے پرہیز کریں جو طویل عرصے سے ذخیرہ کیے گئے ہوں اور اس بات کو یقینی بنائیں کہ پھلوں اور سبزیوں کو دھویا جائے۔",
            tr: "Uzun süre saklanmış yiyecekler yemekten kaçının ve meyve ve sebzelerin yıkandığından emin olun.",
            id: "Hindari makan makanan yang telah disimpan dalam waktu lama dan pastikan buah-buahan dan sayuran dicuci.",
            ha: "Ka guji cin abincin da aka ajiye na dogon lokaci kuma ka tabbatar an wanke 'ya'yan itatuwa da kayan marmari.",
            es: "Evite comer alimentos que hayan sido almacenados durante largos períodos y asegúrese de que las frutas y verduras estén lavadas.",
            ru: "Избегайте употребления пищи, которая хранилась в течение длительного времени, и убедитесь, что фрукты и овощи вымыты.",
            si: "දිගු කලක් ගබඩා කර ඇති ආහාර ගැනීමෙන් වළකින්න සහ පලතුරු සහ එළවළු සෝදා ඇති බවට සහතික වන්න.",
            am: "ለረጅም ጊዜ የተከማቹ ምግቦችን ከመመገብ ተቆጠቡ እና ፍራፍሬዎችና አትክልቶች መታጠባቸውን ያረጋግጡ።",
            my: "အချိန်အကြာကြီး သိုလှောင်ထားသော အစားအစာများကို ရှောင်ကြဉ်ပြီး သစ်သီးများနှင့် ဟင်းသီးဟင်းရွက်များကို ဆေးကြောထားကြောင်း သေချာပါစေ။",
            hi: "लंबे समय से संग्रहीत भोजन खाने से बचें और सुनिश्चित करें कि फल और सब्जियां धो लें।",
            uz: "Uzoq vaqt davomida saqlangan ovqatlarni iste'mol qilishdan saqlaning va meva va sabzavotlarning yuvilganligiga ishonch hosil qiling.",
          },
        },
        {
          question: {
            en: "Why are face masks important during Umrah and Hajj?",
            ar: "لماذا تعتبر الكمامات مهمة خلال العمرة والحج؟",
            fr: "Pourquoi les masques faciaux sont-ils importants pendant la Omra et le Hajj ?",
            fa: "چرا ماسک صورت در طول عمره و حج مهم است؟",
            ms: "Mengapakah pelitup muka penting semasa Umrah dan Haji?",
            ur: "عمرہ اور حج کے دوران فیس ماسک کیوں اہم ہیں؟",
            tr: "Umre ve Hac sırasında yüz maskeleri neden önemlidir?",
            id: "Mengapa masker wajah penting selama Umrah dan Haji?",
            ha: "Me yasa abin rufe fuska ke da muhimmanci a lokacin Umrah da Hajji?",
            es: "¿Por qué son importantes las mascarillas faciales durante la Umrah y el Hajj?",
            ru: "Почему маски для лица важны во время Умры и Хаджа?",
            si: "උම්රා සහ හජ් සමයේදී මුහුණු ආවරණ වැදගත් වන්නේ ඇයි?",
            am: "በዑምራ እና በሐጅ ወቅት የፊት ጭምብሎች ለምን አስፈላጊ ናቸው?",
            my: "အုမ်ရာနှင့် ဟဂ်ျပြုလုပ်နေစဉ်အတွင်း မျက်နှာဖုံးများသည် အဘယ်ကြောင့်အရေးကြီးသနည်း။",
            hi: "उमराह और हज के दौरान फेस मास्क क्यों महत्वपूर्ण हैं?",
            uz: "Umra va Haj paytida yuz niqoblari nima uchun muhim?",
          },
          answer: {
            en: "Face masks help prevent the spread of infectious viruses and should be worn in crowded places.",
            ar: "تساعد الكمامات في منع انتشار الفيروسات المعدية ويجب ارتداؤها في الأماكن المزدحمة.",
            fr: "Les masques faciaux aident à prévenir la propagation des virus infectieux et doivent être portés dans les endroits bondés.",
            fa: "ماسک صورت به جلوگیری از انتشار ویروس های عفونی کمک می کند و باید در مکان های شلوغ استفاده شود.",
            ms: "Pelitup muka membantu mencegah penyebaran virus berjangkit dan harus dipakai di tempat yang sesak.",
            ur: "فیس ماسک متعدی وائرس کے پھیلاؤ کو روکنے میں مدد کرتے ہیں اور انہیں بھیڑ والی جگہوں پر پہننا چاہیے۔",
            tr: "Yüz maskeleri bulaşıcı virüslerin yayılmasını önlemeye yardımcı olur ve kalabalık yerlerde takılmalıdır.",
            id: "Masker wajah membantu mencegah penyebaran virus menular dan harus dipakai di tempat ramai.",
            ha: "Abin rufe fuska yana taimakawa wajen hana yaduwar cututtukan ƙwayoyin cuta kuma yakamata a saka su a wurare masu cunkoso.",
            es: "Las mascarillas faciales ayudan a prevenir la propagación de virus infecciosos y deben usarse en lugares concurridos.",
            ru: "Маски для лица помогают предотвратить распространение инфекционных вирусов и должны носиться в людных местах.",
            si: "මුහුණු ආවරණ මගින් බෝවන වෛරස් පැතිරීම වැළැක්වීමට උපකාර වන අතර ඒවා ජනාකීර්ණ ස්ථානවල පැළඳිය යුතුය.",
            am: "የፊት ጭምብሎች ተላላፊ ቫይረሶችን ስርጭት ለመከላከል ይረዳሉ እና በተጨናነቁ ቦታዎች ውስጥ መደረግ አለባቸው።",
            my: "မျက်နှာဖုံးများသည် ကူးစက်တတ်သော ဗိုင်းရပ်စ်များ ပျံ့နှံ့မှုကို ကာကွယ်ရန် ကူညီပေးပြီး လူစည်ကားသောနေရာများတွင် တပ်ဆင်သင့်သည်။",
            hi: "फेस मास्क संक्रामक वायरस के प्रसार को रोकने में मदद करते हैं और भीड़-भाड़ वाली जगहों पर इन्हें पहनना चाहिए।",
            uz: "Yuz niqoblari yuqumli viruslarning tarqalishini oldini olishga yordam beradi va olomon joylarda kiyilishi kerak.",
          },
        },
      ],
    },
  },
  {
    id: 2,
    category: {
      name: {
        en: "Financial Awareness Question",
        ar: "سؤال التوعية المالية",
        fr: "Question de sensibilisation financière",
        fa: "سوال آگاهی مالی",
        ms: "Soalan Kesedaran Kewangan",
        ur: "مالی آگاہی کا سوال",
        tr: "Finansal Farkındalık Sorusu",
        id: "Pertanyaan Kesadaran Finansial",
        ha: "Tambayar Fadakarwa Ta Kuɗi",
        es: "Pregunta de Conciencia Financiera",
        ru: "Вопрос финансовой осведомленности",
        si: "මූල්‍ය දැනුවත් කිරීමේ ප්‍රශ්නය",
        am: "የፋይናንስ ግንዛቤ ጥያቄ",
        my: "ဘဏ္ဍာရေးအသိပညာပေးမေးခွန်း",
        hi: "वित्तीय जागरूकता प्रश्न",
        uz: "Moliyaviy xabardorlik savoli",
      },
      questions: [
        {
          question: {
            en: "What are the ways to convert currency in Saudi Arabia?",
            ar: "ما هي طرق تحويل العملة في المملكة العربية السعودية؟",
            fr: "Quels sont les moyens de convertir des devises en Arabie Saoudite ?",
            fa: "راه های تبدیل ارز در عربستان سعودی چیست؟",
            ms: "Apakah cara untuk menukar mata wang di Arab Saudi?",
            ur: "سعودی عرب میں کرنسی تبدیل کرنے کے کیا طریقے ہیں؟",
            tr: "Suudi Arabistan'da para birimi dönüştürmenin yolları nelerdir?",
            id: "Apa saja cara untuk mengonversi mata uang di Arab Saudi?",
            ha: "Menene hanyoyin canza kuɗi a Saudi Arabia?",
            es: "¿Cuáles son las formas de convertir divisas en Arabia Saudita?",
            ru: "Какие существуют способы конвертации валюты в Саудовской Аравии?",
            si: "සවුදි අරාබියේ මුදල් පරිවර්තනය කිරීමට ඇති මාර්ග මොනවාද?",
            am: "በሳውዲ አረቢያ ገንዘብ ለመቀየር መንገዶች ምንድናቸው?",
            my: "ဆော်ဒီအာရေဗျတွင် ငွေကြေးလဲလှယ်ရန် နည်းလမ်းများကား အဘယ်နည်း။",
            hi: "सऊदी अरब में मुद्रा बदलने के क्या तरीके हैं?",
            uz: "Saudiya Arabistonida valyutani almashtirish usullari qanday?",
          },
          answer: {
            en: "Currency conversion can be done at certified exchanges, licensed banks, and electronic banks.",
            ar: "يمكن تحويل العملة في مراكز الصرافة المعتمدة والبنوك المرخصة والبنوك الإلكترونية.",
            fr: "La conversion de devises peut se faire dans les bureaux de change agréés, les banques agréées et les banques électroniques.",
            fa: "تبدیل ارز را می توان در صرافی های مجاز، بانک های دارای مجوز و بانک های الکترونیکی انجام داد.",
            ms: "Penukaran mata wang boleh dilakukan di bursa yang diperakui, bank berlesen dan bank elektronik.",
            ur: "کرنسی کی تبدیلی سرٹیفائیڈ ایکسچینجز، لائسنس یافتہ بینکوں اور الیکٹرانک بینکوں میں کی جا سکتی ہے۔",
            tr: "Döviz dönüşümü, sertifikalı döviz bürolarında, lisanslı bankalarda ve elektronik bankalarda yapılabilir.",
            id: "Konversi mata uang dapat dilakukan di bursa bersertifikat, bank berlisensi, dan bank elektronik.",
            ha: "Ana iya yin canjin kuɗi a musayar kuɗi da aka tabbatar, bankunan da aka ba lasisi, da bankunan lantarki.",
            es: "La conversión de divisas se puede realizar en casas de cambio certificadas, bancos autorizados y bancos electrónicos.",
            ru: "Обмен валюты можно произвести в сертифицированных обменных пунктах, лицензированных банках и электронных банках.",
            si: "මුදල් පරිවර්තනය සහතික කළ හුවමාරු, බලපත්‍රලාභී බැංකු සහ විද්‍යුත් බැංකු වල සිදු කළ හැක.",
            am: "የገንዘብ ልውውጥ በተረጋገጡ ልውውጦች፣ፍቃድ ባላቸው ባንኮች እና በኤሌክትሮኒክስ ባንኮች ሊደረግ ይችላል።",
            my: "ငွေကြေးလဲလှယ်ခြင်းကို အသိအမှတ်ပြုလဲလှယ်ရေးဌာနများ၊ လိုင်စင်ရဘဏ်များနှင့် အီလက်ထရွန်နစ်ဘဏ်များတွင် ပြုလုပ်နိုင်သည်။",
            hi: "मुद्रा रूपांतरण प्रमाणित एक्सचेंजों, लाइसेंस प्राप्त बैंकों और इलेक्ट्रॉनिक बैंकों में किया जा सकता है।",
            uz: "Valyuta konvertatsiyasi sertifikatlangan birjalarda, litsenziyalangan banklarda va elektron banklarda amalga oshirilishi mumkin.",
          },
        },
        {
          question: {
            en: "What items require a customs declaration upon entering and leaving Saudi Arabia?",
            ar: "ما هي الأشياء التي تتطلب إقراراً جمركياً عند دخول المملكة العربية السعودية ومغادرتها؟",
            fr: "Quels articles nécessitent une déclaration en douane lors de l'entrée et de la sortie d'Arabie Saoudite ?",
            fa: "چه مواردی هنگام ورود و خروج از عربستان سعودی نیاز به اظهارنامه گمرکی دارند؟",
            ms: "Apakah barang yang memerlukan pengisytiharan kastam semasa memasuki dan meninggalkan Arab Saudi?",
            ur: "سعودی عرب میں داخل ہوتے اور نکلتے وقت کن اشیاء کے لیے کسٹم ڈیکلریشن کی ضرورت ہوتی ہے؟",
            tr: "Suudi Arabistan'a girerken ve çıkarken hangi eşyalar gümrük beyanı gerektirir?",
            id: "Barang apa saja yang memerlukan deklarasi pabean saat memasuki dan meninggalkan Arab Saudi?",
            ha: "Waɗanne abubuwa ne ke buƙatar sanarwar kwastam lokacin shiga da barin Saudi Arabia?",
            es: "¿Qué artículos requieren una declaración de aduanas al entrar y salir de Arabia Saudita?",
            ru: "Какие товары требуют таможенной декларации при въезде и выезде из Саудовской Аравии?",
            si: "සවුදි අරාබියට ඇතුළු වන විට සහ පිටවන විට කුමන භාණ්ඩ සඳහා රේගු ප්‍රකාශයක් අවශ්‍යද?",
            am: "ወደ ሳውዲ አረቢያ ሲገቡ እና ሲወጡ የጉምሩክ መግለጫ የሚሹ ነገሮች ምንድን ናቸው?",
            my: "ဆော်ဒီအာရေဗျသို့ ဝင်ထွက်ရာတွင် မည်သည့်ပစ္စည်းများအတွက် အကောက်ခွန်ကြေငြာရန် လိုအပ်သနည်း။",
            hi: "सऊदी अरब में प्रवेश करने और छोड़ने पर किन वस्तुओं के लिए सीमा शुल्क घोषणा की आवश्यकता होती है?",
            uz: "Saudiya Arabistoniga kirish va chiqishda qanday narsalar bojxona deklaratsiyasini talab qiladi?",
          },
          answer: {
            en: "You must declare cash over 60,000 riyals, gold bars, and precious metals.",
            ar: "يجب الإقرار عن النقد الذي يزيد عن 60,000 ريال، وسبائك الذهب، والمعادن الثمينة.",
            fr: "Vous devez déclarer les espèces supérieures à 60 000 riyals, les lingots d'or et les métaux précieux.",
            fa: "شما باید پول نقد بیش از 60,000 ریال، شمش طلا و فلزات گرانبها را اظهار کنید.",
            ms: "Anda mesti mengisytiharkan wang tunai melebihi 60,000 riyal, jongkong emas dan logam berharga.",
            ur: "آپ کو 60,000 ریال سے زیادہ کی نقدی، سونے کی سلاخوں اور قیمتی دھاتوں کا اعلان کرنا ہوگا۔",
            tr: "60.000 riyalden fazla nakit, altın külçeleri ve değerli metalleri beyan etmelisiniz.",
            id: "Anda harus mendeklarasikan uang tunai lebih dari 60.000 riyal, batangan emas, dan logam mulia.",
            ha: "Dole ne ku bayyana kuɗi sama da riyal 60,000, sandunan zinariya, da ƙarfe masu daraja.",
            es: "Debe declarar efectivo superior a 60.000 riyales, lingotes de oro y metales preciosos.",
            ru: "Вы должны декларировать наличные средства на сумму более 60 000 риалов, золотые слитки и драгоценные металлы.",
            si: "ඔබ රියාල් 60,000 ඉක්මවූ මුදල්, රන් බාර් සහ වටිනා ලෝහ ප්‍රකාශ කළ යුතුය.",
            am: "ከ60,000 ሪያል በላይ ጥሬ ገንዘብ፣ የወርቅ አሞሌዎች እና የከበሩ ማዕድናት ማሳወቅ አለቦት።",
            my: "ရိယာယ် ၆၀,၀၀၀ ကျော် ငွေသား၊ ရွှေတုံးများနှင့် အဖိုးတန်သတ္တုများကို ကြေညာရပါမည်။",
            hi: "आपको 60,000 रियाल से अधिक नकद, सोने की छड़ें और कीमती धातुओं की घोषणा करनी होगी।",
            uz: "Siz 60 000 riyaldan ortiq naqd pul, oltin quymalari va qimmatbaho metallarni deklaratsiya qilishingiz kerak.",
          },
        },
        {
          question: {
            en: "Which electronic payment methods are accepted in Saudi Arabia?",
            ar: "ما هي وسائل الدفع الإلكترونية المقبولة في المملكة العربية السعودية؟",
            fr: "Quels modes de paiement électroniques sont acceptés en Arabie Saoudite ?",
            fa: "چه روش های پرداخت الکترونیکی در عربستان سعودی پذیرفته می شود؟",
            ms: "Apakah kaedah pembayaran elektronik yang diterima di Arab Saudi?",
            ur: "سعودی عرب میں کون سے الیکٹرانک ادائیگی کے طریقے قبول کیے جاتے ہیں؟",
            tr: "Suudi Arabistan'da hangi elektronik ödeme yöntemleri kabul edilmektedir?",
            id: "Metode pembayaran elektronik apa yang diterima di Arab Saudi?",
            ha: "Waɗanne hanyoyin biyan kuɗi na lantarki ne aka karɓa a Saudi Arabia?",
            es: "¿Qué métodos de pago electrónicos se aceptan en Arabia Saudita?",
            ru: "Какие электронные способы оплаты принимаются в Саудовской Аравии?",
            si: "සවුදි අරාබියේ පිළිගනු ලබන විද්‍යුත් ගෙවීම් ක්‍රම මොනවාද?",
            am: "በሳውዲ አረቢያ የትኞቹ የኤሌክትሮኒክ ክፍያ ዘዴዎች ተቀባይነት አላቸው?",
            my: "ဆော်ဒီအာရေဗျတွင် မည်သည့် အီလက်ထရွန်နစ် ငွေပေးချေမှုနည်းလမ်းများကို လက်ခံသနည်း။",
            hi: "सऊदी अरब में कौन से इलेक्ट्रॉनिक भुगतान विधियां स्वीकार की जाती हैं?",
            uz: "Saudiya Arabistonida qanday elektron to'lov usullari qabul qilinadi?",
          },
          answer: {
            en: "Credit cards, bank transfers, and SADAD are commonly accepted electronic payment methods.",
            ar: "البطاقات الائتمانية والتحويلات البنكية ونظام سداد هي وسائل الدفع الإلكترونية الشائعة.",
            fr: "Les cartes de crédit, les virements bancaires et SADAD sont des modes de paiement électroniques couramment acceptés.",
            fa: "کارت های اعتباری، حواله های بانکی و سداد روش های پرداخت الکترونیکی رایج هستند.",
            ms: "Kad kredit, pindahan bank dan SADAD ialah kaedah pembayaran elektronik yang diterima umum.",
            ur: "کریڈٹ کارڈ، بینک ٹرانسفر اور سداد عام طور پر قبول شدہ الیکٹرانک ادائیگی کے طریقے ہیں۔",
            tr: "Kredi kartları, banka havaleleri ve SADAD yaygın olarak kabul gören elektronik ödeme yöntemleridir.",
            id: "Kartu kredit, transfer bank, dan SADAD adalah metode pembayaran elektronik yang umum diterima.",
            ha: "Katin kuɗi, canja wurin banki, da SADAD hanyoyin biyan kuɗi na lantarki ne da aka karɓa gabaɗaya.",
            es: "Las tarjetas de crédito, las transferencias bancarias y SADAD son métodos de pago electrónicos comúnmente aceptados.",
            ru: "Кредитные карты, банковские переводы и SADAD являются общепринятыми электронными способами оплаты.",
            si: "ණයපත්, බැංකු මාරු කිරීම් සහ SADAD බහුලව පිළිගනු ලබන විද්‍යුත් ගෙවීම් ක්‍රම වේ.",
            am: "ክሬዲት ካርዶች፣ የባንክ ዝውውሮች እና SADAD በሰፊው ተቀባይነት ያላቸው የኤሌክትሮኒክ ክፍያ ዘዴዎች ናቸው።",
            my: "ခရက်ဒစ်ကတ်များ၊ ဘဏ်ငွေလွှဲများနှင့် SADAD တို့သည် အများအားဖြင့် လက်ခံနိုင်သော အီလက်ထရွန်နစ် ငွေပေးချေမှုနည်းလမ်းများဖြစ်သည်။",
            hi: "क्रेडिट कार्ड, बैंक हस्तांतरण और SADAD आमतौर पर स्वीकार किए जाने वाले इलेक्ट्रॉनिक भुगतान विधियां हैं।",
            uz: "Kredit kartalari, bank o'tkazmalari va SADAD - bu odatda qabul qilinadigan elektron to'lov usullari.",
          },
        },
        {
          question: {
            en: "Is it necessary to carry a lot of cash during a trip to Saudi Arabia?",
            ar: "هل من الضروري حمل الكثير من النقود خلال الرحلة إلى المملكة العربية السعودية؟",
            fr: "Est-il nécessaire d'emporter beaucoup d'argent liquide lors d'un voyage en Arabie Saoudite ?",
            fa: "آیا لازم است در طول سفر به عربستان سعودی پول نقد زیادی حمل شود؟",
            ms: "Adakah perlu membawa banyak wang tunai semasa melancong ke Arab Saudi?",
            ur: "کیا سعودی عرب کے سفر کے دوران بہت زیادہ نقدی لے جانا ضروری ہے؟",
            tr: "Suudi Arabistan'a bir gezi sırasında çok fazla nakit taşımak gerekli mi?",
            id: "Apakah perlu membawa banyak uang tunai selama perjalanan ke Arab Saudi?",
            ha: "Wajibi ne a ɗauki kuɗi da yawa yayin tafiya zuwa Saudi Arabia?",
            es: "¿Es necesario llevar mucho efectivo durante un viaje a Arabia Saudita?",
            ru: "Необходимо ли брать с собой много наличных во время поездки в Саудовскую Аравию?",
            si: "සවුදි අරාබියට යන ගමනකදී මුදල් විශාල ප්‍රමාණයක් රැගෙන යාම අවශ්‍යද?",
            am: "ወደ ሳውዲ አረቢያ በሚደረግ ጉዞ ብዙ ገንዘብ መያዝ አስፈላጊ ነው?",
            my: "ဆော်ဒီအာရေဗျသို့ ခရီးသွားစဉ် ငွေသားအမြောက်အမြား သယ်ဆောင်ရန် လိုအပ်ပါသလား။",
            hi: "क्या सऊदी अरब की यात्रा के दौरान बहुत अधिक नकदी ले जाना आवश्यक है?",
            uz: "Saudiya Arabistoniga sayohat paytida ko'p naqd pul olib yurish kerakmi?",
          },
          answer: {
            en: "No, as most financial transactions can be made with electronic payments.",
            ar: "لا، حيث يمكن إجراء معظم المعاملات المالية عبر وسائل الدفع الإلكترونية.",
            fr: "Non, car la plupart des transactions financières peuvent être effectuées avec des paiements électroniques.",
            fa: "نه، زیرا اکثر معاملات مالی را می توان با پرداخت های الکترونیکی انجام داد.",
            ms: "Tidak, kerana kebanyakan transaksi kewangan boleh dibuat dengan pembayaran elektronik.",
            ur: "نہیں، کیونکہ زیادہ تر مالیاتی لین دین الیکٹرانک ادائیگیوں سے کیے جا سکتے ہیں۔",
            tr: "Hayır, çoğu finansal işlem elektronik ödemelerle yapılabilir.",
            id: "Tidak, karena sebagian besar transaksi keuangan dapat dilakukan dengan pembayaran elektronik.",
            ha: "A'a, saboda ana iya yin yawancin ma'amalar kuɗi tare da biyan kuɗi na lantarki.",
            es: "No, ya que la mayoría de las transacciones financieras se pueden realizar con pagos electrónicos.",
            ru: "Нет, поскольку большинство финансовых операций можно совершать с помощью электронных платежей.",
            si: "නැත, මන්ද බොහෝ මූල්‍ය ගනුදෙනු විද්‍යුත් ගෙවීම් සමඟ කළ හැකිය.",
            am: "አይ፣ አብዛኛዎቹ የፋይናንስ ግብይቶች በኤሌክትሮኒክ ክፍያዎች ሊደረጉ ይችላሉ።",
            my: "အီလက်ထရွန်နစ်ငွေပေးချေမှုများဖြင့် ဘဏ္ဍာရေးဆိုင်ရာငွေပေးငွေယူအများစုကို ပြုလုပ်နိုင်သောကြောင့် မလိုအပ်ပါ။",
            hi: "नहीं, क्योंकि अधिकांश वित्तीय लेनदेन इलेक्ट्रॉनिक भुगतान के साथ किए जा सकते हैं।",
            uz: "Yo'q, chunki aksariyat moliyaviy operatsiyalarni elektron to'lovlar bilan amalga oshirish mumkin.",
          },
        },
      ],
    },
  },
  {
    id: 3,
    category: {
      name: {
        en: "Legal Awareness Question",
        ar: "سؤال التوعية القانونية",
        fr: "Question de sensibilisation juridique",
        fa: "سوال آگاهی حقوقی",
        ms: "Soalan Kesedaran Undang-undang",
        ur: "قانونی آگاہی کا سوال",
        tr: "Hukuki Farkındalık Sorusu",
        id: "Pertanyaan Kesadaran Hukum",
        ha: "Tambayar Fadakarwa Ta Shari'a",
        es: "Pregunta de Conciencia Legal",
        ru: "Вопрос правовой осведомленности",
        si: "නීතිමය දැනුවත් කිරීමේ ප්‍රශ්නය",
        am: "የህግ ግንዛቤ ጥያቄ",
        my: "တရားဥပဒေအသိပညာပေးမေးခွန်း",
        hi: "कानूनी जागरूकता प्रश्न",
        uz: "Huquqiy xabardorlik savoli",
      },
      questions: [
        {
          question: {
            en: "What penalties face a licensee who violates rules in Saudi Arabia for pilgrim-related services?",
            ar: "ما هي العقوبات التي يواجهها المرخص له الذي يخالف القواعد في المملكة العربية السعودية للخدمات المتعلقة بالحجاج؟",
            fr: "Quelles sont les sanctions encourues par un titulaire de licence qui viole les règles en Arabie Saoudite pour les services liés aux pèlerins ?",
            fa: "مجازاتی که یک دارنده مجوز که قوانین عربستان سعودی را برای خدمات مربوط به زائران نقض می کند، با آن مواجه می شود چیست؟",
            ms: "Apakah penalti yang dihadapi oleh pemegang lesen yang melanggar peraturan di Arab Saudi untuk perkhidmatan berkaitan jemaah haji?",
            ur: "سعودی عرب میں حاجیوں سے متعلق خدمات کے لیے قواعد کی خلاف ورزی کرنے والے لائسنس یافتہ کو کن جرمانوں کا سامنا کرنا پڑتا ہے؟",
            tr: "Suudi Arabistan'da hacı hizmetleriyle ilgili kuralları ihlal eden bir lisans sahibinin karşılaştığı cezalar nelerdir?",
            id: "Hukuman apa yang dihadapi pemegang lisensi yang melanggar peraturan di Arab Saudi untuk layanan terkait peziarah?",
            ha: "Waɗanne hukunce-hukunce ne mai lasisi ke fuskanta wanda ya keta dokoki a Saudi Arabia don ayyukan da suka shafi mahajjata?",
            es: "¿Qué sanciones enfrenta un licenciatario que viola las normas en Arabia Saudita para los servicios relacionados con los peregrinos?",
            ru: "Какие штрафы грозят лицензиату, нарушившему правила в Саудовской Аравии в отношении услуг, связанных с паломниками?",
            si: "වන්දනාකරුවන් ආශ්‍රිත සේවා සඳහා සවුදි අරාබියේ නීති උල්ලංඝණය කරන බලපත්‍රලාභියෙකුට මුහුණ දීමට සිදුවන දඬුවම් මොනවාද?",
            am: "ለሐጅ ነክ አገልግሎቶች በሳውዲ አረቢያ ህጎችን የሚጥስ ፈቃድ ያለው ሰው ምን አይነት ቅጣት ይጣልበታል?",
            my: "ဘုရားဖူးနှင့်သက်ဆိုင်သော ဝန်ဆောင်မှုများအတွက် ဆော်ဒီအာရေဗျရှိ စည်းမျဉ်းများကို ချိုးဖောက်သော လိုင်စင်ကိုင်ဆောင်သူ မည်သည့်ပြစ်ဒဏ်များ ချမှတ်ခံရသနည်း။",
            hi: "सऊदी अरब में तीर्थयात्रियों से संबंधित सेवाओं के लिए नियमों का उल्लंघन करने वाले लाइसेंसधारी को किन दंडों का सामना करना पड़ता है?",
            uz: "Saudiya Arabistonida ziyoratchilar bilan bog'liq xizmatlar uchun qoidalarni buzgan litsenziatga qanday jazolar qo'llaniladi?",
          },
          answer: {
            en: "Penalties include license revocation, fines up to SR100,000, and possible suspension.",
            ar: "تشمل العقوبات إلغاء الترخيص وغرامات تصل إلى 100,000 ريال سعودي والإيقاف المحتمل.",
            fr: "Les sanctions comprennent le retrait de la licence, des amendes allant jusqu'à 100 000 SR et une éventuelle suspension.",
            fa: "مجازات شامل لغو مجوز، جریمه تا سقف 100000 ریال سعودی و تعلیق احتمالی است.",
            ms: "Penalti termasuk pembatalan lesen, denda sehingga SR100,000 dan kemungkinan penggantungan.",
            ur: "جرمانے میں لائسنس کی منسوخی، SR100,000 تک جرمانہ اور ممکنہ معطلی شامل ہے۔",
            tr: "Cezalar arasında lisans iptali, 100.000 SR'ye kadar para cezaları ve olası uzaklaştırma yer almaktadır.",
            id: "Hukuman termasuk pencabutan izin, denda hingga SR100.000, dan kemungkinan penangguhan.",
            ha: "Hukunce-hukuncen sun haɗa da soke lasisi, tarar da ta kai SR100,000, da yiwuwar dakatarwa.",
            es: "Las sanciones incluyen la revocación de la licencia, multas de hasta 100.000 SR y la posible suspensión.",
            ru: "Штрафные санкции включают отзыв лицензии, штрафы в размере до 100 000 саудовских риялов и возможное отстранение от работы.",
            si: "දඬුවම්වලට බලපත්‍රය අවලංගු කිරීම, SR100,000 දක්වා දඩ සහ අත්හිටුවීම ඇතුළත් වේ.",
            am: "ቅጣቶች የፈቃድ ስረዛ፣ እስከ SR100,000 የሚደርስ ቅጣት እና ሊኖር የሚችል እገዳን ያካትታሉ።",
            my: "ပြစ်ဒဏ်များတွင် လိုင်စင်ပယ်ဖျက်ခြင်း၊ SR100,000 အထိ ဒဏ်ငွေနှင့် ယာယီရပ်ဆိုင်းခြင်းတို့ ပါဝင်သည်။",
            hi: "दंडों में लाइसेंस रद्द करना, SR100,000 तक का जुर्माना और संभावित निलंबन शामिल है।",
            uz: "Jazolarga litsenziyani bekor qilish, 100 000 SR gacha jarima va mumkin bo'lgan to'xtatib turish kiradi.",
          },
        },
        {
          question: {
            en: "What happens if someone provides pilgrim services without a license?",
            ar: "ماذا يحدث إذا قدم شخص خدمات للحجاج بدون ترخيص؟",
            fr: "Que se passe-t-il si quelqu'un fournit des services aux pèlerins sans licence ?",
            fa: "اگر کسی بدون مجوز خدمات زائر ارائه دهد چه اتفاقی می افتد؟",
            ms: "Apa yang berlaku jika seseorang memberikan perkhidmatan jemaah haji tanpa lesen?",
            ur: "اگر کوئی شخص بغیر لائسنس کے حاجیوں کی خدمات فراہم کرتا ہے تو کیا ہوتا ہے؟",
            tr: "Birisi lisanssız hac hizmetleri verirse ne olur?",
            id: "Apa yang terjadi jika seseorang memberikan layanan peziarah tanpa izin?",
            ha: "Menene zai faru idan wani ya ba da sabis na mahajjata ba tare da lasisi ba?",
            es: "¿Qué sucede si alguien proporciona servicios a peregrinos sin licencia?",
            ru: "Что произойдет, если кто-то оказывает услуги паломникам без лицензии?",
            si: "යම් පුද්ගලයෙක් බලපත්‍රයක් නොමැතිව වන්දනා සේවා සපයන්නේ නම් කුමක් සිදුවේද?",
            am: "አንድ ሰው ያለፈቃድ ለሐጅ አድራጊዎች አገልግሎት ቢሰጥ ምን ይከሰታል?",
            my: "လိုင်စင်မရှိဘဲ ဘုရားဖူးများအား ဝန်ဆောင်မှုပေးလျှင် ဘာဖြစ်မလဲ။",
            hi: "अगर कोई बिना लाइसेंस के तीर्थयात्रियों को सेवाएँ प्रदान करता है तो क्या होता है?",
            uz: "Agar kimdir litsenziyasiz ziyoratchilarga xizmat ko'rsatsa, nima bo'ladi?",
          },
          answer: {
            en: "They face a fine up to SR100,000, which can double upon repeat offenses.",
            ar: "يواجهون غرامة تصل إلى 100,000 ريال سعودي، ويمكن أن تتضاعف عند تكرار المخالفات.",
            fr: "Ils encourent une amende pouvant aller jusqu'à 100 000 SR, qui peut doubler en cas de récidive.",
            fa: "آنها با جریمه ای تا سقف 100000 ریال سعودی روبرو می شوند که در صورت تکرار تخلفات می تواند دو برابر شود.",
            ms: "Mereka menghadapi denda sehingga SR100,000, yang boleh berganda apabila kesalahan berulang.",
            ur: "انہیں SR100,000 تک جرمانے کا سامنا کرنا پڑتا ہے، جو بار بار جرم کرنے پر دوگنا ہو سکتا ہے۔",
            tr: "Tekrarlanan suçlarda iki katına çıkabilen 100.000 SR'ye kadar para cezasıyla karşı karşıyadırlar.",
            id: "Mereka menghadapi denda hingga SR100.000, yang dapat berlipat ganda jika terjadi pelanggaran berulang.",
            ha: "Suna fuskantar tarar da ta kai SR100,000, wanda zai iya ninka idan aka sake yin laifin.",
            es: "Se enfrentan a una multa de hasta 100.000 SR, que puede duplicarse en caso de reincidencia.",
            ru: "Им грозит штраф в размере до 100 000 саудовских риялов, который может удвоиться в случае повторных правонарушений.",
            si: "ඔවුන්ට SR100,000 දක්වා දඩයකට මුහුණ දීමට සිදුවන අතර, නැවත නැවතත් වරදවල් සිදු කළහොත් එය දෙගුණ විය හැක.",
            am: "እስከ SR100,000 የሚደርስ ቅጣት ይጣልባቸዋል፣ ይህም ተደጋጋሚ ጥፋት ሲከሰት በእጥፍ ሊጨምር ይችላል።",
            my: "SR100,000 အထိ ဒဏ်ငွေဆောင်ရမည်ဖြစ်ပြီး ထပ်ခါထပ်ခါကျူးလွန်ပါက နှစ်ဆတိုးနိုင်သည်။",
            hi: "उन्हें SR100,000 तक के जुर्माने का सामना करना पड़ता है, जो बार-बार अपराध करने पर दोगुना हो सकता है।",
            uz: "Ular 100 000 SRgacha jarimaga tortiladi, bu takroriy huquqbuzarliklarda ikki baravar ko'payishi mumkin.",
          },
        },
        {
          question: {
            en: "What are the responsibilities of a domestic pilgrims service provider?",
            ar: "ما هي مسؤوليات مقدم خدمات الحجاج المحليين؟",
            fr: "Quelles sont les responsabilités d'un prestataire de services aux pèlerins nationaux ?",
            fa: "مسئولیت های ارائه دهنده خدمات زائر داخلی چیست؟",
            ms: "Apakah tanggungjawab penyedia perkhidmatan jemaah haji domestik?",
            ur: "ایک گھریلو حاجیوں کی خدمت فراہم کرنے والے کی کیا ذمہ داریاں ہیں؟",
            tr: "Yerli hacı hizmeti sağlayıcısının sorumlulukları nelerdir?",
            id: "Apa tanggung jawab penyedia layanan peziarah domestik?",
            ha: "Menene alhakin mai bada sabis na mahajjata na gida?",
            es: "¿Cuáles son las responsabilidades de un proveedor de servicios para peregrinos nacionales?",
            ru: "Каковы обязанности поставщика услуг для местных паломников?",
            si: "දේශීය වන්දනාකරුවන් සඳහා සේවා සපයන්නෙකුගේ වගකීම් මොනවාද?",
            am: "የአገር ውስጥ ሐጅ አድራጊዎች አገልግሎት አቅራቢ ኃላፊነቶች ምንድን ናቸው?",
            my: "ပြည်တွင်း ဘုရားဖူး ဝန်ဆောင်မှုပေးသူ၏ တာဝန်များကား အဘယ်နည်း။",
            hi: "घरेलू तीर्थयात्रियों की सेवा प्रदाता की क्या जिम्मेदारियाँ हैं?",
            uz: "Mahalliy ziyoratchilarga xizmat ko'rsatuvchi provayderning vazifalari qanday?",
          },
          answer: {
            en: "They must provide all necessary services to registered pilgrims and ensure smooth performance of rituals.",
            ar: "يجب عليهم تقديم جميع الخدمات اللازمة للحجاج المسجلين وضمان أداء المناسك بسلاسة.",
            fr: "Ils doivent fournir tous les services nécessaires aux pèlerins inscrits et assurer le bon déroulement des rituels.",
            fa: "آنها باید تمام خدمات لازم را به زائران ثبت نام شده ارائه دهند و عملکرد روان مناسک را تضمین کنند.",
            ms: "Mereka mesti menyediakan semua perkhidmatan yang diperlukan kepada jemaah haji yang berdaftar dan memastikan kelancaran pelaksanaan ritual.",
            ur: "انہیں رجسٹرڈ حاجیوں کو تمام ضروری خدمات فراہم کرنی چاہئیں اور رسومات کی ہموار کارکردگی کو یقینی بنانا چاہیے۔",
            tr: "Kayıtlı hacılara gerekli tüm hizmetleri sağlamalı ve ritüellerin sorunsuz bir şekilde yerine getirilmesini sağlamalıdırlar.",
            id: "Mereka harus menyediakan semua layanan yang diperlukan untuk peziarah terdaftar dan memastikan kelancaran pelaksanaan ritual.",
            ha: "Dole ne su ba da duk sabis ɗin da ake buƙata ga mahajjata masu rijista kuma su tabbatar da gudanar da al'adu yadda ya kamata.",
            es: "Deben proporcionar todos los servicios necesarios a los peregrinos registrados y garantizar el buen desarrollo de los rituales.",
            ru: "Они должны предоставлять все необходимые услуги зарегистрированным паломникам и обеспечивать бесперебойное выполнение ритуалов.",
            si: "ඔවුන් ලියාපදිංචි වූ වන්දනාකරුවන්ට අවශ්‍ය සියලු සේවා සැපයිය යුතු අතර චාරිත්‍ර සුමටව ඉටු කිරීම සහතික කළ යුතුය.",
            am: "ለተመዘገቡ ሐጅ አድራጊዎች አስፈላጊ የሆኑ አገልግሎቶችን ሁሉ መስጠት እና የአምልኮ ሥርዓቶች በተ 원활 እንዲከናወኑ ማድረግ አለባቸው።",
            my: "မှတ်ပုံတင်ထားသော ဘုရားဖူးများအား လိုအပ်သော ဝန်ဆောင်မှုအားလုံးကို ပေးရမည်ဖြစ်ပြီး ဓလေ့ထုံးစံများ ချောမွေ့စွာဆောင်ရွက်နိုင်စေရန် သေချာစေရမည်။",
            hi: "उन्हें पंजीकृत तीर्थयात्रियों को सभी आवश्यक सेवाएं प्रदान करनी चाहिए और अनुष्ठानों का सुचारू प्रदर्शन सुनिश्चित करना चाहिए।",
            uz: "Ular ro'yxatdan o'tgan ziyoratchilarga barcha zarur xizmatlarni ko'rsatishlari va marosimlarning muammosiz bajarilishini ta'minlashlari kerak.",
          },
        },
        {
          question: {
            en: "Is it mandatory for service contracts with pilgrims to follow a standard model?",
            ar: "هل من الإلزامي أن تتبع عقود الخدمة مع الحجاج نموذجاً موحداً؟",
            fr: "Est-il obligatoire que les contrats de service avec les pèlerins suivent un modèle standard ?",
            fa: "آیا الزامی است که قراردادهای خدماتی با زائران از یک مدل استاندارد پیروی کنند؟",
            ms: "Adakah mandatori untuk kontrak perkhidmatan dengan jemaah haji mengikut model standard?",
            ur: "کیا حاجیوں کے ساتھ سروس معاہدوں کے لیے ایک معیاری ماڈل پر عمل کرنا لازمی ہے؟",
            tr: "Hacılarla yapılan hizmet sözleşmelerinin standart bir modeli takip etmesi zorunlu mudur?",
            id: "Apakah wajib bagi kontrak layanan dengan peziarah untuk mengikuti model standar?",
            ha: "Wajibi ne kwangilolin sabis tare da mahajjata su bi tsari na yau da kullun?",
            es: "¿Es obligatorio que los contratos de servicio con los peregrinos sigan un modelo estándar?",
            ru: "Обязательно ли сервисным контрактам с паломниками следовать стандартной модели?",
            si: "වන්දනාකරුවන් සමඟ සේවා ගිවිසුම් සම්මත ආකෘතියක් අනුගමනය කිරීම අනිවාර්යද?",
            am: "ከሐጅ አድራጊዎች ጋር የሚደረጉ የአገልግሎት ኮንትራቶች መደበኛ ሞዴል መከተል አለባቸው?",
            my: "ဘုရားဖူးများနှင့် ဝန်ဆောင်မှုစာချုပ်များသည် စံပုံစံအတိုင်း လိုက်နာရန် မဖြစ်မနေလိုအပ်ပါသလား။",
            hi: "क्या तीर्थयात्रियों के साथ सेवा अनुबंधों के लिए एक मानक मॉडल का पालन करना अनिवार्य है?",
            uz: "Ziyoratchilar bilan xizmat ko'rsatish shartnomalari standart modelga amal qilishi majburiymi?",
          },
          answer: {
            en: "Yes, they should follow a unified form issued by the Ministry of Umrah and Hajj.",
            ar: "نعم، يجب أن تتبع النموذج الموحد الصادر عن وزارة العمرة والحج.",
            fr: "Oui, ils doivent suivre un formulaire unifié publié par le ministère de la Omra et du Hajj.",
            fa: "بله، آنها باید از یک فرم یکپارچه صادر شده توسط وزارت عمره و حج پیروی کنند.",
            ms: "Ya, mereka harus mengikut borang bersatu yang dikeluarkan oleh Kementerian Umrah dan Haji.",
            ur: "جی ہاں، انہیں وزارت عمرہ اور حج کی طرف سے جاری کردہ ایک متحد فارم پر عمل کرنا چاہیے۔",
            tr: "Evet, Umre ve Hac Bakanlığı tarafından yayınlanan birleşik bir formu takip etmelidirler.",
            id: "Ya, mereka harus mengikuti formulir terpadu yang dikeluarkan oleh Kementerian Umrah dan Haji.",
            ha: "Ee, ya kamata su bi tsari mai haɗin kai wanda Ma'aikatar Umrah da Hajji ta bayar.",
            es: "Sí, deben seguir un formulario unificado emitido por el Ministerio de Umrah y Hajj.",
            ru: "Да, они должны следовать унифицированной форме, выпущенной Министерством Умры и Хаджа.",
            si: "ඔව්, ඔවුන් උම්රා සහ හජ් අමාත්‍යාංශය විසින් නිකුත් කරන ලද ඒකාබද්ධ පෝරමයක් අනුගමනය කළ යුතුය.",
            am: "አዎን፣ በዑምራ እና ሀጅ ሚኒስቴር የተሰጠውን አንድ ወጥ ፎርም መከተል አለባቸው።",
            my: "ဟုတ်ကဲ့၊ အုမ်ရာနှင့် ဟဂ်ျဝန်ကြီးဌာနမှ ထုတ်ပြန်သော စည်းလုံးညီညွတ်သောပုံစံကို လိုက်နာသင့်သည်။",
            hi: "हाँ, उन्हें उमराह और हज मंत्रालय द्वारा जारी एक एकीकृत फॉर्म का पालन करना चाहिए।",
            uz: "Ha, ular Umra va Haj vazirligi tomonidan chiqarilgan yagona shaklga amal qilishlari kerak.",
          },
        },
      ],
    },
  },
  {
    id: 4,
    category: {
      name: {
        en: "Al-Masjid Al-Haram Question",
        ar: "سؤال المسجد الحرام",
        fr: "Question d'Al-Masjid Al-Haram",
        fa: "سوال مسجدالحرام",
        ms: "Soalan Al-Masjid Al-Haram",
        ur: "المسجد الحرام کا سوال",
        tr: "Mescid-i Haram Sorusu",
        id: "Pertanyaan Al-Masjid Al-Haram",
        ha: "Tambayar Al-Masjid Al-Haram",
        es: "Pregunta de Al-Masjid Al-Haram",
        ru: "Вопрос Аль-Масджид аль-Харам",
        si: "අල්-මස්ජිඩ් අල්-හරාම් ප්‍රශ්නය",
        am: "የአል-መስጂድ አል-ሃራም ጥያቄ",
        my: "အယ်လ်-မက်စ်ဂျစ် အယ်လ်-ဟာရမ် မေးခွန်း",
        hi: "अल-मस्जिद अल-हरम प्रश्न",
        uz: "Al-Masjid Al-Harom savoli",
      },
      questions: [
        {
          question: {
            en: "What is the significance of the Black Stone in Islam?",
            ar: "ما هي أهمية الحجر الأسود في الإسلام؟",
            fr: "Quelle est la signification de la Pierre noire dans l'Islam ?",
            fa: "اهمیت حجرالاسود در اسلام چیست؟",
            ms: "Apakah kepentingan Batu Hitam dalam Islam?",
            ur: "اسلام میں حجر اسود کی کیا اہمیت ہے؟",
            tr: "İslam'da Kara Taş'ın önemi nedir?",
            id: "ApaSignifikansi Batu Hitam dalam Islam?",
            ha: "Menene mahimmancin Baƙin Dutse a Musulunci?",
            es: "¿Cuál es el significado de la Piedra Negra en el Islam?",
            ru: "Каково значение Черного камня в исламе?",
            si: "ඉස්ලාමයේ කළු ගලෙහි වැදගත්කම කුමක්ද?",
            am: "በእስልምና ውስጥ የጥቁር ድንጋይ አስፈላጊነት ምንድነው?",
            my: "အစ္စလာမ်ဘာသာတွင် Black Stone ၏ အရေးပါမှုကား အဘယ်နည်း။",
            hi: "इस्लाम में काले पत्थर का क्या महत्व है?",
            uz: "Islomda Qora toshning ahamiyati nimada?",
          },
          answer: {
            en: "The Black Stone is a stone from Paradise and serves as the start and finish point of each circuit around the Ka'ba.",
            ar: "الحجر الأسود هو حجر من الجنة ويعتبر نقطة البداية والنهاية لكل شوط حول الكعبة.",
            fr: "La Pierre noire est une pierre du Paradis et sert de point de départ et d'arrivée à chaque circuit autour de la Kaaba.",
            fa: "حجرالاسود سنگی از بهشت ​​است و به عنوان نقطه شروع و پایان هر دور در اطراف کعبه عمل می کند.",
            ms: "Batu Hitam ialah batu dari Syurga dan berfungsi sebagai titik permulaan dan penamat bagi setiap pusingan di sekeliling Ka'bah.",
            ur: "حجر اسود جنت کا ایک پتھر ہے اور کعبہ کے گرد ہر چکر کے آغاز اور اختتام کے طور پر کام کرتا ہے۔",
            tr: "Kara Taş, Cennet'ten bir taştır ve Kabe'nin etrafındaki her turun başlangıç ​​ve bitiş noktası olarak hizmet eder.",
            id: "Batu Hitam adalah batu dari Surga dan berfungsi sebagai titik awal dan akhir setiap putaran di sekitar Ka'bah.",
            ha: "Baƙin Dutse dutse ne daga Aljanna kuma yana aiki azaman wurin farawa da ƙarewa na kowane kewayawa a kusa da Ka'aba.",
            es: "La Piedra Negra es una piedra del Paraíso y sirve como punto de inicio y finalización de cada circuito alrededor de la Kaaba.",
            ru: "Черный камень — это камень из рая, который служит отправной и конечной точкой каждого круга вокруг Каабы.",
            si: "කළු ගල පාරාදීසයේ ගලක් වන අතර එය කාබා වටා ඇති සෑම පරිපථයකම ආරම්භක සහ අවසන් ලක්ෂ්‍යය ලෙස සේවය කරයි.",
            am: "ጥቁር ድንጋይ ከገነት የመጣ ድንጋይ ሲሆን በካዕባ ዙሪያ ላለው ለእያንዳንዱ ዙር መጀመሪያ እና መጨረሻ ነጥብ ሆኖ ያገለግላል።",
            my: "Black Stone သည် ပရဒိသုမှ ကျောက်တုံးဖြစ်ပြီး ကအ်ဘာပတ်လည်ရှိ ဆားကစ်တစ်ခုစီ၏ အစမှတ်နှင့် အဆုံးမှတ်အဖြစ် ဆောင်ရွက်ပါသည်။",
            hi: "काला पत्थर स्वर्ग का एक पत्थर है और काबा के चारों ओर प्रत्येक सर्किट के शुरुआती और अंतिम बिंदु के रूप में कार्य करता है।",
            uz: "Qora tosh - jannatdan kelgan tosh bo'lib, Ka'ba atrofidagi har bir aylananing boshlanishi va tugash nuqtasi bo'lib xizmat qiladi.",
          },
        },
        {
          question: {
            en: "Where is the Black Stone located in the Ka'ba?",
            ar: "أين يقع الحجر الأسود في الكعبة؟",
            fr: "Où se trouve la Pierre noire dans la Kaaba ?",
            fa: "حجرالاسود در کجای کعبه قرار دارد؟",
            ms: "Di manakah letaknya Batu Hitam di dalam Ka'bah?",
            ur: "کعبہ میں حجر اسود کہاں واقع ہے؟",
            tr: "Kara Taş Kabe'de nerede bulunur?",
            id: "Di mana letak Batu Hitam di Ka'bah?",
            ha: "Ina ne Baƙin Dutse yake a cikin Ka'aba?",
            es: "¿Dónde se encuentra la Piedra Negra en la Kaaba?",
            ru: "Где находится Черный камень в Каабе?",
            si: "කාබාහි කළු ගල පිහිටා ඇත්තේ කොහේද?",
            am: "በካዕባ ውስጥ ጥቁር ድንጋይ የሚገኘው የት ነው?",
            my: "ကာဘာတွင် Black Stone သည် မည်သည့်နေရာတွင် ရှိသနည်း။",
            hi: "काबा में काला पत्थर कहाँ स्थित है?",
            uz: "Ka'bada Qora tosh qayerda joylashgan?",
          },
          answer: {
            en: "It is located in the southeastern corner of the Ka'ba, 1.5 meters from the ground.",
            ar: "يقع في الركن الجنوبي الشرقي للكعبة، على ارتفاع 1.5 متر من الأرض.",
            fr: "Il est situé dans le coin sud-est de la Kaaba, à 1,5 mètre du sol.",
            fa: "در گوشه جنوب شرقی کعبه، در 1.5 متری از زمین واقع شده است.",
            ms: "Ia terletak di sudut tenggara Ka'bah, 1.5 meter dari tanah.",
            ur: "یہ کعبہ کے جنوب مشرقی کونے میں، زمین سے 1.5 میٹر کے فاصلے پر واقع ہے۔",
            tr: "Kabe'nin güneydoğu köşesinde, yerden 1,5 metre yükseklikte bulunur.",
            id: "Terletak di sudut tenggara Ka'bah, 1,5 meter dari tanah.",
            ha: "Yana cikin kusurwar kudu maso gabas ta Ka'aba, mita 1.5 daga ƙasa.",
            es: "Se encuentra en la esquina sureste de la Kaaba, a 1,5 metros del suelo.",
            ru: "Он расположен в юго-восточном углу Каабы, в 1,5 метрах от земли.",
            si: "එය කාබාවේ ගිනිකොන දෙස කෙළවරේ, බිම සිට මීටර් 1.5 ක් දුරින් පිහිටා ඇත.",
            am: "ከመሬት 1.5 ሜትር ርቀት ላይ በሚገኘው በካዕባ ደቡብ ምስራቅ ጥግ ላይ ይገኛል።",
            my: "ကာဘာ၏ အရှေ့တောင်ဘက်ထောင့်တွင် မြေပြင်မှ ၁.၅ မီတာအကွာတွင် တည်ရှိသည်။",
            hi: "यह काबा के दक्षिणपूर्वी कोने में, जमीन से 1.5 मीटर की दूरी पर स्थित है।",
            uz: "U Ka'baning janubi-sharqiy burchagida, yerdan 1,5 metr balandlikda joylashgan.",
          },
        },
        {
          question: {
            en: "How should pilgrims interact with the Black Stone during pilgrimage?",
            ar: "كيف يجب على الحجاج التعامل مع الحجر الأسود أثناء الحج؟",
            fr: "Comment les pèlerins doivent-ils interagir avec la Pierre noire pendant le pèlerinage ?",
            fa: "حجاج در طول حج چگونه باید با حجرالاسود تعامل داشته باشند؟",
            ms: "Bagaimanakah jemaah haji harus berinteraksi dengan Batu Hitam semasa mengerjakan haji?",
            ur: "حج کے دوران حجاج کو حجر اسود کے ساتھ کیسا برتاؤ کرنا چاہیے؟",
            tr: "Hacılar hac sırasında Kara Taş ile nasıl etkileşime girmelidir?",
            id: "Bagaimana seharusnya jamaah haji berinteraksi dengan Batu Hitam selama haji?",
            ha: "Yaya mahajjata ya kamata su yi hulɗa da Baƙin Dutse a lokacin aikin hajji?",
            es: "¿Cómo deben interactuar los peregrinos con la Piedra Negra durante la peregrinación?",
            ru: "Как паломники должны взаимодействовать с Черным камнем во время паломничества?",
            si: "වන්දනාවේදී වන්දනාකරුවන් කළු ගල සමඟ අන්තර් ක්‍රියා කළ යුත්තේ කෙසේද?",
            am: "ሐጅ አድራጊዎች በሐጅ ወቅት ከጥቁር ድንጋይ ጋር እንዴት መገናኘት አለባቸው?",
            my: "ဘုရားဖူးများသည် ဘုရားဖူးစဉ်အတွင်း Black Stone နှင့် မည်သို့အပြန်အလှန်ဆက်သွယ်သင့်သနည်း။",
            hi: "तीर्थयात्रा के दौरान तीर्थयात्रियों को काले पत्थर के साथ कैसा व्यवहार करना चाहिए?",
            uz: "Ziyorat paytida ziyoratchilar Qora tosh bilan qanday munosabatda bo'lishlari kerak?",
          },
          answer: {
            en: "Pilgrims should touch and kiss the Black Stone after each circuit if possible; otherwise, waving at it from afar is acceptable.",
            ar: "يجب على الحجاج لمس وتقبيل الحجر الأسود بعد كل شوط إذا أمكن؛ وإلا فالإشارة إليه من بعيد مقبولة.",
            fr: "Les pèlerins doivent toucher et embrasser la Pierre noire après chaque circuit si possible ; sinon, il est acceptable de lui faire signe de loin.",
            fa: "حجاج باید در صورت امکان پس از هر دور حجرالاسود را لمس کرده و ببوسند. در غیر این صورت، اشاره از دور به آن قابل قبول است.",
            ms: "Jemaah haji harus menyentuh dan mencium Batu Hitam selepas setiap pusingan jika boleh; jika tidak, melambai ke arahnya dari jauh boleh diterima.",
            ur: "حجاج کو چاہیے کہ اگر ممکن ہو تو ہر چکر کے بعد حجر اسود کو چھوئیں اور بوسہ دیں۔ بصورت دیگر دور سے اس کی طرف اشارہ کرنا قابل قبول ہے۔",
            tr: "Hacılar mümkünse her turun ardından Kara Taş'a dokunup öpmelidir; aksi takdirde uzaktan el sallamak kabul edilebilir.",
            id: "Jamaah haji harus menyentuh dan mencium Batu Hitam setelah setiap putaran jika memungkinkan; jika tidak, melambai padanya dari jauh dapat diterima.",
            ha: "Mahajjata ya kamata su taɓa su sumbaci Baƙin Dutse bayan kowane kewayawa idan zai yiwu; in ba haka ba, yin masa gaisuwa daga nesa abin karɓa ne.",
            es: "Los peregrinos deben tocar y besar la Piedra Negra después de cada circuito si es posible; de lo contrario, es aceptable saludarla desde lejos.",
            ru: "Паломники должны прикасаться и целовать Черный камень после каждого круга, если это возможно; в противном случае допустимо помахать ему издалека.",
            si: "පුළුවන් නම් සෑම පරිපථයකින් පසු වන්දනාකරුවන් කළු ගල ස්පර්ශ කර සිප ගත යුතුය; එසේ නොමැති නම්, දුර සිට එය දෙසට අත වනමින් සිටීම පිළිගත හැකිය.",
            am: "ሐጅ አድራጊዎች ከተቻለ ከእያንዳንዱ ዙር በኋላ ጥቁር ድንጋይን መንካት እና መሳም አለባቸው; ያለበለዚያ ከሩቅ ማወዛወዝ ተቀባይነት አለው።",
            my: "ဘုရားဖူးများသည် ဖြစ်နိုင်လျှင် ဆားကစ်တစ်ခုစီပြီးနောက် Black Stone ကို ထိတွေ့ပြီး နမ်းရှုပ်သင့်သည်။ မဟုတ်ပါက အဝေးမှ လက်ဝှေ့ယမ်းခြင်းသည် လက်ခံနိုင်သည်။",
            hi: "तीर्थयात्रियों को यदि संभव हो तो प्रत्येक सर्किट के बाद काले पत्थर को छूना और चूमना चाहिए; अन्यथा, दूर से इसकी ओर हाथ हिलाना स्वीकार्य है।",
            uz: "Ziyoratchilar imkoni bo'lsa, har bir aylanadan so'ng Qora toshga tegib, o'pishlari kerak; aks holda, unga uzoqdan qo'l siltash maqbuldir.",
          },
        },
        {
          question: {
            en: "What is Maqam Ibraaheem and its significance?",
            ar: "ما هو مقام إبراهيم وما أهميته؟",
            fr: "Qu'est-ce que Maqam Ibraheem et quelle est sa signification ?",
            fa: "مقام ابراهیم چیست و اهمیت آن چیست؟",
            ms: "Apakah Maqam Ibraaheem dan kepentingannya?",
            ur: "مقام ابراہیم کیا ہے اور اس کی کیا اہمیت ہے؟",
            tr: "Makam-ı İbrahim nedir ve önemi nedir?",
            id: "Apa itu Maqam Ibraaheem dan apa signifikansinya?",
            ha: "Menene Maqam Ibraaheem da mahimmancinsa?",
            es: "¿Qué es Maqam Ibraheem y cuál es su significado?",
            ru: "Что такое Макам Ибрагим и каково его значение?",
            si: "මාකම් ඉබ්‍රාහීම් යනු කුමක්ද සහ එහි වැදගත්කම කුමක්ද?",
            am: "መቃም ኢብራሂም ምንድን ነው እና አስፈላጊነቱስ ምንድነው?",
            my: "Maqam Ibraaheem ဆိုတာဘာလဲ၊ ၎င်းရဲ့အရေးပါမှုကဘာလဲ။",
            hi: "मकाम इब्राहिम क्या है और इसका क्या महत्व है?",
            uz: "Maqomi Ibrohim nima va uning ahamiyati nimada?",
          },
          answer: {
            en: "Maqam Ibraaheem is where Ibrahim stood building the Ka'ba, and it is a sign in the Haram with the prophet's footprints.",
            ar: "مقام إبراهيم هو المكان الذي وقف فيه إبراهيم عند بناء الكعبة، وهو علامة في الحرم تحتوي على آثار أقدام النبي.",
            fr: "Maqam Ibraaheem est l'endroit où Ibrahim s'est tenu pour construire la Kaaba, et c'est un signe dans le Haram avec les empreintes du prophète.",
            fa: "مقام ابراهیم جایی است که ابراهیم در هنگام ساخت کعبه ایستاده بود و نشانه ای در حرم است که ردپای پیامبر در آن وجود دارد.",
            ms: "Maqam Ibraaheem ialah tempat Ibrahim berdiri membina Ka'bah, dan ia adalah tanda di Haram dengan kesan kaki nabi.",
            ur: "مقام ابراہیم وہ جگہ ہے جہاں ابراہیم کعبہ کی تعمیر کے لیے کھڑے تھے، اور یہ حرم میں نبی کے نقش قدم کی نشانی ہے۔",
            tr: "Makam-ı İbrahim, İbrahim'in Kabe'yi inşa ederken durduğu yerdir ve Haram'da peygamberin ayak izlerinin bulunduğu bir işarettir.",
            id: "Maqam Ibraaheem adalah tempat Ibrahim berdiri membangun Ka'bah, dan itu adalah tanda di Haram dengan jejak kaki nabi.",
            ha: "Maqam Ibraaheem shine wurin da Ibrahim ya tsaya yana gina Ka'aba, kuma alama ce a cikin Haram tare da sawun annabin.",
            es: "Maqam Ibraaheem es donde Ibrahim estuvo de pie construyendo la Ka'ba, y es una señal en el Haram con las huellas del profeta.",
            ru: "Макам Ибрагим — это место, где Ибрагим стоял, строя Каабу, и это знак в Хараме со следами пророка.",
            si: "මාකම් ඉබ්‍රාහීම් යනු ඉබ්‍රාහීම් කාබාව ගොඩනඟමින් සිටි ස්ථානය වන අතර එය නබිතුමාගේ පා ​​සලකුණු සහිත හරාම් හි සලකුණකි.",
            am: "መቃም ኢብራሂም ኢብራሂም ካዕባን ሲገነባ የቆመበት ሲሆን በሐረም ውስጥ የነቢዩ ፈለግ ያለበት ምልክት ነው።",
            my: "Maqam Ibraaheem သည် Ibrahim ကအ်ဘာကိုတည်ဆောက်ရန်ရပ်တည်ခဲ့သောနေရာဖြစ်ပြီး Haram တွင်တမန်တော်မြတ်၏ ခြေရာများနှင့်အတူရှိနေသောလက္ခဏာဖြစ်သည်။",
            hi: "मकाम इब्राहिम वह जगह है जहाँ इब्राहिम काबा का निर्माण करते समय खड़े थे, और यह हराम में पैगंबर के पदचिह्नों के साथ एक चिन्ह है।",
            uz: "Maqomi Ibrohim - Ibrohim Ka'bani qurish uchun turgan joy bo'lib, u Haramda payg'ambarning oyoq izlari borligi belgisidir.",
          },
        },
      ],
    },
  },
];

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");
  const dir = language === "ar" ? "rtl" : "ltr";

  const t = (key: string) => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, dir, t, categories: categories }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
