import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

export default function Hero() {
  const { language } = useLanguage();

  const heroText = {
    en: "Rafiqi: The Digital Companion for the Guests of Allah",
    ar: "رفيقي :المرافق الرقمي لضيف الرحمن"
  };

  return (
    <div className="text-center mb-8 w-full">
      <div className="relative w-32 h-32 mx-auto mb-2">
        <Image
          src="/mathabh.png"
          alt="Flow Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <p className={`text-[#646263] text-center text-lg font-medium max-w-sm mx-auto mb-4 ${language === 'en' ? 'ltr ' : 'rtl'}`}>
        {language === 'en' ? heroText.en : heroText.ar}
      </p>
    </div>
  );
}
