const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  for (const k of ['startDG1', 'startDG1G']) {
    await p.evaluate(k => window[k] ? window[k]() : eval(k + '()'), k); await p.waitForTimeout(1200); await p.click('#ex-go'); await p.waitForTimeout(400);
    await p.evaluate(() => { EX.items.forEach((it, i) => { EX.ans[i] = { p: '3', g: 'm', n: 's', conj: 'qatal', stem: it.stem, root: it.root.split('|')[0] }; }); EX.midDone = 1; exSave(); renderExam(); });
    await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2500);
    const t = await p.innerText('#v-session'); const L = t.split('\n').filter(l => /undefined|NaN|\[object/.test(l));
    console.log(k, 'lines with undefined:', L.length, L.slice(0, 8).join(' || '));
    // printable version
  }
  // all views that show items: flash a hishtaphel parse in practice session
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
