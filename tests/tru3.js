const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const o=[]; for (const [c,a,z] of [[1,15,20],[2,8,13],[3,7,12]]) for (const [v,he] of RUTH.verses[c]) if (v>=a&&v<=z) o.push(`${c}:${v} ${he}\n    ${RUTH_EN[c+':'+v]||''}`); return o.join('\n'); }));
  await b.close(); })();
