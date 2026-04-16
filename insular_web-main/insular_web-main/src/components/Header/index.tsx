import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import AnimatedLogo from '../AnimatedLogo';
import { withBase } from '../../utils/base';
import styles from './Header.module.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [displayScrolled, setDisplayScrolled] = useState(false);
  const [applyScrolledClass, setApplyScrolledClass] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  // Refs for GSAP animations
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const menuImageRef = useRef<HTMLDivElement>(null);
  const menuNavRef = useRef<HTMLElement>(null);
  const menuFooterRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Initialize opacity on mount
  useEffect(() => {
    if (headerContentRef.current && headerRef.current) {
      gsap.set(headerContentRef.current, { opacity: 1 });
      gsap.set(headerRef.current, { opacity: 1 });
      setIsInitialized(true);
    }
  }, []);

  // Check if current page has full-width hero that needs double padding
  const hasFullWidthHero = location.pathname === '/contacto' || location.pathname === '/servicios' || location.pathname === '/aliados' || location.pathname === '/conocenos';

  // Crossfade navbar on scroll
  useEffect(() => {
    if (!headerContentRef.current || !headerRef.current || !isInitialized) return;
    if (!logoRef.current || !navRef.current) return;

    const navLinks = navRef.current.querySelectorAll('a');

    // Kill any existing animations to prevent getting stuck
    gsap.killTweensOf([headerRef.current, headerContentRef.current, ...Array.from(navLinks)]);

    // Fade out header container and nav links (NOT logo - it has its own animation)
    gsap.to([headerRef.current, ...Array.from(navLinks)], {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        // Update all states while invisible
        setDisplayScrolled(isScrolled);
        setApplyScrolledClass(isScrolled);
        // Immediately fade back in with staggered cascade
        requestAnimationFrame(() => {
          // Fade in header container first
          gsap.to(headerRef.current, {
            opacity: 1,
            duration: 0.25,
            ease: 'power2.in'
          });

          // Logo handles its own visibility transitions via AnimatedLogo component
          // No need to animate it here

          // Stagger nav links from bottom to top (reverse order)
          const reversedLinks = Array.from(navLinks).reverse();
          gsap.fromTo(reversedLinks,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              stagger: 0.05,
              ease: 'power2.out'
            }
          );
        });
      }
    });
  }, [isScrolled, isInitialized]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // GSAP animation for mobile menu
  useEffect(() => {
    if (!menuOverlayRef.current) return;

    if (isMobileOpen) {
      // Opening animation
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Fade in overlay background
      tl.fromTo(
        menuOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );

      // 2. Scale and fade in image from left with subtle rotation
      if (menuImageRef.current) {
        tl.fromTo(
          menuImageRef.current,
          {
            scale: 0.8,
            x: -100,
            opacity: 0,
            rotationY: -15
          },
          {
            scale: 1,
            x: 0,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.out'
          },
          '-=0.2'
        );
      }

      // 3. Stagger menu items from left
      if (menuNavRef.current) {
        const menuItems = menuNavRef.current.querySelectorAll('a');
        tl.fromTo(
          menuItems,
          {
            x: -50,
            opacity: 0,
            rotationX: -10
          },
          {
            x: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out'
          },
          '-=0.5'
        );
      }

      // 4. Fade in footer elements
      if (menuFooterRef.current) {
        tl.fromTo(
          menuFooterRef.current.children,
          {
            y: 20,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5
          },
          '-=0.3'
        );
      }

      // 5. Rotate and fade in close button
      if (closeButtonRef.current) {
        tl.fromTo(
          closeButtonRef.current,
          {
            scale: 0,
            rotation: -180,
            opacity: 0
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)'
          },
          '-=0.5'
        );
      }

    } else if (!isMobileOpen && menuOverlayRef.current) {
      // Closing animation - all elements fade out together
      const tl = gsap.timeline({
        defaults: { ease: 'power2.in', duration: 0.3 }
      });

      // Fade out ALL elements simultaneously with overlay
      const elementsToFade = [];

      if (closeButtonRef.current) {
        elementsToFade.push(closeButtonRef.current);
      }

      if (menuNavRef.current) {
        const menuItems = menuNavRef.current.querySelectorAll('a');
        elementsToFade.push(...Array.from(menuItems));
      }

      if (menuFooterRef.current) {
        elementsToFade.push(...Array.from(menuFooterRef.current.children));
      }

      if (menuImageRef.current) {
        elementsToFade.push(menuImageRef.current);
      }

      // Fade out overlay and all content at the exact same time
      tl.to(
        [menuOverlayRef.current, ...elementsToFade],
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        }
      );
    }
  }, [isMobileOpen]);

  const navigation = [
    { path: '/', label: 'Inicio' },
    { path: '/conocenos', label: 'Conócenos' },
    { path: '/servicios', label: 'Servicios' },
    { path: '/aliados', label: 'Aliados' },
    { path: '/contacto', label: 'Contáctanos' }
  ];


  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${applyScrolledClass ? styles.scrolled : ''} ${hasFullWidthHero ? styles.fullWidthHero : ''}`}>
        <div className="container">
          <div ref={headerContentRef} className={styles.headerContent}>
            <Link ref={logoRef} to="/" className={styles.logo} aria-label="Volver al inicio">
              <AnimatedLogo isScrolled={displayScrolled} />
            </Link>

            <nav ref={navRef} className={`${styles.nav} ${isMobileOpen ? styles.mobileOpen : ''}`}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                const isContacto = item.path === '/contacto';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${isContacto ? styles.contactButton : styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Abrir o cerrar menu"
              aria-expanded={isMobileOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-page mobile menu overlay - outside header for true full-screen */}
      <div
        ref={menuOverlayRef}
        className={`${styles.mobileMenuOverlay} ${isMobileOpen ? styles.mobileMenuOpen : ''}`}
      >
        <button
          ref={closeButtonRef}
          className={styles.mobileMenuClose}
          onClick={() => setIsMobileOpen(false)}
          aria-label="Cerrar menu"
        >
          ✕
        </button>

        <div className={styles.mobileMenuGrid}>
          <div ref={menuImageRef} className={styles.mobileMenuImage}>
            <img
              src={withBase('images/hero/home-hero.webp')}
              alt="Insular"
              className={styles.mobileMenuImg}
            />
          </div>

          <nav ref={menuNavRef} className={styles.mobileMenuNav}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileMenuItem} ${isActive ? styles.mobileMenuItemActive : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div ref={menuFooterRef} className={styles.mobileMenuFooter}>
            <div className={styles.mobileMenuSocial}>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
            <img
              src={withBase('logos/insular-logo-header.svg')}
              alt="Insular"
              className={styles.mobileMenuLogo}
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default Header;
