# Ponto - Registro de Horas (Conecta)

Script com **Puppeteer** e **Mocha** para automatizar o login e (em seguida) o registro de ponto no sistema Conecta.

## Pré-requisitos

- Node.js 18+
- Acesso à URL do sistema de ponto (Conecta)

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   copy config.example.env .env
   ```

2. Edite o `.env` e preencha:

   - **RELOGIO_BASE_URL** – URL base do sistema (ex: `https://ponto.empresa.com/Relogio`)
   - **RELOGIO_USERNAME** – seu usuário
   - **RELOGIO_PASSWORD** – sua senha

Não commite o arquivo `.env` (ele já está no `.gitignore`).

## Uso

### Rodar apenas o teste de login

```bash
npm run test:login
```

### Rodar todos os testes

```bash
npm test
```

## Fluxo do login (implementado)

1. Abre a página de login (`/Relogio/login.xhtml`).
2. Preenche os campos **Usuário** e **Senha**.
3. Clica no botão **Login** (PrimeFaces: primeiro o `verifqUsu`, que pode exibir captcha).
4. Verifica se houve redirecionamento (sucesso) ou mensagem de erro/captcha.

**Observação:** Se o sistema exibir **captcha**, o login automatizado não será possível nesse passo; o teste falhará com mensagem explicando.

## Próximos passos

Após o login estar estável, o próximo passo é implementar o fluxo de **bater o ponto** (navegação até a tela de registro e clique no botão de registro).
# ponto
