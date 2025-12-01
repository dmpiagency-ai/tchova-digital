import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import {
  ArrowLeft,
  Package,
  MessageCircle,
  Sparkles,
  Zap,
  Clock,
  Star,
  Shield,
  CreditCard,
  CheckCircle,
  TrendingUp,
  ShoppingCart,
  Heart,
  Eye,
  Share2,
  Award,
  Users,
  Globe
} from 'lucide-react';

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);

  const serviceId = searchParams.get('id');
  const serviceTitle = searchParams.get('title') || 'Serviço';
  const serviceCategory = searchParams.get('category') || '';

  const [service, setService] = useState<{
    id: number;
    title: string;
    category: string;
    image: string;
    shortDescription: string;
    fullDescription: string;
    detailedDescription: string;
    features: string[];
    benefits: string[];
    deliveryTime: string;
    revisions: string;
    expertise: string;
    projects: string;
    price: number;
    priceNote: string;
    rating: number;
    clients: number;
    tags: string[];
    gallery: string[];
    testimonial?: {
      name: string;
      text: string;
      rating: number;
      avatar: string;
    };
  } | null>(null);

  const servicesData = [
    {
      id: 1,
      title: 'Design Gráfico & Identidade Visual',
      category: 'Design Gráfico',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
      shortDescription: 'Identidade visual profissional que fortalece sua marca.',
      fullDescription: 'Criação completa de identidade visual que estabelece uma presença única e memorável para sua marca.',
      detailedDescription: 'Nossa identidade visual inclui:',
      features: [
        'Logotipos exclusivos e versáteis',
        'Manual completo da marca',
        'Paleta de cores profissional',
        'Tipografia estratégica',
        'Materiais impressos e digitais',
        'Identidade para redes sociais'
      ],
      benefits: [
        'Diferenciação no mercado',
        'Reconhecimento instantâneo',
        'Profissionalismo aumentado',
        'Coerência visual em todos os meios'
      ],
      deliveryTime: '7-14 dias úteis',
      revisions: '3 revisões inclusas',
      expertise: '8+ anos de experiência',
      projects: '150+ marcas criadas',
      price: 3500,
      priceNote: 'Preço pode variar conforme complexidade',
      rating: 4.9,
      clients: 150,
      tags: ['Branding', 'Logo', 'Design', 'Identidade Visual'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png'
      ],
      testimonial: {
        name: 'Ana Santos',
        text: 'Transformaram completamente nossa marca. Recomendo 100%!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      }
    },
    {
      id: 2,
      title: 'Desenvolvimento Web & Mobile',
      category: 'Desenvolvimento Web',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
      shortDescription: 'Websites e apps com tecnologia de ponta.',
      fullDescription: 'Desenvolvimento de soluções digitais completas que combinam tecnologia de ponta com design intuitivo.',
      detailedDescription: 'Nossos serviços incluem:',
      features: [
        'Websites responsivos e otimizados',
        'Aplicações móveis iOS/Android',
        'E-commerce completo e seguro',
        'Integração de IA e automação',
        'Sistemas web personalizados',
        'APIs REST e GraphQL'
      ],
      benefits: [
        'Performance otimizada',
        'Segurança avançada',
        'Escalabilidade garantida',
        'Interface intuitiva'
      ],
      deliveryTime: '15-30 dias úteis',
      revisions: 'Revisões ilimitadas',
      expertise: '6+ anos de experiência',
      projects: '200+ projetos',
      price: 4500,
      priceNote: 'Preço varia conforme complexidade',
      rating: 4.8,
      clients: 200,
      tags: ['Web Development', 'Mobile', 'E-commerce', 'API'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png'
      ]
    },
    {
      id: 3,
      title: 'Marketing Digital',
      category: 'Marketing Digital',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
      shortDescription: 'Campanhas que geram resultados reais.',
      fullDescription: 'Estratégias integradas de marketing digital que geram resultados mensuráveis e crescimento sustentável.',
      detailedDescription: 'Nossa estratégia cobre:',
      features: [
        'Google Ads e Facebook Ads',
        'Gestão de Instagram e TikTok',
        'SEO técnico e local',
        'E-mail marketing automatizado',
        'Analytics avançado',
        'Marketing de conteúdo'
      ],
      benefits: [
        'Aumento do tráfego qualificado',
        'Melhoria da conversão',
        'ROI mensurável',
        'Crescimento sustentável'
      ],
      deliveryTime: '5-7 dias úteis',
      revisions: 'Ajustes contínuos inclusos',
      expertise: '7+ anos de experiência',
      projects: '300+ campanhas',
      price: 4000,
      priceNote: 'Planos mensais a partir de 2.500 MZN',
      rating: 4.9,
      clients: 300,
      tags: ['Marketing', 'SEO', 'Ads', 'Social Media'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png'
      ]
    },
    {
      id: 4,
      title: 'Produção Audiovisual Profissional',
      category: 'Produção Audiovisual',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
      shortDescription: 'Vídeos que comunicam e impactam.',
      fullDescription: 'Produção audiovisual de alta qualidade que conta histórias memoráveis e gera conexão emocional.',
      detailedDescription: 'Nossa produção inclui:',
      features: [
        'Vídeos institucionais e corporativos',
        'Comerciais para TV e digital',
        'Cobertura de eventos',
        'Motion graphics e animação',
        'Edição profissional avançada',
        'Filmações com drone'
      ],
      benefits: [
        'Qualidade cinematográfica',
        'Equipamentos profissionais',
        'Edição avançada',
        'Entrega rápida'
      ],
      deliveryTime: '10-21 dias úteis',
      revisions: '2 rounds de edição inclusos',
      expertise: '5+ anos de experiência',
      projects: '120+ produções',
      price: 5000,
      priceNote: 'Preço varia conforme duração',
      rating: 4.7,
      clients: 120,
      tags: ['Vídeo', 'Produção', 'Motion Graphics', 'Drone'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png'
      ]
    },
    {
      id: 5,
      title: 'Importação & Compra Online',
      category: 'Importação',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
      shortDescription: 'Produtos do exterior com segurança.',
      fullDescription: 'Soluções completas de e-commerce que conectam negócios ao mercado global.',
      detailedDescription: 'Nossa solução inclui:',
      features: [
        'Plataformas Shopify e WooCommerce',
        'Integração com fornecedores internacionais',
        'Logística e frete internacional',
        'Múltiplas opções de pagamento',
        'Sistema de gestão de estoque',
        'Suporte ao cliente 24/7'
      ],
      benefits: [
        'Acesso ao mercado global',
        'Gestão automatizada',
        'Múltiplas receitas',
        'Escalabilidade internacional'
      ],
      deliveryTime: '14-21 dias úteis',
      revisions: 'Treinamento e suporte inclusos',
      expertise: '4+ anos de experiência',
      projects: '80+ lojas online',
      price: 4200,
      priceNote: 'Comissões sobre vendas disponíveis',
      rating: 4.6,
      clients: 80,
      tags: ['E-commerce', 'Importação', 'Global', 'Logística'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png'
      ]
    },
    {
      id: 6,
      title: 'Assistência Técnica GSM',
      category: 'Assistência GSM',
      image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
      shortDescription: 'Reparos especializados para dispositivos.',
      fullDescription: 'Serviços especializados de assistência técnica para dispositivos móveis com mais de uma década de experiência.',
      detailedDescription: 'Nossos serviços GSM incluem:',
      features: [
        'Desbloqueio seguro e garantido',
        'Reparos técnicos especializados',
        'Atualização de firmware',
        'Reparação de IMEI',
        'Suporte remoto especializado',
        'Garantia alargada'
      ],
      benefits: [
        'Experiência comprovada',
        'Garantia alargada',
        'Suporte especializado',
        'Preços competitivos'
      ],
      deliveryTime: '1-3 dias úteis',
      revisions: 'Garantia de 90 dias',
      expertise: '10+ anos de experiência',
      projects: '5000+ dispositivos',
      price: 800,
      priceNote: 'Preços varia conforme tipo de reparo',
      rating: 4.9,
      clients: 5000,
      tags: ['GSM', 'Reparo', 'Desbloqueio', 'Hardware'],
      gallery: [
        'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png'
      ]
    }
  ];

  useEffect(() => {
    const foundService = servicesData.find(s => s.id.toString() === serviceId);
    setService(foundService || null);
  }, [serviceId]);

  const handleViewPlans = () => {
    navigate('/#planos');
  };

  const handleSelectPlan = (planName: string, planPrice: string) => {
    if (!service) return;
    navigate(`/customize-plan?plan=${encodeURIComponent(planName)}&price=${planPrice}&service=${encodeURIComponent(service.title)}`);
  };

  const handleQuickPurchase = () => {
    if (!service) return;
    navigate(`/payment?service=${encodeURIComponent(service.title)}&amount=${service.price}&source=service-details`);
  };

  const handleContact = () => {
    let message = '';
    switch (service?.category) {
      case 'Produção Audiovisual':
        message = encodeURIComponent(`🎬 Olá! Gostaria de orçamento para produção audiovisual.`);
        break;
      case 'Desenvolvimento Web':
        message = encodeURIComponent(`💻 Olá! Preciso de desenvolvimento web.`);
        break;
      case 'Marketing Digital':
        message = encodeURIComponent(`📈 Olá! Interessado em marketing digital.`);
        break;
      case 'Design Gráfico':
        message = encodeURIComponent(`🎨 Olá! Preciso de design gráfico.`);
        break;
      case 'Importação':
        message = encodeURIComponent(`🛒 Olá! Quero criar loja online.`);
        break;
      case 'Assistência GSM':
        message = encodeURIComponent(`📱 Olá! Preciso de assistência técnica GSM.`);
        break;
      default:
        message = encodeURIComponent(`Olá! Gostaria de saber sobre ${service?.title}.`);
    }
    window.open(`https://wa.me/258123456789?text=${message}`, '_blank');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <Header />
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold mb-4 gradient-text">Serviço não encontrado</h1>
            <Button
              onClick={() => navigate('/')}
              className="w-full h-10 sm:h-12 rounded-lg sm:rounded-2xl font-semibold text-primary bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:to-accent/20 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Voltar ao Início</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        </div>

        <ScrollStack useWindowScroll={true} className="max-w-5xl mx-auto" itemDistance={80} itemStackDistance={20} baseScale={0.95}>
          {/* Hero Section - Captura Atenção */}
          <ScrollStackItem>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden rounded-2xl sm:rounded-3xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                  <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-xl sm:rounded-2xl text-xs font-semibold shadow-2xl">
                    {service.category}
                  </Badge>
                </div>

                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6">
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight drop-shadow-2xl mb-1.5 sm:mb-2 lg:mb-3">
                    {service.title}
                  </h1>

                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-white mb-2 sm:mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-xs sm:text-sm lg:text-base">{service.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-green-400" />
                      <span className="font-bold text-xs sm:text-sm lg:text-base">{service.clients}+</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-blue-400" />
                      <span className="font-bold text-xs sm:text-sm lg:text-base">{service.projects}</span>
                    </div>
                  </div>

                  {/* CTA Principal */}
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={handleQuickPurchase}
                      className="w-full h-9 sm:h-10 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm lg:text-base"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden sm:inline">🚀 Comprar Agora</span>
                      <span className="sm:hidden">Comprar</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Informações Essenciais */}
          <ScrollStackItem>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary mr-2" />
                Sobre o Serviço
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4">
                {service.fullDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium">{service.features.length} recursos incluídos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium">Entrega: {service.deliveryTime}</span>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Benefícios em Destaque */}
          <ScrollStackItem>
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                Principais Benefícios
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {service.benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3 bg-white/5 rounded-lg p-2 sm:p-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span className="text-foreground text-xs sm:text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollStackItem>

          {/* Prova Social */}
          {service.testimonial && (
            <ScrollStackItem>
              <div className="backdrop-blur-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">O que dizem nossos clientes</h3>
                </div>
                <div className="flex items-start space-x-4">
                  <img
                    src={service.testimonial.avatar}
                    alt={service.testimonial.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-foreground">{service.testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(service.testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic text-sm">"{service.testimonial.text.length > 100 ? service.testimonial.text.substring(0, 100) + '...' : service.testimonial.text}"</p>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          )}

          {/* CTA de Conversão */}
          <ScrollStackItem>
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-accent/5 to-white/5 border-2 border-primary/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground text-center">
                  Pronto para começar?
                </h3>
                <p className="text-muted-foreground text-center mt-1 text-xs sm:text-sm">Invista no seu negócio hoje</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {service.price.toLocaleString()} MZN
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{service.priceNote}</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={handleQuickPurchase}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                    <span className="hidden sm:inline">🚀 Comprar Agora</span>
                    <span className="sm:hidden">Comprar</span>
                  </Button>

                  <Button
                    onClick={() => handleSelectPlan('Personalizado', service.price.toString())}
                    className="w-full h-9 sm:h-10 lg:h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm lg:text-base"
                  >
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="hidden sm:inline">✨ Personalizar Plano</span>
                    <span className="sm:hidden">Personalizar</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                  <div>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
                    <span className="text-xs font-medium text-foreground">{service.deliveryTime}</span>
                  </div>
                  <div>
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto mb-1" />
                    <span className="text-xs font-medium text-foreground">{service.revisions}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollStackItem>

          {/* Confiança e Suporte */}
          <ScrollStackItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {/* Trust Signals */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
                <h4 className="font-bold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-center">
                  Por que escolher a TCHOVA?
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">100% Seguro</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">Qualidade Garantida</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">Suporte 24/7</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
                <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base text-center">
                  Precisa de ajuda?
                </h4>
                <p className="text-xs text-muted-foreground mb-3 sm:mb-4 text-center">
                  Nossa equipe está aqui para ajudar
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <Button
                    onClick={handleContact}
                    className="w-full h-8 sm:h-9 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">💬 WhatsApp</span>
                    <span className="sm:hidden">WhatsApp</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.open('mailto:contato@tchova.com', '_blank')}
                    className="w-full h-8 sm:h-9 lg:h-10 rounded-lg sm:rounded-xl font-semibold border-primary/50 hover:bg-primary/10 hover:border-primary text-primary hover:text-primary-700 text-xs sm:text-sm"
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">📧 Email</span>
                    <span className="sm:hidden">Email</span>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </main>
    </div>
  );
};

export default ServiceDetails;