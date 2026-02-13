import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check, Clock } from "lucide-react";
import { SERVICE_PLANS } from "@/config/pricing";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

const Pricing = () => {
  const handleContact = (plan: typeof SERVICE_PLANS[0]) => {
    const message = encodeURIComponent(`Olá! Vi o plano ${plan.name} (${plan.price.toLocaleString('pt-MZ')} MZN) e quero saber mais. Podem ajudar?`);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, "_blank");
    logger.info("Plan contact initiated", { plan: plan.name });
  };

  return (
    <section id="planos" className="section-spacing relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-12 w-48 h-48 bg-gradient-to-br from-primary/8 via-accent/8 to-purple-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-12 w-56 h-56 bg-gradient-to-tr from-blue-500/8 via-primary/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-up">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Planos para Colocar o Seu Negócio Online e a Vender</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Pacotes estratégicos de marketing digital, design e presença online para negócios que querem crescer.
          </p>
        </div>

        {/* Cards dos Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 px-1 sm:px-2">
          {SERVICE_PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`hover:translate-y-[-4px] hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                plan.highlighted
                  ? "border-primary/50 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 ring-2 ring-primary/20"
                  : "border-white/10 bg-white/95 dark:bg-card/95"
              }`}
            >
              {/* Badge no topo */}
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
              )}
              
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlighted 
                        ? 'bg-primary/20' 
                        : 'bg-white/10 dark:bg-white/5'
                    }`}>
                      <plan.icon className={`w-5 h-5 ${plan.priceColor}`} />
                    </div>
                    <CardTitle className={`text-lg sm:text-xl ${plan.priceColor}`}>
                      {plan.name}
                    </CardTitle>
                  </div>
                  {plan.badge && (
                    <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}
                </div>
                
                {/* Preço */}
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-2xl sm:text-3xl font-bold ${plan.priceColor || "text-primary"}`}>
                    {plan.price.toLocaleString('pt-MZ')}
                  </span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                
                {/* Tempo de entrega */}
                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{plan.deliveryTime}</span>
                </div>
                
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-0">
                <ul className="space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-2 pb-4 sm:pb-5 px-4 sm:px-5">
                <div className="w-full space-y-2">
                  {/* Botão Principal: Falar com a Tchova */}
                  <Button
                    onClick={() => handleContact(plan)}
                    className={`w-full font-medium text-sm py-2.5 sm:py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${plan.buttonColor} text-white`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{plan.buttonText}</span>
                  </Button>
                  
                  {/* Subtexto */}
                  <p className="text-xs text-center text-muted-foreground">
                    Atendimento humano • Sem compromisso
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Texto de contexto abaixo dos planos */}
        <div className="text-center mt-10 sm:mt-14 animate-fade-up">
          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border border-white/10">
            <p className="text-sm sm:text-base text-muted-foreground">
              <span className="font-medium text-foreground">Os pagamentos são realizados apenas após conversa e definição clara do projeto.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
