const { chromium } = require('playwright');
const fs = require('fs');
const U21 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
const U23 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-23.json', 'utf8'));
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/t23/';
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1])); p.on('dialog', d => d.accept());
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(async ([a, c]) => { await importDocs(a.docs); await importDocs(c.docs); }, [U21, U23]);
  // Diagnostic 1 with time-up and blanks, then its analysis
  await p.evaluate(() => startDG1()); await p.waitForTimeout(1200); await p.click('#ex-go'); await p.waitForTimeout(400);
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (i < 19) EX.ans[i] = { p: '3', g: 'm', n: 's', conj: i % 3 ? it.conj : 'qatal', stem: i % 2 ? it.stem : 'piel', root: it.root }; }); EX.midDone = 1; EX.cur = 18; EX.elapsed = EX.limitMs - 3000; exSave(); renderExam(); });
  await p.waitForTimeout(8000);
  const t = await p.innerText('#v-session');
  console.log('UNDEFINED lines:', t.split('\n').filter(l => /undefined|NaN/.test(l)).length);
  console.log('FIX FIRST:', (t.match(/Fix first[^\n]*/) || ['MISSING'])[0].slice(0, 300));
  console.log('NOT ANSWERED:', (t.match(/Not answered[^\n]*/) || ['MISSING'])[0].slice(0, 200));
  console.log('HISHT line:', (t.split('\n').find(l => /Hishtaphel/.test(l) && /Answer/.test(l)) || 'none').slice(0, 200));
  // sim with a translation, then Progress
  await p.evaluate(() => startRT('rt1')); await p.waitForTimeout(1200); await p.click('#ex-go'); await p.waitForTimeout(300);
  await p.evaluate(() => { EX.ans[0] = { strict: 'x', text: EX.items[0].model }; exSave(); renderExam(); }); await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2000);
  await p.evaluate(() => go('progress')); await p.waitForTimeout(3000);
  console.log('READY:', (await p.evaluate(() => ($('#n23-ready') || {}).innerText || 'MISSING')).replace(/\n+/g, ' | ').slice(0, 1500));
  await (await p.$('#n23-ready')).screenshot({ path: SP + 'ready.png' });
  // Report: markdown in parallel
  const md = await p.evaluate(() => { let got = null; const _s = saveFile; window.saveFile = async (n, d) => { if (/\.md$/.test(n)) got = [n, d]; }; const r = new Report('Weekly report: test'); r.h2('Section'); r.text('Hebrew וַיִּשְׁתַּחוּ text'); r.table(['A', 'B'], [['1', 'שָׁמַר']]); r.bullets(['one']); r.pdf(); return new Promise(res => setTimeout(async () => { window.saveFile = _s; res(got ? got[0] + ' :: ' + (await got[1].text()) : 'NO MD'); }, 900)); });
  console.log('MD:', md.replace(/\n/g, ' ⏎ '));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
