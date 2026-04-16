import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../Modal';
import CTAButton from '../CTAButton';
import { getCookie, setCookie } from '../../utils/cookies';
import styles from './DomainVerificationModal.module.css';

const DomainVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó la verificación de dominio
    const domainAccepted = getCookie('insular_domain_accepted');
    
    if (!domainAccepted) {
      // Mostrar modal después de un pequeño delay para mejor UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Establecer cookie por 30 días
    setCookie('insular_domain_accepted', 'true', 30);
    setHasAccepted(true);
    setIsOpen(false);
  };

  const handleClose = () => {
    // Permitir cerrar pero no establecer cookie - el usuario lo verá en la próxima visita
    setIsOpen(false);
  };

  // No renderizar si ya fue aceptado o no está abierto
  if (hasAccepted || !isOpen) return null;

  return createPortal(
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Verificación de Seguridad"
    >
      <div className={styles.content}>
        <p>
          Por tu seguridad, verifica que estás en el sitio oficial: <strong>insularcambios.com</strong>
        </p>
        
        <div className={styles.actions}>
          <CTAButton 
            text="Aceptar"
            variant="primary"
            onClick={handleAccept}
          />
          <CTAButton 
            text="No mostrar de nuevo"
            variant="secondary"
            onClick={handleAccept}
          />
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default DomainVerificationModal;
