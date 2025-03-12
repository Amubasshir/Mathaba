'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
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
    };
    questions: Question[];
  };
};

type Question = {
  question: {
    en: string;
    ar: string;
  };
  answer: {
    en: string;
    ar: string;
  };
};

const translations = {
  en: {
    'research.centers': 'Locations',
    'ask.me': 'Ask me',
    // Add more translations as needed
  },
  ar: {
    'research.centers': 'المواقع',
    'ask.me': 'اسألني',
    // Add more translations as needed
  },
};


const categories = [
  {
    "id": 1,
    "category": {
      "name": {
        "en": "Health Question",
        "ar": "سؤال صحي"
      },
      "questions": [
        {
          "question": {
            "en": "What is the significance of physical ability in performing Umrah and Hajj?",
            "ar": "ما أهمية القدرة البدنية في أداء العمرة والحج؟"
          },
          "answer": {
            "en": "Physical ability is a condition for performing Umrah and Hajj as it requires great physical effort.",
            "ar": "القدرة البدنية شرط لأداء العمرة والحج حيث يتطلب جهداً بدنياً كبيراً."
          }
        },
        {
          "question": {
            "en": "How should pilgrims manage their medications during Umrah and Hajj?",
            "ar": "كيف يجب على الحجاج إدارة أدويتهم خلال العمرة والحج؟"
          },
          "answer": {
            "en": "Pilgrims should take sufficient medications and store them at the correct temperature.",
            "ar": "يجب على الحجاج أخذ الأدوية الكافية وتخزينها في درجة الحرارة المناسبة."
          }
        },
        {
          "question": {
            "en": "What are the recommendations for preventing food poisoning during Umrah and Hajj?",
            "ar": "ما هي التوصيات للوقاية من التسمم الغذائي خلال العمرة والحج؟"
          },
          "answer": {
            "en": "Avoid eating food that has been stored for long periods and ensure fruits and vegetables are washed.",
            "ar": "تجنب تناول الطعام المخزن لفترات طويلة والتأكد من غسل الفواكه والخضروات."
          }
        },
        {
          "question": {
            "en": "Why are face masks important during Umrah and Hajj?",
            "ar": "لماذا تعتبر الكمامات مهمة خلال العمرة والحج؟"
          },
          "answer": {
            "en": "Face masks help prevent the spread of infectious viruses and should be worn in crowded places.",
            "ar": "تساعد الكمامات في منع انتشار الفيروسات المعدية ويجب ارتداؤها في الأماكن المزدحمة."
          }
        }
      ]
    }
  },
  {
    "id": 2,
    "category": {
      "name": {
        "en": "Financial Awareness Question",
        "ar": "سؤال التوعية المالية"
      },
      "questions": [
        {
          "question": {
            "en": "What are the ways to convert currency in Saudi Arabia?",
            "ar": "ما هي طرق تحويل العملة في المملكة العربية السعودية؟"
          },
          "answer": {
            "en": "Currency conversion can be done at certified exchanges, licensed banks, and electronic banks.",
            "ar": "يمكن تحويل العملة في مراكز الصرافة المعتمدة والبنوك المرخصة والبنوك الإلكترونية."
          }
        },
        {
          "question": {
            "en": "What items require a customs declaration upon entering and leaving Saudi Arabia?",
            "ar": "ما هي الأشياء التي تتطلب إقراراً جمركياً عند دخول المملكة العربية السعودية ومغادرتها؟"
          },
          "answer": {
            "en": "You must declare cash over 60,000 riyals, gold bars, and precious metals.",
            "ar": "يجب الإقرار عن النقد الذي يزيد عن 60,000 ريال، وسبائك الذهب، والمعادن الثمينة."
          }
        },
        {
          "question": {
            "en": "Which electronic payment methods are accepted in Saudi Arabia?",
            "ar": "ما هي وسائل الدفع الإلكترونية المقبولة في المملكة العربية السعودية؟"
          },
          "answer": {
            "en": "Credit cards, bank transfers, and SADAD are commonly accepted electronic payment methods.",
            "ar": "البطاقات الائتمانية والتحويلات البنكية ونظام سداد هي وسائل الدفع الإلكترونية الشائعة."
          }
        },
        {
          "question": {
            "en": "Is it necessary to carry a lot of cash during a trip to Saudi Arabia?",
            "ar": "هل من الضروري حمل الكثير من النقود خلال الرحلة إلى المملكة العربية السعودية؟"
          },
          "answer": {
            "en": "No, as most financial transactions can be made with electronic payments.",
            "ar": "لا، حيث يمكن إجراء معظم المعاملات المالية عبر وسائل الدفع الإلكترونية."
          }
        }
      ]
    }
  },
  {
    "id": 3,
    "category": {
      "name": {
        "en": "Legal Awareness Question",
        "ar": "سؤال التوعية القانونية"
      },
      "questions": [
        {
          "question": {
            "en": "What penalties face a licensee who violates rules in Saudi Arabia for pilgrim-related services?",
            "ar": "ما هي العقوبات التي يواجهها المرخص له الذي يخالف القواعد في المملكة العربية السعودية للخدمات المتعلقة بالحجاج؟"
          },
          "answer": {
            "en": "Penalties include license revocation, fines up to SR100,000, and possible suspension.",
            "ar": "تشمل العقوبات إلغاء الترخيص وغرامات تصل إلى 100,000 ريال سعودي والإيقاف المحتمل."
          }
        },
        {
          "question": {
            "en": "What happens if someone provides pilgrim services without a license?",
            "ar": "ماذا يحدث إذا قدم شخص خدمات للحجاج بدون ترخيص؟"
          },
          "answer": {
            "en": "They face a fine up to SR100,000, which can double upon repeat offenses.",
            "ar": "يواجهون غرامة تصل إلى 100,000 ريال سعودي، ويمكن أن تتضاعف عند تكرار المخالفات."
          }
        },
        {
          "question": {
            "en": "What are the responsibilities of a domestic pilgrims service provider?",
            "ar": "ما هي مسؤوليات مقدم خدمات الحجاج المحليين؟"
          },
          "answer": {
            "en": "They must provide all necessary services to registered pilgrims and ensure smooth performance of rituals.",
            "ar": "يجب عليهم تقديم جميع الخدمات اللازمة للحجاج المسجلين وضمان أداء المناسك بسلاسة."
          }
        },
        {
          "question": {
            "en": "Is it mandatory for service contracts with pilgrims to follow a standard model?",
            "ar": "هل من الإلزامي أن تتبع عقود الخدمة مع الحجاج نموذجاً موحداً؟"
          },
          "answer": {
            "en": "Yes, they should follow a unified form issued by the Ministry of Umrah and Hajj.",
            "ar": "نعم، يجب أن تتبع النموذج الموحد الصادر عن وزارة العمرة والحج."
          }
        }
      ]
    }
  },
  {
    "id": 4,
    "category": {
      "name": {
        "en": "Al-Masjid Al-Haram Question",
        "ar": "سؤال المسجد الحرام"
      },
      "questions": [
        {
          "question": {
            "en": "What is the significance of the Black Stone in Islam?",
            "ar": "ما هي أهمية الحجر الأسود في الإسلام؟"
          },
          "answer": {
            "en": "The Black Stone is a stone from Paradise and serves as the start and finish point of each circuit around the Ka'ba.",
            "ar": "الحجر الأسود هو حجر من الجنة ويعتبر نقطة البداية والنهاية لكل شوط حول الكعبة."
          }
        },
        {
          "question": {
            "en": "Where is the Black Stone located in the Ka'ba?",
            "ar": "أين يقع الحجر الأسود في الكعبة؟"
          },
          "answer": {
            "en": "It is located in the southeastern corner of the Ka'ba, 1.5 meters from the ground.",
            "ar": "يقع في الركن الجنوبي الشرقي للكعبة، على ارتفاع 1.5 متر من الأرض."
          }
        },
        {
          "question": {
            "en": "How should pilgrims interact with the Black Stone during pilgrimage?",
            "ar": "كيف يجب على الحجاج التعامل مع الحجر الأسود أثناء الحج؟"
          },
          "answer": {
            "en": "Pilgrims should touch and kiss the Black Stone after each circuit if possible; otherwise, waving at it from afar is acceptable.",
            "ar": "يجب على الحجاج لمس وتقبيل الحجر الأسود بعد كل شوط إذا أمكن؛ وإلا فالإشارة إليه من بعيد مقبولة."
          }
        },
        {
          "question": {
            "en": "What is Maqam Ibraaheem and its significance?",
            "ar": "ما هو مقام إبراهيم وما أهميته؟"
          },
          "answer": {
            "en": "Maqam Ibraaheem is where Ibrahim stood building the Ka'ba, and it is a sign in the Haram with the prophet's footprints.",
            "ar": "مقام إبراهيم هو المكان الذي وقف فيه إبراهيم عند بناء الكعبة، وهو علامة في الحرم تحتوي على آثار أقدام النبي."
          }
        }
      ]
    }
  }
]

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string) => {
    return (
      translations[language][key as keyof (typeof translations)['en']] || key
    );
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, categories:categories}}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
