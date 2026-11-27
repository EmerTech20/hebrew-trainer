const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500); const bk = JSON.parse(require('fs').readFileSync('/mnt/user-data/attachments/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/3cc0dde2-hebrew-trainer-backup-2026-10-31.json','utf8')); await p.evaluate(async d => importDocs(d), Object.fromEntries(Object.entries(bk.docs).filter(([k]) => /^(library|libmeta)\//.test(k)))); await p.reload(); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { await loadVbc(); const all = Object.values(S.vbc).flatMap(c => c.items.map(e => e.h + '=' + e.g)); return [all.filter(h => /N/.test(h)), all.filter(h => /thirty|three|Solomon|Shiloh/.test(h))]; }));
  await b.close(); })();
