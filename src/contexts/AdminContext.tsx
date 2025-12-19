import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { env } from '@/config/env';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  loginTime: Date;
  lastActivity: Date;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
}

interface AdminContextType {
  sessions: UserSession[];
  activeUsers: number;
  totalLogins: number;
  addSession: (user: { email: string; name: string }) => void;
  removeSession: (userId: string) => void;
  updateActivity: (userId: string) => void;
  clearAllSessions: () => void;
  isAdmin: boolean;
  loginAsAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Carregar sessões do localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('gsm-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: UserSession & { loginTime: string; lastActivity: string }) => ({
          ...session,
          loginTime: new Date(session.loginTime),
          lastActivity: new Date(session.lastActivity)
        }));
        setSessions(parsedSessions);
      } catch (error) {
        // Error loading sessions (removed console.error for production)
        // Error details: ${error}
      }
    }

    // Verificar se admin está logado
    const adminLogged = localStorage.getItem('admin-logged');
    setIsAdmin(adminLogged === 'true');
  }, []);

  // Salvar sessões no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('gsm-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (user: { email: string; name: string }) => {
    const newSession: UserSession = {
      id: Date.now().toString(),
      email: user.email,
      name: user.name,
      loginTime: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    setSessions(prev => {
      // Remover sessão anterior do mesmo usuário se existir
      const filtered = prev.filter(s => s.email !== user.email);
      return [...filtered, newSession];
    });
  };

  const removeSession = (userId: string) => {
    setSessions(prev => prev.filter(s => s.id !== userId));

    // Se estamos removendo a sessão atual do usuário logado, fazer logout
    const sessionToRemove = sessions.find(s => s.id === userId);
    if (sessionToRemove) {
      // Disparar evento personalizado para notificar logout
      window.dispatchEvent(new CustomEvent('gsm-session-removed', {
        detail: { email: sessionToRemove.email }
      }));
    }
  };

  const updateActivity = (userId: string) => {
    setSessions(prev => prev.map(s =>
      s.id === userId ? { ...s, lastActivity: new Date() } : s
    ));
  };

  const clearAllSessions = () => {
    setSessions([]);

    // Disparar evento para desconectar todos os usuários
    window.dispatchEvent(new CustomEvent('gsm-all-sessions-cleared'));
  };

  const loginAsAdmin = (password: string): boolean => {
    // Use secure password from environment variables
    if (password === env.ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('admin-logged', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin-logged');
  };

  const activeUsers = sessions.filter(s => s.isActive).length;
  const totalLogins = sessions.length;

  const value: AdminContextType = {
    sessions,
    activeUsers,
    totalLogins,
    addSession,
    removeSession,
    updateActivity,
    clearAllSessions,
    isAdmin,
    loginAsAdmin,
    logoutAdmin
  };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};