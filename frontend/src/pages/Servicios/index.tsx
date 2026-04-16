import { useEffect } from 'react';
import { withBase } from '../../utils/base';
import SEO from '../../components/SEO';
import CTAButton from '../../components/CTAButton';
import PartnersMarquee from '../../components/PartnersMarquee';
import ImageGallerySlider from '../../components/ImageGallerySlider';
import styles from './Servicios.module.css';

const Servicios = () => {
  useEffect(() => {
  }, []);

  const receiveOptions = [
    {
      title: 'Pago móvil',
      description: 'La manera más rápida de recibir los fondos directamente en una cuenta bancaria.',
      icon: withBase('icons/arrow_right_naked.svg'),
      bgImage: withBase('images/temp/remesa-recibida.webp')
    },
    {
      title: 'Crédito inmediato',
      description: 'La manera más rápida de recibir los fondos directamente en una cuenta bancaria.',
      icon: withBase('icons/arrow_right_naked.svg'),
      bgImage: withBase('images/temp/compra.webp')
    },
    {
      title: 'Retiro físico',
      description: 'Retiro en nuestra agencia física en Caracas: Avenida Francisco de Miranda, Torre Seguros Sudamerica, local PB-7 Urbanización El Rosal, municipio Chacao.',
      icon: withBase('icons/arrow_right_naked.svg'),
      bgImage: withBase('images/temp/team.webp')
    }
  ];

  const benefits = [
    {
      title: 'Rapidez y Eficiencia',
      description: 'Nuestras operaciones son rápidas y directas',
      icon: withBase('icons/hand_coins_boxed.svg'),
      image: withBase('images/swiper-carousels/servicios/clienta-caja_1024w.webp')
    },
    {
      title: 'Legalidad y Respaldo',
      description: 'Operamos 100% dentro del marco legal venezolano, garantizando su tranquilidad.',
      icon: withBase('icons/database_dollar_boxed.svg'),
      image: withBase('images/swiper-carousels/servicios/edificio_1024w.webp')
    },
    {
      title: 'Conexión Global',
      description: 'Gracias a nuestros aliados internacionales, conectamos a Venezuela con el mundo.',
      icon: withBase('icons/globe_boxed.svg'),
      image: withBase('images/swiper-carousels/servicios/fachada_1024w.webp')
    },
    {
      title: 'Comodidad Total',
      description: 'Elija entre opciones digitales (Pago Móvil) o presenciales para sus transacciones.',
      icon: withBase('icons/cards_boxed.svg'),
      image: withBase('images/swiper-carousels/servicios/oficina_1024w.webp')
    }
  ];

  return (
    <>
      <SEO
        title="Servicios"
        description="Envía dinero a tus familiares o amigos desde 13 países hacia Venezuela. Pago móvil, crédito inmediato y retiro físico disponibles."
        keywords="remesas Venezuela, enviar dinero Venezuela, pago móvil, transferencias internacionales, casa de cambio"
        canonical="/servicios"
        ogImage="/images/og/taller360-servicios.jpg"
        ogImageAlt="Servicios de remesas internacionales - Taller360"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={withBase('images/temp/intuitivo.webp')} alt="" />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText} data-animate="fade-up">
              <h1>Envía dinero a tus familiares o amigos desde 13 países hacia Venezuela</h1>
              <p>a través de nuestra red de aliados internacionales.</p>
              <div className={styles.heroActions}>
                <CTAButton text="¡Empieza ahora!" variant="primary" href="/contacto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section - Partners */}
      <PartnersMarquee />

      {/* Image Gallery Slider */}
      <ImageGallerySlider images={[
        { src: withBase('images/swiper-carousels/servicios/fachada_1024w.webp'), alt: 'Fachada Taller360' },
        { src: withBase('images/swiper-carousels/servicios/clienta_1024w.webp'), alt: 'Clienta' },
        { src: withBase('images/swiper-carousels/servicios/edificio_1024w.webp'), alt: 'Edificio' },
        { src: withBase('images/swiper-carousels/servicios/clienta-taquilla_1024w.webp'), alt: 'Clienta en taquilla' },
        { src: withBase('images/swiper-carousels/servicios/oficina_1024w.webp'), alt: 'Oficina' },
        { src: withBase('images/swiper-carousels/servicios/cliente_1024w.webp'), alt: 'Cliente' },
        { src: withBase('images/swiper-carousels/servicios/calle-letrero_1024w.webp'), alt: 'Letrero en calle' },
        { src: withBase('images/swiper-carousels/servicios/clienta-caja_1024w.webp'), alt: 'Clienta en caja' },
        { src: withBase('images/swiper-carousels/servicios/edificio-perspectiva_1024w.webp'), alt: 'Edificio perspectiva' },
        { src: withBase('images/swiper-carousels/servicios/local-frente_1024w.webp'), alt: 'Local frente' },
        { src: withBase('images/swiper-carousels/servicios/senor-calle_1024w.webp'), alt: 'Señor en la calle' },
      ]} />

      {/* Receive Options Section */}
      <section className={styles.receiveSection}>
        <div className="container">
          <div className={styles.receiveHeader} data-animate="fade-up">
            <h2>Elige cómo deseas recibir tu dinero</h2>
          </div>
          <div className={styles.receiveCards}>
            {receiveOptions.map((option, index) => (
              <div
                key={index}
                className={styles.receiveCard}
                data-animate="fade-up"
                data-delay={`${0.1 * (index + 1)}`}
              >
                <div className={styles.receiveCardImage}>
                  <img src={option.bgImage} alt={option.title} />
                </div>
                <div className={styles.receiveCardContent}>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsHeader}>
            <h2>Beneficios</h2>
            <p>En Taller360, combinamos seguridad y conveniencia para ofrecerle un servicio de cambio de divisas excepcional.</p>
          </div>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              return (
                <div key={index} className={styles.benefitCard} data-animate="fade-up" data-delay={`${0.1 * (index + 1)}`}>
                  <div className={styles.benefitImage}>
                    <img src={benefit.image} alt={benefit.title} />
                  </div>
                  <div className={styles.benefitBody}>
                    <div className={styles.benefitIcon}>
                      <img
                        src={benefit.icon}
                        alt={`${benefit.title} icon`}
                      />
                    </div>
                    <h2>{benefit.title}</h2>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Servicios;
