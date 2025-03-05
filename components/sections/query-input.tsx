'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Send } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface QueryInputProps {
  defaultValue?: string;
}

export default function QueryInput({ defaultValue = '' }: QueryInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const { dir, t } = useLanguage();

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Sending question:', inputValue);
      // You can add more functionality here like API calls
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="relative w-full mb-8">
      <div className="relative flex items-center">
        <div className="relative w-full rounded-xl border border-gray-200 p-1">
          <div className="relative flex items-center rounded-lg border border-gray-200">
            <div className="flex-1 px-4 py-3">
              <div
                className={`flex ${
                  dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'
                } items-center gap-2 text-gray-600`}
              >
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ask.me')}
                  className="w-full focus:outline-none"
                  dir={dir}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-[#6b6291]"
                  onClick={handleSend}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
