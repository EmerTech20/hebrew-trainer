const { chromium } = require('playwright'); const fs = require('fs');
const L = (...a) => console.log(...a);
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', acceptDownloads: true, viewport: { width: 1000, height: 1300 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { errs.push('DIALOG'); d.dismiss(); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const up = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-24.json', 'utf8'));
  // legacy one-face progress present (simulate earlier use)
  await p.evaluate(async d => { await importDocs(d); await HET.write('ruthvq/progress', { v: 1, n: 3, w: { 'r1-001': { s: 1, ok: 1, bad: 0 }, 'r1-002': { s: 2, ok: 0, bad: 2 } } }); }, up.docs);
  await p.reload(); await p.waitForTimeout(3000);
  const T = async (w, f) => p.evaluate(([w, f]) => { const it = rvqBank().items.find(x => x.hebrew === w); return f(it); }, [w, f]);
  // T7: options for all items
  L('T7', await p.evaluate(() => { const bad = []; for (const it of rvqBank().items) { for (let k = 0; k < 3; k++) { const F = rvqFields(it); for (const f of F) { const o = rvqFieldOpts(it, f); const vals = o.map(x => x[0]), labs = o.map(x => x[1]);
      const rightIn = f.k === 'shoresh' ? vals.includes(f.right) : vals.includes(f.right);
      if (!rightIn || new Set(labs).size !== labs.length || labs.some(l => /[A-Za-z]/.test(l) || !l || /undefined/.test(l))) { bad.push(it.id + ' ' + f.k + ' ' + labs.join('/') + ' right=' + f.right); } }
      if (!F.length) bad.push(it.id + ' NO FIELDS'); } } return { n: rvqBank().items.length, bad: [...new Set(bad)].slice(0, 12), nbad: new Set(bad).size }; }));
  L('fields stats', await p.evaluate(() => { const c = {}; rvqBank().items.forEach(it => rvqFields(it).forEach(f => c[f.k] = (c[f.k] || 0) + 1)); return c; }));
  for (const w of ['וַתֹּאמֶר', 'שׁוּבִי', 'מִהְיוֹת', 'לְבִלְתִּי', 'הַשָּׁבָה', 'אִישָׁהּ', 'לְעָזְבֵךְ', 'הֱשִׁיבַנִי'])
    L('F', w, JSON.stringify(await p.evaluate(w => { const it = rvqBank().items.find(x => x.hebrew === w); return rvqFields(it).map(f => [f.k, f.right, rvqFieldOpts(it, f).map(x => x[1]).join('/')]); }, w)));
  // Session: force first item = וַתֹּאמֶר
  await p.evaluate(() => { const it = rvqBank().items.find(x => x.hebrew === 'וַתֹּאמֶר'); startSession({ title: 't', items: [{ ...it, kind: 'rvq', key: 'x' }, ...rvqPick(12).map(x => ({ ...x, kind: 'rvq' }))], noVary: true, mode: 'practice' }); });
  await p.waitForTimeout(500);
  const f1 = await p.evaluate(() => document.querySelector('#v-session .qbox').innerText);
  L('T1 face1:', f1.replace(/\s+/g, ' ').slice(0, 250), '| leak?', /✓|✗|Right|קַל|וַיִּקְטֹל|wayyiqtol/i.test(f1));
  const wrong = await p.evaluate(() => SES.items[0]._opts.findIndex(o => !o.ok)); await p.click(`[data-rq="${wrong}"]`); await p.waitForTimeout(400);
  const f2 = await p.evaluate(() => document.querySelector('#v-session .qbox').innerText);
  L('T2 face2:', f2.replace(/\s+/g, ' ').slice(0, 420), '| leak?', /✓|✗|Right answer|and she said/i.test(f2), '| submit disabled', await p.evaluate(() => $('#rvq-sub').disabled), '| english in buttons', await p.evaluate(() => $$('.rvq-f').some(b => /[A-Za-z]/.test(b.textContent))), '| preselected', await p.evaluate(() => $$('.rvq-f[aria-pressed="true"]').length));
  await p.screenshot({ path: '/home/claude/rvq/f2.png', fullPage: true });
  // T3: three wrong fields: guf wrong, binyan wrong, shoresh wrong; others right
  await p.evaluate(() => { const it = SES.items[0]; const want = { guf: '1', migdar: 'F', mispar: 'S', binyan: 'piel', netiyyah: 'wayyiqtol' }; for (const [k, v] of Object.entries(want)) { $(`.rvq-f[data-f="${k}"][data-v="${v}"]`).click(); } const f = it._fields.find(f => f.k === 'shoresh'); const w = f._opts.find(x => x[0] !== f.right); $(`.rvq-f[data-f="shoresh"][data-v="${w[0]}"]`).click(); });
  await p.waitForTimeout(300);
  // T4 continuity: reload mid face 2 → resume keeps selections
  const before = await p.evaluate(() => JSON.stringify(SES.items[0]._st.sel));
  await p.reload(); await p.waitForTimeout(3000); await p.evaluate(() => go('cards')); await p.waitForTimeout(2500);
  L('T4 resume button:', await p.evaluate(() => !!document.querySelector('[data-rvq="15,resume"]')));
  await p.click('[data-rvq="15,resume"]'); await p.waitForTimeout(500);
  L('T4 restored:', await p.evaluate(() => [SES.items[0].hebrew, SES.items[0]._st.face, JSON.stringify(SES.items[0]._st.sel)]), 'before', before);
  await p.click('#rvq-sub'); await p.waitForTimeout(500);
  const f3 = await p.evaluate(() => document.querySelector('#v-session .qbox').innerText);
  L('T3 face3:', f3.replace(/\s+/g, ' ').slice(0, 900));
  L('T3 res', await p.evaluate(() => JSON.stringify(SES.items[0]._st.res)), await p.evaluate(() => JSON.stringify(RVQ.P.w[SES.items[0].id])));
  await p.screenshot({ path: '/home/claude/rvq/f3.png', fullPage: true });
  // next: correct both, 6/6
  await p.click('#b-next'); await p.waitForTimeout(300);
  await p.evaluate(() => { const it = SES.items[SES.i]; $(`[data-rq="${it._opts.findIndex(o => o.ok)}"]`).click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const it = SES.items[SES.i]; for (const f of it._fields) { const v = f.k === 'shoresh' ? f._opts.find(x => x[0] === f.right)[0] : f.right; $(`.rvq-f[data-f="${f.k}"][data-v="${CSS.escape(v)}"]`).click(); } $('#rvq-sub').click(); });
  await p.waitForTimeout(400);
  L('T4 6/6:', await p.evaluate(() => { const it = SES.items[SES.i]; return [it.hebrew, it.type, it._st.vok, it._st.nOk, it._fields.length]; }));
  // idk branch
  await p.click('#b-next'); await p.waitForTimeout(300); await p.click('#rvq-idk1'); await p.waitForTimeout(200); await p.click('#rvq-idk2'); await p.waitForTimeout(300);
  L('T4 idk:', await p.evaluate(() => { const it = SES.items[SES.i]; return [it._st.vok, it._st.nOk, it._fields.length, document.querySelector('#v-session .qbox').innerText.includes('counted as missed')]; }));
  // events
  L('events', JSON.stringify(await p.evaluate(() => MEAS.all.slice(-6).map(e => [e.k, e.t, e.s, e.f, e.exp]))));
  // T8 schedule: a missed word reappears after >=8 others
  L('T8 inserted', await p.evaluate(() => SES.items.map((x, i) => x.again ? i + ':' + x.hebrew : null).filter(Boolean)));
  L('T9 legacy untouched', await p.evaluate(() => JSON.stringify(HET.live('ruthvq/progress'))), 'new has r1-002?', await p.evaluate(() => !!RVQ.P.w['r1-002']));
  await p.evaluate(() => go('cards')); await p.waitForTimeout(2500);
  L('panel', await p.evaluate(() => document.getElementById('rvq-panel').innerText.slice(0, 900)));
  // export/reimport
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#rvq-exp')]); const fp = '/home/claude/rvq/exp.json'; await dl.saveAs(fp);
  const n0 = await p.evaluate(() => RVQ.P.n); await p.evaluate(() => { RVQ.P = { v: 3, n: 0, w: {} }; }); await p.setInputFiles('#rvq-imp', fp); await p.waitForTimeout(1500);
  L('T9 reimport n', n0, await p.evaluate(() => RVQ.P.n), await p.evaluate(() => $('#rvq-msg') && $('#rvq-msg').textContent));
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => startRVQ(15)); await p.waitForTimeout(400); await p.click('[data-rq="0"]'); await p.waitForTimeout(300);
  L('phone overflow', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)); await p.screenshot({ path: '/home/claude/rvq/f2phone.png', fullPage: true });
  L('errs', errs.slice(0, 6)); await b.close(); })();
