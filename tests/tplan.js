const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 820, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack||'').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const bk = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-trainer-my-progress-2026-11-04.json', 'utf8'));
  await p.evaluate(async d => importDocs(d), bk.docs); await p.reload(); await p.waitForTimeout(3000);
  await p.evaluate(() => go('today')); await p.waitForTimeout(2000);
  console.log('PLAN:', (await p.innerText('#plan-card')).replace(/\n+/g, ' | '));
  console.log('examDate', await p.evaluate(() => anSet().examDate));
  await p.screenshot({ path: 'plan.png' });
  // grid
  await p.click('[data-pb="grid"]'); await p.waitForTimeout(800);
  await p.evaluate(() => { const rows = SES.items[0]._rows; document.querySelectorAll('.g-in').forEach((x, i) => { if (i < 5) x.value = rows[i].f.replace(/[֑-ׇ]/g, ''); }); });
  await p.click('#b-check'); await p.waitForTimeout(500);
  console.log('GRID:', (await p.innerText('#fb')).replace(/\n+/g, ' | '), '| bar:', !!(await p.$('#pace-bar')));
  await p.screenshot({ path: 'grid.png', fullPage: true });
  await p.click('#b-next'); await p.waitForTimeout(800);
  console.log('grid done?', await p.evaluate(() => planDone('grid')));
  // pgn
  await p.evaluate(() => startPgnDrill({ planBlock: 'pgn' })); await p.waitForTimeout(800);
  for (let k = 0; k < 3; k++) {
    const it = await p.evaluate(() => { const it = SES.items[SES.i]; return { form: it.form, conj: it.conj, pgn: it.pgn }; });
    const right = k !== 1;
    await p.evaluate(([right]) => { const it = SES.items[SES.i]; const q = it.conj === 'ptc' ? { p: '-', g: it.pgn[0], n: it.pgn[1] } : parsePGN(it.pgn); const pick = (f, v) => { const b = document.querySelector(`.pc[data-f="${f}"][data-v="${v}"]`); b && b.click(); };
      pick('p', q.p); pick('g', right ? q.g : (q.g === 'm' ? 'f' : 'm')); pick('n', q.n); document.getElementById('b-check').click(); }, [right]);
    await p.waitForTimeout(300); console.log('PGN', JSON.stringify(it), '→', (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 200));
    if (k === 0) await p.screenshot({ path: 'pgn.png', fullPage: true });
    await p.click('#b-next'); await p.waitForTimeout(300);
  }
  // weak roots
  await p.evaluate(() => startWeakRoots({ planBlock: 'roots' })); await p.waitForTimeout(1000);
  console.log('ROOT item', await p.evaluate(() => [SES.items[0].form, SES.items[0].root, rootClasses(SES.items[0].root)]), 'row:', !!(await p.$('#rc-row')));
  await p.click('[data-rc="strong"]'); await p.waitForTimeout(200); console.log('RC fb:', await p.innerText('#rc-fb'));
  await p.screenshot({ path: 'roots.png', fullPage: true });
  console.log('rootClasses tests', await p.evaluate(() => ['נתן','ישב','קום','בנה','מצא','סבב','שמר','לקח','הלך','נכה'].map(r => r + ':' + rootClasses(r).join('+')).join(' ')));
  // recall
  await p.evaluate(() => startRecall({ planBlock: 'recall', n: 5 })); await p.waitForTimeout(4000);
  const g = await p.evaluate(() => SES.items[0].gloss); await p.fill('#rc-in', g.split(/[;,]/)[0]); await p.click('#b-check'); await p.waitForTimeout(1500);
  console.log('RECALL ok:', (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 400));
  await p.screenshot({ path: 'recall.png', fullPage: true });
  await p.click('#b-next'); await p.waitForTimeout(1500); await p.fill('#rc-in', 'banana'); await p.click('#b-check'); await p.waitForTimeout(500);
  console.log('RECALL bad:', (await p.innerText('#fb')).replace(/\n+/g, ' | ').slice(0, 200));
  // ruth work
  await p.evaluate(() => startRuthWork({ planBlock: 'ruth' })); await p.waitForTimeout(800);
  console.log('RUTH:', (await p.innerText('#v-session')).replace(/\n+/g, ' | ').slice(0, 300));
  // progress readiness
  await p.evaluate(() => go('progress')); await p.waitForTimeout(4000);
  console.log('READY:', (await p.innerText('#ready-panel')).replace(/\n+/g, ' | ').slice(0, 700));
  await p.evaluate(() => go('practice')); await p.waitForTimeout(1000); console.log('FX:', !!(await p.$('#fx-card')));
  await p.evaluate(() => go('cards')); await p.waitForTimeout(1500); console.log('typein buttons:', (await p.$$('[data-typein]')).length);
  await p.evaluate(() => go('today')); await p.waitForTimeout(1500); console.log('PLAN2:', (await p.innerText('#plan-card')).replace(/\n+/g, ' | ').slice(0, 200));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
