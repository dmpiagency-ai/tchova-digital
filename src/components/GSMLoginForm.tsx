import { useState } from 'react';
import { env } from '@/config/env';

interface GSMLoginFormProps {
  onSubmit: (credentials: { email: string; password: string; whatsapp: string }) => void;
  onNavigateToDashboard: () => void;
}

// Reusable balance button component
const BalanceButton = ({ amount, isCustom = false }: { amount: string; isCustom?: boolean }) => {
  const message = isCustom
    ? encodeURIComponent(`Olá! Gostaria de adicionar saldo ao meu GSM.`)
    : encodeURIComponent(`Olá! Gostaria de adicionar ${amount} MZN de saldo ao meu GSM.`);

  return (
    <button
      onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank')}
      className={`tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 ${
        isCustom
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
          : 'neo hover-lift'
      } px-3 py-3 font-semibold text-xs flex items-center justify-center`}
    >
      {isCustom ? (
        <>
          <span className="mr-1">💳</span>
          Outros
        </>
      ) : (
        `${amount} MZN`
      )}
    </button>
  );
};

// Reusable login form component
const LoginForm = ({ onSubmit }: { onSubmit: GSMLoginFormProps['onSubmit'] }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      whatsapp: formData.get('whatsapp') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        name="email"
        required
        className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        placeholder="E-mail"
        aria-label="E-mail"
      />
      <input
        type="tel"
        name="whatsapp"
        required
        className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        placeholder="WhatsApp"
        aria-label="WhatsApp"
      />
      <input
        type="password"
        name="password"
        required
        className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        placeholder="Palavra-passe"
        aria-label="Palavra-passe"
      />
      <button
        type="submit"
        className="tech-button w-full rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift py-3 font-semibold text-sm"
      >
        Criar conta
      </button>
    </form>
  );
};

// User status card component
const UserStatusCard = ({ name }: { name: string }) => (
  <div className="neo hover-lift p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
        <span className="text-sm font-bold text-white">
          {name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-green-800 dark:text-green-200">{name}</p>
        <p className="text-xs text-green-600 dark:text-green-400">GSM ativo • 0 MZN</p>
      </div>
    </div>
  </div>
);

// Quick actions component
const QuickActions = ({ onNavigateToDashboard }: { onNavigateToDashboard: () => void }) => (
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={onNavigateToDashboard}
      className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift py-3 font-semibold text-xs flex items-center justify-center"
    >
      <span className="mr-1">🔧</span>
      GSM
    </button>
    <button
      onClick={() => {
        const message = encodeURIComponent(`Olá! Preciso de suporte GSM.`);
        window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
      }}
      className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-green-500 hover:bg-green-600 text-white py-3 font-semibold text-xs flex items-center justify-center"
    >
      <span className="mr-1">💬</span>
      Suporte
    </button>
  </div>
);

// Balance management component
const BalanceManagement = ({ compact = false }: { compact?: boolean }) => (
  <div className="neo p-4 rounded-xl border">
    {!compact && (
      <h3 className="text-sm font-bold mb-3 flex items-center">
        <span className="mr-2">💰</span>
        Adicionar Saldo
      </h3>
    )}
    <div className={`grid grid-cols-2 gap-${compact ? '3' : '2'} ${!compact ? 'mb-3' : 'mb-4'}`}>
      <BalanceButton amount="500" />
      <BalanceButton amount="1000" />
      <BalanceButton amount="2000" />
      <BalanceButton amount="" isCustom />
    </div>
    {!compact && (
      <p className="text-xs text-muted-foreground text-center">
        M-Pesa • Cartão • Crypto
      </p>
    )}
  </div>
);

// Main component
const GSMLoginForm = ({ onSubmit, onNavigateToDashboard }: GSMLoginFormProps) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  const handleLogin = (credentials: { email: string; password: string; whatsapp: string }) => {
    setUser({ name: credentials.email.split('@')[0] });
    onSubmit(credentials);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">📱</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold mb-2 gradient-text">
          GSM Premium
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Ferramentas GSM profissionais
        </p>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4">
        {user && <UserStatusCard name={user.name} />}
        {!user && (
          <div className="neo p-4 rounded-xl border">
            <h3 className="text-base font-bold mb-3 flex items-center">
              <span className="mr-2">🔐</span>
              Criar Conta
            </h3>
            <LoginForm onSubmit={handleLogin} />
          </div>
        )}
        <BalanceManagement compact />
        <QuickActions onNavigateToDashboard={onNavigateToDashboard} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {user && <UserStatusCard name={user.name} />}
          <div className="neo p-4 rounded-xl border">
            <QuickActions onNavigateToDashboard={onNavigateToDashboard} />
          </div>
        </div>
        <div className="space-y-4">
          {!user && (
            <div className="neo p-4 rounded-xl border">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <span className="mr-2">🔐</span>
                Criar Conta
              </h3>
              <LoginForm onSubmit={handleLogin} />
            </div>
          )}
        </div>
        <BalanceManagement />
      </div>
    </div>
  );
};

export default GSMLoginForm;
