// Interfaces padronizadas para integração com APIs externas
// Permite conectar diferentes serviços sem modificar código core

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export interface APIClient {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  timeout: number;

  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>>;
  post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
  put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
  delete<T>(endpoint: string): Promise<APIResponse<T>>;
  patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>>;
}

export interface PaymentAPI {
  processPayment(amount: number, method: string, userId: string): Promise<APIResponse<{
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
  }>>;
  verifyPayment(transactionId: string): Promise<APIResponse<{
    status: 'pending' | 'completed' | 'failed';
    amount: number;
  }>>;
}

export interface GSMAPI {
  getUserBalance(userId: string): Promise<APIResponse<{ balance: number }>>;
  getUserTransactions(userId: string): Promise<APIResponse<{
    transactions: Array<{
      id: string;
      amount: number;
      type: string;
      description: string;
      timestamp: string;
    }>;
  }>>;
  addCredits(userId: string, amount: number, description: string): Promise<APIResponse<{
    newBalance: number;
    transactionId: string;
  }>>;
  purchaseService(userId: string, serviceId: string): Promise<APIResponse<{
    success: boolean;
    message: string;
    remainingBalance: number;
  }>>;
}

export interface AnalyticsAPI {
  trackEvent(event: string, data: Record<string, unknown>): Promise<APIResponse>;
  trackPageView(page: string, userId?: string): Promise<APIResponse>;
  getAnalyticsReport(dateRange: { start: string; end: string }): Promise<APIResponse<{
    pageViews: number;
    events: Array<{
      event: string;
      count: number;
    }>;
  }>>;
}

export interface NotificationAPI {
  sendNotification(userId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }): Promise<APIResponse>;
  getUserNotifications(userId: string): Promise<APIResponse<{
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      read: boolean;
      timestamp: string;
    }>;
  }>>;
}

export interface PluginAPI {
  loadPlugin(pluginId: string): Promise<APIResponse<{
    plugin: {
      id: string;
      name: string;
      version: string;
      config: Record<string, unknown>;
    };
  }>>;
  executePluginHook(pluginId: string, hook: string, data: unknown): Promise<APIResponse>;
  getAvailablePlugins(): Promise<APIResponse<{
    plugins: Array<{
      id: string;
      name: string;
      description: string;
      version: string;
    }>;
  }>>;
}

// Implementação padrão do cliente API
export class DefaultAPIClient implements APIClient {
  baseURL: string;
  defaultHeaders: Record<string, string>;
  timeout: number;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}, timeout = 10000) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.timeout = timeout;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<APIResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }
}

// Factory para criar diferentes tipos de API
export class APIFactory {
  private clients: Map<string, APIClient> = new Map();

  createClient(name: string, baseURL: string, headers?: Record<string, string>): APIClient {
    const client = new DefaultAPIClient(baseURL, headers);
    this.clients.set(name, client);
    return client;
  }

  getClient(name: string): APIClient | undefined {
    return this.clients.get(name);
  }

  createPaymentAPI(client: APIClient): PaymentAPI {
    return {
      processPayment: async (amount, method, userId) =>
        client.post('/payments/process', { amount, method, userId }),

      verifyPayment: async (transactionId) =>
        client.get(`/payments/verify/${transactionId}`)
    };
  }

  createGSMAPI(client: APIClient): GSMAPI {
    return {
      getUserBalance: async (userId) =>
        client.get(`/gsm/balance/${userId}`),

      getUserTransactions: async (userId) =>
        client.get(`/gsm/transactions/${userId}`),

      addCredits: async (userId, amount, description) =>
        client.post('/gsm/credits/add', { userId, amount, description }),

      purchaseService: async (userId, serviceId) =>
        client.post('/gsm/services/purchase', { userId, serviceId })
    };
  }

  createAnalyticsAPI(client: APIClient): AnalyticsAPI {
    return {
      trackEvent: async (event, data) =>
        client.post('/analytics/track', { event, data }),

      trackPageView: async (page, userId) =>
        client.post('/analytics/pageview', { page, userId }),

      getAnalyticsReport: async (dateRange) =>
        client.get('/analytics/report', dateRange)
    };
  }

  createNotificationAPI(client: APIClient): NotificationAPI {
    return {
      sendNotification: async (userId, notification) =>
        client.post('/notifications/send', { userId, notification }),

      getUserNotifications: async (userId) =>
        client.get(`/notifications/${userId}`)
    };
  }

  createPluginAPI(client: APIClient): PluginAPI {
    return {
      loadPlugin: async (pluginId) =>
        client.get(`/plugins/${pluginId}`),

      executePluginHook: async (pluginId, hook, data) =>
        client.post(`/plugins/${pluginId}/hook`, { hook, data }),

      getAvailablePlugins: async () =>
        client.get('/plugins')
    };
  }
}

// Instância singleton da factory
export const apiFactory = new APIFactory();

// Função utilitária para criar APIs conectadas
export const createConnectedAPI = <T>(
  clientName: string,
  baseURL: string,
  apiCreator: (client: APIClient) => T
): T => {
  const client = apiFactory.createClient(clientName, baseURL);
  return apiCreator(client);
};

export default APIFactory;