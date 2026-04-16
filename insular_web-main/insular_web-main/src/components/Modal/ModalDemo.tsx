import { useState } from 'react';
import Modal from './index';
import CTAButton from '../CTAButton';

const ModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <CTAButton text="Abrir Modal" onClick={openModal} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Modal de Ejemplo"
      >
        <p>
          Este es un ejemplo de modal con efecto de fluido de fondo. 
          El modal incluye:
        </p>
        <ul>
          <li>Efecto de fluido similar al hero de la página principal</li>
          <li>Botón de cerrar idéntico al menú móvil</li>
          <li>Animaciones suaves con GSAP</li>
          <li>Diseño responsivo</li>
          <li>Accesibilidad completa</li>
        </ul>
        <p>
          Puedes cerrar el modal haciendo clic en la X, presionando Escape, 
          o haciendo clic fuera del contenido del modal.
        </p>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <CTAButton text="Cerrar Modal" onClick={closeModal} variant="secondary" />
        </div>
      </Modal>
    </>
  );
};

export default ModalDemo;
