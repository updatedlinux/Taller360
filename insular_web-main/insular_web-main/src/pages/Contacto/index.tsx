import { useEffect, useState } from 'react';
import { withBase } from '../../utils/base';
import SEO from '../../components/SEO';
import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import styles from './Contacto.module.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <SEO
        title="Contacto"
        description="Contáctanos para resolver todas tus dudas sobre cambio de divisas y remesas. WhatsApp +58 414-2093083, email operaciones@insular.io. Estamos aquí para ayudarte."
        keywords="contacto Insular, casa de cambio contacto, teléfono, whatsapp, email, dirección Caracas, horarios"
        canonical="/contacto"
        ogImage="/images/og/insular-contacto.jpg"
        ogImageAlt="Contacto - Insular Casa de Cambio Venezuela"
      />

      <Section className={styles.hero}>
        <div
          className={styles.heroBackground}
          style={{
            backgroundImage: `url(${withBase('images/temp/confianza.webp')})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left center',
            backgroundSize: 'cover',
          }}
        ></div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                ¡Estamos<br />
                aquí para<br />
                ayudarte!
              </h1>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.infoCard}>
                <span className={styles.cardLabel}>Número de contacto</span>
                <div className={styles.cardValue}>
                  <a href="tel:+584142093083">+58 414-2093083</a>
                </div>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardLabel}>Correo Electrónico</span>
                <div className={styles.cardValue}>
                  <a href="mailto:operaciones@insular.io">operaciones@insular.io</a>
                </div>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardLabel}>Horarios</span>
                <div className={styles.cardValue}>
                  Lunes a viernes<br />
                  8:30 am a 3:30 pm<br />
                  <br />
                  Sábados y Domingos<br />
                  Cerrados
                </div>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.cardLabel}>Dirección</span>
                <div className={styles.cardValue}>
                  Avenida Francisco de Miranda,<br />
                  Torre Seguros Sudamerica,<br />
                  local PB-7 Urbanización El<br />
                  Rosal, municipio Chacao.
                </div>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className={styles.ctaButtons}>
                <CTAButton
                  text="Contáctanos"
                  href="https://wa.me/584142093083"
                  target="_blank"
                />
                <CTAButton text="Chat con Insa" variant="inherit" href="https://wa.me/584142093083" target="_blank" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className={styles.contact}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div data-animate="fade-right" className={styles.contactFormContainer}>
              <div className="display">Contáctanos</div>
              <h2 className="h2">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                <CTAButton text="Enviar mensaje" type="submit" />
              </form>
            </div>

            <div data-animate="fade-left" className={styles.ctaContainer}>
              <div className={styles.ctaCard}>
                <div
                  className={styles.ctaImage}
                  style={{
                    backgroundImage: `url(${withBase('images/temp/atencion.webp')})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                ></div>
                <div className={styles.ctaContent}>
                  <h2 className="h2 text-white">¿Necesitas ayuda inmediata?</h2>
                  <p className="body-sm text-white">
                    Nuestro equipo de soporte está disponible 24/7 para atender tus consultas urgentes.
                  </p>
                  <div className={styles.ctaSpacer}></div>
                  <CTAButton text="Chat en vivo" variant="secondary" href="https://wa.me/584142093083" target="_blank" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Contacto;
