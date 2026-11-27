const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    const T = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    const L = [['יוּמַת','מות','hophal','yiqtol','3ms'],['תּוּמַת','מות','hophal','yiqtol','3fs|2ms'],['הַנִּשְׁבָּרָה','שׁבר','niphal','ptc','fs'],['הָרְאֵיתָ','ראה','hophal','qatal','2ms'],['יֻלַּד','ילד','pual','qatal','3ms'],['מְבַקֵּשׁ','בקשׁ','piel','ptc','ms'],['וְיִקָּרֵא','קרא','niphal','weyiqtol','3ms'],['הוֹלִיד','ילד','hiphil','qatal','3ms']];
    return L.map(([form,root,stem,conj,pgn]) => form + ' [' + stem + ' ' + conj + ' ' + pgn + ']\n  ' + [...parseAnswerHTML({form,root,stem,conj,pgn}).matchAll(/How to tell:<\/b>(.*?)(?:<div class="muted"|<\/div><\/td>)/gs)].map(m => T(m[1])).slice(0,3).join('\n  ')).join('\n');
  }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
