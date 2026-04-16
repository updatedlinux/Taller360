import { useEffect, useRef } from 'react';
import styles from './Carousel.module.css';

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const partners = [
    'B9', 'Papaya', 'Western Union', 'MoneyGram',
    'Visa', 'Mastercard', 'PayPal', 'Stripe'
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.style.animation = `${styles.scroll} 20s linear infinite`;
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack} ref={carouselRef}>
        {[...partners, ...partners].map((partner, index) => (
          <div key={`${partner}-${index}`} className={styles.carouselItem}>
            <div className={styles.partnerLogo}>
              {partner}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;