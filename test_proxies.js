const { chromium } = require('playwright');
const http = require('http');

// Test if a proxy works with 4chan posting
async function testProxy(proxyUrl) {
  return new Promise((resolve) => {
    const proxy = new URL(proxyUrl);
    const req = http.request({
      host: proxy.hostname,
      port: parseInt(proxy.port),
      method: 'CONNECT',
      path: 'sys.4chan.org:443',
      timeout: 10000
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

// Test free proxies against sys.4chan.org
async function main() {
  // Try some known free proxies
  const proxies = [
    'http://185.112.144.62:1080',
    'http://51.158.68.68:8811',
    'http://47.254.36.141:8080',
  ];
  
  for (const proxy of proxies) {
    const works = await testProxy(proxy);
    console.log(`${proxy}: ${works}`);
  }
  
  // Actually, let's try a different approach entirely
  // Use Playwright with a proxy
  for (const proxy of proxies) {
    try {
      const browser = await chromium.launch({ 
        headless: true,
        proxy: { server: proxy }
      });
      const page = await browser.newPage();
      await page.goto('https://api.ipify.org?format=json', { timeout: 15000 });
      const ipInfo = await page.evaluate(() => document.body.innerText);
      console.log(`IP via ${proxy}: ${ipInfo}`);
      await browser.close();
    } catch(e) {
      console.log(`${proxy}: FAILED - ${e.message.substring(0, 100)}`);
    }
  }
  
  // Try without proxy (direct VPS IP) to see what IP we have
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://api.ipify.org?format=json', { timeout: 10000 });
  const myIp = await page.evaluate(() => document.body.innerText);
  console.log(`VPS IP: ${myIp}`);
  await browser.close();
}

main().catch(console.error);
