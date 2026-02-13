import { MessageCircle, FileText, Palette, Rocket, Headphones, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';

const HowItWorks = () => {
  // Processo detalhado - gera confiança através de clareza
  const steps = [
    {
      number: 1,
      title: "Conversa Inicial",
      description: "Você nos conta sobre seu negócio e objetivos. Entendemos suas necessidades e sugerimos a melhor solução.",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Planejamento",
      description: "Definimos juntos o escopo, prazos e investimentos. Tudo claro e acordado antes de começar.",
      icon: <FileText className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 3,
      title: "Desenvolvimento",
      description: "Nossa equipe trabalha no seu projeto. Você acompanha o progresso e pode dar feedback durante o processo.",
      icon: <Palette className="w-6 h-6" />,
      color: "from-primary to-brand-green"
    },
    {
      number: 4,
      title: "Entrega",
      description: "Recebe seu projeto finalizado, revisado e pronto para usar. Tudo testado e funcionando.",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-brand-yellow to-amber-500"
    },
    {
      number: 5,
      title: "Suporte Contínuo",
      description: "Não acabou! Oferecemos suporte após a entrega para garantir que tudo funcione perfeitamente.",
      icon: <Headphones className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre como funciona o processo de vocês. Podem me explicar?');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="how-it-works" className="section-spacing relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-primary/5 via-accent/5 to-purple-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-tr from-blue-500/5 via-primary/5 to-cyan-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-up">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Como Funciona</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-light">
            Processo claro e organizado. Você sabe exatamente o que esperar em cada etapa.
          </p>
        </div>

        {/* Steps - Timeline Vertical Mobile, Horizontal Desktop */}
        <div className="max-w-5xl mx-auto">
          {/* Mobile - Vertical Timeline */}
          <div className="md:hidden space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex gap-4 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent" />
                )}
                
                {/* Step Number & Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary">Passo {step.number}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop - Horizontal Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-white/10 rounded-full">
                <div className="h-full w-full bg-gradient-to-r from-blue-500 via-primary to-green-500 rounded-full" />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-5 gap-4 relative">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="relative animate-fade-up text-center"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Step Circle */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <span className="text-xs font-bold text-primary mb-1 block">Passo {step.number}</span>
                      <h3 className="text-sm font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-brand-green/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Processo transparente do início ao fim
            </span>
          </div>

          <div>
            <Button
              onClick={handleWhatsApp}
              className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white rounded-[24px] px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
