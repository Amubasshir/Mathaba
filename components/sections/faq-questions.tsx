"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  onQuestionSelect: (question: string) => void
}

export default function FAQQuestions({ onQuestionSelect }: FAQQuestionsProps) {
  return (
    <>
      {faqCategories.map((category) => (
        <Select key={category.id} onValueChange={onQuestionSelect}>
          <SelectTrigger className="w-full text-right rtl border-[#6b6291]/20">
            <SelectValue placeholder={category.title} />
          </SelectTrigger>
          <SelectContent>
            {category.questions.map((question, index) => (
              <SelectItem key={index} value={question} className="text-right rtl">
                {question}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </>
  )
}

