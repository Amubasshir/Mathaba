"use client"

import type React from "react"

import { Send, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface QueryInputProps {
  defaultValue?: string
}

export default function QueryInput({ defaultValue = "" }: QueryInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue)

  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Sending question:", inputValue)
      // You can add more functionality here like API calls
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="relative w-full mb-8">
      <div className="relative flex items-center">
        <div className="relative w-full rounded-xl border border-gray-200 p-1 pr-[30px]">
          <div className="relative flex items-center rounded-lg border border-gray-200">
            <div className="flex-1 px-4 pr-2 py-3">
              <div className="flex justify-end items-center gap-2 text-gray-600">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-[#6b6291]"
                  onClick={handleSend}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اسألني"
                  className="w-full text-right focus:outline-none"
                />
              </div>
              {/* <div className="border-b border-dotted border-gray-300 mt-1" /> */}
            </div>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute -right-0 top-1/2 -translate-y-1/2 h-10 w-8 text-gray-500 hover:text-gray-700"
        >
          <Mic className="h-6 w-6" />
          <span className="sr-only">Voice input</span>
        </Button>
      </div>
    </div>
  )
}

