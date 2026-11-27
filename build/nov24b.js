

// ---------- Nov 24 (evening): Ruth 1–4 word cards, three faces (GPT's word list, checked) ----------
// One word, three faces: 1 meaning (four English choices, nothing revealed) → 2 parse with Hebrew-only buttons (every
// field the key supports is required; אֵינִי יוֹדֵעַ counts as missed) → 3 both graded field by field, with the pieces of
// the word and the verse. The list (271 words of Ruth 1–4) comes ONLY from the private update file (doc ruthvq/bank).
// Progress of full rounds: doc ruthvq/progress3 (IndexedDB + browser copy + save check). The earlier one-face quiz
// (doc ruthvq/progress, meaning only) is kept apart and never counted as parsing.
const RVQ = { opts: { ch: 0, order: 'weak' }, P: null, warn: '' };
try { const o = lsGet('rvqopts'); if (o) RVQ.opts = { ...RVQ.opts, ...o }; } catch { }
const RVQ_PATH = 'ruthvq/progress3', RVQ_OLD = 'ruthvq/progress', RVQ_BANK = 'ruthvq/bank';
// Meaning-only answers from before the three faces: the app's one-face quiz (ruthvq/progress) and GPT's standalone quiz
// (imported into ruthvq/legacy-gpt). Kept apart; they only raise a word's priority when it was missed, never give parsing credit.
const RVQ_GPT = 'ruthvq/legacy-gpt';
const rvqOld = () => { try { const a = HET.live(RVQ_OLD) || lsGet('rvqprog'), g = HET.live(RVQ_GPT); const w = {};
  if (a && a.w) for (const [id, r] of Object.entries(a.w)) w[id] = { s: r.s || 0, ok: r.ok || 0, bad: r.bad || 0 };
  if (g && g.responses) for (const [id, r] of Object.entries(g.responses)) { const x = w[id] = w[id] || { s: 0, ok: 0, bad: 0 }; x.s += r.seen || 0; x.ok += r.correct || 0; x.bad += r.wrong || 0; }
  return Object.keys(w).length ? { w } : null; } catch { return null; } };
const rvqBank = () => { try { const d = HET.live(RVQ_BANK); return d && Array.isArray(d.items) && d.items.length ? d : null; } catch { return null; } };
function rvqLoad() {
  let a = null, b = null; try { a = HET.live(RVQ_PATH); } catch { } try { b = lsGet('rvqprog3'); } catch { }
  const ok = x => x && typeof x === 'object' && x.w && typeof x.n === 'number';
  RVQ.P = ok(a) && ok(b) ? (b.n > a.n ? b : a) : ok(a) ? a : ok(b) ? b : { v: 3, n: 0, w: {} };
  return RVQ.P;
}
function rvqRec(id) { const P = RVQ.P || rvqLoad(); return P.w[id] || null; }
function rvqNeed(it, r) { return Math.max(it.minimumPresentations || 1, r && r.need || 0); }
function rvqDone(it, r) { if (!r) return false; return r.s >= rvqNeed(it, r) && (!r.bad || (r.streak || 0) >= 2); }
function rvqLeft(it, r) { const need = rvqNeed(it, r), s = r ? r.s : 0; return Math.max(0, need - s) + (r && r.bad && s >= need && (r.streak || 0) < 2 ? 2 - (r.streak || 0) : 0); }
async function rvqSave() {
  const P = RVQ.P; P.u = Date.now();
  try { lsSet('rvqprog3', P); } catch { }
  try { await HET.write(RVQ_PATH, P); } catch (e) { RVQ.warn = 'Your progress could not be saved: ' + (e.message || e); }
  // Check that the database really holds it (the app's own save reports success before the database finishes).
  setTimeout(() => {
    try {
      const r = indexedDB.open('hebrew-trainer'); r.onsuccess = () => { try { const db = r.result, tx = db.transaction(db.objectStoreNames[0], 'readonly'), q = tx.objectStore(db.objectStoreNames[0]).get(RVQ_PATH);
        q.onsuccess = () => { const ok = q.result && q.result.d && q.result.d.u === P.u; RVQ.warn = ok ? '' : 'Your Ruth word-card progress was not confirmed in the app’s database. A copy is in this browser; download a backup (Settings) to be safe.'; const w = document.getElementById('rvq-warn'); if (w) { w.textContent = RVQ.warn; w.hidden = !RVQ.warn; } db.close(); };
        q.onerror = () => { RVQ.warn = 'Could not check the save.'; }; } catch (e) { } };
      r.onerror = () => { RVQ.warn = 'The app’s database is not available in this browser; progress is only in browser storage.'; };
    } catch { }
  }, 1200);
}
// ---- Choosing the words for a session
function rvqPool(filter) {
  const B = rvqBank(); if (!B) return [];
  return B.items.filter(it => (!RVQ.opts.ch || it.chapter === RVQ.opts.ch) && (!filter || filter(it)));
}
function rvqPick(n, how) {
  const P = RVQ.P || rvqLoad(); const pool = rvqPool(how === 'repair' ? it => it.priority === 'personal-repair' || (rvqRec(it.id) || {}).bad : null);
  if (!pool.length) return [];
  const st = new Map(pool.map(it => { const r = P.w[it.id]; return [it.id, { it, r, due: r ? (r.due || 0) : -1, left: rvqLeft(it, r) }]; }));
  let open = [...st.values()].filter(x => x.left > 0); if (!open.length && how !== 'full') open = [...st.values()]; // all done: free review
  const order = RVQ.opts.order, out = [], recent = [], gap = Math.min(8, Math.max(0, open.length - 1));
  let t = P.n; const OLD = (rvqOld() || { w: {} }).w, oldBad = x => ((OLD[x.it.id] || {}).bad ? 1 : 0);
  const textOrder = (a, b) => oldBad(b) - oldBad(a) || (b.it.priority === 'personal-repair') - (a.it.priority === 'personal-repair') || a.it.chapter - b.it.chapter || ((+a.it.reference.split(':')[1]) - (+b.it.reference.split(':')[1])) || a.it.id.localeCompare(b.it.id);
  const tOrder = (a, b) => a.it.chapter - b.it.chapter || ((+a.it.reference.split(':')[1]) - (+b.it.reference.split(':')[1])) || a.it.id.localeCompare(b.it.id);
  const weak = x => (x.r ? x.r.bad * 3 - x.r.ok * 0.5 : 0) + (oldBad(x) ? 1.5 : 0) + (x.it.priority === 'personal-repair' ? 2 : 0) + (x.r && x.r.last_ok === false ? 3 : 0);
  open.forEach(x => { x.real = !!x.r; });
  for (let k = 0; k < n; k++) {
    const free = open.filter(x => !recent.includes(x.it.id) && x.left > 0);
    if (!free.length) break;
    // (a) words already answered before and due now · (b) words never shown · (c) words repeated in this session
    const A = free.filter(x => x.real && x.due <= t).sort((a, b) => weak(b) - weak(a));
    const Bn = free.filter(x => !x.real && !x.inSes).sort(how === 'full' ? tOrder : textOrder);
    const C = free.filter(x => x.inSes && x.due <= t).sort((a, b) => weak(b) - weak(a) || a.due - b.due);
    const later = free.slice().sort((a, b) => a.due - b.due);
    let tiers;
    if (how === 'full') tiers = k % 4 === 3 ? [A, C, Bn] : [Bn, A, C];
    else if (order === 'new') tiers = [Bn, A, C];
    else if (order === 'weak') tiers = [A, Bn, C];
    else tiers = k % 2 ? [A, C, Bn] : [Bn, A, C];
    const x = (tiers.find(z => z.length) || later)[0];
    out.push(x.it); recent.push(x.it.id); if (recent.length > gap) recent.shift();
    x.left--; x.inSes = true; x.due = t + 9 + Math.floor(Math.random() * 6); t++;
  }
  return out;
}
// ---- Four meanings: no two that say the same thing
const RVQ_STOP = new Set('a an the and of to for in on at by with from he she it they we you i me my his her their your our was were is are be been will would let not no one this that who which there as or so'.split(' '));
const rvqWords = s => new Set(String(s).toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z\-]+/).map(w => w.replace(/s$/, '')).filter(w => w.length > 2 && !RVQ_STOP.has(w)));
function rvqOptions(it) {
  const B = rvqBank(), mine = rvqWords(it.meaning), used = [mine], out = [it.meaning];
  const same = (a, b) => [...a].some(w => b.has(w));
  const pool = B.items.filter(x => x.id !== it.id && x.meaning && x.meaning !== it.meaning && x.hebrew !== it.hebrew);
  const pref = pool.filter(x => x.type === it.type && x.chapter === it.chapter), rest = pool.filter(x => !pref.includes(x));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  for (const x of [...shuffle(pref), ...shuffle(rest)]) { if (out.length >= 4) break; const w = rvqWords(x.meaning); if (!w.size || used.some(u => same(u, w)) || out.includes(x.meaning)) continue; used.push(w); out.push(x.meaning); }
  return shuffle(out.map((o, i) => ({ o, ok: i === 0 })));
}
// ---- Three faces for one word: 1 meaning (4 English choices, no feedback) → 2 parse in Hebrew (every field required,
// Hebrew-only buttons) → 3 both graded, field by field, with the pieces of the word and the verse. Nothing about the
// answer is shown before face 3. Both stages are recorded separately (vocabulary; each parsing field; root).
const RVQ_GUF = { '1': 'רִאשׁוֹן', '2': 'שֵׁנִי', '3': 'שְׁלִישִׁי', '—': 'לֹא שַׁיָּךְ' };
const RVQ_MIG = { M: 'זָכָר', F: 'נְקֵבָה', C: 'מְשֻׁתָּף', '—': 'לֹא שַׁיָּךְ' };
const RVQ_MIS = { S: 'יָחִיד', P: 'רַבִּים', D: 'זוּגִי', '—': 'לֹא שַׁיָּךְ' };
const RVQ_BIN = { qal: 'קַל', niphal: 'נִפְעַל', piel: 'פִּעֵל', pual: 'פֻּעַל', hiphil: 'הִפְעִיל', hophal: 'הָפְעַל', hithpael: 'הִתְפַּעֵל' };
const RVQ_NET = { qatal: 'קָטַל', yiqtol: 'יִקְטֹל', wayyiqtol: 'וַיִּקְטֹל', weqatal: 'וְקָטַל', impv: 'צִוּוּי', ptc: 'בֵּינוֹנִי', inf: 'שֵׁם פֹּעַל' };
const RVQ_PRON = { '1CS': 'אֲנִי', '1CP': 'אֲנַחְנוּ', '2MS': 'אַתָּה', '2FS': 'אַתְּ', '2MP': 'אַתֶּם', '2FP': 'אַתֶּן', '3MS': 'הוּא', '3FS': 'הִיא', '3MP': 'הֵם', '3FP': 'הֵן' };
const RVQ_POS = ['שֵׁם עֶצֶם', 'שֵׁם תֹּאַר', 'מִלַּת יַחַס', 'תֹּאַר הַפֹּעַל', 'שֵׁם פְּרָטִי', 'מִלַּת שְׁלִילָה', 'מִלַּת שְׁאֵלָה', 'מִלַּת חִבּוּר', 'שֵׁם מִסְפָּר'];
const RVQ_FL = { guf: ['גּוּף', 'person'], migdar: ['מִגְדָּר', 'gender'], mispar: ['מִסְפָּר', 'number'], binyan: ['בִּנְיָן', 'stem'], netiyyah: ['נְטִיָּה', 'verbal form'], shoresh: ['שֹׁרֶשׁ', 'root'], pos: ['סוּג הַמִּלָּה', 'part of speech'], sfx: ['כִּנּוּי חָבוּר', 'attached pronoun (suffix)'] };
const rvqLetters = s => String(s || '').normalize('NFD').replace(/[^א-ת]/g, '').replace(/[ךםןףץ]/g, c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' })[c]);
const rvqFinal = s => s.replace(/[כמנפצ]$/, c => ({ 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' })[c]);
function rvqConj(n) { const l = String(n || '').toLowerCase(); return /wayyiqtol/.test(l) ? 'wayyiqtol' : /weqatal|waw \+ qatal/.test(l) ? 'weqatal' : /yiqtol|cohortative|jussive/.test(l) ? 'yiqtol' : /qatal/.test(l) ? 'qatal' : /imperative/.test(l) ? 'impv' : /participle/.test(l) ? 'ptc' : /infinitive/.test(l) ? 'inf' : ''; }
const rvqShuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// Plausible wrong roots: weak-letter swaps first (ו/י, נ/י first letter, ה last, doubled), then roots of the list that share two letters.
function rvqRootOpts(root) {
  const r = rvqLetters(root), out = [r], add = x => { x = rvqLetters(x); if (x.length >= 2 && x.length <= 4 && !out.includes(x)) out.push(x); };
  const v = [];
  if (r.length === 3) {
    if (r[1] === 'ו') v.push(r[0] + 'י' + r[2]); if (r[1] === 'י') v.push(r[0] + 'ו' + r[2]);
    if (r[0] === 'י') v.push('נ' + r.slice(1), 'ו' + r.slice(1)); if (r[0] === 'נ') v.push('י' + r.slice(1));
    if (r[2] === 'ה') v.push(r.slice(0, 2) + 'י', r.slice(0, 2) + 'א'); if (r[2] === 'א') v.push(r.slice(0, 2) + 'ה');
    if (r[1] === r[2]) v.push(r[0] + 'ו' + r[1]); if (r[1] === 'ו' || r[1] === 'י') v.push(r[0] + r[2] + r[2]);
    if (r[0] === 'ה' || r[0] === 'ת' || r[0] === 'מ') v.push(r.slice(1) + 'ה');
  }
  rvqShuffle(v).forEach(add);
  const B = rvqBank(); const roots = [...new Set(B.items.filter(x => x.type === 'verb').map(x => rvqLetters(x.parse.shoresh)))];
  const share = x => [...x].filter((c, i) => r[i] === c).length;
  rvqShuffle(roots.filter(x => share(x) >= 2)).forEach(x => out.length < 4 && add(x));
  rvqShuffle(roots).forEach(x => out.length < 4 && add(x));
  return rvqShuffle(out.slice(0, 4)).map(x => [x, rvqFinal(x)]);
}
// The fields asked on face 2 and their right answers (only fields the key supports; nothing invented).
function rvqFields(it) {
  if (it.type === 'verb') {
    const p = it.parse, conj = rvqConj(p.netiyyah), stem = String(p.binyan || '').toLowerCase().replace('hitpael', 'hithpael');
    const F = [
      { k: 'guf', opts: Object.entries(RVQ_GUF), right: p.guf },
      { k: 'migdar', opts: Object.entries(RVQ_MIG), right: p.migdar },
      { k: 'mispar', opts: Object.entries(RVQ_MIS).filter(([k]) => k !== 'D'), right: p.mispar },
      { k: 'binyan', opts: Object.entries(RVQ_BIN), right: stem },
      { k: 'netiyyah', opts: Object.entries(RVQ_NET), right: conj },
      { k: 'shoresh', opts: null, right: rvqLetters(p.shoresh) }];
    const sm = /suffix\s+(\d[MFC][SP])/i.exec(p.netiyyah || ''); if (sm) F.push({ k: 'sfx', opts: null, right: sm[1].toUpperCase() });
    return F;
  }
  const c = String((it.parse && it.parse.category) || it.grammar || ''), F = [];
  let pos = (c.match(/[א-ת][֑-ׇא-ת ]*[א-תְ-ׇ]/) || [''])[0].trim(); if (/^מִסְפָּר$/.test(pos)) pos = 'שֵׁם מִסְפָּר';
  const EN = { 'negative': 'מִלַּת שְׁלִילָה', 'prohibition': 'מִלַּת שְׁלִילָה', 'interrogative': 'מִלַּת שְׁאֵלָה', 'question': 'מִלַּת שְׁאֵלָה', 'preposition': 'מִלַּת יַחַס', 'adverb': 'תֹּאַר הַפֹּעַל', 'noun': 'שֵׁם עֶצֶם', 'adjective': 'שֵׁם תֹּאַר', 'conjunction': 'מִלַּת חִבּוּר', 'numeral': 'שֵׁם מִסְפָּר', 'name': 'שֵׁם פְּרָטִי' };
  const excl = new Set(RVQ_POS.filter(x => c.includes(x))); Object.entries(EN).forEach(([e, h]) => { if (c.toLowerCase().includes(e)) excl.add(h); });
  if (pos) F.push({ k: 'pos', opts: null, right: pos, excl: [...excl] });
  const en = c.toLowerCase().replace(/suffix\s+\d[mfc][sp]/g, '');
  const g = /masculine/.test(en) && !/feminine/.test(en) ? 'M' : /feminine/.test(en) && !/masculine/.test(en) ? 'F' : null; if (g) F.push({ k: 'migdar', opts: Object.entries(RVQ_MIG).filter(([k]) => k !== 'C'), right: g });
  const n = /dual/.test(en) ? null : /singular/.test(en) && !/plural/.test(en) ? 'S' : /plural/.test(en) && !/singular/.test(en) ? 'P' : null; if (n) F.push({ k: 'mispar', opts: Object.entries(RVQ_MIS).filter(([k]) => k !== 'D'), right: n });
  const sm = /suffix\s+(\d[MFC][SP])/i.exec(c); if (sm) F.push({ k: 'sfx', opts: null, right: sm[1].toUpperCase() });
  return F;
}
function rvqFieldOpts(it, f) {
  if (f.opts) return f.opts;
  if (f.k === 'shoresh') return rvqRootOpts(f.right);
  if (f.k === 'sfx') { const all = Object.keys(RVQ_PRON).filter(k => k !== f.right); return rvqShuffle([f.right, ...rvqShuffle(all).slice(0, 3)]).map(k => [k, RVQ_PRON[k]]); }
  if (f.k === 'pos') { const others = rvqShuffle(RVQ_POS.filter(x => x !== f.right && !(f.excl || []).includes(x))).slice(0, 3); return rvqShuffle([f.right, ...others]).map(x => [x, x]); }
  return [];
}
function rvqLabel(f, val) { const o = (f._opts || []).find(x => x[0] === val); return o ? o[1] : val === '?' ? 'אֵינִי יוֹדֵעַ' : val; }
function rvqPieces(it) { return `<ul class="small" style="margin:4px 0 0 18px">${String(it.morphology || '').split(/;\s*/).filter(Boolean).map(x => `<li>${heWrap(esc(x))}</li>`).join('')}</ul>`; }
function rvqVerseHTML(it) {
  const m = /(\d):(\d+)/.exec(it.reference || ''); if (!m) return '';
  const row = (RUTH.verses[m[1]] || []).find(r => +r[0] === +m[2]); if (!row) return '';
  const he = ruthProf(m[1], +m[2], String(row[1]).normalize('NFC'));
  const keys = String(it.hebrew).split(/[\s־]+/).map(rvqLetters).filter(Boolean);
  const html = he.split(/([\s־]+)/).map(part => { const c = rvqLetters(part); return c && keys.some(k => c.includes(k)) ? `<b style="color:var(--accent);text-decoration:underline;text-underline-offset:6px">${esc(part)}</b>` : esc(part); }).join('');
  const en = RUTH_EN[m[1] + ':' + m[2]] || '';
  return `<div class="eyebrow">Ruth ${m[1]}:${m[2]}</div><div class="he" dir="rtl" lang="he" style="font-size:1.25rem;line-height:2">${html}</div>${en ? `<p class="small" style="margin-top:4px"><b>3 · In context</b> (the whole verse in English; World English Bible): ${esc(en)}</p>` : ''}`;
}
// ---- Drawing the card
function rvqCur(it) { try { const c = lsGet('rvqcur'); return c && c.id === it.id ? c : null; } catch { return null; } }
function rvqKeep(it) { try { lsSet('rvqcur', { id: it.id, st: it._st, ts: Date.now() }); } catch { } }
function drawRVQ(it) {
  const v = $('#v-session'); SES.answered = false; startTimer(it);
  if (!it._st) { const c = rvqCur(it); it._st = c && c.st && c.st.face < 3 ? c.st : { face: 1, v: null, sel: {} }; }
  if (!it._opts) it._opts = it._st.vopts || rvqOptions(it); it._st.vopts = it._opts;
  if (!it._fields) { it._fields = rvqFields(it); it._fields.forEach(f => { f._opts = (it._st.fopts && it._st.fopts[f.k]) || rvqFieldOpts(it, f); }); it._st.fopts = Object.fromEntries(it._fields.map(f => [f.k, f._opts])); }
  const r = rvqRec(it.id);
  const tag = it.priority === 'personal-repair' ? `<span class="chip" style="background:var(--bad-soft);white-space:normal">Ruth 1 oral session (GPT) · ${rvqNeed(it, r)} rounds</span>` : r && r.bad ? `<span class="chip" style="background:var(--bad-soft);white-space:normal">missed before · ${rvqNeed(it, r)} rounds</span>` : '<span class="chip">chapter word</span>';
  const head = `<div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px"><span class="chip acc">Ruth ${esc(String(it.reference).replace('Ruth ', ''))} · face ${it._st.face} of 3</span>${tag}</div>
    <div class="form-big" lang="he" dir="rtl" style="text-align:center;margin-top:10px">${esc(it.hebrew)}</div><div style="text-align:center">${PR(it.hebrew)}</div>`;
  const face = it._st.face;
  let body = '';
  if (face === 1) {
    const Q = 'מַה מַשְׁמָעוּת הַמִּלָּה?';
    body = `<p style="text-align:center"><b lang="he" dir="rtl">${Q}</b>${PRi(Q)} <span class="muted">(What does the word mean?)</span></p>
      <div class="opts" id="rvq-o">${it._opts.map((o, i) => `<button class="opt" data-rq="${i}"><span class="muted">${i + 1}.</span> ${esc(o.o)}</button>`).join('')}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button class="btn ghost sm" id="rvq-idk1" lang="he">אֵינִי יוֹדֵעַ</button></div>`;
  } else if (face === 2) {
    const Q = 'נַתֵּחַ אֶת הַמִּלָּה.';
    body = `<p style="text-align:center"><b lang="he" dir="rtl">${Q}</b>${PRi(Q)} <span class="muted">(Parse the word: choose one answer in every row)</span></p>
      <div class="stack" style="gap:10px" dir="rtl">${it._fields.map(f => `<div><div class="he" style="font-weight:700">${RVQ_FL[f.k][0]}</div>
        <div class="row" style="flex-wrap:wrap;gap:6px;justify-content:flex-start">${f._opts.map(([val, lab]) => `<button class="btn sm rvq-f" data-f="${f.k}" data-v="${esc(val)}" aria-pressed="${it._st.sel[f.k] === val}" lang="he" style="font-size:1.05rem;${it._st.sel[f.k] === val ? 'background:var(--accent);color:var(--bg,#fff);border-color:var(--accent)' : ''}">${esc(lab)}</button>`).join('')}</div></div>`).join('')}</div>
      <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn ghost" id="rvq-idk2" lang="he">אֵינִי יוֹדֵעַ</button><button class="btn primary" id="rvq-sub" ${it._fields.every(f => it._st.sel[f.k] != null) ? '' : 'disabled'} lang="he">בְּדֹק</button></div>
      <p class="small muted" style="text-align:center">${it._fields.filter(f => it._st.sel[f.k] == null).length ? `${it._fields.filter(f => it._st.sel[f.k] == null).length} row(s) still to choose` : 'All rows chosen: press בְּדֹק (check)'}.</p>`;
  } else body = rvqFace3(it);
  v.innerHTML = `${sessHead()}<div class="panel qbox rvq-face" style="max-width:780px;width:100%;margin:0 auto">${head}${body}<div id="rvq-warn" class="small note" ${RVQ.warn ? '' : 'hidden'}>${esc(RVQ.warn)}</div></div>
    <div class="row" id="ctl" style="justify-content:center;margin-top:12px"></div>`;
  rxWireExit();
  if (face === 1) {
    const pick = i => { if (it._st.face !== 1) return; it._st.v = i; it._st.vms = activeMs(it); it._st.face = 2; rvqKeep(it); drawRVQ(it); };
    $$('#rvq-o .opt').forEach(b => b.onclick = () => pick(+b.dataset.rq)); $('#rvq-idk1').onclick = () => pick(-1);
    it._key = e => { if (S.tab === 'session' && it._st.face === 1 && SES.items[SES.i] === it && /^[1-4]$/.test(e.key)) pick(+e.key - 1); };
    document.addEventListener('keydown', it._key);
  } else if (face === 2) {
    if (it._key) { document.removeEventListener('keydown', it._key); it._key = null; }
    $$('.rvq-f').forEach(b => b.onclick = () => { it._st.sel[b.dataset.f] = b.dataset.v; rvqKeep(it); const y = window.scrollY; drawRVQ(it); window.scrollTo({ top: y }); });
    $('#rvq-idk2').onclick = () => { it._st.idk = true; rvqGrade(it); };
    $('#rvq-sub').onclick = () => { if (it._fields.every(f => it._st.sel[f.k] != null)) rvqGrade(it); };
  } else { SES.answered = true; nextBtn(); }
}
function rvqGrade(it) {
  if (it._st.face === 3) return; const st = it._st; st.face = 3; it._ms = activeMs(it);
  const vok = st.v != null && st.v >= 0 && !!it._opts[st.v].ok;
  const res = {}; it._fields.forEach(f => { const s = st.idk ? null : st.sel[f.k]; res[f.k] = f.k === 'shoresh' ? !!s && rvqLetters(s) === f.right : s === f.right; });
  const nOk = Object.values(res).filter(Boolean).length, all = it._fields.length, pok = nOk === all;
  st.res = res; st.vok = vok; st.nOk = nOk;
  // Progress: one complete encounter = both faces answered.
  const P = RVQ.P || rvqLoad(); const w = P.w[it.id] = P.w[it.id] || { s: 0, ok: 0, bad: 0, streak: 0, vok: 0, vbad: 0, pfull: 0, pbad: 0, f: {} };
  w.s++; P.n++; w.last = Date.now(); w.sess = SES.sid; w.vok += vok ? 1 : 0; w.vbad += vok ? 0 : 1; w.pfull += pok ? 1 : 0; w.pbad += pok ? 0 : 1;
  it._fields.forEach(f => { const a = w.f[f.k] = w.f[f.k] || [0, 0]; a[0] += res[f.k] ? 1 : 0; a[1]++; });
  const both = vok && pok; w.last_ok = both;
  if (both) { w.ok++; w.streak = (w.streak || 0) + 1; w.due = P.n + 10 + Math.floor(Math.random() * 6); }
  else { w.bad++; w.streak = 0; w.need = Math.max(rvqNeed(it, w), 5, w.s + 2); w.due = P.n + 8 + Math.floor(Math.random() * 5); w.flag = 1; }
  P.g = P.g || { v: [0, 0], p: [0, 0], f: {} }; P.g.v[0] += vok ? 1 : 0; P.g.v[1]++; P.g.p[0] += pok ? 1 : 0; P.g.p[1]++;
  it._fields.forEach(f => { const a = P.g.f[f.k] = P.g.f[f.k] || [0, 0]; a[0] += res[f.k] ? 1 : 0; a[1]++; });
  rvqSave(); try { localStorage.removeItem('het:rvqcur'); } catch { }
  if (!both) { const j = SES.i + 9; if (j <= SES.items.length) SES.items.splice(j, 0, { ...it, _st: null, _opts: null, _fields: null, _key: null, again: true }); }
  SES.results.push({ t: 'vocab', score: vok ? 1 : 0, it }); SES.results.push({ t: 'parse', score: nOk / all, it });
  // Events: the meaning (multiple choice) and the parse, recorded separately.
  try { logEvent({ kind: 'mc', t: 'vocab', q: `Meaning of ${it.hebrew} (${it.reference})`, o: it._opts.map(o => o.o), a: it._opts.findIndex(o => o.ok), _chosenRaw: st.v >= 0 ? st.v : null, form: it.hebrew, he: it.hebrew, ref: it.reference }, vok ? 1 : 0, { ms: st.vms, sid: SES.sid, mode: 'practice' }); } catch (e) { console.error(e); }
  try {
    if (it.type === 'verb') { const p = it.parse, pgn = ['guf', 'migdar', 'mispar'].map(k => p[k] === '—' ? '' : p[k]).join('').toLowerCase();
      const ev = { kind: 'parse', t: 'parse', form: it.hebrew, root: rvqLetters(p.shoresh), stem: String(p.binyan).toLowerCase().replace('hitpael', 'hithpael'), conj: rvqConj(p.netiyyah), pgn, ref: it.reference,
        _res: st.idk ? null : { root: res.shoresh, stem: res.binyan, conj: res.netiyyah, p: res.guf, g: res.migdar, n: res.mispar },
        _sel: st.idk ? {} : { root: st.sel.shoresh, stem: st.sel.binyan, conj: st.sel.netiyyah, p: st.sel.guf, g: st.sel.migdar, n: st.sel.mispar } };
      logEvent(ev, nOk / all, { ms: it._ms, sid: SES.sid, mode: 'practice' });
    } else logEvent({ kind: 'mc', t: 'nominal', q: `Parse ${it.hebrew} (${it.reference})`, o: ['all fields right', 'not all right'], a: 0, _chosenRaw: pok ? 0 : 1, form: it.hebrew, he: it.hebrew, ref: it.reference }, nOk / all, { ms: it._ms, sid: SES.sid, mode: 'practice' });
  } catch (e) { console.error(e); }
  try { record('vocab', vok ? 1 : 0); record(it.type === 'verb' ? 'parse' : 'grammar', nOk / all); } catch { }
  drawRVQ(it);
}
function rvqFace3(it) {
  const st = it._st, r = rvqRec(it.id) || {}, right = it._opts.findIndex(o => o.ok);
  const mine = st.v != null && st.v >= 0 ? it._opts[st.v].o : 'אֵינִי יוֹדֵעַ (I don’t know)';
  const rows = it._fields.map(f => { const s = st.idk ? '?' : st.sel[f.k], ok = st.res[f.k];
    return `<tr style="background:${ok ? 'var(--good-soft)' : 'var(--bad-soft)'}"><td><b class="he">${RVQ_FL[f.k][0]}</b> <span class="small muted">${RVQ_FL[f.k][1]}</span></td><td class="he" style="font-size:1.05rem">${esc(rvqLabel(f, s))}</td><td class="he" style="font-size:1.05rem">${ok ? '✓' : '✗ ' + esc(rvqLabel(f, f.k === 'shoresh' ? f.right : f.right))}</td></tr>`; }).join('');
  const p = it.parse || {}, inf = it.type === 'verb' && rvqConj(p.netiyyah) === 'inf', ptc = it.type === 'verb' && rvqConj(p.netiyyah) === 'ptc';
  const sfx = it._fields.find(f => f.k === 'sfx');
  const notes = [];
  if (inf) notes.push('An infinitive has no person, gender or number of its own (לֹא שַׁיָּךְ).' + (sfx ? ' The ending is a pronoun suffix: it names the object or the owner, not a subject.' : ''));
  if (ptc) notes.push('A participle has gender and number but no person (גּוּף: לֹא שַׁיָּךְ).');
  if (sfx && !inf) notes.push(`The attached pronoun (${RVQ_PRON[sfx.right]}) is a separate piece: ${it.type === 'verb' ? 'the object of the verb, not its subject' : 'the owner (“his, her, your…”), not the gender or number of the word itself'}.`);
  return `<div class="panel" style="margin-top:8px;padding:10px">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap"><div><b>1 · Meaning</b> — you chose: <b>${heWrap(esc(mine))}</b> ${st.vok ? '<span style="color:var(--good)">✓</span>' : '<span style="color:var(--bad)">✗</span>'}</div><div>Right answer: <b>${esc(it._opts[right].o)}</b></div></div></div>
    <div style="margin-top:8px"><b>2 · Parsing</b> — ${st.idk ? 'you chose אֵינִי יוֹדֵעַ: counted as missed' : `${st.nOk} of ${it._fields.length} right`}
      <table class="small" style="width:100%;margin-top:4px"><tr class="muted"><td>Field</td><td>Your answer</td><td>Right answer</td></tr>${rows}</table>
      ${notes.length ? `<div class="small note">${notes.map(esc).join(' ')}</div>` : ''}
      ${it.type === 'verb' && it.db && it.db.length ? `<div class="small muted">Bible database (OSHB): ${heWrap(esc(it.db.join(' or ')))}${it.dbok ? ' · agrees with this key ✓' : ' · <b>differs from this key</b>'}</div>` : ''}
      ${it.type !== 'verb' ? '<div class="small muted">The noun/particle key comes from GPT’s list (Claude checked that the word is in the verse, not this analysis against your handout). Only the fields the key states are asked.</div>' : ''}</div>
    <div style="margin-top:8px"><b>The word piece by piece</b> <span class="small muted">(1 · each piece and its job)</span>${rvqPieces(it)}</div>
    <div class="small" style="margin-top:4px"><b>2 · The word itself:</b> ${esc(it.meaning)}${PRi(it.hebrew)}</div>
    <div class="panel" style="padding:8px;margin-top:6px">${rvqVerseHTML(it)}</div>
    ${(it.qa || []).length ? `<div class="small note"><b>Checked by Claude:</b> ${it.qa.map(q => heWrap(esc(q))).join(' ')}</div>` : ''}
    <div class="small muted">This word: ${r.s || 0} of ${rvqNeed(it, r)} full rounds · both right ${r.ok || 0} · missed ${r.bad || 0} · meaning ${r.vok || 0}/${(r.vok || 0) + (r.vbad || 0)} · parsing 6/6 ${r.pfull || 0}/${(r.pfull || 0) + (r.pbad || 0)}${rvqDone(it, r) ? ' · done ✓' : ''}</div>`;
}
(function () {
  const _di = drawItem;
  drawItem = function () {
    try { const prev = SES && SES.items && SES.items[SES.i - 1]; if (prev && prev._key) { document.removeEventListener('keydown', prev._key); prev._key = null; } } catch { }
    if (SES && SES.i < SES.items.length) { const it = SES.items[SES.i]; if (it && it.kind === 'rvq') return drawRVQ(it); }
    return _di.apply(this, arguments);
  };
})();
function startRVQ(n, how) {
  if (!rvqBank()) return flash('Import the private update file first (Settings → Import).');
  rvqLoad(); let words = rvqPick(n, how);
  const cur = (() => { try { return lsGet('rvqcur'); } catch { return null; } })();
  if (how === 'resume' && cur) { const it = rvqBank().items.find(x => x.id === cur.id); if (it) words = [it, ...rvqPick(14).filter(x => x.id !== it.id)]; }
  if (!words.length) return flash('Nothing left with these choices.');
  const items = words.map(it => ({ ...it, kind: 'rvq', key: 'rvq|' + it.id, t: 'vocab' }));
  const nm = how === 'full' ? 'full coverage' : how === 'repair' ? 'repair words' : how === 'resume' ? 'resumed' : items.length + ' words';
  startSession({ title: `Ruth word cards · ${nm}${RVQ.opts.ch ? ' · Ruth ' + RVQ.opts.ch : ''}`, items, back: 'cards', noVary: true, mode: 'practice' });
}
function rvqStats(ch) {
  const B = rvqBank(); const P = RVQ.P || rvqLoad(); const its = B.items.filter(x => !ch || x.chapter === ch);
  let seen = 0, done = 0, left = 0, rep = 0, repDone = 0, vok = 0, vn = 0, pf = 0, pn = 0;
  for (const it of its) { const r = P.w[it.id]; if (r) { seen++; vok += r.vok || 0; vn += (r.vok || 0) + (r.vbad || 0); pf += r.pfull || 0; pn += (r.pfull || 0) + (r.pbad || 0); } if (rvqDone(it, r)) done++; left += rvqLeft(it, r); if (it.priority === 'personal-repair') { rep++; if (rvqDone(it, r)) repDone++; } }
  return { n: its.length, seen, done, left, rep, repDone, vok, vn, pf, pn };
}
function rvqPanelHTML() {
  const B = rvqBank();
  if (!B) return `<div class="panel" id="rvq-panel"><h2>Ruth 1–4 word cards · meaning → parsing → correction</h2><p class="small">Turned off: the word list comes only in your private update file. Import <b>hebrew-update-2026-11-24.json</b> in Settings → “Import a backup or the file from the old app”.</p></div>`;
  rvqLoad(); const all = rvqStats(0), o = RVQ.opts, P = RVQ.P, g = P.g || { v: [0, 0], p: [0, 0], f: {} }, pc = a => a && a[1] ? Math.round(a[0] / a[1] * 100) + '% (' + a[0] + '/' + a[1] + ')' : '—';
  const old = rvqOld(); const oldN = old ? Object.keys(old.w).length : 0;
  const ch = c => { const s = rvqStats(c); return `<div class="small"><b>Ruth ${c}</b>: ${s.n} words · ${s.seen} practised · ${s.done} done · ${s.left} full rounds left</div>`; };
  const sel = (id, v, opts) => `<select id="${id}">${opts.map(([k, t]) => `<option value="${k}" ${String(v) === String(k) ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  let cur = null; try { cur = lsGet('rvqcur'); } catch { }
  return `<div class="panel" id="rvq-panel" style="border:2px solid var(--accent)">
    <h2>Ruth 1–4 word cards · meaning → parsing → correction</h2>
    <p class="small">One Hebrew word, three faces: <b>1</b> choose its English meaning (no answer shown yet) · <b>2</b> parse it with Hebrew buttons (every row required) · <b>3</b> both are corrected, field by field, with the pieces of the word and the verse. A word marked from your Ruth 1 oral session (by GPT) needs 5 full rounds; any miss makes a word need 5 and at least 2 more, spaced 8–15 cards apart.</p>
    <div class="small"><b>All:</b> ${all.n} words · ${all.seen} practised · ${all.done} done · <b>${all.left} full rounds left</b> · oral-session words done ${all.repDone}/${all.rep}</div>
    <div class="small"><b>Meaning:</b> ${pc(g.v)} · <b>Parsing all right:</b> ${pc(g.p)} · <b>Root:</b> ${pc(g.f.shoresh)} · person ${pc(g.f.guf)} · gender ${pc(g.f.migdar)} · number ${pc(g.f.mispar)} · stem ${pc(g.f.binyan)} · form ${pc(g.f.netiyyah)}</div>
    ${[1, 2, 3, 4].map(ch).join('')}
    ${oldN ? `<div class="small muted">Earlier meaning-only answers (the one-face quiz and GPT’s standalone quiz; kept separately, no parsing credit): ${oldN} words, ${Object.values(old.w).reduce((a, r) => a + r.bad, 0)} misses. A word missed there comes earlier here.</div>` : ''}
    <div class="row small" style="gap:10px;flex-wrap:wrap;margin-top:6px">
      <label>Chapter ${sel('rvq-ch', o.ch, [[0, 'Ruth 1–4'], [1, 'Ruth 1'], [2, 'Ruth 2'], [3, 'Ruth 3'], [4, 'Ruth 4']])}</label>
      <label>Order ${sel('rvq-ord', o.order, [['weak', 'Weak first'], ['bal', 'Balanced'], ['new', 'New first']])}</label></div>
    <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
      ${cur && cur.id ? `<button class="btn primary" data-rvq="15,resume">Resume the card in progress</button>` : ''}
      <button class="btn ${cur && cur.id ? '' : 'primary'}" data-rvq="15">Short: 15</button><button class="btn" data-rvq="30">Short: 30</button>
      <button class="btn" data-rvq="40,full">Full coverage (continue)</button><button class="btn" data-rvq="20,repair">Repair words</button></div>
    <div class="row small" style="gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" id="rvq-exp">Download this progress</button><label class="btn sm">Import progress<input type="file" id="rvq-imp" accept=".json" hidden></label><button class="btn sm" id="rvq-reset">Erase this progress…</button><span id="rvq-msg"></span></div>
    <div id="rvq-warn" class="small note" ${RVQ.warn ? '' : 'hidden'}>${esc(RVQ.warn)}</div>
    <details class="small"><summary>About this word list</summary><p>Made by GPT on Nov 24 from your Ruth handouts and quizzes; 138 Ruth 1 words were marked by GPT from your oral session (not confirmed one by one in the app’s records). Claude checked every word against the text of Ruth and the Bible database: ${B.corrections} corrections, each shown on its card; every verb key agrees with the database. The noun and particle keys are GPT’s. Not done yet: every inflected form of Ruth beyond these 271, the vowels named one by one, and questions on another form of the same root.</p></details></div>`;
}
function rvqWire(root) {
  const o = RVQ.opts, save = () => { try { lsSet('rvqopts', o); } catch { } };
  const re = () => { const p = $('#rvq-panel'); if (p) { p.outerHTML = rvqPanelHTML(); rvqWire($('#rvq-panel').parentElement); } };
  $$('[data-rvq]', root).forEach(b => b.onclick = () => { const [n, how] = b.dataset.rvq.split(','); startRVQ(+n, how); });
  const c = $('#rvq-ch', root), d = $('#rvq-ord', root);
  if (c) c.onchange = () => { o.ch = +c.value; save(); re(); }; if (d) d.onchange = () => { o.order = d.value; save(); };
  const ex = $('#rvq-exp', root); if (ex) ex.onclick = () => saveFile(`ruth-word-cards-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: 'hebrew-trainer', v: 1, exported: new Date().toISOString(), docs: { [RVQ_PATH]: { d: RVQ.P || rvqLoad(), u: Date.now() }, ...(rvqOld() ? { [RVQ_OLD]: { d: rvqOld(), u: Date.now() } } : {}) } }, null, 1));
  const im = $('#rvq-imp', root); if (im) im.onchange = async () => {
    try { const j = JSON.parse(await im.files[0].text());
      if (j.progress && j.progress.responses) { // GPT's standalone quiz: stored as meaning-only history
        const cur = HET.live(RVQ_GPT) || { responses: {} }; for (const [id, r] of Object.entries(j.progress.responses)) { const c = cur.responses[id]; if (!c || (r.seen || 0) > (c.seen || 0)) cur.responses[id] = { seen: r.seen || 0, correct: r.correct || 0, wrong: r.wrong || 0 }; }
        cur.exportedAt = j.exportedAt || null; cur.source = j.sourceBank || 'GPT standalone quiz'; await HET.write(RVQ_GPT, cur);
        $('#rvq-msg').textContent = `GPT’s quiz imported as meaning-only history: ${Object.keys(j.progress.responses).length} words (no parsing credit).`; setTimeout(re, 1200); return; }
      const inc = j.docs && j.docs[RVQ_PATH] && j.docs[RVQ_PATH].d; if (!inc || !inc.w) throw new Error('not a progress file of these word cards (older meaning-only files are not turned into parsing results)');
      const P = RVQ.P || rvqLoad(); for (const [id, r] of Object.entries(inc.w)) { const cur = P.w[id]; if (!cur || (r.s || 0) > (cur.s || 0)) P.w[id] = r; } P.n = Math.max(P.n, inc.n || 0); if (inc.g && (!P.g || inc.g.v[1] > P.g.v[1])) P.g = inc.g; await rvqSave(); $('#rvq-msg').textContent = 'Imported (for each word, the record with more rounds was kept).'; setTimeout(re, 800);
    } catch (e) { $('#rvq-msg').textContent = 'Could not import: ' + (e.message || e); } };
  const rs = $('#rvq-reset', root); if (rs) rs.onclick = () => {
    if (rs.dataset.armed) { RVQ.P = { v: 3, n: 0, w: {} }; rvqSave(); try { localStorage.removeItem('het:rvqcur'); } catch { } re(); flash('Ruth word-card progress erased (the earlier meaning-only answers are kept).'); return; }
    rs.dataset.armed = '1'; rs.textContent = 'Click again to erase all Ruth word-card progress'; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.armed; rs.textContent = 'Erase this progress…'; } }, 5000);
  };
}
(function () {
  const st = document.createElement('style'); st.textContent = '.rvq-face{animation:rvqflip .35s ease}@keyframes rvqflip{from{transform:perspective(900px) rotateY(70deg);opacity:.2}to{transform:none;opacity:1}}@media (prefers-reduced-motion:reduce){.rvq-face{animation:none}}'; document.head.appendChild(st);
  const _rc = renderCards;
  renderCards = async function () {
    const r = await _rc.apply(this, arguments);
    try { const v = $('#v-cards'); if (v && !$('#rvq-panel', v)) { const tw = $('#tw-panel', v); if (tw) tw.insertAdjacentHTML('afterend', rvqPanelHTML()); else v.insertAdjacentHTML('afterbegin', rvqPanelHTML()); rvqWire(v); } } catch (e) { console.error(e); }
    return r;
  };
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    const h = _fc.apply(this, arguments);
    let line = 'Turned on by the private update file of Nov 24.';
    try { if (rvqBank()) { const s = rvqStats(0); line = `Meaning → parsing in Hebrew → correction. ${s.seen} of ${s.n} words practised · ${s.left} full rounds left · oral-session words done ${s.repDone}/${s.rep}`; } } catch { }
    const card = `<div class="step" style="border:2px solid var(--accent);border-radius:10px;padding:8px"><span class="n">•</span><div><b>Ruth 1–4 word cards · three faces</b><div class="small muted">${line}</div></div><div class="stack" style="gap:6px;flex:0 0 auto;min-width:150px">${rvqBank() ? '<button class="btn primary" data-rvqgo="15" style="white-space:nowrap">15 words now</button>' : ''}<button class="btn" data-rvqopen="1" style="white-space:nowrap">Open</button></div></div>`;
    return h.replace('<div class="plan">', '<div class="plan">' + card);
  };
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-rvqopen],[data-rvqgo]'); if (!t) return; e.preventDefault();
    if (t.dataset.rvqgo) return startRVQ(+t.dataset.rvqgo);
    go('cards'); setTimeout(() => { const p = $('#rvq-panel'); if (p) p.scrollIntoView({ block: 'start' }); }, 400);
  });
})();
