const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 820, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack||'').split('\n')[1]));
  p.on('dialog', d => d.accept());
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => go('today')); await p.waitForTimeout(1500);
  console.log('PLAN:', (await p.innerText('#plan-card')).replace(/\n+/g, ' | ').slice(0, 300));
  // retake r2
  await p.evaluate(() => startRetake('r2')); await p.waitForTimeout(1500);
  console.log('RETAKE:', (await p.innerText('#v-session')).replace(/\n+/g, ' | ').slice(0, 300), 'n=', await p.evaluate(() => SES.items.length + ' ' + SES.items.map(i => i.kind + (i.sub ? '/' + i.sub : '')).join(',')));
  // jump to parse item (אֲלַקֳטָה) answer correctly
  await p.evaluate(() => { SES.i = SES.items.length - 1; drawItem(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const it = SES.items[SES.i]; const q = parsePGN(it.pgn); const c = (f, v) => { const b = document.querySelector(`.pc[data-f="${f}"][data-v="${v}"]`); b && b.click(); }; c('p', q.p); c('g', q.g); c('n', q.n); c('conj', it.conj); c('stem', it.stem); document.getElementById('p-root').value = it.root; });
  await p.click('#b-check'); await p.waitForTimeout(600);
  console.log('PARSE FB:', (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 400));
  // r1 alt grading: answer ptc fs
  await p.evaluate(() => startRetake('r1')); await p.waitForTimeout(800);
  await p.evaluate(() => { SES.i = SES.items.length - 1; drawItem(); }); await p.waitForTimeout(400);
  await p.evaluate(() => { const c = (f, v) => { const b = document.querySelector(`.pc[data-f="${f}"][data-v="${v}"]`); b && b.click(); }; c('p', '-'); c('g', 'f'); c('n', 's'); c('conj', 'ptc'); c('stem', 'qal'); document.getElementById('p-root').value = 'שוב'; });
  await p.click('#b-check'); await p.waitForTimeout(500); console.log('R1 ptc:', (await p.innerText('#fb')).slice(0, 120).replace(/\n+/g, ' | '));
  // r3 locked -> dialog accept
  await p.evaluate(() => startRetake('r3')); await p.waitForTimeout(800); console.log('R3 started:', await p.evaluate(() => SES.title), await p.evaluate(() => JSON.stringify(S.prog.settings.submitted)));
  // sf drill
  await p.evaluate(() => startSfDrill()); await p.waitForTimeout(800);
  const it = await p.evaluate(() => { const it = SES.items[0]; return { form: it.form, stem: it.stem, conj: it.conj, src: it.src }; });
  await p.evaluate(() => { const it = SES.items[0]; document.querySelector(`.pc[data-f="stem"][data-v="${it.stem}"]`).click(); document.querySelector(`.pc[data-f="conj"][data-v="${it.conj === 'qatal' ? 'yiqtol' : 'qatal'}"]`).click(); document.getElementById('b-check').click(); });
  await p.waitForTimeout(300); console.log('SF', JSON.stringify(it), (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 300), 'bar', !!(await p.$('#pace-bar')));
  await p.screenshot({ path: 'sf.png', fullPage: true });
  console.log('sf pool', await p.evaluate(() => { const P = sfPool(); const c = {}; P.forEach(x => c[x.stem] = (c[x.stem] || 0) + 1); return JSON.stringify(c) + ' n=' + P.length; }));
  // accents
  await p.evaluate(() => startAccents()); await p.waitForTimeout(600); await p.screenshot({ path: 'acc.png', fullPage: true });
  await p.click('.opt'); await p.waitForTimeout(300); console.log('ACC', (await p.innerText('#fb')).slice(0, 150).replace(/\n+/g, ' | '));
  await p.evaluate(() => go('practice')); await p.waitForTimeout(800); console.log('FX:', (await p.innerText('#fx-card')).replace(/\n+/g, ' | '));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
