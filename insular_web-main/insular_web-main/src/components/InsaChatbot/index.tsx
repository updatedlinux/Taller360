import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import styles from './InsaChatbot.module.css';

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'is-popup'?: string;
          'chatbot-id'?: string;
          height?: string;
          width?: string;
          key?: string;
        },
        HTMLElement
      >;
    }
  }
}

const InsaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [chatbotKey, setChatbotKey] = useState(0); // For forcing re-render/refresh
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load Zapier script immediately after page loads (not on click)
  useEffect(() => {
    const loadScript = () => {
      if (isScriptLoaded || document.querySelector('script[src*="zapier-interfaces"]')) return;

      const script = document.createElement('script');
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      script.type = 'module';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {};

      document.head.appendChild(script);
    };

    // Load after a short delay to prioritize main content
    const timer = setTimeout(loadScript, 1000);
    return () => clearTimeout(timer);
  }, [isScriptLoaded]);

  // Fade out button when overlapping with footer
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const button = buttonRef.current;

      if (footer && button) {
        const footerRect = footer.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Check if button overlaps with footer
        const isOverlapping = buttonRect.bottom > footerRect.top;

        if (isOverlapping) {
          const overlapAmount = buttonRect.bottom - footerRect.top;
          const buttonHeight = buttonRect.height;
          const fadeRatio = Math.min(overlapAmount / buttonHeight, 1);
          setButtonOpacity(1 - fadeRatio);
        } else {
          setButtonOpacity(1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable scroll when chatbot is open on mobile/tablet
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Only disable scroll on mobile/tablet (max-width: 1024px)
      const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;

      if (isMobileOrTablet) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMinimized]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    // If currently maximized and minimizing, exit maximized state
    if (isMaximized && !isMinimized) {
      setIsMaximized(false);
    }
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    // If minimized, restore when maximizing
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsMaximized(false);
    // Refresh the chatbot session by changing the key
    setChatbotKey(prev => prev + 1);
  };

  // Inject CSS to hide Zapier's default button and style the iframe
  useEffect(() => {
    if (!isScriptLoaded) return;

    const style = document.createElement('style');
    style.textContent = `
      /* Hide Zapier's default popup trigger button */
      zapier-interfaces-chatbot-embed::part(trigger-button) {
        display: none !important;
      }

      /* Style the iframe */
      zapier-interfaces-chatbot-embed iframe {
        border-radius: 12px !important;
        box-shadow: none !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isScriptLoaded]);

  return (
    <>
      {/* Custom button with your existing design - hide when minimized */}
      {!isMinimized && (
        <button
          ref={buttonRef}
          className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
          onClick={handleButtonClick}
          aria-label="Chatear con Insa"
          style={{ opacity: buttonOpacity, transition: 'opacity 0.2s ease' }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          {!isOpen && <span className={styles.chatButtonText}>Chatear con Insa</span>}
        </button>
      )}

      {/* Overlay for mobile/tablet */}
      {isScriptLoaded && isOpen && !isMinimized && (
        <div className={styles.chatbotOverlay} onClick={handleClose} />
      )}

      {/* Zapier chatbot window with custom controls */}
      {isScriptLoaded && isOpen && (
        <div
          className={`${styles.chatbotWindow} ${isMaximized ? styles.maximized : ''} ${isMinimized ? styles.minimized : ''}`}
        >
          {/* Custom window controls */}
          <div className={styles.chatbotHeader}>
            <div className={styles.chatbotHeaderInfo}>
              <MessageCircle size={16} />
              <span>Insa - Asistente Virtual</span>
            </div>
            <div className={styles.chatbotControls}>
              <button
                className={styles.controlButton}
                onClick={handleMinimize}
                aria-label={isMinimized ? "Restaurar" : "Minimizar"}
                title={isMinimized ? "Restaurar" : "Minimizar"}
              >
                <Minus size={16} />
              </button>
              <button
                className={styles.controlButton}
                onClick={handleMaximize}
                aria-label={isMaximized ? "Restaurar tamaño" : "Maximizar"}
                title={isMaximized ? "Restaurar tamaño" : "Maximizar"}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                className={`${styles.controlButton} ${styles.closeButton}`}
                onClick={handleClose}
                aria-label="Cerrar y reiniciar"
                title="Cerrar y reiniciar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Zapier chatbot embed */}
          <div className={styles.chatbotContent}>
            <zapier-interfaces-chatbot-embed
              key={chatbotKey}
              is-popup="false"
              chatbot-id="cmhkh5tzm000o7kg9fw9ctkm6"
              height="100%"
              width="100%"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default InsaChatbot;
