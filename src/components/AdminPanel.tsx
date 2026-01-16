import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  Smartphone,
  Activity,
  Settings,
  Shield,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  LogOut
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    sessions,
    addSession,
    removeSession,
    clearAllSessions,
    isAdmin,
    loginAsAdmin,
    logoutAdmin
  } = useAdmin();

  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
    }
  }, [isAdmin]);

  const handleAdminLogin = () => {
    if (loginAsAdmin(adminPassword)) {
      setIsAuthenticated(true);
      setMessage({ type: 'success', text: 'Acesso administrativo concedido!' });
    } else {
      setMessage({ type: 'error', text: 'Senha administrativa incorreta!' });
    }
    setAdminPassword('');
  };

  const handleRemoveSession = (email: string) => {
    removeSession(email);
    setMessage({ type: 'success', text: `Sessão de ${email} removida com sucesso!` });
  };

  const handleClearAllSessions = () => {
    clearAllSessions();
    setMessage({ type: 'success', text: 'Todas as sessões foram encerradas!' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Painel Administrativo
              </CardTitle>
              <CardDescription>
                Digite a senha administrativa para acessar o painel de controle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha Administrativa</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Digite a senha administrativa"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              {message && (
                <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button onClick={handleAdminLogin} className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Acessar Painel Admin
              </Button>

              <Button variant="outline" onClick={() => {
                try {
                  logout();
                } catch (error) {
                  // Error during logout (removed console.error for production)
                  // Error details: ${error}
                  // Fallback: forçar reload da página
                  window.location.reload();
                }
              }} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">Controle total do sistema TchovaDigital</p>
          </div>
          <Button variant="outline" onClick={() => {
            try {
              logout();
            } catch (error) {
              // Error during logout (removed console.error for production)
              // Error details: ${error}
              // Fallback: forçar reload da página
              window.location.reload();
            }
          }}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Messages */}
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Admin Dashboard */}
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Sessões Ativas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Sessions Management */}
          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Sessões GSM Ativas
                </CardTitle>
                <CardDescription>
                  Gerencie todas as sessões ativas de usuários GSM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    {sessions.length} sessão(s) ativa(s)
                  </p>
                  {sessions.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleClearAllSessions}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Encerrar Todas
                    </Button>
                  )}
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma sessão ativa</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{session.name}</p>
                            <p className="text-sm text-muted-foreground">{session.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveSession(session.email)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Usuários GSM ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">
                    Sistema operacional
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admin Ativo</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1</div>
                  <p className="text-xs text-muted-foreground">
                    Administrador logado
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Configurações avançadas do sistema TchovaDigital
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Administrativo</Label>
                    <Input
                      value="admin@tchovadigital.com"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha Administrativa</Label>
                    <Input
                      type="password"
                      value="••••••••"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    As configurações administrativas são gerenciadas no código fonte.
                    Para alterar credenciais, edite o arquivo AdminContext.tsx
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;