# 🔄 Sistema de Sincronização Automática Git

## 📋 Visão Geral

Este sistema automatiza o processo de sincronização com o repositório Git remoto, garantindo que todas as alterações sejam commitadas e enviadas automaticamente após verificação de erros.

## 🚀 Como Usar

### Método 1: Script Automático (Recomendado)

Execute o arquivo `git_sync.bat` sempre que quiser sincronizar as alterações:

```bash
# No terminal do Windows
git_sync.bat
```

### Método 2: Comando Manual

Se preferir executar manualmente:

```bash
# 1. Verificar se há erros
npm run build

# 2. Se não houver erros, sincronizar
git add .
git commit -m "feat: Suas alterações - YYYY-MM-DD HH:MM:SS"
git push origin master
```

## 🔍 O que o Script Faz

### ✅ Verificação Automática de Erros
- Executa `npm run build` para detectar erros de TypeScript
- Só prossegue se não houver erros de compilação
- Evita commits com código quebrado

### 📦 Sincronização Completa
1. **Adiciona todos os arquivos**: `git add .`
2. **Cria commit com timestamp**: `git commit -m "feat: Auto-sync - YYYYMMDD_HHMMSS"`
3. **Envia para remoto**: `git push origin master`

### 🎯 Benefícios

- **Segurança**: Nunca commita código com erros
- **Automação**: Processo de 3 passos em 1 comando
- **Timestamp**: Commits identificáveis por data/hora
- **Consistência**: Padrão uniforme de mensagens

## ⚠️ Casos de Uso

### ✅ Quando Usar
- Após implementar novas funcionalidades
- Correção de bugs
- Atualizações de UI/UX
- Mudanças na configuração

### ❌ Quando NÃO Usar
- Durante desenvolvimento ativo (use commits manuais)
- Se houver erros de build (corrija primeiro)
- Para mudanças experimentais

## 📊 Status dos Commits

Para verificar o status do repositório:

```bash
git status
git log --oneline -5
```

## 🔧 Personalização

Para modificar o comportamento do script, edite o arquivo `git_sync.bat`:

```batch
@echo off
echo 🔍 Verificando erros no código...

REM Modificar verificação de build se necessário
npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erros detectados. Corrija antes de sincronizar.
    exit /b 1
)

echo ✅ Build OK - prosseguindo...

REM Personalizar mensagem de commit
git commit -m "feat: Auto-sync - %date% %time%"

REM Push para branch específica se necessário
git push origin main
```

## 🎉 Resultado

Após execução bem-sucedida, você verá:

```
🔍 Verificando erros no código...
✅ Build successful - no errors detected
📦 Adicionando arquivos ao Git...
💾 Criando commit...
🚀 Enviando para repositório remoto...
✅ Git sincronizado com sucesso!
```

## 📝 Notas Importantes

- O script só funciona em ambientes Windows
- Certifique-se de ter permissões de push no repositório
- Mantenha uma conexão estável com a internet
- O script pausa no final para você ver o resultado

---

**💡 Dica**: Execute `git_sync.bat` sempre que terminar um conjunto de alterações significativas para manter o repositório sempre atualizado e sem erros!