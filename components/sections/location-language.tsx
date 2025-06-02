'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { MapPin, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FeedbackModal from './feedback-modal';
import LanguageSelector from './language-selector';
import { ThemeConfig } from '@/lib/themes';

interface PageProps {
  theme: ThemeConfig | null;
}

export default function LocationLanguage({theme}: PageProps) {
  const { t, dir } = useLanguage();
  const router = useRouter();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-4 mb-8 w-full flex-wrap">
        <LanguageSelector />

        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push(theme?.location as string)}
            variant="custom"
            className="flex-1 max-w-[160px] gap-1.5 btn-bg text-white py-[1px]"
          >
            <div className={`flex items-center justify-center gap-2 ${dir}`}>
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{t('research.centers')}</span>
            </div>
          </Button>

          <Button
            onClick={() => setIsFeedbackOpen(true)}
            variant="custom"
            className="flex-1 max-w-[160px] gap-1.5 btn-bg text-white py-[1px]"
          >
            <div className={`flex items-center justify-center gap-2 ${dir}`}>
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{t('feedback')}</span>
            </div>
          </Button>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} setIsOpen={setIsFeedbackOpen} />
    </>
  );
}
