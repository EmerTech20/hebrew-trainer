const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const T = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const terse = s => { const t = T(s); return (t.match(/[+=→]/g) || []).length >= 2 || (t.length < 60 && /[+=]/.test(t)); };
    const pb = PARSE_BANK.map((x, i) => [i, x]).filter(([i, x]) => x[7] && terse(x[7])).map(([i, x]) => ({ i, form: x[0], root: x[1], stem: x[2], conj: x[3], pgn: x[4], gloss: x[5], note: x[7] }));
    const banks = { MCQ, DAGESH_MC, BINYAN_MC, FORM_MC, PART_MC, STRICT_MC, SUFFIX_ROLE, PATTERNS, ACC_MC, LOOKALIKES };
    const mc = []; for (const [n, arr] of Object.entries(banks)) arr.forEach((x, i) => { const xx = x.x || x.y || ''; if (terse(xx)) mc.push({ bank: n, i, q: T(x.q), a: T((x.o || [])[x.a]), x: xx }); });
    // PGN_MC through wpMC
    PGN_MC.forEach((x, i) => { const it = wpMC('pgn', i); if (terse(it.x || '')) mc.push({ bank: 'PGN_MC', i, q: T(it.q), a: T((it.o || [])[it.a]), x: it.x }); });
    return { pb, mc };
  });
  fs.writeFileSync('/home/claude/build2/terse.json', JSON.stringify(r, null, 1)); console.log(r.pb.length, r.mc.length); await b.close(); })();
