@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Ponto - Relógio (Conecta)

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js nao foi encontrado. Instale o Node.js 18 ou superior:
  echo https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias pela primeira vez...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
  echo.
)

echo Executando registro de ponto...
echo.
call npm start
set EXITCODE=%ERRORLEVEL%
echo.
if %EXITCODE% neq 0 (
  echo Processo terminou com erro ^(codigo %EXITCODE%^).
) else (
  echo Processo concluido.
)
echo.
pause
exit /b %EXITCODE%
