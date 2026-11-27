const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const html = await p.evaluate(() => ['pgn', 'forms', 'stems', 'weak', 'nonfin', 'exam'].map(id => `<section><h2>${RL[id].title}</h2>${RL[id].html()}</section>`).join(''));
  const q = await b.newPage();
  await q.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
  body{font-family:"Noto Sans","DejaVu Sans",Arial,sans-serif;font-size:10.5pt;color:#111;margin:0}
  h1{font-size:18pt;margin:0 0 4pt} h2{font-size:13pt;margin:14pt 0 6pt;color:#1d3a8a;border-bottom:1.5pt solid #1d3a8a;padding-bottom:2pt}
  section{page-break-inside:auto} table{border-collapse:collapse;width:100%;margin:4pt 0 8pt} th,td{border:.6pt solid #999;padding:3pt 5pt;vertical-align:top} th{background:#eef2fb;text-align:left}
  .he{font-family:"SBL Hebrew","Ezra SIL","Noto Serif Hebrew","Noto Sans Hebrew","DejaVu Sans",serif;font-size:1.25em} p,li{line-height:1.45} .tw{overflow:visible}
  </style></head><body><h1>Hebrew final: patterns to memorise</h1><div style="color:#555">Emerson · Final rescue week (Nov 17–23) · built from your weak points</div>${html}</body></html>`);
  await q.pdf({ path: '/mnt/user-data/outputs/Hebrew-final-pattern-sheet.pdf', format: 'Letter', margin: { top: '14mm', bottom: '14mm', left: '13mm', right: '13mm' }, printBackground: true });
  await q.screenshot({ path: '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/sheet.png', fullPage: false });
  await b.close(); })();
