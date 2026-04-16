import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { withBase } from '../../utils/base';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../../components/Section';
import CTAButton from '../../components/CTAButton';
import PartnersMarquee from '../../components/PartnersMarquee';
import MapModal from '../../components/MapModal';
import ImageGallerySlider from '../../components/ImageGallerySlider';
import SEO from '../../components/SEO';
import { getExchangeRates, getBCVDate } from '../../api/rates';
import { organizationSchema, websiteSchema } from '../../utils/structuredData';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const afterImageRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const revealTextRef = useRef<HTMLParagraphElement>(null);
  const revealTextRef2 = useRef<HTMLParagraphElement>(null);
  const usdRateRef = useRef<HTMLParagraphElement>(null);
  const eurRateRef = useRef<HTMLParagraphElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number>(160.4479);
  const [eurRate, setEurRate] = useState<number>(188.0289);
  const [bcvDate, setBcvDate] = useState<string>('19 / 09 / 2025');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const [activePaymentCard, setActivePaymentCard] = useState<number>(1); // Default to middle card (Crédito inmediato)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    // Fetch the SVG content
    fetch(withBase('logos/isologo_naked.svg'))
      .then(response => response.text())
      .then(svg => setSvgContent(svg));
  }, []);

  // Lazy load Spline viewer before it enters viewport
  useEffect(() => {
    if (!splineContainerRef.current) return;

    const loadSplineScript = () => {
      if (document.querySelector('script[src*="spline-viewer"]')) {
        setIsSplineLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.76/build/spline-viewer.js';
      script.onload = () => setIsSplineLoaded(true);
      document.head.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Load when element is 500px away from viewport
          if (entry.isIntersecting) {
            loadSplineScript();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '500px', // Start loading 500px before element enters viewport
        threshold: 0
      }
    );

    observer.observe(splineContainerRef.current);

    return () => observer.disconnect();
  }, []);

  // Fetch real exchange rates from BCV API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getExchangeRates();
        const usd = rates.find(r => r.code === 'USD');
        const eur = rates.find(r => r.code === 'EUR');

        if (usd) {
          // Use the middle rate (average of buy and sell)
          setUsdRate((usd.buy + usd.sell) / 2);
        }

        if (eur) {
          // Use the middle rate (average of buy and sell)
          setEurRate((eur.buy + eur.sell) / 2);
        }

        // Fetch BCV date
        const date = await getBCVDate();
        setBcvDate(date);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Keep default values if fetch fails
      }
    };

    fetchRates();
  }, []);

  // Ensure video loads properly on mobile
  useEffect(() => {
    if (!afterImageRef.current) return;

    const video = afterImageRef.current;

    // Force video to load on mobile
    video.load();

    // Handle mobile autoplay restrictions
    const handleCanPlay = () => {
      // Video is ready to play
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useLayoutEffect(() => {
    if (!logoRef.current || !svgContent || !imageWrapperRef.current || !maskRef.current || !afterImageRef.current || !sectionRef.current) return;

    const svg = logoRef.current.querySelector('svg');
    if (!svg) return;

    // Use GSAP context for proper cleanup (recommended for React)
    const ctx = gsap.context(() => {
      const paths = svg.querySelectorAll('path');

      // Track video state for scroll control
      let hasPlayedVideo = false;
      const videoStartPosition = 1 + (2 * 0.9);
      const videoPlayThreshold = videoStartPosition / 3;
      const maskFadeEndPosition = 1 + 0.2;
      const maskFadeThreshold = maskFadeEndPosition / 3;

      // Create a timeline for the entire sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          scrub: true, // Use true instead of number for smoother reverse
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true, // Helps with fast scroll performance
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress >= videoPlayThreshold && !hasPlayedVideo) {
              if (afterImageRef.current && afterImageRef.current instanceof HTMLVideoElement) {
                afterImageRef.current.play().catch(() => {});
                hasPlayedVideo = true;
              }
            }

            if (progress < maskFadeThreshold && hasPlayedVideo) {
              if (afterImageRef.current && afterImageRef.current instanceof HTMLVideoElement) {
                afterImageRef.current.pause();
                afterImageRef.current.currentTime = 0;
                hasPlayedVideo = false;
              }
            }
          },
        },
      });

      // Phase 1: Draw the SVG path strokes
      const initialStrokeWidth = 2;

      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: initialStrokeWidth,
          opacity: 1,
        });

        // Draw the stroke
        tl.fromTo(path,
          { strokeDashoffset: length },
          { strokeDashoffset: 0, ease: 'none', duration: 1 },
          0
        );

        // Fade out stroke quickly as mask reveals
        tl.to(path, {
          opacity: 0,
          ease: 'power2.in',
          duration: 0.15,
        }, 1);
      });

      // Set initial state for SVG wrapper and mask (logo shape)
      const initialSize = 22;
      // Scale only needs to cover the viewport diagonal (~15x is plenty)
      // Previous 250x caused massive performance issues and mobile pixelation
      const finalScale = 15;
      const finalSize = initialSize * finalScale;

      gsap.set(logoRef.current, { scale: 1 });
      gsap.set(maskRef.current, { '--mask-size': `${initialSize}rem`, opacity: 0 });

      // Phase 2: Fade in mask and grow to fill viewport (SVG stays at scale 1, no pixelation)
      tl.to(maskRef.current, { opacity: 1, ease: 'power2.out', duration: 0.2 }, 1);
      tl.to(maskRef.current, { '--mask-size': `${finalSize}rem`, ease: 'power2.in', duration: 2 }, 1);
    }, sectionRef); // Scope to the section element

    // Cleanup: revert() kills all animations AND reverts DOM changes (pin wrappers)
    return () => ctx.revert();
  }, [svgContent]);

  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const baseColorRef = useRef<{ r: number; g: number; b: number } | null>(null);
  const brandColorsRef = useRef<Array<{ r: number; g: number; b: number }>>([]);
  type Particle = { x: number; y: number; vx: number; vy: number; radius: number; life: number; color: { r: number; g: number; b: number } };
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const colorPhaseRef = useRef(0);
  const prevPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastAngleRef = useRef(0);
  const lastMoveTimeRef = useRef<number>(performance.now());
  const SECONDARY_GLOW_ENABLED = false;
  const PARTICLES_ENABLED = false;
  const TRAIL_ENABLED = true;
  const trailRef = useRef<Array<{ x: number; y: number; angle: number; speed: number; color: { r: number; g: number; b: number } }>>([]);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

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
    const trailFade = isScrollingRef.current ? 0.25 : 0.012;
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
          { r: 66, g: 43, b: 226 },
          { r: 249, g: 50, b: 67 },
          { r: 155, g: 209, b: 184 },
        ];
    const mix = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) => ({
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    });
    // Update phase: base time-driven plus velocity contribution
    const baseSpeed = 0.35; // cycles per second
    const moveFactor = 0.012; // extra cycles per px of movement
    colorPhaseRef.current += dt * baseSpeed + speed * moveFactor * dt;
    const n = colors.length;
    const phase = colorPhaseRef.current;
    const idx = Math.floor(phase) % n;
    const t = phase - Math.floor(phase);
    const cA = colors[idx];
    const cB = colors[(idx + 1) % n];
    const c1 = mix(cA, cB, t);
    const phase2 = phase + 0.5; // offset second color
    const idx2 = Math.floor(phase2) % n;
    const t2 = phase2 - Math.floor(phase2);
    const dA = colors[idx2];
    const dB = colors[(idx2 + 1) % n];
    const c2 = mix(dA, dB, t2);

    // Primary glow at cursor with motion-based shaping
    const speedNorm = Math.min(1, speed / 60);
    const scaleX = 1 + speedNorm * 0.9;   // stronger elongation along motion
    const scaleY = 1 - speedNorm * 0.85;  // thinner across motion
    const shrink = 1 - speedNorm * 0.45;  // more shrink when fast
    const r1 = Math.max(width, height) * 0.14 * shrink;

    // Core tint
    ctx.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scaleX, scaleY);
    const coreRadius = r1 * 0.18;
    const coreAlpha = 0.05 + 0.18 * speedNorm; // dim when static, slightly brighter on fast moves
    ctx.fillStyle = `rgba(${c1.r},${c1.g},${c1.b},${coreAlpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
    ctx.fill();

    // Additive bloom
    const gr1 = ctx.createRadialGradient(0, 0, 0, 0, 0, r1);
    const bloomAlpha = 0.08 + 0.14 * speedNorm; // responsive brightness
    gr1.addColorStop(0, `rgba(${c1.r},${c1.g},${c1.b},${bloomAlpha})`);
    gr1.addColorStop(1, `rgba(${c1.r},${c1.g},${c1.b},0)`);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gr1;
    ctx.beginPath();
    ctx.arc(0, 0, r1 * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Main brush trail (stamped ellipses along recent motion)
    if (TRAIL_ENABLED) {
      // Reduce trail count during scroll for performance
      const maxTrail = isScrollingRef.current ? 6 : 24;
      const speedNorm = Math.min(1, Math.hypot(vx, vy) / 60);
      const trailColor = c1;
      trailRef.current.push({ x, y, angle, speed: speedNorm, color: trailColor });
      if (trailRef.current.length > maxTrail) trailRef.current.shift();

      for (let i = 0; i < trailRef.current.length; i += 1) {
        const node = trailRef.current[i];
        const t = i / (trailRef.current.length - 1 || 1);
        // Older nodes: larger radius but lower alpha, gently elongated by their recorded speed
        const baseR = Math.max(width, height) * 0.11;
        const rr = baseR * (0.3 + t * 0.8);
        const sx = 1 + node.speed * 0.7 * (0.25 + t);
        const sy = 1 - node.speed * 0.75 * (0.25 + t);
        const alpha = 0.16 * Math.pow(t, 1.4);

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.angle);
        ctx.scale(sx, sy);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rr);
        g.addColorStop(0, `rgba(${node.color.r},${node.color.g},${node.color.b},${alpha * 0.5})`);
        g.addColorStop(1, `rgba(${node.color.r},${node.color.g},${node.color.b},0)`);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Secondary offset glow
    if (SECONDARY_GLOW_ENABLED) {
      const trailingOffset = 18 + speedNorm * 30;
      const sx = x - Math.cos(angle) * trailingOffset + 8;
      const sy = y - Math.sin(angle) * trailingOffset - 8;
      const r2 = Math.max(width, height) * 0.1;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(1 + speedNorm * 0.3, 1 - speedNorm * 0.4);
      const gr2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r2);
      gr2.addColorStop(0, `rgba(${c2.r},${c2.g},${c2.b},0.22)`);
      gr2.addColorStop(1, `rgba(${c2.r},${c2.g},${c2.b},0)`);
      ctx.fillStyle = gr2;
      ctx.beginPath();
      ctx.arc(0, 0, r2 * 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Particle-based trail (optional)
    if (PARTICLES_ENABLED) {
      const spawn = Math.min(6, 2 + Math.floor(speed * 0.035));
      for (let i = 0; i < spawn; i += 1) {
        const angleJitter = (Math.random() - 0.5) * 0.25;
        const mag = 0.12 + Math.random() * 0.12; // gentle initial push
        const pvx = vx * mag;
        const pvy = vy * mag;
        const colMixT = Math.random();
        const col = mix(c1, c2, colMixT);
        const lagDist = 8 + Math.min(40, speed * 0.15);
        const px = x - (vx === 0 && vy === 0 ? 0 : (vx / (Math.hypot(vx, vy) || 1)) * lagDist) + (Math.random() - 0.5) * 6;
        const py = y - (vx === 0 && vy === 0 ? 0 : (vy / (Math.hypot(vx, vy) || 1)) * lagDist) + (Math.random() - 0.5) * 6;
        particlesRef.current.push({
          x: px,
          y: py,
          vx: pvx * Math.cos(angleJitter) - pvy * Math.sin(angleJitter),
          vy: pvx * Math.sin(angleJitter) + pvy * Math.cos(angleJitter),
          radius: Math.max(width, height) * (0.035 + Math.random() * 0.015),
          life: 1,
          color: col,
        });
      }
      const curl = 0.03;           // subtle curl
      const advect = 0.0018;       // gentle attraction for interaction
      const grow = 1.006;          // slow expansion
      const drag = 0.965;          // more damping -> slower motion, longer presence
      const particles = particlesRef.current;
      const interactionRadius = Math.max(width, height) * 0.12; // cursor influence radius
      const splitRadius = interactionRadius * 0.45;
      const additions: typeof particles = [];
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        const rot = curl * Math.sin((now * 0.002) + (p.x + p.y) * 0.002);
        const rvx = p.vx * Math.cos(rot) - p.vy * Math.sin(rot);
        const rvy = p.vx * Math.sin(rot) + p.vy * Math.cos(rot);
        // Base advection toward cursor
        p.vx = rvx * drag + (x - p.x) * advect;
        p.vy = rvy * drag + (y - p.y) * advect;

        // Cursor interaction: if close, swirl, push, and color-mix
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist < interactionRadius) {
          const influence = 1 - dist / interactionRadius;
          // Tangential swirl (perpendicular to cursor vector)
          const tx = -dy / dist;
          const ty = dx / dist;
          p.vx += tx * influence * 0.6;
          p.vy += ty * influence * 0.6;
          // Soft push away to avoid clumping
          p.vx += (dx / dist) * influence * 0.15;
          p.vy += (dy / dist) * influence * 0.15;
          // Blend color toward current brush mix
          const brushMix = mix(c1, c2, 0.5);
          p.color = mix(p.color, brushMix, 0.25 * influence);
          // Occasionally split into a child for “paint break-up”
          if (dist < splitRadius && p.radius > Math.max(width, height) * 0.02 && Math.random() < 0.08) {
            const child: typeof p = {
              x: p.x + (Math.random() - 0.5) * 6,
              y: p.y + (Math.random() - 0.5) * 6,
              vx: -p.vx * 0.3 + (Math.random() - 0.5) * 0.5,
              vy: -p.vy * 0.3 + (Math.random() - 0.5) * 0.5,
              radius: p.radius * 0.6,
              life: p.life,
              color: p.color,
            };
            additions.push(child);
            // Shrink parent a bit
            p.radius *= 0.85;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.radius *= grow;
        p.life *= 0.997; // slower fade -> longer trails

        const alpha = 0.25 * p.life;
        if (alpha > 0.002) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grd.addColorStop(0, `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`);
          grd.addColorStop(1, `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.life < 0.03 || p.x < -100 || p.y < -100 || p.x > width + 100 || p.y > height + 100) {
          particles.splice(i, 1);
        }
      }
      if (additions.length) particles.push(...additions);
    } else if (particlesRef.current.length) {
      particlesRef.current = [];
    }

    // Reset composition for next frame base clear
    ctx.globalCompositeOperation = 'source-over';
    rafRef.current = requestAnimationFrame(animate);
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

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    updateTargetFromClient(e.clientX, e.clientY);
  };

  const handleHeroPointerEnter = () => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(animate);
  };

  const handleHeroPointerLeave = () => {
    // Keep animation running; switch to idle drift automatically
  };

  useEffect(() => {
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
    window.addEventListener('resize', resize);
    const onMove = (e: MouseEvent) => updateTargetFromClient(e.clientX, e.clientY);
    window.addEventListener('mousemove', onMove);
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  // Scroll detection for performance optimization
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll reveal text effect
  useEffect(() => {
    if (!revealTextRef.current) return;

    const element = revealTextRef.current;
    const originalText = element.textContent || '';
    const words = originalText.split(' ');

    // Wrap each word in a span
    element.innerHTML = words
      .map(word => `<span class="word" style="color: rgba(231, 233, 228, 0.15); transition: color 0.3s ease;">${word}</span>`)
      .join(' ');

    const spans = element.querySelectorAll('span.word');

    // Create one ScrollTrigger for the whole paragraph
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      end: 'center 50%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        spans.forEach((span, index) => {
          const wordProgress = index / (spans.length - 1);

          if (progress >= wordProgress) {
            (span as HTMLElement).style.color = 'rgb(231, 233, 228)';
          } else {
            (span as HTMLElement).style.color = 'rgba(231, 233, 228, 0.15)';
          }
        });
      },
    });

    return () => {
      trigger.kill();
      // Restore original text content to prevent React reconciliation errors
      element.textContent = originalText;
    };
  }, []);

  // Scroll reveal text effect for second paragraph
  useEffect(() => {
    if (!revealTextRef2.current) return;

    const element = revealTextRef2.current;
    const originalText = element.textContent || '';
    const words = originalText.split(' ');

    // Wrap each word in a span
    element.innerHTML = words
      .map(word => `<span class="word" style="color: rgba(231, 233, 228, 0.15); transition: color 0.3s ease;">${word}</span>`)
      .join(' ');

    const spans = element.querySelectorAll('span.word');

    // Create one ScrollTrigger for the whole paragraph
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      end: 'center 50%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        spans.forEach((span, index) => {
          const wordProgress = index / (spans.length - 1);

          if (progress >= wordProgress) {
            (span as HTMLElement).style.color = 'rgb(231, 233, 228)';
          } else {
            (span as HTMLElement).style.color = 'rgba(231, 233, 228, 0.15)';
          }
        });
      },
    });

    return () => {
      trigger.kill();
      // Restore original text content to prevent React reconciliation errors
      element.textContent = originalText;
    };
  }, []);

  // Animate exchange rates numbers on load
  useEffect(() => {
    const animateNumber = (element: HTMLElement, targetValue: number, decimals: number = 4) => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: targetValue,
        duration: 4.5,
        delay: 0.5,
        ease: 'power4.out',
        onUpdate: () => {
          element.textContent = `Bs. ${obj.value.toFixed(decimals).replace('.', ',')}`;
        },
      });
    };

    // Add a small delay to ensure refs are ready
    const timer = setTimeout(() => {
      if (usdRateRef.current) {
        animateNumber(usdRateRef.current, usdRate, 4);
      }

      if (eurRateRef.current) {
        animateNumber(eurRateRef.current, eurRate, 4);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [usdRate, eurRate]);

  return (
    <>
      <SEO
        title="Insular Casa de Cambio - Recibe dinero de otros países"
        description="Casa de cambios autorizada por SUDEBAN, con más de 35 años de trayectoria. Conectamos familias con soluciones rápidas, seguras y sin complicaciones para cambio de divisas."
        keywords="casa de cambio, tipo de cambio, cambio de divisas, dólar Venezuela, compra venta dólares, remesas, transferencias internacionales, Caracas, SUDEBAN"
        canonical="/"
        ogImage="/images/hero/home-hero.webp"
        ogImageAlt="Insular Casa de Cambio - Los mejores tipos de cambio en Venezuela"
        structuredData={[organizationSchema, websiteSchema]}
      />

      {/* Hero Section - Full width with rates inside */}
      <Section
        ref={heroRef}
        className={styles.hero}
        id="hero"
        onPointerMove={handleHeroPointerMove}
        onPointerEnter={handleHeroPointerEnter}
        onPointerLeave={handleHeroPointerLeave}
      >
        <div className={styles.fluidContainer} aria-hidden="true">
          <canvas ref={canvasRef} className={styles.fluidCanvas} />
          <div
            className={styles.grainOverlay}
            style={{
              backgroundImage: `url(${withBase('images/temp/grain.webp')})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
          <div className={styles.fluidNoise} />
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 data-animate="fade-up">
                Casa de<br />
                Cambio
              </h1>
              <div className={styles.heroActions} data-animate="fade-up" data-delay="0.2">
                <div className="btn-wrapper">
                  <CTAButton text="Nuestros aliados" href="/aliados" />
                </div>
                <div className={styles.heroSubtext}>
                  <span className={styles.subtextText}>Envia y recibe dinero desde y hacia Venezuela a través de nuestros aliados internacionales.</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImageWrapper} data-animate="fade-left">
              <img
                src={withBase('images/hero/home-hero.webp')}
                alt="Cliente feliz usando Insular"
                className={styles.heroImage}
              />
            </div>
          </div>

          {/* Exchange Rates - Inside Hero */}
          <div className={styles.ratesGrid}>
            <div className={`${styles.rateCard} ${styles.rateCardUsd}`} data-animate="fade-up">
              <div className={styles.rateHeader}>
                  <p className={styles.rateLabel}>Cambio US$</p>
                <span className={styles.rateIcon}>
                  <img src={withBase('icons/arrow_top-right_naked.svg')} alt="trending" />
                </span>
              </div>
              <p ref={usdRateRef} className={styles.rateValue}>Bs. 0,0000</p>
            </div>
            <div className={`${styles.rateCard} ${styles.rateCardEur}`} data-animate="fade-up" data-delay="0.1">
              <div className={styles.rateHeader}>
                  <p className={styles.rateLabel}>Cambio EUR€</p>
                <span className={styles.rateIcon}>
                  <img src={withBase('icons/arrow_top-right_naked.svg')} alt="trending" />
                </span>
              </div>
              <p ref={eurRateRef} className={styles.rateValue}>Bs. 0,0000</p>
            </div>
            <div className={`${styles.rateCard} ${styles.rateCardDate}`} data-animate="fade-up" data-delay="0.2">
              <div className={styles.rateHeader}>
                  <p className={styles.rateLabel}>Fecha</p>
                <span className={styles.rateIcon}>
                  <img src={withBase('icons/arrow_top-right_naked.svg')} alt="trending" />
                </span>
              </div>
              <p className={styles.rateValue}>{bcvDate}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Image Gallery Slider */}
      <ImageGallerySlider images={[
        { src: withBase('images/swiper-carousels/servicios/fachada_1024w.webp'), alt: 'Fachada Insular' },
        { src: withBase('images/swiper-carousels/servicios/clienta_1024w.webp'), alt: 'Clienta' },
        { src: withBase('images/swiper-carousels/nosotros/chichas-sonriendo_1024w.webp'), alt: 'Equipo sonriendo' },
        { src: withBase('images/swiper-carousels/servicios/edificio_1024w.webp'), alt: 'Edificio' },
        { src: withBase('images/swiper-carousels/nosotros/cajera_1024w.webp'), alt: 'Cajera' },
        { src: withBase('images/swiper-carousels/servicios/clienta-taquilla_1024w.webp'), alt: 'Clienta en taquilla' },
        { src: withBase('images/swiper-carousels/servicios/oficina_1024w.webp'), alt: 'Oficina' },
        { src: withBase('images/swiper-carousels/nosotros/empleada_1024w.webp'), alt: 'Empleada' },
        { src: withBase('images/swiper-carousels/servicios/local-frente_1024w.webp'), alt: 'Local frente' },
        { src: withBase('images/swiper-carousels/servicios/cliente_1024w.webp'), alt: 'Cliente' },
      ]} />

      {/* Remittance Section */}
      <Section className={styles.remittanceSection} id="remittance">
        <div className="container">
          <div className={styles.remittanceGrid}>
            <div className={styles.remittanceTitle} data-animate="fade-up">
              <h2>
                ¿Cómo enviar dinero a Venezuela?
              </h2>
            </div>
            <div className={styles.remittanceContent} data-animate="fade-up" data-delay="0.2">
              <p className={styles.revealTextSmall}>
                A través de nuestra red de aliados internacionales, conectamos tu país de residencia con los tuyos.
              </p>
              <div className="btn-wrapper">
                <CTAButton text="Saber más" variant="secondary" href="/aliados" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Partners Marquee Divider */}
      <Section className={styles.marqueeSection}>
        <PartnersMarquee />
      </Section>

      {/* Convocatoria Asamblea 53 */}
      <Section className={styles.announcementSection} id="convocatoria-53">
        <div className="container">
          <div className={styles.announcementCard} data-animate="fade-up">
            <div className={styles.announcementHeader}>
              <span className={styles.announcementBadge}>Convocatoria</span>
              <h3>Asamblea General Extraordinaria de Accionistas</h3>
              <h2 className={styles.announcementTitle}>Casa de Cambios Insular, S.A.</h2>
            </div>
            <div className={styles.announcementContent}>
              <p>
                Se convoca a los señores accionistas de la <strong>Casa de Cambios Insular, S.A.</strong> a una <strong>Asamblea General Extraordinaria de Accionistas</strong> a celebrarse el <strong>martes treinta y uno (31) de marzo de 2026, a las 09:00 a.m.</strong>, en la siguiente dirección: Avenida Francisco de Miranda, Edificio Centro Seguros Sud América, Local PBM-7, Municipio Chacao, El Rosal, estado Miranda, a fin de tratar el siguiente orden del día:
              </p>
              <p><strong>PRIMERO:</strong> Nombramiento de los Auditores Externos.</p>
              <p><strong>SEGUNDO:</strong> Nombramiento del Comisario.</p>
              <p className={styles.announcementSignature}>
                <strong>Por la Junta Directiva</strong><br />
                Caracas, 4 de marzo de 2026
              </p>
              <p className={styles.announcementNote}>
                <strong>NOTA:</strong> La información relacionada con los puntos a tratar, se encuentra a disposición de los accionistas en la dirección antes indicada, a partir de la fecha de publicación de esta convocatoria.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Convocatoria Asamblea 54 */}
      <Section className={styles.announcementSection} id="convocatoria-54">
        <div className="container">
          <div className={styles.announcementCard} data-animate="fade-up">
            <div className={styles.announcementHeader}>
              <span className={styles.announcementBadge}>Convocatoria</span>
              <h3>Asamblea General Extraordinaria de Accionistas</h3>
              <h2 className={styles.announcementTitle}>Casa de Cambios Insular, S.A.</h2>
            </div>
            <div className={styles.announcementContent}>
              <p>
                Se convoca a los señores accionistas de la <strong>Casa de Cambios Insular, S.A.</strong>, a una <strong>Asamblea General Extraordinaria de Accionistas</strong> a celebrarse el <strong>martes treinta y uno (31) de marzo de 2026, a las 11:00 a.m.</strong>, en la siguiente dirección: Avenida Francisco de Miranda, Edificio Centro Seguros Sud América, Local PBM-7, Municipio Chacao, El Rosal, estado Miranda, a fin de tratar el siguiente orden del día:
              </p>
              <p><strong>PRIMERO:</strong> Considerar, ratificar y designar los miembros de la Junta Directiva.</p>
              <p><strong>SEGUNDO:</strong> Considerar resolver la modificación de la Cláusula Vigésima Tercera de los Estatutos Sociales.</p>
              <p className={styles.announcementSignature}>
                <strong>Por la Junta Directiva</strong><br />
                Caracas, 4 de marzo de 2026
              </p>
              <p className={styles.announcementNote}>
                <strong>NOTA:</strong> La información relacionada con los puntos a tratar, se encuentra a disposición de los accionistas en la dirección antes indicada, a partir de la fecha de publicación de esta convocatoria.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Payment Methods Section */}
      <Section ref={sectionRef} className={styles.paymentSection} id="payment">
        <div className="container-fluid">
          <div ref={imageWrapperRef} className={styles.paymentImageWrapper} data-animate="fade-up">
            {/* Before image (base layer) */}
            <img
              src={withBase('images/sections/conexion-before.webp')}
              alt="Recibe dinero a través de pago móvil y crédito inmediato"
              className={styles.paymentImage}
              loading="eager"
            />

            {/* After video (revealed through mask) */}
            <div ref={maskRef} className={styles.paymentMaskWrapper}>
              <video
                ref={afterImageRef}
                className={styles.paymentImageAfter}
                loop
                muted
                playsInline
                preload="metadata"
                poster={withBase('images/sections/conexion-after.webp')}
                webkit-playsinline="true"
                x5-playsinline="true"
              >
                <source src={withBase('media/videos/conexion.mp4')} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* SVG path overlay */}
            <div
              ref={logoRef}
              className={styles.paymentLogoWrapper}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>

          <div className={styles.paymentGrid}>
            <div
              className={`${styles.paymentCard} ${styles.paymentCardPagoMovil} ${activePaymentCard === 0 ? styles.paymentCardActive : styles.paymentCardInactive}`}
              onClick={() => setActivePaymentCard(0)}
              data-animate="fade-up"
              data-delay="0.1"
            >
              <p className={styles.paymentCardText}>Pago móvil</p>
              <p className={styles.paymentCardDescription}>La manera más rápida de recibir los fondos directamente en una cuenta bancaria.</p>
              <span className={styles.paymentCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.26 72.13">
                  <path fill="currentColor" d="M6.93,0v4.2c0,6.13,4.99,11.12,11.12,11.12h23.11S3.66,52.81,3.66,52.81l-.27.27c-4.53,4.53-4.53,11.92,0,16.45l2.6,2.6L51.95,26.17v26.64c0,4.26,3.46,7.66,7.66,7.66h7.66s0-41.96,0-41.96c0-4.93-1.93-9.59-5.39-13.05C58.41,2,53.68.07,48.82.07H6.86s.07-.07.07-.07Z"/>
                </svg>
              </span>
            </div>
            <div
              className={`${styles.paymentCard} ${styles.paymentCardCredito} ${activePaymentCard === 1 ? styles.paymentCardActive : styles.paymentCardInactive}`}
              onClick={() => setActivePaymentCard(1)}
              data-animate="fade-up"
              data-delay="0.2"
            >
              <p className={styles.paymentCardText}>Crédito inmediato</p>
              <p className={styles.paymentCardDescription}>La manera más rápida de recibir los fondos directamente en una cuenta bancaria.</p>
              <span className={styles.paymentCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.26 72.13">
                  <path fill="currentColor" d="M6.93,0v4.2c0,6.13,4.99,11.12,11.12,11.12h23.11S3.66,52.81,3.66,52.81l-.27.27c-4.53,4.53-4.53,11.92,0,16.45l2.6,2.6L51.95,26.17v26.64c0,4.26,3.46,7.66,7.66,7.66h7.66s0-41.96,0-41.96c0-4.93-1.93-9.59-5.39-13.05C58.41,2,53.68.07,48.82.07H6.86s.07-.07.07-.07Z"/>
                </svg>
              </span>
            </div>
            <div
              className={`${styles.paymentCard} ${styles.paymentCardRetiro} ${activePaymentCard === 2 ? styles.paymentCardActive : styles.paymentCardInactive}`}
              onClick={() => setActivePaymentCard(2)}
              data-animate="fade-up"
              data-delay="0.3"
            >
              <p className={styles.paymentCardText}>Retiro físico</p>
              <p className={styles.paymentCardDescription}>Retiro en nuestra agencia física en Caracas: Avenida Francisco de Miranda, Torre Seguros Sudamerica, local PB-7 Urbanización El Rosal, municipio Chacao.</p>
              <span className={styles.paymentCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.26 72.13">
                  <path fill="currentColor" d="M6.93,0v4.2c0,6.13,4.99,11.12,11.12,11.12h23.11S3.66,52.81,3.66,52.81l-.27.27c-4.53,4.53-4.53,11.92,0,16.45l2.6,2.6L51.95,26.17v26.64c0,4.26,3.46,7.66,7.66,7.66h7.66s0-41.96,0-41.96c0-4.93-1.93-9.59-5.39-13.05C58.41,2,53.68.07,48.82.07H6.86s.07-.07.07-.07Z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Global Presence Section */}
      <Section className={styles.globalSection} id="global">
        <div className="container">
          <div className={styles.globalContent}>
            <div ref={splineContainerRef} className={styles.globeCard} data-animate="fade-right">
              {isSplineLoaded && (
                <spline-viewer url="https://prod.spline.design/xF9sYjSjbot07mJD/scene.splinecode"></spline-viewer>
              )}
            </div>
            <div className={styles.globalCard} data-animate="fade-left">
              <p className={styles.globalIntro}>Presentes en</p>
              <h2 className={styles.globalNumber}>13 países</h2>
              <p className={styles.globalDescription}>
                Envía y recibe desde y hacia Venezuela:
              </p>
              <div className={styles.countryList}>
                <div className={styles.countryColumn}>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>México</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Canadá</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Chile</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Colombia</span>
                  </div>
                </div>
                <div className={styles.countryColumn}>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Costa Rica</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Ecuador</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Panamá</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Perú</span>
                  </div>
                </div>
                <div className={styles.countryColumn}>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Estados Unidos</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Alemania</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>España</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Francia</span>
                  </div>
                  <div className={styles.countryItem}>
                    <span className={styles.countryDot}></span>
                    <span>Argentina</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Location Section */}
      <Section className={styles.locationSection} id="location">
        <div className="container">
          <div className={styles.locationContent} data-animate="fade-up">
            <h2>Avenida Francisco de Miranda, Torre Seguros Sudamerica, local PB-7 Urbanización El Rosal, municipio Chacao</h2>
            <div className="btn-wrapper">
              <CTAButton text="Ver en Google Maps" onClick={() => setIsMapModalOpen(true)} />
            </div>
          </div>
        </div>
      </Section>

      {/* Scroll Reveal Text Section */}
      <Section className={styles.revealSection} id="reveal">
        <div className="container">
          <div className={styles.revealText}>
            <p ref={revealTextRef}>
              Ahora puedes realizar tus operaciones de manera sencilla
            </p>
            <p ref={revealTextRef2} className={styles.revealTextSmall}>
              En Casa de Cambios Insular somos una remesadora autorizada por SUDEBAN, con más de 35 años de trayectoria en el sector cambiario. Conectamos familias con soluciones rápidas, seguras y sin complicaciones.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className={styles.faqSection} id="faq">
        <div className="container">
          <div className={styles.faqGrid}>
            <div data-animate="fade-right" className={styles.faqLeft}>
              <h2 className={styles.faqTitle}>Preguntas<br />Frecuentes</h2>
              <div className={styles.faqContent}>
            <div className={styles.faqList}>
              <div className={styles.faqItemWrapper} data-animate="fade-up">
                <button className={`${styles.faqItem} ${openFaqIndex === 0 ? styles.faqItemOpen : ''}`} onClick={() => toggleFaq(0)}>
                  <span>¿Qué necesito para recibir mi remesa?</span>
                  <span className={styles.faqIcon}>{openFaqIndex === 0 ? '−' : '+'}</span>
                </button>
                {openFaqIndex === 0 && (
                  <div className={styles.faqAnswer}>
                    <p>Necesitas tu cédula de identidad vigente y el código de seguimiento proporcionado por quien envía el dinero.</p>
                  </div>
                )}
              </div>
              <div className={styles.faqItemWrapper} data-animate="fade-up" data-delay="0.1">
                <button className={`${styles.faqItem} ${openFaqIndex === 1 ? styles.faqItemOpen : ''}`} onClick={() => toggleFaq(1)}>
                  <span>¿En cuánto tiempo la recibo?</span>
                  <span className={styles.faqIcon}>{openFaqIndex === 1 ? '−' : '+'}</span>
                </button>
                {openFaqIndex === 1 && (
                  <div className={styles.faqAnswer}>
                    <p>Las remesas están disponibles para retirar en minutos después de ser enviadas.</p>
                  </div>
                )}
              </div>
              <div className={styles.faqItemWrapper} data-animate="fade-up" data-delay="0.2">
                <button className={`${styles.faqItem} ${openFaqIndex === 2 ? styles.faqItemOpen : ''}`} onClick={() => toggleFaq(2)}>
                  <span>¿Dónde puedo retirar en dólares?</span>
                  <span className={styles.faqIcon}>{openFaqIndex === 2 ? '−' : '+'}</span>
                </button>
                {openFaqIndex === 2 && (
                  <div className={styles.faqAnswer}>
                    <p>Puedes retirar en nuestras oficinas ubicadas en Caracas.</p>
                  </div>
                )}
              </div>
              <div className={styles.faqItemWrapper} data-animate="fade-up" data-delay="0.3">
                <button className={`${styles.faqItem} ${openFaqIndex === 3 ? styles.faqItemOpen : ''}`} onClick={() => toggleFaq(3)}>
                  <span>¿Cuáles son los aliados disponibles en mi zona?</span>
                  <span className={styles.faqIcon}>{openFaqIndex === 3 ? '−' : '+'}</span>
                </button>
                {openFaqIndex === 3 && (
                  <div className={styles.faqAnswer}>
                    <p>Contamos con B89, Papaya, TSG y Panamericash como aliados internacionales para el envío de remesas desde 13 países hacia Venezuela.</p>
                  </div>
                )}
              </div>
              <div className={styles.faqItemWrapper} data-animate="fade-up" data-delay="0.4">
                <button className={`${styles.faqItem} ${openFaqIndex === 4 ? styles.faqItemOpen : ''}`} onClick={() => toggleFaq(4)}>
                  <span>¿Cuáles son las tarifas y comisiones por Remesa?</span>
                  <span className={styles.faqIcon}>{openFaqIndex === 4 ? '−' : '+'}</span>
                </button>
                {openFaqIndex === 4 && (
                  <div className={styles.faqAnswer}>
                    <p>Las tarifas varían según el monto y el país de origen. No cobramos comisión adicional por el retiro en nuestras oficinas.</p>
                  </div>
                )}
              </div>
            </div>
            </div>
            </div>

            <div data-animate="fade-left" className={styles.faqCtaContainer}>
              <div className={styles.faqCtaCard}>
                <div
                  className={styles.faqCtaImage}
                  style={{
                    backgroundImage: `url(${withBase('images/temp/confianza.webp')})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                ></div>
                <div className={styles.faqCtaContent}>
                  <h2 className="h2 text-white">¿Aún tienes alguna pregunta?</h2>
                  <p className="text-white">
                    ¿No encuentras la respuesta a tu pregunta? Habla con nuestro Chat para resolver cualquier inquietud.
                  </p>
                  <div className={styles.faqCtaSpacer}></div>
                  <CTAButton text="Hablar con Chat" variant="secondary" href="https://wa.me/584142093083" target="_blank" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className={styles.finalCta} id="final-cta">
        <div className="container">
          <div className={styles.finalCtaCard} data-animate="fade-up">
            <h2>Envia y recibe dinero desde y hacia Venezuela.</h2>
            <CTAButton text="¡Empieza ahora!" href="/contacto" />
          </div>
        </div>
      </Section>

      {/* Map Modal */}
      <MapModal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} />
    </>
  );
};

export default Home;
