// ---------- Nov 23 (night): GPT's oral diagnostic imported as its own record · repair rounds with new class forms · Hebrew-question track · Ruth baseline ----------
// Emerson's answers, GPT's credits and GPT's notes live only in the private update file (doc oral/dg1g-2026-11-23); nothing is overwritten.
// This code holds the teaching text for GPT's 20 paradigm verbs (already public in DG1G) and the new drills. Story lines are read from the private story docs at run time.
const OD_PATH = 'oral/dg1g-2026-11-23';
const odData = () => { try { const d = HET.live(OD_PATH); return d && Array.isArray(d.items) && d.items.length ? d : null; } catch { return null; } };
const OD_F = [['root', 'שֹׁרֶשׁ', 'root'], ['binyan', 'בִּנְיָן', 'stem'], ['netiyyah', 'נְטִיָּה', 'form'], ['person', 'גּוּף', 'person'], ['gender', 'מִגְדָּר', 'gender'], ['number', 'מִסְפָּר', 'number']];
const OD_ORDER = [8, 16, 2, 6, 11, 15, 17, 18, 20]; // the nine items at 4/6 or less; the regular, frequent patterns (8, 16) first, the rare Hishtaphel (20) last
const OD_SECOND = [4, 5, 7, 10, 13, 14, 19];
const OD_MECH = {
  8: 'III-ה infinitive with ־וֹת (no person, gender, number)', 16: 'Hiphil imperative הַקְטֵל', 2: 'yiqtol 2mp: prefix ת + ending וּ', 6: 'Qal participle fs: ḥolem after root 1 + ־ֶת, no person',
  11: 'a final ם / ן is a root letter, not a plural', 15: 'the wayyiqtol dagesh is not a Niphal; III-ה drops its ה', 17: 'Hophal: U/O under the PREFIX (Pual: U under root 1 + doubling)',
  18: 'Niphal participle (qameṣ) vs qatal (pataḥ); a participle has no person', 20: 'Hishtaphel of חוה: the final וּ is the root ו, not a plural',
  14: 'hollow Hiphil qatal הֵ…ִי vs imperative הָ…ֵ', 5: 'weyiqtol (וְ) vs wayyiqtol (וַ + dagesh)', 4: '2ms ending תָ vs 2fs תְּ', 7: 'an imperative is 2nd person', 10: 'dagesh lene vs dagesh forte', 13: 'Pual qatal', 19: 'Hithpael: three readings without a sentence',
};
// Teaching text for each of GPT's 20 verbs: every decisive mark named, then the meaning.
const OD_EXPLAIN = {
  1: 'Qameṣ under שׁ and pataḥ under מ (A–A), no prefix and no ending: the bare Qal perfect, which is always 3ms. “He guarded / kept.”',
  2: 'Root שׁמר. Stem: Qal — the prefix has ḥireq (תִּ) and root 1 has a silent sheva, the Qal yiqtol pattern יִקְטֹל; nothing marks a derived stem (no dagesh in root 2 = not Piel; no pataḥ prefix with ִי = not Hiphil; root 1 not doubled = not Niphal). The ḥolem of the base form has become a vocal sheva under מ because the ending וּ was added. Person/gender/number: read the prefix AND the ending together — ת alone is 2ms or 3fs, but ת + וּ is only 2mp. The feminine plural ends in נָה (תִּשְׁמֹרְנָה, 2fp/3fp), so “F” is not possible here. In your Ch. 16 story, line 12: שָׁמוֹר תִּשְׁמְרוּ מְאֹד “you (men) must surely keep (it)”.',
  3: 'וַ with pataḥ + dagesh in the prefix (יּ) = wayyiqtol. Qal: ḥireq under the prefix, silent sheva under ק; the pataḥ/qameṣ under ר instead of ḥolem is because the last root letter is א (III-alef verbs keep A). No ending = 3ms. “And he called.”',
  4: 'The ending decides the gender: תָּ (with qameṣ) = 2ms; תְּ (with sheva) = 2fs, as in וְאָכַלְתְּ (Ruth 2:14). The ה is the first ROOT letter of הלך, carrying qameṣ (qatal A–A), so this is not a Hiphil (a Hiphil perfect has ḥireq under ה and ִי: הִשְׁלִיךְ). וְ + qatal in an instruction = weqatal: “and you (m.) shall go” (your Ch. 22 story, line 102: וְהָלַכְתָּ לְשָׁלוֹם).',
  5: 'Look first at the conjunction: וְ with a vocal sheva and NO dagesh in the next letter = plain וְ + yiqtol (weyiqtol, “and let him / so that he…”). A wayyiqtol needs both marks: וַ with pataḥ AND a dagesh in the prefix (וַיִּ…). The dagesh in שּׁ is the Niphal’s own נ assimilated into root 1, with qameṣ under root 1 and ṣere under root 2 (the Niphal yiqtol יִקָּטֵל). 3ms.',
  6: 'Ḥolem right after root 1 (שֹׁ), no prefix: Qal active participle (קֹטֵל). ־ֶרֶת (segol–segol + ת) = feminine singular. A participle is a verbal adjective: it has gender and number, never person, so person is “—”. Derived-stem participles start with מ (Piel מְקַדֶּשֶׁת in item 12, Hiphil מַקְרִיב), so no מ = Qal.',
  7: 'Sheva under שׁ, ḥolem on מ, no prefix, no ending: Qal imperative 2ms (קְטֹל), “guard!”. An imperative is always addressed to “you”, so person is 2, not “none”. The same letters are also the Qal infinitive construct (with לְ: וְלִשְׁמֹר, Ch. 16 line 15); the sentence decides.',
  8: 'Three pieces. (1) לַ = the preposition לְ “to”; it has pataḥ only because the next letter ע carries a ḥaṭef-pataḥ (two shevas cannot stand together, so לְ borrows the ḥaṭef’s vowel). (2) עֲשׂ = root letters ע and שׂ. (3) ־וֹת = the infinitive-construct ending of a III-ה root: the ה of עשה is replaced by וֹת (so בנה gives לִבְנוֹת, היה gives לִהְיוֹת, ראה gives לִרְאוֹת). So: root עשה · Qal (no stem marks: no doubling, no ה- or נ-prefix) · שֵׁם פֹּעַל · person, gender and number “—”. The ־וֹת is NOT a feminine plural: a feminine plural participle would have ḥolem after root 1 (עֹשׂוֹת “women doing”), and a Niphal infinitive would start with הֵ (לְהֵעָשׂוֹת). In your Ch. 16 story, line 12: שָׁמוֹר תִּשְׁמְרוּ מְאֹד לַעֲשׂוֹת “keep very carefully to do…”.',
  9: 'Qameṣ under שׁ + ḥolem-vav on מ (A–O) = Qal infinitive absolute (קָטוֹל). Your professor’s parsing lists have one box, שֵׁם פֹּעַל, for both infinitives, and the app uses the same single box: שֵׁם פֹּעַל is full credit. For syntax: the absolute (A–O) stands before a finite verb of the same root to strengthen it (Ch. 16, lines 11–12: שָׁמוֹר תִּשְׁמְרוּ “you shall surely keep”); the construct (sheva–O, שְׁמֹר) goes with prepositions (לִשְׁמֹר). No person, gender, number.',
  10: 'Two dots with two different jobs. The dagesh in דּ is a dagesh lene: ד is a בגדכפת letter at the start of the word, so it takes this dot whatever the stem. The dagesh in בּ is a dagesh forte: the doubled SECOND root letter, the sign of the Piel. Ḥireq under root 1, doubled root 2, an E-vowel under root 2 (here segol; usually ṣere, קִטֵּל), no prefix and no ending = Piel qatal 3ms. Not Pual (U under root 1), not yiqtol (no prefix). “He spoke” (Ch. 20: כַּאֲשֶׁר דִּבֶּר יְהוָה).',
  11: 'The prefix יְ has a vocal sheva: Piel and Pual prefixes take sheva (Qal יִ, Hiphil יַ). Then pataḥ under root 1 (שַׁ), dagesh forte in root 2 (לּ), ṣere under root 3 = Piel yiqtol (יְקַטֵּל). The final ם is the third ROOT letter of שׁלם (written as final mem because it ends the word), not a plural: a plural yiqtol ends in וּ (יְשַׁלְּמוּ). So 3ms, “he will repay / reward” — Ruth 2:12, יְשַׁלֵּם יְהוָה פָּעֳלֵךְ.',
  12: 'מְ prefix with sheva + pataḥ under root 1 + doubled root 2 (דּ) = Piel participle; ־ֶשֶׁת = feminine singular. No person.',
  13: 'Qibbuṣ (U) under the FIRST ROOT letter ק + dagesh forte in root 2 (דּ) + pataḥ = Pual qatal; no prefix. No ending = 3ms: every qatal has a person, and “no ending” means 3rd person (he/it).',
  14: 'Root בוא (hollow: the ו disappears, the final א is silent). Hiphil qatal of a hollow root: ה with ṣere (הֵ) + ḥireq-yod after root 1 (בִי) = הֵבִיא “he brought”. The imperative is הָבֵא: qameṣ under ה, ṣere under ב, no yod. Same rule in a strong verb: qatal הִקְרִיב (ḥireq + ִי) vs imperative הַקְרֵב (pataḥ + ṣere). The Hiphil imperative and infinitives have an A-vowel under ה; the qatal has I (E in hollow roots) and keeps the ִי.',
  15: 'וַ + dagesh in the prefix (יּ) = wayyiqtol. That dagesh belongs to the wayyiqtol, not to a Niphal: a Niphal doubles the FIRST ROOT letter after the prefix, and with the guttural ע it would show ṣere under the prefix instead (וַיֵּעָלוּ). Root עלה: III-ה, so the ה drops before the ending וּ; ע is a guttural, so it takes ḥaṭef-pataḥ (עֲ) and the prefix takes pataḥ (יַ) instead of ḥireq. וּ = 3mp: “and they went up”. Without a sentence the Hiphil (“they brought up”) is spelled the same; the Niphal is not possible.',
  16: 'Root קרב (all three letters present). ה with pataḥ (הַ) + silent sheva under ק + ṣere under ר, no ending = Hiphil imperative 2ms (הַקְטֵל), “bring near! offer!”. Hiphil, not Qal, because of the added ה with A before the root. Not a participle: Hiphil participles begin with מַ (מַקְרִיב). The whole family: qatal הִקְרִיב · yiqtol יַקְרִיב · participle מַקְרִיב · imperative הַקְרֵב. An imperative has a 2nd-person subject: person 2. (The same shape is also the Hiphil infinitive absolute; in a sentence, check that it gives an order.)',
  17: 'Remove the prefix הֻ and the root is ק־ר־ב. The U-vowel (qibbuṣ) sits under the PREFIX ה, and no root letter is doubled = Hophal, the passive of the Hiphil: “it was brought near (offered)”. The Pual puts its U under the first ROOT letter, has no ה-prefix in the qatal, and doubles root 2 (קֻדַּשׁ, item 13). Your professor’s chart writes the Hophal הָפְעַל (ho-, qameṣ-ḥaṭuf); הֻ (qibbuṣ) is the other spelling of the same o/u vowel. No ending = 3ms.',
  18: 'נִ + silent sheva under שׁ = Niphal. The vowel under the SECOND root letter decides the form: qameṣ (מָ) = participle (נִקְטָל), pataḥ (מַ) = qatal (נִקְטַל). Participle: ms, and person “—”. (At a pause — the last word of a verse or a strong accent — a qatal’s pataḥ can lengthen to qameṣ, so in a sentence check the position.)',
  19: 'הִתְ + pataḥ under root 1 + doubled root 2 (זּ) + ṣere = Hithpael (your Hithpael handout lists הִתְחַזֵּק “take courage”). Without a sentence this shape is three things: qatal 3ms (“he took courage”, also the dictionary form), imperative 2ms (“take courage!”) or infinitive construct. It cannot be yiqtol: a yiqtol replaces the ה with a person prefix (יִתְחַזֵּק, תִּתְחַזֵּק). So “yiqtol” is wrong, but this item has no single correct form or person: those boxes are shown grey, and it is left out of the strict statistic (83/114).',
  20: 'וַ + doubled יּ = wayyiqtol. שְׁתַּ is the Hishtaphel stem sign and the root is חוה (your professor’s Hithpael handout, Ch. 24, p. 7). The final וּ is the middle root letter ו of חוה, not a plural ending: the 3ms wayyiqtol is short (III-ה verbs drop their ending in the wayyiqtol). The plural is וַיִּשְׁתַּחֲווּ, with two ו’s: the root ו + the plural וּ. So: חוה · Hishtaphel · wayyiqtol · 3ms, “and he bowed down”. Ruth 2:10 has the same short form with ת: וַתִּשְׁתַּחוּ “and she bowed down”.',
};
// The contrasts to repair before Round 1 (GPT’s 12-minute block), each with the marks named and a class form.
const OD_CONTRASTS = [
  ['Hiphil qatal vs imperative', [['הִקְרִיב', 'qatal: הִ (ḥireq) + ִי'], ['הַקְרֵב', 'imperative: הַ (pataḥ) + ṣere'], ['הֵבִיא', 'hollow qatal: הֵ (ṣere) + ִי'], ['הָבֵא', 'hollow imperative: הָ (qameṣ) + ṣere']], 'Class: הֵסִיר (Ch. 19), הַשְׁלֵךְ (Ch. 18), הַקְהֵל (Ch. 20).'],
  ['Niphal qatal vs participle', [['נִשְׁמַר', 'qatal: pataḥ under root 2; has a person'], ['נִשְׁמָר', 'participle: qameṣ under root 2; no person']], 'Class: נִשְׁבַּר (qatal) and נִצָּב (participle), Ch. 22.'],
  ['Pual vs Hophal', [['קֻדַּשׁ', 'Pual: U under root 1 + doubled root 2, no prefix'], ['הֻקְרַב', 'Hophal: U under the prefix ה, no doubling'], ['הָרְאֵיתָ', 'Hophal: o (qameṣ-ḥaṭuf) under the prefix']], 'Trap: וְהֻכָּה has a dagesh, but it is the lost נ of נכה; the U under ה makes it Hophal.'],
  ['Qal infinitive vs participle', [['לַעֲשׂוֹת', 'infinitive: לְ + ־וֹת, no ḥolem after root 1, no PGN'], ['עֹשׂוֹת', 'participle fp: ḥolem after root 1 (gender + number)'], ['שֹׁמֶרֶת', 'participle fs: ḥolem + ־ֶת, no person']], 'Class: לִבְנוֹת (Ch. 16), לִשְׁתּוֹת (Ch. 18); נֹפֶלֶת (Ch. 17).'],
  ['Two dots in דִּבֶּר', [['דּ', 'dagesh lene: בגדכפת letter at the start'], ['בּ', 'dagesh forte: doubled root 2 = Piel']], ''],
  ['וְ vs וַ', [['וְיֵרֵד', 'weyiqtol: וְ (sheva), no dagesh'], ['וַיֵּרֶד', 'wayyiqtol: וַ (pataḥ) + dagesh in the prefix']], 'Class: וְיֵרֵד “and let him come down” (Ch. 19).'],
  ['Endings that decide P/G/N', [['־תָּ / ־תְּ', 'qatal 2ms / 2fs'], ['תִּ…וּ', 'yiqtol 2mp only'], ['תִּ…נָה', 'yiqtol 2fp or 3fp'], ['…ם', 'final mem = root letter (שׁלם), not a plural']], ''],
];
function odCell(v, ok, amb) {
  const st = amb ? 'color:var(--muted);background:color-mix(in srgb, var(--muted) 12%, transparent)' : ok ? 'color:var(--good);background:color-mix(in srgb, var(--good) 12%, transparent)' : 'color:var(--bad);background:color-mix(in srgb, var(--bad) 12%, transparent)';
  return `<td style="${st};font-weight:600">${amb ? '◻ ' : ok ? '✓ ' : '✗ '}${heWrap(esc(v == null || v === '' ? '(nothing said)' : String(v)))}</td>`;
}
const odAmb = (it, k) => !!it.ambiguous_without_context && k !== 'root' && k !== 'binyan';
function odItemHTML(it) {
  const n = it.number, rows = OD_F.map(([k, he, en], i) => `<tr>${i === 0 ? `<td rowspan="6" style="text-align:center;vertical-align:middle;min-width:110px"><div class="he" dir="rtl" lang="he" style="font-size:1.8rem">${esc(it.hebrew)}</div></td>` : ''}<td><span class="he">${he}</span> <small class="muted">${en}</small></td>${odCell((it.user_parse || {})[k], (it.field_credit || {})[k], odAmb(it, k))}${odAmb(it, k) ? `<td style="color:var(--muted);font-weight:600">◻ ${esc((it.correct_parse || {})[k] || '')}</td>` : `<td style="color:var(--good);font-weight:600">${heWrap(esc((it.correct_parse || {})[k] || ''))}</td>`}</tr>`).join('');
  const tag = OD_ORDER.includes(n) ? `<span class="chip acc">fix first · ${OD_ORDER.indexOf(n) + 1} of 9</span>` : OD_SECOND.includes(n) ? '<span class="chip">check</span>' : '<span class="chip">right</span>';
  return `<div class="panel stack" id="od-q${n}"><div class="row" style="justify-content:space-between;gap:6px"><b>Q${n} · ${H(esc(it.hebrew))} <span class="muted">${it.score_fields} / 6</span>${it.ambiguous_without_context ? ' <span class="chip">ambiguous without a sentence</span>' : ''}</b>${tag}</div>
    ${OD_MECH[n] ? `<div class="small"><b>What to learn:</b> ${heWrap(esc(OD_MECH[n]))}</div>` : ''}
    <div class="tw"><table class="mini" style="width:100%"><tr><th>Word</th><th>Box</th><th>Your answer (Nov 23, aloud)</th><th>Correct</th></tr>${rows}</table></div>
    <div class="small"><b>Why:</b> ${heWrap(esc(OD_EXPLAIN[n] || it.evidence || ''))}</div>
    <div class="small"><b>Meaning:</b> “${esc(it.meaning || '')}”</div>
    <div class="small muted">Recorded with GPT: ${heWrap(esc(it.oral_reconstruction_notes || ''))}${it.evidence && OD_EXPLAIN[n] ? ` · GPT’s note: ${heWrap(esc(it.evidence))}` : ''}</div></div>`;
}
const odPct = (a, b) => `${a} / ${b} (${(a / b * 100).toFixed(1)}%)`;
function odSummaryHTML(D) {
  const g = D.grading || {}, cnt = g.grouped_field_correct_counts || {};
  const fieldRows = OD_F.map(([k, he, en]) => [`<span class="he">${he}</span> ${en}`, odPct(cnt[k] || 0, 20)]);
  return `<div class="panel stack"><div class="eyebrow">Nov 23 · GPT’s 20-verb diagnostic, answered aloud with GPT · imported ${esc(D.imported || '')} · session still open</div>
    <h1 style="margin:0">${g.earned_fields_user_clarified} / ${g.possible_fields} boxes = ${(+g.percentage).toFixed(1)}% <span class="small muted" style="font-family:var(--f-ui)">(${(+g.score_20).toFixed(2)} / 20)</span></h1>
    <p class="small"><span class="chip">provisional</span> Practice rubric with six equal boxes (root, stem, form, person, gender, number). It is <b>not</b> your professor’s rubric, which is not known. Your answers were given by voice (typing Hebrew failed); later clarifications are labelled “later clarified”. Time: ${esc(D.window || '')}, ${D.elapsed_min} min including interruptions — not a speed measure.</p>
    ${tableHTML(['Version of the score', 'Boxes', 'What it means'], [
      ['First grade (history, kept)', odPct(81, 120), 'before Q9, Q10 and Q13 were clarified'],
      ['<b>Main grade</b>', '<b>' + odPct(g.earned_fields_user_clarified, g.possible_fields) + '</b>', 'with your later clarifications (Q9 שֵׁם פֹּעַל + three “—”, Q10 root and Piel, Q13 masculine)'],
      ['Without the disputed Q13 gender', odPct(g.without_disputed_Q13_gender_fields, 120), 'Q13 “masculine” rests on your recollection'],
      ['Strict: without Q19', odPct(g.excluding_defective_Q19_fields_earned, g.excluding_defective_Q19_fields_possible), 'Q19 has no single answer without a sentence'],
    ])}
    <b>By box</b>${tableHTML(['Box', 'Right of 20'], fieldRows)}
    <div class="small"><b>If</b> the six boxes counted equally on the exam: 0.733 × 32 = <b>23.5 of 32</b> parsing points. <span class="chip">assumption, not official</span> The professor’s points per box are unknown.</div>
    <div class="small"><b>The nine items at 4/6 or less</b> (the inclusive rule, not “under 4”): ${OD_ORDER.map(n => { const it = D.items.find(x => x.number === n); return `<a href="#od-q${n}" class="od-jump" data-odj="${n}">Q${n} ${H(esc(it ? it.hebrew : ''))} ${it ? it.score_fields : ''}/6</a>`; }).join(' · ')}</div></div>`;
}
function odSectionsHTML() {
  return `<div class="panel stack"><h2 style="margin:0">The four parts of the final (32 + 26 + 30 + 12 = 100)</h2>${tableHTML(['Part', 'Points', 'What is measured so far', 'Next'], [
    ['Story · parsing', 32, '73% of boxes in this oral diagnostic (20 verbs); weakest: stem with form (נְטִיָּה), weak roots, participle / infinitive / imperative', 'Repair rounds 1 and 2'],
    ['Story · questions in Hebrew', 26, 'Nov 22: 6 answered — 4 right, 1 partial, 1 wrong; slow (about 3 minutes each)', 'Diagnostic 2 + the Hebrew-question track'],
    ['Ruth · translation', 30, '<b>Not measured under time.</b> 0 of 6 verses attempted on Nov 22 means no evidence, not 0%', 'Ruth baseline 1 and 2 (the biggest unknown)'],
    ['Ruth · syntax in English', 12, 'No independent measure yet', '2 questions in each Ruth baseline'],
  ])}<p class="small muted">Earlier numbers are not merged with these: Nov 20–21 (33 parses, 66% average credit) and Nov 22 (4 parses inside the simulation) used other verbs and other rules. No pass probability can be computed from them.</p></div>`;
}
function odContrastHTML() {
  return `<div class="panel stack"><h2 style="margin:0">Before Round 1: the contrasts (12 min)</h2><p class="small">Say aloud, for each pair, which letter and which vowel decides. Then start Round 1.</p>
    ${OD_CONTRASTS.map(([t, L, cls]) => `<div><b>${esc(t)}</b><div class="row" style="gap:10px;flex-wrap:wrap;margin:4px 0">${L.map(([f, d]) => `<div style="border:1px solid var(--line);border-radius:8px;padding:6px 10px;min-width:130px"><div class="he" dir="rtl" lang="he" style="font-size:1.5rem;text-align:center">${esc(f)}</div><div class="small">${heWrap(esc(d))}</div></div>`).join('')}</div>${cls ? `<div class="small muted">${heWrap(esc(cls))}</div>` : ''}</div>`).join('')}</div>`;
}
function odClustersHTML(D) {
  const C = D.recurring_error_clusters || []; if (!C.length) return '';
  return `<div class="panel stack"><h2 style="margin:0">The same mistake behind several items</h2>${tableHTML(['Pattern', 'Items', 'What goes wrong'], C.map(c => [esc(c.title), esc(c.evidence), heWrap(esc(c.mechanism))]))}</div>`;
}
let OD_BACK = 'today';
function renderOD(focus) {
  const v = $('#v-session'); showSection('v-session'); v.classList.remove('exam');
  const D = odData(); try { localStorage.setItem('het:odseen', dayKey()); } catch { }
  if (!D) { v.innerHTML = `<div class="panel stack" style="max-width:760px;margin:0 auto"><h1>Nov 23 oral diagnostic</h1><p>Not in the app yet. Import <b>hebrew-update-2026-11-23.json</b> (Library → Add material), then open this again.</p><div class="row"><button class="btn" id="od-back">Back</button></div></div>`; $('#od-back').onclick = () => go(OD_BACK); return; }
  const by = n => D.items.find(x => x.number === n), right = D.items.filter(x => !OD_ORDER.includes(x.number) && !OD_SECOND.includes(x.number)).map(x => x.number);
  v.innerHTML = `<div class="stack" style="max-width:860px;margin:0 auto">
    <div class="row"><button class="btn" id="od-back">← Back</button><button class="btn primary" data-rps="rp1">Repair round 1</button><button class="btn" data-rps="rp2">Repair round 2</button></div>
    ${odSummaryHTML(D)}
    ${rpCompareHTML()}
    ${odContrastHTML()}
    <h2>Fix these first (score 4/6 or less)</h2>${OD_ORDER.map(n => by(n) ? odItemHTML(by(n)) : '').join('')}
    <h2>Then check (5/6, but the same rule recurs)</h2>${OD_SECOND.map(n => by(n) ? odItemHTML(by(n)) : '').join('')}
    <details><summary><b>Right on the first try (${right.length})</b></summary>${right.map(n => odItemHTML(by(n))).join('')}</details>
    ${odClustersHTML(D)}
    ${odSectionsHTML()}
    <div class="row"><button class="btn" id="od-back2">← Back</button></div></div>`;
  $('#od-back').onclick = $('#od-back2').onclick = () => go(OD_BACK);
  $$('[data-odj]', v).forEach(a => a.onclick = e => { e.preventDefault(); const el = $('#od-q' + a.dataset.odj); if (el) el.scrollIntoView({ behavior: 'smooth' }); });
  if (focus) { const el = $('#od-q' + focus); if (el) el.scrollIntoView(); }
}

// ===== Repair rounds: one NEW class form for each of the nine mistakes (round 2 adds three of the “check” items) =====
// [diagnostic item, form, root, stem, conj, pgn, meaning, source, why]
// Sources: {ch, ln} = a line of a class story (read from the private story doc); {ruth} = Ruth; {txt} = a professor handout or slide deck.
const RP_DEF = {
  rp1: [
    [8, 'לִבְנוֹת', 'בנה', 'qal', 'inf', '', 'to build', { ch: 16, ln: 43 }, 'לִ (= לְ, with ḥireq before the silent sheva of ב) + ב־נ + ־וֹת: the III-ה root בנה swaps its ה for וֹת in the infinitive construct, exactly like לַעֲשׂוֹת (Q8). Qal, שֵׁם פֹּעַל, and “—” for person, gender and number.'],
    [16, 'הַשְׁלֵךְ', 'שׁלך', 'hiphil', 'impv', '2ms', 'throw (it)!', { ch: 18, ln: 44 }, 'הַ (pataḥ) + silent sheva under שׁ + ṣere under ל, no ending: Hiphil imperative 2ms, the הַקְרֵב pattern (Q16). The next words prove it: God says הַשְׁלֵךְ אֹתוֹ אַרְצָה and Moses does it: וַיַּשְׁלֵךְ (Hiphil wayyiqtol).'],
    [2, 'תִּשְׁלְחוּ', 'שׁלח', 'qal', 'yiqtol', '2mp', '(do not) lay (a hand on him)', { ch: 15, ln: 49 }, 'Prefix תִּ + ending וּ: only 2mp has this pair. Qal: ḥireq under the prefix, silent sheva under root 1, no doubling. With אַל it is a prohibition: “do not lay (a hand on him)”. Same as תִּשְׁמְרוּ (Q2).'],
    [6, 'נֹפֶלֶת', 'נפל', 'qal', 'ptc', 'fs', 'falling', { ch: 17, ln: 25 }, 'Ḥolem after root 1 (נֹ), no prefix = Qal participle; ־ֶלֶת = feminine singular, agreeing with אֵימָה (“dread”, feminine). Person “—”. Same as שֹׁמֶרֶת (Q6).'],
    [11, 'וַיַּשְׁכֵּם', 'שׁכם', 'hiphil', 'wayyiqtol', '3ms', 'and he rose early', { ch: 19, ln: 71 }, 'וַ + doubled יּ = wayyiqtol; pataḥ under the prefix (יַ) + ṣere before the last letter = Hiphil. The final ם is root 3 of שׁכם, not a plural (no וּ): 3ms. The dot in כּ is dagesh lene after a silent sheva, not a doubling. Same final-letter point as יְשַׁלֵּם (Q11).'],
    [15, 'וַיִּבְנוּ', 'בנה', 'qal', 'wayyiqtol', '3mp', 'and they built', { ch: 16, ln: 23 }, 'וַ + doubled prefix יּ = wayyiqtol (that dagesh is the wayyiqtol’s, not a Niphal’s); בנה lost its ה before the plural ending וּ = 3mp. Qal. The וַיַּעֲלוּ pattern (Q15) without the guttural.'],
    [17, 'וְהֻכָּה', 'נכה', 'hophal', 'weqatal', '3ms', 'and he will be struck', { txt: 'Professor’s review slides (Nov 19), Hophal deck' }, 'U (qibbuṣ) under the PREFIX ה = Hophal. The dagesh in כּ is the assimilated נ of נכה, not a Pual doubling (a Pual has no ה-prefix and puts its U under root 1). Final ָה = III-ה qatal 3ms; וְ + qatal = weqatal. Same point as הֻקְרַב (Q17).'],
    [18, 'נִצָּב', 'נצב', 'niphal', 'ptc', 'ms', 'standing', { ch: 22, ln: 30 }, 'נִ + qameṣ under root 2 = Niphal participle ms: David was standing over Saul, playing. The dagesh in צּ is the root’s own נ assimilated (נצב). The qatal would be נִצַּב with pataḥ. Person “—”. Same contrast as נִשְׁמָר (Q18).'],
    [20, 'וַתִּשְׁתַּחוּ', 'חוה|שׁחה', 'hishtaphel', 'wayyiqtol', '3fs|2ms', 'and she bowed down', { ruth: '2:10' }, 'וַ + doubled תּ = wayyiqtol; prefix ת = she (or you, m.). שְׁתַּ = Hishtaphel, root חוה. The final וּ is the root’s ו, so it is ONE woman: 3fs. Same as וַיִּשְׁתַּחוּ (Q20).'],
  ],
  rp2: [
    [8, 'לִשְׁתּוֹת', 'שׁתה', 'qal', 'inf', '', 'to drink', { ch: 18, ln: 156 }, 'לִ + שׁתה with ־וֹת for the ה: Qal infinitive construct, “(the Egyptians could not) drink”. שֵׁם פֹּעַל, “—” for person, gender, number. The dot in תּ is dagesh lene. Same as Q8.'],
    [16, 'הַקְהֵל', 'קהל', 'hiphil', 'impv', '2ms', 'assemble!', { ch: 20, ln: 6 }, 'הַ (pataḥ) + silent sheva under ק + ṣere under ה, no ending: Hiphil imperative 2ms, God’s order to Moses: “assemble the whole congregation”. A qatal would be הִקְהִיל. Same as Q16.'],
    [2, 'תִּטְהָרוּ', 'טהר', 'qal', 'yiqtol', '2mp', 'you will be clean', { ch: 20, ln: 120 }, 'תִּ + וּ = 2mp. Qal yiqtol: ḥireq prefix, silent sheva under ט; A under ה because the verb is a stative (“be clean”). Same as Q2.'],
    [6, 'בֹּרַחַת', 'ברח', 'qal', 'ptc', 'fs', 'fleeing', { ch: 17, ln: 66 }, 'Ḥolem after root 1 (בֹּ) = Qal participle; ־ַחַת is the feminine ־ֶת with pataḥ because of the guttural ח. Hagar: “I am fleeing”. Person “—”. Same as Q6.'],
    [11, 'וַיִּלָּחֶם', 'לחם', 'niphal', 'wayyiqtol', '3ms', 'and he fought', { ch: 22, ln: 27 }, 'וַ + doubled prefix = wayyiqtol; the dagesh in לּ is the Niphal’s נ assimilated into root 1 (like יִשָּׁמֵר, Q5). The final ם is root 3 of לחם, so 3ms. Same final-letter point as Q11.'],
    [15, 'וַיַּחֲנוּ', 'חנה', 'qal', 'wayyiqtol', '3mp', 'and they camped', { ch: 19, ln: 46 }, 'Exactly the וַיַּעֲלוּ pattern (Q15): וַ + doubled יּ = wayyiqtol; guttural ח with ḥaṭef-pataḥ and pataḥ under the prefix; the ה of חנה dropped before וּ = 3mp. Qal.'],
    [17, 'הָרְאֵיתָ', 'ראה', 'hophal', 'qatal', '2ms', 'you were shown', { txt: 'Professor’s review slides (Nov 19), Hophal deck' }, 'Qameṣ-ḥaṭuf (o) under the prefix ה = Hophal, your professor’s הָפְעַל; ־ֵיתָ = III-ה before the ending תָ = 2ms. A Pual would put U under root 1 and double root 2. Same as Q17.'],
    [18, 'נִשְׁבַּר', 'שׁבר', 'niphal', 'qatal', '3ms', 'was broken', { ch: 22, ln: 132 }, 'This time pataḥ under root 2 (בַּ): Niphal qatal 3ms, “(his heart) was broken”. A qatal has a person: 3. Compare נִשְׁמָר / נִצָּב (participles, qameṣ). The dot in בּ is dagesh lene. Q18 the other way round.'],
    [20, 'וַיִּשְׁתַּחֲווּ', 'חוה|שׁחה', 'hishtaphel', 'wayyiqtol', '3mp', 'and they bowed down', { txt: 'Professor’s Hithpael handout (Ch. 24), p. 7' }, 'Two ו’s at the end: the root ו of חוה + the plural ending וּ = 3mp. The 3ms וַיִּשְׁתַּחוּ has only one (the root’s). Q20 the other way round.'],
    [14, 'הֵסִיר', 'סור', 'hiphil', 'qatal', '3ms', 'he removed', { ch: 19, ln: 36 }, 'Hollow root סור in the Hiphil qatal: הֵ (ṣere) + ִי after root 1, “(the LORD) removed (his spirit)”. Like הֵבִיא (Q14); the imperative would be הָסֵר.'],
    [5, 'וְיֵרֵד', 'ירד', 'qal', 'weyiqtol', '3ms', 'and let him come down', { ch: 19, ln: 52 }, 'וְ with sheva and no dagesh in the prefix = weyiqtol, after the imperative בַּחֲרוּ: “choose a man, and let him come down to me”. The wayyiqtol would be וַיֵּרֶד (pataḥ + dagesh). I-yod root: ṣere under the prefix. Same point as Q5.'],
    [4, 'וְקָרָאתָ', 'קרא', 'qal', 'weqatal', '2ms', 'and you shall invite', { ch: 19, ln: 11 }, 'Ending תָ (qameṣ) = 2ms; וְ + qatal in an instruction = weqatal: “and you shall invite (Jesse to the sacrifice)”. The 2fs would end in תְּ. Same as Q4.'],
  ],
};
const RP_NAME = { rp1: 'Repair round 1 · one new class form for each of the nine mistakes', rp2: 'Repair round 2 · new forms for the same nine mistakes + three checks' };
BLUEPRINTS.rp1 = { id: 'rp1', name: RP_NAME.rp1, minutes: () => 15, sections: { parse: { n: 9, w: 1, label: 'Parsing (מָה הַפֹּעַל הַזֶּה?)' } } };
BLUEPRINTS.rp2 = { id: 'rp2', name: RP_NAME.rp2, minutes: () => 20, sections: { parse: { n: 12, w: 1, label: 'Parsing (מָה הַפֹּעַל הַזֶּה?)' } } };
const rpDone = k => (S.assess || []).filter(a => a.type === k && a.end).sort((a, b) => a.end - b.end);
async function rpSrc(src) {
  if (src.ch) { const d = await storyDoc(src.ch); return { ref: `Ch. ${src.ch} story, line ${src.ln}`, ctx: d && d.lines ? (d.lines[src.ln - 1] || '') : '' }; }
  if (src.ruth) { const [c, v] = src.ruth.split(':').map(Number); const x = ruthVerse(c, v); return { ref: 'Ruth ' + src.ruth, ctx: x ? ruthProf(c, v, x.he) : '' }; }
  return { ref: src.txt || '', ctx: '' };
}
async function buildRP(k) {
  const items = [];
  for (const [q, form, root, stem, conj, pgn, gloss, src, why] of RP_DEF[k]) {
    const s = await rpSrc(src), cid = 'rp:' + AN.hash(AN.normHe(form));
    items.push({ kind: 'parse', key: k + '|' + form, cid, form, root, stem, conj, pgn, gloss, gl: gloss, ref: s.ref, ctx: s.ctx, why, odq: q, mech: OD_MECH[q] || '', tags: rootTags(root.split('|')[0]), dg: 1, dgLabel: k === 'rp1' ? 'Repair round 1' : 'Repair round 2', strictNA: 1, sec: 'parse', cat: catByExposure(cid), seenBefore: !!expGet(cid), t: PB_STEM_TOPIC[stem] || stem, diff: 2.3 });
  }
  const again = rpDone(k).length > 0; if (again) items.forEach(it => it.cat = 'review');
  return { id: 'a' + Date.now().toString(36), type: k, blueprint: k, items, limits: [], limitMs: BLUEPRINTS[k].minutes() * 60000, created: Date.now(), passage: null, mode: 'strict', ...(again ? { retake: 1 } : {}), ...(k === 'rp2' && rpDone('rp1').length ? { gapMin: Math.round((Date.now() - rpDone('rp1').slice(-1)[0].end) / 60000) } : {}) };
}
const startRP = k => fsStart(() => buildRP(k), k === 'rp1' ? 'Repair round 1' : 'Repair round 2');
// GPT’s rule: for an infinitive the three boxes must be “—”, for a participle person must be “—”; an empty box is unanswered, not “none”.
(function () {
  const _gp = gradeParse;
  gradeParse = function (item, sel) {
    const g = _gp.apply(this, arguments);
    try {
      if (item && item.strictNA && g && g.res && sel) {
        const conjs = [item.conj, ...(item.alts || []).map(a => a.conj).filter(Boolean)];
        if (sel.conj === 'inf' && conjs.includes('inf')) ['p', 'g', 'n'].forEach(k => { if (!sel[k]) g.res[k] = false; });
        if (sel.conj === 'ptc' && conjs.includes('ptc') && !sel.p) g.res.p = false;
        g.score = g.keys.filter(k => g.res[k]).length / g.keys.length;
      }
    } catch (e) { console.error(e); }
    return g;
  };
})();
// Comparison: the oral diagnostic → Round 1 → Round 2, item by item (first attempts only) and box by box.
function rpCompareHTML() {
  const D = odData(), R1 = rpDone('rp1')[0], R2 = rpDone('rp2')[0]; if (!D && !R1) return '';
  const byQ = (rec, q) => rec ? (rec.items || []).find(x => (x.spec || {}).odq === q) : null;
  const six = x => x ? (x.answered ? `${Math.round(x.score * 6)}/6` : 'blank') : '—';
  const sec = x => x && x.ms ? ` · ${Math.round(x.ms / 1000)} s` : '';
  const rows = [...OD_ORDER, 14, 5, 4].map(q => { const it = D ? D.items.find(z => z.number === q) : null; const a = byQ(R1, q), b = byQ(R2, q); if (!a && !b && !OD_ORDER.includes(q)) return null;
    return [`Q${q} ${it ? H(esc(it.hebrew)) : ''}`, heWrap(esc(OD_MECH[q] || '')), it ? `${it.score_fields}/6` : '—', a ? `${H(esc(a.spec.form))} ${six(a)}${sec(a)}` : '—', b ? `${H(esc(b.spec.form))} ${six(b)}${sec(b)}` : '—']; }).filter(Boolean);
  const fields = rec => { if (!rec) return null; let ok = 0, n = 0; const box = { root: 0, stem: 0, conj: 0, p: 0, g: 0, n: 0 }; for (const x of (rec.items || []).filter(x => OD_ORDER.includes((x.spec || {}).odq))) { const a = x.answer || {}, r = gradeParse(x.spec || {}, { p: a.p || '', g: a.g || '', n: a.n || '', conj: a.conj || '', stem: a.stem || '', root: a.root || '' }).res || {}; for (const k of Object.keys(box)) { n++; if (r[k]) { ok++; box[k]++; } } } return { ok, n, box }; };
  const dF = D ? OD_ORDER.reduce((s, q) => s + ((D.items.find(z => z.number === q) || {}).score_fields || 0), 0) : null, f1 = fields(R1), f2 = fields(R2);
  const gap = R1 && R2 ? Math.round((R2.end - R1.end) / 60000) : null;
  return `<div class="panel stack"><h2 style="margin:0">Your nine mistakes: diagnostic → Round 1 → Round 2</h2>
    <p class="small">Boxes right on the nine items (54 boxes): diagnostic <b>${dF != null ? dF + '/54' : '—'}</b> → Round 1 <b>${f1 ? f1.ok + '/54' : 'not taken'}</b> → Round 2 <b>${f2 ? f2.ok + '/54' : 'not taken'}</b>. GPT’s first target: 45/54 (83%). First attempts only; new verbs each time, so a gain means the rule transferred.${gap != null ? ` Round 2 came ${gap} min after Round 1${gap < 20 ? ' (too close to count as a delayed retest)' : ''}.` : ''}</p>
    ${tableHTML(['Item', 'Rule', 'Diagnostic', 'Round 1', 'Round 2'], rows)}
    ${f1 ? `<div class="small muted">By box (nine items): ${['root', 'stem', 'conj', 'p', 'g', 'n'].map(k => `${({ root: 'root', stem: 'stem', conj: 'form', p: 'person', g: 'gender', n: 'number' })[k]} ${f1.box[k]}${f2 ? '→' + f2.box[k] : ''}/9`).join(' · ')}</div>` : ''}</div>`;
}

// ===== Hebrew-question track: understand the question FIRST (kind + English, timed), then find the answer in the whole story =====
const SQ_SETS = { sq1: [16, 17], sq2: [14, 18] };
const SQ_TITLE = { 14: 'The Exodus', 15: 'Joseph and Judah', 16: 'Joshua’s farewell', 17: 'Isaac and Ishmael', 18: 'Signs and wonders in Egypt', 22: 'David and Jonathan' };
Object.entries(SQ_SETS).forEach(([k, [a, b]], i) => { BLUEPRINTS[k] = { id: k, name: `Hebrew questions · round ${i + 1} (Ch. ${a} + Ch. ${b})`, minutes: () => 20, sections: { comp: { n: 8, w: .26, label: 'Story · questions in Hebrew (understand first, then answer)' }, parse: { n: 4, w: .32, label: 'Story · parsing' } } }; });
function qwCat(q) {
  const raw = String(q || '').normalize('NFC'), cons = s => AN.normHe(s).replace(/[^א-ת]/g, '');
  const T = raw.split(/[\s־]+/).filter(Boolean), t0 = cons(T[0] || ''), t1 = cons(T[1] || '');
  if (/^הֲ/.test(raw.replace(/[֑-֯]/g, ''))) return 9;
  const preps = ['אל', 'עם', 'על', 'את', 'אחרי', 'לפני', 'מן', 'בן', 'בת'];
  if (preps.includes(t0) && t1 === 'מי') return 0;
  if (preps.includes(t0) && t1 === 'מה') return 3;
  if (t0 === 'עד' && t1 === 'מתי') return 6;
  if (t1 === 'כמה' || t1 === 'במה' && t0 === 'בן') return 7; // בֶּן־כַּמָּה שָׁנִים “how old”
  const M = { 'מי': 0, 'למי': 1, 'כמי': 2, 'מה': 3, 'למה': 4, 'מדוע': 4, 'איפה': 5, 'אנה': 5, 'איה': 5, 'מאין': 5, 'אן': 5, 'מתי': 6, 'ממתי': 6, 'כמה': 7, 'איך': 8, 'איכה': 8, 'במה': 10, 'בכמה': 7 };
  return M[t0] != null ? M[t0] : null;
}
async function buildSQ(k) {
  const items = [], usedForms = new Set(Object.values(RP_DEF).flat().map(r => AN.normHe(r[1])));
  for (const ch of SQ_SETS[k]) {
    const d = await storyDoc(ch), Q = await fsDef('storyqs/' + ch); if (!d || !Q) throw new Error(FS_NEED);
    const L = d.lines, kk = k + '-' + ch;
    const qs = Q.q.map((x, i) => ({ x, i, it: fsCompItem(kk, i, x) })).map(o => ({ ...o, s: (expGet(o.it.cid) ? 1 : 0) + Math.random() * .9 })).sort((a, b) => a.s - b.s).slice(0, 4).sort((a, b) => ((a.x[4] || [0])[0]) - ((b.x[4] || [0])[0]));
    for (const o of qs) { const it = o.it; delete it.lines; Object.assign(it, { sq: 1, ch, qe: o.x[2], qcat: qwCat(o.x[0]), cat: catByExposure(it.cid), seenBefore: !!expGet(it.cid) }); items.push(it); }
    const near = new Set(); qs.forEach(o => { const ln = o.x[4]; if (ln) for (let j = ln[0] - 4; j <= ln[1] + 4; j++) near.add(j); });
    const cand = (d.verbs || []).filter(v => near.has(v[5] + 1) && !usedForms.has(AN.normHe(v[0])));
    const pick = []; for (const v of weightedPick(cand, storyVerbWeight, cand.length)) { if (pick.some(p => AN.normHe(p[0]) === AN.normHe(v[0]) || p[1] === v[1])) continue; pick.push(v); if (pick.length >= 2) break; }
    pick.forEach(v => { const it = fsParseItem(kk, L, [v[0], String(v[1]).replace(/[כמנפצ]$/, c => ({ 'כ': 'ך', 'מ': 'ם', 'נ': 'ן', 'פ': 'ף', 'צ': 'ץ' }[c])), v[2], v[3], v[4], null, v[5] + 1]); it.ref = `Ch. ${ch} story, line ${v[5] + 1}`; it.strictNA = 1; items.push(it); });
  }
  if (!items.length) throw new Error(FS_NEED);
  fsFinish(items);
  return { id: 'a' + Date.now().toString(36), type: k, blueprint: k, items, limits: [], limitMs: 20 * 60000, created: Date.now(), passage: null, mode: 'strict' };
}
const sqDone = k => (S.assess || []).filter(a => a.type === k && a.end).sort((a, b) => a.end - b.end);
const startSQ = k => fsStart(() => buildSQ(k), 'the Hebrew-question track');
const SQ_STORY = {};
async function sqStoryCache(ch) { if (!SQ_STORY[ch]) { const d = await storyDoc(ch); SQ_STORY[ch] = d ? d.lines : []; } return SQ_STORY[ch]; }

// ===== Ruth baseline: 3 verses in a row, timed, outside every simulation passage + 2 syntax questions in English =====
const RT_DEF = {
  rt1: { c: 2, v1: 15, v2: 17, vocab: [['תַּכְלִימוּהָ (Hiphil כלם)', 'humiliate, put to shame'], ['שׁלל', 'pull out'], ['צְבָתִים', 'bundles (of grain)'], ['גער', 'rebuke'], ['חבט', 'beat out (grain)'], ['אֵיפָה', 'ephah (a measure)']],
    syn: [['Ruth 2:16 — שֹׁל־תָּשֹׁלּוּ לָהּ. Parse both verbs and explain the construction.', 'שֹׁל = Qal infinitive absolute of שׁלל; תָּשֹׁלּוּ = Qal yiqtol 2mp of the same (geminate) root. Infinitive absolute + a finite verb of the same root = emphasis: “you shall surely pull out (some) for her”. לָהּ = for her (Ruth); Boaz is speaking to his young men (2mp).'],
      ['Ruth 2:17 — וַתַּחְבֹּט אֵת אֲשֶׁר־לִקֵּטָה. What does אֵת mark, and what is the job of the אֲשֶׁר-clause? Parse לִקֵּטָה.', 'אֵת marks the definite direct object of וַתַּחְבֹּט (“and she beat out”). The object is the whole clause אֲשֶׁר־לִקֵּטָה, a relative clause without a head noun: “that which she had gleaned”. לִקֵּטָה = Piel qatal 3fs of לקט (ḥireq under root 1, doubled root 2, ending ָה = she).']] },
  rt2: { c: 3, v1: 16, v2: 18, vocab: [['רֵיקָם', 'empty-handed'], ['שׁקט', 'be quiet, rest'], ['כלה (Piel)', 'finish, bring to an end'], ['שֵׁשׁ', 'six'], ['נגד (Hiphil)', 'tell']],
    syn: [['Ruth 3:16 — מִי־אַתְּ בִּתִּי. What does Naomi literally ask, and what does she mean?', 'Literally “Who are you, my daughter?”: מִי + the independent pronoun אַתְּ (2fs); בִּתִּי = בַּת + 1cs suffix, a vocative (“my daughter”). In context she means “How did it go? What is your situation now?” — has Boaz taken up the matter or not.'],
      ['Ruth 3:18 — כִּי לֹא יִשְׁקֹט הָאִישׁ כִּי־אִם־כִּלָּה הַדָּבָר הַיּוֹם. Explain the two כִּי and parse כִּלָּה.', 'The first כִּי gives the reason (“for”). After a negative, כִּי־אִם means “unless / until”: “the man will not rest unless (until) he has finished the matter today”. כִּלָּה = Piel qatal 3ms of כלה (doubled ל; III-ה with the ending ָה), “he has finished”.']] },
};
Object.entries(RT_DEF).forEach(([k, D], i) => { BLUEPRINTS[k] = { id: k, name: `Ruth baseline ${i + 1} · Ruth ${D.c}:${D.v1}–${D.v2} (translate under time + 2 syntax questions)`, minutes: () => 20, sections: { translation: { n: 3, w: .30, label: 'Ruth · translation (30 points on the final)' }, syntax: { n: 2, w: .12, label: 'Ruth · syntax questions in English (12 points)' } } }; });
async function buildRT(k) {
  const D = RT_DEF[k], verses = []; for (let v = D.v1; v <= D.v2; v++) { const x = ruthVerse(D.c, v); if (x) verses.push({ ...x, he: ruthProf(D.c, v, x.he) }); }
  const vocab = D.vocab.map(x => x[0] + ' “' + x[1] + '”').join(' · ');
  const tr = exTranslate(verses).map((y, i) => ({ ...y, key: `${k}|t|${D.c}:${D.v1 + i}`, cat: catByExposure(y.cid), seenBefore: !!expGet(y.cid), rt: 1, vocab }));
  const syn = D.syn.map((s, i) => ({ kind: 'write', sub: 'comp', synEn: 1, key: `${k}|s|${i}`, cid: 'rts:' + AN.hash(s[0]), q: s[0], model: s[1], t: 'syntax', sec: 'syntax', cat: 'protected', skill: 'syntax' }));
  const items = fsFinish([...tr, ...syn]);
  return { id: 'a' + Date.now().toString(36), type: k, blueprint: k, items, limits: [`Words given (as the professor gives rare words): ${vocab}. Your paper lexicon is allowed on the final.`], limitMs: 20 * 60000, created: Date.now(), passage: null, mode: 'strict' };
}
const rtDone = k => (S.assess || []).filter(a => a.type === k && a.end).sort((a, b) => a.end - b.end);
const startRT = k => fsStart(() => buildRT(k), 'the Ruth baseline');
const N23_TYPES = /^(rp1|rp2|sq1|sq2|rt1|rt2)$/;
const N23_INTRO = {
  rp1: 'Nine NEW forms from your class stories, Ruth and the professor’s slides and handouts — one for each of the nine mistakes of the oral diagnostic (you are not told which). Six boxes + the English meaning, “?” where unsure. No pronunciation, no help; the correction comes only after you submit. For an infinitive press “—” in person, gender and number; for a participle press “—” in person: an empty box now counts as unanswered (GPT’s rule; on paper write —).',
  rp2: 'Twelve more NEW forms: the same nine mistakes with other verbs, plus three “check” items. Take it after some other work (at least 20 minutes after Round 1): then it shows whether the rule stayed. Same rules as Round 1.',
  sq1: 'Eight questions in Hebrew from two class stories, plus four verbs. For each question you FIRST say what kind of answer it asks for and what it means in English (timed); only then the whole story opens and you find the answer. No line numbers for the questions, no highlighting. Short answers in Hebrew are enough (a name, a phrase).',
  sq2: 'Second round with two other stories. Same rules: understand the question first, then the story opens.',
  rt1: 'Three verses in a row that are in none of your simulations, translated under time (strict, then natural), plus two syntax questions in English. Rare words are given; on the final you also have your paper lexicon. This is the first real measure of the 30-point part.',
  rt2: 'Second Ruth baseline: three other verses, same rules. Compare with Baseline 1.',
};
(function () {
  const _ei = exItemHTML;
  exItemHTML = function (it, a, n) {
    let h = _ei.apply(this, arguments);
    try {
      if (it && it.sq && it.kind === 'write') {
        a.shown = a.shown || Date.now();
        const head = h.slice(0, h.indexOf('<div class="qtext">'));
        const qBig = `<div class="he" dir="rtl" lang="he" style="font-size:1.8rem;line-height:1.6;text-align:center;margin:8px 0">${esc(it.q)}</div>`;
        if (!a.dec) return head + `<div class="small muted" style="text-align:center">Step 1 of 2 · understand the question (the story opens after this)</div>${qBig}
          <div class="small"><b>What kind of answer does it ask for?</b></div><div class="opts">${DQ_CATS.map((c, i) => `<button class="opt" data-sqk="${i}" aria-pressed="${a.kind === i}" style="${a.kind === i ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">${esc(c)}</button>`).join('')}</div>
          <label class="f">What does the question mean? (English)<input type="text" class="ex-txt" data-k="qmean" value="${esc(a.qmean || '')}" autocomplete="off"></label>
          <button class="btn primary" data-sqdec="1">I understand it → open the story</button>`;
        const L = SQ_STORY[it.ch] || [];
        return head + `<div class="small muted">Step 2 of 2 · find the answer in the story (Ch. ${it.ch}: ${esc(SQ_TITLE[it.ch] || '')}). You said it asks for <b>${esc((DQ_CATS[a.kind] || '—').split(' (')[0])}</b>: “${esc(a.qmean || '')}”.</div>${qBig}
          <label class="f">Answer (a short Hebrew phrase is enough)<textarea class="ex-txt" data-k="text" dir="rtl" lang="he">${esc(a.text || '')}</textarea></label>
          <details open><summary class="small">The story (whole text)</summary><div class="he" dir="rtl" lang="he" style="max-height:340px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:8px;line-height:1.9;font-size:1.15rem">${L.length ? L.map((l, i) => `<div><small class="muted" style="font-family:var(--f-ui)">${i + 1}</small> ${esc(l)}</div>`).join('') : 'The story text is not in the app (import the update file).'}</div></details>`;
      }
      if (it && it.rt && it.vocab) h += `<div class="small muted">Words given: ${heWrap(esc(it.vocab))}</div>`;
    } catch (e) { console.error(e); }
    return h;
  };
  const _wi = wireExItem;
  wireExItem = function (v, it, a, onChange) {
    const r = _wi.apply(this, arguments);
    if (it && it.sq) {
      $$('[data-sqk]', v).forEach(b => b.onclick = () => { a.kind = +b.dataset.sqk; $$('[data-sqk]', v).forEach(x => { const on = +x.dataset.sqk === a.kind; x.setAttribute('aria-pressed', on); x.style.borderColor = on ? 'var(--accent)' : ''; x.style.background = on ? 'var(--accent-soft)' : ''; }); onChange(); });
      const d = $('[data-sqdec]', v); if (d) d.onclick = async () => { a.dec = 1; a.decMs = Date.now() - (a.shown || Date.now()); await sqStoryCache(it.ch); onChange(); renderExam(); };
      if (a.dec && !SQ_STORY[it.ch]) sqStoryCache(it.ch).then(() => renderExam());
    }
    return r;
  };
  const _re = renderExam;
  renderExam = function () {
    const r = _re.apply(this, arguments);
    try { if (EX && N23_TYPES.test(EX.type) && EX.phase === 'intro') { const h1 = $('#v-session h1'); if (h1) h1.insertAdjacentHTML('afterend', `<div class="note">${heWrap(esc(N23_INTRO[EX.type] || ''))}${EX.gapMin != null ? ` <b>${EX.gapMin} min since Round 1.</b>` : ''}</div>`); } } catch (e) { console.error(e); }
    return r;
  };
})();
function sqAnalysisHTML(rec) {
  const rows = (rec.items || []).filter(x => (x.spec || {}).sq).map(x => { const it = x.spec, a = x.answer || {}; const kindOK = it.qcat == null || a.kind == null ? null : a.kind === it.qcat; const mc = (a.qmean || '').trim() ? AG.enCover(it.qe || '', a.qmean).cov : null; const und = kindOK !== false && mc != null && mc >= .5; return { x, it, a, kindOK, mean: mc == null ? null : mc >= .6 ? 1 : mc >= .3 ? .5 : 0, und, s: a.decMs ? Math.round(a.decMs / 1000) : null, right: x.answered ? x.score : null }; });
  const U = rows.filter(o => o.und), uR = U.filter(o => (o.right || 0) >= .75).length, uW = U.filter(o => o.right != null && o.right < .75).length, nU = rows.filter(o => !o.und).length;
  const med = rows.map(o => o.s).filter(s => s > 0).sort((a, b) => a - b), m = med.length ? med[Math.floor(med.length / 2)] : null;
  return `<div class="panel stack"><h2 style="margin:0">Hebrew questions · understand vs find</h2>
    <div class="small"><b>Understood before opening the story:</b> ${U.length} of ${rows.length} (kind of answer right and the English close enough) · median time to understand <b>${m ?? '—'} s</b> (target under 20 s).</div>
    <div class="small">Of the understood questions: <b>${uR} answered right</b> · <b>${uW} answered wrong</b> (a story / finding problem, not a Hebrew-question problem). <b>${nU} not understood</b> (a question-word / vocabulary problem). Answers are the app’s estimate until checked.</div>
    ${tableHTML(['Question', 'Kind', 'Meaning', 'Time to understand', 'Answer'], rows.map(o => [heWrap(esc(o.it.q)), o.kindOK == null ? '—' : o.kindOK ? '✓' : `✗ (${esc((DQ_CATS[o.a.kind] || '').split(' (')[0])})`, o.mean == null ? 'not written' : o.mean >= 1 ? '✓' : o.mean ? '½' : '✗', o.s != null ? o.s + ' s' : '—', o.right == null ? 'blank' : o.right >= .75 ? '✓' : o.right > 0 ? '½' : '✗']))}</div>`;
}
(function () {
  const _rv = renderExamReview;
  renderExamReview = function (rec) {
    const r = _rv.apply(this, arguments);
    try {
      if (rec && /^rp[12]$/.test(rec.type)) {
        const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('afterend', rpCompareHTML() + `<div class="panel row" style="justify-content:space-between"><span class="small">The full correction of the oral diagnostic, item by item:</span><button class="btn" data-odopen="1">Open it</button></div>`);
        for (const x of rec.items || []) { const el = $(`.rv-item[data-ri="${x.n}"]`), it = x.spec || {}, a = x.answer || {}; if (!el) continue;
          el.insertAdjacentHTML('beforeend', `<div class="small"><b>Meaning:</b> ${a.mean ? `you wrote “${esc(a.mean)}”` : 'not given'} · expected “${esc(it.gloss || '')}”</div><div class="small"><b>The rule (your Nov 23 item Q${it.odq}):</b> ${heWrap(esc(it.mech || ''))}. ${heWrap(esc(it.why || ''))} <span class="muted">Source: ${esc(it.ref || '')}${it.seenBefore ? ' · you had met this form before' : ' · new to you'}.</span></div>`); }
      }
      if (rec && /^sq[12]$/.test(rec.type)) {
        const head = $('#v-session .panel'); if (head) head.insertAdjacentHTML('afterend', sqAnalysisHTML(rec));
        for (const x of rec.items || []) { const el = $(`.rv-item[data-ri="${x.n}"]`), it = x.spec || {}, a = x.answer || {}; if (!el || !it.sq) continue;
          el.insertAdjacentHTML('beforeend', `<div class="small"><b>The question means:</b> “${esc(it.qe || '')}” · you wrote “${esc(a.qmean || '')}” · kind: ${it.qcat != null ? esc(DQ_CATS[it.qcat]) : '—'}${a.decMs ? ` · understood in ${Math.round(a.decMs / 1000)} s` : ''}</div>`); }
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
// GPT’s second profile now has a parsing source even before an in-app diagnostic: the oral one (provisional).
(function () {
  const _dp = dgProfile;
  dgProfile = function () {
    const o = _dp.apply(this, arguments); const D = odData();
    if (!o.pr && D) { const it = D.items, f = k => it.filter(x => (x.field_credit || {})[k]).length / it.length;
      o.pr = { oral: 1 }; o.parse = D.grading.earned_fields_user_clarified / D.grading.possible_fields; o.parseDone = 1;
      o.box = { root: f('root'), stem: f('binyan'), form: f('netiyyah'), pgn: it.filter(x => ['person', 'gender', 'number'].every(k => (x.field_credit || {})[k])).length / it.length }; }
    return o;
  };
})();
// Cards: Final rescue tab (the nine first, then the new rounds and tracks), the Today banner, and the plan for Mon 23 / Tue 24.
function n23CardsHTML() {
  const D = odData();
  const card = (title, sub, done, btns) => `<div class="step ${done ? 'done' : ''}" style="border:1px dashed var(--accent);border-radius:10px;padding:8px"><span class="n">${done ? '✓' : '•'}</span><div><b>${title}</b><div class="small muted">${sub}</div></div><div class="stack" style="gap:6px;flex:0 0 auto;min-width:150px">${btns}</div></div>`;
  const last = (rs) => rs.length ? `Taken ${rs.length}× · last ${simPct(rs[rs.length - 1])}%` : 'Not taken yet.';
  const btn = (attr, label, prim) => `<button class="btn ${prim ? 'primary' : ''}" ${attr} style="white-space:nowrap">${label}</button>`;
  const open = D ? `9 items at 4/6 or less, first: ${OD_ORDER.map(n => { const x = D.items.find(z => z.number === n); return x ? H(esc(x.hebrew)) : ''; }).join(' · ')}` : 'Import hebrew-update-2026-11-23.json (Library → Add material) to see it.';
  const R = (k, f) => f(k);
  return card(`Nov 23 oral diagnostic · ${D ? `${D.grading.earned_fields_user_clarified}/120 boxes (${(+D.grading.percentage).toFixed(1)}%, provisional)` : 'not imported yet'}`, heWrap(open), false, btn('data-odopen="1"', 'Open the correction', 1))
    + card('Repair round 1 · 9 new forms', '(15 min) one new class form for each of the nine mistakes · ' + last(rpDone('rp1')), rpDone('rp1').length, (rpDone('rp1').length ? btn(`data-rpv="${rpDone('rp1').slice(-1)[0].id}"`, 'See the correction') : '') + btn('data-rps="rp1"', rpDone('rp1').length ? 'Take again' : 'Start', !rpDone('rp1').length))
    + card('Repair round 2 · 12 new forms', '(20 min, after other work) the same nine mistakes with other verbs + three checks · ' + last(rpDone('rp2')), rpDone('rp2').length, (rpDone('rp2').length ? btn(`data-rpv="${rpDone('rp2').slice(-1)[0].id}"`, 'See the correction') : '') + btn('data-rps="rp2"', rpDone('rp2').length ? 'Take again' : 'Start', rpDone('rp1').length && !rpDone('rp2').length))
    + ['sq1', 'sq2'].map(k => card(BLUEPRINTS[k].name, '(20 min) understand each question first (kind + English, timed), then find the answer in the whole story · ' + last(sqDone(k)), sqDone(k).length, (sqDone(k).length ? btn(`data-rpv="${sqDone(k).slice(-1)[0].id}"`, 'See the analysis') : '') + btn(`data-sqs="${k}"`, sqDone(k).length ? 'Take again' : 'Start'))).join('')
    + ['rt1', 'rt2'].map(k => card(BLUEPRINTS[k].name.split(' (')[0], '(20 min) 3 verses in a row timed + 2 syntax questions in English: the 30 + 12 points never measured yet · ' + last(rtDone(k)), rtDone(k).length, (rtDone(k).length ? btn(`data-rpv="${rtDone(k).slice(-1)[0].id}"`, 'See the correction') : '') + btn(`data-rts="${k}"`, rtDone(k).length ? 'Take again' : 'Start', k === 'rt1' && !rtDone(k).length))).join('');
}
(function () {
  const _fc = fsCardHTML;
  fsCardHTML = function () {
    let h = _fc.apply(this, arguments);
    h = h.replace('(GPT’s 20 verbs, 30 min: the second version / retest)', '(GPT’s 20 verbs — you did them aloud with GPT on Nov 23; that result is imported, see “Nov 23 oral diagnostic”. In the app this would be a retake.)');
    return h.replace('<div class="plan">', '<div class="plan">' + n23CardsHTML());
  };
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest('[data-odopen],[data-rps],[data-rpv],[data-sqs],[data-rts]'); if (!t) return; e.preventDefault();
    if (t.dataset.odopen) { OD_BACK = S.tab === 'session' ? 'today' : (S.tab || 'today'); renderOD(); }
    else if (t.dataset.rps) startRP(t.dataset.rps);
    else if (t.dataset.sqs) startSQ(t.dataset.sqs);
    else if (t.dataset.rts) startRT(t.dataset.rts);
    else { const r = (S.assess || []).find(a => a.id === t.dataset.rpv); if (r) renderExamReview(r); }
  });
  const _rt = renderToday;
  renderToday = function () {
    const r = _rt.apply(this, arguments);
    try { const D = odData(), v = $('#v-today'); if (D && v && !$('#od-banner', v)) {
      v.insertAdjacentHTML('afterbegin', `<div class="panel stack" id="od-banner" style="border:2px solid var(--accent)"><b>First: the nine mistakes of your Nov 23 oral diagnostic</b><div class="small">${OD_ORDER.map(n => { const x = D.items.find(z => z.number === n); return x ? `<a href="#" data-odq="${n}">Q${n} ${H(esc(x.hebrew))} ${x.score_fields}/6</a>` : ''; }).join(' · ')}</div><div class="small muted">${heWrap(esc(OD_MECH[8]))} · ${heWrap(esc(OD_MECH[16]))} come first: they are frequent, regular patterns; the Hishtaphel (Q20) is last.</div><div class="row"><button class="btn" data-odopen="1">Open the correction</button><button class="btn ${rpDone('rp1').length ? '' : 'primary'}" data-rps="rp1">Repair round 1</button><button class="btn ${rpDone('rp1').length && !rpDone('rp2').length ? 'primary' : ''}" data-rps="rp2">Repair round 2</button></div></div>`);
      $$('[data-odq]', v).forEach(a => a.onclick = e => { e.preventDefault(); OD_BACK = 'today'; renderOD(a.dataset.odq); }); } } catch (e) { console.error(e); }
    return r;
  };
  const _pl = planBlockList;
  planBlockList = function (d) {
    let B = _pl.apply(this, arguments);
    if ((d === '2026-11-23' || d === '2026-11-24') && odData()) {
      const did = (k, day) => (S.assess || []).some(a => a.type === k && a.end && (!day || dayKey(new Date(a.end)) === day));
      const seen = () => { try { return localStorage.getItem('het:odseen') >= d; } catch { return false; } };
      const next = (a, b) => did(a) ? b : a;
      B = B.filter(b => !['dg1', 'dgx'].includes(b.id));
      const iq = B.findIndex(b => b.id === 'dq1');
      const mine = [
        { id: 'od', min: 12, title: 'The correction of your oral diagnostic: the nine first, then the contrast sheet (12 min)', sub: 'Word · your answer · the correct answer, box by box in green and red, with the marks that decide. Say each contrast aloud.', act: () => { OD_BACK = 'today'; renderOD(); }, check: seen },
        { id: 'rp1', min: 15, title: 'Repair round 1 · one new class form for each of the nine mistakes', sub: 'Six boxes + meaning; the correction only after you submit.', act: () => startRP('rp1'), check: () => did('rp1') },
      ];
      const after = [
        { id: 'sqx', min: 20, title: 'Hebrew questions in two stories: understand first, then find', sub: 'Kind of answer + English for each question (timed), then the whole story opens. Separates “I did not understand the question” from “I could not find the answer”.', act: () => startSQ(next('sq1', 'sq2')), check: () => did('sq1', d) || did('sq2', d) },
        { id: 'rtx', min: 20, title: 'Ruth baseline: 3 verses timed + 2 syntax questions', sub: 'The 30 + 12 points that were never measured. Verses outside every simulation.', act: () => startRT(next('rt1', 'rt2')), check: () => did('rt1', d) || did('rt2', d) },
        { id: 'rp2', min: 20, title: 'Repair round 2 (after the other blocks) · new forms, same nine mistakes', sub: 'At least 20 minutes after Round 1, so it shows what stayed. Then read “What next?” on the Final rescue tab.', act: () => startRP('rp2'), check: () => did('rp2') },
      ];
      if (iq >= 0) B.splice(iq + 1, 0, ...after); else B.unshift(...after);
      B.unshift(...mine);
    }
    return B;
  };
})();

// ===== GPT’s critical audit (Nov 23, night): verified defects fixed; analytics labelled by source =====
// 1) Hishtaphel printed “undefined” in the word-by-word explanation (stem tables had only the seven main stems).
try {
  XV_STEMHE.hishtaphel = 'הִשְׁתַּפְעֵל'; XV_STEMEN.hishtaphel = 'Hishtaphel'; XV_COMP.hishtaphel = ['hithpael', 'piel'];
  XV_RULE.hishtaphel = { qatal: 'Hishtaphel perfect: הִשְׁתַּ before the root חוה (הִשְׁתַּחֲוָה). Only this one verb, “bow down, worship” (professor’s Hithpael handout, Ch. 24, p. 7).', yiqtol: 'Hishtaphel imperfect: person prefix + שְׁתַּ + חוה (יִשְׁתַּחֲוֶה). The wayyiqtol is short: וַיִּשְׁתַּחוּ “and he bowed down” — its final וּ is the root ו, not a plural (the plural is וַיִּשְׁתַּחֲווּ).', ptc: 'Hishtaphel participle: מִשְׁתַּחֲוֶה (מ + שְׁתַּ + חוה).', inf: 'Hishtaphel infinitive: (לְ)הִשְׁתַּחֲוֹת; וֹת is the III-ה infinitive ending.' };
} catch (e) { console.error(e); }
// 2) No per-week “needed” rates when the exam is less than a week away.
try { const _tg = AN.targets; AN.targets = function (cur, slope, weeksLeft) { const r = _tg.apply(this, arguments); return weeksLeft != null && weeksLeft < 1 ? r.map(t => ({ ...t, req: null, status: t.gap != null && t.gap <= 0 ? t.status : 'exam in under a week: a per-week rate means nothing' })) : r; }; } catch (e) { console.error(e); }
// 3) The weekly / semester report PDF is drawn as pictures (no text layer). Every report now also saves a parallel UTF-8 Markdown file with the same headings, tables and Hebrew.
try {
  const P = Report.prototype, md = r => (r._md = r._md || [`# ${r.title}`, '']);
  const mdCell = c => String(c ?? '').replace(/\|/g, '/').replace(/\n+/g, ' ');
  const _h1 = P.h1, _h2 = P.h2, _bu = P.bullets, _tb = P.table, _tx = P.text, _ch = P.chart, _pdf = P.pdf;
  P.h1 = function (t) { md(this).push('', `# ${t}`, ''); this._in = 1; try { return _h1.apply(this, arguments); } finally { this._in = 0; } };
  P.h2 = function (t) { md(this).push('', `## ${t}`, ''); this._in = 1; try { return _h2.apply(this, arguments); } finally { this._in = 0; } };
  P.bullets = function (arr) { md(this).push(...arr.map(t => `- ${t}`), ''); this._in = 1; try { return _bu.apply(this, arguments); } finally { this._in = 0; } };
  P.table = function (head, rows) { md(this).push(`| ${head.map(mdCell).join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map(r => `| ${r.map(mdCell).join(' | ')} |`), ''); this._in = 1; try { return _tb.apply(this, arguments); } finally { this._in = 0; } };
  P.text = function (t) { if (!this._in) md(this).push(String(t), ''); return _tx.apply(this, arguments); };
  P.chart = async function (id, caption) { const card = document.getElementById(id); const ttl = card && card.querySelector('h3') ? card.querySelector('h3').textContent : id; const sub = caption || (card && card.querySelector('p.small') ? card.querySelector('p.small').textContent : ''); md(this).push(`*Chart: ${ttl}${sub ? ' — ' + sub : ''} (the picture is in the PDF).*`, ''); this._in = 1; try { return await _ch.apply(this, arguments); } finally { this._in = 0; } };
  P.pdf = function () { const out = _pdf.apply(this, arguments); try { const name = `hebrew-${String(this.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${dayKey()}.md`; setTimeout(() => saveFile(name, new Blob([md(this).join('\n')], { type: 'text/markdown;charset=utf-8' })).catch(() => { }), 600); } catch (e) { console.error(e); } return out; };
} catch (e) { console.error(e); }
// 4) Readiness by the final’s four parts, and every test listed with its own source (never one mixed trend).
const N23_KIND = t => /^fs\d$/.test(t) ? 'final simulation (professor’s format)' : t === 'sim' || t === 'mock' ? 'practice final (older format)' : t === 'sp' ? 'story practice (exam format)' : /^(dg1|dg1g|dgr|rp1|rp2)$/.test(t) ? 'timed parsing diagnostic' : /^(dq1|sq1|sq2)$/.test(t) ? 'timed Hebrew-question test' : /^rt\d$/.test(t) ? 'timed Ruth baseline' : t === 'weekly' ? 'weekly check (custom mix)' : 'practice test';
const N23_PARTS = [['parse', 'Story · parsing', 32], ['comp', 'Story · questions in Hebrew', 26], ['translation', 'Ruth · translation', 30], ['syntax', 'Ruth · syntax in English', 12]];
function n23Rec(a) { try { const ov = ovFor(a); return ov ? recWithOverlay(a, ov) : a; } catch { return a; } }
function n23PartStats(a, sec) {
  const L = (a.items || []).filter(x => x.sec === sec && (sec !== 'comp' || !(x.spec || {}).dq)); if (!L.length) return null;
  const ans = L.filter(x => x.answered); const est = ans.filter(x => x.sc === 'est' || x.chk).length;
  return { n: L.length, answered: ans.length, acc: ans.length ? ans.reduce((s, x) => s + (x.score || 0), 0) / ans.length : null, est };
}
function n23ReadinessHTML() {
  const A = (S.assess || []).filter(a => a.end).map(n23Rec).sort((a, b) => b.end - a.end);
  const rows = N23_PARTS.map(([sec, label, pts]) => {
    const ev = A.map(a => ({ a, s: n23PartStats(a, sec) })).filter(o => o.s && o.s.answered && o.a.type !== 'weekly').slice(0, 3);
    if (!ev.length) return [label, pts, '<b>not measured</b>', '—'];
    const o = ev[0];
    return [label, pts, `${Math.round(o.s.acc * 100)}% on ${o.s.answered} answered of ${o.s.n}${o.s.est ? ` (${o.s.est} estimated, to check)` : ''} · ${esc((BLUEPRINTS[o.a.type] || {}).name || o.a.type)}, ${dShort(o.a.end)}, ${esc(N23_KIND(o.a.type))}`, ev.slice(1).map(e => `${Math.round(e.s.acc * 100)}% (${e.s.answered}/${e.s.n}, ${dShort(e.a.end)})`).join(' · ') || '—'];
  });
  const P = { p: [0, 0], g: [0, 0], n: [0, 0], all: [0, 0] };
  for (const a of A) for (const x of (a.items || []).filter(x => x.kind === 'parse' && x.answered && x.spec)) { const s = x.answer || {}; const r = (gradeParse(x.spec, { p: s.p || '', g: s.g || '', n: s.n || '', conj: s.conj || '', stem: s.stem || '', root: s.root || '' }) || {}).res || {}; ['p', 'g', 'n'].forEach(k => { P[k][1]++; if (r[k]) P[k][0]++; }); P.all[1]++; if (r.p && r.g && r.n) P.all[0]++; }
  const pc = ([a, b]) => b ? `${a}/${b} (${Math.round(a / b * 100)}%)` : '—';
  const tests = A.slice(0, 10).map(a => { const ans = (a.items || []).filter(x => x.answered).length, n = (a.items || []).length; return [esc(a.id), dShort(a.end), esc((BLUEPRINTS[a.type] || {}).name || a.type), esc(N23_KIND(a.type)), `${ans}/${n}${a.timeUp ? ' (time ran out)' : ''}`, `${simPct(a)}%${a._ov ? ' (with grader overlay)' : ''}`]; });
  const D = odData();
  return `<div class="panel stack" id="n23-ready"><h2 style="margin:0">The final’s four parts: what is measured</h2>
    <p class="small">Points are the professor’s (32 + 26 + 30 + 12 = 100). Each row shows the latest test that measured that part, with its own source; nothing is mixed into one trend. Blank items count 0 in a test’s score but are left out of these accuracies (no evidence either way). Weekly checks are left out: they use the app’s custom mix, not the final’s parts.</p>
    ${tableHTML(['Part', 'Points', 'Latest measure (answered items)', 'Earlier'], rows)}
    ${D ? `<div class="small">Oral diagnostic with GPT (Nov 23, untimed, provisional): ${D.grading.earned_fields_user_clarified}/120 boxes on 20 paradigm verbs — kept separate from the timed tests.</div>` : ''}
    <div class="small"><b>Person / gender / number on every answered parse</b> (a participle has no person; an infinitive has none of the three; 1st person and 3rd plural qatal are common gender): person ${pc(P.p)} · gender ${pc(P.g)} · number ${pc(P.n)} · <b>all three right</b> ${pc(P.all)}. The weekly report’s “person, gender, number” figure is the all-three-right kind, from practice; these are from tests.</div>
    <details><summary class="small"><b>Tests, each with its source</b></summary>${tableHTML(['Record', 'Date', 'Test', 'Kind', 'Answered', 'Score'], tests)}<div class="small muted">The “independent score” on this page is the app’s learning index (a custom mix of unseen items across practice categories). It is not a final-exam score and not a forecast.</div></details></div>`;
}
(function () {
  const _rp = renderProgress;
  renderProgress = async function () {
    const r = await _rp.apply(this, arguments);
    try { const v = $('#v-progress'); if (v && !$('#n23-ready', v)) v.insertAdjacentHTML('afterbegin', n23ReadinessHTML()); } catch (e) { console.error(e); }
    return r;
  };
  // 5) In a diagnostic’s analysis: the items at 4/6 or less (mandatory) and the items not reached in time (a speed problem, not a knowledge error).
  const _da = dgAnalysisHTML;
  dgAnalysisHTML = function (rec) {
    let h = _da.apply(this, arguments);
    try {
      const R = n23Rec(rec), L = (R.items || []).map(x => ({ x, six: Math.round((x.score || 0) * 6) }));
      const low = L.filter(o => o.x.answered && o.six <= 4), miss = L.filter(o => !o.x.answered);
      const ln = o => `${o.x.n}. ${H(esc((o.x.spec || {}).form || ''))} ${o.six}/6`;
      h = h.replace(/<\/div>\s*$/, `<div class="small"><b>Fix first (answered, 4/6 or less):</b> ${low.length ? low.map(ln).join(' · ') : 'none'}</div><div class="small"><b>Not answered${rec.timeUp ? ' (time ran out)' : ''}:</b> ${miss.length ? miss.map(o => `${o.x.n}. ${H(esc((o.x.spec || {}).form || ''))}`).join(' · ') + ' — retest these; a blank says nothing about what you know' : 'none'}</div></div>`);
    } catch (e) { console.error(e); }
    return h;
  };
})();

// ===== Audit fixes, Nov 23 (late night): a running test can no longer be lost; progress saved in a folder on the computer =====
// F01: the test draft lived only in the browser's small local storage and failed saves were silent.
//  · Every save of the draft now also goes to the app's own IndexedDB (far larger) and, when set up, to a file in a folder on the computer.
//  · A failed save is shown on screen (once), old day logs that are already in the database are removed from local storage, the local copy of test records is kept short.
//  · On start, the newest draft of the three places is the one resumed.
const LOCALDB = (function () {
  let dbp = null; const open = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open('het-local', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('kv', mode); const q = fn(t.objectStore('kv')); t.oncomplete = () => res(q ? q.result : undefined); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); };
  return { get: k => tx('readonly', s => s.get(k)), set: (k, v) => tx('readwrite', s => s.put(v, k)), del: k => tx('readwrite', s => s.delete(k)) };
})();
const N23 = { draftIDB: null, draftFile: null, warned: false, pruned: false, idbT: null, fileT: null };
function n23Warn(msg) {
  if (N23.warned) return; N23.warned = true;
  try { document.body.insertAdjacentHTML('afterbegin', `<div id="n23-warn" class="note" style="position:sticky;top:0;z-index:50;margin:0;border-radius:0;background:var(--accent-soft)"><b>Storage note:</b> ${esc(msg)} <button class="btn sm" onclick="this.parentElement.remove()">OK</button></div>`); } catch { }
}
async function n23PruneLocal() {
  if (N23.pruned || !S.db) return; N23.pruned = true;
  try {
    const today = dayKey(), keep = new Set([today, dayKey(new Date(Date.now() - 864e5)), dayKey(new Date(Date.now() - 2 * 864e5))]);
    const keys = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); const m = /^het:(ev|evpart):(\d{4}-\d\d-\d\d)$/.exec(k || ''); if (m && !keep.has(m[2])) keys.push([k, m[2]]); }
    for (const [k, day] of keys) { try { const d = await S.db.doc('events/' + evDocId(day, 1)).get(); if (d.exists) localStorage.removeItem(k); } catch { } }
  } catch (e) { console.error(e); }
}
(function () {
  const _lsGet = lsGet, _exSave = exSave;
  lsSet = function (k, v) {
    if (k === 'assess' && Array.isArray(v) && S.db) v = v.slice(-12); // the database keeps every record; the quick local copy only the latest
    const write = () => { localStorage.setItem('het:' + k, JSON.stringify(v)); };
    try { write(); } catch (e) {
      n23PruneLocal().then(() => { try { write(); } catch (e2) { n23Warn(k === 'exam' ? 'the browser’s quick storage is full. Your test is still being saved in the app’s database' + (N23FS.perm === 'granted' ? ' and in your folder on the computer.' : '. Set up “Save on this computer” in Settings for a second copy.') : 'the browser’s quick storage is full; your progress is still saved in the app’s database.'); } });
    }
    if (k === 'exam') {
      clearTimeout(N23.idbT);
      if (!v) { N23.draftIDB = null; N23.draftFile = null; LOCALDB.del('exam').catch(() => { }); n23FileDraft(null); }
      else { const snap = JSON.parse(JSON.stringify(v)); N23.draftIDB = snap; N23.idbT = setTimeout(() => LOCALDB.set('exam', snap).catch(e => console.error(e)), 600); n23FileDraft(snap); }
    }
  };
  lsGet = function (k) {
    const v = _lsGet.apply(this, arguments);
    if (k !== 'exam') return v;
    const c = [v, N23.draftIDB, N23.draftFile].filter(x => x && x.phase && x.phase !== 'done');
    if (!c.length) return v;
    return c.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0];
  };
  exSave = function () { try { if (EX) EX.savedAt = Date.now(); } catch { } return _exSave.apply(this, arguments); };
  // On start: load the database copy of the draft, ask the browser to keep the app's data, prune old local logs.
  LOCALDB.get('exam').then(d => { if (d && d.phase && d.phase !== 'done') { N23.draftIDB = d; if (S.tab === 'today' && typeof renderToday === 'function' && !EX) renderToday(); } }).catch(() => { });
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { }); } catch { }
  setTimeout(() => n23PruneLocal(), 6000);
})();

// ----- Save on this computer: a folder the student chooses once; the app writes its progress there by itself -----
// Files: hebrew-trainer-progress.json (always the latest, importable as a backup), hebrew-trainer-progress-<date>.json (one per day),
//        hebrew-trainer-test-in-progress.json (the running test, every few seconds; emptied when it is submitted).
const N23FS = { dir: null, perm: 'none', last: null, lastDraft: null, err: '', busy: false };
async function n23FsWrite(name, text) { const fh = await N23FS.dir.getFileHandle(name, { create: true }); const w = await fh.createWritable(); await w.write(text); await w.close(); }
async function n23FsRead(name) { try { const fh = await N23FS.dir.getFileHandle(name); return await (await fh.getFile()).text(); } catch { return null; } }
async function n23FsLoad() {
  if (!('showDirectoryPicker' in window)) { N23FS.perm = 'unsupported'; return; }
  try { const h = await LOCALDB.get('dir'); if (!h) return; N23FS.dir = h; N23FS.perm = await h.queryPermission({ mode: 'readwrite' }); if (N23FS.perm === 'granted') await n23FsReadDraft(); } catch (e) { console.error(e); }
}
async function n23FsChoose() {
  try { const h = await window.showDirectoryPicker({ id: 'hebrew-trainer', mode: 'readwrite', startIn: 'desktop' }); await LOCALDB.set('dir', h); N23FS.dir = h; N23FS.perm = 'granted'; await n23FsSaveAll(); n23FsRefreshUI(); }
  catch (e) { if (e && e.name !== 'AbortError') { N23FS.err = e.message || String(e); n23FsRefreshUI(); } }
}
async function n23FsReconnect() {
  try { N23FS.perm = await N23FS.dir.requestPermission({ mode: 'readwrite' }); if (N23FS.perm === 'granted') { await n23FsReadDraft(); await n23FsSaveAll(); } } catch (e) { N23FS.err = e.message || String(e); }
  n23FsRefreshUI(); if (S.tab === 'today' && !EX) renderToday();
}
async function n23FsSaveAll() {
  if (N23FS.perm !== 'granted' || !N23FS.dir || N23FS.busy) return; N23FS.busy = true;
  try { try { if (typeof flushAll === 'function') flushAll(); } catch { }
    const data = JSON.stringify({ app: 'hebrew-trainer', v: 1, exported: new Date().toISOString(), note: 'Automatic copy saved on this computer by the app. To restore: Settings → Import a backup.', docs: HET.dump() });
    await n23FsWrite('hebrew-trainer-progress.json', data); await n23FsWrite(`hebrew-trainer-progress-${dayKey()}.json`, data);
    N23FS.last = Date.now(); N23FS.err = '';
  } catch (e) { console.error(e); N23FS.err = e.message || String(e); if (/permission|not allowed/i.test(N23FS.err)) N23FS.perm = 'prompt'; }
  finally { N23FS.busy = false; n23FsRefreshUI(); }
}
function n23FileDraft(ex) {
  if (N23FS.perm !== 'granted' || !N23FS.dir) return;
  clearTimeout(N23.fileT);
  const go = async () => { try { await n23FsWrite('hebrew-trainer-test-in-progress.json', JSON.stringify({ app: 'hebrew-trainer', kind: 'test-draft', saved: new Date().toISOString(), ex: ex || null })); N23FS.lastDraft = Date.now(); } catch (e) { console.error(e); } };
  if (!ex) go(); else N23.fileT = setTimeout(go, Date.now() - (N23FS.lastDraft || 0) > 8000 ? 300 : 5000);
}
async function n23FsReadDraft() { const t = await n23FsRead('hebrew-trainer-test-in-progress.json'); try { const j = t ? JSON.parse(t) : null; N23.draftFile = j && j.ex && j.ex.phase && j.ex.phase !== 'done' ? j.ex : null; } catch { N23.draftFile = null; } }
async function n23FsRestore() {
  const t = await n23FsRead('hebrew-trainer-progress.json'); if (!t) { flash('No progress file in the folder yet.'); return; }
  try { const j = JSON.parse(t); if (!j || j.app !== 'hebrew-trainer' || !j.docs) throw new Error('not a progress file of this app'); const n = await importDocs(j.docs); flash(`Brought in ${n} records from your computer (nothing was deleted). Restarting…`); setTimeout(() => location.reload(), 1200); }
  catch (e) { flash('Could not read the file: ' + (e.message || e)); }
}
function n23FsStatusHTML(compact) {
  const t = N23FS.last ? new Date(N23FS.last).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null;
  if (N23FS.perm === 'unsupported') return compact ? '' : '<p class="small">This browser cannot write to a folder. Use Chrome or Edge on the computer, or press “Download a backup” from time to time.</p>';
  if (!N23FS.dir) return `<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><span class="small">${compact ? '<b>Save on this computer:</b> not set up.' : 'Not set up yet.'}</span><button class="btn ${compact ? 'sm' : 'primary'}" data-n23fs="choose">Choose a folder on this computer</button></div>`;
  if (N23FS.perm !== 'granted') return `<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><span class="small"><b>Save on this computer:</b> the browser needs your OK again for the folder “${esc(N23FS.dir.name)}”.</span><button class="btn sm primary" data-n23fs="reconnect">Allow saving to the folder</button></div>`;
  return `<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><span class="small"><b>Saved on this computer</b> in “${esc(N23FS.dir.name)}”${t ? ` · last copy ${t}` : ''}${N23FS.err ? ` · <span style="color:var(--bad)">${esc(N23FS.err)}</span>` : ''}</span>${compact ? '' : `<button class="btn sm" data-n23fs="save">Save a copy now</button><button class="btn sm" data-n23fs="restore">Bring back my progress from the folder</button><button class="btn sm" data-n23fs="choose">Choose another folder</button>`}</div>`;
}
function n23FsRefreshUI() { $$('.n23fs-slot').forEach(el => { el.innerHTML = n23FsStatusHTML(el.dataset.compact === '1'); }); }
(function () {
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-n23fs]'); if (!b) return; e.preventDefault(); const k = b.dataset.n23fs;
    if (k === 'choose') n23FsChoose(); else if (k === 'reconnect') n23FsReconnect(); else if (k === 'save') n23FsSaveAll(); else if (k === 'restore') n23FsRestore(); });
  const _rs = renderSettings;
  renderSettings = function () {
    const r = _rs.apply(this, arguments);
    try { const v = $('#v-settings'); if (v && !$('#n23fs-panel', v)) v.insertAdjacentHTML('afterbegin', `<div class="panel stack" id="n23fs-panel"><h2 style="margin:0">Save on this computer</h2><p class="small">Choose a folder once (suggested: <b>SEMINARY › 2026 › FALL › 20440 … › HEBREW APP DATA</b>, already created on your Desktop). The app then writes your whole progress there by itself: after every test, every few minutes, and the running test every few seconds. The files are normal backups: “Import a backup” brings them back. Nothing in the app is deleted or replaced.</p><div class="n23fs-slot"></div><p class="small muted">Chrome may ask “Allow this site to edit files?” — choose <b>Allow</b> (or “Allow on every visit”). After a browser restart it may ask once more: the Today tab shows the button.</p></div>`); n23FsRefreshUI(); } catch (e) { console.error(e); }
    return r;
  };
  const _rt = renderToday;
  renderToday = function () {
    const r = _rt.apply(this, arguments);
    try { const v = $('#v-today'); if (v && !$('#n23fs-today', v)) { v.insertAdjacentHTML('afterbegin', `<div class="panel" id="n23fs-today" style="padding:8px 12px"><div class="n23fs-slot" data-compact="1"></div></div>`); n23FsRefreshUI(); } } catch (e) { console.error(e); }
    return r;
  };
  n23FsLoad().then(() => { n23FsRefreshUI(); if (S.tab === 'today' && !EX && N23.draftFile) renderToday(); });
  setInterval(() => { if (N23FS.perm === 'granted' && document.visibilityState === 'visible' && (!N23FS.last || Date.now() - N23FS.last > 4 * 60000)) n23FsSaveAll(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') n23FsSaveAll(); });
  // A finished test is copied to the folder at once.
  const _rv = renderExamReview;
  renderExamReview = function (rec) { const r = _rv.apply(this, arguments); try { if (rec && rec.end && Date.now() - rec.end < 120000) setTimeout(() => n23FsSaveAll(), 1500); } catch { } return r; };
})();

// ----- F02: Tuesday as ONE ordered list (about 3 hours), Ruth first; no duplicated blocks -----
(function () {
  const _pl = planBlockList;
  planBlockList = function (d) {
    const B = _pl.apply(this, arguments);
    if (d !== '2026-11-24') return B;
    const did = (k, day) => (S.assess || []).some(a => a.type === k && a.end && (!day || dayKey(new Date(a.end)) === day));
    const by = id => B.find(b => b.id === id);
    const out = [];
    out.push({ id: 'rtx', min: 20, title: 'Ruth baseline 1 · 3 verses timed + 2 syntax questions (first, while fresh)', sub: 'Ruth is 42 of the 100 points and has never been measured under time. Verses outside every simulation.', act: () => startRT('rt1'), check: () => did('rt1') });
    out.push({ id: 'sqx', min: 20, title: 'Hebrew questions · round 1: understand the question first, then find the answer', sub: 'Kind of answer + English for each question (timed), then the whole story opens.', act: () => startSQ(did('sq1') ? 'sq2' : 'sq1'), check: () => did('sq1', d) || did('sq2', d) });
    const od = by('od'); if (od) out.push({ ...od, min: 12 });
    const rp1 = by('rp1'); if (rp1) out.push(rp1);
    const rts = by('rts'); if (rts) out.push({ ...rts, min: 40, title: 'Ruth translation and syntax (4–6 verses blind + syntax questions)' });
    out.push({ id: 'rtx2', min: 20, title: 'Ruth baseline 2 · 3 more verses timed + 2 syntax questions', sub: 'Compare with Baseline 1.', act: () => startRT('rt2'), check: () => did('rt2') });
    const rp2 = by('rp2'); if (rp2) out.push(rp2);
    const con = by('con'); if (con) out.push({ ...con, min: 25, title: 'Consolidation: read “How to take the final”, 10 mixed parses', sub: 'If you still have a full 140 minutes and energy, a simulation is optional — but sleep comes first.' });
    return out;
  };
})();

// ----- F03 + F04: the weekly / semester report shows the final's four parts and labels the custom index; a searchable (text) PDF can be printed -----
function n23PartsRows() {
  const A = (S.assess || []).filter(a => a.end).map(n23Rec).sort((a, b) => b.end - a.end);
  return N23_PARTS.map(([sec, label, pts]) => { const ev = A.map(a => ({ a, s: n23PartStats(a, sec) })).filter(o => o.s && o.s.answered && o.a.type !== 'weekly');
    if (!ev.length) return [label, String(pts), 'not measured', '—'];
    const o = ev[0]; return [label, String(pts), `${Math.round(o.s.acc * 100)}% on ${o.s.answered} answered of ${o.s.n}${o.s.est ? ` (${o.s.est} estimated)` : ''}`, `${(BLUEPRINTS[o.a.type] || {}).name || o.a.type}, ${dShort(o.a.end)}`]; });
}
(function () {
  try {
    const P = Report.prototype, rel = s => typeof s === 'string' ? s.replace(/\bIndependent score\b/g, 'Learning index (the app’s custom mix, not an exam score)').replace(/\bindependent score\b/g, 'learning index (custom mix)') : s;
    const pr = r => (r._pr = r._pr || []);
    const _h1 = P.h1, _h2 = P.h2, _tx = P.text, _bu = P.bullets, _tb = P.table, _ch = P.chart, _pdf = P.pdf;
    P.h1 = function (t) { pr(this).push(`<h1>${esc(rel(t))}</h1>`); return _h1.call(this, rel(t)); };
    P.h2 = function (t) {
      if (t === 'Exam trajectory' && !this._n23parts) { this._n23parts = 1;
        _h2.call(this, 'The final’s four parts (professor’s points)'); pr(this).push('<h2>The final’s four parts (professor’s points)</h2>');
        const rows = n23PartsRows(); P.table.call(this, ['Part', 'Points', 'Latest measure (answered items)', 'Source'], rows, [260, 90, 380, 350]);
        P.text.call(this, 'Each part is measured only by tests that contain it; “not measured” means no evidence yet. The learning index below is the app’s own mix of practice categories, not an exam score.', RPF.s, '#566379', 10); }
      pr(this).push(`<h2>${esc(rel(t))}</h2>`); return _h2.call(this, rel(t)); };
    P.text = function (t, ...a) { if (!this._in2 && !this._in) pr(this).push(`<p>${heWrap(esc(rel(String(t))))}</p>`); return _tx.call(this, rel(t), ...a); };
    P.bullets = function (arr) { pr(this).push('<ul>' + arr.map(t => `<li>${heWrap(esc(rel(t)))}</li>`).join('') + '</ul>'); this._in2 = 1; try { return _bu.call(this, arr.map(rel)); } finally { this._in2 = 0; } };
    P.table = function (head, rows, w) { pr(this).push('<table><tr>' + head.map(h => `<th>${esc(rel(h))}</th>`).join('') + '</tr>' + rows.map(r => '<tr>' + r.map(c => `<td>${heWrap(esc(rel(String(c ?? ''))))}</td>`).join('') + '</tr>').join('') + '</table>'); this._in2 = 1; try { return _tb.call(this, head.map(rel), rows.map(r => r.map(rel)), w); } finally { this._in2 = 0; } };
    P.chart = async function (id, caption) { try { const card = document.getElementById(id); const svg = card && card.querySelector('svg'); const ttl = card && card.querySelector('h3') ? card.querySelector('h3').textContent : ''; const sub = caption || (card && card.querySelector('p.small') ? card.querySelector('p.small').textContent : ''); if (svg) pr(this).push(`<figure><figcaption><b>${esc(rel(ttl))}</b></figcaption>${svg.outerHTML}${sub ? `<figcaption class="small">${esc(rel(sub))}</figcaption>` : ''}</figure>`); } catch { } this._in2 = 1; try { return await _ch.apply(this, arguments); } finally { this._in2 = 0; } };
    P.pdf = function () { const out = _pdf.apply(this, arguments); try { N23.lastReport = { title: this.title, html: pr(this).join('\n') }; setTimeout(() => { const st = $('#ex-st'); if (st && !$('#n23-print')) st.insertAdjacentHTML('afterend', ' <button class="btn sm" id="n23-print">Save a searchable PDF (text) of this report</button>'); }, 1500); } catch (e) { console.error(e); } return out; };
  } catch (e) { console.error(e); }
  document.addEventListener('click', e => { if (!e.target.closest || !e.target.closest('#n23-print')) return; const R = N23.lastReport; if (!R) return;
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
    const d = f.contentDocument; d.open(); d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(R.title)}</title><style>@page{margin:14mm}body{font:10.5pt/1.45 system-ui,'Segoe UI',Arial,sans-serif;color:#152238}h1{font-size:17pt;color:#1d4f8f}h2{font-size:13pt;border-bottom:1px solid #ccd;padding-bottom:2px;margin-top:16px}table{border-collapse:collapse;width:100%;margin:6px 0}td,th{border:1px solid #ccd;padding:3px 6px;font-size:9.5pt;vertical-align:top;text-align:left}th{background:#eef2f7}tr{break-inside:avoid}figure{margin:8px 0;break-inside:avoid}svg{max-width:100%;height:auto}.he{font-family:'SBL Hebrew','Ezra SIL','Noto Sans Hebrew','Segoe UI',sans-serif}.small{font-size:9pt;color:#566379}</style></head><body>${R.html}</body></html>`); d.close();
    setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (err) { flash('Printing is not available here.'); } setTimeout(() => f.remove(), 60000); }, 400);
    flash('In the print window choose “Save as PDF”: that PDF has real, searchable text.'); });
})();

// ----- F09: phone layout of Final rescue · F10: two more question forms · F11: exam conditions in story practice -----
(function () {
  try { document.head.insertAdjacentHTML('beforeend', '<style>@media (max-width:480px){.plan .step .stack{min-width:0 !important;flex:0 1 auto !important}.plan .step .stack .btn{white-space:normal !important}}</style>'); } catch { }
  const _qc = qwCat;
  qwCat = function (q) { const c = _qc.apply(this, arguments); if (c != null) return c; const cons = s => AN.normHe(s).replace(/[^א-ת]/g, ''); const T = String(q || '').split(/[\s־,]+/).filter(Boolean).map(cons);
    if (T[0] === 'במי' || T[0] === 'בעד' && T[1] === 'מי') return 0; // בְּמִי “in whom”
    if (T[0] === 'לפי' && T.includes('מה')) return 3;            // “according to X, what …?”
    const i = T.findIndex(t => ['מי', 'מה', 'למה', 'מדוע', 'איפה', 'מתי', 'כמה', 'איך'].includes(t)); return i > 0 && i < 4 ? _qc(T.slice(i).join(' ')) : null; };
  const _re = renderExam;
  renderExam = function () {
    const r = _re.apply(this, arguments);
    try { if (EX && EX.type === 'sp' && EX.phase === 'intro' && !$('#sp-nolines')) { const go = $('#ex-go'); if (go) go.parentElement.insertAdjacentHTML('beforebegin', `<label class="row small" style="gap:8px"><input type="checkbox" id="sp-nolines" ${EX.noLines ? 'checked' : ''}> Exam conditions: hide the line numbers of the questions and the highlighted answer lines (as on the final)</label>`); $('#sp-nolines').onchange = e => { EX.noLines = e.target.checked; exSave(); }; } } catch (e) { console.error(e); }
    return r;
  };
})();
