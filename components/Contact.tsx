/* components/Contact.tsx */ 

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    project: 'Rideau métallique',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci ! Votre demande a été envoyée. Nous vous contacterons sous peu.');
    setFormData({ name: '', phone: '', email: '', project: 'Rideau métallique', message: '' });
  };

  const getPhoneHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-4">Contactez-nous</h2>
          <h3 className="text-4xl font-heading font-extrabold text-white mb-8">
            Un Projet ? Parlons-en !
          </h3>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center shrink-0 border border-blue-700/50 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-lg mb-1">Notre Adresse</h5>
                <p className="text-slate-400 group-hover:text-white transition-colors">{COMPANY_INFO.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center shrink-0 border border-blue-700/50 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-lg mb-1">Téléphones</h5>
                {COMPANY_INFO.phones.map((tel, i) => (
                  <a key={i} href={getPhoneHref(tel)} className="block text-slate-400 hover:text-orange-500 transition-colors font-semibold">
                    {tel}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 rounded-full bg-blue-800/50 flex items-center justify-center shrink-0 border border-blue-700/50 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-lg mb-1">Email</h5>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-400 hover:text-orange-500 transition-colors font-semibold">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden h-64 shadow-2xl grayscale hover:grayscale-0 transition-all border border-white/10">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.956740682285!2d10.190696!3d36.861759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd352697b0032b%3A0x6a2c589b3f46a29!2sBoulevard%20de%20l&#39;Environnement%2C%20Ariana!5e0!3m2!1sen!2stn!4v1715000000000!5m2!1sen!2stn" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy"
              title="PFA Location"
            ></iframe>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 text-slate-900 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
          <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Devis Gratuit en 24h
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          </h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nom Complet</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all focus:bg-white"
                  placeholder="Ex: Ahmed Ben Salah"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Téléphone</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all focus:bg-white"
                  placeholder="Ex: 46 985 975"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Type de Projet</label>
              <select 
                value={formData.project}
                onChange={(e) => setFormData({...formData, project: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all focus:bg-white"
              >
                <option>Rideau métallique</option>
                <option>Store à bras invisible</option>
                <option>Automatisation de porte existante</option>
                <option>Maintenance / SAV</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Message</label>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all focus:bg-white"
                placeholder="Décrivez brièvement votre besoin..."
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white border-2 border-orange-500 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl hover:bg-white hover:text-blue-950 hover:border-white"
            >
              Envoyer ma demande
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
