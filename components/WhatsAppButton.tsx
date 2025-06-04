'use client'
import { MessageCircle } from 'lucide-react';
import wpIcon from '../public/whatsapp-custom.svg';
// WhatsApp Floating Button Component
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/message/WTD2CSAX37ZCE1', '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
    //   className="fixed bottom-20 md:bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
      className="fixed bottom-20 md:bottom-6 right-6 text-white rounded-full p-2 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contact us on WhatsApp"
    >
      {/* <MessageCircle size={28} /> */}
      <img className='h-6 md:h-8 w-6 md:w-8' src={wpIcon.src} alt="" />
    </button>
  );
};

export default WhatsAppButton;