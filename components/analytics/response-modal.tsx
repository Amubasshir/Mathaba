'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';

const translations = {
  en: {
    seeMore: 'See more',
    response: 'AI Response',
  },
  ar: {
    seeMore: 'عرض المزيد',
    response: 'رد الذكاء الاصطناعي',
  },
};

interface ResponseModalProps {
  response: string;
}

export function ResponseModal({ response }: ResponseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
      <div className="max-w-[260px] truncate text-muted-foreground" dir={dir}>
        {response}
      </div>
      <Button
        variant="ghost"
        className="px-2 h-6 text-xs hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        {t.seeMore}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4" dir={dir}>
              {t.response}
            </DialogTitle>
          </DialogHeader>
          <div className="text-base whitespace-pre-wrap" dir={dir}>
            {response}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
