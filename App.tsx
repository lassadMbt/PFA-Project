/* App.tsx */

import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Hero from "./src/components/Hero";
import FeaturedProducts from "./src/components/FeaturedProducts";
import About from "./src/components/About";
import Services from "./src/components/Services";
import Portfolio from "./src/components/Portfolio";
import Contact from "./src/components/Contact";
import Footer from "./src/components/Footer";
import FloatingCTA from "./src/components/FloatingCTA";
import Partners from "./src/components/Partners";

const AdminPanel = lazy(() => import("./src/components/admin/AdminPanel"));

const ADMIN_SECRET_PATH =
  import.meta.env.VITE_ADMIN_SECRET_PATH || "__disabled__";

const MainSite: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        <section id="partenaires" className="bg-white">
          <Partners />
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route
          path={`/${ADMIN_SECRET_PATH}`}
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <AdminPanel />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
