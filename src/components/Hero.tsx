import { ArrowDown, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { env } from '@/config/env';
import { TextLoop } from '@/components/ui/text-loop';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const VIDEO_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1771006702/0213_3_ftmadc.mp4';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Hide scroll indicator after 3 seconds
    const timer = setTimeout(() => setShowScrollIndicator(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Detect reduced motion preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();

    if (media.addEventListener) {
      media.addEventListener('change', onChange);
    } else {
      media.addListener(onChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Ensure video plays continuously
  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="tech-hero relative overflow-hidden h-screen flex items-center justify-start pt-16"
    >
      {/* Background Video with Native Loop + Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.85) contrast(1.05) saturate(0.95) blur(0.5px)',
            transform: prefersReducedMotion ? 'none' : `scale(1.1) translateY(-${scrollY * 0.1}px)`,
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Animated gradient overlay for continuous movement */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: prefersReducedMotion 
            ? 'transparent' 
            : `radial-gradient(ellipse at ${50 + Math.sin(scrollY * 0.01) * 10}% ${50 + Math.cos(scrollY * 0.01) * 10}%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)`,
        }}
      />

      {/* Subtle gradient effects */}
      <div className="absolute inset-0 transition-all duration-1000 ease-out z-[1]" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, hsla(var(--primary) / ${isLoaded ? '0.1' : '0'}) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, hsla(var(--accent) / ${isLoaded ? '0.08' : '0'}) 0%, transparent 50%)`
      }} />

      {/* Main Content Container */}
      <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`w-full max-w-2xl space-y-5 sm:space-y-6 lg:space-y-8 transition-all duration-1000 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>

          {/* 1 Pequeno texto contextual */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/25 to-brand-green/25 backdrop-blur-md px-4 py-2 rounded-full border border-primary/40 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-white">Ecossistema Digital & Técnico 360</span>
          </div>

          {/* 2 Headline Grande (Dominante) */}
          <h1 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] xl:text-[72px] font-extrabold tracking-[-0.02em] leading-[1.05] sm:leading-[1.05] lg:leading-[1.05] text-white drop-shadow-2xl">
            Tudo que o Seu Negócio Precisa para Crescer
          </h1>

          {/* 3 Rotating Text (impacto emocional) - Verde */}
          <div className="text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold text-green-400">
            <TextLoop interval={3} transition={{ duration: 0.4 }}>
              <span>Criatividade que vende</span>
              <span>Tecnologia que resolve</span>
              <span>Estratégia que cresce</span>
            </TextLoop>
          </div>

          {/* 4 Subheadline Curta */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-xl">
            Um sistema completo com <span className="font-semibold text-white">design</span>, <span className="font-semibold text-white">marketing</span>, <span className="font-semibold text-white">sites</span>, <span className="font-semibold text-white">importação</span> e <span className="font-semibold text-white">suporte técnico</span> para estruturar o seu negócio.
          </p>

          {/* 5 Botões */}
          <div className={`flex flex-col sm:flex-row justify-start items-start gap-3 sm:gap-4 pt-2 transition-all duration-700 delay-300 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>
            
            {/* Botão principal (sólido) - Falar com Especialista */}
            <Button
              size="lg"
              className="rounded-[24px] py-3 sm:py-3.5 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-[#22C55E] to-emerald-600 backdrop-blur-md border-2 border-green-400 text-white hover:from-[#16A34A] hover:to-emerald-700 hover:border-green-500 text-sm sm:text-base md:text-lg tech-hover-lift hover:scale-105 hover:shadow-xl w-full sm:w-auto relative overflow-hidden group min-h-[52px] sm:min-h-[56px] shadow-lg shadow-green-500/25"
              onClick={(e) => {
                const button = e.currentTarget;
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                button.appendChild(ripple);

                setTimeout(() => {
                  ripple.remove();
                  const message = encodeURIComponent('Olá! Vi seu site e quero saber como posso levar meu negócio para o digital. Podem ajudar?');
                  window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                }, 300);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <span className="relative z-10 font-bold text-sm sm:text-base md:text-lg tracking-wide text-white drop-shadow-sm">Falar com Especialista</span>
            </Button>

            {/* Botão secundário (outline) - Ver Serviços */}
            <HoverBorderGradient
              containerClassName="rounded-[24px] min-h-[52px] sm:min-h-[56px] w-full sm:w-auto"
              className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base md:text-lg text-yellow-400 hover:text-yellow-300 transition-colors py-3 sm:py-3.5 px-6 sm:px-8"
              onClick={() => {
                document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-yellow-400" />
              Ver Serviços
            </HoverBorderGradient>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className={`absolute bottom-3 xs:bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 z-10 ${isLoaded ? (prefersReducedMotion ? 'opacity-100' : 'animate-bounce opacity-100') : 'opacity-0'}`}>
          <button
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex flex-col items-center space-y-0.5 sm:space-y-1 p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            aria-label="Scroll to services"
          >
            <div className="w-3 h-5 xs:w-4 xs:h-6 sm:w-5 sm:h-8 border-2 border-primary/60 dark:border-primary/70 rounded-full flex justify-center p-0.5 group-hover:border-primary transition-colors duration-300">
              <div className="w-0.5 h-1 xs:h-1.5 sm:h-2 bg-primary dark:bg-primary/90 rounded-full mt-0.5 xs:mt-0.75 sm:mt-1 animate-pulse" />
            </div>
            <span className="text-[8px] sm:text-[9px] text-primary/60 dark:text-primary/70 group-hover:text-primary transition-colors duration-300">
              Rolar
            </span>
            <ArrowDown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary/60 dark:border-primary/70 animate-bounce" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;
