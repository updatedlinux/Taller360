import { useCallback, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type SwiperType from 'swiper';
import { withBase } from '../../utils/base';
import 'swiper/css';
import 'swiper/css/free-mode';
import styles from './ImageGallerySlider.module.css';

interface ImageGallerySliderProps {
  images?: { src: string; alt: string }[];
}

const defaultImages = [
  { src: withBase('images/temp/confianza.webp'), alt: 'Confianza' },
  { src: withBase('images/temp/atencion.webp'), alt: 'Atenci\u00f3n al cliente' },
  { src: withBase('images/temp/intuitivo.webp'), alt: 'Plataforma intuitiva' },
  { src: withBase('images/temp/team.webp'), alt: 'Nuestro equipo' },
  { src: withBase('images/temp/remesa-recibida.webp'), alt: 'Remesa recibida' },
  { src: withBase('images/temp/compra.webp'), alt: 'Compra de divisas' },
  { src: withBase('images/temp/viajes.webp'), alt: 'Viajes' },
  { src: withBase('images/temp/accesibilidad.webp'), alt: 'Accesibilidad' },
];

const AUTOPLAY_DELAY = 3000;
const TRANSITION_SPEED = 800;

const ImageGallerySlider = ({ images = defaultImages }: ImageGallerySliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) return;
    autoplayTimer.current = setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper || isPaused.current) return;
      // Temporarily disable freeMode so slideNext uses CSS transition
      const fm = swiper.params.freeMode;
      if (fm && typeof fm === 'object') fm.enabled = false;
      swiper.slideNext(TRANSITION_SPEED);
      setTimeout(() => {
        if (fm && typeof fm === 'object') fm.enabled = true;
      }, TRANSITION_SPEED + 50);
    }, AUTOPLAY_DELAY);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  return (
    <div
      className={styles.sliderWrapper}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <Swiper
        modules={[FreeMode]}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        slidesPerView="auto"
        spaceBetween={16}
        speed={TRANSITION_SPEED}
        loop={true}
        grabCursor={true}
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: 0.8,
          momentumBounce: false,
          momentumVelocityRatio: 0.6,
          sticky: true,
        }}
        touchRatio={1.2}
        touchReleaseOnEdges={true}
        breakpoints={{
          0: { spaceBetween: 12 },
          768: { spaceBetween: 16 },
          1024: { spaceBetween: 20 },
        }}
        className={styles.swiper}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.slideInner}>
              <img
                src={image.src}
                alt={image.alt}
                className={styles.slideImage}
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageGallerySlider;
