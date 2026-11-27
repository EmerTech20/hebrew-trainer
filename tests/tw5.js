const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { await lexLoad(); const out = []; for (const c of [1,2,3,4]) for (const [v] of RUTH.verses[c]) { const V = twVerseWords(c, +v); for (const x of V.words) if (x.a && /verb|Qal|Niphal|Piel|Hiphil|Hithpael|Pual|Hophal|Polel|infinitive|participle/i.test(x.a.grammar || '') && !x.ps.length) out.push(c + ':' + v + ' ' + x.w + ' = ' + x.a.grammar); } return out.join('\n'); }));
  await b.close(); })();
