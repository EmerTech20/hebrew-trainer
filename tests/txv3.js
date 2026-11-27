const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const h = itemExplainHTML({ n: 3, score: 0.5, answered: 1, kind: 'parse', cat: 'protected', answer: { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'שמר' }, f: { root: 1, stem: 1, conj: 0, pgn: 1 }, spec: { kind: 'parse', form: 'וְנִסְתַּרְתָּ', root: 'סתר', stem: 'niphal', conj: 'weqatal', pgn: '2ms', ref: 'story line 7', ctx: 'x' } }); return (h.match(/Explain this verb/g) || []).length + ' ' + h.length; }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
