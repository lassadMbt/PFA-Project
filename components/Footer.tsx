/* components/Footer.tsx */
import React from 'react';
import { COMPANY_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center font-bold text-xl text-white group-hover:bg-orange-500 transition-colors">
                P
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tighter text-white group-hover:text-orange-500 transition-colors">
                PFA
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Expertise premium en installation de fermetures automatiques. Solutions sur-mesure pour commerces et résidences en Tunisie.
            </p>
            <div className="flex gap-4">
              <a 
                href={COMPANY_INFO.tiktokLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:bg-white hover:text-blue-950 transition-all"
                aria-label="TikTok"
              >
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.023c1.108 0 2.164.194 3.141.549a1.002 1.002 0 01.597.917V5.55c0 .543-.431.989-.974.998-1.077.017-2.083-.243-2.977-.732V14.5c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c.404 0 .794.041 1.171.117a1.002 1.002 0 01.802.979v4.22c0 .53-.414.969-.942.993a2.03 2.03 0 00-.229-.013c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2V1a1 1 0 011-1h3.411z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm border-b border-orange-500/30 pb-2 inline-block">Liens Rapides</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#accueil" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Accueil</a></li>
              <li><a href="#produits" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Produits</a></li>
              <li><a href="#services" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Services</a></li>
              <li><a href="#realisations" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Réalisations</a></li>
              <li><a href="#contact" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm border-b border-orange-500/30 pb-2 inline-block">Nos Produits</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#produits" className="hover:text-orange-500 transition-colors">Rideaux Métalliques Luxe</a></li>
              <li><a href="#produits" className="hover:text-orange-500 transition-colors">Stores Bras Invisible</a></li>
              <li><a href="#produits" className="hover:text-orange-500 transition-colors">Motorisation Italienne</a></li>
              <li><a href="#produits" className="hover:text-orange-500 transition-colors">Solutions de Sécurité</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm border-b border-orange-500/30 pb-2 inline-block">Horaires</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span className="text-white">08:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi</span>
                <span className="text-white">08:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Dimanche</span>
                <span className="text-orange-500 font-bold uppercase text-[10px] bg-orange-500/10 px-2 py-0.5 rounded">Urgence</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 {COMPANY_INFO.name}. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
