const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const d = await p.evaluate(() => { const o = {}; for (const [k, v] of Object.entries(PARSE_EXTRA)) if (v.ev || v.trap) o[k] = { ev: v.ev || '', trap: v.trap || '', sm: v.sm || '' }; return o; });
  fs.writeFileSync('/home/claude/build2/px.json', JSON.stringify(d, null, 1)); console.log(Object.keys(d).length);
  await b.close(); })();
