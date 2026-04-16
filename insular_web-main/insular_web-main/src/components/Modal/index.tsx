import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { withBase } from '../../utils/base';
import { gsap } from 'gsap';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const baseColorRef = useRef<{ r: number; g: number; b: number } | null>(null);
  const brandColorsRef = useRef<Array<{ r: number; g: number; b: number }>>([]);
  const lastTimeRef = useRef<number | null>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const lastAngleRef = useRef(0);
  const lastMoveTimeRef = useRef(performance.now());
  
  type Particle = { x: number; y: number; vx: number; vy: number; radius: number; life: number; color: { r: number; g: number; b: number } };
  const particlesRef = useRef<Particle[]>([]);

  const animate = (ts?: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const now = typeof ts === 'number' ? ts : performance.now();
    const last = lastTimeRef.current ?? now;
    const dt = Math.max(0, Math.min(1, (now - last) / 1000));
    lastTimeRef.current = now;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.06);
    currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.06);

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // If idle for a while, drive a gentle autonomous drift for the target
    const idleMs = now - lastMoveTimeRef.current;
    if (idleMs > 1200) {
      const t = now * 0.00025;
      const driftX = width * (0.5 + Math.cos(t) * 0.18);
      const driftY = height * (0.45 + Math.sin(t * 1.3) * 0.14);
      targetPos.current.x = driftX;
      targetPos.current.y = driftY;
    }

    // Dissipate previous frame for a smooth trail using body bg color
    const base = baseColorRef.current || { r: 16, g: 16, b: 33 };
    // Ensure base clear uses normal composition, preventing gray veil buildup
    ctx.globalCompositeOperation = 'source-over';
    // Faster trail fade when scrolling for performance
    const trailFade = 0.012;
    ctx.fillStyle = `rgba(${base.r},${base.g},${base.b},${trailFade})`;
    ctx.fillRect(0, 0, width, height);

    const x = currentPos.current.x;
    const y = currentPos.current.y;
    const vx = x - prevPosRef.current.x;
    const vy = y - prevPosRef.current.y;
    const speed = Math.hypot(vx, vy); // px per frame in CSS pixels
    prevPosRef.current = { x, y };
    const angle = speed > 0.1 ? Math.atan2(vy, vx) : lastAngleRef.current;
    lastAngleRef.current = angle;

    // Prepare additive blending for color mixing
    ctx.globalCompositeOperation = 'lighter';

    // Cycle brand colors and mix (time + movement)
    const colors = brandColorsRef.current.length
      ? brandColorsRef.current
      : [
          { r: 66, g: 43, b: 226 }, // purple
          { r: 249, g: 50, b: 67 }, // red
          { r: 155, g: 209, b: 184 }, // mint
        ];
    const t = now * 0.0003;
    const colorIndex = Math.floor(t) % colors.length;
    const nextColorIndex = (colorIndex + 1) % colors.length;
    const colorT = t - Math.floor(t);
    const currentColor = colors[colorIndex];
    const nextColor = colors[nextColorIndex];
    const r = Math.round(currentColor.r + (nextColor.r - currentColor.r) * colorT);
    const g = Math.round(currentColor.g + (nextColor.g - currentColor.g) * colorT);
    const b = Math.round(currentColor.b + (nextColor.b - currentColor.b) * colorT);

    // Emit particles based on movement
    if (speed > 0.5) {
      const particleCount = Math.min(Math.floor(speed * 0.8), 8);
      for (let i = 0; i < particleCount; i++) {
        const angleOffset = (Math.random() - 0.5) * 0.8;
        const speedFactor = 0.3 + Math.random() * 0.7;
        const particleVx = Math.cos(angle + angleOffset) * speed * speedFactor;
        const particleVy = Math.sin(angle + angleOffset) * speed * speedFactor;
        particlesRef.current.push({
          x,
          y,
          vx: particleVx,
          vy: particleVy,
          radius: 2 + Math.random() * 4,
          life: 1,
          color: { r, g, b },
        });
      }
    }

    // Update and render particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= dt * 2;
      p.radius *= 0.995;

      if (p.life <= 0 || p.radius <= 0.1) return false;

      const alpha = p.life * 0.6;
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    // Main fluid blob
    const intensity = Math.min(speed * 0.15, 1);
    const size = 40 + intensity * 30;
    const alpha = 0.4 + intensity * 0.3;

    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(animate);
  };

  const updateTargetFromClient = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    targetPos.current = { x, y };
    lastMoveTimeRef.current = performance.now();
  };

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parseRgb = (input: string): { r: number; g: number; b: number } => {
      const m = input.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (!m) return { r: 16, g: 16, b: 33 };
      return { r: parseInt(m[1], 10), g: parseInt(m[2], 10), b: parseInt(m[3], 10) };
    };
    const parseHex = (hex: string): { r: number; g: number; b: number } => {
      const clean = hex.trim().replace('#', '');
      if (clean.length === 3) {
        const r = parseInt(clean[0] + clean[0], 16);
        const g = parseInt(clean[1] + clean[1], 16);
        const b = parseInt(clean[2] + clean[2], 16);
        return { r, g, b };
      }
      if (clean.length === 6) {
        return {
          r: parseInt(clean.slice(0, 2), 16),
          g: parseInt(clean.slice(2, 4), 16),
          b: parseInt(clean.slice(4, 6), 16),
        };
      }
      return { r: 16, g: 16, b: 33 };
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;
      // Prime position in view and paint base
      updateTargetFromClient(rect.left + rect.width / 2, rect.top + rect.height / 3);
      const computedBg = getComputedStyle(document.body).backgroundColor;
      baseColorRef.current = parseRgb(computedBg);
      // Pull brand colors from CSS variables
      const root = getComputedStyle(document.documentElement);
      const purple = root.getPropertyValue('--color-red-electrica') || '#422BE2';
      const red = root.getPropertyValue('--color-alerta') || '#f93243';
      const mint = root.getPropertyValue('--color-billete-nuevot') || '#9bd1b8';
      brandColorsRef.current = [parseHex(purple), parseHex(red), parseHex(mint)];
      const base = baseColorRef.current;
      ctx.fillStyle = `rgb(${base.r},${base.g},${base.b})`;
      ctx.fillRect(0, 0, rect.width, rect.height);
    };
    resize();
    const animationId = requestAnimationFrame(animate);
    
    // Add mouse/touch interaction
    const handlePointerMove = (e: PointerEvent) => {
      updateTargetFromClient(e.clientX, e.clientY);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // GSAP animations for modal entrance
    const modal = modalRef.current;
    const closeButton = closeButtonRef.current;
    const tl = gsap.timeline();

    // Set initial state
    gsap.set(modal, {
      opacity: 0,
      scale: 0.8,
      rotationX: -15
    });

    // Set initial state for close button
    if (closeButton) {
      gsap.set(closeButton, {
        scale: 0,
        rotation: -180,
        opacity: 0
      });
    }

    // Animate modal in
    tl.to(modal, {
      opacity: 1,
      scale: 1,
      rotationX: 0,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });

    // Animate close button in (same as full-height menu)
    if (closeButton) {
      tl.fromTo(
        closeButton,
        {
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking on the backdrop (outside the modal container)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.fluidContainer} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.fluidCanvas} />
        <div className={styles.grainOverlay} style={{ backgroundImage: `url(${withBase('images/temp/grain.webp')})` }} />
        <div className={styles.fluidNoise} />
      </div>
      
      <div className={styles.modalContainer} ref={modalRef}>
        <button
          ref={closeButtonRef}
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        
        <div className={styles.modalContent}>
          {title && (
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
            </div>
          )}
          
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
