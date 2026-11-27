const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 800, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  // a test-prep exam with a root item
  await p.evaluate(() => startExam('weekly')); await p.waitForTimeout(1500);
  await p.evaluate(() => { const g = $('#ex-go'); g && g.click(); }); await p.waitForTimeout(500);
  const idx = await p.evaluate(() => EX.items.findIndex(x => x.kind === 'root')); console.log('root item', idx);
  if (idx >= 0) { await p.evaluate(i => { EX.cur = i; renderExam(); }, idx); await p.waitForTimeout(400);
    console.log('keys', await p.evaluate(() => document.querySelectorAll('.hekeys').length));
    await p.evaluate(() => { const ks = [...document.querySelectorAll('.hekeys [data-hk]')]; ['ע', 'מ', 'ד'].forEach(l => ks.find(k => k.dataset.hk === l).click()); }); await p.waitForTimeout(200);
    console.log('value', await p.evaluate(() => (document.querySelector('.ex-root, input[lang=he]') || {}).value));
    await p.screenshot({ path: SP + 'hk-root.png' }); }
  // parse grid in exam: only the one keyboard?
  const pi = await p.evaluate(() => EX.items.findIndex(x => x.kind === 'parse')); if (pi >= 0) { await p.evaluate(i => { EX.cur = i; renderExam(); }, pi); await p.waitForTimeout(400); console.log('parse keys', await p.evaluate(() => document.querySelectorAll('.hekeys').length)); }
  // session parse grid (has its own button) → should not add a second
  await p.evaluate(() => startWeakRoots({ n: 3 })); await p.waitForTimeout(500); console.log('session keys', await p.evaluate(() => document.querySelectorAll('.hekeys').length + ' btn ' + !!$('#p-kbd')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
