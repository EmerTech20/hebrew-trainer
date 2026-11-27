const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 820, height: 1100 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { S.prog.flags.noImport = 1; go('practice'); }); await p.waitForTimeout(300);
  console.log('card', await p.evaluate(() => !!document.getElementById('mm-card') && !!document.getElementById('pa-card')));
  // memory compare unit
  console.log(await p.evaluate(() => { const ref = 'וַתֹּאמֶר רוּת אַל־תִּפְגְּעִי־בִי לְעָזְבֵךְ'; return [memCompare('ותאמר רות אל תפגעי בי לעזבך', ref).score, memCompare('ותאמר רת אל תפגעי לעזבך', ref).score, memCompare('', ref).score, memCompare('ותאמר נעמי אל תפגעי בי לעזבך ללכת', ref).score].map(x => Math.round(x * 100) / 100); }));
  // practice memory drill
  await p.evaluate(() => startMemory(1, 16, 17)); await p.waitForTimeout(300);
  await p.click('.hekeys summary'); await p.click('[data-hk="ו"]'); await p.click('[data-hk="ת"]');
  await p.fill('#mm-ta', 'ותאמר רות אל תפגעי בי לעזבך לשוב מאחריך כי אל אשר תלכי אלך'); await p.click('#mm-check'); await p.waitForTimeout(200);
  console.log('MEMO:', (await p.innerText('#fb')).slice(0, 300).replace(/\n+/g, ' | '));
  await p.screenshot({ path: '/home/claude/tests/memo.png', fullPage: true });
  // real-format final
  await p.evaluate(() => startExam('final')); await p.waitForTimeout(1500);
  const info = await p.evaluate(() => ({ n: EX.items.length, type: EX.type, ref: EX.passage && EX.passage.ref, secs: EX.items.reduce((a, x) => (a[x.sec] = (a[x.sec] || 0) + 1, a), {}), lim: EX.limitMs / 60000, limits: EX.limits }));
  console.log('FINAL', JSON.stringify(info));
  console.log('INTRO:', (await p.innerText('#v-session')).slice(0, 400).replace(/\n+/g, ' | '));
  // answer: find a way into the items
  const btns = await p.evaluate(() => [...document.querySelectorAll('#v-session button')].map(b => b.id + ':' + b.innerText).slice(0, 8)); console.log(btns);
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
