

'use client';

import MainLayout from '@/components/layouts/main-layout';
import ActionButtons from '@/components/sections/action-buttons';
import Chat from '@/components/sections/chat';
import Footer from '@/components/sections/footer';
import Hero from '@/components/sections/hero';
import LocationLanguage from '@/components/sections/location-language';
import { useState } from 'react';

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [isManualChat, setIsManualChat] = useState(false);

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
  };

  return (
    <MainLayout>
      <Hero theme={null} />
      <LocationLanguage />
      <ActionButtons onQuestionSelect={handleQuestionSelect} isManualChat={isManualChat} setIsManualChat={setIsManualChat} />
      <Chat setIsManualChat={setIsManualChat} />
      <Footer />
    </MainLayout>
  );
}
