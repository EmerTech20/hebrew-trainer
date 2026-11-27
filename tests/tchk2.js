const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { await lexLoad(); const out = [];
    for (const w of ['וַתִּשְׁתַּחוּ', 'בָּא', 'אֲלַקֳטָה', 'הַשָּׁבָה']) out.push(w + ' lexParses=' + JSON.stringify(lexParses(w)) + ' analyze=' + JSON.stringify((analyzeWord(w) || {}).grammar));
    const V = twVerseWords(2, 10); out.push('2:10 words: ' + V.words.map(x => x.w + (x.ps.length ? '[' + x.ps.map(q => q.stem + ' ' + q.conj).join('/') + ']' : '')).join(' '));
    return out.join('\n'); }));
  await b.close(); })();
