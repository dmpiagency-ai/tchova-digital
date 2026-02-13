import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const PartnersCarousel: React.FC = () => {
  const partners = [
    {
      name: 'Vodacom',
      logo: 'https://via.placeholder.com/120x60/4F46E5/FFFFFF?text=VODACOM',
      category: 'Telecomunicações'
    },
    {
      name: 'Movitel',
      logo: 'https://via.placeholder.com/120x60/10B981/FFFFFF?text=MOVITEL',
      category: 'Telecomunicações'
    },
    {
      name: 'Tmcel',
      logo: 'https://via.placeholder.com/120x60/F59E0B/FFFFFF?text=TMCEL',
      category: 'Telecomunicações'
    },
    {
      name: 'Samsung',
      logo: 'https://via.placeholder.com/120x60/1F2937/FFFFFF?text=SAMSUNG',
      category: 'Tecnologia'
    },
    {
      name: 'Apple',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=APPLE',
      category: 'Tecnologia'
    },
    {
      name: 'Huawei',
      logo: 'https://via.placeholder.com/120x60/DF1B3F/FFFFFF?text=HUAWEI',
      category: 'Tecnologia'
    },
    {
      name: 'M-Pesa',
      logo: 'https://via.placeholder.com/120x60/4F46E5/FFFFFF?text=M-PESA',
      category: 'Pagamentos'
    },
    {
      name: 'EcoBank',
      logo: 'https://via.placeholder.com/120x60/DC2626/FFFFFF?text=ECOBANK',
      category: 'Bancário'
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Parceiros Certificados</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com os melhores parceiros do mercado para oferecer soluções completas
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Carrossel principal */}
          <div
            className="flex gap-8"
            style={{
              width: 'calc(200px * 24)', // Largura total dos logos
              animation: 'scroll 40s linear infinite',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running';
            }}
          >
            {/* Duplicar array para loop infinito */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <Card key={index} className="flex-shrink-0 w-48 h-24 hover-lift">
                <CardContent className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-24 h-12 object-contain mx-auto mb-2"
                    />
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {partner.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 dark:from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 dark:from-background to-transparent z-10 pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-200px * 8));
            }
          }
        `
      }} />
    </section>
  );
};