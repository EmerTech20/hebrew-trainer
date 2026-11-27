const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2000);
  const r = await p.evaluate(async () => { await lexLoad(); return ['רַב','יָכֹל','אֶ֫בֶן','אֲשֶׁר','הָלַךְ','וַיֵּלֶךְ','שִׁשִּׁים','אִשָּׁה','לִפְנֵי־','טוֹב','בָּנָיו'].map(w => { const a = analyzeWord(w); return w + ' => ' + JSON.stringify(a); }); });
  console.log(r.join('\n'));
  console.log(await p.evaluate(() => typeof formEnglish + ' ' + typeof wordTable + ' ' + (window.LEX_L ? LEX_L[100] : 'nolexL') + ' ' + Object.keys(PBANK) + ' ' + JSON.stringify(PBANK.verses[0]).slice(0,300) + ' RUTHV ' + JSON.stringify(RUTH.verses['1'][0]).slice(0,200)));
  await b.close(); })();
