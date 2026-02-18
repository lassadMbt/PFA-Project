/* components/Navbar.tsx */
import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Produits', href: '#produits' },
    { name: 'Services', href: '#services' },
    { name: 'À Propos', href: '#a-propos' },
    { name: 'Réalisations', href: '#realisations' },
    { name: 'Contact', href: '#contact' },
  ];

  const getPhoneHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-300 ${isScrolled || isOpen ? 'bg-blue-800 text-white group-hover:bg-orange-600' : 'bg-white text-blue-800 group-hover:bg-orange-500 group-hover:text-white'}`}>
              P
            </div>
            <span className={`font-heading font-extrabold text-2xl tracking-tighter transition-colors ${isScrolled || isOpen ? 'text-blue-900 group-hover:text-blue-950' : 'text-white group-hover:text-orange-400'}`}>
              PFA
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 ${isScrolled ? 'text-slate-700 hover:text-blue-900' : 'text-white hover:text-orange-400'}`}
              >
                {link.name}
              </a>
            ))}
            <a
              href={getPhoneHref(COMPANY_INFO.phones[0])}
              className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 border-2 shadow-md ${
                isScrolled 
                  ? 'bg-orange-500 border-orange-500 text-white hover:bg-blue-950 hover:border-blue-950' 
                  : 'bg-orange-500 border-orange-500 text-white hover:bg-white hover:text-orange-600 hover:border-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              Devis Gratuit
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                (isScrolled || isOpen) 
                  ? 'text-slate-900 hover:bg-slate-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-2xl absolute top-full left-0 right-0 py-8 border-t border-slate-100 animate-slide-down">
          <div className="flex flex-col items-center space-y-6 px-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-slate-800 hover:text-blue-900 transition-colors w-full text-center py-2"
              >
                {link.name}
              </a>
            ))}
            <a
              href={getPhoneHref(COMPANY_INFO.phones[0])}
              className="bg-orange-500 text-white border-2 border-orange-500 px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-blue-950 hover:border-blue-950 transition-all shadow-lg w-full max-w-xs"
            >
              <Phone className="w-5 h-5" />
              Appeler Maintenant
            </a>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
