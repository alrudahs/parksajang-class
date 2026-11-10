# images/

지금은 회색 자리표시 박스만 있습니다. 아래 이름으로 이미지를 넣고, HTML 주석(`<!-- 이미지 교체: ... -->`)에 적힌 대로 `.placeholder` 를 `<img>` 로 바꾸면 됩니다.

| 파일 | 쓰는 곳 | 권장 크기 |
|---|---|---|
| `hero.jpg` | index.html ① 히어로 대표 사진 / 매장 사진 | 1200×900 (4:3), 200KB 이하 |
| `form-preview.png` | index.html ④ 실제 쓰던 양식 미리보기 | 1200×750 (16:10), 200KB 이하 |
| `og.png` | 공유 미리보기 (6단계) | 1200×630 |

첫 화면 3초 기준(PageSpeed) 때문에 사진은 WebP/JPG로 압축해서 넣어주세요.

## site/ (2026-11-10 반영)

랜딩 ④ 숫자 섹션의 현장 사진 2장(`store-front`, `kitchen-line`)과 "실제 쓰던 양식 미리보기" 6장(`tpl-sales`, `tpl-stock`, `tpl-cleaning`, `tpl-hiring`, `floor-plan`, `container-shelf`). 각각 `.webp` + `.jpg`/`.png` 한 쌍이고 `index.html` 에서 `<picture>` 로 씁니다. 그래서 위 `form-preview.png` 자리는 더 쓰지 않습니다. 간판·민감 정보는 가린 상태로 넣었으니 바꿀 때도 가린 파일로 교체하세요.
