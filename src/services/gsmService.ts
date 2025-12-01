import { User, GSMCreditTransaction, GSMService, GSMPaymentMethod } from '@/types/user';

// Configuração externa - pode ser carregada de API ou arquivo JSON
interface GSMConfig {
  minimumDeposit: number;
  maximumDeposit: number;
  currency: string;
  services: GSMService[];
  paymentMethods: GSMPaymentMethod[];
  partnerPlatformUrl: string;
  apiEndpoints: {
    balance: string;
    transactions: string;
    deposit: string;
    services: string;
  };
}

class GSMServiceManager {
  private config: GSMConfig;
  private userCredits: Map<string, number> = new Map();
  private transactions: Map<string, GSMCreditTransaction[]> = new Map();

  constructor(config?: Partial<GSMConfig>) {
    // Configuração padrão - pode ser sobrescrita por API externa
    this.config = {
      minimumDeposit: 50,
      maximumDeposit: 10000,
      currency: 'MZN',
      partnerPlatformUrl: 'https://gsm.tchova.digital',
      services: [
        {
          id: 'unlock-basic',
          name: 'Desbloqueio Básico',
          description: 'Desbloqueio de smartphones básicos',
          cost: 200,
          category: 'unlock',
          isActive: true
        },
        {
          id: 'firmware-update',
          name: 'Atualização de Firmware',
          description: 'Atualização completa do sistema',
          cost: 150,
          category: 'maintenance',
          isActive: true
        },
        {
          id: 'imei-repair',
          name: 'Reparação IMEI',
          description: 'Correção de problemas de IMEI',
          cost: 300,
          category: 'repair',
          isActive: true
        }
      ],
      paymentMethods: [
        {
          id: 'mpesa',
          name: 'M-Pesa',
          type: 'mpesa',
          isActive: true,
          config: { merchantId: 'TCHOVA001' }
        },
        {
          id: 'emola',
          name: 'E-mola',
          type: 'emola',
          isActive: true,
          config: { merchantId: 'TCHOVA001' }
        }
      ],
      apiEndpoints: {
        balance: '/api/gsm/balance',
        transactions: '/api/gsm/transactions',
        deposit: '/api/gsm/deposit',
        services: '/api/gsm/services'
      },
      ...config
    };

    this.loadPersistedData();
  }

  // Carregar dados persistidos
  private loadPersistedData() {
    const credits = localStorage.getItem('gsm-user-credits');
    const txns = localStorage.getItem('gsm-transactions');

    if (credits) {
      this.userCredits = new Map(JSON.parse(credits));
    }

    if (txns) {
      const parsedTxns = JSON.parse(txns);
      Object.keys(parsedTxns).forEach(userId => {
        this.transactions.set(userId, parsedTxns[userId].map((t: GSMCreditTransaction & { timestamp: string }) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })));
      });
    }
  }

  // Salvar dados
  private saveData() {
    localStorage.setItem('gsm-user-credits', JSON.stringify(Array.from(this.userCredits.entries())));
    localStorage.setItem('gsm-transactions', JSON.stringify(
      Object.fromEntries(
        Array.from(this.transactions.entries()).map(([k, v]) => [
          k,
          v.map(t => ({ ...t, timestamp: t.timestamp.toISOString() }))
        ])
      )
    ));
  }

  // Sistema de Créditos
  getUserCredits(userId: string): number {
    return this.userCredits.get(userId) || 0;
  }

  addCredits(userId: string, amount: number, description: string = 'Depósito de crédito'): boolean {
    if (amount <= 0) return false;

    const currentCredits = this.getUserCredits(userId);
    this.userCredits.set(userId, currentCredits + amount);

    // Registrar transação
    this.addTransaction(userId, {
      id: Date.now().toString(),
      userId,
      amount,
      type: 'deposit',
      description,
      timestamp: new Date(),
      status: 'completed'
    });

    this.saveData();
    return true;
  }

  deductCredits(userId: string, amount: number, description: string): boolean {
    const currentCredits = this.getUserCredits(userId);
    if (currentCredits < amount) return false;

    this.userCredits.set(userId, currentCredits - amount);

    // Registrar transação
    this.addTransaction(userId, {
      id: Date.now().toString(),
      userId,
      amount: -amount,
      type: 'withdrawal',
      description,
      timestamp: new Date(),
      status: 'completed'
    });

    this.saveData();
    return true;
  }

  // Sistema de Transações
  private addTransaction(userId: string, transaction: GSMCreditTransaction) {
    const userTransactions = this.transactions.get(userId) || [];
    userTransactions.unshift(transaction); // Mais recente primeiro
    this.transactions.set(userId, userTransactions.slice(0, 100)); // Manter apenas últimas 100
  }

  getUserTransactions(userId: string): GSMCreditTransaction[] {
    return this.transactions.get(userId) || [];
  }

  // Serviços GSM
  getAvailableServices(): GSMService[] {
    return this.config.services.filter(s => s.isActive);
  }

  purchaseService(userId: string, serviceId: string): { success: boolean; message: string } {
    const service = this.config.services.find(s => s.id === serviceId);
    if (!service) {
      return { success: false, message: 'Serviço não encontrado' };
    }

    if (!this.deductCredits(userId, service.cost, `Compra: ${service.name}`)) {
      return { success: false, message: 'Créditos insuficientes' };
    }

    return { success: true, message: `Serviço ${service.name} adquirido com sucesso` };
  }

  // Métodos de Pagamento
  getPaymentMethods(): GSMPaymentMethod[] {
    return this.config.paymentMethods.filter(m => m.isActive);
  }

  // Verificação de Acesso à Plataforma
  canAccessGSMPlatform(userId: string): boolean {
    const credits = this.getUserCredits(userId);
    return credits >= this.config.minimumDeposit;
  }

  // Configuração Externa
  updateConfig(newConfig: Partial<GSMConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): GSMConfig {
    return { ...this.config };
  }

  // Método para integração com APIs externas
  async syncWithExternalAPI(userId: string): Promise<void> {
    // Placeholder para integração com API externa
    // Em produção, isso faria chamadas HTTP para sincronizar dados
    console.log(`Sincronizando dados GSM para usuário ${userId}`);
  }
}

// Instância singleton
export const gsmService = new GSMServiceManager();

// Função para atualizar configuração externamente
export const updateGSMConfig = (config: Partial<GSMConfig>) => {
  gsmService.updateConfig(config);
};

export default GSMServiceManager;