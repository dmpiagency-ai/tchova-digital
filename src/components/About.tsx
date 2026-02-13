import { Lightbulb, Shield, Users, Star, CheckCircle, Heart, MessageCircle, Zap, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';

const About = () => {
  // Diferenciais reais e tangíveis - sem promessas vazias
  const differentials = [
    {
      icon: Target,
      title: 'Foco no Seu Negócio',
      description: 'Cada projeto é pensado para suas necessidades específicas. Não usamos templates prontos.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      title: 'Prazos Claros',
      description: 'Definimos prazos realistas e cumprimos. Você sabe exatamente quando receber seu projeto.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Comunicação Direta',
      description: 'Você fala diretamente com quem está fazendo seu projeto. Sem intermediários.',
      color: 'from-primary to-brand-green'
    },
    {
      icon: Shield,
      title: 'Processo Organizado',
      description: 'Metodologia clara desde o briefing até a entrega. Você acompanha cada etapa.',
      color: 'from-brand-yellow to-amber-500'
    },
    {
      icon: CheckCircle,
      title: 'Revisões Incluídas',
      description: 'Ajustes e revisões fazem parte do processo. Trabalhamos até você estar satisfeito.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Heart,
      title: 'Suporte Após Entrega',
      description: 'Não acabou na entrega. Oferecemos suporte para garantir que tudo funcione.',
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Vi o site de vocês e gostaria de saber mais sobre como trabalham. Podem me explicar?');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-18 animate-fade-up">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Por Que Escolher a TchovaDigital</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Diferenciais que fazem diferença no seu projeto.
          </p>
        </div>

        {/* Diferenciais Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-105 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="mt-12 sm:mt-16 lg:mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-brand-green/5 to-brand-yellow/10 rounded-3xl p-6 sm:p-8 border border-primary/20 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-brand-green flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Soluções digitais pensadas para negócios que querem crescer
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Não prometemos milagres. Entregamos trabalho bem feito, no prazo, com comunicação clara.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-10">
          <Button
            onClick={handleWhatsApp}
            className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white rounded-[24px] px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar Conosco
          </Button>
        </div>
      </div>
    </section>
  );
};

export default About;
