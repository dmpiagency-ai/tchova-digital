# Arquitetura do Projeto TchovaDigital

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI (shadcn/ui)
│   └── forms/           # Formulários específicos
├── pages/               # Páginas/Rotas da aplicação
├── contexts/            # Context API providers
├── hooks/               # Custom hooks
├── config/              # Configurações e constantes
├── services/            # Serviços externos
├── types/               # TypeScript types
├── utils/               # Utilitários
├── integrations/        # Integrações externas
├── lib/                 # Bibliotecas e helpers
├── constants/           # Constantes globais
└── assets/              # Imagens e estáticos
```

## 🔌 Sistema de Conexões (Plug-in Pattern)

### Princípio: "Como uma tomada que conecta"

Cada módulo é independente e pode ser conectado/desconectado sem afetar outros:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Componente    │────▶│    Context/     │────▶│    Service/     │
│    (UI)         │     │    Hook         │     │    API          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## ✅ Componentes Ativos (Utilizados)

### Páginas Principais (src/pages/)
| Arquivo | Rota | Descrição |
|---------|------|-----------|
| `Index.tsx` | `/` | Página principal |
| `Admin.tsx` | `/admin/gsm` | Painel admin GSM |
| `AdminPanel.tsx` | `/admin` | Painel administrativo |
| `Login.tsx` | `/login` | Autenticação |
| `ServiceDetails.tsx` | `/service-details` | Detalhes de serviço |
| `Payment.tsx` | `/payment` | Pagamentos |
| `Checkout.tsx` | `/checkout/seguro` | Checkout seguro |
| `CheckoutSuccess.tsx` | `/checkout/sucesso` | Sucesso checkout |
| `ClientPanel.tsx` | `/painel/:token` | Painel do cliente |
| `PlanCustomizer.tsx` | `/customize-plan` | Personalizar plano |
| `NotFound.tsx` | `*` | Página 404 |

### Componentes Principais (src/components/)
| Arquivo | Utilizado em | Status |
|---------|--------------|--------|
| `Header.tsx` | Index, todas páginas | ✅ Ativo |
| `Hero.tsx` | Index | ✅ Ativo |
| `Services.tsx` | Index | ✅ Ativo |
| `HowItWorks.tsx` | Index | ✅ Ativo |
| `About.tsx` | Index | ✅ Ativo |
| `Pricing.tsx` | Index | ✅ Ativo |
| `Contact.tsx` | Index | ✅ Ativo |
| `Footer.tsx` | Index | ✅ Ativo |
| `FloatingWhatsApp.tsx` | Index | ✅ Ativo |
| `GSMDashboard.tsx` | Index | ✅ Ativo |
| `AdminPanel.tsx` | Admin | ✅ Ativo |
| `LoginModal.tsx` | Header, Services | ✅ Ativo |
| `DarkModeToggle.tsx` | Header | ✅ Ativo |
| `PaymentModal.tsx` | GSMDashboard | ✅ Ativo |
| `ProjectStatus.tsx` | ServiceDetails | ✅ Ativo |
| `VerificationModal.tsx` | ClientPanel | ✅ Ativo |
| `ErrorBoundary.tsx` | App | ✅ Ativo |
| `Notification.tsx` | App | ✅ Ativo |
| `PageLoader.tsx` | App | ✅ Ativo |
| `LazyImage.tsx` | Onde necessário | ✅ Ativo |

### Contexts (src/contexts/)
| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `AuthContext.tsx` | Autenticação Firebase + Token | ✅ Ativo |
| `AdminContext.tsx` | Estado administrativo | ✅ Ativo |
| `AICreditsContext.tsx` | Créditos de IA | ✅ Ativo |

### Configurações (src/config/)
| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `pricing.ts` | Planos e preços | ✅ Ativo |
| `env.ts` | Variáveis de ambiente | ✅ Ativo |
| `firebase.ts` | Configuração Firebase | ✅ Ativo |
| `whatsapp.ts` | Configuração WhatsApp | ✅ Ativo |
| `features.ts` | Feature flags | ✅ Ativo |

## ⚠️ Componentes Não Utilizados (Código Morto)

Os seguintes componentes NÃO são importados em nenhum lugar:

| Arquivo | Tamanho | Ação Recomendada |
|---------|---------|------------------|
| `GSMSection.tsx` | 13KB | Remover ou integrar |
| `ServiceHero.tsx` | 8KB | Remover ou integrar |
| `ServiceBenefits.tsx` | 4KB | Remover ou integrar |
| `ServiceCTA.tsx` | 2KB | Remover ou integrar |
| `ServicePackages.tsx` | 7KB | Remover ou integrar |
| `PartnersCarousel.tsx` | 4KB | Remover ou integrar |
| `ROICalculator.tsx` | 7KB | Remover ou integrar |
| `ImageEditor.tsx` | 27KB | Remover ou integrar |
| `ProposalAgreement.tsx` | 10KB | Remover ou integrar |
| `PlanCustomizerModal.tsx` | 13KB | Remover ou integrar |
| `AICreditsModal.tsx` | 20KB | Remover ou integrar |
| `AICreditsPanel.tsx` | 16KB | Remover ou integrar |
| `AIToolsDashboard.tsx` | 46KB | Remover ou integrar |
| `GSMLoginForm.tsx` | 8KB | Remover ou integrar |
| `Pricing_simple.tsx` | 2KB | **Remover (duplicado)** |
| `Pricing_temp.tsx` | 0.1KB | **Remover (duplicado)** |

## 🔧 Como Adicionar Novos Componentes

### Padrão de Conexão

1. **Criar o componente** em `src/components/`
2. **Exportar** como default
3. **Importar** apenas onde necessário
4. **Não criar dependências circulares**

### Exemplo

```typescript
// src/components/NovoComponente.tsx
import { Button } from '@/components/ui/button';

interface NovoComponenteProps {
  titulo: string;
  onAcao: () => void;
}

export default function NovoComponente({ titulo, onAcao }: NovoComponenteProps) {
  return (
    <div>
      <h2>{titulo}</h2>
      <Button onClick={onAcao}>Ação</Button>
    </div>
  );
}
```

## 📦 Dependências Críticas

### Produção
- React 18
- React Router DOM
- TanStack Query
- Firebase
- Tailwind CSS
- shadcn/ui

### Desenvolvimento
- TypeScript
- Vite
- ESLint

## 🚀 Build e Deploy

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Verificar TypeScript
npx tsc --noEmit
```

## 📝 Regras de Manutenção

1. **Nunca remover** componentes marcados como ✅ Ativos
2. **Sempre verificar** imports antes de remover arquivos
3. **Manter documentação** atualizada
4. **Testar build** após mudanças estruturais
5. **Usar lazy loading** para páginas grandes

---

*Última atualização: 2026-02-12*

---

## 💳 Sistema de Pagamento Autorizado (Botão Mágico)

### Princípio: "O frontend NÃO decide quem paga"

O sistema de pagamento foi projetado com segurança em mente. O botão de pagamento **SÓ aparece** quando o cliente tem autorização válida.

### Fluxo de Autorização

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cliente       │────▶│   WhatsApp      │────▶│   Tchova        │
│   (Visitante)   │     │   (Contato)     │     │   (Autoriza)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Checkout      │◀────│   Botão Mágico  │◀────│   Token URL     │
│   (Pagamento)   │     │   (Aparece)     │     │   (Autorização) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### URL de Autorização

Quando a Tchova autoriza um pagamento, ela envia uma URL como:

```
/service-details?id=1&token=abc123&price=7500&paymentType=entry-50&expires=2026-02-13T00:00:00Z
```

**Parâmetros:**
| Parâmetro | Descrição | Obrigatório |
|-----------|-----------|-------------|
| `id` | ID do serviço | ✅ Sim |
| `token` | Token de autorização | ✅ Sim |
| `price` | Preço acordado | ✅ Sim |
| `paymentType` | Tipo: `entry-50`, `full`, `final-50`, `installment` | ❌ Não |
| `expires` | Data de expiração do token | ❌ Não |
| `status` | Status: `pending`, `paid`, `started` | ❌ Não |

### Componente: BotaoPagamentoMagico

**Localização:** `src/components/BotaoPagamentoMagico.tsx`

**Estados:**
| Estado | Descrição | Renderização |
|--------|-----------|--------------|
| `hidden` | Sem autorização | `null` (não renderiza) |
| `authorized` | Autorizado, pendente | Botão verde "Efetuar Pagamento" |
| `paid` | Pagamento confirmado | Botão desativado "Pagamento Confirmado" |
| `started` | Projeto iniciado | Texto "Projeto em andamento" |

**Uso:**
```tsx
import BotaoPagamentoMagico from '@/components/BotaoPagamentoMagico';

<BotaoPagamentoMagico
  hasAuthorization={hasAuthorization}
  tokenValid={isTokenValid}
  serviceId={service.id}
  serviceTitle={service.title}
  serviceCategory={service.category}
  agreedPrice={agreedPrice}
  paymentType={paymentType}
  paymentStatus={paymentStatusParam}
  authorizationToken={authorizationToken}
/>
```

### Verificações de Segurança

O componente verifica **TODAS** as condições antes de aparecer:

1. **`hasAuthorization`** - Token presente na URL
2. **`tokenValid`** - Token não expirado
3. **`isServiceMatch`** - Serviço corresponde ao token
4. **`paymentStatus`** - Status do pagamento

### Integração no ServiceDetails

O arquivo `src/pages/ServiceDetails.tsx` contém a lógica de verificação:

```typescript
// Verificar se o token é válido (não expirado)
const isTokenValid = useMemo(() => {
  if (!authorizationToken) return false;
  if (!tokenExpiry) return true;
  const expiryDate = new Date(tokenExpiry);
  return expiryDate > new Date();
}, [authorizationToken, tokenExpiry]);

// Verificar se o serviço corresponde ao token
const isServiceMatch = useMemo(() => {
  if (!authorizationToken) return false;
  if (!tokenServiceId) return true;
  return tokenServiceId === serviceId;
}, [authorizationToken, tokenServiceId, serviceId]);

// Autorização válida
const hasAuthorization = (payParam === 'enabled' || !!authorizationToken) 
  && isTokenValid 
  && isServiceMatch;
```

### Planos Disponíveis

**Localização:** `src/config/pricing.ts`

| Plano | Preço | Prazo | Ideal para |
|-------|-------|-------|------------|
| START ONLINE | 3.500 MZN | 2-3 dias | Negócios simples |
| PRESENÇA DIGITAL | 7.500 MZN | 5-7 dias | Negócios em crescimento |
| NEGÓCIO DIGITAL | 15.000 MZN | 7-12 dias | Negócios estabelecidos |

### Manutenção

1. **Nunca** remover o componente `BotaoPagamentoMagico`
2. **Sempre** testar o fluxo completo após mudanças
3. **Manter** a documentação atualizada
4. **Verificar** se o build passa antes de commit
