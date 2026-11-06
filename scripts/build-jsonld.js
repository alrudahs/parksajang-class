#!/usr/bin/env node
/**
 * index.html 의 FAQ(화면 문구)를 그대로 읽어 FAQPage + Organization JSON-LD 를 만들어
 * <!--JSONLD:START--> ~ <!--JSONLD:END--> 사이에 넣는다.
 * FAQ 문구를 고친 뒤 다시 실행하면 구조화 데이터도 같이 맞춰진다.
 *
 * 사용법: node scripts/build-jsonld.js
 */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', 'index.html');
const SITE = 'https://parksajang-class.vercel.app'; // set-domain.js 가 이 값도 함께 바꾼다

const html = fs.readFileSync(FILE, 'utf8');

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const items = [];
const re = /<details class="faq-item">[\s\S]*?<span class="text">([\s\S]*?)<\/span>[\s\S]*?<div class="faq-a">([\s\S]*?)<\/div>[\s\S]*?<\/details>/g;
let m;
while ((m = re.exec(html))) items.push({ q: decode(m[1]), a: decode(m[2]) });

if (items.length !== 5) {
  console.error(`FAQ 를 5개 찾아야 하는데 ${items.length}개를 찾았어요. index.html 의 FAQ 구조를 확인해 주세요.`);
  process.exit(1);
}

const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: { '@type': 'Answer', text: it.a },
  })),
};

// 채널 URL 은 js/config.js 와 같은 가상 주소 (계정 개설 후 둘 다 교체)
const org = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '박사장 클라쓰',
  description: '박사장 클라쓰는 초보 사장님을 위한 오픈·운영 템플릿·코칭 브랜드입니다',
  url: SITE + '/',
  founder: { '@type': 'Person', name: '박미경', jobTitle: '대표' },
  sameAs: ['https://www.instagram.com/parksajang_class', 'https://pf.kakao.com/_parksajangclass'],
};

const block = (obj) =>
  '  <script type="application/ld+json">\n' +
  JSON.stringify(obj, null, 2)
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n') +
  '\n  </script>';

const out = html.replace(
  /<!--JSONLD:START-->[\s\S]*?<!--JSONLD:END-->/,
  '<!--JSONLD:START-->\n' + block(faq) + '\n' + block(org) + '\n  <!--JSONLD:END-->'
);
if (out === html && !html.includes('<!--JSONLD:START-->')) {
  console.error('index.html 에 <!--JSONLD:START--> 표시가 없어요.');
  process.exit(1);
}
fs.writeFileSync(FILE, out, 'utf8');
console.log(`✅ FAQPage(질문 ${items.length}개) + Organization JSON-LD 를 index.html 에 넣었어요.`);
