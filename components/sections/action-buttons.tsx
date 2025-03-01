"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FAQQuestions from "./faq-questions";

interface ActionButtonsProps {
  onQuestionSelect: (question: string) => void;
}

export default function ActionButtons({
  onQuestionSelect,
}: ActionButtonsProps) {
  const [showFAQ, setShowFAQ] = useState(false);
  const [showRedirectButtons, setShowRedirectButtons] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <div>
        <Button
          variant="primary"
          className="bg-[#6b6291] hover:bg-[#6b6291]/90 text-white py-6 w-full rounded-[12px]"
          onClick={() => setShowFAQ(!showFAQ)}
        >
          الأسئلة المتكررة
        </Button>

        {showFAQ && (
          <div className="mt-4 space-y-3">
            <FAQQuestions onQuestionSelect={onQuestionSelect} />
          </div>
        )}
      </div>

      <div>
        <Button
          variant="primary"
          className="bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white py-6 rounded-[12px]"
          onClick={() => setShowRedirectButtons(!showRedirectButtons)}
        >
          الأدلة التوعوية
        </Button>
        {showRedirectButtons && (
          <div className="mt-4 space-y-3">
            {Array(4).fill(0).map((item, index)=>(<Button
              variant="primary"
              className="border-2 border-[#c8ad0d] text-black py-6 rounded-[12px]"
              onClick={() => setShowRedirectButtons(!showFAQ)}
            >
              الأدلة التوعوية
            </Button>))}
          </div>
        )}
      </div>
    </div>
  );
}
