'use client'
import { MessageCircle } from 'lucide-react';

// WhatsApp Floating Button Component
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/message/WTD2CSAX37ZCE1', '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 md:bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default WhatsAppButton;