import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingService, setPendingService] = useState<{ id: number; title: string; category: string } | null>(null);

  // Image mapping function - URLs from Cloudinary
  const getServiceImage = (item: { id: number; }) => {
    switch (item.id) {
      case 1:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png'; // Design & Identidade Visual
      case 2:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png'; // Desenvolvimento Digital
      case 3:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png'; // Marketing Digital
      case 4:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png'; // Audiovisual
      case 5:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png'; // Importação
      case 6:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png'; // Assistência Técnica GSM
      // AI Services - using same images as professional versions for now
      case 7: case 17: // Logo services
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      case 8: case 14: // Posts services
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      case 9: case 15: // Pack semanal
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      case 10: case 16: // Pack mensal
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      case 11: case 18: // Cartazes
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      case 13: case 19: // Banners
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png';
      default:
        return 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png';
    }
  };

  // Serviços com foco em capacidade e processo - sem promessas vazias
  const services = [
    {
      id: 1,
      title: 'Identidade Visual Profissional',
      category: 'Design Gráfico',
      description: 'Criamos a identidade visual completa para seu negócio. Logo, cores, materiais e tudo que sua marca precisa para se destacar.',
      features: ['Logo personalizado', 'Identidade completa', 'Materiais prontos', 'Acompanhamento'],
      badge: 'Design Completo'
    },
    {
      id: 2,
      title: 'Sites que Funcionam',
      category: 'Desenvolvimento Web',
      description: 'Desenvolvemos sites modernos, rápidos e otimizados. Seu negócio disponível 24h para seus clientes.',
      features: ['Site responsivo', 'Alta velocidade', 'SEO otimizado', 'Integrações'],
      badge: 'Presença Digital'
    },
    {
      id: 3,
      title: 'Marketing Digital Estratégico',
      category: 'Marketing Digital',
      description: 'Gerimos suas redes sociais e criamos estratégias de anúncios para seu negócio aparecer online.',
      features: ['Redes sociais', 'Anúncios online', 'Estratégia clara', 'Relatórios'],
      badge: 'Visibilidade Online'
    },
    {
      id: 4,
      title: 'Produção Audiovisual',
      category: 'Produção Audiovisual',
      description: 'Produzimos vídeos profissionais que contam a história do seu negócio. Do roteiro à edição final.',
      features: ['Vídeos profissionais', 'Filmagem', 'Edição completa', 'Pronto para usar'],
      badge: 'Conteúdo Visual'
    },
    {
      id: 5,
      title: 'Importação Facilitada',
      category: 'Importação',
      description: 'Cuidamos de todo o processo de importação para você. Desde a seleção até a entrega.',
      features: ['Seleção de produtos', 'Documentação', 'Logística', 'Entrega'],
      badge: 'Processo Completo'
    },
    {
      id: 6,
      title: 'Assistência Técnica GSM',
      category: 'Assistência GSM',
      description: 'Serviço técnico especializado para celulares. Reparos com qualidade e garantia.',
      features: ['Reparo técnico', 'Peças de qualidade', 'Garantia', 'Suporte'],
      badge: 'Suporte Técnico'
    }
  ];

  const categories = ['Todos', 'Design Gráfico', 'Desenvolvimento Web', 'Marketing Digital', 'Produção Audiovisual', 'Importação', 'Assistência GSM'];

  // Filter services based on active category
  const filteredServices = activeCategory === 'Todos'
    ? services
    : services.filter(service => service.category === activeCategory);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleServiceDetails = (service: { id: number; title: string; category: string; }) => {
    // For all services, go to details page
    if (!isAuthenticated) {
      setPendingService(service);
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/service-details?id=${service.id}&title=${encodeURIComponent(service.title)}&category=${encodeURIComponent(service.category)}`);
  };

  const handleServiceWhatsApp = (service: { title: string; category: string; }) => {
    let message = '';
    switch (service.category) {
      case 'Design Gráfico':
        message = `Olá! Vi que vocês fazem identidade visual. Meu negócio precisa de um logo profissional. Podem ajudar?`;
        break;
      case 'Desenvolvimento Web':
        message = `Olá! Vi que vocês desenvolvem sites. Meu negócio precisa de presença online. Podem ajudar?`;
        break;
      case 'Marketing Digital':
        message = `Olá! Vi que vocês cuidam de marketing digital. Meu negócio precisa aparecer mais online. Podem ajudar?`;
        break;
      case 'Produção Audiovisual':
        message = `Olá! Vi que vocês produzem vídeos. Preciso de conteúdo visual para meu negócio. Podem ajudar?`;
        break;
      case 'Importação':
        message = `Olá! Vi que vocês cuidam de importação. Tenho interesse em importar produtos. Podem ajudar?`;
        break;
      case 'Assistência GSM':
        message = `Olá! Vi que vocês oferecem assistência técnica. Preciso de serviços de reparo. Podem ajudar?`;
        break;
      default:
        message = `Olá! Gostaria de saber mais sobre ${service.title}. Podem ajudar?`;
    }
    const whatsappUrl = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="services" className="section-spacing relative overflow-hidden pt-20">
      {/* Efeito de contorno arredondado no topo da seção - ACIMA do conteúdo */}
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="w-full h-full bg-background rounded-b-[48px] shadow-xl border-b border-x border-white/10" />
        </div>
      </div>

      {/* Background with liquid glass effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-12 w-48 h-48 bg-gradient-to-br from-primary/8 via-accent/8 to-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-12 w-56 h-56 bg-gradient-to-tr from-blue-500/8 via-primary/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-pink-500/4 to-primary/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header Principal */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-10 animate-fade-up">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4">
            <span className="gradient-text">Nossos Serviços</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto font-light leading-relaxed">
            Soluções digitais pensadas para negócios que querem crescer.
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
                        ? 'bg-gradient-to-r from-primary/30 to-accent/30 text-foreground border-primary/50 shadow-lg scale-105 rounded-lg'
                         : 'bg-white/10 dark:bg-white/5 text-muted-foreground hover:text-primary hover:bg-white/20 border-white/20 hover:border-primary/40 hover:scale-105 rounded-lg'
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

        {/* Serviços em Destaque */}
        <div className="px-1 sm:px-2">
          <Carousel
            slides={filteredServices.map((item) => (
              <div key={`${item.id}-${activeCategory}`} className="select-none">
                <div
                  className="rounded-[32px] p-[40px] shadow-xl border border-white/10 relative h-full overflow-hidden group cursor-pointer hover:translate-y-[-4px] hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 bg-white/95 dark:bg-card/95"
                  style={{
                    height: '500px',
                    width: '100%',
                    maxWidth: '320px'
                  }}
                  onClick={() => {
                    handleServiceDetails(item);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`VER DETALHES DE ${item.title}`}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${getServiceImage(item)})`
                    }}
                  />
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                  {/* Additional text background for critical areas */}
                  <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                   
                   {/* Content */}
                   <div className="relative z-10 h-full flex flex-col p-2.5 sm:p-4 lg:p-5 text-white">
                     {/* Header - Fixed at top */}
                     <div className="flex justify-between items-start mb-1.5">
                       <span className="font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs text-shadow-sm">
                         {item.category}
                       </span>
                       <div className="flex flex-col gap-1"></div>
                     </div>

                     {/* Spacer */}
                     <div className="flex-1 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]"></div>

                     {/* Main Content - Bottom */}
                     <div className="mt-auto">
                       <h3 className="font-bold leading-tight mb-1 sm:mb-1.5 text-sm text-shadow-lg">
                         {item.title}
                       </h3>
                       <p className="leading-relaxed opacity-90 text-xs line-clamp-3 mb-2.5 sm:mb-3 text-shadow-md">
                         {item.description}
                       </p>

                       {/* CTA Buttons */}
                       <div className="space-y-2 mt-1">
                         {/* Primary CTA Button - Green */}
                         <button
                           className="bg-green-500/90 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 lg:p-3 border border-green-400/30 cursor-pointer hover:bg-green-600 transition-colors w-full"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleServiceWhatsApp(item);
                           }}
                         >
                           <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-white text-shadow-sm">
                               CONVERSAR AGORA
                             </span>
                             <span className="text-white text-sm">💬</span>
                           </div>
                         </button>

                          {/* Secondary CTA Button - White/Transparent */}
                          <button
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 lg:p-3 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAuthenticated) {
                                setPendingService(item);
                                setIsLoginModalOpen(true);
                              } else {
                                handleServiceDetails(item);
                              }
                            }}
                          >
                           <div className="flex items-center justify-between">
                             <span className="text-xs font-medium text-shadow-sm transition-all duration-500 ease-in-out">
                               VER DETALHES
                             </span>
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 transition-all duration-500 ease-in-out opacity-100 scale-100">
                               <path d="M15 3h6v6"></path>
                               <path d="M10 14 21 3"></path>
                               <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                             </svg>
                           </div>
                         </button>
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
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingService(null);
        }}
        title="Acesso aos Serviços"
        description="FAÇA LOGIN PARA VER DETALHES COMPLETOS DOS SERVIÇOS"
        redirectTo={pendingService ? `/service-details?id=${pendingService.id}&title=${encodeURIComponent(pendingService.title)}&category=${encodeURIComponent(pendingService.category)}` : undefined}
      />
    </section>
  );
};

export default Services;
