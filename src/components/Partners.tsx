// src/components/Partners.tsx

import React, { useRef } from 'react';
import { usePartners } from '../lib/useContent';

const Partners: React.FC = () => {
  const { partners, loading } = usePartners();
  const trackRef = useRef<HTMLDivElement>(null);

if (loading) return null;
if (partners.length === 0) return null;  // only hide if truly no partners in DB

  // Duplicate list for seamless infinite scroll
  const items = [...partners, ...partners];

  return (
    <div className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-gray-600 font-bold uppercase tracking-widest text-sm mb-2">
          Nos Partenaires
        </h2>
        <h3 className="text-3xl font-extrabold text-slate-900">
          Des Marques de Confiance
        </h3>
        <div className="w-16 h-1.5 bg-gray-500 mx-auto mt-4" />
      </div>

      {/* Scrolling strip */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-12 animate-marquee"
          style={{ width: 'max-content' }}
        >
          {items.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex flex-col items-center justify-center gap-3 w-40 shrink-0 group"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="h-16 w-32 bg-slate-100 rounded-xl flex items-center justify-center">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {partner.name}
                  </span>
                </div>
              )}
              <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Partners;