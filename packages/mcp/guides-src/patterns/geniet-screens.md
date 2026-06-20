---
metrics:
  project: geniet (헬시밀·다이어트 식단 커머스 — 샐러드/도시락)
  homeWeb: "데스크탑 — 상단 글로벌 nav + 검색 → cream 히어로 프로모 배너 → '랭킹' 음식 카드 그리드(4-up 행, 썸네일+제목+가격+프로젝트 배지) 섹션 반복 → 전문가 칼럼/매거진 카드 → 푸터"
  reviewAppDetail: "모바일 — 음식 사진 히어로 → 리뷰 본문 → 연관 상품 카드(2~3-up 썸네일+가격) → 텍스트 리뷰 list"
  reviewWebModal: "웹 — '전체 음식 리뷰' list(음식 사진 + 리뷰 텍스트 카드) 위에 '리뷰 작성' Modal: 음식 검색 → 사진/영상 업로드 → 별점 → 목적/시간대(선택 Chip) → 조리방식(checkbox) → 등록 CTA"
  card: "음식 카드 = 정사각 썸네일 + 제목 2줄 + 가격 + 프로젝트/할인 배지. 그리드는 4-up(web) 반복 랭킹 섹션."
  accent: 청록(teal) 브랜드 컬러 — 로고/CTA/링크. 식품 사진이 주인공이라 UI 채도는 낮게.
  status: 스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). 정확한 색/여백/치수 토큰은 component 가이드 + 프로젝트 토큰이 SSOT.
references:
  - label: "Geniet 웹 홈 — 헬시밀 커머스 (desktop)"
    image: references/geniet-web-home.png
    caption: "상단 글로벌 nav + 검색, cream 히어로 프로모 배너, 음식 카드 4-up 랭킹 섹션 반복, 전문가 매거진 카드, 푸터."
    project: geniet
  - label: "Geniet 앱 리뷰 상세 — 후기 (mobile)"
    image: references/geniet-app-review-detail.png
    caption: "음식 사진 히어로 → 리뷰 본문 → 연관 상품 카드 → 텍스트 리뷰 list 의 모바일 후기 상세."
    project: geniet
  - label: "Geniet 웹 리뷰 작성 모달 (desktop)"
    image: references/geniet-web-review-modal.png
    caption: "'전체 음식 리뷰' list 위 '리뷰 작성' Modal — 음식 검색·사진 업로드·별점·목적/시간대 Chip·조리방식 checkbox·등록 CTA."
    project: geniet
---

## summary

Geniet(헬시밀·다이어트 식단 커머스) 화면의 **시각 레퍼런스 카탈로그** — 웹 홈 / 앱 리뷰 상세 / 웹 리뷰 작성 모달 3종 스크린샷을 담는다. Geniet 은 샐러드·도시락 같은 식품 사진이 주인공이라 UI 채도는 낮추고 청록(teal) 브랜드 컬러를 로고·CTA·링크에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷들을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 해당 `component:*` 가이드와 프로젝트 토큰을 SSOT 로 따른다.

## rules

- **음식 카드 그리드 = '카드 1장 = 상품 1건'.** 정사각 썸네일 + 제목(2줄) + 가격 + 프로젝트/할인 배지. 웹 홈은 이 카드를 4-up 행으로 묶은 '랭킹' 섹션을 반복한다 → 섹션 컨테이너는 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합.
- **리뷰는 `pattern:review-list` 를 따른다** — '카드 1장 = 리뷰 1건'(`ReviewCard`), 도움돼요/별점/신고는 카드 `footer` 슬롯, 더보기는 리스트 `footer`. 앱 리뷰 상세·웹 리뷰 list 둘 다 동일.
- **리뷰 작성은 Modal + 폼 패턴.** 음식 검색(Input) → 사진/영상 업로드 → 별점 → 목적·시간대는 **단일/다중 선택 `Chip`**(토글), 조리방식은 **`checkbox` list**, 하단 등록 CTA 1개. → `pattern:multi-step-form` / `selection-controls` / `component:Chip` 정합. 모달 본문만 스크롤(`popover-portal-and-modal-scroll`).
- **브랜드 컬러는 토큰으로만.** 청록 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지(`get_guide({ topic: 'principles' })`).
- **사진이 주인공** — 카드/히어로의 시각 무게는 식품 사진이 갖고, 텍스트·버튼 UI 는 보조. primary solid CTA 는 화면당 최소화(`pattern:cta-group`).
- 새 Geniet 화면 작업 전 이 카탈로그의 해당 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트).

## avoid

- 스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 component 가이드 + 프로젝트 토큰이 SSOT(어긋나면 토큰이 우선).
- 음식 카드를 `ListItem` 의 leading/title row 로 욱여넣기 — 썸네일+제목+가격+배지 카드는 `Card`/상품 카드. (리뷰는 `ReviewCard`)
- 리뷰 작성 모달의 목적/시간대 선택을 라디오/드롭다운으로 치환 — 토글형 다중·단일 선택은 `Chip`.
- 청록 accent 를 UI 전반에 칠하기 — 식품 사진 채도와 충돌. accent 는 로고·CTA·링크 한정.
- Geniet 전용이라며 컴포넌트에 `[data-project="geniet"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙).
