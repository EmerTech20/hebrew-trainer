const { chromium } = require('playwright'); const fs = require('fs');
const OUT = '/home/claude/kx/data/';
const BK = '/mnt/user-data/uploads/Desktop/SEMINARY/2026/FALL/20440 - BEGINNING HEBREW _EXEGESIS OF RUTH/APP/hebrew-trainer-backup-2026-11-24.json';
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', acceptDownloads: true, viewport: { width: 1100, height: 1400 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const bk = JSON.parse(fs.readFileSync(BK, 'utf8'));
  console.log('imported', await p.evaluate(async d => importDocs(d), bk.docs));
  await p.reload(); await p.waitForTimeout(4000);
  await p.click('.tab[data-tab="progress"]').catch(e => console.log('tab', e.message)); await p.waitForTimeout(4000);
  const r = await p.evaluate(() => ({ json: JSON.stringify(buildExport(false), null, 1), ev: eventsCSV(false), it: itemsCSV(false), wk: weeksCSV(false), anon: JSON.stringify(buildExport(true), null, 1),
    prog: JSON.stringify(Object.fromEntries(Object.entries(S.prog).map(([k, v]) => [k, v])), null, 1), progKeys: Object.keys(S.prog), env: typeof APP_ENV !== 'undefined' ? APP_ENV : null }));
  fs.writeFileSync(OUT + 'hebrew-progress-2026-11-24.json', r.json); fs.writeFileSync(OUT + 'hebrew-progress-2026-11-24-ANONYMIZED.json', r.anon);
  fs.writeFileSync(OUT + 'hebrew-answers-2026-11-24.csv', r.ev); fs.writeFileSync(OUT + 'hebrew-test-items-2026-11-24.csv', r.it); fs.writeFileSync(OUT + 'hebrew-weekly-summaries-2026-11-24.csv', r.wk);
  fs.writeFileSync(OUT + 'app-progress-state-2026-11-24.json', r.prog);
  console.log('progKeys', r.progKeys.join(' '), 'env', r.env, 'sizes', r.json.length, r.ev.length, r.it.length, r.wk.length);
  for (const [id, nm] of [['#dw-pdf2', 'weekly'], ['#dw-sem2', 'semester']]) { try { const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 90000 }), p.click(id)]); const f = OUT + 'sample-' + nm + '-report-2026-11-24.pdf'; await dl.saveAs(f); console.log(nm, dl.suggestedFilename(), fs.statSync(f).size); } catch (e) { console.log(nm, 'fail', e.message.slice(0, 200)); } }
  console.log('errs', errs.slice(0, 5)); await b.close(); })();
