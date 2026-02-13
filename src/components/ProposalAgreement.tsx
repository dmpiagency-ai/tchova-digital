import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, ArrowRight, MessageCircle } from 'lucide-react';
import { PaymentType, PaymentStage, getPaymentStageLabel, getPaymentTypeLabel } from '@/types/payment';

interface ProposalAgreementProps {
  serviceTitle: string;
  serviceCategory: string;
  paymentType: PaymentType;
  paymentStage: PaymentStage;
  amount?: string;
  description?: string;
  deliverables?: string[];
  timeline?: string;
  onAccept: () => void;
  onContact: () => void;
  onCancel: () => void;
}

const ProposalAgreement = ({
  serviceTitle,
  serviceCategory,
  paymentType,
  paymentStage,
  amount,
  description,
  deliverables = [],
  timeline,
  onAccept,
  onContact,
  onCancel
}: ProposalAgreementProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  const getPaymentContext = () => {
    switch (paymentStage) {
      case PaymentStage.INITIATION:
        return {
          title: 'Pagamento de Início do Projeto',
          description: 'Este pagamento ativa o início do seu projeto conforme acordado com a TchovaDigital.',
          cta: 'Confirmar Início do Projeto'
        };
      case PaymentStage.COMPLETION:
        return {
          title: 'Pagamento Final do Projeto',
          description: 'Este pagamento finaliza o projeto após confirmação da entrega.',
          cta: 'Finalizar Pagamento do Projeto'
        };
      case PaymentStage.FULL:
        return {
          title: 'Pagamento do Serviço',
          description: 'Este pagamento ativa o serviço conforme acordado.',
          cta: 'Confirmar Pagamento'
        };
      case PaymentStage.RENEWAL:
        return {
          title: 'Renovação do Plano',
          description: 'Este pagamento renova o seu plano para o próximo período.',
          cta: 'Renovar Plano'
        };
      case PaymentStage.CONTINUATION:
        return {
          title: 'Continuação do Serviço',
          description: 'Este pagamento continua o serviço para a próxima etapa.',
          cta: 'Continuar Serviço'
        };
      default:
        return {
          title: 'Pagamento',
          description: 'Este pagamento ativa o serviço.',
          cta: 'Confirmar'
        };
    }
  };

  const context = getPaymentContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Proposta de Serviço
          </h1>
          <p className="text-muted-foreground text-lg">
            Revise os detalhes antes de confirmar
          </p>
        </div>

        {/* Main Proposal Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-2">{serviceTitle}</CardTitle>
                <CardDescription className="text-base">
                  {serviceCategory}
                </CardDescription>
              </div>
              <Badge variant="outline" className="ml-4">
                {getPaymentTypeLabel(paymentType)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Payment Context */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-green-900 dark:text-green-100 mb-2">
                    {context.title}
                  </h3>
                  <p className="text-green-800 dark:text-green-200">
                    {context.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            {amount && (
              <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground mb-2">Valor do Pagamento</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {amount}
                </p>
              </div>
            )}

            {/* Description */}
            {description && (
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Descrição do Serviço
                </h4>
                <p className="text-muted-foreground leading-relaxed pl-7">
                  {description}
                </p>
              </div>
            )}

            {/* Deliverables */}
            {deliverables.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  O que está incluído
                </h4>
                <ul className="space-y-2 pl-7">
                  {deliverables.map((item, index) => (
                    <li key={index} className="flex items-start text-muted-foreground">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {timeline && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg text-amber-900 dark:text-amber-100 mb-2">
                      Prazo de Entrega
                    </h4>
                    <p className="text-amber-800 dark:text-amber-200">
                      {timeline}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                <strong>Importante:</strong> Ao confirmar este pagamento, você está autorizando o início ou continuação do serviço conforme acordado. Este não é um processo de compra de produto, mas sim a ativação de uma etapa do projeto.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-14 text-base"
            >
              Voltar
            </Button>
            <Button
              onClick={onContact}
              variant="outline"
              className="flex-1 h-14 text-base border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com a Tchova
            </Button>
            <Button
              onClick={handleAccept}
              disabled={accepted}
              className="flex-1 h-14 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            >
              {accepted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmado
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {context.cta}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Precisa de mais informações antes de confirmar?
          </p>
          <Button
            onClick={onContact}
            variant="ghost"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Falar com a TchovaDigital
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProposalAgreement;
