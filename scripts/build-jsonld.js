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

// FAQ 개수 (2026-11-15 피드백 2차로 5 → 6개: "홀 매장이나 카페도 이용할 수 있나요?" 추가)
const FAQ_COUNT = 6;
if (items.length !== FAQ_COUNT) {
  console.error(`FAQ 를 ${FAQ_COUNT}개 찾아야 하는데 ${items.length}개를 찾았어요. index.html 의 FAQ 구조를 확인해 주세요.`);
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

// sameAs: 실제로 있는 공식 계정 주소만. 인스타그램·카카오톡 채널은 아직 개설 전(가상 주소)이라
// 2026-11-15 지인 3차 피드백으로 뺐다. 계정을 만들면 여기에 실제 주소를 넣고 다시 실행한다
const SAME_AS = [];
const org = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '박사장 클라쓰',
  description: '박사장 클라쓰는 초보 사장님을 위한 오픈·운영 템플릿·코칭 브랜드입니다',
  url: SITE + '/',
  founder: { '@type': 'Person', name: '박미경', jobTitle: '대표' },
};
if (SAME_AS.length) org.sameAs = SAME_AS;

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
