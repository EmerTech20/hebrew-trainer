const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 820, height: 1100 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { S.prog.flags.noImport = 1; startExam('final'); }); await p.waitForTimeout(1200);
  await p.click('#ex-go'); await p.waitForTimeout(400);
  // go to the memory item and a comp item and look at them
  const idx = await p.evaluate(() => ({ mem: EX.items.findIndex(x => x.sub === 'memory'), comp: EX.items.findIndex(x => x.sub === 'comp'), parse: EX.items.findIndex(x => x.kind === 'parse') }));
  console.log(idx);
  for (const k of ['comp', 'parse', 'mem']) { await p.evaluate(i => { EX.cur = i; renderExam(); }, idx[k]); await p.waitForTimeout(250); console.log(k.toUpperCase() + ':', (await p.innerText('#v-session')).slice(0, 500).replace(/\n+/g, ' | ')); }
  await p.screenshot({ path: '/home/claude/tests/exmem.png', fullPage: true });
  // type in the memory item with on-screen keys + fill
  await p.evaluate(() => { const it = EX.items[EX.cur]; const words = it.model.split(/\s+/); const t = document.querySelector('textarea.ex-txt'); t.value = words.slice(0, Math.ceil(words.length * .6)).join(' '); t.dispatchEvent(new Event('input', { bubbles: true })); });
  // answer a few others
  await p.evaluate(() => { EX.items.forEach((it, i) => { if (it.kind === 'parse' && i % 2) { const a = parsePGN(String(it.pgn).split('|')[0]); EX.ans[i] = { p: a.p || '-', g: a.g || '-', n: a.n || '-', conj: it.conj, stem: String(it.stem).split('|')[0], root: it.root }; } if (it.kind === 'mc') EX.ans[i] = { o: it.a }; if (it.sub === 'comp') EX.ans[i] = { text: 'בֹּעַז' }; }); exSave(); });
  await p.evaluate(() => submitExam()); await p.waitForTimeout(1500);
  console.log('AFTER SUBMIT:', (await p.innerText('#v-session')).slice(0, 700).replace(/\n+/g, ' | '));
  // self-score everything as wrong/0 then finish
  const hasSelf = await p.evaluate(() => !!document.querySelector('[data-ss]')); console.log('selfscore', hasSelf);
  if (hasSelf) { await p.evaluate(() => { document.querySelectorAll('[data-ss] input[type=radio]').forEach(r => { if (r.value === '0.5' || r.value === '.5') r.checked = true; }); }); const btn = await p.evaluate(() => [...document.querySelectorAll('#v-session button')].map(b => b.id + ':' + b.innerText)); console.log(btn); await p.evaluate(() => { const b = [...document.querySelectorAll('#v-session button')].find(b => /done|save|finish|score/i.test(b.innerText)); b && b.click(); }); await p.waitForTimeout(1500); }
  console.log('RESULT:', (await p.innerText('#v-session')).slice(0, 900).replace(/\n+/g, ' | '));
  console.log('ASSESS:', await p.evaluate(() => JSON.stringify((S.assess || []).slice(-1).map(a => ({ type: a.type, indep: a.indep, all: a.all, sections: a.sections, mem: a.items.filter(x => x.sub === 'memory').map(x => [x.score, x.fb]) })))));
  await p.screenshot({ path: '/home/claude/tests/exres.png', fullPage: true });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
