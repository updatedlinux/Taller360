import { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from '../router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DomainVerificationModal from '../components/DomainVerificationModal';
import InsaChatbot from '../components/InsaChatbot';
import { initAnimations, initParallax, cleanupAnimations } from '../utils/animations';
import '../styles/globals.css';

// Handle SPA redirect from 404.html fallback
const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirect_path');
    if (redirectPath) {
      sessionStorage.removeItem('redirect_path');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
};

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure CSS assets resolve under non-root base (e.g., GitHub Pages project path)
    document.documentElement.style.setProperty('--base-url', import.meta.env.BASE_URL);

    // Clear existing ScrollTriggers/tweens before scheduling new ones
    cleanupAnimations();

    const timer = window.setTimeout(() => {
      initAnimations();
      initParallax();
    }, 80);

    return () => {
      window.clearTimeout(timer);
      cleanupAnimations();
    };
  }, [location.pathname]);

  return (
    <div className="app">
      <RedirectHandler />
      <Header />
      <main>
        <Router />
      </main>
      <Footer />
      <DomainVerificationModal />
      <InsaChatbot />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;


