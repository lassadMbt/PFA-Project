/**
 * src/components/FeaturedProducts.tsx
 *
 * Updated to read live data from Supabase.
 * product.images feeds directly into <ImageCarousel images={...} />
 * product.warranty shows the guarantee badge if present.
 */

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../lib/useContent';

// ─── ImageCarousel (unchanged from your original) ─────────────

interface ImageCarouselProps {
  images: string[];
  title: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, title }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => setCurrent((index + images.length) % images.length);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => setCurrent(prev => (prev + 1) % images.length), 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [images.length, paused]);

  if (images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-xl h-[450px] md:h-[520px] bg-slate-200 flex items-center justify-center">
        <span className="text-slate-400 text-sm">Aucune image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer h-[450px] md:h-[520px]">
        <img src={images[0]} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl h-[450px] md:h-[520px]"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {images.map((img, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ))}
      <button onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
        aria-label="Previous">
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>
      <button onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
        aria-label="Next">
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5' : 'bg-white/50 w-2'}`}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

// ─── FeaturedProducts ─────────────────────────────────────────

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-800 text-sm font-bold uppercase tracking-[0.2em] mb-3">Nos Solutions Premium</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">Systèmes de Fermeture Sur-Mesure</h3>
          <div className="w-24 h-1.5 bg-gray-500 mx-auto mt-6" />
        </div>
        <div className="space-y-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-12 animate-pulse">
              <div className="flex-1 h-[450px] bg-slate-200 rounded-2xl" />
              <div className="flex-1 space-y-4 py-10">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-2/3" />
                <div className="h-20 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-gray-800 text-sm font-bold uppercase tracking-[0.2em] mb-3">Nos Solutions Premium</h2>
        <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">Systèmes de Fermeture Sur-Mesure</h3>
        <div className="w-24 h-1.5 bg-gray-500 mx-auto mt-6" />
      </div>

      <div className="space-y-24">
        {products.map((product, index) => (
          <div key={product.id} className={`flex flex-col lg:items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
            {/* Carousel — feeds product.images array directly */}
            <div className="flex-1">
              <ImageCarousel images={product.images} title={product.title} />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h4 className="text-gray-600 font-bold mb-2 flex items-center gap-2 uppercase tracking-wide">
                <Zap className="w-4 h-4 fill-gray-500" />{product.subtitle}
              </h4>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{product.title}</h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {product.innovations && product.innovations.length > 0 && (
                <div className="bg-gray-100 border-l-4 border-gray-700 p-6 rounded-r-xl mb-8 shadow-sm">
                  <h5 className="font-bold text-gray-800 mb-3">Innovations Exclusives</h5>
                  <ul className="space-y-2">
                    {product.innovations.map((inn, i) => (
                      <li key={i} className="text-gray-700 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />{inn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="bg-gray-800 text-white border-2 border-gray-800 px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:bg-white hover:text-gray-800">
                  Demander un Devis
                </a>
                {product.warranty && (
                  <div className="flex items-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-bold border border-gray-200">
                    {product.warranty}
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

