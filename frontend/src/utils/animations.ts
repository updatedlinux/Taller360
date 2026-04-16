import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const isBrowser = typeof window !== 'undefined';

// Helpers to read optional data-* overrides from DOM
const readNumberAttr = (element: HTMLElement, name: string): number | undefined => {
  const raw = element.getAttribute(`data-${name}`);
  if (!raw) return undefined;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : undefined;
};

const readStringAttr = (element: HTMLElement, name: string): string | undefined => {
  return element.getAttribute(`data-${name}`) || undefined;
};

const isElementInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
};

const createScrollTriggerConfig = (element: HTMLElement): ScrollTrigger.Vars => ({
  trigger: element,
  start: 'top 80%',
  once: true,
});

const animateElements = (selector: string, vars: gsap.TweenVars) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  elements.forEach((element) => {
    const delayAttr = element.getAttribute('data-delay');
    const delay = delayAttr ? parseFloat(delayAttr) : 0;
    const durationOverride = readNumberAttr(element, 'duration');
    const easeOverride = readStringAttr(element, 'ease');
    const distanceOverride = readNumberAttr(element, 'distance');
    const skewOverride = readNumberAttr(element, 'skew');
    const rotateOverride = readNumberAttr(element, 'rotate');

    // Clone vars to avoid mutating caller object
    const computedVars: gsap.TweenVars = { ...vars };

    // Apply distance override in the same axis direction as provided
    if (typeof distanceOverride === 'number') {
      if (typeof computedVars.y === 'number') {
        const sign = computedVars.y >= 0 ? 1 : -1;
        computedVars.y = sign * distanceOverride;
      } else if (typeof computedVars.x === 'number') {
        const sign = computedVars.x >= 0 ? 1 : -1;
        computedVars.x = sign * distanceOverride;
      }
    }

    // Optional subtle skew based on movement axis
    if (typeof skewOverride === 'number') {
      if (typeof computedVars.y === 'number') {
        (computedVars as any).skewY = skewOverride;
      } else if (typeof computedVars.x === 'number') {
        (computedVars as any).skewX = skewOverride;
      }
    }

    if (typeof rotateOverride === 'number') {
      computedVars.rotate = rotateOverride;
    }

    const baseVars: gsap.TweenVars = {
      ease: 'power2.out',
      duration: 0.9,
      ...computedVars,
      delay,
      // Allow per-element overrides via data-*
      ...(durationOverride !== undefined ? { duration: durationOverride } : {}),
      ...(easeOverride ? { ease: easeOverride } : {}),
    };

    if (isElementInViewport(element)) {
      gsap.from(element, baseVars);
    } else {
      gsap.from(element, {
        ...baseVars,
        scrollTrigger: createScrollTriggerConfig(element),
        immediateRender: false,
      });
    }
  });
};

export const initAnimations = () => {
  if (!isBrowser) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.globalTimeline.clear();
    return;
  }

  // Optional parent-based stagger: apply incremental delays to children
  const applyGroupStaggers = () => {
    const groups = gsap.utils.toArray<HTMLElement>('[data-stagger]');
    groups.forEach((group) => {
      const step = parseFloat(group.getAttribute('data-stagger') || '0');
      if (!Number.isFinite(step) || step <= 0) return;
      const children = group.querySelectorAll<HTMLElement>('[data-animate]');
      children.forEach((child, index) => {
        const existing = child.getAttribute('data-delay');
        const existingDelay = existing ? parseFloat(existing) : 0;
        const baseDelay = Number.isFinite(existingDelay) ? existingDelay : 0;
        const total = baseDelay + index * step;
        child.setAttribute('data-delay', String(total));
      });
    });
  };

  applyGroupStaggers();

  // Core effects with upgraded easing and sensible defaults
  animateElements('[data-animate="fade"]', { opacity: 0 });
  animateElements('[data-animate="fade-up"]', { opacity: 0, y: 40 });
  animateElements('[data-animate="fade-down"]', { opacity: 0, y: -40 });
  animateElements('[data-animate="fade-left"]', { opacity: 0, x: 40 });
  animateElements('[data-animate="fade-right"]', { opacity: 0, x: -40 });
  animateElements('[data-animate="scale"]', { opacity: 0, scale: 0.9 });

  // New richer effects
  animateElements('[data-animate="blur-up"]', {
    opacity: 0,
    y: 24,
    filter: 'blur(12px)',
    // Clear the filter so element remains crisp after animation
    clearProps: 'filter',
  });

  animateElements('[data-animate="tilt"]', {
    opacity: 0,
    y: 24,
    rotationX: -8,
    transformPerspective: 800,
    transformOrigin: '50% 100%',
    ease: 'power3.out',
  });

  animateElements('[data-animate="reveal-up"]', {
    opacity: 0,
    y: 24,
    clipPath: 'inset(15% 0% 0% 0%)',
    ease: 'power3.out',
  });

  // CTA micro-interactions (opt-in via data-cta-pulse)
  const initCTAPulse = () => {
    const ctas = gsap.utils.toArray<HTMLElement>('[data-cta-pulse]');
    ctas.forEach((el) => {
      const tl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
      tl.to(el, { scale: 1.045, duration: 1.2, ease: 'sine.inOut' });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(0),
        onLeaveBack: () => tl.pause(0),
        once: false,
      });

      el.addEventListener('mouseenter', () => tl.pause());
      el.addEventListener('mouseleave', () => tl.play());
    });
  };

  initCTAPulse();

  const counterElements = gsap.utils.toArray<HTMLElement>('[data-counter]');

  counterElements.forEach((element) => {
    const originalText = element.textContent ?? '';
    const finalValue = parseFloat(originalText);

    if (Number.isNaN(finalValue)) {
      return;
    }

    const counterTarget = { value: 0 };
    const counterVars: gsap.TweenVars = {
      value: finalValue,
      duration: 2,
      ease: 'power1.inOut',
      onStart: () => {
        element.textContent = '0.0000';
      },
      onUpdate(this: gsap.core.Tween) {
        const { value } = this.targets()[0] as { value: number };
        element.textContent = value.toFixed(4);
      },
      onComplete: () => {
        element.textContent = originalText;
      },
    };

    if (isElementInViewport(element)) {
      gsap.fromTo(counterTarget, { value: 0 }, counterVars);
    } else {
      gsap.fromTo(counterTarget, { value: 0 }, {
        ...counterVars,
        scrollTrigger: createScrollTriggerConfig(element),
        immediateRender: false,
      });
    }
  });
};

// Parallax effect for hero sections
export const initParallax = () => {
  const parallaxElements = gsap.utils.toArray('[data-parallax]');

  parallaxElements.forEach((element: any) => {
    const speed = element.getAttribute('data-parallax-speed') || 0.5;

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
};

// Section color transitions
export const initColorTransitions = () => {
  const sections = gsap.utils.toArray('section[data-bg-color]');

  sections.forEach((section: any) => {
    const bgColor = section.getAttribute('data-bg-color');

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to('body', {
          backgroundColor: bgColor,
          duration: 0.6,
        });
      },
      onEnterBack: () => {
        gsap.to('body', {
          backgroundColor: bgColor,
          duration: 0.6,
        });
      },
    });
  });
};

// Carousel animation with GSAP
export const initCarousel = (element: HTMLElement) => {
  const track = element.querySelector('.carousel-track');
  if (!track) return;

  const items = track.children;
  const itemWidth = items[0].getBoundingClientRect().width;
  const totalWidth = itemWidth * items.length;

  gsap.to(track, {
    x: -totalWidth / 2,
    duration: 20,
    ease: 'none',
    repeat: -1,
  });
};

// Clean up ScrollTrigger on unmount
export const cleanupAnimations = () => {
  // Kill all ScrollTriggers with revert=true to restore DOM structure (important for pinned elements)
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill(true);
  });
};
