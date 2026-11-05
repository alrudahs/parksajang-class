#!/usr/bin/env node
/**
 * 박사장 클라쓰 · 페이지 캡처 도구 (Playwright)
 *
 * 사용법:
 *   node scripts/capture.js <단계번호> <페이지1.html> [페이지2.html ...] [--desc "한 줄 설명"]
 *
 * 예:
 *   node scripts/capture.js 02 index.html
 *   node scripts/capture.js 02 "index.html?v=b"            → 02-index-b-mobile.png
 *   node scripts/capture.js 04 "diagnosis-result.html?demo=low"  → 04-diagnosis-result-low-*.png
 *   node scripts/capture.js 03 checklist.html --desc "경로 A 신청 폼"
 *
 * - 서버 없이 로컬 파일(file://)을 바로 연다.
 * - 페이지마다 모바일(375×812)·데스크톱(1440×900) 전체 화면을 captures/ 에 저장한다.
 * - 파일 이름: <단계번호>-<페이지이름>[-쿼리값]-mobile.png / -desktop.png
 * - 캡처할 때마다 captures/README.md 에 날짜 · 파일 이름 · 한 줄 설명을 추가한다.
 *   (--desc 가 없으면 페이지 <title> 을 설명으로 쓴다)
 * - 쿼리의 debug=1 은 파일 이름에 넣지 않는다.
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright가 설치되어 있지 않아요. 먼저 실행하세요:\n  npm install -D playwright\n  npx playwright install chromium');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'captures');
const README = path.join(OUT_DIR, 'README.md');

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { label: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];

function parseArgs(argv) {
  const args = [...argv];
  let desc = null;
  const di = args.indexOf('--desc');
  if (di !== -1) {
    desc = args[di + 1] || null;
    args.splice(di, 2);
  }
  const [step, ...pages] = args;
  return { step, pages, desc };
}

function usage(msg) {
  if (msg) console.error(`\n⚠ ${msg}`);
  console.error('\n사용법: node scripts/capture.js <단계번호> <페이지1.html> [페이지2.html ...] [--desc "한 줄 설명"]');
  console.error('예:     node scripts/capture.js 02 index.html "index.html?v=b"\n');
  process.exit(1);
}

/** "diagnosis-result.html?demo=low&debug=1" → { file, query, name: "diagnosis-result-low" } */
function resolvePage(input) {
  const [filePart, query = ''] = input.split('?');
  const file = path.resolve(ROOT, filePart);
  const base = path.basename(filePart).replace(/\.html?$/i, '');
  const params = new URLSearchParams(query);
  const suffix = [];
  for (const [key, value] of params) {
    if (key === 'debug') continue;
    suffix.push((value || key).toLowerCase().replace(/[^a-z0-9가-힣_-]+/gi, '-'));
  }
  const name = [base, ...suffix].join('-');
  return { input, file, query, name };
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function appendReadme(step, rows) {
  if (!fs.existsSync(README)) {
    fs.writeFileSync(
      README,
      '# 박사장 클라쓰 · 캡처 기록\n\n' +
        '`node scripts/capture.js` 로 찍은 화면이 단계별로 쌓입니다. 모바일 375×812 · 데스크톱 1440×900 · 전체 화면.\n',
      'utf8'
    );
  }
  // 같은 파일을 다시 찍으면 예전 기록 줄은 지우고 새 줄로 바꾼다
  const names = rows.map((r) => (r.match(/`([^`]+\.png)`/) || [])[1]).filter(Boolean);
  const current = fs
    .readFileSync(README, 'utf8')
    .split('\n')
    .filter((line) => !names.some((n) => line.startsWith('| ') && line.includes(`\`${n}\``)))
    .join('\n');
  fs.writeFileSync(README, current, 'utf8');
  const heading = `## 단계 ${step}`;
  let text = '';
  if (!current.includes(`\n${heading}\n`)) {
    text += `\n${heading}\n\n| 날짜 | 파일 | 설명 |\n|---|---|---|\n`;
    text += rows.join('\n') + '\n';
    fs.appendFileSync(README, text, 'utf8');
    return;
  }
  // 같은 단계 표가 이미 있으면 그 표의 끝에 행을 끼워 넣는다
  const lines = current.split('\n');
  const start = lines.indexOf(heading);
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith('## ')) end++;
  let insertAt = end;
  while (insertAt > start && lines[insertAt - 1].trim() === '') insertAt--;
  lines.splice(insertAt, 0, ...rows);
  fs.writeFileSync(README, lines.join('\n'), 'utf8');
}

async function main() {
  const { step, pages, desc } = parseArgs(process.argv.slice(2));
  if (!step || !/^[0-9]+[a-z]?$/i.test(step)) usage('단계번호를 먼저 적어주세요 (예: 02, 05b).');
  if (pages.length === 0) usage('캡처할 페이지를 하나 이상 적어주세요.');

  const targets = pages.map(resolvePage);
  const missing = targets.filter((t) => !fs.existsSync(t.file));
  if (missing.length) usage(`파일을 찾을 수 없어요: ${missing.map((m) => m.input).join(', ')}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const saved = [];
  const readmeRows = [];

  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        locale: 'ko-KR',
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));

      for (const t of targets) {
        const url = pathToFileURL(t.file).href + (t.query ? `?${t.query}` : '');
        await page.goto(url, { waitUntil: 'load' });
        await prepare(page);

        const fileName = `${step}-${t.name}-${vp.label}.png`;
        await page.screenshot({ path: path.join(OUT_DIR, fileName), fullPage: true });
        saved.push(fileName);

        const title = (await page.title()) || t.input;
        const line = desc || title;
        readmeRows.push(`| ${today()} | \`${fileName}\` | ${line.replace(/\|/g, '\\|')} (${vp.label} · ${t.input}) |`);
        if (errors.length) {
          console.warn(`  ⚠ ${t.input} (${vp.label}) 스크립트 오류: ${errors.join(' / ')}`);
          errors.length = 0;
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  appendReadme(step, readmeRows);

  console.log(`\n✅ ${saved.length}장 저장 (captures/)`);
  saved.forEach((f) => console.log(`  - captures/${f}`));
  console.log('  - captures/README.md 기록 추가\n');
}

/** 캡처 직전 준비: 폰트·지연 로딩 이미지 기다리기, sticky 헤더 고정 풀기 */
async function prepare(page) {
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => {});
  // 지연 로딩 이미지가 있으면 끝까지 스크롤해서 불러온 뒤 맨 위로
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 200));
    window.scrollTo(0, 0);
  });
  // 전체 화면 캡처에서 sticky 헤더가 중간에 찍히지 않게, 캡처 순간만 제자리에 고정
  await page.evaluate(() => {
    document.querySelectorAll('body *').forEach((el) => {
      if (getComputedStyle(el).position === 'sticky') el.style.setProperty('position', 'relative', 'important');
    });
  });
  await page.waitForTimeout(200);
}

// 다른 캡처 스크립트(capture-path-a.js 등)에서 같이 쓰는 도구
module.exports = { ROOT, OUT_DIR, VIEWPORTS, prepare, appendReadme, today };

if (require.main === module) {
  main().catch((err) => {
    console.error('캡처 실패:', err.message);
    process.exit(1);
  });
}
