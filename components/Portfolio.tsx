/* components/Portfolio.tsx */
import React from 'react';
import { PROJECTS } from '../constants';

const Portfolio: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-orange-500 font-bold uppercase tracking-widest mb-4">Nos Réalisations</h2>
        <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-blue-950">
          Ils nous font confiance
        </h3>
        <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
          Découvrez quelques-unes de nos installations de rideaux métalliques et stores à travers la Tunisie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
          <div key={index} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
              <span className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-2">{project.category}</span>
              <h4 className="text-xl font-bold">{project.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <a 
          href="https://www.tiktok.com/@p.f.a.1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-blue-900 font-bold border-2 border-blue-900 px-8 py-3 rounded-full hover:bg-blue-900 hover:text-white transition-all"
        >
          Voir plus sur TikTok
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.023c1.108 0 2.164.194 3.141.549a1.002 1.002 0 01.597.917V5.55c0 .543-.431.989-.974.998-1.077.017-2.083-.243-2.977-.732V14.5c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6c.404 0 .794.041 1.171.117a1.002 1.002 0 01.802.979v4.22c0 .53-.414.969-.942.993a2.03 2.03 0 00-.229-.013c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2V1a1 1 0 011-1h3.411z"/></svg>
        </a>
      </div>
    </div>
  );
};

export default Portfolio;
