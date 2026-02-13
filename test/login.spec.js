/**
 * Teste de login no Conecta - Registro de Horas
 *
 * Configure as variáveis no arquivo .env na raiz do projeto (copie de config.example.env):
 *   RELOGIO_BASE_URL, RELOGIO_USERNAME, RELOGIO_PASSWORD
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const puppeteer = require('puppeteer');

const BASE_URL = process.env.RELOGIO_BASE_URL || '';
const USERNAME = (process.env.RELOGIO_USERNAME || '').trim();
const PASSWORD = (process.env.RELOGIO_PASSWORD || '').trim();

// Chrome do sistema no Windows (fallback quando o Puppeteer não tem Chrome instalado)
function getChromePath() {
  if (process.platform !== 'win32') return null;
  const paths = [
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

describe('Login Conecta - Registro de Horas', function () {
  let browser;
  let page;

  before(async function () {
    if (!USERNAME || !PASSWORD) {
      console.error('\n  ERRO: Configure RELOGIO_USERNAME e RELOGIO_PASSWORD no arquivo .env');
      console.error('  Exemplo: copie config.example.env para .env e preencha usuário e senha.\n');
      this.skip();
    }
    const launchOptions = {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
      slowMo: 80,
    };
    const chromePath = getChromePath();
    if (chromePath) launchOptions.executablePath = chromePath;
    browser = await puppeteer.launch(launchOptions);
    const context = await browser.createIncognitoBrowserContext();
    page = await context.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    console.log('   Navegador aberto (guia anônima).');
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
  });

  after(async function () {
  });

  it('abre o navegador em guia anônima e faz login', async function () {
    const loginUrl = BASE_URL.replace(/\/$/, '') + '/login.xhtml';
    await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('#username', { visible: true, timeout: 10000 });

    await page.type('#username', USERNAME, { delay: 50 });
    await page.type('#password', PASSWORD, { delay: 50 });

    const loginClicked = await page.evaluate(() => {
      const btnVerif = document.querySelector('button[name="verifqUsu"]');
      if (btnVerif && btnVerif.offsetParent !== null) {
        btnVerif.click();
        return 'verifqUsu';
      }
      const btnLogin = document.querySelector('button[name="btnLogin"]');
      if (btnLogin && btnLogin.offsetParent !== null) {
        btnLogin.click();
        return 'btnLogin';
      }
      return null;
    });

    if (!loginClicked) {
      throw new Error('Nenhum botão de login encontrado na página');
    }

    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const stillOnLogin = currentUrl.includes('login.xhtml');
    const hasError = await page.evaluate(() => {
      const msg = document.querySelector('#message');
      return msg && msg.textContent && msg.textContent.trim().length > 0;
    });

    if (stillOnLogin && hasError) {
      const errorText = await page.evaluate(() => {
        const msg = document.querySelector('#message');
        return msg ? msg.textContent.trim() : '';
      });
      throw new Error('Login falhou. Mensagem: ' + errorText);
    }

    if (stillOnLogin) {
      const captchaVisible = await page.evaluate(() => {
        const span = document.querySelector('.span-captch');
        return span && span.style.display !== 'none';
      });
      if (captchaVisible) {
        throw new Error(
          'Sistema exibiu captcha. Não é possível automatizar o login neste momento.'
        );
      }
    }

    if (!stillOnLogin) {
      console.log('   Login realizado. URL atual:', currentUrl);
    }
  });
});
