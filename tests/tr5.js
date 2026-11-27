const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => RUTH.verbs.length + ' ' + JSON.stringify(RUTH.verbs.filter(v => /יְלָדַתּוּ|הוֹלִיד|יֻלַּד|וַתִּקְרֶאנָה|אֲהֵבַתֶךְ|תִּקְרֶאנָה/.test(v[0])))));
  console.log(await p.evaluate(() => JSON.stringify(RUTH.verbs.slice(-3))));
  await b.close(); })();
