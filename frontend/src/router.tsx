import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Conocenos from './pages/Conocenos';
import Servicios from './pages/Servicios';
import Aliados from './pages/Aliados';
import Contacto from './pages/Contacto';
import Legal from './pages/Legal';
import KnowledgeBase from './pages/KnowledgeBase';


const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (anchor), scroll to that element after a short delay
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If no hash, scroll to top for regular page navigation
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Handle hash changes on the same page (when clicking anchor links)
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return null;
};

const Router = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/aliados" element={<Aliados />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
      </Routes>
    </>
  );
};

export default Router;