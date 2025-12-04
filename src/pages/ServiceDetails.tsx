import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { INDIVIDUAL_SERVICES, getWhatsAppMessage } from '@/config/pricing';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
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

// GSM-specific interfaces
interface User {
  id: string;
  name: string;
  email: string;
  serviceAccess?: string;
  accessType?: string;
  partnerReferral?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  whatsapp?: string;
}

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showGsmLogin, setShowGsmLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuth();

  // Detect mobile device for ScrollStack behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const serviceId = searchParams.get('id');
  const serviceTitle = searchParams.get('title') || 'Serviço';
  const serviceCategory = searchParams.get('category') || '';

  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const foundService = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId);
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
    if (!service) return;
    const message = getWhatsAppMessage('service', service.title);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // GSM-specific handlers
  const handleGsmRent = () => {
    // Se usuário já está logado no site geral, vai direto para GSM dashboard
    if (isAuthenticated) {
      navigate('/gsm-dashboard');
    } else {
      // Senão, mostra modal de login GSM
      setShowGsmLogin(true);
    }
  };

  const handleGSMLogin = (credentials: LoginCredentials) => {
    // Create user session for GSM access
    const gsmUser: User = {
      id: 'gsm_user_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      accessType: 'gsm-partner',
      partnerReferral: 'tchova-digital'
    };

    setUser(gsmUser);
    setShowGsmLogin(false);

    // Go to GSM dashboard after login
    navigate('/gsm-dashboard');
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
        {/* Mobile-First Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
              <span className="sm:hidden">←</span>
            </Button>

            {/* Service Category Badge - Mobile */}
            <div className="sm:hidden">
              <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                {service.category}
              </Badge>
            </div>
          </div>
        </div>

        {isMobile ? (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Hero Section - Enhanced with Key Metrics */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative h-40 sm:h-56 lg:h-64 overflow-hidden rounded-2xl sm:rounded-3xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                  <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-xl sm:rounded-2xl text-xs font-semibold shadow-2xl">
                    {service.category}
                  </Badge>
                </div>

                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6">
                  {/* CTA Buttons - Closer to Image */}
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={service.category === 'Assistência GSM' ? handleGsmRent : handleQuickPurchase}
                      className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      {service.category === 'Assistência GSM' ? (
                        <>
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10" />
                          <span className="hidden sm:inline relative z-10">Acessar Ferramentas GSM</span>
                          <span className="sm:hidden relative z-10">Acessar GSM</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10" />
                          <span className="hidden sm:inline relative z-10">Comprar Agora</span>
                          <span className="sm:hidden relative z-10">Comprar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Essenciais */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary mr-2" />
                Sobre o Serviço
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4">
                {service.description}
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

            {/* Benefícios em Destaque - Melhor Agrupamento */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                <span className="hidden sm:inline">Principais Benefícios</span>
                <span className="sm:hidden">Benefícios</span>
              </h3>

              {/* Audiovisual Event Packages */}
              {service.category === 'Produção Audiovisual' ? (
                <div className="space-y-4">
                  {/* Pacote Básico */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-blue-800 dark:text-blue-200">🎬 Pacote Básico</h4>
                      <span className="font-bold text-blue-600">10.000 MZN</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Filmagem de vídeos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Seção fotográfica</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Edição de vídeo</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>USB de Fotos + Vídeo</span>
                      </div>
                    </div>
                  </div>

                  {/* Pacote Médio */}
                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-green-800 dark:text-green-200">🎥 Pacote Médio</h4>
                      <span className="font-bold text-green-600">15.000 MZN</span>
                    </div>
                    <div className="text-sm">
                      <span>Todos os benefícios do Básico + </span>
                      <span className="font-semibold text-green-700">Fogo de artifício</span>
                    </div>
                  </div>

                  {/* Pacote Clássico */}
                  <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-4 border border-purple-200/30 dark:border-purple-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-purple-800 dark:text-purple-200">🎪 Pacote Clássico</h4>
                      <span className="font-bold text-purple-600">25.000 MZN</span>
                    </div>
                    <div className="text-sm">
                      <span>Todos os benefícios do Básico + </span>
                      <span className="font-semibold text-purple-700">Bolas de Fumaça</span>
                    </div>
                  </div>

                  {/* Pacote VIP */}
                  <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-yellow-200/30 dark:border-yellow-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200">👑 Pacote VIP</h4>
                      <span className="font-bold text-yellow-600">35.000 MZN</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Filmagem com drone</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Bolas de Fumaça</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Fogo de artifício</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>USB completo</span>
                      </div>
                    </div>
                  </div>

                  {/* Adicionais */}
                  <div className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Adicionais Disponíveis</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">Filmagem com drone</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Bolas de Fumaça</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Fogo de artifício</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile: Single column with better spacing */}
                  <div className="block sm:hidden space-y-3">
                    {service.benefits.slice(0, 6).map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-3 border border-green-200/30 dark:border-green-800/30">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-sm" />
                        <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Two columns */}
                  <div className="hidden sm:grid sm:grid-cols-2 gap-3">
                    {service.benefits.slice(0, 6).map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-3 border border-green-200/30 dark:border-green-800/30">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-sm" />
                        <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Show more indicator if there are more benefits */}
                  {service.benefits.length > 6 && (
                    <div className="text-center mt-4">
                      <span className="text-xs text-muted-foreground bg-white/10 rounded-full px-3 py-1">
                        +{service.benefits.length - 6} benefícios adicionais
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CTA de Conversão - Mobile-First Design */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-accent/5 to-white/5 border-2 border-primary/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground text-center">
                  <span className="hidden sm:inline">Pronto para começar?</span>
                  <span className="sm:hidden">Vamos começar!</span>
                </h3>
                <p className="text-muted-foreground text-center mt-1 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Invista no seu negócio hoje</span>
                  <span className="sm:hidden">Invista hoje mesmo</span>
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Price Display - Mobile-First */}
                <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {service.price.toLocaleString()} MZN
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{service.priceNote}</p>
                </div>

                {/* Action Buttons - Intuitive Grouping */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Primary Action */}
                  {service.category === 'Assistência GSM' ? (
                    <Button
                      onClick={handleGsmRent}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                      <span className="hidden sm:inline relative z-10">
                        {isAuthenticated ? 'Acessar GSM Dashboard' : 'Alugar Ferramentas GSM'}
                      </span>
                      <span className="sm:hidden relative z-10">
                        {isAuthenticated ? 'GSM Dashboard' : 'Alugar GSM'}
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleQuickPurchase}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                      <span className="hidden sm:inline relative z-10">Comprar Agora</span>
                      <span className="sm:hidden relative z-10">Comprar</span>
                    </Button>
                  )}

                  {/* Secondary Actions - Mobile Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Customization - Only for eligible services */}
                    {service.category !== 'Assistência GSM' && service.category !== 'E-commerce' && (
                      <Button
                        onClick={() => handleSelectPlan('Personalizado', service.price.toString())}
                        variant="outline"
                        className="h-10 sm:h-12 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary hover:text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Personalizar</span>
                        <span className="sm:hidden">Personalizar</span>
                      </Button>
                    )}

                    {/* Audiovisual Package Selection */}
                    {service.category === 'Produção Audiovisual' && (
                      <Button
                        onClick={() => handleSelectPlan('Pacotes Audiovisuais', service.price.toString())}
                        variant="outline"
                        className="h-10 sm:h-12 border-2 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 text-orange-600 hover:text-orange-700 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Escolher Pacote</span>
                        <span className="sm:hidden">Pacote</span>
                      </Button>
                    )}

                    {/* Contact */}
                    <Button
                      onClick={handleContact}
                      variant="outline"
                      className="h-10 sm:h-12 border-2 border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            {/* Hero Section - Desktop */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden rounded-2xl sm:rounded-3xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                  <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-xl sm:rounded-2xl text-xs font-semibold shadow-2xl">
                    {service.category}
                  </Badge>
                </div>

                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={service.category === 'Assistência GSM' ? handleGsmRent : handleQuickPurchase}
                      className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      {service.category === 'Assistência GSM' ? (
                        <>
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10" />
                          <span className="hidden sm:inline relative z-10">Acessar Ferramentas GSM</span>
                          <span className="sm:hidden relative z-10">Acessar GSM</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10" />
                          <span className="hidden sm:inline relative z-10">Comprar Agora</span>
                          <span className="sm:hidden relative z-10">Comprar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sobre o Serviço - Desktop */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary mr-2" />
                Sobre o Serviço
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-4">
                {service.description}
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

            {/* Principais Benefícios - Desktop */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                Principais Benefícios
              </h3>

              {/* Audiovisual Event Packages */}
              {service.category === 'Produção Audiovisual' ? (
                <div className="space-y-4">
                  {/* Pacote Básico */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-blue-800 dark:text-blue-200">🎬 Pacote Básico</h4>
                      <span className="font-bold text-blue-600">10.000 MZN</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Filmagem de vídeos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Seção fotográfica</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>Edição de vídeo</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span>USB de Fotos + Vídeo</span>
                      </div>
                    </div>
                  </div>

                  {/* Pacote Médio */}
                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-green-800 dark:text-green-200">🎥 Pacote Médio</h4>
                      <span className="font-bold text-green-600">15.000 MZN</span>
                    </div>
                    <div className="text-sm">
                      <span>Todos os benefícios do Básico + </span>
                      <span className="font-semibold text-green-700">Fogo de artifício</span>
                    </div>
                  </div>

                  {/* Pacote Clássico */}
                  <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-4 border border-purple-200/30 dark:border-purple-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-purple-800 dark:text-purple-200">🎪 Pacote Clássico</h4>
                      <span className="font-bold text-purple-600">25.000 MZN</span>
                    </div>
                    <div className="text-sm">
                      <span>Todos os benefícios do Básico + </span>
                      <span className="font-semibold text-purple-700">Bolas de Fumaça</span>
                    </div>
                  </div>

                  {/* Pacote VIP */}
                  <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-yellow-200/30 dark:border-yellow-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200">👑 Pacote VIP</h4>
                      <span className="font-bold text-yellow-600">35.000 MZN</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Filmagem com drone</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Bolas de Fumaça</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>Fogo de artifício</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                        <span>USB completo</span>
                      </div>
                    </div>
                  </div>

                  {/* Adicionais */}
                  <div className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Adicionais Disponíveis</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">Filmagem com drone</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Bolas de Fumaça</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">Fogo de artifício</div>
                        <div className="text-green-600 font-bold">5.000 MZN</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop: Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.benefits.slice(0, 10).map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-3 border border-green-200/30 dark:border-green-800/30">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-sm" />
                        <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Show more indicator if there are more benefits */}
                  {service.benefits.length > 10 && (
                    <div className="text-center mt-4">
                      <span className="text-xs text-muted-foreground bg-white/10 rounded-full px-3 py-1">
                        +{service.benefits.length - 10} benefícios adicionais
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CTA Section - Desktop */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-accent/5 to-white/5 border-2 border-primary/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground text-center">
                  Pronto para começar?
                </h3>
                <p className="text-muted-foreground text-center mt-1 text-xs sm:text-sm">
                  Invista no seu negócio hoje
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {service.price.toLocaleString()} MZN
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{service.priceNote}</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {service.category === 'Assistência GSM' ? (
                    <Button
                      onClick={handleGsmRent}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg"
                    >
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      {isAuthenticated ? 'Acessar GSM Dashboard' : 'Alugar Ferramentas GSM'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleQuickPurchase}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg"
                    >
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Comprar Agora
                    </Button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Customization - Only for eligible services */}
                    {service.category !== 'Assistência GSM' && service.category !== 'E-commerce' && (
                      <Button
                        onClick={() => handleSelectPlan('Personalizado', service.price.toString())}
                        variant="outline"
                        className="h-10 sm:h-12 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary hover:text-primary font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Personalizar
                      </Button>
                    )}

                    {/* Audiovisual Package Selection */}
                    {service.category === 'Produção Audiovisual' && (
                      <Button
                        onClick={() => handleSelectPlan('Pacotes Audiovisuais', service.price.toString())}
                        variant="outline"
                        className="h-10 sm:h-12 border-2 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500 text-orange-600 hover:text-orange-700 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Escolher Pacote
                      </Button>
                    )}

                    {/* Contact */}
                    <Button
                      onClick={handleContact}
                      variant="outline"
                      className="h-10 sm:h-12 border-2 border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* GSM Login Modal */}
      {showGsmLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6 pt-6 px-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📱</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2 gradient-text">
                GSM Premium
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Ferramentas GSM profissionais
              </p>
            </div>

            <div className="px-6 pb-6">
              <h3 className="text-base font-bold mb-3 flex items-center">
                <span className="mr-2">🔐</span>
                Criar Conta
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleGSMLogin({
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                  whatsapp: formData.get('whatsapp') as string
                });
              }} className="space-y-3">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="E-mail"
                />
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="WhatsApp"
                />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Palavra-passe"
                />
                <button
                  type="submit"
                  className="w-full neo hover-lift px-3 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Criar conta
                </button>
              </form>

              <div className="mt-6">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Adicionar Saldo
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%20500&amount=500')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    500 MZN
                  </button>
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%201000&amount=1000')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    1000 MZN
                  </button>
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%202000&amount=2000')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    2000 MZN
                  </button>
                  <button
                    onClick={() => {
                      const message = encodeURIComponent(`Olá! Gostaria de adicionar saldo ao meu GSM.`);
                      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span>💳</span>
                    Outros
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/gsm-dashboard')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="mr-1">🔧</span>
                    GSM
                  </button>
                  <button
                    onClick={() => {
                      const message = encodeURIComponent(`Olá! Preciso de suporte GSM.`);
                      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="mr-1">💬</span>
                    Suporte
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  try {
                    setShowGsmLogin(false);
                    // Limpar qualquer estado GSM se necessário
                    if (user && !isAuthenticated) {
                      setUser(null);
                    }
                  } catch (error) {
                    console.error('Erro ao fechar modal GSM:', error);
                    // Fallback forçado
                    setShowGsmLogin(false);
                  }
                }}
                className="w-full mt-4 neo hover-lift px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;