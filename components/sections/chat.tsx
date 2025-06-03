"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { ThemeConfig } from "@/lib/themes";
import { Globe, GlobeLock, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Thread {
  id: string;
  messages: Message[];
  theme: ThemeConfig;
}

export default function Chat({
  setIsManualChat,
  theme,
}: {
  setIsManualChat: (isManualChat: boolean) => void;
  theme: ThemeConfig;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { dir, t, categories, language } = useLanguage();
  const [thinkingDots, setThinkingDots] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const lastStoredInteraction = useRef<{
    userInput: string;
    timestamp: number;
  } | null>(null);
  // Add typewriter effect states
  const [typingText, setTypingText] = useState("");
  const [fullText, setFullText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [textareaHeight, setTextareaHeight] = useState("24px");
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const pathname = usePathname();

  

  console.log({ isWebSearch });
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setIsFetchingSuggestions(true);
        const response = await fetch(
          `/api/suggestions?query=${encodeURIComponent(
            inputValue
          )}&language=${language}`
        );

        // if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        console.log("Suggestions data:", data);

        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [inputValue, language]);

  // Animate thinking dots
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setThinkingDots((prev) => {
          if (prev === "...") return "";
          return prev + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setThinkingDots("");
    }
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //  ! don't remove this, it will scroll to bottom when new message is added
  //   useEffect(() => {
  //     if(!selectedSuggestion){
  //         scrollToBottom();
  //     }
  //   }, [messages, typingText, selectedSuggestion]);

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

  // Initialize thread on component mount and when language changes
  useEffect(() => {
    // Clear existing messages when language changes
    setMessages([]);
    createThread();
  }, [language]); // Add language as a dependency

  // Add useEffect for getting location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );

          if (response.ok) {
            const data = await response.json();
            setUserLocation({
              city:
                data.address.city || data.address.town || data.address.village,
              country: data.address.country,
              countryCode: data.address.country_code?.toUpperCase(),
              region: data.address.state,
            });
          }
        } catch (error) {
          console.error("Error getting location:", error);
        }
      });
    }
  }, []);

  // Initialize userId on component mount
  useEffect(() => {
    const targetP = pathname.split('/')[1] || "home";
    let storedUserId = localStorage.getItem("userId");
    let storedTarget = localStorage.getItem(targetP);

    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    // Check if we need to call the API
    if (!storedTarget) {
      const checkAndSaveTargetedUser = async () => {
        try {
          const response = await fetch("/api/targeted-users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid: storedUserId,
              target: targetP,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Save to localStorage regardless of whether user existed or was newly created
            localStorage.setItem(targetP, storedUserId);
          }
        } catch (error) {
          console.error("Error checking/saving targeted user:", error);
        }
      };

      checkAndSaveTargetedUser();
    }
  }, [pathname]);

 

  const handleSelectSuggestion = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
    setInputValue("");

    let fastMessage = [
      {
        role: "user",
        content: suggestion?.[`questions_${language}`] as string,
      },
      {
        role: "assistant",
        content: suggestion?.[`answers_${language}`] as string,
        ref: suggestion?.Ref,
        url: suggestion?.URL,
      },
    ];

    setMessages((prev) => {
      let newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages = [...newMessages, ...fastMessage];
      }
      return newMessages;
    });
  };

  const createThread = async () => {
    try {
      const response = await fetch(`/api/chat/thread?language=${language}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create thread");
      }

      const data = await response.json();
      setThreadId(data.threadId);

      // Add the greeting message if it exists
      if (data.greeting) {
        setMessages([
          {
            role: "assistant",
            content: data.greeting,
          },
        ]);
      }

      return data.threadId;
    } catch (err) {
      setError("Failed to initialize chat");
      return null;
    }
  };

  const moderateMessage = async (content: string) => {
    try {
      const response = await fetch("/api/chat/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: content }),
      });

      if (!response.ok) {
        throw new Error("Moderation request failed");
      }

      const data = await response.json();
      return data.flagged;
    } catch (err) {
      setError("Message moderation failed");
      return true;
    }
  };

  const sendMessage = async (content: string) => {
    // const selectedAssistantId = process.env.
    let searchAssistantId = "";
    if (isWebSearch) {
      searchAssistantId = process.env
        .NEXT_PUBLIC_WEB_SEARCH_ASSISTANT_ID as string;
    } else {
      searchAssistantId = process.env
        .NEXT_PUBLIC_NORMAL_SEARCH_ASSISTANT_ID as string;
    }
    if (!searchAssistantId) return;

    try {
      let newThreadId = threadId;
      if (!newThreadId) {
        newThreadId = await createThread();
        setThreadId(newThreadId);
        if (!newThreadId) {
          throw new Error("Failed to create chat thread");
        }
      }

      setIsStarted(true);
      // Add retry logic for network issues
      let retries = 2;
      let response;
      let error;

      while (retries >= 0) {
        try {
          response = await fetch("/api/chat/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              threadId: newThreadId,
              content,
              assistantId: searchAssistantId,
              language,
              location: userLocation,
              userId: userId,
            }),
          });

          if (response.ok) {
            break;
          }

          // If response is not ok, get error details
          const errorData = await response.json().catch(() => ({}));
          error = new Error(
            errorData.error || `Server responded with status ${response.status}`
          );
        } catch (e) {
          error = e;
        }

        retries--;
        if (retries >= 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, (2 - retries) * 1000)
          );
        }
      }

      if (!response?.ok) {
        throw error || new Error("Failed to send message after retries");
      }

      const data = await response.json();

      // If the response includes a tool call
      if (data.toolCalls && data.toolCalls.length > 0) {
        const toolCall = data.toolCalls[0];
        if (toolCall.function.name === "search_web") {
          const searchQuery = JSON.parse(toolCall.function.arguments).query;

          // Make the web search request
          const searchResponse = await fetch("/api/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: searchQuery }),
          });

          if (!searchResponse.ok) {
            throw new Error("Failed to perform web search");
          }

          const searchResults = await searchResponse.json();

          // Send the search results back to continue the conversation
          const finalResponse = await fetch("/api/chat/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              threadId: newThreadId,
              content: JSON.stringify(searchResults),
              assistantId: searchAssistantId,
              toolCallId: toolCall.id,
              searchMode: isWebSearch ? "search_web" : "search_normal",
            }),
          });

          if (!finalResponse.ok) {
            const errorData = await finalResponse.json().catch(() => ({}));
            throw new Error(
              errorData.error || "Failed to process search results"
            );
          }

          const finalData = await finalResponse.json();
          return finalData.message;
        }
      }
      setIsStarted(false);
      return data.message;
    } catch (err) {
      setIsStarted(false);
      console.error("Error in sendMessage:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      return null;
    }
  };

  const streamText = (text: string) => {
    // Remove ** characters and source references from the text
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\[source'\d+:\d+\]/g, "")
      .replace(/\【source'\d+:\d+\】/g, "")
      .replace(/\(source'\d+:\d+\)/g, "")
      .trim();

    setIsStreaming(true);
    setStreamingText("");
    let index = 0;

    const streamInterval = setInterval(() => {
      if (index < cleanText.length) {
        setStreamingText(cleanText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(streamInterval);
        setIsStreaming(false);
        // Update the last message with complete text
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = cleanText;
          }
          return newMessages;
        });
      }
    }, 30);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    setInputValue("");
    setError(null);

    // Check moderation
    const isFlagged = await moderateMessage(content);
    if (isFlagged) {
      setError("This message contains inappropriate content");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsLoading(true);

    // Add temporary "thinking" message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: t("thinking") || "thinking" },
    ]);

    // Get assistant response
    const response = await sendMessage(content);

    // Remove thinking message and start streaming
    setMessages((prev) => {
      const newMessages = prev.slice(0, -1);
      if (response) {
        newMessages.push({ role: "assistant", content: "" }); // Empty content initially
        streamText(response); // Remove content parameter since we don't need it anymore
      } else {
        newMessages.push({
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        });
      }
      return newMessages;
    });

    setIsLoading(false);
  };

  // Modify handleCategoryQuestionSelect to store interactions
  const handleCategoryQuestionSelect = (question: string, answer: string) => {
    if (isLoading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    // Add temporary "thinking" message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: t("thinking") || "thinking" },
    ]);

    // Simulate API delay then stream
    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        newMessages.push({ role: "assistant", content: "" });
        return newMessages;
      });
      streamText(answer); // Pass question as user input
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value) {
      setIsManualChat(true);
    }
    setInputValue(e.target.value);
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = "auto";
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

  const linkifyText = (text: string) => {
    // Updated URL regex pattern to better handle URLs with parentheses
    const urlPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|https?:\/\/[^\s)]+/g;

    // Split text by URLs and map each part
    return text
      .split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/)
      .map((part, index) => {
        // Check if it's a markdown link [text](url)
        const markdownMatch = part.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
        if (markdownMatch) {
          const [_, text, url] = markdownMatch;
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {text}
            </a>
          );
        }

        // Check if it's a plain URL
        if (part.match(/^https?:\/\/[^\s)]+$/)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {part}
            </a>
          );
        }

        return <span key={index}>{part}</span>;
      });
  };

  return (
    <div
      className={`flex flex-col w-full max-w-3xl mx-auto ${
        messages.length > 0 ? "bg-transparent" : ""
      }`}
    >
      {/* Messages Container */}
      {messages.length > 0 && (
        <div
          className="flex-1 p-6 space-y-6 h-full max-h-[50vh] overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400
        scrollbar-thumb-rounded bg-gray-50"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-[20px] ${
                  message.role === "user"
                    ? "bg-[#6b6291] text-white"
                    : "bg-white shadow-sm"
                } ${
                  index === messages.length - 1 &&
                  message.role === "assistant" &&
                  message.content === "thinking"
                    ? "w-[60px]"
                    : index === messages.length - 1 &&
                      message.role === "assistant" &&
                      isStreaming
                    ? "w-[500px]"
                    : ""
                }`}
                dir={dir}
              >
                {index === messages.length - 1 &&
                message.role === "assistant" &&
                message.content === "thinking" ? (
                  <div className="w-[32px] h-[20px] flex items-center justify-center mx-auto">
                    <span className="inline-block min-w-[32px] text-center">
                      {thinkingDots}
                    </span>
                  </div>
                ) : (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {index === messages.length - 1 &&
                    message.role === "assistant" &&
                    isStreaming
                      ? linkifyText(streamingText)
                      : linkifyText(message.content)}
                  </p>
                )}

                {message.role === "assistant" && <br />}
                <div className="flex flex-col gap-2 -mt-3">
                  {/* {message?.url && (
                    <Link href={message?.url} target="_blank">
                      {" "}
                      <span className=" bg-gray-200 text-blue-700 text-xs px-2 rounded-lg py-1 inline-flex items-center gap-1 underline">
                        Url: {message?.url}
                      </span>
                    </Link>
                  )} */}
                  {message?.ref && message?.url && (
                    <Link
                      href={message?.url ? message.url : "#"}
                      target="_blank"
                    >
                      {" "}
                      <span className=" bg-gray-200 text-blue-700 text-xs px-2 rounded-lg py-1 inline-flex items-center gap-1 underline">
                        Ref: {message?.ref}
                      </span>
                    </Link>
                  )}
                  {message?.ref && !message?.url && (
                    <span className=" bg-gray-200  text-xs px-2 rounded-lg py-1 inline-flex items-center gap-1">
                      Ref: {message?.ref}
                    </span>
                  )}
                  {/* {message?.ref && (
                    <span className=" bg-gray-200 text-gray-700 text-xs px-2 rounded-lg inline-flex items-center gap-1 py-1">
                      Ref: {message?.ref}
                    </span>
                  )} */}
                  {!isStarted &&
                    message.role === "assistant" &&
                    language !== "ar" && (
                      <span className=" text-gray-700 text-xs pr-2 py-0.5 rounded-full inline-flex items-center gap-1 italic">
                        <Sparkles className="h-4 w-4 text-theme-gold" /> Al
                        translation from official Arabic source.
                      </span>
                    )}
                </div>
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
      <div className="sticky bottom-0 z-10 bg-white">
        <div className="relative flex items-center p-0 py-4">
          {/* {suggestions?.length > 0 && (
            <div className="max-h-44 overflow-hidden overflow-y-auto bg-white shadow-sm w-full absolute bottom-20 rounded-xl p-2">
              <ul>
                {suggestions?.map((suggestion) => (
                  <li
                    key={suggestion?.id}
                    className="cursor-pointer text-black hover:bg-gray-100 p-2 rounded"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion?.questions_en}
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          <div className="relative w-full rounded-xl">
            {/* <div className="relative flex items-center rounded-lg border border-gray-200"> */}
            <div
              className="flex-1 px-4 py-3 rounded-[24px] bg-white"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.05) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.05) 0px 18px 36px -18px inset, rgba(50, 50, 93, 0.05) 0px 10px 10px -7px",
              }}
            >
              <div
                className={`flex ${
                  dir === "rtl" ? "flex-row-reverse" : "flex-row"
                } items-center gap-2 text-gray-600`}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 ${
                    isWebSearch ? "text-blue-600" : "text-[#6b6291]"
                  } hover:text-[#6b6291]`}
                  onClick={() => setIsWebSearch(!isWebSearch)}
                  //   disabled={isLoading || !inputValue.trim()}
                >
                  {/* <Send className="h-5 w-5" /> */}
                  {!isWebSearch ? (
                    <GlobeLock className="h-6 w-6" />
                  ) : (
                    <Globe className="h-6 w-6" />
                  )}
                  {/* <span className="sr-only">Send</span> */}
                </Button>
                <textarea
                  value={inputValue}
                  onChange={handleTextareaInput}
                  onKeyPress={handleKeyPress}
                  placeholder={t("ask.me")}
                  className="w-full focus:outline-none resize-none overflow-hidden
                      scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400
                      scrollbar-thumb-rounded-full bg-transparent"
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

              {/* suggestions */}
              {suggestions?.length > 0 && (
                <div className="max-h-44 overflow-hidden overflow-y-auto bg-white w-full border-t-2 pt-2 mt-3">
                  <ul>
                    {suggestions?.map((suggestion) => (
                      <li
                        key={suggestion?.id}
                        className="cursor-pointer text-[#646263] hover:bg-gray-100 p-2 rounded"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion?.[`questions_${language}`]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
