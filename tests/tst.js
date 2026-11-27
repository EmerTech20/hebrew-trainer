const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const st = JSON.parse(fs.readFileSync('/home/claude/build2/u1116b/stories.json', 'utf8'));
  const res = await p.evaluate(async st => {
    await lexLoad(); const idx = lexIndex();
    const key = w => lexNorm(w).replace(/[־\s׃׀]/g, '').replace(/[^א-תְ-ׇ]/g, '');
    const has = w => !!idx.get(lexNorm(w).replace(/[־\s]/g, '').replace(/[׃]/g, ''));
    const out = {}; let merges = [];
    for (const [ch, s] of Object.entries(st)) {
      const lines = s.lines.map(l => { const t = l.split(' '); const r = [];
        for (let i = 0; i < t.length; i++) { const a = t[i], bb = t[i + 1];
          if (bb && !/[׃־]$/.test(a) && !has(a.replace(/[׃]/g, '')) && has((a + bb).replace(/[׃]/g, '')) ) { merges.push(a + ' + ' + bb); r.push(a + bb); i++; } else r.push(a); }
        return r.join(' '); });
      const verbs = []; const seen = new Set();
      lines.forEach((l, li) => l.split(/[\s־]+/).forEach(w0 => { const w = w0.replace(/[׃,.()]/g, ''); if (!/[א-ת]/.test(w)) return;
        const ps = lexParses(w); if (!ps || !ps.length) return;
        const st0 = new Set(ps.map(x => x.stem)), cj = new Set(ps.map(x => x.conj)), rt = new Set(ps.map(x => x.root));
        if (st0.size !== 1 || cj.size !== 1 || rt.size !== 1) return;
        const stem = [...st0][0]; if (!STEMS[stem] && stem !== 'v') return;
        const pg = [...new Set(ps.map(x => x.pgn))].join('|');
        verbs.push([w, [...rt][0], stem === 'v' ? 'hishtaphel' : stem, [...cj][0], pg, li]); }));
      out[ch] = { title: s.title, lines, gloss: s.gloss, verbs };
    }
    return { out, merges };
  }, st);
  fs.writeFileSync('/home/claude/build2/u1116b/stories2.json', JSON.stringify(res.out));
  console.log('merges', res.merges.length, res.merges.slice(0, 30).join(' ; '));
  for (const [ch, s] of Object.entries(res.out)) { const c = {}; s.verbs.forEach(v => c[v[2]] = (c[v[2]] || 0) + 1); console.log(ch, s.verbs.length, JSON.stringify(c)); }
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
