export interface User {
  id: string;
  email: string;
  name: string;
  gsmCredits: number;
  gsmSubscription?: {
    plan: string;
    expiresAt: Date;
    isActive: boolean;
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface GSMCreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'purchase';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface GSMService {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  isActive: boolean;
}

export interface GSMPaymentMethod {
  id: string;
  name: string;
  type: 'mpesa' | 'emola' | 'bank_transfer' | 'card';
  isActive: boolean;
  config: Record<string, unknown>;
}