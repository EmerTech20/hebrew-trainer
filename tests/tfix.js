const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const all = [...DAGESH_MC]; const q = all.find(x => /וַיַּקְרֵב/.test(x.q) && /dot in the prefix/.test(x.q)); return q ? q.o[q.a] + ' || ' + q.x.replace(/<[^>]+>/g,'') : 'MCQ NOT FOUND'; }));
  console.log(await p.evaluate(() => trAnalysisHTML({ rows: [], cov: 1, verdict: 'right', unknownMarks: 0, aligned: true, missed: [] }).replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ')));
  console.log(await p.evaluate(() => PARSE_EXTRA['וַיְכַהֲנוּ'] && 0 || (typeof extraHTML==='function' ? extraHTML({form:'וַיְכַהֲנוּ'}).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ') : '')));
  // a real translation check (Ruth 4:15 "she bore him" vs reversed)
  console.log(await p.evaluate(async () => { const it = { he: 'יְלָדַתּוּ', strict: 'she-bore-him' }; const r = await analyzeTranslation(it, 'he bore her', ''); return r.verdict + ' ' + Math.round(r.cov*100) + '% → ' + trAnalysisHTML(r).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,200); }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
