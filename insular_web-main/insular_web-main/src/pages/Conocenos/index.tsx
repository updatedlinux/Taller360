import { useEffect } from 'react';
import { withBase } from '../../utils/base';
import SEO from '../../components/SEO';
import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import ImageGallerySlider from '../../components/ImageGallerySlider';
import styles from './Conocenos.module.css';

const Conocenos = () => {
  useEffect(() => {
  }, []);

  const values = ['Profesionalismo', 'Transparencia', 'Responsabilidad'];

  const milestones = [
    { year: '2003', title: 'Fundación', description: 'Nacimos con la visión de revolucionar el mercado cambiario venezolano' },
    { year: '2010', title: 'Expansión', description: 'Ampliamos nuestros servicios a transferencias internacionales' },
    { year: '2018', title: 'Digitalización', description: 'Implementamos plataformas digitales para mayor conveniencia' },
    { year: '2023', title: 'Liderazgo', description: 'Consolidamos nuestra posición como líderes en el sector' }
  ];

  return (
    <>
      <SEO
        title="Conócenos"
        description="Somos Insular, tu Casa de Cambio de confianza desde hace más de 35 años. Conoce nuestra misión, visión y valores en el mercado cambiario venezolano."
        keywords="casa de cambio Venezuela, Insular, historia, misión, visión, valores, cambio de divisas Caracas"
        canonical="/conocenos"
        ogImage="/images/og/insular-conocenos.jpg"
        ogImageAlt="Conócenos - Insular Casa de Cambio Venezuela"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={withBase('images/sections/avila.webp')} alt="Avila mountain Caracas" />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText} data-animate="fade-up">
              <h1>Somos Insular Tu Casa de Cambio de Confianza desde hace más de 35 años.</h1>
              <p>Con más de dos décadas construyendo confianza en el mercado cambiario venezolano, ofreciendo servicios seguros, transparentes y con las mejores tasas del mercado.</p>
              <div className={styles.heroActions}>
                <CTAButton text="¡Conoce más!" variant="primary" href="/servicios" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Slider */}
      <ImageGallerySlider images={[
        { src: withBase('images/swiper-carousels/nosotros/cajera_1024w.webp'), alt: 'Cajera' },
        { src: withBase('images/swiper-carousels/nosotros/chichas-sonriendo_1024w.webp'), alt: 'Chicas sonriendo' },
        { src: withBase('images/swiper-carousels/nosotros/empleada_1024w.webp'), alt: 'Empleada' },
        { src: withBase('images/swiper-carousels/nosotros/empleado_1024w.webp'), alt: 'Empleado' },
        { src: withBase('images/swiper-carousels/nosotros/escaleras_1024w.webp'), alt: 'Escaleras' },
      ]} />

      {/* Mission & Vision Section */}
      <section className={styles.missionVisionSection}>
        <div className="container">
          <div className={styles.missionVisionGrid}>
            <div className={styles.missionCard} data-animate="fade-up">
              <h2>Misión</h2>
              <p>
                Proporcionar servicios de cambio de divisas y transferencias internacionales seguros,
                transparentes y convenientes, superando las expectativas de nuestros clientes y
                contribuyendo al desarrollo económico del país.
              </p>
            </div>

            <div className={styles.visionCard} data-animate="fade-up" data-delay="0.1">
              <h2>Visión</h2>
              <p>
                Ser la casa de cambio digital líder en Venezuela y la región, reconocida por nuestra
                innovación tecnológica, compromiso con el cliente y contribución al crecimiento
                económico sostenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <Section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.timelineHeader}>
            <h2 data-animate="fade-up">Nuestro Recorrido</h2>
          </div>
          
          <div className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div key={index} className={styles.timelineItem} data-animate="fade-up" data-delay={`${0.1 * (index + 1)}`}>
                <div className={styles.timelineYear}>{milestone.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesBackground}>
          <img src={withBase('images/temp/intuitivo.webp')} alt="" />
        </div>
        <div className="container">
          <div className={styles.valuesContent}>
            <h2 data-animate="fade-up">Nuestros valores</h2>
            <div className={styles.valuesPills}>
              {values.map((value, index) => (
                <span
                  key={index}
                  className={styles.valuePill}
                  data-animate="fade-up"
                  data-delay={`${0.1 * (index + 1)}`}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard} data-animate="fade-up">
            <h2>¿Listo para ser parte de nuestra historia?</h2>
            <p>
              Únete a miles de clientes que ya confían en nosotros para sus operaciones de cambio de divisas y transferencias internacionales.
            </p>
            <CTAButton text="¡Empieza ahora!" href="/servicios" />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Conocenos;
