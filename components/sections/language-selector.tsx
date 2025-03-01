"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "tr", name: "Türkçe" },
  { code: "hi", name: "हिंदी" },
  { code: "sw", name: "Kiswahili" },
  { code: "bn", name: "বাংলা" },
  { code: "fa", name: "فارسی" },
  { code: "en", name: "English" },
  { code: "ur", name: "اردو" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "ms", name: "Malay" },
];

export default function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState("ar");

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Globe className="h-4 w-4 flex-shrink-0" />
          <Button
            variant="custom"
            className="flex-1 max-w-[160px] bg-[#c8ad0d] hover:bg-[#c8ad0d]/90 text-white"
          >
            <div className="flex items-center justify-center gap-2 rtl">
              <span className="text-sm">العربية</span>
            </div>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Select Your Language
          </DialogTitle>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </DialogHeader>
        <div className="p-6 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    selectedLang === lang.code
                      ? "bg-[#6b6291] text-white"
                      : "bg-[#e6f7f7] text-[#646263] hover:bg-[#c8ad0d]/20"
                  }
                  ${["ar", "fa", "ur"].includes(lang.code) ? "rtl" : "ltr"}
                `}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
