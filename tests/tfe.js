const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-16.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs); await p.reload(); await p.waitForTimeout(2500);
  const modes = { weak: () => startWeakRoots({ n: 4 }), story: () => startStoryDrill({ ch: 15 }), sf: () => startSfDrill(), pgn: () => startPgnDrill({ n: 4 }), hith: () => startHithSlides(), workout: () => startSession({ title: 't', items: [PB_ITEMS ? PB_ITEMS[0] : null].filter(Boolean) }) };
  for (const [m, f] of Object.entries(modes)) {
    try { await p.evaluate(f); await p.waitForTimeout(700);
      const kind = await p.evaluate(() => SES && SES.items[SES.i] && SES.items[SES.i].kind + ' ' + SES.items[SES.i].form);
      // give up = "I don't know" path
      await p.evaluate(() => { try { giveUp(); } catch (e) { console.log(e) } }); await p.waitForTimeout(500);
      const fe = await p.evaluate(() => { const e = document.getElementById('form-en'); return e ? e.innerText : '(no #form-en)'; });
      console.log(m, '|', kind, '|', fe);
    } catch (e) { console.log(m, 'ERR', e.message.slice(0, 150)); }
  }
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
