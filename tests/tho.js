const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(async () => { const idx = await vxIndex(); const out = [];
    for (const [w, m] of [['רָעָה','to pasture, tend; graze'],['רָעָה','evil, wickedness, calamity'],['יָכֹל','be able'],['רַב','many; great'],['אֲשֶׁר','who, that, which (relative)'],['הָלַךְ','to go, walk; behave']]) { const ex = vxExamples(w, idx, m)[0]; const I = vxInfo(w, m); out.push(`${w} [${m}] g=${I.g} | ex=${ex ? ex.ref + ' ' + ex.form : '-'}`); }
    return out; });
  console.log(r.join('\n')); console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
