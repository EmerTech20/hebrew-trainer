const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const BK='/mnt/user-data/uploads/Desktop/SEMINARY/2026/FALL/20440 - BEGINNING HEBREW _EXEGESIS OF RUTH/APP/hebrew-trainer-backup-2026-11-24.json';
  await p.evaluate(async d => importDocs(d), JSON.parse(fs.readFileSync(BK,'utf8')).docs);
  await p.evaluate(async d => importDocs(d), JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-24.json','utf8')).docs);
  await p.reload(); await p.waitForTimeout(3500);
  for (const t of ['today','rescue','cards','practice','read','progress','prep','library','settings']) { await p.evaluate(t => go(t), t); await p.waitForTimeout(2200); }
  await p.evaluate(() => startTW(1,1,2)); await p.waitForTimeout(1500);
  console.log('tw ok', await p.evaluate(() => SES.items.length), 'events', await p.evaluate(() => MEAS.all.length), 'oral', await p.evaluate(() => !!HET.live('oral/dg1g-2026-11-23')), 'grade', await p.evaluate(() => !!HET.live('grades/amwu1uxme')));
  console.log('errs', errs.slice(0,5)); await b.close(); })();
