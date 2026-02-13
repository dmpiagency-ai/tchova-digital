import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gsmService } from '@/services/gsmService';
import { paymentService, PaymentResult } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PaymentModal from '@/components/PaymentModal';
import {
  CreditCard,
  DollarSign,
  History,
  ShoppingCart,
  Smartphone,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const GSMDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const userCredits = gsmService.getUserCredits(user.id);
  const transactions = gsmService.getUserTransactions(user.id);
  const availableServices = gsmService.getAvailableServices();
  const canAccessPlatform = gsmService.canAccessGSMPlatform(user.id);

  const handlePaymentSuccess = (result: PaymentResult) => {
    setMessage({
      type: result.status === 'completed' ? 'success' : 'error',
      text: result.status === 'completed'
        ? `Pagamento de ${result.amount} MZN realizado com sucesso!`
        : result.errorMessage || 'Erro no processamento do pagamento'
    });
  };

  const openPaymentModal = () => {
    setIsPaymentModalOpen(true);
    setMessage(null);
  };

  const handleServicePurchase = (serviceId: string) => {
    const result = gsmService.purchaseService(user.id, serviceId);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  const handleAccessPlatform = () => {
    if (canAccessPlatform) {
      window.open('https://4youtech-rent-painel.com/', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel GSM</h1>
            <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
          </div>
          <Button variant="outline" onClick={() => {
            try {
              logout();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              // Fallback: forçar reload da página
              window.location.reload();
            }
          }}>
            Sair
          </Button>
        </div>

        {/* Status de Acesso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Status de Acesso à Plataforma GSM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {canAccessPlatform ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
                <span className={canAccessPlatform ? 'text-green-600' : 'text-orange-600'}>
                  {canAccessPlatform ? 'Acesso Liberado' : 'Créditos Insuficientes'}
                </span>
              </div>
              <Button
                onClick={handleAccessPlatform}
                disabled={!canAccessPlatform}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                {canAccessPlatform ? 'Entrar na Ferramenta GSM' : 'Adicionar Créditos Primeiro'}
              </Button>
            </div>
            {!canAccessPlatform && (
              <p className="text-sm text-muted-foreground mt-2">
                Adicione pelo menos 50 MZN para acessar a plataforma completa
              </p>
            )}
          </CardContent>
        </Card>

        {/* Saldo Atual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {userCredits.toLocaleString()} MZN
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Créditos disponíveis para serviços GSM
            </p>
          </CardContent>
        </Card>

        {/* Mensagens */}
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Tabs do Dashboard */}
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Adicionar Saldo</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Adicionar Saldo */}
          <TabsContent value="deposit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Créditos
                </CardTitle>
                <CardDescription>
                  Escolha seu método de pagamento preferido e adicione saldo instantaneamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {paymentService.getAvailablePaymentMethods().map((method) => (
                    <Card
                      key={method.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/50"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <h4 className="font-semibold text-sm">{method.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {method.config.processingFee ? `${method.config.processingFee}% taxa` : 'Sem taxa'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 Dicas de Segurança:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use sempre seus dados reais para pagamentos</li>
                    <li>• Verifique os valores antes de confirmar</li>
                    <li>• Créditos são adicionados instantaneamente após aprovação</li>
                    <li>• Todos os pagamentos são processados com criptografia SSL</li>
                  </ul>
                </div>

                <Button
                  onClick={openPaymentModal}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Escolher Método de Pagamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Serviços Disponíveis */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {service.cost} MZN
                      </span>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <Button
                      onClick={() => handleServicePurchase(service.id)}
                      disabled={userCredits < service.cost}
                      className="w-full"
                      variant={userCredits >= service.cost ? 'default' : 'secondary'}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {userCredits >= service.cost ? 'Pagar' : 'Créditos Insuficientes'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Histórico de Transações */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico de Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma transação encontrada
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'deposit' ? (
                            <Plus className="w-4 h-4 text-green-500" />
                          ) : transaction.type === 'withdrawal' ? (
                            <Minus className="w-4 h-4 text-red-500" />
                          ) : (
                            <ShoppingCart className="w-4 h-4 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.timestamp.toLocaleDateString('pt-MZ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} MZN
                          </p>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default GSMDashboard;