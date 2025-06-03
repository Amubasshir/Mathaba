"use client";

import { useLanguage } from "@/contexts/language-context";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function FeedbackModal({
  isOpen,
  setIsOpen,
}: FeedbackModalProps) {
  const { language } = useLanguage();
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    message: "",
    ageRange: "",
    gender: "",
    nationality: "",
  });
  const [location, setLocation] = useState<Location | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Debug state changes
  useEffect(() => {
    console.log("FeedbackData updated:", feedbackData);
  }, [feedbackData]);

  const handleAgeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Age range selected:", value);
    setFeedbackData((prev) => ({
      ...prev,
      ageRange: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Gender selected:", value);
    setFeedbackData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Nationality selected:", value);
    setFeedbackData((prev) => ({
      ...prev,
      nationality: value,
    }));
  };

  const supportedLanguage = [
    {
      lang: "en",
      title: "Tell us what you think",
      description: "How satisfied are you with this app?",
      rating: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      inputPlaceHolder: "How can we improve this app?",
      submitButtonText: "Submit",
      successTitle: "Thank you for your feedback!",
      successMessage: "Your feedback helps us improve our service.",
      locationNotAvailable: "Location not available",
      locationAvailable: "Location detected",
      ageRangeLabel: "Age Range",
      genderLabel: "Gender",
      nationalityLabel: "Nationality",
      ageRanges: [
        { value: "13-17", label: "13-17" },
        { value: "18-24", label: "18-24" },
        { value: "25-34", label: "25-34" },
        { value: "35-44", label: "35-44" },
        { value: "45-54", label: "45-54" },
        { value: "55-64", label: "55-64" },
        { value: "65+", label: "65+" },
      ],
      genders: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      selectPlaceholder: "Please select",
    },
    {
      lang: "bn",
         title: "আপনার মতামত জানান",
    description: "এই অ্যাপটি নিয়ে আপনি কতটা সন্তুষ্ট?",
      rating: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          "inputPlaceHolder": "আমরা কীভাবে এই অ্যাপটি আরও উন্নত করতে পারি?",
    submitButtonText: "জমা দিন",
    successTitle: "আপনার মতামতের জন্য ধন্যবাদ!",
    successMessage: "আপনার মতামত আমাদের সেবা উন্নত করতে সহায়তা করে।",
    locationNotAvailable: "অবস্থান পাওয়া যায়নি",
    locationAvailable: "অবস্থান শনাক্ত হয়েছে",
    ageRangeLabel: "বয়সের পরিসর",
    genderLabel: "লিঙ্গ",
    nationalityLabel: "জাতীয়তা",
      ageRanges: [
        { value: "13-17", label: "13-17" },
        { value: "18-24", label: "18-24" },
        { value: "25-34", label: "25-34" },
        { value: "35-44", label: "35-44" },
        { value: "45-54", label: "45-54" },
        { value: "55-64", label: "55-64" },
        { value: "65+", label: "65+" },
      ],
      genders: [
      { value: "male", label: "পুরুষ" },
      { value: "female", label: "মহিলা" }
    ],
    selectPlaceholder: "অনুগ্রহ করে নির্বাচন করুন",
    },
    {
      lang: "ar",
      title: "أخبرنا برأيك",
      description: "كم انت راض بتطبيق هذا؟",
      rating: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"],
      inputPlaceHolder: "كيف يمكننا تحسين هذا التطبيق؟",
      submitButtonText: "إرسال",
      successTitle: "شكراً على ملاحظاتك!",
      successMessage: "تساعدنا ملاحظاتك في تحسين خدماتنا.",
      locationNotAvailable: "الموقع غير متاح",
      locationAvailable: "تم تحديد الموقع",
      ageRangeLabel: "الفئة العمرية",
      genderLabel: "الجنس",
      nationalityLabel: "الجنسية",
      ageRanges: [
        { value: "13-17", label: "١٣-١٧" },
        { value: "18-24", label: "١٨-٢٤" },
        { value: "25-34", label: "٢٥-٣٤" },
        { value: "35-44", label: "٣٥-٤٤" },
        { value: "45-54", label: "٤٥-٥٤" },
        { value: "55-64", label: "٥٥-٦٤" },
        { value: "65+", label: "٦٥+" },
      ],
      genders: [
        { value: "male", label: "ذكر" },
        { value: "female", label: "أنثى" },
      ],
      selectPlaceholder: "الرجاء الاختيار",
    },
  ];

  const selectedLangData =
    supportedLanguage.find((item) => item.lang === language) ||
    supportedLanguage[0];

  useEffect(() => {
    // Get user's location when the site loads
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // Use reverse geocoding to get city and country.
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results[0]) {
            const { components } = data.results[0];
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city:
                components.city ||
                components.town ||
                components.village ||
                "Unknown",
              country: components.country || "Unknown",
            });
          }
        } catch (error) {
          console.error("Error getting location details:", error);
        }
      });
    }
  }, []);

  const handleRatingClick = (rating: number) => {
    setFeedbackData((prev) => ({ ...prev, rating }));
  };

  const handleMessageChange = (message: string) => {
    setFeedbackData((prev) => ({ ...prev, message }));
  };

  const handleSubmit = async () => {
    setError("");
    console.log("Starting submission with data:", feedbackData);

    // Validate all required fields
    if (!feedbackData.rating) {
      setError(
        language === "ar" ? "يرجى تحديد التقييم" : "Please select a rating"
      );
      return;
    }

    if (!feedbackData.ageRange || feedbackData.ageRange === "") {
      setError(
        language === "ar"
          ? "يرجى تحديد الفئة العمرية"
          : "Please select an age range"
      );
      return;
    }

    if (!feedbackData.gender || feedbackData.gender === "") {
      setError(
        language === "ar" ? "يرجى تحديد الجنس" : "Please select a gender"
      );
      return;
    }

    if (!feedbackData.nationality || feedbackData.nationality === "") {
      setError(
        language === "ar" ? "يرجى تحديد الجنسية" : "Please select a nationality"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a clean submission object
      const submitData = {
        rating: Number(feedbackData.rating),
        message: feedbackData.message.trim(),
        ageRange: feedbackData.ageRange,
        gender: feedbackData.gender,
        nationality: feedbackData.nationality,
        language,
        location,
      };

      console.log(
        "Submitting data to server:",
        JSON.stringify(submitData, null, 2)
      );

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit feedback");
      }

      if (!responseData.success) {
        throw new Error(
          responseData.error || "Server reported submission failure"
        );
      }

      setIsSubmitted(true);
      console.log("Feedback submitted successfully:", responseData.data);

      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setFeedbackData({
            rating: 0,
            message: "",
            ageRange: "",
            gender: "",
            nationality: "",
          });
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError(
        language === "ar"
          ? "حدث خطأ أثناء إرسال التعليق"
          : "Error submitting feedback"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={() => !isSubmitted && setIsOpen(false)}
          className="relative z-[100]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
          />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full lg:max-w-[600px] space-y-4 bg-white p-8 rounded-md"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
                  >
                    <Check className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedLangData.successTitle}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {selectedLangData.successMessage}
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-xl text-[#4a4a4a] font-bold">
                      {selectedLangData.title}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div>
                    {error && (
                      <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-2 mb-4 text-sm ${
                        location ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>
                        {location
                          ? `${location.city}, ${location.country}`
                          : selectedLangData.locationNotAvailable}
                      </span>
                    </div>

                    <p className="mb-4 text-[#4a4a4a] text-base font-medium">
                      {selectedLangData.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex gap-3.5 w-full flex-wrap justify-center">
                        {selectedLangData.rating.map((num, index) => (
                          <button
                            key={index}
                            className={`w-9 h-9 p-1 rounded-lg font-medium text-white
                              ${
                                [0, 1, 2, 3, 4, 5, 6].includes(index)
                                  ? "bg-orange-600"
                                  : [7, 8].includes(index)
                                  ? "bg-yellow-400"
                                  : "bg-green-500"
                              }
                              ${
                                feedbackData.rating === index
                                  ? "outline outline-2 outline-black"
                                  : ""
                              }`}
                            onClick={() => handleRatingClick(index)}
                            disabled={isSubmitting}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between py-3">
                      <p className="text-xs text-[#4a4a4a] font-medium leading-4">
                        {language === "ar"
                          ? "غير راضٍ تماماً"
                          : "1 - Very unlikely"}
                      </p>
                      <p className="text-xs text-[#4a4a4a] font-medium leading-4">
                        {language === "ar" ? "راضٍ تماماً" : "10 - Very likely"}
                      </p>
                    </div>

                    <textarea
                      className="w-full p-2 border rounded-lg mb-4 bg-white border-color-1 focus:outline-none focus:ring-0"
                      rows={4}
                      placeholder={selectedLangData.inputPlaceHolder}
                      value={feedbackData.message}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      dir={language === "ar" ? "rtl" : "ltr"}
                      disabled={isSubmitting}
                    />

                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedLangData.ageRangeLabel}
                        </label>
                        <select
                          className="w-full p-2 border rounded-lg bg-white border-color-1 focus:outline-none focus:ring-0"
                          value={feedbackData.ageRange}
                          onChange={handleAgeRangeChange}
                          dir={language === "ar" ? "rtl" : "ltr"}
                          disabled={isSubmitting}
                        >
                          <option value="">
                            {selectedLangData.selectPlaceholder}
                          </option>
                          {selectedLangData.ageRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                              {range.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedLangData.genderLabel}
                        </label>
                        <select
                          className="w-full p-2 border rounded-lg bg-white border-color-1 focus:outline-none focus:ring-0"
                          value={feedbackData.gender}
                          onChange={handleGenderChange}
                          dir={language === "ar" ? "rtl" : "ltr"}
                          disabled={isSubmitting}
                        >
                          <option value="">
                            {selectedLangData.selectPlaceholder}
                          </option>
                          {selectedLangData.genders.map((gender) => (
                            <option key={gender.value} value={gender.value}>
                              {gender.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {selectedLangData.nationalityLabel}
                        </label>
                        <select
                          className="w-full p-2 border rounded-lg bg-white border-color-1 focus:outline-none focus:ring-0"
                          value={feedbackData.nationality}
                          onChange={handleNationalityChange}
                          dir={language === "ar" ? "rtl" : "ltr"}
                          disabled={isSubmitting}
                        >
                          <option value="">
                            {selectedLangData.selectPlaceholder}
                          </option>
                          {[
                            "Afghanistan",
                            "Albania",
                            "Algeria",
                            "Azerbaijan",
                            "Bahrain",
                            "Bangladesh",
                            "Brunei",
                            "Burkina Faso",
                            "Chad",
                            "Comoros",
                            "Djibouti",
                            "Egypt",
                            "France",
                            "Gambia",
                            "Guinea",
                            "Indonesia",
                            "India",
                            "Iran",
                            "Iraq",
                            "Jordan",
                            "Kazakhstan",
                            "Kuwait",
                            "Kyrgyzstan",
                            "Lebanon",
                            "Libya",
                            "Malaysia",
                            "Maldives",
                            "Mali",
                            "Mauritania",
                            "Morocco",
                            "Niger",
                            "Nigeria",
                            "Oman",
                            "Pakistan",
                            "Palestine",
                            "Qatar",
                            "Saudi Arabia",
                            "Senegal",
                            "Sierra Leone",
                            "Somalia",
                            "Spain",
                            "Sudan",
                            "Syria",
                            "Tajikistan",
                            "Tunisia",
                            "Turkey",
                            "Turkmenistan",
                            "United Arab Emirates",
                            "Uzbekistan",
                            "Yemen",
                          ].map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      className={`btn-bg text-white py-2 px-4 rounded-lg transition-colors ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {selectedLangData.submitButtonText}
                        </span>
                      ) : (
                        selectedLangData.submitButtonText
                      )}
                    </button>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
