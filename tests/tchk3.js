const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { const its = await twItems(2, 10, 10); const it = its.find(i => i.kind === 'parse' && /שְׁתַּחוּ/.test(i.form)); if (!it) return 'NO PARSE ITEM';
    const g1 = gradeParse(it, { p: '3', g: 'f', n: 's', conj: 'wayyiqtol', stem: 'hishtaphel', root: 'חוה' }), g2 = gradeParse(it, { p: '3', g: 'f', n: 's', conj: 'wayyiqtol', stem: 'hishtaphel', root: 'שחה' });
    let bad = 0, n = 0; for (const c of [1, 2, 3, 4]) { const all = await twItems(c, 1, RUTH.verses[c].length); for (const x of all.filter(i => i.kind === 'parse')) { n++; const pg = (x.pgn || '').split('|')[0]; const sel = { conj: x.conj, stem: x.stem, root: x.root, p: x.conj === 'ptc' || x.conj === 'inf' ? '-' : pg[0], g: x.conj === 'ptc' ? pg[0] : x.conj === 'inf' ? '-' : pg[1] || '', n: x.conj === 'ptc' ? pg[1] : x.conj === 'inf' ? '-' : pg[2] || '' }; if (gradeParse(x, sel).score < 1) bad++; } }
    return `key ${it.stem} ${it.conj} ${it.pgn} ${it.root} · חוה=${g1.score} · שחה=${g2.score} · all parse items ${n}, below 6/6 ${bad}`; }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
