const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block' }); const p = await ctx.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); console.log('goto'); await p.goto('http://localhost:8765/', { timeout: 30000 }); console.log('loaded'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => typeof twVerseWords + ' ' + typeof lexLoad));
  console.log(await p.evaluate(async () => { const t = performance.now(); await lexLoad(); return 'lex ' + Math.round(performance.now() - t); }));
  console.log(await p.evaluate(() => { const t = performance.now(); const V = twVerseWords(1, 1); return V.words.length + ' ' + Math.round(performance.now() - t); }));
  await b.close(); })();
