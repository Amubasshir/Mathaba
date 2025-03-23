'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/language-context';
import { Globe, X } from 'lucide-react';
import { useState } from 'react';

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


const languages = [
  { code: 'ar', name: 'عربي' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'fa', name: 'فارسی' },
  { code: 'ms', name: 'Malay' },
  { code: 'ur', name: 'اردو' },
  { code: 'tr', name: 'Turkish' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ha', name: 'Hausa' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский язык' },
  { code: 'si', name: 'සිංහල භාෂාව' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'my', name: 'Bahasa Malaysia' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'uz', name: "o'zbek" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleLanguageSelect = (code: Language) => {
    // console.log({code});
    setLanguage(code);
    setOpen(false)
    // if (code === 'en' || code === 'ar') {
    //   setLanguage(code);
    //   setOpen(false);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Button
            variant="custom"
            className="flex-1 max-w-[160px] gap-1.5 bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white"
          >
            <div className="flex items-center justify-center gap-2 rtl">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                {languages.find((lang) => lang.code === language)?.name ||
                  'عربي'}
              </span>
            </div>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Select</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="p-6 pt-2">
          <div className="grid grid-cols-1 gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code as Language)}
                className={`
                  px-4 py-2 text-left text-base font-normal transition-colors hover:bg-gray-100
                  ${language === lang.code ? 'bg-gray-100' : ''}
                  ${['ar', 'fa', 'ur'].includes(lang.code) ? 'rtl' : 'ltr'}
                `}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
