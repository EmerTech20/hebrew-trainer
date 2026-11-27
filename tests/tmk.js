const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const D = '/home/claude/build2/u1114/';
  const reps = JSON.parse(fs.readFileSync(D + 'reports.json', 'utf8'));
  const out = await p.evaluate(async reps => { await lexLoad(); const res = {}; for (const [id, r] of Object.entries(reps)) { const vr = validateTutorReport(r, r.title); const ins = vr.ins; ins.id = id; ins.addedAt = Date.parse(r.date + 'T12:00:00Z'); res[id] = { ins, rej: vr.rejected }; } return res; }, reps);
  const now = Date.now(), docs = {};
  for (const [id, o] of Object.entries(out)) { console.log(id, 'parse', o.ins.parse.length, 'mc', o.ins.mc.length, 'drills', o.ins.drills.length, 'suffix', o.ins.suffix.length); o.rej.forEach(r => console.log('  REJ', r.where, r.reason)); docs['insights/' + id] = { d: o.ins, u: now }; }
  const g = JSON.parse(fs.readFileSync(D + 'qgloss.json', 'utf8')); for (const [k, lines] of Object.entries(g)) docs['qgloss/' + k] = { d: { lines }, u: now };
  const lib = JSON.parse(fs.readFileSync(D + 'libdocs.json', 'utf8')); for (const [k, v] of Object.entries(lib)) docs[k] = { d: v, u: now };
  const upd = { app: 'hebrew-trainer', v: 1, exported: new Date().toISOString(), note: 'Private update, Nov 14: S13 + S15 class reports, the Ruth 1–3 quiz vocab lists for retakes, Chapter 22 story, Ruth 1–3 course texts, Landes and Hebrew for Life as reference. For this app only.', docs };
  fs.writeFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-14.json', JSON.stringify(upd));
  // import test on a clean copy
  const n = await p.evaluate(async d => importDocs(d), docs); await p.reload(); await p.waitForTimeout(2500);
  console.log('imported', n, await p.evaluate(() => JSON.stringify({ lib: S.lib.map(l => l.id + ':' + l.kind + ':' + (l.chapter || '')), ins: (S.insights || []).map(i => i.id) })));
  console.log('gloss', await p.evaluate(async () => JSON.stringify(await quizGloss('r2'))));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
