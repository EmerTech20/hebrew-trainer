const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
const DAY = process.argv[2] || '2026-11-21';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(d => { const D = Date; const t0 = new D(d + 'T20:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; }, DAY);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8')); console.log('import', await p.evaluate(async d => importDocs(d), upd.docs)); await p.reload(); await p.waitForTimeout(3000);
  await p.evaluate(() => lexLoad());
  for (const k of ['fs1','fs2','fs3','fs4','fs5','fs6','fs7','fs8','fs9']) {
    const r = await p.evaluate(async k => { const ex = await buildFS(k); const bad = []; const n = { parse: 0, comp: 0, translation: 0, syntax: 0 }; ex.items.forEach(it => { n[it.sec] = (n[it.sec] || 0) + 1; if (it.kind === 'parse') { const c = lexCheckParse({ form: it.form, stem: it.stem, conj: it.conj, pgn: String(it.pgn).split('|')[0] }); if (c && c.ok === false) bad.push(it.form + ' ' + (c.why || JSON.stringify(c)).slice(0, 120)); if (!it.ctx) bad.push('NOCTX ' + it.form); } if (it.sec === 'comp' && !it.ln) bad.push('NOLN ' + it.q); }); return `${k} ${ex.fsName} | ${JSON.stringify(n)} | vocab: ${ex.passage.ruth.vocab.slice(0, 60)}\n   ${bad.join('\n   ') || 'all verbs agree with the lexicon'}`; }, k);
    console.log(r);
  }
  console.log('PLAN', DAY, await p.evaluate(() => rescueBlocks().map(b => `${b.id}: ${b.title}`).join(' | ')));
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(1500);
  const card = await p.$('#fs-card'); if (card) await card.screenshot({ path: SP + 'fscard9.png' });
  console.log('card rows', await p.evaluate(() => document.querySelectorAll('#fs-card [data-fs]').length), 'r6', await p.evaluate(() => document.querySelectorAll('#fs-card [data-r6]').length));
  // start sim 5 and look at the intro + first item
  await p.evaluate(() => startFS('fs5')); await p.waitForTimeout(2500);
  console.log('INTRO', (await p.innerText('#v-session')).slice(0, 300).replace(/\n+/g, ' | '));
  await p.evaluate(() => { const b = [...document.querySelectorAll('#v-session button')].find(x => /Start/.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(1500);
  console.log('ITEM1', (await p.innerText('#v-session')).slice(0, 400).replace(/\n+/g, ' | '));
  await p.evaluate(() => { EX = null; try { exSave(); } catch {} });
  // Ruth 6 block
  await p.evaluate(() => startRuth6([2, 14, 19])); await p.waitForTimeout(1200);
  console.log('R6', (await p.innerText('#v-session')).slice(0, 300).replace(/\n+/g, ' | '));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
