const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 900, height: 1100 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const r = await p.evaluate(async () => {
    const mk = (name, txt, mod) => { const f = new File([txt], name, { type: 'text/plain', lastModified: mod }); return { kind: 'file', getFile: async () => f }; };
    const sub = { kind: 'directory', entries: async function* () { yield ['Ruth 3 notes.txt', mk('Ruth 3 notes.txt', 'Ruth 3 class notes אֵלֵךְ', 1000)]; yield ['.hidden.txt', mk('.hidden.txt', 'x', 1)]; } };
    const root = { name: 'Hebrew course', kind: 'directory', queryPermission: async () => 'granted', requestPermission: async () => 'granted', entries: async function* () { yield ['Week 10', sub]; yield ['Main vocabulary list (final exam).txt', mk('Main vocabulary list (final exam).txt', 'vocab', 2000)]; yield ['photo.jpg', mk('photo.jpg', 'x', 3)]; } };
    FOLDER.handle = root; await fsScan(); const a = FOLDER.list.map(x => x.path + ':' + x.status);
    go('library'); await new Promise(r => setTimeout(r, 300));
    document.getElementById('fold-use').click(); const names = UP.files.map(f => f.name);
    document.querySelector('input[name="up-p"][value="studied"]').checked = true;
    await doUpload(); await new Promise(r => setTimeout(r, 300));
    await fsScan(); const b2 = FOLDER.list.map(x => x.path + ':' + x.status);
    return { a, names, b2, msg: FOLDER.msg, lib: S.lib.slice(-1).map(l => l.title) };
  });
  console.log(JSON.stringify(r, null, 1)); console.log(errs.join('\n') || 'NO ERRORS'); await b.close(); })();
