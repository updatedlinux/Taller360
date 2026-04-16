import styles from './PartnersMarquee.module.css';

const countries = [
  'MÉXICO',
  'CANADÁ',
  'CHILE',
  'COLOMBIA',
  'COSTA RICA',
  'ECUADOR',
  'PANAMÁ',
  'PERÚ',
  'ESTADOS UNIDOS',
  'ALEMANIA',
  'ESPAÑA',
  'FRANCIA',
  'ARGENTINA',
];

const PartnersMarquee = () => {
  return (
    <div className={styles.marqueeSection}>
      <h3 className={styles.marqueeTitle}>Elige cómo deseas recibir tu dinero</h3>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee}>
          <div className={styles.marqueeContent}>
            {countries.map((country, index) => (
              <div key={`country-1-${index}`} className={styles.countryItem}>
                <span className={styles.countryName}>{country}</span>
              </div>
            ))}
          </div>
          <div className={styles.marqueeContent} aria-hidden="true">
            {countries.map((country, index) => (
              <div key={`country-2-${index}`} className={styles.countryItem}>
                <span className={styles.countryName}>{country}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
