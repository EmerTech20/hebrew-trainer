const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { startWeakRoots({ n: 40 }); return SES.items.filter(it => /עָשִׂיתִי|מֵר/.test(it.form)).map(it => { let en = ''; try { en = formEnglish(it); } catch (e) { en = 'ERR ' + e.message; } return `${it.form} ${it.stem} ${it.conj} ${it.pgn} r=${it.root} g=${it.gloss} key=${it.key} base=${enBase(it)} => ${en}`; }).join('\n'); }));
  await b.close(); })();
