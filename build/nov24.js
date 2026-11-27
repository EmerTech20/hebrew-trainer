
// ---------- Nov 24: Ruth word by word (every word of Ruth 1–4, verse by verse) ----------
// For each verse, in order: every word as a flashcard (the verse on top with the word marked, the word, its pronunciation;
// the question in Hebrew + English), then, for a verb, the six parsing boxes for that same word, and at the end of the verse
// the whole verse to translate aloud (English behind a button). The text is the app's Ruth text with your professor's
// readings where his handout differs (RUTH_PROF). Meanings, grammar and parses come from the Hebrew Bible's morphology
// (the lexicon file) and the course lists; nothing is invented. Each word is also a card in the "Every word of Ruth N" decks.
const TW = { built: {}, pos: {}, opts: { parse: true, once: true } };
try { const p = lsGet('twpos'); if (p && typeof p === 'object') TW.pos = p; const o = lsGet('twopts'); if (o) TW.opts = { ...TW.opts, ...o }; } catch { }
const TW_Q = 'מַה פֵּרוּשׁ הַמִּלָּה?';
const TW_STEMS = new Set(['qal', 'niphal', 'piel', 'pual', 'hithpael', 'hiphil', 'hophal', 'hishtaphel']);
const twKey = w => 'tw|' + fvKey(w);
// The verse split into words and separators, keeping the order of lexWords so word k can be marked.
function twVerseHTML(he, k) {
  let n = -1;
  return String(he).split(/([\s־]+)/).map(part => {
    if (/^[\s־]+$/.test(part) || !part) return esc(part);
    const clean = part.replace(/[׃.,;:!?“”"'()\[\]]/g, '');
    if (!/[א-ת]/.test(clean)) return esc(part);
    n++; return n === k ? `<b style="color:var(--accent);text-decoration:underline;text-underline-offset:6px">${esc(part)}</b>` : esc(part);
  }).join('');
}
// All words of one verse with their analysis (the professor's reading shown; the Bible's form analysed).
function twVerseWords(c, v) {
  const row = (RUTH.verses[String(c)] || []).find(x => +x[0] === +v); if (!row) return null;
  const orig = String(row[1]).normalize('NFC'), prof = ruthProf(String(c), v, orig);
  const wo = lexWords(orig), wp = lexWords(prof), same = wo.length === wp.length;
  const words = wp.map((w, i) => {
    const o = same ? wo[i] : w, variant = fvKey(o) !== fvKey(w);
    let a = null; try { a = analyzeWord(o); } catch (e) { console.error(e); }
    // The professor teaches וַיִּשְׁתַּחוּ as Hishtaphel of חוה (the Bible database's root is שׁחה): his root is the key; the grader also accepts שׁחה.
    let ps = []; try { ps = (lexParses(o) || []).filter(p => TW_STEMS.has(p.stem) && p.conj).map(p => p.stem === 'hishtaphel' ? { ...p, root: 'חוה' } : p); } catch { }
    const seen = new Set(); ps = ps.filter(p => { const k = p.stem + p.conj + p.pgn + p.root; if (seen.has(k)) return false; seen.add(k); return true; });
    let en = '';
    if (ps.length && a) { try { en = formEnglish({ form: o, root: ps[0].root, stem: ps[0].stem, conj: ps[0].conj, pgn: ps[0].pgn, gloss: a.meaning.replace(/ — subject:.*$/, '').replace(/^.*\+ /, '').replace(/ \(root meaning;[^)]*\)/, '') }); } catch { } }
    return { w, o, i, variant, a, ps, en, key: twKey(w) };
  });
  return { c, v, he: prof, orig, en: RUTH_EN[c + ':' + v] || '', words };
}
const TW_FIX = { 'עוֹד': ['a going round', 'again, still, yet; any more'] };
function twMeaning(x) {
  const a = x.a; if (!a) return 'not found in the dictionary: look it up in your lexicon';
  let m = String(a.meaning || '').trim(); const fx = TW_FIX[a.lemma]; if (fx) m = m.replace(fx[0], fx[1]);
  if (!m || m === '—') return 'not found in the dictionary: look it up in your lexicon';
  return m.replace(/^probably: /, '') + (/^probably/.test(m) || /uncertain/.test(a.how || '') ? ' (uncertain: check your lexicon)' : '');
}
const TW_SPELL = { qal: 'Qal', niphal: 'Niphal', piel: 'Piel', pual: 'Pual', hithpael: 'Hithpael', hiphil: 'Hiphil', hophal: 'Hophal', hishtaphel: 'Hishtaphel' };
const TW_CONJ = { qatal: 'qatal (perfect)', weqatal: 'weqatal', yiqtol: 'yiqtol (imperfect)', weyiqtol: 'weyiqtol', wayyiqtol: 'wayyiqtol', impv: 'imperative', ptc: 'participle', inf: 'infinitive' };
function twParseText(p) { return `${TW_SPELL[p.stem] || p.stem} ${TW_CONJ[p.conj] || p.conj}${p.pgn ? ' ' + p.pgn : ''} · root ${spaced(p.root)}`; }
function twBackHTML(x, V, later) {
  const a = x.a || {};
  if (later) return `<div class="stack" style="gap:6px;text-align:left">
    <div style="font-size:1.25rem"><b>${esc(x.en || twMeaning(x))}</b></div>
    ${x.en ? `<div class="small"><b>Word by word:</b> ${heWrap(esc(twMeaning(x).replace(/ — subject:.*$/, '')))}</div>` : ''}
    <div class="small muted">This is a verb: you parse it on the next screen. The stem, form, person, root and dictionary form are shown there after your answer.</div></div>`;
  const parse = x.ps.length ? x.ps.map(twParseText).join(' <span class="muted">or</span> ') : '';
  return `<div class="stack" style="gap:6px;text-align:left">
    <div style="font-size:1.25rem"><b>${esc(x.en || twMeaning(x))}</b></div>
    ${x.en ? `<div class="small"><b>Word by word:</b> ${heWrap(esc(twMeaning(x)))}</div>` : ''}
    <div class="small"><b>Grammar:</b> ${parse ? heWrap(parse) + (a.grammar && / · /.test(a.grammar) ? ' <span class="muted">(' + heWrap(esc(a.grammar.split(' · ').slice(1).join(' · '))) + ')</span>' : '') : heWrap(esc(a.grammar || 'not found'))}</div>
    <div class="small">${a.lemma ? `<b>Dictionary form:</b> ${H(esc(a.lemma))}${PRi(a.lemma)}` : ''}${a.root ? ` · <b>root</b> ${H(esc(a.root))}` : ''}${a.src ? ` <span class="muted">· ${esc(a.src)}</span>` : ''}</div>
    ${a.how && !/uncertain/.test(a.how) ? `<div class="small muted">${heWrap(esc(a.how))}</div>` : ''}
    ${x.variant ? `<div class="small note">Your professor’s text reads ${H(esc(x.w))} here; the printed Bible has ${H(esc(x.o))}. The analysis above is of ${H(esc(x.o))}.</div>` : ''}
  </div>`;
}
// Items for a range of verses.
async function twItems(c, v1, v2) {
  await lexLoad();
  const items = [], once = new Set();
  for (let v = v1; v <= v2; v++) {
    const V = twVerseWords(c, v); if (!V) continue;
    for (const x of V.words) {
      const dup = once.has(fvKey(x.w)); once.add(fvKey(x.w));
      if (dup && TW.opts.once) continue;
      items.push({ kind: 'twcard', key: x.key, card: x.key, c, v, k: x.i, n: V.words.length, x, V, parseNext: !!(TW.opts.parse && x.ps.length && !x.variant), t: 'vocab', skill: 'vocab', front: x.w, back: x.en || twMeaning(x), ref: `Ruth ${c}:${v}` });
      if (TW.opts.parse && x.ps.length && !x.variant) {
        const p = x.ps[0], alts = x.ps.slice(1).map(q => ({ stem: q.stem, conj: q.conj, pgn: q.pgn, root: q.root }));
        const gl = (x.a && x.a.meaning || '').replace(/ — subject:.*$/, '').replace(/^.*\+ /, '').replace(/ \(root meaning;[^)]*\)/, '');
        items.push({ kind: 'parse', key: 'twp|' + x.w, cid: 'twp:' + AN.hash(x.w), form: x.w, root: p.root, stem: p.stem, conj: p.conj, pgn: p.pgn, ...(alts.length ? { alts } : {}), gloss: gl, gl, ...(x.en ? { en: x.en } : {}), ref: `Ruth ${c}:${v}`, ctx: V.he, sec: 'parse', cat: 'review', t: p.stem === 'qal' ? 'qal_strong' : PB_STEM_TOPIC[p.stem] || p.stem, why: 'Ruth word by word: parse the word you just saw.' });
      }
    }
    items.push({ kind: 'twverse', c, v, V, t: 'translation', key: 'twv|' + c + ':' + v });
  }
  return items;
}
async function startTW(c, v1, v2) {
  flash('Preparing every word of Ruth ' + c + ':' + v1 + '–' + v2 + '…');
  let items = []; try { items = await twItems(c, v1, v2); } catch (e) { console.error(e); flash('Could not prepare the words: ' + (e.message || e)); return; }
  if (!items.length) return flash('No words found for that passage.');
  startSession({ title: `Ruth ${c}:${v1}–${v2} word by word (${items.filter(i => i.kind === 'twcard').length} cards, ${items.filter(i => i.kind === 'parse').length} verbs to parse)`, items, back: 'cards', noVary: true, mode: 'practice', tw: { c, v1, v2 } });
}
function twSaveOpts() { try { lsSet('twopts', TW.opts); } catch { } }
function drawTWCard(it) {
  const v = $('#v-session'); SES.answered = false; startTimer(it); const x = it.x;
  v.innerHTML = `${sessHead()}<div class="panel qbox" style="max-width:780px;width:100%;margin:0 auto">
    <div class="row" style="justify-content:space-between"><span class="chip acc">Ruth ${it.c}:${it.v} · word ${it.k + 1} of ${it.n}</span><span class="small muted">${it.again ? 'again: you missed it a moment ago' : 'say the meaning aloud, then show the answer'}</span></div>
    <div class="he" dir="rtl" lang="he" style="font-size:1.3rem;line-height:2;margin:8px 0">${twVerseHTML(it.V.he, it.k)}</div>
    <div class="form-big" lang="he" style="text-align:center">${esc(x.w)}</div><div style="text-align:center">${PR(x.w)}</div>
    <p style="text-align:center"><b lang="he" dir="rtl">${TW_Q}</b>${PRi(TW_Q)} <span class="muted">(What does the word mean?)</span></p>
    <div id="tw-back" hidden class="panel">${twBackHTML(x, it.V, it.parseNext)}</div></div>
    <div class="row" id="ctl" style="justify-content:center;margin-top:12px"><button class="btn primary" id="tw-show">Show the answer</button></div>`;
  rxWireExit();
  const show = () => {
    if (!$('#tw-back') || !$('#tw-back').hidden) return; $('#tw-back').hidden = false; it._ms = activeMs(it);
    $('#ctl').innerHTML = `<button class="btn" id="tw-no">I did not know it</button><button class="btn primary" id="tw-yes">I knew it</button>`;
    const done = ok => {
      if (SES.answered) return; SES.answered = true;
      try { rateCard(it.key, ok ? 2 : 0); } catch (e) { console.error(e); }
      SES.results.push({ t: 'vocab', score: ok ? 1 : 0, it });
      try { logEvent({ kind: 'card', card: it.key, t: 'vocab', front: x.w, back: it.back, ref: it.ref, _rating: ok ? 'good' : 'again' }, ok ? 1 : 0, { mode: 'flashcard', sc: 'self', ms: it._ms, sid: SES.sid }); } catch (e) { console.error(e); }
      try { if (Math.random() < .35) record('vocab', ok ? 1 : 0); } catch { }
      if (!ok && !it.again) { let j = SES.i + 1, seen = 0; while (j < SES.items.length && seen < 5) { if (SES.items[j].kind === 'twcard') seen++; j++; } SES.items.splice(j, 0, { ...it, again: true }); }
      nextBtn();
    };
    $('#tw-no').onclick = () => done(false); $('#tw-yes').onclick = () => done(true);
    $('#tw-yes').focus();
  };
  $('#tw-show').onclick = show; $('#tw-show').focus();
}
function drawTWVerse(it) {
  const v = $('#v-session'), V = it.V; SES.answered = true;
  const rows = V.words.map(x => `<tr><td class="he" dir="rtl" lang="he" style="font-size:1.1rem;white-space:nowrap">${esc(x.w)}</td><td class="small">${heWrap(esc(x.en || twMeaning(x)))}</td><td class="small muted">${x.ps.length ? esc(twParseText(x.ps[0]).split(' · ')[0]) : esc(((x.a && x.a.grammar) || '').split(' · ')[0])}</td></tr>`).join('');
  const last = it.c && SES.tw && it.v === SES.tw.v2;
  v.innerHTML = `${sessHead()}<div class="panel stack" style="max-width:820px;width:100%;margin:0 auto">
    <div class="eyebrow">The whole verse · Ruth ${it.c}:${it.v}</div>
    <div class="he" dir="rtl" lang="he" style="font-size:1.45rem;line-height:2">${esc(V.he)}</div>
    <p><b lang="he" dir="rtl">תַּרְגֵּם אֶת הַפָּסוּק.</b>${PRi('תַּרְגֵּם אֶת הַפָּסוּק')} <span class="muted">(Translate the verse aloud, then open the English.)</span></p>
    <details><summary class="btn sm" style="display:inline-block">Show the English</summary><p style="margin-top:8px">${esc(V.en || 'English not available for this verse.')}</p></details>
    <details><summary class="small">Every word of the verse with its meaning</summary><table class="small" style="width:100%;margin-top:6px">${rows}</table></details>
  </div><div class="row" id="ctl" style="justify-content:center;margin-top:12px"><button class="btn primary" id="tw-next">${last ? 'Finish' : 'Next verse'}</button></div>`;
  rxWireExit(); window.scrollTo({ top: 0 });
  $('#tw-next').onclick = () => { TW.pos[it.c] = it.v; try { lsSet('twpos', TW.pos); } catch { } SES.i++; drawItem(); };
  $('#tw-next').focus();
}
(function () {
  const _di = drawItem;
  drawItem = function () {
    if (SES && SES.i < SES.items.length) { const it = SES.items[SES.i]; if (it && it.kind === 'twcard') return drawTWCard(it); if (it && it.kind === 'twverse') return drawTWVerse(it); }
    return _di.apply(this, arguments);
  };
})();
// Decks: every different word of each chapter, in text order (same cards as the word-by-word sessions).
function twDeckCards(c) {
  if (TW.built[c]) return TW.built[c];
  if (!window.LEX_L || TW.busy) return [];
  TW.busy = true; try {
  const out = [], seen = new Set();
  for (const [v] of (RUTH.verses[String(c)] || [])) { const V = twVerseWords(c, +v); if (!V) continue; for (const x of V.words) { const k = fvKey(x.w); if (seen.has(k)) continue; seen.add(k);
    out.push({ key: x.key, front: x.w, back: x.en || twMeaning(x), extra: `Ruth ${c}:${v} · ${x.ps.length ? twParseText(x.ps[0]) : ((x.a && x.a.grammar) || '')}`, topic: 'vocab' }); } }
  return (TW.built[c] = out);
  } finally { TW.busy = false; }
}
// Not registered in DECKS: courseIndex() reads every DECKS list as course vocabulary, and these meanings come from the analysis itself.
(function () {
  const _dc = deckCards, _dn = deckName;
  deckCards = function (id) { const m = /^twr([1-4])$/.exec(id || ''); return m ? twDeckCards(+m[1]) : _dc.apply(this, arguments); };
  deckName = function (id) { const m = /^twr([1-4])$/.exec(id || ''); return m ? `Every word of Ruth ${m[1]}` : _dn.apply(this, arguments); };
})();
function twStats(c) {
  const cards = twDeckCards(c); const now = Date.now(); let known = 0, missed = 0, due = 0, seen = 0;
  for (const k of cards) { const st = S.cards[k.key]; if (!st) continue; seen++; if (st.reps > 0) known++; else missed++; if (st.due <= now) due++; }
  const tokens = (RUTH.verses[String(c)] || []).reduce((s, r) => s + lexWords(r[1]).length, 0);
  return { n: cards.length, tokens, known, missed, due, seen };
}
function twPanelHTML() {
  if (!window.LEX_L) return `<div class="panel" id="tw-panel"><h2>Ruth word by word</h2><p class="small muted">Loading the dictionary…</p></div>`;
  const ch = c => {
    const s = twStats(c), nv = (RUTH.verses[String(c)] || []).length, pos = +(TW.pos[c] || 0), next = Math.min(pos + 1, nv);
    const chunks = (RUTH_CHUNK[c] || [[1, nv]]).map(([a, b]) => `<button class="btn sm" data-tw="${c},${a},${b}">${c}:${a}–${b}</button>`).join('');
    return `<div class="panel deck"><div class="row" style="justify-content:space-between"><h3>Ruth ${c}</h3><span class="small muted">${nv} verses · ${s.tokens} words (${s.n} different)</span></div>
      ${s.n ? levelsBar({ total: s.n, strong: 0, fam: s.known, learn: s.missed, new: s.n - s.known - s.missed }) : ''}
      <div class="small">${s.known} known · ${s.missed} to work on · ${s.n - s.seen} not seen yet</div>
      <div class="row" style="flex-wrap:wrap;gap:6px"><button class="btn primary sm" data-tw="${c},${pos >= nv ? 1 : next},${Math.min(nv, (pos >= nv ? 1 : next) + 5)}">${pos >= nv ? 'Start again at ' + c + ':1' : pos ? 'Continue at ' + c + ':' + next : 'Start at ' + c + ':1'}</button>${chunks}<button class="btn sm" data-tw="${c},1,${nv}">Whole chapter</button></div>
      <div class="row" style="gap:6px">${s.seen ? `<button class="btn sm" data-twrev="twr${c}">Review the words that are due (${s.due})</button>` : ''}<button class="btn sm" data-twtest="twr${c}">Memorization test</button></div></div>`;
  };
  return `<div class="panel" id="tw-panel" style="border:2px solid var(--accent)">
    <h2>Ruth word by word · every word, verse by verse</h2>
    <p class="small">For each verse: every word as a flashcard (the verse on top with the word marked), then the parsing boxes for each verb, and at the end the whole verse to translate aloud. The text follows your professor’s handout where it differs from the printed Bible. Words you miss come back a few cards later.</p>
    <div class="row small" style="gap:14px"><label class="row"><input type="checkbox" id="tw-o-parse" ${TW.opts.parse ? 'checked' : ''}> Parse each verb after its card</label><label class="row"><input type="checkbox" id="tw-o-once" ${TW.opts.once ? 'checked' : ''}> A word repeated in the same round: only the first time</label></div>
    <div class="grid2" style="margin-top:8px">${[1, 2, 3, 4].map(ch).join('')}</div></div>`;
}
function twWire(root) {
  $$('[data-tw]', root).forEach(b => b.onclick = e => { e.preventDefault(); const [c, a, z] = b.dataset.tw.split(',').map(Number); startTW(c, a, z); });
  $$('[data-twrev]', root).forEach(b => b.onclick = () => startReview(b.dataset.twrev));
  $$('[data-twtest]', root).forEach(b => b.onclick = () => startMemTest(b.dataset.twtest));
  const p = $('#tw-o-parse', root), o = $('#tw-o-once', root);
  if (p) p.onchange = () => { TW.opts.parse = p.checked; twSaveOpts(); };
  if (o) o.onchange = () => { TW.opts.once = o.checked; twSaveOpts(); };
}
(function () {
  const _rc = renderCards;
  renderCards = async function () {
    const r = await _rc.apply(this, arguments);
    try { const v = $('#v-cards'); if (v && !$('#tw-panel', v)) { const h1 = v.querySelector('.legend'); (h1 || v.firstElementChild).insertAdjacentHTML(h1 ? 'beforebegin' : 'afterend', twPanelHTML()); twWire(v);
      if (!window.LEX_L) lexLoad().then(() => { if (S.tab === 'cards') { const p = $('#tw-panel'); if (p) { p.outerHTML = twPanelHTML(); twWire($('#v-cards')); } } }).catch(() => { }); } } catch (e) { console.error(e); }
    return r;
  };
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    const h = _fc.apply(this, arguments);
    const card = `<div class="step" style="border:2px solid var(--accent);border-radius:10px;padding:8px"><span class="n">•</span><div><b>Ruth word by word · every word of Ruth 1–4</b><div class="small muted">Flashcard for each word, verse by verse, then the parse of each verb and the whole verse to translate. ${[1, 2, 3, 4].map(c => TW.pos[c] ? `Ruth ${c}: up to v. ${TW.pos[c]}` : '').filter(Boolean).join(' · ') || 'Not started yet.'}</div></div><div class="stack" style="gap:6px;flex:0 0 auto;min-width:150px"><button class="btn primary" data-twopen="1" style="white-space:nowrap">Open</button></div></div>`;
    return h.replace('<div class="plan">', '<div class="plan">' + card);
  };
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-twopen]'); if (!t) return; e.preventDefault(); go('cards'); setTimeout(() => { const p = $('#tw-panel'); if (p) p.scrollIntoView({ block: 'start' }); }, 400); });
})();
