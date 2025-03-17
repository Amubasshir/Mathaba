'use client';

import { useLanguage } from '@/contexts/language-context';
import { Parser } from 'json2csv';
import { Download, Loader2, MapPin } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface Feedback {
  rating: number;
  message: string;
  language: string;
  ageRange: string;
  gender: string;
  location?: Location;
  createdAt: string;
}

interface PaginationInfo {
  totalPage: number;
  currentPage: number;
  total: number;
}

interface FeedbackResponse {
  success: boolean;
  data: Feedback[];
  paginate: PaginationInfo;
}

const translations = {
  en: {
    title: 'All Feedbacks',
    downloadCSV: 'Download CSV',
    language: 'Language',
    noFeedback: 'No feedback available',
    rating: 'Rating',
    message: 'Message',
    date: 'Date',
    location: 'Location',
    locationNotAvailable: 'Location not available',
    ageRange: 'Age Range',
    gender: 'Gender',
    genderLabels: {
      male: 'Male',
      female: 'Female',
      other: 'Other',
      prefer_not_to_say: 'Prefer not to say',
    },
  },
  ar: {
    title: 'جميع التعليقات',
    downloadCSV: 'تحميل CSV',
    language: 'اللغة',
    noFeedback: 'لا توجد تعليقات',
    rating: 'التقييم',
    message: 'الرسالة',
    date: 'التاريخ',
    location: 'الموقع',
    locationNotAvailable: 'الموقع غير متاح',
    ageRange: 'الفئة العمرية',
    gender: 'الجنس',
    genderLabels: {
      male: 'ذكر',
      female: 'أنثى',
      other: 'آخر',
      prefer_not_to_say: 'أفضل عدم الذكر',
    },
  },
};

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { language } = useLanguage();
  const limit = 10;
  const t = translations[language as keyof typeof translations];
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const fetchFeedbacks = async (page: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/feedback?lang=${language}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      console.log('Received feedback data:', data);
      if (data.success) {
        setFeedbacks(data);
        console.log('Set feedbacks state:', data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(1);
  }, [language]);

  const downloadCSV = () => {
    if (feedbacks?.data) {
      const fields = [
        'rating',
        'message',
        'language',
        'ageRange',
        'gender',
        'location',
        'createdAt',
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(
        feedbacks.data.map((feedback) => ({
          ...feedback,
          gender:
            t.genderLabels[feedback.gender as keyof typeof t.genderLabels],
          location: feedback.location
            ? `${feedback.location.city}, ${feedback.location.country}`
            : 'N/A',
          createdAt: moment(feedback.createdAt).format(
            'MMMM Do YYYY, h:mm:ss a'
          ),
        }))
      );

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'feedbacks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 6) return 'text-orange-600';
    if (rating <= 8) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      <div
        className={`flex items-center justify-between mb-8 ${
          dir === 'rtl' ? 'flex-row-reverse' : ''
        }`}
      >
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <button
          onClick={downloadCSV}
          className={`inline-flex items-center gap-2 bg-[#c8ad0d] text-white px-4 py-2 rounded-lg hover:bg-[#c8ad0d]/90 transition-colors ${
            dir === 'rtl' ? 'flex-row-reverse' : ''
          }`}
        >
          <Download className="h-4 w-4" />
          <span>{t.downloadCSV}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8ad0d]" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 mb-8">
            {feedbacks?.data?.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {t.noFeedback}
              </div>
            )}
            {feedbacks?.data?.map((feedback, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`flex items-center justify-between mb-4 ${
                    dir === 'rtl' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${getRatingColor(
                      feedback.rating
                    )}`}
                  >
                    {feedback.rating}/10
                  </div>
                  <div className="text-sm text-gray-500">
                    {moment(feedback.createdAt)
                      .locale(language)
                      .format('MMMM Do YYYY, h:mm a')}
                  </div>
                </div>
                {feedback.message && (
                  <p
                    className={`text-gray-700 ${
                      dir === 'rtl' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {feedback.message}
                  </p>
                )}
                <div
                  className={`mt-4 grid grid-cols-2 md:flex md:flex-wrap gap-4 text-sm text-gray-500 ${
                    dir === 'rtl' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {t.language}:{' '}
                    <span className="font-medium">
                      {feedback.language === 'ar' ? 'العربية' : 'English'}
                    </span>
                  </div>
                  {feedback.ageRange && (
                    <div className="flex items-center gap-1">
                      {t.ageRange}:{' '}
                      <span className="font-medium">{feedback.ageRange}</span>
                    </div>
                  )}
                  {feedback.gender && (
                    <div className="flex items-center gap-1">
                      {t.gender}:{' '}
                      <span className="font-medium">
                        {
                          t.genderLabels[
                            feedback.gender as keyof typeof t.genderLabels
                          ]
                        }
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    {feedback.location ? (
                      <span className="font-medium">
                        {`${feedback.location.city}, ${feedback.location.country}`}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        {t.locationNotAvailable}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {feedbacks?.paginate && feedbacks.paginate.totalPage > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchFeedbacks(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#c8ad0d]/10 text-[#c8ad0d] hover:bg-[#c8ad0d]/20'
                }`}
              >
                {language === 'ar' ? 'التالي' : 'Previous'}
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: feedbacks.paginate.totalPage }).map(
                  (_, index) => {
                    // Show only current page, first, last, and one page before and after current
                    if (
                      index === 0 ||
                      index === feedbacks.paginate.totalPage - 1 ||
                      Math.abs(currentPage - (index + 1)) <= 1
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentPage(index + 1);
                            fetchFeedbacks(index + 1);
                          }}
                          className={`min-w-[40px] px-3 py-2 rounded-lg ${
                            currentPage === index + 1
                              ? 'bg-[#c8ad0d] text-white'
                              : 'bg-[#c8ad0d]/10 text-[#c8ad0d] hover:bg-[#c8ad0d]/20'
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    } else if (
                      (index === 1 && currentPage > 3) ||
                      (index === feedbacks.paginate.totalPage - 2 &&
                        currentPage < feedbacks.paginate.totalPage - 2)
                    ) {
                      return (
                        <span key={index} className="px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() => {
                  if (currentPage < feedbacks.paginate.totalPage) {
                    setCurrentPage(currentPage + 1);
                    fetchFeedbacks(currentPage + 1);
                  }
                }}
                disabled={currentPage === feedbacks.paginate.totalPage}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === feedbacks.paginate.totalPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#c8ad0d]/10 text-[#c8ad0d] hover:bg-[#c8ad0d]/20'
                }`}
              >
                {language === 'ar' ? 'السابق' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
