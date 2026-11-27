const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(() => { const D = Date; const t0 = new D('2026-11-18T14:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-17.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs); await p.reload(); await p.waitForTimeout(2500);
  for (const k of ['sim1', 'sim2', 'sim3']) {
    const r = await p.evaluate(async k => { const ex = await buildSim(k); const bad = []; ex.items.forEach(it => { if (it.kind === 'parse') { const c = lexCheckParse({ form: it.form, stem: it.stem, conj: it.conj, pgn: String(it.pgn).split('|')[0] }); if (c && c.ok === false) bad.push(it.form + ' ' + (c.why || JSON.stringify(c)).slice(0, 80)); if (!it.ctx) bad.push('NOCTX ' + it.form); } if (it.sub === 'translate2' && !it.model) bad.push('NOEN ' + it.he.slice(0, 20)); if (it.sec === 'comp' && !it.model) bad.push('NOMODEL'); }); const c = {}; ex.items.forEach(x => c[x.sec] = (c[x.sec] || 0) + 1); return JSON.stringify(c) + ' lines ' + ex.passage.verses.length + ' | ' + (bad.join(' ; ') || 'all checks ok'); }, k);
    console.log(k, r);
  }
  await p.evaluate(() => lexLoad());
  await p.evaluate(() => startSim('sim2')); await p.waitForTimeout(1500);
  await p.evaluate(() => $('#ex-go').click()); await p.waitForTimeout(600);
  await p.screenshot({ path: SP + 'sim-q1.png' });
  await p.evaluate(() => { $('#ex-next').click(); }); await p.waitForTimeout(500);
  await p.screenshot({ path: SP + 'sim-q2.png' });
  // answer everything quickly with the right parse / mc, blank writes, submit
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (it.kind === 'mc') EX.ans[i] = { o: it.a }; if (it.kind === 'parse') { const g = it.pgn.split('|')[0]; EX.ans[i] = { p: g[0] || '', g: g[1] || '', n: g[2] || '', conj: it.conj, stem: it.stem, root: it.root }; if (it.conj === 'ptc') EX.ans[i] = { p: '', g: g[0], n: g[1], conj: 'ptc', stem: it.stem, root: it.root }; } if (it.kind === 'write') EX.ans[i] = { text: 'test', strict: 'x' }; }); exSave(); submitExam(); }); await p.waitForTimeout(1500);
  await p.screenshot({ path: SP + 'sim-self.png' });
  console.log('phase', await p.evaluate(() => EX && EX.phase), await p.evaluate(() => ($('#v-session h2') || {}).textContent));
  await p.evaluate(() => { $$('input[type=radio][value="1"]').forEach(x => x.checked = true); $$('[data-c]').forEach(x => x.checked = true); const g = $('#ss-go'); g && g.click(); }); await p.waitForTimeout(2000);
  console.log('after', await p.evaluate(() => (S.assess || []).map(a => a.type + ':' + a.total).join(' ')));
  await p.evaluate(() => { S.tab = 'rescue'; go('rescue'); }); await p.waitForTimeout(500);
  console.log('card', await p.evaluate(() => ($('#sim-card') || {}).innerText.replace(/\s+/g, ' ').slice(0, 400)));
  console.log('plan', await p.evaluate(() => planBlocks().map(b => b.id + ':' + b.title.slice(0, 40)).join(' | ')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
