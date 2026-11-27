const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext()).newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.route('**/fonts.googleapis.com/**', r => r.abort()); await p.goto('http://localhost:8765/'); await p.waitForTimeout(2500);
  const A = '/mnt/user-data/attachments/9b0fbc78-92a0-5fc3-9ae8-eef744f87afd/';
  const r = await p.evaluate(async ts => { await lexLoad(); const out = []; for (const t of ts) { const v = validateTutorReport(JSON.parse(t)); v.ins.parse.forEach(x => out.push(`${x.form} ${x.stem} ${x.conj} ${x.pgn} ver=${x.verified} ${x.lexNote || x.check || ''}`)); }
    out.push('AN: ' + ['אֲלַקֳטָה','הַשָּׁבָה','הַנִּצָּב','הֵיטַבְתְּ','וַיִּלָּפֵת','בָּא','וְהָלַכְתִּ','וְצָמִת','יִיטַב','וַיָּמָד','וַתֹּאחֶז'].map(w => { const a = analyzeWord(w); return w + '=' + (a ? a.grammar + ' / ' + a.lemma + ' / ' + (a.how||'') : '-'); }).join('\n'));
    return out; }, [fs.readFileSync(A + 'f57b0f20-Biblical_Hebrew_S13_Ruth2_Classroom_2026-11-05_FINAL.json', 'utf8'), fs.readFileSync(A + 'd0adea83-Biblical_Hebrew_S15_Ruth3_Classroom_2026-11-12.json', 'utf8')]);
  console.log(r.join('\n')); await b.close(); })();
