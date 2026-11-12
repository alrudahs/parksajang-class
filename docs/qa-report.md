# 박사장 클라쓰 · 배포 전 점검 보고서 (8단계)

- 점검일: 2026-11-05
- 상태: **수정 완료** (2026-11-05) — P1~P10 · C1~C4 · D1 수정, D2~D4 보류 기록 → "6. 수정 결과" 참고
- 범위: HTML 13개 + 테스트 주소 12개(A/B안, 진단 상·중·하, 코칭 2종, 주문서 2종 등) = 25개 화면, JS 10개, CSS 1개
- 방법: Playwright 자동 점검(링크·레이아웃·숫자 대조·금지어·이벤트·용량) + 화면 문구 직접 읽기(맞춤법·띄어쓰기)

---

## 1. 요약 (수정 전 점검 결과)

| # | 점검 항목 | 결과 | 문제 |
|---|---|---|---|
| 1 | 링크·버튼 연결 | ✅ 통과 | 링크 169개 모두 존재하는 파일로 연결 (깨진 4개는 HTML 주석 속 이미지 교체 예시 — 실제 링크 아님) |
| 2 | 375px·320px 레이아웃 | ✅ 거의 통과 | 25개 화면 × 2폭 모두 가로 스크롤 0, 잘린 글자 0 · 헤더 로고 터치 영역 30px (권장 44px) 1건 |
| 3 | 문구·가격·숫자 대조 | ⚠️ 4건 | md 핵심 문장 24개·FAQ 5개·진단 10문항·가격 4종 모두 일치 · 단, 화면 글자가 붙어 읽히는 곳 3곳, VAT 표기 형식 1곳 |
| 4 | 금지 표현 | ✅ 통과 | 화면 문구 0건 (코드 주석 "보장 표현 없음" 1건만) |
| 5 | 맞춤법·띄어쓰기 | ⚠️ 3건 | "잘 하고" 1건, 문체 섞임 1건, 할인 남은 시간 "0시간 0분" 표기 1건 (+ md 원문 띄어쓰기 1건) |
| 6 | 첫 화면 속도 | ✅ 통과 | 페이지에 이미지 없음 · 첫 화면 자체 파일 압축 후 약 23KB · 웹폰트 `font-display: swap` 확인 |
| 7 | 이벤트 누락 | ⚠️ 1건 | 11개 모두 구현 (10개 코드 + page_view GTM 자동) · 단, 구매 완료 화면을 직접 열면 가짜 `purchase` 가 나가는 문제 1건 |

---

## 2. 발견한 문제

### 🔴 꼭 고칠 것

| ID | 항목 | 어디 | 문제 |
|---|---|---|---|
| P1 | 7 이벤트 | `order-complete.html` · `js/shop.js` | 주문서를 거치지 않고 구매 완료 주소를 바로 열어도 임의 주문번호로 `purchase` 가 나감 → GA4 매출·구매 수가 부풀려짐 |
| P2 | 5 맞춤법 | `diagnosis-result.html` 상 구간 | "잘 하고 계세요" — '잘하다'(능숙하게 하다)는 한 단어 |
| P3 | 3 문구 | 모든 페이지 푸터 | 구분점을 CSS로만 그려 실제 글자는 "박사장 클라쓰대표 박미경…" 으로 붙음 (스크린리더·크롤러·복사) |
| P4 | 3 문구 | `index.html` ④ 숫자 카드 | "1,567만 원→최고" — 화살표 앞뒤가 글자로는 붙음 |
| P5 | 3 문구 | `diagnosis-result.html` 개선 팁 | "Q3배달앱별…" — 번호와 문항이 붙어 읽힘 |

### 🟡 고치면 좋은 것

| ID | 항목 | 어디 | 문제 |
|---|---|---|---|
| P6 | 5 표기 | 신청 완료 · 템플릿 상세 · 주문서 · 진단 결과(중) | 신청 직후 "할인 마감까지 3일 0시간 0분" (분 올림 계산) |
| P7 | 5 문체 | `order-complete.html` | "…받을 수 있어요. 지금은 임시 파일입니다." — 문체 섞임 |
| P8 | 3 문구 | 주문서 · 구매 완료 (프리미엄) | "4,500,000원 (VAT 별도)" — md 표기는 괄호 없음 |
| P9 | 디자인 | `template.html` | "• + 무료 Zoom 라이브 우선 초대" — 글머리 점과 "+" 겹침 |
| P10 | 2 터치 | 모든 페이지 헤더 로고 | 로고 링크 높이 30px (권장 44px) |

---

## 3. 결정이 필요한 것 → 사용자 결정 반영

| ID | 내용 | 결정 |
|---|---|---|
| D1 | 버튼 "템플릿 보러가기" — 표준 띄어쓰기는 "보러 가기" | **수정** — 화면 2곳 + `docs/landing-content.md` 원문도 "템플릿 보러 가기"로 (원문 띄어쓰기 오류) |
| D2 | 오픈 올인원 키트 상세 페이지 없음 → 키트 `view_item` 은 나갈 곳이 없음 | **범위 밖** · 사유: 경로 A 목표는 템플릿 첫 구매 |
| D3 | 사진 3개 미준비: `images/hero.jpg`(대표 사진) · `images/form-preview.png`(양식 미리보기) · `images/template-sample.png`(템플릿 샘플) — 지금은 회색 자리표시 + 안내 문구 | **실물 준비 후 교체 예정** (HTML 주석의 `<img>` 코드로 교체, 이미지당 200KB 이하) |
| D4 | 다운로드 PDF 2개가 임시 파일 (`files/d7-checklist-sample.pdf`, `files/template-sample.pdf`) | **실물 준비 후 교체 예정** (같은 파일 이름으로 덮어쓰기) |

---

## 4. 문서 정리

| ID | 내용 |
|---|---|
| C1 | `CLAUDE.md` 폴더 구조에 `vercel.json` 이 있지만 실제로 없음 |
| C2 | `CLAUDE.md` "아코디언은 button + aria-expanded" → 실제는 `<details>/<summary>` |
| C3 | `CLAUDE.md` "common.js — 푸터" → 실제로는 푸터를 그리지 않음 |
| C4 | CSS 일부에 색 코드가 변수 대신 직접 쓰여 있음 |

---

## 5. 통과 항목 상세

**링크 (1)** — HTML의 `href`/`src` + JS 안의 페이지 이동 주소 169개 → 모두 존재하는 파일. 경로 A·B·C·설문 끝까지 클릭 테스트 → 막다른 페이지 없음

**레이아웃 (2)** — 375px·320px, 25개 화면: 가로 스크롤 0, 화면 밖 요소 0, 잘린 글자 0, 스크립트 오류 0

**문구·숫자 (3)**
- md 핵심 문장 24개(히어로·문제 카드·핵심 가치·프리미엄 약속·출장비·사회적 증거 제목·오퍼·최종 CTA·푸터 고지·폼 안내·라이브 안내·배너 3종) → 화면에 글자 그대로
- FAQ 질문 5 · 답변 5 → md와 글자 그대로 (구조화 데이터도 5/5) · 진단 10문항 → md와 글자 그대로
- 가격 19,900 / 69,000 / 200,000 / 4,500,000원 → md · `index.html` · `products.js` 세 곳 일치
- md에 없는 숫자: "-5,000원"(할인액), "2026년 11월 회차"(자동 계산), "1점"(설문 눈금), "○개"(팁 개수), "2일 23시간 59분"(남은 시간) — 계산·안내용으로 정상

**금지 표현 (4)** — "무조건·대박·보장·실패 없·누구나·쉽게·100%·최고의·1위·4배·확실한 성공·누구든지·아무나" → 화면 문구 0건

**속도 (6)**
- 페이지 안 이미지 0개 (og.png 76KB는 공유용, 페이지에서 불러오지 않음)
- 첫 화면 자체 파일: HTML 20KB · CSS 37KB · JS 24KB → 압축 후 약 23KB
- Pretendard 웹폰트: 필요한 글자 묶음만 받음(첫 화면 14개, 약 370KB, CDN) · `font-display: swap` 92곳 → 글꼴 받는 동안에도 기본 글꼴로 글자가 바로 보임
- 로컬 기준 첫 화면 load 0.7초 · 실제 3초 기준은 배포 후 PageSpeed Insights로 확인

**이벤트 (7)** — `tracking.js` 에 10개 정의 + 페이지에서 모두 호출 · page_view는 GTM 자동 · 개인정보 포함 이벤트 0

---

## 6. 수정 결과 (2026-11-05)

### 6-1. 항목별 수정 내용과 확인 방법

| ID | 고친 내용 | 바뀐 파일 | 확인 방법 · 결과 |
|---|---|---|---|
| P1 | 주문서에서 만든 주문에만 `fromCheckout: true` 표시 → 이 표시가 있을 때만 `purchase` 전송, 같은 주문번호는 한 번만. 완료 주소를 직접 열면 화면만 보여주고 이벤트는 건너뜀 (주문 정보도 저장 안 함). 함께: 새로고침뿐 아니라 **뒤로/앞으로 가기**로 다시 열린 화면도 `view_item`·`begin_checkout` 을 다시 보내지 않음 | `js/shop.js`, `js/tracking.js` | `?debug=1` + dataLayer 기록으로 3가지 경우 테스트 → 6-2 |
| P2 | "잘 하고 계세요" → "잘하고 계세요" | `diagnosis-result.html` | `?demo=high` 화면 글자 확인 ✅ |
| P3 | 푸터 구분점을 실제 " · " 글자로 (13개 페이지), CSS 가짜 구분점 제거 | 모든 HTML, `css/style.css` | 화면 글자 "박사장 클라쓰 · 대표 박미경 · 카카오톡 채널 '박사장 클라쓰'(예정) · 인스타그램 @parksajang_class(예정)" — md 원문과 같음 ✅ (13/13) |
| P4 | 숫자 카드 화살표 앞뒤에 실제 공백 | `index.html`, `css/style.css` | 화면 글자 "첫 달 1,567만 원 → 최고 4,246만 원" — md와 같음 ✅ |
| P5 | 개선 팁 번호 뒤 실제 공백 | `js/diagnosis.js`, `css/style.css` | 화면 글자 "Q3 배달앱별 주문을…" ✅ |
| P6 | 남은 시간 계산을 올림 → 내림 (1분 미만은 "1분 미만") | `js/common.js` | 신청 직후 "할인 마감까지 2일 23시간 59분" ✅ |
| P7 | "지금은 임시 파일입니다." → "지금은 임시 파일이에요." | `order-complete.html` | 화면 글자 확인 ✅ |
| P8 | "(VAT 별도)" → md 표기 "VAT 별도". 큰 금액 옆에서 "VAT / 별도"로 줄이 갈라져서 금액 아래 작은 글씨로 배치 (글자는 "4,500,000원 VAT 별도" 그대로) · "최종 결제 금액" 라벨 한 줄 고정 | `js/shop.js`, `css/style.css` | 주문서·결제 완료(프리미엄) 375px·320px 확인, 가로 스크롤 0 ✅ |
| P9 | "+ 무료 Zoom 라이브 우선 초대" 줄만 글머리 점 제거 ("+" 는 md 원문이라 유지) | `template.html`, `css/style.css` | `08-template-mobile.png` 확인 ✅ |
| P10 | 헤더 로고 링크 높이 44px (모양 그대로) | `css/style.css` | 자동 점검 "작은 터치 영역" 0건 ✅ |
| C1 | 폴더 구조: vercel.json 없음 · 필요하면 10단계에서 추가 | `CLAUDE.md` | 문서 확인 ✅ |
| C2 | 접근성 규칙: 아코디언·펼쳐보기 = `<details>/<summary>` 로 수정 + "보이는 간격은 실제 공백·구분점으로" 규칙 추가 | `CLAUDE.md` | 문서 확인 ✅ |
| C3 | common.js 설명을 실제 역할로 수정 | `CLAUDE.md` | 문서 확인 ✅ |
| C4 | 직접 쓴 색 코드 32곳을 `:root` 변수로 이동 (`--on-accent`, `--line-strong`, `--placeholder`, `--danger-tint`, `--focus-ring`, `--debug-*` 등). **값은 그대로**라 화면 색 변화 없음 | `css/style.css`, `CLAUDE.md` | `:root` 밖 색 코드 0건 ✅ |
| D1 | "템플릿 보러가기" → "템플릿 보러 가기" | `checklist-done.html`, `diagnosis-result.html`, `docs/landing-content.md`, `scripts/capture-path-a.js` | 화면 2곳 + md 원문 확인 ✅ |
| D2 | 키트 상세 페이지 | — | **범위 밖** · 사유: 경로 A 목표는 템플릿 첫 구매 |
| D3 | 사진 3개 | — | **실물 준비 후 교체 예정** |
| D4 | 임시 PDF 2개 | — | **실물 준비 후 교체 예정** |

### 6-2. P1 테스트 결과 (`?debug=1`)

| 경우 | 행동 | `purchase` 전송 | 로그 상자 |
|---|---|---|---|
| ① 주문서 거침 | 신청 → 주문서 → 결제하기(데모) → 구매 완료 | **1회** (DEMO-20261105-UYGW) | `purchase` transaction_id: DEMO-20261105-UYGW … |
| | 구매 완료에서 새로고침 | 누적 **1회** (다시 안 나감) | "purchase 건너뜀 · 이미 보낸 주문번호" |
| | 뒤로 가기 (주문서) | `begin_checkout` 누적 1회 (다시 안 나감) | "begin_checkout 건너뜀 · 새로고침·뒤로 가기" |
| | 앞으로 가기 (구매 완료) | 누적 **1회** (다시 안 나감), 주문번호 그대로 | "purchase 건너뜀 · 이미 보낸 주문번호" |
| ② 주소 직접 열기 | `order-complete.html` 바로 열기 | **0회** | "purchase 건너뜀 · 주문서를 거치지 않은 접속 (주소 직접 열기)" |
| | 새로고침 | **0회** | 같은 이유로 건너뜀 |
| ③ 공유된 완료 링크 | `order-complete.html?order=DEMO-…` 열기 | **0회** | 같은 이유로 건너뜀 |

### 6-3. 수정 후 다시 점검

자동 점검을 처음부터 다시 실행 → 깨진 링크 0 · 375/320px 레이아웃 문제 0 · 작은 터치 영역 0 · 금지 표현 0 · 스크립트 오류 0 · md 핵심 문장 누락 0 · 진단 문항 누락 0 · FAQ 5/5 일치

### 6-4. 최종 캡처 (단계 08)

`captures/08-*` 22개 화면 × 모바일·데스크톱 = **44장** (`captures/README.md` 단계 08)

index · index-b · checklist · checklist-done · template · checkout · order-complete · diagnosis · diagnosis-question · diagnosis-preview · diagnosis-result-high / mid / low · live · live-done · consult · coaching-open / operate · checkout-coaching / premium · order-complete-premium · survey

---

## 7. 남은 일 (배포 후 확인할 것)

| # | 할 일 | 방법 | 관련 |
|---|---|---|---|
| 1 | 배포 주소로 일괄 교체 | `node scripts/set-domain.js https://배포주소` (19곳) → 커밋·푸시 | 10단계 |
| 2 | 경로 A·B·C를 휴대폰과 PC에서 끝까지 직접 따라가기 | 배포 주소에서 클릭 | 제출 체크리스트 3-7 |
| 3 | 첫 화면 3초 이내 | PageSpeed Insights (모바일) → ✅ **LCP 0.9초, 3초 이하 통과** (재측정 · 수정 전 1.5초, 9-5) | 3-5 |
| 4 | FAQPage · Organization 문법 확인 | Schema Markup Validator(validator.schema.org)로 문법 확인 · 사유: Google이 2026년 5월 FAQ 리치 결과를 검색에서 없애고 6월에 리치 결과 테스트의 FAQ 지원도 끝내서, 리치 결과 테스트는 "감지된 항목 없음"으로 나옴 (코드 문제 아님 · JSON-LD는 그대로 유지) | 3-5 |
| 5 | 공유 미리보기 (og.png) | 카카오톡 공유 디버거 · 링크를 카톡에 붙여 보기 → ✅ **완료** (카카오톡 공유 미리보기에 og 이미지·제목·배포 주소 표시 확인 · 근거 `captures/10-kakao-preview.png`) | 6단계 |
| 6 | robots.txt · sitemap.xml 열리는지 | `배포주소/robots.txt`, `배포주소/sitemap.xml` 직접 열기 → 서치 콘솔에 sitemap 제출 | 3-5 |
| 7 | GTM 연결 | GTM 컨테이너 생성 → `js/config.js` 의 `gtmId` 교체 → GA4 태그·이벤트 태그 10개·변수 만들기 (`docs/event-map.md` 5장) → ✅ **GTM 게시 완료** (버전 3 · 2026-11-09 · 근거 `captures/11-gtm-version3.png`, 9-8) | 3-6 |
| 8 | 이벤트 수신 확인 | GTM 미리보기 → GA4 DebugView에서 11개 이벤트 확인 → ✅ **GTM 미리보기 이벤트 확인 완료 · GA4 DebugView 수신 확인 완료** (2026-11-09 경로 A 기준, 확인 범위는 9-8) | 3-7 |
| 9 | UTM 채널 확인 | 박람회 QR 포함 UTM 링크 5개로 들어가 GA4 실시간에서 채널 확인 → 페이지 조회 수신·UTM 전달 확인 (9-9). 첫 사용자 소스는 14번에서 재확인 | 3-7 |
| 10 | 구글폼 설문 연결 | 구글폼 만들기 → `js/config.js` 의 `surveyForm` 에 주소·entry 번호 → 제출 후 시트 확인 → ✅ **연결 완료** (응답 시트 수신 확인 · 근거 `captures/11-survey-sheet-test.png`, 9-12) | 2-1 · 4-2 |
| 11 | 실물 교체 (D3·D4) | 사진 3장 → `images/`, D-7 체크리스트·템플릿 PDF → `files/` 같은 이름으로 → 🔶 **현장 사진 2장 · 양식 미리보기 6장 반영 완료** (2026-11-10, 9-13) · **히어로 대표 사진 · 매장 만든 과정 4장 · 시장 사진 반영 완료** (2026-11-11, 9-14) · **D-7 체크리스트 PDF 최종본 교체** (2026-11-11, 9-15) · **템플릿 샘플 1장 · 템플릿 데모 PDF 7쪽 반영** (2026-11-11, 9-16) → ✅ 자리표시 없음 | 제출 전 체크리스트 2장 |
| 12 | 채널 계정 개설 후 | `js/config.js` 채널 주소 수정 + `virtual: false` → `scripts/build-jsonld.js` 주소 수정 후 실행 | 1-5 |
| 13 | 실제 운영 전 | 개인정보 수집·이용 동의(필수) 체크박스 추가 · 프리미엄 컨설팅은 견적 상담 흐름 검토 | 3단계·5단계 메모 |
| 14 | 첫 사용자 소스 재확인 | 다음 날 GA4 획득 보고서에서 첫 사용자 소스·캠페인 확인 (실시간 보고서에서는 새 사용자의 값이 비어 있음, 9-9) | 3-7 |

---

## 8. 작업 중 사고 기록

- **무엇이**: 2026-11-05 10:48, 이 보고서를 셸 명령(`node -e` 안의 긴 문자열)으로 쓰다가 표 안 백틱 코드가 명령으로 실행됨 → `scripts/capture-path-a.js` 가 실행돼 **07 캡처 12장이 수정 후 화면으로 다시 찍힘**(원본 복구 불가, README에 표시), `scripts/build-jsonld.js` 가 실행돼 `index.html` 이 다시 저장됨, `set-domain.js` 는 주소 형식 오류로 아무것도 안 바꿈.
- **확인 방법**: 커밋이 없어 `git diff` 비교가 불가능해서, 사고 직전 캡처 시각을 기준으로 `find -newer` 로 이후 바뀐 파일을 모두 찾음 → `index.html` 의 JSON-LD를 6단계 사본(`captures/06-aeo-head.txt`)과 글자 단위 비교 · `YOUR-DOMAIN` 자리표시(sitemap 6 · robots 1 · og 2 · canonical 6페이지 · config 1 · Organization url) 확인.
- **결과**: 사이트 파일은 **이상 없음**(`index.html` 내용 동일, 수정 시각만 바뀜 · 자리표시 그대로 · 낯선 파일 없음). 단 **07 캡처는 원본 손실** — 이벤트 흐름은 같으므로 기록용으로 그대로 두고, 최종 화면은 08 캡처를 씀. (처음 확인 때 수정 시각을 보지 않아 "이상 없음"으로 잘못 보고했다가 재확인에서 바로잡음)
- **재발 방지**: `CLAUDE.md` 13장 — md·html 등 문서·코드는 파일 편집 기능으로만 쓰고, 셸(`echo`·`cat`·heredoc·`node -e` 문자열)로 내용을 쓰지 않는다. 셸로 일괄 변경한 뒤에는 수정 시각을 비교해 의도하지 않은 변경을 확인한다.

---

## 9. 배포 후 확인 결과 (2026-11-06)

배포 주소: https://parksajang-class.vercel.app

### 9-1. Google 리치 결과 테스트 → "감지된 항목 없음" (코드 문제 아님)

- 원인: Google이 2026년 5월부터 FAQ 리치 결과를 검색에서 없앴고, 리치 결과 테스트의 FAQ 지원도 6월에 끝남.
- 확인: 배포 주소 HTML을 `curl` 로 받아 보니 `application/ld+json` 2개(FAQPage 질문 5개 · Organization)가 있고 둘 다 JSON 문법 정상.
- 결정: FAQPage · Organization JSON-LD는 **그대로 유지** (AI 검색·다른 크롤러가 읽을 수 있음). 앞으로 문법 확인은 Schema Markup Validator(validator.schema.org)로 한다 → 7장 4번 변경.
- 캡처: `captures/10-rich-results.png`

### 9-2. PageSpeed Insights (모바일, 2026-11-06 12:13)

| 성능 | 접근성 | 권장사항 | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|
| 98 | 96 | 100 | 100 | 1.5초 | **1.5초** | 0ms | 0 | 4.1초 |

- **LCP 3초 이하 통과** (제출 체크리스트 "첫 화면 3초 안에 표시").
- 캡처: `captures/10-pagespeed-score.png` · `captures/10-pagespeed-metrics.png`
- 남은 경고 2건 → 9-3 · 9-4에서 처리.

### 9-3. 접근성: "배경색과 글자색 대비 부족" → 수정

375px에서 22개 화면의 모든 글자를 자동 점검 (WCAG 기준: 보통 글자 4.5:1, 큰 글자 3:1). 수정 전 **16종** 미달 → 수정 후 **0종**.

| 요소 | 어디 | 수정 전 | 대비 | 수정 후 | 대비 |
|---|---|---|---|---|---|
| 주황 CTA 버튼 (흰 글자) `.btn--primary` | 모든 주황 버튼 (랜딩 히어로·최종 CTA, 신청·구매·결제 버튼 등) | 배경 `--orange` #D9622B | 3.66 | 배경 `--orange-dark` #BD5322 (hover는 `--orange-deep` #A8481C) | 4.75 |
| 작은 주황 글자 (흰 바탕) `.stat .arrow` · `.sum-row--discount dd` · `.count-chip` | 랜딩 숫자 카드 화살표, 주문서 "-5,000원", 진단 결과 팁 개수 | `--orange` | 3.66 | `--orange-dark` | 4.75 |
| 연주황 칩 글자 `.badge` · `.chart-readout .tag` · `.countdown` · `.status-chip.is-on` · `.band-chip--mid` | "신청 후 3일 한정", "최고 달", 할인 남은 시간, "3일 한정 할인 적용", "중 · 일부 개선 필요" | `--orange-dark` | 4.16 | `--orange-deep` #A8481C (새 변수) | 5.1 |
| 연초록 칩 글자 `.pain-card--operate .pain-who` · `.reassure` · `.invite .badge` · `.band-chip--high` (+ 같은 배경의 `.done-mark` · `.booked`) | "운영 단계", "광고 폭탄 없음 · 언제든 수신 거부", "무료 Zoom 라이브 우선 초대", "상 · 잘 운영 중" | `--green` #2F7D6D | 4.28 | `--green-text` #2A7062 (새 변수) | 5.1 |
| 자리표시 박스 안내 글자 `.placeholder` | "대표 사진 / 매장 사진", "실제 쓰던 양식 미리보기" | `--ph-text` #7D8A98 | 2.91 | `--ph-text` #56636F | 5.1 |

- 브랜드 원색 `--orange` #D9622B · `--green` #2F7D6D 값은 그대로. 원색은 그래프(최고 달 막대)·테두리·큰 숫자(할인가 14,900원, 최고 4,246만 원 — 큰 글자 기준 3:1 통과)에 계속 쓰고, **글자가 올라가거나 작은 글자일 때만 같은 계열의 진한 색**을 씀.
- 바뀐 파일: `css/style.css` (변수 2개 추가 · `--ph-text` 값 변경 · 규칙 16곳), `CLAUDE.md` 4장 컬러 표 설명.

### 9-4. 렌더링 차단 요청 (예상 절감 약 650ms) → 폰트만 개선

| 차단 요소 | 처리 | 이유 |
|---|---|---|
| Pretendard 웹폰트 CSS (외부 CDN) | ✅ **차단하지 않게 변경** — `rel="preload" as="style"` + 불러온 뒤 `stylesheet` 로 전환, JS가 꺼진 경우를 위해 `<noscript>` 안에 원래 링크 유지 (13개 페이지) | 폰트는 이미 `font-display: swap` 이라 기본 글꼴로 먼저 그려도 됨. 로컬에서 Pretendard 적용 확인 |
| `css/style.css` | 유지 | 화면을 그리는 데 꼭 필요한 CSS. 늦게 불러오면 스타일 없는 화면이 잠깐 보임 |
| `js/config.js` · `common.js` · `tracking.js` (head) | 유지 | 랜딩 본문의 인라인 스크립트가 화면을 그리기 전에 이 파일들의 `PSC` 로 H3 헤드라인 A/B를 바꾼다 (깜빡임 방지). `defer` 로 바꾸려면 A/B 처리 구조를 바꿔야 해서 하지 않음. 세 파일은 같은 서버의 작은 파일(압축 후 수 KB) |

- 배포 후 다시 측정한 결과는 9-5.

### 9-5. PageSpeed Insights 재측정 — 수정 전·후 비교 (모바일, 2026-11-06 측정 · 수정 전 12:13, 수정 후 같은 날 오후)

| 항목 | 수정 전 (9-2) | 수정 후 | 변화 |
|---|---|---|---|
| 성능 | 98 | **99** | +1 |
| 접근성 | 96 | **100** | +4 |
| 권장사항 | 100 | 100 | 그대로 |
| SEO | 100 | 100 | 그대로 |
| LCP | 1.5초 | **0.9초** | 0.6초 단축 |
| Speed Index | 4.1초 | **3.5초** | 0.6초 단축 |
| 렌더링 차단 항목 | 경고 있음 | A/B 헤드라인 JS 때문에 유지 | 처리 내역은 9-4 |

- **LCP 3초 이하 통과 유지** (제출 체크리스트 "첫 화면 3초 안에 표시").
- 접근성 100: 9-3의 글자 대비 수정이 반영된 결과.
- PageSpeed 점수는 측정할 때마다 조금씩 달라질 수 있음.
- 캡처: 수정 전 `captures/10-pagespeed-score.png` · `captures/10-pagespeed-metrics.png` / 수정 후 `captures/10-pagespeed-after-score.png` · `captures/10-pagespeed-after-a11y.png`

### 9-6. GTM 연결 확인 (GTM-N4L8G2LB, 2026-11-09)

GTM은 config.js 의 ID로 tracking.js 가 동적으로 불러옴. HTML 원문에는 ID가 없지만 13개 페이지 모두 gtm.js 200 응답 확인. noscript 는 이벤트·GA4가 모두 JS 기반이라 생략.

- 캡처: `captures/11-gtm-loaded.png` (배포 사이트 랜딩의 네트워크 요청 목록 · `gtm.js?id=GTM-N4L8G2LB` 200 응답)
- GA4 연결은 측정 ID를 받은 뒤 진행 (7장 7·8번).

### 9-7. GA4 속성 연결 (G-8FTGPCLPTM, 2026-11-09)

- GA4가 GTM을 감지해 Google 태그 `Google Analytics G-8FTGPCLPTM` (트리거 Initialization - All Pages)을 만들고 버전 2로 게시함. 캡처: `captures/11-gtm-google-tag.png` · `captures/11-gtm-version2.png`
- 측정 ID는 `js/config.js` 와 `docs/event-map.md` 에 기록. 사이트 코드에는 GA4를 심지 않고 GTM으로만 보냄.
- 이벤트 10개를 GA4로 보내는 설정 파일: `docs/gtm/gtm-import.json` (태그 1 · 트리거 1 · 변수 18 — 실험 그룹 값 `exp_headline` · `exp_done_offer` 포함), 가져오는 방법과 맞춤 측정기준은 `docs/gtm/README.md`.
- GA4 향상된 측정의 "파일 다운로드"는 끔 (`file_download` 중복 방지, 사용자 처리).
- 실험 그룹 값은 `tracking.js` 가 GTM보다 먼저 dataLayer에 넣고, `sessionStorage` 에 저장해 이후 모든 이벤트에 함께 보냄. `abTest.enabled = true` 로 H3·H1 모두 방문자별 50:50 (2026-11-09 사용자 결정).
- `page_view` 에 `exp_headline` 을 붙이려면 GTM의 기존 Google 태그를 직접 고쳐야 함 (`docs/gtm/README.md` 7장).
- H1도 50:50 유지 (가이드북 4-5 검증 계획 1순위). H1·H3는 각각 따로 무작위 배정되므로 **결과는 실험별로 따로 분석**함 (`docs/gtm/README.md` 8장). H1 노출 수에 필요한 Google 태그의 `exp_done_offer` 는 GTM 버전 4에서 추가함 (9-8).
- **A/B 실험 집계 시작일: 2026-11-10.** 11/9까지는 설정·테스트 기간으로 제외한다.
- 발표 시연 전 그룹 고정 방법: `docs/demo-checklist.md`
- 상태: GTM 가져오기·미리보기·DebugView 확인·게시 완료 → 9-8.

### 9-8. GTM 미리보기 · GA4 DebugView · 게시 검증 (2026-11-09)

| 항목 | 결과 | 캡처 |
|---|---|---|
| GTM 미리보기 이벤트 확인 | ✅ Tag Assistant 확장 프로그램 사용. `purchase` 이벤트에서 `GA4 이벤트` 태그 실행 성공. Google 태그는 초기화 때 실행되는 태그라 이 이벤트에서는 미실행이 정상 | `captures/11-preview-purchase.png` |
| `GA4 이벤트` 태그 설정 | ✅ 매개변수 18개(`exp_headline`, `exp_done_offer` 포함) 연결, 트리거 `CE - 박사장 이벤트 10개` 충족 | `captures/11-preview-ga4-tag.png` |
| GA4 DebugView 수신 확인 | ✅ 경로 A 순서대로 수신: `click_cta` → `generate_lead` → `view_item` → `begin_checkout` | `captures/11-debugview-1.png` · `captures/11-debugview-2.png` |
| `purchase` 수신 | ✅ 주요 이벤트로 표시. 매개변수 `value` · `currency` · `item_name` · `transaction_id` · `exp_headline` · `exp_done_offer` 확인 | `captures/11-debugview-purchase-1.png` · `captures/11-debugview-purchase-2.png` |
| GTM 게시 | ✅ 버전 3 "박사장 이벤트 10개 + A/B 그룹 연결" (변경 21건), 2026-11-09 오후 12:56 게시 | `captures/11-gtm-version3.png` |

- **확인 범위:** DebugView 캡처는 게시 전 미리보기 세션(오후 12:35)의 경로 A 기록이다. `file_download`, `start_diagnosis`, `complete_diagnosis`, `register_live`, `submit_survey` 는 이번 캡처에 없다.
- **`click_cta` 2번 표시 → 중복 아님, 테스트 때 두 번 클릭:** `captures/11-debugview-1.png` 에 `click_cta` 가 연달아 2번 찍혀 있어 확인했다 (2026-11-09).
  - 코드: `click_cta` 를 보내는 곳은 `js/landing.js` 뿐이고, 히어로 버튼의 클릭 리스너는 1개다. `onclick` 과 위임 리스너는 없고 `landing.js` 도 1번만 불러온다.
  - 배포 사이트 Playwright 시험 (다음 화면 이동과 GA 전송은 차단): 새 브라우저에서 히어로 CTA 1번 클릭 10회 → `dataLayer` 의 `click_cta` 와 GA4 전송 요청 속 `click_cta` 모두 **매번 1번** (A안 6회 · B안 4회). 같은 시험에서 더블클릭 → 둘 다 **2번**으로, 캡처와 같은 모양이 재현된다.
  - 위 시험은 수정 전 코드 기준이다. 다음 화면으로 넘어가기 전에 다시 누르면 실제 방문자도 2번으로 기록되는 구조여서 아래와 같이 막았다.
- **더블클릭 재전송 막기 적용 (2026-11-09, `js/landing.js`):** 같은 버튼을 다음 화면으로 넘어가기 전에 다시 누르면 `click_cta` 를 보내지 않는다. Ctrl 클릭(새 탭)은 기존대로 따로 처리하고, 뒤로 가기로 돌아온 화면의 클릭은 새 클릭으로 센다. 배포 페이지에 수정한 `landing.js` 를 끼워 넣어 시험했다 (GA 전송 차단, 이동 차단은 "실제 이동" 제외).

  | 조작 | 횟수 | `dataLayer` | GA4 전송 요청 | 이동 |
  |---|---|---|---|---|
  | 히어로 1번 클릭 | 10회 | 매번 **1번** | 매번 1번 | 매번 시도됨 |
  | 히어로 더블클릭 | 10회 | 매번 **1번** | 매번 1번 | 매번 시도됨 |
  | 최종 CTA 더블클릭 | 1회 | 1번 | 1번 | 시도됨 |
  | 1.5초 뒤 다시 클릭 (이동이 끝나지 않은 상태) | 1회 | 1번 | 1번 | 다시 시도됨 |
  | Ctrl 클릭 1번 / 2번 | 각 1회 | 1번 / 2번 (기존과 같음) | 1번 / 2번 | 새 탭 1개 / 2개 |
  | Ctrl 클릭 뒤 일반 클릭 | 1회 | 2번 (Ctrl 클릭이 일반 클릭에 영향 없음) | 2번 | 새 탭 1개 + 이동 |
  | 클릭 → 뒤로 가기(`pageshow` 재현) → 클릭 | 1회 | 2번 (새 클릭으로 셈) | 2번 | 2번 시도됨 |
  | 실제 이동 1번 클릭 / 더블클릭 | 각 1회 | — | — | `checklist.html` 도착 |
- **Google 태그:** GTM 버전 4 "Google 태그에 exp_done_offer 추가"로 구성 매개변수에 `exp_headline`, `exp_done_offer` 두 개가 모두 들어갔다. H1 노출 수를 나누는 데 필요한 설정이다 (`docs/gtm/README.md` 8장). 태그 설정 근거는 `captures/11-gtm-google-tag-v2.png`, 게시 근거는 `captures/11-gtm-version4.png` (2026-11-09 오후 1:17 게시, Google 태그 수정 1건)다.
- **`page_view` 의 `exp_done_offer` 수신:** ✅ GTM 미리보기로 `checklist-done.html?offer=on` 접속 → GA4 DebugView `page_view` 에서 `exp_done_offer` = `on` 확인. 근거 `captures/11-debugview-pageview-offer.png`
- **`page_view` 의 `exp_headline` 수신:** ✅ GTM 미리보기로 `/?v=b` 접속 → GA4 DebugView `page_view` 에서 `exp_headline` = `b` (소문자) 확인. 근거 `captures/11-debugview-pageview-headline.png`
- **GA4에 들어가는 값:** `exp_headline` 은 `a` / `b`, `exp_done_offer` 는 `on` / `off`. Looker Studio 필터는 소문자로 건다.
- **GA4 맞춤 측정기준:** ✅ 2개 등록 (범위 이벤트) — `실험 헤드라인` = `exp_headline`, `실험 완료화면 제안` = `exp_done_offer`. 근거 `captures/11-ga4-custom-dimensions.png`

### 9-9. UTM · GA4 실시간 검증 (2026-11-09)

새 브라우저에서 instagram · expo UTM 링크를 열어 GA4로 나가는 요청을 기록했다 (배포 사이트, GA 전송 허용).

| 확인 항목 | instagram | expo |
|---|---|---|
| 주소의 `utm_` 값 유지 (`replaceState` 호출 0회, 코드에도 없음) | ✅ 유지 | ✅ 유지 |
| `page_view` 의 `dl` 에 UTM 3개 포함 | ✅ `instagram` / `social` / `open_checklist` | ✅ `expo` / `offline` / `startup_fair_2026` |
| 동의가 `analytics_storage` 를 막는지 (동의 명령 0개, 거부값 없음, `gcs` 없음) | ✅ 막지 않음 | ✅ 막지 않음 |
| GA 쿠키 (`_ga`, `_ga_8FTGPCLPTM`) | ✅ 생성 | ✅ 생성 |

- **GA4 실시간:** UTM 링크 페이지 조회 수신. 같은 창에서 열어 캠페인은 합쳐졌다. 근거 `captures/11-realtime-overview.png`
- **휴대폰 Chrome:** expo 링크 → 경로 A 완료, `click_cta` · `generate_lead` · `file_download` 수신. 근거 `captures/11-realtime-phone-pathA.png`
- **카카오톡 인앱 브라우저:** 실시간 30분 범위를 벗어났던 것으로 확인, 인앱에서도 정상 기록. 2026-11-09 17시, 휴대폰 카카오톡 인앱 브라우저로 kakao CRM 링크 접속 → 무료 라이브 신청(`register_live` 1) → 경로 C 코칭·상담·주문서·구매 완료(`purchase` 1, 주요 이벤트) 실시간 수신. 활성 사용자 1명(자동 시험 차단 확인). 근거 `captures/11-realtime-kakao-inapp.png`
- **첫 사용자 소스·캠페인이 실시간에서 비어 있는 이유:** Google 도움말 기준으로 이 카드는 이미 처리된 사용자만 보여 주며, 새 사용자는 처리 전이라 값이 없다. 다음 날 획득 보고서에서 재확인한다 (7장 14번).
- **GA4 트래픽 획득 (세션 소스/매체, 2026-11-08 ~ 11-10):** 근거 `captures/11-ga4-traffic-source.png`

  | 세션 소스/매체 | 세션 |
  |---|---|
  | (direct) / (none) | 78 |
  | expo / offline | 30 |
  | (not set) | 4 |
  | kakao / crm | 3 |
  | tagassistant.google.com / referral | 3 |

  - expo / offline 30은 휴대폰 테스트와 11/9 새어 나간 자동 시험을 포함한다 (9-11).
  - instagram · naver_cafe · naver_blog는 같은 창에서 연속으로 열어 첫 출처로 합쳐져 보고서에 없다. `dl` 에 UTM이 포함되는 것은 위 표(instagram · expo)로 확인했으므로 재시험하지 않는다. 11/10부터 실제 집계한다.
  - 기본 채널 그룹에서는 매체 community · content · offline · crm이 GA4 기본 분류에 없어 "Unassigned"로 나온다 → 대시보드는 채널 그룹 대신 "세션 소스/매체" · "세션 캠페인" 기준으로 보여준다.

### 9-10. 폼 연타 재전송 막기 적용 (2026-11-09)

이동을 기다리는 폼 4곳에 `PSC.submitOnce` (`js/common.js`)를 적용했다. 다음 화면으로 넘어가기 전에 다시 제출해도 이벤트를 다시 보내지 않고, 이동은 그대로다. 뒤로 가기로 돌아와 다시 제출하면 새 신청으로 센다. 배포 페이지에 수정한 JS를 끼워 넣어 휴대폰 환경으로 시험했다 (GA 전송 차단).

| 폼 | 이벤트 | 1번 제출 | 3연타 (이동이 안 끝난 상태) | 뒤로 가기 후 재신청 |
|---|---|---|---|---|
| 체크리스트 | `generate_lead` | 1번 (3회 시험) | 1번 (3회 시험, 수정 전 3번) | 2번 · 완료 화면 2번 |
| 셀프 진단 연락처 | `generate_lead` | 1번 | 1번 | 2번 · 결과 화면 2번 |
| 무료 라이브 신청 | `register_live` | 1번 | 1번 | 2번 · 완료 화면 2번 |
| 15분 상담 예약 | `generate_lead` | 1번 | 1번 | 2번 · 코칭 화면 2번 |

- 1번 제출과 3연타의 GA4 전송 요청 수도 `dataLayer` 와 같았다. 빈칸 제출 뒤 정상 제출은 1번으로 세고, 실제 이동 3연타에서 다음 화면은 1번 열렸다.
- 만족도 설문은 첫 제출과 함께 폼이 사라져 3연타해도 `submit_survey` 1번이다. 주문서는 제출 때 보내는 이벤트가 없다. 둘 다 고치지 않았다.

### 9-11. 자동 시험이 GA4로 전송됨 (2026-11-09)

- **2026-11-09 16시 전후 자동 시험 약 65명분이 GA4로 전송됨 → 11/9 데이터는 테스트로 제외.**
- GA4 실시간 (지난 30분, 사용자 확인): 활성 사용자 66, `first_visit` 65, `generate_lead` 36, `register_live` 7.
- 원인: 시험에서 GA 요청을 Playwright `route` 로만 막았는데, 실제로 페이지를 이동하는 시험의 이벤트 등이 차단을 지나 GA4에 기록되었다. 실제 이동 시험의 이벤트 수(`generate_lead` 37건 · `register_live` 6건)가 실시간 수치와 거의 같다. 모든 경로를 특정하지는 못했다.
- 9-8·9-10의 "GA 전송 차단"은 시험 조건을 적은 것이며, 그 시험의 데이터가 GA4에 전혀 들어가지 않았다는 뜻이 아니다.
- 재발 방지: `CLAUDE.md` 12장 규칙 추가. `scripts/block-analytics.js` 로 브라우저 수준에서 GA 주소를 차단 (`region1`·`www`.google-analytics.com, analytics.google.com, stats.g.doubleclick.net 접속 실패 확인). `scripts/capture.js` · `scripts/capture-path-a.js` 에 기본 적용.
- **2026-11-11 추가 발견 — 차단에 빠진 대체 주소:** google-analytics.com 이 막히면 gtag 가 **`www.google.com/g/collect`** 로 같은 수집 요청을 다시 보낸다. 이 주소가 `block-analytics.js` 에 없어서, **11/9 차단 적용 이후의 자동 시험(11/9 ~ 11/11 오전)도 이 경로로 GA4에 기록됐을 수 있다.** Lighthouse 1회(11/11, 수정 전 배포본)에서 이 주소가 응답 204로 나간 것을 확인했고, Playwright 시험도 같은 주소로 요청하는 것을 확인했다. 위 11/9 사고에서 특정하지 못한 경로도 이것일 가능성이 크다.
  - 해당 시험: 11/10 14단계 캡처·클릭 시험 (랜딩 약 20회 열람, `click_cta` 6건 · `hero_diagnosis`/`split_open`/`split_running` 각 2건), 11/11 15단계 캡처·시험 (랜딩 약 10회, 일부는 주소 `127.0.0.1`), Lighthouse 1회. 그 밖에 11/9 차단 적용 이후의 시험.
  - **A/B 실험 집계(11/10 시작)에 섞였을 수 있다.** GA4에서 호스트 이름 `127.0.0.1` 과 위 시각대의 랜딩 조회·`click_cta` 를 확인해 제외할지 판단 필요.
  - 수정: `block-analytics.js` 에 `www.google.com` (브라우저 수준) 과 `google.*/g/collect` · `/ccm/collect` (route) 추가 → 두 주소 모두 `net::ERR_FAILED` 로 막히고 GTM은 그대로 불러오는 것 확인. Lighthouse 측정에도 같은 주소를 막는다. `CLAUDE.md` 12장에 추가.

### 9-12. 만족도 설문 구글폼 연결 (2026-11-09)

`survey.html` 제출 시 `submit_survey` 는 GA4로 그대로 보내고, 같은 응답을 구글폼으로 전송한다 (`js/config.js` 의 `surveyForm`, `js/survey.js`).

| 폼 문항 | 보내는 값 |
|---|---|
| 설문종류 (`entry.1255429821`) | `survey_type` |
| 만족도 (1~5) (`entry.1629520359`) | `satisfaction` |
| 추천 의향 (0~10) (`entry.370164772`) | `recommend` |
| 헤드라인 그룹 (`entry.710186266`) | `exp_headline` (값 없으면 빈칸) |
| 완료화면 그룹 (`entry.641282472`) | `exp_done_offer` (값 없으면 빈칸) |

시험 결과 (GA 전송 차단, `scripts/block-analytics.js`):

| 시험 | 구글폼 전송 | 결과 |
|---|---|---|
| 실험 그룹 없음 | 차단 후 내용 기록 | 5개 값 전송, 그룹 2개는 빈칸, 감사 화면 표시 |
| 실험 그룹 있음 | 차단 후 내용 기록 | `b` / `off` 전송, 감사 화면 표시 |
| 추천 0점 | 차단 후 내용 기록 | `recommend` = `0` 전송, 감사 화면 표시 |
| 세션에 이름·연락처가 있는 상태 | 차단 후 내용 기록 | 폼 값은 위 5개뿐, 개인정보 없음 |
| 네트워크 실패 · 서버 500 | 실패 재현 | 감사 화면 표시, `submit_survey` 1번, 스크립트 오류 없음 |
| **실제 전송 1건** | `survey_type` = `test`, 만족도 5, 추천 9, `a` / `on` | 구글폼 응답 200, 감사 화면 표시 |

- **응답 시트 2줄 수신 확인** (근거 `captures/11-survey-sheet-test.png`). 두 줄은 확인 후 시트에서 삭제함 (사용자 처리).

  | 시각 (2026-11-09) | 설문종류 | 만족도 | 추천 의향 | 헤드라인 그룹 | 완료화면 그룹 | 내용 |
  |---|---|---|---|---|---|---|
  | 17:15 | `test` | 5 | 9 | `a` | `on` | 자동 시험 1건 |
  | 17:20 | `live` | 5 | 9 | 빈칸 | 빈칸 | 카카오톡 인앱 설문 전송 성공 |

- 그룹 빈칸은 설문 링크로 바로 들어와 그룹이 정해지기 전이라 정상이다.
- 구글폼은 공개 문항 구조로 `entry` 번호와 단답형 · 선택 입력을 확인했다.

**지표 정의 (가이드북 4-2 기준): 추천 의향 고객 = `recommend` 9~10점 응답 수.** 설문에 이름·연락처를 묻지 않아 사람 단위로 묶지 않으므로, 같은 사람이 여러 번 응답하면 응답 수대로 센다.

### 9-13. 셀프 진단 상단 배치 · 현장 사진 · 양식 미리보기 (2026-11-10)

사용자 요청: 먼저 점검해 보고 구매로 이어지게 셀프 진단을 위로 올린다. 히어로 헤드라인(H3)과 완료 화면 제안(H1)은 A/B 실험 중이라 바꾸지 않았고, 새 요소는 A·B안에 똑같이 보인다.

| 위치 | 추가한 것 | 이동 | `button_position` |
|---|---|---|---|
| 히어로 메인 CTA 바로 아래 | 보조 링크 "이미 장사 중이세요? 무료 셀프 진단(10문항) 먼저 해보기 →" | `diagnosis.html?from=hero` | `hero_diagnosis` |
| 히어로 · 배너 ① 다음 "어느 쪽이세요?" | 오픈 준비 중이에요 → "무료 D-7 체크리스트 받기" (남색 버튼) | `checklist.html` | `split_open` |
| 〃 | 이미 운영 중이에요 → "무료 셀프 진단 해보기" (초록 버튼) | `diagnosis.html` | `split_running` |

- 배너 ①은 "히어로 바로 아래" 규칙(`docs/banner-copy.md`)대로 그대로 두고, 카드 섹션은 그 다음에 넣었다.
- 한 화면 주황 버튼 1개 원칙에 따라 카드 버튼은 남색·초록(`--green-text`, 흰 글자 대비 4.5:1 이상)으로 했다.
- 기존 `hero` · `bottom` 은 그대로. 새 값 3개는 `docs/event-map.md` 와 `CLAUDE.md` 7장 표에 추가했다. GTM은 `click_cta` 와 `button_position` 변수를 그대로 쓰므로 바꿀 것이 없다.

**새 버튼 클릭 시험** (GA4·구글폼 차단 `scripts/block-analytics.js`, 이동은 막고 dataLayer 기록 확인, 헤드라인 A안 · B안에도 같은 버튼 5개가 있는지 확인):

| 버튼 | 1번 클릭 | 빠르게 3번 연타 | 이동 주소 |
|---|---|---|---|
| `hero_diagnosis` | `click_cta` 1번 | `click_cta` 1번 | `diagnosis.html?from=hero` |
| `split_open` | `click_cta` 1번 | `click_cta` 1번 | `checklist.html` |
| `split_running` | `click_cta` 1번 | `click_cta` 1번 | `diagnosis.html` |

**사진** (`images/site/`, 사용자가 크기 줄이고 간판·민감 정보 가림): `<picture>` 로 webp + jpg/png 대체, `width`·`height` 지정, 모두 첫 화면 아래라 `loading="lazy"`. 히어로에는 이미지를 넣지 않았다 (LCP 유지, 대표 사진 자리는 자리표시 그대로).

| 자리 | 파일 | 캡션 (alt는 같은 뜻) |
|---|---|---|
| ④ 숫자 섹션 (나란히) | `store-front` | 2023년 2월 직접 오픈해 3년 넘게 운영한 매장 (간판은 가렸어요) |
| 〃 | `kitchen-line` | 하루 최고 80건 주문을 소화한 조리 라인 |
| 실제 쓰던 양식 미리보기 (기존 자리표시 자리) | `tpl-sales` · `tpl-stock` · `tpl-cleaning` · `tpl-hiring` · `floor-plan` · `container-shelf` | 배달앱별 하루 매출 입력 시트 / 주재료 재고·발주 시트 / 요일별 청소 스케줄 / 알바 면접 질문지 / 실제 매장 평면도로 짠 동선 / 라벨로 정리한 포장 용기 선반 |

- 배치: 모바일 1열 · 640px 이상 2열 · 1024px 이상 양식 3열. 양식은 자르지 않고(`contain`) 모바일은 원래 비율, 여러 열일 때는 16:10 칸에 맞춘다.
- 캡처: `captures/14-site-photos-pc.png` · `captures/14-site-photos-mobile.png` · `captures/14-hero-diagnosis.png` — 8장 모두 webp로 로드, 가로 스크롤 없음, 스크립트 오류 없음.
- 새 문구(사용자 지정): 보조 링크·카드 제목·카드 버튼·사진 캡션. "어느 쪽이세요?", "실제 쓰던 양식 미리보기"는 소제목으로 사용.

### 9-14. 히어로 대표 사진 · 매장 만든 과정 사진 (2026-11-11)

| 자리 | 파일 | 캡션 / alt | 불러오기 |
|---|---|---|---|
| ① 히어로 (회색 "대표 사진 / 매장 사진" 자리 교체) | `owner-hero` (960×1200, 4:5) | alt "직접 오픈해 3년 넘게 운영한 박사장" | `fetchpriority="high"` · `decoding="async"` · 지연 로딩 없음 |
| ④ "매장, 이렇게 직접 만들었어요" (모바일 2열 · PC 4열) | `build-equip` → `build-setup` → `build-diy` → `build-done` | ① 빈 매장에 장비를 들이고 / ② 주방 동선을 직접 잡고 / ③ 가구도 직접 조립하고 / ④ 오픈 준비를 마친 주방 | `loading="lazy"` |
| ④ 같은 섹션 | `market-run` | 재료는 직접 시장에서 골랐어요 | `loading="lazy"` |

- 모두 `<picture>` (webp 우선, jpg 대체) + `width`·`height` 지정. 히어로 헤드라인 문구·구조(H3)와 완료 화면 제안(H1)은 바꾸지 않았다.
- 따로 있는 "소개(대표 이력)" 섹션이 없어 시장 사진은 대표 스토리·숫자 섹션(④ "알바에서 사장까지, 숫자로 보여드릴게요")의 매장 사진 아래에 넣었다.
- 새 alt·캡션에는 대표 실명을 쓰지 않고 "박사장"으로 썼다. 푸터·JSON-LD의 기존 "대표 박미경"은 사용자 결정으로 그대로 둔다.
- **가림 확인:** `owner-hero.jpg` 가 webp와 달리 얼굴이 가려지지 않은 원본이었다 (픽셀 비교 · 다른 13쌍은 같음). 사용자 결정으로 가린 webp에서 jpg를 다시 만들어 덮어씀 → 두 파일 차이 없음 확인. 모든 사진에 EXIF(위치 정보 포함) 없음.

**시험** (GA4·구글폼 차단 `scripts/block-analytics.js`, 로컬 서버):

| 항목 | PC 1440×900 | 모바일 375×812 |
|---|---|---|
| 히어로 사진 | `owner-hero.webp` · 440×550 | `owner-hero.webp` · 335×419 |
| LCP 요소 | 히어로 사진 | 히어로 사진 |
| 히어로 CTA 첫 화면 안 | 예 (아래 끝 531px) | 예 (아래 끝 772px / 812px) |
| CLS (끝까지 스크롤 후) | 0.0008 | 0.0007 |
| 사진 14장 | 모두 webp로 열림 | 모두 webp로 열림 |
| 매장 만든 과정 열 수 | 4열 | 2열 |
| 가로 스크롤 · 스크립트 오류 | 없음 | 없음 |

- 헤드라인 A안 · B안 모두 히어로 사진 · 4단계 사진 · 시장 사진이 똑같이 보이고 헤드라인만 다르다.
- **LCP가 글자에서 히어로 사진(webp 110KB)으로 바뀐다.** 배포 후 PageSpeed 모바일로 다시 재야 한다 (9-5 기준 LCP 0.9초).
- 캡처: `captures/15-hero-owner-pc.png` · `captures/15-hero-owner-mobile.png` (첫 화면) · `captures/15-build-steps-mobile.png`

#### PageSpeed 모바일 하락 → 개선 (2026-11-11)

사용자 측정 (PageSpeed 모바일 3회): **70 / 78 / 78점**, LCP 5.7·5.7·5.8초 (히어로 `owner-hero`), FCP 2.8·0.9·0.9초, TBT 70~170ms, CLS 0·0.033·0.033. 히어로 사진 추가 전은 88점 (LCP 2.8초, CLS 0). 목표: 90점 이상 · LCP 2.5초 이하 · CLS 0.

**원인**

| 증상 | 원인 (확인 방법) |
|---|---|
| LCP 5.7초 | 사진 다운로드 자체는 짧고(로드 지연 0 · 로드 0.06초) **렌더 지연이 88%**. 느린 4G 시뮬레이션에서 히어로 사진(110KB)이 Pretendard 글꼴 16개(약 400KB, 최우선)·`gtm.js`(180KB)와 대역폭을 나눠 쓴다 (Lighthouse LCP 단계 · 네트워크 요청 표) |
| CLS 0.033 | **헤드라인 B안만** 생김. 웹폰트 도착 전 대체 글꼴에서 B안 둘째 줄이 3줄로 접혔다가, 도착 후 2줄로 줄며 사진·CTA·보조 링크가 위로 37px 이동 (0.0319). A안은 두 글꼴 모두 3줄이라 0 → PageSpeed 3회 중 0 · 0.033 · 0.033 으로 갈린 이유 (412×823·DPR 1.75·느린 4G·CPU 4배 조건에서 `layout-shift` 출처 기록) |

**수정** (헤드라인 문구·구조(H3)와 완료 화면(H1)은 그대로)

| 수정 | 내용 |
|---|---|
| 히어로 사진 반응형 | 가린 `owner-hero.webp` 를 원본으로 `owner-hero-480` (webp 32KB · jpg 55KB) · `owner-hero-720` (webp 56KB · jpg 105KB) 생성 (webp 품질 70 · jpg 80). 원본과 픽셀 비교로 가림 상태 같음을 확인하고 720 jpg는 눈으로도 확인 |
| `srcset` + `sizes` | 480w · 720w · 960w, `sizes="(min-width: 480px) 440px, calc(100vw - 40px)"` (사진 폭 = 화면 폭 − 좌우 여백 40px, 최대 440px로 모든 화면에서 고정). 모바일(412px · DPR 1.75)은 720w webp 56KB 1개만 받음 (이전 110KB) |
| preload | `<head>` 에 `<link rel="preload" as="image" type="image/webp" imagesrcset imagesizes fetchpriority="high">` (picture 와 같은 값 · 중복 다운로드 없음 확인) |
| CLS | `.hero-title { min-height: calc(1.38em * 3) }` — 3줄 높이를 미리 잡음. B안 CLS 0.0325 → 0.0007, A안 0.0006 (같은 조건 재측정). B안은 글꼴 도착 후 헤드라인 아래에 한 줄 정도 빈 칸이 남는다 |

- 히어로 사진은 HTML `<img>` 라 CSS 배경·JS로 늦게 그려지지 않는다 (지연 로딩 없음 확인).
- 렌더 차단: `css/style.css` 와 헤드라인 A/B에 필요한 `config.js`·`common.js`·`tracking.js` (합계 약 64KB). A/B 깜빡임 방지 때문에 그대로 둔다. Pretendard는 이미 비동기(preload → stylesheet) + `font-display: swap` + `preconnect`.
- **시도 후 되돌림:** Pretendard를 `load` 뒤에 붙여 보니 FCP는 3.9 → 1.5초로 줄었지만, 글꼴 16개 교체에 따른 다시 그리기가 TBT 구간으로 넘어가 TBT 248 → 1,955ms, 점수 71 → 57 (로컬 · CPU 2배)로 더 나빠져 되돌렸다.
- **더 줄일 수 있는 것 (사용자 결정 필요):** `gtm.js` 180KB를 `load` 뒤로 미루기. 첫 화면 대역폭·TBT에는 도움이 되지만 `page_view` 가 늦게 나가 바로 나가는 방문이 덜 잡힐 수 있고 A/B 실험 도중 측정 조건이 바뀐다.

**로컬 Lighthouse 사전 측정** (Lighthouse 12.6.1, 모바일 기본 설정 · 시뮬레이션 스로틀링, GA4 차단): 이 PC의 CPU 지표(benchmarkIndex 790)가 PageSpeed 서버보다 낮아 기본 CPU 4배에서는 TBT가 2초 이상으로 크게 나온다. 점수는 PageSpeed와 직접 비교할 수 없고 **수정 전후 비교용**으로만 본다.

| 조건 (CPU 2배, 1회) | 점수 | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| 수정 전 (배포본) | 58 | 3.62초 | 6.25초 | 464ms | 0.035 |
| 수정 후 (로컬 서버) | 71 | 3.93초 | 4.27초 | 248ms | 0.001 |

**배포 후 로컬 Lighthouse 3회** (2026-11-11, `b6fcb4c` 배포본, 모바일 기본 설정 · CPU 4배, GA4·구글폼 차단 · 세 번 모두 수집 요청 실패(-1) 확인):

| 회 | 점수 | FCP | LCP | TBT | CLS | 히어로 사진 |
|---|---|---|---|---|---|---|
| 1 | 69 | 4.14초 | 4.52초 | 255ms | 0 | `owner-hero-720.webp` |
| 2 | 48 | 3.70초 | 5.87초 | 989ms | 0 | 〃 |
| 3 | 44 | 3.85초 | 4.30초 | 4,201ms | 0.001 | 〃 |
| **평균** | **53.7** | 3.90초 | **4.90초** | 1,815ms | **0** | |

- 같은 조건의 수정 전 배포본 1회: 39점 · LCP 6.13초 · CLS 0.033.
- **이 PC에서는 TBT가 255 ~ 4,201ms로 크게 흔들려 점수가 PageSpeed(같은 배포본 수정 전 70~78점)와 맞지 않는다.** 목표(90점 · LCP 2.5초) 달성 여부는 PageSpeed Insights 웹에서 다시 재서 판단해야 한다. CLS 0은 로컬 3회 모두 확인.

### 9-15. D-7 체크리스트 PDF 최종본 교체 (2026-11-11)

- 원본 `박사장클라쓰_오픈D-7체크리스트_최종.pdf` (원본자료 폴더) **한 개만** 복사해 `files/d7-checklist-sample.pdf` 에 덮어씀 → 링크 주소·다운로드 이름(`박사장클라쓰_오픈D-7체크리스트.pdf`)은 그대로. 원본과 바이트 비교 같음, 365,619 bytes, 2쪽.
- PDF 내용 확인: 대표 실명·연락처 없음 (호칭 "박사장"), 금지 문구 없음, 속성 정보는 Creator Chromium · Producer Skia 뿐.
- 화면 문구: `checklist-done.html` 파일 정보 "PDF · 임시 파일" → **"PDF · 2쪽"** (새 문구). H1 블록·헤드라인 A/B는 손대지 않음.
- 남은 임시 파일: `files/template-sample.pdf` (템플릿 구매 완료 화면의 "지금은 임시 파일이에요." 안내는 템플릿 PDF 이야기라 그대로 둠).

| 시험 (GA4·구글폼 차단, `block-analytics.js`) | PC 1440 | 모바일 375 |
|---|---|---|
| 다운로드 클릭 → 받은 파일 | 원본과 같음 · `%PDF-1.4` · 2쪽 | 같음 |
| 파일 응답 | 200 · `application/pdf` | 200 · `application/pdf` |
| `file_download` · `file_name` | `d7-checklist-sample.pdf` (그대로) | 같음 |
| 화면에 "임시/준비 중" 문구 | 없음 | 없음 |
| GA4·구글폼으로 나간 요청 | 0건 | 0건 |

- 헤드리스 브라우저에는 PDF 뷰어가 없어, 받은 파일을 pdf.js로 열어 2쪽이 그려지는지 확인 (근거 `captures/15-d7-download.png`).
- 배포 주소(`6f474c5` 배포본)에서도 PC·모바일 같은 결과. 단, **저장되는 파일 이름은 `d7-checklist-sample.pdf`** — Vercel이 `Content-Disposition: inline; filename="d7-checklist-sample.pdf"` 를 보내 HTML의 `download="박사장클라쓰_오픈D-7체크리스트.pdf"` 보다 우선한다 (로컬 서버에서는 한글 이름으로 저장). 이번 교체 전부터 같던 동작이며, 한글 이름으로 받게 하려면 `vercel.json` 헤더 설정이 필요하다 (사용자 결정).
- **→ 해결 (2026-11-11, `291bd1c`):** `vercel.json` 에서 이 PDF 경로에만 `Content-Disposition: attachment; filename="parksajang-class_open-D-7-checklist.pdf"; filename*=UTF-8''(한글 이름 인코딩)` 을 붙임. 배포 후 PC·모바일 모두 `박사장클라쓰_오픈D-7체크리스트.pdf` 로 저장 · 파일 같음 · 2쪽 · `file_name` 은 `d7-checklist-sample.pdf` 그대로 · GA 요청 0건. 다른 응답 헤더(`/`, `checklist-done.html`, `style.css`, `template-sample.pdf`, 사진, `robots.txt`)는 적용 전과 비교해 차이 없음.

### 9-16. 네이버 유입 진단 버튼 · 템플릿 샘플 미리보기 · 템플릿 데모 PDF (2026-11-11)

| 수정 | 내용 |
|---|---|
| UTM 2번 링크 | `docs/utm-links.md` 자영업 커뮤니티 → 랜딩 `/?utm_source=naver_cafe&utm_medium=community&utm_campaign=diagnosis` |
| 히어로 버튼 | 저장된 UTM의 `utm_campaign=diagnosis` 일 때만 주황 버튼 2개(같은 크기): 위 "무료 셀프 진단(10문항) 받기" → `diagnosis.html?from=hero` (`hero_diagnosis`) · 아래 "무료 D-7 체크리스트 받기" (`hero` 그대로). 이때 진단 글자 링크는 숨김. 히어로 CTA 직전 인라인 스크립트가 `<html data-entry="diagnosis">` 를 붙이고 CSS로만 전환 → 레이아웃 이동 없음 |
| 모바일 첫 화면 | 버튼 2개면 375px에서 두 번째 버튼 아래 끝이 840px(> 812), 412px에서 886px(> 823)로 넘쳐서, **이 유입에서만** 1023px 이하 사진 최대 폭을 300px로 줄임 (사진 비율·내용 그대로) |
| 템플릿 샘플 1장 | `checklist-done.html`(H1 블록 안) · `template.html` 의 회색 빈칸 → `images/site/tpl-sales.webp`(+png) `<picture>`, 1080×471, `loading="lazy"`, alt "매출 입력 시트 샘플 미리보기". 시트 비율 그대로(자르지 않음). H1 블록의 문구·구조는 그대로 |
| 템플릿 PDF | 원본자료 `박사장클라쓰_매장운영템플릿_데모.pdf` **한 개만** → `files/template-sample.pdf` 덮어씀 (바이트 같음, 437,456 bytes, 7쪽, 실명·연락처 없음). 링크 주소 그대로. `vercel.json` 에 이 경로만 저장 이름 "박사장클라쓰_매장운영템플릿_데모.pdf" (영문 대체 `parksajang-class_store-template_demo.pdf`) |
| 구매 완료 문구 | "지금은 임시 파일이에요." → "데모 버전(7쪽)이에요." |

- 템플릿 다운로드 버튼에는 원래 `file_download` 이벤트가 없다 (이벤트 표의 `file_download` 는 D-7 체크리스트 전용). 이번에도 새로 만들지 않음 → 바뀐 값 없음.

**시험 (로컬 서버, `block-analytics.js` · GA4·구글폼 요청 0건)**

| 항목 | PC 1440×900 | 모바일 375×812 | 모바일 412×823 |
|---|---|---|---|
| 네이버 유입 버튼 2개 (A·B안) | ✅ 진단 위 · 360×56 같은 크기 · 같은 주황 | ✅ 335×56 | ✅ 372×56 |
| 두 버튼 첫 화면 안 (아래 끝) | 591px | 796px | 796px |
| CLS (A·B안) | 0.0008 ~ 0.001 (기존 화면도 0.0009 · 버튼과 무관) | 0 | 0 |
| UTM 없이 다시 랜딩 (같은 탭) | 버튼 2개 유지 (저장된 UTM 기준) | 〃 | 〃 |
| 진단 버튼 클릭 | `click_cta` `hero_diagnosis` 1건 → `diagnosis.html?from=hero` | 〃 | 〃 |
| 체크리스트 버튼 클릭 | `click_cta` `hero` | | |
| 직접 방문 · 인스타 UTM | 기존 화면 그대로 (버튼 1개 + 진단 글자 링크) | 〃 | 〃 |
| 옛 링크 `diagnosis.html?utm…` | | 시작 화면 정상 · `start_diagnosis` `source: naver_cafe` | |
| 샘플 미리보기 (완료·상세) | `tpl-sales.webp` · 518×225 · 빈칸 0 | 333×144 | |
| 템플릿 PDF | 받은 파일 = 원본 · 문구 "데모 버전(7쪽)이에요." | 〃 | |

- 캡처: `captures/16-naver-hero.png`, `16-done-sample.png`, `16-template-pdf.png` (PC·모바일).
- **배포 후 (`562005b` 배포본) 같은 시험 다시 실행 → 전부 통과, GA4·구글폼 요청 0건.** 템플릿 PDF는 PC·모바일 모두 `박사장클라쓰_매장운영템플릿_데모.pdf` 로 저장, pdf.js로 7쪽 확인. 응답 헤더는 `template-sample.pdf` 의 `Content-Disposition` 한 줄만 바뀌고 나머지(`/`, 완료 화면, CSS, D-7 PDF, 사진, `robots.txt`)는 그대로.

### 9-17. 템플릿 구성 목록 6개 양식으로 정리 (2026-11-11)

- 데모 PDF 목차와 같은 6개·같은 순서: D-30 오픈 체크리스트 / 매출 입력 시트 / 주재료 재고·발주 시트 / 위생 점검표 / 요일별 청소 스케줄 / 알바 면접 질문지·교육 순서.
- 바꾼 곳: `template.html` (구성 목록 · 제목 "구성 4가지" → "구성 6가지" · meta description), `index.html` 가격표 칩, `diagnosis-result.html` 중 구간 추천 칩, `js/products.js` `includes`, 원문 `docs/landing-content.md` 4장 가격표 줄.
- 그대로: 가격 19,900원 / 3일 한정 14,900원, 신청 완료 화면(H1 블록 · 파일 변경 없음), 헤드라인(H3).
- **그대로 둔 것 (사용자 확인 필요):** 랜딩 FAQ 2개의 문장 속 "'알바 교육 매뉴얼'로 정리해 운영 템플릿에 담았습니다", "양식(재고·발주 시트, 위생 점검표, 알바 교육 매뉴얼)" — 목록이 아닌 FAQ 답변 문장이고 JSON-LD와 같이 바뀌어야 해서 손대지 않음. **→ 반영 (2026-11-11 사용자 요청):** "'알바 면접 질문지·교육 순서'로 정리해 …", "양식(매출 입력 시트, 주재료 재고·발주 시트, 위생 점검표, 요일별 청소 스케줄, 알바 면접 질문지·교육 순서)" — 화면 FAQ · `docs/landing-content.md` 5장 수정 후 `node scripts/build-jsonld.js` 로 FAQPage JSON-LD 다시 생성 (5개 답변 화면과 글자까지 같음 확인). `index.html` 금지 문구 0건.
- 시험 (로컬 서버, GA4·구글폼 차단 · 요청 0건): PC 1440 · 모바일 375 · 320px에서 세 페이지 모두 6개·순서 일치, 가격 표시 그대로, 가로 스크롤 없음.

### 9-18. 히어로 버튼 2개 전체 적용 + 지인 베타 테스트 링크 (2026-11-11)

- **히어로:** 9-16의 네이버 카페 유입 전용 방식을 **모든 방문자 기본**으로. 위 주황 "무료 셀프 진단(10문항) 받기"(`hero_diagnosis`) · 아래 주황 "무료 D-7 체크리스트 받기"(`hero`), 같은 크기. 유입 분기 스크립트(`data-entry`)와 진단 글자 링크("이미 장사 중이세요? …")는 HTML에서 없앰. 모바일·태블릿(1023px 이하) 히어로 사진 최대 폭 300px, PC 440px 그대로.
- 사진 `sizes`(preload·picture 3곳)를 새 폭에 맞춤: `(min-width: 1024px) 440px, (min-width: 340px) 300px, calc(100vw - 40px)` → 모바일은 그대로 `owner-hero-720.webp` 하나만 받음.
- 헤드라인 A/B(H3) 문구·구조, 완료 화면 제안(H1) 그대로. A·B안 버튼 같음.
- **GA4 해석 주의:** `hero_diagnosis` 값은 11-10 ~ 11-11에는 작은 글자 링크, 이후에는 주황 버튼 클릭이라 두 기간을 섞어 비교하지 않는다. 히어로가 A·B안 모두 똑같이 바뀌었으므로 H3 실험 자체의 비교 조건은 같지만, 바뀐 시점 전후로 전환율 기준선이 달라질 수 있다.
- **UTM:** `docs/utm-links.md` 맨 위에 "지인 베타 테스트용(2026-11-12~)" `/?utm_source=friends&utm_medium=referral&utm_campaign=beta_test` 추가 (채널 하나로 통일, 채널 비교는 가상 시나리오). 기존 5개는 "실제 운영 시 사용할 링크"로 제목만 바꾸고 그대로 둠.

| 시험 (로컬 서버, `block-analytics.js` · GA4·구글폼 요청 0건) | 결과 |
|---|---|
| 버튼 구성 (직접 방문 · 지인 베타 · 네이버 · 인스타 유입, A·B안) | 모두 같은 2개 · 진단 위 · 같은 크기·같은 주황 · 글자 링크 없음 |
| 첫 화면 안 (두 번째 버튼 아래 끝) | 375×812: 796px · 412×823: 796px · PC 1440×900: 591px |
| CLS | 모바일 375·412·320 · 태블릿 768: 0 / PC: 0.001 (원래 화면도 같은 값, 버튼과 무관) |
| 클릭 | 진단 버튼 → `click_cta` `hero_diagnosis` → `diagnosis.html?from=hero` · 체크리스트 버튼 → `hero` → `checklist.html` |
| 320px | 가로 스크롤 없음, 사진 280px (320×640 화면에선 두 번째 버튼이 첫 화면 아래 — 기준 375·412 외) |

- 캡처: `captures/16-hero-two-buttons.png` (PC 1440 · 모바일 375 · 412, 배포 주소).

### 9-19. 만족도 설문 선택 문항 4개 추가 (2026-11-11)

- `survey.html` (설문 종류 3개 모두 같은 화면) 기존 만족도·추천 아래에 선택 문항 4개: 3 현재상황 · 4 가장 도움된 자료 (글자 버튼 단일 선택, 2열 — 처음엔 PC 4열이었으나 좁은 카드에서 글자가 두 줄로 꺾여 PC도 2열로 고침) · 5 템플릿 구매 의향 1~5 (만족도와 같은 버튼) · 6 아쉬운 점 (textarea, 최대 500자, 글자 수 표시).
- 구글폼 entry: 현재상황 `entry.1216887730` · 도움된 자료 `entry.684959752` · 구매 의향 `entry.116918279` · 아쉬운 점 `entry.625266945` (`js/config.js`, 전체 표는 `docs/event-map.md`). 기존 5개 entry와 전송 방식(`fetch` no-cors POST) 그대로. **답하지 않은 선택 문항은 본문에서 뺌.**
- GA4 `submit_survey` 파라미터·GTM 그대로. 새 답변은 dataLayer 에 넣지 않음.
- 소요 시간 안내 문구는 원래 없어서 넣지 않음. 문항 수 표기만 사실대로: 설문 안내 "2문항이에요." → "6문항이에요(1·2번만 필수).", 완료 화면 3곳 링크 "(2문항)" → "(6문항)" (H1 블록 밖), 설문 meta description.
- 새로 쓴 문구: 문항 제목 "지금 어떤 상황이세요?", "가장 도움이 된 자료는 무엇인가요?", "아쉬운 점이 있었나요?", 번호 옆 "· 선택", 글자 수 "0 / 500자".

**시험 (로컬 서버, `block-analytics.js` + formResponse 요청을 가로채 본문만 기록하고 차단 → 실제 전송 0건, GA4 요청 0건)**

| 경우 | 구글폼 요청 본문 entry | GA4 `submit_survey` |
|---|---|---|
| 6문항 모두 답함 (checklist·live·purchase × PC·모바일·320) | 기존 5개 + 1216887730 "창업 관심만 있음" · 684959752 "매장 이야기·사진" · 116918279 "3" · 625266945 (600자 입력 → 500자, `& = + # %` 그대로) | `survey_type`·`satisfaction`·`recommend` 만 |
| 필수 2문항만 | 기존 5개만 (새 entry 없음) · 오류 없이 감사 화면 | 같음 |
| 필수 빈칸 | 요청 0건 · 오류 표시 2개 · 제출 안 됨 | 없음 |

- 모바일 375·320px 가로 스크롤·글자 잘림 없음. 캡처 `captures/16-survey-9questions-pc.png`, `16-survey-9questions-mobile.png` (화면 문항 6개 = 구글폼 entry 9개).

### 9-20. 사이트 밖 작업 기록 — GA4 내부 트래픽 · Looker · 지인 베타 테스트 (2026-11-11 밤 ~ 11-12, 사용자 작업 · 코드 변경 없음)

| 항목 | 내용 |
|---|---|
| GA4 내부 트래픽 | GTM `GTM-N4L8G2LB` **버전 5 "내부 트래픽 게시(집·사무실)"** 게시. 내부 트래픽 규칙 2개(박사장 pc · 박사장 집 — 사무실/집 IP 2개, 공개 레포라 주소는 적지 않음), GA4 데이터 필터 **Internal Traffic 활성**. 집 Wi-Fi 방문이 제외되는 것 확인 |
| Google 태그 자동 업그레이드 | 구글이 Google 태그를 컨테이너 `GTM-TW36J5ZK` 로 자동 업그레이드 → 같은 규칙으로 버전 2 게시. 이 컨테이너는 사이트에 설치돼 있지 않아 사이트 수집에는 영향 없음 (사이트는 `GTM-N4L8G2LB` 만 불러옴) |
| Looker Studio | 집계 시작일 **2026-11-12** 적용 · 설문 데이터 소스 재연결(구매 의향 평균, 9-19 새 문항) · 새 표 3개(응답자 현재 상황 · 가장 도움된 자료 · 아쉬운 점) · AEO 시트 기록일을 텍스트로 바꿔 날짜 필터 영향에서 제외 |
| 지인 베타 테스트 | **2026-11-12 시작**, 링크 1개 `/?utm_source=friends&utm_medium=referral&utm_campaign=beta_test` (`docs/utm-links.md`) |

- 집계 시작일을 11-12로 잡아, 9-11의 자동 시험 누수(11-09 ~ 11-11)와 그 전 내부 방문은 대시보드 숫자에서 빠진다.

### 9-21. 템플릿 데모 PDF 수정본 교체 (2026-11-12)

- 원본자료 `박사장클라쓰_매장운영템플릿_데모.pdf` 수정본(11-12) **한 개만** → `files/template-sample.pdf` 덮어씀 (원본과 바이트 같음, 438,329 bytes, 7쪽, 실명·연락처 없음). 링크·저장 이름·`vercel.json` 그대로.
- 2쪽 D-30 바뀐 점: D-30 ~ D-22 칸에 "보건증 발급 신청 (본인 먼저 · 알바는 채용 즉시)" (전에는 D-14 ~ D-8의 "보건증 발급 신청 (본인·알바)"), D-21 ~ D-15 칸에 "배달 대행사 알아보고 조건 비교 (기본료·거리 할증·배차 속도) → 오픈 전 계약" 추가.

### 9-22. 히어로 사진 수정본 (2026-11-12)

- 사용자 수정본(얼굴 흐림 위치 조정 · 앞치마 얼룩 정리) 6개로 교체, 코드 변경 없음: `owner-hero` 960×1200 · `-720` 720×900 · `-480` 480×600 (webp·jpg 모두 크기 확인). webp↔jpg 픽셀 평균 차이 2.6~3.5/255(압축 차이 수준) · 크기 간도 같은 그림, 얼굴 부분 원래 크기로 눈 확인 — 눈·코·입은 세 파일 모두 흐림(이전보다 흐림 범위가 작아 귀·머리선·턱 윤곽은 보임). EXIF·GPS·XMP 없음 (jpg 3개에 C2PA 출처 기록 "Claude provided this file…"만 있고 이름·위치 없음). 첫 화면(PC 1440 · 모바일 375·412, A·B안) 새 사진 표시 · 버튼 2개 첫 화면 안 · CLS 모바일 0 / PC 0.0008 (전과 같음) · GA4·구글폼 요청 0건. 캡처 `captures/16-hero-retouch-pc.png`, `16-hero-retouch-mobile.png`.
