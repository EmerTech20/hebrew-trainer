// Full runtime audit (no changes to the app): tabs, layout, keys, every exam builder, key-in scoring, storage size.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/audit/';
fs.mkdirSync(OUT, { recursive: true });
const U21 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
const U23 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-23.json', 'utf8'));
const R0 = Date.now();
const res = { tabs: {}, mobile: {}, banks: {}, exams: {}, mc: {}, storage: {}, errors: [] };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(([t, r]) => { const D = Date; const off = t - r; class MD extends D { constructor(...a) { if (!a.length) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } } window.Date = MD; }, [new Date('2026-11-24T09:00:00').getTime(), R0]);
  const p = await ctx.newPage(); p.on('dialog', d => d.accept());
  p.on('pageerror', e => res.errors.push('pageerror: ' + e.message + ' @ ' + ((e.stack || '').split('\n')[1] || '').trim()));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|fonts\.g/.test(m.text())) res.errors.push('console: ' + m.text().slice(0, 200)); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(3000);
  await p.evaluate(async ([a, c]) => { await importDocs(a.docs); await importDocs(c.docs); }, [U21, U23]); await p.waitForTimeout(800);
  const bad = t => t.split('\n').filter(l => /\bundefined\b|\bNaN\b|\[object /.test(l)).slice(0, 5);
  const TABS = ['today', 'rescue', 'cards', 'practice', 'read', 'progress', 'prep', 'library', 'settings'];
  for (const t of TABS) {
    try { await p.evaluate(t => go(t), t); await p.waitForTimeout(t === 'progress' ? 3500 : 1200);
      const txt = await p.evaluate(t => { const v = document.querySelector('#v-' + t) || document.querySelector('section.view:not([hidden])'); return v ? v.innerText : document.body.innerText; }, t);
      res.tabs[t] = { chars: txt.length, bad: bad(txt), overflowX: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), buttons: await p.evaluate(() => [...document.querySelectorAll('section.view:not([hidden]) button')].length) };
    } catch (e) { res.tabs[t] = { error: String(e).slice(0, 200) }; }
  }
  // Answer-key self-consistency: every key, entered as the answer, must score 6/6.
  res.banks = await p.evaluate(async () => {
    const out = {}; const fin = s => String(s || '').replace(/[כמנפצ]$/, c => ({ 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' }[c]));
    const check = (name, list) => { let n = 0, okN = 0; const fails = [], badStem = [], badPgn = [];
      for (const it of list) { if (!it || !it.form || !it.conj) continue; n++;
        const pg = parsePGN(String(it.pgn || '').split('|')[0] || ''); const inf = it.conj === 'inf', ptc = it.conj === 'ptc';
        const sel = { p: inf || ptc ? '-' : pg.p, g: inf ? '-' : pg.g, n: inf ? '-' : pg.n, conj: it.conj, stem: String(it.stem).split('|')[0], root: String(it.root).split('|')[0] };
        const g = gradeParse(it, sel); if (g.score >= .999) okN++; else fails.push(`${it.form} [${it.stem} ${it.conj} ${it.pgn} ${it.root}] → ${Math.round(g.score * 6)}/6 ${Object.entries(g.res).filter(([, v]) => !v).map(([k]) => k).join(',')}`);
        if (!STEMS[String(it.stem).split('|')[0]]) badStem.push(it.form + ' ' + it.stem);
        if (!pgnOK(it.conj, String(it.pgn || '').split('|')[0])) badPgn.push(`${it.form} ${it.conj} "${it.pgn}"`);
      }
      out[name] = { n, ok: okN, fails: fails.slice(0, 12), nFails: fails.length, badStem: badStem.slice(0, 8), badPgn: badPgn.slice(0, 8), nBadPgn: badPgn.length };
    };
    const T = (form, root, stem, conj, pgn, alts) => ({ form, root, stem, conj, pgn, ...(alts ? { alts } : {}) });
    check('Ruth verbs (RUTH.verbs)', RUTH.verbs.map(v => T(v[0], v[1], v[2], v[3], v[4])));
    check('Practice verb bank (PRACTICE_VERBS)', PRACTICE_VERBS.map(v => T(v[0], v[1], v[2], v[3], v[4])));
    check('Parse bank (PARSE_BANK)', (PARSE_BANK || []).map(x => Array.isArray(x) ? T(x[0], x[1], x[2], x[3], x[4]) : T(x.form, x.root, x.stem, x.conj, x.pgn, x.alts)));
    check('Professor review slides', REVIEW_SLIDES.map(v => T(v[0], v[1], v[2], v[3], v[4], v[6])));
    check('Diagnostic 1 (DG1)', DG1.map(d => T(d[1], d[2], d[3], d[4], d[5], d[8])));
    check('Diagnostic 1 GPT version (DG1G)', DG1G.map(d => T(d[1], d[2], d[3], d[4], d[5], d[8])));
    check('Repair rounds (RP_DEF)', [...RP_DEF.rp1, ...RP_DEF.rp2].map(d => ({ ...T(d[1], d[2], d[3], d[4], d[5]), strictNA: 1 })));
    const sv = []; for (const ch of STORY_CHS) { const d = await storyDoc(ch); if (d) d.verbs.forEach(v => sv.push(T(v[0], fin(v[1]), v[2], v[3], storyPgn(v[3], v[4])))); }
    check('Class-story verbs (9 stories)', sv);
    const fsv = []; for (const k of ['fs1', 'fs2', 'fs3', 'fs4', 'fs5', 'fs6', 'fs7', 'fs8', 'fs9']) { const D = await fsDef('simdefs/' + k); if (D) D.parse.forEach(x => fsv.push(T(x[0], x[1], x[2], x[3], storyPgn(x[3], x[4]), x[5]))); }
    check('Final simulations 1–9 verbs', fsv);
    return out;
  });
  // Multiple-choice banks: questions with no Hebrew at all; answer index validity.
  res.mc = await p.evaluate(() => { const names = ['MCQ', 'DAGESH_MC', 'BINYAN_MC', 'FORM_MC', 'PGN_MC', 'PART_MC', 'CONTEXT_MC', 'STRICT_MC', 'ACC_MC', 'P8_MC', 'SUFFIX_ROLE', 'LOOKALIKES', 'PATTERNS', 'COMPQ', 'STORYQ'];
    const o = {}; for (const nm of names) { let A; try { A = eval(nm); } catch { continue; } if (!Array.isArray(A)) continue;
      const qs = A.filter(x => x && typeof x === 'object' && (x.q || x.question));
      const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\$\{[^}]*\}/g, '');
      const noHe = qs.filter(x => !/[א-ת]/.test(strip(x.q || x.question)));
      const badA = qs.filter(x => Array.isArray(x.o) && typeof x.a === 'number' && (x.a < 0 || x.a >= x.o.length));
      o[nm] = { items: A.length, withQ: qs.length, englishOnlyQ: noHe.length, badAnswerIndex: badA.length, sample: noHe.slice(0, 2).map(x => strip(x.q || x.question).slice(0, 90)) }; }
    return o; });
  // Every exam builder: build, start, render first items, key-in all answers, submit; look for cues, undefined, keys that do not score full.
  const EXAMS = [...['fs1', 'fs2', 'fs3', 'fs4', 'fs5', 'fs6', 'fs7', 'fs8', 'fs9'].map(k => [k, `startFS('${k}')`]), ...[14, 15, 16, 17, 18, 22].map(c => ['sp' + c, `startSP(${c})`]),
    ['dg1', 'startDG1()'], ['dg1g', 'startDG1G()'], ['dgr', 'startDGR()'], ['dq1', 'startDQ1()'], ['rp1', "startRP('rp1')"], ['rp2', "startRP('rp2')"], ['sq1', "startSQ('sq1')"], ['sq2', "startSQ('sq2')"], ['rt1', "startRT('rt1')"], ['rt2', "startRT('rt2')"]];
  for (const [k, call] of EXAMS) {
    const r = {}; res.exams[k] = r;
    try {
      await p.evaluate(() => { EX = null; lsSet('exam', null); });
      await p.evaluate(call); await p.waitForTimeout(1800);
      const intro = await p.innerText('#v-session'); r.introBad = bad(intro);
      if (!(await p.$('#ex-go'))) { r.error = 'no start button: ' + intro.slice(0, 160); continue; }
      await p.click('#ex-go'); await p.waitForTimeout(500);
      r.type = await p.evaluate(() => EX.type); r.items = await p.evaluate(() => EX.items.length);
      r.sections = await p.evaluate(() => EX.items.reduce((m, x) => (m[x.sec] = (m[x.sec] || 0) + 1, m), {}));
      // Visit up to 6 items of different kinds and inspect what is shown.
      const seen = await p.evaluate(async () => { const out = []; const kinds = new Set(); for (let i = 0; i < EX.items.length && out.length < 6; i++) { const it = EX.items[i]; const kk = it.kind + (it.sub || ''); if (kinds.has(kk)) continue; kinds.add(kk); EX.cur = i; renderExam(); await new Promise(r => setTimeout(r, 150));
          const q = document.querySelector('.qbox'); const t = q ? q.innerText : '';
          out.push({ i, kind: kk, lineLabel: /\bline \d/.test(t) && !/\(lines? /.test(t) ? true : false, pron: !!(q && q.querySelector('.form-big .pr-i, .form-big + .pr-i')), highlight: !!document.querySelector('.ps-hl, .hl-line, mark'), bad: t.split('\n').filter(l => /\bundefined\b|\bNaN\b/.test(l)).slice(0, 2) }); } return out; });
      r.views = seen;
      // Key in every answer.
      await p.evaluate(() => { EX.items.forEach((it, i) => { let a;
        if (it.kind === 'parse') { const pg = parsePGN(String(it.pgn || '').split('|')[0] || ''); const inf = it.conj === 'inf', ptc = it.conj === 'ptc'; a = { p: inf || ptc ? '-' : pg.p, g: inf ? '-' : pg.g, n: inf ? '-' : pg.n, conj: it.conj, stem: String(it.stem).split('|')[0], root: String(it.root).split('|')[0], mean: it.gloss || '' }; }
        else if (it.kind === 'mc') a = { o: it.a, mean: it.qe || '' };
        else if (it.kind === 'root') a = { root: it.root, o: it.a };
        else if (it.kind === 'write' && it.sub === 'translate2') a = { strict: it.model, text: it.model };
        else if (it.kind === 'write') a = { text: String(it.model || '').split(' — ')[0], kind: it.qcat, qmean: it.qe, dec: 1, decMs: 9000 };
        else a = { text: it.model || '' };
        EX.ans[i] = a; EX.ms[i] = 20000; }); EX.midDone = 1; exSave(); renderExam(); });
      await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2600);
      const rec = await p.evaluate(() => { const a = S.assess[S.assess.length - 1]; return { id: a.id, type: a.type, total: a.total, n: a.items.length, bytes: JSON.stringify(a).length,
        lowParse: a.items.filter(x => x.kind === 'parse' && x.score < .999).map(x => `${x.spec.form} ${Math.round(x.score * 6)}/6`), lowMC: a.items.filter(x => x.kind === 'mc' && x.score < .999).map(x => x.n),
        writeEst: a.items.filter(x => x.kind === 'write').map(x => Math.round((x.score || 0) * 100)), sections: a.sections }; });
      r.record = rec;
      const rv = await p.innerText('#v-session'); r.reviewBad = bad(rv); r.reviewChars = rv.length;
    } catch (e) { r.error = String(e).slice(0, 300); }
  }
  // Storage size after all those tests.
  res.storage = await p.evaluate(() => { let tot = 0; const per = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i), v = localStorage.getItem(k); tot += (k.length + v.length) * 2; per[k] = v.length; } return { totalBytesUTF16: tot, keys: Object.entries(per).sort((a, b) => b[1] - a[1]).slice(0, 8), assessLocal: (lsGet('assess') || []).length, assessAll: S.assess.length }; });
  // Mobile layout.
  await p.setViewportSize({ width: 390, height: 844 });
  for (const t of TABS) { try { await p.evaluate(t => go(t), t); await p.waitForTimeout(t === 'progress' ? 2500 : 900); res.mobile[t] = await p.evaluate(() => ({ overflowX: document.documentElement.scrollWidth > innerWidth + 2, scrollWidth: document.documentElement.scrollWidth })); } catch (e) { res.mobile[t] = { error: String(e).slice(0, 120) }; } }
  await p.evaluate(() => startRP('rp1')); await p.waitForTimeout(1500); await p.click('#ex-go'); await p.waitForTimeout(400);
  res.mobile.exam = await p.evaluate(() => ({ overflowX: document.documentElement.scrollWidth > innerWidth + 2, scrollWidth: document.documentElement.scrollWidth }));
  await p.screenshot({ path: OUT + 'mobile_exam.png' });
  await p.evaluate(() => { EX = null; lsSet('exam', null); renderOD(); }); await p.waitForTimeout(500);
  res.mobile.od = await p.evaluate(() => ({ overflowX: document.documentElement.scrollWidth > innerWidth + 2, scrollWidth: document.documentElement.scrollWidth }));
  fs.writeFileSync(OUT + 'runtime.json', JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1).slice(0, 200)); console.log('errors:', res.errors.length);
  await b.close();
})();
