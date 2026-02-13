import { MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';

const Contact = () => {
  const { trackButtonClick } = useAnalytics();

  const handleContactClick = () => {
    trackButtonClick('contact', 'whatsapp_main');
    handleWhatsAppClick('contact', 'general');
  };

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 via-emerald-500/5 to-green-500/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pronto para Começar?</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Leve seu negócio para o digital</span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Seu negócio merece estar online e gerando resultados reais. 
            <span className="block mt-2 text-foreground font-medium">Converse gratuitamente com um especialista.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Button
              className="tech-button bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 text-white font-bold px-10 py-6 rounded-[24px] text-lg hover:scale-105 hover:shadow-2xl transition-all duration-400 group"
              onClick={handleContactClick}
            >
              <MessageCircle className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Falar no WhatsApp
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Resposta rápida
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Sem compromisso
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Consultoria gratuita
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
