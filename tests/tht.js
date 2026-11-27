const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const out = await p.evaluate(() => {
    const T = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    const pool = []; (RUTH.verbs || []).forEach(v => pool.push({ form: v[0], root: v[1], stem: v[2], conj: v[3], pgn: v[4] })); (typeof REVIEW_SLIDES !== 'undefined' ? REVIEW_SLIDES : []).forEach(v => pool.push({ form: v[0], root: v[1], stem: v[2], conj: v[3], pgn: v[4] }));
    const want = ['תָּשִׁבִי', 'וַיְכַהֲנוּ', 'יַגִּיד', 'וַיֵּלֶךְ', 'וַתֵּלַכְנָה', 'וַיִּקַּח', 'וַיָּשָׁב', 'לָלֶכֶת', 'וַתִּשָּׁאֵר', 'יֻלַּד', 'הוֹלִיד', 'יִשְׁבֹּר', 'וַיִּשְׁבְּרוּ', 'וַיְדַבֵּר', 'וַיִּכְתֹּב', 'מְבַקֵּשׁ', 'וַיִּפָּקֵד', 'יוּמַת', 'וַיְכֻלּוּ', 'לְהַכּוֹת'];
    let n = 0, fail = 0; const samples = [];
    for (const it of pool) { try { const h = parseAnswerHTML(it); n++; if (want.some(w => it.form.replace(/[֑-֯]/g,'') === w)) samples.push(it.form + ' [' + it.stem + ' ' + it.conj + ' ' + it.pgn + ']\n  ' + [...h.matchAll(/How to tell:<\/b>(.*?)<\/div><\/td>/gs)].map(m => T(m[1])).join('\n  ')); } catch (e) { fail++; } }
    return n + ' items, ' + fail + ' failed\n\n' + samples.slice(0, 30).join('\n\n');
  });
  console.log(out); console.log(errs.slice(0,5).join('\n') || 'NO ERRORS'); await b.close(); })();
