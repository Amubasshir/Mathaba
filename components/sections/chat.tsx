'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Thread {
  id: string;
  messages: Message[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { dir, t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createThread = async () => {
    try {
      const response = await fetch('/api/chat/thread', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create thread');
      }

      const data = await response.json();
      setThreadId(data.threadId);
      return data.threadId;
    } catch (err) {
      setError('Failed to initialize chat');
      return null;
    }
  };

  const moderateMessage = async (content: string) => {
    try {
      const response = await fetch('/api/chat/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: content }),
      });

      if (!response.ok) {
        throw new Error('Moderation request failed');
      }

      const data = await response.json();
      return data.flagged;
    } catch (err) {
      setError('Message moderation failed');
      return true;
    }
  };

  const sendMessage = async (content: string) => {
    try {
      if (!threadId) {
        const newThreadId = await createThread();
        if (!newThreadId) return;
      }

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          content,
          assistantId: 'asst_6JH9SIKjfPQrfApGdC0am63k',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      setError('Failed to send message');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    setInputValue('');
    setError(null);

    // Check moderation
    const isFlagged = await moderateMessage(content);
    if (isFlagged) {
      setError('This message contains inappropriate content');
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    // Add temporary "thinking" message
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: 'Thinking...' },
    ]);

    // Get assistant response
    const response = await sendMessage(content);

    // Remove "thinking" message and add actual response
    setMessages((prev) => {
      const newMessages = prev.slice(0, -1); // Remove thinking message
      if (response) {
        newMessages.push({ role: 'assistant', content: response });
      } else {
        newMessages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        });
      }
      return newMessages;
    });

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-gray-50 min-h-[600px]">
      {/* Messages Container */}
      {messages.length > 0 && (
        <div
          className="flex-1 p-6 space-y-6 overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400
        scrollbar-thumb-rounded"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-[20px] ${
                  message.role === 'user'
                    ? 'bg-[#6b6291] text-white'
                    : 'bg-white shadow-sm'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 border-t border-red-200">
          {error}
        </div>
      )}

      {/* Input Container */}
      <div className="bg-white border-t sticky bottom-0 z-10">
        <div className="relative flex items-center p-4">
          <div className="relative w-full rounded-xl border border-gray-200 p-1">
            <div className="relative flex items-center rounded-lg border border-gray-200">
              <div className="flex-1 px-4 py-3">
                <div
                  className={`flex ${
                    dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'
                  } items-center gap-2 text-gray-600`}
                >
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('ask.me')}
                    className="w-full focus:outline-none resize-none max-h-[120px] min-h-[24px] overflow-y-auto
                      scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400
                      scrollbar-thumb-rounded-full"
                    dir={dir}
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-[#6b6291]"
                    onClick={handleSubmit}
                    disabled={isLoading || !inputValue.trim()}
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
    </div>
  );
}
