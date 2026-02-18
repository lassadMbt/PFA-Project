/* App.tsx */
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';

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
