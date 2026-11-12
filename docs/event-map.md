# 박사장 클라쓰 · 이벤트 지도 (어떤 페이지의 어떤 행동에서 어떤 이벤트가 나가는지)

> 기준: `docs/landing-content.md` 7장 "GA4 이벤트" 표. 이벤트 이름·파라미터는 표와 똑같다.
> 모든 이벤트는 `js/tracking.js` 의 `PSC.events.*` → `PSC.track()` → `window.dataLayer.push` 로 나간다.
> 개인정보(이름·연락처)는 어떤 이벤트에도 넣지 않는다.

## 1. 이벤트 지도

| 경로 | 페이지 | 고객 행동 | 이벤트 | 함께 보내는 정보 (예시 값) | 코드 위치 |
|---|---|---|---|---|---|
| 공통 | 모든 페이지 | 페이지 열람 | `page_view` | 페이지 주소·유입 경로 (GTM GA4 구성 태그가 **자동** 전송, 코드에서 push 안 함) | GTM |
| A | `index.html` | 히어로 아래 주황 버튼 "무료 D-7 체크리스트 받기" 클릭 | `click_cta` | `button_position: "hero"` | `js/landing.js` |
| A | `index.html` | 최종 CTA "무료 D-7 체크리스트 받기" 클릭 | `click_cta` | `button_position: "bottom"` | `js/landing.js` |
| B | `index.html` | 히어로 위 주황 버튼 "무료 셀프 진단(10문항) 받기" 클릭 (→ `diagnosis.html?from=hero`) · 모든 방문자 (2026-11-11). 그 전에는 같은 값을 보조 글자 링크 "이미 장사 중이세요? …"가 썼음 (11-10 ~ 11-11, 링크는 없앰) | `click_cta` | `button_position: "hero_diagnosis"` | `js/landing.js` |
| ~~A~~ | `index.html` | ~~"어느 쪽이세요?" 카드 · 오픈 준비 중이에요~~ — **2026-11-12 섹션 삭제** (히어로 버튼 위 라벨 "곧 오픈해요"가 대신함). 11-10 ~ 11-12 데이터만 남음 | `click_cta` | `button_position: "split_open"` (더 이상 안 나감) | — |
| ~~B~~ | `index.html` | ~~"어느 쪽이세요?" 카드 · 이미 운영 중이에요~~ — **2026-11-12 섹션 삭제** (라벨 "이미 장사 중이에요"가 대신함) | `click_cta` | `button_position: "split_running"` (더 이상 안 나감) | — |
| A | `checklist.html` | 이름·연락처 입력 후 신청 (빈칸이면 안 나감) | `generate_lead` | `lead_type: "checklist"`, `marketing_consent: true/false` | `js/checklist.js` |
| A | `checklist-done.html` | "체크리스트 다운로드" 클릭 | `file_download` | `file_name: "d7-checklist-sample.pdf"` | `js/checklist.js` |
| A | `template.html` | 운영 템플릿 상세 열람 | `view_item` | `item_name: "매장 운영 템플릿"`, `price: 14900`(할인 기간) / `19900`, `currency: "KRW"` | `js/shop.js` |
| A | `kit.html` | 오픈 올인원 키트 상세 열람 (2026-11-12 새 페이지 · 랜딩 가격표 키트 카드·템플릿 상세에서 연결) | `view_item` | `item_name: "오픈 올인원 키트"`, `price: 69000`, `currency: "KRW"` | `js/shop.js` |
| A | `checkout.html?item=kit` → `order-complete.html` | 키트 주문서 진입 → 결제하기(데모) | `begin_checkout` → `purchase` | `item_name: "오픈 올인원 키트"`, `value: 69000`, `discount_applied: false`, `currency: "KRW"` · 새 이벤트 이름 없음, GTM 변경 없음 | `js/shop.js` |
| A·C | `checkout.html?item=…` | 주문서 진입 | `begin_checkout` | `item_name`, `value: 14900`, `discount_applied: true`, `currency: "KRW"` | `js/shop.js` |
| A·C | `order-complete.html` | 결제하기(데모) 후 완료 화면 | `purchase` | `transaction_id: "DEMO-20261105-XXXX"`, `item_name`, `value`, `currency: "KRW"` | `js/shop.js` |
| B | `diagnosis.html` | "진단 시작하기" → 1번 문항 표시 | `start_diagnosis` | `source: "naver_cafe"` (저장된 utm_source, 없으면 `"direct"`) | `js/diagnosis.js` |
| B | `diagnosis.html` | 10번째 문항 응답 | `complete_diagnosis` | `score_band: "high" / "mid" / "low"` | `js/diagnosis.js` |
| B | `diagnosis.html` | 결과 미리보기에서 연락처 등록 | `generate_lead` | `lead_type: "diagnosis"`, `marketing_consent` | `js/diagnosis.js` |
| C | `live.html` | 무료 Zoom 라이브 신청 | `register_live` | `live_round: "2026-11"` | `js/path-c.js` |
| C | `consult.html` | 날짜·시간·대상 고르고 15분 상담 예약 | `generate_lead` | `lead_type: "consult"`, `marketing_consent` (앞 화면 동의 여부, 없으면 false) | `js/path-c.js` |
| C | `coaching.html?type=open` | 1:1 Zoom 코칭 상세 열람 | `view_item` | `item_name: "1:1 Zoom 코칭"`, `price: 200000`, `currency: "KRW"` | `js/path-c.js` |
| C | `coaching.html?type=operate` | 프리미엄 컨설팅 상세 열람 | `view_item` | `item_name: "프리미엄 1주 집중 현장 컨설팅"`, `price: 4500000`, `currency: "KRW"` | `js/path-c.js` |
| 공통 | `survey.html?type=…` | 필수 2문항(만족도·추천) 고르고 제출 (빈칸이면 안 나감) · 선택 4문항은 GA4로 보내지 않음 | `submit_survey` | `survey_type: "checklist" / "live" / "purchase"`, `satisfaction: 1~5`, `recommend: 0~10` (2026-11-11 문항 추가 후에도 그대로) | `js/survey.js` |

### 만족도 설문 → 구글폼 entry (GA4 아님 · `js/config.js` `surveyForm.entries`)

| 문항 | 값 | entry | 비고 |
|---|---|---|---|
| (숨김) 설문 종류 | `checklist` / `live` / `purchase` | `entry.1255429821` | 필수 |
| 1 만족도 | 1~5 | `entry.1629520359` | 필수 |
| 2 추천 의향 | 0~10 | `entry.370164772` | 필수 |
| (숨김) 헤드라인 실험 그룹 | `a` / `b` / 빈칸 | `entry.710186266` | |
| (숨김) 완료 화면 실험 그룹 | `on` / `off` / 빈칸 | `entry.641282472` | |
| 3 현재상황 | 오픈 준비 중 / 운영 중 / 창업 관심만 있음 / 해당 없음 (고른 글자 그대로) | `entry.1216887730` | 선택 · 2026-11-11 추가 · 안 고르면 안 보냄 |
| 4 가장 도움된 자료 | D-7 체크리스트 / 셀프 진단 / 템플릿 미리보기 / 매장 이야기·사진 | `entry.684959752` | 선택 · 〃 |
| 5 템플릿 구매 의향 | 1~5 | `entry.116918279` | 선택 · 〃 |
| 6 아쉬운 점 | 자유 서술 최대 500자 | `entry.625266945` | 선택 · 〃 · **구글폼에만 저장, GA4·dataLayer 로 보내지 않음** |

## 2. 이벤트가 아닌 값 (실험 그룹 · GTM 변수로 사용)

| 페이지 | 값 | 설명 |
|---|---|---|
| `index.html` | `exp_headline: "a" / "b"` | H3 히어로 헤드라인 A/B (`?v=b`) |
| `checklist-done.html` | `exp_done_offer: "on" / "off"` | H1 템플릿 샘플 + 3일 할인 배너 (`?offer=off`) |

`js/tracking.js` 가 GTM을 켜기 전에 그룹을 정해 dataLayer에 먼저 넣고, `sessionStorage` 에 저장해 이후 모든 페이지의 모든 이벤트에 함께 보낸다. 배정은 `localStorage` 에 남아 같은 사람은 같은 그룹을 본다. GA4 연결과 맞춤 측정기준은 `docs/gtm/README.md` 6·7장.

## 3. 규칙

- **금액**: `price`·`value` 는 원 단위 숫자(콤마 없음). 금액 이벤트에는 `currency: "KRW"` 를 함께 보낸다 (GA4 금액 집계 요구사항).
- **중복 방지**: `purchase` 는 같은 `transaction_id` 로 한 번만. `view_item`·`begin_checkout` 은 새로고침이면 다시 보내지 않는다. `click_cta` 는 같은 버튼을 다음 화면으로 넘어가기 전에 다시 눌러도 다시 보내지 않는다 (Ctrl 클릭 새 탭은 클릭마다 전송). 폼의 `generate_lead`·`register_live` 도 다음 화면으로 넘어가기 전 연타는 1번만 보낸다 (`PSC.submitOnce`, 뒤로 가기로 돌아와 다시 제출하면 새로 보냄).
- **이동 직전 이벤트**: `click_cta`·`generate_lead`·`register_live` 는 GTM 전송을 최대 0.8초 기다렸다가 다음 화면으로 넘어간다.
- **UTM**: 첫 방문 주소의 `utm_source/medium/campaign` 을 소문자로 이 탭 동안 저장 (`start_diagnosis` 의 `source` 에 사용).
- **목록 밖 이벤트 금지**: `tracking.js` 에 없는 이름을 보내면 콘솔 경고만 남기고 보내지 않는다.

## 4. 확인 방법

1. 아무 페이지 주소 뒤에 `?debug=1` → 오른쪽 아래 "dataLayer 이벤트 로그" 상자가 뜨고, 콘솔에도 찍힌다. 페이지를 넘어가도 유지 (`?debug=0` 으로 끔).
2. GTM 컨테이너를 만든 뒤 `js/config.js` 의 `gtmId` 를 실제 ID로 바꾸면 GTM 이 불러와진다 (자리표시 `GTM-XXXXXXX` 동안은 불러오지 않음).
3. GTM 미리보기 모드 → GA4 DebugView 에서 위 표의 이벤트가 순서대로 들어오는지 확인.
4. 경로 A 자동 확인: `node scripts/capture-path-a.js 07` (각 화면을 이벤트 로그와 함께 캡처).

## 5. GTM 설정 (컨테이너 `GTM-N4L8G2LB` · GA4 측정 ID `G-8FTGPCLPTM`)

사이트 코드에는 GA4를 따로 심지 않고 GTM으로만 보낸다.

- 태그: `Google Analytics G-8FTGPCLPTM` (Initialization - All Pages) — page_view 자동, GTM 버전 2로 게시됨
- 태그: `GA4 이벤트` 1개 (이벤트 이름 `{{Event}}`), 트리거는 맞춤 이벤트 정규식으로 `click_cta` ~ `submit_survey` 10개를 묶음
- 데이터 영역 변수 18개: `button_position`, `lead_type`, `marketing_consent`, `file_name`, `item_name`, `price`, `value`, `currency`, `discount_applied`, `transaction_id`, `source`, `score_band`, `live_round`, `survey_type`, `satisfaction`, `recommend`, `exp_headline`, `exp_done_offer`
- 가져오기 파일과 방법: `docs/gtm/gtm-import.json`, `docs/gtm/README.md`
- GA4 향상된 측정의 "파일 다운로드"는 끈다 (`file_download` 중복 방지 · 2026-11-09 처리).
- **GTM 버전 5 "내부 트래픽 게시(집·사무실)"** (2026-11-11 밤 게시): 내부 트래픽 규칙 2개(박사장 pc · 박사장 집, 사무실/집 IP 2개) + GA4 데이터 필터 Internal Traffic 활성 → 집 Wi-Fi 방문 제외 확인. 이벤트·변수·트리거는 그대로. 자세히는 `docs/qa-report.md` 9-20.
