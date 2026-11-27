const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2000);
  console.log(await p.evaluate(() => [49, 51, 42, 29].map(i => JSON.stringify(PATTERNS[i]).slice(0, 400)).join('\n') + '\n' + ['DAGESH_MC', 'PART_MC', 'SUFFIX_ROLE', 'ACC_MC', 'BINYAN_MC'].map(n => n + ' keys ' + Object.keys(window[n] ? eval(n)[0] : {}).join(',')).join('\n') + '\n' + JSON.stringify(eval('ACC_MC')[6]).slice(0,300)+ '\n' + JSON.stringify(eval('DAGESH_MC')[0]).slice(0,300)));
  await b.close(); })();
