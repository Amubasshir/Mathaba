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
      uz: "Ta'limiy qo'llanmalar",
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
        uz: "Sog'liqni saqlash xabardorligi",
      },
      urls: {
        en: 'https://drive.google.com/file/d/1CWPA4hSIhyRcxok6Y1Th83wXCU3-A07f/view',
        ar: 'https://drive.google.com/file/d/1LFFIXK-pY1ThqLzQQrTslIaOmg2asT2h/view',
        fr: 'https://drive.google.com/file/d/1adyOaOK3pI7ROt6d_FMxzw5nGqvbXvvM/view?usp=sharing',
        fa: 'https://drive.google.com/file/d/16sC0gaf4BsmosMNoPTZaaHCZmVJmVPb4/view?usp=sharing',
        ms: '',
        ur: 'https://drive.google.com/file/d/1gwpJ-UNBCzAtp4vPLnvphDzUvNHYcIOl/view?usp=sharing',
        tr: 'https://drive.google.com/file/d/11aqMnUExkwdGWSp1X4596gvJkSVcPiJF/view?usp=sharing',
        id: 'https://drive.google.com/file/d/11T9iqOSndU8CVGM0BoG7cB6V9aPNdGg1/view?usp=sharing',
        ha: '',
        es: 'https://drive.google.com/file/d/180S2Nx7MWi4DVn3egrmESCE0Uc70TK3R/view?usp=sharing',
        ru: '',
        si: '',
        am: '',
        my: 'https://drive.google.com/file/d/174Okpz2uk0zcHhjilm_SdwF1IUl19vNH/view?usp=sharing',
        hi: 'https://drive.google.com/file/d/1nXk8FlfUcg5HDsZvGVRO88W_qFZ1kxVi/view?usp=sharing',
        uz: '',
      },
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
        uz: 'Moliyaviy xabardorlik',
      },
      urls: {
        en: 'https://drive.google.com/file/d/1USLIxIwnBxweNKsMI1APLPO9BI1MLMqd/view',
        ar: 'https://drive.google.com/file/d/1KLxuChPW6HsKDK-Uq6k8XIVZkRBHBNMS/view?usp=sharing',
        fr: 'https://drive.google.com/file/d/13VH7gW1m4M6dMK3kCkL8_e_3Z6eI6DSl/view?usp=sharing',
        fa: 'https://drive.google.com/file/d/1gsK-7_GXknfqq4c8Ju4Z0XoUWYi8Q53F/view?usp=sharing',
        ms: '',
        ur: 'https://drive.google.com/file/d/1gwpJ-UNBCzAtp4vPLnvphDzUvNHYcIOl/view?usp=sharing',
        tr: 'https://drive.google.com/file/d/16ut4dfPKELVJBSFRl4HT2YQRjSelBbzP/view?usp=sharing',
        id: 'https://drive.google.com/file/d/19yun8DPuHFUYQKH_xb0eRDgl_dMeZ_JM/view?usp=sharing',
        ha: '',
        es: 'https://drive.google.com/file/d/11VFm0pU9YX456DHxeZI2oBWrGBOJo7Tg/view?usp=sharing',
        ru: '',
        si: '',
        am: '',
        my: 'https://drive.google.com/file/d/1Ax1EYp-7YKtOSKfwpbGAML7NvNyupQDs/view?usp=sharing',
        hi: 'https://drive.google.com/file/d/1AfC_LzD6JZmO8Etk9nKrfFNdUnhH021P/view?usp=sharing',
        uz: '',
      },
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
        ha: "Jagorar Fadakarwa Ta Shari'a",
        es: 'Guía de Conciencia Legal',
        ru: 'Руководство по правовой осведомленности',
        si: 'නීතිමය දැනුවත් කිරීමේ මාර්ගෝපදේශය',
        am: 'የሕግ ግንዛቤ መመሪያ',
        my: 'တရားဥပဒေအသိပညာပေးလမ်းညွှန်',
        hi: 'कानूनी जागरूकता गाइड',
        uz: "Huquqiy xabardorlik qo'llanmasi",
      },
      urls: {
        en: 'https://drive.google.com/file/d/1IwB9HdvtI0yoVo1IraXTKSXzhXEV3yJQ/view?usp=sharing',
        ar: 'https://drive.google.com/file/d/1C5aZqUwHlOup5HZESxeQmbkMyHjuOEsn/view?usp=sharing',
        fr: 'https://drive.google.com/file/d/1bY6ydhWEtdImLZ5UlBEDMdBMk7g89SRt/view?usp=sharing',
        fa: 'https://drive.google.com/file/d/1PfKED56Yb8Kut57H2EqihEa5wT9xJaxJ/view?usp=sharing',
        ms: '',
        ur: 'https://drive.google.com/file/d/1pBPzEcqZ8QcSSX-qdfM7EqcMNRinfK-5/view?usp=sharing',
        tr: 'https://drive.google.com/file/d/1FVDMn6zc5dMeRCzsP2YY1h6FWbLBa94a/view?usp=sharing',
        id: 'https://drive.google.com/file/d/1hPiBxtFHfFlIOTN97Sysdg3B3YdA-Dsc/view?usp=sharing',
        ha: '',
        es: 'https://drive.google.com/file/d/1OdJOvhJz5qCvHBuN0Y9sjuQhVuEWTlaP/view?usp=sharing',
        ru: '',
        si: '',
        am: '',
        my: 'https://drive.google.com/file/d/1vi_vIUYpgs1t9FLnCeJ4nrKBk4d0QgRI/view?usp=sharing',
        hi: 'https://drive.google.com/file/d/1aGT1Ehxl48BkGzogXs_bNdPrpzh05Wvv/view?usp=sharing',
        uz: '',
      },
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
        uz: "Umra qo'llanmasi",
      },
      urls: {
        en: 'https://drive.google.com/file/d/1xhcdljVbFZQo45UQ2JbeDJFuL67prXOl/view?usp=sharing',
        ar: 'https://drive.google.com/file/d/13tE048S_ZK5LnOzxi-tyyJuS48_AWFrq/view?usp=sharing',
        fr: 'https://drive.google.com/file/d/1YXFykkM7dmqbuiKBZO94keMsqMi2HXdN/view?usp=sharing',
        fa: 'https://drive.google.com/file/d/1kAU8qBDMmuielGnUMn7810ZqvsuFesc0/view?usp=sharing',
        ms: '',
        ur: 'https://drive.google.com/file/d/1JSIszU8btN9b0pYeLKELFuwVFgj-ML8A/view?usp=sharing',
        tr: 'https://drive.google.com/file/d/1gwpJ-UNBCzAtp4vPLnvphDzUvNHYcIOl/view?usp=sharing',
        id: 'https://drive.google.com/file/d/1iaD58e31eAsxgzEkuAFQGM7Tsv1LYahK/view?usp=sharing',
        ha: '',
        es: 'https://drive.google.com/file/d/1OSBf1D4YCPkjkoR4TbeXcDvcjytcXEw6/view?usp=sharing',
        ru: '',
        si: '',
        am: '',
        my: 'https://drive.google.com/file/d/1H9nwS8Ypp84SCT_bV8VRu5Mr6Unbg9pO/view?usp=sharing',
        hi: 'https://drive.google.com/file/d/1NRudlGtPjuudjgJ9RF9ex9gAzAvA-xo0/view?usp=sharing',
        uz: '',
      },
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
      {/* <div>
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
      </div> */}

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
                onClick={() => handleGuideClick(guide.urls[language])}
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
