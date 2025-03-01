"use client"

import { useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import Hero from "@/components/sections/hero"
import ActionButtons from "@/components/sections/action-buttons"
import QueryInput from "@/components/sections/query-input"
import LocationLanguage from "@/components/sections/location-language"
import Footer from "@/components/sections/footer"

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState("")

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question)
  }

  return (
    <MainLayout>
      <Hero />
      <LocationLanguage />
      <ActionButtons onQuestionSelect={handleQuestionSelect} />
      <QueryInput defaultValue={selectedQuestion} />
      <Footer />
    </MainLayout>
  )
}

