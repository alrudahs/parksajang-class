# GTM 설정 가져오기 안내

- GTM 컨테이너: `GTM-N4L8G2LB`
- GA4 측정 ID: `G-8FTGPCLPTM`
- 가져올 파일: `docs/gtm/gtm-import.json`

사이트 코드에는 GA4를 따로 심지 않고, GTM으로만 보냅니다.

## 1. 실제로 push 되는 이벤트와 함께 보내는 정보

기준: `js/tracking.js` 의 `PSC.events.*`

| 이벤트 | 함께 보내는 정보 |
|---|---|
| `click_cta` | `button_position` |
| `generate_lead` | `lead_type`, `marketing_consent` |
| `file_download` | `file_name` |
| `view_item` | `item_name`, `price`, `currency` |
| `begin_checkout` | `item_name`, `value`, `discount_applied`, `currency` |
| `purchase` | `transaction_id`, `item_name`, `value`, `currency` |
| `start_diagnosis` | `source` |
| `complete_diagnosis` | `score_band` |
| `register_live` | `live_round` |
| `submit_survey` | `survey_type`, `satisfaction`, `recommend` |

- 이벤트에 함께 보내는 정보 이름은 중복을 빼면 16개이고, 아래 실험 그룹 값 2개를 더해 GA4로 보내는 매개변수는 18개입니다.
- `page_view` 는 이미 있는 Google 태그가 보내므로 코드에서 push 하지 않고, 트리거에서도 뺐습니다.
- `eventCallback`, `eventTimeout` 은 페이지 이동을 기다리는 GTM 제어값이라 GA4로 보내지 않습니다.
- `exp_headline`(H3), `exp_done_offer`(H1)는 실험 그룹 값입니다. GTM이 켜지기 전에 dataLayer에 먼저 들어가고, 위 10개 이벤트 모두에 함께 붙어 나갑니다 (6장).

## 2. 파일에 들어 있는 것

| 종류 | 이름 | 내용 |
|---|---|---|
| 태그 (1개) | `GA4 이벤트` | 측정 ID `G-8FTGPCLPTM`, 이벤트 이름 `{{Event}}`, 이벤트 매개변수 18개 |
| 트리거 (1개) | `CE - 박사장 이벤트 10개` | 맞춤 이벤트, 정규식으로 위 10개 이벤트를 묶음 |
| 변수 (18개) | `DLV - 정보이름` | 데이터 영역 변수 (버전 2) |

이미 있는 태그 `Google Analytics G-8FTGPCLPTM` 은 파일에 없어서 변경되지 않습니다.

## 3. GTM에서 가져오는 순서

1. [tagmanager.google.com](https://tagmanager.google.com) 에서 컨테이너 `GTM-N4L8G2LB` 를 엽니다.
2. 위쪽 **관리자** 탭을 누릅니다.
3. 컨테이너 항목의 **컨테이너 가져오기**를 누릅니다.
4. **컨테이너 파일 선택**에서 `docs/gtm/gtm-import.json` 을 고릅니다.
5. 작업공간은 **기존**을 고르고 `Default Workspace` 를 선택합니다.
6. 가져오기 옵션은 **병합**을 고릅니다.
7. 충돌 처리는 **충돌하는 태그, 트리거, 변수의 이름 변경**을 고릅니다.
8. 미리보기에서 **새 항목이 태그 1 · 트리거 1 · 변수 18** 인지, **수정·삭제가 0** 인지 봅니다. 다르면 확인을 누르지 말고 멈춥니다. (이전 16개 버전을 가져온 적이 없을 때의 숫자입니다.)
9. **확인**을 누릅니다.
10. 태그 목록에 `Google Analytics G-8FTGPCLPTM` 과 `GA4 이벤트` 가 함께 있는지 봅니다.

## 4. 게시 전 확인

1. GTM 오른쪽 위 **미리보기**를 누르고 `https://parksajang-class.vercel.app` 을 연결합니다.
2. 경로 A를 따라가며 `click_cta`, `generate_lead`, `file_download`, `view_item`, `begin_checkout`, `purchase` 에서 `GA4 이벤트` 태그가 실행되는지 봅니다.
3. GA4 **관리 → DebugView** 에서 이벤트 이름과 매개변수가 들어오는지 봅니다.
4. 이상 없으면 GTM **제출 → 게시**를 누릅니다.

## 5. 알아둘 점

- **`file_download` 중복 방지:** GA4 향상된 측정의 "파일 다운로드"를 **껐습니다** (2026-11-09 사용자 처리). 켜져 있으면 PDF 클릭이 자동으로도 수집되어 2번 잡힙니다. 이 설정은 끈 상태로 유지합니다.
- **같은 페이지의 값 유지:** 데이터 영역 값은 페이지를 옮기기 전까지 남습니다. 예를 들어 `diagnosis.html` 의 `complete_diagnosis` 에는 앞서 나간 `source` 도 함께 붙습니다. 이벤트 수와 금액에는 영향이 없고, 매개변수를 볼 때만 참고하면 됩니다.
- **GA4 보고서:** 표준 보고서에서 `button_position` 같은 값을 보려면 6장과 같은 방법으로 맞춤 측정기준에 등록합니다.

## 6. A/B 그룹을 GA4에서 보기 (맞춤 측정기준)

✅ **완료** (2026-11-09 등록 · 근거 `captures/11-ga4-custom-dimensions.png`)

GA4 **관리 → 데이터 표시 → 맞춤 정의 → 맞춤 측정기준 만들기**에서 아래 2개를 만듭니다.

| 측정기준 이름 | 범위 | 이벤트 매개변수 | 값 | 가설 |
|---|---|---|---|---|
| `실험 헤드라인` | 이벤트 | `exp_headline` | `a` / `b` | H3 |
| `실험 완료화면 제안` | 이벤트 | `exp_done_offer` | `on` / `off` | H1 |

- 등록한 뒤 들어오는 데이터부터 보이고, 이전 데이터에는 소급되지 않습니다. 보고서에 나타나기까지 최대 24~48시간 걸릴 수 있습니다.

### 그룹 값이 붙는 범위

| 값 | 정해지는 페이지 | 그 뒤 값이 붙는 이벤트 |
|---|---|---|
| `exp_headline` | `index.html` | 같은 탭에서 나가는 10개 이벤트 전부 (`generate_lead`, `purchase` 포함) |
| `exp_done_offer` | `checklist-done.html` | 그 페이지 이후 같은 탭에서 나가는 이벤트 |

- 그룹 배정은 `localStorage` 에 남아 같은 사람은 같은 그룹을 계속 봅니다. 이벤트에 붙일 값은 `sessionStorage` 에 저장합니다.
- `js/config.js` 의 `abTest.enabled` 가 `true` 라 H3와 H1이 **둘 다** 방문자별로 50:50 나뉩니다.
- `?v=a|b`, `?offer=on|off` 는 그 화면만 강제로 바꾸고 저장된 그룹은 바꾸지 않습니다.
- 랜딩을 거치지 않고 다른 페이지로 바로 들어온 방문자의 이벤트에는 `exp_headline` 이 붙지 않습니다.

## 7. 노출 수를 위해 기존 Google 태그 고치기 (직접 작업)

`page_view` 에 `exp_headline` 을 붙이는 일은 **가져오기 파일로 할 수 없고, GTM에서 직접 고쳐야 합니다.** 기존 태그를 파일에 넣으면, "병합 · 이름 변경" 가져오기에서 같은 태그가 하나 더 생겨 `page_view` 가 2번 나갈 수 있기 때문입니다.

3장 가져오기로 `DLV - exp_headline` 변수를 만든 뒤 진행합니다.

1. GTM **작업공간 → 태그**에서 `Google Analytics G-8FTGPCLPTM` 을 엽니다.
2. **태그 구성** 영역을 눌러 편집합니다.
3. ✅ 완료 — **구성 설정**(Configuration settings)을 펼치고 **매개변수 추가**(Add parameter)를 누릅니다.
4. ✅ 완료 — **구성 매개변수**에 `exp_headline` 을 입력합니다.
5. ✅ 완료 — **값** 오른쪽 블록 아이콘을 눌러 `DLV - exp_headline` 을 고릅니다. (`exp_done_offer` · `DLV - exp_done_offer` 도 추가, GTM 버전 4 · 근거 `captures/11-gtm-google-tag-v2.png`)
6. 트리거 `Initialization - All Pages` 는 그대로 두고 **저장**을 누릅니다.
7. **미리보기**로 `https://parksajang-class.vercel.app/?v=b` 를 연결합니다.
8. 왼쪽 **Initialization** 단계를 눌러 Google 태그가 실행됐는지, **변수** 탭의 `DLV - exp_headline` 이 `b` 인지 봅니다.
9. GA4 **DebugView**의 `page_view` 매개변수에 `exp_headline` 이 있는지 봅니다. 없으면 게시하지 말고 멈춥니다. ✅ `exp_done_offer` 완료 — `checklist-done.html?offer=on` 에서 `exp_done_offer` = `on` 수신 확인 (근거 `captures/11-debugview-pageview-offer.png`)
10. 이상 없으면 **제출 → 게시**를 누릅니다.

### GA4에서 H3 비교하기

GA4 **탐색 분석**에서 측정기준 `실험 헤드라인` 으로 나눠 봅니다.

| 비교 값 | 설정 |
|---|---|
| 노출 | 이벤트 `page_view` + 페이지 경로 `/` 또는 `/index.html` 만 필터 |
| 클릭 | 이벤트 `click_cta` |
| 신청 | 이벤트 `generate_lead` |
| 구매 | 이벤트 `purchase` |

`exp_headline` 은 다음 페이지의 `page_view` 에도 붙으므로, 노출을 셀 때는 페이지 경로 필터가 필요합니다.

## 8. 실험 분석 원칙

H1과 H3는 **각각 따로 무작위 배정**되므로(2026-11-09 사용자 결정), 결과도 **실험별로 따로** 분석합니다. 한 보고서에 두 측정기준을 함께 넣어 조합별로 나누지 않습니다. H1은 가이드북 4-5 검증 계획의 1순위입니다.

| 실험 | 나눌 측정기준 | 대상 | 노출 | 이후 행동 |
|---|---|---|---|---|
| H1 완료 화면 배너 | `실험 완료화면 제안` (`on` / `off`) | 신청 완료 화면을 본 방문자 | `page_view` + 페이지 경로 `/checklist-done.html` | `view_item`, `begin_checkout`, `purchase` |
| H3 헤드라인 | `실험 헤드라인` (`a` / `b`) | 랜딩을 본 방문자 | `page_view` + 페이지 경로 `/` 또는 `/index.html` | `click_cta`, `generate_lead`, `purchase` |

- **H1 노출 수에 필요한 `exp_done_offer` · `DLV - exp_done_offer` 는 Google 태그에 추가했습니다** (GTM 버전 4, 7장 3~5번). 이 설정이 없으면 `page_view` 에 H1 그룹이 없어 노출 수를 나눌 수 없습니다.
- `generate_lead` (체크리스트 신청)는 완료 화면보다 먼저 나가므로 H1 그룹이 붙지 않습니다. H1의 결과 지표로 쓰지 않습니다.
- 발표 시연처럼 그룹을 일부러 고정한 방문은 실험 데이터에 섞일 수 있습니다 (`docs/demo-checklist.md`).
