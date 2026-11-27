const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const txt = fs.readFileSync('/home/claude/build2/example.json', 'utf8');
  const r = await p.evaluate(async t => { try { await lexLoad(); } catch {} const js = findTutorJSON(t); const vr = validateTutorReport(js, 'x'); const i = vr.ins; return { found: !!js, rej: vr.rejected, n: [i.weak.length, i.parse.length, i.parse.filter(x => x.verified).length, i.suffix.length, i.mc.length, i.concepts.length, i.drills.length, (i.cold || []).length, i.open.length] }; }, txt);
  console.log(JSON.stringify(r)); await b.close(); })();
