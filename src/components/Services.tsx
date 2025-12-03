import { ExternalLink, ChevronLeft, ChevronRight, Lock, LogIn } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { handleWhatsAppClick, getServiceMessage } from '@/lib/whatsapp';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

// Componente de botão animado inteligente
const AnimatedDetailButton = ({
  isAuthenticated,
  onClick,
  className = ""
}: {
  isAuthenticated: boolean;
  onClick: (e?: React.MouseEvent) => void;
  className?: string;
}) => {
  const [currentText, setCurrentText] = useState("Ver detalhes");
  const [showLock, setShowLock] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentText("Ver detalhes");
      setShowLock(false);
      return;
    }

    // Animação inicial: "Ver detalhes" por 3 segundos
    const initialTimer = setTimeout(() => {
      setCurrentText("Login para ver detalhes");
      setShowLock(true);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, [isAuthenticated]);

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 lg:p-3 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors ${className}`}
      onClick={(e) => onClick(e)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-shadow-sm transition-all duration-500 ease-in-out">
          {currentText}
        </span>
        {showLock ? (
          <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 transition-all duration-500 ease-in-out opacity-100 scale-100" />
        ) : (
          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 transition-all duration-500 ease-in-out opacity-100 scale-100" />
        )}
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [isWebVersion, setIsWebVersion] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Image mapping function - URLs from Cloudinary
  const getServiceImage = (item: { id: number; }) => {
    switch (item.id) {
      case 1:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png'; // Design & Identidade Visual
      case 2:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png'; // Web & Mobile
      case 3:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png'; // Marketing Digital
      case 4:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png'; // Audiovisual
      case 5:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png'; // Importação
      case 6:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png'; // Assistência Técnica GSM
      default:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png';
    }
  };

  const services = [
    {
      id: 1,
      title: 'Design & Identidade Visual',
      category: 'Design Gráfico',
      description: 'Transformamos marcas em presença visual forte e memorável.',
      features: ['Logotipos exclusivos', 'Identidade visual completa'],
      popular: true,
      badge: 'Revisões Incluídas'
    },
    {
      id: 2,
      title: 'Web & Mobile',
      category: 'Desenvolvimento Web',
      description: 'Sites e apps modernos com tecnologia de ponta.',
      features: ['Sites responsivos', 'Apps iOS/Android'],
      badge: 'SEO Otimizado'
    },
    {
      id: 3,
      title: 'Marketing Digital',
      category: 'Marketing Digital',
      description: 'Campanhas com resultados mensuráveis e ROI otimizado.',
      features: ['Redes sociais', 'Tráfego pago'],
      badge: 'Relatórios Mensais'
    },
    {
      id: 4,
      title: 'Audiovisual',
      category: 'Produção Audiovisual',
      description: 'Vídeos profissionais que comunicam e impactam.',
      features: ['Vídeos institucionais', 'Motion graphics'],
      badge: 'Qualidade 4K'
    },
    {
      id: 5,
      title: 'Importação',
      category: 'Importação',
      description: 'Produtos internacionais com logística especializada.',
      features: ['Compra sob encomenda', 'Fornecedores verificados'],
      badge: 'Entrega Segura'
    },
    {
      id: 6,
      title: 'Assistência Técnica GSM',
      category: 'Assistência GSM',
      description: 'Reparos especializados com garantia alargada.',
      features: ['Desbloqueio seguro', 'Suporte técnico'],
      badge: 'Peças Originais'
    }
  ];

  const categories = ['Todos', 'Design Gráfico', 'Desenvolvimento Web', 'Marketing Digital', 'Produção Audiovisual', 'Importação', 'Assistência GSM'];

  // Filter services based on active category
  const filteredServices = activeCategory === 'Todos'
    ? services
    : services.filter(service => service.category === activeCategory);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Update active filter index when category changes
  useEffect(() => {
    const index = categories.indexOf(activeCategory);
    setActiveFilterIndex(index >= 0 ? index : 0);
  }, [activeCategory]);


  // Detect mobile and web versions
  useEffect(() => {
    const checkVersions = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsWebVersion(width >= 1024);
    };

    checkVersions();
    window.addEventListener('resize', checkVersions);
    return () => window.removeEventListener('resize', checkVersions);
  }, []);

  // Auto-advance carousel on mobile with better handling
  useEffect(() => {
    if (!isMobile || filteredServices.length <= 1) return;

    const interval = setInterval(() => {
      setIsAutoAdvancing(true);
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % filteredServices.length;
        setIsAutoAdvancing(false);
        return nextIndex;
      });
    }, 6000); // Slightly slower for better UX

    return () => clearInterval(interval);
  }, [isMobile, filteredServices.length]);

  // Touch/swipe gestures for mobile with improved handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50; // Optimized for mobile touch

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(false);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) {
      setIsDragging(true);
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && filteredServices.length > 1) {
      nextSlide();
    } else if (isRightSwipe && filteredServices.length > 1) {
      prevSlide();
    }

    setIsDragging(false);
  };

  const nextSlide = () => {
    if (filteredServices.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredServices.length);
    }
  };

  const prevSlide = () => {
    if (filteredServices.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + filteredServices.length) % filteredServices.length);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < filteredServices.length) {
      setCurrentIndex(index);
    }
  };

  const handleServiceDetails = (service: { id: number; title: string; category: string; }) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/service-details?id=${service.id}&title=${encodeURIComponent(service.title)}&category=${encodeURIComponent(service.category)}`);
  };

  const handleServiceWhatsApp = (service: { title: string; category: string; }) => {
    const message = getServiceMessage(service.title);
    const whatsappUrl = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="services" className="py-4 sm:py-6 lg:py-12 relative overflow-hidden">
      {/* Enhanced Background with liquid glass effects - More subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-12 w-48 h-48 bg-gradient-to-br from-primary/8 via-accent/8 to-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-12 w-56 h-56 bg-gradient-to-tr from-blue-500/8 via-primary/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-pink-500/4 to-primary/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header Principal - Foco na Atenção */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-10 animate-fade-up">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4">
            <span className="gradient-text">Nossos Serviços</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto font-light leading-relaxed">
            Soluções digitais especializadas que transformam seu negócio
          </p>
        </div>

        {/* Filtros Inteligentes - Só quando necessário */}
        {isMobile && categories.length > 1 && (
          <div className="mb-4 sm:mb-6 animate-fade-up px-2">
            <div className="text-center mb-3">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Filtrar por categoria</p>
            </div>

            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth snap-x snap-mandatory">
              {categories.map((category, index) => {
                const itemCount = category === 'Todos'
                  ? services.length
                  : services.filter(service => service.category === category).length;

                return (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(category)}
                    className={`relative px-3 py-2 rounded-lg font-semibold text-xs whitespace-nowrap flex-shrink-0 snap-center backdrop-blur-xl border min-w-[80px] h-9 touch-manipulation overflow-hidden group transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-primary/30 to-accent/30 text-foreground border-primary/50 shadow-lg scale-105'
                        : 'bg-white/10 dark:bg-white/5 text-muted-foreground hover:text-primary hover:bg-white/20 border-white/20 hover:border-primary/40 hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-xs leading-tight mb-0.5">{category}</div>
                      <span className={`inline-flex items-center justify-center w-3.5 h-3.5 text-xs font-bold rounded-full ${
                        activeCategory === category
                          ? 'bg-white/20 text-foreground'
                          : 'bg-primary/15 text-primary'
                      }`}>
                        {itemCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Serviços em Destaque - Foco no Essencial */}
        <div className="px-1 sm:px-2">
          <Carousel
            slides={filteredServices.map((item) => (
              <div key={`${item.id}-${activeCategory}`} className={`${isMobile ? 'h-[360px]' : 'h-[400px]'} select-none`}>
                <div
                  className="relative h-full rounded-xl sm:rounded-2xl shadow-xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  onClick={() => {
                    handleServiceDetails(item);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.title}`}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${getServiceImage(item)})`
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col p-2.5 sm:p-4 lg:p-5 text-white">
                    {/* Header - Fixed at top */}
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs text-shadow-sm">
                        {item.category}
                      </span>
                      <div className="flex flex-col gap-1">
                        {item.badge && (
                          <span className="bg-blue-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold text-shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        {item.popular && (
                          <span className="bg-yellow-400 text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold animate-pulse text-shadow-xs">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spacer to push content down - More space for image */}
                    <div className="flex-1 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]" />

                    {/* Main Content - Pushed to bottom */}
                    <div className="mt-auto">
                      <h3 className={`font-bold leading-tight mb-1 sm:mb-1.5 ${isMobile ? 'text-sm' : 'text-base'} text-shadow-lg`}>
                        {item.title}
                      </h3>
                      <p className={`leading-relaxed opacity-90 ${isMobile ? 'text-xs' : 'text-xs'} line-clamp-3 mb-2.5 sm:mb-3 text-shadow-md`}>
                        {item.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="space-y-2 mt-1">
                        <div
                          className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 lg:p-3 border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceWhatsApp(item);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-shadow-sm">Conversar no WhatsApp</span>
                            <span className="text-green-400 text-sm">💬</span>
                          </div>
                        </div>
                        <AnimatedDetailButton
                          isAuthenticated={isAuthenticated}
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleServiceDetails(item);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            options={{
              loop: true,
              align: 'center',
              containScroll: 'trimSnaps',
              slidesToScroll: isMobile ? 1 : 2,
              breakpoints: {
                '(min-width: 768px)': {
                  slidesToScroll: 2,
                  align: 'center',
                  containScroll: 'trimSnaps'
                },
                '(min-width: 1024px)': {
                  slidesToScroll: 3,
                  align: 'center',
                  containScroll: 'trimSnaps'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Acesso aos Serviços"
        description="Faça login para ver detalhes completos dos serviços e acessar recursos exclusivos"
      />
    </section>
  );
};

export default Services;