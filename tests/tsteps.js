const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 760, height: 1000 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { S.prog.flags.noImport = 1; go('practice'); }); await p.waitForTimeout(400);
  console.log('card:', await p.evaluate(() => !!document.getElementById('pa-card')));
  await p.click('#pa-ex'); await p.waitForTimeout(400);
  const items = await p.evaluate(() => SES.items.map(x => `${x.kind} ${x.form} ${x.ref || ''} ${x.transferOf ? 'TRANSFER of ' + x.transferOf : ''}`));
  console.log(items.join('\n'));
  // walk the first verb: hint once on step 1, then answer each step (first option for wrong, else right)
  for (let k = 0; k < 8; k++) {
    const st = await p.evaluate(() => { const it = SES.items[SES.i]; const s = it._steps && it._steps[it._si]; return s ? { id: s.id, q: s.q, opts: (s.opts || []).map(o => o.label.replace(/<[^>]+>/g, '')), right: s.right } : null; });
    if (!st) break; console.log('STEP', JSON.stringify(st));
    if (k === 0) { await p.click('#pa-h'); await p.click('#pa-h'); console.log('HINTS:', await p.innerText('#pa-hint')); }
    if (st.id === 'pgn') { await p.click('.pc[data-f="p"][data-v="1"]'); await p.click('.pc[data-f="g"][data-v="c"]'); await p.click('.pc[data-f="n"][data-v="s"]'); await p.click('#pa-check'); }
    else if (k === 1) { await p.evaluate(() => { const s = SES.items[SES.i]._steps[SES.items[SES.i]._si]; [...document.querySelectorAll('.opt')].find(b => b.dataset.o !== s.right).click(); }); }
    else await p.evaluate(() => { const s = SES.items[SES.i]._steps[SES.items[SES.i]._si]; [...document.querySelectorAll('.opt')].find(b => b.dataset.o === s.right).click(); });
    await p.waitForTimeout(200); console.log('FB:', (await p.innerText('#fb')).slice(0, 700).replace(/\n+/g, ' | '));
    if (k === 1) await p.screenshot({ path: '/home/claude/tests/step2.png', fullPage: true });
    await p.click('#pa-next'); await p.waitForTimeout(200);
  }
  await p.waitForTimeout(1200); await p.screenshot({ path: '/home/claude/tests/summary.png', fullPage: true });
  console.log('SUMMARY:', (await p.innerText('#v-session .qbox')).slice(0, 1500).replace(/\n+/g, ' | '));
  console.log('EV:', await p.evaluate(() => JSON.stringify(MEAS.ev[MEAS.ev.length - 1]).slice(0, 600)));
  await p.click('#b-next'); await p.waitForTimeout(400); console.log('TRANSFER:', (await p.innerText('#v-session .qbox')).slice(0, 300).replace(/\n+/g, ' | '));
  await p.screenshot({ path: '/home/claude/tests/transfer.png', fullPage: true });
  // reverse
  await p.evaluate(() => startReverse()); await p.waitForTimeout(300); console.log('REV:', (await p.innerText('#v-session .qbox')).slice(0, 300).replace(/\n+/g, ' | '));
  await p.evaluate(() => document.querySelectorAll('.opt')[0].click()); await p.waitForTimeout(200); console.log('REVFB:', (await p.innerText('#fb')).slice(0, 500).replace(/\n+/g, ' | '));
  // a random full session of other stems
  for (const stem of ['niphal', 'piel', 'hiphil', 'weak', '']) { await p.evaluate(st => { startSteps({ src: 'all', stem: st }); }, stem); await p.waitForTimeout(200);
    const r = await p.evaluate(() => SES.items.map(x => `${x.kind}:${x.form}:${x.stem}/${x.conj}/${x.pgn}${x.transferOf ? '(T)' : ''} steps=${x.kind === 'steps' ? (x._steps || []).length : ''}`).join('  ')); console.log(stem || 'all', r);
    // answer every step of the session with the right answer to check explanations render
    for (let g = 0; g < 60; g++) { const done = await p.evaluate(() => { if (!SES || SES.i >= SES.items.length) return true; const it = SES.items[SES.i]; if (it.kind !== 'steps') { SES.i++; drawItem(); return false; } const s = it._steps && it._steps[it._si]; if (!s) { SES.i++; drawItem(); return false; } if (s.chips) { const a = parsePGN(String(it.pgn).split('|')[0]); ['p','g','n'].forEach(k => { const v = a[k] || '-'; const b = document.querySelector(`.pc[data-f="${k}"][data-v="${v}"]`); b && b.click(); }); document.getElementById('pa-check').click(); } else { [...document.querySelectorAll('.opt')].find(b => b.dataset.o === s.right).click(); } const fb = document.getElementById('fb').innerText; if (!/Correct/.test(fb)) console.error('NOT CORRECT ' + it.form + ' ' + s.id + ' ' + fb.slice(0, 200)); document.getElementById('pa-next').click(); return false; }); if (done) break; }
  }
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
