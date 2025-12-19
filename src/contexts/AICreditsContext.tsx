import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { logger } from '@/lib/logger';
import { sanitizeLocalStorageData } from '@/lib/sanitize';

interface AICredits {
  balance: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: Date;
  tool?: string;
}

interface AICreditsContextType {
  credits: AICredits;
  addCredits: (amount: number, description: string) => void;
  deductCredits: (amount: number, tool: string, description: string) => boolean;
  getTransactionHistory: () => Transaction[];
  hasEnoughCredits: (amount: number) => boolean;
  isLoading: boolean;
}

const AICreditsContext = createContext<AICreditsContextType | undefined>(undefined);

export const useAICredits = () => {
  const context = useContext(AICreditsContext);
  if (context === undefined) {
    throw new Error('useAICredits must be used within an AICreditsProvider');
  }
  return context;
};

interface AICreditsProviderProps {
  children: ReactNode;
}

export const AICreditsProvider: React.FC<AICreditsProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<AICredits>({
    balance: 0,
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar créditos do usuário quando logado
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCredits = localStorage.getItem(`ai_credits_${user.id}`);
      if (savedCredits) {
        try {
          const sanitizedCredits = sanitizeLocalStorageData<AICredits>(savedCredits, {
            balance: 0,
            transactions: []
          });
          if (sanitizedCredits) {
            // Converter timestamps de string para Date
            const processedCredits = {
              ...sanitizedCredits,
              transactions: sanitizedCredits.transactions.map(t => ({
                ...t,
                timestamp: new Date(t.timestamp)
              }))
            };
            setCredits(processedCredits);
          }
        } catch (error) {
          logger.error('Erro ao carregar créditos de IA:', error);
          localStorage.removeItem(`ai_credits_${user.id}`);
        }
      }
    } else {
      // Reset quando não logado
      setCredits({
        balance: 0,
        transactions: []
      });
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);

  // Salvar créditos sempre que mudar
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      localStorage.setItem(`ai_credits_${user.id}`, JSON.stringify(credits));
    }
  }, [credits, isAuthenticated, user, isLoading]);

  const addCredits = (amount: number, description: string) => {
    if (!isAuthenticated || !user) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description,
      timestamp: new Date()
    };

    setCredits(prev => ({
      balance: prev.balance + amount,
      transactions: [transaction, ...prev.transactions]
    }));

    logger.info(`Créditos adicionados: ${amount} MZN - ${description}`);
  };

  const deductCredits = (amount: number, tool: string, description: string): boolean => {
    if (!isAuthenticated || !user) return false;
    if (credits.balance < amount) return false;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description,
      timestamp: new Date(),
      tool
    };

    setCredits(prev => ({
      balance: prev.balance - amount,
      transactions: [transaction, ...prev.transactions]
    }));

    logger.info(`Créditos deduzidos: ${amount} MZN - ${tool} - ${description}`);
    return true;
  };

  const getTransactionHistory = (): Transaction[] => {
    return credits.transactions;
  };

  const hasEnoughCredits = (amount: number): boolean => {
    return credits.balance >= amount;
  };

  const value: AICreditsContextType = {
    credits,
    addCredits,
    deductCredits,
    getTransactionHistory,
    hasEnoughCredits,
    isLoading
  };

  return <AICreditsContext.Provider value={value}>{children}</AICreditsContext.Provider>;
};