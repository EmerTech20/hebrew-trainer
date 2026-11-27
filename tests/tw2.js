const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block' }); const p = await ctx.newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { await lexLoad(); const out = []; for (const v of [1,2,3]) { const t = performance.now(); const V = twVerseWords(1, v); out.push(v + ':' + V.words.length + 'w ' + Math.round(performance.now() - t) + 'ms'); }
    const t = performance.now(); for (const [v] of RUTH.verses['1'].slice(3,8)) { const t1 = performance.now(); const V = twVerseWords(1, +v); out.push(v + ':' + Math.round(performance.now() - t1) + 'ms'); } return out.join(' '); }));
  await b.close(); })();
