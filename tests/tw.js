const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(6000);
  console.log(await p.evaluate(async () => { await lexLoad(); const m = localMeaning({ q: 'וְרָחַץ בַּמַּיִם אֶת־בְּשָׂרוֹ סוּסָיו', he: '', ctx: '', passage: '', options: [] }); return m.words.map(w => w.he + ' = ' + w.meaning).join('\n'); }));
  await b.close(); })();
