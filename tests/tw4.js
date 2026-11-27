const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const steps = [
    "(async()=>{await lexLoad(); return !!window.LEX_L})()",
    "lexWords(RUTH.verses['1'][0][1]).length",
    "ruthProf('1',1,RUTH.verses['1'][0][1]).length",
    "typeof lexIndex()",
    "courseIndex().exact.size",
    "typeof WORD_OVR",
    "analyzeWord('וַיְהִי').lemma",
    "JSON.stringify(lexParses('וַיְהִי'))",
    "formEnglish({form:'וַיְהִי',root:'היה',stem:'qal',conj:'wayyiqtol',pgn:'3ms',gloss:'to be'})",
  ];
  for (const s of steps) { const t = Date.now(); const r = await Promise.race([p.evaluate(s), new Promise(r => setTimeout(() => r('TIMEOUT'), 40000))]); console.log(s.slice(0, 50), '=>', r, Date.now() - t + 'ms'); if (r === 'TIMEOUT') break; }
  await b.close(); process.exit(0); })();
