const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2000);
  console.log(await p.evaluate(() => { const o = []; for (const [c, a, z] of [[1, 7, 12], [4, 1, 6], [1, 1, 6], [2, 1, 6], [3, 1, 6], [4, 11, 16]]) for (let v = a; v <= z; v++) { const x = ruthVerse(c, v); o.push(`${c}:${v} ${x ? x.he.replace(/[֑-ֽ֯]/g, '') : 'NONE'} || ${x && (x.en || x.model || '')}`); } return o.join('\n'); }));
  await b.close(); })();
