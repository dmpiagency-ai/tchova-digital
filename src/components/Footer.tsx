import { ArrowUp, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { env } from '@/config/env';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted/40 border-t border-border/30 relative">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 lg:py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-8">

          {/* Brand Section */}
          <div className="text-center md:text-left md:col-span-2">
            <h3 className="text-xl font-bold gradient-text mb-3">
              TchovaDigital
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm max-w-sm">
              Soluções digitais pensadas para negócios que querem crescer online. 
              Design, desenvolvimento e marketing num só lugar.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => {
                  const message = encodeURIComponent('Olá! Vi o site de vocês e gostaria de saber mais sobre os serviços.');
                  window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-brand-green text-white rounded-[24px] py-2.5 px-6 font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Falar Conosco
              </button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4 text-sm">Links Rápidos</h4>
            <nav className="space-y-2">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Serviços', href: '#services' },
                { name: 'Como Funciona', href: '#how-it-works' },
                { name: 'Planos', href: '#planos' },
              ].map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium mx-auto text-sm"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contacto & Social */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-4 text-sm">Contacto</h4>
            <div className="space-y-2 text-muted-foreground text-sm mb-4">
              <p>Maputo, Moçambique</p>
              <p>+258 84 123 4567</p>
            </div>
            
            {/* Social Media */}
            <div className="flex justify-center space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61582720743448"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/tchovadigitalmz/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-pink-600 hover:bg-pink-500/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-muted-foreground text-xs text-center sm:text-left">
              © 2025 TchovaDigital. Todos os direitos reservados.
            </p>

            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-xs flex items-center">
                Feito com <span className="mx-1">💚</span> em Moçambique
              </p>
              
              {/* Back to Top Button */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Voltar ao topo"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>
    </footer>
  );
};

export default Footer;
