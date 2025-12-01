import React, { useState, useMemo } from 'react';
import { useAdmin, UserSession } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Users,
  Activity,
  LogIn,
  LogOut,
  Trash2,
  Shield,
  Clock,
  Monitor,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Search,
  Download,
  Settings,
  Eye,
  Filter,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Calendar,
  Bell,
  Check,
  Upload,
  Menu,
  ChevronDown
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { sessions, activeUsers, totalLogins, removeSession, clearAllSessions, isAdmin, loginAsAdmin, logoutAdmin } = useAdmin();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [sessionTimeout, setSessionTimeout] = useState(30); // in minutes
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; status: 'active' | 'inactive' }[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string; status: 'active' | 'inactive' } | null>(null);

  // Filtered sessions based on search, filter, and date range
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && session.isActive) ||
                           (statusFilter === 'inactive' && !session.isActive);
      const sessionDate = session.loginTime.toISOString().split('T')[0];
      const matchesDateFrom = !dateFrom || sessionDate >= dateFrom;
      const matchesDateTo = !dateTo || sessionDate <= dateTo;
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [sessions, searchTerm, statusFilter, dateFrom, dateTo]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const daySessions = sessions.filter(s => s.loginTime.toDateString() === date.toDateString());
      return {
        date: date.toLocaleDateString('pt-MZ', { month: 'short', day: 'numeric' }),
        logins: daySessions.length,
        active: sessions.filter(s => s.isActive && s.lastActivity.toDateString() === date.toDateString()).length,
        uniqueUsers: new Set(daySessions.map(s => s.email)).size,
        avgSessionTime: daySessions.length > 0 ? daySessions.reduce((acc, s) => acc + (new Date().getTime() - s.lastActivity.getTime()), 0) / daySessions.length / 1000 / 60 : 0
      };
    });

    // Top users
    const userStats = sessions.reduce((acc, session) => {
      if (!acc[session.email]) {
        acc[session.email] = { name: session.name, email: session.email, count: 0, lastActivity: session.lastActivity };
      }
      acc[session.email].count++;
      if (session.lastActivity > acc[session.email].lastActivity) {
        acc[session.email].lastActivity = session.lastActivity;
      }
      return acc;
    }, {} as Record<string, { name: string; email: string; count: number; lastActivity: Date }>);

    const topUsers = Object.values(userStats).sort((a, b) => b.count - a.count).slice(0, 5);

    return { daily: last7Days, topUsers };
  }, [sessions]);

  // Auto-refresh effect
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger a re-render by updating a dummy state or calling a function
      // Since sessions are managed in context, we can dispatch an event or just rely on context updates
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Export functions
  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Login Time', 'Last Activity', 'Status', 'IP', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...filteredSessions.map(s => [
        s.name,
        s.email,
        s.loginTime.toISOString(),
        s.lastActivity.toISOString(),
        s.isActive ? 'Ativa' : 'Inativa',
        s.ip || 'N/A',
        s.userAgent || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsm-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Exportação concluída",
      description: `Dados exportados para CSV com ${filteredSessions.length} sessões.`,
    });
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredSessions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gsm-sessions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Exportação concluída",
      description: `Dados exportados para JSON com ${filteredSessions.length} sessões.`,
    });
  };

  const handleBulkRemove = () => {
    selectedSessions.forEach(id => removeSession(id));
    setSelectedSessions([]);
    toast({
      title: "Sessões removidas",
      description: `${selectedSessions.length} sessões foram removidas com sucesso.`,
      variant: "destructive",
    });
  };

  // User management functions
  const addUser = (user: { name: string; email: string; role: string }) => {
    const newUser = {
      id: Date.now().toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active' as const
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "Usuário adicionado",
      description: `${user.name} foi adicionado com sucesso.`,
    });
  };

  const updateUser = (id: string, user: { name: string; email: string; role: string; status: 'active' | 'inactive' }) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas.",
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso.",
      variant: "destructive",
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(adminPassword);
    if (success) {
      setAdminPassword('');
      setLoginError('');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo GSM.",
      });
    } else {
      setLoginError('Senha incorreta!');
      toast({
        title: "Erro no login",
        description: "A senha de administrador está incorreta.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminPassword('');
    setLoginError('');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getTimeSinceActivity = (lastActivity: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastActivity.getTime()) / 1000);

    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  if (!isAdmin) {
    const getPasswordStrength = (password: string) => {
      if (password.length === 0) return { strength: 0, label: '', color: '' };
      if (password.length < 6) return { strength: 1, label: 'Fraca', color: 'bg-red-500' };
      if (password.length < 8) return { strength: 2, label: 'Média', color: 'bg-yellow-500' };
      if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { strength: 3, label: 'Forte', color: 'bg-green-500' };
      return { strength: 2, label: 'Média', color: 'bg-yellow-500' };
    };

    const passwordStrength = getPasswordStrength(adminPassword);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Painel Administrativo GSM</CardTitle>
            <CardDescription className="text-sm">
              Entre com a senha de administrador para acessar o painel de controle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium mb-2">
                  Senha de Administrador
                </label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Digite a senha de administrador"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="text-center text-sm"
                />
                {adminPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{loginError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-sm" disabled={adminPassword.length < 6} size={isMobile ? "sm" : "default"}>
                <Shield className="w-4 h-4 mr-2" />
                Acessar Painel
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Para fins de demonstração, use a senha: admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-foreground">
                Painel GSM Admin
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-muted-foreground">
                Controle e monitoramento de sessões GSM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none"
              size={isMobile ? "sm" : "default"}
            >
              <RefreshCw className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
              size={isMobile ? "sm" : "default"}
            >
              <LogOut className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4 md:space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} overflow-x-auto`}>
            <TabsTrigger value="dashboard" className="text-xs md:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs md:text-sm">Sessões</TabsTrigger>
            <TabsTrigger value="users" className="text-xs md:text-sm">Usuários</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Análises</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs md:text-sm">Performance</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm">Config</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">Sessões Ativas</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{activeUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <LogIn className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">Total de Logins</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{totalLogins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">Usuários Únicos</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">
                        {new Set(sessions.map(s => s.email)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-muted-foreground">Taxa de Atividade</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">
                        {sessions.length > 0 ? Math.round((activeUsers / sessions.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Ações Rápidas</CardTitle>
                  <CardDescription className="text-sm">Gerencie sessões e dados rapidamente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <Button onClick={exportToCSV} variant="outline" className="flex-1" size={isMobile ? "sm" : "default"}>
                      <Download className="w-4 h-4 mr-1 md:mr-2" />
                      CSV
                    </Button>
                    <Button onClick={exportToJSON} variant="outline" className="flex-1" size={isMobile ? "sm" : "default"}>
                      <Download className="w-4 h-4 mr-1 md:mr-2" />
                      JSON
                    </Button>
                    {sessions.length > 0 && (
                      <Button onClick={clearAllSessions} variant="destructive" className="flex-1" size={isMobile ? "sm" : "default"}>
                        <Trash2 className="w-4 h-4 mr-1 md:mr-2" />
                        Limpar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                    <Bell className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Notificações</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Alertas e atualizações recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs md:text-sm">Nova sessão detectada</span>
                      </div>
                      <span className="text-xs text-gray-500">Agora</span>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs md:text-sm">Backup concluído</span>
                      </div>
                      <span className="text-xs text-gray-500">5 min</span>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs md:text-sm">Alto uso de CPU</span>
                      </div>
                      <span className="text-xs text-gray-500">10 min</span>
                    </div>
                    <Button variant="outline" className="w-full" size={isMobile ? "sm" : "default"}>
                      Ver Todas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="inactive">Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="dateFrom" className="block text-sm font-medium mb-1">De</label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="dateTo" className="block text-sm font-medium mb-1">Até</label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDateFrom('');
                          setDateTo('');
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                      >
                        Limpar Filtros
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Monitor className="w-5 h-5" />
                      <span>Sessões GSM ({filteredSessions.length})</span>
                    </CardTitle>
                    <CardDescription>
                      Todas as sessões de usuários GSM registradas
                    </CardDescription>
                  </div>
                  {selectedSessions.length > 0 && (
                    <Button onClick={handleBulkRemove} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover Selecionadas ({selectedSessions.length})
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm md:text-base text-gray-500 dark:text-muted-foreground">
                      {sessions.length === 0 ? 'Nenhuma sessão GSM registrada ainda' : 'Nenhuma sessão encontrada com os filtros aplicados'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    {isMobile ? (
                      <div className="space-y-3">
                        {filteredSessions.map((session) => (
                          <Card key={session.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-xs">
                                    {session.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="font-medium text-sm truncate">{session.name}</p>
                                    <Badge variant={session.isActive ? "default" : "secondary"} className="text-xs">
                                      {session.isActive ? 'Ativa' : 'Inativa'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">{session.email}</p>
                                  <div className="flex flex-col space-y-1 mt-2">
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      <span>Login: {formatDateTime(session.loginTime)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                      <Activity className="w-3 h-3" />
                                      <span>{getTimeSinceActivity(session.lastActivity)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                      <DialogTitle>Detalhes da Sessão</DialogTitle>
                                      <DialogDescription>
                                        Informações completas da sessão de {session.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3 text-sm">
                                      <div><strong>Nome:</strong> {session.name}</div>
                                      <div><strong>Email:</strong> {session.email}</div>
                                      <div><strong>Login:</strong> {formatDateTime(session.loginTime)}</div>
                                      <div><strong>Última Atividade:</strong> {formatDateTime(session.lastActivity)}</div>
                                      <div><strong>Status:</strong> {session.isActive ? 'Ativa' : 'Inativa'}</div>
                                      <div><strong>IP:</strong> {session.ip || 'N/A'}</div>
                                      <div><strong>User Agent:</strong> {session.userAgent || 'N/A'}</div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSession(session.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      /* Desktop Table View */
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <input type="checkbox" aria-label="Selecionar todas as sessões" />
                              </TableHead>
                              <TableHead>Usuário</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Login</TableHead>
                              <TableHead>Última Atividade</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSessions.map((session) => (
                              <TableRow key={session.id}>
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    aria-label={`Selecionar sessão de ${session.name}`}
                                    checked={selectedSessions.includes(session.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedSessions([...selectedSessions, session.id]);
                                      } else {
                                        setSelectedSessions(selectedSessions.filter(id => id !== session.id));
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white font-bold text-xs">
                                        {session.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <span className="font-medium">{session.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{session.email}</TableCell>
                                <TableCell>
                                  <Badge variant={session.isActive ? "default" : "secondary"}>
                                    {session.isActive ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Ativa
                                      </>
                                    ) : (
                                      'Inativa'
                                    )}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {formatDateTime(session.loginTime)}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                  {getTimeSinceActivity(session.lastActivity)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className={isMobile ? "max-w-sm w-full mx-4" : ""}>
                                        <DialogHeader>
                                          <DialogTitle className="text-lg">Detalhes da Sessão</DialogTitle>
                                          <DialogDescription className="text-sm">
                                            Informações completas da sessão de {session.name}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-3 text-sm">
                                          <div><strong>Nome:</strong> {session.name}</div>
                                          <div><strong>Email:</strong> {session.email}</div>
                                          <div><strong>Login:</strong> {formatDateTime(session.loginTime)}</div>
                                          <div><strong>Última Atividade:</strong> {formatDateTime(session.lastActivity)}</div>
                                          <div><strong>Status:</strong> {session.isActive ? 'Ativa' : 'Inativa'}</div>
                                          <div><strong>IP:</strong> {session.ip || 'N/A'}</div>
                                          <div><strong>User Agent:</strong> {session.userAgent || 'N/A'}</div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSession(session.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Gerenciamento de Usuários</span>
                    </CardTitle>
                    <CardDescription>
                      Adicione, edite e gerencie usuários do sistema
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingUser(null)}>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Adicionar Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={isMobile ? "max-w-sm w-full mx-4" : ""}>
                      <DialogHeader>
                        <DialogTitle className="text-lg">{editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
                        <DialogDescription className="text-sm">
                          {editingUser ? 'Atualize as informações do usuário.' : 'Adicione um novo usuário ao sistema.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const userData = {
                          name: formData.get('name') as string,
                          email: formData.get('email') as string,
                          role: formData.get('role') as string,
                          status: formData.get('status') as 'active' | 'inactive'
                        };
                        if (editingUser) {
                          updateUser(editingUser.id, userData);
                        } else {
                          addUser(userData);
                        }
                        setShowUserModal(false);
                        setEditingUser(null);
                      }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome</label>
                          <Input name="name" defaultValue={editingUser?.name || ''} required className="text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input name="email" type="email" defaultValue={editingUser?.email || ''} required className="text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Função</label>
                          <Select name="role" defaultValue={editingUser?.role || 'user'}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="moderator">Moderador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <Select name="status" defaultValue={editingUser?.status || 'active'}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button type="button" variant="outline" onClick={() => setShowUserModal(false)} size={isMobile ? "sm" : "default"}>
                            Cancelar
                          </Button>
                          <Button type="submit" size={isMobile ? "sm" : "default"}>
                            {editingUser ? 'Atualizar' : 'Adicionar'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-muted-foreground">
                      Nenhum usuário cadastrado ainda
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs md:text-sm">Nome</TableHead>
                          <TableHead className="text-xs md:text-sm">Email</TableHead>
                          <TableHead className="text-xs md:text-sm">Função</TableHead>
                          <TableHead className="text-xs md:text-sm">Status</TableHead>
                          <TableHead className="text-xs md:text-sm">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium text-xs md:text-sm">{user.name}</TableCell>
                            <TableCell className="text-xs md:text-sm">{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setShowUserModal(true);
                                  }}
                                >
                                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Atividade nos Últimos 7 Dias</CardTitle>
                  <CardDescription className="text-sm">Logins, usuários únicos e tempo médio de sessão</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <LineChart data={analyticsData.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="logins" stroke="#8884d8" strokeWidth={2} name="Logins" />
                      <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" strokeWidth={2} name="Usuários Únicos" />
                      <Line type="monotone" dataKey="active" stroke="#ffc658" strokeWidth={2} name="Sessões Ativas" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Distribuição de Status</CardTitle>
                  <CardDescription className="text-sm">Sessões ativas vs inativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Ativas', value: activeUsers, color: '#10b981' },
                          { name: 'Inativas', value: sessions.length - activeUsers, color: '#6b7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={isMobile ? 60 : 80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Ativas', value: activeUsers, color: '#10b981' },
                          { name: 'Inativas', value: sessions.length - activeUsers, color: '#6b7280' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Top Usuários</CardTitle>
                  <CardDescription className="text-sm">Usuários com mais sessões</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                    <BarChart data={analyticsData.topUsers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Métricas Detalhadas</CardTitle>
                  <CardDescription className="text-sm">Estatísticas avançadas do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-lg md:text-2xl font-bold text-blue-600">{analyticsData.daily.reduce((acc, day) => acc + day.logins, 0)}</p>
                      <p className="text-xs md:text-sm text-gray-600">Total de Logins (7 dias)</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-lg md:text-2xl font-bold text-green-600">{analyticsData.daily.reduce((acc, day) => acc + day.uniqueUsers, 0)}</p>
                      <p className="text-xs md:text-sm text-gray-600">Usuários Únicos (7 dias)</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-lg md:text-2xl font-bold text-purple-600">{Math.round(analyticsData.daily.reduce((acc, day) => acc + day.avgSessionTime, 0) / analyticsData.daily.length)}m</p>
                      <p className="text-xs md:text-sm text-gray-600">Tempo Médio de Sessão</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-lg md:text-2xl font-bold text-orange-600">{analyticsData.topUsers.length}</p>
                      <p className="text-xs md:text-sm text-gray-600">Usuários Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Monitoramento de Performance</CardTitle>
                  <CardDescription className="text-sm">Métricas de performance do sistema em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm md:text-base">Tempo de Resposta Médio</p>
                        <p className="text-xs md:text-sm text-gray-600">Última hora</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-green-600">245ms</p>
                        <p className="text-xs text-green-500">↓ 5%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm md:text-base">Taxa de Erro</p>
                        <p className="text-xs md:text-sm text-gray-600">Última hora</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-blue-600">0.02%</p>
                        <p className="text-xs text-green-500">↓ 0.01%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm md:text-base">Uptime</p>
                        <p className="text-xs md:text-sm text-gray-600">Últimos 30 dias</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-purple-600">99.98%</p>
                        <p className="text-xs text-green-500">Estável</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 md:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm md:text-base">CPU Usage</p>
                        <p className="text-xs md:text-sm text-gray-600">Servidor atual</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-orange-600">23%</p>
                        <p className="text-xs text-green-500">Normal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Saúde do Sistema</CardTitle>
                  <CardDescription className="text-sm">Status dos componentes do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <span className="text-sm font-medium">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <span className="text-sm font-medium">API Gateway</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <span className="text-sm font-medium">Cache Redis</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <span className="text-sm font-medium">Email Service</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-yellow-600">Degraded</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <span className="text-sm font-medium">File Storage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Logs de Performance</CardTitle>
                <CardDescription className="text-sm">Eventos recentes e alertas do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs md:text-sm">Sistema iniciado com sucesso</span>
                    </div>
                    <span className="text-xs text-gray-500">2 min atrás</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs md:text-sm">Cache limpo automaticamente</span>
                    </div>
                    <span className="text-xs text-gray-500">5 min atrás</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs md:text-sm">Alto uso de CPU detectado</span>
                    </div>
                    <span className="text-xs text-gray-500">10 min atrás</span>
                  </div>
                  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 dark:bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs md:text-sm">Backup diário concluído</span>
                    </div>
                    <span className="text-xs text-gray-500">1h atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Gerencie configurações do painel administrativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Auto-refresh</h4>
                    <p className="text-xs md:text-sm text-gray-600">Atualizar dados automaticamente</p>
                  </div>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Notificações</h4>
                    <p className="text-xs md:text-sm text-gray-600">Receber alertas de novas sessões</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Tema</h4>
                    <p className="text-xs md:text-sm text-gray-600">Escolha o tema da interface</p>
                  </div>
                  <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
                    <SelectTrigger className="w-28 md:w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Timeout de Sessão</h4>
                    <p className="text-xs md:text-sm text-gray-600">Tempo limite para logout (minutos)</p>
                  </div>
                  <Select value={sessionTimeout.toString()} onValueChange={(value) => setSessionTimeout(parseInt(value))}>
                    <SelectTrigger className="w-28 md:w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="0">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Segurança</h4>
                    <p className="text-sm text-gray-600">Alterar senha de administrador</p>
                  </div>
                  <Button variant="outline">Alterar Senha</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Backup de Dados</h4>
                    <p className="text-sm text-gray-600">Exportar todos os dados do sistema</p>
                  </div>
                  <Button variant="outline" onClick={() => {
                    const data = {
                      sessions: sessions,
                      users: users,
                      timestamp: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `system-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    toast({
                      title: "Backup criado",
                      description: "Todos os dados foram exportados com sucesso.",
                    });
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Criar Backup
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Restaurar Dados</h4>
                    <p className="text-sm text-gray-600">Importar dados de um backup anterior</p>
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Restaurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};