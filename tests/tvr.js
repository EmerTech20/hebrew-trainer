const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  for (const f of process.argv.slice(2)) { const t = fs.readFileSync(f, 'utf8');
    const r = await p.evaluate(t => { try { const o = findTutorJSON(t); const v = validateTutorReport(o); return JSON.stringify({ ok: v.ok, errors: (v.errors||[]).slice(0,12), warnings: (v.warnings||[]).slice(0,12), counts: v.ins ? { parse: (v.ins.parse||[]).length, mc: (v.ins.mc||[]).length, drills: (v.ins.drills||[]).length, suffix: (v.ins.suffix||[]).length } : null, rejected: v.rejected }); } catch (e) { return 'EXC ' + e.message; } }, t);
    console.log(f.split('/').pop(), r); }
  await b.close(); })();
