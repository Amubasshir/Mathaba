"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

// FAQ data structure
const faqData = [
  {
    id: "umrah",
    title: "الأسئلة المتكررة عن مناسك العمرة",
    questions: [
      {
        q: "ما هي أركان العمرة؟",
        a: "أركان العمرة أربعة: الإحرام، الطواف، السعي، والحلق أو التقصير.",
      },
      {
        q: "ما هي المواقيت الزمانية للعمرة؟",
        a: "العمرة مشروعة في جميع أيام السنة، ولا وقت محدد لها.",
      },
      {
        q: "ما هي سنن الإحرام؟",
        a: "من سنن الإحرام: الاغتسال، التطيب قبل الإحرام، لبس الإحرام للرجال.",
      },
    ],
  },
  {
    id: "mina",
    title: "الأسئلة المتكررة عن منابة",
    questions: [
      {
        q: "ما هو وادي منى؟",
        a: "وادي منى هو أحد المشاعر المقدسة، ويقع شرق مكة المكرمة.",
      },
      {
        q: "متى يذهب الحجاج إلى منى؟",
        a: "يذهب الحجاج إلى منى في اليوم الثامن من ذي الحجة.",
      },
    ],
  },
  {
    id: "mecca",
    title: "الأسئلة المتكررة عن مكة المكرمة",
    questions: [
      {
        q: "ما هي حدود الحرم المكي؟",
        a: "تمتد حدود الحرم المكي لمسافات متفاوتة في جميع الاتجاهات.",
      },
      {
        q: "ما هي أبرز المعالم في مكة المكرمة؟",
        a: "من أبرز المعالم: المسجد الحرام، جبل النور، جبل ثور.",
      },
    ],
  },
  {
    id: "medina",
    title: "الأسئلة المتكررة عن المدينة المنورة",
    questions: [
      {
        q: "ما هي أبرز المساجد في المدينة المنورة؟",
        a: "المسجد النبوي، مسجد قباء، مسجد القبلتين.",
      },
      {
        q: "ما هي البقيع؟",
        a: "البقيع هي مقبرة أهل المدينة وفيها دفن عدد من الصحابة.",
      },
    ],
  },
]

export default function FAQSection() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({})

  return (
    <div className="w-full space-y-2">
      {faqData.map((section) => (
        <div key={section.id} className="rounded-lg border border-[#6b6291]/20">
          <button
            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            className={`
              w-full px-4 py-3 flex items-center justify-between
              text-right rtl text-[#646263] hover:bg-[#6b6291]/5
              rounded-lg transition-colors
              ${openSection === section.id ? "bg-[#6b6291]/5" : ""}
            `}
          >
            <span className="text-base font-medium">{section.title}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openSection === section.id ? "transform rotate-180" : ""}`}
            />
          </button>

          {openSection === section.id && (
            <div className="p-4 space-y-2">
              {section.questions.map((qa, index) => (
                <div key={index} className="rounded-lg border border-[#6b6291]/10 overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenQuestions((prev) => ({
                        ...prev,
                        [`${section.id}-${index}`]: !prev[`${section.id}-${index}`],
                      }))
                    }
                    className={`
                      w-full px-4 py-3 text-right rtl
                      text-[#646263] hover:bg-[#e6f7f7]
                      transition-colors text-sm
                      ${openQuestions[`${section.id}-${index}`] ? "bg-[#e6f7f7]" : ""}
                    `}
                  >
                    {qa.q}
                  </button>

                  {openQuestions[`${section.id}-${index}`] && (
                    <div className="px-4 py-3 bg-gray-50 text-sm text-[#646263] rtl text-right">{qa.a}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

