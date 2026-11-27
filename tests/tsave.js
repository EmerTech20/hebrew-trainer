const { chromium } = require('playwright'); const fs = require('fs');
const U21 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
const U23 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-23.json', 'utf8'));
const R0 = Date.now();
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 1100, height: 1000 } });
  await ctx.addInitScript(([t, r]) => { const D = Date; const off = t - r; class MD extends D { constructor(...a) { if (!a.length) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } } window.Date = MD; }, [new Date('2026-11-24T09:00:00').getTime(), R0]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1])); p.on('dialog', d => d.accept());
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  await p.evaluate(async ([a, c]) => { await importDocs(a.docs); await importDocs(c.docs); }, [U21, U23]);
  const L = (k, v) => console.log('== ' + k + ': ' + String(typeof v === 'string' ? v : JSON.stringify(v)).replace(/\n+/g, ' | ').slice(0, 900));
  // 1) storage full: local storage refuses the draft
  await p.evaluate(() => { const _s = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (/^het:exam$/.test(k) && v !== 'null') throw new DOMException('quota', 'QuotaExceededError'); return _s.call(this, k, v); }; });
  await p.evaluate(() => startRP('rp1')); await p.waitForTimeout(1500); await p.click('#ex-go'); await p.waitForTimeout(400);
  await p.evaluate(() => { EX.ans[0] = { conj: 'inf', stem: 'qal', root: 'בנה', p: '-', g: '-', n: '-' }; EX.ans[1] = { conj: 'impv', stem: 'hiphil', root: 'שלך', p: '2', g: 'm', n: 's' }; EX.cur = 2; exSave(); renderExam(); });
  await p.waitForTimeout(1500);
  L('WARNING SHOWN', await p.evaluate(() => ($('#n23-warn') || {}).innerText || 'none'));
  L('LOCAL DRAFT', await p.evaluate(() => localStorage.getItem('het:exam') ? 'present' : 'absent'));
  await p.reload(); await p.waitForTimeout(3500);
  L('AFTER RELOAD: resume offered', await p.evaluate(() => { const t = $('#v-today') ? $('#v-today').innerText : ''; return /Resume|resume/.test(t) ? 'yes' : 'no: ' + t.slice(0, 200); }));
  L('DRAFT FROM DB', await p.evaluate(() => { const d = lsGet('exam'); return d ? `${d.type} cur=${d.cur} answers=${Object.keys(d.ans || {}).length}` : 'none'; }));
  await p.evaluate(() => resumeExam()); await p.waitForTimeout(800);
  L('RESUMED', await p.evaluate(() => EX ? `${EX.type} cur=${EX.cur} a0=${JSON.stringify(EX.ans[0])}` : 'no EX'));
  await p.evaluate(() => { EX = null; lsSet('exam', null); }); await p.waitForTimeout(800);
  L('AFTER CANCEL draft', await p.evaluate(() => JSON.stringify(lsGet('exam'))));
  // 2) folder save (the browser's private file system stands in for the chosen folder)
  await p.evaluate(async () => { N23FS.dir = await navigator.storage.getDirectory(); N23FS.perm = 'granted'; await n23FsSaveAll(); });
  L('FOLDER after save', await p.evaluate(async () => { const out = []; for await (const [n, h] of N23FS.dir.entries()) out.push(n + ' ' + (await h.getFile()).size); return out.join(', '); }));
  await p.evaluate(() => startRT('rt1')); await p.waitForTimeout(1500); await p.click('#ex-go'); await p.waitForTimeout(300);
  await p.evaluate(() => { EX.ans[0] = { strict: 'x', text: 'And she arose to glean' }; exSave(); }); await p.waitForTimeout(6500);
  L('DRAFT FILE during test', await p.evaluate(async () => { const t = await n23FsRead('hebrew-trainer-test-in-progress.json'); const j = JSON.parse(t); return j.ex ? `${j.ex.type} a0=${j.ex.ans[0].text}` : 'empty'; }));
  await p.click('#ex-sub'); await p.waitForTimeout(300); await p.click('#ex-yes'); await p.waitForTimeout(4000);
  L('DRAFT FILE after submit', await p.evaluate(async () => { const j = JSON.parse(await n23FsRead('hebrew-trainer-test-in-progress.json')); return j.ex ? 'NOT EMPTY' : 'empty'; }));
  L('PROGRESS FILE', await p.evaluate(async () => { const j = JSON.parse(await n23FsRead('hebrew-trainer-progress.json')); return `${j.app} docs=${Object.keys(j.docs).length} assessments=${Object.keys(j.docs).filter(k => /^assessments\//.test(k)).length}`; }));
  await p.evaluate(() => go('settings')); await p.waitForTimeout(600); L('SETTINGS', await p.evaluate(() => $('#n23fs-panel').innerText));
  await p.evaluate(() => go('today')); await p.waitForTimeout(600); L('TODAY strip', await p.evaluate(() => $('#n23fs-today').innerText));
  L('PLAN 24', await p.evaluate(() => planBlockList('2026-11-24').map(b => `${b.id} ${b.min}`).join(' | ') + ' = ' + planBlockList('2026-11-24').reduce((s, b) => s + b.min, 0) + ' min'));
  // 3) report: four parts + label + printable html
  L('REPORT', await p.evaluate(() => { const r = new Report('Weekly report: test'); r.h2('Exam trajectory'); r.text('Independent score 41% on 25 unseen items'); r.table(['Measure', 'Value'], [['Independent score', '41%']]); r.pdf(); return N23.lastReport.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 700); }));
  // 4) question words, story practice exam conditions
  L('QWCAT', await p.evaluate(() => [qwCat('בְּמִי בָּטְחוּ הָעָם?'), qwCat('לְפִי יְהוֹנָתָן, מָה עָשָׂה דָוִד?')]));
  await p.evaluate(() => startSP(16)); await p.waitForTimeout(1500); await p.check('#sp-nolines'); await p.click('#ex-go'); await p.waitForTimeout(400);
  L('SP no lines', await p.evaluate(() => { const i = EX.items.findIndex(x => x.kind === 'write'); EX.cur = i; renderExam(); const t = $('.qbox').innerText; return (/line \d/.test(t) ? 'LINE SHOWN' : 'no line label') + ' · highlight ' + (!!document.querySelector('.fs-hl')); }));
  await p.evaluate(() => { EX = null; lsSet('exam', null); });
  await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => go('rescue')); await p.waitForTimeout(1200);
  L('MOBILE rescue width', await p.evaluate(() => document.documentElement.scrollWidth));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
