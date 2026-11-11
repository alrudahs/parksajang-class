# 박사장 클라쓰 · 프로젝트 규칙

초보 사장님을 위한 오픈·운영 템플릿·코칭 브랜드 "박사장 클라쓰"의 랜딩페이지와 서비스 경로(A·B·C) 데모 사이트.

## 0. 원본 자료 (항상 이 순서로 확인)

1. `docs/landing-content.md` — **문구·가격·숫자의 유일한 기준.** 다른 자료와 다르면 이 파일이 이긴다.
2. `docs/banner-copy.md` — 손해 방지형 배너 문구 3종. 배너에만 쓰고, 문구는 파일 그대로.
3. `docs/wireframe.png` — 랜딩 섹션 순서·배치 참고 (모바일)
4. `docs/service-paths.png` — 경로 A·B·C 화면 흐름과 이탈 위험 구간(★) 참고
5. `docs/vscode-prompts.md` — 단계별 작업 순서(1~10단계)와 단계별 캡처 이름. 단계 번호는 이 파일을 따른다.

> 와이어프레임의 FAQ는 3개만 보이지만 실제로는 md의 5개를 모두 쓴다. 와이어프레임의 "1인 식당"도 md 표기("1인 매장")를 따른다.

참고 자료 (배경 이해용, 문구 출처로 쓰지 않음):
- `4단계_프로젝트_가이드북_박사장클라쓰_최종.docx` — 전체 기획. 가이드북과 md의 문구가 다르면(서브 헤드라인, 문제 카드, 신청 폼 안내 등) **md를 따른다.**
- `박사장클라쓰_제출전_체크리스트.pdf` — 제출·배포 후 QA 기준. 아래 11장 참고.

## 1. 폴더 구조

```
PARKSAJANG-CLASS/
├─ index.html              ① 랜딩
├─ checklist.html          A 체크리스트 신청 폼
├─ checklist-done.html     A 신청 완료·다운로드 (H1 샘플+할인 배너)
├─ template.html           A 운영 템플릿 상세
├─ checkout.html           A·C 주문서 (?item=template|coaching|premium)
├─ order-complete.html     A·C 구매·결제 완료
├─ diagnosis.html          B 시작 → 10문항 → 점수 미리보기 → 연락처 등록
├─ diagnosis-result.html   B 전체 결과 + 안내 (?demo=high|mid|low 테스트용)
├─ live.html               C 무료 Zoom 라이브 신청
├─ live-done.html          C 라이브 신청 완료
├─ consult.html            C 15분 상담 예약 (날짜·시간, 오픈/운영 단계)
├─ coaching.html           C 코칭 상세 (?type=open|operate)
├─ survey.html             공통 만족도 설문 (?type=checklist|live|purchase)
├─ css/style.css           공통 스타일 (모든 페이지가 함께 사용)
├─ js/
│  ├─ config.js            바꿀 값 한곳에: GTM ID, 사이트 주소, 채널 URL, 구글폼, A/B 설정
│  ├─ tracking.js          dataLayer 전송, UTM 저장, ?debug=1 이벤트 로그
│  ├─ products.js          상품명·가격·할인 규칙
│  ├─ common.js            저장소·A/B·3일 할인 타이머·폼 검사·채널 링크 (푸터는 각 HTML에 직접 작성)
│  └─ (페이지별).js         landing.js, diagnosis.js, checkout.js 등
├─ images/                 사진·양식 미리보기·og.png (지금은 자리표시)
├─ files/                  다운로드 PDF (D-7 체크리스트 최종본 · 매장 운영 템플릿 데모 7쪽)
├─ robots.txt · sitemap.xml
├─ vercel.json             D-7 PDF·템플릿 데모 PDF 두 경로에만 Content-Disposition 헤더 (한글 저장 이름 · 2026-11-11). 그 밖에는 정적 파일 그대로 배포
├─ scripts/capture.js      Playwright 캡처 도구 (배포와 무관)
├─ captures/               캡처 결과 (.gitignore, GitHub에 올리지 않음)
├─ package.json            캡처 도구용 (사이트는 빌드 없음)
└─ docs/                   원본 자료
```

## 2. 기술 원칙

- **빌드 도구 없음.** HTML + CSS + 바닐라 JS만. 번들러, 프레임워크, TypeScript, Tailwind 금지. `package.json`과 `node_modules`는 **캡처 도구 전용**이고 사이트는 이것 없이 동작해야 한다.
- Vercel 정적 배포를 그대로 한다. 루트가 곧 배포 루트.
- 외부 의존성은 Pretendard 웹폰트(CDN)와 GTM 스니펫만 허용. 차트는 라이브러리 없이 SVG/CSS로 직접 그린다.
- **로컬 파일을 직접 열어도(file://) 동작해야 한다** (캡처 도구가 서버 없이 연다). 그래서 링크·리소스는 상대 경로(`css/style.css`, `checklist.html`)로 쓰고, `fetch`로 로컬 JSON을 불러오지 않는다. 데이터는 JS 파일 안에 둔다.
- 바뀔 수 있는 값(GTM ID, 사이트 주소, 채널 URL, 구글폼 주소, A/B 설정)은 **`js/config.js` 한 곳에만** 둔다.
- 상품명·가격은 **`js/products.js` 한 곳에서** 관리한다 (주문서·상세·완료 화면). 단, 랜딩(`index.html`)의 가격표·FAQ·숫자는 검색·AI 크롤러가 JS 없이 읽을 수 있도록 **HTML에 직접 쓴다** → 가격을 바꾸면 `index.html`도 같이 고치고, 8단계 점검에서 둘이 같은지 확인한다.
- 이미지 자리는 `<figure class="media">` 안의 `.placeholder` 이고, 바로 위 HTML 주석에 교체할 `<img>` 코드가 적혀 있다 (`images/README.md` 참고).
- 페이지 사이 데이터 전달은 URL 쿼리 또는 `sessionStorage`. 서버·DB 없음. 스토리지 접근은 try/catch로 감싸고, 값이 없어도 페이지가 깨지지 않게 한다.

## 3. 반응형

- **모바일 우선, 375px 기준**으로 먼저 작성하고 `min-width` 미디어쿼리로 넓힌다.
- 좌우 여백 20px, 가로 스크롤 금지. 320px에서도 글자·버튼이 잘리지 않아야 한다.
- PC(≥1024px)에서는 본문 최대 폭을 제한(약 720px, 가격표·숫자 카드는 그리드 확장 가능)해 늘어지지 않게 한다.
- 터치 영역 최소 44px. CTA 버튼은 모바일에서 가로 꽉 차게.

## 4. 브랜드

### 컬러 (CSS 변수로만 사용, 색상값 직접 쓰지 않기)

| 변수 | 값 | 용도 |
|---|---|---|
| `--navy` | `#1F3A5A` | 메인. 제목, 헤더, 프리미엄 상품 강조 |
| `--orange` | `#D9622B` | 포인트. 그래프 최고 달, 테두리, 큰 숫자(할인가 등) |
| `--orange-dark` | `#BD5322` | **메인 CTA 버튼** 배경, 작은 주황 글자 (흰 글자 대비 4.75:1 · 2026-11-06 사용자 결정) |
| `--green` | `#2F7D6D` | 보조. 섹션 라벨, 그래프 막대, 경로 B 보조 링크 |
| `--bg` | `#F7F9FB` | 페이지 배경 |

- **글자 대비 4.5:1** (2026-11-06 PageSpeed 접근성 수정): 원색 `--orange` 는 흰 글자와 3.66:1 이라, 주황 버튼 배경과 작은 주황 글자는 `--orange-dark`(#BD5322), 연주황 칩 글자는 `--orange-deep`(#A8481C), 연초록 칩 글자는 `--green-text`(#2A7062)를 쓴다. 원색은 그래프·테두리·큰 숫자에. 근거는 `docs/qa-report.md` 9-3.
- 주황은 "지금 행동할 것"에만 쓴다. 한 화면에 주황 버튼은 1개가 원칙 (랜딩은 히어로·최종 CTA의 같은 버튼 2번).
  - 예외 (2026-11-11 사용자 결정): 네이버 카페 유입(저장된 `utm_campaign=diagnosis`)만 히어로에 같은 크기 주황 버튼 2개 — 위 "무료 셀프 진단(10문항) 받기"(`hero_diagnosis`) · 아래 "무료 D-7 체크리스트 받기"(`hero`). `index.html` 의 인라인 스크립트가 `<html data-entry="diagnosis">` 를 붙이고 CSS로만 바꾼다(CLS 없음). 헤드라인 A/B와 무관, A·B안 똑같이.
- 이미지·자료 자리는 연회색 박스 + 회색 안내 문구 ("대표 사진 / 매장 사진", "실제 쓰던 양식 미리보기"). `images/` 이미지로 바꾸기 쉽게 한 곳에 표시.

### 폰트

- Pretendard → 없으면 Noto Sans KR → 시스템 sans-serif.
  `font-family: "Pretendard", "Noto Sans KR", -apple-system, sans-serif;`
- 숫자(가격·매출)는 `font-variant-numeric: tabular-nums`.

## 5. 문구 · 톤

- 톤: **든든하다 · 솔직하다 · 현실적이다.** 먼저 겪어본 선배 사장님이 옆에서 말해주는 느낌.
- 존댓말 "~해요 / ~드려요 / ~세요" 체. 사장님을 부를 때는 "사장님".
- **문구·가격·숫자는 `docs/landing-content.md`에서 그대로 복사한다.** 다듬기·요약·과장·새 문장 추가 금지. md에 없는 문구가 꼭 필요하면(버튼 라벨, 오류 메시지, 진단 개선 팁 등) 짧고 사실만 담아 쓰고, 작업 후 사용자에게 목록으로 알린다.
- 숫자 표기도 원본과 동일하게: `1,567만 원`, `19,900원`, `4,500,000원 VAT 별도`, `222.9만 원`.
- 매출 숫자는 **근거로만** 쓴다. "이 템플릿을 쓰면 이만큼 번다" 식으로 연결하지 않는다.
- 랜딩의 가격·매출 숫자에는 "(추정)"을 붙이지 않는다 (매출은 실제 매출일지 기록, 결제는 푸터에서 데모로 고지).

### 배너 문구 (`docs/banner-copy.md`)

| # | 위치 | 메인 / 서브 |
|---|---|---|
| ① | `index.html` 히어로 바로 아래 띠 배너 (A안·B안 동일) | 창업 실수, 비싼 수업료 내지 마세요 / 혼자 부딪히기 전에, 박사장이 놓치기 쉬운 것부터 짚어드려요 |
| ② | `checklist.html` 상단 | 오픈 날 실수는 그대로 손해가 됩니다 / 두 번 열어본 박사장이 D-7부터 함께 점검해드려요 |
| ③ | `diagnosis.html` 시작 화면 상단 | 버리는 재고, 나가는 알바, 새는 매출 / 혼자 시작해 월 매출 4천만 원을 만든 박사장이 먼저 잡아드려요 |

- 메인 문구는 크게, 서브 문구는 작게. 파일 그대로 쓰고 바꾸지 않는다.
- 배너 ① 서브 문구는 헤드라인 B안("알바에서 사장까지 8년, …")과 겹치지 않게 사용자 결정으로 바꿨다 (2026-11-05). 배너는 A안·B안에서 똑같이 보여야 한다 → H3 테스트의 차이는 헤드라인 하나뿐.
- "4배"라고 쓰지 않는다 (실제 약 2.7배).

### 쓰지 않을 말

- 금지: **"무조건 대박", "월 매출 보장", "실패 없는 창업", "누구나 쉽게"**
- 같은 결의 표현도 금지: "보장", "실패 없음", "100%", "확실한 성공", "단기간에 매출 ○배", "누구든지", "아무나", "최고의/1위"(근거 없는 최상급), "4배"
- 가짜 후기·가짜 수강생 수·가짜 별점 금지. 후기 자리는 "런칭 후 추가"로 비워 둔다.
- "(예정)" 표기가 붙은 채널(카카오톡 채널, 인스타그램)은 화면에서 "(예정)"을 빼지 않는다.

## 6. 데모 결제 · 개인정보 원칙

- **실제 결제는 절대 일어나지 않는다.** PG사 SDK(토스페이먼츠, 아임포트 등) 연동 금지.
- 카드번호·계좌번호·주민번호 등 결제/민감 정보 입력 칸을 만들지 않는다. 주문서는 이름·연락처만.
- 결제 버튼 라벨에 데모임을 표시: `결제하기 (데모)`.
- 결제 버튼을 누르면 바로 완료 페이지로 이동. 주문번호는 임의 생성 (`DEMO-YYYYMMDD-XXXX`).
- **모든 페이지 푸터**에 고지: "본 페이지의 결제는 프로젝트용 데모이며 실제 결제가 일어나지 않습니다."
- 입력받은 이름·연락처는 **저장하지 않고 다음 화면으로 넘기는 데만** 쓴다 (`sessionStorage`, 표시 용도). 서버 전송 없음. dataLayer에도 개인정보를 넣지 않는다.
- 다운로드 버튼은 `files/` 의 PDF로 연결한다. D-7 체크리스트는 2026-11-11 최종본으로 교체(파일 이름 `d7-checklist-sample.pdf` 그대로), 템플릿은 같은 날 데모 버전 7쪽으로 교체(`template-sample.pdf` 그대로).
- 할인 규칙:
  - 운영 템플릿 19,900원 → **14,900원**: 체크리스트 신청 후 3일 한정. 신청 시각만 `localStorage`에 저장하고 남은 시간을 표시, 지나면 정가.
  - 오픈 올인원 키트: 템플릿 구매자는 60일 안에 49,100원으로 업그레이드 (안내 문구로만).
  - 주문서에는 상품명 · 정가 · 할인 적용 여부 · 최종 금액을 모두 보여준다.

## 7. GA4 이벤트 이름 규칙

- GTM `window.dataLayer.push`로만 보낸다. 직접 `gtag()` 호출 금지. GTM ID는 `js/config.js`의 `GTM-XXXXXXX`.
- 모든 전송은 **`js/tracking.js`의 `track(eventName, params)` 하나로.** 페이지에서 `dataLayer.push`를 흩어 쓰지 않는다.
- 이벤트 이름·파라미터는 `tracking.js`의 `PSC.events.*` 함수 안에서만 정한다. 페이지 스크립트는 `PSC.events.lead('checklist', 동의여부, 다음동작)`처럼 함수만 부른다. 전체 지도는 `docs/event-map.md` — 이벤트를 고치면 이 문서도 같이 고친다.
- GTM ID가 자리표시(`GTM-XXXXXXX`)인 동안은 GTM을 불러오지 않는다 (dataLayer에만 쌓임). `<noscript>` GTM iframe은 넣지 않는다 (ID를 HTML마다 써야 해서 "config.js 한 곳" 원칙과 충돌, GA4는 어차피 JS 필요).
- 경로 A 이벤트 확인 캡처: `node scripts/capture-path-a.js <단계번호>` (?debug=1 상태로 자동 시연하며 화면마다 캡처).
- 이벤트·파라미터 이름은 **소문자 snake_case**, 아래 표에 있는 것만 쓴다. 새 이벤트를 만들거나 이름을 바꾸지 않는다.

| 이벤트명 | 언제 | 파라미터 |
|---|---|---|
| `page_view` | 모든 페이지 열람 | (GTM 자동 — 수동 push 하지 않음) |
| `click_cta` | 히어로·최종 CTA·히어로 셀프 진단 링크·"어느 쪽이세요?" 카드 클릭 | `button_position`: `hero` / `bottom` / `hero_diagnosis` / `split_open` / `split_running` (뒤 3개는 2026-11-10 사용자 결정) |
| `generate_lead` | 무료 자료 신청·상담 예약 완료 | `lead_type`: `checklist` / `diagnosis` / `consult`, `marketing_consent`: `true`/`false` |
| `file_download` | D-7 체크리스트 다운로드 | `file_name` |
| `view_item` | 템플릿·키트·코칭 상세 열람 | `item_name`, `price` |
| `begin_checkout` | 주문서 진입 | `item_name`, `value`, `discount_applied` |
| `purchase` | 구매·결제 완료 | `transaction_id`, `item_name`, `value` |
| `start_diagnosis` | 셀프 진단 1번 문항 시작 | `source` |
| `complete_diagnosis` | 10문항 응답 완료 | `score_band`: `high` / `mid` / `low` |
| `register_live` | 무료 Zoom 라이브 신청 완료 | `live_round` (예: `2026-12`) |
| `submit_survey` | 만족도·추천 설문 제출 | `survey_type`: `checklist`/`live`/`purchase`, `satisfaction`(1~5), `recommend`(0~10) |

- 값 규칙:
  - `price`, `value`: 숫자(원 단위, 콤마 없음). 예: `14900`. 금액 이벤트에는 `currency: "KRW"`를 함께 보낸다(GA4 금액 집계 요구사항).
  - `item_name`: `products.js`의 상품명 그대로 (예: `매장 운영 템플릿`).
  - `discount_applied`, `marketing_consent`: boolean.
  - `source`: 저장된 `utm_source`, 없으면 `direct`.
  - 같은 이벤트가 새로고침으로 중복 전송되지 않게 한다 (특히 `purchase` — `transaction_id` 기준 1회).
- 점수 구간 매핑: 8~10점 `high`(상) / 5~7점 `mid`(중) / 0~4점 `low`(하).
- **디버그:** 주소에 `?debug=1`이 붙으면 이벤트가 나갈 때마다 콘솔에 찍고, 화면 오른쪽 아래에 작은 이벤트 로그 상자를 띄운다 (캡처로 확인용). 이 상태는 페이지를 넘어가도 유지한다(`sessionStorage`).

### A/B 테스트 (가이드북 H1 · H3)

- 이벤트를 새로 만들지 않는다. `js/tracking.js` 가 GTM을 켜기 전에 **이벤트가 아닌 변수**로 실험 그룹을 dataLayer에 넣고, `sessionStorage` 에 저장해 이후 모든 이벤트에 함께 보낸다. GTM에서 GA4 이벤트 매개변수로 연결한다 (`docs/gtm/README.md` 6·7장).
  - `{ exp_headline: "a" | "b" }` — H3 히어로 헤드라인 (`index.html`)
  - `{ exp_done_offer: "on" | "off" }` — H1 신청 완료 화면의 템플릿 샘플 + 3일 할인 배너 (`checklist-done.html`)
- `abTest.enabled = false` 일 때의 기본값은 헤드라인 A안, 완료 화면 배너 `on` (md 기준 화면). 캡처 도구는 무작위와 상관없이 이 그룹으로 고정해 찍는다.
- 주소로 강제 지정: `?v=a` / `?v=b` (헤드라인), `?offer=on` / `?offer=off` (H1).
- 현재 `js/config.js`의 `abTest.enabled = true` (2026-11-09 사용자 결정) → 방문자마다 무작위 50/50 배정, `localStorage`에 기억. 주소 지정이 항상 우선이고 저장된 그룹은 바꾸지 않는다.
- H1 블록(샘플 + 할인 배너)은 독립된 덩어리로 만들어 켜고 끌 수 있게 한다.

### 만족도 설문 → 구글폼

- `survey.html`에서 응답을 받아 `submit_survey` 이벤트를 보내고, 같은 응답을 구글폼으로 전송해 설문 시트에 쌓는다 (`fetch` + `mode: "no-cors"`로 `formResponse` 주소에 POST, 서버 불필요).
- 구글폼 주소와 `entry.XXXX` 번호(설문 종류 / 만족도 / 추천)는 `js/config.js`의 `surveyForm`에 둔다. 비어 있으면 이벤트만 보내고 폼 전송은 건너뛴다.
- 설문에 이름·연락처를 묻지 않는다.

## 8. UTM

- 첫 방문 시 URL의 `utm_source / utm_medium / utm_campaign`을 `sessionStorage`에 저장하고 이후 페이지에서 재사용.
- 값은 모두 소문자. 채널별 값은 `docs/landing-content.md` 8장 표를 따른다.

## 9. AEO · SEO · 채널

- 랜딩 `<title>`, `meta description`은 md 6장 문구 그대로. og 태그(`og:image`는 `images/og.png`)도 같은 문구.
- 랜딩에 JSON-LD: `FAQPage`(FAQ 5개, 화면 문구와 완전히 동일), `Organization`(이름·한 줄 소개·대표 박미경·채널 URL).
- 배포 전 사이트 주소는 `https://YOUR-DOMAIN`으로 두고, 배포 후 `node scripts/set-domain.js https://배포주소` 한 번으로 `config.js`·`sitemap.xml`·`robots.txt`·canonical·og 태그·JSON-LD를 모두 바꾼다.
- FAQPage JSON-LD는 손으로 고치지 않는다. 화면 FAQ 문구를 고친 뒤 `node scripts/build-jsonld.js`를 실행하면 화면 문구 그대로 다시 만들어진다 (`<!--JSONLD:START-->` ~ `<!--JSONLD:END-->` 사이).
- 검색 노출 페이지(index·checklist·template·diagnosis·live·coaching)에는 canonical, 나머지(완료·주문서·결과·상담 예약·설문)에는 `noindex`.
- **채널은 가상 주소로 진행한다** (실제 계정 개설 전). `js/config.js`의 `channels`에 아래 가상 URL을 두고 `virtual: true`로 표시한다.
  - 인스타그램 `https://www.instagram.com/parksajang_class` (가상)
  - 카카오톡 채널 `https://pf.kakao.com/_parksajangclass` (가상)
  - JSON-LD `sameAs`에는 넣어 구조를 완성하되, **화면에서는 링크를 걸지 않고 텍스트 + "(예정)"으로만** 보여준다. 실제와 다른 남의 계정으로 연결되는 일을 막기 위함.
  - 계정을 실제로 만들면 `config.js`에서 주소를 고치고 `virtual: false`로 바꾸면 화면 링크가 켜진다.
- `robots.txt`: 모든 크롤러 허용 + `sitemap.xml` 위치. 완료·주문 페이지는 sitemap에서 빼고 `noindex`.
- 각 페이지에 고유 `<title>`, `meta description`, `lang="ko"`.

## 10. 접근성 · 품질

- 시맨틱 태그(`header`, `main`, `section`, `footer`), 폼 `label` 연결, 아코디언·펼쳐보기는 `<details>`/`<summary>` (브라우저 기본 접근성, JS 없이 동작, 접힌 답도 크롤러가 읽음).
- 화면에서 떨어져 보이는 글자는 CSS 여백만 쓰지 말고 실제 공백·구분점(" · ")을 넣는다 → 스크린리더·크롤러·복사 시에도 md 원문과 같게.
- 색은 `:root` 변수로만 쓴다 (디버그 상자 색도 `--debug-*` 변수).
- 이미지 자리에는 `alt` 또는 `aria-label`.
- 빈칸이면 폼 제출이 안 되게 하고, 이유를 화면에 짧게 알려준다.

## 11. 제출 체크리스트와 연결되는 요구사항

- **첫 화면 3초 안에 표시** (PageSpeed Insights): 무거운 이미지·스크립트 금지, 이미지는 지연 로딩, 폰트는 `font-display: swap`.
- **구조화 데이터**는 Google 리치 결과 테스트에서 감지돼야 한다 → JSON-LD 문법 오류 없이.
- **robots.txt**는 검색·AI 크롤러(GPTBot, PerplexityBot 등 포함)를 막지 않는다.
- **경로 A·B·C의 모든 버튼·링크가 올바른 화면으로 연결**돼야 한다. 막다른 페이지를 만들지 않는다.
- 빈 섹션·깨진 이미지 금지. 자리표시 박스는 "무엇이 들어갈 자리인지" 문구를 반드시 넣는다.
- 발표 시연은 **경로 A**(랜딩 → 신청 → 완료 → 템플릿 상세 → 주문서 → 구매 완료). 이 흐름은 특히 매끄러워야 한다.

## 12. 캡처 규칙 (모든 단계 공통)

- **각 단계가 끝나면 그 단계에서 새로 만들거나 바뀐 페이지를 `scripts/capture.js`로 캡처하고, 결과 파일 목록을 사용자에게 알려준다.**
- 명령: `node scripts/capture.js <단계번호> <페이지.html> [...] [--desc "한 줄 설명"]`
  - 단계번호는 `docs/vscode-prompts.md`를 따른다: `02`, `03`, `04`, `05`, `05b`, `07`, `08`, `10`
  - 쿼리가 붙은 주소는 따옴표로 감싼다: `"index.html?v=b"` → `02-index-b-*.png`
- 저장: `captures/<단계번호>-<페이지이름>[-쿼리값]-mobile.png` / `-desktop.png`
  - 모바일 375×812, 데스크톱 1440×900, 페이지 전체(full page). `?debug=1`은 파일 이름에서 빠진다.
- 스크립트가 `captures/README.md`에 단계별로 날짜 · 파일 이름 · 한 줄 설명을 자동 추가한다. 시연 순서 같은 정리는 README에 따로 적는다.
- 캡처 후 이미지를 직접 열어 글자·버튼 잘림, 가로 스크롤, 빈 섹션이 없는지 확인하고, 문제가 있으면 고친 뒤 다시 캡처한다.
- 화면이 바뀌지 않은 단계(예: 6단계 AEO)는 이미지 대신 근거 텍스트 파일(`captures/06-aeo-head.txt`)을 남기고 README에 기록한다.
- `captures/`와 `node_modules/`는 `.gitignore`에 들어 있다. GitHub에 올리지 않는다.
- **Playwright 등 자동 시험은 항상 GA4 수집 요청(google-analytics.com, region1.google-analytics.com의 /g/collect)을 route로 차단한다. 실제 전송이 꼭 필요하면 먼저 사용자에게 묻는다.** (2026-11-09 사고 후 추가)
  - route만으로는 페이지를 떠날 때 나가는 요청 등이 샐 수 있으므로, 브라우저도 `scripts/block-analytics.js` 의 `launchOptions()` 로 켜고 context에 `blockAnalytics()` 를 건다. 새 시험 스크립트도 이 파일을 쓴다.
- **자동 시험은 GA4뿐 아니라 구글폼 전송(docs.google.com/forms/.../formResponse)도 차단한다. 실제 전송이 필요하면 먼저 묻는다.** (`scripts/block-analytics.js` 에 포함)
- **gtag 대체 수집 주소 `www.google.com/g/collect` 도 차단한다** (2026-11-11 발견: google-analytics.com 을 막으면 gtag 가 이 주소로 다시 보냄). `block-analytics.js` 에 포함. Lighthouse 등 다른 도구로 잴 때도 같은 주소를 막는다.

## 13. 파일 쓰기 규칙 (2026-11-05 사고 후 추가)

- **md·html·css·js·json·txt 같은 문서·코드 파일은 파일 편집 기능(Write/Edit)으로만 쓴다.** 셸 명령(`echo`, `cat >`, `cat <<EOF`, `printf >`, `sed -i` 로 문단 추가 등)으로 내용을 쓰지 않는다.
  - 이유: 셸은 백틱(`…`)·`$(…)`·`$변수` 를 명령으로 실행한다. 보고서 표에 적은 `scripts/*.js` 가 실제로 실행돼 캡처가 덮어써진 적이 있다.
- 셸은 실행·검색·확인(node, git, grep, ls, 캡처 스크립트 실행)에만 쓴다. `node -e` 안에 긴 문서 문자열을 넣지 않는다.
- 셸로 여러 파일을 한 번에 바꿔야 하면(예: 같은 줄 일괄 치환) 바꾼 뒤 `grep` 으로 결과를 확인하고, 작업 전후로 수정 시각(`find -newer`)을 비교해 의도하지 않은 변경이 없는지 본다.

## 14. Git

- 커밋·푸시는 사용자가 요청할 때만 한다.
- 가이드북 `.docx`, 제출 체크리스트 `.pdf`, 매출일지 등 개인 자료는 **커밋하기 전에 사용자에게 먼저 물어본다** (Public 저장소).
