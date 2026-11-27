const { chromium } = require('playwright'); const fs = require('fs');
const A = '/mnt/user-data/attachments/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/';
const JOBS = [
  { f: 'c2906e6b-Chapter_22_David_and_Jonathan.pdf', id: 'c-ch22', title: 'Chapter 22 (David and Jonathan)', p: 'studied', kind: 'story', chapter: 22 },
  { f: '2534b542-Ruth_1.pdf', id: 'c-ruth1', title: 'Ruth 1 (course text with glosses)', p: 'studied', kind: 'story', chapter: null, ruth: 1 },
  { f: '688ea1f0-Ruth_2.pdf', id: 'c-ruth2', title: 'Ruth 2 (course text with glosses)', p: 'studied', kind: 'story', chapter: null, ruth: 2 },
  { f: '927891a8-Ruth_3.pdf', id: 'c-ruth3', title: 'Ruth 3 (course text with glosses)', p: 'studied', kind: 'story', chapter: null, ruth: 3 },
  { f: '75dc793f-RUTH_.pdf', id: 'c-ruthgh', title: 'Ruth (GlossaHouse reader)', p: 'ref', kind: 'reference', chapter: null },
  { f: '996ea0ac-Building_Your_Biblical_Hebrew_Vocabulary_Learning_Words_by_Frequency_and_Cognate_George_M._Landes.pdf', id: 'c-landes', title: 'Landes, Building Your Biblical Hebrew Vocabulary', p: 'ref', kind: 'reference', chapter: null },
  { f: '2fb45268-Hebrew_for_Life_-_Howell_Adam_J.Merkle_Benjami.pdf', id: 'c-hfl', title: 'Hebrew for Life (Howell & Merkle)', p: 'ref', kind: 'reference', chapter: null },
];
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); const PJ = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/pdfjs/node_modules/pdfjs-dist/build/'; await p.route('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/**', r => r.fulfill({ path: PJ + r.request().url().split('/').pop(), contentType: 'application/javascript' })); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const docs = {};
  for (const j of JOBS) {
    await p.evaluate(() => go('library')); await p.waitForTimeout(1200);
    const before = await p.evaluate(() => S.lib.map(l => l.id));
    await p.setInputFiles('#up-file', A + j.f); await p.waitForTimeout(300);
    await p.fill('#up-title', j.title); await p.check(`input[name="up-p"][value="${j.p}"]`);
    await p.click('#up-go');
    await p.waitForFunction(b => S.lib.length > b, before.length, { timeout: 160000 }).catch(() => {});
    await p.waitForTimeout(800);
    const out = await p.evaluate(async ([before, j]) => {
      const nw = S.lib.find(l => !before.includes(l.id)); if (!nw) return { err: document.getElementById('up-status').textContent + ' ' + (document.querySelector('#up-panel').innerText.slice(0, 300)) };
      const o = {}; const m = (await S.db.doc('libmeta/' + nw.id).get()).data();
      o['libmeta/' + j.id] = { ...m, title: j.title, kind: j.kind, chapter: j.chapter, ...(j.ruth ? { ruth: j.ruth } : {}) };
      const d = (await S.db.doc('library/' + nw.id).get()).data(); o['library/' + j.id] = d;
      for (let k = 2; k <= (d.parts || 1); k++) { const s = await S.db.doc('library/' + nw.id + '~' + k).get(); if (s.exists) o['library/' + j.id + '~' + k] = s.data(); }
      return { o, len: (d.text || '').length, parts: d.parts || 1, sample: (d.text || '').slice(0, 160) };
    }, [before, j]);
    if (out.err) { console.log(j.id, 'ERR', out.err); continue; }
    console.log(j.id, 'chars', out.len, 'parts', out.parts, JSON.stringify(out.sample).slice(0, 170));
    Object.assign(docs, out.o);
  }
  fs.writeFileSync('/home/claude/build2/libdocs.json', JSON.stringify(docs));
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
