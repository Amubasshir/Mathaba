import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';

export default function Hero() {
  const { language } = useLanguage();

//   const heroText = {
//     en: 'Rafiqi: The Digital Companion for the Guests of Allah',
//     ar: 'رفيقي :المرافق الرقمي لضيف الرحمن',
//   };
  const heroText = {
    "en": "Rafiqi: The Digital Companion for the Guests of Allah",
    "ar": "رفيقي :المرافق الرقمي لضيف الرحمن",
    "fr": "Rafiqi : Le compagnon numérique pour les invités d'Allah",
    "fa": "رفیقی: همراه دیجیتال برای مهمانان الله",
    "ms": "Rafiqi: Teman Digital untuk Tetamu Allah",
    "ur": "رفیقی: اللہ کے مہمانوں کے لیے ڈیجیٹل ساتھی",
    "tr": "Rafiqi: Allah'ın Misafirleri için Dijital Yol Arkadaşı",
    "id": "Rafiqi: Pendamping Digital untuk Tamu Allah",
    "ha": "Rafiqi: Abokin Dijital na Baƙin Allah",
    "es": "Rafiqi: El Compañero Digital para los Huéspedes de Alá",
    "ru": "Rafiqi: Цифровой Компаньон для Гостей Аллаха",
    "si": "රෆිකි: අල්ලාහ්ගේ අමුත්තන් සඳහා ඩිජිටල් මිතුරා",
    "am": "ራፊቂ: ለአላህ እንግዶች ዲጂታል ተሳታፊ",
    "ta": "ரஃபிகி: அல்லாவின் விருந்தினர்களுக்கான டிஜிட்டல் துணைவர்",
    "hi": "रफ़ीक़ी: अल्लाह के मेहमानों के लिए डिजिटल साथी",
    "uz": "Rafiqi: Allohning Mehmonlari uchun Raqamli Hamroh"
  }
  ;

  return (
    <div className="text-center mb-3 w-full">
      <div className="relative w-32 h-32 mx-auto mb-0">
        <Image
          src="/mathabh.png"
          alt="Flow Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <p
        className={`text-[#646263] text-center text-lg font-medium max-w-sm mx-auto mb-4 ${
          language === 'en' ? 'ltr ' : 'rtl'
        }`}
      >
        {language === 'en' ? heroText.en : heroText.ar}
      </p>
    </div>
  );
}
