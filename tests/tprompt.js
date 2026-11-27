const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(async () => { try { await lexLoad(); } catch {}
    const txt = 'Here is the report:\n```json\n' + JSON.stringify({ schema: 'het-tutor-report-v1', date: '2026-11-04', tutor: 'ChatGPT', session: 'S12', period: 'Nov 4', summary: 'Ruth 2:1-7.', checkpoint: 'Ruth 2:7', strengths: 'x',
      cold_check: [{ he: 'וַתֵּלֶךְ', task: 'parse', answer: 'Qal wayyiqtol 3fs הלך', key: 'Qal wayyiqtol 3fs הלך', correct: 1, seconds: 48, cold: true }, { he: 'גַּם', task: 'vocab', answer: 'both', key: 'also', correct: 0, seconds: 9, cold: true }],
      weak_points: [{ area: 'suffix', detail: 'לִי as her', evidence: 'her' }], parse_items: [{ form: 'וַתֵּלֶךְ', root: 'הלך', stem: 'qal', conj: 'wayyiqtol', pgn: '3fs', gloss: 'and she went', explanation: 'וַ + doubled תּ' }],
      suffix_items: [], mc_items: [], drills: [{ id: 'D1', prompt: 'Meaning of גַּם?', key: 'also, even' }], open_items: ['Ruth 2:8 not reached'], recommendations: ['x'] }) + '\n```';
    const js = findTutorJSON(txt); const vr = validateTutorReport(js, 'test'); return { ok: !!js, rej: vr.rejected, cold: vr.ins.cold, drills: vr.ins.drills.length, parse: vr.ins.parse.map(x => x.verified), open: vr.ins.open, session: vr.ins.session, promptStart: TUTOR_PROMPT.slice(0, 80) }; });
  console.log(JSON.stringify(r)); console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
