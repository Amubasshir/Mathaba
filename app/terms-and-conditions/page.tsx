
'use client'

import MainLayout from "@/components/layouts/main-layout";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import { useLanguage } from "@/contexts/language-context";

const TermsPage = () => {
 const { language, setLanguage } = useLanguage();
  const isArabic = language === 'ar';
  
  const content = {
    "en": {
      title: "Important Notice – Beta Version",
      text: "This version of \"Rafiqi: The Digital Companion for the Guests of Allah\" is a beta version still under development and may contain inaccurate or incomplete information.\n\nPlease note that the answers in \"Rafiqi\" are not considered legal fatwas and do not replace consulting scholars and specialists.\n\nBy using this service, you acknowledge that you understand its experimental nature and agree to the associated terms and conditions."
    },
    bn: {
    "title": "গুরুত্বপূর্ণ নোটিশ – বেটা সংস্করণ",
    "text": "\"রফিকি: আল্লাহর মেহমানদের জন্য একটি ডিজিটাল সহচর\" এর এই সংস্করণটি এখনো উন্নয়নাধীন একটি বেটা সংস্করণ এবং এতে কিছু ভুল বা অসম্পূর্ণ তথ্য থাকতে পারে।\n\nদয়া করে লক্ষ্য করুন যে \"রফিকি\"-এর উত্তরগুলো কোনো ধর্মীয় ফতোয়া হিসেবে গণ্য নয় এবং এটি আলেম ও বিশেষজ্ঞদের সঙ্গে পরামর্শের বিকল্প নয়।\n\nএই সেবাটি ব্যবহার করার মাধ্যমে আপনি এর পরীক্ষামূলক প্রকৃতি বুঝতে পেরেছেন এবং সংশ্লিষ্ট শর্তাবলীতে সম্মত হয়েছেন বলে বিবেচিত হবেন।"
  },
    "ar": {
      title: "تنويه هام – النسخة التجريبية",
      text: "هذه النسخة من \"رفيقي: المرافق الرقمي لضيف الرحمن\" هي إصدار تجريبي لا يزال قيد التطوير، وقد تحتوي على معلومات غير دقيقة أو غير مكتملة.\n\nنرجو العلم أن إجابات \"رفيقي\" لا تُعد فتاوى شرعية، ولا تُغني عن الرجوع إلى أهل العلم والمختصين.\n\nباستخدامك لهذه الخدمة، فإنك تُقر بأنك تدرك طبيعتها التجريبية، وتوافق على الشروط والأحكام المرتبطة بها."
    }
  };

  const t = content[language];

  console.log({t});

  return (
    <MainLayout>
      <Hero theme={null} />
    <div className={` bg-gray-50 py-8 px-4 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.title}</h1>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {t.text}
          </div>
        </div>
      </div>
    </div>
    <Footer />
        </MainLayout>
  );
};

export default TermsPage;