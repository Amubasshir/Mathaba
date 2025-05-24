'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';

interface FAQQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export default function FAQQuestions({ onQuestionSelect }: FAQQuestionsProps) {
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
          window.handleCategoryQuestionSelect(
            value,
            selectedQuestion.answer[language]
          );
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
          // Override the default behavior of showing selected value
          // By forcing it to always use an empty value
          value=""
        >
          <SelectTrigger className="w-full border-[#6b6291]/20 border-none rounded-full" dir={dir} style={{boxShadow: "rgba(50, 50, 93, 0.05) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.05) 0px 18px 36px -18px inset, rgba(50, 50, 93, 0.05) 0px 10px 10px -7px"}}>
            <SelectValue
              placeholder={
                category.category.name[language] || category.category.name.en
              }
              className="block w-full"
            />
          </SelectTrigger>
          <SelectContent dir={dir} className='max-w-[350px] md:max-w-[420px] mx-auto'>
            {category.category.questions.map((item: any, index: number) => (
              <SelectItem
                key={index}
                value={item.question[language] || item.question.en}
                className="w-full px-2 text-wrap"
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
  );
}

// 'use client';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useLanguage } from '@/contexts/language-context';

// // FAQ data structure
// const faqCategories = [
//   {
//     id: 'umrah',
//     title: 'الأسئلة المتكررة عن مناسك العمرة',
//     questions: [
//       'ما هي أركان العمرة؟',
//       'ما هي المواقيت الزمانية للعمرة؟',
//       'ما هي سنن الإحرام؟',
//       'كيف أؤدي العمرة؟',
//     ],
//   },
//   {
//     id: 'mina',
//     title: 'الأسئلة المتكررة عن منابة',
//     questions: [
//       'ما هو وادي منى؟',
//       'متى يذهب الحجاج إلى منى؟',
//       'ما هي أعمال منى؟',
//       'كم يوم يقضي الحجاج في منى؟',
//     ],
//   },
//   {
//     id: 'mecca',
//     title: 'الأسئلة المتكررة عن مكة المكرمة',
//     questions: [
//       'ما هي حدود الحرم المكي؟',
//       'ما هي أبرز المعالم في مكة المكرمة؟',
//       'ما هو فضل الصلاة في المسجد الحرام؟',
//       'ما هي آداب دخول مكة المكرمة؟',
//     ],
//   },
//   {
//     id: 'medina',
//     title: 'الأسئلة المتكررة عن المدينة المنورة',
//     questions: [
//       'ما هي أبرز المساجد في المدينة المنورة؟',
//       'ما هي البقيع؟',
//       'ما فضل الصلاة في المسجد النبوي؟',
//       'ما هي آداب زيارة المسجد النبوي؟',
//     ],
//   },
// ];

// interface FAQQuestionsProps {
//   onQuestionSelect: (question: string) => void;
// }

// export default function FAQQuestions({ onQuestionSelect }: FAQQuestionsProps) {
//   const { dir, categories, language } = useLanguage();

//   const handleQuestionSelect = (value: string) => {
//     // Find the selected question across all categories
//     for (const category of categories) {
//       const selectedQuestion = category.category.questions.find(
//         (item: any) => item.question[language] === value
//       );
//       if (selectedQuestion) {
//         // Use the global function to handle the question and answer
//         // @ts-ignore - Using window method
//         if (window.handleCategoryQuestionSelect) {
//           window.handleCategoryQuestionSelect(
//             value,
//             selectedQuestion.answer[language]
//           );
//         }
//         break;
//       }
//     }
//   };

//   return (
//     <>
//       {categories.map((category: any) => (
//         <Select key={category.id} onValueChange={handleQuestionSelect}>
//           <SelectTrigger className="w-full border-[#6b6291]/20 border-none rounded-full" dir={dir} style={{boxShadow: "rgba(50, 50, 93, 0.05) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.05) 0px 18px 36px -18px inset, rgba(50, 50, 93, 0.05) 0px 10px 10px -7px"}}>
//             <SelectValue
//               placeholder={
//                 category.category.name[language] || category.category.name.en
//               }
//               className="block w-full"
//             />
//           </SelectTrigger>
//           <SelectContent dir={dir}>
//             {category.category.questions.map((item: any, index: number) => (
//               <SelectItem
//                 key={index}
//                 // value='a'
//                 value={item.question[language] || item.question.en}
//                 className="w-full"
//                 dir={dir}
//               >
//                 <span className="block w-full">
//                   {item.question[language] || item.question.en}
//                 </span>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       ))}
//     </>
//   );
// }
