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

- 정보 이름은 중복을 빼면 16개입니다.
- `page_view` 는 이미 있는 Google 태그가 보내므로 코드에서 push 하지 않고, 트리거에서도 뺐습니다.
- `eventCallback`, `eventTimeout` 은 페이지 이동을 기다리는 GTM 제어값이라 GA4로 보내지 않습니다.
- `exp_headline`, `exp_done_offer` 는 이벤트 없이 push 되는 실험 그룹 값이라 이 파일에 넣지 않았습니다 (`docs/event-map.md` 2장).

## 2. 파일에 들어 있는 것

| 종류 | 이름 | 내용 |
|---|---|---|
| 태그 (1개) | `GA4 이벤트` | 측정 ID `G-8FTGPCLPTM`, 이벤트 이름 `{{Event}}`, 이벤트 매개변수 16개 |
| 트리거 (1개) | `CE - 박사장 이벤트 10개` | 맞춤 이벤트, 정규식으로 위 10개 이벤트를 묶음 |
| 변수 (16개) | `DLV - 정보이름` | 데이터 영역 변수 (버전 2) |

이미 있는 태그 `Google Analytics G-8FTGPCLPTM` 은 파일에 없어서 변경되지 않습니다.

## 3. GTM에서 가져오는 순서

1. [tagmanager.google.com](https://tagmanager.google.com) 에서 컨테이너 `GTM-N4L8G2LB` 를 엽니다.
2. 위쪽 **관리자** 탭을 누릅니다.
3. 컨테이너 항목의 **컨테이너 가져오기**를 누릅니다.
4. **컨테이너 파일 선택**에서 `docs/gtm/gtm-import.json` 을 고릅니다.
5. 작업공간은 **기존**을 고르고 `Default Workspace` 를 선택합니다.
6. 가져오기 옵션은 **병합**을 고릅니다.
7. 충돌 처리는 **충돌하는 태그, 트리거, 변수의 이름 변경**을 고릅니다.
8. 미리보기에서 **새 항목이 태그 1 · 트리거 1 · 변수 16** 인지, **수정·삭제가 0** 인지 봅니다. 다르면 확인을 누르지 말고 멈춥니다.
9. **확인**을 누릅니다.
10. 태그 목록에 `Google Analytics G-8FTGPCLPTM` 과 `GA4 이벤트` 가 함께 있는지 봅니다.

## 4. 게시 전 확인

1. GTM 오른쪽 위 **미리보기**를 누르고 `https://parksajang-class.vercel.app` 을 연결합니다.
2. 경로 A를 따라가며 `click_cta`, `generate_lead`, `file_download`, `view_item`, `begin_checkout`, `purchase` 에서 `GA4 이벤트` 태그가 실행되는지 봅니다.
3. GA4 **관리 → DebugView** 에서 이벤트 이름과 매개변수가 들어오는지 봅니다.
4. 이상 없으면 GTM **제출 → 게시**를 누릅니다.

## 5. 알아둘 점

- **`file_download` 중복:** GA4 향상된 측정의 "파일 다운로드"가 켜져 있으면 PDF 클릭이 자동으로도 수집되어 2번 잡힙니다. GA4 **관리 → 데이터 스트림 → 향상된 측정**에서 "파일 다운로드"를 끕니다.
- **같은 페이지의 값 유지:** 데이터 영역 값은 페이지를 옮기기 전까지 남습니다. 예를 들어 `diagnosis.html` 의 `complete_diagnosis` 에는 앞서 나간 `source` 도 함께 붙습니다. 이벤트 수와 금액에는 영향이 없고, 매개변수를 볼 때만 참고하면 됩니다.
- **GA4 보고서:** 표준 보고서에서 `button_position` 같은 값을 보려면 GA4 **관리 → 맞춤 정의**에 맞춤 측정기준으로 등록합니다. 등록 전 데이터에는 소급되지 않습니다.
