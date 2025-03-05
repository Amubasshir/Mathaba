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

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
  };

  return (
    <MainLayout>
      <Hero />
      <LocationLanguage />
      <ActionButtons onQuestionSelect={handleQuestionSelect} />
      <Chat />
      <Footer />
    </MainLayout>
  );
}
