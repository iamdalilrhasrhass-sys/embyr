const https = require('https');
const http = require('http');

const URL = 'https://sys.4chan.org/lgbt/post';
let workingProxies = [];

function testProxy(proxy, type = 'http') {
  return new Promise((resolve) => {
    const [host, port] = proxy.split(':');
    const opts = {
      host,
      port: parseInt(port),
      method: 'CONNECT',
      path: 'sys.4chan.org:443',
      timeout: 8000,
      rejectUnauthorized: false
    };
    
    const req = http.request(opts, (res) => {
      if (res.statusCode === 200) {
        // Proxy works, now test if it can access sys.4chan.org
        const httpsOpts = {
          host: 'sys.4chan.org',
          path: '/lgbt/post',
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0' },
          createConnection: () => {
            // Create through proxy
            const socket = require('net').createConnection({ host, port: parseInt(port) });
            socket.write(`CONNECT sys.4chan.org:443 HTTP/1.1\r\n\r\n`);
            return socket;
          },
          timeout: 10000
        };
        
        const req2 = https.request(httpsOpts, (res2) => {
          let data = '';
          res2.on('data', d => data += d);
          res2.on('end', () => {
            if (data.includes('Please disable') || data.includes('captcha') || res2.statusCode === 200) {
              console.log(`!! WORKING: ${proxy} -> status=${res2.statusCode} len=${data.length} text=${data.substring(0,100)}`);
              workingProxies.push(proxy);
            } else {
              console.log(`BLOCKED: ${proxy} -> ${data.substring(0,80)}`);
            }
            resolve(false);
          });
        });
        req2.on('error', () => resolve(false));
        req2.end();
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

async function main() {
  // Get proxies from multiple sources
  const sources = [
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt',
    'https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies_plain/http.txt'
  ];
  
  const allProxies = new Set();
  for (const src of sources) {
    try {
      const resp = await fetch(src);
      const text = await resp.text();
      text.split('\n').filter(l => l.trim()).forEach(p => allProxies.add(p.trim()));
    } catch(e) {
      console.log(`FAILED to fetch ${src}: ${e.message}`);
    }
  }
  
  console.log(`Total unique proxies: ${allProxies.size}`);
  
  // Test a batch
  const batch = Array.from(allProxies).slice(0, 50);
  console.log(`Testing ${batch.length} proxies...`);
  
  const results = await Promise.allSettled(
    batch.map(p => testProxy(p).catch(() => {}))
  );
  
  console.log(`\nWorking proxies: ${workingProxies.length}`);
  workingProxies.forEach(p => console.log(`  ${p}`));
  
  if (workingProxies.length > 0) {
    console.log(`\nFirst working: ${workingProxies[0]}`);
  }
}

main().catch(console.error);
