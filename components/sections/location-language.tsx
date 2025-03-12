'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { MapPin } from 'lucide-react';
import LanguageSelector from './language-selector';

export default function LocationLanguage() {
  const { t, dir } = useLanguage();

  return (
    <div className="flex justify-center gap-4 mb-8 w-full">
      <LanguageSelector />

      <div className="flex items-center gap-1 cursor-pointer">
        <Button
          variant="custom"
          className="flex-1 max-w-[160px] gap-1.5 bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white py-[1px]"
        >
          <div className={`flex items-center justify-center gap-2 ${dir}`}>
          <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{t('research.centers')}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
