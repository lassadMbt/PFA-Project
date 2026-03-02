/* components/FloatingCTA.tsx */

import React from 'react';
import { COMPANY_INFO } from '../constants';

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
      
      {/* Facebook */}
      <a 
        href="https://www.facebook.com/profile.php?id=100066608413088"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-white hover:text-blue-600 border-2 border-blue-600"
        title="Facebook"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8.1v-2.9h2.4V9.8c0-2.37 1.41-3.68 3.57-3.68 1.03 0 2.1.18 2.1.18v2.3h-1.18c-1.17 0-1.53.72-1.53 1.46v1.75h2.6l-.42 2.9h-2.18v7.05A10 10 0 0022 12z"/>
        </svg>
      </a>

      {/* Instagram */}
      /*<a 
        href="https://www.instagram.com/YOUR_INSTAGRAM_LINK"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-white hover:text-pink-500 border-2 border-pink-500"
        title="Instagram"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm4.25 5a5 5 0 100 10 5 5 0 000-10zm6.25-.88a1.12 1.12 0 11-2.25 0 1.12 1.12 0 012.25 0z"/>
        </svg>
      </a>
*/
      {/* TikTok */}
      <a 
        href={COMPANY_INFO.tiktokLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 hover:bg-white hover:text-black border-2 border-black"
        title="TikTok"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.023c1.108 0 2.164.194 3.141.549a1.002 1.002 0 01.597.917V5.55c0 .543-.431.989-.974.998-1.077.017-2.083-.243-2.977-.732V14.5c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c.404 0 .794.041 1.171.117a1.002 1.002 0 01.802.979v4.22c0 .53-.414.969-.942.993a2.03 2.03 0 00-.229-.013c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2V1a1 1 0 011-1h3.411z"/>
        </svg>
      </a>

    </div>
  );
};

export default FloatingCTA;