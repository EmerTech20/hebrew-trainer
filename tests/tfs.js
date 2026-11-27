const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
const DAY = process.argv[2] || '2026-11-20';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(d => { const D = Date; const t0 = new D(d + 'T09:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; }, DAY);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-18.json', 'utf8')); console.log('import', await p.evaluate(async d => importDocs(d), upd.docs)); await p.reload(); await p.waitForTimeout(2500);
  await p.evaluate(() => lexLoad());
  for (const k of ['fs1', 'fs2', 'fs3', 'sp14', 'sp15', 'sp16', 'sp17', 'sp18', 'sp22']) {
    const r = await p.evaluate(async k => { const ex = k.startsWith('sp') ? await buildSP(+k.slice(2)) : await buildFS(k); const bad = []; ex.items.forEach(it => { if (it.kind === 'parse') { const c = lexCheckParse({ form: it.form, stem: it.stem, conj: it.conj, pgn: String(it.pgn).split('|')[0] }); if (c && c.ok === false) bad.push(it.form + ' ' + (c.why || JSON.stringify(c)).slice(0, 90)); if (!it.ctx) bad.push('NOCTX ' + it.form); if (!it.ln) bad.push('NOLN ' + it.form); } if (it.sub === 'translate2' && !it.model) bad.push('NOEN'); if ((it.sec === 'comp' || it.sec === 'syntax') && !it.model) bad.push('NOMODEL'); if (it.sec === 'comp' && !it.ln) bad.push('NOLN q'); }); const c = {}; ex.items.forEach(x => c[x.sec] = (c[x.sec] || 0) + 1); return JSON.stringify(c) + ' n=' + ex.items.length + ' story ' + ex.passage.story.lines.length + ' | ' + (bad.join(' ; ') || 'all checks ok'); }, k);
    console.log(k, r);
  }
  // full run of fs2 in the browser
  await p.evaluate(() => startFS('fs2')); await p.waitForTimeout(1500);
  console.log('intro', await p.evaluate(() => $('#v-session').innerText.replace(/\s+/g, ' ').slice(0, 700)));
  await p.screenshot({ path: SP + 'fs-intro.png' });
  await p.evaluate(() => $('#ex-go').click()); await p.waitForTimeout(600);
  await p.screenshot({ path: SP + 'fs-q1.png' });
  const goto = async i => { await p.evaluate(i => $(`[data-xi="${i}"]`).click(), i); await p.waitForTimeout(400); };
  const info = () => p.evaluate(() => { const it = EX.items[EX.cur], hl = $$('.fs-hl'), box = $('.fs-box'); return `#${EX.cur + 1} ${it.sec}/${it.kind} hl=${hl.length} ${hl[0] ? hl[0].innerText.slice(0, 30) : ''} scroll=${box ? box.scrollTop : '-'} ruth=${!!$$('summary').find(s => /^Ruth/.test(s.textContent))} label=${($('#v-session label.f') || {}).innerText ? $('#v-session label.f').innerText.slice(0, 40) : ''}`; });
  for (const i of [5, 20, 30]) { await goto(i); console.log(await info()); }
  await p.screenshot({ path: SP + 'fs-mid.png' });
  await goto(36); console.log(await info()); await p.screenshot({ path: SP + 'fs-tr.png' });
  await goto(43); console.log(await info()); await p.screenshot({ path: SP + 'fs-syn.png' });
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (it.kind === 'parse') { const g = it.pgn.split('|')[0]; EX.ans[i] = { p: g[0] || '', g: g[1] || '', n: g[2] || '', conj: it.conj, stem: it.stem, root: it.root }; if (it.conj === 'ptc') EX.ans[i] = { p: '-', g: g[0], n: g[1], conj: 'ptc', stem: it.stem, root: it.root }; if (it.conj === 'inf') EX.ans[i] = { p: '-', g: '-', n: '-', conj: 'inf', stem: it.stem, root: it.root }; } if (it.kind === 'write' && i % 2) EX.ans[i] = { text: 'test', strict: 'x' }; }); exSave(); submitExam(); }); await p.waitForTimeout(1500);
  console.log('phase', await p.evaluate(() => EX && EX.phase), await p.evaluate(() => ($('#v-session h2') || {}).textContent));
  await p.evaluate(() => { $$('input[type=radio][value="1"]').forEach(x => x.checked = true); $$('[data-c]').forEach(x => x.checked = true); const g = $('#ss-go'); g && g.click(); }); await p.waitForTimeout(2000);
  console.log('record', await p.evaluate(() => (S.assess || []).map(a => a.type + ':' + a.total + ' ' + JSON.stringify(a.sections)).join(' | ')));
  await p.screenshot({ path: SP + 'fs-review.png' });
  await p.evaluate(() => { go('rescue'); }); await p.waitForTimeout(600);
  console.log('card', await p.evaluate(() => ($('#fs-card') || {}).innerText.replace(/\s+/g, ' ').slice(0, 900)));
  const card = await p.$('#fs-card'); if (card) await card.screenshot({ path: SP + 'fs-card.png' });
  console.log('plan', await p.evaluate(() => planBlocks().map(b => b.id + ':' + b.min + ':' + b.title.slice(0, 50)).join(' | ')));
  console.log('lessons', await p.evaluate(() => RL.exam.html().length + ' ' + RL.stems.html().length + ' ' + /Pual or Hophal/.test(RL.stems.html())));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
