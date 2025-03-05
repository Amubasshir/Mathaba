"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context";

// FAQ data structure
const faqCategories = [
  {
    id: "umrah",
    title: "الأسئلة المتكررة عن مناسك العمرة",
    questions: ["ما هي أركان العمرة؟", "ما هي المواقيت الزمانية للعمرة؟", "ما هي سنن الإحرام؟", "كيف أؤدي العمرة؟"],
  },
  {
    id: "mina",
    title: "الأسئلة المتكررة عن منابة",
    questions: ["ما هو وادي منى؟", "متى يذهب الحجاج إلى منى؟", "ما هي أعمال منى؟", "كم يوم يقضي الحجاج في منى؟"],
  },
  {
    id: "mecca",
    title: "الأسئلة المتكررة عن مكة المكرمة",
    questions: [
      "ما هي حدود الحرم المكي؟",
      "ما هي أبرز المعالم في مكة المكرمة؟",
      "ما هو فضل الصلاة في المسجد الحرام؟",
      "ما هي آداب دخول مكة المكرمة؟",
    ],
  },
  {
    id: "medina",
    title: "الأسئلة المتكررة عن المدينة المنورة",
    questions: [
      "ما هي أبرز المساجد في المدينة المنورة؟",
      "ما هي البقيع؟",
      "ما فضل الصلاة في المسجد النبوي؟",
      "ما هي آداب زيارة المسجد النبوي؟",
    ],
  },
]

interface FAQQuestionsProps {
  onQuestionSelect: (question: string, answer: string) => void
}

export default function FAQQuestions() {
  const { dir, categories, language } = useLanguage();
  
  const handleQuestionSelect = (value: string) => {
    // Find the selected question across all categories
    for (const category of categories) {
      const selectedQuestion = category.category.questions.find(
        (item: any) => item.question[language] === value
      );
      if (selectedQuestion) {
        // Use the global function to handle the question and answer
        // @ts-ignore - Using window method
        if (window.handleCategoryQuestionSelect) {
          window.handleCategoryQuestionSelect(value, selectedQuestion.answer[language]);
        }
        break;
      }
    }
  };
  
  return (
    <>
      {categories.map((category: any) => (
        <Select 
          key={category.id} 
          onValueChange={handleQuestionSelect}
        >
          <SelectTrigger 
            className="w-full border-[#6b6291]/20" 
            dir={dir}
          >
            <SelectValue 
              placeholder={category.category.name[language] || category.category.name.en} 
              className="block w-full"
            />
          </SelectTrigger>
          <SelectContent dir={dir}>
            {category.category.questions.map((item: any, index: number) => (
              <SelectItem 
                key={index} 
                value={item.question[language] || item.question.en}
                className="w-full"
                dir={dir}
              >
                <span className="block w-full">
                  {item.question[language] || item.question.en}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </>
  )
}

