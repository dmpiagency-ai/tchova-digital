import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import VerificationModal from '@/components/VerificationModal';
import { useAuth, useClientAuth } from '@/contexts/AuthContext';
import {
  validateToken,
  storeTokenLocally,
  ClientProject,
  generateProjectAccessUrl
} from '@/utils/tokenGenerator';
import {
  requiresVerification,
  isActionVerified,
  markActionVerified,
  getSecureSession
} from '@/utils/verificationCode';
import { env } from '@/config/env';
import {
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  Package,
  Rocket,
  Eye,
  Handshake,
  Timer,
  Zap,
  ShieldCheck,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  Lock,
  RefreshCw
} from 'lucide-react';

const ClientPanel = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  // Use the new auth context
  const { validateClientToken, clearClientSession, isLoading: authLoading } = useAuth();
  const clientAuth = useClientAuth();
  
  // Local state for project (fallback if not in context)
  const [project, setProject] = useState<ClientProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [hasSecureSession, setHasSecureSession] = useState(false);

  // Check for existing secure session
  useEffect(() => {
    const session = getSecureSession();
    if (session && session.projectId === project?.id) {
      setHasSecureSession(true);
    }
  }, [project]);

  // Validate token on mount
  useEffect(() => {
    const initPanel = async () => {
      if (!token) {
        setError('Token não fornecido');
        setLoading(false);
        return;
      }

      // First check if context already has the session
      if (clientAuth.isAuthenticated && clientAuth.project) {
        setProject(clientAuth.project);
        setHasSecureSession(clientAuth.hasSecureSession);
        setLoading(false);
        return;
      }

      // Validate token via context
      const result = await validateClientToken(token);

      if (!result.valid) {
        setError(result.error || 'Token inválido');
        setExpired(result.expired || false);
        setLoading(false);
        return;
      }

      if (result.project) {
        setProject(result.project);
      }
      
      setLoading(false);
    };

    initPanel();
  }, [token, clientAuth.isAuthenticated, clientAuth.project, validateClientToken]);

  const handleContact = () => {
    const message = `Olá! Estou a acompanhar o projeto "${project?.serviceTitle}" (ID: ${project?.id}) e gostaria de mais informações.`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle sensitive action with verification
  const handleSensitiveAction = (actionId: string, actionCallback: () => void) => {
    // Check if action requires verification
    if (!requiresVerification(actionId)) {
      actionCallback();
      return;
    }

    // Check if already verified in current session
    if (hasSecureSession && isActionVerified(actionId)) {
      actionCallback();
      return;
    }

    // Require verification
    setPendingAction(actionId);
    setShowVerification(true);
  };

  // Handle successful verification
  const handleVerificationSuccess = () => {
    if (pendingAction) {
      markActionVerified(pendingAction);
      setHasSecureSession(true);
      
      // Execute the pending action
      switch (pendingAction) {
        case 'download_final_files':
          handleContact(); // In production, this would trigger file download
          break;
        case 'view_payment_details':
          // Already handled by state change
          break;
        default:
          handleContact();
      }
    }
    setPendingAction(null);
  };

  // Action handlers with verification
  const handleDownloadFiles = () => handleSensitiveAction('download_final_files', handleContact);
  const handleViewPaymentDetails = () => handleSensitiveAction('view_payment_details', () => {});
  const handleRequestChange = () => handleSensitiveAction('request_project_change', handleContact);
  const handleGenerateNewLink = () => handleSensitiveAction('generate_new_link', handleContact);

  const handleCopyLink = () => {
    const url = generateProjectAccessUrl(token || '', window.location.origin);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get current stage based on project status
  const getCurrentStage = () => {
    if (!project) return 1;
    switch (project.projectStatus) {
      case 'initiated': return 2;
      case 'in_development': return 3;
      case 'in_review': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const currentStage = getCurrentStage();

  // Project stages for timeline
  const projectStages = [
    { id: 1, title: 'Acordo Confirmado', description: 'Proposta aceite', icon: <Handshake className="w-4 h-4" /> },
    { id: 2, title: 'Pagamento Recebido', description: 'Pagamento confirmado', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 3, title: 'Em Desenvolvimento', description: 'Equipa trabalhando', icon: <Rocket className="w-4 h-4" /> },
    { id: 4, title: 'Em Revisão', description: 'Aguardando aprovação', icon: <Eye className="w-4 h-4" /> },
    { id: 5, title: 'Entrega Final', description: 'Projeto concluído', icon: <Package className="w-4 h-4" /> }
  ];

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">A verificar acesso...</p>
        </div>
      </div>
    );
  }

  // Error/Invalid token state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-amber-500/10 via-amber-400/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <Header />

        <main className="container relative z-10 mx-auto px-4 py-12 max-w-lg">
          <div className="liquid-card rounded-[32px] p-8 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-red-500/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              {expired ? 'Link de Acesso Expirado' : 'Link de Acesso Inválido'}
            </h1>

            <p className="text-muted-foreground mb-6">
              {expired 
                ? 'Este link não está mais ativo. O período de acesso expirou.'
                : 'Este link não está mais ativo ou é inválido.'}
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              Entre em contacto com a Tchova Digital para receber um novo acesso.
            </p>

            <Button
              onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! O meu link de acesso ao painel expirou ou é inválido. Podem enviar um novo?')}`, '_blank')}
              className="w-full h-14 rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/10 via-brand-green/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-brand-yellow/10 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Noindex meta tag for security */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="container relative z-10 mx-auto px-4 py-6 max-w-4xl">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                  Meu Projeto
                </span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhe o progresso do seu projeto em tempo real
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasSecureSession && (
                <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Seguro
                </div>
              )}
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                project.paymentStatus === 'entry-50' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                project.paymentStatus === 'full' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                'bg-green-500/20 text-green-600 dark:text-green-400'
              }`}>
                ID: {project.id}
              </div>
            </div>
          </div>
        </div>

        {/* Status do Projeto */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                project.projectStatus === 'initiated' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                project.projectStatus === 'in_development' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                project.projectStatus === 'in_review' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                'bg-gradient-to-br from-green-400 to-green-600'
              }`}>
                {project.projectStatus === 'initiated' ? <Timer className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> :
                 project.projectStatus === 'in_development' ? <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> :
                 project.projectStatus === 'in_review' ? <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> :
                 <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">{project.serviceTitle}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {project.projectStatus === 'initiated' && 'Projeto Iniciado'}
                  {project.projectStatus === 'in_development' && 'Em Desenvolvimento'}
                  {project.projectStatus === 'in_review' && 'Em Revisão - Aguardando Aprovação'}
                  {project.projectStatus === 'completed' && 'Projeto Concluído'}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              project.projectStatus === 'initiated' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
              project.projectStatus === 'in_development' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
              project.projectStatus === 'in_review' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
              'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
            }`}>
              {project.projectStatus === 'initiated' && '🟡 Iniciado'}
              {project.projectStatus === 'in_development' && '🔵 Em Desenvolvimento'}
              {project.projectStatus === 'in_review' && '🟣 Em Revisão'}
              {project.projectStatus === 'completed' && '🟢 Concluído'}
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 dark:bg-black/10 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Cliente</p>
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">{project.clientName}</p>
            </div>
            <div className="bg-white/5 dark:bg-black/10 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Categoria</p>
              <p className="text-xs sm:text-sm font-bold text-foreground truncate">{project.serviceCategory}</p>
            </div>
            <div className="bg-white/5 dark:bg-black/10 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Pagamento</p>
              <p className="text-xs sm:text-sm font-bold text-primary">
                {project.paymentStatus === 'entry-50' ? 'Entrada (50%)' : 
                 project.paymentStatus === 'full' ? 'Completo' : 'Final'}
              </p>
            </div>
            <div className="bg-white/5 dark:bg-black/10 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Valor</p>
              <p className="text-xs sm:text-sm font-bold text-brand-yellow">
                {project.paymentAmount.toLocaleString('pt-MZ')} MZN
              </p>
            </div>
          </div>
        </div>

        {/* Etapa Atual - Progress Timeline */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-green/20 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
            <span className="bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent">Progresso do Projeto</span>
          </h3>

          {/* Mobile Timeline - Vertical */}
          <div className="sm:hidden space-y-3">
            {projectStages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  stage.id < currentStage ? 'bg-primary text-white' :
                  stage.id === currentStage ? 'bg-brand-yellow text-white animate-pulse' :
                  'bg-white/10 text-white/40'
                }`}>
                  {stage.id < currentStage ? <CheckCircle className="w-5 h-5" /> : stage.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${
                    stage.id === currentStage ? 'text-brand-yellow' : 
                    stage.id < currentStage ? 'text-primary' : 'text-muted-foreground'
                  }`}>{stage.title}</p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Timeline - Horizontal */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500"
                  style={{ width: `${((currentStage - 1) / (projectStages.length - 1)) * 100}%` }}
                />
              </div>

              {projectStages.map((stage) => (
                <div key={stage.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                    stage.id < currentStage ? 'bg-primary text-white' :
                    stage.id === currentStage ? 'bg-brand-yellow text-white animate-pulse shadow-lg shadow-brand-yellow/30' :
                    'bg-white/10 text-white/40'
                  }`}>
                    {stage.id < currentStage ? <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" /> : stage.icon}
                  </div>
                  <p className={`text-xs lg:text-sm font-bold mt-2 text-center ${
                    stage.id === currentStage ? 'text-brand-yellow' : 
                    stage.id < currentStage ? 'text-primary' : 'text-muted-foreground'
                  }`}>{stage.title}</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground text-center hidden lg:block">{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow" />
            <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent">Informações de Pagamento</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/10 rounded-2xl border border-white/10">
              <div>
                <p className="text-xs text-muted-foreground">Valor Total</p>
                <p className="text-lg font-bold text-foreground">{project.paymentAmount.toLocaleString('pt-MZ')} MZN</p>
              </div>
              <DollarSign className="w-8 h-8 text-brand-yellow" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/10 rounded-2xl border border-white/10">
              <div>
                <p className="text-xs text-muted-foreground">Status do Pagamento</p>
                <p className="text-lg font-bold text-primary">
                  {project.paymentStatus === 'entry-50' ? 'Entrada (50%)' : 
                   project.paymentStatus === 'full' ? 'Pago Completo' : 'Pagamento Final'}
                </p>
              </div>
              <CheckCircle className={`w-8 h-8 ${
                project.paymentStatus === 'full' ? 'text-green-500' : 'text-amber-500'
              }`} />
            </div>
          </div>

          {project.paymentStatus === 'entry-50' && (
            <div className="mt-4 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                <strong>Atenção:</strong> Resta o pagamento de 50% para conclusão do projeto.
              </p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {project.notes && (
          <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow" />
              <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent">Notas do Projeto</span>
            </h3>
            <p className="text-sm text-muted-foreground">{project.notes}</p>
          </div>
        )}

        {/* Client Actions */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">Ações Disponíveis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.projectStatus === 'completed' ? (
              <>
                <Button
                  onClick={handleDownloadFiles}
                  className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Receber Arquivos Finais
                </Button>
                <Button
                  onClick={handleContact}
                  variant="outline"
                  className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com a Equipa
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleContact}
                  className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar sobre o Projeto
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {copied ? <Check className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
                  {copied ? 'Link Copiado!' : 'Partilhar Acesso'}
                </Button>
              </>
            )}
          </div>

          {/* Additional Actions for Secure Session */}
          {hasSecureSession && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Ações protegidas por verificação
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleRequestChange}
                  variant="ghost"
                  className="h-10 rounded-[16px] text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Solicitar Alteração
                </Button>
                <Button
                  onClick={handleViewPaymentDetails}
                  variant="ghost"
                  className="h-10 rounded-[16px] text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ver Detalhes de Pagamento
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Trust Block */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 backdrop-blur-xl bg-gradient-to-br from-primary/10 via-brand-green/5 to-brand-yellow/10 border border-primary/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground">
                Seu projeto está sendo acompanhado pela equipa Tchova Digital
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Suporte humano disponível para tirar dúvidas e acompanhar o progresso
              </p>
            </div>
          </div>
        </div>

        {/* Access Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Este link é pessoal e intransferível. Válido até {new Date(project.expiresAt).toLocaleDateString('pt-MZ')}.
          </p>
        </div>
      </main>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerification}
        onClose={() => {
          setShowVerification(false);
          setPendingAction(null);
        }}
        onSuccess={handleVerificationSuccess}
        projectId={project.id}
        phoneNumber={project.clientPhone}
        actionDescription={
          pendingAction === 'download_final_files' ? 'Baixar arquivos finais' :
          pendingAction === 'view_payment_details' ? 'Ver dados de pagamento' :
          pendingAction === 'request_project_change' ? 'Solicitar alteração' :
          pendingAction === 'generate_new_link' ? 'Gerar novo link de acesso' :
          'Ação sensível'
        }
      />
    </div>
  );
};

// Simple Helmet component for meta tags
const Helmet = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Add noindex meta tag
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return null;
};

export default ClientPanel;
