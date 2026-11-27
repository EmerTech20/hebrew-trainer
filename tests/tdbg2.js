const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const r = []; for (let k = 0; k < 30; k++) { startWeakRoots({ n: 8 }); for (const it of SES.items) { let en = ''; try { en = formEnglish(it); } catch (e) { en = 'ERR ' + e.message; } r.push(`${it.kind} ${it.form} ${it.stem} ${it.conj} ${it.pgn} r=${it.root} g=${it.gloss} key=${it.key} => [${en}]`); } } return [...new Set(r)].slice(0, 15).join('\n'); }));
  await b.close(); })();
