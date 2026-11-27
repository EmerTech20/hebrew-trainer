const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1400 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    const L = [['תָּשִׁבִי','שׁוב','hiphil','yiqtol','2fs',{p:'3',g:'m',n:'s',conj:'yiqtol',stem:'hiphil',root:'שבו'}],
      ['מְבַקֵּשׁ','בקשׁ','piel','ptc','ms',{p:'3',g:'m',n:'s',conj:'ptc',stem:'piel',root:'בקש'}],
      ['תּוּמַת','מות','hophal','yiqtol','3fs|2ms',{p:'2',g:'m',n:'s',conj:'yiqtol',stem:'hophal',root:'מות'}],
      ['לְהַכּוֹת','נכה','hiphil','inf','',{p:'',g:'',n:'',conj:'inf',stem:'hiphil',root:'נכה'}],
      ['וַתֵּלַכְנָה','הלך','qal','wayyiqtol','3fp',{p:'3',g:'f',n:'s',conj:'wayyiqtol',stem:'qal',root:'הלך'}],
      ['יָשְׁבוּ','ישׁב','qal','qatal','3cp',{p:'3',g:'m',n:'p',conj:'qatal',stem:'qal',root:'ישב'}]];
    const out = [];
    for (const [form, root, stem, conj, pgn, sel] of L) { const it = { kind: 'parse', t: 'test', form, root, stem, conj, pgn, _sel: sel }; const g = gradeParse(it, sel); it._res = g.res; const ev = logEvent(it, g.score); const back = pgnFromEvent(ev); const g2 = gradeParse(back.item, back.sel); out.push(form + ' | ans=' + ev.ans + ' | exp=' + ev.exp + ' | same=' + (JSON.stringify(g.res) === JSON.stringify(g2.res))); }
    return out.join('\n');
  }));
  await p.evaluate(() => go('progress')); await p.waitForTimeout(3500);
  console.log(await p.evaluate(() => ($('#pgn-split') || {}).innerText));
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/pgn.png', clip: { x: 0, y: 0, width: 1000, height: 700 } });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
