import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAICredits } from '@/contexts/AICreditsContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';

interface AICreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREDIT_PACKAGES = [
  { amount: 100, bonus: 0, price: 100 },
  { amount: 250, bonus: 25, price: 250 },
  { amount: 500, bonus: 75, price: 500 },
  { amount: 1000, bonus: 200, price: 1000 },
  { amount: 2500, bonus: 625, price: 2500 }
];

const PAYMENT_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Pagamento móvel local'
  },
  {
    id: 'emola',
    name: 'E-Mola',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Carteira digital local'
  },
  {
    id: 'bank',
    name: 'Transferência Bancária',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Transferência direta'
  },
  {
    id: 'card',
    name: 'Cartão de Crédito',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Visa, Mastercard'
  }
];

export const AICreditsModal: React.FC<AICreditsModalProps> = ({ isOpen, onClose }) => {
  const { addCredits } = useAICredits();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'packages' | 'method' | 'confirm' | 'success'>('packages');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePackageSelect = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setStep('method');
  };

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount >= 50) {
      setSelectedPackage({ amount, bonus: Math.floor(amount * 0.1), price: amount });
      setStep('method');
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('confirm');
  };

  const handleConfirmPayment = async () => {
    if (!selectedPackage || !selectedMethod) return;

    setIsProcessing(true);

    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Adicionar créditos
    const totalCredits = selectedPackage.amount + selectedPackage.bonus;
    addCredits(totalCredits, `Recarga de ${selectedPackage.amount} MZN + ${selectedPackage.bonus} bônus`);

    setIsProcessing(false);
    setStep('success');

    // Reset após 3 segundos
    setTimeout(() => {
      setStep('packages');
      setSelectedPackage(null);
      setSelectedMethod('');
      setCustomAmount('');
      onClose();
    }, 3000);
  };

  const resetModal = () => {
    setStep('packages');
    setSelectedPackage(null);
    setSelectedMethod('');
    setCustomAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span>Adicionar Créditos de IA</span>
          </DialogTitle>
          <DialogDescription>
            Recarregue seus créditos para usar as ferramentas de IA e criar conteúdo profissional.
          </DialogDescription>
        </DialogHeader>

        {step === 'packages' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Não sabe quanto carregar?</strong><br />
                Comece com 100 MZN e teste nossos serviços de IA.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Escolha um Pacote</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREDIT_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.amount}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{pkg.amount} MZN</CardTitle>
                          <CardDescription>Créditos de IA</CardDescription>
                        </div>
                        <div className="flex flex-col gap-1">
                          {pkg.amount === 500 && (
                            <Badge className="bg-yellow-500 text-yellow-900">⭐ Mais Popular</Badge>
                          )}
                          {pkg.bonus > 0 && (
                            <Badge className="bg-green-500">+{pkg.bonus} Bônus</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Total: {pkg.amount + pkg.bonus} créditos
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Valor Personalizado</h4>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Mínimo 50 MZN"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="50"
                />
                <Button
                  onClick={handleCustomAmount}
                  disabled={!customAmount || parseInt(customAmount) < 50}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'method' && selectedPackage && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <Card
                    key={method.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {method.icon}
                        <div>
                          <div className="font-semibold">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={() => setStep('packages')}>
              ← Voltar
            </Button>
          </div>
        )}

        {step === 'confirm' && selectedPackage && selectedMethod && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirmar Recarga</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Créditos:</span>
                      <span className="font-semibold">{selectedPackage.amount} MZN</span>
                    </div>
                    {selectedPackage.bonus > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Bônus:</span>
                        <span className="font-semibold">+{selectedPackage.bonus} MZN</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Total de Créditos:</span>
                      <span>{selectedPackage.amount + selectedPackage.bonus} MZN</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Método:</span>
                      <span>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('method')}>
                ← Voltar
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-600">Recarga Concluída!</h3>
              <p className="text-muted-foreground">
                {selectedPackage && `${selectedPackage.amount + selectedPackage.bonus} créditos foram adicionados à sua conta.`}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};