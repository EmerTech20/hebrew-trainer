// UI + data inventory for the documentation (no changes to the app).
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/doc/';
const U21 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-21b.json', 'utf8'));
const U23 = JSON.parse(fs.readFileSync('/mnt/user-data/outputs/hebrew-update-2026-11-23.json', 'utf8'));
const R0 = Date.now(); const res = { tabs: {}, data: {}, errors: [] };
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(([t, r]) => { const D = Date; const off = t - r; class MD extends D { constructor(...a) { if (!a.length) super(D.now() + off); else super(...a); } static now() { return D.now() + off; } } window.Date = MD; }, [new Date('2026-11-24T12:30:00').getTime(), R0]);
  const p = await ctx.newPage(); p.on('dialog', d => d.accept()); p.on('pageerror', e => res.errors.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(3000);
  await p.evaluate(async ([a, c]) => { await importDocs(a.docs); await importDocs(c.docs); }, [U21, U23]); await p.waitForTimeout(800);
  const outline = () => { const v = document.querySelector('section.view:not([hidden])'); const out = [];
    const walk = el => { for (const c of el.children) { if (c.hidden || getComputedStyle(c).display === 'none') continue; const t = c.tagName;
      if (/^H[1-4]$/.test(t)) out.push(t + ': ' + c.innerText.trim().replace(/\s+/g, ' ').slice(0, 160));
      else if (t === 'BUTTON' || (t === 'A' && c.getAttribute('href') === '#')) { const d = [...c.attributes].filter(a => /^data-|^id$/.test(a.name)).map(a => a.name + (a.value && a.value.length < 30 ? '=' + a.value : '')).join(' '); out.push('  [' + c.innerText.trim().replace(/\s+/g, ' ').slice(0, 90) + '] ' + d); }
      else if (t === 'LABEL') out.push('  (label) ' + c.innerText.trim().replace(/\s+/g, ' ').slice(0, 140));
      else if (t === 'SELECT') out.push('  (select ' + (c.id || '') + ') ' + [...c.options].map(o => o.text).slice(0, 12).join(' | '));
      else if (t === 'INPUT' && c.type !== 'checkbox' && c.type !== 'hidden') out.push('  (input ' + c.type + ' ' + (c.id || '') + ') ' + (c.placeholder || ''));
      else if (c.classList && (c.classList.contains('eyebrow'))) out.push('  ~' + c.innerText.trim().slice(0, 100));
      else walk(c); } };
    if (v) walk(v); return out.join('\n'); };
  const TABS = ['today', 'rescue', 'cards', 'practice', 'read', 'progress', 'prep', 'library', 'settings'];
  for (const t of TABS) { await p.evaluate(t => go(t), t); await p.waitForTimeout(t === 'progress' ? 4000 : 1500); res.tabs[t] = await p.evaluate(outline);
    fs.writeFileSync(OUT + 'tab_' + t + '.txt', res.tabs[t]); fs.writeFileSync(OUT + 'tabtext_' + t + '.txt', await p.evaluate(() => (document.querySelector('section.view:not([hidden])') || document.body).innerText)); }
  res.nav = await p.evaluate(() => [...document.querySelectorAll('nav button, nav a, .tabs button, header button')].map(b => b.innerText.trim() + ' ' + (b.dataset.tab || b.id || '')).join(' | '));
  res.data = await p.evaluate(() => { const L = x => { try { return typeof x === 'function' ? 'fn' : Array.isArray(x) ? x.length : x && typeof x === 'object' ? Object.keys(x).length : x; } catch { return '?'; } }; const g = n => { try { return eval(n); } catch { return undefined; } };
    const o = {}; for (const n of ['VOCAB', 'TERMS', 'PARSE_BANK', 'MCQ', 'TOPICS', 'COMPQ', 'PATTERN_Q', 'LOOKALIKE', 'REVIEW_SLIDES', 'DG1', 'RP_DEF', 'SQ_SETS', 'RT_DEF', 'BLUEPRINTS', 'DECKS', 'PLAN_ACT', 'SCHEDULE', 'STORY_CHS', 'RUTH_PROF', 'TRANS', 'WEAK_AREAS', 'CONCEPTS', 'LESSONS', 'RC_SETS', 'PCARDS', 'XV_STEMHE']) o[n] = L(g(n));
    try { o.RUTH = { verses: Object.fromEntries(Object.entries(RUTH.verses).map(([k, v]) => [k, v.length])), verbs: (RUTH.verbs || []).length, vocab: (RUTH.vocab || []).length }; } catch (e) { o.RUTH = String(e); }
    try { o.PBANK = { verses: PBANK.verses.length, verbs: (PBANK.verbs || []).length }; } catch { }
    try { o.blueprints = Object.values(BLUEPRINTS).map(b => b.id + ': ' + b.name + ' · ' + (typeof b.minutes === 'function' ? b.minutes() : b.minutes) + ' min · ' + Object.entries(b.sections || {}).map(([k, s]) => k + ' n=' + s.n + ' w=' + s.w).join(', ')); } catch (e) { o.blueprints = String(e); }
    try { o.decks = Object.entries(DECKS).map(([k, d]) => k + ': ' + d.name + ' — ' + (d.sub || '') + ' (' + d.cards().length + ')'); } catch (e) { o.decks = String(e); }
    try { o.planActs = Object.keys(PLAN_ACT); } catch { }
    try { o.topics = TOPICS.map(t => t.id + ' · ' + t.name + ' · ' + (t.status || '')); } catch (e) { o.topics = String(e); }
    try { o.schedule = SCHEDULE.map(e => e.d + ' ' + e.t); } catch { }
    try { o.settings = S.prog.settings; } catch { }
    try { o.ls = Object.keys(localStorage).map(k => k + ' ' + (localStorage.getItem(k) || '').length); } catch { }
    for (const d of ['2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25']) { try { o['plan_' + d] = planBlockList(d).map(b => `${b.id} ${b.min}m ${b.title}`); } catch (e) { o['plan_' + d] = String(e); } }
    return o; });
  res.data.dbpaths = await p.evaluate(async () => { try { const d = await HET.dump(); const ks = Object.keys(d.docs || d); const grp = {}; ks.forEach(k => { const g = k.split('/')[0]; grp[g] = (grp[g] || 0) + 1; }); return grp; } catch (e) { return String(e); } });
  fs.writeFileSync(OUT + 'inventory.json', JSON.stringify(res, null, 1)); console.log('ok', res.errors.length, Object.keys(res.tabs).map(t => t + ':' + res.tabs[t].length).join(' '));
  await b.close(); })();
