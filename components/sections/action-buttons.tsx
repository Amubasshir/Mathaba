'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { useEffect, useState } from 'react';
import FAQQuestions from './faq-questions';

interface ActionButtonsProps {
  onQuestionSelect: (question: string) => void;
  isManualChat: boolean;
  setIsManualChat: (isManualChat: boolean) => void;
}

export default function ActionButtons({
  onQuestionSelect,
  isManualChat,
  setIsManualChat,
}: ActionButtonsProps) {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showRedirectButtons, setShowRedirectButtons] = useState(false);
  const { language } = useLanguage();

  const buttonText = {
    faq: {
      en: 'FAQ',
      ar: 'الأسئلة المتكررة',
      fr: 'FAQ',
      fa: 'سوالات متداول',
      ms: 'Soalan Lazim',
      ur: 'اکثر پوچھے گئے سوالات',
      tr: 'SSS',
      id: 'FAQ',
      ha: 'Tambayoyi akai-akai',
      es: 'Preguntas frecuentes',
      ru: 'Часто задаваемые вопросы',
      si: 'නිතර අසන ප්‍රශ්න',
      am: 'ተደጋጋሚ ጥያቄዎች',
      my: 'အမေးများသောမေးခွန်းများ',
      hi: 'अक्सर पूछे जाने वाले प्रश्न',
      uz: 'TSS',
    },
    guides: {
      en: 'Educational Guides',
      ar: 'الأدلة التوعوية',
      fr: 'Guides éducatifs',
      fa: 'راهنماهای آموزشی',
      ms: 'Panduan Pendidikan',
      ur: 'تعلیمی رہنما',
      tr: 'Eğitim Kılavuzları',
      id: 'Panduan Pendidikan',
      ha: 'Jagororin Ilimi',
      es: 'Guías educativas',
      ru: 'Образовательные руководства',
      si: 'අධ්‍යාපනික මාර්ගෝපදේශ',
      am: 'የትምህርት መመሪያዎች',
      my: 'ပညာရေးလမ်းညွှန်များ',
      hi: 'शैक्षिक मार्गदर्शिकाएँ',
      uz: 'Ta\'limiy qo\'llanmalar',
    },
  };
  
const guideButtons = [
    {
      id: 1,
      text: {
        en: 'Health Awareness',
        ar: 'التوعية الصحية',
        fr: 'Sensibilisation à la santé',
        fa: 'آگاهی از سلامت',
        ms: 'Kesedaran Kesihatan',
        ur: 'صحت سے متعلق آگاہی',
        tr: 'Sağlık Bilinci',
        id: 'Kesadaran Kesehatan',
        ha: 'Sanarwar Lafiya',
        es: 'Conciencia de la Salud',
        ru: 'Осведомленность о здоровье',
        si: 'සෞඛ්‍ය දැනුවත් කිරීම',
        am: 'የጤና ግንዛቤ',
        my: 'ကျန်းမာရေးအသိပညာ',
        hi: 'स्वास्थ्य जागरूकता',
        uz: 'Sog\'liqni saqlash xabardorligi'
      },
      url: 'https://drive.google.com/file/d/1CWPA4hSIhyRcxok6Y1Th83wXCU3-A07f/view',
    },
    {
      id: 2,
      text: {
        en: 'Financial Awareness',
        ar: 'التوعية المالية',
        fr: 'Sensibilisation financière',
        fa: 'آگاهی مالی',
        ms: 'Kesedaran Kewangan',
        ur: 'مالی آگاہی',
        tr: 'Finansal Bilinç',
        id: 'Kesadaran Finansial',
        ha: 'Sanarwar Kuɗi',
        es: 'Conciencia Financiera',
        ru: 'Финансовая осведомленность',
        si: 'මූල්‍ය දැනුවත් කිරීම',
        am: 'የገንዘብ ግንዛቤ',
        my: 'ဘဏ္ဍာရေးအသိပညာ',
        hi: 'वित्तीय जागरूकता',
        uz: 'Moliyaviy xabardorlik'
      },
      url: 'https://drive.google.com/file/d/1USLIxIwnBxweNKsMI1APLPO9BI1MLMqd/view',
    },
    {
      id: 3,
      text: {
        en: 'Legal Awareness Guide',
        ar: 'دليل التوعية القانونية',
        fr: 'Guide de sensibilisation juridique',
        fa: 'راهنمای آگاهی حقوقی',
        ms: 'Panduan Kesedaran Undang-undang',
        ur: 'قانونی آگاہی گائیڈ',
        tr: 'Hukuki Farkındalık Rehberi',
        id: 'Panduan Kesadaran Hukum',
        ha: 'Jagorar Fadakarwa Ta Shari\'a',
        es: 'Guía de Conciencia Legal',
        ru: 'Руководство по правовой осведомленности',
        si: 'නීතිමය දැනුවත් කිරීමේ මාර්ගෝපදේශය',
        am: 'የሕግ ግንዛቤ መመሪያ',
        my: 'တရားဥပဒေအသိပညာပေးလမ်းညွှန်',
        hi: 'कानूनी जागरूकता गाइड',
        uz: 'Huquqiy xabardorlik qo\'llanmasi'
      },
      url: 'https://drive.google.com/file/d/1IwB9HdvtI0yoVo1IraXTKSXzhXEV3yJQ/view',
    },
    {
      id: 4,
      text: {
        en: 'Umrah Guide',
        ar: 'دليل العمرة',
        fr: 'Guide de la Omra',
        fa: 'راهنمای عمره',
        ms: 'Panduan Umrah',
        ur: 'عمرہ گائیڈ',
        tr: 'Umre Rehberi',
        id: 'Panduan Umrah',
        ha: 'Jagorar Umrah',
        es: 'Guía de la Umrah',
        ru: 'Руководство по Умре',
        si: 'උම්රා මාර්ගෝපදේශය',
        am: 'የዑምራ መመሪያ',
        my: 'Umrah လမ်းညွှန်',
        hi: 'उमराह गाइड',
        uz: 'Umra qo\'llanmasi'
      },
      url: 'https://drive.google.com/file/d/1xhcdljVbFZQo45UQ2JbeDJFuL67prXOl/view',
    },
  ];
  
  useEffect(() => {
    if (isManualChat) {
      setShowFAQ(false);
      setShowRedirectButtons(false);
    }
    if (showFAQ || showRedirectButtons) {
      setIsManualChat(false);
    }
  }, [isManualChat, showFAQ, showRedirectButtons]);

  const handleGuideClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFAQClick = () => {
    setShowFAQ(!showFAQ);
    setShowRedirectButtons(false);
  };

  const handleGuidesClick = () => {
    setShowRedirectButtons(!showRedirectButtons);
    setShowFAQ(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <div>
        <Button
          variant="primary"
          className="bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white py-6 w-full rounded-full"
          onClick={handleFAQClick}
        >
          {buttonText.faq[language]}
        </Button>

        {showFAQ && (
          <div className="mt-4 space-y-3">
            <FAQQuestions onQuestionSelect={onQuestionSelect} />
          </div>
        )}
      </div>

      <div>
        <Button
          variant="primary"
          className="bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white py-6 w-full rounded-full"
          onClick={handleGuidesClick}
        >
          {buttonText.guides[language]}
        </Button>
        {showRedirectButtons && (
          <div className="mt-4 space-y-3">
            {guideButtons.map((guide) => (
              <button
                key={guide.id}
                className="w-full px-4 py-3 text-sm bg-white rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground "
                style={{
                  boxShadow:
                    'rgba(50, 50, 93, 0.05) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.05) 0px 18px 36px -18px inset, rgba(50, 50, 93, 0.05) 0px 10px 10px -7px',
                }}
                onClick={() => handleGuideClick(guide.url)}
              >
                {guide.text[language]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
