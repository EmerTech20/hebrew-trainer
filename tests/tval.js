const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const reps = JSON.parse(fs.readFileSync('/home/claude/build2/tutor/reports.json', 'utf8'));
  const out = await p.evaluate(async reps => { try { await lexLoad(); } catch (e) {} const res = {}; for (const [id, r] of Object.entries(reps)) { const vr = validateTutorReport(r, r.title); const ins = vr.ins; ins.id = id; ins.addedAt = Date.parse(r.date + 'T12:00:00Z'); res[id] = { ins, rej: vr.rejected }; } return res; }, reps);
  for (const [id, o] of Object.entries(out)) { console.log(id, 'parse', o.ins.parse.length, 'drills', o.ins.drills.length, 'concepts', o.ins.concepts.length, 'weak', o.ins.weak.length, 'verified', o.ins.parse.filter(x => x.verified).length); o.rej.forEach(r => console.log('   REJ', r.where, r.reason)); }
  const now = Date.now(); const docs = {}; for (const [id, o] of Object.entries(out)) docs['insights/' + id] = { d: o.ins, u: now };
  fs.writeFileSync('/home/claude/build2/tutor/update.json', JSON.stringify({ app: 'hebrew-trainer', v: 1, exported: new Date().toISOString(), note: 'Private tutor-session records S00–S11 for this app. Supplementary: never counted as test results.', docs }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
