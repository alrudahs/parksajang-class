#!/usr/bin/env node
/**
 * 경로 A 자동 시연 캡처 (?debug=1 이벤트 로그 상자가 보이는 상태)
 *
 *   node scripts/capture-path-a.js [단계번호=07]
 *
 * 랜딩 → (CTA 클릭) 체크리스트 신청 → (신청) 신청 완료 → (다운로드) → (템플릿 보러 가기) 템플릿 상세
 *  → (구매하기) 주문서 → (결제하기 데모) 구매 완료
 * 각 화면을 모바일·데스크톱 전체 화면으로 찍어 captures/<단계>-<페이지>-mobile|desktop.png 에 저장하고
 * captures/README.md 에 기록한다. 오른쪽 아래 로그 상자에 그 화면까지 나간 이벤트가 순서대로 보인다.
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
const { ROOT, OUT_DIR, VIEWPORTS, prepare, appendReadme, today } = require('./capture');

const step = process.argv[2] || '07';
const url = (file) => pathToFileURL(path.join(ROOT, file)).href;

// 화면마다: 이름, 설명, 이 화면에서 할 행동(캡처 뒤 다음 화면으로 넘어가는 동작)
const SCREENS = [
  {
    name: 'index',
    desc: '① 랜딩 — 실험 그룹 exp_headline=a 기록 (다음: 히어로 CTA 클릭)',
    next: async (p) => {
      await p.click('[data-cta=hero]');
      await p.waitForURL(/checklist\.html/);
    },
  },
  {
    name: 'checklist',
    desc: '② 신청 폼 — click_cta(button_position: hero) 기록 (다음: 이름·연락처 입력 후 신청)',
    next: async (p) => {
      await p.fill('#f-name', '시연사장');
      await p.fill('#f-contact', 'demo@example.com');
      await p.check('input[name=marketing]');
      await p.click('#lead-form button[type=submit]');
      await p.waitForURL(/checklist-done\.html/);
    },
  },
  {
    name: 'checklist-done',
    desc: '③ 신청 완료 — generate_lead(checklist) + 체크리스트 다운로드 클릭 → file_download (다음: 템플릿 보러 가기)',
    before: async (p) => {
      await Promise.all([p.waitForEvent('download'), p.click('a[download]')]);
    },
    next: async (p) => {
      await p.click('text=템플릿 보러 가기');
      await p.waitForURL(/template\.html/);
    },
  },
  {
    name: 'template',
    desc: '④ 템플릿 상세 — view_item(매장 운영 템플릿, 14900) (다음: 구매하기)',
    next: async (p) => {
      await p.click('text=구매하기');
      await p.waitForURL(/checkout\.html/);
    },
  },
  {
    name: 'checkout',
    desc: '⑤ 주문서 — begin_checkout(14900, discount_applied: true) (다음: 결제하기 데모)',
    next: async (p) => {
      await p.click('text=결제하기 (데모)');
      await p.waitForURL(/order-complete\.html/);
    },
  },
  {
    name: 'order-complete',
    desc: '⑥ 구매 완료 — purchase(transaction_id: DEMO-…, 14900)',
  },
];

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const saved = [];
  const rows = [];
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.deviceScaleFactor,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        locale: 'ko-KR',
        reducedMotion: 'reduce',
        acceptDownloads: true,
      });
      const p = await ctx.newPage();
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));

      await p.goto(url('index.html') + '?debug=1');
      for (const s of SCREENS) {
        await p.waitForSelector('#psc-debug');
        if (s.before) await s.before(p);
        await prepare(p);
        // 전체 화면 캡처에서는 고정 상자가 첫 화면 높이에 찍혀 본문을 가리므로,
        // 캡처 순간만 로그를 전부 펼쳐 페이지 맨 아래(푸터 밑 여백)에 놓는다
        await p.evaluate(() => {
          const box = document.getElementById('psc-debug');
          const list = box.querySelector('.debug-list');
          list.style.maxHeight = 'none';
          document.body.style.paddingBottom = box.offsetHeight + 24 + 'px';
          box.style.position = 'absolute';
          box.style.bottom = 'auto';
          box.style.top = document.documentElement.scrollHeight - box.offsetHeight - 12 + 'px';
        });
        const file = `${step}-${s.name}-${vp.label}.png`;
        await p.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
        saved.push(file);
        rows.push(`| ${today()} | \`${file}\` | ${s.desc} (${vp.label} · ?debug=1) |`);
        if (s.next) await s.next(p);
      }
      if (errors.length) console.warn(`  ⚠ ${vp.label} 스크립트 오류: ${errors.join(' / ')}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  appendReadme(step, rows);
  console.log(`\n✅ 경로 A 자동 시연 ${saved.length}장 저장 (captures/)`);
  saved.forEach((f) => console.log(`  - captures/${f}`));
  console.log('  - captures/README.md 기록 추가\n');
})().catch((err) => {
  console.error('캡처 실패:', err.message);
  process.exit(1);
});
