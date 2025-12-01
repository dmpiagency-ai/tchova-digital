import { Award, Users, Lightbulb, Heart, Star, Shield, CheckCircle, MessageCircle } from 'lucide-react';
import avatarFuturistic from '@/assets/avatar-futuristic.webp';
import { handleWhatsAppClick } from '@/lib/whatsapp';

const About = () => {
  const achievements = [
    {
      icon: Lightbulb,
      title: 'Inovação com IA',
      description: 'Utilizamos Inteligência Artificial avançada para criar soluções personalizadas e automatizar processos, garantindo a sua liderança no mercado.',
      badge: '🏆 Inovador'
    },
    {
      icon: Shield,
      title: 'Certificado ISO 27001',
      description: 'Segurança da informação certificada internacionalmente. Seus dados estão protegidos com os mais altos padrões globais.',
      badge: '🔒 Seguro'
    },
    {
      icon: Users,
      title: 'Plataforma Única',
      description: 'Elimine a gestão de múltiplos fornecedores. Criamos, assistimos e operamos: tudo a partir de um único ponto de contacto.',
      badge: '🎯 Completo'
    },
    {
      icon: Star,
      title: 'Vantagem Exclusiva',
      description: 'Enquanto membro do Ecossistema Tchova, você desbloqueia descontos e condições especiais inalcançáveis no acesso direto aos serviços.',
      badge: '💎 Premium'
    },
    {
      icon: CheckCircle,
      title: 'Garantia 30 Dias',
      description: 'Satisfação garantida ou devolvemos seu investimento. Confiança total no nosso trabalho.',
      badge: '✅ Garantido'
    },
    {
      icon: Heart,
      title: 'Suporte Total 360º',
      description: 'Garantia de suporte estratégico (marketing) e suporte operacional especializado, assegurando que sua performance é sempre máxima.',
      badge: '💙 Dedicado'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="order-2 lg:order-1 animate-fade-up">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="neo rounded-3xl p-8">
                <img
                  src={avatarFuturistic}
                  alt="Avatar Futurístico - TchovaDigital"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2 rounded-xl">
                <div className="text-sm font-semibold gradient-text">3+ Anos</div>
                <div className="text-xs text-muted-foreground">Experiência</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 rounded-xl">
                <div className="text-sm font-semibold gradient-text">100+</div>
                <div className="text-xs text-muted-foreground">Projetos</div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">A força que seu negócio precisa para vencer no digital.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div className="space-y-3">
                <p className="text-lg font-medium text-primary">Tudo em Um Lugar</p>
                <p className="text-base">Design, desenvolvimento web, marketing e suporte técnico reunidos para facilitar sua vida.</p>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-medium text-primary">Soluções Completas</p>
                <p className="text-base">Do conceito inicial ao lançamento e suporte contínuo do seu negócio digital.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="neo p-6 text-center hover-lift group animate-fade-up relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Trust Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {achievement.badge}
                  </div>

                  <div className="w-12 h-12 mx-auto mb-4 neo-inset rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <button
                className="w-full glass-card hover-glow px-8 py-4 rounded-2xl font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-300"
                onClick={() => handleWhatsAppClick('contact', 'consultation')}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Agendar Consulta Gratuita
              </button>

              <button
                className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;