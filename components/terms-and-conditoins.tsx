'use client'

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

// Mock useLanguage hook for demo


const TermsModal = () => {
const { language, setLanguage } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const isArabic = language === 'ar';

  
  // Check if user has seen the modal before
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenTermsModal');
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  
  const handleModalClose = () => {
    setShowModal(false);
    sessionStorage.setItem('hasSeenTermsModal', 'true');
  };
  
  const content = {
    en: {
      title: "Important Notice – Beta Version",
      text: "This version of \"Rafiqi: The Digital Companion for the Guests of Allah\" is a beta version still under development and may contain inaccurate or incomplete information.\n\nPlease note that the answers in \"Rafiqi\" are not considered legal fatwas and do not replace consulting scholars and specialists.\n\nBy using this service, you acknowledge that you understand its experimental nature and agree to the associated terms and conditions."
    },
    bn: {
    "title": "গুরুত্বপূর্ণ নোটিশ – বেটা সংস্করণ",
    "text": "\"রফিকি: আল্লাহর মেহমানদের জন্য একটি ডিজিটাল সহচর\" এর এই সংস্করণটি এখনো উন্নয়নাধীন একটি বেটা সংস্করণ এবং এতে কিছু ভুল বা অসম্পূর্ণ তথ্য থাকতে পারে।\n\nদয়া করে লক্ষ্য করুন যে \"রফিকি\"-এর উত্তরগুলো কোনো ধর্মীয় ফতোয়া হিসেবে গণ্য নয় এবং এটি আলেম ও বিশেষজ্ঞদের সঙ্গে পরামর্শের বিকল্প নয়।\n\nএই সেবাটি ব্যবহার করার মাধ্যমে আপনি এর পরীক্ষামূলক প্রকৃতি বুঝতে পেরেছেন এবং সংশ্লিষ্ট শর্তাবলীতে সম্মত হয়েছেন বলে বিবেচিত হবেন।"
  },
    ar: {
      title: "تنويه هام – النسخة التجريبية",
      text: "هذه النسخة من \"رفيقي: المرافق الرقمي لضيف الرحمن\" هي إصدار تجريبي لا يزال قيد التطوير، وقد تحتوي على معلومات غير دقيقة أو غير مكتملة.\n\nنرجو العلم أن إجابات \"رفيقي\" لا تُعد فتاوى شرعية، ولا تُغني عن الرجوع إلى أهل العلم والمختصين.\n\nباستخدامك لهذه الخدمة، فإنك تُقر بأنك تدرك طبيعتها التجريبية، وتوافق على الشروط والأحكام المرتبطة بها."
    }
  };

  const t = content[language];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
          <button
            onClick={handleModalClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {t.text}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={handleModalClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isArabic ? 'أفهم وأوافق' : 'I Understand & Agree'}
          </button>
        </div>
      </div>
    </div>
  );
};


export default TermsModal;