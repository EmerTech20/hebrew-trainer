const { chromium } = require('playwright'); const fs = require('fs');
const U = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block' }); const p = await ctx.newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(async (a) => { await importDocs(a.docs); }, U); await p.waitForTimeout(500);
  const r = await p.evaluate(async () => { await lexLoad(); const out = [];
    const ws = lexWords((RUTH.verses['1'] || []).slice(0, 3).map(v => v[1]).join(' '));
    for (const w of ws) { const a = analyzeWord(w); out.push(w + ' => ' + JSON.stringify(a)); }
    const d = await storyDoc(19); const sw = lexWords(d.lines.slice(1, 4).join(' ')); for (const w of sw) { const a = analyzeWord(w); out.push('S ' + w + ' => ' + JSON.stringify(a)); }
    return out.join('\n'); });
  console.log(r); await b.close(); })();
