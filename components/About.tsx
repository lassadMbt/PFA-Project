/* components/About.tsx */ 

import React from 'react';
import { Award, Users, Target } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const About: React.FC = () => {
  const values = [
    { icon: <Award className="w-6 h-6" />, title: "Qualité Supérieure", desc: "Matériaux certifiés et finitions haut de gamme." },
    { icon: <Users className="w-6 h-6" />, title: "Service Client", desc: "Écoute attentive et accompagnement personnalisé." },
    { icon: <Target className="w-6 h-6" />, title: "Innovation", desc: "Technologie italienne de dernière génération." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 relative">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src= "images\apropos.jpeg" 
              alt="Atelier PFA" 
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl z-20 hidden md:block">
            <div className="text-5xl font-extrabold text-blue-900 mb-2">4+</div>
            <div className="text-slate-500 font-bold uppercase tracking-tighter text-sm">Années d'Expérience</div>
          </div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
        </div>

        <div className="flex-1">
          <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-4">À Propos de PFA</h2>
          <h3 className="text-4xl font-heading font-extrabold text-blue-950 mb-6 leading-tight">
            Votre Partenaire de Confiance en Tunisie
          </h3>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            {COMPANY_INFO.name} est leader dans la fabrication et l'installation de portes et fermetures automatiques depuis plus de 15 ans. Basés à l'Ariana, nous servons tout le territoire tunisien avec un engagement sans faille pour la qualité.
          </p>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            Notre expertise repose sur une sélection rigoureuse de nos partenaires, notamment pour les motorisations italiennes réputées pour leur fiabilité et leur silence de fonctionnement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-orange-500 mb-3">{val.icon}</div>
                <h5 className="font-bold text-slate-900 mb-1">{val.title}</h5>
                <p className="text-xs text-slate-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
