import { Check, Star, Zap, Smartphone, MessageCircle, LogOut, Shield, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleWhatsAppClick, getPricingMessage } from '@/lib/whatsapp';
import { env } from '@/config/env';
import { SERVICE_PLANS, getWhatsAppMessage } from '@/config/pricing';
import LoginModal from '@/components/LoginModal';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  type HandleServiceAccess = (serviceType: string, serviceData?: { title?: string; type?: string; requiresLogin?: boolean }) => void;

  const invokeGsmRoute = (): boolean => {
    const route = (window as unknown as { handleServiceAccess?: HandleServiceAccess }).handleServiceAccess;
    if (typeof route === 'function') {
      route('gsm-rental', { title: 'GSM', type: 'gsm', requiresLogin: true });
      return true;
    }
    return false;
  };

  const handleGsmAccess = () => {
    if (invokeGsmRoute()) return;
    if (isAuthenticated) {
      window.open('https://gsm.tchova.digital', '_blank');
    } else {
      invokeGsmRoute();
    }
  };

  const handlePlanPurchase = (plan: { name: string; price: number; }) => {
    navigate(`/payment?service=${encodeURIComponent(plan.name)}&amount=${plan.price.toString()}`);
  };

  const handleCustomizePlan = (plan: { name: string; price: number; }) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/customize-services?plan=${encodeURIComponent(plan.name)}&price=${plan.price.toString()}`);
  };

  const handlePlanWhatsApp = (plan: { name: string; }) => {
    const message = getWhatsAppMessage('plan', plan.name);
    const whatsappUrl = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const plans = SERVICE_PLANS;

  return (
    <section id="planos" className="bg-gray-50 dark:bg-background py-4 sm:py-6 lg:py-12 pricing-section">

      <div className="container">
        {/* Header Principal - Foco no Essencial */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-12 animate-fade-up">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 pricing-title">
            <span className="gradient-text">Escolha seu Plano</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto font-light pricing-description">
            Soluções completas para levar seu negócio ao próximo nível
          </p>
        </div>

        {/* Status do Usuário - Compacto e Não Distrativo */}
        {(isAdmin || isAuthenticated) && (
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="flex gap-2 sm:gap-3">
              {isAdmin && (
                <a
                  href="/admin/gsm"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </a>
              )}

              {isAuthenticated && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-green-200 dark:border-green-800 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-semibold text-green-800 dark:text-green-200">GSM Ativo</p>
                      <p className="text-xs text-green-600 dark:text-green-400">{user?.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs h-6 sm:h-7 px-1.5 sm:px-2"
                        onClick={handleGsmAccess}
                      >
                        <span className="hidden sm:inline">GSM</span>
                        <Smartphone className="w-3 h-3 sm:hidden" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-green-600 hover:text-red-600 dark:text-green-400 dark:hover:text-red-400 text-xs h-6 sm:h-7 px-1.5 sm:px-2"
                      >
                        <LogOut className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planos - Foco no Essencial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pricing-grid-mobile">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white/95 dark:bg-card/95 backdrop-blur-sm shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border-t-4 ${plan.borderColor} flex flex-col justify-between relative animate-fade-up hover:shadow-2xl hover:scale-105 transition-all duration-500 group overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >

              <div className="relative z-10">
                {/* Ícone */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 neo-inset rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <plan.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                </div>

                {/* Título */}
                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 dark:text-foreground mb-1.5 sm:mb-2 leading-tight text-center">{plan.name}</h3>

                {/* Preço */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-yellow-500 dark:text-yellow-400">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-xs text-gray-400 line-through mt-1">
                      De: {plan.originalPrice.toLocaleString()} MZN
                    </div>
                  )}
                </div>

                {/* Recursos Essenciais */}
                <ul className="text-left text-gray-700 dark:text-muted-foreground space-y-1 sm:space-y-1.5 mb-4 sm:mb-5">
                  {plan.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-muted-foreground leading-relaxed text-xs">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-xs text-muted-foreground font-medium">
                      +{plan.features.length - 3} mais...
                    </li>
                  )}
                </ul>
              </div>

              {/* Botões */}
              <div className="relative z-10 space-y-2">
                <Button
                  onClick={() => handlePlanPurchase(plan)}
                  className={`w-full ${plan.buttonColor} text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg font-bold text-xs transition-all duration-300 hover-lift shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <CreditCard className="w-3 h-3 mr-1 relative z-10" />
                  <span className="hidden sm:inline relative z-10">
                    {plan.buttonAction === 'kit-vender' ? '🚀 Começar Agora' : 
                     plan.buttonAction === 'descolagem' ? '⚡ Descolar Digital' :
                     plan.buttonAction === 'aceleracao' ? '📈 Acelerar Crescimento' :
                     '👑 Orçamento VIP'}
                  </span>
                  <span className="sm:hidden relative z-10">Comprar</span>
                </Button>

                <Button
                  onClick={() => handlePlanWhatsApp(plan)}
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-green-600 hover:border-green-600 py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg font-semibold text-xs transition-all duration-300 hover-lift"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">💬 Tirar Dúvidas</span>
                  <span className="sm:hidden">💬</span>
                </Button>

                {/* Trust Elements */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="w-3 h-3 text-blue-500" />
                    <span>Satisfação Garantida</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Personalizar Plano"
        description="Faça login para personalizar seu plano e acessar recursos exclusivos"
      />
    </section>
  );
};

export default Pricing;