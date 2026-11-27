# Automated browser tests

Playwright scripts used to check the app (Oct–Nov 2026). They run the app from a local web server and
check behaviour in headless Chromium.

- Start the server: `bash tests/srv.sh` (serves the repository on http://localhost:8765).
- Run one test: `NODE_PATH=$(npm root -g) node tests/<name>.js`.
- Some tests import the **private update files** (class stories, quizzes, the Ruth word list) from paths on
  the developer's machine. Those files are not in this public repository; such tests stop or skip those parts
  without them.
- Key tests: `tchk3.js` (every Ruth word-by-word key scores 6/6), `tfullaudit.js` (all answer keys),
  `trvq4.js` (Ruth word cards, three faces), `tquick.js` (all tabs open without page errors),
  `tnov27.js` (the fixes of Nov 27).
