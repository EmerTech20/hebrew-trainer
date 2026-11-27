const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const bank = JSON.parse(fs.readFileSync('/home/claude/rvq/bank.json', 'utf8')).items;
  const r = await p.evaluate(async bank => { await lexLoad();
    const occ = {}; const strip = s => fvKey(s);
    for (const c of ['1','2','3','4']) for (const row of RUTH.verses[c]) { const V = twVerseWords(+c, +row[0]); if (!V) continue;
      for (const x of V.words) for (const f of new Set([x.w, x.o])) { const k = strip(f); (occ[k] = occ[k] || []).push({ ref: c + ':' + row[0], w: x.w, o: x.o, ps: x.ps.map(q => ({ stem: q.stem, conj: q.conj, pgn: q.pgn, root: q.root })), lemma: x.a && x.a.lemma, gram: x.a && x.a.grammar, mean: x.a && twMeaning(x), en: x.en }); } }
    // exact pointed occurrences too
    return bank.map(it => { const k = strip(it.hebrew); const o = occ[k] || []; let a = null; try { a = analyzeWord(it.hebrew); } catch { }
      let ps = []; try { ps = (lexParses(it.hebrew) || []).filter(q => q.conj).map(q => ({ stem: q.stem, conj: q.conj, pgn: q.pgn, root: q.root })); } catch { }
      return { id: it.id, he: it.hebrew, ref: it.reference, key: k, occ: o.map(x => x.ref), occAll: o, exactPointed: o.some(x => x.w.normalize('NFC') === it.hebrew.normalize('NFC') || x.o.normalize('NFC') === it.hebrew.normalize('NFC')), ps: o[0] ? o[0].ps : ps, lexps: ps, lemma: a && a.lemma, gram: a && a.grammar, mean: a && a.meaning, inRuthW: o[0] && o[0].w };
    }); }, bank);
  fs.writeFileSync('/home/claude/rvq/qa_raw.json', JSON.stringify(r, null, 1)); console.log('done', r.length, errs.slice(0, 3)); await b.close(); })();
