---
metrics:
  project: trost (심리상담·멘탈케어 EAP — 상담/콘텐츠/칼럼)
  homeWeb: "데스크탑 — 상단 헤더(Trost. 로고 + nav + 검색) → 사진 배경 다크 히어로 배너(헤드라인 + 검색) → 추천 심리상담/인기글 2카드 → 'ASMR plus' 등 콘텐츠 미디어 카드 그리드 → 마음 안내 배너 → 카테고리 아이콘 그리드 → 인기 칼럼/상담사 칼럼 카드 → 푸터"
  card: "콘텐츠/칼럼 카드 = 썸네일(미디어/사진) + 제목 + 메타. 미디어 카드는 play 오버레이. 카테고리는 아이콘 + 라벨 그리드."
  accent: 블루 브랜드 컬러 — 로고/CTA/링크/배너. 다크 히어로는 사진 위 white 텍스트.
  status: "스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). Trost 웹은 Zeplin 이 디자인 SSOT — 정확한 색/여백/치수는 Zeplin + 프로젝트 토큰."
figmaNodeUrl: https://zpl.io/Dp775xl
references:
  - label: "Trost 웹 홈 — 심리상담·멘탈케어 (desktop)"
    image: references/trost-web-home.png
    caption: "헤더 + 다크 히어로 배너 → 추천 상담/인기글 카드 → 콘텐츠 미디어 카드 그리드 → 마음 안내 배너 → 카테고리 아이콘 그리드 → 칼럼 카드 → 푸터. (Zeplin SSOT zpl.io/Dp775xl)"
    project: trost
---

## summary

Trost(심리상담·멘탈케어 EAP) 웹 홈의 **시각 레퍼런스 카탈로그** — 사진 배경 다크 히어로 + 콘텐츠/칼럼 카드 그리드 구조의 데스크탑 홈 스크린샷을 담는다. Trost 웹은 **Zeplin 이 디자인 SSOT**(zpl.io/Dp775xl)이고, 블루 브랜드 컬러를 로고·CTA·링크·배너에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 Zeplin 과 프로젝트 토큰을 SSOT 로 따른다.

## rules

- **콘텐츠/칼럼 카드 그리드 = '카드 1장 = 콘텐츠 1건'.** 썸네일(미디어/사진) + 제목 + 메타. 섹션마다 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합. 미디어(ASMR 등) 카드는 play 오버레이.
- **다크 히어로 배너**는 사진 배경 + white 텍스트 + 검색/CTA. 본문(라이트) 과 대비되는 진입 영역 — 색은 토큰(`--semantic-*`)으로, 사진 위 텍스트 대비 확보(`get_guide({ topic: 'principles' })` 접근성).
- **카테고리는 아이콘 + 라벨 그리드** — 균일 셀의 quick-action 성격(`pattern:quick-action-grid` 정합). 아이콘은 DS 아이콘 세트(`find_icon`), 임의 이미지 금지.
- **브랜드 컬러는 토큰으로만.** 블루 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지.
- 새 Trost 화면 작업 전 이 카탈로그의 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트). 정확한 픽셀은 Zeplin(zpl.io/Dp775xl) 병행 확인.

## avoid

- 스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 Zeplin + 프로젝트 토큰이 SSOT(어긋나면 SSOT 우선).
- 콘텐츠 카드를 `ListItem` row 로 욱여넣기 — 썸네일+제목+메타 카드는 `Card`.
- 카테고리 아이콘에 임의 이미지/이모지 사용 — DS 아이콘 세트(`find_icon`).
- 블루 accent 를 UI 전반에 칠하기 — accent 는 로고·CTA·링크·배너 한정.
- Trost 전용이라며 컴포넌트에 `[data-project="trost"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙).
