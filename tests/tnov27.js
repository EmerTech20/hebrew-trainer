const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log('L11 Portuguese line gone:', !(await p.content()).includes('Traga seu'), await p.evaluate(() => !/Traga seu/.test(document.documentElement.innerHTML + String(typeof importBannerHTML === 'function' ? importBannerHTML() : ''))));
  console.log('G11', await p.evaluate(() => [AN.rootEq('שב', 'שוב'), AN.rootEq('שיב', 'שוב'), AN.rootEq('שוב', 'שוב'), AN.rootEq('קם', 'קום'), AN.rootEq('הלך', 'ילך')]));
  console.log('L7', await p.evaluate(() => [PR('נָעֳמִי'), PR('לְנָעֳמִי'), PRi('נָעֳמִי'), PR('חָכְמָה'), PR('כָּל')].map(s => String(s).replace(/<[^>]+>/g, ''))));
  const t = await p.evaluate(async () => { const t0 = performance.now(); await HET.write('test/x', { a: 1 }); const dt = performance.now() - t0;
    const got = await new Promise(r => { const q = indexedDB.open('hebrew-trainer'); q.onsuccess = () => { const db = q.result; const g = db.transaction('docs').objectStore('docs').get('test/x'); g.onsuccess = () => { r(g.result && g.result.d); db.close(); }; }; });
    return { dt: Math.round(dt), got }; }); console.log('BUG-03 committed when resolved:', JSON.stringify(t));
  // L1: flashcard front
  await p.evaluate(() => go('cards')); await p.waitForTimeout(2500);
  await p.evaluate(() => { const k = Object.keys(DECKS); console.log(k); startReview(k.includes('vocab') ? 'vocab' : k[0]); }).catch(e => console.log('startCards', e.message));
  await p.waitForTimeout(2500);
  console.log('L1 before flip:', await p.evaluate(() => { const pre = document.getElementById('wi-pre'), back = document.getElementById('fc-back'); return { front: document.querySelector('#fc').innerText.replace(/\s+/g, ' ').slice(0, 140), preInsideBack: !!(pre && back && back.contains(pre)), backHidden: back && back.hidden }; }));
  await p.click('#fc'); await p.waitForTimeout(2000);
  console.log('L1 after flip:', await p.evaluate(() => document.querySelector('#fc').innerText.replace(/\s+/g, ' ').slice(0, 300)));
  console.log('errs', errs.slice(0, 5)); await b.close(); })();
