import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

interface ScrollStackItemProps {
  children: React.ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = ''
}) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>
    {children}
  </div>
);

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  baseScale?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 120,
  itemScale = 0.02,
  itemStackDistance = 25,
  baseScale = 0.88,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Get all cards
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;

    // Initialize cards with base styles
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.transformOrigin = 'top center';
      card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease';
      card.dataset.stackIndex = i.toString();
    });

    // Smooth scroll setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 1,
      lerp: 0.08,
      syncTouch: true,
      syncTouchLerp: 0.075
    });

    lenisRef.current = lenis;

    // Animation loop
    const animate = () => {
      const scrollTop = useWindowScroll ? window.scrollY : scroller.scrollTop;
      const viewportHeight = useWindowScroll ? window.innerHeight : scroller.clientHeight;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardTop = useWindowScroll ? cardRect.top + scrollTop : card.offsetTop;
        const progress = Math.max(0, Math.min(1, (scrollTop - cardTop + viewportHeight * 0.3) / (viewportHeight * 0.6)));

        // Calculate transforms
        const translateY = i * itemStackDistance * (1 - progress);
        const scale = baseScale + (i * itemScale * progress);

        // Apply transforms smoothly
        card.style.transform = `translateY(${translateY}px) scale(${Math.max(0.1, scale)})`;
      });

      lenis.raf(Date.now());
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle scroll
    const handleScroll = () => {
      // Animation is handled in the animate loop
    };

    if (useWindowScroll) {
      lenis.on('scroll', handleScroll);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    baseScale,
    useWindowScroll,
    onStackComplete
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;