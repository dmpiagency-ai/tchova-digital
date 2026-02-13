import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { env } from '@/config/env';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Olá! Vi seu site e gostaria de saber mais sobre seus serviços de design digital.'
    );
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Main WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center hover:animate-none ${
            isOpen ? 'bg-green-600 rotate-90' : 'animate-bounce'
          }`}
          aria-label="Abrir WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>

        {/* Tooltip/Popup */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-72 sm:w-80 glass-card p-5 rounded-2xl shadow-2xl animate-fade-up border border-green-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">
                  Fale connosco no WhatsApp!
                </h4>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  Como posso ajudar você a transformar sua marca digital hoje?
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Iniciar Conversa
                </button>
              </div>
            </div>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r border-b border-green-500/20 transform rotate-45" />
          </div>
        )}
      </div>

    </>
  );
};

export default FloatingWhatsApp;
