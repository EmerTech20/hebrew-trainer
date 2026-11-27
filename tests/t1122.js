const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/t22/';
const WHEN = process.argv[2] || '2026-11-22T07:05:00';
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } });
  const R0 = Date.now(); await ctx.addInitScript(([t, r]) => { const D = Date; const off = t - r; class MD extends D { constructor(...a) { if (!a.length) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } } window.Date = MD; }, [new Date(WHEN).getTime(), R0]);
  const p = await ctx.newPage(); const errs = []; p.on('dialog', d => d.accept()); p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs);
  const bk = JSON.parse(fs.readFileSync('/mnt/user-data/attachments/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/3e3dd086-hebrew-trainer-backup-2026-11-21.json', 'utf8')); console.log('backup docs', await p.evaluate(async d => importDocs(d), bk.docs));
  await p.reload(); await p.waitForTimeout(3500);
  const log = (k, s) => console.log('== ' + k + '\n' + String(s).replace(/\n+/g, ' | ').slice(0, 1500));
  await p.evaluate(() => go('today')); await p.waitForTimeout(800);
  log('EXAMDATE', await p.evaluate(() => anSet().examDate + ' ' + JSON.stringify(SCHEDULE.slice(-2))));
  log('PLAN', await p.evaluate(() => ($('#plan-card') || {}).innerText));
  await p.screenshot({ path: SP + 'plan.png', fullPage: false });
  // block 1
  await p.click('[data-pb="vc"]'); await p.waitForTimeout(800); log('VC', await p.innerText('#v-session'));
  await p.evaluate(() => planBlocks().find(b => b.id === 'pgn').act()); await p.waitForTimeout(500); log('CHOOSER', await p.innerText('#v-session'));
  await p.screenshot({ path: SP + 'chooser.png' });
  await p.evaluate(() => startEightPrompts()); await p.waitForTimeout(500); log('P8', await p.evaluate(() => SES.items.length + ' items; ' + $('#v-session').innerText.slice(0, 300)));
  await p.evaluate(() => startContrastForms()); await p.waitForTimeout(500); log('CF', await p.evaluate(() => SES.items.length + ' items; ' + $('#v-session').innerText.slice(0, 300)));
  // rescue tab
  await p.evaluate(() => go('rescue')); await p.waitForTimeout(800); log('RESCUE', (await p.innerText('#v-rescue')).slice(0, 700));
  // Exam
  await p.evaluate(async () => { EX = null; lsSet('exam', null); await startFS('fs1'); }); await p.waitForTimeout(1200);
  log('INTRO', await p.innerText('#v-session')); await p.screenshot({ path: SP + 'intro.png' });
  await p.click('#ex-go'); await p.waitForTimeout(600);
  const fill = async () => { await p.evaluate(() => { const it = EX.items[EX.cur]; const a = EX.ans[EX.cur]; if (it.kind === 'parse') Object.assign(a, { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'אבג' }); else a.text = 'first answer'; exSave(); }); };
  await fill(); await p.click('#ex-next'); await p.waitForTimeout(300); await p.click('#ex-next'); await p.waitForTimeout(300); // skip Q2 → Q3
  await fill(); await p.click('#ex-flag'); await p.waitForTimeout(300);
  const trI = await p.evaluate(() => EX.items.findIndex(x => x.sec === 'translation'));
  await p.click(`[data-xs="${trI}"]`); await p.waitForTimeout(300);
  log('NAV', await p.evaluate(() => `cur ${EX.cur} sec ${EX.items[EX.cur].sec}; vis ${Object.keys(EX.vis).join(',')}; flag ${JSON.stringify(EX.flag)}`));
  await p.screenshot({ path: SP + 'taking.png' });
  await p.click('[data-xi="0"]'); await p.waitForTimeout(300);
  await p.evaluate(() => { EX.ans[0].conj = 'wayyiqtol'; EX.ans[0]._chg = 1; exSave(); });
  const el1 = await p.evaluate(() => exElapsed());
  await p.reload(); await p.waitForTimeout(3500);
  await p.evaluate(() => resumeExam()); await p.waitForTimeout(800);
  log('RESUME', await p.evaluate(e1 => `phase ${EX.phase}; elapsed before ${Math.round(e1 / 1000)}s now ${Math.round(exElapsed() / 1000)}s; ans0 ${JSON.stringify(EX.ans[0])}; ans2 ${JSON.stringify(EX.ans[2])}; gaps ${JSON.stringify(EX.gaps)}; interrupts ${EX.interrupts}`, el1));
  log('NO FEEDBACK while open', await p.evaluate(() => /correct|incorrect|✓|✗|Model answer/.test($('#v-session').innerText) ? 'LEAK: ' + $('#v-session').innerText.match(/.{0,40}(correct|incorrect|✓|✗|Model answer).{0,40}/)[0] : 'none'));
  // answer a comp question in Hebrew with the model, one with English, translation with the reference
  await p.evaluate(() => { EX.items.forEach((it, i) => { const a = EX.ans[i] = EX.ans[i] || {}; if (it.sec === 'comp' && i % 3 === 0) a.text = String(it.model).split(' — ')[0]; if (it.sec === 'comp' && i % 3 === 1) a.text = (String(it.model).split(' → ')[1] || '').split(' · ')[0]; if (it.sub === 'translate2' && i % 2) a.text = it.model; if (it.sec === 'syntax' && i % 2) a.text = it.model; }); exSave(); });
  await p.click('#ex-sub'); await p.waitForTimeout(500); log('OVERVIEW', await p.innerText('#ex-conf')); await p.screenshot({ path: SP + 'overview.png' });
  await p.click('#ex-yes'); await p.waitForTimeout(3000);
  log('REVIEW', (await p.innerText('#v-session')).slice(0, 1500)); await p.screenshot({ path: SP + 'review.png' });
  log('REC', await p.evaluate(() => { const r = fsResults('fs1').slice(-1)[0]; return `total ${r.total} est ${r.estimated} chk ${r.toCheck} scoring ${JSON.stringify(r.scoring)} statuses ${JSON.stringify(r.items.reduce((m, x) => (m[x.st] = (m[x.st] || 0) + 1, m), {}))} errs-on-blank ${r.items.filter(x => !x.answered && x.err.length).length} sections ${JSON.stringify(r.sections)} comp ${r.items.filter(x => x.sec === 'comp' && x.answered).map(x => x.score + '/' + (x.est || {}).conf).join(' ')} tr ${r.items.filter(x => x.sec === 'translation').map(x => x.score).join(' ')}`; }));
  await p.click('[data-rf="blank"]'); await p.waitForTimeout(200); log('FILTER blank', await p.evaluate(() => $$('.rv-item').filter(x => !x.hidden).length + ' of ' + $$('.rv-item').length));
  log('GRADEREQ', await p.evaluate(() => { const r = fsResults('fs1').slice(-1)[0]; const g = gradingRequest(r); return JSON.stringify(g).length + ' bytes; items ' + g.items.length + '; first ' + JSON.stringify(g.items[0]).slice(0, 300); }));
  // overlay
  await p.evaluate(async () => { const r = fsResults('fs1').slice(-1)[0]; await HET.db.doc('grades/' + r.id).set({ v: 'overlay-1', grader: 'Claude (test)', ts: Date.now(), items: { 1: { s: 1, fb: 'test overlay' } } }); renderExamReview(r); }); await p.waitForTimeout(800);
  log('OVERLAY', (await p.innerText('#v-session')).match(/Grades by[^|\n]*/)?.[0] + ' ; item1: ' + await p.evaluate(() => $('.rv-item[data-ri="1"]').innerText.replace(/\n+/g,' / ').slice(0,300)));
  log('ORIGINAL KEPT', await p.evaluate(() => { const r = fsResults('fs1').slice(-1)[0]; return `item1 stored ${r.items[0].score}; checksum ok ${AN.checksum(r) === r.checksum}`; }));
  // legacy sim1
  const s1 = await p.evaluate(() => { const r = S.assess.find(a => a.id === 'amwlfof49'); if (!r) return 'sim1 not found: ' + S.assess.map(a => a.id + ':' + a.type).join(','); renderExamReview(r); return 'ok ' + r.items.length + ' checksum ' + (AN.checksum(r) === r.checksum); }); log('SIM1', s1);
  await p.waitForTimeout(800);
  log('SIM1 items 4,9,14,16,19,22', await p.evaluate(() => [4, 9, 14, 16, 19, 22].map(n => { const el = $(`.rv-item[data-ri="${n}"]`); return n + ': ' + (el ? el.innerText.replace(/\n+/g, ' / ').match(/(Box by box.{0,260}|With today.{0,140}|No diagnosis.{0,40}|seen, left blank|not reached)/g) : 'missing'); }).join('\n')));
  await p.screenshot({ path: SP + 'sim1.png' });
  // timeout path
  await p.evaluate(async () => { await startFS('fs2'); EX.phase = 'taking'; EX.elapsed = EX.limitMs - 1500; exSave(); renderExam(); EX.ans[0] = { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'אבג' }; }); await p.waitForTimeout(4000);
  log('TIMEOUT', await p.evaluate(() => { const r = fsResults('fs2').slice(-1)[0]; return r ? `timeUp ${r.timeUp} statuses ${JSON.stringify(r.items.reduce((m, x) => (m[x.st] = (m[x.st] || 0) + 1, m), {}))}` : 'no record; phase ' + (EX && EX.phase); }));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
