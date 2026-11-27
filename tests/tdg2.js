const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/t22/';
const R0 = Date.now();
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 900, height: 1200 } });
  await ctx.addInitScript(([t, r]) => { const D = Date; const off = t - r; class MD extends D { constructor(...a) { if (!a.length) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } } window.Date = MD; }, [new Date('2026-11-23T21:30:00').getTime(), R0]);
  const p = await ctx.newPage(); const errs = []; p.on('dialog', d => d.accept()); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(3000);
  const L = (k, s) => console.log('== ' + k + ': ' + String(s).replace(/\n+/g, ' | ').slice(0, 1600));
  await p.evaluate(() => go('today')); await p.waitForTimeout(500);
  L('PLAN', await p.evaluate(() => $('#plan-card').innerText));
  // Diagnostic 1 with midpoint
  await p.evaluate(() => startDG1()); await p.waitForTimeout(1200); await p.click('#ex-go'); await p.waitForTimeout(500);
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (i % 2) EX.ans[i] = { p: it.conj === 'inf' ? '' : '3', g: 'm', n: 's', conj: it.conj, stem: i > 9 ? 'qal' : it.stem, root: it.root, mean: it.gloss }; }); EX.cur = 9; exSave(); renderExam(); });
  await p.click('#ex-next'); await p.waitForTimeout(500); L('MIDPOINT', await p.innerText('#v-session'));
  await p.click('#dg-partb'); await p.waitForTimeout(400); L('PART B', (await p.innerText('#v-session')).slice(0, 120));
  await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2500);
  // retest
  await p.evaluate(() => startDGR()); await p.waitForTimeout(1500);
  L('RETEST', await p.evaluate(() => EX.type + ' ' + EX.items.length + ' items: ' + EX.items.map(x => `${x.form} ${x.stem} ${x.conj} ${x.pgn} [${x.ref}]`).join(' ; ')));
  await p.click('#ex-go'); await p.waitForTimeout(500); L('RETEST ITEM', (await p.innerText('#v-session')).slice(0, 200));
  await p.evaluate(() => { EX = null; lsSet('exam', null); });
  // GPT version
  await p.evaluate(() => startDG1G()); await p.waitForTimeout(1200); L('GPT INTRO', (await p.innerText('#v-session')).slice(0, 500));
  await p.evaluate(() => { EX = null; lsSet('exam', null); });
  // Diagnostic 2
  await p.evaluate(() => startDQ1()); await p.waitForTimeout(1200); L('DQ INTRO', (await p.innerText('#v-session')).slice(0, 900));
  await p.click('#ex-go'); await p.waitForTimeout(500); await p.screenshot({ path: SP + 'dq_item.png' });
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (i < 15) { EX.ans[i] = { o: i % 4 ? it.a : (it.a + 1) % 11, mean: i % 3 ? it.qe : 'something else' }; EX.ms[i] = (8 + i * 2) * 1000; } }); exSave(); renderExam(); });
  await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2500);
  L('DQ ANALYSIS', await p.evaluate(() => { const h = [...$$('#v-session h2')].find(x => /Diagnostic 2/.test(x.textContent)); return h ? h.parentElement.innerText : 'MISSING'; }));
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(800);
  L('CARDS', await p.evaluate(() => [...$$('#fs-card .plan > .step')].slice(0, 6).map(s => s.innerText).join(' || ')));
  await (await p.$('#fs-card .plan')).screenshot({ path: SP + 'dg_cards.png' });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
