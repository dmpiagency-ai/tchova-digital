# 🔌 Firebase Setup Guide - TchovaDigital

## Visão Geral

Este projeto usa uma arquitetura **modular plug-in** que permite conectar/desconectar facilmente funcionalidades Firebase sem quebrar o código. Tudo é configurado através de variáveis de ambiente e arquivos de configuração centralizados.

## 🚀 Configuração Rápida

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Fazer Login no Firebase
```bash
firebase login
```

### 3. Configurar Variáveis de Ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas configurações reais
```

### 4. Inicializar Projetos Firebase
```bash
# Para desenvolvimento
firebase use development
firebase init hosting --project tchova-digital-dev

# Para produção
firebase use production
firebase init hosting --project tchova-digital-prod
```

## 📁 Estrutura de Configuração

```
src/config/
├── firebase.ts      # 🔌 Firebase App & Services
├── features.ts      # 🔌 Feature Flags
└── environment.ts   # 🔌 Environment Variables

firebase.json        # Hosting Configuration
.firebaserc         # Project Targets
deploy.config.js    # Deploy Automation
.env.example        # Environment Template
```

## 🔌 Sistema Plug-in

### Como Conectar/Desconectar Funcionalidades

**Para ativar uma funcionalidade:**
```javascript
// Em src/config/features.ts
features.auth.enabled = true;
```

**Para configurar Firebase:**
```javascript
// Em .env.local
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_API_KEY=your_api_key
```

### Funcionalidades Disponíveis

| Funcionalidade | Status | Configuração |
|---|---|---|
| 🔐 Autenticação | ✅ Pronto | `features.auth` |
| 📊 Analytics | ✅ Pronto | `features.analytics` |
| 💳 Pagamentos | ✅ Pronto | `features.payments` |
| 📱 WhatsApp | ✅ Pronto | `features.whatsapp` |
| 👑 Admin | ✅ Pronto | `features.admin` |

## 🛠️ Comandos de Deploy

### Desenvolvimento
```bash
npm run deploy:dev      # Deploy para desenvolvimento
npm run emulators       # Iniciar emuladores locais
npm run preview:dev     # Preview local
```

### Produção
```bash
npm run deploy:prod     # Deploy para produção
npm run config:check    # Verificar configuração
```

## 🔧 Configuração por Ambiente

### Desenvolvimento
- Usa emuladores Firebase
- Analytics desabilitado
- Pagamentos em modo demo
- Logs detalhados

### Produção
- Firebase real
- Analytics ativo
- Pagamentos reais
- Logs otimizados

## 📊 Monitoramento

### Status do Sistema
```javascript
import { getFirebaseStatus, getFeaturesStatus } from '@/config/firebase';

console.log('Firebase:', getFirebaseStatus());
console.log('Features:', getFeaturesStatus());
```

### Debugging
```javascript
// Verificar configuração
npm run config:check

// Toggle features em desenvolvimento
import { toggleFeature } from '@/config/features';
toggleFeature('analytics'); // Liga/desliga analytics
```

## 🚨 Troubleshooting

### Problema: Firebase não conecta
```bash
# Verificar variáveis de ambiente
npm run config:check

# Resetar configuração
rm -rf .firebase/
firebase logout && firebase login
```

### Problema: Deploy falha
```bash
# Verificar projeto ativo
firebase use

# Verificar configuração
firebase projects:list
```

### Problema: Emuladores não funcionam
```bash
# Instalar Java (requerido)
# Resetar emuladores
firebase emulators:stop
npm run emulators
```

## 🔄 Atualizações Futuras

Quando fizer mudanças:

1. **Atualize variáveis em `.env.local`**
2. **Teste com emuladores:** `npm run emulators`
3. **Deploy para dev:** `npm run deploy:dev`
4. **Teste em staging**
5. **Deploy para prod:** `npm run deploy:prod`

## 📞 Suporte

Para dúvidas sobre configuração Firebase:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [TchovaDigital Support](https://wa.me/258841234567)

---

**💡 Dica:** Use `npm run config:check` sempre antes de fazer deploy para garantir que tudo está configurado corretamente.