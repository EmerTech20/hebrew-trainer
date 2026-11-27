const { chromium } = require('playwright'); const fs = require('fs');
const SP = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/';
const DAY = process.argv[2] || '2026-11-21';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block', viewport: { width: 1000, height: 1300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.addInitScript(d => { const D = Date; const t0 = new D(d + 'T19:00:00').getTime(), s = D.now(); window.Date = class extends D { constructor(...a) { if (a.length) super(...a); else super(t0 + (D.now() - s)); } static now() { return t0 + (D.now() - s); } }; }, DAY);
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const bk = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-trainer-my-progress-2026-11-04.json', 'utf8'));
  await p.evaluate(async d => importDocs(d), bk.docs);
  const upd = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-20b.json', 'utf8')); await p.evaluate(async d => importDocs(d), upd.docs);
  await p.reload(); await p.waitForTimeout(3000);
  console.log('help setting:', await p.evaluate(() => S.prog.settings.help), '| no-ai:', await p.evaluate(() => document.body.classList.contains('no-ai')), '| tutor tab visible:', await p.isVisible('.tab[data-tab="tutor"]'));
  // 6. alternatives
  console.log(await p.evaluate(() => {
    const T = [['בָּא', 'בוא', 'qal', 'qatal', '3ms', { p: '', g: 'm', n: 's', conj: 'ptc', stem: 'qal', root: 'בוא' }],
      ['בָּא', 'בוא', 'qal', 'ptc', 'ms', { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'בוא' }],
      ['קָמָה', 'קום', 'qal', 'qatal', '3fs', { p: '', g: 'f', n: 's', conj: 'ptc', stem: 'qal', root: 'קום' }],
      ['מַהֵר', 'מהר', 'piel', 'impv', '2ms', { p: '', g: '', n: '', conj: 'inf', stem: 'piel', root: 'מהר' }],
      ['דַּבֵּר', 'דבר', 'piel', 'inf', '', { p: '2', g: 'm', n: 's', conj: 'impv', stem: 'piel', root: 'דבר' }],
      ['נִשְׁמָר', 'שׁמר', 'niphal', 'ptc', 'ms', { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'niphal', root: 'שמר' }],
      ['נִשְׁבָּר', 'שׁבר', 'niphal', 'ptc', 'ms', { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'niphal', root: 'שבר' }],
      ['נִשְׁמַר', 'שׁמר', 'niphal', 'qatal', '3ms', { p: '', g: 'm', n: 's', conj: 'ptc', stem: 'niphal', root: 'שמר' }],
      ['וַיָּקָם', 'קום', 'qal', 'wayyiqtol', '3ms', { p: '', g: 'm', n: 's', conj: 'ptc', stem: 'qal', root: 'קום' }],
      ['וּבָא', 'בוא', 'qal', 'weqatal', '3ms', { p: '', g: 'm', n: 's', conj: 'ptc', stem: 'qal', root: 'בוא' }],
      ['מְדַבֵּר', 'דבר', 'piel', 'ptc', 'ms', { p: '2', g: 'm', n: 's', conj: 'impv', stem: 'piel', root: 'דבר' }],
      ['בָּא', 'בוא', 'qal', 'qatal', '3ms', { p: '3', g: 'm', n: 's', conj: 'qatal', stem: 'qal', root: 'בוא' }]];
    return T.map(([form, root, stem, conj, pgn, sel]) => { const g = gradeParse({ form, root, stem, conj, pgn }, sel); return `${form} ${conj} ${pgn} answered ${sel.conj} → ${Math.round(g.score * 100)}% ${g.altWhy || ''}`; }).join('\n');
  }));
  // 1. readiness
  console.log('READY:', await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = readinessHTML(); return d.innerText.replace(/\s+/g, ' ').slice(0, 900); }));
  // 3. plan
  console.log('PLAN:', await p.evaluate(() => rescueBlocks().map(b => `${b.id}: ${b.title}`).join(' | ')));
  // 2. practice tab card, rescue lessons
  await p.evaluate(() => go('practice')); await p.waitForTimeout(1200);
  console.log('MM:', (await p.innerText('#mm-card')).slice(0, 300).replace(/\n+/g, ' | '));
  await p.evaluate(() => go('today')); await p.waitForTimeout(1500);
  console.log('cy-mock:', await p.evaluate(() => (document.getElementById('cy-mock') || {}).textContent));
  console.log('RX exam drills:', await p.evaluate(() => RX_LESSONS.find(L => L.id === 'exam').drills.map(d => d[0]).join(' / ')), '| ruth4 lesson:', await p.evaluate(() => !!RL.ruth4 && RX_LESSONS.some(L => L.id === 'ruth4')));
  console.log('TOPICS:', await p.evaluate(() => ['pual', 'hophal', 'hithpael'].map(id => { const d = document.createElement('div'); d.innerHTML = TOPICS.find(t => t.id === id).notes; return id + ': ' + d.innerText.slice(0, 160); }).join('\n')));
  // 13
  console.log('PX:', await p.evaluate(() => PX['הוֹלִיד'][4] + ' || ' + PX['יוֹצִיא'][4]));
  // 8. classification of every English question
  console.log(await p.evaluate(() => {
    const banks = { MCQ, DAGESH_MC, BINYAN_MC, FORM_MC, PART_MC, STRICT_MC, SUFFIX_ROLE, PATTERNS, ACC_MC };
    const out = []; const cnt = {};
    for (const [n, arr] of Object.entries(banks)) arr.forEach(x => { const h = qhFor(x.q || ''); if (!h) return; const k = h.full ? 'FULL' : h.he.split(' ')[0] + ' ' + (h.he.split(' ')[2] || ''); cnt[k] = (cnt[k] || 0) + 1; if (h.full || Math.random() < .05) out.push(`${n}: ${String(x.q).replace(/<[^>]*>/g, '').slice(0, 70)} ⇒ ${h.he}`); });
    return JSON.stringify(cnt) + '\n' + out.slice(0, 40).join('\n');
  }));
  // Draw an MC item and a flash card
  await p.evaluate(() => { const it = MCQ.find(x => /What does/.test(x.q)); startSession({ title: 't', items: [{ ...it, kind: 'mc' }], back: 'today', mode: 'practice' }); }); await p.waitForTimeout(800);
  console.log('MC CARD:', (await p.innerText('.qbox')).slice(0, 250).replace(/\n+/g, ' | '));
  await p.screenshot({ path: SP + 'mc1121.png', clip: { x: 0, y: 0, width: 1000, height: 600 } });
  await p.evaluate(() => { const it = BINYAN_MC[1]; startSession({ title: 't', items: [{ ...it, kind: 'mc' }], back: 'today', mode: 'practice' }); }); await p.waitForTimeout(800);
  console.log('MC CARD 2:', (await p.innerText('.qbox')).slice(0, 250).replace(/\n+/g, ' | '));
  // Read tab numbering, Ch. 18
  await p.evaluate(() => { const d = S.lib.find(l => l.kind === 'story' && +l.chapter === 18); go('read', d && d.id); }); await p.waitForTimeout(2500);
  console.log('READ 18:', await p.evaluate(() => { const n = [...document.querySelectorAll('#r-lines .ln[data-i] .no')].map(x => x.textContent); return n.length + ' lines; ' + n.slice(8, 14).join(',') + ' … ' + n.slice(-3).join(','); }), '|', await p.evaluate(() => (document.querySelector('#r-lines').parentElement.querySelector('.small.muted') || {}).textContent));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
