const { chromium } = require('playwright');
const A = '/mnt/user-data/attachments/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/';
const PJ = '/tmp/claude-0/-home-claude/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/scratchpad/pdfjs/node_modules/pdfjs-dist/build/';
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 200)); });
  await p.route('**/fonts.googleapis.com/**', r => r.abort());
  await p.route('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/**', r => r.fulfill({ path: PJ + r.request().url().split('/').pop(), contentType: 'application/javascript' }));
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const run = async (files, title, kind) => {
    await p.evaluate(() => go('library')); await p.waitForTimeout(1000);
    const before = await p.evaluate(() => S.lib.length);
    await p.setInputFiles('#up-file', files.map(f => A + f)); await p.waitForTimeout(300);
    if (title) await p.fill('#up-title', title);
    await p.check(`input[name="up-p"][value="${kind}"]`);
    await p.click('#up-go');
    for (let t = 0; t < 60; t++) { await p.waitForTimeout(2000); const st = await p.evaluate(() => (document.getElementById('up-status') || {}).textContent || ''); if (/added|Nothing|error|fail|could not/i.test(st) && !/Reading/i.test(st)) break; }
    const st = await p.evaluate(() => (document.getElementById('up-status') || {}).textContent || '');
    console.log(kind, files.length, 'files → lib', before, '→', await p.evaluate(() => S.lib.length), '| status:', st.slice(0, 300));
  };
  
  
  await run(['a2ea2498-Biblical_Hebrew_S17_Closed_2026-11-16.pdf'], '', 'insight');
  console.log(await p.evaluate(() => S.lib.map(l => l.kind + ':' + l.title).join(' | ')));
  console.log(errs.slice(0, 15).join('\n') || 'NO ERRORS'); await b.close(); })();
