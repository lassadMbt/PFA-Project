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

      
    </div>
  );
};

export default Portfolio;
