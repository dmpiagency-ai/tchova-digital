# ✅ Firebase Configuration Checklist - TchovaDigital

## 📋 CONFIGURAÇÃO COMPLETA - PASSO A PASSO

### 🔥 1. PREPARAÇÃO INICIAL

- [ ] **Firebase CLI instalado**
  ```bash
  npm install -g firebase-tools
  firebase --version
  ```

- [ ] **Login no Firebase**
  ```bash
  firebase login
  ```

- [ ] **Inicialização do projeto**
  ```bash
  npm run setup:firebase
  ```

---

### 🔥 2. CRIAR PROJETOS NO FIREBASE CONSOLE

Acesse: https://console.firebase.google.com/

#### 📦 DESENVOLVIMENTO
- [ ] **Projeto criado**: `tchova-digital-dev`
- [ ] **Authentication**: Email/Password + Google enabled
- [ ] **Firestore**: Database criado (modo produção)
- [ ] **Hosting**: Configurado
- [ ] **Analytics**: Propriedade criada

#### 📦 STAGING
- [ ] **Projeto criado**: `tchova-digital-staging`
- [ ] **Authentication**: Email/Password + Google enabled
- [ ] **Firestore**: Database criado
- [ ] **Hosting**: Configurado
- [ ] **Analytics**: Propriedade criada

#### 📦 PRODUÇÃO ⚠️
- [ ] **Projeto criado**: `tchova-digital-prod`
- [ ] **Plano**: Blaze Plan (pago) ativado
- [ ] **Authentication**: Email/Password + Google enabled
- [ ] **Firestore**: Database criado
- [ ] **Hosting**: Configurado
- [ ] **Analytics**: Propriedade criada
- [ ] **Security Rules**: Configuradas (produção)

---

### 🔥 3. CONFIGURAÇÃO LOCAL

#### 📝 Arquivos de Ambiente
- [ ] **`.env.local`** criado e preenchido
  ```env
  VITE_FIREBASE_API_KEY=AIzaSyD...
  VITE_FIREBASE_PROJECT_ID=tchova-digital-dev
  VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-dev.firebaseapp.com
  # ... outros valores
  ```

- [ ] **`.env.production`** criado e preenchido
  ```env
  VITE_FIREBASE_API_KEY=AIzaSyD...
  VITE_FIREBASE_PROJECT_ID=tchova-digital-prod
  VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-prod.firebaseapp.com
  # ... outros valores
  ```

#### 🖥️ Firebase CLI
- [ ] **Projetos conectados**
  ```bash
  firebase use development  # Para dev
  firebase use production   # Para prod
  ```

- [ ] **Verificação de projetos**
  ```bash
  firebase projects:list
  ```

---

### 🔥 4. TESTES E VALIDAÇÃO

#### 🧪 Emuladores Locais
- [ ] **Emuladores funcionando**
  ```bash
  npm run emulators
  # Deve abrir: http://localhost:4000
  ```

- [ ] **Authentication testada**
- [ ] **Firestore testado**
- [ ] **Hosting preview funcionando**

#### 🚀 Deploy de Teste
- [ ] **Deploy desenvolvimento**
  ```bash
  npm run deploy:dev
  ```

- [ ] **Site acessível online**
- [ ] **Funcionalidades básicas testadas**

#### 📊 Analytics
- [ ] **GA4 recebendo dados**
- [ ] **Eventos customizados funcionando**
- [ ] **Debug mode ativo em desenvolvimento**

---

### 🔥 5. CONFIGURAÇÕES AVANÇADAS

#### 🔐 Segurança (Produção)
- [ ] **Firestore Rules** aplicadas
  ```javascript
  // Regras de segurança configuradas
  match /users/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```

- [ ] **Storage Rules** configuradas
- [ ] **CORS** configurado
- [ ] **Rate limiting** ativo

#### 📈 Monitoramento
- [ ] **Alertas configurados**
- [ ] **Uptime monitoring** ativo
- [ ] **Error reporting** configurado
- [ ] **Performance monitoring** ativo

---

### 🔥 6. DEPLOY FINAL

#### 🚀 Produção
- [ ] **Deploy produção**
  ```bash
  npm run deploy:prod
  ```

- [ ] **Domínio personalizado** configurado (opcional)
- [ ] **SSL certificado** ativo
- [ ] **CDN** configurado

#### ✅ Validação Final
- [ ] **Todos os testes passando**
- [ ] **Analytics funcionando**
- [ ] **Backup configurado**
- [ ] **Documentação atualizada**

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Verificar configuração
npm run config:check

# Status dos projetos
firebase projects:list

# Testar emuladores
npm run emulators

# Deploy por ambiente
npm run deploy:dev      # Desenvolvimento
npm run deploy:staging  # Staging
npm run deploy:prod     # Produção

# Verificar projeto ativo
firebase use

# Logs de deploy
firebase hosting:site:get-live-version
```

---

## 🔍 DIAGNÓSTICO RÁPIDO

Execute este comando para verificar tudo:
```bash
npm run config:check
```

### Possíveis Problemas:

**❌ "Project not found"**
```bash
firebase use --add
# Selecionar projeto correto
```

**❌ "Permission denied"**
- Verificar se você é owner do projeto
- Adicionar colaboradores no Console

**❌ "Quota exceeded"**
- Upgrade para Blaze Plan (produção)
- Verificar limites de uso

---

## 📞 SUPORTE

**Imediatamente:**
- WhatsApp: +258 84 123 4567

**Documentação:**
- `FIREBASE_CONSOLE_SETUP.md` - Guia completo do Console
- `FIREBASE_SETUP.md` - Configuração técnica
- `PLUG_IN_SYSTEM_README.md` - Sistema plug-in

---

## 🎯 STATUS ATUAL

- [ ] Configuração inicial ✅
- [ ] Projetos Firebase criados
- [ ] Ambiente local configurado
- [ ] Testes realizados
- [ ] Deploy produção concluído

**Quando tudo estiver ✅, seu sistema estará 100% operacional! 🚀**