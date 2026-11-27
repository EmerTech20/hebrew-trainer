const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 800 } }); const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => [document.documentElement.getAttribute('data-theme'), getComputedStyle(document.body).backgroundColor, document.getElementById('btn-theme').textContent, document.documentElement.scrollWidth]));
  await p.screenshot({ path: 'dark.png' });
  await p.click('#btn-theme'); console.log(await p.evaluate(() => [document.documentElement.getAttribute('data-theme'), getComputedStyle(document.body).backgroundColor]));
  await p.reload(); await p.waitForTimeout(1500); console.log('after reload', await p.evaluate(() => document.documentElement.getAttribute('data-theme')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
