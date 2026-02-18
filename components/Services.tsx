/* components/Services.tsx */
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-1">
          <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-4">Notre Accompagnement</h2>
          <h3 className="text-4xl font-heading font-extrabold text-blue-950 mb-6 leading-tight">
            Des Services Clés en Main pour Votre Tranquillité
          </h3>
          <p className="text-slate-600 mb-8 text-lg">
            De la conception à la maintenance, PFA s'engage à fournir une prestation d'excellence pour tous vos projets d'automatisation.
          </p>
          <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-900 text-white flex items-center justify-center rounded-full font-bold">24</div>
            <p className="text-sm font-medium text-slate-700">Service d'assistance disponible pour les urgences techniques.</p>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => (
            <div 
              key={index} 
              className="group p-8 bg-white border border-slate-100 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-100"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <span className="group-hover:text-white transition-colors">
                  {service.icon}
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-900">
                {service.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
