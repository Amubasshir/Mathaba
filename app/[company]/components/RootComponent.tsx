"use client";

import MainLayout from "@/components/layouts/main-layout";
import ActionButtons from "@/components/sections/action-buttons";
import Chat from "@/components/sections/chat";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import LocationLanguage from "@/components/sections/location-language";
import { getTheme, ThemeConfig } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// interface PageProps {
//   params: { theme: string };
// }
interface PageProps {
  theme: ThemeConfig;
}

export default function RootComponent({ theme }: PageProps) {
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [isManualChat, setIsManualChat] = useState(false);

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
  };

//   const theme = getTheme(params.theme);
    console.log(theme, "theme from root component", theme.colorContainer);
    useEffect(()=> {
        // Get the document body element
        const body = document.body;
        // Apply the background color from theme
        // body.style.backgroundColor = theme.colorContainer;
        body.classList.add(theme.colorContainer as string);
        // let bodyContainer = document.get
        console.log(body)
    }, [theme.colorContainer])

  return (
    <MainLayout>
        {/* <div className={`flex w-full h-full flex-col ${theme.colorContainer}`}> */}

      <Hero theme={theme} />
      <LocationLanguage />
      <ActionButtons
        onQuestionSelect={handleQuestionSelect}
        isManualChat={isManualChat}
        setIsManualChat={setIsManualChat}
        />
      <Chat setIsManualChat={setIsManualChat} />
      <Footer />
        {/* </div> */}
    </MainLayout>
  );
}
