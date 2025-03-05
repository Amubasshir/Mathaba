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
  const { dir, t, categories, language } = useLanguage();
  const [thinkingDots, setThinkingDots] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // Add typewriter effect states
  const [typingText, setTypingText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);

  const [textareaHeight, setTextareaHeight] = useState('24px');

  // Animate thinking dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setThinkingDots((prev) => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setThinkingDots('');
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // Typewriter effect
  useEffect(() => {
    if (isTyping && typingText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypingText(fullText.slice(0, typingText.length + 1));
      }, 15); // Speed of typing
      return () => clearTimeout(timeout);
    } else if (isTyping && typingText.length === fullText.length) {
      setIsTyping(false);

      // Update the message with the full text when typing is complete
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && currentTypingIndex >= 0) {
          newMessages[currentTypingIndex].content = fullText;
        }
        return newMessages;
      });
      setCurrentTypingIndex(-1);
    }
  }, [typingText, fullText, isTyping, currentTypingIndex]);

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
      let newThreadId = threadId;
      if (!newThreadId) {
        newThreadId = await createThread();
        setThreadId(newThreadId);
        if (!newThreadId) return;
      }

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: newThreadId,
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

  const streamText = (text: string) => {
    setIsStreaming(true);
    setStreamingText('');
    let index = 0;

    const streamInterval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        // Update the last message with complete text
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = text;
          }
          return newMessages;
        });
      }
    }, 30); // Adjust speed as needed
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
      { role: 'assistant', content: t('thinking') || 'thinking' },
    ]);

    // Get assistant response
    const response = await sendMessage(content);

    // Remove thinking message and start streaming
    setMessages((prev) => {
      const newMessages = prev.slice(0, -1);
      if (response) {
        newMessages.push({ role: 'assistant', content: '' }); // Empty content initially
        streamText(response); // Start streaming the response
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

  // Modify handleCategoryQuestionSelect to use streaming
  const handleCategoryQuestionSelect = (question: string, answer: string) => {
    if (isLoading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    // Add temporary "thinking" message
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: t('thinking') || 'thinking' },
    ]);

    // Simulate API delay then stream
    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        newMessages.push({ role: 'assistant', content: '' });
        return newMessages;
      });
      streamText(answer);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto';
    // Set new height based on scrollHeight, with a maximum of 120px
    const newHeight = Math.min(e.target.scrollHeight, 120);
    e.target.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  };

  // Make the function available globally for other components
  useEffect(() => {
    // @ts-ignore - Adding to window for global access
    window.handleCategoryQuestionSelect = handleCategoryQuestionSelect;
  }, []);

  return (
    <div
      className={`flex flex-col w-full max-w-3xl mx-auto ${
        messages.length > 0 ? 'bg-gray-50' : ''
      }`}
    >
      {/* Messages Container */}
      {messages.length > 0 && (
        <div
          className="flex-1 p-6 space-y-6 overflow-y-auto min-h-[400px]
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
                } ${
                  index === messages.length - 1 &&
                  message.role === 'assistant' &&
                  message.content === 'thinking'
                    ? 'w-[120px]'
                    : index === messages.length - 1 &&
                      message.role === 'assistant' &&
                      isStreaming
                    ? 'w-[500px]'
                    : ''
                }`}
                dir={dir}
              >
                {index === messages.length - 1 &&
                message.role === 'assistant' &&
                message.content === 'thinking' ? (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap min-w-[85px]">
                    thinking{thinkingDots}
                  </p>
                ) : (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {index === messages.length - 1 &&
                    message.role === 'assistant' &&
                    isStreaming
                      ? streamingText
                      : message.content}
                  </p>
                )}
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
                    onChange={handleTextareaInput}
                    onKeyPress={handleKeyPress}
                    placeholder={t('ask.me')}
                    className="w-full focus:outline-none resize-none overflow-hidden
                      scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400
                      scrollbar-thumb-rounded-full"
                    style={{ height: textareaHeight }}
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
