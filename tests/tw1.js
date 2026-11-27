const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/tw/'; fs.mkdirSync(SP, { recursive: true });
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 900, height: 1300 } }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); }); p.on('dialog', d => d.accept());
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const L = (k, s) => console.log('== ' + k + ': ' + String(s).replace(/\n+/g, ' | ').slice(0, 1500));
  await p.evaluate(() => go('cards')); await p.waitForTimeout(4000); L('T', Date.now());
  L('PANEL', await p.evaluate(() => ($('#tw-panel') || {}).innerText || 'MISSING'));
  L('TIMING stats', await p.evaluate(() => { TW.built = {}; const t = performance.now(); const r = [1,2,3,4].map(c => twStats(c)); return Math.round(performance.now() - t) + 'ms ' + JSON.stringify(r); }));
  L('ALL TOKENS', await p.evaluate(() => { let tot = 0, nomean = [], noparse = 0, verbs = 0, variants = []; for (const c of [1,2,3,4]) for (const [v] of RUTH.verses[c]) { const V = twVerseWords(c, +v); for (const x of V.words) { tot++; if (/not found/.test(twMeaning(x))) nomean.push(c+':'+v+' '+x.w); if (/uncertain/.test(twMeaning(x))) nomean.push('U '+c+':'+v+' '+x.w); if (x.ps.length) verbs++; if (x.variant) variants.push(c+':'+v+' '+x.w+'<'+x.o); if (x.a && /^V|verb/.test(x.a.grammar||'') && !x.ps.length) noparse++; } } return `tokens ${tot}, verbs-with-parse ${verbs}, verb-like without parse ${noparse}, problem meanings ${nomean.length}: ${nomean.slice(0,40).join(' ; ')} || variants: ${variants.join(' ; ')}`; }));
  await p.screenshot({ path: SP + 'panel.png' });
  await p.click('[data-tw="1,1,6"]'); await p.waitForTimeout(2500);
  L('SES', await p.evaluate(() => SES.title + ' | ' + SES.items.slice(0, 12).map(i => i.kind + ':' + (i.form || i.front || i.v)).join(', ')));
  L('CARD FRONT', await p.innerText('#v-session')); await p.screenshot({ path: SP + 'card_front.png' });
  await p.click('#tw-show'); await p.waitForTimeout(300); L('CARD BACK', await p.innerText('#v-session')); await p.screenshot({ path: SP + 'card_back.png' });
  await p.click('#tw-no'); await p.waitForTimeout(200); await p.click('#b-next'); await p.waitForTimeout(500);
  L('NEXT ITEM', (await p.innerText('#v-session')).slice(0, 700)); await p.screenshot({ path: SP + 'item2.png' });
  // advance to first parse item
  for (let k = 0; k < 40; k++) { const kind = await p.evaluate(() => SES.items[SES.i].kind); if (kind === 'parse') break; if (kind === 'twcard') { await p.click('#tw-show'); await p.click('#tw-yes'); await p.click('#b-next'); } else if (kind === 'twverse') { await p.click('#tw-next'); } await p.waitForTimeout(150); }
  L('PARSE ITEM', (await p.innerText('#v-session')).slice(0, 900)); L('PARSE KEY', await p.evaluate(() => { const i = SES.items[SES.i]; return JSON.stringify({ form: i.form, root: i.root, stem: i.stem, conj: i.conj, pgn: i.pgn, alts: i.alts, gloss: i.gloss, en: i.en }); }));
  await p.screenshot({ path: SP + 'parse.png' });
  // all parse keys for chapter 1-4 graded against themselves
  L('SELF-GRADE', await p.evaluate(async () => { let bad = [], n = 0; for (const c of [1,2,3,4]) { const its = await twItems(c, 1, RUTH.verses[c].length); for (const it of its.filter(i => i.kind === 'parse')) { n++; const pg = (it.pgn || '').split('|')[0]; const sel = { conj: it.conj, stem: it.stem, root: it.root, p: it.conj === 'ptc' || it.conj === 'inf' ? '-' : pg[0], g: pg[1] || (it.conj==='inf'?'-':''), n: pg[2] || (it.conj==='inf'?'-':'') }; if (it.conj === 'ptc') { sel.p = '-'; sel.g = pg[0]; sel.n = pg[1]; } const g = gradeParse(it, sel); if (g.score < 1) bad.push(it.form + ' ' + it.stem + ' ' + it.conj + ' ' + it.pgn + ' ' + it.root + ' =' + g.score.toFixed(2)); } } return n + ' parse items; below 6/6: ' + bad.length + ' ' + bad.slice(0, 15).join(' ; '); }));
  // go to verse end
  for (let k = 0; k < 60; k++) { const kind = await p.evaluate(() => SES.items[SES.i].kind); if (kind === 'twverse') break; if (kind === 'twcard') { await p.click('#tw-show'); await p.click('#tw-yes'); await p.click('#b-next'); } else if (kind === 'parse') { await p.evaluate(() => { const b = document.querySelector('#s-idk, [data-giveup], #b-idk'); if (b) b.click(); else { SES.i++; drawItem(); } }); await p.waitForTimeout(200); const nb = await p.$('#b-next'); if (nb) await nb.click(); } await p.waitForTimeout(150); }
  L('VERSE', (await p.innerText('#v-session')).slice(0, 900)); await p.screenshot({ path: SP + 'verse.png' });
  await p.click('#tw-next'); await p.waitForTimeout(300); L('POS', await p.evaluate(() => JSON.stringify(TW.pos) + ' ' + JSON.stringify(lsGet('twpos'))));
  L('ITEM AFTER VERSE', (await p.innerText('#v-session')).slice(0, 200));
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(800); L('RESCUE', await p.evaluate(() => { const b = $('[data-twopen]'); return b ? b.closest('.step').innerText : 'MISSING'; }));
  await p.evaluate(() => go('cards')); await p.waitForTimeout(1500); L('PANEL AFTER', (await p.evaluate(() => ($('#tw-panel') || {}).innerText || 'MISSING')).slice(0, 600));
  L('DECK', await p.evaluate(() => { const c = deckCards('twr1'); return c.length + ' ' + JSON.stringify(c.slice(0, 3)); }));
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => startTW(2, 1, 2)); await p.waitForTimeout(2500); await p.screenshot({ path: SP + 'phone.png' });
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
