/* components/FeaturedProducts.tsx */
import React from 'react';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import { PRODUCTS } from '../constants';

const FeaturedProducts: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-blue-900 text-sm font-bold uppercase tracking-[0.2em] mb-3">Nos Solutions Premium</h2>
        <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900">
          Systèmes de Fermeture Sur-Mesure
        </h3>
        <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6"></div>
      </div>

      <div className="space-y-24">
        {PRODUCTS.map((product, index) => (
          <div key={product.id} className={`flex flex-col lg:items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
            <div className="flex-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
               
                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2 uppercase tracking-wide">
                <Zap className="w-4 h-4 fill-orange-500" />
                {product.subtitle}
              </h4>
              <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-blue-950 mb-6">
                {product.title}
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 group/feat">
                    <CheckCircle2 className="w-5 h-5 text-blue-800 shrink-0 mt-0.5 group-hover/feat:text-orange-600 transition-colors" />
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {product.innovations && (
                <div className="bg-blue-50 border-l-4 border-blue-800 p-6 rounded-r-xl mb-8 shadow-sm">
                  <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    Innovations Exclusives
                  </h5>
                  <ul className="space-y-2">
                    {product.innovations.map((inn, i) => (
                      <li key={i} className="text-blue-800 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {inn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <a 
                  href="#contact" 
                  className="bg-blue-900 text-white border-2 border-blue-900 px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:bg-white hover:text-blue-900"
                >
                  Demander un Devis
                </a>
                {product.id === 'rideaux-metalliques' && (
                  <div className="flex items-center gap-2 px-6 py-4 bg-orange-100 text-orange-800 rounded-lg font-bold border border-orange-200">
                    Garantie 3 Ans
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
