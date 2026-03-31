/* components/Hero.tsx */
import React from 'react';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { supabase } from "../lib/supabase";
import { useEffect } from 'react';


const Hero: React.FC = () => {


  useEffect(() => {
    supabase
      .rpc("increment_visits")
      .then(({ error }) => console.log("Visit tracked, error:", error)); // ← is this here?
  }, []);


  return (
    <div className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
        style={{ backgroundImage: 'url("images/bg-image.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            Expertise Premium en Tunisie
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight">
            L'Excellence en <span className="text-blue-400">Automatisation</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed font-light">
            Portes, rideaux métalliques et stores haut de gamme. Design italien, robustesse tunisienne.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#produits"
              className="bg-blue-600 text-white border-2 border-blue-600 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all group hover:bg-white hover:text-blue-600 hover:border-white shadow-xl"
            >
              Nos Produits
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/40 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-white hover:text-gray-800 hover:border-white shadow-lg"
            >
              Demander un Devis
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">
            <div className="hover:translate-y-[-4px] transition-transform duration-300">
              <div className="text-3xl font-bold text-white-400">4+</div>
              <div className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Ans d'Expérience</div>
            </div>
            <div className="hover:translate-y-[-4px] transition-transform duration-300">
              <div className="text-3xl font-bold text-white-400">1000+</div>
              <div className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Projets Réalisés</div>
            </div>
            <div className="hidden md:block hover:translate-y-[-4px] transition-transform duration-300">
              <div className="text-3xl font-bold text-white-400">3 Ans</div>
              <div className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Garantie Moteur</div>
            </div>
          </div>
        </div>
      </div>

      <a href="#produits" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity p-2">
        <ArrowDown className="w-8 h-8" />
      </a>
    </div>
  );
};

export default Hero;

