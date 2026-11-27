const { chromium } = require('playwright');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 760, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500); await p.evaluate(() => lexLoad());
  // practice parse: answer wrong, then look
  await p.evaluate(() => { const x = PARSE_BANK.find(r => r[0] === 'יְלַמֵּד'); startSession({ title: 't', items: [{ kind: 'parse', key: 'pb|t', form: x[0], root: x[1], stem: x[2], conj: x[3], pgn: x[4], gloss: x[5], t: 'piel' }], back: 'today', mode: 'practice' }); });
  await p.waitForTimeout(700);
  await p.evaluate(() => { const it = SES.items[0]; it._sel = { p: '3', g: 'm', n: 's', conj: 'yiqtol', stem: 'qal', root: 'למד' }; answerParse(); }); await p.waitForTimeout(800);
  await p.screenshot({ path: SP + 'xv_practice.png', fullPage: true });
  console.log((await p.innerText('#fb')).slice(0, 600).replace(/\n+/g, ' | '));
  // pattern card
  await p.evaluate(() => { const c = DECKS.patterns ? DECKS.patterns.cards().find(c => c.front === 'יְקַטֵּל') : null; console.log(!!c); go('cards'); });
  await p.evaluate(() => { const d = document.createElement('div'); d.id = 'pxtest'; d.style.cssText = 'padding:12px;max-width:740px'; d.innerHTML = pxHTML('יְקַטֵּל'); document.querySelector('main, #app, body').prepend(d); d.querySelectorAll('details').forEach(x => x.open = true); });
  await p.waitForTimeout(500);
  const el = await p.$('#pxtest'); await el.screenshot({ path: SP + 'xv_card.png' });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
