import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Estados do botão mágico
type PaymentButtonState = 'hidden' | 'authorized' | 'paid' | 'started';

interface BotaoPagamentoMagicoProps {
  // Autorização validada pelo backend
  hasAuthorization: boolean;
  // Token de autorização válido
  tokenValid: boolean;
  // ID do serviço
  serviceId: string;
  // Título do serviço
  serviceTitle: string;
  // Categoria do serviço
  serviceCategory: string;
  // Preço acordado
  agreedPrice: number;
  // Tipo de pagamento (entry-50, full, final-50)
  paymentType?: 'entry-50' | 'full' | 'final-50' | 'installment';
  // Estado do pagamento (validado externamente)
  paymentStatus?: 'pending' | 'paid' | 'started';
  // Token de autorização
  authorizationToken?: string;
}

/**
 * Botão Mágico de Pagamento
 * 
 * REGRAS DE EXIBIÇÃO:
 * - O botão SÓ aparece se TODAS forem verdadeiras:
 *   - hasAuthorization === true
 *   - tokenValid === true
 *   - serviço corresponde ao token
 *   - sessão do cliente ativa
 * 
 * ESTADOS:
 * - hidden: Botão não renderiza (visitante comum)
 * - authorized: Botão visível (cliente autorizado)
 * - paid: Botão desativado (pagamento confirmado)
 * - started: Texto informativo (projeto iniciado)
 * 
 * PRINCÍPIO: O frontend NÃO decide quem paga.
 * Ele apenas reflete autorizações já validadas.
 */
const BotaoPagamentoMagico = ({
  hasAuthorization,
  tokenValid,
  serviceId,
  serviceTitle,
  serviceCategory,
  agreedPrice,
  paymentType = 'entry-50',
  paymentStatus = 'pending',
  authorizationToken
}: BotaoPagamentoMagicoProps) => {
  const navigate = useNavigate();

  // Determinar estado do botão
  const getButtonState = (): PaymentButtonState => {
    // Sem autorização = botão oculto
    if (!hasAuthorization || !tokenValid) {
      return 'hidden';
    }
    
    // Pagamento já realizado
    if (paymentStatus === 'paid') {
      return 'paid';
    }
    
    // Projeto já iniciado
    if (paymentStatus === 'started') {
      return 'started';
    }
    
    // Autorizado e pendente
    return 'authorized';
  };

  const buttonState = getButtonState();

  // NÃO renderizar nada se não autorizado
  if (buttonState === 'hidden') {
    return null;
  }

  // Construir URL do checkout
  const checkoutUrl = `/checkout/seguro?serviceId=${serviceId}&serviceTitle=${encodeURIComponent(serviceTitle)}&serviceCategory=${encodeURIComponent(serviceCategory)}&price=${agreedPrice}&paymentType=${paymentType}&token=${authorizationToken}`;

  // Estado: Autorizado (botão visível)
  if (buttonState === 'authorized') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
          <Shield className="w-4 h-4" />
          <span>Pagamento autorizado pela Tchova Digital</span>
        </div>
        
        <Button
          onClick={() => navigate(checkoutUrl)}
          className="w-full h-14 sm:h-16 rounded-xl font-bold text-base bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <Shield className="w-5 h-5 mr-2" />
          Efetuar Pagamento do Projeto
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Pagamento autorizado pela Tchova Digital
        </p>
      </div>
    );
  }

  // Estado: Pago (botão desativado)
  if (buttonState === 'paid') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
          <CheckCircle className="w-4 h-4" />
          <span>Pagamento confirmado</span>
        </div>
        
        <Button
          disabled
          className="w-full h-14 sm:h-16 rounded-xl font-bold text-base bg-green-600 text-white cursor-not-allowed opacity-80"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Pagamento Confirmado
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Aguarde o início do projeto
        </p>
      </div>
    );
  }

  // Estado: Projeto iniciado (texto informativo)
  if (buttonState === 'started') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-2">
          <Clock className="w-4 h-4" />
          <span>Projeto em andamento</span>
        </div>
        
        <div className="w-full h-14 sm:h-16 rounded-xl font-bold text-base bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Clock className="w-5 h-5 mr-2" />
          Projeto Iniciado
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Acompanhe o progresso pelo WhatsApp
        </p>
      </div>
    );
  }

  return null;
};

export default BotaoPagamentoMagico;
