/* components/FloatingCTA.tsx */
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const FloatingCTA: React.FC = () => {
  const getPhoneHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;
  const getWhatsAppHref = (phone: string) => `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      {/* Phone Button */}
      <a 
        href={getPhoneHref(COMPANY_INFO.phones[0])}
        className="w-14 h-14 bg-blue-800 text-white border-2 border-blue-800 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group hover:bg-white hover:text-blue-800"
        title="Appeler PFA"
      >
        <Phone className="w-6 h-6 group-hover:animate-shake" />
      </a>

      {/* WhatsApp Link */}
      <a 
        href={getWhatsAppHref(COMPANY_INFO.phones[1])}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white border-2 border-green-500 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group hover:bg-white hover:text-green-600"
        title="WhatsApp PFA"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default FloatingCTA;
