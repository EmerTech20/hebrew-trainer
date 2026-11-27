const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/t22/';
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 760, height: 1000 } });
  const p = await ctx.newPage(); const errs = []; p.on('dialog', d => d.accept()); p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs);
  await p.reload(); await p.waitForTimeout(3000);
  console.log('TL:', await p.evaluate(() => ['אוֹדִיעַ', 'אוֹר', 'וְאוֹדִיעַ', 'אוֹיֵב', 'מוֹאָב', 'הוֹלִיד', 'לֹא', 'שָׁאוּל', 'אֹתוֹ'].map(w => w + '=' + TL(w)).join('  ')));
  console.log('ROOT:', await p.evaluate(() => { const it = { form: 'הֲסִירוֹתִי', root: 'סור', stem: 'hiphil', conj: 'qatal', pgn: '1cs' }; const g = s => gradeParse(it, { p: '1', g: 'c', n: 's', conj: 'qatal', stem: 'hiphil', root: s }).res.root; return `סור ${g('סור')} · סיר ${g('סיר')} · סר ${g('סר')}`; }));
  // build fs1 and estimate the three disputed answers
  await p.evaluate(async () => { await startFS('fs1'); });
  console.log('EST:', await p.evaluate(() => { const find = q => EX.items.find(x => x.sec === 'comp' && String(x.q).includes(q)); const t = (q, a) => { const it = find(q); const r = AG.comp(it, a); return `${q.slice(0, 12)}… → ${r.score} (${r.how})`; };
    return [t('אֶל־מִי שָׁלַח', 'אֶל־יִשַׁי'), t('מָה יַעֲשֶׂה שָׁאוּל', 'קַרְנִי אִתִּי וְשָׁמַע שָׁאוּל וְהֵמִית אֹתִי'), t('כַּמָּה בָּנִים הֶעֱבִיר', 'שִׁבְעַת'), t('מָה אָמַר יְהוָה לִשְׁמוּאֵל', 'לֹא־תוֹסִיף אֹתוֹ מִמְּלֹךְ עַל־יִשְׂרָאֵל'), t('אֶת־מִי רָאָה', 'אֱלִיאָב')].join('\n'); }));
  await p.click('#ex-go'); await p.waitForTimeout(800);
  const ci = await p.evaluate(() => EX.items.findIndex(x => x.sec === 'comp')); await p.click(`[data-xi="${ci}"]`); await p.waitForTimeout(500);
  console.log('COMP SCREEN: line label', await p.evaluate(() => /line \d/.test($('.qtext') ? $('.qtext').innerText : '')), '· highlighted lines', await p.evaluate(() => $$('.fs-box .fs-hl').length));
  // submit at ~28 min with 10 answers to see the card
  await p.evaluate(() => { EX.items.slice(0, 10).forEach((it, i) => EX.ans[i] = it.kind === 'parse' ? { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'אבג' } : { text: 'אֶל־יִשַׁי' }); EX.elapsed = 28 * 60000; EX.segStart = Date.now(); exSave(); });
  await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(2500);
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(800);
  const el = await p.$('#fs-card .step'); await el.screenshot({ path: SP + 'card.png' });
  console.log('CARD:', await p.evaluate(() => $('#fs-card .step').innerText.replace(/\n+/g, ' | ')));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
