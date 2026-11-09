/*
 * 박사장 클라쓰 · 바꿀 값은 이 파일 한 곳에서만 고친다.
 */
window.PSC_CONFIG = {
  // Google Tag Manager 컨테이너 ID (GTM 만든 뒤 교체)
  gtmId: 'GTM-N4L8G2LB',

  // GA4 측정 ID (기록용 — 사이트 코드에서 쓰지 않고 GTM 안에서만 사용)
  ga4MeasurementId: 'G-8FTGPCLPTM',

  // 배포 주소 (Vercel 배포 후 교체 — sitemap.xml · robots.txt · JSON-LD · og 태그도 같이)
  siteUrl: 'https://parksajang-class.vercel.app',

  // 공식 채널 — 실제 계정 개설 전이라 가상 주소.
  // virtual: true 이면 화면에서 링크를 걸지 않고 "(예정)" 텍스트로만 보여준다.
  // 계정을 만들면 url 을 고치고 virtual: false 로 바꾸면 링크가 켜진다.
  channels: {
    instagram: { label: '인스타그램 @parksajang_class', url: 'https://www.instagram.com/parksajang_class', virtual: true },
    kakao: { label: "카카오톡 채널 '박사장 클라쓰'", url: 'https://pf.kakao.com/_parksajangclass', virtual: true },
  },

  // 만족도 설문 → 구글폼 전송 (비어 있으면 이벤트만 보내고 폼 전송은 건너뜀)
  surveyForm: {
    action: '', // 예: https://docs.google.com/forms/d/e/폼ID/formResponse
    entries: { surveyType: '', satisfaction: '', recommend: '' }, // 예: 'entry.123456'
  },

  // A/B 테스트 — false: 고정(헤드라인 A안, 완료 화면 배너 on) / true: 방문자별 무작위 50:50
  // 주소의 ?v=a|b, ?offer=on|off 가 항상 우선한다.
  abTest: { enabled: true },
};
