const { chromium } = require('playwright'); const fs = require('fs');
const L = (...a) => console.log(...a);
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', acceptDownloads: true, viewport: { width: 1100, height: 1300 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('DIALOG ' + d.message()); d.dismiss(); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  // 1. before import
  await p.evaluate(() => go('cards')); await p.waitForTimeout(2500);
  L('1 off-panel:', await p.evaluate(() => { const x = document.getElementById('rvq-panel'); return x ? x.innerText.slice(0, 120) : 'MISSING'; }));
  // import
  const up = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-24.json', 'utf8'));
  L('imported', await p.evaluate(async d => importDocs(d), up.docs));
  await p.reload(); await p.waitForTimeout(3000); await p.evaluate(() => go('cards')); await p.waitForTimeout(3000);
  L('2 panel:', await p.evaluate(() => document.getElementById('rvq-panel').innerText.slice(0, 600)));
  // 7. options for every item
  L('7 options:', await p.evaluate(() => { const B = rvqBank(); let bad = []; for (const it of B.items) for (let k = 0; k < 5; k++) { const o = rvqOptions(it); const t = o.map(x => x.o); if (o.length !== 4 || new Set(t).size !== 4 || o.filter(x => x.ok).length !== 1) { bad.push(it.id + ':' + t.join('/')); break; } } return { n: B.items.length, bad: bad.slice(0, 5), nbad: bad.length }; }));
  L('7b morph options:', await p.evaluate(() => { const B = rvqBank(); let bad = []; for (const it of B.items.filter(x => x.type === 'verb' && x.dbok)) { const o = rvqParseOpts(it); const t = o.map(x => x.o); if (o.length !== 4 || new Set(t).size !== 4 || /undefined/.test(t.join())) bad.push(it.id + ':' + t.join(' / ')); } return { bad: bad.slice(0, 4), nbad: bad.length, ex: rvqParseOpts(B.items.find(x => x.hebrew === 'נָשׁוּב')).map(x => x.o) }; }));
  // backs: no undefined; specific
  L('backs undefined:', await p.evaluate(() => rvqBank().items.filter(it => /undefined|NaN|\[object/.test(rvqBackHTML(it))).map(x => x.id)));
  for (const w of ['לְעָזְבֵךְ', 'תְּשַׂבֵּרְנָה', 'לְבִלְתִּי', 'נָשׁוּב', 'אִתָּךְ', 'הֵמַר', 'וַתַּעֲמוֹד', 'הַקֹּצְרִים'])
    L('back', w, (await p.evaluate(w => { const it = rvqBank().items.find(x => x.hebrew === w); const d = document.createElement('div'); d.innerHTML = rvqBackHTML(it); return d.innerText.replace(/\s+/g, ' '); }, w)).slice(0, 700));
  // 6. spacing
  L('6 spacing:', await p.evaluate(() => { const s = rvqPick(60); const ids = s.map(x => x.id); let viol = 0; ids.forEach((id, i) => { const j = ids.indexOf(id, i + 1); if (j > 0 && j - i < 9) viol++; }); return { n: ids.length, distinct: new Set(ids).size, viol, first: s.slice(0, 5).map(x => x.hebrew + ' ' + x.priority) }; }));
  // 3. session
  await p.click('[data-rvq="15"]'); await p.waitForTimeout(800);
  L('3 card:', await p.evaluate(() => document.querySelector('#v-session .qbox').innerText.replace(/\s+/g, ' ').slice(0, 300)));
  await p.screenshot({ path: '/home/claude/rvq/s1.png' });
  // answer wrong
  const wrongIdx = await p.evaluate(() => SES.items[SES.i]._opts.findIndex(o => !o.ok));
  const id0 = await p.evaluate(() => SES.items[SES.i].id);
  await p.click(`[data-rq="${wrongIdx}"]`); await p.waitForTimeout(500);
  L('3 after wrong:', await p.evaluate(() => ({ right: document.querySelectorAll('.opt.right').length, wrong: document.querySelectorAll('.opt.wrong').length, back: !document.getElementById('rvq-back').hidden, len: SES.items.length, ins: SES.items.slice(1).findIndex(x => x.id === SES.items[0].id) + 1, rec: RVQ.P.w[SES.items[0].id], n: RVQ.P.n })));
  await p.screenshot({ path: '/home/claude/rvq/s2.png', fullPage: true });
  // answer next 3 right via keyboard
  for (let k = 0; k < 3; k++) { await p.click('#b-next'); await p.waitForTimeout(300); const r = await p.evaluate(() => SES.items[SES.i]._opts.findIndex(o => o.ok)); await p.keyboard.press(String(r + 1)); await p.waitForTimeout(300); }
  L('keys:', await p.evaluate(() => ({ i: SES.i, res: SES.results.map(r => r.score), n: RVQ.P.n })));
  await p.waitForTimeout(1600); L('warn:', await p.evaluate(() => RVQ.warn));
  // 5. reload persists
  await p.reload(); await p.waitForTimeout(3000);
  L('5 persisted:', await p.evaluate((id) => { rvqLoad(); return { n: RVQ.P.n, rec: RVQ.P.w[id] }; }, id0));
  const evs = await p.evaluate(() => (MEAS.all || []).filter(e => /Meaning of/.test(e.q || '')).map(e => [e.k, e.s, e.exp, e.ans]).slice(-2)); L('events', JSON.stringify(evs));
  // morph session
  await p.evaluate(() => { RVQ.opts.mode = 'morph'; startRVQ(15); }); await p.waitForTimeout(600);
  L('morph card:', await p.evaluate(() => document.querySelector('#v-session .qbox').innerText.replace(/\s+/g, ' ').slice(0, 300)));
  await p.evaluate(() => { RVQ.opts.mode = 'mean'; go('practice'); }); await p.waitForTimeout(500);
  // final rescue card
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(2500);
  L('9 rescue:', await p.evaluate(() => { const b = document.querySelector('[data-rvqgo]'); return b ? b.closest('.step').innerText.replace(/\s+/g, ' ') : 'MISSING'; }));
  // export
  await p.evaluate(() => go('cards')); await p.waitForTimeout(2500);
  try { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), p.click('#rvq-exp')]); L('10 export', dl.suggestedFilename()); } catch (e) { L('export fail', e.message.slice(0, 100)); }
  // reset needs two clicks
  await p.click('#rvq-reset'); L('reset armed, n=', await p.evaluate(() => RVQ.P.n));
  // phone
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => startRVQ(15)); await p.waitForTimeout(600); await p.click('[data-rq="0"]'); await p.waitForTimeout(300);
  L('phone overflow:', await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)); await p.screenshot({ path: '/home/claude/rvq/s3.png', fullPage: true });
  L('errs', errs.slice(0, 6)); await b.close(); })();
