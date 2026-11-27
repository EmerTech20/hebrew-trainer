const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 900, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-16.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs); await p.reload(); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const bad = []; const cards = rescueCards(); for (const c of cards) { const x = PX[c.front]; if (!x) { bad.push('MISSING ' + c.front); continue; } const pcs = x[4].split('|').map(s => { const i = s.lastIndexOf(':'); return [s.slice(0, i), s.slice(i + 1)]; }); const j = pcs.map(q => q[0]).join(''); if (j.normalize('NFC') !== c.front.normalize('NFC')) bad.push('JOIN ' + c.front + ' != ' + j); pcs.forEach(([, r]) => { if (!PX_ROLE[r]) bad.push('ROLE ' + r + ' in ' + c.front); }); } return cards.length + ' cards; problems: ' + (bad.join(' ; ') || 'none'); }));
  for (const f of ['הֱשִׁיבַנִי', 'הַשֹּׁמֵר']) {
    await p.evaluate(f => { const c = rescueCards().find(x => x.front === f); rxSession('t', [flashItem(c)], null); }, f); await p.waitForTimeout(400);
    await p.click('#fl-show'); await p.waitForTimeout(2500);
    await p.screenshot({ path: SP + 'px-' + (f === 'הַשֹּׁמֵר' ? 'b' : 'a') + '.png', fullPage: true });
    console.log(f, await p.evaluate(() => ($('#px-ctx') || {}).innerText));
  }
  // vocab context for a story word
  console.log('vx', await p.evaluate(async () => { const idx = await vxIndex(); const ex = vxExamples('חֲנִית', idx, 'spear')[0]; return ex ? ex.ref + ' | ' + ex.he.slice(0, 80) : 'none'; }));
  console.log('vxpost', await p.evaluate(() => vxPostHTML('חָרָשׁ', 'craftsman', null).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
