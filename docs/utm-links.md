# 박사장 클라쓰 · 채널별 UTM 링크

- 배포 주소: `https://parksajang-class.vercel.app`
- UTM 값: `docs/landing-content.md` 8장 표 그대로 (모두 소문자)
- 첫 방문 때 주소의 UTM이 저장되고(`sessionStorage`), 이후 페이지 이벤트에서 다시 쓰입니다. 예를 들어 `start_diagnosis` 의 `source` 값이 이 링크의 `utm_source` 가 됩니다.
- 도착 페이지는 `landing-content.md` 5장의 서비스 경로(A·B·C)에 맞춰 골랐습니다.

## 완성 링크 5개

| # | 채널 | 경로 | 도착 페이지 | 완성 링크 |
|---|---|---|---|---|
| 1 | 인스타그램 | A | 랜딩 | `https://parksajang-class.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=open_checklist` |
| 2 | 자영업 커뮤니티 | B | 랜딩 (히어로에 진단 버튼 우선) | `https://parksajang-class.vercel.app/?utm_source=naver_cafe&utm_medium=community&utm_campaign=diagnosis` |
| 3 | 네이버 블로그 | 랜딩 FAQ | 랜딩 (FAQ 위치) | `https://parksajang-class.vercel.app/?utm_source=naver_blog&utm_medium=content&utm_campaign=faq_open_prep#faq-title` |
| 4 | **박람회 QR** | A | 체크리스트 신청 | `https://parksajang-class.vercel.app/checklist.html?utm_source=expo&utm_medium=offline&utm_campaign=startup_fair_2026` |
| 5 | CRM 카카오톡 | C | 무료 Zoom 라이브 신청 | `https://parksajang-class.vercel.app/live.html?utm_source=kakao&utm_medium=crm&utm_campaign=welcome_d3` |

## 값 확인표

| 채널 | utm_source | utm_medium | utm_campaign |
|---|---|---|---|
| 인스타그램 | instagram | social | open_checklist |
| 자영업 커뮤니티 | naver_cafe | community | diagnosis |
| 네이버 블로그 | naver_blog | content | faq_open_prep |
| 박람회 QR | expo | offline | startup_fair_2026 |
| CRM 카카오톡 | kakao | crm | welcome_d3 |

## 네이버 카페(2번) 도착 페이지 변경 (2026-11-11 사용자 결정)

- 셀프 진단 페이지 대신 **랜딩 첫 화면**으로 보낸다. 저장된 UTM의 `utm_campaign` 이 `diagnosis` 인 방문만 히어로 버튼이 두 개(주황, 같은 크기)로 바뀐다: 위 **무료 셀프 진단(10문항) 받기** (`click_cta` · `hero_diagnosis`) / 아래 **무료 D-7 체크리스트 받기** (`hero`). 이때 히어로의 진단 글자 링크는 숨긴다. 그 외 유입은 그대로.
- 옛 링크 `diagnosis.html?utm_source=naver_cafe&utm_medium=community&utm_campaign=diagnosis` 도 계속 그대로 동작한다 (진단 시작 화면 + UTM 저장).

## 박람회 QR 만들 때

- 도착 페이지를 랜딩 대신 **체크리스트 신청 페이지**로 한 이유: 박람회 방문자는 이미 체크리스트를 받으려고 QR을 찍으므로 한 단계를 줄인다 (가설 H5와도 맞음 · 2026-11-06 사용자 결정).
- QR에는 4번 링크를 **그대로** 넣습니다. 단축 URL 서비스를 거치면 UTM이 빠지지 않는지 먼저 확인하세요.
- 인쇄 전에 휴대폰으로 QR을 찍어 체크리스트 신청 페이지가 열리는지, 주소창에 `utm_source=expo` 가 남아 있는지 확인합니다.

## 확인 방법 (qa-report 7장 9번)

1. 링크를 하나씩 열고 GA4 → 보고서 → 실시간에서 해당 소스·매체가 보이는지 확인합니다.
2. GTM ID를 연결하기 전에는 GA4로 데이터가 가지 않습니다. 주소 끝에 `&debug=1` 을 붙여 열면 이벤트 로그 상자로 먼저 확인할 수 있습니다.
