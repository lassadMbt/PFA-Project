/* App.tsx */
import React, { useState, useEffect } from 'react';
import Navbar from './src/components/Navbar';
import Hero from './src/components/Hero';
import FeaturedProducts from './src/components/FeaturedProducts';
import About from './src/components/About';
import Services from './src/components/Services';
import Portfolio from './src/components/Portfolio';
import Contact from './src/components/Contact';
import Footer from './src/components/Footer';
import FloatingCTA from './src/components/FloatingCTA';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isScrolled={isScrolled} />
      
      <main className="flex-grow">
        <section id="accueil">
          <Hero />
        </section>

        <section id="produits" className="py-20 bg-slate-50">
          <FeaturedProducts />
        </section>

        <section id="services" className="py-20">
          <Services />
        </section>

        <section id="a-propos" className="py-20 bg-slate-50">
          <About />
        </section>

        <section id="realisations" className="py-20">
          <Portfolio />
        </section>

        <section id="contact" className="py-20 bg-slate-900 text-white">
          <Contact />
        </section>
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default App;

