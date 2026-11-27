const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 800, height: 1200 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const bk = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  await p.evaluate(async d => importDocs(d), Object.fromEntries(Object.entries(bk.docs).filter(([k]) => /^(library|libmeta)\//.test(k))));
  await p.reload(); await p.waitForTimeout(2500);
  // N fix
  console.log('vbc fix:', await p.evaluate(async () => { await loadVbc(); const all = Object.values(S.vbc).flatMap(c => c.items.map(e => e.h)); return [all.filter(h => /N/.test(h)).length, all.filter(h => /שְׁלֹשִׁים|אֱלֹהִים/.test(h))]; }));
  await p.evaluate(() => { go('cards'); }); await p.waitForTimeout(800);
  await p.evaluate(() => startMemTest('core')); await p.waitForTimeout(6000);
  console.log('PRE:', (await p.innerText('#wi-pre')).replace(/\n+/g, ' | '));
  console.log('BAR:', await p.innerText('#pace-bar'));
  await p.click('.opt'); await p.waitForTimeout(1500);
  console.log('POST:', (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 900));
  await p.screenshot({ path: 'ws1.png', fullPage: true });
  // timeout
  await p.evaluate(() => { S.prog.settings.examMin = 20; SES.i++; drawItem(); }); 
  console.log('sec for vocab', await p.evaluate(() => paceSec(SES.items[SES.i])));
  const before = await p.evaluate(() => SES.i); await p.waitForTimeout(17500);
  console.log('after timeout i', before, '->', await p.evaluate(() => SES.i), 'last result', await p.evaluate(() => JSON.stringify(SES.results.slice(-1).map(r => [r.score, r.it._timeout]))));
  console.log('note:', await p.evaluate(() => (document.getElementById('pace-note') || {}).textContent));
  // flashcards
  await p.evaluate(() => { S.prog.settings.examMin = 130; startReview('core'); }); await p.waitForTimeout(3500);
  console.log('FC front:', (await p.innerText('#fc')).replace(/\n+/g, ' | ').slice(0, 500));
  await p.click('#fc'); await p.waitForTimeout(500);
  console.log('FC back:', (await p.innerText('#fc')).replace(/\n+/g, ' | ').slice(0, 900));
  await p.screenshot({ path: 'ws2.png', fullPage: true });
  // context question
  console.log(await p.evaluate(() => CONTEXT_MC[0].q.replace(/<[^>]+>/g, '')));
  // final minutes + mm-card
  await p.evaluate(() => go('practice')); await p.waitForTimeout(1200);
  console.log('mm:', (await p.innerText('#mm-card')).slice(0, 250).replace(/\n+/g, ' | '));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
