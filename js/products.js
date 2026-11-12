/*
 * 박사장 클라쓰 · 상품명 · 가격 (docs/landing-content.md 4장 ③ 기준)
 * 주문서 · 상세 · 완료 화면은 이 파일만 본다. 가격을 바꾸면 index.html 가격표도 같이 고친다.
 */
window.PSC_PRODUCTS = {
  template: {
    id: 'template',
    name: '매장 운영 템플릿',
    price: 19900,
    salePrice: 14900, // 체크리스트 신청 후 3일 한정
    includes: ['D-30 오픈 체크리스트', '매출 입력 시트', '주재료 재고·발주 시트', '위생 점검표', '요일별 청소 스케줄', '알바 면접 질문지·교육 순서'],
    detailUrl: 'template.html',
    download: { url: 'files/template-sample.pdf', label: '템플릿 다운로드' },
    liveInvite: true, // 구매 완료 화면에 "무료 Zoom 라이브 우선 초대"
  },
  kit: {
    id: 'kit',
    name: '오픈 올인원 키트',
    price: 69000,
    upgradePrice: 49100, // 템플릿 구매자 60일 안 업그레이드 (안내 문구로만 · 주문서 금액은 정가)
    // 키트 구성 (2026-11-12 통일): 공식 위생 교육 자료는 공공기관 자료 안내 · 박사장 클라쓰 제작 아님
    includes: ['매장 운영 템플릿 6종', '오픈 후 30일 운영 가이드', '공식 위생 교육 자료 안내'],
    detailUrl: 'kit.html',
    // 구매 완료 화면 다운로드 2개 (2026-11-12)
    downloads: [
      { url: 'files/template-sample.pdf', label: '매장 운영 템플릿 (7쪽)' },
      { url: 'files/kit-30day-guide.pdf', label: '오픈 후 30일 운영 가이드 (6쪽)' },
    ],
    downloadNote: '구매하신 키트 자료는 아래 버튼으로 바로 받을 수 있어요. 둘 다 데모 버전이에요.',
  },
  coaching: {
    id: 'coaching',
    name: '1:1 Zoom 코칭',
    price: 200000,
    detailUrl: 'coaching.html?type=open',
  },
  premium: {
    id: 'premium',
    name: '프리미엄 1주 집중 현장 컨설팅',
    price: 4500000,
    vatExcluded: true,
    detailUrl: 'coaching.html?type=operate',
  },
};
