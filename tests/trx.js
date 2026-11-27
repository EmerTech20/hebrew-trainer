const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
async function boot(b, day) { const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1100, height: 900 } })).newPage(); p._errs = []; p.on('pageerror', e => p._errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') p._errs.push('console: ' + m.text().slice(0, 200)); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(d => { const D = Date; const t0 = new D(d + 'T14:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; }, day);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500); return p; }
(async () => { const b = await chromium.launch();
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-16.json', 'utf8'));
  let p = await boot(b, '2026-11-17'); await p.evaluate(async d => importDocs(d), upd.docs); await p.reload(); await p.waitForTimeout(3000);
  console.log('D1 plan:', await p.evaluate(() => planBlocks().map(x => x.id + ':' + x.min).join(' ')));
  await p.evaluate(() => { go('today'); }); await p.waitForTimeout(600);
  console.log('card title:', await p.evaluate(() => ($('#plan-card h2') || {}).textContent + ' | ' + ($('#plan-card p') || {}).textContent));
  await p.screenshot({ path: SP + 'rx-today.png' });
  // lesson block
  await p.evaluate(() => planBlocks()[0].act()); await p.waitForTimeout(500); await p.screenshot({ path: SP + 'rx-lesson.png', fullPage: true });
  await p.click('#b-lesson'); await p.waitForTimeout(300); await p.click('#b-lesson'); await p.waitForTimeout(300);
  console.log('after lessons item:', await p.evaluate(() => SES.items[SES.i].kind + ' ' + SES.items.length));
  for (let k = 0; k < 5; k++) { await p.evaluate(() => { const o = document.querySelector('.opt'); o && o.click(); }); await p.waitForTimeout(250); await p.evaluate(() => { const n = $('#b-next'); n && n.click(); }); await p.waitForTimeout(250); }
  console.log('lesson done?', await p.evaluate(() => planDone('lesson')), await p.evaluate(() => !!$('#rx-next') && $('#rx-next').closest('.panel').innerText.replace(/\s+/g, ' ')));
  // cards
  await p.click('#rx-next'); await p.waitForTimeout(500); await p.click('#fl-show'); await p.waitForTimeout(200); await p.screenshot({ path: SP + 'rx-card.png' });
  await p.click('#fl-no'); await p.waitForTimeout(200);
  console.log('cards', await p.evaluate(() => SES.items.length + ' last again=' + !!SES.items[SES.items.length - 1].again + ' fe=' + (($('#form-en') || {}).innerText || '')));
  // pgn drill: answer by give-up and check form-en
  await p.evaluate(() => startPgnDrill({ n: 40, planBlock: 'pgn' })); await p.waitForTimeout(400); await p.evaluate(() => giveUp()); await p.waitForTimeout(300);
  console.log('pgn n', await p.evaluate(() => SES.items.length), 'fe:', await p.evaluate(() => ($('#form-en') || {}).innerText));
  await p.evaluate(() => planBlocks().find(x => x.id === 'mix').act()); await p.waitForTimeout(400);
  console.log('mix', await p.evaluate(() => SES.items.map(i => `${i.form} ${i.stem} ${i.conj} ${i.pgn}`).join(' | ')));
  await p.evaluate(() => giveUp()); await p.waitForTimeout(300); console.log('mix fe:', await p.evaluate(() => ($('#form-en') || {}).innerText));
  await p.evaluate(() => startSfDrill()); await p.waitForTimeout(300); await p.evaluate(() => giveUp()); await p.waitForTimeout(300); console.log('sf fe:', await p.evaluate(() => ($('#form-en') || {}).innerText));
  // story questions with context
  await p.evaluate(() => startStoryQuestions(22, 4)); await p.waitForTimeout(1200);
  console.log('storyQ ctx:', await p.evaluate(() => { const c = $('.ctx-box'); return c ? c.innerText.slice(0, 200) : 'NONE'; }));
  await p.screenshot({ path: SP + 'rx-storyq.png', fullPage: true });
  // local meanings
  console.log('meaning', await p.evaluate(async () => { await lexLoad(); await loadStoryGlosses(); return JSON.stringify(localMeaning({ q: '', he: 'יוֹסֵף הַבּוֹר וַיַּשְׁלִכוּ', ctx: '', passage: '', options: [] }).words); }));
  for (const day of ['2026-11-18', '2026-11-19', '2026-11-20', '2026-11-22', '2026-11-23']) {
    const q = await boot(b, day);
    const ids = await q.evaluate(() => planBlocks().map(x => x.id).join(','));
    const res = [];
    for (const id of ids.split(',')) { const ok = await q.evaluate(id => { const x = planBlocks().find(y => y.id === id); if (!x.act || id === 'mock') return 'skip'; try { x.act(); return SES ? (SES.items.length + ' items') : 'nosess'; } catch (e) { return 'ERR ' + e.message; } }, id); await q.waitForTimeout(300); res.push(id + '=' + ok); }
    console.log(day, res.join(' · '), q._errs.slice(0, 3).join(' ; ') || 'ok'); await q.context().close();
  }
  console.log(p._errs.join('\n') || 'NO ERRORS'); await b.close(); })();
