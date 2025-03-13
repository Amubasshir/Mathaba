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
    faq: language === 'en' ? 'FAQ' : 'الأسئلة المتكررة',
    guides: language === 'en' ? 'Educational Guides' : 'الأدلة التوعوية',
  };

  const guideButtons = [
    {
      id: 1,
      text: language === 'en' ? 'Health Awareness' : 'التوعية الصحية',
      url: 'https://drive.google.com/file/d/1CWPA4hSIhyRcxok6Y1Th83wXCU3-A07f/view',
    },
    {
      id: 2,
      text: language === 'en' ? 'Financial Awareness' : 'التوعية المالية',
      url: 'https://drive.google.com/file/d/1USLIxIwnBxweNKsMI1APLPO9BI1MLMqd/view',
    },
    {
      id: 3,
      text:
        language === 'en' ? 'Legal Awareness Guide' : 'دليل التوعية القانونية',
      url: 'https://drive.google.com/file/d/1IwB9HdvtI0yoVo1IraXTKSXzhXEV3yJQ/view',
    },
    {
      id: 4,
      text: language === 'en' ? 'Umrah Guide' : 'دليل العمرة',
      url: 'https://drive.google.com/file/d/1xhcdljVbFZQo45UQ2JbeDJFuL67prXOl/view',
    },
  ];

  useEffect(() => {
    if(isManualChat){
        setShowFAQ(false);
        setShowRedirectButtons(false);
    }
    if(showFAQ || showRedirectButtons){
        setIsManualChat(false);
    }
  }, [isManualChat, showFAQ, showRedirectButtons])

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
          {buttonText.faq}
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
          {buttonText.guides}
        </Button>
        {showRedirectButtons && (
          <div className="mt-4 space-y-3">
            {guideButtons.map((guide) => (
              <button
                key={guide.id}
                className="w-full px-4 py-3 text-sm bg-white rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground "
                style={{boxShadow: "rgba(50, 50, 93, 0.05) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.05) 0px 18px 36px -18px inset, rgba(50, 50, 93, 0.05) 0px 10px 10px -7px"}}
                onClick={() => handleGuideClick(guide.url)}
              >
                {guide.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
