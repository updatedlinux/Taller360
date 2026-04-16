import { useEffect, useRef } from 'react';
import styles from './MapModal.module.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const MapModal = ({ isOpen, onClose }: MapModalProps) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || !window.L) return;

    // Initialize map centered on Caracas location
    // Torre Seguros Sudamerica coordinates
    const lat = 10.5026;
    const lng = -66.8548;

    if (!mapRef.current) {
      mapRef.current = window.L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Use CartoDB Dark Matter tiles
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Add a custom marker
      window.L.marker([lat, lng], {
        icon: window.L.divIcon({
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(mapRef.current);

      // Enable scroll zoom only when Ctrl is pressed
      mapContainerRef.current.addEventListener('wheel', function(e: WheelEvent) {
        if (e.ctrlKey && mapRef.current) {
          e.preventDefault();
          if (e.deltaY < 0) {
            mapRef.current.zoomIn();
          } else {
            mapRef.current.zoomOut();
          }
        }
      }, { passive: false });
    }

    // Invalidate size when modal opens to ensure proper rendering
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      // Cleanup map instance when modal closes
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className={styles.mapWrapper}>
          <div ref={mapContainerRef} className={styles.mapContainer}></div>
          <a
            href="https://www.google.com/maps/place/Torre+Seguros+Sudamerica/@10.502661,-66.8548,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a58f3e8f5f5f5:0x1f5f5f5f5f5f5f5f!8m2!3d10.502661!4d-66.8548!16s%2Fg%2F11c5m5m5m5"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleMapsBtn}
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
