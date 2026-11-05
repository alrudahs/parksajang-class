#!/usr/bin/env node
/**
 * 배포 주소 한 번에 바꾸기
 *   node scripts/set-domain.js https://parksajang-class.vercel.app
 *
 * HTML(canonical·og 태그·JSON-LD) · sitemap.xml · robots.txt · js/config.js · scripts/build-jsonld.js 의
 * https://YOUR-DOMAIN 을 입력한 주소로 바꾸고, 바뀐 파일과 개수를 보여준다.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLACEHOLDER = 'https://YOUR-DOMAIN';
const arg = (process.argv[2] || '').trim().replace(/\/+$/, '');

if (!/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(arg)) {
  console.error('사용법: node scripts/set-domain.js https://내주소  (https 로 시작, 끝에 / 없이)');
  process.exit(1);
}

const targets = fs
  .readdirSync(ROOT)
  .filter((f) => /\.html$/.test(f))
  .concat(['sitemap.xml', 'robots.txt', 'js/config.js', 'scripts/build-jsonld.js']);

let total = 0;
for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');
  const n = src.split(PLACEHOLDER).length - 1;
  if (!n) continue;
  fs.writeFileSync(file, src.split(PLACEHOLDER).join(arg), 'utf8');
  console.log(`  ${rel}: ${n}곳`);
  total += n;
}
console.log(total ? `✅ ${total}곳을 ${arg} 로 바꿨어요.` : '바꿀 곳이 없어요 (이미 바꿨을 수 있어요).');
