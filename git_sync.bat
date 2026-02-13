@echo off
echo 🔍 Verificando erros no código...

REM Verificar se há erros de build
npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erros detectados no build. Corrija os erros antes de sincronizar.
    exit /b 1
)

echo ✅ Build successful - no errors detected

echo 📦 Adicionando arquivos ao Git...
git add .

echo 💾 Criando commit...
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set datetime=%datetime:~0,8%_%datetime:~8,6%
git commit -m "feat: Auto-sync - %datetime%"

echo 🚀 Enviando para repositório remoto...
git push origin main

echo ✅ Git sincronizado com sucesso!
pause