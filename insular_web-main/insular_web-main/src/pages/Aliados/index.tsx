import { useState } from 'react';
import { withBase } from '../../utils/base';
import SEO from '../../components/SEO';
import CTAButton from '../../components/CTAButton';
import PartnersMarquee from '../../components/PartnersMarquee';
import styles from './Aliados.module.css';

const Aliados = () => {
  const [selectedPartner, setSelectedPartner] = useState<string>('B89');

  const partners = [
    {
      id: 'b89',
      name: 'B89',
      logo: withBase('logos/partners/b89-logo.png'),
      bgColor: '#b8b4ff',
      description: 'A través de nuestro aliado B89 proporcionamos a nuestros clientes un servicio de fácil acceso para enviar y recibir remesas desde y hacia Venezuela.',
      countries: [
        { flag: '🇵🇪', name: 'Perú' },
        { flag: '🇩🇪', name: 'Alemania' },
        { flag: '🇪🇸', name: 'España' },
        { flag: '🇫🇷', name: 'Francia' },
        { flag: '🇦🇷', name: 'Argentina' },
        { flag: '🇨🇴', name: 'Colombia' },
        { flag: '🇨🇱', name: 'Chile' },
        { flag: '🇪🇨', name: 'Ecuador' },
        { flag: '🇲🇽', name: 'México' }
      ],
      intro: 'Si te gustaría enviar o recibir dinero desde:'
    },
    {
      id: 'papaya',
      name: 'Papaya',
      logo: withBase('logos/partners/papaya-collab-logo.svg'),
      bgColor: '#d4c4ff',
      description: 'Nuestro aliado Papaya ofrece una experiencia de pago rápida, moderna y accesible. Puedes realizar tu envío o recibo de remesas hacia y desde:',
      countries: [
        { flag: '🇲🇽', name: 'México' },
        { flag: '🇨🇦', name: 'Canadá' },
        { flag: '🇨🇱', name: 'Chile' },
        { flag: '🇨🇴', name: 'Colombia' },
        { flag: '🇨🇷', name: 'Costa Rica' },
        { flag: '🇪🇨', name: 'Ecuador' },
        { flag: '🇵🇪', name: 'Perú' },
        { flag: '🇺🇸', name: 'Estados Unidos' }
      ],
      outro: 'Papaya le permite a los clientes de Insular una alternativa a los servicios de transferencias tradicionales, facilitando los pagos de manera rápida y con un bajo costo entre usuarios de diferentes regiones.'
    },
    {
      id: 'tsg',
      name: 'TSG',
      logo: withBase('logos/partners/tsg-logo.svg'),
      bgColor: '#e8f4f8',
      description: 'A través de TSG facilitamos el envío de remesas desde España hacia Venezuela de manera segura y confiable.',
      countries: [
        { flag: '🇪🇸', name: 'España' }
      ],
      intro: 'Recibe dinero desde:'
    },
    {
      id: 'panamericash',
      name: 'Panamericash',
      logo: withBase('logos/partners/panamericash.svg'),
      bgColor: '#fff5e6',
      description: 'Panamericash es nuestro aliado para recibir remesas desde Panamá hacia Venezuela de forma rápida y segura.',
      countries: [
        { flag: '🇵🇦', name: 'Panamá' }
      ],
      intro: 'Recibe dinero desde:'
    }
  ];

  const selectedPartnerData = partners.find(p => p.name === selectedPartner) || partners[0];

  return (
    <>
      <SEO
        title="Aliados"
        description="Conoce a nuestros aliados internacionales: B89, Papaya, TSG y Panamericash. Envía y recibe remesas desde 13 países hacia Venezuela."
        keywords="aliados Insular, B89, Papaya, TSG, Panamericash, remesas internacionales, partners, socios"
        canonical="/aliados"
        ogImage="/images/og/insular-aliados.jpg"
        ogImageAlt="Aliados Internacionales - Insular Casa de Cambio"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={withBase('images/sections/mundo.webp')} alt="" />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText} data-animate="fade-up">
              <h1>Te mantenemos conectado con el resto del mundo.</h1>
              <p>Trabajamos de la mano con reconocidos aliados internacionales para asegurar que cada remesa llegue de forma rápida, legal y segura a su destino.</p>
              <div className={styles.heroActions}>
                <CTAButton text="¡Conoce más!" variant="primary" href="/conocenos" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Marquee */}
      <PartnersMarquee />

      {/* Partners Tabs Section */}
      <section className={styles.partnersSection}>
        <div className="container">
          <div className={styles.partnerTabsWrapper}>
            {partners.map((partner, index) => (
              <button
                key={index}
                className={`${styles.partnerTab} ${selectedPartner === partner.name ? styles.partnerTabActive : ''}`}
                onClick={() => setSelectedPartner(partner.name)}
              >
                {partner.name}
              </button>
            ))}
          </div>

          <div className={styles.partnerContent}>
            <div className={styles.partnerHeader}>
              <div className={styles.partnerLogoWrapper}>
                <img
                  src={selectedPartnerData.logo}
                  alt={selectedPartnerData.name}
                  className={styles.partnerLogo}
                />
              </div>
              <div className={styles.partnerInfo}>
                <h2>{selectedPartnerData.name}</h2>
                <p>{selectedPartnerData.description}</p>
              </div>
            </div>

            {selectedPartnerData.intro && (
              <p className={styles.partnerIntro}>{selectedPartnerData.intro}</p>
            )}

            <div className={styles.countriesGrid}>
              {selectedPartnerData.countries.map((country, index) => (
                <div key={index} className={styles.countryCard}>
                  <span className={styles.countryFlag}>{country.flag}</span>
                  <span className={styles.countryName}>{country.name}</span>
                </div>
              ))}
            </div>

            {selectedPartnerData.outro && (
              <p className={styles.partnerOutro}>{selectedPartnerData.outro}</p>
            )}
          </div>
        </div>
      </section>

      {/* Guarantee CTA Section */}
      <section className={styles.guaranteeCtaSection}>
        <div className="container">
          <div className={styles.guaranteeCtaCard} data-animate="fade-up">
            <h2>Garantizamos que tus familiares y amigos reciban sus remesas</h2>
            <p className={styles.guaranteeSubtext}>¡Sin intermediarios ni retrasos!</p>
            <CTAButton text="Quiero ser aliado" variant="primary" href="https://wa.me/584142093083" target="_blank" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Aliados;
