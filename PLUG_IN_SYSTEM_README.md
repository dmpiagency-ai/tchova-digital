# 🔌 Sistema Plug-in Firebase - TchovaDigital

## Visão Geral

Este projeto implementa um **sistema plug-in modular** que permite conectar/desconectar funcionalidades Firebase sem quebrar o código. Tudo é configurado através de variáveis de ambiente e arquivos de configuração centralizados.

## 🏗️ Arquitetura Criada

```
src/
├── config/           # 🔌 Configurações modulares
│   ├── firebase.ts   # Firebase App & Services
│   ├── features.ts   # Feature flags
│   └── environment.ts# Environment variables
├── hooks/            # 🔌 Hooks especializados
│   ├── useFirebaseAuth.ts
│   └── useFirebaseAnalytics.ts
├── integrations/     # 🔌 Integrações completas
│   └── firebase.ts
scripts/
├── init-firebase.js  # Script de inicialização
├── firebase.json     # Hosting config
├── .firebaserc      # Project targets
└── deploy.config.js # Deploy automation
```

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# Instalar dependências
npm install

# Inicializar Firebase
npm run init:firebase

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 2. Conectar Funcionalidades

```typescript
// Em qualquer componente
import { useFirebaseIntegrations } from '@/integrations/firebase';

function MyComponent() {
  const { auth, analytics, trackWhatsAppClick } = useFirebaseIntegrations();

  // Usar autenticação
  const handleLogin = () => auth.signIn(email, password);

  // Rastrear eventos
  const handleWhatsAppClick = () => trackWhatsAppClick('hero', 'design');

  return (
    <button onClick={handleWhatsAppClick}>
      Conversar no WhatsApp
    </button>
  );
}
```

### 3. Ligar/Desligar Features

```typescript
// Em src/config/features.ts
features.analytics.enabled = false; // Desliga analytics
features.auth.enabled = true;        // Liga autenticação
```

### 4. Deploy

```bash
# Desenvolvimento
npm run deploy:dev

# Produção
npm run deploy:prod

# Emuladores locais
npm run emulators
```

## 🔌 Sistema Plug-in Explicado

### Como Funciona

1. **Configurações Modulares**: Cada funcionalidade tem sua própria configuração
2. **Feature Flags**: Liga/desliga features sem alterar código
3. **Fallback Automático**: Se uma feature estiver desabilitada, usa implementação mock
4. **Type Safety**: TypeScript garante que tudo está conectado corretamente

### Exemplo Prático

```typescript
// 🔌 PLUG-IN: Analytics
const analytics = isFeatureEnabled('analytics')
  ? useFirebaseAnalytics()
  : useMockAnalytics();

// 🔌 PLUG-IN: Authentication
const auth = isFeatureEnabled('auth')
  ? useFirebaseAuth()
  : useMockAuth();
```

## 📊 Funcionalidades Disponíveis

| Funcionalidade | Status | Arquivo | Descrição |
|---|---|---|---|
| 🔐 Autenticação | ✅ Pronto | `useFirebaseAuth.ts` | Login/registro com Firebase |
| 📊 Analytics | ✅ Pronto | `useFirebaseAnalytics.ts` | Rastreamento GA4 |
| 💳 Pagamentos | 🔄 Próximo | - | M-Pesa/eMola integration |
| 👑 Admin | 🔄 Próximo | - | Dashboard administrativo |
| 📱 PWA | 📋 Planejado | - | App-like experience |

## 🛠️ Desenvolvimento

### Adicionar Nova Funcionalidade

1. **Criar feature flag** em `src/config/features.ts`
2. **Implementar hook** em `src/hooks/`
3. **Adicionar à integração** em `src/integrations/firebase.ts`
4. **Configurar variáveis** em `.env.example`

### Debugging

```typescript
// Verificar status do sistema
import { useFirebaseDebug } from '@/integrations/firebase';

const { logStatus, testIntegrations } = useFirebaseDebug();
logStatus();        // Status completo
testIntegrations(); // Testar integrações
```

## 🚨 Troubleshooting

### Firebase não conecta
```bash
npm run config:check          # Verificar configuração
firebase projects:list        # Listar projetos
npm run emulators            # Testar emuladores
```

### Features não funcionam
```typescript
import { getFeaturesStatus } from '@/config/features';
console.log(getFeaturesStatus()); // Verificar status
```

### Deploy falha
```bash
firebase use                   # Verificar projeto ativo
npm run config:check          # Validar configuração
```

## 🔧 Manutenção

### Atualizações
- Modifique apenas arquivos de configuração
- Use feature flags para mudanças significativas
- Teste sempre com emuladores primeiro

### Backup
- Todas as configurações estão versionadas
- Use `.env.example` como template
- Documente mudanças no `FIREBASE_SETUP.md`

## 📈 Benefícios do Sistema

- **🔄 Flexibilidade**: Conectar/desconectar sem quebrar código
- **🛡️ Segurança**: Type safety e validação
- **🐛 Debugging**: Fácil identificação de problemas
- **📊 Analytics**: Rastreamento completo de uso
- **🚀 Performance**: Lazy loading e otimização automática

---

**🎯 Resultado**: Sistema robusto e flexível que cresce com seu negócio, mantendo sempre a estabilidade e performance.