const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage();
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => {
    const T = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    const pool = []; const seen = new Set();
    const add = (form, root, stem, conj, pgn) => { if (!form || seen.has(form)) return; seen.add(form); pool.push({ form, root, stem, conj, pgn }); };
    (RUTH.verbs || []).forEach(v => add(v[0], v[1], v[2], v[3], v[4]));
    (typeof PBANK !== 'undefined' && PBANK.parse ? PBANK.parse : []).forEach(v => add(v.form || v[0], v.root || v[1], v.stem || v[2], v.conj || v[3], v.pgn || v[4]));
    const odd = [];
    for (const it of pool) { const h = parseAnswerHTML(it); const r = (h.match(/How to tell:<\/b>(.*?)<\/div><\/td>/s) || [])[1] || ''; const t = T(r); if (/absorbed \(look|Left: [^—]*— only 0|Left: <b class="he"><\/b>/.test(r) || /only 1 letter/.test(t)) odd.push(it.form + ' ' + it.root + ' ' + it.stem + ' ' + it.conj + ' :: ' + t.slice(0, 200)); }
    return pool.length + ' checked; odd: ' + odd.length + '\n' + odd.slice(0, 25).join('\n');
  }));
  await b.close(); })();
