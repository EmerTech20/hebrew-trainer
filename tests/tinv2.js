const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(async () => { await lexLoad(); const g = n => { try { const x = eval(n); return Array.isArray(x) ? x.length : x && typeof x === 'object' ? Object.keys(x).length : String(x).slice(0, 60); } catch (e) { return 'n/a'; } };
    const names = ['PRACTICE_VERBS', 'PBANK.verses', 'PBANK.verbs', 'COMPQ', 'WORD_OVR', 'window.LEX_L', 'window.LEX_F', 'SUFFIX_BANK', 'LOOKALIKE', 'LA_ITEMS', 'PATTERN_Q', 'PQ', 'WP_MC', 'REVIEW20', 'HITH_SLIDES', 'REVIEW_SLIDES', 'DG1', 'OD_EXPLAIN', 'RP_DEF.rp1', 'RP_DEF.rp2', 'STEM_EN', 'PCARDS', 'RX_LESSONS', 'RX', 'LESSONS', 'TRANS', 'TR_ITEMS', 'TERMS', 'VOCAB', 'RUTH.vocab', 'RUTH.verbs', 'RUTH_EN', 'TOPICS', 'MCQ', 'PARSE_BANK', 'COURSE_START', 'SCHEDULE', 'CONCEPTS', 'ACCENT_Q', 'ACC', 'DQ1', 'DG1G', 'SQ_SETS', 'RT_DEF', 'FS_KEYS', 'STORY_CHS', 'RUTH_CHUNK', 'RUTH6'];
    return names.map(n => n + '=' + g(n)).join('\n') + '\nlexicon forms index: ' + (lexIndex() ? lexIndex().size : 'n/a') + '\nDECKS.patterns: ' + (DECKS.patterns ? DECKS.patterns.cards().length : 'n/a'); }));
  await b.close(); })();
