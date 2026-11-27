const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } })).newPage(); const errs = []; p.on('dialog', d => d.accept()); p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs); await p.reload(); await p.waitForTimeout(3000);
  // grading checks
  console.log(await p.evaluate(async () => {
    const ex = await buildFS('fs5'); const P = ex.items.filter(x => x.kind === 'parse');
    const it = P.find(x => x.form.includes('וְהָיָה')) || P[0];
    const s = (sel) => { const g = gradeParse(it, sel); return Math.round(g.score * 100) / 100; };
    return [`items ${ex.items.length}, gpt ${ex.gptKey}, pts parse ${P.map(x => x.pts).join(',')}`,
      `${it.form} weqatal answered weqatal → ${s({ p: '3', g: 'm', n: 's', conj: 'weqatal', stem: 'qal', root: 'היה' })}; as qatal → ${s({ p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'היה' })}; wrong gender → ${s({ p: '3', g: 'f', n: 's', conj: 'weqatal', stem: 'qal', root: 'היה' })}`,
      `units on translations: ${ex.items.filter(x => x.units).length}, comp pts: ${ex.items.filter(x => x.sec === 'comp').map(x => x.pts).join('')}`].join('\n');
  }));
  // take fs8: answer a few things, submit, self-score
  await p.evaluate(async () => { await fsStart(() => buildFS('fs8'), 'x'); EX.phase = 'taking'; EX.startTs = Date.now(); EX.items.forEach((it, i) => { if (it.kind === 'parse') EX.ans[i] = { p: it.conj === 'ptc' || it.conj === 'inf' ? '' : '3', g: 'm', n: 'p', conj: it.conj, stem: it.stem.split('|')[0], root: it.root.replace(/[ךםןףץ]/g, c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[c])) }; else EX.ans[i] = { text: 'x', strict: 'x' }; }); exSave(); });
  await p.evaluate(() => submitExam()); await p.waitForTimeout(1500);
  console.log('SELF', (await p.innerText('#v-session')).slice(0, 700).replace(/\n+/g, ' | '));
  await p.screenshot({ path: SP + 'gptself.png', clip: { x: 0, y: 0, width: 1000, height: 1300 } });
  await p.evaluate(() => { document.querySelectorAll('[data-ss]').forEach(box => { const rs = box.querySelectorAll('input[type=radio]'); const names = [...new Set([...rs].map(r => r.name))]; names.forEach((n, j) => { const opts = box.querySelectorAll(`input[name="${n}"]`); opts[j % 2 ? 1 : 0].checked = true; }); }); });
  await p.click('#ss-go'); await p.waitForTimeout(2500);
  console.log('REVIEW', (await p.innerText('#v-session')).slice(0, 1400).replace(/\n+/g, ' | '));
  console.log('REC', await p.evaluate(() => { const r = fsResults('fs8').slice(-1)[0]; return r ? `${r.total} ${JSON.stringify(r.sections)}` : 'none'; }));
  await p.screenshot({ path: SP + 'gptrev.png', fullPage: false });
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(1500);
  console.log('CARD', await p.evaluate(() => ($('#fs-skills') || {}).innerText));
  await p.click('#ss7-go'); await p.waitForTimeout(800); console.log('SS7', (await p.innerText('#v-session')).slice(0, 150).replace(/\n+/g, ' | '));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
