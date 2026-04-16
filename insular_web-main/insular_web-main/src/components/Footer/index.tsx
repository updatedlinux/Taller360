import { Link } from 'react-router-dom';
import { withBase } from '../../utils/base';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container-full">
        <div className={styles.footerContent}>
          {/* Logo */}
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.brandLink} aria-label="Volver al inicio">
              <img src={withBase('logos/insular-logo.svg')} alt="Insular" className={styles.brandLogo} loading="lazy" />
            </Link>
          </div>

          {/* Menu Columns Wrapper */}
          <div className={styles.menuColumnsWrapper}>
            {/* Column 1 */}
            <div className={styles.footerColumn}>
              <ul className={styles.footerLinks}>
                <li><Link to="/conocenos">Conócenos</Link></li>
                <li><Link to="/servicios">Servicios</Link></li>
                <li><Link to="/aliados">Aliados</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className={styles.footerColumn}>
              <ul className={styles.footerLinks}>
                <li><Link to="/contacto">Contáctanos</Link></li>
                <li><Link to="/#faq">Preguntas Frecuentes</Link></li>
                <li><Link to="/legal#prevencion">Prevención LC/FT/FPADM</Link></li>
              </ul>
            </div>

            {/* Column 3 - Contact Info */}
            <div className={styles.footerColumn}>
              <ul className={styles.footerLinks}>
                <li><a href="https://wa.me/584142093083" target="_blank" rel="noopener noreferrer">+58 414-2093083</a></li>
                <li><a href="mailto:info@insular.io">info@insular.io</a></li>
                <li><Link to="/legal">Documentos Legales</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
            <Link to="/legal#cookies">Cookies</Link>
            <Link to="/legal#privacy">Políticas de Privacidad</Link>
            <Link to="/legal#terms">Términos y Condiciones</Link>
          </div>
          <div className={styles.footerBottomRight}>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/></svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895.421.42.681.817.9 1.378.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008"/></svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <span className={styles.handle}>@insularve</span>
          </div>
        </div>

        {/* Site Branding */}
        <div className={styles.siteBranding}>
          <span className={styles.brandingText}>MADE WITH</span>
          <svg className={styles.brandingHeart} width="14" height="13" viewBox="0 0 14 13" fill="var(--color-alerta)"><path d="M7 12.5L1.05 6.8C-0.35 5.4-0.35 3.1 1.05 1.7 2.45 0.3 4.75 0.3 6.15 1.7L7 2.55 7.85 1.7C9.25 0.3 11.55 0.3 12.95 1.7 14.35 3.1 14.35 5.4 12.95 6.8L7 12.5Z"/></svg>
          <span className={styles.brandingText}>BY</span>
          <a href="https://vanalva.io" target="_blank" rel="noopener noreferrer" className={styles.brandingLogoLink}>
            <svg viewBox="0 0 336.71 37.59" aria-hidden="true" fill="currentColor" height="12"><path d="M.79,0h14.53c.34,0,.64.22.75.54l8.08,23.58h.11L32.34.54c.11-.32.41-.54.75-.54h14.53c.58,0,.96.59.72,1.12l-16.14,36c-.13.29-.41.47-.72.47h-14.56c-.31,0-.6-.18-.72-.47L.07,1.12C-.16.59.22,0,.79,0Z"/><path d="M55.33,0h17.17c.32,0,.61.19.73.48l15.33,36c.22.52-.16,1.1-.73,1.1h-14.04c-.33,0-.63-.21-.75-.52l-1.39-3.8h-15.48l-1.39,3.8c-.11.31-.41.52-.75.52h-14.04c-.57,0-.95-.58-.73-1.1L54.6.48c.12-.29.41-.48.73-.48ZM63.97,11.37h-.11l-4.42,12.74h8.95l-4.42-12.74Z"/><path d="M94.33,0h15.93C110.52,0,110.76.12,110.91.33l14.99,20.52h.16V.79C126.06.36,126.42,0,126.86,0h12.77C140.08,0,140.44.36,140.44.79v36c0,.44-.36.79-.8.79h-15.25c-.25,0-.49-.12-.64-.32l-15.73-20.74h-.11v20.27c0,.44-.36.79-.8.79h-12.77c-.44,0-.8-.36-.8-.79V.79C93.52.36,93.88,0,94.33,0Z"/><path d="M169.77,0h17.17C187.26,0,187.55.19,187.67.48l15.33,36c.22.52-.16,1.1-.73,1.1h-14.04c-.33,0-.63-.21-.75-.52l-1.39-3.8h-15.48l-1.39,3.8c-.11.31-.41.52-.75.52h-14.04c-.57,0-.95-.58-.73-1.1L169.04.48C169.17.19,169.46,0,169.77,0ZM178.41,11.37h-.11l-4.42,12.74h8.95l-4.42-12.74Z"/><path d="M207.63,0h13.26C221.33,0,221.69.36,221.69.79v26.69h22.21c.44,0,.79.36.79.79v8.52c0,.44-.36.79-.79.79h-36.27c-.44,0-.79-.36-.79-.79V.79C206.84.36,207.19,0,207.63,0Z"/><path d="M237.61,0h14.53C252.48,0,252.78.22,252.89.54l8.08,23.58h.11l8.08-23.58C269.27.22,269.57,0,269.91,0h14.53C285.01,0,285.4.59,285.16,1.12l-16.14,36c-.13.29-.41.47-.72.47h-14.56c-.31,0-.6-.18-.72-.47L236.89,1.12C236.65.59,237.04,0,237.61,0Z"/><path d="M291.34,0h17.17C308.83,0,309.11.19,309.24.48l15.33,36c.22.52-.16,1.1-.73,1.1h-14.04c-.33,0-.63-.21-.75-.52l-1.39-3.8h-15.48l-1.39,3.8c-.11.31-.41.52-.75.52h-14.04c-.57,0-.95-.58-.73-1.1L290.61.48C290.74.19,291.02,0,291.34,0ZM299.98,11.37h-.11l-4.42,12.74h8.95l-4.42-12.74Z"/><path d="M335.39,9.51h-9.45c-.72,0-1.31-.59-1.31-1.31V1.31c0-.72.59-1.31,1.31-1.31h9.45c.72,0,1.31.59,1.31,1.31v6.89c0,.72-.59,1.31-1.31,1.31ZM325.97,9.12h9.39c.53,0,.96-.43.96-.96V1.34c0-.53-.43-.96-.96-.96h-9.39c-.53,0-.96.43-.96.96v6.83c0,.53.43.96.96.96Z"/><path d="M327.98,1.63h3.19c.3,0,.58.02.84.07s.48.14.67.26c.19.13.33.29.44.51.11.21.16.48.16.81,0,.17-.02.33-.07.49s-.13.31-.23.45-.24.26-.4.37c-.16.11-.35.18-.57.24v.02c.39.05.67.19.87.43s.3.53.3.87c0,.29.01.53.02.73,0,.19.02.36.03.49.01.13.03.24.05.32.02.08.05.15.07.21h-.4c-.06-.05-.1-.19-.12-.41s-.04-.57-.05-1.05c0-.27-.03-.49-.09-.67s-.14-.32-.26-.43c-.12-.11-.29-.18-.49-.22-.2-.04-.46-.07-.77-.07h-2.78v2.84h-.4V1.63ZM328.39,4.68h2.72c.06,0,.15,0,.27,0,.11,0,.24-.02.37-.05.13-.03.27-.07.4-.12.14-.05.26-.14.37-.24.11-.11.2-.24.27-.4s.11-.36.11-.6-.05-.46-.14-.63c-.09-.17-.21-.3-.37-.39-.15-.1-.33-.16-.53-.2-.2-.04-.41-.06-.63-.06h-2.83v2.7Z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
