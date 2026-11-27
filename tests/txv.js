const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
const which = process.argv[2] || 'all';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 900, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500); await p.evaluate(() => lexLoad()); await p.waitForTimeout(500);
  const L = [['יְקַטֵּל','קטל','piel','yiqtol','3ms'],['הוֹלִיד','ילד','hiphil','qatal','3ms'],['וַיִּשְׂנְאֻהוּ','שׂנא','qal','wayyiqtol','3mp'],['תִּמָּצֵא','מצא','niphal','yiqtol','2ms|3fs'],['וַיַּשְׁקֵף','שׁקף','hiphil','wayyiqtol','3ms'],['הִשָּׁמֶר','שׁמר','niphal','impv','2ms'],['וְנִסְתַּרְתָּ','סתר','niphal','weqatal','2ms'],['לְהָמִית','מות','hiphil','inf',''],['נִשְׁמָר','שׁמר','niphal','ptc','ms'],['יְבָרֵךְ','ברך','piel','yiqtol','3ms'],['וַיְהִי','היה','qal','wayyiqtol','3ms'],['נָתַתָּה','נתן','qal','qatal','2ms'],['הָקְטַל','קטל','hophal','qatal','3ms'],['מְקַטֵּל','קטל','piel','ptc','ms'],['הִתְהַלֵּךְ','הלך','hithpael','qatal','3ms'],['הַשֹּׁמֵר','שׁמר','qal','ptc','ms'],['יִקְטֹל','קטל','qal','yiqtol','3ms'],['קֻטַּל','קטל','pual','qatal','3ms'],['וַיִּקַּח','לקח','qal','wayyiqtol','3ms'],['שְׁמָרַנִי','שׁמר','qal','qatal','3ms']];
  for (const [form, root, stem, conj, pgn] of L) {
    if (which !== 'all' && !which.split(',').includes(form)) continue;
    const t = await p.evaluate(it => { const d = document.createElement('div'); d.innerHTML = xvHTML(it); d.querySelectorAll('details').forEach(x => x.open = true); document.body.appendChild(d); const s = d.innerText; d.remove(); return s; }, { form, root, stem, conj, pgn, key: 't' });
    console.log('=================== ' + form + '\n' + t.replace(/\n{2,}/g, '\n').slice(0, which === 'all' ? 1400 : 6000));
  }
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
