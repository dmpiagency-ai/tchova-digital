import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  LockKeyhole, 
  MessageCircle,
  Smartphone,
  Building,
  CreditCard,
  Wallet,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Header from '@/components/Header';
import { INDIVIDUAL_SERVICES, Service } from '@/config/pricing';
import { env } from '@/config/env';
import { useToast } from '@/hooks/use-toast';

// Form validation schema with Zod - Mobile First (simpler, no address required)
const checkoutFormSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  phone: z.string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\+?[0-9\s\-()]+$/, 'Telefone inválido')
    .min(9, 'Telefone deve ter pelo menos 9 dígitos'),
  notes: z.string()
    .max(500, 'Observações não podem ter mais de 500 caracteres')
    .optional(),
  paymentMethod: z.enum(['local-wallet', 'bank-transfer', 'credit-card', 'paypal'], {
    required_error: 'Selecione um método de pagamento'
  })
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Payment type from URL params
type PaymentType = 'entry-50' | 'full' | 'final-50' | 'installment';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success' | 'error'>('form');

  // Initialize react-hook-form with zod validation
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
      paymentMethod: 'local-wallet'
    },
    mode: 'onBlur'
  });

  const { formState: { isSubmitting } } = form;

  // Extract query parameters
  const serviceId = searchParams.get('serviceId');
  const serviceTitle = searchParams.get('serviceTitle');
  const serviceCategory = searchParams.get('serviceCategory');
  const project = searchParams.get('project');
  const paymentType = (searchParams.get('paymentType') as PaymentType) || 'entry-50';
  const agreedPrice = searchParams.get('price');

  useEffect(() => {
    if (serviceId) {
      const foundService = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId);
      setService(foundService || null);
    }
    setLoading(false);
  }, [serviceId]);

  // Calculate payment amount based on type
  const getPaymentInfo = () => {
    const basePrice = agreedPrice ? parseInt(agreedPrice) : (service?.price || 0);
    
    switch (paymentType) {
      case 'entry-50':
        return {
          type: 'Entrada 50%',
          description: 'Pagamento inicial para iniciar o projeto',
          amount: Math.round(basePrice * 0.5)
        };
      case 'final-50':
        return {
          type: 'Parcela Final 50%',
          description: 'Pagamento final para entrega do projeto',
          amount: Math.round(basePrice * 0.5)
        };
      case 'full':
        return {
          type: 'Pagamento Total',
          description: 'Pagamento integral do projeto',
          amount: basePrice
        };
      case 'installment':
        return {
          type: 'Parcela',
          description: 'Pagamento parcial do projeto',
          amount: basePrice
        };
      default:
        return {
          type: 'Entrada 50%',
          description: 'Pagamento inicial para iniciar o projeto',
          amount: Math.round(basePrice * 0.5)
        };
    }
  };

  const paymentInfo = getPaymentInfo();

  // Generate project reference
  const projectRef = `TCH-${Date.now().toString(36).toUpperCase()}`;

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setPaymentState('processing');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success (in real app, this would be an API call)
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        // Redirect to success page with all relevant data
        const successParams = new URLSearchParams({
          serviceName: serviceTitle || service?.title || 'Serviço',
          serviceId: serviceId || '',
          paymentType: paymentType,
          amount: paymentInfo.amount.toString(),
          projectId: projectRef,
          email: data.email
        });
        
        navigate(`/checkout/sucesso?${successParams.toString()}`);
      } else {
        setPaymentState('error');
        toast({
          title: "Pagamento falhou",
          description: "Não foi possível processar o pagamento. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentState('error');
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleContactWhatsApp = () => {
    const message = `Olá! Tive um problema com o pagamento do projeto ${serviceTitle || service?.title}. Podem ajudar?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Service not found
  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-center backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold mb-4">Projeto não encontrado</h1>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                O projeto que você está tentando pagar não existe ou foi removido.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="w-full h-12 rounded-[20px] font-semibold"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentState === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-center backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              {/* Success Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                ✔ Pagamento confirmado
              </h1>
              
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                O seu projeto foi ativado com sucesso.
              </p>
              
              {/* Project Reference */}
              <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent rounded-[16px] p-4 mb-6 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Referência do projeto</p>
                <p className="font-bold text-primary text-lg">{projectRef}</p>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Redirecionando automaticamente em alguns segundos...
              </p>
              
              <Button
                onClick={() => navigate(`/service?id=${serviceId}`)}
                className="w-full h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-semibold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl"
              >
                Voltar ao Serviço
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (paymentState === 'error') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-center backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-red-500/20 shadow-2xl">
              {/* Error Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                Pagamento não processado
              </h1>
              
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Não foi possível processar o pagamento.<br />
                Tente novamente ou fale com a Tchova no WhatsApp.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setPaymentState('form')}
                  className="w-full h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-semibold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Tentar novamente
                </Button>
                
                <Button
                  onClick={handleContactWhatsApp}
                  variant="outline"
                  className="w-full h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-semibold border-2 border-primary/30 hover:bg-primary/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com a Tchova
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  if (paymentState === 'processing') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-center backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              {/* Processing Animation */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-brand-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                Processando pagamento...
              </h1>
              
              <p className="text-muted-foreground mb-6 text-sm sm:text-base font-medium">
                Não feche esta página
              </p>
              
              {/* Progress indicator */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground">
                Aguarde enquanto processamos seu pagamento com segurança.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/10 via-brand-green/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-brand-yellow/10 via-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Header />
      
      <main className="container relative z-10 mx-auto px-4 py-6 max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-12 rounded-[24px] backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-400 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Security Header */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-gradient-to-r from-primary/10 via-brand-green/5 to-primary/10 border border-primary/20 shadow-xl text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-primary">Checkout Seguro</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Este pagamento está associado a um projeto confirmado com a Tchova Digital.
          </p>
        </div>

        {/* Project Summary */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center text-foreground">
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
              Resumo do Projeto
            </span>
          </h2>
          
          <div className="space-y-4">
            {/* Service Name */}
            <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent rounded-[16px] p-4 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Serviço</p>
              <p className="font-bold text-foreground text-sm sm:text-base">{serviceTitle || service.title}</p>
              {serviceCategory && (
                <p className="text-xs text-muted-foreground mt-1">{serviceCategory}</p>
              )}
            </div>
            
            {/* Payment Type & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-[16px] p-4 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">Tipo de pagamento</p>
                <p className="font-bold text-primary text-sm sm:text-base">{paymentInfo.type}</p>
              </div>
              <div className="bg-gradient-to-r from-brand-yellow/10 to-accent-light/10 rounded-[16px] p-4 border border-brand-yellow/20">
                <p className="text-xs text-muted-foreground mb-1">Valor</p>
                <p className="font-bold text-foreground text-sm sm:text-base">
                  {paymentInfo.amount.toLocaleString('pt-MZ')} MZN
                </p>
              </div>
            </div>
            
            {/* Project Reference */}
            <div className="flex items-center justify-between bg-white/5 rounded-[16px] p-4 border border-white/10">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Referência do projeto</p>
                <p className="font-mono font-bold text-foreground text-sm">{projectRef}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            {/* Payment Description */}
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              {paymentInfo.description}
            </p>
            
            {/* Trust Message */}
            <div className="bg-gradient-to-r from-primary/5 via-brand-green/5 to-primary/5 rounded-[16px] p-3 border border-primary/10 text-center">
              <p className="text-xs text-muted-foreground">
                💳 Pagamento autorizado após conversa com a nossa equipa.
              </p>
            </div>
          </div>
        </div>

        {/* Client Data Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados do Cliente */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center text-foreground">
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent">
                  Dados do Cliente
                </span>
              </h2>
              
              <div className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu nome completo"
                          className="h-12 sm:h-14 rounded-[16px] sm:rounded-[20px] text-base sm:text-lg border-white/20 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="h-12 sm:h-14 rounded-[16px] sm:rounded-[20px] text-base sm:text-lg border-white/20 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Número de telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+258 84 000 0000"
                          className="h-12 sm:h-14 rounded-[16px] sm:rounded-[20px] text-base sm:text-lg border-white/20 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Alguma informação adicional sobre o projeto..."
                          rows={3}
                          className="rounded-[16px] sm:rounded-[20px] text-base border-white/20 focus:border-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center text-foreground">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                  Método de Pagamento
                </span>
              </h2>
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                        {/* Carteira Local */}
                        <div
                          onClick={() => field.onChange('local-wallet')}
                          className={`flex items-center p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] cursor-pointer transition-all duration-300 border ${
                            field.value === 'local-wallet'
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-primary/30'
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                            <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm sm:text-base">Carteira Local</p>
                            <p className="text-xs text-muted-foreground">M-Pesa, e-Mola, mKesh</p>
                          </div>
                        </div>
                        
                        {/* Transferência Bancária */}
                        <div
                          onClick={() => field.onChange('bank-transfer')}
                          className={`flex items-center p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] cursor-pointer transition-all duration-300 border ${
                            field.value === 'bank-transfer'
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-primary/30'
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-dark to-brand-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                            <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm sm:text-base">Transferência</p>
                            <p className="text-xs text-muted-foreground">Bancária</p>
                          </div>
                        </div>
                        
                        {/* Cartão */}
                        <div
                          onClick={() => field.onChange('credit-card')}
                          className={`flex items-center p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] cursor-pointer transition-all duration-300 border ${
                            field.value === 'credit-card'
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-primary/30'
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                            <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm sm:text-base">Cartão</p>
                            <p className="text-xs text-muted-foreground">Crédito/Débito</p>
                          </div>
                        </div>
                        
                        {/* PayPal */}
                        <div
                          onClick={() => field.onChange('paypal')}
                          className={`flex items-center p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] cursor-pointer transition-all duration-300 border ${
                            field.value === 'paypal'
                              ? 'border-primary bg-primary/10 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-primary/30'
                          }`}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                            <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm sm:text-base">PayPal</p>
                            <p className="text-xs text-muted-foreground">Internacional</p>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Trust Message */}
              <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 via-brand-green/5 to-primary/5 rounded-[16px] border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Seus dados são protegidos. Nenhum pagamento é processado sem autorização.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-400 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                <span className="relative z-10">Confirmar Pagamento Seguro</span>
              </Button>
              
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Checkout protegido • Dados seguros
              </p>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default Checkout;
