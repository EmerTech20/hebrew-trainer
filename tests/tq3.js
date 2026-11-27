const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const h = parseAnswerHTML({ form: 'הַקְהֵל', root: 'קהל', stem: 'hiphil', conj: 'impv', pgn: '2ms', gloss: 'assemble' }); return (h.match(/How to tell/g) || []).length + ' :: ' + h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 900); }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
