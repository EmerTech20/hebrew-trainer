// ---------- Nov 22 (night): the final moves to Wed Nov 25; GPT's Sun–Wed plan; paper-like exam navigation; automatic grading; complete correction ----------
// Sources: GPT's “Ultimate Final Intensive Report” v2.1 + implementation brief (Nov 22, 00:26) and the parallel session report.
// Rules kept: historical records are never rewritten (new grades are overlays), no answers or grades before you submit,
// the professor's reported “1 point off per wrong or blank answer” is NOT applied until he confirms how it works.
const EXAM_DAY = '2026-11-25';
const SCORING_V = 'earned-credit-v2';

// ===== 1. Dates (only what lies ahead; past records keep their dates) =====
(function () {
  const _as = anSet;
  anSet = function () { const a = _as.apply(this, arguments); if (a && !a.v4) { if (a.examDate === '2026-11-23') a.examDate = EXAM_DAY; a.v4 = 1; } return a; };
  try {
    const f = SCHEDULE.find(x => x.target === 't-final');
    if (f) { f.d = EXAM_DAY; f.t = 'Your final (Wednesday, Nov 25)'; f.sub = 'Moved from Mon Nov 23 with the professor’s approval · time still to confirm · parsing 32 · Ruth translation 30 · story questions in Hebrew 26 · Ruth syntax 12'; }
    if (!SCHEDULE.some(x => x.d === '2026-11-23' && /class/i.test(x.t))) SCHEDULE.push({ d: '2026-11-23', t: 'Class final (the rest of the class)', sub: 'You take yours on Wednesday morning' });
    SCHEDULE.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
  } catch (e) { console.error(e); }
  RESCUE.final = EXAM_DAY;
  Object.assign(RX_DAY, { '2026-11-24': 8, '2026-11-25': 9 });
  RX_DAYS.splice(5, RX_DAYS.length - 5,
    ['2026-11-22', 'Sun 22', 'Retrieval, stems, forms + person/gender/number; every story (Ch. 14–22) and Ruth 1–4'],
    ['2026-11-23', 'Mon 23', 'Paper simulation (140 min) + the complete correction'],
    ['2026-11-24', 'Tue 24', 'Repairs: parses, story questions, Ruth translation + syntax'],
    ['2026-11-25', 'Wed 25', 'Exam morning: 20–35 minute warm-up only']);
  for (const k of Object.keys(typeof SIM_DEF !== 'undefined' ? SIM_DEF : {})) if (BLUEPRINTS[k] && !/diagnostic/.test(BLUEPRINTS[k].name)) BLUEPRINTS[k].name = BLUEPRINTS[k].name.replace(/^Final simulation (\d+)/, 'Practice final $1 (diagnostic, older 75-min format)');
})();

// ===== 2. The plan, Sun 22 – Wed 25 (GPT report §10; times are yours: Sunday 7–1 and 2–4:30; Mon/Tue movable) =====
function planChooser(id, title, why, opts) {
  const v = $('#v-session'); showSection('v-session'); v.classList.remove('exam');
  v.innerHTML = `<div class="panel stack" style="max-width:760px;margin:0 auto"><div class="eyebrow">Today’s plan · one block</div><h1 style="margin:0">${heWrap(esc(title))}</h1>${why ? `<p class="small">${heWrap(esc(why))}</p>` : ''}
    <div class="plan">${opts.map((o, i) => `<div class="step"><span class="n">${i + 1}</span><div><b>${heWrap(esc(o.t))}</b>${o.s ? `<div class="small muted">${heWrap(esc(o.s))}</div>` : ''}</div><button class="btn ${i ? '' : 'primary'}" data-och="${i}">Start</button></div>`).join('')}</div>
    <div class="row"><button class="btn primary" id="pc-done">Mark this block done</button><button class="btn ghost" id="pc-back">Back to Today</button></div></div>`;
  $$('[data-och]', v).forEach(b => b.onclick = async () => { const o = opts[+b.dataset.och]; try { await o.go(); } catch (e) { console.error(e); flash(String(e.message || e)); } if (SES) SES.back = 'today'; });
  $('#pc-done').onclick = () => { planMark(id); go('today'); };
  $('#pc-back').onclick = () => go('today');
}
const storyOpts = ch => [
  { t: `Ch. ${ch}: read the story aloud`, s: 'Read tab. Out loud, once; underline the verbs you cannot parse at sight.', go: () => { go('read'); try { renderRead('s' + ch); } catch { } } },
  { t: `Ch. ${ch}: 8 verbs (six boxes)`, s: 'Verbs from the story, with the line shown.', go: () => startStoryDrill({ ch, n: 8 }) },
  { t: `Ch. ${ch}: questions in Hebrew`, s: 'Answer in Hebrew by copying words from the story.', go: () => startStoryQuestions(ch, 6) },
];
const RUTH_CHUNK = { 1: [[1, 6], [7, 12], [13, 18], [19, 22]], 2: [[1, 6], [7, 12], [13, 18], [19, 23]], 3: [[1, 6], [7, 12], [13, 18]], 4: [[1, 6], [7, 12], [13, 17], [17, 22]] };
const ruthChunk = c => RUTH_CHUNK[c].map(([a, b]) => [c, a, b]).map((b, i) => [b, r6Done(b), i]).sort((x, y) => x[1] - y[1] || x[2] - y[2])[0][0];
// GPT §6: the words of Ruth 1 that blocked you in the Nov 21 simulation (learn them in their clause).
const R1_WORDS = [
  ['בִּימֵי', 'in the days of', 'Ruth 1:1 בִּימֵי שְׁפֹט הַשֹּׁפְטִים: בְּ + יְמֵי (construct plural of יוֹם, day).'],
  ['שְׁפֹט', 'judging; to judge, rule', 'Ruth 1:1: Qal infinitive construct of שׁפט; הַשֹּׁפְטִים = the judges (participle used as a noun).'],
  ['לָגוּר', 'to sojourn; to live as a foreigner', 'Ruth 1:1: לְ + Qal infinitive of גור (hollow root).'],
  ['שְׂדֵי', 'fields of; country of', 'Ruth 1:1 בִּשְׂדֵי מוֹאָב “in the country of Moab” (שָׂדֶה, field).'],
  ['וַיִּשְׂאוּ', 'and they took (lifted)', 'Ruth 1:4 וַיִּשְׂאוּ לָהֶם נָשִׁים: root נשׂא (the נ is gone), NOT עשׂה “do”.'],
  ['הָאַחַת', 'the one (f.)', 'Ruth 1:4 שֵׁם הָאַחַת עָרְפָּה “the name of the one was Orpah”.'],
  ['הַשֵּׁנִית', 'the second (f.)', 'Ruth 1:4 וְשֵׁם הַשֵּׁנִית רוּת.'],
  ['כְּעֶשֶׂר שָׁנִים', 'about ten years', 'Ruth 1:4: כְּ “about” + עֶשֶׂר “ten” + שָׁנִים “years”.'],
  ['וַתִּשָּׁאֵר', 'and she was left; remained', 'Ruth 1:3, 1:5: Niphal wayyiqtol 3fs of שׁאר (the ש is doubled: the Niphal נ).'],
  ['יְלָדֶיהָ', 'her children', 'Ruth 1:5 מִשְּׁנֵי יְלָדֶיהָ: a noun (יֶלֶד, child) + “her”, not a verb “was born”.'],
  ['וַתָּקָם', 'and she arose', 'Ruth 1:6: Qal wayyiqtol 3fs of קום.'],
  ['פָקַד', 'he visited; attended to', 'Ruth 1:6 כִּי־פָקַד יְהוָה אֶת־עַמּוֹ.'],
  ['לָתֵת', 'to give', 'Ruth 1:6: Qal infinitive of נתן.'],
  ['חֶסֶד', 'kindness; loyal love', 'Ruth 1:8 יַעַשׂ יְהוָה עִמָּכֶם חֶסֶד.'],
  ['הַמֵּתִים', 'the dead (ones)', 'Ruth 1:8: Qal participle mp of מות with the article.'],
  ['מְנוּחָה', 'rest; a resting place', 'Ruth 1:9 וּמְצֶאןָ מְנוּחָה.'],
  ['תְּשַׂבֵּרְנָה', 'you (f. pl.) would wait / hope', 'Ruth 1:13: Piel yiqtol 2fp of שׂבר (sin).'],
  ['דָּבְקָה', 'she clung', 'Ruth 1:14 וְרוּת דָּבְקָה בָּהּ: Qal qatal 3fs of דבק.'],
  ['הַמָּוֶת', 'death', 'Ruth 1:17 כִּי הַמָּוֶת יַפְרִיד בֵּינִי וּבֵינֵךְ.'],
  ['כַּלָּה', 'daughter-in-law', 'Ruth 1:6–8 כַּלֹּתֶיהָ “her daughters-in-law”.'],
];
function startRuth1Words() { startSession({ title: 'Ruth 1: the words that blocked you on Nov 21 (type the meaning)', items: R1_WORDS.map(w => ({ kind: 'recall', key: 'r1w|' + w[0], cid: 'r1w:' + AN.hash(w[0]), he: w[0], gloss: w[1], extra: w[2], t: 'vocab', noVx: 1 })), back: 'today', noVary: true, mode: 'practice' }); }
const ruthOpts = c => [
  ...(c === 1 ? [{ t: 'Ruth 1: the 20 words that blocked you on Nov 21', s: 'From GPT’s error map of your simulation: type the meaning, then read the clause.', go: () => startRuth1Words() }] : []),
  { t: `Ruth ${c}: read the chapter aloud`, s: 'Read tab. Say every verb’s subject as you read (“he”, “she”, “they f.”).', go: () => { go('read'); try { renderRead('ruthT' + c); } catch { } } },
  { t: `Ruth ${c}: translate 4–6 verses blind`, s: 'The 30-point part. Strict English first (Hebrew order), then smooth English. Never leave a verse blank.', go: () => startRuth6(ruthChunk(c)) },
  { t: `Ruth ${c}: questions in Hebrew`, s: 'With the verses shown.', go: () => startRuthChapterQuestions(c, 8) },
  { t: 'Syntax questions (8)', s: 'The 12-point part: particles, forms, suffixes.', go: () => rxSession('Syntax questions', exSyntax(8).map(x => ({ ...x, cat: 'review' })), null) },
];
function planBlockList(d) {
  const B = [], add = (id, min, title, sub, act, x = {}) => B.push({ id, min, title, sub, act, ...x });
  const ch = (id, title, why, opts) => () => planChooser(id, title, why, opts);
  const fsToday = () => FS_KEYS.some(k => fsResults(k).some(a => dayKey(new Date(a.end)) === d));
  const lastFS = () => FS_KEYS.flatMap(k => fsResults(k)).sort((a, b) => b.end - a.end)[0];
  if (d === '2026-11-22') {
    add('vc', 10, '07:00 · Vocabulary contrasts: כֵּן / חֵן · אַתָּה / עַתָּה · הָלַךְ / כָּלָה / כַּלָּה', 'Why: GPT’s session showed these are retrieved by sound. Type the meaning, then the same words in Ruth sentences.', () => startVocabContrast({ planBlock: 'vc' }));
    add('ret', 15, '07:10 · Fast retrieval: question words + vocabulary you know', 'Why: your strongest skill (vocabulary 78%, n=230). Keep it fast: answer in under 5 seconds.', ch('ret', 'Fast retrieval', 'Two short decks. Answer before you think too long; a fast right answer is the goal.', [
      { t: 'Question words and grammar terms (15)', s: 'מָה, מִי, אָנָה, לָמָּה, כַּמָּה… as in the exam questions.', go: () => startRecall({ deck: 'terms', n: 15 }) },
      { t: 'Vocabulary: type the meaning (20)', s: 'Your hardest words first.', go: () => startRecall({ n: 20 }) }]));
    add('stm', 35, '07:25–08:00 · The stems by pattern (all seven)', 'First the seven models of קטל (5–7 min, not scored), then forms where you name stem + form.', ch('stm', 'The stems by pattern', 'A sheva alone or a dagesh alone does not prove a stem: read the whole pattern (prefix, vowel under root 1, doubling, vowel under root 2).', [
      { t: 'Seven-stem models of קטל (14 forms, not scored)', s: 'Each answer opens the full explanation: why this stem, why not the others.', go: () => startSevenStem() },
      { t: 'Stem + form drill (20 forms)', s: 'Only בִּנְיָן and נְטִיָּה.', go: () => rxSession('Stem + form drill (20)', sfItems(20), null) }]));
    add('pgn', 50, '08:10–09:00 · Forms (נְטִיָּה) and person/gender/number', 'Why: person/gender/number is your weakest skill (33%, n=126) and it is three of the six boxes in every parse.', ch('pgn', 'Forms and person/gender/number', 'Order: the eight prompts from GPT’s session, then the contrast pairs from your Nov 21 simulation, then the drill.', [
      { t: 'GPT’s eight prompts (blind, then the answers)', s: 'Vocabulary contrasts, יְקַטֵּל, קַטֵּל, מִתְהַלֵּךְ, stem vs form, the doubled letter.', go: () => startEightPrompts() },
      { t: 'Contrast pairs from your simulation (12 forms)', s: 'אֶקָּבֵר / נִקְבַּר, יַפְרִיד / הִפְרִיד, לָגוּר / גָּר, שֹׁבְנָה / שׁוּבִי, הַמֵּתִים / לְדַבֵּר, לַהֲמִיתֶךָ, תָּמֻתוּ, וַתִּשְׁתַּחוּ…', go: () => startContrastForms() },
      { t: 'Person · gender · number drill (30 forms)', s: 'Prefix AND ending together; participles have no person, infinitives none of the three.', go: () => startPgnDrill({ n: 30 }) },
      { t: 'Subject or object? Pronoun endings', s: 'Who does it vs. whom it is done to (וַיִּשְׂנְאֻהוּ = they hated HIM).', go: () => startNominal() }]));
    add('st1', 50, '09:10–10:00 · Story review: Ch. 14, 15, 16', 'Why: 58 of the 100 points come from one of these stories (parsing + questions).', ch('st1', 'Story review: Ch. 14, 15, 16', 'About 15 minutes per story: read, 8 verbs, a few questions. Coverage matters more than perfection today.', [14, 15, 16].flatMap(storyOpts)));
    add('r1', 50, '10:10–11:00 · Ruth 1', 'Why: the translation is 30 points and your lowest-tested part (38% in practice).', ch('r1', 'Ruth 1', 'Read, translate blind, answer in Hebrew.', ruthOpts(1)));
    add('st2', 50, '11:10–12:00 · Story review: Ch. 17, 18, 19', '', ch('st2', 'Story review: Ch. 17, 18, 19', 'About 15 minutes per story.', [17, 18, 19].flatMap(storyOpts)));
    add('r2', 50, '12:10–13:00 · Ruth 2', 'Lunch 1–2 is protected.', ch('r2', 'Ruth 2', 'Read, translate blind, answer in Hebrew.', ruthOpts(2)));
    add('st3', 45, '14:00–14:45 · Story review: Ch. 20, 21, 22', '', ch('st3', 'Story review: Ch. 20, 21, 22', 'About 15 minutes per story.', [20, 21, 22].flatMap(storyOpts)));
    add('r3', 45, '14:55–15:40 · Ruth 3', '', ch('r3', 'Ruth 3', 'Read, translate blind, answer in Hebrew.', ruthOpts(3)));
    add('r4', 40, '15:50–16:30 · Ruth 4', 'Then stop: dinner from 4:30 is protected. Optional: 10–15 minutes of recall in the evening, nothing more.', ch('r4', 'Ruth 4', 'Read, translate blind, answer in Hebrew.', ruthOpts(4)));
  } else if (d === '2026-11-23') {
    add('ret', 30, 'Retrieval: the contrast words in new sentences + vocabulary', 'Fresh contexts this time (yesterday’s are not repeated first).', ch('ret', 'Retrieval', '', [
      { t: 'Vocabulary contrasts (in Ruth sentences first)', go: () => startVocabContrast({ fresh: true }) },
      { t: 'Vocabulary: type the meaning (20)', go: () => startRecall({ n: 20 }) }]));
    add('cov', 40, 'Story coverage: the stories you reviewed least', 'Any story can be on the exam. Pick the ones you skipped yesterday.', ch('cov', 'Story coverage', 'Read + 8 verbs for each story you did not reach on Sunday.', STORY_CHS.map(c => ({ t: `Ch. ${c}: 8 verbs`, go: () => startStoryDrill({ ch: c, n: 8 }) }))));
    add('mock', 140, `Paper simulation (${FS_MIN} min): Final simulation ${typeof simNo === 'function' ? simNo(fsNextSim()) : fsNextSim().slice(2)}`, 'Real conditions: print it or choose “Do it on paper”, phone away, paper lexicon allowed. Do parsing and the Ruth translation FIRST, then the story questions. Never leave a verse blank.', () => startFS(fsNextSim()), { check: fsToday });
    add('rev', 50, 'The complete correction of that simulation (every item)', 'Correct items too: why they are right and how to be faster. Then send the grading file to Claude for the translation.', () => { const r = lastFS(); if (r) renderExamReview(r); else flash('Take the simulation first.'); }, { manual: true });
    add('rr', 40, 'Fresh Ruth repair: 4–6 verses blind', 'A part of Ruth you have not translated yet.', () => startRuth6(null, { planBlock: 'rr' }));
  } else if (d === '2026-11-24') {
    add('spd', 25, 'Speed and recall: the contrasts that are not stable yet', '', ch('spd', 'Speed and recall', '', [
      { t: 'Contrast pairs (12 forms)', go: () => startContrastForms() },
      { t: 'Vocabulary contrasts', go: () => startVocabContrast({ fresh: true }) },
      { t: 'Vocabulary (20)', go: () => startRecall({ n: 20 }) }]));
    add('prp', 55, 'Parse repairs: your misses + mixed full parses', 'Every miss of Monday’s simulation first.', ch('prp', 'Parse repairs', '', [
      { t: 'Fix my mistakes', go: () => startMistakes() },
      { t: 'Full parses, mixed (15)', go: () => rxSession('Full parses, mixed', rxMixed(15), null) },
      { t: 'Person · gender · number (20)', go: () => startPgnDrill({ n: 20 }) }]));
    add('sq', 55, 'Story comprehension in Hebrew', '26 points: short Hebrew answers copied from the story.', ch('sq', 'Story questions in Hebrew', 'Six questions per story; do as many stories as fit.', STORY_CHS.map(c => ({ t: `Ch. ${c}: questions in Hebrew`, go: () => startStoryQuestions(c, 6) }))));
    add('rts', 65, 'Ruth translation and syntax', '30 + 12 points.', ch('rts', 'Ruth translation and syntax', '', [
      { t: 'Translate 4–6 verses blind', go: () => startRuth6() },
      { t: 'Syntax questions (8)', go: () => rxSession('Syntax questions', exSyntax(8).map(x => ({ ...x, cat: 'review' })), null) },
      { t: 'Ruth 4 syntax lesson', go: () => rxSession('Ruth 4 syntax', [lessonItem('ruth4')], null) }]));
    add('con', 40, 'Consolidation + a short paper check', 'Optional extended day (340 min): replace blocks 3–5 with a second paper simulation and its correction.', ch('con', 'Consolidation', '', [
      { t: 'Full parses, mixed (10)', go: () => rxSession('Full parses, mixed', rxMixed(10), null) },
      { t: 'Re-read: how to take the final', go: () => rxLesson(['exam'], [], null) },
      { t: `Optional: a second simulation (${FS_MIN} min)`, go: () => startFS(fsNextSim()) }]));
  } else if (d === '2026-11-25') {
    add('w1', 10, 'Warm-up: 15 pattern cards', 'Just to wake the patterns up. Nothing new.', () => rxCards(['pgn', 'stems', 'weak'], 15, 'w1'));
    add('w2', 10, 'Warm-up: 5 full parses', 'Easy rhythm: form → who → stem → root.', () => rxSession('Warm-up parses', rxMixed(5), 'w2'));
    add('w3', 5, 'Read: how to take the final', 'Parsing and translation first; never leave a verse blank.', () => rxLesson(['exam'], [], 'w3'));
    add('w4', 0, 'Before you leave: paper lexicon, pens, the confirmed time and room', 'If the time is still not confirmed, write to the professor first thing.', null, { manual: true });
  }
  return B;
}
(function () {
  const NEW = d => ['2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25'].includes(d);
  const _rb = rescueBlocks;
  rescueBlocks = function () { const d = dayKey(); if (NEW(d)) return planBlockList(d); return _rb.apply(this, arguments); };
  const DAYNAME = { '2026-11-22': 'Sunday, Nov 22', '2026-11-23': 'Monday, Nov 23 (movable blocks)', '2026-11-24': 'Tuesday, Nov 24 (movable blocks)', '2026-11-25': 'Wednesday, Nov 25 · exam day' };
  const _pc = planCardHTML;
  planCardHTML = function () {
    const d = dayKey(); if (!NEW(d)) return _pc.apply(this, arguments);
    const B = planBlocks(), isDone = b => b.check ? b.check() : planDone(b.id), n = B.filter(isDone).length, tot = B.reduce((s, b) => s + b.min, 0);
    const days = Math.round((parseDay(EXAM_DAY).getTime() - parseDay(d).getTime()) / 864e5);
    return `<div class="panel stack" id="plan-card" style="border-color:var(--accent)">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><h2 style="margin:0">Today’s plan · ${DAYNAME[d]}</h2><span class="chip ${days <= 1 ? 'warn' : 'acc'}">${days === 0 ? 'Final today' : days + ' day' + (days === 1 ? '' : 's') + ' to your final (Wed Nov 25, time to confirm)'}</span><button class="btn" onclick="go('rescue')">Open the Final rescue tab</button></div>
      <p class="small muted">GPT’s plan from your Nov 21 session · about ${tot} minutes · ${n} of ${B.length} blocks done. Target: 65–70 on the final; aim for 75–80 in practice. Lunch, dinner and sleep are protected.</p>
      <div class="plan">${B.map((b, i) => `<div class="step ${isDone(b) ? 'done' : ''}"><span class="n">${isDone(b) ? '✓' : i + 1}</span><div><b>${heWrap(esc(b.title))}</b><div class="small muted">${heWrap(esc(b.sub))}${b.min ? ` · ${b.min} min` : ''}</div></div><div class="row" style="gap:6px">${b.act ? `<button class="btn sm ${isDone(b) ? '' : 'primary'}" data-pb="${b.id}">${isDone(b) ? 'Again' : 'Start'}</button>` : ''}${(b.manual || !b.check) && !isDone(b) ? `<button class="btn sm" data-pm="${b.id}">Done</button>` : ''}</div></div>`).join('')}</div></div>`;
  };
  const _rr = renderRescue;
  renderRescue = function () {
    _rr.apply(this, arguments);
    try { const v = $('#v-rescue'), e = v && v.querySelector('.eyebrow'); if (e && /Nov 17–23/.test(e.textContent)) e.textContent = 'Final rescue · Nov 17–25 (your final: Wednesday, Nov 25)'; } catch { }
  };
})();

// ===== 3. Drills from GPT's report: vocabulary contrasts, the eight prompts, contrast pairs =====
const VC_WORDS = [
  ['כֵּן', 'so; thus; yes', 'כ (kaf) with tsere. Course: Ch. 14 story, line 43 (כֵּן עָשׂוּ “so they did”); Ch. 18 story, line 136. Do not confuse with חֵן (ח, ḥet) = favor.'],
  ['חֵן', 'favor; grace', 'ח (ḥet) with tsere. Ruth 2:10 מָצָאתִי חֵן בְּעֵינֶיךָ “I found favor in your eyes”; Ch. 15 story, line 113; Ch. 22 story, line 80. Do not confuse with כֵּן (kaf) = so.'],
  ['אַתָּה', 'you (m. sg.)', 'א (alef). Ruth 4:6 גְּאַל־לְךָ אַתָּה “you redeem it for yourself”; Ch. 19 story, line 152 (בֶּן־מִי אַתָּה “whose son are you?”). Same sound as עַתָּה (ע) = now; only the spelling tells them apart.'],
  ['עַתָּה', 'now', 'ע (ayin). Ruth 3:11 וְעַתָּה בִּתִּי “and now, my daughter”; Ruth 3:2, 3:12; Ch. 22 story, line 124. Do not confuse with אַתָּה (alef) = you.'],
  ['הָלַךְ', 'he went; to go, walk', 'Root ה־ל־ך. Ruth 1:21 הָלַכְתִּי “I went”. It is NOT “come to an end” (that is כ־ל־ה).'],
  ['כָּלָה', 'it came to an end; to be finished', 'Root כ־ל־ה (a verb): qamets, qamets, no doubling. Ruth 2:23 עַד־כְּלוֹת “until the end (completion) of”.'],
  ['כַּלָּה', 'daughter-in-law; bride', 'A noun: pataḥ and a doubled ל (לּ). Ruth 1:22 כַלָּתָהּ “her daughter-in-law”; Ruth 1:7 כַּלֹּתֶיהָ “her daughters-in-law”.'],
];
const VC_CTX = [
  ['Ruth 3:11', 'וְעַתָּה בִּתִּי אַל־תִּירְאִי', 'עַתָּה', ['now', 'you (m. sg.)', 'so, thus', 'favor'], 'ע (ayin) + pataḥ: עַתָּה = now. אַתָּה (alef) = you.'],
  ['Ruth 2:10', 'מַדּוּעַ מָצָאתִי חֵן בְּעֵינֶיךָ', 'חֵן', ['favor', 'so, thus', 'now', 'life'], 'ח (ḥet): חֵן = favor. כֵּן (kaf) = so.'],
  ['Ruth 4:6', 'גְּאַל־לְךָ אַתָּה אֶת־גְּאֻלָּתִי', 'אַתָּה', ['you (m. sg.)', 'now', 'with her', 'she'], 'אַתָּה (alef) = you. Compare אִתָּהּ (Ruth 1:18) = with her, and עַתָּה = now.'],
  ['Ruth 1:21', 'אֲנִי מְלֵאָה הָלַכְתִּי', 'הָלַכְתִּי', ['I went', 'I came to an end', 'my daughter-in-law', 'I returned'], 'ה־ל־ך + תִּי (I): “I went (away) full”.'],
  ['Ruth 2:23', 'עַד־כְּלוֹת קְצִיר־הַשְּׂעֹרִים', 'כְּלוֹת', ['the end (completion) of', 'the daughters-in-law of', 'the going of', 'all of'], 'Infinitive of כ־ל־ה “to be finished”: “until the barley harvest was finished”.'],
  ['Ruth 1:22', 'וְרוּת הַמּוֹאֲבִיָּה כַלָּתָהּ עִמָּהּ', 'כַלָּתָהּ', ['her daughter-in-law', 'she finished', 'she went', 'all of her'], 'כַּלָּה (doubled ל) = daughter-in-law + ָהּ “her”.'],
];
function vcRecall(w) { return { kind: 'recall', key: 'vcx|' + w[0], cid: 'vcx:' + AN.hash(w[0]), he: w[0], gloss: w[1], extra: w[2], t: 'vocab', noVx: 1 }; }
function vcContext(c) { const hq = `מָה פֵּרוּשׁ ${c[2]} כָּאן?`; return { kind: 'mc', key: 'vcc|' + c[0], t: 'vocab', q: `${esc(c[0])}: ${H(c[1])}${PRi(c[1])}<br>${H(hq)}${PRi(hq)}<div class="small muted">What does ${esc(c[2])} mean here?</div>`, o: c[3], a: 0, x: heWrap(esc(c[4])) }; }
function startVocabContrast(o = {}) {
  const rec = VC_WORDS.map(vcRecall), ctx = VC_CTX.map(vcContext);
  const items = o.fresh ? [...shuffle(ctx), ...shuffle(rec)] : [...rec, ...ctx];
  startSession({ title: 'Vocabulary contrasts: same sound, different word', items, back: 'today', noVary: true, mode: 'practice', planBlock: o.planBlock, rescue: !!o.planBlock });
}
const P8_MC = [
  { kind: 'mc', key: 'p8|7', t: 'terminology', q: `${H('מָה הַהֶבְדֵּל בֵּין בִּנְיָן לִנְטִיָּה?')}${PRi('מָה הַהֶבְדֵּל בֵּין בִּנְיָן לִנְטִיָּה?')}<div class="small muted">Prompt 7. What is the difference between בִּנְיָן (stem) and נְטִיָּה (conjugation)?</div>`, o: ['בִּנְיָן = the stem (Qal, Niphal, Piel…); נְטִיָּה = the conjugation or form (qatal, yiqtol, imperative…)', 'בִּנְיָן = the root; נְטִיָּה = the stem', 'בִּנְיָן = person; נְטִיָּה = number', 'They are two names for the same thing'], a: 0, x: 'Two different boxes of the parse: בִּנְיָן “building” = stem; נְטִיָּה “inflection” = form.' },
  { kind: 'mc', key: 'p8|8', t: 'derived_stems', q: `${H('הַאִם דָּגֵשׁ חָזָק בָּאוֹת הַשְּׁנִיָּה שֶׁל הַשֹּׁרֶשׁ מוֹכִיחַ פִּעֵל?')}${PRi('הַאִם דָּגֵשׁ חָזָק בָּאוֹת הַשְּׁנִיָּה שֶׁל הַשֹּׁרֶשׁ מוֹכִיחַ פִּעֵל?')}<div class="small muted">Prompt 8. Does a dagesh forte in the second root letter by itself prove Piel? Why not?</div>`, o: ['Pual and Hithpael double the second root letter too, so check the vowels and the prefix (Piel yiqtol = sheva, A, E: יְקַטֵּל; Pual = sheva, U, A: יְקֻטַּל; Hithpael has תְ: יִתְקַטֵּל)', 'Because that dot is always the article', 'Because Piel never doubles a letter', 'Because only the Niphal doubles a letter'], a: 0, x: 'Doubling of root 2 belongs to Piel, Pual and Hithpael. The vowels under root 1 and root 2, and the prefix, decide.' },
];
function startEightPrompts() {
  const P = (form, root, stem, conj, pgn, gloss, note, alts) => ({ kind: 'parse', key: 'p8|' + form, form, root, stem, conj, pgn, gloss, note, ...(alts ? { alts } : {}), t: PB_STEM_TOPIC[stem] || stem, cat: 'review' });
  const items = [
    ...VC_WORDS.map(vcRecall),
    P('יְקַטֵּל', 'קטל', 'piel', 'yiqtol', '3ms', 'he will kill (model)', 'Prompt 4 · constructed model, not from a story. Vowels in order: sheva (יְ), A (קַ), E (טֵּ) + doubled ט. Not Pual (Pual is sheva, U, A: יְקֻטַּל).'),
    P('קַטֵּל', 'קטל', 'piel', 'impv', '2ms', 'kill! / to kill (model)', 'Prompt 5 · constructed model. קַטֵּל is Piel imperative 2ms OR infinitive construct (same shape); only the context decides. קִטֵּל (I, E) is the Piel qatal 3ms.', [{ conj: 'inf', pgn: '' }]),
    P('מִתְהַלֵּךְ', 'הלך', 'hithpael', 'ptc', 'ms', 'walking about', 'Prompt 6 · מִתְ + doubled ל = Hithpael participle ms. A participle has no person (leave “person” empty).'),
    ...P8_MC,
  ];
  startSession({ title: 'GPT’s eight prompts (blind first; the answer appears after each)', items, back: 'today', noVary: true, mode: 'practice' });
}
function startContrastForms() {
  const P = (form, root, stem, conj, pgn, gloss, ref, note, alts) => { const m = /^Ruth (\d):(\d+)$/.exec(ref || ''); const x = m ? ruthVerse(+m[1], +m[2]) : null; return { kind: 'parse', key: 'cf|' + form, form, root, stem, conj, pgn, gloss, ref, note, ctx: x ? x.he : '', ...(alts ? { alts } : {}), t: stem === 'qal' ? 'qal_weak' : PB_STEM_TOPIC[stem] || stem, cat: 'review' }; };
  const items = [
    P('אֶקָּבֵר', 'קבר', 'niphal', 'yiqtol', '1cs', 'I will be buried', 'Ruth 1:17', 'Niphal yiqtol: prefix א (I) + doubled first root letter (קּ), A under root 1, E under root 2. In the simulation you chose qatal: a prefix means yiqtol. First person is “common”: gender c.'),
    P('נִקְבַּר', 'קבר', 'niphal', 'qatal', '3ms', 'he was buried (model)', 'model', 'Constructed model. Niphal qatal: נִ in front, no doubling, A under root 2. Compare אֶקָּבֵר (yiqtol: prefix + doubling).'),
    P('יַפְרִיד', 'פרד', 'hiphil', 'yiqtol', '3ms', 'he/it will separate', 'Ruth 1:17', 'Hiphil yiqtol: prefix with pataḥ (יַ) + ִי before the last root letter. You chose qatal in the simulation: יַ is a prefix, so it is yiqtol.'),
    P('הִפְרִיד', 'פרד', 'hiphil', 'qatal', '3ms', 'he separated (model)', 'model', 'Constructed model. Hiphil qatal: הִ in front (not a person prefix) + ִי. Compare יַפְרִיד.'),
    P('לָגוּר', 'גור', 'qal', 'inf', '', 'to sojourn', 'Ruth 1:1', 'לְ + infinitive of a hollow root (ו visible). An infinitive has no person, gender or number: leave all three empty.'),
    P('גָּר', 'גור', 'qal', 'qatal', '3ms', 'he sojourned / sojourning', 'model', 'Hollow root without its ו: Qal qatal 3ms; the same shape is also the participle ms (context decides).', [{ conj: 'ptc', pgn: 'ms' }]),
    P('שֹׁבְנָה', 'שוב', 'qal', 'impv', '2fp', 'return! (you women)', 'Ruth 1:11', 'No prefix + ending נָה = imperative 2nd feminine plural (Naomi to her two daughters-in-law).'),
    P('שׁוּבִי', 'שוב', 'qal', 'impv', '2fs', 'return! (you, one woman)', 'Ruth 1:15', 'No prefix + ending ִי = imperative 2nd feminine singular (Naomi to Ruth alone).'),
    P('הַמֵּתִים', 'מות', 'qal', 'ptc', 'mp', 'the dead (ones)', 'Ruth 1:8', 'The dot in מּ is the ARTICLE’s doubling (הַ), not a stem sign. Qal participle mp of a hollow root.'),
    P('לְדַבֵּר', 'דבר', 'piel', 'inf', '', 'to speak', 'Ruth 1:18', 'Here the dot in בּ is the Piel doubling of root 2 (A under root 1, E under root 2). Compare הַמֵּתִים, where the dot comes from the article.'),
    P('לַהֲמִיתֶךָ', 'מות', 'hiphil', 'inf', '', 'to kill you', 'Ch. 22 story', 'לְ + Hiphil infinitive (הֲמִית, causative of “die” = kill) + ךָ “you” = the OBJECT: “to kill you”. Infinitive: no person, gender or number.'),
    P('תָּמֻתוּ', 'מות', 'qal', 'yiqtol', '2mp', 'you (pl.) will die', 'Ch. 20 story', 'The U is the hollow root’s own vowel (מוּת), not the Pual U; there is no doubled letter. Prefix ת + ending וּ = you (m. pl.).'),
    P('וַתִּשְׁתַּחוּ', 'חוה', 'hishtaphel', 'wayyiqtol', '3fs', 'and she bowed down', 'Ruth 2:10', 'The final וּ belongs to the root (ח־ו־ה), it is NOT a plural ending: Ruth alone bows. Prefix ת after וַ = she.'),
  ];
  startSession({ title: 'Contrast pairs from your simulation (parse each, then compare)', items, back: 'today', noVary: true, mode: 'practice' });
}

// ===== 4. The exam screen: neutral navigator, mark for review, section jump, overview before submitting, scoring policy =====
const FS_POINTS = { parse: 32, translation: 30, comp: 26, syntax: 12 };
function exSecList() {
  const bp = BLUEPRINTS[EX.type], out = [];
  EX.items.forEach((it, i) => { let s = out.find(x => x.k === it.sec); if (!s) out.push(s = { k: it.sec, label: (bp.sections[it.sec] || {}).label || it.sec, first: i, idx: [] }); s.idx.push(i); });
  return out;
}
function exNavHTML() {
  const vis = EX.vis || {}, fl = EX.flag || {};
  const st = i => exAnswered(EX.items[i], EX.ans[i]) ? 'answered' : (vis[i] || EX.ms[i]) ? 'visited, blank' : 'not visited';
  const btn = i => { const s = st(i); const css = s === 'answered' ? '' : s === 'visited, blank' ? 'border-style:dashed;' : 'opacity:.55;'; return `<button class="btn sm ${i === EX.cur ? 'primary' : ''}" data-xi="${i}" title="Item ${i + 1}: ${s}${fl[i] ? ', marked for review' : ''}" style="min-width:34px;${css}">${i + 1}${fl[i] ? '⚑' : ''}</button>`; };
  const secs = exSecList();
  return `<div class="row small" style="gap:6px;flex-wrap:wrap"><span class="muted">Go to:</span>${secs.map(s => `<button class="btn sm ghost" data-xs="${s.first}">${esc(s.label)} · ${s.idx.length} items, first #${s.first + 1}</button>`).join('')}</div>
    <div class="row" style="gap:4px;flex-wrap:wrap">${EX.items.map((x, i) => btn(i)).join('')}</div>
    <div class="small muted">Plain = answered · dashed = seen but blank · faded = not seen yet · ⚑ = marked for review. Nothing here shows right or wrong.</div>`;
}
function exOverviewHTML() {
  const fl = EX.flag || {}, secs = exSecList(), pts = /^fs\d$/.test(EX.type) ? FS_POINTS : null;
  const open = EX.items.map((x, i) => i).filter(i => !exAnswered(EX.items[i], EX.ans[i])), marked = Object.keys(fl).filter(i => fl[i]).map(Number);
  const jump = i => `<button class="btn sm" data-xj="${i}">${i + 1}</button>`;
  return `<div class="stack" style="gap:6px;margin-bottom:8px"><b>Before you submit</b>
    ${tableHTML(['Section', 'Answered', pts ? 'Points' : ''].filter(Boolean), secs.map(s => [esc(s.label), `${s.idx.filter(i => exAnswered(EX.items[i], EX.ans[i])).length} of ${s.idx.length}`, ...(pts ? [String(pts[s.k] || '')] : [])]))}
    ${open.length ? `<div>Still blank (they score 0): <span class="row" style="gap:4px;display:inline-flex;flex-wrap:wrap">${open.map(jump).join('')}</span></div>` : '<div>Every item has an answer.</div>'}
    ${marked.length ? `<div>Marked for review: <span class="row" style="gap:4px;display:inline-flex;flex-wrap:wrap">${marked.map(jump).join('')}</span></div>` : ''}
    <div class="small muted">Time left: ${Math.max(0, Math.round((EX.limitMs - exElapsed()) / 60000))} min.</div></div>`;
}
function exPolicyHTML() {
  const fs = /^fs\d$/.test(EX.type);
  return `${EX.contOf ? `<div class="note"><b>Finishing your earlier attempt.</b> Your submitted answers are filled in and the clock starts with the minutes you had left. You may change any answer. This is a new record, marked as practice (you have seen the corrections); your first result is kept as it was.</div>` : EX.retake ? '<div class="note"><b>Second attempt.</b> You have taken this paper before, so this counts as practice, not as an independent score. Your first result is kept.</div>' : ''}<div class="note stack" style="gap:6px"><b>How this works (like the paper exam)</b>
    <div>• Go back and forth freely: Previous / Next, the numbered buttons, or jump to a section. Skip anything and come back. Mark items with ⚐ to return to them. You can change any answer until you submit.</div>
    <div>• The clock runs while the test is open. If you must stop, press ⏸ Pause: the clock stops, your answers stay saved, and you resume exactly where you were. If the app is closed for more than 2 minutes, that time is not counted either. Pauses are recorded with the result. A warning appears at 10 and 5 minutes; at 0 the test is submitted as it is.</div>
    <div>• Nothing tells you right or wrong while the test is open: no hints, no answers, no colours for correctness.</div>
    <div>• After you submit: every item is graded and explained (also the correct ones and the blank ones). Parsing is graded by rule; your Hebrew answers, syntax answers and translations get an automatic estimate first, marked “to be checked”, and you can send them to Claude for the final grade. You never have to grade yourself.</div>
    ${fs ? `<div>• Points: parsing 32 · Ruth translation 30 · story questions in Hebrew 26 · Ruth syntax 12 = 100. Each item earns its share (parsing: six boxes; translation: meaning units). <b>The professor’s reported rule “one point off for a wrong or blank answer” is not applied</b>: how it works (from the item’s points or an extra penalty; per question or per box) is not confirmed. Ask him.</div>` : ''}
    <div>• Tip from your data: do the parsing and the Ruth translation first, then the questions. A rough translation of every verse earns far more than a perfect one of half the verses.</div></div>`;
}

// ===== 5. Grading after you submit: rules, then an automatic estimate (never a required self-score) =====
const AG = (function () {
  const HE_STOP = new Set(['כי', 'את', 'אשר', 'על', 'אל', 'עם', 'הוא', 'היא', 'הם', 'הנ', 'גמ', 'לא', 'כל', 'זה', 'זאת', 'מנ', 'אמ', 'או', 'יש', 'אינ', 'עד', 'כה', 'אתו', 'אתה', 'לו', 'לה', 'להמ', 'שמ', 'הנה']);
  const EN_STOP = new Set('a an the and or of to in on at for from by with as is are was were be been being it its he she they them his her their him this that these those who whom which what when where why how not no so then there here into upon unto also yet but if will shall would should do did does have has had i you we me us my our your one ones'.split(' '));
  const SYN = { yahweh: 'lord', jehovah: 'lord', went: 'go', gone: 'go', goes: 'go', going: 'go', walk: 'go', walked: 'go', came: 'come', comes: 'come', coming: 'come', said: 'say', says: 'say', saying: 'say', told: 'say', tell: 'say', spoke: 'speak', spoken: 'speak', returned: 'return', returning: 'return', turned: 'return', died: 'die', dead: 'die', death: 'die', dwelt: 'dwell', lived: 'dwell', stayed: 'dwell', sojourn: 'dwell', sojourned: 'dwell', live: 'dwell', took: 'take', taken: 'take', gave: 'give', given: 'give', saw: 'see', seen: 'see', heard: 'hear', wife: 'woman', women: 'woman', wives: 'woman', sons: 'son', children: 'son', daughters: 'daughter', men: 'man', husband: 'man', land: 'country', field: 'country', fields: 'country', famine: 'hunger', arose: 'rise', rose: 'rise', got: 'rise', 'daughter-in-law': 'daughterinlaw', 'daughters-in-law': 'daughterinlaw', kindness: 'kindness', hesed: 'kindness', lovingkindness: 'kindness', redeemer: 'redeem', redeem: 'redeem', kinsman: 'redeem' };
  const heTok = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/־/g, ' ').replace(/[֑-ׇ]/g, '').replace(/[ךםןףץ]/g, c => ({ 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[c])).replace(/[^א-ת\s]/g, ' ').split(/\s+/).filter(Boolean);
  const heStem = t => { let x = t; while (x.length > 3 && 'והבכלמ'.includes(x[0])) x = x.slice(1); return x; };
  const enTok = s => String(s || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/[֐-׿]+/g, ' ').replace(/[“”"’'(),.;:!?\[\]—–/]/g, ' ').split(/\s+/).filter(Boolean).map(w => SYN[w] || w).map(w => w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '') : w).map(w => SYN[w] || w).filter(w => !EN_STOP.has(w));
  function heCover(model, ans) {
    const m = heTok(model), a = heTok(ans); if (!m.length) return { cov: 0, mlen: 0, alen: a.length };
    const content = m.filter(t => !HE_STOP.has(t)); const M = content.length ? content : m;
    const A = new Set(a), As = new Set(a.map(heStem)), soft = t => heStem(t).replace(/[הת]$/, '');
    const Ss = new Set(a.map(soft));
    const hit = M.reduce((n, t) => n + (A.has(t) || As.has(heStem(t)) ? 1 : Ss.has(soft(t)) ? .5 : 0), 0);
    const aC = a.filter(t => !HE_STOP.has(t)), precise = aC.length > 0 && aC.every(t => M.some(m => heStem(m) === heStem(t))), head = M.length > 0 && aC.some(t => heStem(t) === heStem(M[0]));
    return { cov: hit / M.length, mlen: M.length, alen: a.length, short: precise && head };
  }
  function enCover(model, ans) { const M = [...new Set(enTok(model))], A = new Set(enTok(ans)); if (!M.length) return { cov: 0, mlen: 0, alen: A.size }; return { cov: M.filter(t => A.has(t)).length / M.length, mlen: M.length, alen: A.size }; }
  const hasHe = s => /[א-ת]/.test(String(s || ''));
  function compModels(it) {
    const m = String(it.model || ''), he = m.split(' — ')[0], en = (m.split(' → ')[1] || '').split(' · ')[0];
    const alt = (/Also accept: ([^·]+)/.exec(m) || [])[1];
    const par = [...he.matchAll(/\(([^)]*)\)/g)].map(x => x[1].replace(/^(or|also)\s+/i, '').trim()).filter(hasHe), main = he.replace(/\([^)]*\)/g, ' ').trim();
    return { he: [main, ...par, ...(alt ? alt.split(/;|\s\/\s|,\s(?=[א-ת])/).map(s => s.trim()).filter(hasHe) : [])].filter(Boolean), en };
  }
  function comp(it, text) {
    const M = compModels(it);
    if (hasHe(text)) {
      let best = { cov: 0 }; for (const m of M.he) { const c = heCover(m, text); if (c.cov > best.cov || best.mlen == null) best = c; }
      const score = best.cov >= .99 ? 1 : best.cov >= .5 || best.short ? .5 : 0;
      const long = best.mlen && best.alen > 3 * best.mlen + 3;
      const conf = best.cov >= .99 && !long ? 'high' : 'low';
      return { score, conf, how: `Hebrew words of the model found in your answer: ${Math.round(best.cov * 100)}%${best.short && best.cov < .99 ? '; your shorter answer may be complete (Claude checks it)' : ''}${long ? '; your answer is much longer than needed' : ''}` };
    }
    const c = enCover(M.en, text); const score = c.cov >= .6 ? .5 : c.cov >= .3 ? .25 : 0;
    return { score, conf: 'low', how: `Answer in English only (the question asks for Hebrew: at most “partly”); English words of the model found: ${Math.round(c.cov * 100)}%` };
  }
  function syntax(it, text) {
    const model = String(it.model || ''); const c = enCover(model, text), h = hasHe(model) && hasHe(text) ? heCover(model.replace(/[A-Za-z].*$/s, ''), text) : null;
    const cov = Math.max(c.cov, h ? h.cov : 0); const score = cov >= .6 ? 1 : cov >= .3 ? .5 : 0;
    return { score, conf: 'low', how: `Key words of the model answer found: ${Math.round(cov * 100)}%` };
  }
  function unitsOf(it) {
    if (it.units && it.units.length) return it.units.map(String);
    return String(it.model || '').split(/[,;:.]|\s(?=and\s)/).map(s => s.trim()).filter(s => enTok(s).length >= 2);
  }
  function translation(it, a) {
    const text = `${a.strict || ''} ${a.text || ''}`; const U = unitsOf(it); if (!U.length) return { score: 0, conf: 'low', how: 'no reference units' };
    const A = new Set(enTok(text));
    const us = U.map(u => { const w = [...new Set(enTok(u))]; if (!w.length) return 1; const c = w.filter(t => A.has(t)).length / w.length; return c >= .75 ? 1 : c >= .4 ? .5 : 0; });
    return { score: us.reduce((s, x) => s + x, 0) / us.length, units: us, unitText: it.units ? null : U, conf: 'low', how: `${U.length} meaning units compared by key words (synonyms and word order are not judged: Claude checks it)` };
  }
  return { comp, syntax, translation, heTok, enTok, heCover, enCover };
})();
function exAutoEstimate(still) {
  for (const r of still) {
    const { it, a } = r; let g = null;
    if (it.sub === 'translate2') g = AG.translation(it, a);
    else if (it.kind === 'write' && it.sec === 'syntax') g = AG.syntax(it, a.text || '');
    else if (it.kind === 'write') g = AG.comp(it, a.text || '');
    if (!g) continue;
    r.score = Math.round(g.score * 1000) / 1000; r.sc = 'est'; r.pending = false; r.est = { conf: g.conf, how: g.how, v: 'auto-est-v1' }; r.chk = g.conf !== 'high';
    if (g.units) r.crit = { units: g.units, est: 1, unitText: g.unitText || undefined };
  }
}
(function () {
  // Rubric label and the record: estimates are marked, blank items carry no error tags, status of every item is kept.
  const _rub = exRubric;
  exRubric = function (it, sc) { return sc === 'est' ? _rub(it) + ' (automatic estimate, to be checked)' : _rub.apply(this, arguments); };
})();

// ===== 6. The complete correction: navigator, filters, box-by-box parse, blanks without false diagnosis, Claude's grades as an overlay =====
const itemStatus = x => x.answered ? 'answered' : x.st || (x.ms ? 'visited_blank' : 'not_reached');
const ST_LABEL = { answered: 'answered', visited_blank: 'seen, left blank', timeout_unreached: 'not reached (time ran out)', unvisited: 'not opened', not_reached: 'not reached' };
function parseBoxesHTML(it, a) {
  if (!it || it.kind !== 'parse') return '';
  const sel = { p: a.p || '', g: a.g || '', n: a.n || '', conj: a.conj || '', stem: a.stem || '', root: a.root || '' };
  const g = gradeParse(it, sel), r = g.res || {}, alt = String(it.pgn || '').split('|')[0], P = alt ? parsePGN(alt) : {};
  const show = v => v && v !== '-' ? esc(v) : '—';
  const why = {
    p: it.conj === 'inf' || it.conj === 'ptc' ? `leave empty: ${it.conj === 'inf' ? 'an infinitive' : 'a participle'} has no person` : `should be ${P.p || '—'}`,
    g: it.conj === 'inf' ? 'leave empty: an infinitive has no gender' : P.g === 'c' ? 'should be c (common): first person and 3rd plural qatal have no gender of their own' : `should be ${P.g || '—'}`,
    n: it.conj === 'inf' ? 'leave empty: an infinitive has no number' : `should be ${P.n || '—'}`,
    conj: `should be ${esc(it.conj)}`, stem: `should be ${esc(String(it.stem).split('|')[0])}`, root: `should be ${esc(it.root)}`,
  };
  const L = [['p', 'person', sel.p], ['g', 'gender', sel.g], ['n', 'number', sel.n], ['conj', 'form', sel.conj], ['stem', 'stem', sel.stem], ['root', 'root', sel.root]];
  const rule = it.gpt ? 'GPT key protocol: root, stem and form ¼ each; person/gender/number share ¼' : 'six boxes, each 1/6';
  return `<div class="small"><b>Box by box</b> <span class="muted">(${rule})</span>: ${L.map(([k, lab, v]) => `${lab} ${k === 'root' ? H(show(v)) : show(v)} ${r[k] ? '✓' : `✗ <span class="muted">(${why[k]})</span>`}`).join(' · ')}</div>`;
}
function ovFor(rec) { try { const o = HET.live('grades/' + rec.id); return o && o.items ? o : null; } catch { return null; } }
function recWithOverlay(rec, ov) {
  const items = rec.items.map(x => { const g = ov.items[x.n] || ov.items[String(x.n)]; return g && g.s != null ? { ...x, score: g.s, sc: 'claude', fb: g.fb || x.fb, crit: g.units ? { units: g.units } : x.crit, ov: { from: x.score, by: ov.grader || 'Claude' }, chk: false } : x; });
  const all = AN.scoreSections(items, rec.weights || {});
  const ind = AN.scoreSections(items.filter(x => x.cat === 'protected' || x.cat === 'transfer'), rec.indepWeights || INDEP_W);
  return { ...rec, items, total: all.total, indep: ind.total, sections: Object.fromEntries(Object.entries(all.sections).map(([k, o]) => [k, { n: o.n, acc: Math.round(o.acc * 1000) / 1000, answered: o.answered }])), _ov: ov };
}
function gradingRequest(rec) {
  const items = rec.items.map(x => { const it = x.spec || {}; const a = { ...(x.answer || {}) }; delete a._chg; return { n: x.n, sec: x.sec, kind: x.kind, sub: x.sub || undefined, status: itemStatus(x), prompt: exStrip(it.q || it.he || it.form || ''), ref: it.ref || undefined, model: exStrip(it.model || '') || undefined, units: it.units || undefined, accepted: it.kind === 'parse' ? { root: it.root, stem: it.stem, conj: it.conj, pgn: it.pgn, alts: it.alts } : undefined, pts: it.pts || undefined, answer: a, autoScore: x.score, scoredBy: x.sc, toCheck: x.chk ? 1 : undefined }; });
  return { app: 'hebrew-trainer', kind: 'grading-request', v: 1, made: new Date().toISOString(), assessment: { id: rec.id, type: rec.type, name: (BLUEPRINTS[rec.type] || {}).name, end: new Date(rec.end).toISOString(), checksum: rec.checksum, total: rec.total, sections: rec.sections, scoring: rec.scoring || null }, rubric: { translation: TR_RUBRIC, protocol: 'Grade every item. Return an update file with docs["grades/<id>"] = { d: { v: "overlay-1", grader, ts, items: { <n>: { s: 0..1, fb, units? } } }, u: <ms> }. Never change the original record.' }, items };
}
(function () {
  const _ie = itemExplainHTML;
  itemExplainHTML = function (x) {
    const blank = !x.answered;
    let h = _ie.call(this, blank ? { ...x, err: [] } : x);
    try {
      const it = x.spec || {}, st = itemStatus(x);
      h = h.replace('<div class="panel stack" style="gap:6px">', `<div class="panel stack rv-item" data-ri="${x.n}" data-sec="${esc(x.sec || '')}" data-res="${blank ? 'blank' : x.score >= 1 ? 'right' : x.score > 0 ? 'partly' : 'wrong'}" data-chk="${x.chk ? 1 : 0}" style="gap:6px">`);
      if (blank) h = h.replace(/(<span class="chip bad">not answered<\/span>)/, `$1<span class="chip">${esc(ST_LABEL[st] || st)}</span>`);
      const add = [];
      if (blank) add.push(`<div class="small muted">No diagnosis: a blank answer shows nothing about what you know. The correct answer and how to find it are below, so you can learn it.</div>`);
      if (it.kind === 'parse' && !blank) {
        add.push(parseBoxesHTML(it, x.answer || {}));
        if (!it.gpt) { const a = x.answer || {}; const g = gradeParse(it, { p: a.p || '', g: a.g || '', n: a.n || '', conj: a.conj || '', stem: a.stem || '', root: a.root || '' }); if (Math.abs(g.score - (x.ov ? x.ov.from : x.score)) > .01) add.push(`<div class="small muted">With today’s rules (first person and 3rd plural qatal: gender must be “c”, common) this item would score ${Math.round(g.score * 100)}%. Your saved score (${Math.round((x.ov ? x.ov.from : x.score) * 100)}%) is not changed.</div>`); }
      }
      if (x.sc === 'est') add.push(`<div class="small"><span class="chip warn">automatic estimate${x.chk ? ' · to be checked by Claude' : ''}</span> ${esc((x.est && x.est.how) || '')}</div>`);
      if (x.sc === 'self') add.push('<div class="small muted">Self-scored at the time (kept as it was).</div>');
      if (x.ov) add.push(`<div class="small"><span class="chip good">graded by ${esc(x.ov.by)}</span> earlier score ${Math.round((x.ov.from || 0) * 100)}% (kept in the original record)</div>`);
      if (x.crit && x.crit.unitText && !it.units) add.push(`<div class="small"><b>Meaning units (estimate):</b> ${x.crit.unitText.map((u, j) => `${esc(u)} <b>${x.crit.units[j] === 1 ? '✓' : x.crit.units[j] ? '½' : '✗'}</b>`).join(' · ')}</div>`);
      if (x.score >= 1 && x.ms > 120000 && !blank) add.push('<div class="small muted">Right, but slow: next time find the prefix or ending first, then the stem; aim for half this time.</div>');
      if (add.length) h = h.replace(/<\/div>\s*$/, add.join('') + '</div>');
    } catch (e) { console.error(e); }
    return h;
  };
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const ov = rec && rec.items ? ovFor(rec) : null, shown = ov ? recWithOverlay(rec, ov) : rec;
    const r = _rv.call(this, shown, arguments[1]);
    try {
      const v = $('#v-session'), head = v && v.querySelector('.panel'); if (!head || !rec.items) return r;
      const items = shown.items, est = items.filter(x => x.sc === 'est').length, chk = items.filter(x => x.chk).length, blank = items.filter(x => !x.answered).length;
      const res = x => !x.answered ? 'blank' : x.score >= 1 ? 'right' : x.score > 0 ? 'partly' : 'wrong';
      const col = { right: 'var(--good)', partly: 'var(--warn)', wrong: 'var(--bad)', blank: 'var(--line)' };
      const secs = [...new Set(items.map(x => x.sec))];
      const SL = k => (BLUEPRINTS[rec.type] && BLUEPRINTS[rec.type].sections[k] || {}).label || k;
      head.insertAdjacentHTML('beforeend', `<div class="stack" style="gap:8px;border-top:1px solid var(--line);padding-top:8px">
        ${ov ? `<div class="note small"><b>Grades by ${esc(ov.grader || 'Claude')}</b> (${esc(ov.v || 'overlay')}, ${ov.ts ? new Date(ov.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}). The original record is kept: ${rec.total}% all items, independent ${rec.indep}%.</div>` : ''}
        ${est ? `<div class="note small">${est} answers have an <b>automatic estimate</b>${chk ? `; ${chk} are marked “to be checked”` : ''}. For the final grade: download the grading file and send it to Claude; the grades come back as an update file (Library → Add material) and appear here, without changing this record.</div>` : ''}
        <div class="small muted">Scoring: earned credit per item (${esc((rec.scoring && rec.scoring.policy) || 'practice rubric')}); the professor’s reported “1 point off per wrong or blank answer” is not applied (not confirmed). Completion: ${items.length - blank} of ${items.length} answered.</div>
        <div class="row" style="gap:4px;flex-wrap:wrap">${items.map(x => `<button class="btn sm" data-rj="${x.n}" title="Item ${x.n}: ${res(x)}" style="min-width:34px;border-color:${col[res(x)]};${res(x) === 'blank' ? 'opacity:.6' : ''}">${x.n}</button>`).join('')}</div>
        <div class="row small" style="gap:6px;flex-wrap:wrap"><span class="muted">Show:</span>${[['all', 'All items'], ['miss', 'Wrong + partly'], ['blank', 'Blank'], ['right', 'Right'], ['chk', 'To be checked'], ...secs.map(s => ['sec:' + s, SL(s)])].map(([k, l], i) => `<button class="btn sm ${i ? '' : 'primary'}" data-rf="${esc(k)}">${esc(l)}</button>`).join('')}</div>
        <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm" id="rv-grade">Download for Claude’s grading</button><button class="btn sm" id="rv-print">Print this correction</button><button class="btn sm" id="rv-next">Next item →</button></div></div>`);
      const panels = () => $$('.rv-item', v);
      $$('[data-rj]', v).forEach(b => b.onclick = () => { const p = v.querySelector(`.rv-item[data-ri="${b.dataset.rj}"]`); if (p) { p.hidden = false; p.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
      $$('[data-rf]', v).forEach(b => b.onclick = () => {
        const f = b.dataset.rf; $$('[data-rf]', v).forEach(x => x.classList.toggle('primary', x === b));
        panels().forEach(p => { const r = p.dataset.res; p.hidden = !(f === 'all' || (f === 'miss' && (r === 'wrong' || r === 'partly')) || (f === 'blank' && r === 'blank') || (f === 'right' && r === 'right') || (f === 'chk' && p.dataset.chk === '1') || (f.startsWith('sec:') && p.dataset.sec === f.slice(4))); });
      });
      let cur = 0; $('#rv-next').onclick = () => { const ps = panels().filter(p => !p.hidden); if (!ps.length) return; const p = ps[cur % ps.length]; cur++; p.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      $('#rv-print').onclick = () => { panels().forEach(p => p.hidden = false); $$('.rv-item details').forEach(d => d.open = true); try { window.print(); } catch { flash('Printing is not available here.'); } };
      $('#rv-grade').onclick = async () => { await saveFile(`hebrew-grade-request-${rec.id}.json`, JSON.stringify(gradingRequest(rec), null, 1)); flash('Saved. Send this file to Claude for grading.'); };
    } catch (e) { console.error(e); }
    return r;
  };
})();

// ===== 7. Small corrections to the GPT mocks (V3 audit, verified against the class stories) =====
(function () {
  const _bf = buildFS;
  buildFS = async function (k) {
    const ex = await _bf.apply(this, arguments);
    try {
      // Taken before: the items are no longer unseen; the new attempt is practice (its own record; the first one is kept).
      if (fsResults(k).length) { ex.retake = 1; for (const it of ex.items || []) it.cat = 'review'; }
      for (const it of ex.items || []) {
        // Mock 5 A9: alone, the form can be 2ms or 3fs; the story context (“you”) is the target, both are accepted.
        if (k === 'fs9' && it.kind === 'parse' && it.root === 'מצא' && it.stem === 'niphal' && it.conj === 'yiqtol') it.pgn = '2ms|3fs';
        // Mock 3 A7: the object suffix in the meaning.
        if (k === 'fs7' && it.kind === 'parse' && it.root === 'ירשׁ' && /^he will inherit/.test(it.gl || '')) it.gl = 'he will inherit you (be your heir); ךָ = “you”, the object';
      }
    } catch (e) { console.error(e); }
    return ex;
  };
})();

// Skill tables: blank items are not evidence of a weakness (they count as 0 points, but not in the skill percentages).
(function () {
  const _sk = simSkills;
  simSkills = function (recs) { return _sk.call(this, (recs || []).map(r => ({ ...r, items: (r.items || []).filter(x => x.answered) }))); };
  const _sh = simSkillsHTML;
  simSkillsHTML = function () { const h = _sh.apply(this, arguments); return h ? h.replace('</h3>', '</h3><p class="small muted" style="margin:0">Answered items only: a blank item scores 0 points but says nothing about which skill is weak.</p>') : h; };
})();

// ===== Pause and resume a simulation (Nov 22 evening) =====
function exPause() {
  if (!EX || !(EX.phase === 'taking' || EX.phase === 'writing')) return;
  try { exLeaveItem(); } catch { }
  exClockStop(); EX.paused = Date.now(); (EX.pauses = EX.pauses || []).push([EX.paused, null, 'button']); exSave(); exRenderPaused();
}
function exRenderPaused() {
  const v = $('#v-session'); showSection('v-session'); v.classList.add('exam'); clearInterval(EX_TICK);
  const left = Math.max(0, Math.round((EX.limitMs - exElapsed()) / 60000)), done = EX.items.filter((x, i) => exAnswered(x, EX.ans[i])).length;
  v.innerHTML = `<div class="panel stack" style="max-width:640px;margin:40px auto;text-align:center"><h2 style="margin:0">⏸ Paused</h2>
    <p>${esc((BLUEPRINTS[EX.type] || {}).name || 'Simulation')} · ${done} of ${EX.items.length} items answered · <b>${left} minutes left</b>.</p>
    <p class="small muted">The clock is stopped and your answers are saved on this device. You can close the app; when you open it again, choose “Resume where I stopped”. The pause is recorded with the result.</p>
    <div class="row" style="justify-content:center"><button class="btn primary" id="ex-unpause">Continue the test</button><button class="btn ghost" id="ex-pleave">Leave (stay paused)</button></div></div>`;
  $('#ex-unpause').onclick = () => { const p = (EX.pauses || []).slice(-1)[0]; if (p && p[1] == null) p[1] = Date.now(); EX.paused = null; exSave(); renderExam(); };
  $('#ex-pleave').onclick = () => go('today');
}
(function () {
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const r = _rv.apply(this, arguments);
    try { const P = (rec && rec.pauses) || []; if (P.length) { const min = Math.round(P.reduce((s, p) => s + ((p[1] || p[0]) - p[0]), 0) / 60000); const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('beforeend', `<div class="small muted">Paused ${P.length}× (${min} min away, not counted in the time).</div>`); } } catch (e) { console.error(e); }
    return r;
  };
})();

// ===== Finish a submitted simulation later, or take it again (Nov 22 evening) =====
async function startFSFinish(k) {
  const r = fsResults(k).slice(-1)[0]; if (!r) return startFS(k);
  await fsStart(async () => { const ex = await buildFS(k); ex.contOf = r.id; return ex; }, 'the simulation');
  if (!EX || EX.contOf !== r.id) return;
  const byIid = {}; EX.items.forEach((it, i) => { if (it.iid) byIid[it.iid] = i; });
  for (const x of r.items || []) { if (!x.answered) continue; const i = x.iid && byIid[x.iid] != null ? byIid[x.iid] : x.n - 1; if (!EX.items[i]) continue; const a = { ...(x.answer || {}) }; delete a._chg; EX.ans[i] = a; }
  EX.elapsed = Math.max(0, Math.min(r.examMs || 0, EX.limitMs - 60000)); EX.prevMs = r.examMs || 0; exSave(); renderExam();
}
function fsLeftMin(r) { return r ? Math.max(0, Math.round(((r.limitMs || FS_MIN * 60000) - (r.examMs || 0)) / 60000)) : 0; }
(function () {
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    let h = _fc.apply(this, arguments);
    try { for (const k of FS_KEYS) { const r = fsResults(k).slice(-1)[0]; if (!r) continue; const left = fsLeftMin(r), open = (r.items || []).filter(x => !x.answered).length;
      if (left >= 2 && open) h = h.replace(new RegExp(`<button class="btn\\s*" data-fs="${k}">Take again</button>`), `<div class="stack" style="gap:6px;flex:0 0 auto;min-width:150px"><button class="btn primary" data-fsc="${k}" style="white-space:nowrap" title="Your submitted answers filled in, with the minutes you had left">Finish it (${left} min left)</button><button class="btn" data-fs="${k}" style="white-space:nowrap">Take again</button></div>`); } } catch (e) { console.error(e); }
    return h;
  };
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-fsc]'); if (b) { e.preventDefault(); startFSFinish(b.dataset.fsc); } });
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const r = _rv.apply(this, arguments);
    try { if (rec && (rec.retake || rec.contOf)) { const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('afterbegin', `<div class="note small"><b>${rec.contOf ? 'Finished later' : 'Second attempt'}:</b> practice, not an independent score (the paper had been seen). The first attempt is kept as it was.</div>`); } } catch (e) { console.error(e); }
    return r;
  };
})();

// ===== Only class material (Emerson, Nov 22): say where each word comes from; drop what no class source has =====
(function () {
  const i = TERMS.findIndex(t => t[0] === 'תַּרְגּוּם'); if (i >= 0) TERMS.splice(i, 1); // not in any class handout
})();
function courseSrcHTML(word) {
  const k = fvKey(word);
  const QW = ['מִי', 'מָה', 'לָמָּה', 'מַדּוּעַ', 'אֵיפֹה', 'אָנָה', 'מֵאַיִן', 'מָתַי', 'כַּמָּה', 'אֵיךְ', 'לְמִי', 'עַד מָתַי'].map(fvKey);
  if (fvKey('שְׁאֵלָה') === k) return '<div class="muted">From your professor’s handout <b>Classroom phrases</b> (הֲיֵשׁ לָכֶם שְׁאֵלָה?).</div>';
  if (QW.includes(k)) return '<div class="muted">From your professor’s handout <b>Beginning Hebrew Interrogatives</b> (the question words of the exam).</div>';
  if (TERMS.some(t => fvKey(t[0]) === k)) return '<div class="muted">From your professor’s handout <b>Grammatical terminology in Hebrew</b> (the terms used in exam and quiz questions).</div>';
  if (VOCAB.some(v => fvKey(v.h) === k)) return '<div class="muted">From your professor’s <b>main vocabulary list</b> (“responsible for course/final exam”); no sentence with it in Ruth or the class stories.</div>';
  return '<div class="muted">No sentence with this word in Ruth or the class stories.</div>';
}

// ===== Diagnostic 1 · Parsing (Nov 23): 20 verbs, all eight stems, the main forms, weak and regular roots =====
// Emerson's request: his own version of GPT's parsing diagnostic, with different verbs, only from class material
// (Ruth 2–4 outside the passages of the nine simulations, and the practice slides of the professor's Pual, Hithpael and Hophal lessons).
// Per verb: root · stem · form · person/gender/number · English meaning; “not sure” marks per field. No pronunciation, no help, 30 minutes.
const DG1 = [
  // part, form, root, stem, conj, pgn, meaning, source, alts, why it is in the test, pattern tags
  ['A', 'וַתִּתֶּן', 'נתן', 'qal', 'wayyiqtol', '3fs', 'and she gave', 'Ruth 2:18', [{ pgn: '2ms' }], 'I-nun: the נ is gone and ת is doubled; וַ + doubled prefix = wayyiqtol.', ['weak', 'I-nun', 'wayyiqtol']],
  ['A', 'יִפֹּל', 'נפל', 'qal', 'yiqtol', '3ms', 'it will fall (turn out)', 'Ruth 3:18', null, 'I-nun again, without וַ: plain yiqtol.', ['weak', 'I-nun']],
  ['A', 'וַתֵּשֶׁב', 'ישב', 'qal', 'wayyiqtol', '3fs', 'and she sat', 'Ruth 2:14', [{ pgn: '2ms' }], 'I-yod: the י disappears, tsere under the prefix.', ['weak', 'I-yod', 'wayyiqtol']],
  ['A', 'וְאָכַלְתְּ', 'אכל', 'qal', 'weqatal', '2fs', 'and you (f.) shall eat', 'Ruth 2:14', null, 'וְ + qatal after a command (גֹּשִׁי) = weqatal; ending תְּ = you (f.).', ['weqatal', '2fs']],
  ['A', 'שִׁכְבִי', 'שכב', 'qal', 'impv', '2fs', 'lie down! (you, f.)', 'Ruth 3:13', null, 'No prefix + ending ִי = imperative 2fs.', ['impv', '2fs']],
  ['A', 'בָּרוּךְ', 'ברך', 'qal', 'ptc', 'ms', 'blessed', 'Ruth 2:19', null, 'Qal passive participle (qamets + shureq): gender and number only, no person.', ['ptc', 'no-person']],
  ['A', 'לְגָאֳלֵךְ', 'גאל', 'qal', 'inf', '', 'to redeem you (f.)', 'Ruth 3:13', null, 'לְ + infinitive + ךְ “you (f.)” as the OBJECT. No person/gender/number for the verb.', ['inf', 'object-suffix']],
  ['A', 'שֹׁל', 'שלל', 'qal', 'inf', '', '(surely) pull out', 'Ruth 2:16', null, 'Infinitive absolute before the same verb (שֹׁל תָּשֹׁלּוּ) = “you shall surely pull out”.', ['inf', 'inf-abs', 'weak', 'geminate']],
  ['A', 'בָאָה', 'בוא', 'qal', 'qatal', '3fs', 'she came', 'Ruth 3:14', [{ conj: 'ptc', pgn: 'fs' }], 'Hollow root. Here qatal 3fs (the woman came); the same letters can be the participle fs, so that is accepted too.', ['weak', 'hollow']],
  ['A', 'קָנִיתִי', 'קנה', 'qal', 'qatal', '1cs', 'I have bought', 'Ruth 4:9', null, 'III-he: ה becomes ִי before the ending תִי (= I). First person: gender c.', ['weak', 'III-he', 'common']],
  ['B', 'לִקַּטְתְּ', 'לקט', 'piel', 'qatal', '2fs', 'you (f.) gleaned', 'Ruth 2:19', null, 'Piel qatal: I under root 1, doubled root 2; ending תְּ = you (f.).', ['2fs']],
  ['B', 'כִּלּוּ', 'כלה', 'piel', 'qatal', '3cp', 'they have finished', 'Ruth 2:21', null, 'Piel of כלה (III-he, ה dropped before וּ); 3rd plural qatal is common: gender c.', ['weak', 'III-he', 'common']],
  ['B', 'יִכָּרֵת', 'כרת', 'niphal', 'yiqtol', '3ms', 'will be cut off', 'Ruth 4:10', null, 'Niphal yiqtol: the נ is absorbed, root 1 doubled (כּ), A then E (יִקָּטֵל).', []],
  ['B', 'הַנִּשְׁבָּרָה', 'שבר', 'niphal', 'ptc', 'fs', 'the broken (one)', 'Hophal slides, practice', null, 'הַ = the article. נִ + qamets under root 2 = Niphal participle; ָה = feminine. No person.', ['ptc', 'no-person', 'article']],
  ['B', 'שֻׁלְּחוּ', 'שלח', 'pual', 'qatal', '3cp', 'they were sent', 'Pual slides, practice (Gen 44:3)', null, 'U under root 1 + doubled root 2 = Pual (passive of Piel); ending וּ = they (common).', ['common']],
  ['B', 'וַתִּתְכַּס', 'כסה', 'hithpael', 'wayyiqtol', '3fs', 'and she covered herself', 'Hithpael slides, practice', [{ pgn: '2ms' }], 'תְ after the person prefix + doubled root 2 = Hithpael; III-he short form (ה gone).', ['weak', 'III-he', 'wayyiqtol']],
  ['B', 'תִּשְׁתַּחֲוֶה', 'חוה', 'hishtaphel', 'yiqtol', '3fs|2ms', 'she / you will bow down (worship)', 'Hithpael slides, practice', null, 'שְׁתַּ before the root חוה = the Hishtaphel; prefix ת = she or you (m.).', ['weak']],
  ['B', 'יַכִּיר', 'נכר', 'hiphil', 'yiqtol', '3ms', 'he will recognize', 'Ruth 3:14', null, 'I-nun Hiphil: pataḥ under the prefix (יַ), נ absorbed into כּ, ִי before the last root letter.', ['weak', 'I-nun', 'hiphil-weak']],
  ['B', 'הוֹתִרָה', 'יתר', 'hiphil', 'qatal', '3fs', 'she had left over', 'Ruth 2:18', null, 'I-yod Hiphil: הוֹ (the י of the root became וֹ) + ִי; ending ָה = she.', ['weak', 'I-yod', 'hiphil-weak']],
  ['B', 'וַיֻּכּוּ', 'נכה', 'hophal', 'wayyiqtol', '3mp', 'and they were struck', 'Hophal slides, practice', null, 'U (qibbuts) under the prefix = Hophal (passive of Hiphil); נ absorbed (כּ), ה dropped; וּ = they.', ['weak', 'I-nun', 'III-he', 'wayyiqtol']],
];
BLUEPRINTS.dg1 = { id: 'dg1', name: 'Diagnostic 1 · Parsing (20 verbs, all eight stems)', minutes: () => 30, sections: { parse: { n: 20, w: 1, label: 'Parsing (מָה הַפֹּעַל הַזֶּה?)' } } };
async function buildDG1() {
  const items = DG1.map((d, i) => { const [part, form, root, stem, conj, pgn, gloss, ref, alts, why, tags] = d; const m = /^Ruth (\d):(\d+)$/.exec(ref); const v = m ? ruthVerse(+m[1], +m[2]) : null;
    return { kind: 'parse', key: 'dg1|' + form, cid: 'dg1:' + AN.hash(form), form, root, stem, conj, pgn, gloss, gl: gloss, ref, ...(alts ? { alts } : {}), why, tags, part, dg: 1, ctx: v ? v.he : '', sec: 'parse', cat: 'protected', t: PB_STEM_TOPIC[stem] || stem, diff: tags.includes('weak') ? 2.5 : 2 }; });
  const again = dgResults().length > 0; if (again) items.forEach(it => it.cat = 'review');
  return { id: 'a' + Date.now().toString(36), type: 'dg1', blueprint: 'dg1', items, limits: [], limitMs: 30 * 60000, created: Date.now(), passage: null, ...(again ? { retake: 1 } : {}) };
}
const startDG1 = () => fsStart(buildDG1, 'the diagnostic');
const dgResults = () => (S.assess || []).filter(a => a.type === 'dg1' && a.end).sort((a, b) => a.end - b.end);
const isDG = t => /^(dg1|dg1g|dgr)$/.test(t || '');
const dgAll = () => (S.assess || []).filter(a => isDG(a.type) && a.end).sort((a, b) => a.end - b.end);
const DG_INTRO = {};
(function () {
  const _ei = exItemHTML;
  exItemHTML = function (it, a, n) {
    let h = _ei.apply(this, arguments); if (!it || !it.dg) return h;
    const U = (a && a.unsure) || {};
    h = h.replace(/Item \d+ · [^<]*/, it.part ? `Item ${n} · Part ${it.part} · ${it.part === 'A' ? 'Qal: all the forms' : 'the derived stems'}` : `Item ${n} · ${esc(it.dgLabel || 'Retest')}`);
    return h + `<label class="f">Meaning in English<input type="text" class="ex-txt" data-k="mean" value="${esc((a && a.mean) || '')}" autocomplete="off"></label>
      <div class="row small" style="gap:6px;flex-wrap:wrap"><span class="muted">Not sure about (mark it, as GPT’s “?”):</span>${[['root', 'root'], ['stem', 'stem'], ['form', 'form'], ['pgn', 'person/gender/number'], ['mean', 'meaning']].map(([k, l]) => `<button class="btn sm ${U[k] ? 'primary' : ''}" data-dgu="${k}" aria-pressed="${!!U[k]}">? ${l}</button>`).join('')}</div>`;
  };
  const _wi = wireExItem;
  wireExItem = function (v, it, a, onChange) {
    const r = _wi.apply(this, arguments);
    if (it && it.dg) $$('[data-dgu]', v).forEach(b => b.onclick = () => { a.unsure = a.unsure || {}; const k = b.dataset.dgu; a.unsure[k] = !a.unsure[k]; b.classList.toggle('primary', !!a.unsure[k]); b.setAttribute('aria-pressed', !!a.unsure[k]); onChange(); });
    return r;
  };
  const _re = renderExam;
  renderExam = function () {
    const r = _re.apply(this, arguments);
    if (EX && isDG(EX.type) && EX.type !== 'dg1' && EX.phase === 'intro') { const h1 = $('#v-session h1'); if (h1) h1.insertAdjacentHTML('afterend', DG_INTRO[EX.type] || ''); }
    if (EX && EX.type === 'dg1' && EX.phase === 'intro') { const h1 = $('#v-session h1'); if (h1) h1.insertAdjacentHTML('afterend', `<div class="note"><b>A diagnostic, not a simulation.</b> 20 verbs, one at a time: Part A (1–10) the Qal in all its forms; Part B (11–20) Niphal, Piel, Pual, Hithpael, Hishtaphel, Hiphil, Hophal. For every verb: root · stem · form · person/gender/number · the English meaning. If you are not sure of a box, still give your best answer and press “? …” for it: the analysis separates what you knew, what you guessed and what you did not know. No notes, no lexicon, no pronunciation. Target: 30 minutes. Verbs come from Ruth 2–4 (outside the passages of the nine simulations) and from the practice slides of the professor’s Pual, Hithpael and Hophal lessons.</div>`); }
    return r;
  };
})();
function dgAnalysisHTML(rec) {
  const rows = (rec.items || []).map(x => { const it = x.spec || {}, a = x.answer || {}; const sel = { p: a.p || '', g: a.g || '', n: a.n || '', conj: a.conj || '', stem: a.stem || '', root: a.root || '' };
    const g = gradeParse(it, sel), r = g.res || {}; const mean = (a.mean || '').trim(); const mc = mean ? AG.enCover(it.gloss || '', mean).cov : 0;
    const pgnOK = ['p', 'g', 'n'].every(k => r[k] !== false); return { x, it, a, r, ans: !!x.answered, mean: mean ? (mc >= .5 ? 1 : mc > 0 ? .5 : 0) : null, pgnOK, U: a.unsure || {} }; });
  const ans = rows.filter(o => o.ans), pct = (n, d) => d ? `${n} / ${d} (${Math.round(n / d * 100)}%)` : '—';
  const F = [['root', o => o.r.root], ['stem (בִּנְיָן)', o => o.r.stem], ['form (נְטִיָּה)', o => o.r.conj], ['person', o => o.r.p], ['gender', o => o.r.g], ['number', o => o.r.n], ['all of person/gender/number', o => o.pgnOK], ['meaning', o => o.mean == null ? null : o.mean >= 1]];
  const fieldRows = F.map(([l, f]) => { const v = ans.map(f).filter(z => z != null); return [l, pct(v.filter(Boolean).length, v.length)]; });
  const group = (key, lab) => { const m = {}; for (const o of ans) { const k = key(o); (m[k] = m[k] || []).push(o); } return Object.entries(m).map(([k, L]) => [lab(k), pct(L.reduce((s, o) => s + o.x.score, 0).toFixed(1) * 1, L.length), L.map(o => o.x.n).join(', ')]); };
  const byStem = group(o => o.it.stem, k => (STEMS[k] || [k, k])[1]), byConj = group(o => o.it.conj, k => (CONJ[k] || [k, k])[1]);
  const weak = ans.filter(o => (o.it.tags || []).includes('weak')), reg = ans.filter(o => !(o.it.tags || []).includes('weak'));
  const avg = L => L.length ? Math.round(L.reduce((s, o) => s + o.x.score, 0) / L.length * 100) + '% (n=' + L.length + ')' : '—';
  const boxes = ['root', 'stem', 'form', 'pgn', 'mean'], okOf = (o, k) => k === 'root' ? o.r.root : k === 'stem' ? o.r.stem : k === 'form' ? o.r.conj : k === 'pgn' ? o.pgnOK : o.mean == null ? null : o.mean >= 1;
  let uR = 0, uW = 0, sW = 0; for (const o of ans) for (const k of boxes) { const ok = okOf(o, k); if (ok == null) continue; if (o.U[k]) ok ? uR++ : uW++; else if (!ok) sW++; }
  const P = (l, f) => { const L = rows.filter(o => f(o.it)); const done = L.filter(o => o.ans); return [l, !L.length ? 'not in this test' : done.length ? `${done.filter(o => o.x.score >= 1).length} fully right of ${done.length}${done.length < L.length ? ` (${L.length - done.length} blank)` : ''} · items ${L.map(o => o.x.n).join(', ')}` : 'not answered']; };
  const tg = it => it.tags || [];
  const pat = [
    P('Infinitive or participle (Nov 21: לָגוּר; Nov 22: לִזְבֹּחַ)', it => it.conj === 'inf' || it.conj === 'ptc'),
    P('Weak Hiphil read as Qal (Nov 22: אוֹדִיעַ, וַיַּעֲבֵר)', it => it.stem === 'hiphil' && tg(it).includes('weak')),
    P('Weak roots recovered (Nov 22: סור, ידע missed)', it => tg(it).includes('weak')),
    P('Common gender: first person and 3rd plural (Nov 21: אֶקָּבֵר)', it => /c/.test(String(it.pgn || '').split('|')[0])),
    P('Person/gender/number of 2nd feminine forms', it => /^2f/.test(String(it.pgn || ''))),
    P('Stems never tested in a simulation: Pual, Hithpael, Hishtaphel, Hophal', it => ['pual', 'hithpael', 'hishtaphel', 'hophal'].includes(it.stem)),
  ];
  return `<div class="panel stack"><h2 style="margin:0">Diagnostic analysis</h2>
    <p class="small muted">Answered ${ans.length} of ${rows.length}. Blank items are left out of every percentage (no evidence). One diagnostic shows tendencies, not a fixed level: retest the weak categories later with new verbs.</p>
    <b>By box</b>${tableHTML(['Box', 'Right'], fieldRows)}
    <b>By stem</b> <span class="small muted">(average six-box credit)</span>${tableHTML(['Stem', 'Credit', 'Items'], byStem)}
    <b>By form</b>${tableHTML(['Form', 'Credit', 'Items'], byConj)}
    <div class="small"><b>Weak roots</b> ${avg(weak)} · <b>regular roots</b> ${avg(reg)}</div>
    <div class="small"><b>Your “?” marks:</b> ${uR} boxes right although marked unsure (you know more than you think) · ${uW} wrong and marked unsure (honest gaps) · <b>${sW} wrong without a “?”</b> (confident errors: these are the ones to fix first).</div>
    <b>Compared with Nov 21–22</b>${tableHTML(['Pattern', 'This diagnostic'], pat)}</div>`;
}
(function () {
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const r = _rv.apply(this, arguments);
    try {
      if (rec && isDG(rec.type)) {
        const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('afterend', dgAnalysisHTML(rec));
        for (const x of rec.items || []) { const el = $(`.rv-item[data-ri="${x.n}"]`), it = x.spec || {}, a = x.answer || {}; if (!el) continue;
          const mean = (a.mean || '').trim(), U = Object.keys(a.unsure || {}).filter(k => a.unsure[k]);
          el.insertAdjacentHTML('beforeend', `<div class="small"><b>Meaning:</b> ${mean ? `you wrote “${esc(mean)}”` : 'not given'} · expected “${esc(it.gloss || '')}”${U.length ? ` · you marked “?” on: ${esc(U.join(', '))}` : ''}</div><div class="small"><b>Why this verb is in the test:</b> ${heWrap(esc(it.why || ''))} <span class="muted">Source: ${esc(it.ref || '')}.</span></div>`); }
      }
    } catch (e) { console.error(e); }
    return r;
  };
  // The card on the Final rescue tab and the block in Monday's plan.
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    const h = _fc.apply(this, arguments); const R = dgResults(), last = R[R.length - 1];
    const card = `<div class="step ${R.length ? 'done' : ''}" style="border:1px dashed var(--accent);border-radius:10px;padding:8px"><span class="n">${R.length ? '✓' : 'D'}</span><div><b>Diagnostic 1 · Parsing</b> <span class="small muted">(20 verbs, all eight stems, 30 min; root · stem · form · person/gender/number · meaning)</span><div class="small muted">${R.length ? `Taken ${R.length}× · last ${simPct(last)}% · the analysis is in its correction` : 'Before the next simulation: it shows exactly which part of parsing fails.'}</div></div><div class="stack" style="gap:6px;flex:0 0 auto">${R.length ? `<button class="btn" data-dgr="1" style="white-space:nowrap">See the analysis</button>` : ''}<button class="btn ${R.length ? '' : 'primary'}" data-dg1="1" style="white-space:nowrap">${R.length ? 'Take again' : 'Start'}</button></div></div>`;
    return h.replace('<div class="plan">', '<div class="plan">' + card);
  };
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-dg1],[data-dgr]'); if (!t) return; e.preventDefault(); if (t.dataset.dg1) startDG1(); else { const r = dgResults().slice(-1)[0]; if (r) renderExamReview(r); } });
  const _pl = planBlockList;
  planBlockList = function (d) {
    const B = _pl.apply(this, arguments);
    if (d === '2026-11-23' || d === '2026-11-24') {
      const today = () => dgResults().some(a => dayKey(new Date(a.end)) === d);
      B.unshift({ id: 'dg1', min: 30, title: d === '2026-11-23' ? 'First: Diagnostic 1 · Parsing (20 verbs, 30 min)' : 'Diagnostic 1 again, if you did not take it yesterday', sub: 'Root, stem, form, person/gender/number and meaning for 20 class verbs in all eight stems. The analysis tells which part of parsing fails (then fix only that).', act: () => startDG1(), check: today });
    }
    return B;
  };
})();

// ===== Everything GPT proposed on Nov 23 (Emerson: “build everything GPT suggested”) =====
// 1) GPT’s own 20-verb parsing diagnostic, as a second version (also the retest with different verbs);
// 2) two submissions (Part A, then Part B, no correction in between);
// 3) a retest of the weak categories with NEW class verbs;
// 4) Diagnostic 2: understanding Hebrew questions (what is asked, how fast);
// 5) the decision: another full simulation or focused work, from the two diagnostic profiles.
function rootTags(root) {
  const r = [...String(root || '').replace(/[^א-ת]/g, '')], t = [];
  if (r[0] === 'נ') t.push('I-nun'); if (r[0] === 'י') t.push('I-yod'); if (r.length === 3 && 'וי'.includes(r[1])) t.push('hollow');
  if (r[2] === 'ה') t.push('III-he'); if (r.length === 3 && r[1] === r[2]) t.push('geminate');
  if (t.length) t.unshift('weak'); return t;
}
const DG1G = [
  ['A', 'שָׁמַר', 'שׁמר', 'qal', 'qatal', '3ms', 'he kept / guarded', '', null, 'Qal qatal 3ms: A–A, no prefix, no ending.'],
  ['A', 'תִּשְׁמְרוּ', 'שׁמר', 'qal', 'yiqtol', '2mp', 'you (m. pl.) will keep', '', null, 'Prefix ת + ending וּ = you (m. pl.); I–sheva–(O) = Qal yiqtol.'],
  ['A', 'וַיִּקְרָא', 'קרא', 'qal', 'wayyiqtol', '3ms', 'and he called', '', null, 'וַ + doubled prefix = wayyiqtol; III-alef keeps A.'],
  ['A', 'וְהָלַכְתָּ', 'הלך', 'qal', 'weqatal', '2ms', 'and you shall go', 'קַח מַטְּךָ בְּיָדְךָ וְהָלַכְתָּ', null, 'וְ + qatal after a command = weqatal; ending תָּ = you (m.).'],
  ['A', 'וְיִשָּׁמֵר', 'שׁמר', 'niphal', 'weyiqtol', '3ms', 'and let him be kept / take care', '', null, 'Ordinary וְ + yiqtol; doubled root 1 (שּׁ) with A then E = Niphal.'],
  ['A', 'שֹׁמֶרֶת', 'שׁמר', 'qal', 'ptc', 'fs', 'keeping (f.)', '', null, 'O after root 1 = Qal participle; ־ֶרֶת = feminine singular. No person.'],
  ['A', 'שְׁמֹר', 'שׁמר', 'qal', 'impv', '2ms', 'keep!', 'שְׁמֹר אֶת־הַבְּרִית', [{ conj: 'inf', pgn: '' }], 'Sheva–O with no prefix: imperative 2ms (here: a command); the same shape is the infinitive construct.'],
  ['A', 'לַעֲשׂוֹת', 'עשה', 'qal', 'inf', '', 'to do / to make', '', null, 'לְ + infinitive of a III-he root: the ending וֹת replaces ה. No person/gender/number.'],
  ['A', 'שָׁמוֹר', 'שׁמר', 'qal', 'inf', '', 'keeping (infinitive absolute)', '', null, 'A–O = Qal infinitive absolute (often strengthens another verb).'],
  ['A', 'דִּבֶּר', 'דבר', 'piel', 'qatal', '3ms', 'he spoke', '', null, 'I under root 1 + doubled root 2 + E = Piel qatal 3ms.'],
  ['B', 'יְשַׁלֵּם', 'שׁלם', 'piel', 'yiqtol', '3ms', 'he will repay', '', null, 'Sheva–A–E + doubled root 2 = Piel yiqtol.'],
  ['B', 'מְקַדֶּשֶׁת', 'קדשׁ', 'piel', 'ptc', 'fs', 'sanctifying (f.)', '', null, 'מְ prefix + Piel pattern = Piel participle; ־ֶשֶׁת = feminine singular.'],
  ['B', 'קֻדַּשׁ', 'קדשׁ', 'pual', 'qatal', '3ms', 'it was sanctified', '', null, 'U under root 1 + doubled root 2 = Pual (passive of Piel).'],
  ['B', 'הֵבִיא', 'בוא', 'hiphil', 'qatal', '3ms', 'he brought', '', null, 'Hollow root in the Hiphil: הֵ + ִי; the ו of בוא is gone.'],
  ['B', 'וַיַּעֲלוּ', 'עלה', 'hiphil', 'wayyiqtol', '3mp', 'and they brought up (or: and they went up)', '', [{ stem: 'qal' }], 'III-he: ה dropped before וּ. Qal and Hiphil look the same here (prefix pataḥ before the guttural ע): context decides; both accepted.'],
  ['B', 'הַקְרֵב', 'קרב', 'hiphil', 'impv', '2ms', 'bring near!', '', [{ conj: 'inf', pgn: '' }], 'הַ + E with no ending: Hiphil imperative 2ms (also the infinitive).'],
  ['B', 'הֻקְרַב', 'קרב', 'hophal', 'qatal', '3ms', 'it was brought near', '', null, 'הֻ (U) = Hophal, the passive of the Hiphil.'],
  ['B', 'נִשְׁמָר', 'שׁמר', 'niphal', 'ptc', 'ms', 'being kept', '', [{ conj: 'qatal', pgn: '3ms' }], 'נִ + qamets under root 2 = Niphal participle (the qatal has pataḥ: נִשְׁמַר; in pause both look alike).'],
  ['B', 'הִתְחַזֵּק', 'חזק', 'hithpael', 'impv', '2ms', 'strengthen yourself!', '', [{ conj: 'qatal', pgn: '3ms' }, { conj: 'inf', pgn: '' }], 'הִתְ + doubled root 2 = Hithpael; this shape is imperative 2ms, qatal 3ms or infinitive (context decides).'],
  ['B', 'וַיִּשְׁתַּחוּ', 'חוה', 'hishtaphel', 'wayyiqtol', '3ms', 'and he bowed down', '', null, 'שְׁתַּ + root חוה = Hishtaphel; the final וּ belongs to the root: singular.'],
];
BLUEPRINTS.dg1g = { id: 'dg1g', name: 'Diagnostic 1 · GPT’s version (20 verbs)', minutes: () => 30, sections: { parse: { n: 20, w: 1, label: 'Parsing (מָה הַפֹּעַל הַזֶּה?)' } } };
BLUEPRINTS.dgr = { id: 'dgr', name: 'Diagnostic retest · your weak categories (new verbs)', minutes: () => 20, sections: { parse: { n: 12, w: 1, label: 'Parsing (מָה הַפֹּעַל הַזֶּה?)' } } };
DG_INTRO.dg1g = `<div class="note"><b>GPT’s version of Diagnostic 1</b> (the 20 verbs GPT proposed; mostly paradigm forms of שׁמר and familiar class verbs, not taken from one text). Same rules: root · stem · form · person/gender/number · meaning, “?” where unsure, no notes, 30 minutes, Part A (Qal) then Part B (derived stems). Use it as the second version or as the retest of Diagnostic 1.</div>`;
DG_INTRO.dgr = `<div class="note"><b>Retest with new verbs.</b> 12 verbs from Ruth that you have not had in a diagnostic, chosen from the categories you missed (stem, form, weak-root type). Same rules as Diagnostic 1. This shows whether a weakness is real (it comes back with new verbs) or was a one-off.</div>`;
function dgItemsFrom(list, prefix) {
  return list.map(d => { const [part, form, root, stem, conj, pgn, gloss, src, alts, why] = d; const m = /^Ruth (\d):(\d+)$/.exec(src || ''); const v = m ? ruthVerse(+m[1], +m[2]) : null; const tags = d[10] || rootTags(root);
    return { kind: 'parse', key: prefix + '|' + form, cid: prefix + ':' + AN.hash(form), form, root, stem, conj, pgn, gloss, gl: gloss, ref: m ? src : (src && /[א-ת]/.test(src) ? 'context given by GPT' : src || 'GPT diagnostic'), ...(alts ? { alts } : {}), why, tags, part, dg: 1, ctx: v ? v.he : (src && /[א-ת]/.test(src) ? src : ''), sec: 'parse', cat: 'protected', t: PB_STEM_TOPIC[stem] || stem, diff: tags.includes('weak') ? 2.5 : 2 }; });
}
async function buildDG1G() {
  const items = dgItemsFrom(DG1G, 'dg1g'), again = (S.assess || []).some(a => a.type === 'dg1g' && a.end); if (again) items.forEach(it => it.cat = 'review');
  return { id: 'a' + Date.now().toString(36), type: 'dg1g', blueprint: 'dg1g', items, limits: [], limitMs: 30 * 60000, created: Date.now(), passage: null, ...(again ? { retake: 1 } : {}) };
}
async function buildDGR() {
  const prev = dgAll(); if (!prev.length) throw new Error('Take Diagnostic 1 first: the retest is built from its misses.');
  const used = new Set([...DG1, ...DG1G].map(d => AN.normHe(d[1]))); prev.forEach(r => (r.items || []).forEach(x => used.add(AN.normHe((x.spec || {}).form || ''))));
  const want = { stem: {}, conj: {}, tag: {} };
  for (const r of prev.slice(-2)) for (const x of r.items || []) { if (!x.answered || x.score >= 1) continue; const it = x.spec || {}; want.stem[it.stem] = (want.stem[it.stem] || 0) + 1; want.conj[it.conj] = (want.conj[it.conj] || 0) + 1; (it.tags || []).forEach(t => { if (t !== 'weak') want.tag[t] = (want.tag[t] || 0) + 1; }); }
  const banned = /^Ruth (1:|2:([1-9]|1[0-3])\b|3:([1-9]|1[01])\b|4:([1-6]|1[1-6])\b)/; // Ruth 1 (practice final) and the passages of the nine simulations
  const pool = RUTH.verbs.map((v, i) => ({ v, i })).filter(({ v }) => !used.has(AN.normHe(v[0])) && !banned.test(v[7] || '') && !/suffix/.test(v[7] || ''));
  const scored = pool.map(o => { const [form, root, stem, conj] = o.v; const tags = rootTags(root); return { ...o, tags, s: 2 * (want.stem[stem] || 0) + 2 * (want.conj[conj] || 0) + tags.reduce((a, t) => a + (want.tag[t] || 0), 0) + Math.random() }; }).sort((a, b) => b.s - a.s);
  const pick = [], seenKey = {};
  for (const o of scored) { const k = o.v[2] + '|' + o.v[3]; if ((seenKey[k] || 0) >= 2) continue; seenKey[k] = (seenKey[k] || 0) + 1; pick.push(o); if (pick.length >= 12) break; }
  const items = pick.map(({ v, tags }) => { const [form, root, stem, conj, pgn, gloss, , note] = v; const ref = String(note || '').split(' · ')[0]; const m = /^Ruth (\d):(\d+)$/.exec(ref); const vv = m ? ruthVerse(+m[1], +m[2]) : null;
    const alts = /^3fs$/.test(pgn) && /^(וַ?תּ?|ת)/.test(AN.normHe(form).replace(/^ו/, '')) && conj !== 'qatal' ? [{ pgn: '2ms' }] : null;
    return { kind: 'parse', key: 'dgr|' + form, cid: 'dgr:' + AN.hash(form), form, root, stem, conj, pgn, gloss, gl: gloss, ref, ...(alts ? { alts } : {}), why: `Chosen because you missed ${stem} / ${conj}${tags.length ? ' / ' + tags.filter(t => t !== 'weak').join(', ') : ''} forms before.`, tags, dg: 1, dgLabel: 'Retest with a new verb', ctx: vv ? vv.he : '', sec: 'parse', cat: 'transfer', t: PB_STEM_TOPIC[stem] || stem, diff: 2.3 }; });
  if (!items.length) throw new Error('No new Ruth verbs are left for a retest.');
  return { id: 'a' + Date.now().toString(36), type: 'dgr', blueprint: 'dgr', items, limits: [], limitMs: 20 * 60000, created: Date.now(), passage: null };
}
const startDG1G = () => fsStart(buildDG1G, 'GPT’s diagnostic');
const startDGR = () => fsStart(buildDGR, 'the retest');

// ----- Diagnostic 2: what is the Hebrew question asking? -----
const DQ_CATS = ['a person (who? whom? to / with whom?)', 'an owner (whose?)', 'a comparison (like whom?)', 'a thing or an action (what?)', 'a reason (why?)', 'a place (where? to where? from where?)', 'a time (when? until when? since when?)', 'a number or amount (how many? how much?)', 'a manner (how?)', 'yes or no', 'a means (with what? in what?)'];
const DQ1 = [
  // Hebrew question, English, category, question word, source
  ['מָה עוֹשֶׂה בֹּעַז הַלַּיְלָה?', 'What is Boaz doing tonight?', 3, 'מָה', 'Ruth 3:2 · question bank'],
  ['מִי הָיָה בֹּעַז?', 'Who was Boaz?', 0, 'מִי', 'Ruth 2:1 · question bank'],
  ['אָנָה הִכָּה שָׁאוּל אֶת־הַחֲנִית?', 'Where (to) did Saul drive the spear?', 5, 'אָנָה', 'Ch. 22 · question bank'],
  ['מִמָּתַי עָמְדָה רוּת בַּשָּׂדֶה?', 'Since when had Ruth been standing (working) in the field?', 6, 'מִמָּתַי', 'Ruth 2:7 · question bank'],
  ['לָמָּה פָּנְתָה רוּת אֶל־בֹּעַז?', 'Why did Ruth turn to Boaz?', 4, 'לָמָּה', 'Ruth 3:9 · question bank'],
  ['לְמִי הָיְתָה חֶלְקַת הַשָּׂדֶה אֲשֶׁר לִקְּטָה בָּהּ רוּת?', 'Whose was the portion of the field in which Ruth gleaned?', 1, 'לְמִי', 'Ruth 2:3 · question bank'],
  ['הֲבֹעַז הוּא הַגֹּאֵל הַקָּרוֹב?', 'Is Boaz the closest redeemer?', 9, 'הֲ', 'Ruth 3:12 · question bank'],
  ['אֶל־מִי בָּא דָוִד הָרָמָתָה?', 'To whom did David come at Ramah?', 0, 'אֶל־מִי', 'Ch. 22 · question bank'],
  ['מָתַי נֶחֱרַד הָאִישׁ?', 'When was the man startled?', 6, 'מָתַי', 'Ruth 3:8 · question bank'],
  ['כְּמִי בֵּרְכוּ אֶת־רוּת?', 'Like whom did they bless Ruth?', 2, 'כְּמִי', 'Ruth 4:11 · question bank'],
  ['אֵיפֹה לִקַּטְתְּ הַיּוֹם?', 'Where did you glean today?', 5, 'אֵיפֹה', 'Ruth 2:19 · Naomi’s own words'],
  ['כַּמָּה זְקֵנִים לָקַח בֹּעַז?', 'How many elders did Boaz take?', 7, 'כַּמָּה', 'Ruth 4:2 · question bank'],
  ['עִם־מִי כָּרַת יְהוֹנָתָן בְּרִית?', 'With whom did Jonathan make a covenant?', 0, 'עִם־מִי', 'Ch. 22 · question bank'],
  ['מַדּוּעַ מָצָאתִי חֵן בְּעֵינֶיךָ לְהַכִּירֵנִי?', 'Why have I found favor in your eyes, that you take notice of me?', 4, 'מַדּוּעַ', 'Ruth 2:10 · Ruth’s own words'],
  ['עַד־מָתַי לִקְּטָה רוּת עִם נַעֲרוֹת בֹּעַז?', 'Until when did Ruth glean with Boaz’s young women?', 6, 'עַד־מָתַי', 'Ruth 2:23 · question bank'],
  ['תַּחַת מָה בָּאָה רוּת לַחֲסוֹת?', 'Under what did Ruth come to take refuge?', 3, 'תַּחַת מָה', 'Ruth 2:12 · question bank'],
  ['בַּמֶּה מָדַד בֹּעַז אֶת־הַשְּׂעֹרִים?', 'In what did Boaz measure the barley?', 10, 'בַּמֶּה', 'Ruth 3:15 · built with the professor’s interrogatives handout'],
  ['עַל־מִי חָרָה אַף שָׁאוּל?', 'With whom was Saul angry?', 0, 'עַל־מִי', 'Ch. 22 · question bank'],
  ['מֵאַיִן בָּאָה רוּת?', 'Where did Ruth come from?', 5, 'מֵאַיִן', 'Ruth 1:22 · built with the professor’s interrogatives handout'],
  ['אֵיךְ יָצָא דָוִד מִן־הַבַּיִת?', 'How did David get out of the house?', 8, 'אֵיךְ', 'Ch. 22 · question bank'],
];
BLUEPRINTS.dq1 = { id: 'dq1', name: 'Diagnostic 2 · Understanding Hebrew questions (20 questions)', minutes: () => 15, sections: { comp: { n: 20, w: 1, label: 'What does the question ask for?' } } };
async function buildDQ1() {
  const again = (S.assess || []).some(a => a.type === 'dq1' && a.end);
  const items = DQ1.map(([he, en, c, w, src]) => ({ kind: 'mc', key: 'dq1|' + he, cid: 'dq1:' + AN.hash(he), q: `<div class="small muted" style="text-align:center">${H('מָה שׁוֹאֲלִים כָּאן?')} · What kind of answer does this question ask for?</div><div class="he" dir="rtl" style="font-size:1.9rem;line-height:1.6;text-align:center;margin:10px 0">${esc(he)}</div>`, o: DQ_CATS, a: c, he, qe: en, qw: w, ref: src, dq: 1, sec: 'comp', cat: again ? 'review' : 'protected', t: 'interrogatives', x: `${heWrap(esc(w))} asks for ${esc(DQ_CATS[c])}. The question means: “${esc(en)}”` }));
  return { id: 'a' + Date.now().toString(36), type: 'dq1', blueprint: 'dq1', items, limits: [], limitMs: 15 * 60000, created: Date.now(), passage: null, ...(again ? { retake: 1 } : {}) };
}
const startDQ1 = () => fsStart(buildDQ1, 'Diagnostic 2');
DG_INTRO.dq1 = `<div class="note"><b>Diagnostic 2 · Can you understand what a Hebrew question is asking?</b> 20 questions in Hebrew, with no pronunciation and no English. For each one: (1) choose what kind of answer it asks for, and (2) write what the question means in English. You do not answer the question itself, so story knowledge does not matter. Work fast: on the exam each question should be understood in under 20 seconds. The question words are those of your professor’s handout (מִי, לְמִי, מָה, לָמָּה, מַדּוּעַ, אֵיפֹה, אָנָה, מֵאַיִן, מָתַי, עַד מָתַי, אֵיךְ, בַּמֶּה, כַּמָּה, הֲ) plus prepositions with them (אֶל־מִי, עִם־מִי, עַל־מִי, כְּמִי, תַּחַת מָה, מִמָּתַי). Target: 15 minutes.</div>`;
(function () {
  const _ei = exItemHTML;
  exItemHTML = function (it, a, n) {
    let h = _ei.apply(this, arguments); if (!it || !it.dq) return h;
    return h.replace(/Item \d+ · [^<]*/, `Question ${n} of 20`) + `<label class="f">What does the question mean? (English)<input type="text" class="ex-txt" data-k="mean" value="${esc((a && a.mean) || '')}" autocomplete="off"></label>`;
  };
  const _re = renderExam;
  renderExam = function () {
    const r = _re.apply(this, arguments);
    try {
      if (EX && EX.type === 'dq1' && EX.phase === 'intro') { const h1 = $('#v-session h1'); if (h1) h1.insertAdjacentHTML('afterend', DG_INTRO.dq1); }
      // Two submissions, as GPT proposed: after Part A a pause screen, no correction, then Part B.
      if (EX && (EX.type === 'dg1' || EX.type === 'dg1g') && EX.phase === 'taking' && EX.cur === 10 && !EX.midDone) {
        const v = $('#v-session'), done = EX.items.slice(0, 10).filter((x, i) => exAnswered(x, EX.ans[i])).length;
        v.innerHTML = `<div class="panel stack" style="max-width:640px;margin:40px auto;text-align:center"><h2 style="margin:0">Part A handed in (${done} of 10 answered)</h2><p>No correction yet, as agreed: the analysis comes after Part B. The clock keeps running.</p><p class="small muted">Part B: items 11–20, the derived stems (Niphal, Piel, Pual, Hithpael, Hishtaphel, Hiphil, Hophal). You can still go back to Part A before the final submission.</p><div class="row" style="justify-content:center"><button class="btn primary" id="dg-partb">Start Part B</button><button class="btn" id="dg-back">Back to Part A</button></div></div>`;
        $('#dg-partb').onclick = () => { EX.midDone = 1; exSave(); renderExam(); };
        $('#dg-back').onclick = () => { EX.cur = 9; exSave(); renderExam(); };
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
function dqAnalysisHTML(rec) {
  const rows = (rec.items || []).map(x => { const it = x.spec || {}, a = x.answer || {}; const mean = (a.mean || '').trim(); const mc = mean ? AG.enCover(it.qe || '', mean).cov : null; return { x, it, a, ok: x.answered ? x.score >= 1 : null, mean: mc == null ? null : mc >= .6 ? 1 : mc >= .3 ? .5 : 0, s: Math.round((x.ms || 0) / 1000), chose: a.o != null ? DQ_CATS[a.o] : null }; });
  const ans = rows.filter(o => o.x.answered), med = L => { const v = L.map(o => o.s).filter(s => s > 0).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
  const kind = ans.filter(o => o.ok).length, means = rows.filter(o => o.mean != null), meanOK = means.reduce((s, o) => s + o.mean, 0);
  const byW = rows.map(o => [heWrap(esc(o.it.qw)), o.x.answered ? (o.ok ? '✓' : `✗ chose “${esc((o.chose || '').split(' (')[0])}”`) : 'blank', o.mean == null ? '—' : o.mean >= 1 ? '✓' : o.mean ? '½' : '✗', o.s ? o.s + ' s' + (o.s > 30 ? ' (slow)' : '') : '—', heWrap(esc(o.it.he))]);
  return `<div class="panel stack"><h2 style="margin:0">Diagnostic 2 · analysis</h2>
    <div class="small"><b>Kind of answer recognized:</b> ${kind} of ${ans.length} answered (${ans.length ? Math.round(kind / ans.length * 100) : 0}%) · <b>meaning of the question</b> (automatic estimate): ${means.length ? Math.round(meanOK / means.length * 100) + '% of ' + means.length : 'not written'} · <b>median time</b> ${med(ans) ?? '—'} s per question (target under 20 s) · ${ans.filter(o => o.s > 30).length} slower than 30 s.</div>
    <p class="small muted">Recognizing the kind of answer shows whether you know the question word; the English meaning shows whether you understood the whole question; the time shows fluency. Blank items are left out.</p>
    ${tableHTML(['Question word', 'Kind of answer', 'Meaning', 'Time', 'Question'], byW)}</div>`;
}
(function () {
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const r = _rv.apply(this, arguments);
    try { if (rec && rec.type === 'dq1') { const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('afterend', dqAnalysisHTML(rec)); for (const x of rec.items || []) { const el = $(`.rv-item[data-ri="${x.n}"]`), a = x.answer || {}; if (el) el.insertAdjacentHTML('beforeend', `<div class="small"><b>Your English:</b> ${a.mean ? '“' + esc(a.mean) + '”' : 'not given'} · <b>meaning:</b> “${esc((x.spec || {}).qe || '')}” · <span class="muted">${esc((x.spec || {}).ref || '')}</span></div>`); } } } catch (e) { console.error(e); }
    return r;
  };
})();

// ----- The decision GPT asked for: from the two profiles, what next? -----
function dgProfile() {
  const pr = dgAll().slice(-1)[0], qr = (S.assess || []).filter(a => a.type === 'dq1' && a.end).sort((a, b) => a.end - b.end).slice(-1)[0];
  const out = { pr, qr };
  if (pr) { const L = (pr.items || []).filter(x => x.answered); out.parse = L.length ? L.reduce((s, x) => s + x.score, 0) / L.length : null; out.parseDone = L.length / (pr.items || []).length;
    const box = { root: [0, 0], stem: [0, 0], form: [0, 0], pgn: [0, 0] };
    for (const x of L) { const a = x.answer || {}; const g = gradeParse(x.spec || {}, { p: a.p || '', g: a.g || '', n: a.n || '', conj: a.conj || '', stem: a.stem || '', root: a.root || '' }).res || {}; [['root', g.root], ['stem', g.stem], ['form', g.conj], ['pgn', g.p !== false && g.g !== false && g.n !== false]].forEach(([k, ok]) => { box[k][1]++; if (ok) box[k][0]++; }); }
    out.box = Object.fromEntries(Object.entries(box).map(([k, [a, b]]) => [k, b ? a / b : null])); }
  if (qr) { const L = (qr.items || []).filter(x => x.answered); out.q = L.length ? L.filter(x => x.score >= 1).length / L.length : null; const t = L.map(x => (x.ms || 0) / 1000).filter(Boolean).sort((a, b) => a - b); out.qt = t.length ? t[Math.floor(t.length / 2)] : null; }
  return out;
}
function nextStepHTML() {
  const P = dgProfile(); if (!P.pr && !P.qr) return '';
  const BOX = { root: 'root', stem: 'stem (בִּנְיָן)', form: 'form (נְטִיָּה)', pgn: 'person/gender/number' }, say = [];
  if (P.pr) { const weakest = Object.entries(P.box || {}).filter(([, v]) => v != null).sort((a, b) => a[1] - b[1])[0];
    if (P.parse < .6) say.push(`Parsing first: average ${Math.round(P.parse * 100)}% per answered verb. Weakest box: ${BOX[weakest[0]]} (${Math.round(weakest[1] * 100)}%). Drill only that box (see the plan), then the retest with new verbs.`);
    else if (weakest && weakest[1] < .5) say.push(`Parsing: ${Math.round(P.parse * 100)}% per answered verb, but one box fails: ${BOX[weakest[0]]} (${Math.round(weakest[1] * 100)}%). Drill only that box, then the retest with new verbs.`);
    else say.push(`Parsing is workable: ${Math.round(P.parse * 100)}% per answered verb; weakest box ${weakest ? BOX[weakest[0]] + ' (' + Math.round(weakest[1] * 100) + '%)' : '—'}. Keep it warm with the retest; no more theory.`);
    if (P.parseDone < .8) say.push(`Only ${Math.round(P.parseDone * 100)}% of the diagnostic was answered: finish it (or the retest) before trusting these numbers.`); }
  else say.push('Parsing profile missing: take Diagnostic 1 first.');
  if (P.qr) { if (P.q < .8 || (P.qt || 0) > 25) say.push(`Questions in Hebrew need work: ${Math.round(P.q * 100)}% of question types recognized, median ${Math.round(P.qt || 0)} s. Do the question-word drill and short story questions before any full simulation.`); else say.push(`Questions in Hebrew are understood (${Math.round(P.q * 100)}%, median ${Math.round(P.qt || 0)} s): the 26 story-question points depend on knowing the story, so read the stories.`); }
  else say.push('Question profile missing: take Diagnostic 2 (15 min).');
  const sim = P.pr && P.qr && P.parse >= .6 && P.q >= .8 && Object.values(P.box || {}).every(v => v == null || v >= .5);
  say.push(sim ? `Both profiles are good enough: <b>take a full simulation</b> (${FS_MIN} min) next, with the Ruth translation done first.` : '<b>Not yet a full simulation:</b> fix the weakest part first (above); the Ruth translation (30 points) is still untested under time, so translate 4–6 verses timed today in any case.');
  return `<div class="step" style="border:1px dashed var(--accent);border-radius:10px;padding:8px"><span class="n">→</span><div><b>What next? (from your two diagnostics)</b><div class="small">${say.map(x => '• ' + heWrap(x)).join('<br>')}</div><div class="small muted">Rule used (transparent, not a statistic): full simulation when parsing ≥ 60% per answered verb with no box under 50%, and question types ≥ 80% understood.</div></div></div>`;
}
(function () {
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    const h = _fc.apply(this, arguments); const R = k => (S.assess || []).filter(a => a.type === k && a.end).sort((a, b) => a.end - b.end);
    const card = (k, title, sub, start, extra = '') => { const r = R(k), last = r[r.length - 1]; return `<div class="step ${r.length ? 'done' : ''}" style="border:1px dashed var(--accent);border-radius:10px;padding:8px"><span class="n">${r.length ? '✓' : 'D'}</span><div><b>${title}</b> <span class="small muted">${sub}</span><div class="small muted">${r.length ? `Taken ${r.length}× · last ${simPct(last)}%` : 'Not taken yet.'}</div></div><div class="stack" style="gap:6px;flex:0 0 auto">${r.length ? `<button class="btn" data-dgv="${last.id}" style="white-space:nowrap">See the analysis</button>` : ''}<button class="btn ${r.length ? '' : 'primary'}" data-dgs="${start}" style="white-space:nowrap">${r.length ? 'Take again' : 'Start'}</button>${extra}</div></div>`; };
    const cards = card('dq1', 'Diagnostic 2 · Understanding Hebrew questions', '(20 questions, 15 min: what is asked, the English meaning, the time)', 'dq1')
      + card('dg1g', 'Diagnostic 1 · GPT’s version', '(GPT’s 20 verbs, 30 min: the second version / retest)', 'dg1g')
      + (dgAll().length ? card('dgr', 'Retest · your weak categories', '(12 NEW Ruth verbs chosen from your misses, 20 min)', 'dgr') : '')
      + nextStepHTML();
    const i = h.indexOf('data-dg1="1"'); const j = i < 0 ? -1 : h.indexOf('</div></div>', i); // right after the Diagnostic 1 card (end of its button column and step)
    return j > 0 ? h.slice(0, j + 12) + cards + h.slice(j + 12) : h.replace('<div class="plan">', '<div class="plan">' + cards);
  };
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-dgs],[data-dgv]'); if (!t) return; e.preventDefault();
    if (t.dataset.dgs) ({ dq1: startDQ1, dg1g: startDG1G, dgr: startDGR })[t.dataset.dgs](); else { const r = (S.assess || []).find(a => a.id === t.dataset.dgv); if (r) renderExamReview(r); } });
  const _pl = planBlockList;
  planBlockList = function (d) {
    const B = _pl.apply(this, arguments);
    if (d === '2026-11-23' || d === '2026-11-24') {
      const did = k => (S.assess || []).some(a => a.type === k && a.end && dayKey(new Date(a.end)) === d);
      const i = Math.max(0, B.findIndex(b => b.id === 'dg1')) + 1;
      B.splice(i, 0,
        { id: 'dq1', min: 15, title: 'Diagnostic 2 · Understanding Hebrew questions (15 min)', sub: 'What each Hebrew question asks for and what it means, against the clock. GPT’s second profile.', act: () => startDQ1(), check: () => did('dq1') },
        { id: 'dgx', min: 20, title: 'Then: the retest of your weak categories (new verbs) or GPT’s version', sub: 'Retest = 12 new Ruth verbs chosen from your misses. GPT’s version = his 20 verbs. Then read “What next?” on the Final rescue tab.', act: () => (dgAll().length ? startDGR() : startDG1G()), check: () => did('dgr') || did('dg1g') });
    }
    return B;
  };
})();
